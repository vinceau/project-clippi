import log from "electron-log";
import Store from "electron-store";
import { ApiClient } from "@twurple/api";
import type { HelixUser } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { StaticAuthProvider, getTokenInfo, accessTokenIsExpired } from "@twurple/auth";
import { ElectronAuthProvider } from "@twurple/auth-electron";

import { clearAllCookies } from "./session";

const store = new Store();

const TWITCH_CLIENT_ID = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
const TWITCH_REDIRECT_URI = "http://localhost:3000/auth/twitch/callback";
const TOKEN_STORE_KEY = "twitch-access-token";

interface StoredToken {
  accessToken: string;
  refreshToken: string | null;
  expiresIn: number | null;
  obtainmentTimestamp: number;
  userId: string;
  scopes: string[];
}

const validScopes = (neededScopes: string[], existingScopes: string[]): boolean => {
  for (const s of neededScopes) {
    if (!existingScopes.includes(s)) {
      return false;
    }
  }
  return true;
};

export class TwitchController {
  private currentUser: HelixUser | null = null;
  private client: ApiClient | null = null;
  private authProvider: StaticAuthProvider | ElectronAuthProvider | null = null;
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

    const clipId = await this.client.clips.createClip({
      channel: channelId,
      createAfterDelay: options && options.createAfterDelay,
    });

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

  private async _authenticateTwitch(scopes: string[]): Promise<{ apiClient: ApiClient; authProvider: StaticAuthProvider | ElectronAuthProvider }> {
    const stored = store.get(TOKEN_STORE_KEY, null) as StoredToken | null;

    if (stored && validScopes(scopes, stored.scopes)) {
      const { expiresIn, obtainmentTimestamp } = stored;
      if (!expiresIn || !accessTokenIsExpired({ expiresIn, obtainmentTimestamp })) {
        try {
          log.log("Instantiating Twitch client using stored token");
          const authProvider = new StaticAuthProvider(TWITCH_CLIENT_ID, stored.accessToken);
          const apiClient = new ApiClient({ authProvider });
          log.log("Testing valid Twitch client");
          await apiClient.users.getUserById(stored.userId);
          this.accessToken = stored;
          return { apiClient, authProvider };
        } catch (err) {
          log.error(`Error creating Twitch client with token: ${err}`);
          log.log("Clearing old token...");
          await this.signOut();
        }
      }
    }

    log.log("Opening Twitch OAuth dialog...");
    const authProvider = new ElectronAuthProvider({
      clientId: TWITCH_CLIENT_ID,
      redirectUri: TWITCH_REDIRECT_URI,
    });

    const token = await authProvider.getAccessTokenForUser("0", scopes);
    if (!token) {
      throw new Error("Could not authenticate with Twitch");
    }

    const info = await getTokenInfo(token.accessToken, TWITCH_CLIENT_ID);
    this.accessToken = {
      accessToken: token.accessToken,
      refreshToken: token.refreshToken,
      expiresIn: token.expiresIn,
      obtainmentTimestamp: token.obtainmentTimestamp,
      userId: info.userId || "",
      scopes: info.scopes,
    };

    store.set(TOKEN_STORE_KEY, this.accessToken);

    const apiClient = new ApiClient({ authProvider });
    return { apiClient, authProvider };
  }
}

export const twitchController = new TwitchController();
