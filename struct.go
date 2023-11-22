package main

import (
	"io/fs"
	"sync"
)

// Структура для отправки статистики
type DirsStat struct {
	LeadTime float64 `json:"lead_time"`
	DirSize  int     `json:"dir_size"`
	CurDate  string  `json:"cur_date"`
	Root     string  `json:"root"`
}

// Структура для получения Json данных
type Response struct {
	Status    int
	ErrorText string
	Data      []byte
}

// Структура для параметров
type Params struct {
	root      string
	sortValue string
}

// Структура, хранящая тип, имя и размер файлов и директорий
type File struct {
	FileType   string `json:"file_type"`
	Name       string `json:"name"`
	FormatSize string `json:"format_size"`
	Size       int    `json:"-"`
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
