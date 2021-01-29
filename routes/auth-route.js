const express = require('express');
const { pool } = require('../modules/mysql-pool');
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

/*********** API ***********/
router.get('/userid', async (req, res, next) => {
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