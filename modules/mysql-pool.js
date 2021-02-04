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



// data = { name: '홍길동', age: 25, score: 70 }
// sql = INSERT INTO score SET name=?, age=?, score=?
// value = ['홍길동', 25, 70];

// field = ['name', 'age', 'score'] => name=?, age=?, score=?
// data = req.body

// field : ['id', 'title', 'content'] -> id, title, content <- array.toString()
// await sqlGen('board', ['I', 'U', 'D', 'S'], {});
const sqlGen = async (table, mode, opt) => {
	let {	field=[], data={}, file=null, where=null, order=[], limit=[] } = opt;
	let sql, value=[], r, rs;

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
	return r[0];
}




module.exports = { mysql, pool, sqlGen };