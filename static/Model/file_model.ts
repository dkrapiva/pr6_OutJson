import { Loader } from "../View/loader";

export class FileModel{

    // getRequest(): посылает get-запрос для получения информации о директориях 
    getRequest(
        rootObj: {
            root: string, 
            addFolder: Function, 
            removeFolder: Function
        },  
        sortValue: string, 
        callback: Function
    ) {
        Loader.show();
        let xhr = new XMLHttpRequest();
        let host = window.location.href;
        let url = host + `dir?root=${rootObj.root}&sortValue=${sortValue}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
    
        xhr.onerror = () => {
            Loader.hide();
            alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`);
        }

        xhr.onload = () => {
            callback(xhr); 
        }
        xhr.send();
    }

}
