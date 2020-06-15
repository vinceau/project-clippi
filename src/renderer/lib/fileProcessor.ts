import path from "path";

import Worker from "worker-loader!common/workers/fileProcessor.worker";

import { dispatcher, store } from "@/store";
import { FileProcessorOptions, ComboOptions } from "common/fileProcessor";
import { secondsToString } from "common/utils";
import {
  CompletePayload,
  FileProcessorParentMessage,
  FileProcessorWorkerMessage,
  ProgressingPayload,
  ErrorPayload,
} from "common/workers/fileProcessor.worker.types";
import { openComboInDolphin } from "./dolphin";
import { notify } from "./utils";
import { toastProcessingError } from "./toasts";
import { shell } from "electron";

const worker = new Worker();

worker.onmessage = (event) => {
  console.log(`got message from worker! payload:`);
  console.log(event.data);
  const eventType = event.data.type as FileProcessorWorkerMessage;
  switch (eventType) {
    case FileProcessorWorkerMessage.PROGRESS:
      const progressPayload: ProgressingPayload = event.data.payload;
      handleProgress(progressPayload);
      break;
    case FileProcessorWorkerMessage.BUSY:
      break;
    case FileProcessorWorkerMessage.ERROR:
      const errorPayload: ErrorPayload = event.data.payload;
      handleError(errorPayload);
      break;
    case FileProcessorWorkerMessage.COMPLETE:
      const completePayload: CompletePayload = event.data.payload;
      handleComplete(completePayload);
      break;
  }
};

const handleProgress = (payload: ProgressingPayload): void => {
  const { result, total, filename, options, index } = payload;
  dispatcher.tempContainer.setPercent(Math.floor(((index + 1) / total) * 100));
  if (options.findComboOption) {
    const config = payload.options.config as ComboOptions;
    const base = path.basename(result.filename || filename);
    if (result.numCombos === 0 && config.deleteZeroComboFiles) {
      shell.moveItemToTrash(result.filename);
      dispatcher.tempContainer.setComboLog(`Deleted: ${base}`);
    } else {
      dispatcher.tempContainer.setComboLog(`Found ${result.numCombos} highlights in: ${base}`);
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
  console.log(`finished generating ${numCombos} highlights in ${timeTakenStr}`);
  let message = `Processed ${result.filesProcessed} files in ${timeTakenStr}`;
  if (options.findComboOption) {
    message += ` and found ${numCombos} highlights`;
  }
  dispatcher.tempContainer.setComboFinderProcessing(false);
  dispatcher.tempContainer.setPercent(100);
  dispatcher.tempContainer.setComboLog(message);
  if (openCombosWhenDone && options.outputFile) {
    // check if we want to open the combo file after generation
    openComboInDolphin(options.outputFile).catch((err) => {
      console.error(err);
      notify("Error loading Dolphin. Ensure you have the Slippi Desktop app installed and try again.");
    });
  } else {
    notify(message, `Highlight processing complete`);
  }
};

const handleError = (payload: ErrorPayload): void => {
  const { message } = payload;
  dispatcher.tempContainer.setComboFinderProcessing(false);
  notify(message, "An error occurred during processing");
  toastProcessingError(message);
};

export const startProcessing = (options: FileProcessorOptions): void => {
  console.log(options);
  // Reset processing state
  dispatcher.tempContainer.setPercent(0);
  dispatcher.tempContainer.setComboLog("");
  dispatcher.tempContainer.setComboFinderProcessing(true);
  worker.postMessage({
    type: FileProcessorParentMessage.START,
    payload: { options },
  });
};

export const stopProcessing = (): void => {
  worker.postMessage({
    type: FileProcessorParentMessage.STOP,
  });
};
