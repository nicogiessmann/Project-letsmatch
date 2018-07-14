if(lang==LANG_EN){
	switchEng();
}
else if(lang==LANG_DE){
	switchGer();
}

function switchEng(){
	console.log("Sprache: Englisch");

	for(var i=0; i<enElements.length; i++){
		enElements[i].style.display="inline-block";
	}

	for(var i=0; i<deElements.length; i++){
		deElements[i].style.display="none";
	}

	document.getElementById('langddeng').style.color="#E05054";
	document.getElementById('langddger').style.color="#4a4a4a";

	document.getElementsByTagName("html")[0].lang = "en";
}

function switchGer(){
	console.log("Sprache: Deutsch");
	
	for(var i=0; i<enElements.length; i++){
		enElements[i].style.display="none";
	}

	for(var i=0; i<deElements.length; i++){
		deElements[i].style.display="inline-block";
	}

	document.getElementById('langddger').style.color="#E05054";
	document.getElementById('langddeng').style.color="#4a4a4a";

	document.getElementsByTagName("html")[0].lang = "de";
}