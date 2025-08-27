package models

type SaveSessionRequest struct {
	SessionId string             `json:"sessionId"`
	Stickers  []SavedStickerData `json:"stickers"`
}

type GetSessionDataResponse struct {
	Stickers []SavedStickerData `json:"stickers"`
}
