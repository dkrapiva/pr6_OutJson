document.addEventListener('DOMContentLoaded', function () {
    let xhr = new XMLHttpRequest();
    xhr.open('GET', 'http://localhost:8181/dir?root=/home/darya/&sortValue=ASC');
    xhr.responseType = 'json';
    xhr.send();
    xhr.onload = function () {
        let responseObj = xhr.response;
        console.log(JSON.stringify(responseObj));
    };
});