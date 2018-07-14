<?php
/*
This script checks if username alreasy exists
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

	$username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["username"]));

	$sql = "SELECT count(*) FROM users WHERE nutzername='$username'";
	$result = mysqli_query($mysqli, $sql);
	$result = implode("", mysqli_fetch_assoc($result));

    if($result == 0){
        echo "!13";
    }
    else{
        echo "!01";
    }

    mysqli_close($mysqli);
    //echo "Connection closed;";
?>