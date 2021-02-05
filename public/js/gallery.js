function onPlus(el) {
	if($(".file-wrapper .file-wrap").length < 9) {
		var html = ``;
		html += '<div class="list-wrap file-wrap">';
		html += '<div class="title">첨부이미지</div>';
		html += '<div class="list">';
		html += '<input class="form-control-file" type="file" name="upfile">';
		html += '</div>';
		html += '<div class="bts">';
		html += '<i class="fa fa-minus-circle text-danger" onclick="onMinus(this)"></i>';
		html += '</div>';
		html += '</div>';
		$(".file-wrapper").append(html);
	}
	if($(".file-wrap").length >= 10) $(".file-wrap").eq(0).find("a").hide();
}

function onMinus(el) {
	$(el).parent().parent().remove();
	$(".file-wrap").eq(0).find("a").show();
}

