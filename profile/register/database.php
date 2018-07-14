<?php

	/*
	All verification will pass key:
	6LeIxAcTAAAAAGG-vFI1TnRWxMZNFuojJ4WifJWe
	Secure Key:
	6LfXpC4UAAAAAHVQTGUbdOggc-qYz5hQBlkYQ6C4
	*/
	$secret = "6LfXpC4UAAAAAHVQTGUbdOggc-qYz5hQBlkYQ6C4";
	$response = $_POST["captcha"];
	$verifyResponse = file_get_contents("https://www.google.com/recaptcha/api/siteverify?secret=".$secret."&response=".$response);

	$responseData = json_decode($verifyResponse);

	if($responseData->success)
	{
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

		$sql = "SELECT count(*) FROM users WHERE nutzername='$nutzername'";
		$result = mysqli_query($mysqli, $sql);
		$result = implode("", mysqli_fetch_assoc($result));

		if($result==0){
			//username ok go on
		}
		else{
			//username already taken exit with error 0
			exit("!01");
		}



		$vorname = mysqli_real_escape_string($mysqli, utf8_decode($_POST["vorname"]));
		$nachname = mysqli_real_escape_string($mysqli, utf8_decode($_POST["nachname"]));
		$email = mysqli_real_escape_string($mysqli, utf8_decode($_POST["email"]));
		$passwort = mysqli_real_escape_string($mysqli,utf8_decode($_POST["passwort"]));
		$sociallink = mysqli_real_escape_string($mysqli,utf8_decode($_POST["sociallink"]));
		$socialidentifier = mysqli_real_escape_string($mysqli,utf8_decode($_POST["socialidentifier"]));
		$geo_latitude = mysqli_real_escape_string($mysqli,utf8_decode($_POST["geo_latitude"]));
		$geo_longitude = mysqli_real_escape_string($mysqli,utf8_decode($_POST["geo_longitude"]));

		$sql = "INSERT INTO users (id, nutzername, vorname, nachname, email, telefon, passwort, image_uploaded, matchable, beschreibung, points, gender, sociallink, socialidentifier, geo_latitude, geo_longitude) VALUES ('', '$nutzername', '$vorname', '$nachname', '$email', '', '$passwort', 'false', '0', '', '0', '0', '$sociallink', '$socialidentifier', '$geo_latitude', '$geo_longitude')";

		if(mysqli_query($mysqli, $sql)){
			//echo "New record created successfully;";

			/*
			$sql = "SELECT MAX(id) FROM unverifiedUsers";
			$maxid = mysqli_query($mysqli, $sql);
			$maxid = implode("", mysqli_fetch_assoc($maxid));

			$target_tmp_name = $_FILES["image"]["tmp_name"];
			$file_name = $_FILES["image"]["name"];
			$target_name = $maxid.".".pathinfo($file_name, PATHINFO_EXTENSION);
			$target_dir = "../../user_images/".$target_name;
			$check = move_uploaded_file($target_tmp_name, $target_dir);
			echo $check;
			*/
            echo "!11";
		}
		else{
			exit("Error: ".$sql.mysqli_error($mysqli).";");
		}

		mysqli_close($mysqli);
		//echo "Connection closed;";
	}
	else{
		echo "captcha error!";
	}
?>