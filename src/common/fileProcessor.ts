import path from "path";

import moment from "moment";

import fg from "fast-glob";
import fs from "fs-extra";

import { checkCombo, ComboEventPayload, ComboFilterSettings, defaultComboFilterSettings, DolphinPlaybackItem, Frames, generateDolphinQueuePayload, Input, pipeFileContents, SlippiGame, SlpRealTime, SlpStream } from "@vinceau/slp-realtime";
import { Observable } from "rxjs";
import { filter, map, throttleTime } from "rxjs/operators";

import { parseFileRenameFormat } from "./context";
import { assertExtension, deleteFile } from "./utils";

export enum FindComboOption {
    COMBOS = "COMBOS",
    CONVERSIONS = "CONVERSIONS",
    BUTTON_INPUTS = "BUTTON_INPUTS",
}

const defaultButtonInputOptions: ButtonInputOptions = {
    buttonCombo: [Input.L, Input.R, Input.Z],  // Use the default schlippi command
    preInputFrames: 1200,                      // 20 seconds
    postInputFrames: 120,                      // 2 seconds
    captureLockoutMs: 5000,                    // 5 seconds
    holdDurationFrames: 1,
};

export interface ButtonInputOptions {
    buttonCombo: Input[];
    holdDurationFrames?: number;
    preInputFrames: number;
    postInputFrames: number;
    captureLockoutMs: number;  // Milliseconds between input capture
}

export interface ComboOptions {
    findComboCriteria: Partial<ComboFilterSettings>;
    deleteZeroComboFiles?: boolean;
}

export interface FileProcessorOptions {
    filesPath: string;
    renameFiles: boolean;
    findComboOption?: FindComboOption;
    includeSubFolders?: boolean;
    outputFile?: string;
    renameTemplate?: string;
    config: Partial<ButtonInputOptions> | ComboOptions;
}

export interface ProcessOutput {
    combosFound: number;
    filesProcessed: number;
    timeTaken: number; // in seconds
    stopRequested: boolean;
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
    private processing: boolean = false;

    public isProcessing(): boolean {
        return this.processing;
    }

    public stop(): void {
        this.stopRequested = true;
    }

    public async process(
        opts: FileProcessorOptions,
        callback?: (i: number, total: number, filename: string, data: ProcessResult) => void,
    ): Promise<ProcessOutput> {
        this.processing = true;
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
        if (opts.findComboOption && opts.outputFile) {
            totalCombos = this.queue.length;
            const payload = generateDolphinQueuePayload(this.queue);
            await fs.writeFile(opts.outputFile, payload);
            console.log(`Wrote ${totalCombos} out to ${opts.outputFile}`);
        }

        // Return elapsed time and other stats
        const after = new Date();
        const millisElapsed = Math.abs(after.getTime() - before.getTime());
        this.processing = false;
        return {
            timeTaken: millisElapsed / 1000,
            filesProcessed,
            combosFound: totalCombos,
            stopRequested: this.stopRequested,
        };
    }

    private async _processFile(filename: string, options: FileProcessorOptions): Promise<ProcessResult> {
        console.log(`Processing file: ${filename}`);
        console.log(options);
        const res: ProcessResult = {};

        const game = new SlippiGame(filename);
        const settings = game.getSettings();
        const metadata = game.getMetadata();

        // Handle file renaming
        if (options.renameFiles && options.renameTemplate) {
            const fullFilename = path.basename(filename);
            res.newFilename = parseFileRenameFormat(options.renameTemplate, settings, metadata, fullFilename);
            res.newFilename = assertExtension(res.newFilename, ".slp");
            filename = await renameFile(filename, res.newFilename);
        }

        // Handle combo finding
        if (options.findComboOption) {
            console.log("finding combos");
            const highlights$ = this._generateHighlightObservable(filename, options.findComboOption, options.config, metadata).pipe(
                map(highlight => populateHighlightMetadata(highlight, metadata)),
            );
            res.numCombos = await this._findHighlights(filename, highlights$);
            const config = options.config as ComboOptions;
            // Delete the file if no combos were found
            if (config.deleteZeroComboFiles && res.numCombos === 0) {
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
        config: Partial<ButtonInputOptions> | ComboOptions,
        metadata?: any,
    ): Observable<DolphinPlaybackItem> {
        switch (findComboOption) {
            case FindComboOption.COMBOS:
                return this._findCombos(filename, this.realtime.combo.end$, config as ComboOptions, metadata);
            case FindComboOption.CONVERSIONS:
                return this._findCombos(filename, this.realtime.combo.conversion$, config as ComboOptions, metadata);
            case FindComboOption.BUTTON_INPUTS:
                return this._findButtonInputs(filename, config as Partial<ButtonInputOptions>);
        }
    }

    /*
     * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
     */
    private _findButtonInputs(
        filename: string,
        options: Partial<ButtonInputOptions>,
    ): Observable<DolphinPlaybackItem> {
        const inputOptions = Object.assign({}, defaultButtonInputOptions, options);
        const inputs$ = this.realtime.input.buttonCombo(inputOptions.buttonCombo, inputOptions.holdDurationFrames);
        return inputs$.pipe(
            throttleTime(inputOptions.captureLockoutMs),
            map(({ frame }) => {
                const startFrame = Math.max(Frames.FIRST, frame - inputOptions.preInputFrames);
                const endFrame = frame + inputOptions.postInputFrames;
                return {
                    path: filename,
                    startFrame,
                    endFrame,
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
        comboOptions: ComboOptions,
        metadata?: any,
    ): Observable<DolphinPlaybackItem> {
        const comboSettings = Object.assign({}, defaultComboFilterSettings, comboOptions.findComboCriteria);
        return combos$.pipe(
            filter(({ combo, settings }) => checkCombo(comboSettings, combo, settings, metadata)),
            map(({ combo }) => ({
                path: filename,
                combo,
            })),
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

        await pipeFileContents(filename, slpStream);
        sub.unsubscribe();

        const count = this.queue.length - beforeCount;
        console.log(`Found ${count} combos in ${filename}`);
        return count;
    }

}

// export const fileProcessor = new FileProcessor();

const populateHighlightMetadata = (highlight: DolphinPlaybackItem, metadata?: any): DolphinPlaybackItem => {
    if (!metadata) {
        return highlight;
    }
    if (metadata.startAt) {
        highlight.gameStartAt = moment(metadata.startAt).format("MM/DD/YY h:mm a");
    }
    if (metadata.consoleNick) {
        highlight.gameStation = metadata.consoleNick;
    }
    return highlight;
};
