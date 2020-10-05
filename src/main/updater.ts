/**
 * Based off: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 */

import { dialog, MenuItem, shell, BrowserWindow } from "electron";
import log from "electron-log";
import { autoUpdater } from "electron-updater";
import pkg from "../../package.json";
import diff from "semver/functions/diff";
import clean from "semver/functions/clean";

import { getLatestVersion, needsUpdate } from "common/checkForUpdates";

// import Store from "electron-store";
import { Message } from "common/types";

// const store = new Store();

log.transports.file.level = "silly";
log.transports.console.level = "silly";
autoUpdater.logger = log;
// We don't want to auto-download and install since we want control over
// which versions we auto-update to or not
autoUpdater.autoDownload = false;

log.info("App starting...");

let updater: MenuItem | null = null;

function updateLatestVersion(version: string) {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send(Message.SetLatestVersion, clean(version));
  }
}

function updateDownloadComplete() {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send(Message.SetUpdateDownloadComplete, true);
  }
}

class UpdateChecker {
  private giveFeedback = false;

  public async checkForUpdates(giveFeedback?: boolean) {
    this.giveFeedback = Boolean(giveFeedback);

    // Only auto updates are supported in Windows
    if (process.platform === "win32") {
      await autoUpdater.checkForUpdates();
      return;
    }

    await this.checkGithubRelease();

    if (updater) {
      updater.enabled = true;
      updater = null;
    }
  }

  public onError(err: any, title = "Error: ") {
    if (this.giveFeedback) {
      dialog.showErrorBox(title, err === null ? "unknown" : (err.stack || err).toString());
    }
  }

  public async checkGithubRelease() {
    try {
      const latest = await getLatestVersion("vinceau", pkg.name);
      updateLatestVersion(latest);

      if (needsUpdate(latest)) {
        await this._githubUpdateAvailable(latest);
      } else {
        await this.noUpdateAvailable();
      }
    } catch (err) {
      log.error(err);
      this.onError(err, "Error checking latest Github release: ");
    }
  }

  public async noUpdateAvailable() {
    if (!this.giveFeedback) {
      return;
    }

    await dialog.showMessageBox({
      type: "info",
      title: "No updates available",
      message: "You're already on the latest version!",
    });
  }

  private async _githubUpdateAvailable(version: string) {
    if (!this.giveFeedback) {
      return;
    }

    const { response } = await dialog.showMessageBox({
      type: "info",
      title: "New update available",
      message: `Project Clippi ${version} is available from Github. Open the releases page?`,
      buttons: ["Open", "Maybe later"],
    });
    if (response === 0) {
      const url = `${pkg.author.url}/${pkg.name}/releases`;
      await shell.openExternal(url);
    }
  }
}

const updateChecker = new UpdateChecker();

autoUpdater.on("error", async (error) => {
  log.error(error);
  updateChecker.onError(error);
  // await updateChecker.checkGithubRelease();
});

autoUpdater.on("update-available", async (info: any) => {
  // Only auto download and install if it's a patch
  const versionChange = diff(pkg.version, info.version);
  if (versionChange === "patch") {
    await autoUpdater.downloadUpdate();
  }

  updateLatestVersion(info.version);
});

autoUpdater.on("update-not-available", async () => {
  if (updater) {
    await updateChecker.noUpdateAvailable();
    updater.enabled = true;
    updater = null;
  }
});

autoUpdater.on("update-downloaded", async (info: any) => {
  updateDownloadComplete();

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
  await updateChecker.checkForUpdates();
}
