const jwt = require("jsonwebtoken");
const { User } = require("../models");
const { HttpError } = require("../utils");

const auth = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  try {
    if (bearer !== "Bearer") throw new HttpError(401, "Not authorized");

    const { id } = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(id);
    if (!user || !user.token) throw new HttpError(401, "Not authorized");
    req.user = user;
    next();
  } catch (error) {
    if (error.message === "Invalid signature") {
      error.status = 401;
    }
    next(error);
  }
};

module.exports = auth;
