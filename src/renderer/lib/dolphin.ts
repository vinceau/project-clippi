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

export class DolphinRecorder extends DolphinLauncher {
    private recordingEnabled = false;
    private startAction = OBSRecordingAction.START;
    private endAction = OBSRecordingAction.STOP;

    public constructor(dolphinPath: string, options?: any) {
        super(dolphinPath, options);
        this.playbackStatus$.pipe(
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
        super.loadJSON(comboFilePath);
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
                // Stop recording and quit Dolphin
                await this._stopRecording();
                if (this.dolphin) {
                    this.dolphin.kill();
                }
                break;
            case DolphinPlaybackStatus.DOLPHIN_QUIT:
                // Stop recording if Dolphin was terminated
                await this._stopRecording();
                break;
        }
    }

    private async _stopRecording() {
        if (obsConnection.isRecording()) {
            await obsConnection.setRecordingState(OBSRecordingAction.STOP);
        }
    }

}

const dolphinPath = getDolphinPath();
const options = {
    startBuffer: START_RECORDING_BUFFER,
    endBuffer: END_RECORDING_BUFFER,
};
const dolphinPlayer = new DolphinRecorder(dolphinPath, options);

export const openComboInDolphin = (filePath: string, options?: Partial<DolphinPlayerOptions>) => {
    dolphinPlayer.loadJSON(filePath, options);
};
