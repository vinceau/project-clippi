import OBSWebSocket, { Scene } from "obs-websocket-js";

import { store } from "@/store";
import { notify } from "./utils";

export enum OBSRecordingAction {
    TOGGLE = "StartStopRecording",
    START = "StartRecording",
    STOP = "StopRecording",
    PAUSE = "PauseRecording",
    UNPAUSE = "ResumeRecording",
}

class OBSConnection {
    private readonly socket: OBSWebSocket;
    private _isConnected = false;
    private _isRecording = false;
    private scenes = new Array<Scene>();

    public constructor() {
        this.socket = new OBSWebSocket();
    }

    public isConnected(): boolean {
        return this._isConnected;
    }

    public isRecording(): boolean {
        return this._isRecording;
    }

    public async connect(obsAddress: string, obsPort: string, obsPassword?: string) {
        await this.socket.connect({
            address: `${obsAddress}:${obsPort}`,
            password: obsPassword,
        });
        this._setupListeners();
        await this._updateScenes();
        this._isConnected = true;
    }

    public disconnect() {
        this.socket.disconnect();
        this._isConnected = false;
    }

    public async setScene(scene: string) {
        await this.socket.send("SetCurrentScene", {
            "scene-name": scene,
        });
    }

    public async saveReplayBuffer() {
        await this.socket.send("SaveReplayBuffer");
    }

    public async setRecordingState(rec: OBSRecordingAction) {
        await this.socket.send(rec);
    }

    public async setSourceItemVisibility(sourceName: string, visible?: boolean) {
        for (const scene of this.scenes) {
            const items = scene.sources.map(source => source.name);
            if (items.includes(sourceName)) {
                await this.socket.send("SetSceneItemProperties", {
                    "scene-name": scene.name,
                    "item": sourceName,
                    "visible": Boolean(visible),
                } as any);
            }
        }
    }

    public getAllSceneItems(): string[] {
        const allItems: string[] = [];
        this.scenes.forEach(scene => {
            const items = scene.sources.map(source => source.name);
            allItems.push(...items);
        });
        const set = new Set(allItems);
        const uniqueNames = Array.from(set);
        uniqueNames.sort();
        return uniqueNames;
    }

    public getAllScenes(): string[] {
        const sceneNames = this.scenes.map(s => s.name);
        sceneNames.sort();
        return sceneNames;
    }

    private _setupListeners() {
        this.socket.on("ConnectionClosed", () => {
            this._isConnected = false;
        });
        this.socket.on("ScenesChanged", () => {
            this._updateScenes().catch(console.error);
        });
        this.socket.on("SceneItemAdded", () => {
            this._updateScenes().catch(console.error);
        });
        this.socket.on("SceneItemRemoved", () => {
            this._updateScenes().catch(console.error);
        });
        this.socket.on("RecordingStarted", () => {
            this._isRecording = true;
        });
        this.socket.on("RecordingStopped", () => {
            this._isRecording = false;
        });
    }

    private async _updateScenes() {
        const data = await this.socket.send("GetSceneList");
        this.scenes = data.scenes;
    }
}

export const obsConnection = new OBSConnection();

export const connectToOBSAndNotify = (): void => {
    const { obsAddress, obsPort, obsPassword } = store.getState().slippi;
    obsConnection.connect(obsAddress, obsPort, obsPassword).then(() => {
        notify("Successfully connected to OBS");
    }).catch(err => {
        console.error(err);
        notify(`OBS connection failed: ${err.error}`);
    });
};
