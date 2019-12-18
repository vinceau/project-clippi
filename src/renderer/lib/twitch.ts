import {ipc} from "./rendererIpc";
import { Message } from "common/types";

export const fetchTwitchAuthToken = async (scopes: string | string[]): Promise<string> => {
    const token = await ipc.sendSyncWithTimeout(
        Message.AuthenticateTwitch,
        0, // timeout
        { scopes }
    );
        return token;
};