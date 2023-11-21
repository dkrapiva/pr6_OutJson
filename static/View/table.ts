import { FileModel } from "../Model/file_model";
import { Loader } from "./loader";

type File = {
    file_type: string,
    name: string;
    format_size: string;
}
type FileListResponse = File[];

export class Table{
    // render(): создание и заполнение таблицы данных из директорий 
    tbody = document.querySelector('#tbody_id');
    rootObj;
    fileModel;
    sortValue;
    constructor (
        fileModel: FileModel, 
        sortValue: string, 
        rootObj: {
            root: string, 
            addFolder: Function, 
            removeFolder: Function
        }, 
    ){ 
        this.fileModel = fileModel;
        this.sortValue = sortValue;
        this.rootObj = rootObj;
    }

    render(responseObj: FileListResponse) { 

        for (let item of responseObj){
            let tr = document.createElement("tr");
            let fields = [item.file_type, item.name, item.format_size]
            for (let field of fields) {
                let td = document.createElement("td");
                let folder = item.name;  
                td.innerHTML = field; 
                if (item.file_type == 'd') { 
                    td.addEventListener("click", () => {
                        this.tbody!.innerHTML = '';
                        this.rootObj.addFolder(folder + '/');
                        this.fileModel.getRequest(this.rootObj, this.sortValue, this.callback);
                    });
                }
                tr.appendChild(td);
            }
            this.tbody!.appendChild(tr);
        }
    }

    // callback(): вызывает функцию render после ответа от сервера
    callback = (xhr: XMLHttpRequest) => {
        let responseObj = xhr.response;
        this.render(responseObj); 
        Loader.hide();
    }

    init(rootObj: {root: string, addFolder: Function, removeFolder: Function}) {
            this.fileModel.getRequest(rootObj, this.sortValue, this.callback);
    }
}
