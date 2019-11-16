export const IpcTwitchAuthenticate = 'twitch-authenticate';

export interface IpcTwitchAuthenticateArgs {
    scope: string | string[];
}

export const IpcTwitchTokenReceive = 'twitch-token-receive';

export interface IpcTwitchTokenReceiveArgs {
    token: string;
}
