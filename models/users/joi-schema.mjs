import Joi from "@hapi/joi";

export default Joi.object().keys({
  username: Joi.string()
    .min(1)
    .max(20)
    .required(),
  firstName: Joi.string()
    .min(0)
    .max(20)
    .allow(""),
  surName: Joi.string()
    .min(0)
    .max(20)
    .allow(""),
  middleName: Joi.string()
    .min(0)
    .max(20)
    .allow(""),
  password: Joi.string()
    .min(1)
    .max(20)
    .required(),
  permission: Joi.object(),
  image: Joi.string().allow("")
});
