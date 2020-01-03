import OBSWebSocket from "obs-websocket-js";

import { dispatcher, store } from "@/store";

const obs = new OBSWebSocket();

obs.on("ConnectionOpened", () => {
    dispatcher.tempContainer.setOBSConnected(true);
    // Set the scenes on first connect
    updateScenes().catch(console.error);
});

obs.on("ConnectionClosed", () => {
    dispatcher.tempContainer.setOBSConnected(false);
});

const _connectToOBS = async (address: string, port: string, password: string): Promise<void> => {
    console.log(`connecting to: ${address}:${port}`);
    console.log(`with password: <${password}>`);
    await obs.connect({
        address: `${address}:${port}`,
        password: password ? password : undefined,
    });
};

export const connectToOBS = async (): Promise<void> => {
    const { obsPort, obsPassword } = store.getState().slippi;
    return _connectToOBS("192.168.1.118", obsPort, obsPassword);
};

export const updateScenes = async (): Promise<void> => {
    const data = await obs.send("GetSceneList");
    const sceneNames = data.scenes.map(scene => scene.name);
    console.log(`got the following scene names:`);
    console.log(sceneNames);
    dispatcher.tempContainer.setOBSScenes(sceneNames);
};

export const setScene = async (scene: string): Promise<void> => {
    await obs.send("SetCurrentScene", {
        "scene-name": scene,
    });
};
