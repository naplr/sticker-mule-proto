package handlers

import (
	"encoding/json"
	"net/http"
	"net/url"
	"regexp"

	"server/internal/models"
	"server/internal/services"
)

type StickerHandler struct {
	stickerService *services.StickerService
}

func NewStickerHandler(stickerService *services.StickerService) *StickerHandler {
	return &StickerHandler{
		stickerService: stickerService,
	}
}

func validateStickerMuleURL(urlStr string) bool {
	parsedURL, err := url.Parse(urlStr)
	if err != nil {
		return false
	}

	if parsedURL.Host != "www.stickermule.com" || parsedURL.Scheme != "https" {
		return false
	}

	pattern := regexp.MustCompile(`^/[^/]+/item/\d+$`)
	return pattern.MatchString(parsedURL.Path)
}

func (h *StickerHandler) ProcessStickerURL(w http.ResponseWriter, req *http.Request) {
	if req.Method != http.MethodPost {
		http.Error(w, "Method not allowed", http.StatusMethodNotAllowed)
		return
	}

	var dat models.StickerURLRequest
	if err := json.NewDecoder(req.Body).Decode(&dat); err != nil {
		http.Error(w, "Invalid JSON request", http.StatusBadRequest)
		return
	}

	if !validateStickerMuleURL(dat.URL) {
		http.Error(w, "Invalid Sticker Mule URL format", http.StatusBadRequest)
		return
	}

	stickerData, err := h.stickerService.FetchProductInfo(dat.URL)
	if err != nil {
		http.Error(w, "Failed to fetch or parse product information", http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	json.NewEncoder(w).Encode(stickerData)
}
