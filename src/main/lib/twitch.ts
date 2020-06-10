import TwitchClient, { HelixUser } from "twitch";
import ChatClient from "twitch-chat-client";
import ElectronAuthProvider from "twitch-electron-auth-provider";

import { clearAllCookies } from "./session";

import Store from "electron-store";

const store = new Store();

const TWITCH_CLIENT_ID = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
const TWITCH_REDIRECT_URI = "http://localhost:3000/auth/twitch/callback";
const TOKEN_STORE_KEY = "twitch-access-token";

interface TwitchAccessToken {
  userId: string;
  token: string;
  expiryDate: Date | null;
  scopes: string[];
}

// Ensure we hae sufficient scopes
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
  private client: TwitchClient | null = null;
  private chatClient: ChatClient | null = null;
  private accessToken: TwitchAccessToken | null = null;
  private isChatConnected = false;

  public getCurrentUser(): HelixUser | null {
    return this.currentUser;
  }

  public async authenticate(scopes: string[]): Promise<HelixUser | null> {
    // Connect to Twitch chat server
    this.client = await this._authenticateTwitch(scopes);

    // Ensure a valid access token
    if (!this.accessToken) {
      return null;
    }

    // Connect the chat client so we're ready to post clip links
    this.chatClient = ChatClient.forTwitchClient(this.client);
    this.chatClient.onRegister(() => {
      console.log("Successfully connected to the Twitch chat server.");
      this.isChatConnected = true;
    });
    await this.chatClient.connect();

    // Store the current user
    this.currentUser = await this.client.helix.users.getUserById(this.accessToken.userId);
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

    // The id of the channel we want to clip
    let channelId = this.currentUser.id; // Default to our own channel
    if (channelName) {
      const user = await this.client.helix.users.getUserByName(channelName);
      if (!user) {
        throw new Error(`Invalid Twitch user: ${channelName}`);
      }
      channelId = user.id;
    }

    // Create Twitch clip
    const clipId = await this.client.helix.clips.createClip({
      channelId,
      createAfterDelay: options && options.createAfterDelay,
    });

    if (options && options.postToChat) {
      // Join chat channel and post message
      try {
        const channelToJoin = channelName || this.currentUser.name;
        const url = `https://clips.twitch.tv/${clipId}`;
        const prefix = options.chatMessagePrefix || "";
        await this.chat(channelToJoin, prefix + url);
      } catch (err) {
        // Catch the error so we can always return the clip ID
        console.error(err);
      }
    }

    // Return the Twitch clip
    return clipId;
  }

  public async chat(channel: string, message: string): Promise<void> {
    if (this.isChatConnected && this.chatClient) {
      await this.chatClient.join(channel);
      console.log(`Joined Twitch chat for channel: ${channel}`);
      this.chatClient.say(channel, message);
    }
  }

  public async isStreaming(channelName?: string): Promise<boolean> {
    if (!this.client || !this.currentUser) {
      throw new Error("Not logged in to Twitch");
    }

    let user: HelixUser | null;
    if (channelName) {
      user = await this.client.helix.users.getUserByName(channelName);
    } else {
      user = this.currentUser;
    }
    if (!user) {
      return false;
    }
    const s = await user.getStream();
    console.log(s);
    return s !== null;
  }

  public async signOut(): Promise<void> {
    // Delete token
    store.delete(TOKEN_STORE_KEY);
    // Clear session store
    await clearAllCookies("twitch.tv");
    // Reset current state
    this._resetState();
  }

  private _resetState() {
    this.currentUser = null;
    this.client = null;
    this.chatClient = null;
    this.accessToken = null;
    this.isChatConnected = false;
  }

  private async _authenticateTwitch(scopes: string[]): Promise<TwitchClient> {
    // Try to reuse stored token
    this.accessToken = store.get(TOKEN_STORE_KEY, null);
    if (this.accessToken && validScopes(scopes, this.accessToken.scopes)) {
      // Validate the expiry date
      const expiryDate = this.accessToken.expiryDate ? new Date(this.accessToken.expiryDate) : null;
      const now = new Date();
      if (!expiryDate || expiryDate > now) {
        return TwitchClient.withCredentials(TWITCH_CLIENT_ID, this.accessToken.token);
      }
    }

    // We haven't authenticated yet
    const client = new TwitchClient({
      authProvider: new ElectronAuthProvider({
        clientId: TWITCH_CLIENT_ID,
        redirectURI: TWITCH_REDIRECT_URI,
      }),
    });

    const accessToken = await client.getAccessToken(scopes);
    if (!accessToken) {
      throw new Error("Could not authenticate with Twitch");
    }
    const tokenInfo = await client.getTokenInfo();
    this.accessToken = {
      userId: tokenInfo.userId,
      token: accessToken.accessToken,
      expiryDate: accessToken.expiryDate,
      scopes: accessToken.scope,
    };
    // Persist the data
    store.set(TOKEN_STORE_KEY, this.accessToken);
    return client;
  }
}

export const twitchController = new TwitchController();
