/************* Import **************/
require('dotenv').config();
const express = require('express');
const app = express();
const path = require('path');
const { err } = require('./modules/util');
const session = require('./modules/session');
const local = require('./modules/local');

/************* Server **************/
app.listen(process.env.PORT, () => {
	console.log('=====================');
	console.log('http://localhost:'+process.env.PORT);
	console.log('=====================');
});

/************* View/pug **************/
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.locals.pretty = true;

/************* Post/Body **************/
app.use(express.json());
app.use(express.urlencoded({extended: false}));

/************* SESSION **************/
app.use(session());
app.use(local());

/************* Router **************/
const authRouter = require('./routes/auth-route');
const boardRouter = require('./routes/board-route');
const apiRouter = require('./routes/api-route');
const galleryRouter = require('./routes/gallery-route');

app.use('/', express.static(path.join(__dirname, 'public')));
app.use('/storages', express.static(path.join(__dirname, 'uploads')));
app.use('/auth', authRouter);
app.use('/board', boardRouter);
app.use('/api', apiRouter);
app.use('/gallery', galleryRouter);


/************* Error **************/
app.use((req, res, next) => {
	next(err(404));
});

app.use((err, req, res, next) => {
	console.log(err);
	res.render('error', err);
});