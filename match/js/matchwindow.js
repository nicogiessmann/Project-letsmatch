var descstate1 = 1,
	descstate2 = 1;
var statsstate = 0;
var userbonusupdate = false;
var ubstartx, ubstarty;
var ubendx, ubendy;
const speed = 3; //100px per 1s
var ddopen = false;
var percent = 1.0;
var reportone = 0,
	reporttwo = 0;
const DAILY_LIMIT_REACHED_STRING_EN = "Daily limit reached!";
const DAILY_LIMIT_REACHED_STRING_DE = "Tageslimit erreicht!";

function initMatchWindow() {
	loadStartSetup(initCallback); //callback Function
}

function initCallback(sucess) {
	if (sucess) {
		document.getElementById("matchwindow")
			.style.visibility = "visible";
		document.getElementById("pseudoformatter")
			.style.visibility = "hidden";
		document.getElementById("pseudoformatter")
			.style.overflow = "hidden";
		document.getElementById("text1")
			.style.display = "inline-block";
		document.getElementById("text2")
			.style.display = "inline-block";
		statsstate = 0;
		document.getElementById("reporticon1")
			.style.visibility = "visible";
		document.getElementById("reporticon1")
			.style.opacity = 1;
		document.getElementById("reporticon2")
			.style.visibility = "visible";
		document.getElementById("reporticon2")
			.style.opacity = 1;
		updateCircle();
		animateOpenDesc();
	} else {
		alert("Some error occurred! Please inform the support.");
	}
}

function animateOpenDesc() {
	descstate1 = 0;
	document.getElementById("text1")
		.style.visibility = "hidden";
	document.getElementById("desc1")
		.style.width = "15px";
	document.getElementById("desc1")
		.style.height = "15px";
	descstate2 = 0;
	document.getElementById("text2")
		.style.visibility = "hidden";
	document.getElementById("desc2")
		.style.width = "15px";
	document.getElementById("desc2")
		.style.height = "15px";
	setSize();
	descstate1 = 1;
	document.getElementById("desc1")
		.className += " opentransition";
	document.getElementById("text1")
		.style.visibility = "visible";
	descstate2 = 1;
	document.getElementById("desc2")
		.className += " opentransition";
	document.getElementById("text2")
		.style.visibility = "visible";
	setSize();
	setTimeout(function () {
		document.getElementById("desc1")
			.classList.remove("opentransition");
		document.getElementById("icon1")
			.innerHTML = "&#xE5CF;";
		document.getElementById("desc2")
			.classList.remove("opentransition");
		document.getElementById("icon2")
			.innerHTML = "&#xE5CF;";
		inprogress = false;
	}, 550);
}

function hideMatchWindow() {
	document.getElementById("matchwindow")
		.style.visibility = "hidden";
	document.getElementById("pseudoformatter")
		.style.visibility = "visible";
	document.getElementById("pseudoformatter")
		.style.overflow = "visible";
	document.getElementById("pseudoformatter")
		.scrollTop = "0px";
	document.getElementById("text1")
		.style.display = "none";
	document.getElementById("text2")
		.style.display = "none";
	document.getElementById("stats1")
		.style.opacity = "0";
	document.getElementById("stats2")
		.style.opacity = "0";
	document.getElementById("annotationswindow")
		.style.opacity = "0";
	document.getElementById("annotationswindow")
		.style.visibility = "hidden";
	//Close Dropdown if open
	if (ddopen) {
		document.getElementById("loginadvice")
			.style.visibility = "hidden";
		document.getElementById("loginadvice")
			.style.opacity = "0";
		document.getElementById("dropdown_background").style.display = "none";
		document.getElementById("dropdown_background").style.opacity = "0";
		document.getElementById("dropdown_background").removeEventListener("click", ddClick);
		ddopen = false;
	}
	inprogress = true;
	document.getElementById("reportdialog1")
		.style.opacity = 0;
	document.getElementById("reportdialog1")
		.style.display = "none";
	reportone = 0;
	document.getElementById("reportdialog2")
		.style.opacity = 0;
	document.getElementById("reportdialog2")
		.style.display = "none";
	reporttwo = 0;
	document.getElementById("reporticon1")
		.style.visibility = "hidden";
	document.getElementById("reporticon1")
		.style.opacity = 0;
	document.getElementById("reporticon2")
		.style.visibility = "hidden";
	document.getElementById("reporticon2")
		.style.opacity = 0;
}

