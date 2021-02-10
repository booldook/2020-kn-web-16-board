const path = require('path');
const moment = require('moment');

/****** option ******/
// 2021-02-10 11:11:11 - default: 0
// 2021-02-10 - 1
// 2021년 02월 10일 11시 11분 11초 - 2
// 2021년 02월 10일 - 3
const datetime = (dt, opt=0) => {
	switch(opt) {
		case 1:
			return moment(dt).format('YYYY-MM-DD');
		case 2:
			return moment(dt).format('YYYY년 MM월 DD일 HH시 mm분 ss초');
		case 1:
			return moment(dt).format('YYYY년 MM월 DD일');
		default:
			return moment(dt).format('YYYY-MM-DD HH:mm:ss');
	}
}

const err = (code, msg) => {
	if(code == 404) {
		return {
			code: code,
			msg: msg || 'File Not Found - 파일을 찾을 수 없습니다.',
			title: 'Error 404'
		}
	}
	else {
		if(typeof code == 'number') {
			return {
				code: 500,
				msg: msg ? `${msg} [Error: ${code}]` : 'Server Internal Error - 서버 내부 오류',
				title: 'Error '+code
			}
		}
		else {
			return {
				code: 500,
				msg: code || 'Server Internal Error - 서버 내부 오류',
				title: 'Error 500'
			}
		}
	}
}

const alert = (msg, loc) => {
	if(loc) return `<script>alert('${msg}'); location.href="${loc}";</script>`;
	else return `<script>alert('${msg}'); history.go(-1);</script>`;
}

const extName = (filename) => {
	return path.extname(filename).substr(1).toLowerCase();
}

const srcPath = (filename) => {
	return `/storages/${filename.substr(0, 9)}/${filename}`;
}

const realPath = (filename) => {
	return path.join(__dirname, '../uploads', filename.substr(0, 9), filename);
}

module.exports = { err, alert, extName, srcPath, realPath, datetime }