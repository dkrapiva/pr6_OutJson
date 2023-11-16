package main

import (
	"fmt"
	"io/fs"
	"io/ioutil"
	"sort"
	"sync"
)

// Структура, хранящая тип, имя и размер файлов и директорий
type structFile struct {
	FileType string
	Name     string
	Size     string
}

// Структура для обработки ошибок
type Response struct {
	Status    int64
	ErrorText string
	Data      interface{}
}

func getFilesInfo(root string, sortValue string) []structFile {
	// Создаем и инициализируем map файлов и их размеров
	mapDirsAndSizes := make(map[fs.FileInfo]int)

	// Проверяем параметры на корректность
	if (sortValue != "ASC") && (sortValue != "DESC") {
		fmt.Println("Задан некорректный параметр сортировки")
		return nil
	}
	files, dirErr := ioutil.ReadDir(root)
	if dirErr != nil {
		fmt.Println("Не удалось считать директорию: ", root)
		return nil
	}
	var valueOfDirSizes int
	var mutex sync.Mutex
	var wg sync.WaitGroup
	wg.Add(len(files))
	// Записываем информацию о файлах и директориях в map
	for _, file := range files {
		go func(file fs.FileInfo, mutex *sync.Mutex) error {
			defer wg.Done()
			if file.IsDir() {
				dirSize, err := getDirSize(root + "/" + file.Name())
				if err != nil {
					fmt.Println("Не удалось получить размер директории: ", root+"/"+file.Name())
					return err
				}
				valueOfDirSizes = dirSize
			} else {
				valueOfDirSizes = int(file.Size())
			}
			mutex.Lock()
			mapDirsAndSizes[file] = valueOfDirSizes
			mutex.Unlock()
			return nil
		}(file, &mutex)
	}
	wg.Wait()

	// Вызываем функцию сортировки по параметру sortValue
	keys := sortMapValues(mapDirsAndSizes, sortValue)

	// Создаем массив структур с типом, именем и размером файлов
	structofFiles := toStruct(keys, mapDirsAndSizes)

	return structofFiles
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
