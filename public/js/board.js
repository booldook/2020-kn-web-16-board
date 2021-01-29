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

function onResize(e) {
	if($(this).width() > 767) {
		$('.mobile-sub').stop().slideUp(0);
	}
}
$(window).resize(onResize);