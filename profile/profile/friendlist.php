<?php
/*
This script loads resources to display the friendlist and provides the option of deleting a user from it.
@Nico Gießmann
latest update: 02-06-18
 */
try{
    define("IMAGE_FOLDER_PATH", "../../user_images/");
    define("IMAGE_TYPE_EXTENSION", ".jpeg");
    $database_host = "localhost";
    $database_name = "matchmedb";
    $database_user = "admin";
    $database_pass = "jr5j0HzcbJX2bMaq";
    
    $mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);
    
    if ($mysqli == false) {
        die("Connection failed: " . mysqli_connect_error() . ";");
    }
    
    /*Get form data*/
    $task = null;
    $user_id = null;

    if(isset($_POST["task"]))
    $task = intval($_POST["task"]);
    if(isset($_POST["user_id"]))
    $user_id = intval($_POST["user_id"]);

    /*--------------------------------*/

    /*Function definitons*/
    function getFriendlistEntries($user_id){
        global $mysqli;

        $query = mysqli_query($mysqli, "SELECT friends FROM users WHERE id='$user_id'");
        if(!$query){
            echo "!015", mysqli_error($mysqli);//mysql-error
            return null;
        }
        else{
            $friendlist_entries_string = current(mysqli_fetch_assoc($query));
            if($friendlist_entries_string==""){
                echo "!021";
                return null;
            }
            else{
                $friendlist_entries_array = json_decode($friendlist_entries_string);
                if(sizeof($friendlist_entries_array)==0){
                    echo "!021";
                    return null;
                }
                else{
                    return $friendlist_entries_array;
                }
            }
        }
    }

    function getFriendsData($friendlist_entries_array){
        global $mysqli;

        $friendlist_data = [];

        for($i=0; $i<sizeof($friendlist_entries_array); $i++){
            $username = null;
            $query = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$friendlist_entries_array[$i]'");
            if(!$query){
                echo "!021";
                return null;
            }
            else{
                $username = current(mysqli_fetch_assoc($query));
            }
            $image = null;
            $imagepath = IMAGE_FOLDER_PATH . $friendlist_entries_array[$i] . IMAGE_TYPE_EXTENSION;
            if(file_exists($imagepath)){
                $image = imagecreatefromjpeg($imagepath);
                $scaledimage = imagescale($image, 400, 400, IMG_NEAREST_NEIGHBOUR);
                ob_start();
                imagejpeg($scaledimage);
                $contents = ob_get_clean();
                $base64image = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($contents);
                $image = $base64image;
            }
            array_push($friendlist_data, [$friendlist_entries_array[$i], $username, $image]);
        }
        return $friendlist_data;
    }

    function deleteFriend($user_id, $delete_id){
        global $mysqli;

        $query = mysqli_query($mysqli, "SELECT friends FROM users WHERE id='$user_id'");
        if(!$query){
            echo "!021";
        }
        else{
            $friendlist_entries_string = current(mysqli_fetch_assoc($query));
            $friendlist_entries_array = json_decode($friendlist_entries_string);
            for($i=0; $i<sizeof($friendlist_entries_array); $i++){
                if($friendlist_entries_array[$i]==$delete_id){
                    $friendlist_entries_array = array_merge(array_slice($friendlist_entries_array, 0, $i), array_slice($friendlist_entries_array, $i+1, sizeof($friendlist_entries_array)-1));
                }
            }
            $friendlist_entries_string = json_encode($friendlist_entries_array);
            $query = mysqli_query($mysqli, "UPDATE users SET friends='$friendlist_entries_string' WHERE id='$user_id'");
            if(!$query){
                echo "!015";
            }
        }
    }

    /*--------------------------------*/

    /*Main script*/
    if($task && $user_id){
        if($task == 1){
            $friendlist_entries_array = getFriendlistEntries($user_id);
            if($friendlist_entries_array!=null){
                echo json_encode(getFriendsData($friendlist_entries_array));
            }
        }
        else if($task == 2){
            $delete_id = null;
            if(isset($_POST["delete_id"])){
                $delete_id = intval($_POST["delete_id"]);
                deleteFriend($user_id, $delete_id);
            }
            else
            echo "!022";
        }
    }
    else{
        echo "!022";
    }

    /*----------------------------------*/
    
    mysqli_close($mysqli);
}
catch(Exception $e){
    echo "!014:",$e->getMesaage(),"\n";
}
?>
