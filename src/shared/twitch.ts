import twitch from 'twitch';

export const TwitchClientId = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || '';
export const TwitchRedirectURI = process.env.ELECTRON_WEBPACK_APP_TWITCH_REDIRECT_URI || '';

export const createTwitchClip = async (
    token: string,
    channelName: string
): Promise<string | null> => {
    const twitchClient = await twitch.withCredentials(TwitchClientId, token);
    const user = await twitchClient.helix.users.getUserByName(channelName);
    if (user !== null && (await user.getStream()) !== null) {
        return twitchClient.helix.clips.createClip({ channelId: user.id });
    }
    return null;
};
