const express = require('express');
const app = express();

app.listen(3000);

// 1번방식
app.use((req, res, next) => {
	req.user = 'booldook';
	next();
});

// 2번방식
const middleware2 = (req, res, next) => {
	req.user2 = 'booldook2';
	next();
}


// 3번방식
const middleware3 = (value) => {
	return (req, res, next) => {
		req.user3 = value;
		next();
	}
}

//4번방식
const middleware4 = (req, res, next) => {
	req.user4 = 'booldook4';
	next();
}
const middleware5 = (value) => {
	return (req, res, next) => {
		req.user5 = value;
		next();
	}
}

app.get('/', middleware2, middleware3('booldook3'), (req, res, next) => {
	middleware4(req, res, next);
	middleware5('booldook5')(req, res, next);
	res.send(`<h1>${req.user}/${req.user2}/${req.user3}/${req.user4}/${req.user5}</h1>`);
})