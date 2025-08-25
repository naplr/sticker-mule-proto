package models

type StickerURLRequest struct {
	URL string `json:"url"`
}

type Size struct {
	Width  float64 `json:"width"`
	Height float64 `json:"height"`
}

type StickerDataResponse struct {
	ProductImage string `json:"productImage"`
	Size         Size   `json:"size"`
}
