package main

import (
	"errors"
	"fmt"
	"io/fs"
	"io/ioutil"
	"log"
	"sort"
	"sync"
)

type Params struct {
	root      string
	sortValue string
}

// Структура, хранящая тип, имя и размер файлов и директорий
type structFile struct {
	FileType string `json:"file_type"`
	Name     string `json:"name"`
	Size     string `json:"size"`
}

// Структура для реализации мьютекса
type mutexStruct struct {
	sync.Mutex
	mapFileInfo map[fs.FileInfo]int
}

func (mu *mutexStruct) set(file fs.FileInfo, value int) {
	mu.Lock()
	defer mu.Unlock()
	mu.mapFileInfo[file] = value
}

func New() *mutexStruct {
	return &mutexStruct{
		mapFileInfo: make(map[fs.FileInfo]int),
	}
}

func getFilesInfo(root string, sortValue string) ([]structFile, error) {
	// Создаем структуру с инициализированным map
	var mapDirsAndSizes = New()
	// Проверяем параметры на корректность
	if (sortValue != "ASC") && (sortValue != "DESC") {
		log.Println("Задан некорректный параметр сортировки")
		var err = errors.New("Задан некорректный параметр сортировки")
		return nil, err
	}
	files, dirErr := ioutil.ReadDir(root)
	if dirErr != nil {
		fmt.Println("Не удалось считать директорию: ", root)
		var err = errors.New("Задан некорректный параметр сортировки")
		return nil, err
	}
	var valueOfDirSizes int
	var wg sync.WaitGroup
	wg.Add(len(files))
	// Записываем информацию о файлах и директориях в map
	for _, file := range files {
		go func(file fs.FileInfo) error {
			defer wg.Done()
			if file.IsDir() {
				dirSize, err := getDirSize(root + "/" + file.Name())
				if err != nil {
					log.Println("Не удалось получить размер директории: ", root+"/"+file.Name())
					return err
				}
				valueOfDirSizes = dirSize
			} else {
				valueOfDirSizes = int(file.Size())
			}
			mapDirsAndSizes.set(file, valueOfDirSizes)
			return nil
		}(file)
	}
	wg.Wait()

	// Вызываем функцию сортировки по параметру sortValue
	keys := sortMapValues(mapDirsAndSizes.mapFileInfo, sortValue)

	// Создаем массив структур с типом, именем и размером файлов
	structofFiles := toStruct(keys, mapDirsAndSizes.mapFileInfo)

	return structofFiles, nil
}

// getDirSize(): рекурсивно вычисляет размер папок
func getDirSize(path string) (int, error) {

	totalSize := 0

	innerFiles, err := ioutil.ReadDir(path)
	if err != nil {
		fmt.Println("Не удалось считать директорию: ", path)
		return 0, err
	}

	for _, file := range innerFiles {
		if file.IsDir() {
			dirSize, err := getDirSize(path + "/" + file.Name())
			if err != nil {
				fmt.Println("Не удалось вычислить размер: ", file.Name())
				return 0, err
			}
			totalSize += dirSize
		} else {
			totalSize += int(file.Size())
		}
	}
	return totalSize, err
}

// formSize(): конвертирует размер файлов
func formSize(byteSize int) string {
	i := 0
	sizeName := [4]string{"B", "KB", "MB", "GB"}
	for byteSize >= 1024 {
		i += 1
		byteSize /= 1024
	}
	return fmt.Sprintf("%d %s", byteSize, sizeName[i])
}

// sortMapValues(): сортировка map по значениям
func sortMapValues(m map[fs.FileInfo]int, sortValue string) []fs.FileInfo {

	keys := make([]fs.FileInfo, 0, len(m))
	for key := range m {
		keys = append(keys, key)
	}
	sort.SliceStable(keys, func(i, j int) bool {
		if sortValue == "ASC" {
			return m[keys[i]] < m[keys[j]]
		} else {
			return m[keys[i]] > m[keys[j]]
		}
	})
	return keys
}

// toStruct(): возвращает массив структур с типом, именем и размером файлов
func toStruct(files []fs.FileInfo, m map[fs.FileInfo]int) []structFile {

	structofFiles := []structFile{}

	keyType := ""
	for _, k := range files {
		if k.IsDir() {
			keyType = "d"
		} else {
			keyType = "f"
		}

		oneFile := structFile{
			FileType: keyType,
			Name:     k.Name(),
			Size:     formSize(m[k]),
		}

		structofFiles = append(structofFiles, oneFile)
	}
	return structofFiles
}
