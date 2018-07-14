<?php
define("IMAGE_FOLDER_PATH", "../user_images/");
define("IMAGE_TYPE_EXTENSION", ".jpeg");
$database_host = "localhost";
$database_name = "matchmedb";
$database_user = "admin";
$database_pass = "jr5j0HzcbJX2bMaq";
$mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);
if ($mysqli == false) {
    die("Connection failed: " . mysqli_connect_error() . ";");
}
$task = mysqli_real_escape_string($mysqli, utf8_decode($_POST["task"]));
if ($task == 1) {
    $useroffer = mysqli_real_escape_string($mysqli, utf8_decode($_POST["useroffer"]));
    if (isset($_POST["username"])) {
        $username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["username"]));
        $sql = "SELECT id, nutzername, gender FROM users WHERE LOWER(nutzername) LIKE CONCAT('%', LOWER('$useroffer'), '%') AND matchable='1'AND nutzername!='$username' LIMIT 10";
    } else {
        $sql = "SELECT id, nutzername, gender FROM users WHERE LOWER(nutzername) LIKE CONCAT('%', LOWER('$useroffer'), '%') AND matchable='1' LIMIT 10";
    }
    $result = mysqli_query($mysqli, $sql);
    if (!$result) {
        echo 'Could not run query: ' . mysqli_error($mysqli);
        exit;
    }
    $array = array();
    for ($i = 0;$i < mysqli_num_rows($result);$i++) {
        $v = mysqli_fetch_row($result);
        $imagepath = IMAGE_FOLDER_PATH . $v[0] . IMAGE_TYPE_EXTENSION;
        $image = imagecreatefromjpeg($imagepath);
        $scaledimage = imagescale($image, 100, 100, IMG_NEAREST_NEIGHBOUR);
        ob_start();
        imagejpeg($scaledimage);
        $contents = ob_get_clean();
        $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
        array_push($array, array($v[0], $v[1], $base64image, $v[2]));
    }
    echo json_encode($array);
} else if ($task == 2) {
    $id = mysqli_real_escape_string($mysqli, utf8_decode($_POST["id"]));
    $username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["username"]));
    $array = array();
    $result = mysqli_query($mysqli, "SELECT gender FROM users WHERE matchable='1' AND id='$id'");
    if (!$result || $result->num_rows == 0) {
        echo "!012";
    } else {
        $result = implode("", mysqli_fetch_assoc($result));
        array_push($array, $result);
        $result = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$id'");
        if (!$result || $result->num_rows == 0) {
            echo "!012";
        } else {
            $result = implode("", mysqli_fetch_assoc($result));
            if($result == $username){
                echo "!012";
            }
            else{
                array_push($array, $result);
                echo json_encode($array);
            }
        }
    }
}
mysqli_close($mysqli);
?>
