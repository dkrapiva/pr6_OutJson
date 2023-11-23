<?php
function connectionDB($servername, $username, $password, $database) {
    try {
    $conn = mysqli_connect($servername, $username, $password, $database);
    } catch(Exception $e) {
        echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
    } 
    return $conn;
}
?>