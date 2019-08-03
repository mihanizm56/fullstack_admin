import jwt from "jsonwebtoken";

const jwt_secret_key = process.env.SECRET;
const timeAccessTokenExpires = process.env.TIME_TO_EXPIRE;

export const createToken = userId =>
  jwt.sign({ user: userId }, jwt_secret_key, {
    expiresIn: `${timeAccessTokenExpires}h`
  });

export const tokenVerify = (token, callback) =>
  jwt.verify(token, jwt_secret_key, callback);
