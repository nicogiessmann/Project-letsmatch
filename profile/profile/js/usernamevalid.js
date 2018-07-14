var usernameinput = document.getElementById("nicknamechange");
var icon = document.getElementById("nicknameicon");
var iconcross = "&#xE14C;";
var iconcorrect = "&#xE876;";
var colorred = "#ff5a5a";
var colorgreen = "#89e08f";
var colorgray = "#3a3a3a";
var valid;

function usernamevalidation() {

    valid = 0;

    var username = usernameinput.value;

    if (username.match("^[\x21-\x7F]*$") == null) {
        valid = 0;
        updateIcon();
    } else {
        
        if(username.length < 6){
            valid = 0;
            updateIcon();
        }
        else if (username == nutzername) {
            valid = 1;
            updateIcon();
        } else {
            if (username == "") {
                valid = 0;
                updateIcon();
            } else {

                var form = new FormData();
                form.append("nutzername", getCookie("c_session_user"));
                form.append("password", getCookie("c_session_password"));
                form.append("username", username);

                var xhttp = new XMLHttpRequest();
                xhttp.onreadystatechange = function () {
                    if (this.readyState == 4 && this.status == 200) {
                        //console.log("Formular empfangen.");
                        var response = this.responseText;


                        if (response == "!13") {
                            valid = 2;
                            updateIcon();
                        } else {
                            valid = 0;
                            updateIcon();
                        }
                    }
                }
                xhttp.open("POST", "usernamevalid.php", true);
                xhttp.send(form);
                //console.log("Formular gesendet.");

            }
        }
    }

}

function updateIcon() {
    if (valid == 2) {
        icon.innerHTML = iconcorrect;
        icon.style.color = colorgreen;
        usernamevalid = 2;
    } else if (valid == 1) {
        icon.innerHTML = iconcorrect;
        icon.style.color = colorgray;
        usernamevalid = 1;
    } else {
        icon.innerHTML = iconcross;
        icon.style.color = colorred;
        usernamevalid = 0;
    }
}
