const validation = schema => {
  return (req, res, next) => {
    const { error } = schema.validate(req.body);
    if (error) {
      error.statusCode = 400;
      return next(error);
    }
    next();
  };
};

module.exports = validation;
