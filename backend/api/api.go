package api

import (
	"log"
	"net/http"

	"github.com/gorilla/mux"
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
	router := mux.NewRouter()
	// subrouter := router.PathPrefix("/api/v1").Subrouter()

	log.Println("Starting API server on", s.addr)
	return http.ListenAndServe(s.addr, router)
}
