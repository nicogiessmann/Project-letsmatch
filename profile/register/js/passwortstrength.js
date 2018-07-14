var field = document.getElementById("passwortstrength");
const cdefault="#ffffff";
const cvweak="#ff5a5a";
const cweak="#ffb56a";
const cgood="#ffff6a";
const cstrong="#89e08f";
var sdefault=1;

setInterval(updatePasswortField, 100);

function updatePasswortField(){
	
	var value = document.getElementsByClassName('inputpasswort');
	var passwortempty=1;
	for(var i=0; i<value.length; i++){
		var x = value[i].value;
		if(x!=""){
			value=x;
			passwortempty=0;
			break;
		}
	}
	
	if(passwortempty==1){
		field.style.width="100%";
		field.style.backgroundColor=cdefault;
	}
	else{
		var el1 = document.getElementById("inputpassworten");
		var el2 = document.getElementById("inputpasswortde");
		if(el1.classList.contains("invalid") || el2.classList.contains("invalid")){
			field.style.width="100%";
			field.style.backgroundColor=cdefault;
		}
		else{
			if(field.style.transition!="width 0.5s linear"){
				field.style.transition="width 0.5s linear";
			}
			currentPasswordStrength = getPasswordStrength(value);
			if(currentPasswordStrength>0 && currentPasswordStrength<=25){
				field.style.backgroundColor=cvweak;
				field.style.width="25%";
			}
			else if(currentPasswordStrength>25 && currentPasswordStrength<=50){
				field.style.backgroundColor=cweak;
				field.style.width="50%";
			}
			else if(currentPasswordStrength>50 && currentPasswordStrength<=75){
				field.style.backgroundColor=cgood;
				field.style.width="75%";
			}
			else if(currentPasswordStrength>75 && currentPasswordStrength<=100){
				field.style.backgroundColor=cstrong;
				field.style.width="100%";
			}
		}
	}
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
