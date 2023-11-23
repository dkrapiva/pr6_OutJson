<?php
require 'connection.php';
require 'connection_data.php';
use data as d;
// Устанавливаем соединение с БД
$conn = connectionDB(d\DataConnection::$servername, d\DataConnection::$username, d\DataConnection::$password, d\DataConnection::$database);

// Парсим полученные данные
try {
$jsondata = file_get_contents("php://input");
} catch (Exception $e) {
    echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
} 

try{
    $data = json_decode($jsondata, true);
} catch(Exception $e) {
    echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
}

$root = $data['root'];
$dir_size = $data['dir_size'];
$cur_date = $data['cur_date'];
$lead_time = $data['lead_time'];

try {
$prep = $conn->prepare("INSERT INTO `timestat`(root, dir_size, cur_date, lead_time) VALUES (?, ?, ?, ?)");
} catch (Exception $e) {
    echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
}

try {
$prep->execute([$root, $dir_size, $cur_date, $lead_time]);
} catch(Exception $e) {
    echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
}

mysqli_close($conn);
?>