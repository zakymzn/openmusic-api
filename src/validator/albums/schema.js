const Joi = require("joi");

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "string.base": "Name must be a string",
    "string.empty": "Name cannot be empty",
    "any.required": "Name is required",
  }),
  year: Joi.number()
    .integer()
    .min(1900)
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.min": "Year must be greater than or equal to 1900",
      "number.max": `Year cannot be in the future`,
      "any.required": "Year is required",
    }),
});

module.exports = { AlbumPayloadSchema };
