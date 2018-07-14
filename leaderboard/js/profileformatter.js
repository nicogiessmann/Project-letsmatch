responsiveView();
var searchbar_reset_timeout_id = undefined;

function responsiveView() {
	var profileTop = 0.5 * window.innerHeight - 250;
	if (profileTop < 90) {
		document.getElementById("profile_view")
			.style.top = "90px";
	} else {
		document.getElementById("profile_view")
			.style.top = "calc(50% - 250px)";
	}
}

function dropdownOpen() {
	document.getElementById("profile_view")
		.style.visibility = "hidden";
}

function dropdownClose() {}

function profile_view_close() {
	document.getElementById("profile_view")
		.style.visibility = "hidden";
	document.getElementById("dropdown_background")
		.style.opacity = "0";
	id = setTimeout(function () {
		document.getElementById("dropdown_background")
			.style.display = "none";
	}, 205);
}

function decreaseWidth() {
	document.getElementById("searchbar")
		.style.width = "202.5px";
}

function loadExamples() {
	document.getElementById("searchbar")
		.style.width = "232.5px";
	document.getElementById("offerbox")
		.style.visibility = "visible";
		document.getElementById("searcharrow")
		.style.visibility = "visible";
	clearTimeout(searchbar_reset_timeout_id);
	searchbar_reset_timeout_id = setTimeout(function () {
		decreaseWidth();
		document.getElementById("offerbox")
			.style.visibility = "hidden";
			document.getElementById("searcharrow")
			.style.visibility = "hidden";
	}, 3000);
	var form = new FormData();
	form.append("task", 4);
	form.append("guess", encodeURI(String(document.getElementById("searchbar")
		.value)));
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			var useroffers = document.getElementById("useroffers");
			if (checkError(response)) {
				if (response == "!018") {
					console.log("User-guess erwartet mehr als 2 Buchstaben, weniger gegeben.");
					useroffers.innerHTML = "";
				} else {
					console.error("contentloader.js PHP-ERROR: response=\"" + response + "\"");
				}
			} else {
				try {
					var offers = JSON.parse(response);
					useroffers.innerHTML = "";
					for (var i = 0; i < offers.length; i++) {
						var newoffer = document.createElement("div");
						newoffer.className += "offer";
						newoffer.setAttribute("data-id", offers[i]["id"]);
						newoffer.setAttribute("data-username", offers[i]["username"]);
						newoffer.setAttribute("data-points", offers[i]["points"]);
						newoffer.setAttribute("data-place", offers[i]["place"]);
						var img = document.createElement("img");
						img.src = offers[i]["img"];
						newoffer.appendChild(img);
						var username_sign = document.createElement("div");
						username_sign.className += "username";
						username_sign.innerHTML = offers[i]["username"];
						newoffer.appendChild(username_sign);
						newoffer.onclick = function () {
							var id = this.getAttribute("data-id");
							var username = this.getAttribute("data-username");
							var place = this.getAttribute("data-place");
							var points = this.getAttribute("data-points");
							displayProfile(id, username, points, place);
							clearTimeout(searchbar_reset_timeout_id);
							decreaseWidth();
							document.getElementById("offerbox")
								.style.visibility = "hidden";
						};
						useroffers.appendChild(newoffer);
					}
				} catch (err) {
					console.error("contentloader.js JS-ERROR: response=\"" + response + "\"->" + err.message);
				}
			}
		}
	}
	xhttp.open("POST", "contentloader.php", true);
	xhttp.send(form);
}