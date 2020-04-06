import * as path from "path";

import moment from "moment";

import fg from "fast-glob";
import fs from "fs-extra";

import { Frames, ComboEventPayload, ComboFilter, DolphinPlaybackItem, generateDolphinQueuePayload, SlippiGame, SlpRealTime, SlpStream, Input } from "@vinceau/slp-realtime";
import { Observable } from "rxjs";

import { store } from "@/store";
import { deleteFile, pipeFileContents } from "common/utils";
import { parseFileRenameFormat } from "./context";
import { mapConfigurationToFilterSettings } from "./profile";
import { filter, map, throttleTime } from "rxjs/operators";

export enum FindComboOption {
    Combos = 0,
    Conversions = 1,
    ButtonInputs = 2,
}

const defaultButtonInputOptions: ButtonInputOptions = {
    buttonCombo: [Input.L, Input.R, Input.Z],  // Use the default schlippi command
    preInputFrames: 1200,                      // 20 seconds
    postInputFrames: 120,                      // 2 seconds
    captureLockoutMs: 5000,                    // 5 seconds
    holdDurationFrames: 1,
};

interface ButtonInputOptions {
    buttonCombo: Input[];
    holdDurationFrames?: number;
    preInputFrames: number;
    postInputFrames: number;
    captureLockoutMs: number;  // Milliseconds between input capture
}

interface FileProcessorOptions {
    filesPath: string;
    renameFiles: boolean;
    findCombos: boolean;
    findComboProfile?: string;
    findComboOption?: FindComboOption;
    includeSubFolders?: boolean;
    deleteZeroComboFiles?: boolean;
    outputFile?: string;
    renameTemplate?: string;
}

interface ProcessOutput {
    combosFound: number;
    filesProcessed: number;
    timeTaken: number; // in seconds
}

const uniqueFilename = (name: string) => {
    const randomSuffix = Math.random().toString(36).slice(2).substring(0, 5);
    const onlyExt = path.extname(name);
    const onlyFilename = path.basename(name, onlyExt);
    const dir = path.dirname(name);
    return path.join(dir, `${onlyFilename}_${randomSuffix}${onlyExt}`);
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
    // Make sure the directory exists
    await fs.ensureDir(path.dirname(newFullFilename));
    const exists = await fs.pathExists(newFullFilename);
    if (exists) {
        // Append a random suffix to the end to avoid conflicts
        newFullFilename = uniqueFilename(newFullFilename);
    }
    await fs.rename(currentFilename, newFullFilename);
    console.log(`Renamed ${currentFilename} to ${newFullFilename}`);
    // Return the new filename so we know how to further process it
    return newFullFilename;
};

export interface ProcessResult {
    numCombos?: number;
    newFilename?: string;
    fileDeleted?: boolean;
}

export class FileProcessor {
    private queue = new Array<DolphinPlaybackItem>();
    private stopRequested: boolean = false;
    private readonly realtime = new SlpRealTime();
    private readonly comboFilter = new ComboFilter();

    public stop(): void {
        this.stopRequested = true;
    }

    public async process(
        opts: FileProcessorOptions,
        callback?: (i: number, total: number, filename: string, data: ProcessResult) => void,
    ): Promise<ProcessOutput> {
        const before = new Date();  // Use this to track elapsed time
        this.stopRequested = false;
        this.queue = [];

        const patterns = ["**/*.slp"];
        const options = {
            absolute: true,
            cwd: opts.filesPath,
            onlyFiles: true,
            deep: opts.includeSubFolders ? undefined : 1,
        };

        if (opts.findCombos && opts.findComboProfile) {
            const { comboProfiles } = store.getState().slippi;
            const slippiSettings = comboProfiles[opts.findComboProfile];
            if (slippiSettings) {
                const converted = mapConfigurationToFilterSettings(JSON.parse(slippiSettings));
                this.comboFilter.updateSettings(converted);
            }
        }

        let filesProcessed = 0;
        const entries = await fg(patterns, options);
        for (const [i, filename] of (entries.entries())) {
            if (this.stopRequested) {
                break;
            }

            const res = await this._processFile(filename, opts);
            if (callback) {
                callback(i, entries.length, filename, res);
            }
            filesProcessed += 1;
        }

        // Write out files if we found combos
        let totalCombos = 0;
        if (opts.findCombos && opts.outputFile) {
            totalCombos = this.queue.length;
            const payload = generateDolphinQueuePayload(this.queue);
            await fs.writeFile(opts.outputFile, payload);
            console.log(`Wrote ${totalCombos} out to ${opts.outputFile}`);
        }

        // Return elapsed time and other stats
        const after = new Date();
        const millisElapsed = Math.abs(after.getTime() - before.getTime());
        return {
            timeTaken: millisElapsed / 1000,
            filesProcessed,
            combosFound: totalCombos,
        };
    }

