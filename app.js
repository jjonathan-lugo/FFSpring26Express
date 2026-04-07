var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var hbs = require('hbs');//added
const fs = require('fs');
const { Sequelize }= require('sequelize');
const { DataTypes } = require('sequelize');
const Database = require('better-sqlite3').default ?? require('better-sqlite3');

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

//Setup our database
const storage = path.join(__dirname, '..', 'data', 'database.sqlite');

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage, 
  dialectModule:require('better-sqlite3'),
  logging:false
});

async function syncDB(){
  await sequelize.sync();
}

syncDB();

const Task = sequelize.define('Task', {
  name:{type: DataTypes.STRING,allowNull:false},
  description:{type: DataTypes.TEXT}
});

/* GET home page. */
app.get('/', function (req, res, next) {
  res.render('index', { title: 'Miami' });
});

app.get('/page 2', function (req, res, next) {
  res.render('index', { title: 'Page 2' });
});

//order matters; if a token that is higher priority is before one that is 
//lower in priority program will stop at higher priority and not run lower priority after it
app.get('/form', function (req, res, next) {
  res.render('form', { title: 'Form' });
});

app.post('/form', function (req, res, next) {
  console.log(req.body.firstname);
  //res.render('formresponse', {firstname:req.body.firstname, lastname:req.body.lastname})
  res.render('formresponse', req.body);
});

app.get('/guess', function (req, res, next) {
  res.render('guess', { title: 'Guess' });
});

app.post('/guess', function (req, res, next) {
  console.log(req.body.guess);
  //when generating random num it is from 0-1. The * 10 you can get from 0-9; 
  //The math.floor like if you put 1.999 = 1 & 2.999 = 2 it will cut the decimal
  let randomNumber = Math.floor(Math.random() * 10);
  let response = "";
  if(randomNumber == Number(req.body.guess)){
    console.log("You guessed correctly");
    reponse = "You guesssed correctly";
  }
  else {
    console.log("You guessed incorrectly!");
    response = "You guessed incorrectly";
  }
  let templateResponse = {guess: req.body.guess, responsetext:response};
  //res.render('formerspouse', {firstname:req.body.firstname, lastname:req.body.lastname})
  res.render('guessresponse', templateResponse);
});

app.get('/addtask', function(req, res, next){
  res.render('addtask', {title: 'Add Task'});
});

app.post('/addtask', async function(req, res, next){
  try{
    const created = await Task.create({name:req.body.name, description:req.body.description});
    res.json(req.body);
  }
  catch(err){
    next(err);
  }
});

//what you put in the name parameter it will print that name you gave
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