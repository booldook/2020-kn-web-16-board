const express = require('express');
const router = express.Router();
const { upload } = require('../modules/multers');
const { pool } = require('../modules/mysql-pool');
const { err, alert } = require('../modules/util');
const moment = require('moment');
const path = require('path');
const pugs = { 
	css: 'board', 
	js: 'board', 
	title: 'Express Board', 
	headerTitle: 'Node/Express를 활용한 게시판' 
}

router.get('/', async (req, res, next) => {
	try {
		let sql = 'SELECT * FROM board ORDER BY id DESC';
		const r = await pool.query(sql);
		const rs = r[0].map((v) => {
			v.wdate = moment(v.wdate).format('YYYY-MM-DD');
			if(v.savefile) {
				let ext = path.extname(v.savefile).substr(1).toLowerCase();
				ext = (ext == 'jpeg') ? 'jpg': ext;
				ext = ext.substr(0, 3);
				v.icon = `/img/ext/${ext}.png`;
			}
			else v.icon = '/img/empty.png';
			return v;
		});
		res.render('board/list', { ...pugs, rs });
	}
	catch(e) {
		next(err(e.message));
	}
});

router.get('/create', (req, res, next) => {
	const pug = { ...pugs, tinyKey: process.env.TINY_KEY }
	res.render('board/create', pug);
});

router.post('/save', upload.single('upfile'), async (req, res, next) => {
	try {
		const { title, content, writer } = req.body;
		let sql = 'INSERT INTO board SET title=?, content=?, writer=?';
		const value = [title, content, writer];
		if(req.banExt) {
			res.send(alert(`${req.banExt} 파일은 업로드 할 수 없습니다.`));
		}
		else {
			if(req.file) {
				sql += ', orifile=?, savefile=?';
				value.push(req.file.originalname, req.file.filename);
			}
			const r = await pool.query(sql, value);
			res.redirect('/board');
		}
	}
	catch(e) {
		next(err(e.message));
	}
});

module.exports = router;
