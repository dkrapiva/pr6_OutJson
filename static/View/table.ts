import { File_Model } from "../Model/file_model";
import { Loader } from "./loader";

export class Table{
    // render(): создание и заполнение таблицы данных из директорий 
    tbody = document.querySelector('#tbody_id');
    callback;
    file_model;
    sortValue;
    constructor (callback: Function, file_model: File_Model, sortValue: string) {
        this.callback = callback;
        this.file_model = file_model;
        this.sortValue = sortValue;
    }

    fields = ["file_type", "name", "size"];

    render(
        responseObj: any, 
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function
        }, 
    ) { 
        for (let item of responseObj){
            let tr = document.createElement("tr");
            for (let field of this.fields) {
                let td = document.createElement("td");
                let folder = item['name'];  
                td.innerHTML = item[field]; 
                if (item['file_type'] == 'd') { 
                    td.addEventListener("click", () => {
                        this.tbody!.innerHTML = '';
                        root_obj.add_folder(folder + '/');
                        this.file_model.getRequest(root_obj, this.sortValue);
                    });
                }
                tr.appendChild(td);
            }
            this.tbody!.appendChild(tr);
        }
}

    init(
        root_obj: {
            root: string,
            add_folder: Function, 
            remove_folder: Function
        },  
    ) {
        this.file_model.getRequest(root_obj, this.sortValue);
    }
}
