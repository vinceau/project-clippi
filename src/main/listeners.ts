import * as path from "path";

import { App, BrowserWindow, Notification, NotificationConstructorOptions } from "electron";

import { IPC } from "common/ipc";
import { Message } from "common/types";

export const setupListeners = (app: App, win: BrowserWindow, ipc: IPC) => {

    ipc.on(Message.Notify, (value, _error?: Error) => {
        if (_error) {
            throw new Error("Should not have received error");
        }

        const { title, notification } = value;
        const options: NotificationConstructorOptions = {
            title: title ? title : "SwapperD Desktop",
            body: notification,
        };
        // Don't set the icon on MacOS or it will show up twice
        if (process.platform !== "darwin") {
            options.icon = path.join(app.getAppPath(), "resources/icon.png");
        }
        const n = new Notification(options);
        // Show the main window on click
        n.on("click", () => {
            win.show();
        });
        n.show();
        return;
    });
};
