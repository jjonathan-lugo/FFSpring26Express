var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');//added
const fs = require('fs');


// var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// app.use('/', indexRouter);
// app.use('/users', usersRouter);

//Registering Partials
hbs.registerPartials(path.join(__dirname, 'views', 'partials'))
hbs.registerPartial('partial_name', 'partial value');

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Miami' });
});

app.get('/page 2', function (req, res, next) {
  res.render('index', { title: 'Page 2' });
});

app.get('/form', function (req, res, next) {
  res.render('form', { title: 'Form' });
});

app.get('/:name', function (req, res, next) {
  console.log(req);
  res.render('index', { title: req.params.name });
});

app.get('/page2', function (req, res, next) {
  res.render('index', { title: 'Page 2' });
});

app.get('/form', function (req, res, next) {
  res.render('form', { title: 'Form' });
});

app.post('/form', function (req, res, next) {
  console.log(req.body.firstname);
  //res.render('formerspouse', {firstname:req.body.firstname, lastname:req.body.lastname})
  res.render('formerspouse', res.body);
});

app.get('/guess', function (req, res, next) {
  res.render('guess', { title: 'Guess' });
});

app.post('/guess', function (req, res, next) {
  console.log(req.body.firstname);
  let randomNumber = Math.floor(Math.random() * 10);
  let response = "";
  if(randomNumber == Number(req.body.guess)){
    console.log("You guessed correctly");
    reponse = "You guesssed correctly"
  }
  else {
    console.log("You guessed incorrectly");
    response = "You guessed incorrectly";
  }
  let templateResponse = {guess: req.body.guess, responseText:response};
  //res.render('formerspouse', {firstname:req.body.firstname, lastname:req.body.lastname})
  res.render('guessResponse', templateResponse);
});

app.get('/:name', function (req, res, next) {
  console.log(req);
  res.render('index', { title: req.params.name });
});

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
  res.render('error');
});

module.exports = app;