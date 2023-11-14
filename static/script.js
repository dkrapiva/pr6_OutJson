document.addEventListener('DOMContentLoaded', function () {
    let xhr = new XMLHttpRequest();
    let host = window.location.href;
    let url = host + '/dir?root=/home/darya/&sortValue=ASC';
    console.log(url)
    xhr.open('GET', url);

    xhr.responseType = 'json';

    xhr.onload = function () {
        if (xhr.status != 200) {
            alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`)
        } else {
            let responseObj = xhr.response;
            let fields = ["FileType", "Name", "Size"]
            let table = document.querySelector('#dirtable')
            createTable(table, responseObj, fields); 
        }
    };
    xhr.send();
});

// createTable(): создает динамическую таблицу для загруженных данных 
function createTable(table, responseObj, fields) {
    for (let i = 0; i < responseObj.length; i++){
        let tr = document.createElement("tr");
        for (let j = 0; j < 3; j++){
            let td = document.createElement("td");
            td.innerHTML = JSON.stringify(responseObj[i][fields[j]]).replace(/"/g, '');
            tr.appendChild(td);
        }
        table.appendChild(tr);
    }
}