import Joi from "@hapi/joi";
import userSchema from "../../../models/users/joi-schema";

export const validateUser = ({
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
