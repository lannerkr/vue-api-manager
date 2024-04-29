package main

import (
	"bufio"
	"encoding/json"
	"fmt"
	"os"
)

type Configuration struct {
	ServerPort string
	API_url    string
	Cert       string
	CertKey    string
	IPaccess   []string
	LogPath    string
	Vue_env    string
	SRC_dir    string
}

var configuration Configuration

func Config(conf string) (cert, certkey string) {
	file, _ := os.Open(conf)
	defer file.Close()
	decoder := json.NewDecoder(file)
	configuration = Configuration{}
	err := decoder.Decode(&configuration)
	if err != nil {
		fmt.Println("error:", err)
	}

	modifyVueEnv()

	fmt.Println(configuration)

	return configuration.Cert, configuration.CertKey
}

func modifyVueEnv() {
	file, err := os.OpenFile(configuration.Vue_env, os.O_CREATE|os.O_WRONLY|os.O_APPEND, 0666)
	if err != nil {
		panic(err)
	}
	defer file.Close()

	file.Truncate(0)

	writer := bufio.NewWriter(file)
	contents := "const config = (() => { return {\"VUE_CONFIG_APP_API\": \"" + configuration.API_url + "\"}})();"
	if _, err := fmt.Fprintln(writer, contents); err != nil {
		panic(err)
	}
	if err := writer.Flush(); err != nil {
		panic(err)
	}

	// reader := bufio.NewReader(file)
	// for {
	// 	line, isPrefix, err := reader.ReadLine()
	// 	if isPrefix || err != nil {
	// 		break
	// 	}
	// 	fmt.Println(line)
	// }
}
