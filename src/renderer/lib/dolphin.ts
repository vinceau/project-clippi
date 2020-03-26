import * as path from "path";
import {execFile, ChildProcess} from "child_process";
import { remote } from "electron";

import { dispatcher, store } from '@/store';
import {setRecordingState, OBSRecordingAction} from '@/lib/obs'

export interface DolphinState {
    currentFrame: number,
    lastGameFrame: number,
    startRecordingFrame: number,
    endRecordingFrame: number,
    recordingStarted: boolean,
};

const dolphinState: DolphinState = {
    currentFrame: -124,
    lastGameFrame: -124,
    startRecordingFrame: -124,
    endRecordingFrame: -124,
    recordingStarted: false,
}

const resetState = () => {
    dolphinState.currentFrame = -124;
    dolphinState.lastGameFrame = -124;
    dolphinState.startRecordingFrame = -124;
    dolphinState.endRecordingFrame = -124;
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
    }
};

const dolphinStdoutHandler = (line: string) => {
    const commands: string[] = line.split("\r\n").filter((value: string) => value);
    commands.forEach((command: string) => {
        const commandPair: string[] = command.split(" ");
        if ("[CURRENT_FRAME]" === commandPair[0]) {
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
                console.log("Pausing Recording");
                setRecordingState(OBSRecordingAction.PAUSE);
                resetState();
            }
        } else if ("[PLAYBACK_START_FRAME]" === commandPair[0]) {
            dolphinState.startRecordingFrame = parseInt(commandPair[1]);
            dolphinState.startRecordingFrame += 90;
            console.log(`StartFrame: ${dolphinState.startRecordingFrame}`);
        } else if ("[GAME_END_FRAME]" === commandPair[0]) {
            dolphinState.lastGameFrame = parseInt(commandPair[1]);
            console.log(`LastFrame: ${dolphinState.lastGameFrame}`);
        } else if ("[PLAYBACK_END_FRAME]" === commandPair[0]) {
            dolphinState.endRecordingFrame = parseInt(commandPair[1]);
            if (dolphinState.endRecordingFrame + 120 < dolphinState.lastGameFrame) {
                dolphinState.endRecordingFrame -= 60;
            } else {
                dolphinState.endRecordingFrame = dolphinState.lastGameFrame;
            }
            console.log(`EndFrame: ${dolphinState.endRecordingFrame}`);
        } else if ("[NO_GAME]" === commandPair[0]) {
            console.log("No games remaining in queue");
            console.log("Stopping Recording");

            setRecordingState(OBSRecordingAction.STOP);
            dolphinState.recordingStarted = false;
        } else if ("" === commandPair[0]) {
            // whatever
        } 
        else {
            console.log(`Unknown Command: ${line}`);
        }
    });
}