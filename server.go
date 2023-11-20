package main

import (
	"encoding/json"
	"fmt"
	"html/template"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

func main() {

	http.HandleFunc("/", handlerView)
	http.HandleFunc("/dir", getJsonData)
	http.Handle("/static/", http.StripPrefix("/static", http.FileServer(http.Dir("./static/"))))

	portNumber := 8181
	fmt.Printf("Сервер запущен на порту: %d\n", portNumber)
	err := http.ListenAndServe(fmt.Sprintf(":%d", portNumber), nil)
	if err != nil {
		log.Println("Не удалось подключить localhost")
		os.Exit(1)
	}
	os.Exit(0)
}

// getJsonData(): функция, обрабатывающая запрос
// Выводит JSON на html страницу
func getJsonData(rw http.ResponseWriter, r *http.Request) {

	var paramsNames = Params{root: "root", sortValue: "sortValue"}

	rw.Header().Set("Content-Type", "application/json")
	root := r.URL.Query().Get(paramsNames.root)
	if root == "" {
		log.Println("Не задана директория")
		rw.Write([]byte("Не задана директория"))
		return
	}

	sortValue := r.URL.Query().Get(paramsNames.sortValue)
	if sortValue == "" {
		log.Println("Не задан параметр сортировки")
		rw.Write([]byte("Не задан параметр сортировки"))
		return
	}

	// Кодируем массив структур в формат JSON
	getJsonData, err := getFilesInfo(root, sortValue)
	if err != nil {
		log.Println("Не удалось получить директорию: ", root)
		rw.Write([]byte("Не удалось получить директорию"))
		return
	}

	jsonData, err := json.Marshal(getJsonData)
	if err != nil {
		log.Println("Не удалось сериализировать данные")
		rw.Write([]byte("Не удалось сериализировать данные"))
		return
	}
	_, err = rw.Write(jsonData)
	if err != nil {
		log.Println("Не удалось записать json данные")
		rw.Write([]byte("Не удалось отобразить данные"))
		return
	}
}

// handlerView(): функция, обрабатывающая запрос
// Отображает html файл с таблицей
func handlerView(rw http.ResponseWriter, r *http.Request) {
	path := filepath.Join("static", "dist", "index.html")
	tmpl, err := template.ParseFiles(path)
	if err != nil {
		log.Println("Не удалось получить код страницы из файла:", path)
		return
	}

	err = tmpl.Execute(rw, nil)
	if err != nil {
		log.Println("Не удалось сгенерировать html-разметку")
		return
	}
}
