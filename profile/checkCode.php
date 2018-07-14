<?php

$database_host = "localhost";
$database_name = "matchmedb";
$database_user = "admin";
$database_pass = "jr5j0HzcbJX2bMaq";

$mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);

if ($mysqli == false) {
    die("Connection failed: " . mysqli_connect_error() . ";");
}
//echo "Connected successfully;";

$username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["username"]));
$code = mysqli_real_escape_string($mysqli, utf8_decode($_POST["code"]));

$sql      = "SELECT count(*) FROM users WHERE nutzername='$username' AND resetcode='$code'";
$result = mysqli_query($mysqli, $sql);
$result = implode("", mysqli_fetch_assoc($result));

$sql      = "SELECT count(*) FROM users WHERE email='$username' AND resetcode='$code'";
$result2 = mysqli_query($mysqli, $sql);
$result2 = implode("", mysqli_fetch_assoc($result2));

if($result==1 || $result2==1){
	echo("!19");
}
else{
	echo("!06");
}

mysqli_close($mysqli);
//echo "Connection closed;";

?>