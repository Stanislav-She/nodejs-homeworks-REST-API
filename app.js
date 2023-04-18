const express = require('express');
const logger = require('morgan');
const cors = require('cors');
const { notFound, globalErrorHandler } = require('./middelwares');

require('dotenv').config();

const contactsRouter = require('./routes/api/contacts');
const userRouter = require('./routes/api/users');

const app = express();

const formatsLogger = app.get('env') === 'development' ? 'dev' : 'short';

app.use(logger(formatsLogger));
app.use(cors());
app.use(express.json());

app.use('/api/users', userRouter);
app.use('/api/contacts', contactsRouter);

app.use(notFound);

app.use(globalErrorHandler);

module.exports = app;
