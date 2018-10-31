const createError = require('http-errors');
const express = require('express');
const session = require('express-session');
const pgSession = require('connect-pg-simple')(session);
const passport = require('passport');
require('./config/pass')(passport);
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const favicon = require('serve-favicon');
const enforce = require('express-sslify');


const indexRouter = require('./routes/index');
const loginRouter = require('./routes/login');
const logoutRouter = require('./routes/logout');
const registerRouter = require('./routes/register');
const kanjiRouter = require('./routes/kanji');
const searchRouter = require('./routes/search');
const noteRouter = require('./routes/note');
const dbPool = require('./database');


const app = express();

if (process.env.NODE_ENV === 'production') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }))
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))
app.use(session({
  store: new pgSession({
    pool: dbPool,
    tableName: 'session',
  }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 } // 30 days
}));
app.use(passport.initialize());
app.use(passport.session());
// store original request url for redirection after login/logout
app.use('*', (req, res, next) => {
  const url = req.originalUrl;
  if (url !== '/login' && url !== '/register' && url !== '/logout' && url !== '/note') {
    req.session.lastVisited = url;
  }
  next();
});
app.use('/', indexRouter);
app.use('/login', loginRouter);
app.use('/logout', logoutRouter)
app.use('/register', registerRouter);
app.use('/kanji', kanjiRouter);
app.use('/search', searchRouter);
app.use('/note', noteRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  const renderOptions = {
    title: '404 Not Found',
    message: 'The requested page was not found.',
  }
  res.status(404).render('404', renderOptions);
  // next(createError(404));
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
