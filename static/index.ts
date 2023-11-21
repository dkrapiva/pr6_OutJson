import { FileModel } from "./Model/file_model";
import { Table } from "./View/table";
import { Control } from "./View/control";


// Объявление начальных значений параметров
enum Params {
      asc = 'ASC',
      desc = 'DESC',
    }
let root_dir: string = '/';
let sortValue = Params.desc;

// Объявление объекта, у которого свойство root
// будет меняться в зависимости от текущей директории 
let rootObj = {
    root: root_dir,
    addFolder: function(value: string) {
        rootObj.root += value;
    },
    removeFolder: function() {
        let arr = rootObj.root.split('/');
        arr.pop();
        arr.pop();
        rootObj.root = arr.join('/') + '/';
    }
};

document.addEventListener('DOMContentLoaded', () => {
    // Инициализация объектов классов
    let fileModel = new FileModel();
    let table = new Table(fileModel, sortValue, rootObj);
    let control = new Control(fileModel, table); 
    table.init(rootObj);
    control.init(rootObj, sortValue);
});
