const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required().messages({
    'string.base': 'Judul harus berupa string',
    'string.empty': 'Judul tidak boleh kosong',
    'any.required': 'Judul wajib diisi',
  }),
  year: Joi.number()
    .integer()
    .max(new Date().getFullYear())
    .required()
    .messages({
      'number.base': 'Tahun harus berupa angka',
      'number.integer': 'Tahun harus berupa integer',
      'number.max': 'Tahun tidak boleh berada di masa depan',
      'any.required': 'Tahun wajib diisi',
    }),
  genre: Joi.string().required().messages({
    'string.base': 'Genre harus berupa string',
    'string.empty': 'Genre tidak boleh kosong',
    'any.required': 'Genre wajib diisi',
  }),
  performer: Joi.string().required().messages({
    'string.base': 'Performer harus berupa string',
    'string.empty': 'Performer tidak boleh kosong',
    'any.required': 'Performer wajib diisi',
  }),
  duration: Joi.number().integer().min(0).allow(null).messages({
    'number.base': 'Durasi harus berupa angka',
    'number.integer': 'Durasi harus berupa integer',
    'number.min': 'Durasi tidak boleh negatif',
  }),
  albumId: Joi.string().allow(null).messages({
    'string.base': 'ID album harus berupa string',
    'string.empty': 'ID album tidak boleh kosong',
  }),
});

module.exports = { SongPayloadSchema };
