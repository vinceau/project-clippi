import { ipcMain } from 'electron';
import { authenticateTwitch } from './lib/twitch';
import {
    IpcTwitchAuthenticateArgs,
    IpcTwitchAuthenticate,
    IpcTwitchTokenReceive,
    IpcForwardMessage,
    IpcForwardMessageArgs
} from '../shared/ipcEvents';

// Event handler for asynchronous incoming messages
ipcMain.on(IpcTwitchAuthenticate, async (event: any, arg: IpcTwitchAuthenticateArgs) => {
    const token = await authenticateTwitch(arg.scope);
    event.sender.send(IpcTwitchTokenReceive, { token });
});

// ipcMain.on(IpcForwardMessage, async (event: any, arg: IpcForwardMessageArgs) => {
//     ipcMain.send();
// });

ipcMain.on('worker-message', (e: any, message: any) => console.log(message));
