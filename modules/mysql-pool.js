const { err } = require('../modules/util');
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE,
	waitForConnections: true,
  connectionLimit: 10,
	queueLimit: 0,
});



/******* filed, data, file ********/
// data = { name: '홍길동', age: 25, score: 70 }
// sql = INSERT INTO score SET name=?, age=?, score=?
// value = ['홍길동', 25, 70];
// field = ['name', 'age', 'score'] => name=?, age=?, score=?
// data = req.body
// field : ['id', 'title', 'content'] -> id, title, content <- array.toString()

/******* WHERE ********/
// WHERE id=1
// WHERE title LIKE '%booldook%'

// WHERE id=5 AND uid='booldook'
// WHERE id=5 OR uid='booldook'
// WHERE id>5 AND uid='booldook'

/*
- 조건1
- WHERE id=1, WHERE id>5, WHERE id LIKE '%booldook%'
where : ['id', 1];
where : ['id', 5, '>'];
where : ['userid', 'booldook', 'LIKE'];

- 조건2
- WHERE id>5 AND uid LIKE '%booldook%'
where : {
	op: 'AND',
	field: [['id', 5, '>'], ['userid', 'booldook', 'LIKE']]
}
*/

/******* ORDER ********/
// ORDER BY id DESC => ['id', 'DESC']
// ORDER BY uid ASC, id DESC => [['uid', 'ASC'],['id', 'DESC']]

/******* LIMIT ********/
// LIMIT 0, 5 => [0, 5];

/******* router 실행 ********/
// await sqlGen('board', ['I', 'U', 'D', 'S'], {});

const sqlFn = async (table, mode, opt, req, res, next) => {
	try {
		let {	
			field = [], 
			data = {}, 
			file = (req ? req.file : null), 
			files = (req ? req.files : null), 
			where, 
			order, 
			limit } = opt;
		let sql, value=[], r, tmp;

		data = { ...data, ...(req && req.body ? req.body : {}) };
	
		mode = mode.toUpperCase();
		if(mode == 'I') {
			sql = `INSERT INTO ${table} SET `;
		}
		if(mode == 'S') {
			sql = `SELECT ${field.length == 0 ? '*' : field.toString()} FROM ${table} `;
		}
		if(mode == 'U') {
			sql = `UPDATE ${table} SET `;
		}
		if(mode == 'D') {
			sql = `DELETE FROM ${table} `;
		}
	
		tmp = Object.entries(data).filter( v => field.includes(v[0]));

		if(file) tmp.push(['savefile', file.filename],['orifile', file.originalname]);
		if(files) {
			// upload.array();
		}
		
		for(let v of tmp) {
			sql += v[0] + '=?,';
			value.push(v[1]);
		}
		sql = sql.substr(0, sql.length - 1);
	
		if(where && Array.isArray(where)) {
			sql += ` WHERE ${where[0]} ${ where[2] || '='} '${where[2] == 'LIKE'? '%' : ''}${where[1]}${where[2] == 'LIKE' ? '%' : ''}' `;
		}
		if(where && where.op && where.field) {
			let op = where.op.trim().toUpperCase();
			let field = where.field;
			for(let i in field) {
				sql += (i == 0) ? ' WHERE ' : ' ' + op + ' ';
				sql += ` ${field[i][0]} ${field[i][2] || '='} '${field[i][2] == 'LIKE'? '%' : ''}${field[i][1]}${field[i][2] == 'LIKE' ? '%' : ''}' `;
			}
		}
		if((mode == 'U' || mode == 'D') && !sql.includes('WHERE')) {
			throw new Error('수정 및 삭제시에는 WHERE절이 필요합니다.');
		}

		if(order) {
			if(Array.isArray(order[0])) {
				for(let i in order) {
					sql += ` ${i == 0 ? 'ORDER BY' : ','} ${order[i][0]} ${order[i][1]} `;
				}
			}
			else {
				sql += ` ORDER BY ${order[0]} ${order[1]} `;
			}
		}

		if(limit && Array.isArray(limit)) sql += ` LIMIT ${limit[0]}, ${limit[1]} `;

		console.log(sql);
		console.log(value);
		r = await pool.query(sql, value);
		return r[0];
	}
	catch(e) {
		next(err(e.message || e));
	}
}

const sqlGen = async (next, table, mode, opt={}) => {
	return await sqlFn(table, mode, opt, null, null, next);
}

const sqlMiddle = async (table, mode, opt={}) => {
	return async (req, res, next) => {
		const rs = await sqlFn(table, mode, opt, req, res, next);
		req.rs = rs;
	}
}


module.exports = { mysql, pool, sqlGen, sqlMiddle };