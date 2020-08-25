import path from "path";

import moment from "moment";

import fg from "fast-glob";
import fs from "fs-extra";

import {
  checkCombo,
  ComboEventPayload,
  ComboFilterSettings,
  defaultComboFilterSettings,
  DolphinPlaybackItem,
  Frames,
  extractPlayerNames,
  generateDolphinQueuePayload,
  Input,
  SlippiGame,
  Metadata,
  throttleInputButtons,
  FrameEntryType,
  forAllPlayerIndices,
  mapFramesToButtonInputs,
  namesMatch,
  GameStartType,
  Character,
} from "@vinceau/slp-realtime";
import { Observable, from } from "rxjs";
import { map } from "rxjs/operators";

import { parseFileRenameFormat } from "./context";
import { assertExtension, millisToFrames } from "./utils";

const SLP_FILE_EXT = ".slp";

export enum FindComboOption {
  COMBOS = "COMBOS",
  CONVERSIONS = "CONVERSIONS",
  BUTTON_INPUTS = "BUTTON_INPUTS",
}

const defaultButtonInputOptions: ButtonInputOptions = {
  buttonCombo: [Input.L, Input.R, Input.Z], // Use the default schlippi command
  preInputFrames: 1200, // 20 seconds
  postInputFrames: 120, // 2 seconds
  captureLockoutMs: 5000, // 5 seconds
  holdDurationFrames: 1,
};

export interface ButtonInputOptions {
  buttonCombo: Input[];
  holdDurationFrames?: number;
  preInputFrames: number;
  postInputFrames: number;
  captureLockoutMs: number; // Milliseconds between input capture
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
  totalErrors: number;
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
  hasError?: boolean;
  filename: string;
  numCombos: number;
  totalCombosFound: number;
}

export class FileProcessor {
  private queue = new Array<DolphinPlaybackItem>();
  private stopRequested = false;
  // private readonly realtime = new SlpRealTime();
  private processing = false;
  private result: ProcessResult | null = null;

  public isProcessing(): boolean {
    return this.processing;
  }

  public reset(): void {
    this.processing = false;
    this.stopRequested = false;
  }

  public stop(): void {
    this.stopRequested = true;
  }

