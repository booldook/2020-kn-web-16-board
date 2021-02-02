// const pager = () => {}
// module.exports = pager;
// const p = require('../modules/pager)

//const pager = () => {}
// module.exports = { pager };
// const { pager: p } = require('../modules/pager)

// module.exports = () => {}
// const p = require('../modules/pager)

// ES6
// var { listCnt = 3, pagerCnt = 2 } = obj || {};

// ES5
// var obj = obj || {}
// var listCnt = obj.listCnt || 3;
// var pagerCnt = obj.pagerCnt || 2;


module.exports = (page, totalRecord, obj) => {
	var page = Number(page);
	var totalRecord = Number(totalRecord);
	var { listCnt = 3, pagerCnt = 3 } = obj || {};
	var totalPage = Math.ceil(totalRecord / listCnt);
	var startIdx = (page - 1) * listCnt;
	var startPage = Math.floor((page - 1) / pagerCnt) * pagerCnt + 1;
	var endPage =  startPage + pagerCnt - 1 > totalPage ? totalPage : startPage + pagerCnt - 1;
	var nextPage = page + 1 > totalPage ? 0 : page + 1;
	var prevPage = page - 1;
	var nextPager = endPage + 1 > totalPage ? 0 : endPage + 1;
	var prevPager = startPage - 1;
	var firstPage = page == 1 ? 0 : 1;
	var lastPage = page == totalPage ? 0 : totalPage;
	return { page, totalRecord, listCnt, pagerCnt, totalPage, startIdx, startPage, endPage, nextPage, prevPage, nextPager, prevPager, firstPage, lastPage };
}