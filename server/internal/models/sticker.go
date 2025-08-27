package models

type StickerURLRequest struct {
	URL string `json:"url"`
}

type Size struct {
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type Position struct {
	X float64 `json:"x"`
	Y float64 `json:"y"`
}

type StickerDataResponse struct {
	ProductImage string `json:"productImage"`
	Size         Size   `json:"size"`
}

type SavedStickerData struct {
	StickerId string   `json:"stickerId"`
	URL       string   `json:"url"`
	Size      Size     `json:"size"`
	Position  Position `json:"position"`
}
