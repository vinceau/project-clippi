import { IPC } from "common/ipc";
import { Message } from "common/types";

import { openFileSystemDialog } from "./lib/fileSystem";
import { showNotification } from "./lib/notifications";
import { twitchController } from "./lib/twitch";
import { toggleTheme } from "./lib/toggleTheme";

export const setupListeners = (ipc: IPC): void => {
  ipc.on(Message.AuthenticateTwitch, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { scopes } = value;

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
      console.error(err);
      showNotification("Error authenticating with Twitch");
      return null;
    }
  });

  ipc.on(Message.CreateTwitchClip, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const currentUser = twitchController.getCurrentUser();
    if (!currentUser) {
      console.error("Error creating clip: not authenticated with Twitch");
      return null;
    }

    const { channel, postToChat } = value;

    try {
      const clipID = await twitchController.clip(channel, {
        postToChat,
        chatMessagePrefix: "Clipped with Project Clippi: ",
      });
      console.log(`Created a clip: ${clipID}`);
      const clip = {
        channel: channel ? channel : currentUser.name,
        clipID,
        timestamp: new Date(),
      };
      return clip;
    } catch (err) {
      console.error(err);
      showNotification("Error creating Twitch clip");
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
      console.error(err);
      showNotification("Error signing out of Twitch");
      return err;
    }
  });

  ipc.on(Message.SelectDirectory, async (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { options, save } = value;

    return await openFileSystemDialog(options, save);
  });

  ipc.on(Message.Notify, (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { title, message } = value;
    showNotification(message, title);
  });

  ipc.on(Message.ToggleTheme, (value, _error?: Error) => {
    if (_error) {
      throw new Error("Should not have received error");
    }

    const { theme } = value;
    toggleTheme(theme);
  });
};
