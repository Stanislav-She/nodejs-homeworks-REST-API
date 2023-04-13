const globalErrorHandler = (err, req, res, next) => {
  const { status = 500 } = err;
  res.status(status).json({ message: err.message });
};

module.exports = globalErrorHandler;
