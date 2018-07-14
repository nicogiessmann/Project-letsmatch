const MODE_RVSR = "MODE_RVSR";
const MODE_1VSR = "MODE_1VSR";
const GENDER_MALE = 2;
const GENDER_FEMALE = 1;
const DIALOG_HEIGHT_STEP1 = 140.6;
const DIALOG_HEIGHT_STEP2 = 259;
const DIALOG_HEIGHT_STEP3 = 370;
var mode = undefined;
var gender = undefined;
var user = undefined;
var useroffers = undefined;
var timeout;
var urlobject = urlObject(window.location.href);
var url_mode = urlobject["parameters"]["mode"];

if (url_mode == MODE_1VSR) {
	setModeButtonClicked(1);
	var url_user = urlobject["parameters"]["user"];
	if (url_user != null) {
		getUserData(url_user, username, initURLSetUp);
	}
} else if (url_mode == MODE_RVSR) {
	setModeButtonClicked(0);
	var url_gender = urlobject["parameters"]["gender"];
	if (url_gender != null) {
		if (url_gender == GENDER_FEMALE) {
			setGenderButtonClicked(1);
			initURLSetUp(MODE_RVSR, [url_gender]);
		} else if (url_gender == GENDER_MALE) {
			setGenderButtonClicked(0);
			initURLSetUp(MODE_RVSR, [url_gender]);
		}
	}
}

function initURLSetUp(mode, data) {
	if (mode == MODE_1VSR) {
		document.getElementById("searchinput")
			.value = data[2];
		setUser(null);
		user = data[0];
		gender = data[1];
	} else if (mode == MODE_RVSR) {
		gender = data[0];
	}
}

function setModeButtonClicked(button) {
	if (button == 0) {
		if (mode == MODE_1VSR) {
			document.getElementById("checkbox_1vsr")
				.checked = false;
			setMode(MODE_RVSR);
		} else if (mode == MODE_RVSR) {
			document.getElementById("rvsrbutton")
			setMode(undefined);
		} else {
			setMode(MODE_RVSR);
			if(document.getElementById("checkbox_rvsr").checked==false)document.getElementById("checkbox_rvsr").checked=true;
		}
	} else {
		if (mode == MODE_RVSR) {
			document.getElementById("checkbox_rvsr")
				.checked = false;
			setMode(MODE_1VSR);
		} else if (mode == MODE_1VSR) {
			setMode(undefined);
		} else {
			setMode(MODE_1VSR);
			if(document.getElementById("checkbox_1vsr").checked==false)document.getElementById("checkbox_1vsr").checked=true;
		}
	}
}

function setMode(mode) {
	this.mode = mode;
	if (mode == MODE_RVSR) {
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP2 + "px";
		timeout = setTimeout(function () {
			document.getElementById("secondstep_1vsr")
				.style.display = "none";
			document.getElementById("secondstep_rvsr")
				.style.display = "inline-block";
		}, 200);
		resetUser();
	} else if (mode == MODE_1VSR) {
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP2 + "px";
		timeout = setTimeout(function () {
			document.getElementById("secondstep_rvsr")
				.style.display = "none";
			document.getElementById("secondstep_1vsr")
				.style.display = "inline-block";
		}, 200);
		resetGender();
	} else {
		clearTimeout(timeout);
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP1 + "px";
		document.getElementById("secondstep_rvsr")
			.style.display = "none";
		document.getElementById("secondstep_1vsr")
			.style.display = "none";
		resetGender();
		resetUser();
	}
}

function resetGender() {
	gender = undefined;
	document.getElementById("laststep")
		.style.display = "none";
	document.getElementById("checkbox_male")
		.checked = false;
	document.getElementById("checkbox_female")
		.checked = false;
}

function setGenderButtonClicked(button) {
	if (button == 0) {
		if (gender == GENDER_FEMALE) {
			document.getElementById("checkbox_female")
				.checked = false;
			setGender(GENDER_MALE);
		} else if (gender == GENDER_MALE) {
			setGender(undefined);
		} else {
			setGender(GENDER_MALE);
			if(document.getElementById("checkbox_male").checked==false)document.getElementById("checkbox_male").checked=true;
		}
	} else {
		if (gender == GENDER_MALE) {
			document.getElementById("checkbox_male")
				.checked = false;
			setGender(GENDER_FEMALE);
		} else if (gender == GENDER_FEMALE) {
			setGender(undefined);
		} else {
			setGender(GENDER_FEMALE);
			if(document.getElementById("checkbox_female").checked==false)document.getElementById("checkbox_female").checked=true;
		}
	}
}

function setGender(gender) {
	this.gender = gender;
	if (gender == GENDER_MALE | gender == GENDER_FEMALE) {
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP3 + "px";
		timeout = setTimeout(function () {
			document.getElementById("laststep")
				.style.display = "inline-block";
		}, 200);
	} else {
		clearTimeout(timeout);
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP2 + "px";
		document.getElementById("laststep")
			.style.display = "none";
	}
}

function letsMatchButtonClicked() {
	console.log(mode, gender, user);
	if (mode != undefined) {
		if (mode == MODE_RVSR) {
			if (gender != undefined) {
				initMatchWindow();
			}
		} else {
			if (user != undefined && gender != undefined) {
				initMatchWindow();
			}
		}
	}
}

