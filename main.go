package main

import (
	"errors"
	"fmt"
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
