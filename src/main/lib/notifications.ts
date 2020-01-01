import * as path from "path";

import { app, BrowserWindow, Notification, NotificationConstructorOptions, shell } from "electron";

export const showNotification = (title: string, body: string, onClick?: () => void): void => {
    const options: NotificationConstructorOptions = {
        title,
        body,
    };
    // Don't set the icon on MacOS or it will show up twice
    if (process.platform !== "darwin") {
        options.icon = path.join(app.getAppPath(), "resources/icon.png");
    }

    const n = new Notification(options);
    // Show the main window on click
    const defaultClick = () => {
        const win = BrowserWindow.getFocusedWindow();
        if (win) {
            win.show();
        }
    };
    const clickHandler = onClick ? onClick : defaultClick;

    n.on("click", clickHandler);
    n.show();
};

export const twitchClipNotification = (clipId: string): void => {
    showNotification("Twitch Clip Created", "Click to view", () => {
        shell.openExternal(`https://clips.twitch.tv/${clipId}`);
    });
};
