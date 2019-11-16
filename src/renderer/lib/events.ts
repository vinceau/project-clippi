import { ipcRenderer } from 'electron';
import { IpcTwitchTokenReceive, IpcTwitchTokenReceiveArgs } from '../../shared/ipcEvents';

// Async message handler
ipcRenderer.on(IpcTwitchTokenReceive, (event: any, arg: IpcTwitchTokenReceiveArgs) => {
    console.log(`received access token from main: ${arg.token}`);
});
