-- Migration: Add Level System Tables
-- Date: 2024-03-09
-- Description: Adds user_levels and level_history tables for infinite leveling system

USE edukiz;

-- User levels and experience tracking
CREATE TABLE IF NOT EXISTS user_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  current_level INT DEFAULT 1,
  current_stars INT DEFAULT 0,
  total_stars_earned INT DEFAULT 0,
  stars_to_next_level INT DEFAULT 10,
  level_up_count INT DEFAULT 0,
  last_level_up TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_level (user_id),
  INDEX idx_current_level (current_level),
  INDEX idx_total_stars (total_stars_earned)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Level up history tracking
CREATE TABLE IF NOT EXISTS level_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  old_level INT NOT NULL,
  new_level INT NOT NULL,
  stars_at_levelup INT NOT NULL,
  leveled_up_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_history (user_id, leveled_up_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Verify tables were created
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as user_levels_count FROM user_levels;
SELECT COUNT(*) as level_history_count FROM level_history;
