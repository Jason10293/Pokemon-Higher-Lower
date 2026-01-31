package handlers

import (
	"context"
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type CardHandler struct {
	db *pgxpool.Pool
}

func NewCardHandler(db *pgxpool.Pool) *CardHandler {
	return &CardHandler{db: db}
}

// GetRandomCard returns a single random card from the cards table.
func (h *CardHandler) GetRandomCard(w http.ResponseWriter, r *http.Request) {
	if h.db == nil {
		http.Error(w, "database not configured", http.StatusInternalServerError)
		return
	}

	var count int
	err := h.db.QueryRow(context.Background(), "SELECT COUNT(*) FROM cards").Scan(&count)
	if err != nil {
		log.Printf("failed to get cards count: %v", err)
		http.Error(w, "failed to query database", http.StatusInternalServerError)
		return
	}
	if count <= 0 {
		http.Error(w, "no cards available", http.StatusNotFound)
		return
	}

	rand.Seed(time.Now().UnixNano())
	offset := rand.Intn(count)

	var id int
	var name, imageURL string
	var setName *string
	var price float64

	err = h.db.QueryRow(context.Background(),
		"SELECT id, name, image_url, set_name, price FROM cards OFFSET $1 LIMIT 1",
		offset,
	).Scan(&id, &name, &imageURL, &setName, &price)
	if err != nil {
		log.Printf("failed to fetch random card: %v", err)
		http.Error(w, "failed to query database", http.StatusInternalServerError)
		return
	}

	setNameVal := ""
	if setName != nil {
		setNameVal = *setName
	}

	out := struct {
		Id           int     `json:"id"`
		Name         string  `json:"name"`
		AveragePrice float64 `json:"averagePrice"`
		Image        string  `json:"image"`
		SetName      string  `json:"setName"`
	}{
		Id:           id,
		Name:         name,
		AveragePrice: price,
		Image:        imageURL,
		SetName:      setNameVal,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(out); err != nil {
		log.Printf("encoding random card response: %v", err)
		http.Error(w, "failed to encode data", http.StatusInternalServerError)
	}
}

func CardRoutes(db *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()
	cardHandler := NewCardHandler(db)
	r.Get("/randomCard", cardHandler.GetRandomCard)
	return r
}
