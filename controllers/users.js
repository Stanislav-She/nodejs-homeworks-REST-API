const jwt = require('jsonwebtoken');
const gravatar = require('gravatar');
const path = require('path');
const fs = require('fs').promises;
const Jimp = require('jimp');
const { v4 } = require('uuid');
const { User } = require('../models');
const { HttpError } = require('../utils');
const { sendEmail } = require('../utils');

const { JWT_SECRET, JWT_EXPIRES } = process.env;

const avatarsPath = path.join(__dirname, '../', 'public', 'avatars');

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, 'Email in use');
  }
  const avatarURL = gravatar.url(email, { s: '250', d: 'identicon' });
  const verificationToken = v4();
  const newUser = new User({ email, subscription, avatarURL, verificationToken });

  newUser.setPassword(password);
  await newUser.save();

  await sendEmail(email, verificationToken);
  res.status(201).json({
    user: {
      email,
      subscription,
      avatarURL,
      verificationToken,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password) || !user.verify) {
    throw new HttpError(401, 'Email is wrong or not verify, or password is wrong');
  }
  const payload = {
    id: user._id,
  };
  const token = jwt.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRES });
  await User.findByIdAndUpdate(user._id, { token });
  res.status(200).json({
    token,
    user: {
      email,
      subscription: user.subscription,
    },
  });
};

const logout = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: null });
  res.status(204).json();
};

const getCurrent = async (req, res) => {
  const { email, subscription } = req.user;
  res.status(200).json({ email, subscription });
};

const updateSubscription = async (req, res) => {
  const { _id } = req.user;
  const { subscription } = req.body;

  const subscriptionArr = ['starter', 'pro', 'business'];

  if (!subscriptionArr.includes(subscription)) {
    throw new HttpError(400, `Subscription must be one of 'starter', 'pro', 'business'`);
  }

  const updateUser = await User.findByIdAndUpdate(_id, { subscription }, { new: true });

  res.status(200).json(updateUser);
};

const updateAvatar = async (req, res) => {
  const { path: tmpPath, originalname } = req.file;
  const { id } = req.user;

  await Jimp.read(tmpPath)
    .then(image => {
      return image.resize(250, 250).write(tmpPath);
    })
    .catch(err => {
      console.error(err);
      throw new HttpError(400, err.message);
    });

  const newAvatarName = `${id}_${originalname}`;

  try {
    const resultUpload = path.join(avatarsPath, newAvatarName);
    await fs.rename(tmpPath, resultUpload);
    const avatarURL = path.join('avatars', newAvatarName);
    await User.findByIdAndUpdate(id, { avatarURL });
    res.status(200).json({ avatarURL });
  } catch (error) {
    await fs.unlink(tmpPath);
    throw new HttpError(401, 'Not authorized');
  }
};

const getVerifyEmail = async (req, res) => {
  const { verificationToken } = req.params;
  const user = await User.findOne({ verificationToken });
  if (!user) throw new HttpError(404, 'User not found');
  await User.findByIdAndUpdate(user._id, { verify: true, verificationToken: null });
  res.status(200).json({ message: 'Verification successful' });
};

const resendVerifyEmail = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    throw new HttpError(400, 'missing required field email');
  }
  const user = await User.findOne({ email });
  if (!user) {
    throw HttpError(404, 'User not found');
  }
  if (user.verify) {
    throw new HttpError(400, 'Verification has already been passed');
  }

  await sendEmail(email, user.verificationToken);
  res.status(200).json({
    message: 'Verification email sent',
  });
};

module.exports = {
  register,
  login,
  logout,
  getCurrent,
  updateSubscription,
  updateAvatar,
  getVerifyEmail,
  resendVerifyEmail,
};
