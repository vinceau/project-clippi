import * as path from "path";
import fs from "fs";
import open from "open";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
};

export const openFolder = async (dirPath: string): Promise<void> => {
    if (!fs.existsSync(dirPath)) {
        throw new Error(`${dirPath} does not exist`);
    }

    if (fs.lstatSync(dirPath).isDirectory()) {
        await open(dirPath);
    } else {
        await open(path.dirname(dirPath));
    }
};

export const readFile = async (filePath: string): Promise<Buffer> => {
    return new Promise((resolve, reject) => {
        fs.readFile(filePath, (err, data) => {
            if (err) {
                reject(err);
            } else {
                resolve(data);
            }
        });
    });
};

export const millisToString = (millis: number): string => {
    const date = new Date(millis);
    let str = "";
    str += date.getUTCDate() - 1 + " days, ";
    str += date.getUTCHours() + " hours, ";
    str += date.getUTCMinutes() + " minutes, ";
    str += date.getUTCSeconds() + " seconds, ";
    str += date.getUTCMilliseconds() + " millis";
    return str;
};

export const timeDifferenceString = (before: Date, after: Date): string => {
    const diff = Math.abs(after.getTime() - before.getTime());
    return millisToString(diff);
};
