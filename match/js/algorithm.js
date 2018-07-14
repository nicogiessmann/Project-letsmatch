/*
Algorithm variables
*/
var usedUsersCookie = "c_usedusers";
var points = null;
var place = null;
var bonus = null;
var user_id = null;
var data_person_one = undefined;
var data_person_two = undefined;
var inprogress = true;
var current_nbr = undefined;
var partlyID = undefined;
var partlyNbr = undefined;
var updateMode = undefined;
var winner_counter = {
	id: null,
	counter: 0
};
/*
 * Constants
 */
const IMAGE_SIZE = 1500;
const SAME_INDIVIDUAL = 5;
const DAILY_LIMIT_STRING = "c_daily_limit_";
const MAX_DAILY_LIMIT = 50;
const UPDATE_BOTH = "full";
const UPDATE_ONE = "partly";
/**
Setting up first match pair with image, usernames and stats.
Displays the user points and place (topbar).
Init Cookie/Clear Cookie for used users
*/
function loadStartSetup(callbackFunction) {
	//Display user stats
	if (userloggedin) {
		var form = new FormData();
		form.append("username", username);
		form.append("password", password);
		form.append("task", 1);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var response = this.responseText;
				if (response == "!08") {
					setUserLoggedInFalse();
					percent = 0.0;
				} else {
					setUserLoggedInTrue();
					parseUserStats(response);
					if (checkCookie(DAILY_LIMIT_STRING + user_id) == false) {
						initDailyLimitCookie();
					}
					percent = 1.0 - getDailyLimit() / MAX_DAILY_LIMIT;
					usedUsersCookie = "c_usedusers_" + user_id;
					if (checkCookie(usedUsersCookie) == false) {
						initUsedDataArray(usedUsersCookie);
					}
				}
				updateAnnotationStats();
				setUpMatchPair();
				//For efficiency purposes
				response = null;
			};
		}
		xhttp.open("POST", "match.php", true);
		xhttp.send(form);
		//For efficiency purposes
		form = null;
	} else {
		percent = 0.0;
		setUserLoggedInFalse();
		if (checkCookie(usedUsersCookie) == false) {
			initUsedDataArray(usedUsersCookie);
		}
		setUpMatchPair(usedUsersCookie);
	}
	//Set up match pair
	function setUpMatchPair() {
		uniq(usedUsersCookie);
		var form = new FormData();
		form.append("task", 2);
		form.append("mode", mode);
		form.append("user_id", user_id);
		form.append("gender", gender);
		if (mode == MODE_1VSR) {
			form.append("chosenone", user);
			var id_array = undefined;
			if (gender == GENDER_FEMALE) {
				addNewFemaleId(usedUsersCookie, user);
				id_array = getFemaleIds(usedUsersCookie);
			} else {
				addNewMaleId(usedUsersCookie, user);
				id_array = getMaleIds(usedUsersCookie);
			}
			for (var i = 0; i < id_array.length; i++) {
				if (id_array[i] == user) {
					id_array.splice(i, 1);
				}
			}
			form.append("id_array", JSON.stringify(id_array));
			winner_counter.id = user;
		} else {
			if (gender == GENDER_FEMALE) {
				form.append("id_array", JSON.stringify(getFemaleIds(usedUsersCookie)));
			} else {
				form.append("id_array", JSON.stringify(getMaleIds(usedUsersCookie)));
			}
		}
		//Safety timeout
		var timeout_id = setTimeout(function () {
			callbackFunction(false);
		}, 5000);
		var xhttp = new XMLHttpRequest();
		xhttp.onreadystatechange = function () {
			if (this.readyState == 4 && this.status == 200) {
				var response = this.responseText;
				if(response=="!020"){
					if(gender==GENDER_FEMALE){
						deleteFemaleIds(usedUsersCookie);
					}
					else{
						deleteMaleIds(usedUsersCookie);
					}
					clearTimeout(timeout_id);
					setUpMatchPair();
					return;
				}
				try {
					var data = JSON.parse(response);
					data_person_one = data.person_one;
					data_person_two = data.person_two;
					document.getElementById("us1")
						.innerHTML = data_person_one.username;
					document.getElementById("us2")
						.innerHTML = data_person_two.username;
					document.getElementById("text1")
						.innerHTML = data_person_one.description;
					document.getElementById("text2")
						.innerHTML = data_person_two.description;
					//Matcher Stats
					document.getElementById("points1")
						.innerHTML = data_person_one.points;
					document.getElementById("place1")
						.innerHTML = data_person_one.place;
					document.getElementById("points2")
						.innerHTML = data_person_two.points;
					document.getElementById("place2")
						.innerHTML = data_person_two.place;
					//End init Matcher stats
					resizeDataURL(data_person_one.base64_img_data, function (img1) {
						document.getElementById("image1")
							.src = '';
						document.getElementById("image1")
							.addEventListener("load", onimage1load);
						document.getElementById("image1")
							.src = img1;
					});

					function onimage1load() {
						document.getElementById("image1")
							.removeEventListener("load", onimage1load);
						resizeDataURL(data_person_two.base64_img_data, function (img2) {
							document.getElementById("image2")
								.src = '';
							document.getElementById("image2")
								.addEventListener("load", onimage2load);
							document.getElementById("image2")
								.src = img2;
						})
					}

					function onimage2load() {
						document.getElementById("image2")
							.removeEventListener("load", onimage2load);
						//For efficiency purposes
						img1 = null;
						img1 = null;
						data = null;
						clearInterval(timeout_id);
						callbackFunction(true);
					}
				} catch (err) {
					console.log(err.message);
					clearTimeout(timeout_id);
					callbackFunction(false);
				}
				//For efficiency purposes
				response = null;
			}
		}
		xhttp.open("POST", "match.php", true);
		xhttp.send(form);
		//For efficiency purposes
		form = null;
	}
}
/**
Find new match pair and update the images
*/
function findNewMatchPair(callback) {
	var startTime = new Date()
		.getTime();
	var form = new FormData();
	form.append("task", 5);
	form.append("gender", gender);
	form.append("user_id", user_id);
	console.log(current_nbr, partlyNbr, partlyID);
	var id_array = undefined;
	if (gender == GENDER_FEMALE) {
		id_array = getFemaleIds(usedUsersCookie);
	} else {
		id_array = getMaleIds(usedUsersCookie);
	} 
	console.log(id_array);
	updateMode = undefined;
	if (partlyID == undefined) {
		form.append("update_mode", UPDATE_BOTH);
		updateMode = UPDATE_BOTH;
	} else {
		updateMode = UPDATE_ONE;
		form.append("update_mode", UPDATE_ONE);
		for (var i = 0; i < id_array.length; i++) {
			if (id_array[i] == partlyID) {
				id_array.splice(i, 1);
			}
		}
		form.append("partlyID", partlyID);
	}
	form.append("id_array", JSON.stringify(id_array));
	//Safety timeout
	var timeout_id = setTimeout(function () {
		alert("Timeout error! Please inform the support.");
		hideMatchWindow();
	}, 5000);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if(response=="!020"){
				if(gender==GENDER_FEMALE){
					deleteFemaleIds(usedUsersCookie);
				}
				else{
					deleteMaleIds(usedUsersCookie);
				}
				clearTimeout(timeout_id);
				findNewMatchPair(callback);
				return;
			}
			var data = JSON.parse(response);
			var endTime = new Date()
				.getTime();
			var duration = endTime - startTime;
			if (duration >= 800) {
				update(data);
			} else {
				var leftTime = 800 - duration;
				setTimeout(callback_Time.bind(null, data), leftTime);
			}

			function callback_Time(data) {
				update(data);
			}

			function update(data) {
				if (updateMode == UPDATE_BOTH) {
					data_person_one = data.person_one;
					data_person_two = data.person_two;
				} else {
					if (partlyNbr == 0) {
						data_person_one.place = data.partly_id.place;
						data_person_one.bonus = data.partly_id.bonus;
						data_person_one.malus = data.partly_id.malus;
						data_person_two = data.second_id;
					} else {
						data_person_two.place = data.partly_id.place;
						data_person_two.bonus = data.partly_id.bonus;
						data_person_two.malus = data.partly_id.malus;
						data_person_one = data.second_id;
					}
					var saveone = data_person_one;
					data_person_one = data_person_two;
					data_person_two = saveone;
				}
				try {
					document.getElementById("us1")
						.innerHTML = data_person_one.username;
					document.getElementById("us2")
						.innerHTML = data_person_two.username;
					document.getElementById("text1")
						.innerHTML = data_person_one.description;
					document.getElementById("text2")
						.innerHTML = data_person_two.description;
					document.getElementById("points1")
						.innerHTML = data_person_one.points;
					document.getElementById("place1")
						.innerHTML = data_person_one.place;
					document.getElementById("points2")
						.innerHTML = data_person_two.points;
					document.getElementById("place2")
						.innerHTML = data_person_two.place;
					resizeDataURL(data_person_one.base64_img_data, function (img1) {
						document.getElementById("image1")
							.src = '';
						document.getElementById("image1")
							.addEventListener("load", onimage1load);
						document.getElementById("image1")
							.src = img1;
					});

					function onimage1load() {
						document.getElementById("image1")
							.removeEventListener("load", onimage1load);
						resizeDataURL(data_person_two.base64_img_data, function (img2) {
							document.getElementById("image2")
								.src = '';
							document.getElementById("image2")
								.addEventListener("load", onimage2load);
							document.getElementById("image2")
								.src = img2;
						})
					}

					function onimage2load() {
						document.getElementById("image2")
							.removeEventListener("load", onimage2load);
						//For efficiency purposes
						img1 = null;
						img1 = null;
						data = null;
						clearInterval(timeout_id);
						callback();
					}
				} catch (err) {
					console.log(err.message);
					clearTimeout(timeout_id);
					alert("Some error occurred! Please inform the support.");
					hideMatchWindow();
				}
			}
			//For efficiency purposes
			response = null;
		};
	}
	xhttp.open("POST", "match.php", true);
	xhttp.send(form);
}
/**
Add the bonus points to both profiles
*/
function addProfileBonus() {
	var form = new FormData();
	form.append("task", 3);
	form.append("gender", gender);
	if (current_nbr == 0) {
		form.append("id_winner", data_person_one.id);
		form.append("id_loser", data_person_two.id);
	} else {
		form.append("id_winner", data_person_two.id);
		form.append("id_loser", data_person_one.id);
	}
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			console.log(this.responseText);
			if (gender == GENDER_FEMALE) {
				addNewFemaleId(usedUsersCookie, data_person_one.id);
				addNewFemaleId(usedUsersCookie, data_person_two.id);
			} else {
				addNewMaleId(usedUsersCookie, data_person_one.id);
				addNewMaleId(usedUsersCookie, data_person_two.id);
			}
			uniq(usedUsersCookie);
		}
	};
	xhttp.open("POST", "match.php", true);
	xhttp.send(form);
	partlyID = undefined;
	if (mode == MODE_RVSR) {
		if (current_nbr == 0) {
			if (sameWinner(data_person_one.id)) {
				winner_counter.counter++;
			} else {
				winner_counter.id = data_person_one.id;
				winner_counter.counter = 1;
			}
			if (winner_counter.counter < SAME_INDIVIDUAL) {
				partlyID = data_person_one.id;
				partlyNbr = 0;
			}
		} else {
			if (sameWinner(data_person_two.id)) {
				winner_counter.counter++;
			} else {
				winner_counter.id = data_person_two.id;
				winner_counter.counter = 1;
			}
			if (winner_counter.counter < SAME_INDIVIDUAL) {
				partlyID = data_person_two.id;
				partlyNbr = 1;
			}
		}
	} else {
		partlyID = user;
		if (data_person_one.id == user) {
			partlyNbr = 0;
		} else {
			partlyNbr = 1;
		}
	}
}
/**
Add the bonus points to user account
*/
function addUserBonus() {
	increaseDailyLimit();
	updateAnnotationStats();
	var form = new FormData();
	form.append("user_id", user_id);
	form.append("daily_limit_counter", getDailyLimit());
	form.append("task", 4);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if (response != "!010") {
				var obj = JSON.parse(response);
				percent = 1.0 - getDailyLimit() / MAX_DAILY_LIMIT;
				if (obj.bonus != 0) {
					animateUserBonus(parseInt(obj.new_place), parseInt(obj.new_points), parseInt(obj.bonus));
				} else {
					hideStats();
				}
			} else {
				hideStats();
			}
		}
	};
	xhttp.open("POST", "match.php", true);
	xhttp.send(form);
}

