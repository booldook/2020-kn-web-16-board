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

app.get('/', middleware2, middleware3, (req, res) => {
	res.send(`<h1>${req.user}/${req.user2}/${req.user3}</h1>`);
})