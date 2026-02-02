package handlers

import (
	"encoding/json"
	"net/http"
	"strconv"
	"time"

	"github.com/go-chi/chi/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type LeaderboardHandler struct {
	db *pgxpool.Pool
}
type ScoreRequest struct {
	Score int `json:"score"`
}

func NewLeaderboardHandler(db *pgxpool.Pool) *LeaderboardHandler {
	return &LeaderboardHandler{db: db}
}

type LeaderboardEntry struct {
	Rank        int       `json:"rank"`
	UserId      string    `json:"userId"`
	DisplayName string    `json:"displayName"`
	AvatarUrl   string    `json:"avatarUrl"`
	Score       int       `json:"score"`
	AchievedAt  time.Time `json:"achievedAt"`
}

type userScoreResponse struct {
	UserId string `json:"userId"`
	Score  int    `json:"score"`
}
type UserPosition struct {
	Rank  int `json:"rank"`
	Score int `json:"score"`
}
type LeaderboardResponse struct {
	LeaderboardEntries []LeaderboardEntry `json:"leaderboard"`
	TotalEntries       int                `json:"total"`
	UserPosition       UserPosition       `json:"userPosition"`
}

func (h *LeaderboardHandler) PostUserScore(w http.ResponseWriter, r *http.Request) {
	var req ScoreRequest
	if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
		http.Error(w, "invalid request body", http.StatusBadRequest)
		return
	}
	userScore := req.Score
	if userScore < 0 {
		http.Error(w, "score must be non-negative", http.StatusBadRequest)
		return
	}

	sessionToken := getSessionToken(r)
	if sessionToken == "" {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var userID string
	err := h.db.QueryRow(r.Context(),
		`SELECT id FROM users WHERE id = (
			SELECT user_id FROM sessions WHERE session_token = $1
		)`,
		sessionToken,
	).Scan(&userID)
	if err != nil {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	var currentHighScore int
	err = h.db.QueryRow(r.Context(),
		"SELECT high_score FROM leaderboard WHERE user_id = $1",
		userID,
	).Scan(&currentHighScore)

	newHighScore := false
	if err != nil || userScore > currentHighScore {
		_, err = h.db.Exec(r.Context(),
			`INSERT INTO leaderboard (user_id, high_score)
			 VALUES ($1, $2)
			 ON CONFLICT (user_id) DO UPDATE SET high_score = EXCLUDED.high_score`,
			userID, userScore,
		)
		if err != nil {
			http.Error(w, "failed to update score", http.StatusInternalServerError)
			return
		}
		newHighScore = true
	}

	resp := map[string]bool{"newHighScore": newHighScore}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}

func (h *LeaderboardHandler) getTotalEntries(r *http.Request) (int, error) {
	var count int
	err := h.db.QueryRow(r.Context(), `SELECT COUNT(*) FROM leaderboard`).Scan(&count)
	return count, err
}

func (h *LeaderboardHandler) getUserPosition(r *http.Request) (UserPosition, error) {
	var userPosition UserPosition
	sessionToken := getSessionToken(r)

	if sessionToken == "" {
		return userPosition, nil
	}

	var authenticatedUserID string
	query := `SELECT user_id FROM sessions WHERE session_token = $1`
	err := h.db.QueryRow(r.Context(), query, sessionToken).Scan(&authenticatedUserID)

	if err != nil {
		return userPosition, err
	}

	var userRank, userScore int
	query = `
		SELECT
			(SELECT COUNT(*) + 1 FROM leaderboard WHERE high_score > l.high_score) as rank,
			l.high_score
		FROM leaderboard l
		WHERE l.user_id = $1
	`
	err = h.db.QueryRow(r.Context(), query, authenticatedUserID).Scan(&userRank, &userScore)

	if err != nil {
		return userPosition, err
	}

	userPosition = UserPosition{
		Rank:  userRank,
		Score: userScore,
	}

	return userPosition, nil
}

func (h *LeaderboardHandler) fetchLeaderboardRows(r *http.Request, limit, offset int) ([]LeaderboardEntry, error) {
	query := `SELECT
		ROW_NUMBER() OVER (ORDER BY l.high_score DESC) as rank,
		u.id,
		u.display_name,
		u.avatar_url,
		l.high_score,
		l.updated_at
		FROM users u
		JOIN leaderboard l ON u.id = l.user_id
		ORDER BY l.high_score DESC
		LIMIT $1 OFFSET $2`

	rows, err := h.db.Query(r.Context(), query, limit, offset)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var leaderboard []LeaderboardEntry
	for rows.Next() {
		var entry LeaderboardEntry
		var updatedAt time.Time
		err := rows.Scan(
			&entry.Rank,
			&entry.UserId,
			&entry.DisplayName,
			&entry.AvatarUrl,
			&entry.Score,
			&updatedAt,
		)
		if err != nil {
			return nil, err
		}
		entry.AchievedAt = updatedAt
		leaderboard = append(leaderboard, entry)
	}

	return leaderboard, nil
}

func parsePaginationParams(r *http.Request) (page, limit, offset int) {
	page, err := strconv.Atoi(r.URL.Query().Get("page"))
	if err != nil || page < 1 {
		page = 1
	}
	limit, err = strconv.Atoi(r.URL.Query().Get("limit"))
	if err != nil || limit < 1 {
		limit = 10
	}
	offset = (page - 1) * limit
	return page, limit, offset
}
func (h *LeaderboardHandler) GetLeaderboard(w http.ResponseWriter, r *http.Request) {
	_, limit, offset := parsePaginationParams(r)

	leaderboard, err := h.fetchLeaderboardRows(r, limit, offset)
	if err != nil {
		http.Error(w, "failed to fetch leaderboard", http.StatusInternalServerError)
		return
	}

	count, err := h.getTotalEntries(r)
	if err != nil {
		http.Error(w, "failed to get total entries", http.StatusInternalServerError)
		return
	}

	userPosition, err := h.getUserPosition(r)
	if err != nil {
		http.Error(w, "failed to get user position", http.StatusInternalServerError)
		return
	}

	response := LeaderboardResponse{
		LeaderboardEntries: leaderboard,
		TotalEntries:       count,
		UserPosition:       userPosition,
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)

	if err := json.NewEncoder(w).Encode(response); err != nil {
		http.Error(w, "Error encoding response", http.StatusInternalServerError)
		return
	}
}
func (h *LeaderboardHandler) GetUserScore(w http.ResponseWriter, r *http.Request) {
	userId := r.URL.Query().Get("userId")
	if userId == "" {
		http.Error(w, "invalid userId parameter", http.StatusBadRequest)
		return
	}

	var score int
	query := `SELECT high_score FROM leaderboard WHERE user_id = $1`
	err := h.db.QueryRow(r.Context(), query, userId).Scan(&score)
	if err != nil {
		http.Error(w, "failed to fetch user score", http.StatusInternalServerError)
		return
	}

	resp := userScoreResponse{
		UserId: userId,
		Score:  score,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(resp)
}
func getSessionToken(r *http.Request) string {
	cookie, err := r.Cookie("session_token")
	if err != nil {
		return ""
	}
	return cookie.Value
}

func LeaderboardRoutes(db *pgxpool.Pool) chi.Router {
	r := chi.NewRouter()
	LeaderboardHandler := NewLeaderboardHandler(db)
	r.Post("/user/score", LeaderboardHandler.PostUserScore)
	r.Get("/leaderboard", LeaderboardHandler.GetLeaderboard)
	return r
}
