package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"net/http"
	"os"
	"path/filepath"
)

func main() {

	http.HandleFunc("/", handlerView)
	http.HandleFunc("/dir", filesView)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))

	err := http.ListenAndServe(":8181", nil)
	if err != nil {
		fmt.Println("Не удалось подключить localhost")
		os.Exit(1)
	}

	os.Exit(0)
}

//filesView(): функция, обрабатывающая запрос
// Выводит JSON на html страницу
func filesView(rw http.ResponseWriter, r *http.Request) {

	rw.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sortValue := r.URL.Query().Get("sortValue")

	// Кодируем массив структур в формат JSON
	json_data, err := json.Marshal(getFileInfo(root, sortValue))
	if err != nil {
		fmt.Println("Не удалось преобразовать структуру в json")
		os.Exit(6)
	}
	rw.Write(json_data)
}

//hadlerView(): функция, обрабатывающая запрос
// Отображает html файл с таблицей
func handlerView(rw http.ResponseWriter, r *http.Request) {
	path := filepath.Join("static", "DirView.html")
	tmpl, err := template.ParseFiles(path)
	if err != nil {
		fmt.Println("Не удалось получить код страницы из файла:", path)
		return
	}

	err = tmpl.Execute(rw, nil)
	if err != nil {
		fmt.Println("Не удалось сгенерировать html-разметку")
		return
	}
}
