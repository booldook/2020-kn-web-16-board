const express = require('express');
const moment = require('moment');
const path = require('path');
const { upload, imgExt } = require('../modules/multers');
const { pool } = require('../modules/mysql-pool');
const { err, alert, extName, srcPath } = require('../modules/util');
const pagers = require('../modules/pagers');
const router = express.Router();
const pugs = { 
	css: 'board', 
	js: 'board', 
	title: 'Express Board', 
	headerTitle: 'Node/Express를 활용한 게시판' 
}

router.get('/download/:id', async (req, res, next) => {
	try {
		let sql, r, rs, filePath;
		sql = 'SELECT orifile, savefile FROM board WHERE id='+req.params.id;
		r = await pool.query(sql);
		rs = r[0][0];
		// __dirname: d:\임덕규_수업\16.board\routes
		// ../uploads: d:\임덕규_수업\16.board\uploads\20210129_11\
		filePath = path.join(__dirname, '../uploads', rs.savefile.substr(0, 9), rs.savefile);
		res.download(filePath, rs.orifile);
	}
	catch(e) {
		next(err(e.message));
	}
});

router.get('/view/:id', async (req, res, next) => {
	try {
		let sql, r, rs, file;
		sql = 'SELECT * FROM board WHERE id='+req.params.id;
		r = await pool.query(sql);
		rs = r[0][0];
		rs.created = moment(rs.created).format('YYYY-MM-DD');
		if(rs.savefile) {
			rs.filename = rs.orifile;
			rs.src = imgExt.includes(extName(rs.savefile)) ? srcPath(rs.savefile) : null;
		}
		res.render('board/view', { ...pugs, rs });
	}
	catch(e) {
		next(err(e.message));
	}
});

router.get(['/', '/list'], async (req, res, next) => {
	try {
		let sql, value, r, rs, pager;
		sql = 'SELECT count(*) FROM board';
		r = await pool.query(sql);
		pager = pagers(req.query.page || 1, r[0][0]['count(*)']);
		sql = 'SELECT * FROM board ORDER BY id DESC LIMIT ?, ?';
		value = [pager.startIdx, pager.listCnt];
		r = await pool.query(sql, value);
		rs = r[0].map((v) => {
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
		res.render('board/list', { ...pugs, rs, pager });
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
