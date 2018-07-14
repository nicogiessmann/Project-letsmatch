function openPasswordDialog(){
	document.getElementById("logincontainer").style.display="none";
	document.getElementById("passwordDialog").style.display="inline-block";
}

function getWidth(){
	var width = window.innerWidth
	|| document.documentElement.clientWidth
	|| document.body.clientWidth;
	return width;
}

function sendUsername(){

	var input = null;
	if(lang==LANG_EN){
		input = document.getElementById("usernameinputen").value;
		if(input==""){
			setInvalid("usernameinputen");
			document.getElementById("usernameinputen").value = "Username or email required!"
			input = null;
		}
		else{
			if(document.getElementById("usernameinputen").classList.contains("invalid")){
				input = null;
			}
			else if(input.match("^[\x21-\x7F]*$") == null){
				setInvalid("usernameinputen");
				document.getElementById("usernameinputen").value = "Username or email not valid!"
				input = null;
			}
		}
	}
	else{
		input = document.getElementById("usernameinputde").value;
		if(input==""){
			setInvalid("usernameinputde");
			document.getElementById("usernameinputde").value = "Nutzername oder E-Mail benötigt!"
			input = null;
		}
		else{
			if(document.getElementById("usernameinputde").classList.contains("invalid")){
				input = null;
			}
			else if(input.match("^[\x21-\x7F]*$") == null){
				setInvalid("usernameinputde");
				document.getElementById("usernameinputde").value = "Nutzername oder E-Mail nicht korrekt!"
				input = null;
			}
		}
	}

	if(input!=null){

		document.getElementById("applybutton").style.display = "none";
		document.getElementById("loader").style.display = "inline-block";

		passreset_username = input;

		var form = new FormData();
		form.append("username", passreset_username);
		form.append("lang", lang);

		var xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
     			var response = this.responseText;
     			console.log("Formular empfangen.");

     			if(response=="!02"){
     				if(lang==LANG_DE){
     					setInvalid("usernameinputde");
						document.getElementById("usernameinputde").value = "Nutzername oder E-Mail existiert nicht!"
     				}
     				else{
     					setInvalid("usernameinputen");
						document.getElementById("usernameinputen").value = "Username or email not found!"
     				}
     				document.getElementById("applybutton").style.display = "inline-block";
					document.getElementById("loader").style.display = "none";
     			}
     			else{
     				document.getElementById("passinfo").style.display = "none";
     				document.getElementById("passinput").style.display = "none";
     				document.getElementById("passcodeinput").style.display = "inline-block";
     			}
    		}
  		};
  		xhttp.open("POST", "passwordreset.php", true);
  		xhttp.send(form);
  		console.log("Formular gesendet.");
	}
}

function sendEmailAgain(){

	if(passreset_username==""){
		backToLogin();
	}
	else{
		var form = new FormData();
		form.append("username", passreset_username);
		form.append("lang", lang);

		var xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
     			var response = this.responseText;
     			console.log(response);
     			console.log("Formular empfangen.");

     			if(response=="!02"){
     				backToLogin();
     			}     			
    		}
  		};
  		xhttp.open("POST", "passwordreset.php", true);
  		xhttp.send(form);
  		console.log("Formular gesendet.");
	}
}

function checkCode(){

	var input = document.getElementById("passcodeinputfield").value;
	//console.log(input);
	var isnum = /^\d+$/.test(input);


	if(input.length==6 && isnum && passreset_username!=""){

		var form = new FormData();
		form.append("username", passreset_username);
		form.append("code", input);

		var xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
     			var response = this.responseText;
     			//console.log(response);
     			console.log("Formular empfangen.");

     			if(response=="!06"){
     				setInvalid("passcodeinputfield");
     			}
     			else if(response="!19"){
     				passreset_code = input;
     				document.getElementById("passcodeinput").style.display = "none";
     				document.getElementById("passnewpass").style.display = "inline-block";
     			}
     			
    		}
  		};
  		xhttp.open("POST", "checkCode.php", true);
  		xhttp.send(form);
  		console.log("Formular gesendet.");
	}
	else{
		setInvalid("passcodeinputfield");
		if(isnum || input==""){
			IDbackToDefault("passcodeinputfield");
			document.getElementById("passcodeinputfield").value = input;
		}
	}
}

function updatePass(){

	var input = document.getElementById("passnewpassfield").value;
	var strength = getPasswordStrength(input);

	if(strength>=75){
		var form = new FormData();
		form.append("username", passreset_username);
		form.append("code", passreset_code);
		form.append("newpass", input);

		var xhttp = new XMLHttpRequest();
  		xhttp.onreadystatechange = function() {
    		if (this.readyState == 4 && this.status == 200) {
     			var response = this.responseText;
     			//console.log(response);
     			console.log("Formular empfangen.");

     			if(response=="!05"){
     				setInvalid("passnewpassfield");
     			}
     			else if(response="!17"){
     				backToLogin();
     			}
     			
    		}
  		};
  		xhttp.open("POST", "updatePass.php", true);
  		xhttp.send(form);
  		console.log("Formular gesendet.");
	}
	else{
		setInvalid("passnewpassfield");
	}
}

function backToLogin(){
	document.getElementById("passinfo").style.display = "inline-block";
	document.getElementById("passinput").style.display = "inline-block";
	document.getElementById("passcodeinput").style.display = "none";
	document.getElementById("passnewpass").style.display = "none";
	document.getElementById("passwordDialog").style.display = "none";
	document.getElementById("logincontainer").style.display = "inline-block";
	document.getElementById("applybutton").style.display = "inline-block";
	document.getElementById("loader").style.display = "none";
	if(lang==LANG_DE){
		IDbackToDefault("usernameinputde");
	}
	else{
		IDbackToDefault("usernameinputen");
	}
	IDbackToDefault("passcodeinputfield");
	IDbackToDefault("passnewpassfield");
	passreset_username = "";
	passreset_code = "";

}

var strongRegex = new RegExp("^(?=.{8,})(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*\\W).*$");
var mediumRegex = new RegExp("^(?=.{7,})(((?=.*[A-Z])(?=.*[a-z]))|((?=.*[A-Z])(?=.*[0-9]))|((?=.*[a-z])(?=.*[0-9]))).*$");
var enoughRegex = new RegExp("(?=.{6,}).*");

function getPasswordStrength(password){

	if(strongRegex.test(password)){
		return 100;
	}
	else if(mediumRegex.test(password)){
		return 75;
	}
	else if(enoughRegex.test(password)){
		return 50;
	}
	else{
		return 25;
	}
}

function setInvalid(id){
	if(document.getElementById(id).classList.contains("invalid")==false){
		document.getElementById(id).className += " invalid";
		/*var p = document.getElementById(id);
		var style = p.currentStyle || window.getComputedStyle(p);
		var top = (parseInt(style.marginTop, 10) - 2) + "px";
		p.style.marginTop = top;
		var left = (parseInt(style.marginLeft, 10) - 2) + "px";
		p.style.marginLeft = left;
		var bottom = (parseInt(style.marginBottom, 10) - 2) + "px";
		p.style.marginBottom = bottom;*/
	}
}