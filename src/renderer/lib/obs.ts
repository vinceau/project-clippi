import { OBSWebSocket } from "obs-websocket-js";
import { BehaviorSubject, from, Subject } from "rxjs";
import { map, skip, switchMap, take } from "rxjs/operators";

import { store } from "@/store";

import { notify } from "./utils";

interface SceneItem {
  name: string;
}

export interface Scene {
  name: string;
  sources: SceneItem[];
}

export enum OBSRecordingAction {
  TOGGLE = "ToggleRecord",
  START = "StartRecord",
  STOP = "StopRecord",
  PAUSE = "PauseRecord",
  UNPAUSE = "ResumeRecord",
}

export enum OBSRecordingStatus {
  RECORDING = "RECORDING",
  PAUSED = "PAUSED",
  STOPPED = "STOPPED",
}

export enum OBSConnectionStatus {
  CONNECTED = "CONNECTED",
  DISCONNECTED = "DISCONNECTED",
}

const RECORDING_OUTPUT_STATE_MAP = {
  [OBSRecordingAction.START]: "OBS_WEBSOCKET_OUTPUT_STARTED",
  [OBSRecordingAction.PAUSE]: "OBS_WEBSOCKET_OUTPUT_PAUSED",
  [OBSRecordingAction.UNPAUSE]: "OBS_WEBSOCKET_OUTPUT_RESUMED",
  [OBSRecordingAction.STOP]: "OBS_WEBSOCKET_OUTPUT_STOPPED",
};

class OBSConnection {
  private readonly socket: OBSWebSocket;

  private readonly refreshScenesSource$ = new Subject<void>();

  private readonly scenesSource$ = new BehaviorSubject<Scene[]>([]);

  private readonly connectionSource$ = new BehaviorSubject<OBSConnectionStatus>(OBSConnectionStatus.DISCONNECTED);

  private readonly recordingSource$ = new BehaviorSubject<OBSRecordingStatus>(OBSRecordingStatus.STOPPED);

  public connectionStatus$ = this.connectionSource$.asObservable();

  public recordingStatus$ = this.recordingSource$.asObservable();

  public scenes$ = this.scenesSource$.asObservable();

  public constructor() {
    this.socket = new OBSWebSocket();
    // Pipe the result of the refresh scenes to the scenes source
    this.refreshScenesSource$
      .pipe(
        switchMap(() => from(this.socket.call("GetSceneList"))),
        map((data) => data.scenes as unknown as Scene[])
      )
      .subscribe(this.scenesSource$);
  }

  public isConnected(): boolean {
    return this.connectionSource$.value === OBSConnectionStatus.CONNECTED;
  }

  public isRecording(): boolean {
    return this.recordingSource$.value !== OBSRecordingStatus.STOPPED;
  }

  public async connect(obsAddress: string, obsPort: string, obsPassword?: string) {
    await this.socket.connect(`ws://${obsAddress}:${obsPort}`, obsPassword);
    this._setupListeners();
    this.refreshScenesSource$.next();
    this.connectionSource$.next(OBSConnectionStatus.CONNECTED);
  }

  public disconnect() {
    this.socket.disconnect();
    this.connectionSource$.next(OBSConnectionStatus.DISCONNECTED);
  }

  public async setFilenameFormat(format: string): Promise<boolean> {
    await this.socket.call("SetProfileParameter", {
      parameterCategory: "Output",
      parameterName: "FilenameFormatting",
      parameterValue: format,
    });
    const confirmFormat = await this.getFilenameFormat();
    return confirmFormat === format;
  }

  public async getFilenameFormat(): Promise<string> {
    const response = await this.socket.call("GetProfileParameter", {
      parameterCategory: "Output",
      parameterName: "FilenameFormatting",
    });
    return response.parameterValue;
  }

  public async setScene(scene: string) {
    await this.socket.call("SetCurrentProgramScene", { sceneName: scene });
  }

  public async saveReplayBuffer() {
    await this.socket.call("SaveReplayBuffer");
  }

