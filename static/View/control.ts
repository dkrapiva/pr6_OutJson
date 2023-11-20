import { FileModel } from "../Model/file_model";
import { Table } from "./table";

export class Control {
    asc = "ASC";
    desc = "DESC"
    tbody = document.querySelector('#tbody_id');
    btnASC = document.querySelector("#ASCbtn");
    btnDESC = document.querySelector("#DESCbtn");
    btn = document.querySelector("#backbtn");
    fileModel;
    table;

    constructor (fileModel: FileModel, table: Table) {
        this.fileModel = fileModel;
        this.table = table;
    }

    init(
        rootObj: {
            root: string, 
            addFolder: Function, 
            removeFolder: Function,
        },
        sortValue: string,
    ) {
        // Обработка нажатия кнопок сортировки 
        // По возрастанию
        this.btnASC!.addEventListener("click", () => {
            sortValue = this.asc;
            this.tbody!.innerHTML = "";
            this.fileModel.getRequest(rootObj, sortValue, this.table.callback);
        });

        // По убыванию
        this.btnDESC!.addEventListener("click", () => {
            sortValue = this.desc;
            this.tbody!.innerHTML = "";
            this.fileModel.getRequest(rootObj, sortValue, this.table.callback);
        });

        //Обработка нажатия кнопки назад 
        this.btn!.addEventListener("click", () => {
            if (rootObj.root == "/") {
                alert("Вы в корневой директории!");
            } else {
                this.tbody!.innerHTML = '';
                rootObj.removeFolder();
                this.fileModel.getRequest(rootObj, sortValue, this.table.callback);
            }
        });
    }   
}