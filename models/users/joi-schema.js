const Joi = require("@hapi/joi");

module.exports = Joi.object().keys({
  username: Joi.string()
    .min(1)
    .max(20)
    .required(),
  firstName: Joi.string()
    .min(0)
    .max(20),
  surName: Joi.string()
    .min(0)
    .max(20),
  middleName: Joi.string()
    .min(0)
    .max(20),
  password: Joi.string()
    .min(1)
    .max(20)
    .required(),
  permission: Joi.object(),
  image: Joi.string().allow("")
});
