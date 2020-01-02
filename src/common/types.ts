export enum Message {
    // renderer to main
    AuthenticateTwitch = "authenticateTwitch",
    Notify = "notify",
    SelectDirectory = "selectDirectory",
}

export type ResponseType<X extends Message> =
    // renderer to main
    X extends Message.AuthenticateTwitch ? string :
    X extends Message.Notify ? void :
    X extends Message.SelectDirectory ? string :

    // main to renderer
    never;

export type RequestType<X extends Message> =
    // renderer to main
    X extends Message.AuthenticateTwitch ? { scopes: string | string[] } :
    X extends Message.Notify ? { title: string; notification: string } :
    X extends Message.SelectDirectory ? { options: any, save?: boolean } :

    // main to renderer
    never;
