/**
 * Based off: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 */

import log from "electron-log";
import { autoUpdater } from "electron-updater";
import pkg from "../../../package.json";

import { getLatestVersion } from "common/githubReleaseVersions";
import { autoUpdatesEnabled } from "common/utils";
import { sendDownloadComplete, sendLatestVersion, sendUpdateError } from "./updateStatus";
import { GITHUB_AUTHOR } from "common/constants";

autoUpdater.logger = log;
// We want users to choose if they want to download and install
// so disable the auto-download
autoUpdater.autoDownload = false;

autoUpdater.on("error", (error) => {
  log.error(error);
});

autoUpdater.on("update-downloaded", async () => {
  sendDownloadComplete();
});

autoUpdater.on("update-downloaded", () => {
  sendDownloadComplete();
});

async function fetchLatestUpdateVersion(): Promise<string> {
  if (autoUpdatesEnabled) {
    // Check using the auto updater
    const info = await autoUpdater.checkForUpdates();
    return info.updateInfo.version;
  } else {
    // Check via Github
    const latest = await getLatestVersion(GITHUB_AUTHOR, pkg.name);
    return latest;
  }
}

export async function checkForUpdates() {
  try {
    const latest = await fetchLatestUpdateVersion();
    sendLatestVersion(latest);
  } catch (err) {
    log.error("Error checking for updates: ", err);
    sendUpdateError(err.message);
  }
}

export function downloadUpdates() {
  autoUpdater.downloadUpdate();
}

export function installUpdatesAndRestart() {
  autoUpdater.quitAndInstall();
}
