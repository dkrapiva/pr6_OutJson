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
	http.HandleFunc("/dir", getJsonData)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))

	err := http.ListenAndServe(":8181", nil)
	if err != nil {
		fmt.Println("Не удалось подключить localhost")
		os.Exit(1)
	}

	os.Exit(0)
}

//getJsonData(): функция, обрабатывающая запрос
// Выводит JSON на html страницу
func getJsonData(rw http.ResponseWriter, r *http.Request) {

	var getJsonDataErr, writeJsonDataErr Response

	rw.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get("root")
	sortValue := r.URL.Query().Get("sortValue")

	// Кодируем массив структур в формат JSON
	getJsonDataErr.Data = getFilesInfo(root, sortValue)
	jsonData, err := json.Marshal(getJsonDataErr.Data)
	if err != nil {
		getJsonDataErr.Status = 1
		getJsonDataErr.ErrorText = "Не удалось преобразовать структуру в json"
		getJsonDataErr.Data = nil
		return
	}
	_, err = rw.Write(jsonData)
	if err != nil {
		writeJsonDataErr.Status = 1
		writeJsonDataErr.ErrorText = "Не удалось записать json данные"
		return
	}
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
