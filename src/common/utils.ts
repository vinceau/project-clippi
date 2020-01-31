import fs from "fs-extra";

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

export const deleteFile = async (filepath: string): Promise<void> => {
    await fs.unlink(filepath);
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
