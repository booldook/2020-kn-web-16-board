const crypto = require('crypto');
const bcrypt = require('bcrypt');

let pass = '1111';
let salt = '1234n8sa@4912mka';
let pass2 = '1111';
let sha512 = crypto.createHash('sha512').update(pass+salt).digest('base64');
sha512 = crypto.createHash('sha512').update(sha512).digest('base64');
sha512 = crypto.createHash('sha512').update(sha512).digest('base64');
let sha5122 = crypto.createHash('sha512').update(pass2+salt).digest('base64');
sha5122 = crypto.createHash('sha512').update(sha5122).digest('base64');
sha5122 = crypto.createHash('sha512').update(sha5122).digest('base64');
console.log(sha512);
console.log(sha5122);

var hash = null;
const genPass = async (pass) => {
	hash = await bcrypt.hash(pass, 7);
	console.log(hash);
}

const comparePass = async (pass) => {
	var compare = await bcrypt.compare(pass, hash);
	console.log(compare);
}

genPass('1234');
setTimeout(() => {
	comparePass('1234');
}, 1000);