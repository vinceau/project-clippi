/* eslint-disable @typescript-eslint/no-explicit-any */
export interface TwitchUser {
  displayName: string;
  profilePictureUrl: string;
  name: string;
}

export interface TwitchClip {
  clipID: string;
  channel: string;
  timestamp: Date;
}

export interface VersionUpdatePayload {
  status: UpdateStatus;
  payload: any;
}

export enum UpdateStatus {
  NO_UPDATE = "NO_UPDATE",
  UPDATE_AVAILABLE = "UPDATE_AVAILABLE",
  DOWNLOAD_COMPLETE = "DOWNLOAD_COMPLETE",
  UPDATE_ERROR = "UPDATE_ERROR",
}

export enum Message {
  // renderer to main
  AuthenticateTwitch = "authenticateTwitch",
  SignOutTwitch = "signOutTwitch",
  CreateTwitchClip = "createTwitchClip",
  Notify = "notify",
  SelectDirectory = "selectDirectory",
  ToggleTheme = "toggleTheme",
  CheckForUpdates = "checkForUpdates",
  DownloadUpdate = "downloadUpdate",
  InstallUpdateAndRestart = "installUpdateAndRestart",

  // main to renderer
  VersionUpdateStatus = "versionUpdateStatus",
}

export type ResponseType<X extends Message> =
  // main to renderer
  X extends Message.AuthenticateTwitch
    ? TwitchUser | null // Respond with an error message if necessary
    : X extends Message.CreateTwitchClip
    ? TwitchClip | null // clip ID or null if error
    : X extends Message.SignOutTwitch
    ? any
    : X extends Message.Notify
    ? void
    : X extends Message.ToggleTheme
    ? void // Return any payload to renderer
    : X extends Message.VersionUpdateStatus
    ? any // Return nothing to renderer
    : X extends Message.SelectDirectory
    ? string[]
    : X extends Message.CheckForUpdates
    ? void
    : X extends Message.InstallUpdateAndRestart
    ? void
    : X extends Message.DownloadUpdate
    ? void
    : X extends Message.VersionUpdateStatus
    ? VersionUpdatePayload
    : never;

export type RequestType<X extends Message> =
  // renderer to main
  X extends Message.AuthenticateTwitch
    ? { scopes: string[] }
    : X extends Message.CreateTwitchClip
    ? { channel?: string; postToChat?: boolean }
    : X extends Message.SignOutTwitch
    ? any
    : X extends Message.Notify
    ? { message: string; title?: string }
    : X extends Message.SelectDirectory
    ? { options: any; save?: boolean }
    : X extends Message.ToggleTheme
    ? { theme: "light" | "dark" } // Tell the main process which theme we want to apply
    : X extends Message.CheckForUpdates
    ? void
    : never;
