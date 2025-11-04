package handlers

import (
	"encoding/json"
	"io"
	"log"
	"net/http"
	"os"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/types"
	"github.com/go-chi/chi/v5"
)

type CardHandler struct {
	card types.CardResponse
}

func NewCardHandler(card types.CardResponse) *CardHandler {
	return &CardHandler{
		card: card,
	}
}

func (h *CardHandler) FetchCardById(w http.ResponseWriter, r *http.Request) {
	pokemonTCGApiKey := os.Getenv("POKEMON_TCG_API_KEY")
	id := chi.URLParam(r, "id")
	url := "https://api.pokemontcg.io/v2/cards/" + id
	client := &http.Client{}
	req, err := http.NewRequest("GET", url, nil)
	if err != nil {
		http.Error(w, "failed to create request", http.StatusInternalServerError)
		return
	}
	req.Header.Set("X-Api-Key", pokemonTCGApiKey)

	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "failed to fetch data", http.StatusInternalServerError)
		return
	}

	defer resp.Body.Close()

	// If the upstream API did not return 200, forward the status and body for easier debugging
	if resp.StatusCode != http.StatusOK {
		body, _ := io.ReadAll(resp.Body)
		log.Printf("Upstream error for card %s: status=%d body=%s", id, resp.StatusCode, string(body))
		http.Error(w, http.StatusText(http.StatusBadGateway), http.StatusBadGateway)
		return
	}

	var data types.CardResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		http.Error(w, "failed to decode data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	// Shape the response to what the frontend expects
	type cardOut struct {
		Name         string  `json:"name"`
		AveragePrice float64 `json:"averagePrice"`
		Image        string  `json:"image"`
	}
	out := cardOut{
		Name:  data.Data.Name,
		Image: data.Data.Images.Small,
	}
	// Best-effort extraction of price; default to 0 if missing
	out.AveragePrice = data.Data.TCGPlayer.Prices.Holofoil.Mid

	if err := json.NewEncoder(w).Encode(out); err != nil {
		log.Printf("Error encoding response for card %s: %v", id, err)
		http.Error(w, "failed to encode data", http.StatusInternalServerError)
		return
	}
}
func CardRoutes() chi.Router {
	r := chi.NewRouter()
	CardHandler := NewCardHandler(types.CardResponse{})
	r.Get("/fetch/{id}", CardHandler.FetchCardById)
	return r
}
