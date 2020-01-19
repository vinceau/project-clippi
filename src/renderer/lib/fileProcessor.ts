import * as path from "path";

import fg from "fast-glob";
import fs from "fs-extra";

import { ComboType, DolphinComboQueue, SlippiGame, SlpRealTime, SlpStream } from "@vinceau/slp-realtime";

import { deleteFile, pipeFileContents } from "common/utils";
import { parseFileRenameFormat } from "./context";
import { comboFilter } from "./realtime";

interface FileProcessorOptions {
    findCombos: boolean;
    deleteZeroComboFiles: boolean;
    outputFile: string;
    renameFiles: boolean;
    renameTemplate: string;
}

interface ProcessOutput {
    combosFound: number;
    filesProcessed: number;
    timeTaken: number; // in seconds
}

export const renameFormat = (filename: string, format: string): string => {
    console.log(`renaming file: ${filename}`);
    const game = new SlippiGame(filename);
    const settings = game.getSettings();
    const metadata = game.getMetadata();
    const fullFilename = path.basename(filename);
    console.log(`name: ${fullFilename}`);
    return parseFileRenameFormat(format, settings, metadata, fullFilename);
};

const uniqueFilename = (name: string) => {
    const randomSuffix = Math.random().toString(36).slice(2).substring(0, 5);
    const onlyExt = path.extname(name);
    const onlyFilename = path.basename(name, onlyExt);
    return `${onlyFilename}_${randomSuffix}${onlyExt}`;
};

const renameFile = async (currentFilename: string, newFilename: string): Promise<string> => {
    const directory = path.dirname(currentFilename);
    let newFullFilename = path.join(directory, newFilename);
    const exists = await fs.pathExists(newFullFilename);
    if (exists) {
        newFullFilename = path.join(directory, uniqueFilename(newFilename));
    }
    await fs.rename(currentFilename, newFullFilename);
    return newFullFilename;
};

export class FileProcessor {
    private readonly filesPath: string;
    private readonly includeSubFolders: boolean;
    private readonly queue = new DolphinComboQueue();

    public constructor(filesPath: string, includeSubFolders: boolean) {
        this.filesPath = filesPath;
        this.includeSubFolders = includeSubFolders;
    }

    public async process(
        opts: Partial<FileProcessorOptions>,
        callback?: (i: number, total: number, filename: string, numCombos: number) => void,
    ): Promise<ProcessOutput> {
        const before = new Date();
        const patterns = ["**/*.slp"];
        const options = {
            absolute: true,
            cwd: this.filesPath,
            onlyFiles: true,
            deep: this.includeSubFolders ? undefined : 1,
        };

        const entries = await fg(patterns, options);

        for (const [i, filename] of (entries.entries())) {
            const numCombos = await this._processFile(filename, opts);
            // Delete the file if no combos were found
            if (opts.deleteZeroComboFiles && numCombos === 0) {
                console.log(`No combos found in ${filename}. Deleting...`);
                await deleteFile(filename);
            }
            if (callback) {
                callback(i, entries.length, filename, numCombos);
            }
        }

        let totalCombos = 0;
        if (opts.outputFile) {
            totalCombos = await this.queue.writeFile(opts.outputFile);
            console.log(`wrote ${totalCombos} out to ${opts.outputFile}`);
        }
        const after = new Date();
        const millisElapsed = Math.abs(after.getTime() - before.getTime());
        return {
            timeTaken: millisElapsed / 1000,
            filesProcessed: entries.length,
            combosFound: totalCombos,
        };
    }

    private async _processFile(filename: string, options: Partial<FileProcessorOptions>): Promise<number> {
        console.log(`processing the file: ${filename}`);
        if (options.renameFiles && options.renameTemplate) {
            const oldFilename = filename;
            console.log(`will rename file using template: ${options.renameTemplate}`);
            const newFilename = renameFormat(filename, options.renameTemplate);
            console.log(`will rename ${filename} to ${newFilename}`);
            filename = await renameFile(filename, newFilename);
            console.log(`Renamed ${oldFilename} to ${filename}`);
        }
        const combos = await findCombos(filename);
        combos.forEach(c => {
            this.queue.addCombo(filename, c);
        });
        return combos.length;
    }
}

export const findCombos = async (filename: string): Promise<ComboType[]> => {
    console.log(`finding combos in: ${filename}`);
    const combosList = new Array<ComboType>();
    const slpStream = new SlpStream({ singleGameMode: true });
    const realtime = new SlpRealTime();
    realtime.setStream(slpStream);

    realtime.on("comboEnd", (c, s) => {
        if (comboFilter.isCombo(c, s)) {
            combosList.push(c);
        }
    });

    await pipeFileContents(filename, slpStream);

    console.log(`found ${combosList.length} combos in ${filename}`);
    return combosList;
};

export const fastFindAndWriteCombos = async (
    filesPath: string,
    includeSubFolders: boolean,
    outputFile: string,
    deleteZeroComboFiles?: boolean,
    callback?: (i: number, total: number, filename: string, numCombos: number) => void,
): Promise<number> => {
    console.log("inside find and write");
    const patterns = ["**/*.slp"];
    const options = {
        absolute: true,
        cwd: filesPath,
        onlyFiles: true,
        deep: includeSubFolders ? undefined : 1,
    };

    const queue = new DolphinComboQueue();

    // const stream = fg.stream(patterns, options);
    const entries = await fg(patterns, options);

    for (const [i, filename] of (entries.entries())) {
        const combos = await findCombos(filename);
        combos.forEach(c => {
            queue.addCombo(filename, c);
        });
        // Delete the file if no combos were found
        if (deleteZeroComboFiles && combos.length === 0) {
            console.log(`${combos.length} combos found. Deleting: ${filename}`);
            await deleteFile(filename);
        }
        if (callback) {
            callback(i, entries.length, filename, combos.length);
        }
    }

    console.log(`writing stuff out`);
    const numCombos = await queue.writeFile(outputFile);
    console.log(`wrote ${numCombos} out to ${outputFile}`);
    return numCombos;
};
