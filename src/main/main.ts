import { app, BrowserWindow, ipcMain } from 'electron';
import { Socket, Transport, Event, InboundRequest } from 'electron-ipc-socket';
import * as path from 'path';
import * as url from 'url';

import './events';
import {
    IpcMainRendererSocket,
    IpcMainBackgroundSocket,
    IpcRendererToBackgroundEvent,
    IpcBackgroundToRendererEvent
} from '../shared/ipcEvents';

let win: BrowserWindow | null;
let workerWindow: BrowserWindow | null;

const installExtensions = async () => {
    const installer = require('electron-devtools-installer');
    const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
    const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

    return Promise.all(
        extensions.map(name => installer.default(installer[name], forceDownload))
    ).catch(console.log);
};

const createWindow = async () => {
    if (process.env.NODE_ENV !== 'production') {
        await installExtensions();
    }

    // Main renderer window
    win = new BrowserWindow({ width: 800, height: 600 });
    const rendererSocket = new Socket(new Transport(ipcMain, win as any));

    // Hidden worker window
    workerWindow = new BrowserWindow({
        show: false,
        webPreferences: { nodeIntegration: true }
    });
    const backgroundSocket = new Socket(new Transport(ipcMain, workerWindow as any));

    rendererSocket.open(IpcMainRendererSocket);
    rendererSocket.onEvent(IpcRendererToBackgroundEvent, (evt: Event) => {
        // console.log('Renderer process is ready. Event:');
        // console.log(evt.name);
        // console.log(evt.data);
        backgroundSocket.send(evt.name, evt.data);
    });

    backgroundSocket.open(IpcMainBackgroundSocket);
    backgroundSocket.onEvent(IpcBackgroundToRendererEvent, (evt: Event) => {
        // console.log('Background process is ready. Event:');
        // console.log(evt.name);
        // console.log(evt.data);
        rendererSocket.send(evt.name, evt.data);
    });

    workerWindow.loadURL(
        url.format({
            pathname: path.join(__dirname, 'background.html'),
            protocol: 'file:',
            slashes: true
        })
    );

    if (process.env.NODE_ENV !== 'production') {
        process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = '1';
        win.loadURL(`http://localhost:2003`);
    } else {
        win.loadURL(
            url.format({
                pathname: path.join(__dirname, 'index.html'),
                protocol: 'file:',
                slashes: true
            })
        );
    }

    if (process.env.NODE_ENV !== 'production') {
        // Open DevTools, see https://github.com/electron/electron/issues/12438 for why we wait for dom-ready
        win.webContents.once('dom-ready', () => {
            win!.webContents.openDevTools();
        });
        workerWindow.webContents.once('dom-ready', () => {
            workerWindow!.webContents.openDevTools();
        });
    }

    win.on('closed', () => {
        win = null;
        workerWindow = null;
    });
};

app.on('ready', createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (win === null) {
        createWindow();
    }
});
