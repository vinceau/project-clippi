import OBSWebSocket, { Scene } from "obs-websocket-js";

import { store } from "@/store";
import { notify } from "./utils";

import { BehaviorSubject, from, Subject } from "rxjs";
import { map, skip, switchMap, take } from "rxjs/operators";

export enum OBSRecordingAction {
  TOGGLE = "StartStopRecording",
  START = "StartRecording",
  STOP = "StopRecording",
  PAUSE = "PauseRecording",
  UNPAUSE = "ResumeRecording",
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

const ACTION_STATE_MAP = {
  [OBSRecordingAction.START]: "RecordingStarted",
  [OBSRecordingAction.PAUSE]: "RecordingPaused",
  [OBSRecordingAction.UNPAUSE]: "RecordingResumed",
  [OBSRecordingAction.STOP]: "RecordingStopped",
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
        switchMap(() => from(this.socket.send("GetSceneList"))),
        map((data) => data.scenes)
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
    await this.socket.connect({
      address: `${obsAddress}:${obsPort}`,
      password: obsPassword,
    });
    this._setupListeners();
    this.refreshScenesSource$.next();
    this.connectionSource$.next(OBSConnectionStatus.CONNECTED);
  }

  public disconnect() {
    this.socket.disconnect();
    this.connectionSource$.next(OBSConnectionStatus.DISCONNECTED);
  }

  public async setFilenameFormat(format: string): Promise<boolean> {
    await this.socket.send("SetFilenameFormatting", {
      "filename-formatting": format,
    });
    const confirmFormat = await this.getFilenameFormat();
    return confirmFormat === format;
  }

  public async getFilenameFormat(): Promise<string> {
    const response = await this.socket.send("GetFilenameFormatting");
    return response["filename-formatting"];
  }

  public async setScene(scene: string) {
    await this.socket.send("SetCurrentScene", {
      "scene-name": scene,
    });
  }

  public async saveReplayBuffer() {
    await this.socket.send("SaveReplayBuffer");
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
      this.socket.send(OBSRecordingAction.TOGGLE).catch(reject);
    });
  }

  private async _safelySetRecordingState(rec: OBSRecordingAction): Promise<void> {
    return new Promise((resolve, reject) => {
      // Attach the handler first
      this.socket.once(ACTION_STATE_MAP[rec], () => {
        resolve();
      });

      this.socket.send(rec).catch(reject);
    });
  }

  public async setSourceItemVisibility(sourceName: string, visible?: boolean) {
    const scenes = this.scenesSource$.value;
    for (const scene of scenes) {
      const items = scene.sources.map((source) => source.name);
      if (items.includes(sourceName)) {
        await this.socket.send("SetSceneItemProperties", {
          "scene-name": scene.name,
          item: sourceName,
          visible: Boolean(visible),
        } as any);
      }
    }
  }

  private _setupListeners() {
    this.socket.on("ConnectionClosed", () => {
      this.connectionSource$.next(OBSConnectionStatus.DISCONNECTED);
    });
    this.socket.on("RecordingStarted", () => {
      this.recordingSource$.next(OBSRecordingStatus.RECORDING);
    });
    this.socket.on("RecordingPaused", () => {
      this.recordingSource$.next(OBSRecordingStatus.PAUSED);
    });
    this.socket.on("RecordingResumed", () => {
      this.recordingSource$.next(OBSRecordingStatus.RECORDING);
    });
    this.socket.on("RecordingStopped", () => {
      this.recordingSource$.next(OBSRecordingStatus.STOPPED);
    });

    // Refresh the scenes on these events
    this.socket.on("ScenesChanged", () => {
      this.refreshScenesSource$.next();
    });
    this.socket.on("SceneItemAdded", () => {
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
