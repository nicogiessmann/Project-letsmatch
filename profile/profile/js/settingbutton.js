/*
state=0 -> Profilansicht (Defautlt)
state=1 -> Editoransicht 
*/

var inputelements;
var showelements;
var ddstate = 0; //0=closed; 1=open

loadElements();

function switchModes() {

    if (state == 0) {
        //Design ändern

        document.getElementById("nicknamechange").value = this.nutzername;
        document.getElementById("nicknamechange").placeholder = this.nutzername;

        document.getElementById("descriptioninput").value = this.beschreibung;

        document.getElementById("descriptioninput").placeholder = this.beschreibung;

        for (var i = 0; i < showelements.length; i++) {
            showelements[i].style.cssText = "display: none!important";
        }

        for (var i = 0; i < inputelements.length; i++) {
            inputelements[i].style.cssText = "display: inline-block!important";
        }

        document.getElementById("stats").style.display = "none";

        document.getElementById("link").style.display = "none";

        //state aktualisieren


        state = 1;
    } else {
        //Save new profile values
        var df = new FormData();
        //VerificationData
        df.append("nutzername", getCookie("c_session_user"));
        df.append("passwort", getCookie("c_session_password"));
        if (image_uploaded == 2) {
            df.append("image", image);
        }
        else {
            df.append("image", "");
        }
        if (usernamevalid == 2) {
            var usern = document.getElementById("nicknamechange").value;
            nutzername = usern;
            df.append("neuernutzername", usern);
        }
        else {
            df.append("neuernutzername", "");
        }
        var desc = document.getElementById("descriptioninput").value;
        df.append("beschreibung", desc);
        beschreibung = desc;

        df.append("gender", gender);

        if (gender != 0 && (image_uploaded == 1 || image_uploaded == 2) && matchable == 0) {
            matchable = 2;
            df.append("matchable", "2");
        }
        else {
            if (gender != 0 && (image_uploaded == 1 || image_uploaded == 2)) {
                df.append("matchable", matchable);
            }
            else {
                matchable = 0;
                df.append("matchable", "0");
            }
        }


        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;

                if (response == "!14") {

                    var c_temp_user = getCookie("c_temp_user");
                    if (c_temp_user != "") {
                        var d = new Date();
                        d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                        var expires = "expires=" + d.toUTCString();
                        var cusername = "c_temp_user=" + nutzername + "; " + expires + "; path=/;";
                        document.cookie = cusername;
                    }
                    var csessionname = "c_session_user=" + nutzername + "; path=/;";
                    document.cookie = csessionname;

                    document.getElementById("nickname").innerHTML = nutzername;

                    document.getElementById("descriptionshow").innerHTML = beschreibung;

                    document.getElementById("nicknamechange").value = nutzername;
                    document.getElementById("nicknamechange").placeholder = nutzername;

                    document.getElementById("descriptioninput").value = beschreibung;

                    document.getElementById("descriptioninput").placeholder = beschreibung;

                    //Generate Match-Link
                    var matchlink = linkstring + nutzername + "&lang=" + lang;
                    document.getElementById("matchlink").innerHTML = matchlink;

                    updateMatchable();

                    updateGender();

                    if (image != ""){
                        document.getElementById("profileimage").src = image;
                        setNavProfilePic();
                    }

                    var profilebtns = document.getElementsByClassName("profilespan");
                    for (var i = 0; i < profilebtns.length; i++) {
                        profilebtns[i].innerHTML = nutzername;
                    }

                    state = 0;

                }

            }
        }
        xhttp.open("POST", "updateProfile.php", true);
        xhttp.send(df);

        console.log("Formular gesendet.");
        
        //Design ändern
        if (image_uploaded == 0 || gender == 0) {
            if (lang == LANG_DE) {
                alert("Lade ein Bild hoch und setzte dein Matching-Geschlecht, um gematched werden zu können!");
            } else {
                alert("Upload an image and set your matching-gender to enable your matchability!");
            }
        }
        else {
            for (var i = 0; i < inputelements.length; i++) {
                inputelements[i].style.cssText = "display: none!important";
            }

            for (var i = 0; i < showelements.length; i++) {
                showelements[i].style.cssText = "display: inline-block!important";
            }

            document.getElementById("stats").style.display = "inline-block";

            document.getElementById("link").style.display = "inline-block";

            ddstate = 0;
            document.getElementById("myDropdown").style.display = "none";
        }
    }
}

function loadElements() {

    this.inputelements = document.getElementsByClassName("input");

    this.showelements = document.getElementsByClassName("show");
}
