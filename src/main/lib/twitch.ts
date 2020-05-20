import TwitchClient from "twitch";
import ElectronAuthProvider from "twitch-electron-auth-provider";

import { TwitchClientId } from "common/twitch";
import { TwitchAccessToken } from "common/types";
import { deleteCookie, fetchCookies } from "./session";

const TWITCH_REDIRECT_URI = "http://localhost:3000/auth/twitch/callback";

export const authenticateTwitch = async (scopes: string | string[]): Promise<TwitchAccessToken | null> => {
    const client = new TwitchClient({
        authProvider: new ElectronAuthProvider({
            clientId: TwitchClientId,
            redirectURI: TWITCH_REDIRECT_URI,
        })
    });
    const token = await client.getAccessToken(scopes);
    if (!token) {
        return null;
    }
    return {
        token: token.accessToken,
        expiryDate: token.expiryDate,
        scopes: token.scope,
    };
};

export const clearAllTwitchCookies = async (): Promise<void> => {
    const cookies = await fetchCookies();
    for (const cookie of cookies) {
        if (cookie.domain && cookie.domain.includes("twitch.tv")) {
            await deleteCookie(cookie);
        }
    }
};
