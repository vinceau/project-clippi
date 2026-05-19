import http from "http";
import log from "electron-log";
import Store from "electron-store";
import { shell } from "electron";
import { ApiClient } from "@twurple/api";
import type { HelixUser } from "@twurple/api";
import { ChatClient } from "@twurple/chat";
import { RefreshingAuthProvider, exchangeCode, getTokenInfo } from "@twurple/auth";
import type { AccessToken } from "@twurple/auth";

import { clearAllCookies } from "./session";

const store = new Store();

const TWITCH_CLIENT_ID = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_ID || "";
const TWITCH_CLIENT_SECRET = process.env.ELECTRON_WEBPACK_APP_TWITCH_CLIENT_SECRET || "";
const TOKEN_STORE_KEY = "twitch-access-token";

interface StoredToken extends AccessToken {
  userId: string;
}

const validScopes = (neededScopes: string[], existingScopes: string[]): boolean =>
  neededScopes.every((s) => existingScopes.includes(s));

const SUCCESS_PAGE = `<html>
<body style="display:flex;align-items:center;justify-content:center;height:100vh;font-family:sans-serif;background:#1a1a2e;color:#fff;margin:0">
<div style="text-align:center">
<h1 style="color:#9147ff">Authorization successful!</h1>
<p>You can close this window and return to Project Clippi.</p>
</div>
</body>
</html>`;

const createProvider = async (tokenData: AccessToken, intents?: string[]): Promise<RefreshingAuthProvider> => {
  const authProvider = new RefreshingAuthProvider({
    clientId: TWITCH_CLIENT_ID,
    clientSecret: TWITCH_CLIENT_SECRET,
  });
  authProvider.onRefresh(async (userId, newTokenData) => {
    log.log("Token refreshed for user", userId);
    const current = store.get(TOKEN_STORE_KEY, null) as StoredToken | null;
    if (current && current.userId === userId) {
      store.set(TOKEN_STORE_KEY, { ...current, ...newTokenData, userId });
    }
  });
  await authProvider.addUserForToken(tokenData, intents);
  return authProvider;
};

const performOAuth = async (scopes: string[]): Promise<{ code: string; redirectUri: string }> =>
  new Promise<{ code: string; redirectUri: string }>((resolve, reject) => {
    let port = 5743;
    const maxPort = 5800;

    const tryListen = () => {
      const server = http.createServer((req, res) => {
        const parsedUrl = new URL(req.url!, `http://localhost:${port}`);
        if (parsedUrl.pathname === "/auth/twitch/callback") {
          const code = parsedUrl.searchParams.get("code");
          const error = parsedUrl.searchParams.get("error");
          if (error) {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end(`Authorization failed: ${error}`);
            server.close();
            reject(new Error(`Twitch authorization failed: ${error}`));
            return;
          }
          if (code) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.end(SUCCESS_PAGE);
            server.close();
            resolve({
              code,
              redirectUri: `http://localhost:${port}/auth/twitch/callback`,
            });
          } else {
            res.writeHead(400, { "Content-Type": "text/html" });
            res.end("No authorization code received.");
            server.close();
            reject(new Error("No authorization code received"));
          }
        }
      });

      server.listen(port, () => {
        const redirectUri = `http://localhost:${port}/auth/twitch/callback`;
        const params = new URLSearchParams({
          client_id: TWITCH_CLIENT_ID,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: scopes.join(" "),
        });
        const authUrl = `https://id.twitch.tv/oauth2/authorize?${params}`;
        log.log(`Opening browser for Twitch auth: ${authUrl}`);
        shell.openExternal(authUrl);
      });

      server.on("error", (err: Error & { code?: string }) => {
        if (err.code === "EADDRINUSE" && port < maxPort) {
          port += 1;
          tryListen();
        } else {
          reject(err);
        }
      });

      setTimeout(() => {
        server.close();
        reject(new Error("Authorization timed out"));
      }, 300000);
    };

    tryListen();
  });

export class TwitchController {
  private currentUser: HelixUser | null = null;

  private client: ApiClient | null = null;

  private authProvider: RefreshingAuthProvider | null = null;

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

  private async _authenticateTwitch(
    scopes: string[]
  ): Promise<{ apiClient: ApiClient; authProvider: RefreshingAuthProvider }> {
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

    log.log("Opening Twitch OAuth dialog...");
    const { code, redirectUri } = await performOAuth(scopes);

    const tokenData = await exchangeCode(TWITCH_CLIENT_ID, TWITCH_CLIENT_SECRET, code, redirectUri);
    const info = await getTokenInfo(tokenData.accessToken, TWITCH_CLIENT_ID);

    this.accessToken = {
      accessToken: tokenData.accessToken,
      refreshToken: tokenData.refreshToken,
      scope: tokenData.scope,
      expiresIn: tokenData.expiresIn,
      obtainmentTimestamp: tokenData.obtainmentTimestamp,
      userId: info.userId || "",
    };
    store.set(TOKEN_STORE_KEY, this.accessToken);

    const authProvider = await createProvider(tokenData, ["chat"]);
    const apiClient = new ApiClient({ authProvider });
    return { apiClient, authProvider };
  }
}

export const twitchController = new TwitchController();
