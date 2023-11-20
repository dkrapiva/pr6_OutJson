import { Loader } from "../View/loader";
export class File_Model{
    
    loader: Loader;
    callback;
    constructor (callback: Function, loader: Loader) {
        this.callback = callback;
        this.loader = loader;
    }
    // getRequest(): посылает get-запрос для получения информации о директориях 
    getRequest(
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function
        },  
        sortValue: string, 
    ) {
        this.loader.show();
        let xhr = new XMLHttpRequest();
        let host = window.location.href;
        let url = host + `dir?root=${root_obj.root}&sortValue=${sortValue}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
    
        xhr.onerror = () => {
            this.loader.hide();
            alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`);
        }

        xhr.onload = () => this.callback(xhr, root_obj, sortValue);

        xhr.send();
    }

}
