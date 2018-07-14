<?php
/*
This script updates user matchability
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
    $matchable = mysqli_real_escape_string($mysqli, utf8_decode($_POST["matchable"]));

	$sql = "SELECT count(*) FROM users WHERE nutzername='$nutzername'";
	$result = mysqli_query($mysqli, $sql);
	$result = implode("", mysqli_fetch_assoc($result));

    if($result == 0){
        exit("!02");
    }
    else{

        $sql = "SELECT count(*) FROM users WHERE nutzername='$nutzername' AND passwort='$passwort'";
		$result = mysqli_query($mysqli, $sql);
		$result = implode("", mysqli_fetch_assoc($result));

		if($result == 0){
			exit("!03");
		}
		else{
            
            $sql = "UPDATE users SET matchable='$matchable' WHERE nutzername='$nutzername' AND passwort='$passwort'";
            mysqli_query($mysqli, $sql);
            
            
            echo "!15";
			
		}
    }

    mysqli_close($mysqli);
    //echo "Connection closed;";
?>