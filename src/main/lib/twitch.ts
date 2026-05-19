import log from "electron-log";
import Store from "electron-store";
import { shell } from "electron";
import { ApiClient } from "@twurple/api";
import type { HelixUser } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { getTokenInfo } from "@twurple/auth";
import type { AccessToken } from "@twurple/auth";

import { clearAllCookies } from "./session";
import { DeviceCodeAuthProvider, postForm } from "./DeviceCodeAuthProvider";

const store = new Store();

const TWITCH_CLIENT_ID = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
const TOKEN_STORE_KEY = "twitch-access-token";

interface StoredToken extends AccessToken {
  userId: string;
}

const validScopes = (neededScopes: string[], existingScopes: string[]): boolean =>
  neededScopes.every((s) => existingScopes.includes(s));

const createProvider = async (
  tokenData: AccessToken,
  userId: string,
  intents?: string[]
): Promise<DeviceCodeAuthProvider> => {
  const authProvider = new DeviceCodeAuthProvider(TWITCH_CLIENT_ID);
  authProvider.onRefresh(async (refreshedUserId, newTokenData) => {
    log.log("Token refreshed for user", refreshedUserId);
    const current = store.get(TOKEN_STORE_KEY, null) as StoredToken | null;
    if (current && current.userId === refreshedUserId) {
      store.set(TOKEN_STORE_KEY, { ...current, ...newTokenData, userId: refreshedUserId });
    }
  });
  authProvider.addUser(userId, tokenData, intents);
  return authProvider;
};

const requestDeviceCode = async (scopes: string[]) => {
  const params = new URLSearchParams({
    client_id: TWITCH_CLIENT_ID,
    scopes: scopes.join(" "),
  });
  return postForm("https://id.twitch.tv/oauth2/device", params);
};

const pollForToken = async (
  clientId: string,
  deviceCode: string,
  interval: number,
  expiresAt: number
): Promise<AccessToken> => {
  if (Date.now() >= expiresAt) {
    throw new Error("Authorization timed out");
  }

  await new Promise<void>((resolve) => { setTimeout(resolve, interval); });

  const params = new URLSearchParams({
    client_id: clientId,
    device_code: deviceCode,
    grant_type: "urn:ietf:params:oauth:grant-type:device_code",
  });

  const body = await postForm("https://id.twitch.tv/oauth2/token", params);

  if (body.access_token) {
    return {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      scope: body.scope,
      expiresIn: body.expires_in,
      obtainmentTimestamp: Date.now(),
    };
  }

  if (body.message === "slow_down") {
    return pollForToken(clientId, deviceCode, interval + 1000, expiresAt);
  }

  if (body.message === "authorization_pending") {
    return pollForToken(clientId, deviceCode, interval, expiresAt);
  }

  throw new Error(`Device code flow failed: ${body.message || JSON.stringify(body)}`);
};

const performDeviceCodeOAuth = async (scopes: string[]): Promise<{ token: AccessToken; userId: string }> => {
  if (!TWITCH_CLIENT_ID) {
    throw new Error("Twitch client ID is not configured");
  }

  log.log("Requesting device code from Twitch...");
  const deviceCodeData = await requestDeviceCode(scopes);
  log.log(`Device code obtained. User code: ${deviceCodeData.user_code}`);

  shell.openExternal(deviceCodeData.verification_uri);

  const interval = (deviceCodeData.interval || 5) * 1000;
  const expiresAt = Date.now() + (deviceCodeData.expires_in || 1800) * 1000;

  const token = await pollForToken(
    TWITCH_CLIENT_ID,
    deviceCodeData.device_code,
    interval,
    expiresAt
  );
  const info = await getTokenInfo(token.accessToken, TWITCH_CLIENT_ID);
  const userId = info.userId || "";

  log.log("Successfully obtained Twitch access token via DCF");
  return { token, userId };
};

export class TwitchController {
  private currentUser: HelixUser | null = null;

  private client: ApiClient | null = null;

  private authProvider: DeviceCodeAuthProvider | null = null;

  private chatClient: ChatClient | null = null;

  private accessToken: StoredToken | null = null;

  private isChatConnected = false;

  public getCurrentUser(): HelixUser | null {
    return this.currentUser;
  }

