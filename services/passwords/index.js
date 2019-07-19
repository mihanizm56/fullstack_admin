const crypto = require("crypto");
const salt = process.env.SALT;

/// func to hash the password
module.exports.makeHashedPassword = purePassword =>
  crypto.pbkdf2Sync(purePassword, salt, 1000, 64, "sha512");

/// func to compare two hashed passwords
module.exports.compareHashedPasswords = (passwordOne, passwordTwo) =>
  passwordOne.toString() === passwordTwo.toString();
