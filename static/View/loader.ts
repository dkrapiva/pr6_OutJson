// класс Loader описывает поведение прелоудера 
export class Loader {
    // static block = 'block';
    // static none = 'none';
    // template(state: string) {
    //     let element_id = 'loader';
    //     let loader = document.getElementById(element_id);
    //     if (loader) {
    //         loader.style.display = state;
    //     } else {
    //         console.log("Элемент с id: " + element_id + 'не найден' );
    //     }
    // }
    show() {
        let element_id = 'loader';
        let loader = document.getElementById(element_id);
        if (loader) {
            loader.style.display = 'block';
        } else {
            console.log("Элемент с id: " + element_id + 'не найден' );
        }
    };

    hide() {
        let element_id = 'loader';
        let loader = document.getElementById(element_id);
        if (loader) {
            loader.style.display = 'none';
        } else {
            console.log("Элемент с id: " + element_id + 'не найден' );
        }
    };
}