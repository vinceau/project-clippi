import fs from "fs-extra";
import path from "path";
import trash from "trash";

import { EOL } from "os";
import { Writable } from "stream";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
};

export const readFile = async (filePath: string): Promise<Buffer> => {
    const buffer = await fs.readFile(filePath);
    return buffer;
};

export const secondsToString = (seconds: number): string => {
    return millisToString(seconds * 1000);
};

export const millisToString = (millis: number): string => {
    const date = new Date(millis);
    const days = date.getUTCDate() - 1;
    const hours = date.getUTCHours();
    const minutes = date.getUTCMinutes();
    const seconds = date.getUTCSeconds();
    // const millis =  date.getUTCMilliseconds();
    const strParts = new Array<string>();
    if (days > 0) {
        strParts.push(`${days} days`);
    }
    if (hours > 0) {
        strParts.push(`${hours} hours`);
    }
    if (minutes > 0) {
        strParts.push(`${minutes} minutes`);
    }
    if (seconds > 0) {
        strParts.push(`${seconds} seconds`);
    }
    return strParts.join(", ");
};

export const timeDifferenceString = (before: Date, after: Date): string => {
    const diff = Math.abs(after.getTime() - before.getTime());
    return millisToString(diff);
};

export const deleteFile = async (filepath: string, permanent?: boolean): Promise<void> => {
    if (permanent) {
        return fs.unlink(filepath);
    }
    return trash(filepath);
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

export const writeFile = async (contents: string, filename: string, append?: boolean): Promise<void> => {
    await fs.outputFile(filename, contents + EOL, { flag: append ? "a" : "w" });
};

/**
 * Shuffles array in place. ES6 version
 *
 * Taken from: https://stackoverflow.com/a/6274381
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (a: any[]) => {
    let j: number;
    let x: any;
    for (let i = a.length - 1; i > 0; i--) {
        j = Math.floor(Math.random() * (i + 1));
        x = a[i];
        a[i] = a[j];
        a[j] = x;
    }
    return a;
};

export const onlyFilename = (filepath: string): string => {
    const onlyExt = path.extname(filepath);
    return path.basename(filepath, onlyExt);
};

export const assertExtension = (filename: string, extension: string): string => {
    const onlyExt = path.extname(filename);
    if (onlyExt !== extension) {
        return filename + extension;
    }
    return filename;
};
