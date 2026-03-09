-- Migration to support moving all localStorage data to database
-- This adds tables for user preferences and game-specific progress

-- User preferences table (language, voice, etc.)
CREATE TABLE IF NOT EXISTS user_preferences (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  language VARCHAR(10) DEFAULT 'en',
  selected_voice JSON DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_preferences (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BKT (Bayesian Knowledge Tracing) skills tracking
CREATE TABLE IF NOT EXISTS bkt_skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_name VARCHAR(50) NOT NULL, -- 'letters', 'numbers', 'objects'
  p_l DECIMAL(5,4) DEFAULT 0.3000, -- Knowledge probability
  p_t DECIMAL(5,4) DEFAULT 0.1500, -- Learning rate
  p_s DECIMAL(5,4) DEFAULT 0.1000, -- Slip rate
  p_g DECIMAL(5,4) DEFAULT 0.2500, -- Guess rate
  attempts INT DEFAULT 0,
  correct INT DEFAULT 0,
  last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_skill (user_id, skill_name),
  INDEX idx_user_skill (user_id, skill_name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BKT answer history
CREATE TABLE IF NOT EXISTS bkt_history (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_name VARCHAR(50) NOT NULL,
  is_correct BOOLEAN NOT NULL,
  old_p_l DECIMAL(5,4) NOT NULL,
  new_p_l DECIMAL(5,4) NOT NULL,
  timestamp BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_history (user_id, skill_name, created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Game-specific progress (for games like CalculateNumbers0To18)
CREATE TABLE IF NOT EXISTS game_levels (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_identifier VARCHAR(100) NOT NULL, -- e.g., 'calculateNumbers0To18'
  selected_level INT DEFAULT 1,
  unlocked_levels INT DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_game (user_id, game_identifier),
  INDEX idx_user_game (user_id, game_identifier)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Add rewards column to user_levels if not exists (for star tracking)
ALTER TABLE user_levels 
ADD COLUMN IF NOT EXISTS rewards INT DEFAULT 0 COMMENT 'Current star/reward count displayed in header';

-- Initialize rewards from total_stars_earned for existing users
UPDATE user_levels SET rewards = total_stars_earned WHERE rewards = 0;