  public async authenticate(scopes: string[]): Promise<HelixUser | null> {
    const { apiClient, authProvider } = await this._authenticateTwitch(scopes);
    this.client = apiClient;
    this.authProvider = authProvider;

    if (!this.accessToken) {
      return null;
    }

    this.chatClient = new ChatClient({ authProvider });
    this.chatClient.onConnect(() => {
      log.log("Successfully connected to the Twitch chat server.");
      this.isChatConnected = true;
    });
    this.chatClient.connect();

    this.currentUser = await this.client.users.getUserById(this.accessToken.userId);
    return this.currentUser;
  }

  public async clip(
    channelName?: string,
    options?: Partial<{
      postToChat: boolean;
      chatMessagePrefix: string;
      createAfterDelay: boolean;
    }>
  ): Promise<string> {
    if (!this.client || !this.currentUser) {
      throw new Error("Not logged in to Twitch");
    }

    let channelId = this.currentUser.id;
    if (channelName) {
      const user = await this.client.users.getUserByName(channelName);
      if (!user) {
        throw new Error(`Invalid Twitch user: ${channelName}`);
      }
      channelId = user.id;
    }

    const clipId = await this.client.asUser(this.currentUser.id, async (ctx) =>
      ctx.clips.createClip({
        channel: channelId,
        createAfterDelay: options && options.createAfterDelay,
      })
    );

    if (options && options.postToChat) {
      try {
        const channelToJoin = channelName || this.currentUser.name;
        const url = `https://clips.twitch.tv/${clipId}`;
        const prefix = options.chatMessagePrefix || "";
        await this.chat(channelToJoin, prefix + url);
      } catch (err) {
        log.error(err);
      }
    }

    return clipId;
  }

  public async chat(channel: string, message: string): Promise<void> {
    if (this.isChatConnected && this.chatClient) {
      await this.chatClient.join(channel);
      log.log(`Joined Twitch chat for channel: ${channel}`);
      this.chatClient.say(channel, message);
    }
  }

  public async isStreaming(channelName?: string): Promise<boolean> {
    if (!this.client || !this.currentUser) {
      throw new Error("Not logged in to Twitch");
    }

    let user: HelixUser | null;
    if (channelName) {
      user = await this.client.users.getUserByName(channelName);
    } else {
      user = this.currentUser;
    }
    if (!user) {
      return false;
    }
    const s = await this.client.streams.getStreamByUserId(user.id);
    log.log(s);
    return s !== null;
  }

  public async signOut(): Promise<void> {
    store.delete(TOKEN_STORE_KEY);
    await clearAllCookies("twitch.tv");
    this._resetState();
  }

  private _resetState() {
    this.currentUser = null;
    this.client = null;
    this.authProvider = null;
    this.chatClient = null;
    this.accessToken = null;
    this.isChatConnected = false;
  }

  private async _authenticateTwitch(
    scopes: string[]
  ): Promise<{ apiClient: ApiClient; authProvider: DeviceCodeAuthProvider }> {
    const stored = store.get(TOKEN_STORE_KEY, null) as (StoredToken & { scopes?: string[] }) | null;

    if (stored) {
      const existingScopes = stored.scope || stored.scopes || [];
      if (validScopes(scopes, existingScopes)) {
        try {
          log.log("Instantiating Twitch client using stored token");
          const authProvider = await createProvider(
            {
              accessToken: stored.accessToken,
              refreshToken: stored.refreshToken,
              scope: existingScopes,
              expiresIn: stored.expiresIn,
              obtainmentTimestamp: stored.obtainmentTimestamp,
            },
            stored.userId,
            ["chat"]
          );
          const apiClient = new ApiClient({ authProvider });
          log.log("Testing valid Twitch client");
          await apiClient.users.getUserById(stored.userId);
          this.accessToken = stored as StoredToken;
          return { apiClient, authProvider };
        } catch (err) {
          log.error(`Error creating Twitch client with token: ${err}`);
          log.log("Clearing old token...");
          await this.signOut();
        }
      }
    }

    log.log("Starting Twitch Device Code Grant OAuth flow...");
    const { token, userId } = await performDeviceCodeOAuth(scopes);

    this.accessToken = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      scope: token.scope,
      expiresIn: token.expiresIn,
      obtainmentTimestamp: token.obtainmentTimestamp,
      userId,
    };
    store.set(TOKEN_STORE_KEY, this.accessToken);

    const authProvider = await createProvider(token, userId, ["chat"]);
    const apiClient = new ApiClient({ authProvider });
    return { apiClient, authProvider };
  }
}

export const twitchController = new TwitchController();
