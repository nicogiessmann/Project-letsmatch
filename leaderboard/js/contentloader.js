/*  
 * This file loads data for leaderboards
 */
var original_y = undefined;
const TABLE_MAX_HEIGHT = 406;
const TABLE_MIN_HEIGHT = 0;
var current_match_link = undefined;
var form = new FormData();
form.append("task", 1);
if (username != undefined && password != undefined) {
    form.append("bonusdata", true);
    form.append("username", encodeURI(username));
    form.append("password", encodeURI(password));
} else {
    form.append("bonusdata", false);
}
var xhttp = new XMLHttpRequest();
xhttp.onreadystatechange = function () {
    if (this.readyState == 4 && this.status == 200) {
        var response = this.responseText;
        if (checkError(response)) {
            displayErrorForAllTables();
            console.error("contentloader.js PHP-ERROR: response=\"" + response + "\"");
        } else {
            try {
                var tabledata = JSON.parse(decodeURI(response));
                var table_female = tabledata["table_female"];
                var table_male = tabledata["table_male"];
                var table_friendlist = tabledata["table_friendlist"];
                var table_location = tabledata["table_location"];
                var userdata = tabledata["userdata"];
                if (checkError(table_female)) {
                    displayError("table_female");
                    console.error("contentloader.js MYSQL-ERROR: table_female=\"" + table_female + "\"");
                } else {
                    for (var i = 0; i < table_female.length; i++) {
                        var table_entry = document.createElement("div");
                        table_entry.className += "table_entry";
                        table_entry.id = table_female[i]["id"];
                        var place = document.createElement("div");
                        place.className += "place";
                        place.innerHTML = i + 1 + ".";
                        table_entry.appendChild(place);
                        var img_container = document.createElement("div");
                        img_container.className += "imgcontainer";
                        var img = document.createElement("img");
                        img.className += "profilepic";
                        img.src = table_female[i]["img"];
                        img_container.appendChild(img);
                        table_entry.appendChild(img_container);
                        var username_sign = document.createElement("div");
                        username_sign.className += "username";
                        username_sign.innerHTML = table_female[i]["nutzername"];
                        table_entry.appendChild(username_sign);
                        var points = document.createElement("div");
                        points.className += "points";
                        points.innerHTML = table_female[i]["points"];
                        table_entry.appendChild(points);
                        table_entry.onclick = displayProfile.bind(null, table_female[i]["id"], table_female[i]["nutzername"], table_female[i]["points"], i + 1);
                        document.getElementById("table_female")
                            .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].appendChild(table_entry);
                    }
                    document.getElementById("table_female")
                        .getElementsByClassName("loading")[0].style.display = "none";
                }
                if (checkError(table_male)) {
                    displayError("table_male");
                    console.error("contentloader.js MYSQL-ERROR: table_male=\"" + table_male + "\"");
                } else {
                    for (var i = 0; i < table_male.length; i++) {
                        var table_entry = document.createElement("div");
                        table_entry.className += "table_entry";
                        table_entry.id = table_male[i]["id"];
                        var place = document.createElement("div");
                        place.className += "place";
                        place.innerHTML = i + 1 + ".";
                        table_entry.appendChild(place);
                        var img_container = document.createElement("div");
                        img_container.className += "imgcontainer";
                        var img = document.createElement("img");
                        img.className += "profilepic";
                        img.src = table_male[i]["img"];
                        img_container.appendChild(img);
                        table_entry.appendChild(img_container);
                        var username_sign = document.createElement("div");
                        username_sign.className += "username";
                        username_sign.innerHTML = table_male[i]["nutzername"];
                        table_entry.appendChild(username_sign);
                        var points = document.createElement("div");
                        points.className += "points";
                        points.innerHTML = table_male[i]["points"];
                        table_entry.appendChild(points);
                        table_entry.onclick = displayProfile.bind(null, table_male[i]["id"], table_male[i]["nutzername"], table_male[i]["points"], i + 1);
                        document.getElementById("table_male")
                            .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].appendChild(table_entry);
                    }
                    document.getElementById("table_male")
                        .getElementsByClassName("loading")[0].style.display = "none";
                }
                if (checkError(table_friendlist)) {
                    if(table_friendlist==null){
                        displayNoEntries("table_friendlist");
                    }
                    else{
                        displayError("table_friendlist");
                        console.log("Nutzer nicht angemeldet, Tabelle \"Freundesliste\" wird nicht angezeigt.");
                    }
                } else {
                    for (var i = 0; i < table_friendlist.length; i++) {
                        var table_entry = document.createElement("div");
                        table_entry.className += "table_entry";
                        table_entry.id = table_friendlist[i][0];
                        var place = document.createElement("div");
                        place.className += "place";
                        place.innerHTML = i + 1 + ".";
                        table_entry.appendChild(place);
                        var img_container = document.createElement("div");
                        img_container.className += "imgcontainer";
                        var img = document.createElement("img");
                        img.className += "profilepic";
                        img.src = table_friendlist[i][3];
                        img_container.appendChild(img);
                        table_entry.appendChild(img_container);
                        var username_sign = document.createElement("div");
                        username_sign.className += "username";
                        username_sign.innerHTML = table_friendlist[i][2];
                        table_entry.appendChild(username_sign);
                        var points = document.createElement("div");
                        points.className += "points";
                        points.innerHTML = table_friendlist[i][1];
                        table_entry.appendChild(points);
                        table_entry.onclick = displayProfile.bind(null, table_friendlist[i][0], table_friendlist[i][2], table_friendlist[i][1], i + 1);
                        document.getElementById("table_friendlist")
                            .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].appendChild(table_entry);
                    }
                    document.getElementById("table_friendlist")
                        .getElementsByClassName("loading")[0].style.display = "none";
                }
                if (checkError(table_location)) {
                    displayError("table_location");
                    console.log("Nutzer nicht angemeldet, Tabelle \"In deiner Nähe\" wird nicht angezeigt.");
                } else {
                    document.getElementById("table_location")
                        .getElementsByClassName("loading")[0].style.display = "none";
                }
                if (checkError(userdata)) {
                    if (userdata == "!017") {
                        console.log("Nutzer nicht matchbar. Bonusinhalte werden nicht geladen.")
                    } else if (username == undefined) {
                        console.log("Nutzer nicht angemeldet. Bonusinhalte werden nicht geladen.")
                    } else {
                        console.error("contentloader.js MYSQL-ERROR: userdata=\"" + userdata + "\"");
                    }
                } else {
                    var table = undefined;
                    if (userdata[0]["gender"] == 1) {
                        //Female user
                        table = table_female;
                    } else if (userdata[0]["gender"] == 2) {
                        //Male user
                        table = table_male;
                    } else {
                        console.error("contentloader.js PHP-ERROR: userdata[gender]=\"" + userdata[0]["gender"] + "\"");
                    }
                    if (table != undefined) {
                        if (userdata[0]["place"] <= table.length) {
                            //user inside table
                            var fixed_bottom = document.createElement("div");
                            fixed_bottom.className += "fixed_bottom";
                            var place = document.createElement("div");
                            place.className += "place";
                            place.innerHTML = userdata[0]["place"] + ".";
                            fixed_bottom.appendChild(place);
                            var img_container = document.createElement("div");
                            img_container.className += "imgcontainer";
                            var img = document.createElement("img");
                            img.className += "profilepic";
                            img.src = userdata[0]["img"];
                            img_container.appendChild(img);
                            fixed_bottom.appendChild(img_container);
                            var username_sign = document.createElement("div");
                            username_sign.className += "username";
                            username_sign.innerHTML = username;
                            fixed_bottom.appendChild(username_sign);
                            var points = document.createElement("div");
                            points.className += "points";
                            points.innerHTML = userdata[0]["points"];
                            fixed_bottom.appendChild(points);
                            fixed_bottom.onclick = displayProfile.bind(null, userdata[0]["id"], username, userdata[0]["points"], userdata[0]["place"]);
                            var fixed_top = document.createElement("div");
                            fixed_top.className += "fixed_top";
                            var place = document.createElement("div");
                            place.className += "place";
                            place.innerHTML = userdata[0]["place"] + ".";
                            fixed_top.appendChild(place);
                            var img_container = document.createElement("div");
                            img_container.className += "imgcontainer";
                            var img = document.createElement("img");
                            img.className += "profilepic";
                            img.src = userdata[0]["img"];
                            img_container.appendChild(img);
                            fixed_top.appendChild(img_container);
                            var username_sign = document.createElement("div");
                            username_sign.className += "username";
                            username_sign.innerHTML = username;
                            fixed_top.appendChild(username_sign);
                            var points = document.createElement("div");
                            points.className += "points";
                            points.innerHTML = userdata[0]["points"];
                            fixed_top.appendChild(points);
                            fixed_top.onclick = displayProfile.bind(null, userdata[0]["id"], username, userdata[0]["points"], userdata[0]["place"]);
                            document.getElementById(userdata[0]["id"])
                                .className = "user_entry_special";
                            //Check which is displayed
                            var original_y = undefined;
                            if(userdata[0]["gender"]==1){
                                original_y = document.getElementById("table_female").getElementById(userdata[0]["id"])
                                .offsetTop;
                            }
                            else{
                                original_y = document.getElementById("table_male").;
                                //original_y = document.getElementById("table_male").getElementById(userdata[0]["id"])
                                //.offsetTop;
                                console.log(original_y);
                            }
                            var scrolly = 0;
                            var viewportpos = original_y - scrolly;
                            if (viewportpos <= TABLE_MIN_HEIGHT) {
                                fixed_bottom.style.display = "none";
                            } else if (viewportpos > TABLE_MIN_HEIGHT && viewportpos < TABLE_MAX_HEIGHT) {
                                fixed_bottom.style.display = "none";
                                fixed_top.style.display = "none";
                            } else if (viewportpos >= TABLE_MAX_HEIGHT) {
                                fixed_top.style.display = "none";
                            }
                            if (userdata[0]["gender"] == 1) {
                                fixed_bottom.style.borderColor = "#e36165";
                                fixed_top.style.borderColor = "#e36165";
                                document.getElementById("table_female")
                                    .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].addEventListener("scroll", function () {
                                        var scrolly = document.getElementById("table_female")
                                            .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].scrollTop;
                                        var viewportpos = original_y - scrolly;
                                        if (viewportpos <= TABLE_MIN_HEIGHT) {
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "none";
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "inline-block";
                                        } else if (viewportpos > TABLE_MIN_HEIGHT && viewportpos < TABLE_MAX_HEIGHT) {
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "none";
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "none";
                                        } else if (viewportpos >= TABLE_MAX_HEIGHT) {
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "inline-block";
                                            document.getElementById("table_female")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "none";
                                        }
                                    });
                                document.getElementById(userdata[0]["id"])
                                    .style.borderColor = "#e36165";
                                document.getElementById("table_female")
                                    .getElementsByClassName("fixed_content")[0].appendChild(fixed_bottom);
                                document.getElementById("table_female")
                                    .getElementsByClassName("fixed_content")[0].appendChild(fixed_top);
                            } else {
                                fixed_bottom.style.borderColor = "#81C1EC";
                                fixed_top.style.borderColor = "#81C1EC";
                                document.getElementById("table_male")
                                    .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].addEventListener("scroll", function () {
                                        var scrolly = document.getElementById("table_male")
                                            .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].scrollTop;
                                        var viewportpos = original_y - scrolly;
                                        if (viewportpos <= TABLE_MIN_HEIGHT) {
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "none";
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "inline-block";
                                        } else if (viewportpos > TABLE_MIN_HEIGHT && viewportpos < TABLE_MAX_HEIGHT) {
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "none";
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "none";
                                        } else if (viewportpos >= TABLE_MAX_HEIGHT) {
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_bottom")[0].style.display = "inline-block";
                                            document.getElementById("table_male")
                                                .getElementsByClassName("fixed_content")[0].getElementsByClassName("fixed_top")[0].style.display = "none";
                                        }
                                    });
                                document.getElementById(userdata[0]["id"])
                                    .style.borderColor = "#81C1EC";
                                document.getElementById("table_male")
                                    .getElementsByClassName("fixed_content")[0].appendChild(fixed_bottom);
                                document.getElementById("table_male")
                                    .getElementsByClassName("fixed_content")[0].appendChild(fixed_top);
                            }
                        } else {
                            //user outsite table
                            var fixed_bottom = document.createElement("div");
                            fixed_bottom.className += "fixed_bottom";
                            var place = document.createElement("div");
                            place.className += "place";
                            place.innerHTML = userdata[0]["place"] + ".";
                            fixed_bottom.appendChild(place);
                            var img_container = document.createElement("div");
                            img_container.className += "imgcontainer";
                            var img = document.createElement("img");
                            img.className += "profilepic";
                            img.src = userdata[0]["img"];
                            img_container.appendChild(img);
                            fixed_bottom.appendChild(img_container);
                            var username_sign = document.createElement("div");
                            username_sign.className += "username";
                            username_sign.innerHTML = username;
                            fixed_bottom.appendChild(username_sign);
                            var points = document.createElement("div");
                            points.className += "points";
                            points.innerHTML = userdata[0]["points"];
                            fixed_bottom.appendChild(points);
                            var empty_entry = document.createElement("div");
                            empty_entry.className += "empty_entry";
                            if (userdata[0]["gender"] == 1) {
                                fixed_bottom.style.borderColor = "#e36165";
                                document.getElementById("table_female")
                                    .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].appendChild(empty_entry);
                                document.getElementById("table_female")
                                    .getElementsByClassName("table_content")[0].appendChild(fixed_bottom);
                            } else {
                                fixed_bottom.style.borderColor = "#81C1EC";
                                document.getElementById("table_male")
                                    .getElementsByClassName("fixed_content")[0].getElementsByClassName("table_content")[0].appendChild(empty_entry);
                                document.getElementById("table_male")
                                    .getElementsByClassName("table_content")[0].appendChild(fixed_bottom);
                            }
                        }
                    }
                    //User bonus entry in friendlist
                    if(!checkError(table_friendlist)){
                        /*var place_in_friendlist = getPlaceInFriendlist(table_friendlist, userdata[0]["place"]);
                        console.log(place_in_friendlist);*/
                    }
                }
            } catch (err) {
                displayErrorForAllTables();
                console.error("contentloader.js JS-ERROR: response=\"" + response + "\"->" + err.message);
            }
        }
    }
}
xhttp.open("POST", "contentloader.php", true);
xhttp.send(form);

