package main

import (
	"errors"
	"fmt"
	"io"
	"log"
	"log/slog"
	"net/http"
	"os"
	"path/filepath"
	"time"

	"github.com/go-chi/chi"
	"github.com/go-chi/chi/middleware"
	"github.com/go-chi/httplog/v2"
)

// version 3.0.2 20240429
// dist version 3.2 20240514

var serverPort string
var logger *httplog.Logger
var fpLog *os.File

func main() {

	conf := os.Args[1]
	Config(conf)

	var err error
	fpLog, err = os.OpenFile(configuration.LogPath, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		fmt.Println("log file open error", err)
		panic(err)
	}
	defer fpLog.Close()
	log.SetOutput(fpLog)

	//Logger
	logger = httplog.NewLogger("httplog", httplog.Options{
		LogLevel:         slog.LevelInfo,
		Concise:          true,
		MessageFieldName: "message",
		QuietDownPeriod:  10 * time.Second,
		Writer:           fpLog,
	})
	staticDir := configuration.SRC_dir

	router := chi.NewRouter()
	router.Use(httplog.RequestLogger(logger))
	router.Use(middleware.Recoverer)

	// router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
	// 	workDir, _ := os.Getwd()
	// 	filesDir := filepath.Join(workDir, staticDir)
	// 	if _, err := os.Stat(filesDir + r.URL.Path); errors.Is(err, os.ErrNotExist) {
	// 		http.ServeFile(w, r, filepath.Join(filesDir, "index.html"))
	// 	}
	// 	http.ServeFile(w, r, filesDir+r.URL.Path)
	// })
	router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		if _, err := os.Stat(staticDir + r.URL.Path); errors.Is(err, os.ErrNotExist) {
			http.ServeFile(w, r, filepath.Join(staticDir, "index.html"))
		}
		http.ServeFile(w, r, staticDir+r.URL.Path)
	})
	router.Post("/upload", uploadHandler)

	// Start server
	serverPort = configuration.ServerPort

	fmt.Printf("### Starting server listening on %v\n", serverPort)
	fmt.Printf("### Serving static content from '%v'\n", staticDir)
	//fmt.Printf("### Browse: https://localhost:3333\n")
	//http.ListenAndServe(":"+serverPort, router)
	if err := http.ListenAndServeTLS(":"+serverPort, configuration.Cert, configuration.CertKey, router); err != nil {
		fmt.Println("ListenAndServe: ", err)
	}
}

func uploadHandler(w http.ResponseWriter, r *http.Request) {
	// truncated for brevity

	// The argument to FormFile must match the name attribute
	// of the file input on the frontend
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return
	}
	//log.Printf("[fileHeader] :%v\n", fileHeader.Filename)

	defer file.Close()

	// Create the uploads folder if it doesn't
	// already exist
	// err = os.MkdirAll("/mnt/download/", os.ModePerm)
	// if err != nil {
	// 	http.Error(w, err.Error(), http.StatusInternalServerError)
	// 	return
	// }

	// Create a new file in the uploads directory
	// dst, err := os.Create(fmt.Sprintf("./dist/download/%s", filepath.Ext(fileHeader.Filename)))
	dst, err := os.Create(fmt.Sprintf("/mnt/download/%s", fileHeader.Filename))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	defer dst.Close()

	// Copy the uploaded file to the filesystem
	// at the specified destination
	_, err = io.Copy(dst, file)
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}

	fmt.Fprintf(w, "Upload successful")
}
