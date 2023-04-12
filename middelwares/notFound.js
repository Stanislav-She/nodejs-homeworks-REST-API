const notFound = (_, res) => {
  res.status(404).json({ message: 'Not found' });
};

module.exports = notFound;
