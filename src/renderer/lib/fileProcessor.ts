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
    const game = new SlippiGame(filename);
    const settings = game.getSettings();
    const metadata = game.getMetadata();
    const fullFilename = path.basename(filename);
    return parseFileRenameFormat(format, settings, metadata, fullFilename);
};

const uniqueFilename = (name: string) => {
    const randomSuffix = Math.random().toString(36).slice(2).substring(0, 5);
    const onlyExt = path.extname(name);
    const onlyFilename = path.basename(name, onlyExt);
    return `${onlyFilename}_${randomSuffix}${onlyExt}`;
};

const renameFile = async (currentFilename: string, newFilename: string): Promise<string> => {
    // Return if the new filename is the same as the current name
    const fullFilename = path.basename(currentFilename);
    if (fullFilename === newFilename) {
        console.log("Filename is already named! Skipping rename...");
        return currentFilename;
    }
    // Make sure the new filename doesn't already exist
    const directory = path.dirname(currentFilename);
    let newFullFilename = path.join(directory, newFilename);
    const exists = await fs.pathExists(newFullFilename);
    if (exists) {
        // Append a random suffix to the end to avoid conflicts
        newFullFilename = path.join(directory, uniqueFilename(newFilename));
    }
    await fs.rename(currentFilename, newFullFilename);
    console.log(`Renamed ${currentFilename} to ${newFullFilename}`);
    // Return the new filename so we know how to further process it
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
            console.log(`Wrote ${totalCombos} out to ${opts.outputFile}`);
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
        console.log(`Processing file: ${filename}`);
        if (options.renameFiles && options.renameTemplate) {
            const newFilename = renameFormat(filename, options.renameTemplate);
            filename = await renameFile(filename, newFilename);
        }
        const combos = await findCombos(filename);
        combos.forEach(c => {
            this.queue.addCombo(filename, c);
        });
        return combos.length;
    }
}

export const findCombos = async (filename: string): Promise<ComboType[]> => {
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

    console.log(`Found ${combosList.length} combos in ${filename}`);
    return combosList;
};
