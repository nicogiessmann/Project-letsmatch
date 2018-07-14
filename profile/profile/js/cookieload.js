const exdays = 5;
const linkstring = "www.matchme.com/match/match.html?mode=MODE_1VSR&amp;user=";
var nutzername = "";
var passwort = "";
var beschreibung = "";
var points = "";
var place = "";
var id = "";
var image_uploaded = "";
var matchable = "";
var image = "";
var usernamevalid = 0;
var gender = 0;
var state = 0;
var friendlist = null;
var c_session_user = getCookie("c_session_user");
var c_session_password = getCookie("c_session_password");
var c_temp_user = getCookie("c_temp_user");
var c_temp_password = getCookie("c_temp_password");
//Prüfung auf Session Cookies
if (c_session_user != "" && c_session_password != "") {
    //Prüfung auf Temp-Cookies
    if (c_temp_user != "" && c_temp_password != "") {
        //Timestamp setzen
        updateTimestamp(c_temp_user, c_temp_password);
    }
    var form = new FormData();
    form.append("nutzername", c_session_user);
    form.append("passwort", c_session_password);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            display(response);
            displayFriendlist();
        }
    };
    xhttp.open("POST", "getuserdata.php", true);
    xhttp.send(form);
} else if (c_temp_user != "" && c_temp_password != "") {
    //Timestamp setzen
    updateTimestamp(c_temp_user, c_temp_password);
    //Session-Cookie setzen
    var csessionname = "c_session_user=" + c_temp_user + "; path=/;";
    var csessionpassword = "c_session_password=" + c_temp_password + "; path=/;";
    document.cookie = csessionname;
    document.cookie = csessionpassword;
    var form = new FormData();
    form.append("nutzername", c_session_user);
    form.append("passwort", c_session_password);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            display(response);
            displayFriendlist();
        }
    };
    xhttp.open("POST", "getuserdata.php", true);
    xhttp.send(form);
} else {
    link("../login.html");
}

function setProfileLabelsToUsername() {
    var elm = document.getElementsByClassName("profilelabel");
    for (var i = 0; i < elm.length; i++) {
        elm[i].innerHTML = nutzername;
    }
}

function updateTimestamp(nutzername, passwort) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    var cusername = "c_temp_user=" + nutzername + "; " + expires + "; path=/;";
    var cuserpassword = "c_temp_password=" + passwort + "; " + expires + "; path=/;";
    document.cookie = cusername;
    document.cookie = cuserpassword;
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function display(jsondata) {
    //console.log(jsondata);
    var data = JSON.parse(jsondata);
    this.id = data.id;
    console.log(id);
    this.nutzername = data.nutzername;
    this.passwort = data.passwort;
    this.beschreibung = data.beschreibung;
    this.points = data.points;
    this.place = data.place;
    this.id = data.id;
    this.image_uploaded = data.image_uploaded;
    this.matchable = data.matchable;
    this.gender = data.gender;
    this.image = data.image;
    setProfileLabelsToUsername();
    setNavProfilePic();
    //Image
    document.getElementById("nickname")
        .innerHTML = this.nutzername;
    document.getElementById("descriptionshow")
        .innerHTML = this.beschreibung;
    document.getElementById("points")
        .innerHTML = this.points;
    document.getElementById("rank")
        .innerHTML = this.place;
    document.getElementById("nicknamechange")
        .value = this.nutzername;
    document.getElementById("nicknamechange")
        .placeholder = this.nutzername;
    document.getElementById("descriptioninput")
        .value = this.beschreibung;
    document.getElementById("descriptioninput")
        .placeholder = this.beschreibung;
    //Generate Match-Link
    var matchlink = linkstring + this.id + "&amp;lang=" + this.lang;
    document.getElementById("matchlink")
        .innerHTML = matchlink;
    updateMatchable();
    updateGender();
    if (image != "") document.getElementById("profileimage")
        .src = image;
    if (matchable == 0) {
        document.getElementById("nicknamechange")
            .value = this.nutzername;
        document.getElementById("nicknamechange")
            .placeholder = this.nutzername;
        document.getElementById("descriptioninput")
            .value = this.beschreibung;
        document.getElementById("descriptioninput")
            .placeholder = this.beschreibung;
        for (var i = 0; i < showelements.length; i++) {
            showelements[i].style.cssText = "display: none!important";
        }
        for (var i = 0; i < inputelements.length; i++) {
            inputelements[i].style.cssText = "display: inline-block!important";
        }
        document.getElementById("stats")
            .style.display = "none";
        document.getElementById("link")
            .style.display = "none";
        state = 1;
    }
}

