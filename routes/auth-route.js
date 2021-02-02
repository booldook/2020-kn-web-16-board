const express = require('express');
const { pool } = require('../modules/mysql-pool');
const { err, alert } = require('../modules/util');
const { isUser, isGuest } = require('../modules/auth');
const bcrypt = require('bcrypt');
const router = express.Router();

const pugs = {
	css: 'auth', 
	js: 'auth', 
	title: 'Express Board', 
	headerTitle: 'Node/Express를 활용한 인증 구현' 
}

router.get('/logout', isUser, (req, res, next) => {
	req.session.destroy();
	req.app.locals.user = {};
	res.redirect('/');
});

router.post('/logon', isGuest, async (req, res, next) => {
	let msg = '아이디 혹은 패스워드를 확인하세요.';
	let sql, value, r, rs, compare;
	let { userid, userpw } = req.body;
	// SELECT userpw FROM auth WHERE userid='booldook';
	sql = 'SELECT * FROM auth WHERE userid=?';
	value = [userid];
	r = await pool.query(sql, value);
	if(r[0].length == 1) {
		// 아이디가 존재해서 패스워드를 r[0][0].userpw 가져옴
		compare = await bcrypt.compare(userpw + process.env.BCRYPT_SALT, r[0][0].userpw);
		if(compare) {
			// 패스워드도 일치
			rs = r[0][0];
			req.session.user = {
				id: rs.id,
				userid: rs.userid,
				username: rs.username,
				email: rs.email,
			}
			res.redirect('/');
		}
		else {
			// 패스워드가 틀림
			res.send(alert(msg));
		}
	}
	else {
		// 아이디가 존재하지 않음
		res.send(alert(msg));
	}
});

router.get('/login', isGuest, (req, res, next) => {
	const pug = { ...pugs };
	pug.headerTitle += ' - 회원 로그인';
	res.render('auth/login', { ...pug });
});

router.post('/save', isGuest, async (req, res, next) => {
	try {
		let { userid, userpw, username, email } = req.body;
		let sql, value, r, rs;
		let len = userpw.length;
		let num = userpw.search(/[0-9]/g);
		let eng = userpw.search(/[a-z]/ig);
		let spe = userpw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);
		let regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
		sql = 'SELECT userid FROM auth WHERE userid=?';
		value = [userid];
		r = await pool.query(sql, value);
		rs = r[0];
		if(rs.length > 0) next(err('아이디 중복 오류'));
		if(len<8 || len>20 || num<0 || eng<0 || spe<0) next(err('비밀번호 오류'));
		if(username.length == 0) next(err('이름 오류'));
		if(email.match(regExp) == null) next(err('이메일 오류'));

		userpw = await bcrypt.hash(userpw + process.env.BCRYPT_SALT, Number(process.env.BCRYPT_ROUND));
		sql = 'INSERT INTO auth SET userid=?, userpw=?, username=?, email=?';
		value = [userid, userpw, username, email];
		r = await pool.query(sql, value);
		rs = r[0];
		if(rs.affectedRows == 1) res.redirect('/');
		else next(err('회원등록 오류'));
	}
	catch(e) {
		next(err(e.message));
	}
});

router.get('/join', isGuest, (req, res, next) => {
	const pug = { ...pugs };
	pug.headerTitle += ' - 회원가입';
	res.render('auth/join', { ...pug });
});

/*********** API ***********/
router.get('/userid', isGuest, async (req, res, next) => {
	try {
		let sql, value, r, rs;
		sql = 'SELECT userid FROM auth WHERE userid=?';
		value = [req.query.userid];
		r = await pool.query(sql, value);
		if(r[0][0]) res.json({ code: 200, result: false });
		else res.json({ code: 200, result: true });
	}
	catch(e) {
		next(err(e.message));
	}
});


module.exports = router;