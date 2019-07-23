import {
  access as nativeAccess,
  readdir as nativeReaddir,
  readFile as nativeReadFile,
  writeFile as nativeWriteFile,
  mkdir as nativeMkdir,
  lstat as nativeLstat,
  rmdir as nativeRmdir,
  unlink as nativeUnlink,
  rename as nativeRename,
  stat as nativeStat
} from "fs";

import { promisify } from "util";

export const access = promisify(nativeAccess);
export const readdir = promisify(nativeReaddir);
export const readFile = promisify(nativeReadFile);
export const writeFile = promisify(nativeWriteFile);
export const mkdir = promisify(nativeMkdir);
export const lstat = promisify(nativeLstat);
export const rmdir = promisify(nativeRmdir);
export const unlink = promisify(nativeUnlink);
export const stat = promisify(nativeRename);
export const rename = promisify(nativeStat);
