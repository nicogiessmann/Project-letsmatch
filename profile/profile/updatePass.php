<?php
/*
This script updates user password
*/

	$database_host = "localhost";
	$database_name = "matchmedb";
	$database_user = "admin";
	$database_pass = "jr5j0HzcbJX2bMaq";

	$mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);

		if($mysqli==false){
		die("Connection failed: ".mysqli_connect_error().";");
	}
	//echo "Connected successfully;";

	$nutzername = mysqli_real_escape_string($mysqli, utf8_decode($_POST["nutzername"]));
	$passwort = mysqli_real_escape_string($mysqli, utf8_decode($_POST["passwort"]));
    $newpass = mysqli_real_escape_string($mysqli, utf8_decode($_POST["newpass"]));


    $sql = "UPDATE users SET passwort='$newpass' WHERE nutzername='$nutzername' AND passwort='$passwort'";
	$check = mysqli_query($mysqli, $sql);

	if(!$check){
 		echo "!05";
	}
	else{
		echo "!17";
	}

    mysqli_close($mysqli);
    //echo "Connection closed;";
?>