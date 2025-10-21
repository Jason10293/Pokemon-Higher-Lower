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
	if err := godotenv.Load(); err != nil {
		fmt.Println("No .env file found")
	}

	apiKey := os.Getenv("SUPABASE_API_KEY")
	apiURL := os.Getenv("SUPABASE_DB_URL")
	client := db.NewSupabaseClient(apiURL, apiKey)
	if client == nil {
		log.Fatal("Failed to create Supabase client")
	}
	fmt.Println("Supabase client successfully created")

	server := api.NewAPIServer(":8080", client)
	if err := server.Start(); err != nil {
		log.Fatal("Failed to start API server:", err)
	}
}
