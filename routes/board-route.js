const express = require('express');
const router = express.Router();
const { pool } = require('../modules/mysql-pool');
const { err } = require('../modules/util');
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
	const pug = { ...pugs, tinyKey: process.env.TINY_KEY }
	res.render('board/create', pug);
});

router.post('/save', async (req, res) => {
	try {
		const { title, content, writer } = req.body;
		const sql = 'INSERT INTO board SET title=?, content=?, writer=?';
		const value = [title, content, writer];
		const r = await pool.query(sql, value);
		res.json(r[0]);
	}
	catch(e) {
		next(err(e));
	}
});

module.exports = router;