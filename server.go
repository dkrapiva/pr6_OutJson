package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"
)

func main() {

	http.HandleFunc("/dir", filesView)

	err := http.ListenAndServe(":8181", nil)
	if err != nil {
		fmt.Println("Не удалось подключить localhost")
		os.Exit(1)
	}
	os.Exit(0)
}

//filesView(): функция, обрабатывающая запрос
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
