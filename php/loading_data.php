<?php
require 'connection.php';
require 'connection_data.php';
use data as d;
// Устанавливаем соединение с БД
function loadingData(){
    $conn = connectionDB(d\DataConnection::$servername, d\DataConnection::$username, d\DataConnection::$password, d\DataConnection::$database);

    $sql = "SELECT root, dir_size, lead_time, cur_date FROM `timestat` ORDER BY cur_date DESC";
    try {
    $result = $conn->query($sql); 
    } catch (Exception $e) {
        echo 'Выброшено исключение: ',  $e->getMessage(), "\n";
    }
    while ($row = $result->fetch_assoc()) {
        $root[] = $row["root"];
        $size[] = $row["dir_size"];
        $time[] = $row["lead_time"];
        $date[] = $row["cur_date"];
    }
    $stat_data = array("root" => $root, "size" => $size, "time" => $time, "date" => $date);
    return $stat_data;
}
?>
