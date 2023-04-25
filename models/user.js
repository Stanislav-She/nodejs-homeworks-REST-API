const { hashSync, genSaltSync, compareSync } = require('bcryptjs');
const { Schema, model } = require('mongoose');

const userSchema = new Schema({
  password: {
    type: String,
    required: [true, 'Set password for user'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  },
  subscription: {
    type: String,
    enum: ['starter', 'pro', 'business'],
    default: 'starter',
  },
  token: String,
  avatarURL: String,
});

userSchema.methods.setPassword = function (password) {
  this.password = hashSync(password, genSaltSync(10));
};
userSchema.methods.comparePassword = function (password) {
  return compareSync(password, this.password);
};

const User = model('user', userSchema);

module.exports = User;
