import * as fs from 'fs';
import { ipcRenderer } from 'electron';
import { SlippiRealtime, ConnectionStatus } from 'slp-realtime';
import {
    IpcMainBackgroundSocket,
    IpcBackgroundToRendererEvent,
    IpcRendererToBackgroundEvent,
    IpcRendererToBackgroundRequest
} from '../shared/ipcEvents';
import { Socket, Event, InboundRequest } from 'electron-ipc-socket';
import { SlippiConnectEvent, SlippiConnectEventArgs } from '../shared/slippiEvents';

const r = new SlippiRealtime({
    writeSlpFiles: false,
    writeSlpFileLocation: '.'
});

const handleSlippiConnection = (arg: SlippiConnectEventArgs) => {
    const address = arg.address ? arg.address : '0.0.0.0';
    const port = arg.port ? arg.port : 1667;
    r.start(address, port)
        .then(() => {
            console.log('connected');
        })
        .catch(err => {
            console.error(err);
        });
    // console.log(`slippi status: ${status}`);
};

const handleEvent = (eventName: string, payload?: any) => {
    switch (eventName) {
        case SlippiConnectEvent:
            handleSlippiConnection(payload);
            break;
        case 'list-files':
            listFiles(payload);
            break;
    }
};

const log = (message: any) => {
    ipcRenderer.send('worker-message', message);
};

const listFiles = (filePath: string) => {
    fs.readdir(filePath, (err, files) => {
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
};

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

const socket = new Socket(ipcRenderer);
socket.open(IpcMainBackgroundSocket);
socket.send(IpcBackgroundToRendererEvent, {
    hello: 'how are you',
    foo: 'bar'
});

socket.onEvent(IpcRendererToBackgroundEvent, (evt: Event) => {
    // console.log("received message from renderer:");
    // console.log(evt.data);
    if (evt.data.name) {
        handleEvent(evt.data.name, evt.data.payload);
    }
});

const getSlippiConnectionStatus = async (): Promise<ConnectionStatus> => {
    console.log(`inside status getting function`);
    const status = r.getConnectionStatus();
    console.log(`status is: ${status}`);
    return Promise.resolve(status);
};

socket.onRequest(IpcRendererToBackgroundRequest, async (req: InboundRequest) => {
    console.log(`received request from main thread to background`);
    console.log(req);
    console.log(req.path);
    console.log(req.data);
    console.log(req.data.name);
    if (!req.data.name) {
        return;
    }
    switch (req.data.name) {
        case 'get-slippi-connection-status':
            console.log(`getting slippi status`);
            const status = await getSlippiConnectionStatus();
            console.log(`returning slippi connection: ${status}`);
            return status;
    }
});
