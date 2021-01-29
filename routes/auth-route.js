const express = require('express');
const router = express.Router();

const pugs = {
	css: 'auth', 
	js: 'auth', 
	title: 'Express Board', 
	headerTitle: 'Node/Express를 활용한 인증 구현' 
}

router.get('/join', (req, res, next) => {
	const pug = { ...pugs };
	pug.headerTitle += ' - 회원가입';
	res.render('auth/join', { ...pug });
});

module.exports = router;