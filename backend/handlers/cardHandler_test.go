package handlers

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"os"
	"testing"

	"github.com/Jason10293/Pokemon-Higher-Lower/backend/db"
	"github.com/Jason10293/Pokemon-Higher-Lower/backend/types"
	"github.com/joho/godotenv"
	"github.com/qri-io/jsonschema"
)

func TestCardHandler(t *testing.T) {

	req := httptest.NewRequest(http.MethodGet, "/randomCard", nil)
	w := httptest.NewRecorder()

	if err := godotenv.Load("../../.env"); err != nil {
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

	handler := NewCardHandler(pool)

	handler.GetRandomCard(w, req)

	res := w.Result()
	defer res.Body.Close()

	if res.StatusCode != http.StatusOK {
		t.Fatalf("expected status code 200 got %d instead", res.StatusCode)
	}

	if ct := res.Header.Get("Content-Type"); ct != "application/json" {
		t.Fatalf("expected content type application/json, got %s instead", ct)
	}

	body, err := io.ReadAll(res.Body)
	if err != nil {
		t.Fatal(err)
	}

	var schemaData = []byte(`{
		"properties":{
			"id": { "type": "integer" },
			"name": { "type": "string" },
			"averagePrice": { "type": "number" },
			"image": { "type": "string" },
			"setName": { "type": "string" }
		},
		"required": ["id", "name", "averagePrice", "image", "setName"]
	}`)

	rs := &jsonschema.Schema{}
	if err := json.Unmarshal(schemaData, rs); err != nil {
		t.Fatalf("error unmarshalling data: %v", err)
	}

	errs, err := rs.ValidateBytes(context.Background(), body)
	if err != nil {
		t.Fatalf("validation failed: %v", err)
	}

	if len(errs) > 0 {
		for _, e := range errs {
			t.Errorf("schema error: %s", e)
		}
	}

	var card types.Card
	if err := json.Unmarshal(body, &card); err != nil {
		t.Fatalf("error decoding response json: %v", err)
	}
}
