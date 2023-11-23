<!DOCTYPE html>
<html>
    <head>
        <link href ="style.css" type="text/css" rel = "stylesheet"> 
        <meta charset ="utf-8">
        <script src="script.js"></script>
    </head>
    <body>
        <div>
            <button type = "button" id = "back_btn">Назад</button>
        </div>
        <div class="container" >
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
                    require 'loading_data.php';
                    $data = loadingData();
                    for ($i = 0; $i < (count($data['root'])); $i++){
                        echo "<tr>";
                        echo "<td>" .$data["root"][$i]."</td>";
                        echo "<td>" .$data["size"][$i]."</td>";
                        echo "<td>" .$data["time"][$i]."</td>";
                        echo "<td>" .$data["date"][$i]."</td>";
                        echo "<tr>";
                    }
                ?>
            </tbody>
        </table>
        <script>
            document.addEventListener("DOMContentLoaded", () => {
                let graph_data = <?php echo json_encode($data);?>;
                let [size_array, time_array] = formData(graph_data.size, graph_data.time);
                console.log(size_array, time_array);
                new Chart(document.querySelector('.chart'), {
                    type: 'line',
                    fontColor: '#ffffff',
                    data: {
                        labels: size_array,
                        datasets: [{ 
                            data: time_array,
                            label:  "Зависимость времени расчета размера директории от размера директории",
                            borderColor: "#20B2AA",
                        }
                        ],
                    },
                }); 
                let back_btn = document.getElementById('back_btn');
                back_btn.addEventListener("click", () => {
                    window.location.replace("http://localhost:8181/");
                });
            });
        </script>
        <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    </body>
</html>