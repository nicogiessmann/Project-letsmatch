<?php

include 'hybridauth-master/src/autoload.php';
use Hybridauth\Hybridauth;

$provider = $_GET["provider"];
$lang = $_GET["lang"];

$config = [
    'callback' => 'http://192.168.64.2/matchme.com/profile/sociallogin.php'.'?provider='.$provider."&lang=".$lang,

    //Providers specifics
    'providers' => [
        'Twitter' => [ 
            'enabled' => true,
            'keys' => [ 
                'key'    => '...',
                'secret' => '...' 
            ]
        ],
        'Facebook' => [
        'enabled' => true,
         'keys' => [
          'id'  => '192632391298365',
           'secret' => '81cd4e7c084ea04f06c37db72c7aef90'
         ],
         'display' => 'popup'

        ],
        'Instagram' => [
        'enabled' => true,
         'keys' => [
          'id'  => '33268cabe5f8451c9b8cf51dd1b28182',
           'secret' => '0b9aab209b9c44c7ac5dea82632bae1e'
         ]

        ],
        'Google' => [
          'enabled' => true,
          'keys' => [
            'id' => '869688833080-oiqkqbv8c5f13ohnk80tj8983bn28ut6.apps.googleusercontent.com',
            'secret' => 'o-iws-eHCb2zDmhgDZu6cZ-c'
          ]
        ]
]
];


try{
    $hybridauth = new Hybridauth($config);
    $adapter = $hybridauth->authenticate($provider); 
    $isConnected = $adapter->isConnected();
    $userProfile = $adapter->getUserProfile();

    utf8_decode_profile($userProfile);
    //printProfile($userProfile);
    $adapter->disconnect();

    $database_host = "localhost";
    $database_name = "matchmedb";
    $database_user = "admin";
    $database_pass = "jr5j0HzcbJX2bMaq";

    $mysqli = mysqli_connect($database_host, $database_user, $database_pass, $database_name);

    if ($mysqli == false) {
        die("Connection failed: " . mysqli_connect_error() . ";");
    }

    if($provider=="Facebook"){
      $provider = "facebook";
    }
    else if($provider=="Twitter"){
      $provider = "twitter";
    }
    else if($provider=="Google"){
      $provider = "google";
    }
    else if($provider=="Instagram"){
      $provider = "instagram";
    }

    $sql = "SELECT count(*) FROM ".$provider." WHERE identifier=".$userProfile->identifier;

    $result = mysqli_query($mysqli, $sql);
    if($result!=false)$result = implode("", mysqli_fetch_assoc($result));

    if($result==0){
      $sql = "INSERT INTO ".$provider." (id, identifier, profileURL, webSiteURL, photoURL, displayName, description, firstName, lastName, gender, language, age, birthDay, birthYear, email, emailVerified, phone, address, country, region, city, zip) VALUES ('', '$userProfile->identifier', '$userProfile->profileURL', '$userProfile->webSiteURL', '$userProfile->photoURL', '$userProfile->displayName', '$userProfile->description', '$userProfile->firstName', '$userProfile->lastName', '$userProfile->gender', '$userProfile->language', '$userProfile->age', '$userProfile->birthDay', '$userProfile->birthYear', '$userProfile->email', '$userProfile->emailVerified', '$userProfile->phone', '$userProfile->address', '$userProfile->country', '$userProfile->region', '$userProfile->city', '$userProfile->zip')";

      if ($mysqli->query($sql) === TRUE) {
          echo "New record created successfully";

          //Weiterleitung zu Register mit Parametern
          $params = "?lang=".$lang."&firstName=".$userProfile->firstName."&lastName=".$userProfile->lastName."&email=".$userProfile->email."&sociallink=".$provider."&socialidentifier=".$userProfile->identifier;

          $url = "http://192.168.64.2/matchme.com/profile/register/register.html".$params;

          header('Location: '.utf8_encode($url));

      } else {
          echo "Error: " . $sql . "<br>" . $mysqli->error;
      }
    }
    else{
      echo "Entry already exists!";

      $sql = "SELECT nutzername FROM users WHERE sociallink='$provider' AND socialidentifier='$userProfile->identifier'";
      $result = $mysqli->query($sql);
      if($result->num_rows > 0){
         $result = implode("", mysqli_fetch_assoc($result));
         $nutzername = $result;
         $sql = "SELECT passwort FROM users WHERE sociallink='$provider' AND socialidentifier='$userProfile->identifier'";
         $result = mysqli_query($mysqli, $sql);
         $result = implode("", mysqli_fetch_assoc($result));
         $password = $result;
         
         setcookie("c_temp_user", $nutzername, time() + (86400*5), "/");
         setcookie("c_temp_password", $password, time() + (86400*5), "/");
         setcookie("c_session_user", $nutzername, 0, "/");
         setcookie("c_session_password", $password, 0, "/");

         header('Location: '."http://192.168.64.2/matchme.com/profile/profile/profile.html?lang=".$lang);
      }
      else{
        $sql = "DELETE FROM $provider WHERE identifier='$userProfile->identifier'";
        if($mysqli->query($sql) === TRUE){
          echo "Record deleted successfully";
        }
        else{
          echo "Error deleting record: ".$mysqli->error;
        }
      }
    }


    
}
catch(\Exception $e){
    echo $e->getMessage();
}

 mysqli_close($mysqli);



