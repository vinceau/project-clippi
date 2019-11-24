export const IpcTwitchRequestAuthToken = 'twitch-request-token';

export interface IpcTwitchRequestAuthTokenArgs {
    scope: string | string[];
}

export const IpcSlpAddListener = 'slp-add-listener';

export interface IpcSlpAddListenerArgs {
    eventName: any;
    handler: any;
}

export const IpcMainBackgroundSocket = 'main-bg';
export const IpcMainRendererSocket = 'main-renderer';
export const IpcBackgroundToRendererEvent = 'bg-to-renderer';
export const IpcRendererToBackgroundEvent = 'renderer-to-bg';
export const IpcRendererToBackgroundRequest = 'renderer-to-bg-request';
export const IpcBackgroundToRendererRequest = 'bg-to-renderer-request';
