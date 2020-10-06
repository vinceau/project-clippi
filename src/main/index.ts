import * as path from "path";

import { app, BrowserWindow, Menu, shell, Event } from "electron";
import { format as formatUrl } from "url";
import { setupListeners } from "./listeners";
import { setupIPC } from "./mainIpc";

import { lightTheme, darkTheme } from "../common/theme";
import { isDevelopment } from "../common/utils";
import contextMenu from "electron-context-menu";
import { getMenuTemplate } from "./menu";
import { getCurrentTheme } from "./lib/toggleTheme";

contextMenu();

// global reference to mainWindow (necessary to prevent window from being garbage collected)
let mainWindow: BrowserWindow | null;

function createMainWindow() {
  const currentTheme = getCurrentTheme();
  const window = new BrowserWindow({
    backgroundColor: currentTheme === "dark" ? darkTheme.background : lightTheme.background,
    webPreferences: {
      nodeIntegration: true, // <--- flag
      nodeIntegrationInWorker: true, // <---  for web workers
    },
    autoHideMenuBar: true, // Toggle menu bar with Alt
  });

  // A bit of a hack to allow the renderer window to synchronously get the current theme
  // without waiting for an IPC message
  (window as any).getCurrentTheme = getCurrentTheme;

  window.webContents.on("did-frame-finish-load", () => {
    if (isDevelopment) {
      window.webContents.openDevTools();
      window.webContents.on("devtools-opened", () => {
        window.focus();
      });
    }
  });

  if (isDevelopment) {
    window.loadURL(`http://localhost:${process.env.ELECTRON_WEBPACK_WDS_PORT}`);
  } else {
    window.loadURL(
      formatUrl({
        pathname: path.join(__dirname, "index.html"),
        protocol: "file",
        slashes: true,
      })
    );
  }

  window.on("closed", () => {
    mainWindow = null;
  });

  const ipc = setupIPC(app, window);
  setupListeners(ipc);

  return window;
}

// quit application when all windows are closed
app.on("window-all-closed", () => {
  // on macOS it is common for applications to stay open until the user explicitly quits
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // on macOS it is common to re-create a window even after all windows have been closed
  if (mainWindow === null) {
    mainWindow = createMainWindow();
  }
});

const startUp = () => {
  // Create the Application's main menu
  const template = getMenuTemplate(app, process.platform);
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));

  // Set any anchor links to open in default web browser
  mainWindow = createMainWindow();
  mainWindow.webContents.on("new-window", (event: Event, url: string) => {
    event.preventDefault();
    shell.openExternal(url);
  });
};

if (isDevelopment) {
  // There's an issue with Windows 10 dark mode where the ready event doesn't fire
  // when running in dev mode. Use the prepend listener to work around this.
  // See https://github.com/electron/electron/issues/19468#issuecomment-623529556 for more info.
  app.prependOnceListener("ready", startUp);
} else {
  // Otherwise create main BrowserWindow when electron is ready normally
  app.on("ready", startUp);
}
