/**
 * We can tap into the Dolphin state by reading the log printed to stdout.
 * This will let us automate the recording.
 *
 * Dolphin will emit the following messages in following order:
 * [PLAYBACK_START_FRAME]: the frame playback will commence (defaults to -123 if omitted)
 * [GAME_END_FRAME]: the last frame of the game
 * [PLAYBACK_END_FRAME] this frame playback will end at (defaults to MAX_INT if omitted)
 * [CURRENT_FRAME] the current frame being played back
 * [NO_GAME] no more files in the queue
 */

import path from "path";

import { remote } from "electron";

import { DolphinLauncher, DolphinPlaybackPayload, DolphinPlaybackStatus } from "@vinceau/slp-realtime";
import { obsConnection, OBSRecordingAction } from "@/lib/obs";
import { delay } from "@/lib/utils";
import { filter, concatMap } from "rxjs/operators";
import { from } from "rxjs";

const DELAY_AMOUNT_MS = 1000;

const START_RECORDING_BUFFER = 90;
const END_RECORDING_BUFFER = 60;

const defaultDolphinPlayerOptions = {
    record: false,
    pauseBetweenEntries: true,
};

export type DolphinPlayerOptions = typeof defaultDolphinPlayerOptions;

const getDolphinPath = (): string => {
    const appData = remote.app.getPath("appData");
    const dolphinPath = path.join(appData, "Slippi Desktop App", "dolphin", "Dolphin.exe");
    return dolphinPath;
};

export class DolphinPlayer {
    private dolphinLauncher: DolphinLauncher;
    private recordingEnabled = false;
    private startAction = OBSRecordingAction.START;
    private endAction = OBSRecordingAction.STOP;

    public constructor() {
        const dolphinPath = getDolphinPath();
        this.dolphinLauncher = new DolphinLauncher(dolphinPath, {
            startBuffer: START_RECORDING_BUFFER,
            endBuffer: END_RECORDING_BUFFER,
        });
        this.dolphinLauncher.playbackStatus$.pipe(
            // Only process if recording is enabled and OBS is connected
            filter(() => this.recordingEnabled && obsConnection.isConnected()),
            // Process the values synchronously one at time
            concatMap((payload) => from(this._handleDolphinPlayback(payload))),
        ).subscribe();
    }

    public loadJSON(comboFilePath: string, options?: Partial<DolphinPlayerOptions>) {
        const opts: DolphinPlayerOptions = Object.assign({}, defaultDolphinPlayerOptions, options);
        this.recordingEnabled = opts.record;
        if (this.recordingEnabled) {
            this.startAction = opts.pauseBetweenEntries ? OBSRecordingAction.UNPAUSE : OBSRecordingAction.START;
            this.endAction = opts.pauseBetweenEntries ? OBSRecordingAction.PAUSE : OBSRecordingAction.STOP;
        }
        this.dolphinLauncher.loadJSON(comboFilePath);
    }

    private async _handleDolphinPlayback(payload: DolphinPlaybackPayload): Promise<void> {
        console.log(payload);
        switch (payload.status) {
            case DolphinPlaybackStatus.PLAYBACK_START:
                const action = obsConnection.isRecording() ? this.startAction : OBSRecordingAction.START;
                await obsConnection.setRecordingState(action);
                break;
            case DolphinPlaybackStatus.PLAYBACK_END:
                if (payload.data && payload.data.gameEnded) {
                    await delay(DELAY_AMOUNT_MS);
                }
                await obsConnection.setRecordingState(this.endAction);
                break;
            case DolphinPlaybackStatus.QUEUE_EMPTY:
            case DolphinPlaybackStatus.DOLPHIN_QUIT:
                console.log("telling obs to stop recording");
                await obsConnection.setRecordingState(OBSRecordingAction.STOP);
                break;
        }
    }

}

const dolphinPlayer = new DolphinPlayer();

export const openComboInDolphin = (filePath: string, options?: Partial<DolphinPlayerOptions>) => {
    dolphinPlayer.loadJSON(filePath, options);
};
