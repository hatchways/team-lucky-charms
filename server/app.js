const createError = require('http-errors');
const express = require('express');
const { join } = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const mongoose = require('mongoose');

// config
const { MONGODB_CON_STR } = require('./config');

// routes
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const imageUploadRoutes = require('./routes/imageUploadRoutes');

const { json, urlencoded } = express;

var app = express();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

app.use(authRoutes);
app.use('/api/projects/', projectRoutes);
app.use('/api/projects/', imageUploadRoutes);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ error: err });
});

mongoose
  .connect(MONGODB_CON_STR, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: false,
  })
  .then(() => {
    console.log('database connected');
  })
  .catch(() => {
    console.log('There was an error connecting to the database');
  });

module.exports = app;
