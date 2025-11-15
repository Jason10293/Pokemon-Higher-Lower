package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/supabase-community/supabase-go"
)

type Card struct {
	Name       string     `json:"name"`
	Images     Images     `json:"images"`
	Set        Set        `json:"set"`
	CardMarket CardMarket `json:"cardmarket"`
}

type Set struct {
	Id   string `json:"id"`
	Name string `json:"name"`
}

type CardMarket struct {
	Prices CardMarketPrices `json:"prices"`
}

type CardMarketPrices struct {
	AverageSellPrice float32 `json:"averageSellPrice"`
}

type Images struct {
	Small string `json:"small"`
}

type Response struct {
	Data []Card `json:"data"`
}

func fetchPage(page int) ([]Card, error) {
	// Read API key from environment variable
	apiKey := os.Getenv("POKEMON_TCG_API_KEY")

	// Construct the API URL with pagination
	url := fmt.Sprintf("https://api.pokemontcg.io/v2/cards?page=%d&pageSize=250", page)

	// Create a new HTTP request
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	// Set the API key in the request header
	req.Header.Set("X-Api-Key", apiKey)

	// Perform the HTTP request
	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	// Check for non-200 status codes
	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API request failed with status code %d", resp.StatusCode)
	}

	// Decode the JSON response
	var response Response
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	return response.Data, nil
}

func ReadFromFile(filePath string) {
	var reponse Response
	var cards []Card
	data, err := os.ReadFile("output.json")
	if err != nil {
		fmt.Printf("Error reading file: %v\n", err)
		return
	}

	err = json.Unmarshal(data, &reponse)
	if err != nil {
		fmt.Printf("Error unmarshaling JSON: %v\n", err)
		return
	}
	cards = reponse.Data
	for _, card := range cards {
		fmt.Printf("Name: %s\n", card.Name)
		fmt.Printf("Set Id: %s\n", card.Set.Id)
		fmt.Printf("Set Name: %s\n", card.Set.Name)
		fmt.Printf("Image URL: %s\n", card.Images.Small)
		fmt.Printf("Average Sell Price: $%.2f\n", card.CardMarket.Prices.AverageSellPrice)
		fmt.Println("-----")
	}
}

func insertIntoDB(card Card, client *supabase.Client) {
	_, _, err := client.From("cards").Insert(map[string]interface{}{
		"name":      card.Name,
		"set_id":    card.Set.Id,
		"set_name":  card.Set.Name,
		"image_url": card.Images.Small,
		"price":     card.CardMarket.Prices.AverageSellPrice,
	}, false, "", "", "").Execute()
	if err != nil {
		fmt.Printf("Error inserting card %s into database: %v\n", card.Name, err)
	} else {
		fmt.Printf("Successfully inserted card %s into database\n", card.Name)
	}
}
func main() {
	if err := godotenv.Load("../.env"); err != nil {
		fmt.Printf("Error loading .env file: %v\n", err)
		return
	}
	client, err := supabase.NewClient(
		os.Getenv("NEXT_PUBLIC_SUPABASE_URL"),
		os.Getenv("NEXT_PUBLIC_SUPABASE_ANON_KEY"),
		nil,
	)
	if err != nil {
		fmt.Printf("Error creating Supabase client: %v\n", err)
		return
	}

	for page := 1; page <= 85; page++ {
		fmt.Printf("Processing page %d\n", page)
		cards, err := fetchPage(page)
		if err != nil {
			fmt.Printf("Error fetching page %d: %v\n", page, err)
			return
		}
		for _, card := range cards {
			insertIntoDB(card, client)
		}
	}

}
