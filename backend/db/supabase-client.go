package db

import (
	"log"

	"github.com/supabase-community/supabase-go"
)

func NewSupabaseClient(API_URL, API_KEY string) *supabase.Client {
	client, err := supabase.NewClient(API_URL, API_KEY, nil)
	if err != nil {
		log.Fatal("Error starting supabase")
	}
	return client
}
