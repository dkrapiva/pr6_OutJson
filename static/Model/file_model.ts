export class File_Model{

    // getRequest(): посылает get-запрос для получения информации о директориях 
    getRequest(
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function
        },  
        sortValue: string, 
        callback: Function, 
        file_model: File_Model,
    ) {
        //loader_show();
        let xhr = new XMLHttpRequest();
        let host = window.location.href;
        let url = host + `dir?root=${root_obj.root}&sortValue=${sortValue}`;
        xhr.open('GET', url);
        xhr.responseType = 'json';
    
        xhr.onerror = function (){
            //loader_hide();
            alert(`Сервер не отвечает ${xhr.status}: ${xhr.statusText}`);
        }

        xhr.onload = () => callback(xhr, root_obj, sortValue, file_model);

        xhr.send();
    }

}