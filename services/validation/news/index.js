const Joi = require("@hapi/joi");
const newsSchema = require("../../../models/news/joi-schema");

const validateNews = ({ theme, date, text, userId }) => {
  return Joi.validate({ theme, date, text, userId }, newsSchema);
};

module.exports = { validateNews };
