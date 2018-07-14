<?php
/*
This script validates the incoming username and password.
See docce to evaluate the checks and errors.
*/

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;
use PHPMailer\PHPMailer\SMTP;

require 'PHPMailer/Exception.php';
require 'PHPMailer/PHPMailer.php';
require 'PHPMailer/SMTP.php';

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
$lang = mysqli_real_escape_string($mysqli, utf8_decode($_POST["lang"]));

$sql      = "SELECT count(*) FROM users WHERE nutzername='$username'";
$resultun = mysqli_query($mysqli, $sql);
$resultun = implode("", mysqli_fetch_assoc($resultun));

$sql      = "SELECT count(*) FROM users WHERE email='$username'";
$resultem = mysqli_query($mysqli, $sql);
$resultem = implode("", mysqli_fetch_assoc($resultem));

$email = null;
$vorname = null;
$nachname = null;

if ($resultun == 1) {
    
    $sql    = "SELECT email FROM users WHERE nutzername='$username'";
    $email = mysqli_query($mysqli, $sql);
    $email = implode("", mysqli_fetch_assoc($email));

    $sql    = "SELECT vorname FROM users WHERE nutzername='$username'";
    $vorname = mysqli_query($mysqli, $sql);
    $vorname = implode("", mysqli_fetch_assoc($vorname));

    $sql    = "SELECT nachname FROM users WHERE nutzername='$username'";
    $nachname = mysqli_query($mysqli, $sql);
    $nachname = implode("", mysqli_fetch_assoc($nachname));

} else if ($resultem == 1) {

	$sql    = "SELECT vorname FROM users WHERE email='$username'";
    $vorname = mysqli_query($mysqli, $sql);
    $vorname = implode("", mysqli_fetch_assoc($vorname));

    $sql    = "SELECT nachname FROM users WHERE email='$username'";
    $nachname = mysqli_query($mysqli, $sql);
    $nachname = implode("", mysqli_fetch_assoc($nachname));

    $email = $username;

} else {
    exit("!02");
}

$mail = new PHPMailer(true);
    try{
        //Server settings
        $mail->SMTPDebug = 2;
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'giessmann.phd@gmail.com';
        $mail->Password = 'ApfelBier2012';
        $mail->SMTPSecure = 'tls';
        $mail->Port = 587;

        $code = "";

        for($s = 0; $s<6; $s++){
            $code = $code.mt_rand(1,9);
        }

        $sql = "UPDATE users SET resetcode='$code' WHERE email='$email'";
        mysqli_query($mysqli, $sql);

        //Empfänger und Inhalt
        $mail->CharSet = 'UTF-8'; 
        $mail->From = 'service@matchme.com';
        $mail->FromName = 'matchme.com';
        $mail->addAddress($email, $vorname.' '.$nachname);
        $mail->isHTML(true);
        $mail->AddEmbeddedImage("../logo_small.png", "logo", "logo_small.png");
        if($lang=="de"){
            $mail->Subject = 'Passwortwiederherstellung matchme.com';
            $body = file_get_contents('email_de.html');
        }
        else{
            $mail->Subject = 'Password reset matchme.com';
            $body = file_get_contents('email_en.html');
        }
        $body = str_replace('$name', $vorname, $body);
        $body = str_replace('$code', $code, $body);
        $body = str_replace('$email', $email, $body);
        $mail->Body = $body;

        $mail->AltBody = strip_tags($mail->Body);

        //Senden
        $mail->send();
    }
    catch(Exception $e){
        echo("E-Mail konnte nicht gesendet werden!");
        echo("Mailer Error: ".$mail->ErrorInfo);
    }
    echo("!18");

mysqli_close($mysqli);
//echo "Connection closed;";

?>