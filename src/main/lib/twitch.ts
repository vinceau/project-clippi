import twitchElectronAuthProvider from "twitch-electron-auth-provider";

import { deleteCookie, fetchCookies } from "./session";

const clientId = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
const redirectURI = process.env.ELECTRON_WEBPACK_APP_TWITCH_REDIRECT_URI || "";

export const authenticateTwitch = async (scopes: string | string[]): Promise<string> => {
    const provider = new twitchElectronAuthProvider({ clientId, redirectURI });
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
