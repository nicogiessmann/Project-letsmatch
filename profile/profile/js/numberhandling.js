var newnbrcorrect = false;
var tel = "";

function showNumberDialog(){

    document.getElementById("numberdialog").style.cssText = "display: inline-block";
    document.getElementById("passdialog").style.cssText = "display: none";
    document.getElementById("profiledialog").style.cssText = "display: none";
    document.getElementById("passdialog").style.cssText="display: none";
    document.getElementById("newnumberinput").style.display="none";
    document.getElementById("newnumbericon").style.cssText="display: none";
    document.getElementById("confirmbtn").style.cssText="display: none";

    var df = new FormData();
    df.append("nutzername", nutzername);
    df.append("passwort", passwort);
    df.append("job", 0); 
    var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;

                document.getElementById("firstdigits").innerHTML = response;
                tel = response;

            }
        }
    xhttp.open("POST", "updateNumber.php", true);
    xhttp.send(df);
        
    console.log("Formular gesendet.");

    document.getElementById("lastdigiticon").style.color = colorred;
    document.getElementById("lastdigiticon").innerHTML =iconcross;
    document.getElementById("lastdigitsinput").value = "";
    document.getElementById("lastdigitsinput").disabled = false;
    document.getElementById("lastdigitsinput").style.opacity = "1.0";
    document.getElementById("firstdigitsbox").style.opacity = "1.0";
    //document.getElementById("lastdigitsinput").focus();

    document.getElementById("newnumberinput").value = "";
    document.getElementById("newnumberinput").disabled = true;
    document.getElementById("newnumbericon").innerHTML = "&#xE14C;";
    document.getElementById("newnumbericon").style.color = "rgb(235, 43, 42)";

    newnbrcorrect = false;
}

function checkLastDigits(){

	var lastdigits = document.getElementById("lastdigitsinput").value;
	if(lastdigits.length == 4){
        var regex = lastdigits.match("^[0-9]+$");
        if(regex!=null){
            var df = new FormData();
            df.append("nutzername", nutzername);
            df.append("passwort", passwort);
            df.append("job", 1); 
            df.append("lastdigits", lastdigits);
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log("Formular empfangen.");
                    var response = this.responseText;

                    if(response == "!16"){
                        tel+=lastdigits;
                        document.getElementById("lastdigitsinput").disabled = true;
                        document.getElementById("lastdigitsinput").style.opacity = "0.5";
                        document.getElementById("firstdigitsbox").style.opacity = "0.5";
                        document.getElementById("newnumberinput").style.cssText="display: inline-block";
                        document.getElementById("newnumbericon").style.display="inline-block";
                        document.getElementById("confirmbtn").style.cssText="display: inline-block";
                        document.getElementById("lastdigiticon").style.cssText = "color: rgb(60,203,62)";
                        document.getElementById("lastdigiticon").innerHTML = "&#xE876;";
                        document.getElementById("newnumberinput").disabled = false;
                        document.getElementById("newnumberinput").focus();

                        return;
                    }  
                }
            }
            xhttp.open("POST", "updateNumber.php", true);
            xhttp.send(df);
        
            console.log("Formular gesendet.");
        }
	}

    document.getElementById("lastdigiticon").style.color = colorred;
    document.getElementById("lastdigiticon").innerHTML = iconcross;
}

function checkNewNumber(){

    var newnbr = document.getElementById("newnumberinput").value;
    //console.log(newnbr);
    //console.log(newnbr.match("^[0-9+]*$"));
    if(newnbr.match("^[0-9+]*$")!=null & newnbr.length >= 8){
        if(newnbr == tel){
            newnbrcorrect = false;
            document.getElementById("newnumbericon").innerHTML = "&#xE876;";
            document.getElementById("newnumbericon").style.color = "rgb(58, 58, 58)";
        }
        else{
            newnbrcorrect = true;
            document.getElementById("newnumbericon").innerHTML = "&#xE876;";
            document.getElementById("newnumbericon").style.color = "rgb(60,203,62)";
        }
    }
    else{
        newnbrcorrect = false;
        document.getElementById("newnumbericon").innerHTML = "&#xE14C;";
        document.getElementById("newnumbericon").style.color = "rgb(235, 43, 42)";
    }
}

function updateNumber(){

    if(newnbrcorrect){
        var df = new FormData();
        df.append("nutzername", nutzername);
        df.append("passwort", passwort);
        df.append("job", 2); 
        df.append("newnbr", document.getElementById("newnumberinput").value);
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;
                //console.log(response);
            }
        }
        xhttp.open("POST", "updateNumber.php", true);
        xhttp.send(df);
        
        console.log("Formular gesendet.");
    }
}

function hideNumberDialog(){

    document.getElementById("numberdialog").style.cssText = "display: none";
    document.getElementById("passdialog").style.cssText = "display: none";
    document.getElementById("profiledialog").style.cssText = "display: inline-block";
    document.getElementById("passdialog").style.cssText="display: none";

}