package main

import (
	"context"
	"encoding/json"
	"fmt"
	"net/http"
	"os"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
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
	apiKey := os.Getenv("POKEMON_TCG_API_KEY")

	url := fmt.Sprintf("https://api.pokemontcg.io/v2/cards?page=%d&pageSize=250", page)

	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		return nil, err
	}

	req.Header.Set("X-Api-Key", apiKey)

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != 200 {
		return nil, fmt.Errorf("API request failed with status code %d", resp.StatusCode)
	}

	var response Response
	err = json.NewDecoder(resp.Body).Decode(&response)
	if err != nil {
		return nil, err
	}

	return response.Data, nil
}

func insertIntoDB(ctx context.Context, card Card, conn *pgx.Conn) {
	_, err := conn.Exec(ctx,
		"INSERT INTO cards (name, set_id, set_name, image_url, price) VALUES ($1, $2, $3, $4, $5)",
		card.Name, card.Set.Id, card.Set.Name, card.Images.Small, card.CardMarket.Prices.AverageSellPrice,
	)
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

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Printf("Error connecting to database: %v\n", err)
		return
	}
	defer conn.Close(ctx)

	for page := 1; page <= 85; page++ {
		fmt.Printf("Processing page %d\n", page)
		cards, err := fetchPage(page)
		if err != nil {
			fmt.Printf("Error fetching page %d: %v\n", page, err)
			return
		}
		for _, card := range cards {
			insertIntoDB(ctx, card, conn)
		}
	}
}
