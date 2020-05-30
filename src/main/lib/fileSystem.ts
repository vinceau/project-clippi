import { dialog, SaveDialogOptions, OpenDialogOptions } from "electron";

export type FileSystemDialogOptions = SaveDialogOptions | OpenDialogOptions;

export const openFileSystemDialog = async (options: FileSystemDialogOptions, save?: boolean): Promise<string[]> => {
  if (save) {
    const path = await saveDialog(options);
    return [path];
  }
  return openDialog(options);
};

const openDialog = async (options: OpenDialogOptions): Promise<string[]> => {
  return new Promise((resolve, reject) => {
    dialog.showOpenDialog(options, (res: string[] | undefined) => {
      if (res && res.length > 0) {
        resolve(res);
      } else {
        reject("User cancelled file selection");
      }
    });
  });
};

const saveDialog = async (options: SaveDialogOptions): Promise<string> => {
  return new Promise((resolve, reject) => {
    dialog.showSaveDialog(options, (res?: string) => {
      if (res) {
        resolve(res);
      } else {
        reject("User cancelled file selection");
      }
    });
  });
};
