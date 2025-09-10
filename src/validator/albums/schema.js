const Joi = require('joi');

const AlbumPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.base': 'Nama harus berupa string',
    'string.empty': 'Nama tidak boleh kosong',
    'any.required': 'Nama wajib diisi',
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
});

module.exports = { AlbumPayloadSchema };
