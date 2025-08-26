package main

import (
	"fmt"
	"io"
	"net/http"
	"strconv"
	"strings"

	"server/internal/utils"

	"golang.org/x/net/html"
)

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
	println(sizeText)

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

func Foo(url string) {
	resp, err := http.Get(url)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		println("Error:", err.Error())
		return
	}

	doc, err := html.Parse(strings.NewReader(string(body)))
	if err != nil {
		println("Error:", err.Error())
		return
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
		println("Error:", err.Error())
		return
	}

	// Get Image
	imgUrl, err := getImgUrl(productPreview)
	if err != nil {
		println("Error:", err.Error())
		return
	}
	println(imgUrl)

	// Get product type
	productType, err := getProductType(productPreview)
	if err != nil {
		println("Error:", err.Error())
		return
	}
	println(productType)

	// Get size
	w, h, err := getSize(productPreview)
	if err != nil {
		println("Error:", err.Error())
		return
	}
	println("Width:", w, "Height:", h)
}

func main() {
	// var url = "https://www.stickermule.com/zamaxdesign/item/12572771?origin=PUBLIC_PROFILE"
	var url = "https://www.stickermule.com/stimulus/item/14880828?origin=PUBLIC_PROFILE"
	Foo(url)
}
