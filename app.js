const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');


// routers
const indexRouter = require('./routes/index');
const musiceditRouter = require('./routes/musicEdit');
const musicaddRouter = require('./routes/musicadd');
const musicDeleteRouter = require('./routes/musicDelete');
const musicRouter = require('./routes/music');
const usersRouter = require('./routes/users');

const app = express();

const flash = require('connect-flash');
const validator = require('express-validator');
const session = require('express-session');
const passport = require('passport')


// express-session
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
}))

//express-messaga

app.use(require('connect-flash')());
app.use(function (req, res, next){
  res.locals.messages = require('express-messages' ) (req, res);
  next();
})

// express-validator

app.use(validator({
  errorFormatter: (param, msg, value) => {
    let namespace = param.split('.'),
    root = namespace.shift(),
    formParam = root

    while(namespace.lenght){
      formParam += '[' + namespace.shift() + ']';
    }
    return{
      param : formParam,
      msg : msg,
      value: value
    }
  }
}))

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// mongodb

const db2 = require('./db/db');

const mongoose = require('mongoose');
// const passport = require('./db/passport');

mongoose.connect(db2.db, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  // useCreateIndex: true,
});


const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('Mongodbga Online ulandik');
});

// passport js ga ulanish

require('./db/passport')(passport)
app.use(passport.initialize());
app.use(passport.session());

app.get("*", (req, res, next) => {
  res.locals.user = req.user || null;
  next();
})

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/music', musiceditRouter);
app.use('/music', musicaddRouter);
app.use('/music', musicDeleteRouter);
app.use('/music', musicRouter);
app.use('/', usersRouter);

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
