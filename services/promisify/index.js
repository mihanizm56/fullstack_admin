const {
  access,
  readdir,
  readFile,
  writeFile,
  mkdir,
  lstat,
  rmdir,
  unlink,
  rename,
  stat
} = require("fs");
const { promisify } = require("util");

module.exports.access = promisify(access);
module.exports.readdir = promisify(readdir);
module.exports.readFile = promisify(readFile);
module.exports.writeFile = promisify(writeFile);
module.exports.mkdir = promisify(mkdir);
module.exports.lstat = promisify(lstat);
module.exports.rmdir = promisify(rmdir);
module.exports.unlink = promisify(unlink);
module.exports.stat = promisify(stat);
module.exports.rename = promisify(rename);
