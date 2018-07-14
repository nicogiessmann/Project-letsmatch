<?php
#Constants
define("PLATIN_PROBABILITY", 1);
define("GOLD_PROBABILITY", 5);
define("SILVER_PROBABILITY", 35);
define("BRONZE_PROBABILITY", 59);
define("PLATIN_QUOTA", 0.95);
define("GOLD_QUOTA", 0.85);
define("SILVER_QUOTA", 0.5);
define("BRONZE_QUOTA", 0.0);
define("IMAGE_FOLDER_PATH", "../user_images/");
define("IMAGE_TYPE_EXTENSION", ".jpeg");
define("BONUS_BRONZE", 4);
define("BONUS_SILVER", 3);
define("BONUS_GOLD", 2);
define("BONUS_PLATIN", 1);
define("MAX_DAILY_LIMIT", 50);
define("MODE_RVSR", "MODE_RVSR");
define("MODE_1VSR", "MODE_1VSR");
define("UPDATE_BOTH", "full");
define("UPDATE_ONE", "partly");
define("DAY_IN_SECONDS", 86400);
define("DAILY_LIMIT", 500);
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
    $username = mysqli_real_escape_string($mysqli, utf8_decode($_POST["username"]));
    $password = mysqli_real_escape_string($mysqli, utf8_decode($_POST["password"]));
    $sql = "SELECT count(*) FROM users WHERE nutzername='$username' AND passwort='$password'";
    $result = mysqli_query($mysqli, $sql);
    if (!$result || $result->num_rows == 0) {
        echo "!08";
        exit;
    }
    $result = implode("", mysqli_fetch_assoc($result));
    if ($result == 1) {
        $sql = "SELECT id FROM users WHERE nutzername='$username' AND passwort='$password'";
        $result = mysqli_query($mysqli, $sql);
        $result = implode("", mysqli_fetch_assoc($result));
        $id = $result;
        $sql = "SELECT points FROM users WHERE id='$id'";
        $result = mysqli_query($mysqli, $sql);
        $result = implode("", mysqli_fetch_assoc($result));
        $points = $result;
        $sql = "SELECT gender FROM users WHERE id='$id'";
        $result = mysqli_query($mysqli, $sql);
        $result = implode("", mysqli_fetch_assoc($result));
        $gender = $result;
        $sql = "SELECT id FROM users WHERE gender='$gender' ORDER BY points DESC LIMIT 1000000";
        $result = mysqli_query($mysqli, $sql);
        $array = [];
        while ($row = $result->fetch_row()) {
            $array[] = $row[0];
        }
        $place = 0;
        for ($i = 0; $i < count($array); $i++) {
            if ($array[$i] == $id) {
                $place = $i;
            }
        }
        ++$place;
        $data = array($id, $points, $place);
        echo json_encode($data);
    } else {
        echo "!08";
    }
} else if ($task == 2) {
    $mode = mysqli_real_escape_string($mysqli, utf8_decode($_POST["mode"]));
    $id_array = utf8_decode($_POST["id_array"]);
    $user_id = mysqli_real_escape_string($mysqli, utf8_decode($_POST["user_id"]));
    #Styling id_array
    $id_array = json_decode($id_array);
    if($id_array!="")
    for ($i = 0; $i < sizeof($id_array); $i++) {
        $id_array[$i] = intval($id_array[$i]);
    }
    $gender = mysqli_real_escape_string($mysqli, utf8_decode($_POST["gender"]));
    if ($mode == MODE_RVSR) {
        $table_after_filter = getSecureTable($gender, $id_array, $user_id); //after_filter = gender-selected, matchable-selected, id-selected
        if (!is_null($table_after_filter)) {
            #Randomly choose match league
            $rand = mt_rand(0, 100);
            if ($rand <= BRONZE_PROBABILITY) {
                #Bronze
                $id_array = getMatchIds($table_after_filter, BRONZE_PROBABILITY, $gender);
            } else if ($rand > BRONZE_PROBABILITY && $rand <= (BRONZE_PROBABILITY + SILVER_PROBABILITY)) {
                #Silver
                $id_array = getMatchIds($table_after_filter, SILVER_PROBABILITY, $gender);
            } else if ($rand > (BRONZE_PROBABILITY + SILVER_PROBABILITY) && $rand <= (BRONZE_PROBABILITY + SILVER_PROBABILITY + GOLD_PROBABILITY)) {
                #Gold
                $id_array = getMatchIds($table_after_filter, GOLD_PROBABILITY, $gender);
            } else {
                #Platin
                $id_array = getMatchIds($table_after_filter, PLATIN_PROBABILITY, $gender);
            }
            sendMatchImages($id_array[0], $id_array[1], $gender);
        } else {
            #Regular table not possible
            $db_basis = getDatabaseSize($gender, $user_id);
            if ($db_basis < 2) {
                echo "!09";
            } else {
                echo "!020";
            }
        }
    } else if ($mode == MODE_1VSR) {
        $chosenone = mysqli_real_escape_string($mysqli, utf8_decode($_POST["chosenone"]));
        $gender = mysqli_real_escape_string($mysqli, utf8_decode($_POST["gender"]));
        $table_after_filter = getSecureExclusiveTable($gender, $id_array, $chosenone, $user_id);
        if (!is_null($table_after_filter)) {
            $second_id = getExclusiveNearestNeighbour($table_after_filter, $chosenone);
            sendMatchImages($chosenone, $second_id, $gender);
        } else {
            #Regular table not possible
            $db_basis = getDatabaseSize($gender, $user_id) - 1;
            if ($db_basis == 0) {
                echo "!09";
            } else {
                echo "!020";
            }
        }
    }
} else if ($task == 3) {
    $id_winner = mysqli_real_escape_string($mysqli, utf8_decode($_POST["id_winner"]));
    $id_loser = mysqli_real_escape_string($mysqli, utf8_decode($_POST["id_loser"]));
    $gender = mysqli_real_escape_string($mysqli, utf8_decode($_POST["gender"]));
    $points_winner = intval(getPoints($id_winner));
    $points_loser = intval(getPoints($id_loser));
    $bonus_winner = getMatcherBonus($id_winner, $gender);
    $bonus_loser = getReverseBonus(getMatcherBonus($id_loser, $gender));
    $bonus_winner = getSecureBonus($id_winner, $bonus_winner, true);
    $bonus_loser = getSecureBonus($id_loser, $bonus_loser, true);
    $points_winner = $points_winner + $bonus_winner;
    $points_loser = $points_loser + $bonus_loser;
    if ($points_loser < 0) {
        $points_loser = 0;
    }
    $success = false;
    if (mysqli_query($mysqli, "UPDATE users SET points='$points_winner' WHERE id='$id_winner'")) {
        $success = true;
    }
    if (!mysqli_query($mysqli, "UPDATE users SET points='$points_loser' WHERE id='$id_loser'")) {
        $success = false;
    }
    if ($success) {
        echo "Matcher points updated successfully.";
    } else {
        echo "Error updating matcher points: " . mysqli_error($mysqli);
    }
} else if ($task == 4) {
    $user_id = mysqli_real_escape_string($mysqli, utf8_decode($_POST["user_id"]));
    $daily_limit_counter = mysqli_real_escape_string($mysqli, utf8_decode($_POST["daily_limit_counter"]));
    $result = mysqli_query($mysqli, "SELECT gender FROM users WHERE id='$user_id'");
    $gender = implode("", mysqli_fetch_assoc($result));
    if ($daily_limit_counter <= MAX_DAILY_LIMIT) {
        $result = mysqli_query($mysqli, "SELECT points FROM users WHERE id='$user_id'");
        $result = implode("", mysqli_fetch_assoc($result));
        $user_points = $result;
        $league_borders = getLeagueBorders($gender);
        $bonus = 0;
        if (fit($user_points, $league_borders->bronze, $league_borders->silver)) {
            $bonus = BONUS_BRONZE;
        }
        if (fit($user_points, $league_borders->silver, $league_borders->gold)) {
            $bonus = BONUS_SILVER;
        }
        if (fit($user_points, $league_borders->gold, $league_borders->platin)) {
            $bonus = BONUS_GOLD;
        }
        if (fit($user_points, $league_borders->platin, $league_borders->max)) {
            $bonus = BONUS_PLATIN;
        }
        $bonus = getSecureBonus($user_id, $bonus, true);
        $new_points = $user_points + $bonus;
        if (mysqli_query($mysqli, "UPDATE users SET points='$new_points' WHERE id='$user_id'")) {
            $result = mysqli_query($mysqli, "SELECT id FROM users WHERE gender='$gender' ORDER BY points DESC LIMIT 1000000");
            $array = [];
            while ($row = $result->fetch_row()) {
                $array[] = $row[0];
            }
            $place = 0;
            for ($i = 0; $i < count($array); $i++) {
                if ($array[$i] == $user_id) {
                    $place = ++$i;
                }
            }
            $obj = new stdClass();
            $obj->new_points = $new_points;
            $obj->bonus = $bonus;
            $obj->new_place = $place;
            echo json_encode($obj);
        }
    } else {
        echo "!010"; //Daily limit reached -> see docce

    }
} else if ($task == 5) {
    $gender = mysqli_real_escape_string($mysqli, utf8_decode($_POST["gender"]));
    $update_mode = mysqli_real_escape_string($mysqli, utf8_decode($_POST["update_mode"]));
    $id_array = json_decode(utf8_decode($_POST["id_array"]));
    for ($i = 0; $i < sizeof($id_array); $i++) {
        $id_array[$i] = intval($id_array[$i]);
    }
    $user_id = mysqli_real_escape_string($mysqli, utf8_decode($_POST["user_id"]));
    if ($update_mode == UPDATE_ONE) {
        $partlyID = mysqli_real_escape_string($mysqli, utf8_decode($_POST["partlyID"]));
        $table_after_filter = getSecureExclusiveTable($gender, $id_array, $partlyID, $user_id);
        if (!is_null($table_after_filter)) {
            #Find one match partner for winner_id
            $second_id = getExclusiveNearestNeighbour($table_after_filter, $partlyID);
            sendExclusiveMatchData($partlyID, $second_id, $gender);
        } else {
            #regular table not possible
            $db_basis = getDatabaseSize($gender, $user_id) - 1;
            if ($db_basis == 0) {
                echo "!09";
            } else {
                echo "!020";
            }
        }
    } else {
        $table_after_filter = getSecureTable($gender, $id_array, $user_id);
        if (!is_null($table_after_filter)) {
            //Find two new match partners
            #Randomly choose match league
            $rand = mt_rand(0, 100);
            if ($rand <= BRONZE_PROBABILITY) {
                #Bronze
                $id_array = getMatchIds($table_after_filter, BRONZE_PROBABILITY, $gender);
            } else if ($rand > BRONZE_PROBABILITY && $rand <= (BRONZE_PROBABILITY + SILVER_PROBABILITY)) {
                #Silver
                $id_array = getMatchIds($table_after_filter, SILVER_PROBABILITY, $gender);
            } else if ($rand > (BRONZE_PROBABILITY + SILVER_PROBABILITY) && $rand <= (BRONZE_PROBABILITY + SILVER_PROBABILITY + GOLD_PROBABILITY)) {
                #Gold
                $id_array = getMatchIds($table_after_filter, GOLD_PROBABILITY, $gender);
            } else {
                #Platin
                $id_array = getMatchIds($table_after_filter, PLATIN_PROBABILITY, $gender);
            }
            sendMatchImages($id_array[0], $id_array[1], $gender);
        } else {
            #regular table not possible
            $db_basis = getDatabaseSize($gender, $user_id);
            if ($db_basis == 0) {
                echo "!09";
            } else {
                echo "!20";
            }
        }
    }
} else if ($task == 6) {
    $id = mysqli_real_escape_string($mysqli, utf8_decode($_POST["id"]));
    $reason = mysqli_real_escape_string($mysqli, utf8_decode($_POST["reason"]));
    date_default_timezone_set("UTC");
    $date = date(DATE_ATOM);
    $response = mysqli_query($mysqli, "INSERT INTO reports (report_order, id, reason, date) VALUES ('', '$id', '$reason', '$date')");
    if ($response) {
        echo "!111";
    } else {
        echo "!011";
    }
}
/**
 * Function: getExclusiveNearestNeighbour
 * - return a suitable matchparter for given id
 * - matchpartner not included
 * @param $table
 * @param $winner_id
 * @return $partner_id
 */