function setSize() {
	var imgsize = document.getElementById("image1")
		.offsetWidth;
	var boxes = document.getElementsByClassName("description");
	if (descstate1 == 1) {
		boxes[0].style.width = 0.8 * imgsize + "px";
		if (boxes[0].style.width > 500) boxes[0].style.width = 500;
		boxes[0].style.height = 0.3 * imgsize + "px";
		if (boxes[0].style.height > 90) boxes[0].style.height = 90;
	}
	if (descstate2 == 1) {
		boxes[1].style.width = 0.8 * imgsize + "px";
		if (boxes[1].style.width > 500) boxes[1].style.width = 500;
		boxes[1].style.height = 0.3 * imgsize + "px";
		if (boxes[1].style.height > 90) boxes[1].style.height = 90;
	}
	var boxwidth1 = boxes[0].offsetWidth;
	var boxheight1 = boxes[0].offsetHeight;
	var boxwidth2 = boxes[1].offsetWidth;
	var boxheight2 = boxes[1].offsetHeight;
	var containerwidth = document.getElementById("centerdiv1")
		.offsetWidth;
	var containerheight = document.getElementById("centerdiv1")
		.offsetHeight;
	var statssize = document.getElementById("stats1")
		.offsetHeight;
	var window_width = window.innerWidth;
	var window_height = window.innerHeight;
	var refreshDivContainer_width = document.getElementById("refreshDiv1Container").offsetWidth;
	var refreshIcon_width = document.getElementById("refreshIcon1").offsetWidth;

	if (window_height < window_width) {

		var refreshIcon1_left = refreshDivContainer_width - imgsize + imgsize / 2 - refreshIcon_width / 2;
		var refreshIcon2_left = imgsize / 2 - refreshIcon_width / 2;
		document.getElementById("refreshIcon1").style.left = refreshIcon1_left + "px";
		document.getElementById("refreshIcon2").style.left = refreshIcon2_left + "px";

		var left1 = containerwidth - imgsize + (imgsize - statssize) / 2;
		var top = (containerheight - imgsize) / 2 + (imgsize - statssize) / 2;
		document.getElementById("stats1")
			.style.left = left1 + "px";
		document.getElementById("stats1")
			.style.top = top + "px";
		var left2 = (imgsize - statssize) / 2;
		document.getElementById("stats2")
			.style.left = left2 + "px";
		document.getElementById("stats2")
			.style.top = top + "px";
		document.getElementsByClassName("separator")[0].style.height = imgsize + "px";
		document.getElementsByClassName("separator")[0].style.width = "40px";
		if (descstate1 == 1) {
			var left = containerwidth - imgsize + 8 + (imgsize - 16 - boxwidth1) / 2;
		} else {
			var boxsizeclone = 0.8 * imgsize;
			if (boxsizeclone > 500) {
				boxsizeclone = 500;
			}
			var left = containerwidth - imgsize + (imgsize - boxsizeclone) / 2 + boxsizeclone - 23;
		}
		var bottom = (containerheight - imgsize + 16) / 2 + 4;
		boxes[0].style.left = left + "px";
		boxes[0].style.bottom = bottom + "px";
		if (descstate2 == 1) {
			var left = 8 + (imgsize - 16 - boxwidth2) / 2;
		} else {
			var boxsizeclone = 0.8 * imgsize;
			if (boxsizeclone > 500) {
				boxsizeclone = 500;
			}
			var left = (imgsize - boxsizeclone) / 2 + boxsizeclone - 23;
		}
		var bottom = (containerheight - imgsize + 16) / 2 + 4;
		boxes[1].style.left = left + "px";
		boxes[1].style.bottom = bottom + "px";
		var reporttop = 4,
			reportone_left = 4,
			reporttwo_right = 4;
		reporttop = (containerheight - imgsize) / 2 + 4;
		reportone_left = (containerwidth - imgsize) + 4;
		reporttwo_right = (containerwidth - imgsize) + 4;
		document.getElementById("reportwindow1")
			.style.top = reporttop + "px";
		document.getElementById("reportwindow1")
			.style.left = reportone_left + "px";
		document.getElementById("reportwindow2")
			.style.top = reporttop + "px";
		if (document.getElementById("reportwindow2")
			.style.left != "auto") {
			document.getElementById("reportwindow2")
				.style.left = "auto";
		}
		document.getElementById("reportwindow2")
			.style.right = reporttwo_right + "px";
	}
	else {

		var refreshIcon_left = refreshDivContainer_width / 2 - refreshIcon_width / 2;
		document.getElementById("refreshIcon1").style.left = refreshIcon_left + "px";
		document.getElementById("refreshIcon2").style.left = refreshIcon_left + "px";

		var left = (containerwidth - imgsize) / 2 + (imgsize - statssize) / 2;
		var top = (containerheight - imgsize) / 2 + (imgsize - statssize) / 2;
		document.getElementById("stats1")
			.style.left = left + "px";
		document.getElementById("stats2")
			.style.left = left + "px";
		document.getElementById("stats1")
			.style.top = top + "px";
		document.getElementById("stats2")
			.style.top = top + "px";
		document.getElementsByClassName("separator")[0].style.width = imgsize + "px";
		document.getElementsByClassName("separator")[0].style.height = "40px";
		if (descstate1 == 1) {
			var left = (containerwidth - imgsize) / 2 + (imgsize - boxwidth1) / 2;
		} else {
			var boxsizeclone = 0.8 * imgsize;
			if (boxsizeclone > 500) {
				boxsizeclone = 500;
			}
			var left = (containerwidth - imgsize) / 2 + boxsizeclone + (imgsize - boxsizeclone) / 2 - 23;
		}
		var bottom = 13.5;
		boxes[0].style.left = left + "px";
		boxes[0].style.bottom = bottom + "px";
		if (descstate2 == 1) {
			var left = (containerwidth - imgsize) / 2 + (imgsize - boxwidth2) / 2;
		} else {
			var boxsizeclone = 0.8 * imgsize;
			if (boxsizeclone > 500) {
				boxsizeclone = 500;
			}
			var left = (containerwidth - imgsize) / 2 + boxsizeclone + (imgsize - boxsizeclone) / 2 - 23;
		}
		var bottom = containerheight - imgsize + 13.5;
		boxes[1].style.left = left + "px";
		boxes[1].style.bottom = bottom + "px";
		var reportone_top = 4;
		var reporttwo_top = imgsize + 52;
		var reportleft = (containerwidth - imgsize) / 2 + 4;
		document.getElementById("reportwindow1")
			.style.top = reportone_top + "px";
		document.getElementById("reportwindow1")
			.style.left = reportleft + "px";
		document.getElementById("reportwindow2")
			.style.top = reporttwo_top + "px";
		if (document.getElementById("reportwindow2")
			.style.right != "auto") {
			document.getElementById("reportwindow2")
				.style.right = "auto";
		}
		document.getElementById("reportwindow2")
			.style.left = reportleft + "px";
	}
	var elupoints = document.getElementById("personalpoints");
	var elupointsOffset = offset(elupoints);
	ubendx = elupointsOffset.left;
	ubendy = elupointsOffset.top;
	if (userbonusupdate == false) {
		document.getElementById("number")
			.style.left = ubendx + "px";
		document.getElementById("number")
			.style.top = ubendy + "px";
	}
	updateCircle();
}

