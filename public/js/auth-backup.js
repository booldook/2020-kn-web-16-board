function comment(el, cmt, cls) {
	$(el).next().html(cmt);
	$(el).next().removeClass('active danger');
	$(el).next().addClass(cls);
}

var idChk = false;
var passChk = false;
var nameChk = false;
var emailChk = false;
function onBlurId(el) {
	function onResponse(r) {
		if(r.result) {
			comment(el, '멋진 아이디입니다. 사용가능합니다.', 'active');
			idChk = true;
			return true;
		}
		else {
			comment(el, '존재하는 아이디입니다. 사용할 수 없습니다.', 'danger');
			idChk = false;
			return false;
		}
	}
	var userid = $(el).val().trim();	// el.value
	if(userid.length < 8) {
		comment(el, '아이디는 8자 이상입니다.', 'danger');
		idChk = false;
		return false;
	}
	else {
		$.get('/auth/userid', { userid: userid }, onResponse);
	}
}

function onBlurPw(el) {
	var pw = $(el).val().trim();
	var len = pw.length;
	var num = pw.search(/[0-9]/g);	// >= 0
	var eng = pw.search(/[a-z]/ig);	// >= 0
	var spe = pw.search(/[`~!@@#$%^&*|₩₩₩'₩";:₩/?]/gi);	// >= 0
	if(len < 8 || len > 20) {
		comment(el, '비밀번호는 8자 이상 20자 이하입니다.', 'danger');
		passChk = false;
		return false;
	}
	if(num < 0 || eng < 0 || spe < 0) {
		comment(el, '비밀번호는 영문자, 숫자, 특수문자를 포함하여야 합니다.', 'danger');
		passChk = false;
		return false;
	}
	comment(el, '비밀번호를 사용할 수 있습니다.', 'active');
	passChk = true;
	return true;
}

function onBlurPw2(el) {
	var f = document.joinForm;
	if(f.userpw.value.trim() !== f.userpw2.value.trim()) {
		comment(el, '비밀번호가 일치하지 않습니다.', 'danger');
		passChk = false;
		return false;
	}
	comment(el, '비밀번호를 사용할 수 있습니다.', 'active');
	passChk = true;
	return true;
}

function onBlurName(el) {
	if($(el).val().trim().length == 0) {
		comment(el, '이름을 입력하세요.', 'danger');
		nameChk = false;
		return false;
	}
	comment(el, '', 'active');
	nameChk = true;
	return true;
}

function onBlurEmail(el) {
	var emailVal = $(el).val().trim();
	var regExp = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i;
	if(emailVal.match(regExp) == null) {
		comment(el, '올바른 이메일이 아닙니다.', 'danger');
		emailChk = false;
		return false;
	}
	comment(el, '사용할 수 있는 이메일 입니다.', 'active');
	emailChk = true;
	return true;
}

function onJoin(f) {
	if(!idChk) {
		alert('아이디를 확인하세요.');
		f.userid.focus();
		return false;
	}
	if(!passChk) {
		alert('패스워드를 확인하세요.');
		f.userpw.focus();
		return false;
	}
	if(!nameChk) {
		alert('이름을 확인하세요.');
		f.username.focus();
		return false;
	}
	if(!emailChk) {
		alert('이메일을 확인하세요.');
		f.email.focus();
		return false;
	}
	return true;
}