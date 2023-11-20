import { File_Model } from "../Model/file_model";
import { Loader } from "./loader";

export class Table{
    // render(): создание и заполнение таблицы данных из директорий 
    render(
        tbody: Element | null, 
        responseObj: any, 
        fields: string[], 
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function
        }, 
        sortValue: string,
        file_model: File_Model,
        callback: Function,
    ) { 
        for (let item of responseObj){
            let tr = document.createElement("tr");
            for (let field of fields) {
                let td = document.createElement("td");
                let folder = item['name'];  
                td.innerHTML = item[field]; 
                if (item['file_type'] == 'd') { 
                    td.addEventListener("click", () => {
                        tbody!.innerHTML = '';
                        root_obj.add_folder(folder + '/');
                        file_model.getRequest(root_obj, sortValue, callback, file_model);
                    });
                }
                tr.appendChild(td);
            }
            tbody!.appendChild(tr);
        }
}

    init(
        root_obj: {
            root: string,
            add_folder: Function, 
            remove_folder: Function
        },  
        sortValue: string, 
        file_model: File_Model, 
        callback: Function,
    ) {
        file_model.getRequest(root_obj, sortValue, callback, file_model);
    }
}
