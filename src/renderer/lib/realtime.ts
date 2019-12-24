import { SlippiLivestream, ComboFilter } from "@vinceau/slp-realtime";
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
