var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')
var blogRouter = require('./routes');
var Sequelize = require('sequelize');
var SequelizeStore = require('connect-session-sequelize')(session.Store);
require('dotenv').config();
var app = express();

//Connection string
// const sequelize = new Sequelize(process.env.POSTGRES_DATABASE, process.env.POSTGRES_USER, process.env.POSTGRES_PASSWORD, {
//   host: 'localhost',
//   dialect: 'postgres',
//   storage: './session.postgres'
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

//Session
// app.use(session({
//   store: new SequelizeStore({
//       db: sequelize,
//       checkExpirationInterval: 15 * 60 * 1000, // The interval at which to cleanup expired sessions in milliseconds.
//       expiration: 7 * 24 * 60 * 60 * 1000 // The maximum age (in milliseconds) of a valid session.
//   }),
//   secret: 'slayer',
//   saveUnitialized: true,
//   resave: false
// }));
app.use('/public',express.static(path.join(__dirname, 'public')));
app.use('/', blogRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
