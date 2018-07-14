var currentPasswordStrength = 0; /*Between 0 and 100*/
//var imgfile;
//var imageinput = document.getElementById('inputimage');
var sociallink = "";
var socialidentifier = "";
var geo_latitude = "";
var geo_longitude = "";

function submitRegistration() {
    var vorname;
    var nachname;
    var email;
    var nutzername;
    var passwort;

    /*Vorname*/
    vorname = document.getElementsByClassName('inputvorname');
    var vornameempty = 1;
    for (var i = 0; i < vorname.length; i++) {
        var x = vorname[i].value;
        if (x != "") {
            vorname = x;
            vornameempty = 0;
            break;
        }
    }
    if (vornameempty == 1) {
        console.log("Vorname fehlt!");
        for (var i = 0; i < vorname.length; i++) {
            setInvalid(vorname[i]);
        }
        vorname[0].value = "Missing first name!";
        vorname[1].value = "Fehlender Vorname!";
        vorname = null;
    } else {
        var stringcorrect = vorname.search(/^[a-zA-ZÄäÖöÜüß ]+$/);
        if (vorname == "Missing first name!" || vorname == "Fehlender Vorname!") {
            vorname = null;
            console.log("Vorname fehlt!");
        } else if (stringcorrect == -1) {
            console.log("Vorname falsch!");
            vorname = document.getElementsByClassName('inputvorname');
            for (var i = 0; i < vorname.length; i++) {
                setInvalid(vorname[i]);
            }
            vorname[0].value = "Invalid first name!";
            vorname[1].value = "Fehlerhafter Vorname!";
            vorname = null;
        } else {
            console.log("Vorname: " + vorname);
        }
    }

    /*Nachname*/
    nachname = document.getElementsByClassName('inputnachname');
    var nachnameempty = 1;
    for (var i = 0; i < nachname.length; i++) {
        var x = nachname[i].value;
        if (x != "") {
            nachname = x;
            nachnameempty = 0;
            break;
        }
    }
    if (nachnameempty == 1) {
        console.log("Nachname fehlt!");
        for (var i = 0; i < nachname.length; i++) {
            setInvalid(nachname[i]);
        }
        nachname[0].value = "Missing last name!";
        nachname[1].value = "Fehlender Nachname!";
        nachname = null;
    } else {
        var stringcorrect = nachname.search(/^[a-zA-ZÄäÖöÜüß ]+$/);
        if (nachname == "Missing last name!" || nachname == "Fehlender Nachname!") {
            nachname = null;
            console.log("Nachname fehlt!");
        } else if (stringcorrect == -1) {
            console.log("Nachname falsch!");
            nachname = document.getElementsByClassName('inputnachname');
            for (var i = 0; i < nachname.length; i++) {
                setInvalid(nachname[i]);
            }
            nachname[0].value = "Invalid last name!";
            nachname[1].value = "Fehlerhafter Nachname!";
            nachname = null;
        } else {
            console.log("Nachname: " + nachname);
        }
    }

    /*EMail*/
    email = document.getElementsByClassName('inputemail');
    var emailempty = 1;
    for (var i = 0; i < email.length; i++) {
        var x = email[i].value;
        if (x != "") {
            email = x;
            emailempty = 0;
            break;
        }
    }
    if (emailempty == 1) {
        console.log("Email fehlt!");
        for (var i = 0; i < email.length; i++) {
            setInvalid(email[i]);
        }
        email[0].value = "Missing email!";
        email[1].value = "Fehlende E-Mail!";
        email = null;
    } else {
        var stringcorrect = email.indexOf("@");
        if(stringcorrect!=-1){
            stringcorrect = email.indexOf(".");
        }

        if (email == "Missing email!" || email == "Fehlende E-Mail!") {
            email = null;
            console.log("Email fehlt!");
        } else if (stringcorrect == -1) {
            console.log("E-Mail falsch!");
            email = document.getElementsByClassName('inputemail');
            for (var i = 0; i < email.length; i++) {
                setInvalid(email[i]);
            }
            email[0].value = "Invalid email!";
            email[1].value = "Fehlerhafte E-Mail!";
            email = null;
        } else {
            console.log("E-Mail: " + email);
        }
    }
    
    /*Telefonnummer*/
    /*
    tel = document.getElementsByClassName('inputtel');
    var telempty = 1;
    for (var i = 0; i < tel.length; i++) {
        var x = tel[i].value;
        if (x != "") {
            tel = x;
            telempty = 0;
            break;
        }
    }
    if (telempty == 1) {
        console.log("Telefonnummer fehlt!");
        for (var i = 0; i < tel.length; i++) {
            if (tel[i].classList.contains("invalid") == false) {
                tel[i].className += " invalid";
            }
        }
        tel[0].value = "Missing WhatsApp-Number!";
        tel[1].value = "Fehlende WhatsApp-Nummer!";
        tel = null;
    } else {
        var stringcorrect = tel.search(/^[0-9+]*$/);
        if (tel == "Missing WhatsApp-Number!" || tel == "Fehlende WhatsApp-Nummer!" || tel == "Invalid WhatsApp-Number (only '0-9' and '+' allowed)!" || tel == "Fehlerhaft WhatsApp-Nummer (nur '0-9' und '+' erlaubt)!") {
            tel = null;
            console.log("Telefonnummer fehlt!");
        } else if (stringcorrect == -1) {
            console.log("Telefonnummer falsch!");
            tel = document.getElementsByClassName('inputtel');
            for (var i = 0; i < tel.length; i++) {
                if (tel[i].classList.contains("invalid") == false) {
                    tel[i].className += " invalid";
                }
            }
            tel[0].value = "Invalid WhatsApp-Number (only '0-9' and '+' allowed)!";
            tel[1].value = "Fehlerhaft WhatsApp-Nummer (nur '0-9' und '+' erlaubt)!";
            tel = null;
        } else {
            console.log("Telefonnummer: " + nachname);
        }
    }
    */
    

    /*Nutzername*/
    nutzername = document.getElementsByClassName('inputnutzername');
    var nutzernameempty = 1;
    for (var i = 0; i < nutzername.length; i++) {
        var x = nutzername[i].value;
        if (x != "") {
            nutzername = x;
            nutzernameempty = 0;
            break;
        }
    }
    if (nutzernameempty == 1) {
        console.log("Nutzername fehlt!");
        for (var i = 0; i < nutzername.length; i++) {
            setInvalid(nutzername[i]);
        }
        nutzername[0].value = "Missing username!";
        nutzername[1].value = "Fehlender Nutzername!";
        nutzername = null;
    } else {
        if (nutzername == "Missing username!" || nutzername == "Fehlender Nutzername!" ||
            nutzername == "Username must be at least 6 characters long!" ||
            nutzername == "Nutzername muss mindestens 6 Zeichen lang sein!" ||
            nutzername == "Nutzername schon vergeben!" || nutzername == "Username already taken!" || nutzername == "Username has invalid syntax!" || nutzername == "Nutzername hat fehlerhafte Syntax!"){
            nutzername = null;
            console.log("Nutzername fehlt!");
        } else {
            if (nutzername.length < 6) {
                nutzername = document.getElementsByClassName('inputnutzername');
                setInvalid(nutzername[0]);
                setInvalid(nutzername[1]);
                nutzername[0].value = "Username must be at least 6 characters long!"
                nutzername[1].value = "Nutzername muss mindestens 6 Zeichen lang sein!"
                nutzername = null;
                console.log("Nutzername zu kurz!");
            } else {
                if (nutzername.match("^[\x21-\x7F]*$") == null) {
                    nutzername = document.getElementsByClassName('inputnutzername');
                    setInvalid(nutzername[0]);
                    setInvalid(nutzername[1]);
                    nutzername[0].value = "Username has invalid syntax!"
                    nutzername[1].value = "Nutzername hat fehlerhafte Syntax!"
                    nutzername = null;
                    console.log("Nutzername falsche Syntax!");
                }
                else{
                    console.log("Nutzername: " + nutzername);
                }
            }
        }
    }

    /*Passwort*/
    passwort = document.getElementsByClassName('inputpasswort');
    var passwortempty = 1;
    for (var i = 0; i < passwort.length; i++) {
        var x = passwort[i].value;
        if (x != "") {
            passwort = x;
            passwortempty = 0;
            break;
        }
    }
    if (passwortempty == 1) {
        console.log("Passwort fehlt!");
        for (var i = 0; i < passwort.length; i++) {
           setInvalid(passwort[i]);
        }
        passwort = null;
    } else {
        if (currentPasswordStrength < 75) {
            console.log("Passwort unsicher!");
            passwort = document.getElementsByClassName('inputpasswort');
            for (var i = 0; i < passwort.length; i++) {
                setInvalid(passwort[i]);
            }
            passwort = null;
        } else {
            console.log("Passwort: " + passwort);
        }
    }

    var captcha = document.getElementById("grecaptcha");
    var captcha_response = grecaptcha.getResponse();

    if (captcha_response.length == 0) {
        console.log("Captcha nicht ausgefüllt!");
        captcha_response = null;
    } else {
        console.log("Captcha ok.");
        console.log(captcha_response);
    }

    if(navigator.geolocation) {
        console.log("Geolocation supported!");
        navigator.geolocation.getCurrentPosition(setCoords, error);
        function setCoords(position){
            geo_latitude = position.coords.latitude;
            geo_longitude = position.coords.longitude;
        }
        function error(error){
            if(error.code == error.PERMISSION_DENIED){
                if(lang == LANG_EN){
                    alert("Permission for geolocation denied! Some features cannot be used.");
                }
                else if(lang == LANG_DE){
                    alert("Zugriff auf Ortungsdienste verwehrt! Einige Funktionen können nicht genutzt werden.");
                }
            }
        }
        //alert(geo_latitude + " " + geo_longitude); 
    }
    else{
        console.log("Geolocation not supported!");
    }

    if (vorname != null && nachname != null && email != null && nutzername != null && passwort != null && captcha_response != null) {
        addNewAccount(vorname, nachname, email, nutzername, passwort, captcha_response);
    }
}