function getExclusiveNearestNeighbour($table, $winner_id)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT points FROM users WHERE id='$winner_id'");
    $result = implode("", mysqli_fetch_assoc($result));
    $winner_points = intval($result);
    if (sizeof($table) == 1) {
        return $table[0][0];
    } else if (sizeof($table) == 2) {
        $rand = mt_rand(0, 1);
        if ($rand == 0) {
            return $table[0][0];
        } else {
            return $table[1][0];
        }
    } else {
        if ($winner_points > $table[0][1]) {
            return $table[0][0];
        } else if ($winner_points < $table[sizeof($table) - 1][1]) {
            return $table[sizeof($table) - 1][0];
        } else {
            for ($i = 1; $i < sizeof($table); $i++) {
                if (($winner_points <= $table[$i - 1][1]) && ($winner_points > $table[$i][1])) {
                    return $table[$i - 1][0];
                }
            }
        }
    }
}
/**
 * Function: getSecureExclusiveTable
 * - Finds the best possible table for user requirements, includes repitition of winner
 * - if it's not possible to create a table the function return null
 * @param $gender
 * @param $id_array
 * @param $winner_id
 * @param $user_id
 * @return array|null
 */
function getSecureExclusiveTable($gender, $id_array, $winner_id, $user_id)
{
    array_push($id_array, $winner_id);
    $array = getFilteredTable($gender, $id_array, $user_id);
    #Check if array has enough entries
    if (sizeof($array) < 1) {
        return null;
    }
    return $array;
}
/**
 * Function: getSecureTable
 * - Finds the best possible table for user requirements
 * - if it's not possible to create a table the function return null
 * @param $gender
 * @param $id_array
 * @param $user_id
 * @return array|null
 */
