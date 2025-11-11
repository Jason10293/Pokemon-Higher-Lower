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
	if err := godotenv.Load("../.env"); err != nil {
		fmt.Println("No .env file found")
	}

	supabaseApiKey := os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY")
	supabaseApiURL := os.Getenv("NEXT_PUBLIC_SUPABASE_URL")
	client := db.NewSupabaseClient(supabaseApiURL, supabaseApiKey)
	if client == nil {
		log.Fatal("Failed to create Supabase client")
	}
	fmt.Println("Supabase client successfully created")

	server := api.NewAPIServer(":8080", client)
	if err := server.Start(); err != nil {
		log.Fatal("Failed to start API server:", err)
	}

}