function hideDescription(nbr) {
	closeAnnotation();
	if (nbr == 1) {
		if (descstate1 == 1) {
			descstate1 = 0;
			document.getElementById("text1")
				.style.visibility = "hidden";
			document.getElementById("desc1")
				.style.width = "15px";
			document.getElementById("desc1")
				.style.height = "15px";
			document.getElementById("icon1")
				.innerHTML = "&#xE5CE;";
			setSize();
		} else {
			if (statsstate == 1) return;
			descstate1 = 1;
			document.getElementById("desc1")
				.className += " opentransition";
			document.getElementById("text1")
				.style.visibility = "visible";
			setSize();
			setTimeout(function () {
				document.getElementById("desc1")
					.classList.remove("opentransition");
				document.getElementById("icon1")
					.innerHTML = "&#xE5CF;";
			}, 500);
		}
	} else {
		if (descstate2 == 1) {
			descstate2 = 0;
			document.getElementById("text2")
				.style.visibility = "hidden";
			document.getElementById("desc2")
				.style.width = "15px";
			document.getElementById("desc2")
				.style.height = "15px";
			document.getElementById("icon2")
				.innerHTML = "&#xE5CE;";
			setSize();
		} else {
			if (statsstate == 1) return;
			descstate2 = 1;
			document.getElementById("desc2")
				.className += " opentransition";
			document.getElementById("text2")
				.style.visibility = "visible";
			setSize();
			setTimeout(function () {
				document.getElementById("desc2")
					.classList.remove("opentransition");
				document.getElementById("icon2")
					.innerHTML = "&#xE5CF;";
			}, 500);
		}
	}
}

