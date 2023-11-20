import { File_Model } from "../Model/file_model";

export class Control {
    asc = "ASC";
    desc = "DESC"
    tbody = document.querySelector('#tbody_id');
    btnASC = document.querySelector("#ASCbtn");
    btnDESC = document.querySelector("#DESCbtn");
    btn = document.querySelector("#backbtn");
    callback;
    file_model;

    constructor (callback: Function, file_model: File_Model) {
        this.callback = callback;
        this.file_model = file_model;
    }

    init(
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function,
        },
        sortValue: string,
    ) {
        // Обработка нажатия кнопок сортировки 
        // По возрастанию
        this.btnASC!.addEventListener("click", () => {
            sortValue = this.asc;
            this.tbody!.innerHTML = "";
            this.file_model.getRequest(root_obj, sortValue);
        });

        // По убыванию
        this.btnDESC!.addEventListener("click", () => {
            sortValue = this.desc;
            this.tbody!.innerHTML = "";
            this.file_model.getRequest(root_obj, sortValue);
        });

        //Обработка нажатия кнопки назад 
        this.btn!.addEventListener("click", () => {
            if (root_obj.root == "/") {
                alert("Вы в корневой директории!");
            } else {
                this.tbody!.innerHTML = '';
                root_obj.remove_folder();
                this.file_model.getRequest(root_obj, sortValue);
            }
        });
    }   
}