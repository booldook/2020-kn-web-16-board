const multer = require('multer');
const fs = require('fs-extra');
const { v4 } = require('uuid');
const moment = require('moment');
const path = require('path');

const destCb = (req, res, cb) => {
	var folder = path.join(__dirname, 'uploads', moment().format('YYYYMMDD_hh'));
	fs.ensureDirSync(folder);
	cb(null, folder);
}

const fileCb = (req, file, cb) => {
	cb(null, file.fieldname + '-' + Date.now())
}

const storage = multer.diskStorage({
	destination: destCb,
	filename: fileCb
})

const upload = multer({ storage });

module.exports = { upload };