function animateImagePopUp(nbr) {
	current_nbr = nbr;
	closeAnnotation();
	closeReportDialogs();
	hideReportIcons();
	if (ddopen) {
		document.getElementById("loginadvice")
			.style.opacity = "0";
		setTimeout(function () {
			document.getElementById("loginadvice")
				.style.visibility = "hidden";
			ddopen = false;
		}, 200);
	}
	if (inprogress == true) {
		return;
	}
	if (statsstate == 1) {
		return;
	}
	inprogress = true;
	var el;
	if (current_nbr == 0) {
		el = document.getElementById("image1");
	} else {
		el = document.getElementById("image2");
	}
	var startx = el.offsetLeft - 4;
	var starty = el.offsetTop - 4;
	var imgsize = el.offsetHeight;
	var range = 5;
	var posx = startx,
		posy = starty;
	var oldleft = el.style.left;
	var oldtop = el.style.top;
	var oldright = el.style.right;
	var oldbottom = el.style.bottom;
	var id = setInterval(function () {
		if (posx <= startx - range || posy <= starty - range) {
			clearInterval(id);
			var id2 = setInterval(function () {
				if (posx == startx + 7) {
					clearInterval(id2);
					el.style.maxWidth = "calc(100% - 8px)"
					el.style.maxHeight = "calc(100% - 8px)";
					el.style.top = oldtop;
					el.style.left = oldleft;
					el.style.right = oldright;
					el.style.bottom = oldbottom;
					el.style.margin = "auto";
					el.style.width = "auto";
					el.style.height = "auto";
					showStats();
				} else {
					posx++;
					posy++;
					el.style.left = posx + "px";
					el.style.top = posy + "px";
					var size = imgsize + 2 * (startx - posx);
					el.style.width = size + "px";
					el.style.height = size + "px";
				}
			}, 5);
		} else {
			posx--;
			posy--;
			el.style.left = posx + "px";
			el.style.top = posy + "px";
			var size = imgsize + 2 * (startx - posx);
			el.style.width = size + "px";
			el.style.height = size + "px";
			el.style.maxWidth = "none"
			el.style.maxHeight = "none";
			el.style.margin = "0px";
		}
	}, 5);
}

