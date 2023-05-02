const { contactJoiSchema, favoriteJoiSchema } = require('./contacts');
const { userRegisterJoiSchema, userLoginJoiSchema, userVerifyEmailJoiSchema } = require('./users');

module.exports = {
  contactJoiSchema,
  favoriteJoiSchema,
  userRegisterJoiSchema,
  userLoginJoiSchema,
  userVerifyEmailJoiSchema,
};
