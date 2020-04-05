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

import fs from "fs-extra";
import path from "path";

import { remote } from "electron";

import { store } from "@/store";
import { DolphinQueueOptions, generateDolphinQueuePayload, DolphinLauncher, DolphinPlaybackPayload, DolphinPlaybackStatus, DolphinEntry, DolphinQueueFormat } from "@vinceau/slp-realtime";
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
        this.output.playbackStatus$.pipe(
            // Only process if recording is enabled and OBS is connected
            filter(() => this.recordingEnabled && obsConnection.isConnected()),
            // Process the values synchronously one at time
            concatMap((payload) => from(this._handleDolphinPlayback(payload))),
        ).subscribe();
        this.dolphinQuit$.pipe(
            // Only process if recording is enabled and OBS is connected
            filter(() => this.recordingEnabled && obsConnection.isConnected()),
            concatMap(() => from(this._stopRecording())),
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
                await this._stopRecording(true);
                break;
        }
    }

    private async _stopRecording(killDolphin?: boolean) {
        if (obsConnection.isRecording()) {
            await obsConnection.setRecordingState(OBSRecordingAction.STOP);
        }
        if (killDolphin && this.dolphin) {
            this.dolphin.kill();
        }
    }

}

const randomTempJSONFile = () => {
    const folder = remote.app.getPath("temp");
    const filename = `${Date.now()}_dolphin_queue.json`;
    return path.join(folder, filename);
}

const dolphinPath = getDolphinPath();
const opts = {
    // startBuffer: START_RECORDING_BUFFER,
    // endBuffer: END_RECORDING_BUFFER,
};
export const dolphinPlayer = new DolphinRecorder(dolphinPath, opts);

export const openComboInDolphin = (filePath: string, options?: Partial<DolphinPlayerOptions>) => {
    dolphinPlayer.loadJSON(filePath, options);
};

export const loadSlpFilesInDolphin = async (filenames: string[], options?: Partial<DolphinPlayerOptions>): Promise<void> => {
    const queue = filenames
        .filter(filename => path.extname(filename) === ".slp")
        .map(filename => ({path: filename}));
    console.log(queue);
    if (queue.length === 0) {
        return;
    }

    const payload = generateDolphinQueuePayload(queue);
    await loadPayloadIntoDolphin(payload, options);
}

const loadPayloadIntoDolphin = async (payload: string, options?: Partial<DolphinPlayerOptions>): Promise<void> => {
    const outputFile = randomTempJSONFile();
    await fs.writeFile(outputFile, payload);
    openComboInDolphin(outputFile, options);
}

export const loadQueueIntoDolphin = (options?: Partial<DolphinPlayerOptions>): void => {
    const { dolphinQueue, dolphinQueueOptions } = store.getState().tempContainer;
    const queue: DolphinQueueFormat = {
        ...dolphinQueueOptions,
        queue: dolphinQueue,
    };
    const payload = JSON.stringify(queue, undefined, 2);
    loadPayloadIntoDolphin(payload, options).catch(console.error);
};