function printProfile($profile){
  echo "identifier: ".$profile->identifier."<br>";
  echo "profileURL: ".$profile->profileURL."<br>";
  echo "webSiteURL: ".$profile->webSiteURL."<br>";
  echo "photoURL: ".$profile->photoURL."<br>";
  echo "displayName: ".$profile->displayName."<br>";
  echo "description: ".$profile->description."<br>";
  echo "firstName: ".$profile->firstName."<br>";
  echo "lastName: ".$profile->lastName."<br>";
  echo "gender: ".$profile->gender."<br>";
  echo "language: ".$profile->language."<br>";
  echo "age: ".$profile->age."<br>";
  echo "birthDay: ".$profile->birthDay."<br>";
  echo "birthYear: ".$profile->birthYear."<br>";
  echo "email: ".$profile->email."<br>";
  echo "emailVerified: ".$profile->emailVerified."<br>";
  echo "phone: ".$profile->phone."<br>";
  echo "address: ".$profile->address."<br>";
  echo "country: ".$profile->country."<br>";
  echo "region: ".$profile->region."<br>";
  echo "city: ".$profile->city."<br>";
  echo "zip: ".$profile->zip."<br>";
}

function utf8_decode_profile($profile){
  $profile->identifier = utf8_decode($profile->identifier);
  $profile->profileURL = utf8_decode($profile->profileURL);
  $profile->webSiteURL = utf8_decode($profile->webSiteURL);
  $profile->photoURL = utf8_decode($profile->photoURL);
  $profile->displayName = utf8_decode($profile->displayName);
  $profile->description = utf8_decode($profile->description);
  $profile->firstName = utf8_decode($profile->firstName);
  $profile->lastName = utf8_decode($profile->lastName);
  $profile->gender = utf8_decode($profile->gender);
  $profile->language = utf8_decode($profile->language);
  $profile->age = utf8_decode($profile->age);
  $profile->birthDay = utf8_decode($profile->birthDay);
  $profile->birthYear = utf8_decode($profile->birthYear);
  $profile->email = utf8_decode($profile->email);
  $profile->emailVerified = utf8_decode($profile->emailVerified);
  $profile->phone = utf8_decode($profile->phone);
  $profile->address = utf8_decode($profile->address);
  $profile->country = utf8_decode($profile->country);
  $profile->region = utf8_decode($profile->region);
  $profile->city = utf8_decode($profile->city);
  $profile->zip = utf8_decode($profile->zip);
}

?>