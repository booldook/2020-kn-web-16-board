const multer = require('multer');
const fs = require('fs-extra');
const { v4 } = require('uuid');
const moment = require('moment');
const path = require('path');

const imgExt = ['jpg', 'jpeg', 'png', 'gif'];
const allowExt = [...imgExt, 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx', 'txt', 'hwp', 'md', 'zip'];

const destCb = (req, res, cb) => {
	var folder = path.join(__dirname, '../uploads', moment().format('YYMMDD_HH'));
	fs.ensureDirSync(folder);
	cb(null, folder);
}

const fileCb = (req, file, cb) => {
	var ext = path.extname(file.originalname); //.jpg
	var name = moment().format('YYMMDD_HH') + '-' + v4() + ext;
	cb(null, name);
}

const storage = multer.diskStorage({
	destination: destCb,
	filename: fileCb
});

const limits = { fileSize: 10240000 };
const fileFilter = (req, file, cb) => {
	// .Jpg->Jpg->jpg
	var ext = path.extname(file.originalname).substr(1).toLowerCase(); 
	if(allowExt.includes(ext)) {
		cb(null, true);
	}
	else {
		req.banExt = ext;
		cb(null, false);
	}
}
const upload = multer({ storage, limits, fileFilter });

module.exports = { upload, imgExt, allowExt };