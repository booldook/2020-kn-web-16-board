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
	const pug = { ...pugs, tinyKey: 'po1ip1xxy0zm6ou4bk6qpelj7vno5nvg9w1qssyr2a0inkks' }
	res.render('board/create', pug);
});

router.post('/save', async (req, res) => {
	try {
		const sql = '';
		const value = [];
		const r = await pool.query(sql, value);
		res.json(r[0]);
	}
	catch(e) {
		next(err(e));
	}
});

module.exports = router;