package services

import (
	"context"
	"server/internal/db"
	"server/internal/models"
)

type SessionService struct {
	dbClient *db.Client
}

func NewSessionService(dbClient *db.Client) *SessionService {
	return &SessionService{
		dbClient: dbClient,
	}
}

func (s *SessionService) SaveSession(ctx context.Context, req *models.SaveSessionRequest) error {
	return s.dbClient.SaveSession(ctx, req)
}

func (s *SessionService) GetSession(ctx context.Context, sessionId string) (*models.GetSessionDataResponse, error) {
	return s.dbClient.GetSession(ctx, sessionId)
}
