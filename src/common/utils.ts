import fs from "fs-extra";
import path from "path";
import trash from "trash";

import { EOL } from "os";

export const isDevelopment = process.env.NODE_ENV !== "production";

export const isMacOrWindows = process.platform === "darwin" || process.platform === "win32";

export const delay = async (ms: number): Promise<void> => {
  await new Promise((resolve) => setTimeout(resolve, ms));
};

export const readFile = async (filePath: string): Promise<Buffer> => {
  const buffer = await fs.readFile(filePath);
  return buffer;
};

export const secondsToString = (seconds: number): string => {
  if (seconds < 1) {
    return "under a second";
  }
  return millisToString(seconds * 1000);
};

export const millisToString = (millis: number): string => {
  const date = new Date(millis);
  const days = date.getUTCDate() - 1;
  const hours = date.getUTCHours();
  const minutes = date.getUTCMinutes();
  const seconds = date.getUTCSeconds();
  // const millis =  date.getUTCMilliseconds();
  const strParts = new Array<string>();
  if (days > 0) {
    strParts.push(`${days} days`);
  }
  if (hours > 0) {
    strParts.push(`${hours} hours`);
  }
  if (minutes > 0) {
    strParts.push(`${minutes} minutes`);
  }
  if (seconds > 0) {
    strParts.push(`${seconds} seconds`);
  }
  return strParts.join(", ");
};

export const timeDifferenceString = (before: Date, after: Date): string => {
  const diff = Math.abs(after.getTime() - before.getTime());
  return millisToString(diff);
};

export const deleteFile = async (filepath: string, permanent?: boolean): Promise<void> => {
  if (permanent) {
    return fs.unlink(filepath);
  }
  return trash(filepath);
};

export const writeFile = async (contents: string, filename: string, append?: boolean): Promise<void> => {
  await fs.outputFile(filename, contents + EOL, { flag: append ? "a" : "w" });
};

/**
 * Shuffles array in place. ES6 version
 *
 * Taken from: https://stackoverflow.com/a/6274381
 * @param {Array} a items An array containing the items.
 */
export const shuffle = (a: any[]) => {
  let j: number;
  let x: any;
  for (let i = a.length - 1; i > 0; i--) {
    j = Math.floor(Math.random() * (i + 1));
    x = a[i];
    a[i] = a[j];
    a[j] = x;
  }
  return a;
};

export const onlyFilename = (filepath: string): string => {
  const onlyExt = path.extname(filepath);
  return path.basename(filepath, onlyExt);
};

export const assertExtension = (filename: string, extension: string): string => {
  const onlyExt = path.extname(filename);
  if (onlyExt !== extension) {
    return filename + extension;
  }
  return filename;
};

export const parseSecondsDelayValue = (defaultSeconds: number, delaySeconds?: string): number => {
  let seconds = parseInt(delaySeconds || defaultSeconds.toString(), 10);
  if (isNaN(seconds)) {
    seconds = defaultSeconds;
  }
  return seconds;
};

export const capitalize = (s: string) => {
  return s.charAt(0).toUpperCase() + s.slice(1);
};

export const framesToMillis = (frames: number): number => {
  return framesToSeconds(frames) * 1000;
};

export const framesToSeconds = (frames: number): number => {
  return frames / 60.0;
};

export const secondsToFrames = (secs: number): number => {
  return secs * 60.0;
};

export const millisToFrames = (ms: number): number => {
  return secondsToFrames(ms / 1000);
};
