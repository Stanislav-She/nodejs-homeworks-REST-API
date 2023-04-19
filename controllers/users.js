const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { HttpError } = require("../utils");

const { JWT_SECRET, JWT_EXPIRES } = process.env;

const register = async (req, res) => {
  const { email, password, subscription } = req.body;
  const user = await User.findOne({ email });
  if (user) {
    throw new HttpError(409, "Email in use");
  }

  const newUser = new User({ email, subscription });
  newUser.setPassword(password);
  newUser.save();
  res.status(201).json({
    user: {
      email,
      subscription,
    },
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !user.comparePassword(password)) {
    throw new HttpError(401, "Email or password is wrong");
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

  const subscriptionArr = ["starter", "pro", "business"];

  if (!subscriptionArr.includes(subscription)) {
    throw new HttpError(
      400,
      `Subscription must be one of 'starter', 'pro', 'business'`
    );
  }

  const updateUser = await User.findByIdAndUpdate(
    _id,
    { subscription },
    { new: true }
  );

  res.status(200).json(updateUser);
};

module.exports = { register, login, logout, getCurrent, updateSubscription };
