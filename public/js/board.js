function onModal(src) {
	$(".modal-wrapper").addClass('active');
	$(".modal-wrapper .modal-img").attr('src', src);
}

function onModalClose() {
	$(".modal-wrapper").removeClass('active');
}

function onSave(f) {
	if(f.title.value.trim() == "") {
		alert('제목을 입력하세요.');
		f.title.focus();
		return false;
	}
	return true;
}

function onMobile() {
	$('.mobile-sub').stop().slideToggle(300);
}

$(window).resize(onResize);
function onResize(e) {
	if($(this).width() > 767) {
		$('.mobile-sub').stop().slideUp(0);
	}
}

function onRev(id) {
	if(confirm("정말로 삭제하시겠습니까?")) {
		location.href = '/board/remove/'+id;
	}
}