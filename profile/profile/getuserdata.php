<?php
/*
This script validates the incoming username and password. If input is correct, you get an ajax response with the user data.
See docce to evaluate the checks and errors.
 */
$database_host = "localhost";
$database_name = "matchmedb";
$database_user = "admin";
$database_pass = "jr5j0HzcbJX2bMaq";

$mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);

if ($mysqli == false) {
    die("Connection failed: " . mysqli_connect_error() . ";");
}
//echo "Connected successfully;";

$username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["nutzername"]));
$password = mysqli_real_escape_string($mysqli, utf8_decode($_POST["passwort"]));

$sql = "SELECT count(*) FROM users WHERE nutzername='$username'";
$result = mysqli_query($mysqli, $sql);
$result = implode("", mysqli_fetch_assoc($result));

$username_correct = 0;
$password_correct = 0;

if ($result == 1) {
    $username_correct = 1;

    $sql = "SELECT passwort FROM users WHERE nutzername='$username'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));

    if ($result == $password) {
        $password_correct = 1;
    }
}

if ($username_correct == 1 && $password_correct == 1) {

    //id
    $sql = "SELECT id FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $id = $result;

    //image_uploaded
    $sql = "SELECT image_uploaded FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $image_uploaded = $result;

    //matchable
    $sql = "SELECT matchable FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $matchable = $result;

    //beschreibung
    $sql = "SELECT beschreibung FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $beschreibung = $result;

    //points
    $sql = "SELECT points FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $points = $result;

    //place
    $sql = "SELECT nutzername FROM users ORDER BY points DESC LIMIT 1000000";
    $result = mysqli_query($mysqli, $sql);
    $array = [];
    while ($row = $result->fetch_row()) {
        $array[] = $row[0];
    }
    $place = 0;
    for ($i = 0; $i < count($array); $i++) {
        if ($array[$i] == $username) {
            $place = ++$i;
        }
    }

    $sql = "SELECT gender FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    $result = implode("", mysqli_fetch_assoc($result));
    $gender = $result;

    $image = "";

    if ($image_uploaded == 1) {
        $target_name = $id . ".jpeg";
        $target_dir = "../../user_images/" . $target_name;
        if (file_exists($target_dir)) {
            $file = fopen($target_dir, "r");
            $image = fread($file, filesize($target_dir));
            $image = base64_encode($image);
            $image = "data:image/jepg;base64," . $image;
        } else {
            $image_uploaded = 0;
            $sql = "UPDATE users SET image_uploaded='0' WHERE id='$id'";
            mysqli_query($mysqli, $sql);
            $matchable = 0;
            $sql = "UPDATE users SET matchable='0' WHERE id='$id'";
            mysqli_query($mysqli, $sql);
        }
    } else {
        if ($matchable == 1 || $matchable == 2) {
            $matchable = 0;
            $sql = "UPDATE users SET matchable='0' WHERE id='$id'";
            mysqli_query($mysqli, $sql);
        }
    }

    $data = new stdClass();
    $data->id = utf8_encode($id);
    $data->nutzername = utf8_encode($username);
    $data->passwort = utf8_encode($password);
    $data->image_uploaded = utf8_encode($image_uploaded);
    $data->matchable = utf8_encode($matchable);
    $data->beschreibung = utf8_encode($beschreibung);
    $data->points = utf8_encode($points);
    $data->place = utf8_encode($place);
    $data->gender = utf8_encode($gender);
    $data->image = utf8_encode($image);

    $json = json_encode($data);

    echo $json;
}
if ($username_correct == 1 && $password_correct == 0) {
    echo ("!03");
}
if ($username_correct == 0 && $password_correct == 0) {
    echo ("!02");
}

mysqli_close($mysqli);
//echo "Connection closed;";
?>