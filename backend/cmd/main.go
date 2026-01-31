package main

import (
	"fmt"
	"log"
	"os"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/api"
	"github.com/Jason10293/Pokemon-Higher-Lower/backend/db"
	"github.com/joho/godotenv"
)

func main() {
	if err := godotenv.Load("../backend/.env"); err != nil {
		fmt.Println("No .env file found at main")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		log.Fatal("DATABASE_URL environment variable is required")
	}

	pool, err := db.NewPostgresPool(databaseURL)
	if err != nil {
		log.Fatal("Failed to connect to database:", err)
	}
	defer pool.Close()
	fmt.Println("PostgreSQL connection established")

	server := api.NewAPIServer(":8080", pool)
	if err := server.Start(); err != nil {
		log.Fatal("Failed to start API server:", err)
	}
}
