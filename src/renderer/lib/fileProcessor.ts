import path from "path";

import { dispatcher } from "@/store";
import { FileProcessorOptions, ProcessOutput, ComboOptions } from "common/fileProcessor";

import Worker from "worker-loader!common/workers/fileProcessor.worker";
import { FileProcessorParentMessage, FileProcessorWorkerMessage, ProgressingPayload, CompletePayload } from "common/workers/fileProcessor.worker.types";
import { secondsToString } from "common/utils";
import { notify } from "./utils";
import { openComboInDolphin } from "./dolphin";

const worker = new Worker();

worker.postMessage({ a: 1 });
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
        case FileProcessorWorkerMessage.COMPLETE:
            const completePayload: CompletePayload = event.data.payload;
            handleComplete(completePayload);
            break;
    }
};

const handleProgress = (payload: ProgressingPayload): void => {
    const { result, total, filename, options, index } = payload;
    dispatcher.tempContainer.setPercent(Math.floor((index + 1) / total * 100));
    if (options.findComboOption) {
        if (result.fileDeleted) {
            dispatcher.tempContainer.setComboLog(`Deleted ${filename}`);
        } else {
            const base = path.basename(result.newFilename || filename);
            dispatcher.tempContainer.setComboLog(`Found ${result.numCombos} highlights in: ${base}`);
        }
    } else if (options.renameFiles && result.newFilename) {
        dispatcher.tempContainer.setComboLog(`Renamed ${filename} to ${result.newFilename}`);
    }
};

const handleComplete = (payload: CompletePayload): void => {
    const { options, result } = payload;
    const timeTakenStr = secondsToString(result.timeTaken);
    const numCombos = result.combosFound;
    let openCombos = false;
    console.log(`finished generating ${numCombos} highlights in ${timeTakenStr}`);
    let message = `Processed ${result.filesProcessed} files in ${timeTakenStr}`;
    if (options.findComboOption) {
        message += ` and found ${numCombos} highlights`;
        openCombos = Boolean((options.config as ComboOptions).openCombosWhenDone);
    }
    dispatcher.tempContainer.setComboFinderProcessing(false);
    dispatcher.tempContainer.setPercent(100);
    dispatcher.tempContainer.setComboLog(message);
    notify(message, `Highlight processing complete`);
    if (openCombos && options.outputFile) {
        // check if we want to open the combo file after generation
        openComboInDolphin(options.outputFile);
    }
};

export const findAndWriteCombos = (options: FileProcessorOptions): void => {
    // const result = await fileProcessor.process(options);
    // return result;
    console.log(options);
    worker.postMessage({
        type: FileProcessorParentMessage.START,
        payload: { options },
    });
};