function showStats() {
	addProfileBonus();
	if (current_nbr == 0) {
		if (data_person_one.bonus != 0) {
			document.getElementById("bonus1")
				.innerHTML = "+" + data_person_one.bonus;
		} else {
			if (lang == LANG_DE) {
				document.getElementById("bonus1")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_DE;
			} else {
				document.getElementById("bonus1")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_EN;
			}
		}
		if (data_person_two.malus != 0) {
			document.getElementById("bonus2")
				.innerHTML = data_person_two.malus;
		} else {
			if (lang == LANG_DE) {
				document.getElementById("bonus2")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_DE;
			} else {
				document.getElementById("bonus2")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_EN;
			}
		}
	} else {
		if (data_person_two.bonus != 0) {
			document.getElementById("bonus2")
				.innerHTML = "+" + data_person_two.bonus;
		} else {
			if (lang == LANG_DE) {
				document.getElementById("bonus2")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_DE;
			} else {
				document.getElementById("bonus2")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_EN;
			}
		}
		if (data_person_one.malus != 0) {
			document.getElementById("bonus1")
				.innerHTML = data_person_one.malus;
		} else {
			if (lang == LANG_DE) {
				document.getElementById("bonus1")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_DE;
			} else {
				document.getElementById("bonus1")
					.innerHTML = DAILY_LIMIT_REACHED_STRING_EN;
			}
		}
	}
	document.getElementById("text1")
		.style.visibility = "hidden";
	document.getElementById("desc1")
		.style.width = "15px";
	document.getElementById("desc1")
		.style.height = "15px";
	document.getElementById("icon1")
		.innerHTML = "&#xE5CE;";
	descstate1 = 0;
	document.getElementById("text2")
		.style.visibility = "hidden";
	document.getElementById("desc2")
		.style.width = "15px";
	document.getElementById("desc2")
		.style.height = "15px";
	document.getElementById("icon2")
		.innerHTML = "&#xE5CE;";
	descstate2 = 0;
	document.getElementById("stats1")
		.style.opacity = "1";
	document.getElementById("stats2")
		.style.opacity = "1";
	statsstate = 1;
	setSize();
	setTimeout(function () {
		updateMatcherPoints();
	}, 500);
}

function updateMatcherPoints() {
	if (current_nbr == 0) {
		var malus_2 = data_person_two.malus;
		var bonus_1 = data_person_one.bonus;
		if ((data_person_two.points + malus_2) < 0) {
			malus_2 = -data_person_two.points;
		}
		if (bonus_1 != 0) {
			animateValue("points1", data_person_one.points, data_person_one.points + bonus_1, 400);
			animateValue("bonus1", bonus_1, 0, 400);
			data_person_one.points += bonus_1;
		}
		if (malus_2 != 0) {
			animateValue("points2", data_person_two.points, data_person_two.points + malus_2, 400);
			animateValue("bonus2", malus_2, 0, 400);
			data_person_two.points += malus_2;
		}
	} else {
		var malus_1 = data_person_one.malus;
		var bonus_2 = data_person_two.bonus;
		if ((data_person_one.points + malus_1) < 0) {
			malus_1 = -data_person_one.points;
		}
		if (bonus_2 != 0) {
			animateValue("points2", data_person_two.points, data_person_two.points + bonus_2, 400);
			animateValue("bonus2", bonus_2, 0, 400);
			data_person_two.points += bonus_2;
		}
		if (malus_1 != 0) {
			animateValue("points1", data_person_one.points, data_person_one.points + malus_1, 400);
			animateValue("bonus1", malus_1, 0, 400);
			data_person_one.points += malus_1;
		}
	}
	setTimeout(function () {
		if (userloggedin) {
			addUserBonus();
		} else {
			hideStats();
		}
	}, 500);
}

function animateValue(id, start, end, duration) {
	var obj = document.getElementById(id);
	var range = end - start;
	var minTimer = 50;
	var stepTime = Math.abs(Math.floor(duration / range));
	stepTime = Math.max(stepTime, minTimer);
	var startTime = new Date()
		.getTime();
	var endTime = startTime + duration;
	var timer;

	function run() {
		var now = new Date()
			.getTime();
		var remaining = Math.max((endTime - now) / duration, 0);
		var value = Math.round(end - (remaining * range));
		if (value > 0 && (id == "bonus1" || id == "bonus2")) {
			obj.innerHTML = "+" + value;
		} else {
			obj.innerHTML = value;
		}
		if (value == end) {
			clearInterval(timer);
		}
	}
	timer = setInterval(run, stepTime);
	run();
}

