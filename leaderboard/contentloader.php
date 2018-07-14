<?php
/* Contentloader tasks
 *  1: leaderboard
 *  2: profilepicture small for topbar
 *  3: profilepicture big for profile_view
 *  4: search
 */
try
{
    define("IMAGE_FOLDER_PATH", "../user_images/");
    define("IMAGE_TYPE_EXTENSION", ".jpeg");
    $database_host = "localhost";
    $database_name = "matchmedb";
    $database_user = "admin";
    $database_pass = "jr5j0HzcbJX2bMaq";
    $mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);
    if (!$mysqli) {
        exit("!015");
    }

    #------------------------------------------------------------------------------
    /*
    This function load users friendlist entries if existing
     */
    function getFriendlistEntries($user_id)
    {
        global $mysqli;

        $query = mysqli_query($mysqli, "SELECT friends FROM users WHERE id='$user_id'");
        if (!$query) {
            return "!015";
        } else {
            $friendlist_entries_string = current(mysqli_fetch_assoc($query));
            if ($friendlist_entries_string == "") {
                return "!021";
            } else {
                $friendlist_entries_array = json_decode($friendlist_entries_string);
                if (sizeof($friendlist_entries_array) == 0) {
                    return "!021";
                } else {
                    return $friendlist_entries_array;
                }
            }
        }
    }

    function getFriendsData($friendlist_entries_array)
    {
        global $mysqli;

        $friendlist_data = [];

        for ($i = 0; $i < sizeof($friendlist_entries_array); $i++) {
            $username = null;
            $query = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$friendlist_entries_array[$i]' AND matchable=1");
            if (!$query) {
                return "!021";
            } else {
                $username = current(mysqli_fetch_assoc($query));
            }
            $points = null;
            $query = mysqli_query($mysqli, "SELECT points FROM users WHERE id='$friendlist_entries_array[$i]' AND matchable=1");
            if (!$query) {
                return "!021";
            } else {
                $points = intval(current(mysqli_fetch_assoc($query)));
            }
            $image = null;
            $imagepath = IMAGE_FOLDER_PATH . $friendlist_entries_array[$i] . IMAGE_TYPE_EXTENSION;
            if (file_exists($imagepath)) {
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $image = $base64image;
            }
            else{
                return "!019";
            }
            array_push($friendlist_data, [$friendlist_entries_array[$i], $points, $username, $image]);
        }
        return $friendlist_data;
    }

    function selectionsortFriendlistData($mask){
        for($i=0; $i<sizeof($mask); $i++){
            $smallest_value = $mask[$i];
            for($v=$i+1; $v<sizeof($mask); $v++){
                if($smallest_value[0] > $mask[$v][0]){
                    $mask[$i] = $mask[$v];
                    $mask[$v] = $smallest_value;
                    $smallest_value = $mask[$i];
                }
            }
        }
        return reverseSort($mask);
    }

    function reverseSort($mask){
        $reverse_mask = array();
        for($i=sizeof($mask)-1; $i>=0; $i--){
            array_push($reverse_mask, $mask[$i]);
        }
        return $reverse_mask;
    }

    #------------------------------------------------------------------------------

    $task = mysqli_real_escape_string($mysqli, utf8_decode($_POST["task"]));
    if ($task == 1) {
        $bonusdata = filter_var($_POST["bonusdata"], FILTER_VALIDATE_BOOLEAN);
        $table_friendlist = null;
        $table_location = null;
        $userdata = null;
        if ($bonusdata === true) {
            $username = mysqli_real_escape_string($mysqli, $_POST["username"]);
            $password = mysqli_real_escape_string($mysqli, $_POST["password"]);
            $user_id_gender_points = mysqli_query($mysqli, "SELECT matchable, id, gender, points FROM users WHERE nutzername='$username' AND passwort='$password'");
            if (mysqli_num_rows($user_id_gender_points) == 1) {
                $matchable = intval(mysqli_fetch_array($user_id_gender_points)[0]);
                if ($matchable == 0 || $matchable == 2) {
                    $userdata = "!017";
                    $table_friendlist = "!017";
                    $table_location = "!017";
                } else {
                    $userdata = array();
                    mysqli_data_seek($user_id_gender_points, 0);
                    $id = mysqli_fetch_array($user_id_gender_points)[1];
                    mysqli_data_seek($user_id_gender_points, 0);
                    $gender = mysqli_fetch_array($user_id_gender_points)[2];
                    mysqli_data_seek($user_id_gender_points, 0);
                    $points = mysqli_fetch_array($user_id_gender_points)[3];
                    $gender_selected_table = mysqli_query($mysqli, "SELECT id FROM users WHERE gender='$gender' AND matchable=1 ORDER BY points DESC LIMIT 1000000");
                    $place = 0;
                    for ($i = 0; $i < mysqli_num_rows($gender_selected_table); $i++) {
                        if (mysqli_fetch_array($gender_selected_table)[0] == $id) {
                            $place = $i + 1;
                        }
                    }
                    $imagepath = IMAGE_FOLDER_PATH . $id . IMAGE_TYPE_EXTENSION;
                    $image = imagecreatefromjpeg($imagepath);
                    $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                    ob_start();
                    imagejpeg($scaledimage);
                    $contents = ob_get_clean();
                    $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                    array_push($userdata, array(
                        "id" => $id,
                        "gender" => $gender,
                        "place" => $place,
                        "points" => $points,
                        "img" => $base64image,
                    ));
                    //friendlist
                    $table_friendlist = getFriendlistEntries($id);
                    if (is_array($table_friendlist) && $table_friendlist!="" && $table_friendlist!=null) {
                        $table_friendlist = getFriendsData($table_friendlist);
                        array_push($table_friendlist, array($id, $points, $username, $base64image));
                        //create mask
                        $mask = array();
                        for($i=0; $i<sizeof($table_friendlist); $i++){
                            array_push($mask, array($table_friendlist[$i][1], $i));
                        }
                        $mask = selectionsortFriendlistData($mask);
                        //evaluate mask
                        $table_friendlist_sorted = array();
                        for($i=0; $i<sizeof($mask); $i++){
                            array_push($table_friendlist_sorted, $table_friendlist[$mask[$i][1]]);
                        }
                        $table_friendlist = $table_friendlist_sorted;
                    }
                    else{
                        $table_friendlist = null;
                    }
                }
            } else {
                $userdata = "!013";
            }
        } else {
            $table_friendlist = "!016";
            $table_location = "!016";
            $userdata = "!016";
        }
        // Table female
        $table_female = array();
        $query = mysqli_query($mysqli, "SELECT id, nutzername, points FROM users WHERE gender='1' AND matchable=1 ORDER BY points DESC LIMIT 100");
        if (mysqli_num_rows($query) > 0) {
            for ($row = 0; $row < mysqli_num_rows($query); $row++) {
                $dataset = mysqli_fetch_array($query, MYSQLI_ASSOC);
                $imagepath = IMAGE_FOLDER_PATH . $dataset["id"] . IMAGE_TYPE_EXTENSION;
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $dataset["img"] = $base64image;
                array_push($table_female, $dataset);
            }
        } else {
            $table_female = "!015";
        }
        // Table male
        $table_male = array();
        $query = mysqli_query($mysqli, "SELECT id, nutzername, points FROM users WHERE gender='2' AND matchable=1 ORDER BY points DESC LIMIT 100");
        if (mysqli_num_rows($query) > 0) {
            for ($row = 0; $row < mysqli_num_rows($query); $row++) {
                $dataset = mysqli_fetch_array($query, MYSQLI_ASSOC);
                $imagepath = IMAGE_FOLDER_PATH . $dataset["id"] . IMAGE_TYPE_EXTENSION;
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $dataset["img"] = $base64image;
                array_push($table_male, $dataset);
            }
        } else {
            $table_male = "!015";
        }
        $table_data = array(
            "table_female" => $table_female,
            "table_male" => $table_male,
            "table_friendlist" => $table_friendlist,
            "table_location" => $table_location,
            "userdata" => $userdata,
        );
        echo json_encode($table_data);
    } else if ($task == 2) {
        $username = mysqli_real_escape_string($mysqli, $_POST["username"]);
        $password = mysqli_real_escape_string($mysqli, $_POST["password"]);
        $query = mysqli_query($mysqli, "SELECT id FROM users WHERE nutzername='$username' AND passwort='$password'");
        if (mysqli_num_rows($query) > 0) {
            $id = mysqli_fetch_array($query)[0];
            $imagepath = IMAGE_FOLDER_PATH . $id . IMAGE_TYPE_EXTENSION;
            if (file_exists($imagepath)) {
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $base64image = utf8_encode($base64image);
                echo $base64image;
            } else {
                echo "!019";
            }
        } else {
            echo "!013";
        }
    } else if ($task == 3) {
        $id = mysqli_real_escape_string($mysqli, $_POST["id"]);
        $desc = utf8_encode(mysqli_fetch_array(mysqli_query($mysqli, "SELECT beschreibung FROM users WHERE id='$id'"))[0]);
        $imagepath = IMAGE_FOLDER_PATH . $id . IMAGE_TYPE_EXTENSION;
        $image = file_get_contents($imagepath);
        $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($image);
        $base64image = utf8_encode($base64image);
        echo json_encode(array(
            "description" => $desc,
            "base64image" => $base64image,
        ));
    } else if ($task == 4) {
        $guess = (string) mysqli_real_escape_string($mysqli, $_POST["guess"]);
        if (strlen($guess) > 2) {
            $query = mysqli_query($mysqli, "SELECT id FROM users WHERE gender='1' AND matchable='1' ORDER BY points DESC LIMIT 1000000");
            $users_female = array();
            for ($i = 0; $i < mysqli_num_rows($query); $i++) {
                array_push($users_female, mysqli_fetch_array($query)[0]);
            }
            $query = mysqli_query($mysqli, "SELECT id FROM users WHERE gender='2' AND matchable='1' ORDER BY points DESC LIMIT 1000000");
            $users_male = array();
            for ($i = 0; $i < mysqli_num_rows($query); $i++) {
                array_push($users_male, mysqli_fetch_array($query)[0]);
            }
            $query = mysqli_query($mysqli, "SELECT id, nutzername, gender, points FROM users WHERE LOWER(nutzername) LIKE CONCAT('%', LOWER('$guess'), '%') AND matchable='1' LIMIT 100");
            $useroffers = array();
            for ($i = 0; $i < mysqli_num_rows($query); $i++) {
                $id = mysqli_fetch_array($query)[0];
                mysqli_data_seek($query, $i);
                $username = utf8_encode(mysqli_fetch_array($query)[1]);
                mysqli_data_seek($query, $i);
                $gender = mysqli_fetch_array($query)[2];
                mysqli_data_seek($query, $i);
                $place = null;
                if ($gender == 1) {
                    for ($u = 0; $u < sizeof($users_female); $u++) {
                        if ($id == $users_female[$u]) {
                            $place = $u + 1;
                            break;
                        }
                    }
                } else if ($gender == 2) {
                    for ($u = 0; $u < sizeof($users_male); $u++) {
                        if ($id == $users_male[$u]) {
                            $place = $u + 1;
                            break;
                        }
                    }
                }
                $points = mysqli_fetch_array($query)[3];
                $imagepath = IMAGE_FOLDER_PATH . $id . IMAGE_TYPE_EXTENSION;
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $base64image = utf8_encode($base64image);
                array_push($useroffers, array(
                    "id" => $id,
                    "username" => $username,
                    "points" => $points,
                    "place" => $place,
                    "img" => $base64image,
                ));
            }
            echo json_encode($useroffers);
        } else {
            echo "!018";
        }
    }
    mysqli_close($mysqli);

} catch (Exception $e) {
    exit("!014: " . $e->getMessage());
}
