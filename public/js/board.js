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

function onApiRemove(id) {
	if(confirm("첨부파일을 삭제하면 저장여부와 상관없이 즉시 삭제됩니다.")) {
		$.get('/board/api/remove/'+id, function(r) {
			if(r.code == 200) {
				$('.file-wrap .legacy').remove();
			}
			else {
				alert(r.error);
			}
		});
	}
}