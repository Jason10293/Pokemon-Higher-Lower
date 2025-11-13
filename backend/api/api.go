package api

import (
	"net/http"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/supabase-community/supabase-go"
)

type APIServer struct {
	addr string
	DB   *supabase.Client
}

func NewAPIServer(addr string, dbClient *supabase.Client) *APIServer {
	return &APIServer{
		addr: addr,
		DB:   dbClient,
	}
}

func (s *APIServer) Start() error {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"}, // your Next.js dev server
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

    r.Mount("/cards", handlers.CardRoutes(s.DB))
    return http.ListenAndServe(":8080", r)
}
