/**
 * Based off: https://github.com/electron-userland/electron-builder/blob/docs/encapsulated%20manual%20update%20via%20menu.js
 */

import { MenuItem, BrowserWindow } from "electron";
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

  public async checkForUpdates(giveFeedback?: boolean): Promise<void> {
    console.log("checking for updates...");
    this.giveFeedback = Boolean(giveFeedback);

    let latest: string;
    // Only auto updates are supported in Windows
    if (process.platform === "win32") {
      console.log("on windows so using built in auto updater...");
      latest = await checkAutoUpdateAvailable();
    } else {
      // Check Github for latest version
      latest = await getLatestVersion("vinceau", pkg.name);
    }

    // Inform renderer of the latest version
    updateLatestVersion(latest);

    if (!needsUpdate(latest)) {
      // Show no update available message
      await this.noUpdateAvailable();
      return;
    }

    // We need to update
    if (process.platform === "win32") {
      // Only auto-download if it's a patch version
      const versionChangeType = diff(pkg.version, latest);
      if (versionChangeType === "patch") {
        // Auto start the download
        await autoUpdater.downloadUpdate();
      }
    } else {
      // It's a Github release so send update
      this._githubUpdateAvailable(latest);
    }
  }

  public onError(err: any, title = "Error: ") {
    log.error(err);
    console.log(title, err);
    // if (this.giveFeedback) {
    //   dialog.showErrorBox(title, err === null ? "unknown" : (err.stack || err).toString());
    // }
  }

  public async noUpdateAvailable() {
    if (!this.giveFeedback) {
      return;
    }

    // await dialog.showMessageBox({
    //   type: "info",
    //   title: "No updates available",
    //   message: "You're already on the latest version!",
    // });
  }

  private _githubUpdateAvailable(version: string) {
    console.log(`showing github update message... ${version}`);
    if (!this.giveFeedback) {
      console.log("jk give feedback is false");
      return;
    }
    console.log("showing github update message...");
    const win = BrowserWindow.getFocusedWindow();
    if (!win) {
      return;
    }

    /*
    dialog
      .showMessageBox(win, {
        type: "info",
        title: "New update available",
        message: `Project Clippi v${version} is available from Github. Open the releases page?`,
        defaultId: 0,
        buttons: ["Open", "Maybe later"],
      })
      .then(({ response }) => {
        if (response === 0) {
          const url = `${pkg.author.url}/${pkg.name}/releases`;
          shell.openExternal(url);
        }
      });
      */
  }
}

const updateChecker = new UpdateChecker();

/**
 * Calls the Electron auto-updater to see if a new version is available.
 * Returns the semver version string of the latest version.
 *
 * @returns {Promise<string>}
 */
async function checkAutoUpdateAvailable(): Promise<string> {
  return new Promise((resolve, reject) => {
    // Actually check for updates
    autoUpdater
      .checkForUpdates()
      .then((res) => {
        const info = res.updateInfo;
        resolve(info.version);
      })
      .catch((err) => reject(err));
  });
}

autoUpdater.on("error", async (error) => {
  log.error(error);
});

autoUpdater.on("update-not-available", async () => {
  if (updater) {
    await updateChecker.noUpdateAvailable();
    updater.enabled = true;
    updater = null;
  }
});

autoUpdater.on("update-downloaded", async (info: any) => {
  console.log(info);
  updateDownloadComplete();

  /*
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
  */
});

export async function checkForUpdates(giveFeedback?: boolean) {
  console.log(`calling checkForUpdates. giveFeedback?: ${giveFeedback}`);
  try {
    await updateChecker.checkForUpdates(giveFeedback);
  } catch (err) {
    updateChecker.onError(err);
  }
}

export async function checkForUpdatesFromMenu(menuItem: MenuItem) {
  console.log("calling checkForUpdatesFromMenu");
  updater = menuItem;
  updater.enabled = false;
  await checkForUpdates(true);
  updater.enabled = true;
  updater = null;
}