function displayError(id) {
    document.getElementById(id)
        .getElementsByClassName("servererror")[0].style.display = "inline-block"; //none default
    document.getElementById(id)
        .getElementsByClassName("headerdesc")[0].style.display = "none";
    document.getElementById(id)
        .getElementsByClassName("fixed_content")[0].style.display = "none";
    document.getElementById(id)
        .getElementsByClassName("loading")[0].style.display = "none";
}

function displayNoEntries(id){
    document.getElementById(id)
        .getElementsByClassName("notification_noentries")[0].style.display = "inline-block"; //none default
    document.getElementById(id)
        .getElementsByClassName("headerdesc")[0].style.display = "none";
    document.getElementById(id)
        .getElementsByClassName("fixed_content")[0].style.display = "none";
    document.getElementById(id)
        .getElementsByClassName("loading")[0].style.display = "none";
}

function displayErrorForAllTables() {
    displayError("table_female");
    displayError("table_male");
    displayError("table_friendlist");
    displayError("table_location");
}

function checkError(response) {
    var responscode = undefined;
    try {
        responscode = response.substring(0, 2);
    } catch (err) {
        if (response == null || response.length == 0) {
            return true;
        }
        return false;
    }
    if (responscode == "!0") {
        return true;
    }
    return false;
}