function addNewAccount(vorname, nachname, email, nutzername, passwort, captcha_response){
    var form = new FormData();
        form.append("vorname", vorname);
        form.append("nachname", nachname);
        form.append("email", email);
        form.append("nutzername", nutzername);
        form.append("passwort", passwort);
        form.append("captcha", captcha_response);
        form.append("sociallink", sociallink);
        form.append("socialidentifier", socialidentifier);
        form.append("geo_latitude", geo_latitude);
        form.append("geo_longitude", geo_longitude);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;
                console.log(response);
                if (response != "!11") {
                    nutzername = document.getElementsByClassName('inputnutzername');
                    setInvalid(nutzername[0]);
                    setInvalid(nutzername[1]);
                    nutzername[0].value = "Username already taken!"
                    nutzername[1].value = "Nutzername schon vergeben!"
                } else {
                    //Set cookie
                    var cnutzername = "c_register_username=" + nutzername + "; path=/";
                    var cpasswort = "c_register_passwort=" + passwort + "; path=/";
                    document.cookie = cnutzername;
                    document.cookie = cpasswort;
                    link("../login.html");
                }
            }
        }
        xhttp.open("POST", "database.php", true);
        xhttp.send(form);
        console.log("Formular gesendet.");
}
function backToDefault(id1, id2) {
    var el1 = document.getElementById(id1);
    var el2 = document.getElementById(id2);
    if (el1.classList.contains("invalid") || el2.classList.contains("invalid")) {
        el1.classList.remove("invalid");
        el1.value = "";
        el2.classList.remove("invalid");
        el2.value = "";
        el1.style.marginTop = "";
        el1.style.marginLeft = "";
        el1.style.marginBottom = "";
        el2.style.marginTop = "";
        el2.style.marginLeft = "";
        el2.style.marginBottom = "";
    }
}

function setInvalid(el){
    if(el.classList.contains("invalid")==false){
        el.className += " invalid";
        var style = el.currentStyle || window.getComputedStyle(el);
        var top = (parseInt(style.marginTop, 10) - 2) + "px";
        el.style.marginTop = top;
        var left = (parseInt(style.marginLeft, 10) - 2) + "px";
        el.style.marginLeft = left;
        var bottom = (parseInt(style.marginBottom, 10) - 2) + "px";
        el.style.marginBottom = bottom;
    }
}
