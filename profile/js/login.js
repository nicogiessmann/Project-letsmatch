var falsepas = 0;
const UCPC = "!12",
    UCPI = "!03",
    UIPI = "!02";

function login(idcb1, idcb2) {
    console.log("Login script started!");

    var nutzername, passwort;

    nutzername = document.getElementsByClassName("usernameinput");
    if (lang == LANG_DE) {
        nutzername = nutzername[1].value;
    } else {
        nutzername = nutzername[0].value;
    }


    passwort = document.getElementsByClassName("passwordinput");
    if (lang == LANG_DE) {
        passwort = passwort[1].value;
    } else {
        passwort = passwort[0].value;
    }

    var nofieldempty = 0;

    if (nutzername == "") {
        console.log("Nutzername fehlt!");
        nutzername = document.getElementsByClassName("usernameinput");
        nutzername[0].value = "Missing username!";
        nutzername[1].value = "Fehlender Nutzername!";
        nutzername[2].value = "Missing username!";
        nutzername[3].value = "Fehlender Nutzername!";
        passwort = document.getElementsByClassName("passwordinput");
        for (var i = 0; i < nutzername.length; i++) {
            if (nutzername[i].classList.contains("invalid") == false) {
                nutzername[i].focus();
                nutzername[i].blur();
                nutzername[i].className += " invalid";
            }
        }
        invalidPassword();
    } else {
        if (passwort == "") {
            console.log("Passwort fehlt!");
            invalidPassword();
        } else {
            console.log("Nutzername und Passwort vorhanden!");
            nofieldempty = 1;
        }
    }

    if (nofieldempty == 1) {
        //Check if username exists and password is correct
        var form = new FormData();
        form.append("nutzername", nutzername);
        form.append("passwort", passwort);

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                var response = this.responseText;
                console.log(response);
                console.log("Formular empfangen.");
            };
            responseReact(response, nutzername, passwort);
        }
        xhttp.open("POST", "validation.php", true);
        xhttp.send(form);
        console.log("Formular gesendet.");
    }
}



function responseReact(responseText, nutzername, passwort) {

    if (responseText == UIPI) {
        nutzername = document.getElementsByClassName("usernameinput");
        nutzername[0].value = "Incorrect username!";
        nutzername[1].value = "Falscher Nutzername!";
        nutzername[2].value = "Incorrect username!";
        nutzername[3].value = "Falscher Nutzername!";
        for (var i = 0; i < nutzername.length; i++) {
            if (nutzername[i].classList.contains("invalid") == false) {
                nutzername[i].focus();
                nutzername[i].blur();
                nutzername[i].className += " invalid";
            }
        }
        invalidPassword();
    } else if (responseText == UCPI) {
        invalidPassword();
        falsepas++;
        if (falsepas == 5) {
            falsepas = 0;
            console.log("Passwort vergessen?");
        }
    } else if (responseText == UCPC) {

        if (nutzername.indexOf("@") != -1) {
            var form = new FormData();
            form.append("email", nutzername);

            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    var response = this.responseText;
                    console.log(response);
                    console.log("Formular empfangen.");
                    nutzername = response;

                    console.log("Nutzername und Passwort korrekt!");
                    var csessionname = "c_session_user=" + nutzername + "; path=/;";
                    var csessionpassword = "c_session_password=" + passwort + "; path=/;";
                    document.cookie = csessionname;
                    document.cookie = csessionpassword;
                    if (document.getElementById("checkboxh").checked == true) {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        var cusername = "c_temp_user=" + nutzername + "; " + expires + "; path=/;";
                        var cuserpassword = "c_temp_password=" + passwort + "; " + expires + "; path=/;";
                        document.cookie = cusername;
                        document.cookie = cuserpassword;
                    }
                    //Weiterleitung auf Profil
                    link("profile/profile.html");
                }
            }
            xhttp.open("POST", "getUserNameFromEmail.php", true);
            xhttp.send(form);
            console.log("Formular gesendet.");
        } else {
            console.log("Nutzername und Passwort korrekt!");
            var csessionname = "c_session_user=" + nutzername + "; path=/;";
            var csessionpassword = "c_session_password=" + passwort + "; path=/;";
            document.cookie = csessionname;
            document.cookie = csessionpassword;
            if (document.getElementById("checkboxh").checked == true) {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                var cusername = "c_temp_user=" + nutzername + "; " + expires + "; path=/;";
                var cuserpassword = "c_temp_password=" + passwort + "; " + expires + "; path=/;";
                document.cookie = cusername;
                document.cookie = cuserpassword;
            }
            //Weiterleitung auf Profil
            window.location = "profile/profile.html";
        }
    }

}

function backToDefault(klasse) {
    var el = document.getElementsByClassName(klasse);
    for (var i = 0; i < el.length; i++) {
        if (el[i].classList.contains("invalid")) {
            el[i].classList.remove("invalid");
            el[i].value = "";
        }
    }
}

function IDbackToDefault(id) {
    var el = document.getElementById(id);
    if (el.classList.contains("invalid")) {
        el.classList.remove("invalid");
        el.style.marginTop = "";
        el.style.marginLeft = "";
        el.style.marginBottom = "";
    }
    el.value = "";
}

function invalidPassword() {
    passwort = document.getElementsByClassName("passwordinput");
    for (var i = 0; i < passwort.length; i++) {
        if (passwort[i].classList.contains("invalid") == false) {
            passwort[i].classList += " invalid";
            passwort[i].value = "";
            passwort[i].focus();
            passwort[i].blur();
        }
    }
}