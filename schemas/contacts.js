const Joi = require('joi');

const contactJoiSchema = Joi.object({
  name: Joi.string().alphanum().required(),
  email: Joi.string()
    .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
    .required(),
  phone: Joi.number().integer().min(10).required(),
  favorite: Joi.boolean(),
});

const favoriteJoiSchema = Joi.object({
  favorite: Joi.boolean().required(),
});

module.exports = { contactJoiSchema, favoriteJoiSchema };
