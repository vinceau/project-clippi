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

export enum Message {
  // renderer to main
  AuthenticateTwitch = "authenticateTwitch",
  SignOutTwitch = "signOutTwitch",
  CreateTwitchClip = "createTwitchClip",
  Notify = "notify",
  SelectDirectory = "selectDirectory",
  ToggleTheme = "toggleTheme",
}

export type ResponseType<X extends Message> =
  // renderer to main
  X extends Message.AuthenticateTwitch
    ? TwitchUser | null // Respond with an error message if necessary
    : X extends Message.CreateTwitchClip
    ? TwitchClip | null // clip ID or null if error
    : X extends Message.SignOutTwitch
    ? any
    : X extends Message.Notify
    ? void
    : X extends Message.ToggleTheme
    ? void // Return nothing to renderer
    : X extends Message.SelectDirectory
    ? string[] // main to renderer
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
    : never;
