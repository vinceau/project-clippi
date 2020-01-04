import OBSWebSocket from "obs-websocket-js";

import { dispatcher, store } from "@/store";
import { notify } from "./utils";

const obs = new OBSWebSocket();

obs.on("ConnectionOpened", () => {
    dispatcher.tempContainer.setOBSConnected(true);
    // Set the scenes on first connect
    updateScenes().catch(console.error);
    notify(`Successfully connected to OBS`);
});

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

const _connectToOBS = async (address: string, port: string, password?: string): Promise<void> => {
    console.log(`connecting to obs on: ${address}:${port}`);
    await obs.connect({
        address: `${address}:${port}`,
        password,
    });
};

export const connectToOBS = async (): Promise<void> => {
    const { obsAddress, obsPort, obsPassword } = store.getState().slippi;
    return _connectToOBS(obsAddress, obsPort, obsPassword);
};

export const connectToOBSAndNotify = (): void => {
    const { obsAddress, obsPort, obsPassword } = store.getState().slippi;
    _connectToOBS(obsAddress, obsPort, obsPassword).catch(err => {
        console.error(err);
        notify(`Could not connect to ${obsAddress}:${obsPort}`);
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

export const getAllSceneItems = (): string [] => {
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
