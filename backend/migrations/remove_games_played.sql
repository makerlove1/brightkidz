-- Migration: Remove games played tracking
-- This migration removes the total_games_played column from game_statistics table
-- The pointing system uses stars, not games played count

USE edukiz;

-- Remove total_games_played column from game_statistics table
ALTER TABLE game_statistics 
DROP COLUMN IF EXISTS total_games_played;

-- Update the user_progress_summary view to remove games_played
DROP VIEW IF EXISTS user_progress_summary;

CREATE VIEW user_progress_summary AS
SELECT 
  u.id,
  u.username,
  u.email,
  SUM(p.score) as total_score,
  SUM(p.time_spent) as total_time_spent,
  COUNT(CASE WHEN p.completed = TRUE THEN 1 END) as games_completed,
  MAX(p.updated_at) as last_activity
FROM users u
LEFT JOIN user_progress p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;

-- Note: The pointing system uses stars (rewards_earned) from user_levels table
-- Stars are earned through gameplay and displayed in the header
