
export enum Network {
    Mainnet = "mainnet",
    Testnet = "testnet",
}

export enum Message {
    // renderer to main
    CheckSetup = "check-setup",
    CreateAccount = "create-account",
    Notify = "notify",
    VerifyPassword = "verify-password",
    Relaunch = "relaunch",
    UpdateSwapperD = "update-swapperd",

    // main to renderer
    GetPassword = "get-password",
    Swap = "swap",
    _SwapResponse = "swap-response",
    GetNetwork = "get-network",
    UpdateReady = "update-ready",
    LatestSwapperDVersion = "latest-swapperd-version",
    InstallProgress = "install-progress",
}

export type ResponseType<X extends Message> =
    // renderer to main
    X extends Message.CheckSetup ? boolean :
    X extends Message.CreateAccount ? string :
    X extends Message.Notify ? void :
    X extends Message.VerifyPassword ? boolean :
    X extends Message.Relaunch ? void :
    X extends Message.UpdateSwapperD ? void :

    // main to renderer
    X extends Message.GetPassword ? string :
    // tslint:disable-next-line: no-any
    X extends Message.Swap ? { status: number; response?: any } :
    X extends Message.GetNetwork ? string :
    X extends Message.UpdateReady ? void :
    X extends Message.LatestSwapperDVersion ? void :
    X extends Message.InstallProgress ? void :
    never;

export type RequestType<X extends Message> =
    // renderer to main
    X extends Message.CheckSetup ? null :
    X extends Message.CreateAccount ? { mnemonic: string | null; password: string } :
    X extends Message.Notify ? { title?: string; notification: string } :
    X extends Message.VerifyPassword ? { password: string } :
    X extends Message.Relaunch ? null :
    X extends Message.UpdateSwapperD ? { swapperD: boolean; restart: boolean } :

    // main to renderer
    X extends Message.GetPassword ? null :
    // tslint:disable-next-line: no-any
    X extends Message.Swap ? { body: any; network: Network; origin: any } :
    X extends Message._SwapResponse ? ResponseType<Message.Swap> :
    X extends Message.GetNetwork ? null :
    X extends Message.UpdateReady ? string :
    X extends Message.LatestSwapperDVersion ? string :
    X extends Message.InstallProgress ? number | null :
    never;
