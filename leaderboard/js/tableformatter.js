/* Contentloader tasks
 *  1: leaderboard
 *  2: profileview
 *  3: profilepicture
 */
centerTables();

function centerTables() {
	var outerbox = document.getElementById("table_outerbox")
		.offsetWidth;
	var full_table_count = Math.floor(outerbox / 445);
	if (full_table_count > 4) full_table_count = 4;
	var formatter = full_table_count * 445;
	document.getElementById("table_formatter")
		.style.width = formatter + "px";
	var searchbar_x = document.getElementById("table_outerbox")
		.offsetLeft + (outerbox - full_table_count * 445) / 2 + 10;
	document.getElementById("searchcontainer")
		.style.marginRight = searchbar_x + "px";
}

function loadProfilePic() {
	var form = new FormData();
	form.append("task", 2);
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