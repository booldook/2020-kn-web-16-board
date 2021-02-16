
var swiperIdx = 0;
var swiperSrc;
var swiper;

function onApiRemove(el, id) {
	if(confirm('첨부파일을 삭제하시겠습니까?')) {
		$.get('/gallery/api/remove/'+id, function(r){
			if(r.code == 200) {
				$(el).parents('.list-wrap').remove();
				$(".list-file-wrap > .bts").show();
			}
		});
	}
}

function onChgPlus(el) {
	if($(".list-file-wrap > .list-wrap").length < 10) {
		var html = '';
		html += '<div class="list-wrap file-wrapper">'; 
		html += '<div class="title">첨부이미지</div>';
		html += '<div class="file-wrap">';
		html += '<div class="list">';
		html += '<input class="form-control-file" type="file" name="upfile">';
		html += '</div>';
		html += '<div class="bts">';
		html += '<span class="bt-minus mr-2" onclick="onChgMinus(this);">';
		html += '<i class="fa fa-minus-circle text-danger"></i>';
		html += '</span>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
		$(".list-file-wrap").append(html);
	}
	if($(".list-file-wrap > .list-wrap").length >= 10) {
		$(".list-file-wrap > .bts").hide();
	}
}

function onChgMinus(el) {
	console.log($(el).parents('.list-wrap'));
	$(el).parents('.list-wrap').remove();
	$(".list-file-wrap > .bts").show();
}

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

function onSave(f) {
	if(f.title.value.trim() == "") {
		alert('제목을 입력하세요.');
		f.title.focus();
		return false;
	}
	if(!fileValid(f)) {
		alert("첨부파일은 1개 이상 등록하셔야 합니다.");
		return false;
	}
	if($(f).attr('name') == 'changeForm') {
		addFile(f);
	}
	return true;
}

function addFile(f) {
	var delfile = [];
	if(f.upfile.length) {
		for(var i=0; i<f.upfile.length; i++) {
			if(f.upfile[i].files.length == 1) {
				delfile.push({name: f.upfile[i].files[0].name, id: f.upfile[i].dataset.id})
			}
		}
	}
	else {
		if(f.upfile.files.length == 1) {
			delfile.push({name: f.upfile[i].files[0].name, id: f.upfile[i].dataset.id})
		}
	}
	f.delfile.value = JSON.stringify(delfile);
}

function fileValid(f) {
	var isFile = false;
	if(f.upfile) {
		if(f.upfile.length) {
			for(var i=0; i<f.upfile.length; i++) {
				if(f.upfile[i].files.length == 1) {
					isFile = true;
					break;
				}
			}
		}
		else {
			if(f.upfile.files.length == 1) isFile = true;
		}
	}
	console.log($(".legacy img").length);
	if($(".legacy img").length > 0) isFile = true;
	return isFile;
}



function onModalShow(el, e, id) {
	var html = '';
	e.stopPropagation();
	$(".modal-wrapper").css('display', 'flex');
	$(".modal-wrapper").css('opacity');
	$(".modal-wrapper").addClass('active');
	$('.modal-wrapper .loader').show();
	$('.modal-wrapper .modal-wrap').removeClass('active');
	/* $.ajax({
		url: '/gallery/api/view/'+id,
		type: 'get',
		dataType: 'json',
		success: function(r) {
			console.log(r);
		},
		error: function(xhr, status, error) {
			console.log(xhr, status, error);
		}
	}); */
	
	$.get('/gallery/api/view/'+id, function(r){
		swiperSrc = r.src;
		console.log(r);
		for(var i in r.src) {
			html += '<div class="swiper-slide">';
			html += '<img class="mw-100" src="'+r.src[i]+'" alt="image">';
			html += '</div>';
		}
		$('.modal-wrapper .swiper-wrapper').html(html);
		$('.modal-wrapper .info-wrapper .content').eq(0).html(r.title);
		$('.modal-wrapper .info-wrapper .content').eq(1).html(r.writer);
		$('.modal-wrapper .info-wrapper .content').eq(2).html(r.created);
		$('.modal-wrapper .info-wrapper .content').eq(3).html(r.content);
		if(r.src.length == 0) {
			$('.modal-wrapper .fa-info-circle').css('font-size', '3em');
			$('.modal-wrapper .fa-download').hide();
		}
		else {
			$('.modal-wrapper .fa-info-circle').css('font-size', '');
			$('.modal-wrapper .fa-download').show();
		}
		$('.modal-wrapper .swiper-wrapper').imagesLoaded(function(){
			$('.modal-wrapper .loader').hide();
			$('.modal-wrapper .modal-wrap').addClass('active');
			if(swiper) swiper.destroy();
			swiper = new Swiper('.swiper-container', {
				spaceBetween: 10,
				autoHeight: true,
				loop: true,
				pagination: {
					el: '.swiper-pagination',
					clickable: true
				},
			});
			swiper.on('slideChange', function() {
				swiperIdx = swiper.realIndex;
			});
		});
	});
}

function onDelete(el, e, id) {
	e.stopPropagation();
	if( confirm('정말로 삭제하시겠습니까?') ){
		location.href = '/gallery/delete/'+id;
	}
}

function onEdit(el, e, id) {
	e.stopPropagation();
	location.href = '/gallery/change/'+id;
}

function onModalHide() {
	$(".modal-wrapper").removeClass('active');
	$('.info-wrapper').removeClass('active');
	setTimeout(function(){
		$(".modal-wrapper").css('display', 'none');
	}, 350);
}

function onInfoShow() {
	$('.info-wrapper').addClass('active');
}

function onInfoHide() {
	$('.info-wrapper').removeClass('active');
}

function onDownload() {
	location.href = '/gallery/download?file='+swiperSrc[swiperIdx];
}

function init() {
	var $grid = $(".grid").imagesLoaded(onImagesLoaded);
	function onImagesLoaded() {
		$grid.masonry({
			itemSelector: '.grid-item',
			columnWidth: '.grid-sizer',
			percentPosition: true
		});
	}
}
init();