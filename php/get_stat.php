<!DOCTYPE html>
<html>
    <head>
        <link href ="style.css" rel = "stylesheet"> 
        <meta charset ="utf-8">
    </head>
    <body>
        <div class="container">
            <canvas class="chart"></canvas>
        </div>
        <table>
            <thead></thead>
            <tr>
                <th>Директория файла</th>
                <th>Размер директории, байт</th>
                <th>Время вычисления размера директории, с</th>
                <th>Дата</th>
            </tr>
            <tbody>
                <?php
                    $servername = "localhost";
                    $database = "statisticsdb";
                    $username = "root";
                    $password = "password";
                    // Создаем соединение
                    $conn = mysqli_connect($servername, $username, $password, $database);
                    // Проверяем соединение
                    if (!$conn) {
                        die("Connection failed: " . mysqli_connect_error());
                    }
                    $sql = "SELECT * FROM `timestat`";
                    $result = $conn->query($sql); 
                    while ($row = $result->fetch_assoc()):; 
                        echo "<tr>";
                        echo "<td>" .$row["root"]."</td>";
                        echo "<td>" .$row["dir_size"]."</td>";
                        echo "<td>" .$row["lead_time"]."</td>";
                        echo "<td>" .$row["cur_date"]."</td>";
                        echo "<tr>";
                        $time[] = $row['lead_time']; 
                        $size[] = $row['dir_size']; 
                    endwhile;
                    $graphdata = array("time" => $time, "size" => $size);
                ?>
            </tbody>
        </table>
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                var data = <?php echo json_encode($graphdata);?>;
                new Chart(document.querySelector('.chart'), {
                    type: 'line',
                    fontColor: '#000000',
                    data: {
                        labels: data.size,
                        datasets: [{ 
                            data: data.time,
                            label: "Время, мс",
                            borderColor: "#3e95cd",
                            fill: true
                        }
                        ]
                    },
                    options: {
                        title: {
                        display: true,
                        text: 'Зависимость размера директории от времени расчета ее размера'
                        }
                    }
                }); 
            });
        </script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>>
    </body>
</html>