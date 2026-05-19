import https from "https";
import { accessTokenIsExpired } from "@twurple/auth";
import type { AccessToken, AuthProvider, AccessTokenMaybeWithUserId, AccessTokenWithUserId } from "@twurple/auth";
import type { UserIdResolvable } from "@twurple/common";

export const postForm = (url: string, formData: URLSearchParams): Promise<any> =>
  new Promise((resolve, reject) => {
    const body = formData.toString();
    const req = https.request(
      url,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          "Content-Length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let data = "";
        res.on("data", (chunk: Buffer) => (data += chunk.toString()));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch {
            reject(new Error(`Invalid response (${res.statusCode}): ${data}`));
          }
        });
      }
    );
    req.on("error", reject);
    req.write(body);
    req.end();
  });

export class DeviceCodeAuthProvider implements AuthProvider {
  readonly clientId: string;

  private _token: AccessTokenWithUserId | null = null;

  private _intentToUserId: Map<string, string> = new Map();

  private _refreshPromise: Promise<void> | null = null;

  private _onRefreshCallback: ((userId: string, token: AccessToken) => void | Promise<void>) | null = null;

  constructor(clientId: string) {
    this.clientId = clientId;
  }

  addUser(userId: string, token: AccessToken, intents?: string[]): void {
    this._token = { ...token, userId };
    if (intents) {
      for (const intent of intents) {
        this._intentToUserId.set(intent, userId);
      }
    }
  }

  onRefresh(callback: (userId: string, token: AccessToken) => void | Promise<void>): void {
    this._onRefreshCallback = callback;
  }

  getCurrentScopesForUser(): string[] {
    return this._token?.scope || [];
  }

  async getAccessTokenForUser(user: UserIdResolvable, ..._scopeSets: Array<string[] | undefined>): Promise<AccessTokenWithUserId | null> {
    const userId = typeof user === "string" ? user : (user as { id: string }).id;
    if (!this._token || this._token.userId !== userId) return null;
    await this._ensureValidToken();
    return this._token;
  }

  async getAccessTokenForIntent(intent: string, ..._scopeSets: Array<string[] | undefined>): Promise<AccessTokenWithUserId | null> {
    const userId = this._intentToUserId.get(intent);
    if (!userId || !this._token) return null;
    await this._ensureValidToken();
    return this._token;
  }

  async getAnyAccessToken(): Promise<AccessTokenMaybeWithUserId> {
    if (!this._token) throw new Error("No token available");
    await this._ensureValidToken();
    return this._token;
  }

  async refreshAccessTokenForUser(user: UserIdResolvable): Promise<AccessTokenWithUserId> {
    const userId = typeof user === "string" ? user : (user as { id: string }).id;
    if (!this._token || this._token.userId !== userId) {
      throw new Error(`No token for user ${userId}`);
    }
    await this._doRefresh();
    return this._token!;
  }

  async refreshAccessTokenForIntent(intent: string): Promise<AccessTokenWithUserId> {
    const userId = this._intentToUserId.get(intent);
    if (!userId || !this._token) {
      throw new Error(`No token for intent ${intent}`);
    }
    await this._doRefresh();
    return this._token!;
  }

  private async _ensureValidToken(): Promise<void> {
    if (!this._token) throw new Error("No token set");
    if (accessTokenIsExpired(this._token)) {
      await this._doRefresh();
    }
  }

  private async _doRefresh(): Promise<void> {
    if (this._refreshPromise) {
      await this._refreshPromise;
      return;
    }

    this._refreshPromise = this._performRefresh();

    try {
      await this._refreshPromise;
    } finally {
      this._refreshPromise = null;
    }
  }

  private async _performRefresh(): Promise<void> {
    if (!this._token?.refreshToken) {
      throw new Error("No refresh token available");
    }

    const params = new URLSearchParams({
      client_id: this.clientId,
      refresh_token: this._token.refreshToken,
      grant_type: "refresh_token",
    });

    const body = await postForm("https://id.twitch.tv/oauth2/token", params);

    if (body.message === "Invalid refresh token") {
      throw new Error("Invalid refresh token");
    }

    const { userId } = this._token;
    const newToken: AccessToken = {
      accessToken: body.access_token,
      refreshToken: body.refresh_token,
      scope: body.scope,
      expiresIn: body.expires_in,
      obtainmentTimestamp: Date.now(),
    };

    this._token = { ...newToken, userId };

    if (this._onRefreshCallback) {
      await this._onRefreshCallback(userId, newToken);
    }
  }
}
