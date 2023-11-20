// класс Loader описывает поведение прелоудера 
export class Loader {

    element_id = 'loader';
    loader = document.getElementById(this.element_id);

    show() {
        if (this.loader) {
            this.loader.style.display = 'block';
        } else {
            console.log("Элемент с id: " + this.element_id + ' не найден' );
        }
    };

    hide() {
        
        if (this.loader) {
            this.loader.style.display = 'none';
        } else {
            console.log("Элемент с id: " + this.element_id + ' не найден' );
        }
    };
}