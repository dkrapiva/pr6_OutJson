// класс Loader описывает поведение прелоудера 
export class Loader {

    static elementId = 'loader';

    static show() {
        let loader = document.getElementById(Loader.elementId);
        if (loader) {
            loader.style.display = 'block';
        } else {
            console.log("Элемент с id: " + this.elementId + ' не найден' );
        }
    };

    static hide() {
        let loader = document.getElementById(Loader.elementId);
        if (loader) {
            loader.style.display = 'none';
        } else {
            console.log("Элемент с id: " + this.elementId + ' не найден' );
        }
    };
}