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

router.get('/list', async (req, res, next) => {
	try {
		let sql, value, r, rs;
		sql = 'SELECT * FROM board ORDER BY id DESC';
		r = await pool.query(sql);
		rs = r[0].map(v => {
			v.src = v.savefile ? srcPath(v.savefile) : null
			return v
		})
		res.json(rs);
	}
	catch(e) {
		res.json(e || e.message);
	}
});

router.get('/view/:id', async (req, res, next) => {
	try {
		let sql, value, r, rs;
		sql = 'SELECT * FROM board WHERE id='+req.params.id;
		r = await pool.query(sql);
		res.json(r[0]);
	}
	catch(e) {
		res.json(e || e.message);
	}
});

router.get('/download/:id', async (req, res, next) => {
	try {
		let sql, r, filePath;
		sql = 'SELECT orifile, savefile FROM board WHERE id='+req.params.id;
		r = await pool.query(sql);
		filePath = realPath(r[0][0].savefile);
		res.download(filePath, r[0][0].orifile);
	}
	catch(e) {
		res.json(e || e.message);
	}
});


module.exports = router;