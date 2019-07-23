import crypto from "crypto";
const salt = process.env.SALT;

/// func to hash the password
export const makeHashedPassword = purePassword =>
  crypto.pbkdf2Sync(purePassword, salt, 1000, 64, "sha512");

/// func to compare two hashed passwords
export const compareHashedPasswords = (passwordOne, passwordTwo) =>
  passwordOne.toString() === passwordTwo.toString();
