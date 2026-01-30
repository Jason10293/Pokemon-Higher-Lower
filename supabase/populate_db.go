package main

import (
	"context"
	"encoding/csv"
	"fmt"
	"os"
	"strconv"

	"github.com/jackc/pgx/v5"
	"github.com/joho/godotenv"
)

type Card struct {
	ID        int
	Name      string
	CreatedAt string
	UpdatedAt string
	ImageURL  string
	Price     float64
	SetName   string
	SetID     string
}

func loadCardsFromCSV(filename string) ([]Card, error) {
	file, err := os.Open(filename)
	if err != nil {
		return nil, fmt.Errorf("failed to open file: %w", err)
	}
	defer file.Close()

	reader := csv.NewReader(file)

	// Read header row
	header, err := reader.Read()
	if err != nil {
		return nil, fmt.Errorf("failed to read header: %w", err)
	}

	// Verify header format
	expectedHeader := []string{"id", "name", "created_at", "updated_at", "image_url", "price", "set_name", "set_id"}
	if len(header) != len(expectedHeader) {
		return nil, fmt.Errorf("unexpected header format, got %d columns, expected %d", len(header), len(expectedHeader))
	}

	var cards []Card
	lineNum := 1 // Start at 1 since we already read the header

	for {
		record, err := reader.Read()
		if err != nil {
			break // EOF or error
		}
		lineNum++

		if len(record) != 8 {
			fmt.Printf("Warning: Skipping line %d - invalid column count\n", lineNum)
			continue
		}

		// Parse ID
		id, err := strconv.Atoi(record[0])
		if err != nil {
			fmt.Printf("Warning: Skipping line %d - invalid ID: %v\n", lineNum, err)
			continue
		}

		// Parse price
		price, err := strconv.ParseFloat(record[5], 64)
		if err != nil {
			fmt.Printf("Warning: Line %d - invalid price, using 0.0: %v\n", lineNum, err)
			price = 0.0
		}

		card := Card{
			ID:        id,
			Name:      record[1],
			CreatedAt: record[2],
			UpdatedAt: record[3],
			ImageURL:  record[4],
			Price:     price,
			SetName:   record[6],
			SetID:     record[7],
		}

		cards = append(cards, card)
	}

	return cards, nil
}

func insertIntoDB(ctx context.Context, card Card, conn *pgx.Conn) {
	_, err := conn.Exec(ctx,
		"INSERT INTO cards (name, set_id, set_name, image_url, price) VALUES ($1, $2, $3, $4, $5) ON CONFLICT DO NOTHING",
		card.Name, card.SetID, card.SetName, card.ImageURL, card.Price,
	)
	if err != nil {
		fmt.Printf("Error inserting card %s: %v\n", card.Name, err)
	}
}

func main() {
	if err := godotenv.Load("../frontend/.env.local"); err != nil {
		fmt.Printf("Warning: .env file not found, using environment variables\n")
	}

	ctx := context.Background()
	conn, err := pgx.Connect(ctx, os.Getenv("DATABASE_URL"))
	if err != nil {
		fmt.Printf("Error connecting to database: %v\n", err)
		return
	}
	defer conn.Close(ctx)

	fmt.Println("Loading cards from cards_rows.csv...")
	cards, err := loadCardsFromCSV("cards_rows.csv")
	if err != nil {
		fmt.Printf("Error loading CSV: %v\n", err)
		return
	}

	fmt.Printf("Found %d cards, inserting into database...\n", len(cards))

	successCount := 0
	for i, card := range cards {
		insertIntoDB(ctx, card, conn)
		successCount++

		if (i+1)%1000 == 0 {
			fmt.Printf("Processed %d/%d cards...\n", i+1, len(cards))
		}
	}

	fmt.Printf("\nDone! Successfully processed %d cards\n", successCount)
}
