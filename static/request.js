import { createTable } from "./script.js";
// getRequest(): посылает get-запрос для получения информации о директориях 
export function getRequest(root, sortValue) {
    var xhr = new XMLHttpRequest();
    var host = window.location.href;
    var url = host + "dir?root=".concat(root, "&sortValue=").concat(sortValue);
    xhr.open('GET', url);
    xhr.responseType = 'json';
    xhr.onerror = function () {
        alert("\u0421\u0435\u0440\u0432\u0435\u0440 \u043D\u0435 \u043E\u0442\u0432\u0435\u0447\u0430\u0435\u0442 ".concat(xhr.status, ": ").concat(xhr.statusText));
    };
    xhr.onload = function () {
        callback(xhr);
    };
    xhr.send();
}
// callback(): вызывает функцию createTable после ответа от сервера
function callback(xhr) {
    var responseObj = xhr.response;
    var fields = ["file_type", "name", "size"];
    var tbody = document.querySelector('#tbd');
    createTable(tbody, responseObj, fields);
}
