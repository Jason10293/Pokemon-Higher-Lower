package api

import (
	"net/http"
	"net/http/httptest"
	"testing"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/cors"
)

func TestCORSHeaders(t *testing.T) {
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	r.Mount("/cards", handlers.CardRoutes(nil))

	req := httptest.NewRequest(http.MethodGet, "/cards/randomCard", nil)
	req.Header.Set("Origin", "http://localhost:3000")
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Header().Get("Access-Control-Allow-Origin") == "" {
		t.Fatalf("expected CORS header to be set")
	}
}

func TestCORSPreflight(t *testing.T) {
	r := chi.NewRouter()
	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))
	r.Mount("/cards", handlers.CardRoutes(nil))

	req := httptest.NewRequest(http.MethodOptions, "/cards/randomCard", nil)
	req.Header.Set("Origin", "http://localhost:3000")
	req.Header.Set("Access-Control-Request-Method", "GET")
	rec := httptest.NewRecorder()

	r.ServeHTTP(rec, req)

	if rec.Code != http.StatusOK {
		t.Fatalf("expected %d, got %d", http.StatusOK, rec.Code)
	}
	if rec.Header().Get("Access-Control-Allow-Origin") == "" {
		t.Fatalf("expected CORS header to be set")
	}
}
