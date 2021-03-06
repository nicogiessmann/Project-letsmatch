function dropdownOpen() { }
function dropdownClose() { }

//Read cookie values
const exdays = 5;
var username = undefined,
	password = undefined;
var userloggedin = false;
var c_session_user = getCookie("c_session_user");
var c_session_password = getCookie("c_session_password");
var c_temp_user = getCookie("c_temp_user");
var c_temp_password = getCookie("c_temp_password");
//Prüfung auf Session-Cookies
if (c_session_user != "" && c_session_password != "") {
	//Prüfung auf temp-Cookies
	if (c_temp_user != "" && c_temp_password != "") {
		//Timestamp aktualisieren
		updateTimestamp(c_temp_user, c_temp_password);
	}
	username = c_session_user;
	password = c_session_password;
	userloggedin = true;
	setProfileLabelsToUsername();
	loadProfilePic();
}
//Prüfung auf Temp-Cookies
else if (c_temp_user != "" && c_temp_password != "") {
	//Timestamp aktualisieren
	updateTimestamp(c_temp_user, c_temp_password);
	//Session Cookies erzeugen
	var csessionname = "c_session_user=" + c_temp_user + "; path=/;";
	var csessionpassword = "c_session_password=" + c_temp_password + "; path=/;";
	document.cookie = csessionname;
	document.cookie = csessionpassword;
	username = c_temp_user;
	password = c_temp_password;
	userloggedin = true;
	setProfileLabelsToUsername();
	loadProfilePic();
}

function updateTimestamp(nutzername, passwort) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	var cusername = "c_temp_user=" + nutzername + "; " + expires + "; path=/;";
	var cuserpassword = "c_temp_password=" + passwort + "; " + expires + "; path=/;";
	document.cookie = cusername;
	document.cookie = cuserpassword;
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

function setProfileLabelsToUsername() {
	var elm = document.getElementsByClassName("profilelabel");
	for (var i = 0; i < elm.length; i++) {
		elm[i].innerHTML = username;
	}
}

function loadProfilePic() {
	var form = new FormData();
	form.append("task", 1);
	form.append("username", encodeURI(username));
	form.append("password", encodeURI(password));
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if (checkError(response)) {
				if(response!="!019")
				console.error("contentloader.js PHP-ERROR: response=\"" + response + "\"");
			} else {
				document.getElementById("navddprofileimg")
					.src = response;
				document.getElementById("rightwrapperprofileimg")
					.src = response;
			}
		}
	}
	xhttp.open("POST", "contentloader.php", true);
	xhttp.send(form);
}

function checkError(response) {
	var responscode = undefined;
	try {
		responscode = response.substring(0, 2);
	} catch (err) {
		if (response == null || response.length == 0) {
			return true;
		}
		return false;
	}
	if (responscode == "!0") {
		return true;
	}
	return false;
}

function setUserLoggedInTrue() {
	userloggedin = true;
	document.getElementById("personalscore")
		.style.display = "inline-block";
	document.getElementById("logincontainer")
		.style.display = "none";
}

function setUserLoggedInFalse() {
	userloggedin = false;
	document.getElementById("personalscore")
		.style.display = "none";
	document.getElementById("logincontainer")
		.style.display = "inline-block";
}