function animateUserBonus(new_place, new_points, bonus) {
	updateCircle();
	userbonusupdate = true;
	var number_el = document.getElementById("number");
	number_el.innerHTML = "+" + bonus;
	var ubstartx = 0,
		ubstarty = 0;
	var window_width = document.getElementById("matchwindow")
		.offsetWidth;
	var window_height = document.getElementById("matchwindow")
		.offsetHeight;
	if (window_height < window_width) {
		ubstartx = window_width / 2 - number_el.offsetWidth / 2;
		ubstarty = window_height / 2 - number_el.offsetHeight / 2;
	} else {
		ubstartx = window_width / 2 - number_el.offsetWidth / 2;
		ubstarty = window_height / 2 - number_el.offsetHeight / 2;
	}
	number_el.style.left = ubstartx + "px";
	number_el.style.top = ubstarty + "px";
	number_el.style.opacity = "1";
	var elupoints = document.getElementById("personalpoints");
	var elupointsOffset = offset(elupoints);
	ubendx = elupointsOffset.left;
	ubendy = elupointsOffset.top;
	//console.log(ubstartx, ubstarty, ubendx, ubendy);
	var xv = ubendx - ubstartx;
	var yv = ubendy - ubstarty;
	var vv = Math.sqrt(Math.pow(xv, 2) + Math.pow(yv, 2));
	var fittedspeed = 0.005 * vv * speed;
	var save = 0;
	setTimeout(function () {
		var id = setInterval(function () {
			xv = ubendx - ubstartx;
			yv = ubendy - ubstarty;
			if (xv < 0) {
				var speedx = -(Math.pow(xv, 2) / (Math.pow(xv, 2) + Math.pow(yv, 2))) * fittedspeed;
			} else {
				var speedx = (Math.pow(xv, 2) / (Math.pow(xv, 2) + Math.pow(yv, 2))) * fittedspeed;
			}
			if (yv < 0) {
				var speedy = -(Math.pow(yv, 2) / (Math.pow(xv, 2) + Math.pow(yv, 2))) * fittedspeed;
			} else {
				var speedy = (Math.pow(yv, 2) / (Math.pow(xv, 2) + Math.pow(yv, 2))) * fittedspeed;
			}
			ubstartx = ubstartx + speedx;
			ubstarty = ubstarty + speedy;
			number_el.style.left = ubstartx + "px";
			number_el.style.top = ubstarty + "px";
			var roundedxv = Math.round(xv / 10.0) * 10;
			var roundedyv = Math.round(yv / 10.0) * 10;
			if (roundedxv == 0 && roundedyv == 0) {
				clearInterval(id);
				userbonusupdate = false;
				number_el.style.opacity = "0";
				var personalpoints = parseInt(document.getElementById("personalpoints")
					.innerHTML);
				animateValue("personalpoints", personalpoints, personalpoints + bonus, 200);
				setTimeout(function () {
					document.getElementById("personalpoints")
						.innerHTML = new_points;
					document.getElementById("personalplace")
						.innerHTML = new_place;
					hideStats();
				}, 200)
			}
			save++;
			if (save > 400) {
				clearInterval(id);
				userbonusupdate = false;
				number_el.style.opacity = "0";
				var personalpoints = parseInt(document.getElementById("personalpoints")
					.innerHTML);
				animateValue("personalpoints", personalpoints, personalpoints + bonus, 200);
				save = 0;
				setTimeout(function () {
					hideStats();
					document.getElementById("personalpoints")
						.innerHTML = new_points;
					document.getElementById("personalplace")
						.innerHTML = new_place;
				}, 200)
			}
		}, 5);
	}, 200);
}

function offset(el) {
	var rect = el.getBoundingClientRect(),
		scrollLeft = window.pageXOffset || document.documentElement.scrollLeft,
		scrollTop = window.pageYOffset || document.documentElement.scrollTop;
	return {
		top: rect.top + scrollTop,
		left: rect.left + scrollLeft
	}
}

