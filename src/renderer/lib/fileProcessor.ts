import * as Comlink from "comlink";
import type { ComboOptions, FileProcessorOptions } from "common/fileProcessor";
import { secondsToString } from "common/utils";
import { shell } from "electron";
import log from "electron-log";
import path from "path";

import { dispatcher, store } from "@/store";
import type { CompletePayload, ProgressingPayload } from "@/workers/fileProcessor.worker";
import { fileProcessorIsBusy, startFileProcessor, stopFileProcessor } from "@/workers/fileProcessor.worker";

import { openComboInDolphin } from "./dolphin";
import { toastProcessingError } from "./toasts";
import { notify } from "./utils";

const handleProgress = (payload: ProgressingPayload): void => {
  const { result, total, filename, options, index } = payload;
  dispatcher.tempContainer.setPercent(Math.floor(((index + 1) / total) * 100));
  if (result.hasError) {
    dispatcher.tempContainer.setComboLog(`Error processing: ${result.filename}`);
    return;
  }

  if (options.findComboOption) {
    const config = payload.options.config as ComboOptions;
    const base = path.basename(result.filename || filename);
    if (result.numCombos === 0 && config.deleteZeroComboFiles) {
      const deleted = shell.moveItemToTrash(result.filename);
      if (deleted) {
        dispatcher.tempContainer.setComboLog(`Deleted: ${base}`);
      } else {
        const message = `Failed to delete file: ${result.filename}`;
        console.error(message);
        dispatcher.tempContainer.setComboLog(message);
      }
    } else {
      dispatcher.tempContainer.setComboLog(
        `Found ${result.numCombos} highlights in ${base}. Total: ${result.totalCombosFound} highlights.`
      );
    }
  } else if (options.renameFiles && result.filename) {
    dispatcher.tempContainer.setComboLog(`Renamed ${filename} to ${result.filename}`);
  }
};

const handleComplete = (payload: CompletePayload): void => {
  const { options, result } = payload;
  const timeTakenStr = secondsToString(result.timeTaken);
  const numCombos = result.combosFound;
  const { openCombosWhenDone } = store.getState().highlights;
  console.log(`Finished generating ${numCombos} highlights in ${timeTakenStr}`);
  let message = `Processed ${result.filesProcessed} files in ${timeTakenStr}`;
  if (options.findComboOption) {
    message += ` and found ${numCombos} highlights`;
  }
  if (result.totalErrors > 0) {
    message += `. ${result.totalErrors} files had errors.`;
  }

  dispatcher.tempContainer.setComboFinderProcessing(false);
  dispatcher.tempContainer.setPercent(100);
  dispatcher.tempContainer.setComboLog(message);

  // Check if we need to load the combo file into Dolphin after generation
  if (options.findComboOption && numCombos > 0 && openCombosWhenDone && options.outputFile) {
    openComboInDolphin(options.outputFile).catch((err) => {
      log.error(err);
      notify("Error loading Dolphin. Ensure you have the Slippi Launcher installed and try again.");
    });
  } else {
    notify(message, `Highlight processing complete`);
  }
};

const handleError = (message: string): void => {
  dispatcher.tempContainer.setComboFinderProcessing(false);
  notify(message, "An error occurred during processing");
  toastProcessingError(message);
};

export const startProcessing = async (options: FileProcessorOptions): Promise<void> => {
  // Ensure we're not already in the middle of processing
  const isBusy = await fileProcessorIsBusy();
  if (isBusy) {
    return;
  }

  console.log("Starting file processing with these options: ", options);

  // Reset processing state
  dispatcher.tempContainer.setPercent(0);
  dispatcher.tempContainer.setComboLog("");
  dispatcher.tempContainer.setComboFinderProcessing(true);

  try {
    const result = await startFileProcessor(options, Comlink.proxy(handleProgress));
    handleComplete(result);
  } catch (err) {
    console.error(err);
    handleError((err as Error).message);
  }
};

export const stopProcessing = async (): Promise<void> => {
  await stopFileProcessor();
};