function getSecureTable($gender, $id_array, $user_id)
{
    $array = getFilteredTable($gender, $id_array, $user_id);
    #Check if array has enough entries
    if (sizeof($array) < 2) {
        return null;
    }
    return $array;
}
/**
 * Function: getFilteredTable
 * - returns a table considering user requirements
 * - no error handing included -> see function:getSecureTable
 * @param $gender
 * @param $id_array
 * @param $user_id
 * @return array
 *
 */
function getFilteredTable($gender, $id_array, $user_id)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT id, points FROM users WHERE gender='$gender' AND matchable='1' AND id!='$user_id' ORDER BY points DESC LIMIT 1000000");
    if (!$result) {
        echo 'Could not run query: ' . mysqli_error($mysqli);
        exit;
    }
    $array = array();
    for ($i = 0; $i < mysqli_num_rows($result); $i++) {
        $v = mysqli_fetch_row($result);
        $id_correct = true;
        if ($id_array != null) {
            for ($x = 0; $x < sizeof($id_array); $x++) {
                if ($v[0] == $id_array[$x]) {
                    $id_correct = false;
                }
            }
        }
        if ($id_correct) {
            array_push($array, $v);
        }
    }
    return $array;
}
/**
 * Function: getMatchIds
 * - returns a match pair
 * @param $table
 * @param $league
 * @return array
 */
