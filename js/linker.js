function link(url){

	var pathname = url + "?lang=" + lang;

	window.location.href=pathname;
}

function getLangURL(url){
	var pathname = url + "?lang=" + lang;
	return pathname;
}