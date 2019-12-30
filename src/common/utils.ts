import * as path from "path";
import fs from "fs";
import open from "open";
import glob from "glob";

export const delay = async (ms: number): Promise<void> => {
    await new Promise(resolve => setTimeout(resolve, ms));
};

export const findFiles = async (
    fileExt: string,
    folder?: string,
    includeSubfolders?: boolean,
    globOptions?: glob.IOptions,
): Promise<string[]> => {
    const options = globOptions ? globOptions : { nodir: true };
    const searchFolder = folder ? folder : ".";
    const subfolders = includeSubfolders ? "**" : "";
    const pattern = path.join(searchFolder, subfolders, fileExt);
    return new Promise((resolve, reject) => {
        glob(pattern, options, (err, files) => {
            if (err) {
                reject(err);
            } else {
                resolve(files);
            }
        });
    });
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
