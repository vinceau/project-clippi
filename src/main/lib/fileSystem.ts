import { BrowserWindow, dialog, SaveDialogOptions, OpenDialogOptions } from "electron";

export type FileSystemDialogOptions = SaveDialogOptions | OpenDialogOptions;

export const openFileSystemDialog = async (options: FileSystemDialogOptions, save?: boolean): Promise<string[]> => {
  if (save) {
    const path = await saveDialog(options as SaveDialogOptions);
    return [path];
  }
  return openDialog(options as OpenDialogOptions);
};

const openDialog = async (options: OpenDialogOptions): Promise<string[]> => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window) {
    throw new Error("No window to attach to");
  }

  const result = await dialog.showOpenDialog(options);
  const res = result.filePaths;
  if (result.canceled || res.length === 0) {
    throw new Error("User cancelled file selection");
  }

  return res;
};

const saveDialog = async (options: SaveDialogOptions): Promise<string> => {
  const window = BrowserWindow.getFocusedWindow();
  if (!window) {
    throw new Error("No window to attach to");
  }

  const result = await dialog.showSaveDialog(window, options);
  if (result.canceled) {
    throw new Error("User cancelled file selection");
  }

  return result.filePath as string;
};