function getUserOffers() {
	if (user != undefined) {
		resetUser();
		document.getElementById("selectdialog")
			.style.height = DIALOG_HEIGHT_STEP2 + "px";
	}
	var input = document.getElementById("searchinput")
		.value;
	if (input != "" && input.length > 2) {
		document.getElementsByClassName("offerwindow")[0].style.display = "inline-block";
		document.getElementsByClassName("offerwindow")[1].style.display = "inline-block";
		var form = new FormData();
		form.append("task", 1);
		form.append("useroffer", input);
		if (userloggedin) {
			form.append("username", username);
		}
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var response = this.responseText;
				useroffers = JSON.parse(response);
				var root = document.getElementsByClassName("offerwindow")[1];
				root.innerHTML = "";
				for (var i = 0; i < useroffers.length; i++) {
					var offer = document.createElement("div");
					offer.setAttribute("class", "user");
					var img = document.createElement("img");
					img.src = useroffers[i][2];
					var un = document.createElement("span");
					un.innerHTML = useroffers[i][1];
					offer.appendChild(img);
					offer.appendChild(un);
					offer.setAttribute("onclick", "setUser(" + String(i) + ");");
					root.appendChild(offer);
					var breakline = document.createElement("div");
					breakline.className += "breakline";
					root.appendChild(breakline);
				}
			}
		};
		xhttp.open("POST", "search.php", true);
		xhttp.send(form);
	} else if(input.length<=2 && input!=""){
		document.getElementsByClassName("offerwindow")[0].style.display = "inline-block";
		document.getElementsByClassName("offerwindow")[1].style.display = "inline-block";
	} else{
		document.getElementsByClassName("offerwindow")[0].style.display = "none";
		document.getElementsByClassName("offerwindow")[1].style.display = "none";
		document.getElementsByClassName("offerwindow")[1].innerHTML = "";
	}
}

function setUser(offernbr) {
	if (offernbr != null) {
		user = useroffers[offernbr][0];
		gender = useroffers[offernbr][3];
		document.getElementById("searchinput")
			.value = useroffers[offernbr][1];
	}
	document.getElementsByClassName("offerwindow")[0].style.display = "none";
	document.getElementsByClassName("offerwindow")[1].style.display = "none";
	document.getElementById("selectionstatus")
		.innerHTML = "&#xE876;";
	document.getElementById("selectionstatus")
		.style.color = "#60D462";
	document.getElementById("selectdialog")
		.style.height = DIALOG_HEIGHT_STEP3 + "px";
	timeout = setTimeout(function () {
		document.getElementById("laststep")
			.style.display = "inline-block";
	}, 200);
}

function resetUser() {
	user = undefined;
	document.getElementsByClassName("offerwindow")[0].style.display = "none";
	document.getElementsByClassName("offerwindow")[1].style.display = "none";
	document.getElementsByClassName("offerwindow")[1].innerHTML = "";
	document.getElementById("selectionstatus")
		.innerHTML = "&#xE14C;";
	document.getElementById("selectionstatus")
		.style.color = "#e36165";
	document.getElementById("laststep")
		.style.display = "none";
	document.getElementById("searchinput")
		.value = "";
}

function urlObject(options) {
	"use strict";
	/*global window, document*/
	var url_search_arr,
		option_key,
		i,
		urlObj,
		get_param,
		key,
		val,
		url_query,
		url_get_params = {},
		a = document.createElement('a'),
		default_options = {
			'url': window.location.href,
			'unescape': true,
			'convert_num': true
		};
	if (typeof options !== "object") {
		options = default_options;
	} else {
		for (option_key in default_options) {
			if (default_options.hasOwnProperty(option_key)) {
				if (options[option_key] === undefined) {
					options[option_key] = default_options[option_key];
				}
			}
		}
	}
	a.href = options.url;
	url_query = a.search.substring(1);
	url_search_arr = url_query.split('&');
	if (url_search_arr[0].length > 1) {
		for (i = 0; i < url_search_arr.length; i += 1) {
			get_param = url_search_arr[i].split("=");
			if (options.unescape) {
				key = decodeURI(get_param[0]);
				val = decodeURI(get_param[1]);
			} else {
				key = get_param[0];
				val = get_param[1];
			}
			if (options.convert_num) {
				if (val.match(/^\d+$/)) {
					val = parseInt(val, 10);
				} else if (val.match(/^\d+\.\d+$/)) {
					val = parseFloat(val);
				}
			}
			if (url_get_params[key] === undefined) {
				url_get_params[key] = val;
			} else if (typeof url_get_params[key] === "string") {
				url_get_params[key] = [url_get_params[key], val];
			} else {
				url_get_params[key].push(val);
			}
			get_param = [];
		}
	}
	urlObj = {
		protocol: a.protocol,
		hostname: a.hostname,
		host: a.host,
		port: a.port,
		hash: a.hash.substr(1),
		pathname: a.pathname,
		search: a.search,
		parameters: url_get_params
	};
	return urlObj;
}

function getUserData(id, username, callback) {
	var form = new FormData();
	form.append("task", 2)
	form.append("username", username);
	form.append("id", id);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if (response == "!012") {
				return;
			} else {
				response = JSON.parse(response);
				callback(MODE_1VSR, [id, response[0], response[1]]);
			}
		}
	};
	xhttp.open("POST", "search.php", true);
	xhttp.send(form);
}