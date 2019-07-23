import { tokenVerify } from "../../services/tokens/index.mjs";

export const cookieTokenAuth = (req, res, next) =>
  tokenVerify(req.cookies.access_token, (error, authData) => {
    if (!error && authData) {
      console.log("valid cookieTokenAuth");

      res.locals.userTokenData = authData;
      next();
    } else {
      res.status(401).send(false);
    }
  });
