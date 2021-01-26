"use strict";

/************* Import **************/
require('dotenv').config();

var express = require('express');

var app = express();

var path = require('path');

var _require = require('./modules/util'),
    err = _require.err;
/************* Server **************/


app.listen(process.env.PORT, function () {
  console.log('=====================');
  console.log('http://127.0.0.1:' + process.env.PORT);
  console.log('=====================');
});
/************* View/pug **************/

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;
/************* Post/Body **************/

app.use(express.json());
app.use(express.urlencoded({
  extended: false
}));
/************* Router **************/

var authRouter = require('./routes/auth-route');

var boardRouter = require('./routes/board-route');

var apiRouter = require('./routes/api-route');

var galleryRouter = require('./routes/gallery-route');

var _require2 = require('console'),
    Console = _require2.Console;

app.use('/', express["static"](path.join(__dirname, 'public')));
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/api', apiRouter);
app.use('/gallery', galleryRouter);
/************* Error **************/

app.use(function (req, res, next) {
  next(err(404));
});
app.use(function (err, req, res, next) {
  res.render('error', err);
});