import path from "path";
import os from "os";
import { execFile, ChildProcess } from "child_process";
import { remote } from "electron";

import { delay } from "@/lib/utils";
import { obsConnection, OBSRecordingAction } from "@/lib/obs";

const MAX_BUFFER = 2 ** 20;
const DELAY_AMOUNT_MS = 1000;

// FIXME: not too sure if these names are accurate...
const START_RECORDING_BUFFER = 90;
const END_RECORDING_BUFFER_LIMIT = 120;
const END_RECORDING_BUFFER_AMOUNT = 60;

const defaultDolphinPlayerOptions = {
    record: false,
};

type DolphinPlayerOptions = typeof defaultDolphinPlayerOptions;

const getDolphinPath = (): string => {
    const appData = remote.app.getPath("appData");
    const dolphinPath = path.join(appData, "Slippi Desktop App", "dolphin", "Dolphin.exe");
    return dolphinPath;
};

export class DolphinPlayer {
    private readonly dolphin: ChildProcess | null = null;
    private waitForGAME = false;
    private currentFrame = -124;
    private lastGameFrame = -124;
    private startRecordingFrame = -124;
    private endRecordingFrame = -124;

    public constructor(comboFilePath: string, options?: Partial<DolphinPlayerOptions>) {
        const opts: DolphinPlayerOptions = Object.assign({}, defaultDolphinPlayerOptions, options);
        const dolphinPath = getDolphinPath();
        console.log(dolphinPath);
        this.dolphin = execFile(dolphinPath, ["-i", comboFilePath], { maxBuffer: MAX_BUFFER });
        if (opts.record) {
            this._handleRecording(this.dolphin);
        }
    }

    private _handleRecording(dolphin: ChildProcess) {
        const obsConnected = obsConnection.isConnected();
        if (!obsConnected) {
            console.error("OBS is not connected. Not recording Dolphin.");
            return;
        }
        if (dolphin.stdout) {
            dolphin.stdout.on("data", (data: string) => {
                this._stdoutHandler(data);
            });
        }
        dolphin.on("close", async () => {
            await obsConnection.setRecordingState(OBSRecordingAction.STOP);
        });
    }

    private _stdoutHandler(data: string) {
        const lines = data.split(os.EOL).filter(line => Boolean(line));
        lines.forEach((command: string) => {
            const commandValuePair: string[] = command.split(" ");
            if (commandValuePair.length < 2) {
                return;
            }
            const commandName = commandValuePair[0];
            const commandValue = parseInt(commandValuePair[1], 10);
            this._handleSingleCommand(commandName, commandValue).catch(console.error);
        });
    }

    private async _handleSingleCommand(commandName: string, commandValue: number) {
        switch (commandName) {
            case "[CURRENT_FRAME]":
                this.currentFrame = commandValue;
                const recordingStarted = obsConnection.isRecording();
                if (this.currentFrame === this.startRecordingFrame) {
                    if (!recordingStarted) {
                        console.log("Start Recording");
                        await obsConnection.setRecordingState(OBSRecordingAction.START);
                    } else {
                        console.log("Resuming Recording");
                        await obsConnection.setRecordingState(OBSRecordingAction.UNPAUSE);
                    }

                } else if (this.currentFrame === this.endRecordingFrame) {
                    // Wait a bit if we are at the end of the game so we don't cut out too early
                    if (this.waitForGAME) {
                        await delay(DELAY_AMOUNT_MS);
                    }
                    console.log("Pausing Recording");
                    await obsConnection.setRecordingState(OBSRecordingAction.PAUSE);
                    this._resetState();
                }
                break;
            case "[PLAYBACK_START_FRAME]":
                this.startRecordingFrame = commandValue;
                this.startRecordingFrame += START_RECORDING_BUFFER;
                console.log(`StartFrame: ${this.startRecordingFrame}`);
                break;
            case "[PLAYBACK_END_FRAME]":
                this.endRecordingFrame = commandValue;
                if (this.endRecordingFrame + END_RECORDING_BUFFER_LIMIT < this.lastGameFrame) {
                    this.endRecordingFrame -= END_RECORDING_BUFFER_AMOUNT;
                } else {
                    this.waitForGAME = true;
                    this.endRecordingFrame = this.lastGameFrame;
                }
                console.log(`EndFrame: ${this.endRecordingFrame}`);
                break;
            case "[GAME_END_FRAME]":
                this.lastGameFrame = commandValue;
                console.log(`LastFrame: ${this.lastGameFrame}`);
                break;
            case "[NO_GAME]":
                console.log("No games remaining in queue");
                console.log("Stopping Recording");
                await obsConnection.setRecordingState(OBSRecordingAction.STOP);
                break;
            default:
                console.log(`Unknown command ${commandName} with value ${commandValue}`);
                break;
        }
    }

    private _resetState() {
        this.currentFrame = -124;
        this.lastGameFrame = -124;
        this.startRecordingFrame = -124;
        this.endRecordingFrame = -124;
        this.waitForGAME = false;
    }
}