function checkCookie(cname) {
	var cookie = getCookie(cname);
	if (cookie == null) {
		return false;
	}
	return true;
}

function setCookie(cname, cvalue, exdays) {
	document.cookie = cname + "=" + escape(cvalue) + ";expires=" + exdays + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = unescape(decodeURIComponent(document.cookie));
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
	return null;
}

function parseUserStats(stats) {
	var json_decoded = JSON.parse(stats);
	this.user_id = json_decoded[0];
	this.points = json_decoded[1];
	this.place = json_decoded[2];
	document.getElementById("personalpoints")
		.innerHTML = this.points;
	document.getElementById("personalplace")
		.innerHTML = this.place;
}

function initUsedDataArray(cname) {
	var d = new Date();
	d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
	var expires = d.toUTCString();
	var obj = {
		"expires": expires,
		"idfemale": [],
		"idmale": []
	};
	var json = JSON.stringify(obj);
	setCookie(cname, json, expires);
}

function addNewMaleId(cname, id) {
	var obj = JSON.parse(getCookie(cname));
	obj.idmale.push(id);
	setCookie(cname, JSON.stringify(obj), obj.expires);
}

function addNewFemaleId(cname, id) {
	var obj = JSON.parse(getCookie(cname));
	obj.idfemale.push(id);
	setCookie(cname, JSON.stringify(obj), obj.expires);
}

