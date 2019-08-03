import Joi from "@hapi/joi";
import newsSchema from "../../../models/news/joi-schema.mjs";

export const validateNews = ({ theme, date, text, userId }) => {
  return Joi.validate({ theme, date, text, userId }, newsSchema);
};
