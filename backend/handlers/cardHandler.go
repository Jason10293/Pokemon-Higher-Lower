package handlers

import (
	"encoding/json"
	"log"
	"math/rand"
	"net/http"
	"time"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/types"
	"github.com/go-chi/chi/v5"
	"github.com/supabase-community/supabase-go"
)

type CardHandler struct {
	db *supabase.Client
}

func NewCardHandler(db *supabase.Client) *CardHandler {
	return &CardHandler{db: db}
}

// GetRandomCard returns a single random card from the Supabase "cards" table.
func (h *CardHandler) GetRandomCard(w http.ResponseWriter, r *http.Request) {
	if h.db == nil {
		http.Error(w, "database not configured", http.StatusInternalServerError)
		return
	}

	// Use a HEAD request with count to retrieve total rows efficiently
	// Capture the raw bytes too for debugging — some clients return empty
	// body for HEAD but may include useful headers for count.
	bsCount, count, err := h.db.From("cards").
		Select("id", "exact", true).
		Execute()
	if err != nil {
		log.Printf("failed to get cards count: %v", err)
		http.Error(w, "failed to query database", http.StatusInternalServerError)
		return
	}
	// Debug: log the raw response and count so we can see what's returned
	if len(bsCount) > 0 {
		log.Printf("raw count response: %s", string(bsCount))
	}
	if count <= 0 {
		http.Error(w, "no cards available", http.StatusNotFound)
		return
	}

	rand.Seed(time.Now().UnixNano())
	offset := rand.Intn(int(count))

	// Fetch exactly one row at the random offset
	bs, _, err := h.db.From("cards").
		Select("*", "", false).
		Range(offset, offset, "").
		Execute()
	if err != nil {
		log.Printf("failed to fetch random card: %v", err)
		http.Error(w, "failed to query database", http.StatusInternalServerError)
		return
	}

	var rows []types.Card
	if err := json.Unmarshal(bs, &rows); err != nil {
		log.Printf("failed to decode random card: %v", err)
		http.Error(w, "failed to decode data", http.StatusInternalServerError)
		return
	}
	if len(rows) == 0 {
		http.Error(w, "no card found", http.StatusNotFound)
		return
	}

	// Shape the response similar to FetchCardById
	out := struct {
		Id           int     `json:"id"`
		Name         string  `json:"name"`
		AveragePrice float64 `json:"averagePrice"`
		Image        string  `json:"image"`
		SetName      string  `json:"setName"`
	}{
		Id:           rows[0].Id,
		Name:         rows[0].Name,
		AveragePrice: rows[0].Price,
		Image:        rows[0].ImageURL,
		SetName:      rows[0].SetName,
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(out); err != nil {
		log.Printf("error encoding random card response: %v", err)
		http.Error(w, "failed to encode data", http.StatusInternalServerError)
		return
	}
}

func CardRoutes(db *supabase.Client) chi.Router {
	r := chi.NewRouter()
	cardHandler := NewCardHandler(db)
	r.Get("/randomCard", cardHandler.GetRandomCard)
	return r
}
