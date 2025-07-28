const Joi = require("joi");

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    "string.base": "Title must be a string",
    "string.empty": "Title cannot be empty",
    "any.required": "Title is required",
  }),
  year: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required()
    .messages({
      "number.base": "Year must be a number",
      "number.integer": "Year must be an integer",
      "number.max": "Year cannot be in the future",
      "any.required": "Year is required",
    }),
  genre: Joi.string().required().messages({
    "string.base": "Genre must be a string",
    "string.empty": "Genre cannot be empty",
    "any.required": "Genre is required",
  }),
  performer: Joi.string().required().messages({
    "string.base": "Performer must be a string",
    "string.empty": "Performer cannot be empty",
    "any.required": "Performer is required",
  }),
  duration: Joi.number().integer().min(0).allow(null).messages({
    "number.base": "Duration must be a number",
    "number.integer": "Duration must be an integer",
    "number.min": "Duration cannot be negative",
  }),
  albumId: Joi.string().allow(null).messages({
    "string.base": "Album ID must be a string",
    "string.empty": "Album ID cannot be empty",
  }),
});

module.exports = { SongPayloadSchema };
