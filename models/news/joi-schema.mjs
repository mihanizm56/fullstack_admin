import Joi from "@hapi/joi";

const newsSchema = Joi.object().keys({
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

export default newsSchema;
