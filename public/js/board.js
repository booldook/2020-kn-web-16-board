function onSave(f) {
	if(f.title.value.trim() == "") {
		alert('제목을 입력하세요.');
		f.title.focus();
		return false;
	}
	return true;
}