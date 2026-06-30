const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().min(1).max(100).required(),
  email: Joi.string().email().required()
});

const updateSchema = Joi.object({
  name: Joi.string().min(1).max(100).optional(),
  email: Joi.string().email().optional()
}).or('name', 'email');

exports.create = createSchema;
exports.update = updateSchema;
