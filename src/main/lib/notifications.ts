import type { NotificationConstructorOptions } from "electron";
import { app, BrowserWindow, Notification } from "electron";
import pkg from "../../../package.json";

if (process.platform === "win32") {
  app.setAppUserModelId(pkg.build.appId);
}

export async function showNotification(message: string, title?: string): Promise<void> {
  await app.whenReady();

  const notificationTitle = title || "Project Clippi";

  const options: NotificationConstructorOptions = {
    title: notificationTitle,
    body: message,
  };

  const notification = new Notification(options);

  notification.on("click", () => {
    const win = BrowserWindow.getAllWindows()[0];

    if (!win) return;

    if (win.isMinimized()) {
      win.restore();
    }

    win.show();
    win.focus();
  });

  notification.show();
}
