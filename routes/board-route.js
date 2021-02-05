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
	css: 'board', 
	js: 'board', 
	title: 'Express Board',
	tinyKey: process.env.TINY_KEY, 
	headerTitle: 'Node/Express를 활용한 게시판' 
}

router.get('/download/:id', async (req, res, next) => {
	let opt, rs;
	opt = {
		field: ['orifile', 'savefile'],
		where: ['id', req.params.id]
	};
	rs = await sql(next, 'board', 'S', opt);
	filePath = realPath(rs[0].savefile);
	res.download(filePath, rs[0].orifile);
});

router.get('/view/:id', async (req, res, next) => {
	// 게시물 가져오기
	let opt;
	let rs; 	// board rs 
	let rs2; 	// board_ip rs
	
	opt = { 
		where: ['id', req.params.id] 
	};
	rs = await sql(next, 'board', 'S', opt);
	rs[0].created = moment(rs[0].created).format('YYYY-MM-DD');
	if(rs[0].savefile) {
		rs[0].filename = rs[0].orifile;
		rs[0].src = imgExt.includes(extName(rs[0].savefile)) ? srcPath(rs[0].savefile) : null;
	}

	// 현재 게시물의 같은아이피 정보 가져오기(1)
	opt = {
		field: ['id'], 
		where: {op: 'and', field:[['bid', rs[0].id],['ip', ip.getClientIp(req)]]}
	}
	rs2 = await sql(next, 'board_ip', 'S', opt);

	// 현재 아이피 정보 남기기.
	opt = {field: ['bid', 'ip'], data: {bid: req.params.id, ip: ip.getClientIp(req)}}
	await sql(next, 'board_ip', 'I', opt);

	// (1)의 결과의 갯수가 0이면(현재IP로 열람하지 않았다면) board의 readnum을 더해준다.
	if(rs2.length == 0) {
		opt = {
			field: ['readnum'], 
			data: {readnum: Number(rs[0].readnum) + 1}, 
			where: ['id', req.params.id]
		}
		await sql(next, 'board', 'U', opt);
	}

	// 결과를 뿌려라
	res.render('board/view', { ...pugs, rs: rs[0] });
});

router.get(['/', '/list'], async (req, res, next) => {
	let opt;
	let rs;		// board count(*)
	let rs2;	// board list rs
	let rs3;	// board list -> map
	
	opt = { 
		field: ['count(*)'] 
	}
	rs = await sql(next, 'board', 'S', opt);
	pager = pagers(req.query.page || 1, rs[0]['count(*)']);

	opt = { 
		order: ['id', 'desc'], 
		limit: [pager.startIdx, pager.listCnt] 
	}
	rs2 = await sql(next, 'board', 'S', opt);
	
	rs3 = rs2.map((v) => {
		v.wdate = moment(v.wdate).format('YYYY-MM-DD');
		if(v.savefile) {
			let ext = path.extname(v.savefile).substr(1).toLowerCase();
			ext = (ext == 'jpeg') ? 'jpg': ext;
			ext = ext.substr(0, 3);
			v.icon = `/img/ext/${ext}.png`;
		}
		else v.icon = '/img/empty.png';
		return v;
	});
	res.render('board/list', { ...pugs, rs: rs3, pager });
});

router.get('/create', isUser, (req, res, next) => {
	res.render('board/create', pugs);
});

router.post('/save', isUser, upload.single('upfile'), async(req, res, next) => {
	let opt;

	if(req.banExt) {
		res.send(alert(`${req.banExt} 파일은 업로드 할 수 없습니다.`));
	}
	else {
		opt = {
			file: req.file,
			field: ['title', 'content', 'writer', 'uid'],
			data: {...req.body, uid: req.session.user.id}
		}
		await sql(next, 'board', 'I', opt);
		res.redirect('/board');
	}
});

router.get('/remove/:id', isUser, async (req, res, next) => {
	let opt;
	let rs;

	opt = {
		field: ['savefile'],
		where: {
			op: 'AND',
			field: [['id', req.params.id], ['uid', req.session.user.id]]
		}
	}
	rs = await sql(next, 'board', 'S', opt);
	if(rs.length == 0) res.send(alert('정상적인 접근이 아닙니다.'));
	else {
		if(rs[0].savefile) await fs.remove(realPath(rs[0].savefile));
		opt = {
			where: {
				op: 'AND',
				field: [['id', req.params.id], ['uid', req.session.user.id]]
			}
		}
		await sql(next, 'board', 'D', opt);
		res.redirect('/board');
	}
});

router.get('/change/:id', isUser, async (req, res, next) => {
	let opt;
	let rs;

	opt = {
		where: {
			op: 'AND',
			field: [['id', req.params.id], ['uid', req.session.user.id]]
		}
	}
	rs = await sql(next, 'board', 'S', opt);
	if(rs.length == 0) res.send(alert('정상적인 접근이 아닙니다.'));
	else {
		if(rs[0].savefile) {
			rs[0].filename = rs[0].orifile;
			rs[0].src = imgExt.includes(extName(rs[0].savefile)) ? srcPath(rs[0].savefile) : null;
		}
		res.render('board/change', { ...pugs, rs: rs[0] });
	}
});

router.get('/api/remove/:id', isUser, async (req, res, next) => {
	let opt;
	let rs;

	opt = {
		field: ['savefile'],
		where: {
			op: 'AND',
			field: [['id', req.params.id], ['uid', req.session.user.id]]
		}
	}
	rs = await sql(next, 'board', 'S', opt);
	if(rs.length == 0) res.json({ error: '삭제할 파일이 존재하지 않습니다.' });
	else {
		await fs.remove(realPath(rs[0].savefile));
		opt = {
			field: ['orifile', 'savefile'],
			data: { orifile: null, savefile: null },
			where: {
				op: 'AND',
				field: [['id', req.params.id], ['uid', req.session.user.id]]
			}
		}
		await sql(next, 'board', 'U', opt);
		res.json({ code: 200 });
	}
});

router.post('/update', isUser, upload.single('upfile'), async (req, res, next) => {
	let opt;
	let rs;

	if(req.banExt) {
		res.send(alert(`${req.banExt} 파일은 업로드 할 수 없습니다.`));
	}
	else {
		
		// 업로드 된 파일이 존재하여, 기존 파일을 삭제
		if(req.file) {
			opt = {
				field: ['savefile'],
				where: {
					op: 'AND',
					field: [['id', req.body.id], ['uid', req.session.user.id]]
				}
			}
			rs = await sql(next, 'board', 'S', opt);
			if(rs.length && rs[0].savefile) {
				await fs.remove(realPath(rs[0].savefile));
			}
		}

		// 업로드된 새로운 파일정보와 업데이트 데이터를 저장(수정)
		opt = {
			field: ['title', 'content', 'writer'],
			data: req.body,
			file: req.file || null,
			where: {
				op: 'AND',
				field: [['id', req.body.id], ['uid', req.session.user.id]]
			}
		}
		await sql(next, 'board', 'U', opt);
		res.redirect('/board');
	}
});

module.exports = router;
