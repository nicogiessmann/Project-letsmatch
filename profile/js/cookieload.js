//Read cookie values
const exdays = 5;
var username = undefined,
    password = undefined;
var c_session_user = getCookie("c_session_user");
var c_session_password = getCookie("c_session_password");
var c_temp_user = getCookie("c_temp_user");
var c_temp_password = getCookie("c_temp_password");
//Prüfung auf Session-Cookies
if (c_session_user != "" && c_session_password != "") {
    //Prüfung auf temp-Cookies
    if (c_temp_user != "" && c_temp_password != "") {
        //Timestamp aktualisieren
        updateTimestamp(c_temp_user, c_temp_password);
    }
    //Weiterleitung zu Profil
    link("profile/profile.html");
}
//Prüfung auf Temp-Cookies
else if (c_temp_user != "" && c_temp_password != "") {
    //Timestamp aktualisieren
    updateTimestamp(c_temp_user, c_temp_password);
    //Session Cookies erzeugen
    var csessionname = "c_session_user=" + c_temp_user + "; path=/;";
    var csessionpassword = "c_session_password=" + c_temp_password + "; path=/;";
    document.cookie = csessionname;
    document.cookie = csessionpassword;
    //Weiterleitung
    link("profile/profile.html");
}
//Prüfung auf Register-Coookies
else if (getCookie("c_register_username") != "" && getCookie("c_register_passwort") != "") {
    console.log("Register cookies set.");
    var usernameinputs = document.getElementsByClassName("usernameinput");
    var passwordinputs = document.getElementsByClassName("passwordinput");
    for (var i = 0; i < usernameinputs.length; i++) {
        usernameinputs[i].value = getCookie("c_register_username");
        usernameinputs[i].focus();
        usernameinputs[i].blur();
        passwordinputs[i].value = getCookie("c_register_passwort");
        passwordinputs[i].focus();
        passwordinputs[i].blur();
    }
    //Delete Register cookie if set
    var cnutzernamedel = "c_register_username=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    var cpasswortdel = "c_register_passwort=;expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/";
    document.cookie = cnutzernamedel;
    document.cookie = cpasswortdel
} else {
    console.log("Register cookies not set.");
}
var passreset_username;
var passreset_code;
//If Link has code and email attribute, go to passreset site
var urlobject = urlObject(window.location.href);
var code = urlobject["parameters"]["code"];
var email = urlobject["parameters"]["email"];
if (code != null && email != null) {
    passreset_username = email;
    passreset_code = code;
    document.getElementById("logincontainer")
        .style.display = "none";
    document.getElementById("passwordDialog")
        .style.display = "inline-block";
    document.getElementById("passinfo")
        .style.display = "none";
    document.getElementById("passinput")
        .style.display = "none";
    document.getElementById("passcodeinput")
        .style.display = "none";
    document.getElementById("passnewpass")
        .style.display = "inline-block";
} else {
    console.log("no passreset attributes");
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

function urlObject(options) {
    "use strict";
    /*global window, document*/
    var url_search_arr,
        option_key,
        i,
        urlObj,
        get_param,
        key,
        val,
        url_query,
        url_get_params = {},
        a = document.createElement('a'),
        default_options = {
            'url': window.location.href,
            'unescape': true,
            'convert_num': true
        };
    if (typeof options !== "object") {
        options = default_options;
    } else {
        for (option_key in default_options) {
            if (default_options.hasOwnProperty(option_key)) {
                if (options[option_key] === undefined) {
                    options[option_key] = default_options[option_key];
                }
            }
        }
    }
    a.href = options.url;
    url_query = a.search.substring(1);
    url_search_arr = url_query.split('&');
    if (url_search_arr[0].length > 1) {
        for (i = 0; i < url_search_arr.length; i += 1) {
            get_param = url_search_arr[i].split("=");
            if (options.unescape) {
                key = decodeURI(get_param[0]);
                val = decodeURI(get_param[1]);
            } else {
                key = get_param[0];
                val = get_param[1];
            }
            if (options.convert_num) {
                if (val.match(/^\d+$/)) {
                    val = parseInt(val, 10);
                } else if (val.match(/^\d+\.\d+$/)) {
                    val = parseFloat(val);
                }
            }
            if (url_get_params[key] === undefined) {
                url_get_params[key] = val;
            } else if (typeof url_get_params[key] === "string") {
                url_get_params[key] = [url_get_params[key], val];
            } else {
                url_get_params[key].push(val);
            }
            get_param = [];
        }
    }
    urlObj = {
        protocol: a.protocol,
        hostname: a.hostname,
        host: a.host,
        port: a.port,
        hash: a.hash.substr(1),
        pathname: a.pathname,
        search: a.search,
        parameters: url_get_params
    };
    return urlObj;
}

function dropdownOpen() {}

function dropdownClose() {}