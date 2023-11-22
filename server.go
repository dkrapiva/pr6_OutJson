package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io/ioutil"
	"log"
	"net/http"
	"os"
	"path/filepath"
	"time"
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
	var jsonData = Response{Status: 0, ErrorText: "", Data: nil}
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

	// Инициализация структуры для статистики
	var dirStat = DirsStat{
		LeadTime: 0,
		DirSize:  0,
		CurDate:  "",
		Root:     "",
	}

	start := time.Now()
	// Кодируем массив структур в формат JSON
	jsonDataList, err := getFilesInfo(root, sortValue)
	if err != nil {
		log.Println("Не удалось получить директорию: ", root)
		rw.Write([]byte("Не удалось получить директорию"))
		return
	}

	// Вычисляем статистику для БД
	dirStat.LeadTime = time.Since(start).Seconds()
	dirStat.Root = root
	dirStat.CurDate = start.Format("2006.01.02 15:04:05")
	for _, file := range jsonDataList {
		dirStat.DirSize += file.Size
	}
	postRequest(dirStat)

	jsonData.Data, err = json.Marshal(jsonDataList)
	if err != nil {
		log.Println("Не удалось сериализировать данные")
		jsonData.ErrorText = "Не удалось сериализировать данные"
		jsonData.Status = 1
		jsonData.Data = nil
		rw.Write([]byte(jsonData.ErrorText))
		return
	}

	_, err = rw.Write(jsonData.Data)
	if err != nil {
		jsonData.ErrorText = "Не удалось записать json данные"
		jsonData.Status = 2
		jsonData.Data = nil
		rw.Write([]byte(jsonData.ErrorText))
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

func postRequest(dirStat DirsStat) error {
	bytesRep, err := json.Marshal(dirStat)
	if err != nil {
		log.Println("Не удалось сериализовать данные")
		return err
	}
	req, err := http.NewRequest("POST", "http://localhost:80/set_stat.php", bytes.NewBuffer(bytesRep))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("Не удалось отправить запрос")
		return err
	}
	defer resp.Body.Close()

	fmt.Println("Статус запроса: ", resp.Status)
	body, _ := ioutil.ReadAll(resp.Body)
	fmt.Println("Ответ от php: ", string(body))
	return nil
}
