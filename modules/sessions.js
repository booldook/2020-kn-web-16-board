const session = require('express-session');
const MySQLStore = require('express-mysql-session')(session);
const option = {
	host: process.env.DB_HOST,
	user: process.env.DB_USER,
	port: process.env.DB_PORT,
	password: process.env.DB_PASS,
	database: process.env.DB_DATABASE
}
module.exports = () => {
	return session({
		secret: process.env.SESSION_KEY,
		resave: false,
		saveUninitialized: true,
		cookie: { secure: false },
		store: new MySQLStore(option)
	});
}
