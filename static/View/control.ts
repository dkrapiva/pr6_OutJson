import { File_Model } from "../Model/file_model";
import { Loader } from "./loader";

export class Control {
    btnASC;
    tbody;
    btnDESC;
    btn;

    constructor (
                btnASC: Element | null,
                tbody: Element | null,
                btnDESC: Element | null,
                btn: Element | null
                ) {
                    this.btnASC = btnASC;
                    this.tbody = tbody;
                    this.btnDESC = btnDESC;
                    this.btn = btn;
                }

    init(
        asc: string,
        desc: string,
        sortValue: string, 
        root_obj: {
            root: string, 
            add_folder: Function, 
            remove_folder: Function,
        }, 
        callback: Function, 
        file_model: File_Model,
    ) {
        // Обработка нажатия кнопок сортировки 
        // По возрастанию
        this.btnASC!.addEventListener("click", () => {
            sortValue = asc;
            this.tbody!.innerHTML = "";
            file_model.getRequest(root_obj, sortValue, callback, file_model);
        });

        // По убыванию
        this.btnDESC!.addEventListener("click", () => {
            sortValue = desc;
            this.tbody!.innerHTML = "";
            file_model.getRequest(root_obj, sortValue, callback, file_model);
        });

        //Обработка нажатия кнопки назад 
        this.btn!.addEventListener("click", () => {
            if (root_obj.root == "/") {
                alert("Вы в корневой директории!");
            } else {
                this.tbody!.innerHTML = '';
                root_obj.remove_folder();
                file_model.getRequest(root_obj, sortValue, callback, file_model);
            }
        });
    }   
}