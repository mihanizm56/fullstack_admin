const Joi = require("@hapi/joi");

module.exports = Joi.object().keys({
  theme: Joi.string()
    .min(1)
    .max(40)
    .required(),
  text: Joi.string()
    .min(1)
    .max(220)
    .required(),
  userId: Joi.string().required(),
  date: Joi.date()
});
