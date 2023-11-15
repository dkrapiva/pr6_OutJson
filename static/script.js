// getRequest(): посылает get-запрос для получения информации о директориях 
function getRequest(root) {
    let xhr = new XMLHttpRequest();
    let host = window.location.href;
    let url = host + `dir?root=${root}&sortValue=${sortValue}`;
    xhr.open('GET', url);

    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`);
        } else {
            let responseObj = xhr.response;
            let fields = ["FileType", "Name", "Size"];
            let tbody = document.querySelector('#tbd');
            createTable(tbody, responseObj, fields); 
        }
    };
    xhr.send();
}


// createTable(): создает и заполняет динамическую таблицу для загруженных данных 
function createTable(tbody, responseObj, fields) {
    for (let i = 0; i < responseObj.length; i++){
        let tr = document.createElement("tr");
        for (let j = 0; j < 3; j++){
            let td = document.createElement("td");
            let folder = JSON.stringify(responseObj[i][fields[1]]).replace(/"/g, '');
            td.innerHTML = JSON.stringify(responseObj[i][fields[j]]).replace(/"/g, '');
            if ((JSON.stringify(responseObj[i][fields[0]]).replace(/"/g, '')) == 'd') {
                td.addEventListener("click", () => {
                    tbody.innerHTML = '';
                    root += folder + '/';
                    //console.log(root);
                    getRequest(root);
                });
            }
            tr.appendChild(td);
        }
        tbody.appendChild(tr);
    }

}

let sortValue = "ASC";
let root = "/";
document.addEventListener('DOMContentLoaded', getRequest(root));

let tbody = document.querySelector('#tbd');
let btnASC = document.querySelector("#ASCbtn");
let btnDESC = document.querySelector("#DESCbtn");
btnASC.addEventListener("click", () => {
    sortValue = "ASC";
    tbody.innerHTML = "";
    getRequest(root);
});

btnDESC.addEventListener("click", () => {
    sortValue = "DESC";
    tbody.innerHTML = "";
    getRequest(root);
});

let btn = document.querySelector("#backbtn");
btn.addEventListener("click", () => {
    if (root == "/") {
        alert("Вы в корневой директории!");
    } else {
        tbody.innerHTML = '';
        root = root.slice(0, -1);
        root = root.substring(0, root.lastIndexOf('/') + 1);
        console.log(root);
        getRequest(root);
    }
});