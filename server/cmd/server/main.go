package main

import (
	"context"
	"fmt"
	"log"
	"net/http"

	"server/internal/db"
	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/services"

	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load(); err != nil {
		log.Printf("Warning: .env file not found: %v", err)
	}

	ctx := context.Background()

	// Initialize database
	dbConfig := db.NewConfig()
	dbClient, err := db.NewClient(ctx, dbConfig)
	if err != nil {
		log.Printf("Failed to connect to database: %v", err)
		log.Println("Continuing without database connection...")
		dbClient = nil
	} else {
		defer dbClient.Close()

		// Initialize database schema
		if err := dbClient.InitializeDatabase(ctx); err != nil {
			log.Printf("Failed to initialize database: %v", err)
		} else {
			log.Println("Database initialized successfully")
		}
	}

	stickerService := services.NewStickerService()
	stickerHandler := handlers.NewStickerHandler(stickerService)

	sessionService := services.NewSessionService()
	sessionHandler := handlers.NewSessionHandler(sessionService)

	http.HandleFunc("/process-sticker-url", middleware.CORS(stickerHandler.ProcessStickerURL))
	http.HandleFunc("/save-session", middleware.CORS(sessionHandler.SaveSession))
	http.HandleFunc("/get-session", middleware.CORS(sessionHandler.GetSession))

	port := ":8080"
	fmt.Printf("Server starting on http://localhost%s\n", port)

	log.Fatal(http.ListenAndServe(port, nil))
}