    private async _processFile(filename: string, options: Partial<FileProcessorOptions>): Promise<ProcessResult> {
        console.log(`Processing file: ${filename}`);
        const res: ProcessResult = {};

        const game = new SlippiGame(filename);
        const settings = game.getSettings();
        const metadata = game.getMetadata();

        // Handle file renaming
        if (options.renameFiles && options.renameTemplate) {
            const fullFilename = path.basename(filename);
            res.newFilename = parseFileRenameFormat(options.renameTemplate, settings, metadata, fullFilename);
            filename = await renameFile(filename, res.newFilename);
        }

        // Handle combo finding
        if (options.findCombos && options.findComboOption) {
            const highlights$ = this._generateHighlightObservable(filename, options.findComboOption, metadata);
            res.numCombos = await this._findHighlights(filename, highlights$);
            // Delete the file if no combos were found
            if (options.deleteZeroComboFiles && res.numCombos === 0) {
                console.log(`No combos found in ${filename}. Deleting...`);
                await deleteFile(filename);
                res.fileDeleted = true;
            }
        }

        return res;
    }

    private _generateHighlightObservable(
        filename: string,
        findComboOption: FindComboOption,
        metadata?: any,
    ): Observable<DolphinPlaybackItem> {
        switch (findComboOption) {
            case FindComboOption.Combos:
                return this._findCombos(filename, this.realtime.combo.end$, metadata);
            case FindComboOption.Conversions:
                return this._findCombos(filename, this.realtime.combo.conversion$, metadata);
            case FindComboOption.ButtonInputs:
                return this._findButtonInputs(filename, defaultButtonInputOptions, metadata);
        }
    }

    /*
     * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
     */
    private _findButtonInputs(
        filename: string,
        inputOptions: ButtonInputOptions,
        metadata?: any,
    ): Observable<DolphinPlaybackItem> {
        const inputs$ = this.realtime.input.buttonCombo(inputOptions.buttonCombo, inputOptions.holdDurationFrames);
        return inputs$.pipe(
            throttleTime(inputOptions.captureLockoutMs),
            map(payload => {
                const formattedTime = moment(metadata.startAt).format("MM/DD/YY h:mm a");
                const consoleNick = metadata.consoleNick || "unknown";
                const startFrame = Math.max(Frames.FIRST, payload.frame - inputOptions.preInputFrames);
                const endFrame = payload.frame + inputOptions.postInputFrames;
                return {
                    path: filename,
                    startFrame,
                    endFrame,
                    gameStation: consoleNick,
                    gameStartAt: formattedTime,
                };
            }),
        );
    }

    /*
     * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
     */
    private _findCombos(
        filename: string,
        combos$: Observable<ComboEventPayload>,
        metadata?: any,
    ): Observable<DolphinPlaybackItem> {
        return combos$.pipe(
            filter(({ combo, settings }) => this.comboFilter.isCombo(combo, settings, metadata)),
            map(({ combo }) => {
                const formattedTime = moment(metadata.startAt).format("MM/DD/YY h:mm a");
                const consoleNick = metadata.consoleNick || "unknown";
                return {
                    path: filename,
                    combo,
                    gameStation: consoleNick,
                    gameStartAt: formattedTime,
                };
            }),
        );
    }

    /*
     * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
     */
    private async _findHighlights(filename: string, highlights$: Observable<DolphinPlaybackItem>): Promise<number> {
        const slpStream = new SlpStream({ singleGameMode: true });
        this.realtime.setStream(slpStream);

        const beforeCount = this.queue.length;
        const sub = highlights$.subscribe(payload =>  this.queue.push(payload));
        const count = this.queue.length - beforeCount;

        await pipeFileContents(filename, slpStream);
        console.log(`Found ${count} combos in ${filename}`);

        sub.unsubscribe();
        return count;
    }

}

export const fileProcessor = new FileProcessor();
