import twitchElectronAuthProvider from "twitch-electron-auth-provider";

import { deleteCookie, fetchCookies } from "./session";

const TWITCH_REDIRECT_URI = "http://localhost:3000/auth/twitch/callback";

const clientId = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";

export const authenticateTwitch = async (scopes: string | string[]): Promise<string> => {
    const provider = new twitchElectronAuthProvider({
        clientId,
        redirectURI: TWITCH_REDIRECT_URI,
    });
    const tok = await provider.getAccessToken(scopes);
    return tok.accessToken;
};

export const clearAllTwitchCookies = async (): Promise<void> => {
    const cookies = await fetchCookies();
    for (const cookie of cookies) {
        if (cookie.domain && cookie.domain.includes("twitch.tv")) {
            await deleteCookie(cookie);
        }
    }
};