function getMatchIds($table, $league, $gender)
{
    $league_borders = getLeagueBorders($gender);
    $first_id = getIndividual($table, $league, $league_borders);
    $second_id = getNearestNeighbour($table, $first_id);
    return array($first_id, $second_id);
}
/**
 * Function: getLeagueBorders
 * - returns league borders according to current database
 * @return object:leagues
 */
function getLeagueBorders($gender)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT points FROM users WHERE gender='$gender' ORDER BY points DESC LIMIT 1");
    $result = implode("", mysqli_fetch_assoc($result));
    $leagues = new stdClass();
    $leagues->max = intval($result);
    $leagues->platin = intval(PLATIN_QUOTA * $result);
    $leagues->gold = intval(GOLD_QUOTA * $result);
    $leagues->silver = intval(SILVER_QUOTA * $result);
    $leagues->bronze = intval(BRONZE_QUOTA * $result);
    return $leagues;
}
/**
 * Function: getNearestNeighbour
 * - returns nearest Neighbour of given table
 * - first id needs to be included
 * @param $table
 * @param $first_id
 * @return $second_id
 */
function getNearestNeighbour($table, $id)
{
    $pos = null;
    for ($i = 0; $i < sizeof($table); $i++) {
        if ($table[$i][0] == $id) {
            $pos = $i;
        }
    }
    $pos_two = null;
    if ($pos == 0) {
        $pos_two = 1;
    } else if ($pos == sizeof($table) - 1) {
        $pos_two = sizeof($table) - 2;
    } else {
        $rand = mt_rand(0, 1);
        if ($rand == 0) {
            $pos_two = $pos + 1;
        } else {
            $pos_two = $pos - 1;
        }
    }
    return $table[$pos_two][0];
}
/**
 * Function: getIndividual
 * - returns a suitable individual for match
 * @param $table
 * @param $league
 * @param $league_borders
 * @return $id
 */