function displayProfile(id, username, points, place) {
    current_match_link = "www.matchme.com/match/match.html?mode=1vsr&user=" + username;
    var form = new FormData();
    form.append("task", 3);
    form.append("id", id);
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            var response = this.responseText;
            if (checkError(response)) {
                console.error("contentloader.js PHP-ERROR: response=\"" + response + "\"");
            } else {
                try {
                    var responsedata = JSON.parse(response);
                    var description = responsedata["description"];
                    var base64_img = responsedata["base64image"];
                    document.getElementById("profileimage")
                        .src = base64_img;
                    document.getElementById("descriptioncontent")
                        .innerHTML = description;
                } catch (err) {
                    console.error("contentloader.js JS-ERROR: response=\"" + response + "\"->" + err.message);
                }
            }
            document.getElementById("username")
                .innerHTML = username;
            document.getElementById("points")
                .innerHTML = points;
            document.getElementById("rank")
                .innerHTML = place;
            document.getElementById("matchlink")
                .innerHTML = current_match_link;
            setTimeout(function () {
                document.getElementById("dropdown_background")
                    .style.display = "block";
                document.getElementById("profile_view")
                    .style.visibility = "visible";
                clearTimeout(id);
                id = setTimeout(function () {
                    document.getElementById("dropdown_background")
                        .style.opacity = "0.5";
                    document.getElementById("dropdown_background")
                        .onclick = function () {
                            document.getElementById("profile_view")
                                .style.visibility = "hidden";
                            document.getElementById("dropdown_background")
                                .style.opacity = "0";
                            clearTimeout(id);
                            id = setTimeout(function () {
                                document.getElementById("dropdown_background")
                                    .style.display = "none";
                            }, 205);
                        }
                }, 20);
            }, 20);
        }
    };
    xhttp.open("POST", "contentloader.php", true);
    xhttp.send(form);
}

function copyToClipboard() {
    var temp = document.createElement("input");
    temp.value = current_match_link;
    document.getElementsByTagName("body")[0].append(temp);
    temp.select();
    document.execCommand("copy");
    temp.remove();
}

