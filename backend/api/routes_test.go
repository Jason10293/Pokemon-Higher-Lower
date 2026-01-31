package api

import (
	"fmt"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/db"
	"github.com/Jason10293/Pokemon-Higher-Lower/backend/handlers"
	"github.com/joho/godotenv"
)

func TestGetRandomCardRoute(t *testing.T) {

	req := httptest.NewRequest(http.MethodGet, "/randomCard", nil)
	w := httptest.NewRecorder()

	if err := godotenv.Load("../../backend/.env"); err != nil {
		fmt.Println("No .env file found")
	}

	databaseURL := os.Getenv("DATABASE_URL")
	if databaseURL == "" {
		t.Skip("DATABASE_URL not set, skipping integration test")
	}

	pool, err := db.NewPostgresPool(databaseURL)
	if err != nil {
		t.Fatalf("failed to connect to database: %v", err)
	}
	defer pool.Close()

	handler := handlers.NewCardHandler(pool)

	handler.GetRandomCard(w, req)

	res := w.Result()
	defer res.Body.Close()

}

func TestRoutes_MethodNotAllowed(t *testing.T) {
	router := handlers.CardRoutes(nil)

	req := httptest.NewRequest(http.MethodPost, "/randomCard", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusMethodNotAllowed {
		t.Fatalf("expected status 405: method not allowed, got %d instead: ", w.Code)
	}
}

func TestRoutes_NotFound(t *testing.T) {
	router := handlers.CardRoutes(nil)

	req := httptest.NewRequest(http.MethodPost, "/doesNotExist", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusNotFound {
		t.Fatalf("expected status 404: not found, got %d instead: ", w.Code)
	}
}

func TestRoutes_RandomCardWired(t *testing.T) {
	router := handlers.CardRoutes(nil)

	req := httptest.NewRequest(http.MethodGet, "/randomCard", nil)
	w := httptest.NewRecorder()

	router.ServeHTTP(w, req)

	if w.Code != http.StatusInternalServerError {
		t.Fatalf("expected status 500: internal service error, got %d instead: ", w.Code)
	}
}
