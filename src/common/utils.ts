import fs from "fs";

import { Writable } from "stream";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
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
    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes =  date.getUTCMinutes();
    const seconds =  date.getUTCSeconds();
    // const millis =  date.getUTCMilliseconds();
    let str = "";
    if (days > 0 ) {
        str += `${days} days, `;
    }
    if (hours > 0 ) {
        str += `${hours} hours, `;
    }
    if (minutes > 0 ) {
        str += `${minutes} minutes, `;
    }
    if (seconds > 0 ) {
        str += `${seconds} seconds, `;
    }
    return str;
};

export const timeDifferenceString = (before: Date, after: Date): string => {
    const diff = Math.abs(after.getTime() - before.getTime());
    return millisToString(diff);
};

export const deleteFile = async (filepath: string): Promise<void> => {
    return new Promise((resolve, reject) => {
        fs.unlink(filepath, (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        });
    });
};

export const pipeFileContents = async (filename: string, destination: Writable): Promise<void> => {
    return new Promise((resolve): void => {
        const readStream = fs.createReadStream(filename);
        readStream.on("open", () => {
            readStream.pipe(destination);
        });
        readStream.on("close", () => {
            resolve();
        });
    });
};