import * as fs from 'fs';
import { ipcRenderer } from 'electron';
import { SlippiRealtime } from 'slp-realtime';

const log = (message: any) => {
    ipcRenderer.send('worker-message', message);
};

fs.readdir('./', (err, files) => {
    // handling error
    if (err) {
        return log(`Unable to scan directory: ${err}`);
    }
    // listing all files using forEach
    files.forEach(file => {
        // Do whatever you want to do with the file
        log(file);
    });
});

const r = new SlippiRealtime({
    address: '0.0.0.0',
    port: 1667,
    writeSlpFiles: false,
    writeSlpFileLocation: '.'
});

r.on('gameStart', () => {
    console.log('game started');
});
r.on('gameEnd', () => {
    console.log('game ended');
});

r.on('spawn', () => {
    console.log('spawn');
});
r.on('death', () => {
    console.log('death');
});
r.on('comboStart', () => {
    console.log('comboStart');
});
r.on('comboExtend', () => {
    console.log('comboExtend');
});
r.on('comboEnd', () => {
    console.log('comboEnd');
});

r.start();
