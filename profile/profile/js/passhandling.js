var passlength = 0;
var passcorrect = false;

function showPassDialog(){

    document.getElementById("profiledialog").style.display = "none";
    document.getElementById("passdialog").style.display ="inline-block";
    document.getElementById("newpass").style.display = "none";
    document.getElementById("confirm").style.display = "none";

    document.getElementById("oldpassinput").value = "";
    document.getElementById("oldpassicon").innerHTML = iconcross;
    document.getElementById("oldpassicon").style.color = colorred;
    document.getElementById("oldpassinput").focus();

    passlength = passwort.length;
    document.getElementById("oldpassinput").maxLength = passlength;
	document.getElementById("oldpassinput").disabled = false;
    document.getElementById("oldpassinput").style.opacity = "1";
}

function checkOldPassInput(){
	
	var input = document.getElementById("oldpassinput").value;
	document.getElementById("oldpassicon").innerHTML = iconcross;
    document.getElementById("oldpassicon").style.color = colorred;

	if(input.length == passlength){
		if(input == passwort){
			document.getElementById("oldpassicon").innerHTML = iconcorrect;
    		document.getElementById("oldpassicon").style.color = colorgreen;
    		document.getElementById("oldpassinput").disabled = true;
    		document.getElementById("oldpassinput").style.opacity = "0.5";

    		document.getElementById("newpass").style.display = "inline-block";
    		document.getElementById("confirm").style.display = "inline-block";
    		document.getElementById("newpassinput").value = "";
    		passwortstrength = 0;
    		updatePasswortField();
    		document.getElementById("newpassinput").focus();
		}
	}
}

function updateNewPassIcon(){
	
	updatePasswortField();
	//console.log(this.passstrength);
}

function updatePass(){

	if(passstrength>=75){

		var df = new FormData();
    	df.append("nutzername", nutzername);
    	df.append("passwort", passwort);
    	df.append("newpass", document.getElementById("newpassinput").value); 
    	var xhttp = new XMLHttpRequest();
        	xhttp.onreadystatechange = function () {
            	if (this.readyState == 4 && this.status == 200) {
                	console.log("Formular empfangen.");
                	var response = this.responseText;

                	if(response=="!17"){
                		passwort = document.getElementById("newpassinput").value;
                		var c_temp_password = getCookie("c_temp_password");
                    	if(c_temp_password!=""){
                        	var d = new Date();
                        	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        	var expires = "expires=" + d.toUTCString();
                        	var cpassword = "c_temp_password=" + passwort + "; " + expires + "; path=/;";
                        	document.cookie = cpassword;
                    	}
                    	var csessionname = "c_session_password=" + passwort + "; path=/;";
                    	document.cookie = csessionname;

                    	console.log(passwort);
                	}
            	}
        	}
    	xhttp.open("POST", "updatePass.php", true);
    	xhttp.send(df);
    	console.log("Formular gesendet.")
	}
}

function hidePassDialog(){

    document.getElementById("passdialog").style.display = "none";
    document.getElementById("profiledialog").style.display = "inline-block";

}