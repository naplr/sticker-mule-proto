package db

import (
	"os"
)

type Config struct {
	ProjectID       string
	Region          string
	InstanceID      string
	DatabaseName    string
	User            string
	Password        string
	MaxOpenConns    int
	MaxIdleConns    int
	ConnMaxLifetime int // minutes
}

func NewConfig() *Config {
	return &Config{
		ProjectID:       getEnvOrDefault("GOOGLE_CLOUD_PROJECT", ""),
		Region:          getEnvOrDefault("GOOGLE_CLOUD_REGION", "us-central1"),
		InstanceID:      getEnvOrDefault("GOOGLE_CLOUD_SQL_INSTANCE", ""),
		DatabaseName:    getEnvOrDefault("DATABASE_NAME", "sticker_db"),
		User:            getEnvOrDefault("DATABASE_USER", "postgres"),
		Password:        getEnvOrDefault("DATABASE_PASSWORD", ""),
		MaxOpenConns:    25,
		MaxIdleConns:    5,
		ConnMaxLifetime: 30,
	}
}

func getEnvOrDefault(key string, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
