import { File_Model } from "./Model/file_model.js";
import { Table } from "./View/table.js";
import { Control } from "./View/control.js";
import { Loader } from "./View/loader.js";

// callback(): вызывает функцию render после ответа от сервера
function callback(xhr: XMLHttpRequest, 
                  root_obj: {
                    root: string, 
                    add_folder: Function, 
                    remove_folder: Function,
                  }, 
                  sortValue: string, 
                  file_model: File_Model,
                ) {
    let responseObj = xhr.response;
    let fields = ["file_type", "name", "size"];
    let tbody = document.querySelector('#tbody_id');

    //loader_hide();

    table.render(tbody, responseObj, fields, root_obj, sortValue, file_model, callback); 
}

// Объявление начальных значений параметров
const root_dir: string = 'P:/',
      asc = 'ASC',
      desc = 'DESC';
let sortValue = desc;

// Объявление объекта, у которого свойство root
// будет меняться в зависимости от текущей директории 
let root_obj = {
    root: root_dir,
    add_folder: function(value: string) {
        root_obj.root += value;
    },
    remove_folder: function() {
        let arr = root_obj.root.split('/');
        arr.pop();
        arr.pop();
        root_obj.root = arr.join('/') + '/';
    }
};

// Элементы HTML страницы
let tbody = document.querySelector('#tbody_id');
let btnASC = document.querySelector("#ASCbtn");
let btnDESC = document.querySelector("#DESCbtn");
let btn = document.querySelector("#backbtn");

// Инициализация объектов классов
let table = new Table();
let control = new Control(btnASC, tbody, btnDESC, btn);
let loader = new Loader();
let file_model = new File_Model();


document.addEventListener('DOMContentLoaded', () => {
    table.init(root_obj, sortValue, file_model, callback);
    control.init(asc, desc, sortValue, root_obj, callback, file_model);
});
