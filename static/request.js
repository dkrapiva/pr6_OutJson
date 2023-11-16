// getRequest(): посылает get-запрос для получения информации о директориях 
function getRequest(root) {
    let xhr = new XMLHttpRequest();
    let host = window.location.href;
    let url = host + `dir?root=${root}&sortValue=${sortValue}`;
    xhr.open('GET', url);
    xhr.responseType = 'json';

    xhr.onerror = function (){
        alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`);
    }

    xhr.onload = function () {
        callback(xhr);
    };

    xhr.send();
}

// callback(): вызывает функцию createTable после ответа от сервера
function callback(xhr) {
    let responseObj = xhr.response;
    let fields = ["FileType", "Name", "Size"];
    let tbody = document.querySelector('#tbd');
    createTable(tbody, responseObj, fields); 
}