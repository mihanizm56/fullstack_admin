import {
  readFile as nativeReadFile,
  mkdir as nativeMkdir,
  rename as nativeRename,
  lstat as nativeLstat,
  unlink as nativeUnlink,
  access as nativeAccess
} from "fs";
import { promisify } from "util";

export const readFile = promisify(nativeReadFile);
export const mkdir = promisify(nativeMkdir);
export const rename = promisify(nativeRename);
export const lstat = promisify(nativeLstat);
export const unlink = promisify(nativeUnlink);
export const access = promisify(nativeAccess);
