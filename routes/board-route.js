const express = require('express');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const ip = require('request-ip');
const { upload, imgExt } = require('../modules/multer');
const { pool, sqlGen: sql } = require('../modules/mysql-pool');
const { err, alert, extName, srcPath, realPath } = require('../modules/util');
const pagers = require('../modules/pager');
const { isUser, isGuest } = require('../modules/auth');
const router = express.Router();
const pugs = {
	css: 'board', 
	js: 'board', 
	title: 'Express Board',
	tinyKey: process.env.TINY_KEY, 
	headerTitle: 'Node/Express를 활용한 게시판' 
}

router.get('/download/:id', async (req, res, next) => {
	const opt = {
		field: ['orifile', 'savefile'],
		where: ['id', req.params.id]
	};
	const rs = await sql(next, 'board', 'S', opt);
	filePath = realPath(rs[0].savefile);
	res.download(filePath, rs[0].orifile);
});

router.get('/view/:id', async (req, res, next) => {
	// 게시물 가져오기
	let opt = { where: ['id', req.params.id] };
	const rs = await sql(next, 'board', 'S', opt);
	rs[0].created = moment(rs[0].created).format('YYYY-MM-DD');
	if(rs[0].savefile) {
		rs[0].filename = rs[0].orifile;
		rs[0].src = imgExt.includes(extName(rs[0].savefile)) ? srcPath(rs[0].savefile) : null;
	}

	// 현재 게시물의 같은아이피 정보 가져오기(1)
	opt = {
		field: ['id'], 
		where: {op: 'and', field:[['bid', rs[0].id],['ip', ip.getClientIp(req)]]}
	}
	const rs2 = await sql(next, 'board_ip', 'S', opt);

	// 현재 아이피 정보 남기기.
	opt = {field: ['bid', 'ip'], data: {bid: req.params.id, ip: ip.getClientIp(req)}}
	await sql(next, 'board_ip', 'I', opt);

	// (1)의 결과의 갯수가 0이면(현재IP로 열람하지 않았다면) board의 readnum을 더해준다.
	if(rs2.length == 0) {
		opt = {
			field: ['readnum'], 
			data: {readnum: Number(rs[0].readnum) + 1}, 
			where: ['id', req.params.id]
		}
		await sql(next, 'board', 'U', opt);
	}

	// 결과를 뿌려라
	res.render('board/view', { ...pugs, rs: rs[0] });
});

router.get(['/', '/list'], async (req, res, next) => {
	let opt = { field: ['count(*)'] }
	const rs = await sql(next, 'board', 'S', opt);

	pager = pagers(req.query.page || 1, rs[0]['count(*)']);

	opt = { order: ['id', 'desc'], limit: [pager.startIdx, pager.listCnt] }
	const rs2 = await sql(next, 'board', 'S', opt);
	const rs3 = rs2.map((v) => {
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
	res.render('board/list', { ...pugs, rs: rs3, pager });
});

router.get('/create', isUser, (req, res, next) => {
	res.render('board/create', pugs);
});

router.post('/save', isUser, upload.single('upfile'), async(req, res, next) => {
	if(req.banExt) {
		res.send(alert(`${req.banExt} 파일은 업로드 할 수 없습니다.`));
	}
	else {
		const opt = {
			file: req.file,
			field: ['title', 'content', 'writer', 'uid'],
			data: {...req.body, uid: req.session.user.id}
		}
		const rs = await sql(next, 'board', 'I', opt);
		res.redirect('/board');
	}
});

router.get('/remove/:id', isUser, async (req, res, next) => {
	try {
		let sql, value, rs, r;
		sql = 'SELECT savefile FROM board WHERE id=? AND uid=?';
		value = [req.params.id, req.session.user.id];
		r = await pool.query(sql, value);
		if(r[0].length == 0) res.send(alert('정상적인 접근이 아닙니다.'));
		else {
			rs = r[0][0];
			if(rs.savefile) await fs.remove(realPath(rs.savefile));
			sql = 'DELETE FROM board WHERE id=? AND uid=?';
			r = await pool.query(sql, value);
			res.redirect('/board');
		}
	}
	catch(e) {
		next(err(e.message));
	}
});
-
router.get('/change/:id', isUser, async (req, res, next) => {
	try {
		let sql, value, rs, r;
		sql = 'SELECT * FROM board WHERE id=? AND uid=?';
		value = [req.params.id, req.session.user.id];
		r = await pool.query(sql, value);
		if(r[0].length == 0) res.send(alert('정상적인 접근이 아닙니다.'));
		else {
			rs = r[0][0];
			if(rs.savefile) {
				rs.filename = rs.orifile;
				rs.src = imgExt.includes(extName(rs.savefile)) ? srcPath(rs.savefile) : null;
			}
			res.render('board/change', { ...pugs, rs });
		}
	}
	catch(e) {
		next(err(e.message));
	}
});

router.get('/api/remove/:id', isUser, async (req, res, next) => {
	try {
		let sql, value, r, rs, id;
		id = req.params.id;
		sql = 'SELECT savefile FROM board WHERE id=? AND uid=?';
		value = [req.params.id, req.session.user.id];
		r = await pool.query(sql, value);
		if(r[0].length == 0) res.json({ error: '삭제할 파일이 존재하지 않습니다.' })
		else {
			rs = r[0][0];
			await fs.remove(realPath(rs.savefile));
			sql = 'UPDATE board SET orifile=NULL, savefile=NULL WHERE id=? AND uid=?';
			r = await pool.query(sql, value);
			res.json({ code: 200 });
		}
	}
	catch(e) {
		next(err(e.message));
	}
});

router.post('/update', isUser, upload.single('upfile'), async (req, res, next) => {
	try {
		let sql, value, rs, r;
		let { title, content, writer, id } = req.body;
		if(req.file) {
			sql = 'SELECT savefile FROM board WHERE id=? AND uid=?';
			value = [id, req.session.user.id];
			r = await pool.query(sql, value);
			if(r[0].length && r[0][0].savefile) {
				await fs.remove(realPath(r[0][0].savefile));
			}
		}
		sql = 'UPDATE board SET title=?, content=?, writer=? ';
		value = [title, content, writer];
		if(req.banExt) {
			res.send(alert(`${req.banExt} 파일은 업로드 할 수 없습니다.`));
		}
		else {
			if(req.file) {
				sql += ', orifile=?, savefile=?';
				value.push(req.file.originalname, req.file.filename);
			}
			sql += ' WHERE id=? AND uid=?';
			value.push(id, req.session.user.id);
			r = await pool.query(sql, value);
			res.redirect('/board');
		}
	}
	catch(e) {
		next(err(e.message));
	}
});

module.exports = router;