function hideStats() {
	/*
	Start to animate refresh icon
	*/
	var rotateid = startRotation();
	document.getElementById("stats1")
		.style.opacity = "0";
	document.getElementById("stats2")
		.style.opacity = "0";
	var imgsize = document.getElementById("image1")
		.offsetHeight;
	statsstate = 0;
	var con1 = document.getElementById("centerdiv1");
	var consize = con1.offsetWidth;
	var con1left = con1.offsetLeft;
	var con1top = con1.offsetTop;
	con1.style.left = con1left + "px";
	con1.style.top = con1top + "px";
	setTimeout(function () {
		con1.className += " movementTrans";
	}, 5);
	var con2 = document.getElementById("centerdiv2");
	var con2left = con2.offsetLeft;
	var con2top = con2.offsetTop;
	con2.style.left = con2left + "px";
	con2.style.top = con2top + "px";
	con2.style.right = "auto";
	setTimeout(function () {
		con2.className += " movementTrans";
	}, 10);
	var window_width = document.getElementById("matchwindow")
		.offsetWidth;
	var window_height = document.getElementById("matchwindow")
		.offsetHeight;
	setTimeout(function () {
		if (window_height < window_width) {
			var translatex = -consize - 4;
			con1.style.transform = "translate3d(" + translatex + "px,0px,0px)";
			con2.style.transform = "translate3d(" + (-translatex) + "px,0px,0px)";
		} else {
			var translatex = -(window_width - imgsize) / 2 - imgsize;
			var r = Math.round(Math.random());
			if (r == 0) {
				con1.style.transform = "translate3d(" + translatex + "px,0px,0px)";
				con2.style.transform = "translate3d(" + (-translatex) + "px,0px,0px)";
			} else {
				con1.style.transform = "translate3d(" + (-translatex) + "px,0px,0px)";
				con2.style.transform = "translate3d(" + translatex + "px,0px,0px)";
			}
		}
	}, 15);
	findNewMatchPair(match_pair_received);

	function match_pair_received() {
		if (window_height < window_width) {
			var translatex = 0;
			con1.style.transform = "translate3d(" + translatex + "px,0px,0px)";
			con2.style.transform = "translate3d(" + (-translatex) + "px,0px,0px)";
		} else {
			var translatex = 0;
			con1.style.transform = "translate3d(" + translatex + "px,0px,0px)";
			con2.style.transform = "translate3d(" + (-translatex) + "px,0px,0px)";
		}
		setTimeout(function () {
			if (window_height < window_width) {
				con1.style.top = "5px";
				con1.style.left = "5px";
				con1.classList.remove("movementTrans");
				con2.style.top = "5px";
				con2.style.left = "auto";
				con2.style.right = "5px";
				con2.classList.remove("movementTrans");
				//Change username
				animateOpenDesc();
				endRotation(rotateid);
			} else {
				con1.style.top = "5px";
				con1.style.left = "5px";
				con1.classList.remove("movementTrans");
				con2.style.top = "5px";
				con2.style.left = "auto";
				con2.style.right = "5px";
				con2.classList.remove("movementTrans");
				//Change username
				animateOpenDesc();
				endRotation(rotateid);
			}
			showReportIcons();
		}, 750);
	}
}

function startRotation() {
	var deg = 0;
	var rotate = setInterval(function () {
		deg += 2;
		if (deg > 360) deg = 0;
		document.getElementById("rotateIcon1")
			.style.transform = "rotate(" + deg + "deg)";
		document.getElementById("rotateIcon2")
			.style.transform = "rotate(" + deg + "deg)";
	}, 5);
	return rotate;
}

function endRotation(rotate) {
	clearInterval(rotate);
	document.getElementById("rotateIcon1")
		.style.transform = "rotate(0deg)";
	document.getElementById("rotateIcon2")
		.style.transform = "rotate(0deg)";
}

function ddClick() {
	if (ddopen == false && inprogress == false) {
		document.getElementById("loginadvice").style.visibility = "visible";
		document.getElementById("dropdown_background").style.display = "block";
		setTimeout(function () {
			document.getElementById("loginadvice").style.opacity = "1";
			document.getElementById("dropdown_background").style.opacity = "0.5";
			document.getElementById("dropdown_background").addEventListener("click", ddClick);
		}, 20);
		ddopen = true;
	} else {
		document.getElementById("loginadvice")
			.style.opacity = "0";
		document.getElementById("dropdown_background").style.opacity = "0";
		setTimeout(function () {
			document.getElementById("loginadvice")
				.style.visibility = "hidden";
			document.getElementById("dropdown_background").style.display = "none";
			document.getElementById("dropdown_background").removeEventListener("click", ddClick);
			ddopen = false;
		}, 200);
	}
}

