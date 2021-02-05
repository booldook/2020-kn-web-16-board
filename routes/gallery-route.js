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
	css: 'gallery', 
	js: 'gallery', 
	title: 'Express Gallery',
	tinyKey: process.env.TINY_KEY, 
	headerTitle: 'Node/Express를 활용한 갤러리' 
}

router.get('/create', isUser, (req, res, next) => {
	res.render('gallery/create', pugs);
});


module.exports = router;