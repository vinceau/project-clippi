import * as path from "path";

import { app, BrowserWindow, Notification, NotificationConstructorOptions } from "electron";
import notifier from "node-notifier";

export const showNotification = (message: string, title?: string): void => {
  const notificationTitle = title ? title : "Project Clippi";
  switch (process.platform) {
    case "win32":
      showWindowsNotification(message, notificationTitle);
      break;
    default:
      showElectronNotification(message, notificationTitle);
      break;
  }
};

const showWindowsNotification = (message: string, title: string): void => {
  const fileIcon = getStatic(`/images/icon.png`);
  notifier.notify({
    title,
    message,
    icon: path.resolve(fileIcon), // Don't use SnoreToast icon
    id: 1, // Setting this ID lets us dismiss existing notifications immediately
  });
};

const showElectronNotification = (message: string, title: string): void => {
  const options: NotificationConstructorOptions = {
    title,
    body: message,
  };

  // Don't set the icon on MacOS or it will show up twice
  if (process.platform !== "darwin") {
    options.icon = getStatic(`/images/icon.png`);
  }

  const n = new Notification(options);
  // Show the main window on click
  const clickHandler = () => {
    const win = BrowserWindow.getFocusedWindow();
    if (win) {
      win.show();
    }
  };
  n.on("click", clickHandler);
  n.show();
};

const isDevelopment = process.env.NODE_ENV !== "production";

const getStatic = (val: string): string => {
  if (isDevelopment) {
    return path.join(__dirname, "../../../static", val);
  }
  const appPath = app.getAppPath();
  const imagePath = path.join(appPath, "../static");
  return path.resolve(path.join(imagePath, val));
};
