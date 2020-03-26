import * as path from "path";
import {execFile, ChildProcess} from "child_process";
import { remote } from "electron";

import { delay } from '@/lib/utils';
import { dispatcher, store } from '@/store';
import {setRecordingState, OBSRecordingAction} from '@/lib/obs'

export interface DolphinState {
    currentFrame: number,
    lastGameFrame: number,
    startRecordingFrame: number,
    endRecordingFrame: number,
    recordingStarted: boolean,
    waitForGAME: boolean,
};

const dolphinState: DolphinState = {
    currentFrame: -124,
    lastGameFrame: -124,
    startRecordingFrame: -124,
    endRecordingFrame: -124,
    recordingStarted: false,
    waitForGAME: false,
}

const resetState = () => {
    dolphinState.currentFrame = -124;
    dolphinState.lastGameFrame = -124;
    dolphinState.startRecordingFrame = -124;
    dolphinState.endRecordingFrame = -124;
    dolphinState.waitForGAME = false;
}

export const openComboInDolphin = (comboFilePath: string): void => {
    const appData = remote.app.getPath("appData");
    const dolphinPath = path.join(appData, "Slippi Desktop App", "dolphin", "Dolphin.exe");
    console.log(dolphinPath);
    store.getState().tempContainer.dolphin?.kill();
    const dolphin: ChildProcess = execFile(dolphinPath, ["-i", comboFilePath], {maxBuffer: 2**20});
    dispatcher.tempContainer.setDolphin(dolphin);
    if (store.getState().tempContainer.obsConnected && store.getState().tempContainer.recordReplays) {
        dolphin.stdout?.on('data', dolphinStdoutHandler);
        dolphin.on('close', () => setRecordingState(OBSRecordingAction.STOP));
    }
};

const dolphinStdoutHandler = (line: string) => {
    const commands: string[] = line.split("\r\n").filter((value: string) => value); // this only runs on windows so CRLF is fine for now
    commands.forEach(async (command: string) => {
        const commandPair: string[] = command.split(" ");
        switch(commandPair[0]) {
            case ("[CURRENT_FRAME]"):
                dolphinState.currentFrame = parseInt(commandPair[1]);
                if (dolphinState.currentFrame === dolphinState.startRecordingFrame) {
                    if (!dolphinState.recordingStarted) {
                        console.log("Start Recording");
                        setRecordingState(OBSRecordingAction.START)
                        dolphinState.recordingStarted = true;
                    } else {
                        console.log("Resuming Recording");
                        setRecordingState(OBSRecordingAction.UNPAUSE);
                    }
                    
                } else if (dolphinState.currentFrame === dolphinState.endRecordingFrame) {
                    if (dolphinState.waitForGAME) await delay(1000); // wait a second if we are the end of the game so we don't cut out too early
                    console.log("Pausing Recording");
                    setRecordingState(OBSRecordingAction.PAUSE);
                    resetState();
                }
                break;
            case ("[PLAYBACK_START_FRAME]"):
                dolphinState.startRecordingFrame = parseInt(commandPair[1]);
                dolphinState.startRecordingFrame += 90;
                console.log(`StartFrame: ${dolphinState.startRecordingFrame}`);
                break;
            case ("[GAME_END_FRAME]"):
                dolphinState.lastGameFrame = parseInt(commandPair[1]);
                console.log(`LastFrame: ${dolphinState.lastGameFrame}`);
                break;
            case ("[PLAYBACK_END_FRAME]"):
                dolphinState.endRecordingFrame = parseInt(commandPair[1]);
                if (dolphinState.endRecordingFrame + 120 < dolphinState.lastGameFrame) {
                    dolphinState.endRecordingFrame -= 60;
                } else {
                    dolphinState.waitForGAME = true;
                    dolphinState.endRecordingFrame = dolphinState.lastGameFrame;
                }
                console.log(`EndFrame: ${dolphinState.endRecordingFrame}`);
                break;
            case ("[NO_GAME]"):
                console.log("No games remaining in queue");
                console.log("Stopping Recording");
                setRecordingState(OBSRecordingAction.STOP);
                dolphinState.recordingStarted = false;
                break;
            case (""):
                break
            default:
                console.log(`Unknown Command: ${line}`);
                break;
        }
    });
}