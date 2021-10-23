// File processor worker

import type { FileProcessorOptions, ProcessOutput, ProcessResult } from "common/fileProcessor";
import { FileProcessor } from "common/fileProcessor";
import { delay } from "common/utils";

export interface ProgressingPayload {
  index: number;
  total: number;
  filename: string;
  result: ProcessResult;
  options: FileProcessorOptions;
}
export interface CompletePayload {
  result: ProcessOutput;
  options: FileProcessorOptions;
}

const fileProcessor = new FileProcessor();

export async function startFileProcessor(
  options: FileProcessorOptions,
  callback: (payload: ProgressingPayload) => void
): Promise<CompletePayload> {
  // If we're in the middle of processing, return busy
  if (fileProcessor.isProcessing()) {
    throw new Error("File processor is already running!");
  }

  // Start the processing
  try {
    const result = await fileProcessor.process(options, async (i, total, filename, data) => {
      const progressingPayload = {
        index: i,
        total,
        filename,
        result: data,
        options,
      };
      callback(progressingPayload);
      // We need to introduce some sort of delay otherwise the stop signal doesn't get sent
      // It seems like the `fileProcessor.process()` command will just block all the messages
      // from being received. By adding some delay, the worker thread can actually handle
      // the stop command signal.
      await delay(5);
    });
    return {
      result,
      options,
    };
  } catch (err) {
    fileProcessor.reset();
    throw new Error(err);
  }
}

export async function stopFileProcessor(): Promise<void> {
  fileProcessor.stop();
}

export async function fileProcessorIsBusy(): Promise<boolean> {
  return fileProcessor.isProcessing();
}
