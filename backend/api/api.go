package api

import (
	"net/http"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/handlers"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/go-chi/cors"
	"github.com/jackc/pgx/v5/pgxpool"
)

type APIServer struct {
	addr string
	DB   *pgxpool.Pool
}

func NewAPIServer(addr string, db *pgxpool.Pool) *APIServer {
	return &APIServer{
		addr: addr,
		DB:   db,
	}
}

func (s *APIServer) Start() error {
	r := chi.NewRouter()
	r.Use(middleware.Logger)

	r.Use(cors.Handler(cors.Options{
		AllowedOrigins:   []string{"http://localhost:3000"},
		AllowedMethods:   []string{"GET", "POST", "OPTIONS"},
		AllowedHeaders:   []string{"Accept", "Authorization", "Content-Type"},
		AllowCredentials: true,
	}))

	r.Mount("/cards", handlers.CardRoutes(s.DB))
	return http.ListenAndServe(":8080", r)
}