function getIndividual($table, $league, $league_borders)
{
    $id = null;
    $array = array();
    for ($i = 0; $i < sizeof($table); $i++) {
        $fit = false;
        if ($league == BRONZE_PROBABILITY) {
            if (fit($table[$i][1], $league_borders->bronze, $league_borders->silver)) {
                $fit = true;
            }
        } else if ($league == SILVER_PROBABILITY) {
            if (fit($table[$i][1], $league_borders->silver, $league_borders->gold)) {
                $fit = true;
            }
        } else if ($league == GOLD_PROBABILITY) {
            if (fit($table[$i][1], $league_borders->gold, $league_borders->platin)) {
                $fit = true;
            }
        } else {
            if (fit($table[$i][1], $league_borders->platin, $league_borders->max)) {
                $fit = true;
            }
        }
        if ($fit) {
            array_push($array, $table[$i][0]);
        }
    }
    if (sizeof($array) == 0) {
        #Ignore League because too few entries exist
        $array_size = sizeof($table);
        $rand = mt_rand(0, $array_size - 1);
        $id = $table[$rand][0];
    } else {
        #Randomly choose a individual
        $array_size = sizeof($array);
        $rand = mt_rand(0, $array_size - 1);
        $id = $array[$rand];
    }
    return $id;
}
/**
 * Function: fit
 * - checks if points fit inside league
 * @param $points
 * @param $bottom_border
 * @param $top_border
 * @return bool
 */
function fit($points, $bottom_border, $top_border)
{
    if ($points >= $bottom_border && $points <= $top_border) {
        return true;
    }
    return false;
}
/**
 * Function:sendExclusiveMatchData
 * - send full match data for $second_id and partly data for $partlyID
 * @param $partlyID, $second_id
 */
