/*
Script for Dropdown Menues
*/

var langddOpen = 0;
var navddOpen = 0;
const langHeight = 190;
const navHeight = 270;
const basisHeight = 60;

function checkResolution() {
	var stylesheet = getComputedStyle(document.getElementById("stylesheet_check")).display;
	if (stylesheet == "block" && navddOpen == 1) {
		navddOnClick();
	}
}

function langddOnClick() {
	//console.log("langddOnClick");

	if (document.getElementById('navdd').style.display == "inline-block") {
		document.getElementById('navdd').style.display = "none";
		document.getElementById('navddicon').style.color = "#3a3a3a";
		document.getElementById('topnav_overflow').style.height = basisHeight+"px";
		navddOpen = 0;
		document.getElementById("dropdown_background").removeEventListener("click", navddOnClick);
	}
	
	var id;

	if (langddOpen == 0) {
		langddOpen = 1;
		dropdownOpen(); //dd opening actions
		document.getElementById("dropdown_background").style.display = "block";
		document.getElementById('langdd').style.display = "inline-block";
		//document.getElementsByTagName("body")[0].style.overflow = "hidden";

		clearTimeout(id);
		id = setTimeout(function () {
			document.getElementById("dropdown_background").style.opacity = "0.5";
			document.getElementById('langddicon_one').style.color = "black";
			document.getElementById('langddicon_two').style.color = "black";
			document.getElementById('topnav_overflow').style.height = langHeight+"px";
			/*Designline*/
			document.getElementById("designline_left").style.backgroundColor = "#e36165";
			document.getElementById("designline_right").style.backgroundColor = "#81C1EC";
			document.getElementById("dropdown_background").addEventListener("click", langddOnClick);
		}, 20);
	}
	else {
		langddOpen = 0;
		dropdownClose();
		document.getElementById("dropdown_background").style.opacity = "0";
		document.getElementById('langddicon_one').style.color = "#3a3a3a";
		document.getElementById('langddicon_two').style.color = "#3a3a3a";
		document.getElementById('topnav_overflow').style.height = basisHeight+"px";
		/*Designline*/
		document.getElementById("designline_left").style.backgroundColor = "#81C1EC";
		document.getElementById("designline_right").style.backgroundColor = "#e36165";
		document.getElementById("dropdown_background").removeEventListener("click", langddOnClick);

		clearTimeout(id);
		id = setTimeout(function () {
			document.getElementById("dropdown_background").style.display = "none";
			document.getElementById('langdd').style.display = "none";
			//document.getElementsByTagName("body")[0].style.overflow = "initial";
		}, 205);
	}
}

function navddOnClick() {
	//console.log("navddOnClick");

	if (document.getElementById('langdd').style.display == "inline-block") {
		document.getElementById('langdd').style.display = "none";
		document.getElementById('langddicon_one').style.color = "#3a3a3a";
		document.getElementById('langddicon_two').style.color = "#3a3a3a"
		document.getElementById('topnav_overflow').style.height = basisHeight+"px";
		langddOpen = 0;
		document.getElementById("dropdown_background").removeEventListener("click", langddOnClick);
	}

	var dropdown_background_style = document.getElementById("dropdown_background").style;
	var id;

	if (navddOpen == 0) {
		navddOpen = 1;
		dropdownOpen();
		dropdown_background_style.display = "block";
		document.getElementById('navdd').style.display = "inline-block";
		//document.getElementsByTagName("body")[0].style.overflow = "hidden";

		clearTimeout(id);
		id = setTimeout(function () {
			dropdown_background_style.opacity = "0.5";
			document.getElementById('navddicon').style.color = "black";
			document.getElementById('topnav_overflow').style.height = navHeight+"px";
			/*Designline*/
			document.getElementById("designline_left").style.backgroundColor = "#e36165";
			document.getElementById("designline_right").style.backgroundColor = "#81C1EC";
			document.getElementById("dropdown_background").addEventListener("click", navddOnClick);
		}, 20);
	}
	else {
		navddOpen = 0;
		dropdownClose();
		dropdown_background_style.opacity = "0";
		document.getElementById('navddicon').style.color = "#3a3a3a";
		document.getElementById('topnav_overflow').style.height = basisHeight+"px";
		/*Designline*/
		document.getElementById("designline_left").style.backgroundColor = "#81C1EC";
		document.getElementById("designline_right").style.backgroundColor = "#e36165";
		document.getElementById("dropdown_background").removeEventListener("click", navddOnClick);

		clearTimeout(id);
		id = setTimeout(function () {
			dropdown_background_style.display = "none";
			document.getElementById('navdd').style.display = "none";
			//document.getElementsByTagName("body")[0].style.overflow = "initial";
		}, 205);
	}
}
