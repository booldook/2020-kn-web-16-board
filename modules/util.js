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

module.exports = { err }