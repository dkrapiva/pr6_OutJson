package main

import (
	"io/fs"
	"sync"
)

// Структура для параметров
type Params struct {
	root      string
	sortValue string
}

// Структура, хранящая тип, имя и размер файлов и директорий
type File struct {
	FileType string `json:"file_type"`
	Name     string `json:"name"`
	Size     string `json:"size"`
}

// Структура для реализации мьютекса
type MutexStruct struct {
	sync.Mutex
	mapFileInfo map[fs.FileInfo]int
}

func (mu *MutexStruct) set(file fs.FileInfo, value int) {
	mu.Lock()
	defer mu.Unlock()
	mu.mapFileInfo[file] = value
}

func New() *MutexStruct {
	return &MutexStruct{
		mapFileInfo: make(map[fs.FileInfo]int),
	}
}
