package handlers

import (
	"encoding/json"
	"net/http"

	"server/internal/models"
	"server/internal/services"
)

type SessionHandler struct {
	sessionService *services.SessionService
}

func NewSessionHandler(sessionService *services.SessionService) *SessionHandler {
	return &SessionHandler{
		sessionService: sessionService,
	}
}

func (h *SessionHandler) SaveSession(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var dat models.SaveSessionRequest
	if err := json.NewDecoder(req.Body).Decode(&dat); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	// Call sessionService saveSession with context
	if err := h.sessionService.SaveSession(req.Context(), &dat); err != nil {
		http.Error(w, "Failed to save session data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(map[string]string{"status": "success"})
}

func (h *SessionHandler) GetSession(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodGet {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	// Extract sessionId from URL parameters
	sessionId := req.URL.Query().Get("sessionId")
	if sessionId == "" {
		http.Error(w, "sessionId parameter is required", http.StatusBadRequest)
		return
	}

	// Call sessionService getSession with context
	sessionData, err := h.sessionService.GetSession(req.Context(), sessionId)
	if err != nil {
		http.Error(w, "Failed to fetch session data", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(sessionData)
}
