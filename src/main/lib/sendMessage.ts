import { Message } from "common/types";
import { BrowserWindow } from "electron";

export function sendMessage(messageType: Message, ...args: any[]): void {
  const window = BrowserWindow.getFocusedWindow();
  if (window) {
    window.webContents.send(messageType, ...args);
  }
}
