import fg from "fast-glob";

import { ComboFilter, ComboType, ConnectionStatus, DolphinComboQueue, SlpFolderStream, SlpLiveStream, SlpRealTime, SlpStream, GameStartType } from "@vinceau/slp-realtime";
import { Context, Action } from "@vinceau/event-actions";

import { dispatcher } from "@/store";
import { deleteFile, pipeFileContents } from "common/utils";
import { eventActionManager } from "../actions";
import { isDevelopment, notify } from "./utils";
import { generateGameStartContext, exampleGameEnd, exampleGameStart, generateGameEndContext } from "./context";

export enum ActionEvent {
    GAME_START = "game-start",
    GAME_END = "game-end",
    PLAYER_SPAWN = "player-spawn",
    PLAYER_DIED = "player-died",
    COMBO_OCCURRED = "combo-occurred",
    TEST_EVENT = "test-event",
}

const errorHandler = (err: any) => {
    console.error(err);
    notify("Error occurred!");
};

export const comboFilter = new ComboFilter();
if (isDevelopment) {
    comboFilter.updateSettings({ excludeCPUs: false, comboMustKill: false, minComboPercent: 40 });
}

const slippiRealtime = new SlpRealTime();

slippiRealtime.on("gameStart", (gameStart: GameStartType) => {
    const ctx = generateGameStartContext(gameStart);
    eventActionManager.emitEvent(ActionEvent.GAME_START, generateContext(ctx)).catch(errorHandler);
});
slippiRealtime.on("gameEnd", (gameEnd) => {
    const ctx = generateGameEndContext(gameEnd);
    eventActionManager.emitEvent(ActionEvent.GAME_END, generateContext(ctx)).catch(errorHandler);
});

slippiRealtime.on("spawn", (playerIndex, stock, settings) => {
    eventActionManager.emitEvent(ActionEvent.PLAYER_SPAWN, generateContext()).catch(errorHandler);
});
slippiRealtime.on("death", (playerIndex, stock, settings) => {
    eventActionManager.emitEvent(ActionEvent.PLAYER_DIED, generateContext()).catch(errorHandler);
});

slippiRealtime.on("comboEnd", (combo, settings) => {
    if (!comboFilter.isCombo(combo, settings)) {
        return;
    }
    eventActionManager.emitEvent(ActionEvent.COMBO_OCCURRED, generateContext()).catch(errorHandler);
});

export const testRunActions = (event: string, actions: Action[]): void => {
    console.log(`testing ${event} event`);
    let ctx: Context = {};
    switch (event) {
        case ActionEvent.GAME_START:
            ctx = generateGameStartContext(exampleGameStart);
            break;
        case ActionEvent.GAME_END:
            ctx = generateGameEndContext(exampleGameEnd);
            break;
    }
    eventActionManager.execute(actions, generateContext(ctx)).catch(console.error);
};

const generateContext = (context?: Context): Context => {
    const d = new Date();
    const newContext = {
        date: d.toLocaleDateString(),
        time: d.toLocaleTimeString(),
    };
    return Object.assign(newContext, context);
};

export const generateCombos = async (
    filenames: string[],
    outputFile: string,
    deleteZeroComboFiles?: boolean,
    callback?: (i: number, f: string, numCombos: number) => void,
): Promise<number> => {
    const queue = new DolphinComboQueue();
    for (const [i, f] of filenames.entries()) {
        console.log(`proceesing file: ${f}`);
        const combos = await findCombos(f);
        combos.forEach(c => {
            queue.addCombo(f, c);
        });
        if (callback) {
            callback(i, f, combos.length);
        }

        // Delete the file if no combos were found
        if (deleteZeroComboFiles && combos.length === 0) {
            console.log(`${combos.length} combos found. Deleting: ${f}`);
            await deleteFile(f);
        }
    }
    console.log(`writing out combos to: ${outputFile}`);
    const numCombos = await queue.writeFile(outputFile);
    return numCombos;
};

export const findCombos = async (filename: string): Promise<ComboType[]> => {
    console.log(`finding combos in: ${filename}`);
    const combosList = new Array<ComboType>();
    const slpStream = new SlpStream({ singleGameMode: true });
    const realtime = new SlpRealTime();
    realtime.setStream(slpStream);

    realtime.on("comboEnd", (c, s) => {
        if (comboFilter.isCombo(c, s)) {
            combosList.push(c);
        }
    });

    await pipeFileContents(filename, slpStream);

    console.log(`found ${combosList.length} combos in ${filename}`);
    return combosList;
};

export const fastFindAndWriteCombos = async (
    filesPath: string,
    includeSubFolders: boolean,
    outputFile: string,
    deleteZeroComboFiles?: boolean,
    callback?: (i: number, total: number, filename: string, numCombos: number) => void,
): Promise<number> => {
    console.log("inside find and write");
    const patterns = ["**/*.slp"];
    const options = {
        absolute: true,
        cwd: filesPath,
        onlyFiles: true,
        deep: includeSubFolders ? undefined : 1,
    };

    const queue = new DolphinComboQueue();

    // const stream = fg.stream(patterns, options);
    const entries = await fg(patterns, options);

    for (const [i, filename] of (entries.entries())) {
        const combos = await findCombos(filename);
        combos.forEach(c => {
            queue.addCombo(filename, c);
        });
        // Delete the file if no combos were found
        if (deleteZeroComboFiles && combos.length === 0) {
            console.log(`${combos.length} combos found. Deleting: ${filename}`);
            await deleteFile(filename);
        }
        if (callback) {
            callback(i, entries.length, filename, combos.length);
        }
    }

    console.log(`writing stuff out`);
    const numCombos = await queue.writeFile(outputFile);
    console.log(`wrote ${numCombos} out to ${outputFile}`);
    return numCombos;
};

class SlpStreamManager {
    private stream: SlpLiveStream | SlpFolderStream | null = null;

    public async connectToSlippi(port?: number): Promise<void> {
        console.log(`attempt to connect to slippi on port: ${port}`);
        const address = "0.0.0.0";
        const slpPort = port ? port : 1667;
        const stream = new SlpLiveStream();
        stream.connection.on("statusChange", (status) => {
            dispatcher.tempContainer.setSlippiConnectionStatus(status);
            if (status === ConnectionStatus.CONNECTED) {
                notify("Connected to Slippi relay");
            } else if (status === ConnectionStatus.DISCONNECTED) {
                notify("Disconnected from Slippi relay");
            }
        });
        console.log(stream.connection);
        await stream.start(address, slpPort);
        slippiRealtime.setStream(stream);
        this.stream = stream;
    }

    public disconnectFromSlippi(): void {
        if (this.stream && "connection" in this.stream) {
            this.stream.connection.disconnect();
        }
        this.stream = null;
    }

    public async monitorSlpFolder(filepath: string): Promise<void> {
        const stream = new SlpFolderStream();
        await stream.start(filepath);
        slippiRealtime.setStream(stream);
        this.stream = stream;
        dispatcher.tempContainer.setSlpFolderStream(filepath);
    }

    public stopMonitoringSlpFolder(): void {
        if (this.stream && "stop" in this.stream) {
            this.stream.stop();
        }
        this.stream = null;
        dispatcher.tempContainer.clearSlpFolderStream();
    }
}

export const streamManager = new SlpStreamManager();
