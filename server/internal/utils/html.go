package utils

import (
	"errors"
	"strings"

	"golang.org/x/net/html"
)

type Path struct {
	Tag  string
	Attr string
	Val  string
}

func BFS(n *html.Node, tag string, targetAttribute string, targetValue string) (*html.Node, error) {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.ElementNode && c.Data == tag {
			if targetAttribute == "" {
				return c, nil
			}

			for _, attr := range c.Attr {
				if attr.Key == targetAttribute && strings.Contains(attr.Val, targetValue) {
					return c, nil
				}
			}
		}
	}
	return nil, errors.New("node not found")
}

func Traverse(n *html.Node, paths []Path) (*html.Node, error) {
	c := n
	var err error

	for _, p := range paths {
		c, err = BFS(c, p.Tag, p.Attr, p.Val)
		if err != nil {
			return nil, err
		}
	}

	return c, nil
}

func GetAttr(n *html.Node, targetAttr string) (string, error) {
	for _, attr := range n.Attr {
		if attr.Key == targetAttr {
			return attr.Val, nil
		}
	}
	return "", errors.New("attribute not found")
}

func GetTextContent(n *html.Node) (string, error) {
	for c := n.FirstChild; c != nil; c = c.NextSibling {
		if c.Type == html.TextNode {
			return c.Data, nil
		}
	}
	return "", errors.New("text not found")
}
