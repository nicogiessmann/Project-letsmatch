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
$newpass = mysqli_real_escape_string($mysqli, utf8_decode($_POST["newpass"]));

//echo $username." ".$code." ".$newpass;


$sql = "UPDATE users SET passwort='$newpass' WHERE nutzername='$username' AND resetcode='$code'";
$check = mysqli_query($mysqli, $sql);

$sql = "UPDATE users SET passwort='$newpass' WHERE email='$username' AND resetcode='$code'";
$check2 = mysqli_query($mysqli, $sql);

//echo mysqli_affected_rows($mysqli);

if(!$check && !$check2){
 	echo "!05";
}
else{
	$sql = "UPDATE users SET resetcode='' WHERE nutzername='$username' AND resetcode='$code'";
	$check = mysqli_query($mysqli, $sql);

	$sql = "UPDATE users SET resetcode='' WHERE email='$username' AND resetcode='$code'";
	$check2 = mysqli_query($mysqli, $sql);

	if($check || $check2){
		echo "!17";
	}
}

mysqli_close($mysqli);
//echo "Connection closed;";
?>