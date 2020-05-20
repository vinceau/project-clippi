export interface TwitchAccessToken {
    token: string;
    expiryDate: Date | null;
    scopes: string[];
}

export enum Message {
    // renderer to main
    AuthenticateTwitch = "authenticateTwitch",
    SignOutTwitch = "signOutTwitch",
    Notify = "notify",
    SelectDirectory = "selectDirectory",
}

export type ResponseType<X extends Message> =
    // renderer to main
    X extends Message.AuthenticateTwitch ? TwitchAccessToken | null :
    X extends Message.SignOutTwitch ? void :
    X extends Message.Notify ? void :
    X extends Message.SelectDirectory ? string[] :

    // main to renderer
    never;

export type RequestType<X extends Message> =
    // renderer to main
    X extends Message.AuthenticateTwitch ? { scopes: string | string[] } :
    X extends Message.SignOutTwitch ? any :
    X extends Message.Notify ? { message: string; title?: string } :
    X extends Message.SelectDirectory ? { options: any, save?: boolean } :

    // main to renderer
    never;
