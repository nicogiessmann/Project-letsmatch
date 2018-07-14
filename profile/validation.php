<?php
/*
This script validates the incoming username and password.
See docce to evaluate the checks and errors.
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

	$username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["nutzername"]));
	$password = mysqli_real_escape_string($mysqli, utf8_decode($_POST["passwort"]));

	$sql = "SELECT count(*) FROM users WHERE nutzername='$username'";
	$result = mysqli_query($mysqli, $sql);
	$result = implode("", mysqli_fetch_assoc($result));

	if($result!=1){
		$sql = "SELECT count(*) FROM users WHERE email='$username'";
		$result = mysqli_query($mysqli, $sql);
		$result = implode("", mysqli_fetch_assoc($result));
	}

	$username_correct = 0;
	$password_correct = 0;

	if($result==1){

		$username_correct = 1;

		$sql = "SELECT passwort FROM users WHERE nutzername='$username'";
		$result = mysqli_query($mysqli, $sql);
		if($result!=false){
			$result = implode("", (array)mysqli_fetch_assoc($result));

		if($result == $password){
			$password_correct = 1;
		}

		else{
			$sql = "SELECT passwort FROM users WHERE email='$username'";
			$result = mysqli_query($mysqli, $sql);
			if($result!=false){
				$result = implode("", (array)mysqli_fetch_assoc($result));
				if($result == $password){
					$password_correct = 1;
				}
			}
		}
		}
	}

	if($username_correct==1 && $password_correct==1){
		exit("!12");
	}
	if($username_correct==1 && $password_correct==0){
		exit("!03");
	}
	if($username_correct==0 && $password_correct==0){
		exit("!02");
	}
	
	mysqli_close($mysqli);
	//echo "Connection closed;";

?>