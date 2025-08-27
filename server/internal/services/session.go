package services

import (
	"server/internal/models"
)

type SessionService struct {
	// In a real implementation, this would have a database client
	// sessions map[string][]models.StickerData // temporary in-memory store
}

func NewSessionService() *SessionService {
	return &SessionService{
		// sessions: make(map[string][]models.StickerData),
	}
}

func (s *SessionService) SaveSession(req *models.SaveSessionRequest) error {
	// In a real implementation, this would save to the database
	// For now, just a mock implementation

	print(req.SessionId)
	println(len(req.Stickers))

	// Mock implementation - just return success
	return nil
}

func (s *SessionService) GetSession(sessionId string) (*models.GetSessionDataResponse, error) {
	// In a real implementation, this would query the database
	// For now, returning a mock response

	// stickers, exists := s.sessions[sessionId]
	// if !exists {
	// 	return &models.GetSessionDataResponse{Stickers: []models.StickerData{}}, nil
	// }

	// return &models.GetSessionDataResponse{Stickers: stickers}, nil

	// Mock response for now
	return &models.GetSessionDataResponse{
		Stickers: []models.SavedStickerData{},
	}, nil
}
