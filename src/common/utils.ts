import * as path from "path";

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
