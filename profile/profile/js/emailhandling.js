function showEmailDialog(){
	console.log("Email Dialog");
	document.getElementById("profiledialog").style.display="none";
	document.getElementById("emaildialog").style.display="inline-block";
	document.getElementById("passicon").innerHTML=iconcross;
	document.getElementById("passicon").style.color=colorred;
	document.getElementById("passwordinput").focus();
}

function hideEmailDialog(){
	document.getElementById("profiledialog").style.display="inline-block";
	document.getElementById("emaildialog").style.display="none";
	document.getElementById("passwordinput").value="";
	document.getElementById("emailinput").value="";
	document.getElementById("passwordinput").disabled = false;
	document.getElementById("newemail").style.display="none";
	IDbackToDefault("emailinput");
}

function checkEmailInput(){

	var input = document.getElementById("emailinput").value;

	if(input.indexOf("@")!=-1 && input.indexOf(".")!=-1){
		var df = new FormData();
        df.append("nutzername", nutzername);
        df.append("passwort", passwort);
        df.append("email", input);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;
                if(response=="!110")
                	hideEmailDialog();
                }
            	else if(response=="!07"){
            		setInvalid("emailinput");
            		if(lang==LANG_DE){
            			document.getElementById("emailinput").value="Server Error!";
            		}
            		else{
            			document.getElementById("emailinput").value="Server error!";
            		}
            	}

            }
        xhttp.open("POST", "updateEmail.php", true);
        xhttp.send(df);
        console.log("Formular gesendet.");
	}
	else{
		setInvalid("emailinput");
        if(lang==LANG_DE){
            document.getElementById("emailinput").value="Ungültige E-Mail!";
        }
        else{
            document.getElementById("emailinput").value="Invalid email!";
        }
	}

}

function checkPassInput(){
	var input = document.getElementById("passwordinput").value;
	if(input.length == passwort.length){
		document.getElementById("passicon").innerHTML=iconcorrect;
		document.getElementById("passicon").style.color=colorgray;

		if(input == passwort){
			document.getElementById("passicon").innerHTML=iconcorrect;
			document.getElementById("passicon").style.color=colorgreen;
			document.getElementById("passwordinput").disabled = true;
			document.getElementById("newemail").style.display="inline-block";
			document.getElementById("emailinput").focus();
		}
	}
	else{
		document.getElementById("passicon").innerHTML=iconcross;
		document.getElementById("passicon").style.color=colorred;
	}
}

function IDbackToDefault(id){
	var el = document.getElementById(id);
	if(el.classList.contains("invalid")){
		el.classList.remove("invalid");
	}
	el.value="";
}

function setInvalid(id){
	if(document.getElementById(id).classList.contains("invalid")==false){
		document.getElementById(id).className += " invalid";
		document.getElementById(id).focus();
	}
}