<?php
/*
This script updates user profile
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
	$image = mysqli_real_escape_string($mysqli, utf8_decode($_POST["image"]));
	$neuernutzername = mysqli_real_escape_string($mysqli, utf8_decode($_POST["neuernutzername"]));
	$beschreibung = mysqli_real_escape_string($mysqli, utf8_decode($_POST["beschreibung"]));
	$gender = mysqli_real_escape_string($mysqli, utf8_decode($_POST["gender"]));
    $matchable = mysqli_real_escape_string($mysqli, utf8_decode($_POST["matchable"]));

	//echo $nutzername." ".$passwort." ".$image." ".$neuernutzername." ".$beschreibung." ".$gender.";";


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

			$sql = "SELECT id FROM users WHERE nutzername='$nutzername' AND passwort='$passwort'";
			$id = mysqli_query($mysqli, $sql);
			$id = implode("", mysqli_fetch_assoc($id));

			if($image!=""){

				$target_name = $id.".jpeg";
				$target_dir = "../../user_images/".$target_name;

				$handle = fopen($target_dir, "w+");
				$data = explode( ',', $image)[1];

				fwrite($handle, base64_decode($data));
				fclose($handle);

				$sql = "UPDATE users SET image_uploaded='1' WHERE id='$id'";
				mysqli_query($mysqli, $sql);
			}

			if($neuernutzername!=""){


				$sql = "SELECT count(*) FROM users WHERE nutzername='$neuernutzername'";
				$result = mysqli_query($mysqli, $sql);
				$result = implode("", mysqli_fetch_assoc($result));

				if($result==0){
					$sql = "UPDATE users SET nutzername='$neuernutzername' WHERE id='$id'";
					mysqli_query($mysqli, $sql);
				}
			}
			
			$sql = "UPDATE users SET beschreibung='$beschreibung' WHERE id='$id'";
			mysqli_query($mysqli, $sql);

			$sql = "UPDATE users SET gender='$gender' WHERE id='$id'";
			mysqli_query($mysqli, $sql);
            
            if($matchable!=""){
                $sql = "UPDATE users SET matchable='$matchable' WHERE id='$id'";
			    mysqli_query($mysqli, $sql);
            }

			echo "!14";
		}
    }

    mysqli_close($mysqli);
    //echo "Connection closed;";
?>