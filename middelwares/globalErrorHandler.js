const globalErrorHandler = (err, req, res, next) => {
  const { statusCode = 500 } = err;
  res.status(statusCode).json({ message: err.message });
};

module.exports = globalErrorHandler;