function updateMatchable() {
    if (this.matchable == 1) {
        document.getElementById("iconmatchable")
            .style.color = "#89e08f";
        document.getElementById("matchlink")
            .style.color = "#2a2a78";
    } else if (this.matchable == 2) {
        document.getElementById("iconmatchable")
            .style.color = "#9c9c9c";
        document.getElementById("matchlink")
            .style.color = "#9c9c9c";
    } else {
        document.getElementById("iconmatchable")
            .style.color = "#ff5a5a";
        document.getElementById("matchlink")
            .style.color = "#9c9c9c";
    }
}

function updateGender() {
    if (gender == 0) {
        if (lang == LANG_DE) {
            document.getElementById("dropbtn")
                .innerHTML = "keine Angabe";
        } else {
            document.getElementById("dropbtn")
                .innerHTML = "not selected";
        }
    }
    if (gender == 1) {
        if (lang == LANG_DE) {
            document.getElementById("dropbtn")
                .innerHTML = "weiblich";
        } else {
            document.getElementById("dropbtn")
                .innerHTML = "female";
        }
    }
    if (gender == 2) {
        if (lang == LANG_DE) {
            document.getElementById("dropbtn")
                .innerHTML = "m&auml;nnlich";
        } else {
            document.getElementById("dropbtn")
                .innerHTML = "male";
        }
    }
}

function setNavProfilePic() {
    if (image != "") {
        document.getElementById("navddprofileimg")
            .src = image;
        document.getElementById("rightwrapperprofileimg")
            .src = image;
    }
}

function dropdownOpen() { }

function dropdownClose() { }

function displayFriendlist() {
    var form = new FormData();
    form.append("task", 1);
    form.append("user_id", id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (isError(response)) {
                console.log("ERROR: " + response);
                if (response == "!021") {
                    //show that user has no friends
                    if(lang==LANG_DE){
                        document.getElementById("friendlist_container_content").innerHTML="Keine Einträge";
                    }else{
                        document.getElementById("friendlist_container_content").innerHTML="No entries";
                    }
                    document.getElementById("friendlist_container_content").style.textAlign="center";
                    document.getElementById("searchbar").disabled = "disabled";
                    console.log("User has no friends.");
                }
                else {
                    //hide friendlist
                    document.getElementById("friendlist_container").style.display = "none";
                    console.error("PHP, Mysqli or input error: " + response + ".");
                }
            }
            else {
                //display friends
                try {
                    var friendlist_data = JSON.parse(response);
                    friendlist = friendlist_data;
                    for (var i = 0; i < friendlist_data.length; i++) {
                        addFriendToFriendlistDisplay(friendlist_data[i][0], friendlist_data[i][1], friendlist_data[i][2]);
                    }
                    updateFriendlistCountDisplay();
                } catch (err) {
                    console.error("Invalid friendlist data: " + response + ".");
                }
            }
        }
    };
    xhttp.open("POST", "friendlist.php", true);
    xhttp.send(form);
}

function isError(response) {
    var firstToLetters = response.charAt(0) + response.charAt(1);
    if (firstToLetters == "!0") return true;
    return false;
}

var timeout_ids = [];

function friendlist_entry_onclick(id) {
    const DELETE_AREA_VISIBLE_VALUE = "calc(100% - 50px)";
    const DELETE_AREA_NOT_VISIBLE_VALUE = "calc(100% - 10px)";
    var friend_entry_visible_area_width = document.getElementById(id).getElementsByClassName("friend_entry_visible_area")[0].offsetWidth;
    var friend_entry_width = document.getElementById(id).offsetWidth - 2;

    var delete_area_visible = false;
    if (friend_entry_visible_area_width == friend_entry_width - 40) {
        delete_area_visible = true;
    }

    if (delete_area_visible == false) {
        addTimeoutId(id, setTimeout(function () {
            document.getElementById(id).getElementsByClassName("friend_entry_visible_area")[0].style.width = DELETE_AREA_NOT_VISIBLE_VALUE;
        }, 2000));
        document.getElementById(id).getElementsByClassName("friend_entry_visible_area")[0].style.width = DELETE_AREA_VISIBLE_VALUE;
    }
    else {
        clearTimeoutId(id);
        document.getElementById(id).getElementsByClassName("friend_entry_visible_area")[0].style.width = DELETE_AREA_NOT_VISIBLE_VALUE;
    }
}

