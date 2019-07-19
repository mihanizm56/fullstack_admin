const { tokenVerify } = require("../../services/tokens");

const cookieTokenAuth = (req, res, next) =>
  tokenVerify(req.cookies.access_token, (error, authData) => {
    if (!error && authData) {
      res.locals.userTokenData = authData;
      next();
    } else {
      res.status(401).send(false);
    }
  });

module.exports = {
  cookieTokenAuth
};
