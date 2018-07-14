<?php
/* Contentloader tasks
 *  1: profilepicture small for topbar
 */
try
{
    define("IMAGE_FOLDER_PATH", "user_images/");
    define("IMAGE_TYPE_EXTENSION", ".jpeg");
    $database_host = "localhost";
    $database_name = "matchmedb";
    $database_user = "admin";
    $database_pass = "jr5j0HzcbJX2bMaq";
    $mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);
    if (!$mysqli) {
        exit("!015");
    }
    $task = mysqli_real_escape_string($mysqli, utf8_decode($_POST["task"]));
    if ($task == 1) {
        $username = mysqli_real_escape_string($mysqli, $_POST["username"]);
        $password = mysqli_real_escape_string($mysqli, $_POST["password"]);
        $query = mysqli_query($mysqli, "SELECT id FROM users WHERE nutzername='$username' AND passwort='$password'");
        if (mysqli_num_rows($query) > 0) {
            $id = mysqli_fetch_array($query)[0];
            $imagepath = IMAGE_FOLDER_PATH . $id . IMAGE_TYPE_EXTENSION;
            if(file_exists($imagepath)){
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $base64image = utf8_encode($base64image);
                echo $base64image;
            }
            else{
                echo "!019";
            }
        } else {
            echo "!013";
        }
    }
    mysqli_close($mysqli);
} catch (Exception $e) {
    exit("!014: " . $e->getMessage());
}
