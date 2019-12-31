import fs from "fs";
import { Writable } from "stream";

import { ComboFilter, ComboType, DolphinComboQueue, SlippiLivestream, SlippiRealtime, SlpStream } from "@vinceau/slp-realtime";

import { notify } from "./utils";

import { eventActionManager } from "./actions";

export enum ActionEvent {
    GAME_START = "game-start",
    GAME_END = "game-end",
    PLAYER_SPAWN = "player-spawn",
    PLAYER_DIED = "player-died",
    COMBO_OCCURRED = "combo-occurred",
}

const errorHandler = (err: any) => {
    console.error(err);
    notify("Error occurred", JSON.stringify(err));
};

export const comboFilter = new ComboFilter();
comboFilter.updateSettings({ excludeCPUs: false, comboMustKill: false, minComboPercent: 40 });

const r = new SlippiLivestream();
console.log(r);
console.log(r.connection);

export const connectToSlippi = async (port?: number): Promise<boolean> => {
    console.log(`attempt to connect to slippi on port: ${port}`);
    const address = "0.0.0.0";
    const slpPort = port ? port : 1667;
    console.log(r.connection);
    return r.start(address, slpPort);
};

r.events.on("gameStart", (gameStart) => {
    eventActionManager.emitEvent(ActionEvent.GAME_START, gameStart).catch(errorHandler);
});
r.events.on("gameEnd", (gameEnd) => {
    eventActionManager.emitEvent(ActionEvent.GAME_END, gameEnd).catch(errorHandler);
});

r.events.on("spawn", (playerIndex, stock, settings) => {
    eventActionManager.emitEvent(ActionEvent.PLAYER_SPAWN, playerIndex, stock, settings).catch(errorHandler);
});
r.events.on("death", (playerIndex, stock, settings) => {
    eventActionManager.emitEvent(ActionEvent.PLAYER_DIED, playerIndex, stock, settings).catch(errorHandler);
});

r.events.on("comboEnd", (combo, settings) => {
    if (!comboFilter.isCombo(combo, settings)) {
        return;
    }
    eventActionManager.emitEvent(ActionEvent.COMBO_OCCURRED, combo, settings).catch(errorHandler);
});

/*
const getSlippiConnectionStatus = async (): Promise<ConnectionStatus> => {
    console.log(`inside status getting function`);
    const status = r.connection.getStatus();
    console.log(`status is: ${status}`);
    return Promise.resolve(status);
};
*/

const deleteFile = async (filepath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
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
    const realtime = new SlippiRealtime(slpStream);

    realtime.on("comboEnd", (c, s) => {
        if (comboFilter.isCombo(c, s)) {
            combosList.push(c);
        }
    });

    await pipeFileContents(filename, slpStream);

    console.log(`found ${combosList.length} combos in ${filename}`);
    return combosList;
};

const pipeFileContents = async (filename: string, destination: Writable): Promise<void> => {
    return new Promise((resolve): void => {
        const readStream = fs.createReadStream(filename);
        readStream.on("open", () => {
            readStream.pipe(destination);
        });
        readStream.on("close", () => {
            resolve();
        });
    });
};
