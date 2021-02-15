const express = require('express');
const moment = require('moment');
const path = require('path');
const fs = require('fs-extra');
const ip = require('request-ip');
const { uploadImg, imgExt } = require('../modules/multer');
const { pool, sqlMiddle: sql } = require('../modules/mysql-pool');
const { err, alert, extName, srcPath, realPath, datetime } = require('../modules/util');
const pagers = require('../modules/pager');
const { isUser, isGuest } = require('../modules/auth');
const router = express.Router();
const pugs = {
	css: 'gallery', 
	js: 'gallery', 
	title: 'Express Gallery',
	tinyKey: process.env.TINY_KEY, 
	headerTitle: 'Node/Express를 활용한 갤러리' 
}

router.get('/api/remove/:id', isUser, async (req, res, next) => {
	try {
		let sql, rs, r, value;
		sql = `SELECT gallery_file.* FROM gallery_file LEFT JOIN gallery ON gallery.id = gallery_file.fid WHERE gallery_file.id=? AND gallery.uid=?`;
		value = [req.params.id, req.session.user.id];
		r = await pool.query(sql, value);
		if(r[0][0]) {
			await fs.remove(realPath(r[0][0].savefile));
			sql = 'DELETE FROM gallery_file WHERE id='+req.params.id;
			r = await pool.query(sql);
			res.json({code: 200});
		}
		else res.status(500).json({code: 500, error: '삭제에 실패했습니다.'});
	}
	catch(e) {
		res.status(500).json(e);
	}
});

router.get('/change/:id', isUser, async (req, res, next) => {
	try {
		let sql, value, rs, r;
		//sql = `SELECT gallery.*, gallery_file.id as file_id FROM gallery LEFT JOIN gallery_file ON gallery.id = gallery_file.fid WHERE gallery.id = ${req.params.id}`;
		sql = 'SELECT * FROM gallery WHERE id='+req.params.id;
		r = await pool.query(sql);
		rs = r[0][0];
		sql = 'SELECT * FROM gallery_file WHERE fid='+req.params.id;
		r = await pool.query(sql);
		rs.files = r[0];
		for(let v of rs.files) v.src = srcPath(v.savefile);
		res.render('gallery/change', { ...pugs, rs });
	}
	catch(e) {
		next(err(e.message || e));
	}
});

router.get('/delete/:id', isUser, async (req, res, next) => {
	try {
		let sql, value, r, rs;
		sql = 'SELECT savefile FROM gallery_file WHERE fid='+req.params.id;
		r = await pool.query(sql);
		for(let v of r[0]) {
			await fs.remove(realPath(v.savefile));
		}
		sql = 'DELETE FROM gallery WHERE id=? AND uid=?';
		value = [req.params.id, req.session.user.id];
		r = await pool.query(sql, value);
		if(r[0].affectedRows > 0) {
			res.redirect('/gallery');
		}
		else {
			res.send(alert('삭제에 실패하였습니다.'))
		}
	}
	catch(e) {
		next(err(e.message || e));
	}
});

router.get(['/', '/list'], async (req, res, next) => {
	try {
		let sql, value, r, r2, rs, pager;
		sql = `SELECT count(id) FROM gallery`;
		r = await pool.query(sql);
		pager = pagers(req.query.page || 1, r[0][0]['count(id)']);
		pager.router = 'gallery';
		sql = `SELECT * FROM gallery LIMIT ${pager.startIdx}, ${pager.listCnt}`;
		r = await pool.query(sql);
		rs = r[0];
		for(let v of rs) {
			sql = `SELECT * FROM gallery_file WHERE fid=${v.id} ORDER BY id ASC LIMIT 0, 2`;
			r2 = await pool.query(sql);
			v.src = [];
			if(r2[0].length == 0) {
				v.src[0] = 'http://via.placeholder.com/300?text=No+Image';
			}
			else if(r2[0].length == 1) {
				v.src[0] = srcPath(r2[0][0].savefile);
			}
			else {
				v.src[0] = srcPath(r2[0][0].savefile);
				v.src[1] = srcPath(r2[0][1].savefile);
			}
		}
		// console.log(pager);
		res.render('gallery/list', { ...pugs, rs, pager });
	}
	catch(e) {
		next(err(e.message || e));
	}
});


router.get('/create', isUser, (req, res, next) => {
	res.render('gallery/create', pugs);
});

router.post('/save', isUser, uploadImg.array('upfile', 10), async (req, res, next) => {
	try {
		let sql, value, rs, r, fid;
		sql = `INSERT INTO gallery SET title=?, content=?, writer=?, uid=?`;
		value = [req.body.title, req.body.content, req.body.writer, req.session.user.id];
		rs = await pool.query(sql, value);
		fid = rs[0].insertId;
		if(req.files) {
			for(let v of req.files) {
				sql = `INSERT INTO gallery_file SET savefile=?, orifile=?, fid=?`;
				value = [v.filename, v.originalname, fid];
				await pool.query(sql, value);
			}
		}
		res.redirect('/gallery');
	}
	catch(e) {
		next(err(e.message || e));
	}
});

router.get('/api/view/:id', async (req, res, next) => {
	try {
		let sql, value, rs, r, r2, src=[];
		sql = 'SELECT * FROM gallery WHERE id='+req.params.id;
		r = await pool.query(sql);
		rs = r[0][0];
		rs.created = datetime(rs.created, 2);
		sql = 'SELECT * FROM gallery_file WHERE fid='+req.params.id;
		r2 = await pool.query(sql);
		rs.src = r2[0].map(v => srcPath(v.savefile));
		res.json(rs);
	}
	catch(e) {
		res.json(e.message || e);
	}
});

router.get('/download', async (req, res, next) => {
	try {
		let sql, value, savefile, orifile, r;
		savefile = req.query.file.split('/').pop();
		sql = 'SELECT orifile FROM gallery_file WHERE savefile=?';
		value = [savefile];
		r = await pool.query(sql, value);
		orifile = r[0][0].orifile;
		res.download(realPath(savefile), orifile);
	}
	catch(e) {
		next(err(e.message || e));
	}
});

module.exports = router;