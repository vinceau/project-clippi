import { dialog } from "electron";

const options = {
    properties: ["openDirectory"],
};

export const selectDirectory = async (): Promise<string> => {
    return new Promise((resolve, reject) => {
            (dialog as any).showOpenDialog(options, (dir: string[]) => {
            console.log(dir);
            if (!dir) {
                reject("Could not get any directories");
            } else {
                resolve(dir[0]);
            }
        });
    });
};
