import twitch, { HelixUser } from "twitch";

export const TwitchClientId = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
export const TwitchRedirectURI = process.env.ELECTRON_WEBPACK_APP_TWITCH_REDIRECT_URI || "";

export const createTwitchClip = async (
    token: string,
    createAfterDelay?: boolean,
    channelName?: string,
): Promise<string> => {
    const twitchClient = await twitch.withCredentials(TwitchClientId, token);
    let user: HelixUser | null;
    if (channelName) {
        user = await twitchClient.helix.users.getUserByName(channelName);
    } else {
        // Default to the token user if not provided
        user = await currentUser(token);
    }
    if (!user) {
        throw new Error(`Invalid Twitch user`);
    }
    return twitchClient.helix.clips.createClip({
        channelId: user.id,
        createAfterDelay,
    });
};

export const isStreaming = async (token: string, channelName?: string): Promise<boolean> => {
    let user: HelixUser | null;
    const twitchClient = await twitch.withCredentials(TwitchClientId, token);
    if (channelName) {
        user = await twitchClient.helix.users.getUserByName(channelName);
    } else {
        user = await currentUser(token);
    }
    if (!user) {
        return false;
    }
    const s = await user.getStream();
    console.log(s);
    return s !== null;
};

export const currentUser = async (token: string): Promise<HelixUser | null> => {
    const twitchClient = await twitch.withCredentials(TwitchClientId, token);
    const tokenInfo = await twitchClient.getTokenInfo();
    if (tokenInfo.userId) {
        return twitchClient.helix.users.getUserById(tokenInfo.userId);
    }
    return null;
};
