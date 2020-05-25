// Worker.ts
// import fs from "fs-extra";

import { FileProcessor, FileProcessorOptions, ProcessOutput, ProcessResult } from "../fileProcessor";
import {
  FileProcessorParentMessage,
  FileProcessorWorkerMessage,
  ProgressingPayload,
  StartProcessingPayload,
} from "./fileProcessor.worker.types";

const fileProcessor = new FileProcessor();

// const readFiles = async (dir: string) => {
//     return await fs.readdir(dir);
// };

const startProcessing = async (options: FileProcessorOptions): Promise<ProcessOutput> => {
  const callback = (index: number, total: number, filename: string, result: ProcessResult): void => {
    const payload: ProgressingPayload = {
      index,
      total,
      filename,
      result,
      options,
    };
    ctx.postMessage({
      type: FileProcessorWorkerMessage.PROGRESS,
      payload,
    });
  };
  return fileProcessor.process(options, callback);
};

// Worker.ts
const ctx: Worker = self as any;

// Post data to parent thread
// ctx.postMessage({ foo: "foo" });

// Respond to message from parent thread
ctx.addEventListener("message", async (event) => {
  console.log("got message from parent. event data:");
  console.log(event.data);
  const eventType = event.data.type as FileProcessorParentMessage;
  switch (eventType) {
    case FileProcessorParentMessage.START:
      // If we're in the middle of processing, return busy
      if (fileProcessor.isProcessing()) {
        ctx.postMessage({
          type: FileProcessorWorkerMessage.BUSY,
        });
        return;
      }

      // Start the processing
      const startPayload = event.data.payload as StartProcessingPayload;
      const result = await startProcessing(startPayload.options);
      ctx.postMessage({
        type: FileProcessorWorkerMessage.COMPLETE,
        payload: {
          result,
          options: startPayload.options,
        },
      });
      break;
    case FileProcessorParentMessage.STOP:
      fileProcessor.stop();
      break;
  }
  // const res = await readFiles(".");
  // console.log(res);
});
