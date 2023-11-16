import { getRequest } from "./request.js";

// createTable(): создает и заполняет динамическую таблицу для загруженных данных 
export function createTable(tbody: Element | null, responseObj: any, fields: string[]) {

    for (let item of responseObj){
        let tr = document.createElement("tr");
        for (let field of fields) {
            let td = document.createElement("td");
            let folder = item['name'];  
            td.innerHTML = item[field]; 
            if (item["file_type"] == 'd') { 
                td.addEventListener("click", () => {
                    tbody!.innerHTML = '';
                    root += folder + '/';
                    getRequest(root, sortValue);
                });
            }
            tr.appendChild(td);
        }
        tbody!.appendChild(tr);
    }
}
    
// Начальные значения параметров
let sortValue = "ASC";
let root = "/";

// Вызываем обработчик события загрузки HTML
document.addEventListener('DOMContentLoaded', () => {
    getRequest(root, sortValue); 

    let tbody = document.querySelector('#tbd');
    let btnASC = document.querySelector("#ASCbtn");
    let btnDESC = document.querySelector("#DESCbtn");

    // Обработка нажатия кнопок сортировки 
    // По возрастанию
    btnASC!.addEventListener("click", () => {
        sortValue = "ASC";
        tbody!.innerHTML = "";
        getRequest(root, sortValue);
    });
    // По убыванию
    btnDESC!.addEventListener("click", () => {
        sortValue = "DESC";
        tbody!.innerHTML = "";
        getRequest(root, sortValue);
    });

    //Обработка нажатия кнопки назад 
    let btn = document.querySelector("#backbtn");
    btn!.addEventListener("click", () => {
        if (root == "/") {
            alert("Вы в корневой директории!");
        } else {
            tbody!.innerHTML = '';
            var arr = root.split('/');
            arr.pop();
            arr.pop();
            root = arr.join('/') + '/';
            getRequest(root, sortValue);
        }
    });
});


