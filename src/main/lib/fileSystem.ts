import { dialog } from "electron";

const options = {
    properties: ["openDirectory"],
};

export const selectDirectory = async (): Promise<string> => {
    return new Promise((resolve) => {
            (dialog as any).showOpenDialog(options, (dir: string[]) => {
            console.log(dir);
            resolve(dir[0]);
        });
    });
};