function sendExclusiveMatchData($partlyID, $second_id, $gender)
{
    global $mysqli;
    $path = IMAGE_FOLDER_PATH . $second_id . IMAGE_TYPE_EXTENSION;
    $data = file_get_contents($path);
    $base64 = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($data);
    $result = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$second_id'");
    $username = implode("", mysqli_fetch_assoc($result));
    $result = mysqli_query($mysqli, "SELECT beschreibung FROM users WHERE id='$second_id'");
    $description = implode("", mysqli_fetch_assoc($result));
    $image_data = new stdClass();
    $image_data->second_id = new stdClass();
    $image_data->second_id->id = $second_id;
    $image_data->second_id->base64_img_data = $base64;
    $image_data->second_id->username = utf8_encode($username);
    $image_data->second_id->description = utf8_encode($description);
    $image_data->second_id->points = getPoints($second_id);
    $image_data->second_id->place = getPlace($second_id, $gender);
    $image_data->second_id->bonus = getSecureBonus($second_id, getMatcherBonus($second_id, $gender), false);
    $image_data->second_id->malus = getSecureBonus($second_id, getReverseBonus(getMatcherBonus($second_id, $gender)), false);
    $image_data->partly_id = new stdClass();
    $image_data->partly_id->place = getPlace($partlyID, $gender);
    $image_data->partly_id->bonus = getSecureBonus($partlyID, getMatcherBonus($partlyID, $gender), false);
    $image_data->partly_id->malus = getSecureBonus($partlyID, getReverseBonus(getMatcherBonus($partlyID, $gender)), false);
    $image_data = json_encode($image_data);
    echo $image_data;
}
/**
 * Function: sendMatchImages
 * - sends all necessary matching data to client
 * @param $id_one, $id_two
 */
function sendMatchImages($id_one, $id_two, $gender)
{
    global $mysqli;
    $path_one = IMAGE_FOLDER_PATH . $id_one . IMAGE_TYPE_EXTENSION;
    $data_one = file_get_contents($path_one);
    $base64_one = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($data_one);
    $result = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$id_one'");
    $username_one = implode("", mysqli_fetch_assoc($result));
    $result = mysqli_query($mysqli, "SELECT beschreibung FROM users WHERE id='$id_one'");
    $description_one = implode("", mysqli_fetch_assoc($result));
    $path_two = IMAGE_FOLDER_PATH . $id_two . IMAGE_TYPE_EXTENSION;
    $data_two = file_get_contents($path_two);
    $base64_two = 'data:image/' . IMAGE_TYPE_EXTENSION . ';base64,' . base64_encode($data_two);
    $result = mysqli_query($mysqli, "SELECT nutzername FROM users WHERE id='$id_two'");
    $username_two = implode("", mysqli_fetch_assoc($result));
    $result = mysqli_query($mysqli, "SELECT beschreibung FROM users WHERE id='$id_two'");
    $description_two = implode("", mysqli_fetch_assoc($result));
    $image_data = new stdClass();
    $image_data->person_one = new stdClass();
    $image_data->person_one->id = $id_one;
    $image_data->person_one->base64_img_data = $base64_one;
    $image_data->person_one->username = utf8_encode($username_one);
    $image_data->person_one->description = utf8_encode($description_one);
    $image_data->person_one->points = getPoints($id_one);
    $image_data->person_one->place = getPlace($id_one, $gender);
    $image_data->person_one->bonus = getSecureBonus($id_one, getMatcherBonus($id_one, $gender), false);
    $image_data->person_one->malus = getSecureBonus($id_one, getReverseBonus(getMatcherBonus($id_one, $gender)), false);
    $image_data->person_two = new stdClass();
    $image_data->person_two->id = $id_two;
    $image_data->person_two->base64_img_data = $base64_two;
    $image_data->person_two->username = utf8_encode($username_two);
    $image_data->person_two->description = utf8_encode($description_two);
    $image_data->person_two->points = getPoints($id_two);
    $image_data->person_two->place = getPlace($id_two, $gender);
    $image_data->person_two->bonus = getSecureBonus($id_two, getMatcherBonus($id_two, $gender), false);
    $image_data->person_two->malus = getSecureBonus($id_two, getReverseBonus(getMatcherBonus($id_two, $gender)), false);
    $image_data = json_encode($image_data);
    echo $image_data;
}
/**
 * Function getMatcherBonus
 * - returns matcher bonus according to league
 * @param $id
 * @return $bonus
 */
