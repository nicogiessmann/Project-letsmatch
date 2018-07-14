var url_params = getAllUrlParams();
var lang = url_params.lang;
delete url_params.lang;
const LANG_EN = "en";
const LANG_DE = "de";

var url_params_attributes = Object.keys(url_params);
for(var i=0; i<url_params_attributes.length; i++){
	if(url_params_attributes[i]==""){
		delete url_params_attributes[i];
	}
}

var url_params_array = [];
for(var i=0; i<url_params_attributes.length; i++){
	if(url_params_attributes[i]!=undefined)
	url_params_array.push([url_params_attributes[i], url_params[url_params_attributes[i]]]);
}

if(!(lang==LANG_DE || lang==LANG_EN)){
	var url_with_lang = window.location.pathname + "?";
	for(var i=0; i<url_params_array.length; i++){
		url_with_lang+=url_params_array[i][0]+"="+url_params_array[i][1]+"&";
	}
	url_with_lang+="lang=de";
	console.log(url_with_lang);
	window.location.href = url_with_lang;
}

var enElements = document.getElementsByClassName("en");
var deElements = document.getElementsByClassName("de");

function changeLang(source){
	var ulrparams = getAllUrlParams();
	delete ulrparams.lang;
	if(source=="ger"){
		if(lang==LANG_EN){
			var path = window.location.pathname+"?lang=de";
			for(var param in ulrparams){
				path+="&"+param+"="+ulrparams[param];
			}
			window.location.href=path;
		}
	}
	if(source=="eng"){
		if(lang==LANG_DE){
			var path = window.location.pathname+"?lang=en";
			for(var param in ulrparams){
				path+="&"+param+"="+ulrparams[param];
			}
			window.location.href=path;
		}
	}
}