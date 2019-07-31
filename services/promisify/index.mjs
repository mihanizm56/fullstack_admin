import {
  readFile as nativeReadFile,
  mkdir as nativeMkdir,
  rename as nativeRename,
  lstat as nativeLstat
} from "fs";
import { promisify } from "util";

export const readFile = promisify(nativeReadFile);
export const mkdir = promisify(nativeMkdir);
export const rename = promisify(nativeRename);
export const lstat = promisify(nativeLstat);
