export const IpcTwitchAuthenticate = 'twitch-authenticate';

export interface IpcTwitchAuthenticateArgs {
    scope: string | string[];
}

export const IpcTwitchTokenReceive = 'twitch-token-receive';

export interface IpcTwitchTokenReceiveArgs {
    token: string;
}

export const IpcSlpAddListener = 'slp-add-listener';

export interface IpcSlpAddListenerArgs {
    eventName: any;
    handler: any;
}

export const IpcForwardMessage = 'forward-message';

export interface IpcForwardMessageArgs {
    messageName: string;
    payload: any;
}

export const IpcMainBackgroundSocket = 'main-bg';
export const IpcMainRendererSocket = 'main-renderer';
export const IpcBackgroundToRendererEvent = 'bg-to-renderer';
export const IpcRendererToBackgroundEvent = 'renderer-to-bg';
