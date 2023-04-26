const ctrlWrapper = require('./ctrlWrapper');
const validation = require('./validation');
const notFound = require('./notFound');
const globalErrorHandler = require('./globalErrorHandler');
const auth = require('./auth');
const upload = require('./upload');

module.exports = { ctrlWrapper, validation, notFound, globalErrorHandler, auth, upload };
