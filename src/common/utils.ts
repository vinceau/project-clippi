import fs from "fs-extra";
import path from "path";
import filenamify from "filenamify";
import filenameReservedRegex from "filename-reserved-regex";

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

export const writeFile = async (contents: string, filename: string, append?: boolean): Promise<void> => {
  await fs.outputFile(filename, contents + EOL, { flag: append ? "a" : "w" });
};

/**
 * Shuffles array in place. ES6 version
 *
 * Taken from: https://stackoverflow.com/a/6274381
 * @param {Array} a items An array containing the items.
 */
export const shuffle = <T>(a: T[]): T[] => {
  let j: number;
  let x: T;
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

export const capitalize = (s: string): string => {
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

export const sanitizeFilename = (name: string, replacement = "."): string => {
  return filenamify(name, {
    replacement,
  });
};

export const invalidFilename = (name: string, options?: { allowPaths?: boolean }): boolean => {
  if (options && options.allowPaths) {
    // Check if any parts of the folder path are invalid
    return path
      .normalize(name) // Make sure the path separators are correct
      .split(path.sep) // Split on each path component
      .filter((p) => p.length > 0) // Make sure we have something to check
      .some((p) => !validFilename(p)); // Check if any of them are invalid
  }

  return !validFilename(name);
};

// Based on code from: https://github.com/sindresorhus/valid-filename
// Checks for filename validity but without the length check
const validFilename = (name: string): boolean => {
  if (!name) {
    return false;
  }
  if (filenameReservedRegex().test(name) || filenameReservedRegex.windowsNames().test(name)) {
    return false;
  }
  if (/^\.\.?$/.test(name)) {
    return false;
  }
  return true;
};
