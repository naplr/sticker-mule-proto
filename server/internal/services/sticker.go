package services

import (
	"errors"
	"fmt"
	"io"
	"net/http"
	"server/internal/models"
	"server/internal/utils"
	"strconv"
	"strings"

	"golang.org/x/net/html"
)

type StickerService struct{}

func NewStickerService() *StickerService {
	return &StickerService{}
}

func (s *StickerService) FetchProductInfo(url string) (models.StickerDataResponse, error) {
	resp, err := http.Get(url)
	if err != nil {
		return models.StickerDataResponse{}, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return models.StickerDataResponse{}, err
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	return s.extractProductInfo(string(body))
}

func getImgUrl(productPreview *html.Node) (string, error) {
	// Get Image
	img, err := utils.Traverse(productPreview, []utils.Path{
		{Tag: "div", Attr: "class", Val: "wrapper"},
		{Tag: "div", Attr: "class", Val: "preview"},
		{Tag: "div", Attr: "class", Val: "artwork"},
		{Tag: "img", Attr: "", Val: ""},
	})
	if err != nil {
		return "", err
	}

	imgUrl, err := utils.GetAttr(img, "src")
	if err != nil {
		return "", err
	}

	return imgUrl, nil
}

func getProductType(productPreview *html.Node) (string, error) {
	productType, err := utils.Traverse(productPreview, []utils.Path{
		{Tag: "div", Attr: "class", Val: "wrapper"},
		{Tag: "div", Attr: "class", Val: "rightColumnContent"},
		{Tag: "div", Attr: "class", Val: "subheading"},
		{Tag: "div", Attr: "class", Val: "textContent"},
	})
	if err != nil {
		return "", err
	}

	productTypeText, err := utils.GetTextContent(productType)
	if err != nil {
		return "", err
	}

	return productTypeText, nil
}

func getSize(productPreview *html.Node) (float64, float64, error) {
	size, err := utils.Traverse(productPreview, []utils.Path{
		{Tag: "div", Attr: "class", Val: "wrapper"},
		{Tag: "div", Attr: "class", Val: "rightColumnContent"},
		{Tag: "div", Attr: "class", Val: "buyingOptions"},
		{Tag: "div", Attr: "data-testid", Val: "StoreItemBuyingOptions"},
		{Tag: "div", Attr: "data-testid", Val: "profileReorderProductSizeText"},
		{Tag: "div", Attr: "class", Val: "sizeHelpContainer"},
		{Tag: "p", Attr: "class", Val: "regular"},
	})
	if err != nil {
		return 0, 0, err
	}

	sizeText, err := utils.GetTextContent(size)
	if err != nil {
		return 0, 0, err
	}

	parts := strings.FieldsFunc(sizeText, func(r rune) bool {
		return r == '×'
	})
	if len(parts) != 2 {
		return 0, 0, fmt.Errorf("unexpected size format: %s", sizeText)
	}

	clean := func(s string) string {
		return strings.TrimSpace(strings.TrimSuffix(s, "in"))
	}
	wStr := clean(parts[0])
	hStr := clean(parts[1])

	w, err := strconv.ParseFloat(wStr, 64)
	h, err2 := strconv.ParseFloat(hStr, 64)
	if err != nil || err2 != nil {
		return 0, 0, fmt.Errorf("invalid size: width error: %v, height error: %v", err, err2)
	}
	return w, h, nil
}

func (s *StickerService) extractProductInfo(htmlContent string) (models.StickerDataResponse, error) {
	doc, err := html.Parse(strings.NewReader(htmlContent))
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	var htmlNode = doc.FirstChild
	htmlNode = htmlNode.NextSibling

	productPreview, err := utils.Traverse(htmlNode, []utils.Path{
		{Tag: "body", Attr: "", Val: ""},
		{Tag: "div", Attr: "id", Val: "__next"},
		{Tag: "div", Attr: "class", Val: "layout"},
		{Tag: "div", Attr: "class", Val: "main"},
		{Tag: "main", Attr: "", Val: ""},
		{Tag: "section", Attr: "data-testid", Val: "StoreItemProductPreviewHero"},
	})
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	// Get product type
	productType, err := getProductType(productPreview)
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	if !strings.Contains(strings.ToLower(productType), "sticker") {
		return models.StickerDataResponse{}, errors.New("product is not a sticker")
	}

	// Get Image
	imgUrl, err := getImgUrl(productPreview)
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	// Get size
	w, h, err := getSize(productPreview)
	if err != nil {
		return models.StickerDataResponse{}, err
	}

	size := models.Size{Width: w, Height: h}

	return models.StickerDataResponse{
		ProductImage: imgUrl,
		Size:         size,
	}, nil
}
