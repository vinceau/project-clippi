import fs from "fs";
import { Writable } from "stream";

import { ComboFilter, SlippiLivestream, SlippiRealtime, SlpStream, DolphinComboQueue } from "@vinceau/slp-realtime";
import { ComboType } from "slp-parser-js";

import { notify } from "./utils";

export const comboFilter = new ComboFilter();
comboFilter.updateSettings({excludeCPUs: false, comboMustKill: false, minComboPercent: 40});

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

r.events.on("gameStart", () => {
    console.log('game started');
});
r.events.on('gameEnd', () => {
    console.log('game ended');
});

r.events.on('spawn', () => {
    console.log('spawn');
});
r.events.on('death', () => {
    console.log('death');
});
r.events.on('comboStart', () => {
    console.log('comboStart');
});
r.events.on('comboExtend', () => {
    console.log('comboExtend');
});
r.events.on('comboEnd', (c, s) => {
    if (comboFilter.isCombo(c, s)) {
        console.log('fully sick combo was detected');
        notify('fully sick combo', 'amaze');
    } else {
        console.log('the combo ended');
    }
});

/*
const getSlippiConnectionStatus = async (): Promise<ConnectionStatus> => {
    console.log(`inside status getting function`);
    const status = r.connection.getStatus();
    console.log(`status is: ${status}`);
    return Promise.resolve(status);
};
*/

export const generateCombos = async (filenames: string[], outputFile: string, callback?: (i: number, f: string, numCombos: number) => void): Promise<number> => {
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
