-- Create database if not exists
CREATE DATABASE IF NOT EXISTS edukiz CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE edukiz;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(50) UNIQUE NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  full_name VARCHAR(100),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  last_login TIMESTAMP NULL,
  is_active BOOLEAN DEFAULT TRUE,
  INDEX idx_username (username),
  INDEX idx_email (email),
  INDEX idx_role (role)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User sessions/logins tracking
CREATE TABLE IF NOT EXISTS user_sessions (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  logout_time TIMESTAMP NULL,
  ip_address VARCHAR(45),
  user_agent TEXT,
  session_duration INT, -- in seconds
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_id (user_id),
  INDEX idx_login_time (login_time)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User progress tracking
CREATE TABLE IF NOT EXISTS user_progress (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  game_type VARCHAR(50) NOT NULL, -- 'memory', 'dragdrop', 'misc'
  game_name VARCHAR(100) NOT NULL, -- specific game name
  score INT DEFAULT 0,
  level_completed INT DEFAULT 0,
  time_spent INT DEFAULT 0, -- in seconds
  attempts INT DEFAULT 0,
  completed BOOLEAN DEFAULT FALSE,
  completed_at TIMESTAMP NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_game (user_id, game_type, game_name),
  INDEX idx_completed (completed)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Game statistics
CREATE TABLE IF NOT EXISTS game_statistics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  total_games_played INT DEFAULT 0,
  total_time_spent INT DEFAULT 0, -- in seconds
  total_score INT DEFAULT 0,
  rewards_earned INT DEFAULT 0,
  last_played TIMESTAMP NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_stats (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Insert default admin user (password: admin123)
-- This will be properly hashed when you run: npm run create-admin
INSERT INTO users (username, email, password, full_name, role) 
VALUES ('admin', 'admin@edukiz.com', 'CHANGE_ME', 'Administrator', 'admin')
ON DUPLICATE KEY UPDATE username=username;

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

-- Add rewards column to user_levels if not exists (for star tracking)
ALTER TABLE user_levels 
ADD COLUMN IF NOT EXISTS rewards INT DEFAULT 0 COMMENT 'Current star/reward count displayed in header';

-- Initialize rewards from total_stars_earned for existing users
UPDATE user_levels SET rewards = total_stars_earned WHERE rewards = 0;

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
CREATE TABLE IF NOT EXISTS login_streaks (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  current_streak INT DEFAULT 0,
  longest_streak INT DEFAULT 0,
  last_login_date DATE NULL,
  total_login_days INT DEFAULT 0,
  streak_rewards_claimed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  UNIQUE KEY unique_user_streak (user_id),
  INDEX idx_current_streak (current_streak),
  INDEX idx_last_login_date (last_login_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Login rewards tracking
CREATE TABLE IF NOT EXISTS login_rewards (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  reward_type VARCHAR(50) NOT NULL, -- 'daily', 'streak_milestone', 'comeback'
  reward_name VARCHAR(100) NOT NULL,
  reward_value INT DEFAULT 0, -- points, coins, etc.
  streak_day INT DEFAULT 0, -- which day of streak this was earned
  claimed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_user_rewards (user_id, claimed_at),
  INDEX idx_reward_type (reward_type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Create views for easy reporting
CREATE OR REPLACE VIEW user_login_summary AS
SELECT 
  u.id,
  u.username,
  u.email,
  u.full_name,
  COUNT(s.id) as total_logins,
  MAX(s.login_time) as last_login,
  AVG(s.session_duration) as avg_session_duration,
  COALESCE(ls.current_streak, 0) as current_streak,
  COALESCE(ls.longest_streak, 0) as longest_streak
FROM users u
LEFT JOIN user_sessions s ON u.id = s.user_id
LEFT JOIN login_streaks ls ON u.id = ls.user_id
GROUP BY u.id, u.username, u.email, u.full_name, ls.current_streak, ls.longest_streak;

CREATE OR REPLACE VIEW user_progress_summary AS
SELECT 
  u.id,
  u.username,
  u.email,
  COUNT(DISTINCT p.game_name) as games_played,
  SUM(p.score) as total_score,
  SUM(p.time_spent) as total_time_spent,
  COUNT(CASE WHEN p.completed = TRUE THEN 1 END) as games_completed,
  MAX(p.updated_at) as last_activity
FROM users u
LEFT JOIN user_progress p ON u.id = p.user_id
GROUP BY u.id, u.username, u.email;