function getMaleIds(cname) {
	var obj = JSON.parse(getCookie(cname));
	return obj.idmale;
}

function getFemaleIds(cname) {
	var obj = JSON.parse(getCookie(cname));
	return obj.idfemale;
}

function deleteMaleIds(cname){
	var obj = JSON.parse(getCookie(cname));
	obj.idmale=[];
	setCookie(cname, JSON.stringify(obj), obj.expires);
}

function deleteFemaleIds(cname){
	var obj = JSON.parse(getCookie(cname));
	obj.idfemale=[];
	setCookie(cname, JSON.stringify(obj), obj.expires);
}

function uniq(cname) {
	try {
		var obj = JSON.parse(getCookie(cname));
		obj.idfemale = obj.idfemale.filter(function (value, index) {
			return obj.idfemale.indexOf(value) == index
		});
		obj.idmale = obj.idmale.filter(function (value, index) {
			return obj.idmale.indexOf(value) == index
		});
		setCookie(cname, JSON.stringify(obj), obj.expires);
		//For efficiency purposes
		obj = null;
	} catch (err) {
		console.log(err.name + ': ' + err.message);
	}
}

function resizeDataURL(database64, callback) {
	//Convert Base64 to Image-Type
	var img = new Image();
	img.src = database64;
	//Wait until creation is finished
	img.onload = function () {
		if (this.height == IMAGE_SIZE && this.width == IMAGE_SIZE) {
			//For efficiency purposes
			img = null;
			callback(database64);
			return;
		}
		//init canvas and context
		var canvas = document.createElement('canvas');
		var scale = IMAGE_SIZE / this.width;
		canvas.width = this.width * scale;
		canvas.height = this.height * scale;
		var ctx = canvas.getContext('2d');
		ctx.scale(scale, scale);
		ctx.drawImage(img, 0, 0, this.width, this.height);
		var resizedImage = canvas.toDataURL("image/jpeg", 1);
		clearCanvas(ctx, canvas);
		callback(resizedImage);
		//For efficiency purposes
		img = null;
		canvas = null;
		ctx = null;
		scale = null;
		resizedImage = null;
		return;
	}
}