  public async setRecordingState(rec: OBSRecordingAction): Promise<void> {
    if (rec === OBSRecordingAction.TOGGLE) {
      return this._safelyToggleRecording();
    }

    return this._safelySetRecordingState(rec);
  }

  private async _safelyToggleRecording(): Promise<void> {
    return new Promise((resolve, reject) => {
      // Resolve when the recording status changed
      this.recordingStatus$
        .pipe(
          // This is going to resolve instantly, so we want to skip the first value
          skip(1),
          // Complete the observable once we get the next value
          take(1)
        )
        .subscribe(() => {
          resolve();
        });
      this.socket.call(OBSRecordingAction.TOGGLE).catch(reject);
    });
  }

  private async _safelySetRecordingState(rec: OBSRecordingAction): Promise<void> {
    return new Promise((resolve, reject) => {
      const expectedState = RECORDING_OUTPUT_STATE_MAP[rec as keyof typeof RECORDING_OUTPUT_STATE_MAP];
      const handler = (data: { outputState: string }) => {
        if (data.outputState === expectedState) {
          this.socket.off("RecordStateChanged", handler);
          resolve();
        }
      };
      this.socket.on("RecordStateChanged", handler);
      this.socket.call(rec).catch(reject);
    });
  }

  public async setSourceItemVisibility(sourceName: string, visible?: boolean) {
    const scenes = this.scenesSource$.value;
    for (const scene of scenes) {
      const items = scene.sources.map((source) => source.name);
      if (items.includes(sourceName)) {
        const result = await this.socket.call("GetSceneItemId", {
          sceneName: scene.name,
          sourceName,
        });
        await this.socket.call("SetSceneItemEnabled", {
          sceneName: scene.name,
          sceneItemId: result.sceneItemId,
          sceneItemEnabled: Boolean(visible),
        });
      }
    }
  }

  private _setupListeners() {
    this.socket.on("ConnectionClosed", () => {
      this.connectionSource$.next(OBSConnectionStatus.DISCONNECTED);
    });
    this.socket.on("RecordStateChanged", (data) => {
      switch (data.outputState) {
        case "OBS_WEBSOCKET_OUTPUT_STARTED":
        case "OBS_WEBSOCKET_OUTPUT_RESUMED":
          this.recordingSource$.next(OBSRecordingStatus.RECORDING);
          break;
        case "OBS_WEBSOCKET_OUTPUT_PAUSED":
          this.recordingSource$.next(OBSRecordingStatus.PAUSED);
          break;
        case "OBS_WEBSOCKET_OUTPUT_STOPPED":
          this.recordingSource$.next(OBSRecordingStatus.STOPPED);
          break;
      }
    });

    // Refresh the scenes on these events
    this.socket.on("SceneListChanged", () => {
      this.refreshScenesSource$.next();
    });
    this.socket.on("SceneItemCreated", () => {
      this.refreshScenesSource$.next();
    });
    this.socket.on("SceneItemRemoved", () => {
      this.refreshScenesSource$.next();
    });
  }
}

export const obsConnection = new OBSConnection();

export const connectToOBSAndNotify = (): void => {
  const { obsAddress, obsPort, obsPassword } = store.getState().slippi;
  obsConnection
    .connect(obsAddress, obsPort, obsPassword)
    .then(() => {
      notify("Successfully connected to OBS");
    })
    .catch((err) => {
      console.error(err);
      notify(`OBS connection failed: ${err.error}`);
    });
};

export const getAllSceneItems = (scenes: Scene[]): string[] => {
  const allItems: string[] = [];
  scenes.forEach((scene) => {
    const items = scene.sources.map((source) => source.name);
    allItems.push(...items);
  });
  const set = new Set(allItems);
  const uniqueNames = Array.from(set);
  uniqueNames.sort();
  return uniqueNames;
};

export const getAllScenes = (scenes: Scene[]): string[] => {
  const sceneNames = scenes.map((s) => s.name);
  sceneNames.sort();
  return sceneNames;
};
