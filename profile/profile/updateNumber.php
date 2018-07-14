<?php
/*
This script updates user number
job=0 -> get old number except for last 4 digits
job=1 -> check if input last 4 digits are correct
job=2 -> update Number
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
    $job = mysqli_real_escape_string($mysqli, utf8_decode($_POST["job"]));

    if($job == 0){
    	$sql = "SELECT telefon FROM users WHERE nutzername='$nutzername' AND passwort='$passwort'";
		$result = mysqli_query($mysqli, $sql);
		$result = implode("", mysqli_fetch_assoc($result));
		echo substr($result, 0, -4);
    }
    else if($job == 1){
    	$lastdigits = mysqli_real_escape_string($mysqli, utf8_decode($_POST["lastdigits"]));
    	$sql = "SELECT telefon FROM users WHERE nutzername='$nutzername' AND passwort='$passwort'";
		$result = mysqli_query($mysqli, $sql);
		$result = implode("", mysqli_fetch_assoc($result));
		$correctlastdigits = substr($result, -4);
		if($correctlastdigits == $lastdigits){
			echo "!16";
		}
		else{
			echo "!04";
		}
    }
    else if($job == 2){
    	$newnbr = mysqli_real_escape_string($mysqli, utf8_decode($_POST["newnbr"]));
    	$sql = "UPDATE users SET telefon='$newnbr' WHERE nutzername='$nutzername' AND passwort='$passwort'";
		mysqli_query($mysqli, $sql);
    } 

    mysqli_close($mysqli);
    //echo "Connection closed;";
?>