function updateCircle() {
	var circlesize = document.getElementById("circle")
		.offsetHeight;
	document.getElementById("circle_background")
		.style.width = circlesize + "px";
	var updated_height = Math.ceil(percent * circlesize);
	document.getElementById("circle_background")
		.style.height = updated_height + "px";
}

function openAnnotation() {
	if (userloggedin && inprogress == false) {
		document.getElementById("annotationswindow")
			.style.visibility = "visible";
		document.getElementById("annotationswindow")
			.style.opacity = "1";
	}
}

function closeAnnotation() {
	document.getElementById("annotationswindow")
		.style.opacity = "0";
	setTimeout(function () {
		document.getElementById("annotationswindow")
			.style.visibility = "hidden";
	}, 200);
}

function interactReportDialog(dialog_nbr) {
	if (dialog_nbr == 0) {
		if (reportone == 0 && !inprogress) {
			document.getElementById("reportdialog1")
				.style.display = "inline-block";
			document.getElementById("reportdialog1")
				.style.opacity = 1;
			setTimeout(function () {
				reportone = 1;
			}, 200);
		} else {
			document.getElementById("reportdialog1")
				.style.opacity = 0;
			setTimeout(function () {
				document.getElementById("reportdialog1")
					.style.display = "none";
				reportone = 0;
			}, 200);
		}
	} else {
		if (reporttwo == 0 && !inprogress) {
			document.getElementById("reportdialog2")
				.style.display = "inline-block";
			document.getElementById("reportdialog2")
				.style.opacity = 1;
			setTimeout(function () {
				reporttwo = 1;
			}, 200);
		} else {
			document.getElementById("reportdialog2")
				.style.opacity = 0;
			setTimeout(function () {
				document.getElementById("reportdialog2")
					.style.display = "none";
				reporttwo = 0;
			}, 200);
		}
	}
}

function closeReportDialogs() {
	if (reportone == 1) {
		document.getElementById("reportdialog1")
			.style.opacity = 0;
		setTimeout(function () {
			document.getElementById("reportdialog1")
				.style.visibility = "hidden";
			reportone = 0;
		}, 200);
	}
	if (reporttwo == 1) {
		document.getElementById("reportdialog2")
			.style.opacity = 0;
		setTimeout(function () {
			document.getElementById("reportdialog2")
				.style.visibility = "hidden";
			reporttwo = 0;
		}, 200);
	}
}

function hideReportIcons() {
	document.getElementById("reporticon1")
		.style.opacity = 0;
	setTimeout(function () {
		document.getElementById("reporticon1")
			.style.visibility = "hidden";
	}, 200);
	document.getElementById("reporticon2")
		.style.opacity = 0;
	setTimeout(function () {
		document.getElementById("reporticon2")
			.style.visibility = "hidden";
	}, 200);
}

function showReportIcons() {
	document.getElementById("reporticon1")
		.style.visibility = "visible";
	document.getElementById("reporticon1")
		.style.opacity = 1;
	document.getElementById("reporticon2")
		.style.visibility = "visible";
	document.getElementById("reporticon2")
		.style.opacity = 1;
}

function report(dialog_nbr, reason) {
	var id = undefined;
	if (dialog_nbr == 0) {
		id = data_person_one.id;
	} else {
		id = data_person_two.id;
	}
	var form = new FormData();
	form.append("task", 6);
	form.append("id", id);
	form.append("reason", reason);
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function () {
		if (this.readyState == 4 && this.status == 200) {
			var response = this.responseText;
			if (response == "!111") {
				console.log("Report successfully send!");
			} else {
				console.log("Report not send!: " + response);
			}
		}
	};
	xhttp.open("POST", "match.php", true);
	xhttp.send(form);
}