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

	$email = mysqli_real_escape_string($mysqli, utf8_decode($_POST["email"]));

		$sql = "SELECT nutzername FROM users WHERE email='$email'";
		$result = mysqli_query($mysqli, $sql);
		if($result!=false){
			$result = implode("", (array)mysqli_fetch_assoc($result));
		}

		echo $result;
	mysqli_close($mysqli);
	//echo "Connection closed;";

?>