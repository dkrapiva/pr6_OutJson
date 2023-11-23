import { FileModel } from "../Model/file_model";
import { Table } from "./table";

enum sortParams {
    asc = "ASC",
    desc = "DESC",
}

export class Control {

    tbody = document.querySelector('#tbody_id');
    btnASC = document.querySelector("#ASCbtn");
    btnDESC = document.querySelector("#DESCbtn");
    btn = document.querySelector("#backbtn");
    statBtn = document.querySelector('#stat');
    fileModel = new FileModel();
    table;

    constructor (table: Table) {
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
            sortValue = sortParams.asc;
            this.tbody!.innerHTML = "";
            this.fileModel.getRequest(rootObj, sortValue, this.table.callback);
        });

        // По убыванию
        this.btnDESC!.addEventListener("click", () => {
            sortValue = sortParams.desc;
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

        this.statBtn!.addEventListener("click", () => {
            window.open("http://localhost:80/get_stat.php");
        })

    }   
}