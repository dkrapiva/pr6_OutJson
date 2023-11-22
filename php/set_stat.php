<?php
$servername = "localhost";
$database = "statisticsdb";
$username = "root";
$password = "password";
// Создаем соединение
$conn = mysqli_connect($servername, $username, $password, $database);
// Проверяем соединение
if (!$conn) {
    die("Соединение не установлено");
}
echo "Соединение установлено\n";

$jsondata = file_get_contents("php://input");
if (!empty($jsondata)) {
    echo "Данные получены\n: ";
    echo var_dump($jsondata);
} else {
    echo "Данные не получены\n";
}

$data = json_decode($jsondata, true);

$root = $data['root'];
$dir_size = $data['dir_size'];
$cur_date = $data['cur_date'];
$lead_time = $data['lead_time'];


$prep = $conn->prepare("INSERT INTO `timestat`(root, dir_size, cur_date, lead_time) VALUES (?, ?, ?, ?)");
if(!$prep) {
    echo "Не удалось подготовить запрос на запись";
}
$prep->execute([$root, $dir_size, $cur_date, $lead_time]);

mysqli_close($conn);
?>

