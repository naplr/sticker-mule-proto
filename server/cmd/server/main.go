package main

import (
	"fmt"
	"log"
	"net/http"

	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/services"
)

func main() {
	// Initialize services
	stickerService := services.NewStickerService()

	// Initialize handlers
	stickerHandler := handlers.NewStickerHandler(stickerService)

	// Setup routes
	http.HandleFunc("/process-sticker-url", middleware.CORS(stickerHandler.ProcessStickerURL))

	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", port)

	log.Fatal(http.ListenAndServe(port, nil))
}
