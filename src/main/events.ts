import { ipcMain, BrowserWindow } from 'electron';
import { authenticateTwitch } from './lib/twitch';
import { Socket, Transport, Event, InboundRequest } from 'electron-ipc-socket';
import {
    IpcMainRendererSocket,
    IpcMainBackgroundSocket,
    IpcRendererToBackgroundEvent,
    IpcBackgroundToRendererEvent,
    IpcTwitchRequestAuthToken,
    IpcRendererToBackgroundRequest
} from '../shared/ipcEvents';

let rendererSocket: Socket;
let backgroundSocket: Socket;

const setupRendererSocket = () => {
    // Forward background events to background socket
    rendererSocket.onEvent(IpcRendererToBackgroundEvent, (evt: Event) => {
        backgroundSocket.send(evt.name, evt.data);
    });

    rendererSocket.onRequest(IpcRendererToBackgroundRequest, async (req: InboundRequest) => {
        console.log('received request from renderer to main');
        console.log(`req.path: ${req.path}`);
        console.log(req.data);
        console.log(req);
        const x = await backgroundSocket.request(req.path, req.data);
        return x;
    });

    // Authenticate with Twitch and return the auth token
    rendererSocket.onRequest(IpcTwitchRequestAuthToken, async (req: InboundRequest) => {
        console.log(`received request to get twitch access token`);
        const scope = req.data.scope;
        const token = await authenticateTwitch(scope);
        console.log(`returning token: ${token} on socket`);
        return token;
    });
};

const setupBackgroundSocket = () => {
    // Forward renderer events to renderer socket
    backgroundSocket.onEvent(IpcBackgroundToRendererEvent, (evt: Event) => {
        rendererSocket.send(evt.name, evt.data);
    });
};

const setupSockets = (rendererWindow: BrowserWindow, backgroundWindow: BrowserWindow) => {
    // Enable two-way messages between main and renderer
    rendererSocket = new Socket(new Transport(ipcMain, rendererWindow as any));
    rendererSocket.open(IpcMainRendererSocket);

    // Enable two-way messages between main and background
    backgroundSocket = new Socket(new Transport(ipcMain, backgroundWindow as any));
    backgroundSocket.open(IpcMainBackgroundSocket);

    setupRendererSocket();
    setupBackgroundSocket();
};

export const setupEvents = (rendererWindow: BrowserWindow, backgroundWindow: BrowserWindow) => {
    setupSockets(rendererWindow, backgroundWindow);

    ipcMain.on('worker-message', (e: any, message: any) => console.log(message));
};
