import { dialog } from "electron";

export const openFileSystemDialog = async (options: any, save?: boolean): Promise<string[]> => {
    if (save) {
        const path = await saveDialog(options);
        return [path];
    }
    return openDialog(options);
};

const openDialog = async (options: any): Promise<string[]> => {
    return new Promise((resolve, reject) => {
        (dialog as any).showOpenDialog(options, (res: string[] | undefined) => {
            if (res && res.length > 0) {
                resolve(res);
            } else {
                reject("User cancelled file selection");
            }
        });
    });
};

const saveDialog = async (options: any): Promise<string> => {
    return new Promise((resolve, reject) => {
        (dialog as any).showSaveDialog(options, (res: string | undefined) => {
            if (res) {
                resolve(res);
            } else {
                reject("User cancelled file selection");
            }
        });
    });
};
