import { FileProcessorOptions, ProcessResult, ProcessOutput } from "common/fileProcessor";

export enum FileProcessorWorkerMessage {
    PROGRESS = "PROGRESS",
    BUSY = "BUSY",
    COMPLETE = "COMPLETE",
}

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

export enum FileProcessorParentMessage {
    START = "START",
    STOP = "STOP",
}

export interface StartProcessingPayload {
    options: FileProcessorOptions;
}