  public async process(
    opts: FileProcessorOptions,
    callback?: (i: number, total: number, filename: string, data: ProcessResult) => Promise<boolean | void>
  ): Promise<ProcessOutput> {
    this.processing = true;
    const before = new Date(); // Use this to track elapsed time
    this.stopRequested = false;
    this.queue = [];

    const patterns = [`**/*${SLP_FILE_EXT}`];
    const options = {
      absolute: true,
      cwd: opts.filesPath,
      onlyFiles: true,
      deep: opts.includeSubFolders ? undefined : 1,
      // We occasionally get EPERM errors when globbing in directories we don't have access to.
      suppressErrors: true,
    };

    let filesProcessed = 0;
    let totalErrors = 0;
    const entries = await fg(patterns, options);
    for (const [i, fn] of entries.entries()) {
      // Coerce slashes to match operating system. By default fast glob returns unix style paths.
      const filename = path.resolve(fn);
      if (this.stopRequested) {
        break;
      }

      // Keep track of the results
      this.result = {
        filename,
        numCombos: 0,
        totalCombosFound: this.queue.length,
      };

      try {
        await this._processFile(filename, opts);
        // Increment only if we successfully processed the file
        filesProcessed += 1;
      } catch (err) {
        console.error(err);
        // Keep track of how many files errored
        totalErrors += 1;
        this.result.hasError = true;
      }

      if (callback) {
        const shouldStop = await callback(i, entries.length, filename, this.result);
        if (shouldStop) {
          break;
        }
      }
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
    this.result = null;
    return {
      timeTaken: millisElapsed / 1000,
      filesProcessed,
      totalErrors,
      combosFound: totalCombos,
      stopRequested: this.stopRequested,
    };
  }

  private async _processFile(filename: string, options: FileProcessorOptions): Promise<void> {
    console.log(`Processing file: ${filename}`);
    const res = this.result as ProcessResult;

    const game = new SlippiGame(filename);
    const settings = game.getSettings();
    if (!settings) {
      throw new Error(`Could not process ${filename}. Invalid SLP file`);
    }
    const metadata = game.getMetadata();

    // Handle file renaming
    if (options.renameFiles && options.renameTemplate) {
      const fullFilename = path.basename(filename);
      // Update the filename
      res.filename = parseFileRenameFormat(options.renameTemplate, settings, metadata, fullFilename);
      res.filename = assertExtension(res.filename, SLP_FILE_EXT);
      filename = await renameFile(filename, res.filename);
    }

    // Handle combo finding
    if (options.findComboOption && !canShortCircuit(options, settings, metadata)) {
      const highlights$ = this._generateHighlightObservable(filename, options.findComboOption, options.config).pipe(
        map((highlight) => populateHighlightMetadata(highlight, metadata))
      );
      res.numCombos = await this._findHighlights(filename, highlights$);
    }

    // Update the total combos found
    res.totalCombosFound = this.queue.length;
  }

  private _generateHighlightObservable(
    filename: string,
    findComboOption: FindComboOption,
    config: Partial<ButtonInputOptions> | ComboOptions
  ): Observable<DolphinPlaybackItem> {
    // Redeclare the Slippi game here instead of passing it in as a parameter
    // Fetching game info breaks if the file was renamed
    const game = new SlippiGame(filename);
    const settings = game.getSettings();
    const metadata = game.getMetadata();
    const stats = game.getStats();
    switch (findComboOption) {
      case FindComboOption.COMBOS:
        return this._findCombos(
          filename,
          stats.combos.map((c) => ({ combo: c, settings })),
          config as ComboOptions,
          metadata
        );
      case FindComboOption.CONVERSIONS:
        return this._findCombos(
          filename,
          stats.conversions.map((c) => ({ combo: c, settings })),
          config as ComboOptions,
          metadata
        );
      case FindComboOption.BUTTON_INPUTS:
        const allFrames = game.getFrames();
        function* framesInOrder() {
          let i = Frames.FIRST;
          while (allFrames[i]) {
            yield allFrames[i];
            i++;
          }
        }
        const framesList = Array.from(framesInOrder());
        return this._findButtonInputs(filename, framesList, config as Partial<ButtonInputOptions>);
    }
  }

  /*
   * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
   */
  private _findButtonInputs(
    filename: string,
    frames: FrameEntryType[],
    options: Partial<ButtonInputOptions>
  ): Observable<DolphinPlaybackItem> {
    const inputOptions = Object.assign({}, defaultButtonInputOptions, options);
    const frames$ = from(frames);
    // const inputs$ = this.realtime.input.buttonCombo(inputOptions.buttonCombo, inputOptions.holdDurationFrames);
    const inputs$ = forAllPlayerIndices((i) =>
      frames$.pipe(mapFramesToButtonInputs(i, inputOptions.buttonCombo, inputOptions.holdDurationFrames))
    );
    const lockoutFrames = millisToFrames(inputOptions.captureLockoutMs);
    return inputs$.pipe(
      throttleInputButtons(lockoutFrames),
      map(({ frame }) => {
        const startFrame = Math.max(Frames.FIRST, frame - inputOptions.preInputFrames);
        const endFrame = frame + inputOptions.postInputFrames;
        return {
          path: filename,
          startFrame,
          endFrame,
        };
      })
    );
  }

  /*
   * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
   */
  private _findCombos(
    filename: string,
    combos: ComboEventPayload[],
    comboOptions: ComboOptions,
    metadata?: Metadata
  ): Observable<DolphinPlaybackItem> {
    const comboSettings = Object.assign({}, defaultComboFilterSettings, comboOptions.findComboCriteria);
    const validCombos = combos
      .filter(({ combo, settings }) => checkCombo(comboSettings, combo, settings, metadata))
      .map(({ combo }) => ({
        path: filename,
        combo,
      }));
    return from(validCombos);
  }

  /*
   * Finds combos and adds them to the dolphin queue. Returns the number of combos found.
   */
  private async _findHighlights(filename: string, highlights$: Observable<DolphinPlaybackItem>): Promise<number> {
    // const slpStream = new SlpStream({ singleGameMode: true });
    // this.realtime.setStream(slpStream);

    const beforeCount = this.queue.length;
    const sub = highlights$.subscribe((payload) => this.queue.push(payload));

    // await pipeFileContents(filename, slpStream);
    sub.unsubscribe();

    const count = this.queue.length - beforeCount;
    console.log(`Found ${count} combos in ${filename}`);
    return count;
  }
}

// export const fileProcessor = new FileProcessor();

const populateHighlightMetadata = (highlight: DolphinPlaybackItem, metadata?: Metadata): DolphinPlaybackItem => {
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

/***
 * Returns true if we already know that combos will not match
 */
function canShortCircuit(options: FileProcessorOptions, settings: GameStartType, metadata?: any): boolean {
  // Can't short circuit button inputs for now
  if (options.findComboOption === FindComboOption.BUTTON_INPUTS) {
    return false;
  }

  // Skip processing if it's doubles
  if (settings.players.length !== 2) {
    return true;
  }

  const criteria = (options.config as ComboOptions).findComboCriteria;

  // Check if we're searching for characters
  if (criteria.characterFilter && criteria.characterFilter.length > 0) {
    const charsToFind = criteria.characterFilter as Character[];
    const inGameCharacters = settings.players
      .map((p) => p.characterId)
      .filter((char) => char !== null && char !== undefined) as Character[];
    if (!inGameCharacters.some((c) => charsToFind.includes(c))) {
      // Short circuit since characters don't match
      return true;
    }
  }

  // Check if we're searching for name tags
  if (criteria.nameTags && criteria.nameTags.length > 0) {
    const matchableNames = extractPlayerNames(settings, metadata);
    if (matchableNames.length === 0 || !namesMatch(criteria.nameTags, matchableNames)) {
      // We can short circuit since none of the names match
      return true;
    }
  }

  return false;
}
