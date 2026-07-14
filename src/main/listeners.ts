import type { IPC } from "common/ipc";
import { Message } from "common/types";
import log from "electron-log";

import { shell } from "electron";
import { checkForUpdates, downloadUpdates, installUpdatesAndRestart } from "./lib/checkForUpdates";
import { openFileSystemDialog } from "./lib/fileSystem";
import { showNotification } from "./lib/notifications";
import { toggleTheme } from "./lib/toggleTheme";
import { twitchController } from "./lib/twitch";

export const setupListeners = (ipc: IPC): void => {
  ipc.on(Message.AuthenticateTwitch, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { scopes } = value;

    twitchController.onDeviceCode = (code) => {
      ipc.sendMessage(Message.TwitchDeviceCode, code);
    };

    try {
      const user = await twitchController.authenticate(scopes);
      if (!user) {
        return null;
      }
      return {
        displayName: user.displayName,
        profilePictureUrl: user.profilePictureUrl,
        name: user.name,
      };
    } catch (err) {
      log.error(err);
      await showNotification("Error authenticating with Twitch");
      return null;
    } finally {
      twitchController.onDeviceCode = null;
    }
  });

  ipc.on(Message.CreateTwitchClip, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const currentUser = twitchController.getCurrentUser();
    if (!currentUser) {
      log.error("Error creating clip: not authenticated with Twitch");
      return null;
    }

    const { channel, postToChat } = value;

    try {
      const clipID = await twitchController.clip(channel, {
        postToChat,
        chatMessagePrefix: "Clipped with Project Clippi: ",
      });
      log.log(`Created a clip: ${clipID}`);
      const clip = {
        channel: channel || currentUser.name,
        clipID,
        timestamp: new Date(),
      };
      return clip;
    } catch (err) {
      log.error(err);
      await showNotification("Error creating Twitch clip");
      return null;
    }
  });

  ipc.on(Message.SignOutTwitch, async (_, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    try {
      await twitchController.signOut();
    } catch (err) {
      log.error(err);
      await showNotification("Error signing out of Twitch");
      throw err;
    }
  });

  ipc.on(Message.TrashItem, async ({ path }) => {
    await shell.trashItem(path);
    log.info(`Trashed item: ${path}`);
  });

  ipc.on(Message.SelectDirectory, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { options, save } = value;

    return openFileSystemDialog(options, save);
  });

  ipc.on(Message.Notify, (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { title, message } = value;
    showNotification(message, title).catch((err) => {
      log.error("Failed to show notification:", err);
    });
  });

  ipc.on(Message.CheckForUpdates, (_, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    checkForUpdates();
  });

  ipc.on(Message.DownloadUpdate, (_, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    downloadUpdates();
  });

  ipc.on(Message.InstallUpdateAndRestart, (_, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    installUpdatesAndRestart();
  });

  ipc.on(Message.ToggleTheme, (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { theme } = value;
    toggleTheme(theme);
  });
};
