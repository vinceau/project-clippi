/**
 * Based off: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 */

import { dialog, MenuItem } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";

autoUpdater.logger = log;

log.info("App starting...");

let updater: MenuItem | null = null;

autoUpdater.on("update-not-available", async () => {
  if (updater) {
    await dialog.showMessageBox({
      type: "info",
      title: "No updates available",
      message: "You're already on the latest version!",
    });
    updater.enabled = true;
    updater = null;
  }
});

autoUpdater.on("update-downloaded", async (info: any) => {
  const { response } = await dialog.showMessageBox({
    type: "info",
    title: "New update available",
    message: `Project Clippi v${info.version} is available. Update and restart now?`,
    buttons: ["Restart now", "Maybe later"],
  });
  if (response === 0) {
    setImmediate(() => autoUpdater.quitAndInstall());
  } else if (updater) {
    updater.enabled = true;
    updater = null;
  }
});

export async function checkForUpdates(menuItem: MenuItem) {
  updater = menuItem;
  updater.enabled = false;

  try {
    await autoUpdater.checkForUpdates();
  } catch (err) {
    console.error(err);
    dialog.showErrorBox("Error: ", err === null ? "unknown" : (err.stack || err).toString());
  }
}
