import { ipcRenderer } from 'electron';
import { IpcTwitchTokenReceive, IpcTwitchTokenReceiveArgs } from '../../shared/ipcEvents';
import { TwitchSetToken } from '../actions/twitchActions';
import { store } from '../store';

// Async message handler
ipcRenderer.on(IpcTwitchTokenReceive, (event: any, arg: IpcTwitchTokenReceiveArgs) => {
    console.log(`received access token from main: ${arg.token}`);
    store.dispatch({ type: TwitchSetToken, accessToken: arg.token });
});