function clearCanvas(context, canvas) {
	context.clearRect(0, 0, canvas.width, canvas.height);
	canvas.width = 1;
	canvas.height = 1;
}

function sameWinner(id) {
	return winner_counter.id == id;
}

function initDailyLimitCookie() {
	var d = new Date();
	d.setTime(d.getTime() + (24 * 60 * 60 * 1000));
	var expires = d.toUTCString();
	var obj = {
		"expires": expires,
		"counter": 0
	};
	setCookie(DAILY_LIMIT_STRING + user_id, JSON.stringify(obj), expires);
}

function increaseDailyLimit() {
	var obj = JSON.parse(getCookie(DAILY_LIMIT_STRING + user_id));
	obj.counter++;
	if (obj.counter > MAX_DAILY_LIMIT) {
		obj.counter = MAX_DAILY_LIMIT;
	}
	setCookie(DAILY_LIMIT_STRING + user_id, JSON.stringify(obj), obj.expires);
}

function getDailyLimit() {
	var obj = JSON.parse(getCookie(DAILY_LIMIT_STRING + user_id));
	return obj.counter;
}

function updateAnnotationStats() {
	var string = getDailyLimit() + "/" + MAX_DAILY_LIMIT;
	document.getElementById("bonuscounter")
		.innerHTML = string;
}