function friendlist_detele_entry(id) {
    var form = new FormData();
    form.append("task", 2);
    form.append("user_id", this.id);
    form.append("delete_id", id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if(isError(response)){
                console.error("Error when trying to delete user: " + response + ".");
            }
            else{
                clearTimeoutId(id);
                document.getElementById(id).style.height = "0px";
                setTimeout(function () {
                    document.getElementsByClassName("friendlist_container_content")[0].removeChild(document.getElementById(id));
                    var new_friendlist = [];
                    for(var i=0; i<friendlist.length; i++){
                        if(friendlist[i][0] != id){
                            new_friendlist.push(friendlist[i]);
                        }
                    }
                    friendlist = new_friendlist;
                    setTimeout(updateFriendlistCountDisplay,50);
                }, 200);
            }
        }
    };
    xhttp.open("POST", "friendlist.php", true);
    xhttp.send(form);
}

function addFriendToFriendlistDisplay(id, username, image) {
    var friendlist_container_content = document.getElementById("friendlist_container_content");
    var friend_entry = document.createElement("div");
    friend_entry.className += "friend_entry";
    friend_entry.id = id;
    friend_entry.onclick = function () { friendlist_entry_onclick(id) };
    var friend_entry_visible_area = document.createElement("div");
    friend_entry_visible_area.className += "friend_entry_visible_area";
    var img = document.createElement("img");
    if (image == "") {
        img.src = "../../image.png";
    }
    else {
        img.src = image;
    }
    friend_entry_visible_area.appendChild(img);
    var username_sign = document.createElement("div");
    username_sign.className += "username";
    username_sign.innerHTML = username;
    friend_entry_visible_area.appendChild(username_sign);
    friend_entry.appendChild(friend_entry_visible_area);
    var friend_entry_delete_area = document.createElement("div");
    friend_entry_delete_area.className += "friend_entry_delete_area";
    friend_entry_delete_area.onclick = function () { friendlist_detele_entry(id) };
    var icon = document.createElement("i");
    icon.className += "material-icons";
    icon.innerHTML = "highlight_off";
    friend_entry_delete_area.appendChild(icon);
    friend_entry.appendChild(friend_entry_delete_area);
    friendlist_container_content.appendChild(friend_entry);
}

function addTimeoutId(id, value) {
    timeout_ids.push([id, value]);
}

function clearTimeoutId(id) {
    for (var i = 0; i < timeout_ids.length; i++) {
        if (timeout_ids[i][0] == id) {
            clearTimeout(timeout_ids[i][1]);
            timeout_ids[i] = [null, null];
        }
    }
}

function updateFriendlistCountDisplay() {
    document.getElementById("friendscounter").innerText = "("+friendlist.length+")";
}

var search_timeoutid = undefined;
function searchbarInput(){
    clearTimeout(search_timeoutid);
    search_timeoutid = setTimeout(function(){
        document.getElementById("friendlist_container_content").innerHTML="";
        for(var i=0; i<friendlist.length; i++){
            addFriendToFriendlistDisplay(friendlist[i][0], friendlist[i][1], friendlist[i][2]);
        }
        document.getElementById("searchbar").value = "";
        document.getElementById("searchbar").blur();
    }, 4000);
    var input = document.getElementById("searchbar").value;
    //var childElementCount = document.getElementById("friendlist_container_content").childElementCount;
    document.getElementById("friendlist_container_content").innerHTML="";
    if(input==""){
        for(var i=0; i<friendlist.length; i++){
            addFriendToFriendlistDisplay(friendlist[i][0], friendlist[i][1], friendlist[i][2]);
        }
    }
    else{
        for(var i=0; i<friendlist.length; i++){
            var fit = friendlist[i][1].toLowerCase().search(input.toLowerCase());
            if(fit!=-1){
                addFriendToFriendlistDisplay(friendlist[i][0], friendlist[i][1], friendlist[i][2]);
            }
        }
    }
}