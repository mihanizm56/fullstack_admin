const Joi = require("@hapi/joi");
const userSchema = require("../../../models/users/joi-schema");

const validateUser = ({
  username,
  password,
  firstName,
  surName,
  middleName,
  permission,
  image
}) => {
  return Joi.validate(
    { username, password, firstName, surName, middleName, permission, image },
    userSchema
  );
};

module.exports = { validateUser };
