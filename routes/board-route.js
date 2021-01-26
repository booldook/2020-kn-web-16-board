const express = require('express');
const router = express.Router();
const pugs = { 
	css: 'board', 
	js: 'board', 
	title: 'Express Board', 
	headerTitle: 'Node/Express를 활용한 게시판' 
}

router.get('/', (req, res, next) => {
	res.render('board/list', { ...pugs });
});

router.get('/create', (req, res, next) => {
	res.render('board/create', pugs);
});

module.exports = router;