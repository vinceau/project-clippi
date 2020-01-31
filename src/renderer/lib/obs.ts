import OBSWebSocket from "obs-websocket-js";

import { dispatcher, store } from "@/store";
import { notify } from "./utils";

export enum OBSRecordingAction {
    TOGGLE = "StartStopRecording",
    START = "StartRecording",
    STOP = "StopRecording",
    // PAUSE = "PauseRecording",
    // UNPAUSE = "ResumeRecording",
}

const obs = new OBSWebSocket();

const setupListeners = () => {
    obs.on("ConnectionClosed", () => {
        dispatcher.tempContainer.setOBSConnected(false);
    });

    obs.on("ScenesChanged", () => {
        updateScenes().catch(console.error);
    });

    obs.on("SceneItemAdded", () => {
        updateScenes().catch(console.error);
    });

    obs.on("SceneItemRemoved", () => {
        updateScenes().catch(console.error);
    });
};

export const connectToOBS = async (): Promise<void> => {
    const { obsAddress, obsPort, obsPassword } = store.getState().slippi;
    await obs.connect({
        address: `${obsAddress}:${obsPort}`,
        password: obsPassword,
    });
    setupListeners();
    await updateScenes();
    dispatcher.tempContainer.setOBSConnected(true);
};

export const connectToOBSAndNotify = (): void => {
    connectToOBS().then(() => {
        notify("Successfully connected to OBS");
    }).catch(err => {
        console.error(err);
        notify(`OBS connection failed: ${err.error}`);
    });
};

export const disconnectFromOBS = (): void => {
    obs.disconnect();
};

export const updateScenes = async (): Promise<void> => {
    const data = await obs.send("GetSceneList");
    dispatcher.tempContainer.setOBSSceneItems(data.scenes);
};

export const setScene = async (scene: string): Promise<void> => {
    await obs.send("SetCurrentScene", {
        "scene-name": scene,
    });
};

export const saveReplayBuffer = async (): Promise<void> => {
    await obs.send("SaveReplayBuffer");
};

export const setRecordingState = async (rec: OBSRecordingAction): Promise<void> => {
    await obs.send(rec);
};

export const setSourceItemVisibility = async (sourceName: string, visible?: boolean): Promise<void> => {
    const scenes = store.getState().tempContainer.obsScenes;
    for (const scene of scenes) {
        const items = scene.sources.map(source => source.name);
        if (items.includes(sourceName)) {
            await obs.send("SetSceneItemProperties", {
                "scene-name": scene.name,
                "item": sourceName,
                "visible": Boolean(visible),
            } as any);
        }
    }
};

export const getAllSceneItems = (): string[] => {
    const scenes = store.getState().tempContainer.obsScenes;
    const allItems: string[] = [];
    scenes.forEach(scene => {
        const items = scene.sources.map(source => source.name);
        allItems.push(...items);
    });
    const set = new Set(allItems);
    const uniqueNames = Array.from(set);
    uniqueNames.sort();
    return uniqueNames;
};

export const getAllScenes = (): string[] => {
    const scenes = store.getState().tempContainer.obsScenes;
    const sceneNames = scenes.map(s => s.name);
    sceneNames.sort();
    return sceneNames;
};
