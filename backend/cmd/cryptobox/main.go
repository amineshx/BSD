package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
	"strconv"

	"github.com/amineshx/BSD/internal/api"
)

func main() {
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	portNumber, err := strconv.Atoi(port)
	if err != nil || portNumber < 1 || portNumber > 65535 {
		log.Fatalf("invalid PORT %q: expected a number between 1 and 65535", port)
	}

	addr := fmt.Sprintf(":%d", portNumber)
	log.Printf("CryptoBox backend listening on %s", addr)
	if err := http.ListenAndServe(addr, api.NewRouter()); err != nil {
		log.Fatal(err)
	}
}
