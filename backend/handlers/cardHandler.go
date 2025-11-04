package handlers

import (
	"encoding/json"
	"net/http"
	"os"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/types"
	"github.com/go-chi/chi/v5"
	"github.com/joho/godotenv"
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
	err := godotenv.Load()
	if err != nil {
		http.Error(w, "failed to load env variables", http.StatusInternalServerError)
		return
	}
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

	var data types.CardResponse
	if err := json.NewDecoder(resp.Body).Decode(&data); err != nil {
		http.Error(w, "failed to decode data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	if err := json.NewEncoder(w).Encode(data); err != nil {
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
