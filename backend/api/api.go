package api

import (
	"net/http"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
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
	r.Mount("/cards", handlers.CardRoutes())
	http.ListenAndServe(":3000", r)
	return nil
}
