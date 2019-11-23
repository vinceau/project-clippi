import { ipcRenderer } from 'electron';
import {
    IpcTwitchTokenReceive,
    IpcTwitchTokenReceiveArgs,
    IpcBackgroundToRendererEvent,
    IpcMainRendererSocket,
    IpcRendererToBackgroundEvent
} from '../../shared/ipcEvents';
import { Socket, Event } from 'electron-ipc-socket';
import { TwitchSetToken } from '../actions/twitchActions';
import { store } from '../store';
import { SlippiConnectEvent, SlippiConnectEventArgs } from '../../shared/slippiEvents';

// Async message handler
ipcRenderer.on(IpcTwitchTokenReceive, (event: any, arg: IpcTwitchTokenReceiveArgs) => {
    console.log(`received access token from main: ${arg.token}`);
    store.dispatch({ type: TwitchSetToken, accessToken: arg.token });
});

const socket = new Socket(ipcRenderer);
socket.open(IpcMainRendererSocket);

export const connectToSlippi = (port: number) => {
    const payload: SlippiConnectEventArgs = {
        port
    };
    socket.send(IpcRendererToBackgroundEvent, {
        name: SlippiConnectEvent,
        payload
    });
};

export const listPathFiles = (path: string) => {
    socket.send(IpcRendererToBackgroundEvent, {
        name: 'list-files',
        payload: path
    });
};

socket.onEvent(IpcBackgroundToRendererEvent, (evt: Event) => {
    console.log('received message from background:');
    console.log(evt);
});
