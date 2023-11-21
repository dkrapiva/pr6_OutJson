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

const (
	desc = "DESC"
	asc  = "ASC"
)

func getFilesInfo(root string, sortValue string) ([]File, error) {
	// Создаем структуру с инициализированным map
	var mapDirsAndSizes = New()
	// Проверяем параметры на корректность
	if (sortValue != asc) && (sortValue != desc) {
		log.Println("Задан некорректный параметр сортировки")
		var err = errors.New("Задан некорректный параметр сортировки")
		return nil, err
	}
	files, dirErr := ioutil.ReadDir(root)
	if dirErr != nil {
		fmt.Println("Не удалось считать директорию: ", root)
		var err = errors.New("Не удалось считать директорию")
		return nil, err
	}
	var valueOfDirSizes int
	var wg sync.WaitGroup
	wg.Add(len(files))
	// Записываем информацию о файлах и директориях в map
	for _, file := range files {
		go func(file fs.FileInfo, wg *sync.WaitGroup) error {
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
		}(file, &wg)
	}
	wg.Wait()

	// Вызываем функцию сортировки по параметру sortValue
	keys := sortMapValues(mapDirsAndSizes.mapFileInfo, sortValue)

	// Создаем массив структур с типом, именем и размером файлов
	filesList := toStruct(keys, mapDirsAndSizes.mapFileInfo)

	return filesList, nil
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
		if sortValue == asc {
			return m[keys[i]] < m[keys[j]]
		} else {
			return m[keys[i]] > m[keys[j]]
		}
	})
	return keys
}

// toStruct(): возвращает массив структур с типом, именем и размером файлов
func toStruct(files []fs.FileInfo, m map[fs.FileInfo]int) []File {

	filesList := []File{}

	keyType := ""
	for _, k := range files {
		if k.IsDir() {
			keyType = "d"
		} else {
			keyType = "f"
		}

		oneFile := File{
			FileType:   keyType,
			Name:       k.Name(),
			FormatSize: formSize(m[k]),
			Size:       m[k],
		}

		filesList = append(filesList, oneFile)
	}
	return filesList
}
