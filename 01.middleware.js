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
const middleware3 = (req, res, next) => {
	req.user3 = 'booldook3';
	next();
}

// 3번방식
const middleware4 = (value) => {
	return (req, res, next) => {
		req.user4 = value;
		next();
	}
}

app.get('/', middleware2, middleware3, middleware4('booldook4'), (req, res) => {
	res.send(`<h1>${req.user}/${req.user2}/${req.user3}/${req.user4}</h1>`);
})