function comment(el, cmt, cls) {
	$(el).next().html(cmt);
	$(el).next().removeClass('active danger');
	$(el).next().addClass(cls);
}

function onBlurId(el) {
	var userid = $(el).val().trim();	// el.value
	if(userid.length < 8) {
		comment(el, '아이디는 8자 이상입니다.', 'danger');
	}
	else {
		
	}
}

function onBlurPw(el) {

}

function onBlurPw2(el) {

}

function onBlurEmail(el) {

}