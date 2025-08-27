package db

import (
	"context"
	"fmt"
	"log"
)

func (c *Client) InitializeDatabase(ctx context.Context) error {
	if err := c.createMigrationsTable(ctx); err != nil {
		return fmt.Errorf("failed to create migrations table: %v", err)
	}

	migrations := []Migration{
		{
			Version:     1,
			Description: "Create sessions table",
			SQL: `
				CREATE TABLE IF NOT EXISTS sessions (
					id SERIAL PRIMARY KEY,
					session_id VARCHAR(255) NOT NULL,
					sticker_id VARCHAR(255) NOT NULL,
					url VARCHAR(500) NOT NULL,
					width INTEGER,
					height INTEGER,
					x INTEGER,
					y INTEGER
				);
			`,
		},
		{
			Version:     2,
			Description: "Drop created_at and updated_at columns",
			SQL: `
				ALTER TABLE sessions 
				DROP COLUMN IF EXISTS created_at,
				DROP COLUMN IF EXISTS updated_at;
			`,
		},
	}

	for _, migration := range migrations {
		if err := c.runMigration(ctx, migration); err != nil {
			return fmt.Errorf("failed to run migration %d: %v", migration.Version, err)
		}
	}

	return nil
}

type Migration struct {
	Version     int
	Description string
	SQL         string
}

func (c *Client) createMigrationsTable(ctx context.Context) error {
	query := `
		CREATE TABLE IF NOT EXISTS schema_migrations (
			version INTEGER PRIMARY KEY,
			description TEXT NOT NULL,
			applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		);
	`

	_, err := c.Pool.Exec(ctx, query)
	return err
}

func (c *Client) runMigration(ctx context.Context, migration Migration) error {
	// Check if migration already applied
	var count int
	err := c.Pool.QueryRow(ctx, "SELECT COUNT(*) FROM schema_migrations WHERE version = $1", migration.Version).Scan(&count)
	if err != nil {
		return fmt.Errorf("failed to check migration status: %v", err)
	}

	if count > 0 {
		log.Printf("Migration %d already applied, skipping", migration.Version)
		return nil
	}

	// Begin transaction
	tx, err := c.Pool.Begin(ctx)
	if err != nil {
		return fmt.Errorf("failed to begin transaction: %v", err)
	}
	defer tx.Rollback(ctx)

	// Run migration SQL
	_, err = tx.Exec(ctx, migration.SQL)
	if err != nil {
		return fmt.Errorf("failed to execute migration SQL: %v", err)
	}

	// Record migration
	_, err = tx.Exec(ctx,
		"INSERT INTO schema_migrations (version, description) VALUES ($1, $2)",
		migration.Version, migration.Description)
	if err != nil {
		return fmt.Errorf("failed to record migration: %v", err)
	}

	// Commit transaction
	if err := tx.Commit(ctx); err != nil {
		return fmt.Errorf("failed to commit migration: %v", err)
	}

	log.Printf("Applied migration %d: %s", migration.Version, migration.Description)
	return nil
}
