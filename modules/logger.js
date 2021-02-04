const morgan = require('morgan');
const rfs = require('rotating-file-stream');
const path = require('path');
const moment = require('moment');

const streamCommon = rfs.createStream(moment().format('YYYYMMDD')+'.log', { 
	interval: "1d",
	path: path.join(__dirname, '../logs')
});

const streamCombined = rfs.createStream(moment().format('YYYYMMDD')+'_c.log', { 
	interval: "1d",
	path: path.join(__dirname, '../logs')
});

module.exports = (method) => {
	if(method == 'common') return morgan(method, { stream: streamCommon });
	else return morgan(method, { stream: streamCombined });
};