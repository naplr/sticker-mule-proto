package db

import (
	"context"
	"fmt"
	"net"
	"server/internal/models"
	"time"

	"cloud.google.com/go/cloudsqlconn"
	"github.com/jackc/pgx/v5"
	"github.com/jackc/pgx/v5/pgxpool"
)

type Client struct {
	Pool   *pgxpool.Pool
	config *Config
}

func NewClient(ctx context.Context, config *Config) (*Client, error) {
	if config.ProjectID == "" || config.InstanceID == "" {
		return nil, fmt.Errorf("GOOGLE_CLOUD_PROJECT and GOOGLE_CLOUD_SQL_INSTANCE environment variables are required")
	}

	// Create Cloud SQL dialer
	d, err := cloudsqlconn.NewDialer(ctx)
	if err != nil {
		return nil, fmt.Errorf("failed to create Cloud SQL dialer: %v", err)
	}

	// Connection string for Cloud SQL
	instanceConnectionName := fmt.Sprintf("%s:%s:%s", config.ProjectID, config.Region, config.InstanceID)

	// Create custom dialer function
	dialerFunc := func(ctx context.Context, network, addr string) (net.Conn, error) {
		return d.Dial(ctx, instanceConnectionName)
	}

	// Build connection string
	dsn := fmt.Sprintf("user=%s password=%s dbname=%s sslmode=disable",
		config.User, config.Password, config.DatabaseName)

	// Configure connection pool
	poolConfig, err := pgxpool.ParseConfig(dsn)
	if err != nil {
		return nil, fmt.Errorf("failed to parse connection string: %v", err)
	}

	// Set custom dialer
	poolConfig.ConnConfig.DialFunc = dialerFunc

	// Configure pool settings
	poolConfig.MaxConns = int32(config.MaxOpenConns)
	poolConfig.MinConns = int32(config.MaxIdleConns)
	poolConfig.MaxConnLifetime = time.Duration(config.ConnMaxLifetime) * time.Minute

	// Create connection pool
	pool, err := pgxpool.NewWithConfig(ctx, poolConfig)
	if err != nil {
		return nil, fmt.Errorf("failed to create connection pool: %v", err)
	}

	// Test connection
	if err := pool.Ping(ctx); err != nil {
		pool.Close()
		return nil, fmt.Errorf("failed to ping database: %v", err)
	}

	return &Client{
		Pool:   pool,
		config: config,
	}, nil
}

func (c *Client) Close() {
	if c.Pool != nil {
		c.Pool.Close()
	}
}

func (c *Client) SaveSession(ctx context.Context, req *models.SaveSessionRequest) error {
	// Start a transaction
	tx, err := c.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %w", err)
	}
	defer tx.Rollback(ctx)

	// Delete existing stickers for this session
	_, err = tx.Exec(ctx, "DELETE FROM sessions WHERE session_id = $1", req.SessionId)
	if err != nil {
		return fmt.Errorf("failed to delete existing stickers: %w", err)
	}

	// Insert all stickers in a single query
	if len(req.Stickers) > 0 {
		query := `
			INSERT INTO sessions (session_id, sticker_id, url, width, height, x, y)
			VALUES ($1, $2, $3, $4, $5, $6, $7)
		`

		batch := &pgx.Batch{}
		for _, sticker := range req.Stickers {
			batch.Queue(query,
				req.SessionId,
				sticker.StickerId,
				sticker.URL,
				sticker.Size.Width,
				sticker.Size.Height,
				sticker.Position.X,
				sticker.Position.Y,
			)
		}

		br := tx.SendBatch(ctx, batch)
		if err := br.Close(); err != nil {
			return fmt.Errorf("failed to insert stickers: %w", err)
		}
	}

	// Commit the transaction
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit transaction: %w", err)
	}

	return nil
}

func (c *Client) GetSession(ctx context.Context, sessionID string) (*models.GetSessionDataResponse, error) {
	query := `
		SELECT sticker_id, url, width, height, x, y
		FROM sessions
		WHERE session_id = $1
	`

	rows, err := c.Pool.Query(ctx, query, sessionID)
	if err != nil {
		return nil, fmt.Errorf("failed to query session: %w", err)
	}
	defer rows.Close()

	var stickers []models.SavedStickerData
	for rows.Next() {
		var sticker models.SavedStickerData
		err := rows.Scan(
			&sticker.StickerId,
			&sticker.URL,
			&sticker.Size.Width,
			&sticker.Size.Height,
			&sticker.Position.X,
			&sticker.Position.Y,
		)
		if err != nil {
			return nil, fmt.Errorf("failed to scan row: %w", err)
		}
		stickers = append(stickers, sticker)
	}

	if err := rows.Err(); err != nil {
		return nil, fmt.Errorf("error iterating rows: %w", err)
	}

	return &models.GetSessionDataResponse{
		Stickers: stickers,
	}, nil
}
