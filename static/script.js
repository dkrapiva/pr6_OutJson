import { getRequest } from "./request.js";
// createTable(): создает и заполняет динамическую таблицу для загруженных данных 
export function createTable(tbody, responseObj, fields) {
    for (var _i = 0, responseObj_1 = responseObj; _i < responseObj_1.length; _i++) {
        var item = responseObj_1[_i];
        var tr = document.createElement("tr");
        var _loop_1 = function (field) {
            var td = document.createElement("td");
            var folder = JSON.stringify(item['Name']).replace(/"/g, '');
            td.innerHTML = JSON.stringify(item[field]).replace(/"/g, '');
            if ((JSON.stringify(item['FileType']).replace(/"/g, '')) == 'd') {
                td.addEventListener("click", function () {
                    tbody.innerHTML = '';
                    root += folder + '/';
                    getRequest(root, sortValue);
                });
            }
            tr.appendChild(td);
        };
        for (var _a = 0, fields_1 = fields; _a < fields_1.length; _a++) {
            var field = fields_1[_a];
            _loop_1(field);
        }
        tbody.appendChild(tr);
    }
}
// Начальные значения параметров
var sortValue = "ASC";
var root = "/";
// Вызываем обработчик события загрузки HTML
document.addEventListener('DOMContentLoaded', function () {
    getRequest(root, sortValue);
});
var tbody = document.querySelector('#tbd');
var btnASC = document.querySelector("#ASCbtn");
var btnDESC = document.querySelector("#DESCbtn");
// Обработка нажатия кнопок сортировки 
// По возрастанию
btnASC.addEventListener("click", function () {
    sortValue = "ASC";
    tbody.innerHTML = "";
    getRequest(root, sortValue);
});
// По убыванию
btnDESC.addEventListener("click", function () {
    sortValue = "DESC";
    tbody.innerHTML = "";
    getRequest(root, sortValue);
});
//Обработка нажатия кнопки назад 
var btn = document.querySelector("#backbtn");
btn.addEventListener("click", function () {
    if (root == "/") {
        alert("Вы в корневой директории!");
    }
    else {
        tbody.innerHTML = '';
        root = root.slice(0, -1);
        root = root.substring(0, root.lastIndexOf('/') + 1);
        getRequest(root, sortValue);
    }
});
