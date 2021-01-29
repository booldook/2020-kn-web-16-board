function comment(el, cmt, cls) {
	$(el).next().html(cmt);
	$(el).next().removeClass('active danger');
	$(el).next().addClass(cls);
}

function onBlurId(el) {
	function onResponse(r) {
		if(r.result) comment(el, '멋진 아이디입니다. 사용가능합니다.', 'active');
		else comment(el, '존재하는 아이디입니다. 사용할 수 없습니다.', 'danger');
	}
	var userid = $(el).val().trim();	// el.value
	if(userid.length < 8) comment(el, '아이디는 8자 이상입니다.', 'danger');
	else $.get('/auth/userid', { userid: userid }, onResponse);
}

function onBlurPw(el) {

}

function onBlurPw2(el) {

}

function onBlurEmail(el) {

}