function getMatcherBonus($id, $gender)
{
    global $mysqli;
    $bonus = 0;
    $league_borders = getLeagueBorders($gender);
    $points = getPoints($id);
    if (fit($points, $league_borders->bronze, $league_borders->silver)) {
        $bonus = BONUS_BRONZE;
    } else if (fit($points, $league_borders->silver, $league_borders->gold)) {
        $bonus = BONUS_SILVER;
    } else if (fit($points, $league_borders->gold, $league_borders->platin)) {
        $bonus = BONUS_GOLD;
    } else {
        $bonus = BONUS_PLATIN;
    }
    return $bonus;
}
function getSecureBonus($id, $bonus, $update)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT update_date FROM users WHERE id='$id'");
    $update_date = intval(implode("", mysqli_fetch_assoc($result)));
    if ($update_date == 0) {
        $update_date = time();
        if ($update == true) {
            if (!mysqli_query($mysqli, "UPDATE users SET update_date='$update_date' WHERE id='$id'")) {
                return "ERROR: getMatcherBonus1";
            } else {
                if (!mysqli_query($mysqli, "UPDATE users SET daily_counter='$bonus' WHERE id='$id'")) {
                    return "ERROR: getMatcherBonus2";
                }
            }
        }
        return $bonus;
    } else {
        $today = time();
        $diff = $today - $update_date;
        if ($diff >= DAY_IN_SECONDS) {
            if ($update == true) {
                if (!mysqli_query($mysqli, "UPDATE users SET update_date='$today' WHERE id='$id'")) {
                    return "ERROR: getMatcherBonus3";
                } else {
                    if (!mysqli_query($mysqli, "UPDATE users SET daily_counter='$bonus' WHERE id='$id'")) {
                        return "ERROR: getMatcherBonus4";
                    }
                }
            }
            return $bonus;
        } else {
            $result = mysqli_query($mysqli, "SELECT daily_counter FROM users WHERE id='$id'");
            $daily_counter = intval(implode("", mysqli_fetch_assoc($result)));
            $future_daily_counter = $daily_counter + $bonus;
            if ($future_daily_counter > DAILY_LIMIT) {
                $bonus = DAILY_LIMIT - $daily_counter;
            } else if ($future_daily_counter < (-DAILY_LIMIT)) {
                $bonus = -(DAILY_LIMIT + $daily_counter);
            }
            if ($update == true) {
                $future_daily_counter = $daily_counter + $bonus;
                if (!mysqli_query($mysqli, "UPDATE users SET daily_counter='$future_daily_counter' WHERE id='$id'")) {
                    return "ERROR: getMatcherBonus5";
                }
            }
            return $bonus;
        }
    }
}
/**
 * Function: getPoints
 * - returns points of user
 * @param $id
 * @return $points
 */
function getPoints($id)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT points FROM users WHERE id='$id'");
    $points = intval(implode("", mysqli_fetch_assoc($result)));
    return $points;
}
/**
 * Function: getPlace
 * - returns place of user
 * @param $id
 * @return $place
 */
function getPlace($id, $gender)
{
    global $mysqli;
    $result = mysqli_query($mysqli, "SELECT id FROM users WHERE gender='$gender' ORDER BY points DESC LIMIT 1000000");
    $array = [];
    while ($row = $result->fetch_row()) {
        $array[] = $row[0];
    }
    $place = 0;
    for ($i = 0; $i < count($array); $i++) {
        if ($array[$i] == $id) {
            $place = ++$i;
        }
    }
    return intval($place);
}
/**
 * Function: getReverseBonus
 * - returns a negative bonus
 * @param $bonus
 * @return $bonus
 */
function getReverseBonus($bonus)
{
    return intval($bonus) - 5;
}
function updateDailyCounter($id, $bonus)
{
    $result = mysqli_query($mysqli, "SELECT daily_counter FROM users WHERE id='$id'");
    $daily_counter = intval(implode("", mysqli_fetch_assoc($result)));
    $daily_counter = $daily_counter + $bonus;
    if (mysqli_query($mysqli, "UPDATE users SET daily_counter='$daily_counter' WHERE id='$id'")) {
        return true;
    } else {
        return false;
    }
}

function getDatabaseSize($gender, $user_id)
{
    global $mysqli;
    $query = mysqli_query($mysqli, "SELECT count(*) FROM users WHERE gender='$gender' AND id!='$user_id'");
    $database_entries = intval(implode("", mysqli_fetch_assoc($query)));
    return $database_entries;
}

mysqli_close($mysqli);
