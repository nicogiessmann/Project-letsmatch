function refreshSite(){
    location.reload();
}

function lockout(){
    
    if(getCookie("c_session_user")){
        document.cookie = "c_session_user=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    if(getCookie("c_session_password")){
        document.cookie = "c_session_password=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    if(getCookie("c_temp_user")){
        document.cookie = "c_temp_user=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    if(getCookie("c_temp_password")){
        document.cookie = "c_temp_password=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    }
    
    link("../login.html");
}

function enableMatch(){
    
    if(matchable==0){
        console.log("Matchable: 0");
        if(lang == LANG_DE){
            alert("Lade ein Bild hoch und setzte dein Matching-Geschlecht, um gematched werden zu können!");
        }else{
            alert("Upload an image and set your matching-gender to enable your matchability!");
        }
    }
    else if(matchable==1){
        console.log("Matchable: 1");
        matchable = 2;
        var df = new FormData();
        df.append("nutzername", getCookie("c_session_user"));
        df.append("passwort", getCookie("c_session_password"));
        df.append("matchable", "2");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;
                if(response=="!15")
                updateMatchable();
                }
            }
        xhttp.open("POST", "updateMatchable.php", true);
        xhttp.send(df);
        console.log("Formular gesendet.");

    }
    else{
        console.log("Matchable: 2");
        matchable = 1;
        var df = new FormData();
        df.append("nutzername", getCookie("c_session_user"));
        df.append("passwort", getCookie("c_session_password"));
        df.append("matchable", "1");
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                console.log("Formular empfangen.");
                var response = this.responseText;
                console.log(response);
                if(response=="!15")
                updateMatchable();
                }
            }
        xhttp.open("POST", "updateMatchable.php", true);
        xhttp.send(df);
        console.log("Formular gesendet.");
    }
}

function copyToClipboard(){

    if(matchable==1){
        var link = document.getElementById("matchlink").innerHTML;
        link = link.replace(/&amp;/g, '&');
        var temp = document.createElement("INPUT");
        temp.value = link;
        document.getElementsByTagName("body")[0].append(temp);
        temp.select();
        document.execCommand("copy");
        temp.remove();
        console.log("copied!");
    }
}