var toolbar = 'undo redo styleselect bold italic alignleft aligncenter alignright bullist numlist outdent indent code';

$(document).ready(function(){
	tinymce.init({
		selector:'#content',
		min_height: 300,
		plugins: 'code',
		toolbar: toolbar,
	});
});