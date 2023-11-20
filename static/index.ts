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
                ) {
    let responseObj = xhr.response;
    table.render(responseObj, root_obj); 

    loader.hide();
}

// Объявление начальных значений параметров
const root_dir: string = '/',
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

// Инициализация объектов классов
let loader = new Loader();
let file_model = new File_Model(callback, loader);
let table = new Table(callback, file_model, sortValue);
let control = new Control(callback, file_model); 

document.addEventListener('DOMContentLoaded', () => {
    table.init(root_obj);
    control.init(root_obj, sortValue);
});
