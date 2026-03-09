-- Migration: Add Daily Login Streak Tables
-- Date: 2024-03-09
-- Description: Adds login_streaks and login_rewards tables for gamified daily login system

USE edukiz;

-- Daily login streaks tracking
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

-- Update user_login_summary view to include streak data
DROP VIEW IF EXISTS user_login_summary;
CREATE VIEW user_login_summary AS
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

-- Verify tables were created
SELECT 'Migration completed successfully!' as status;
SELECT COUNT(*) as login_streaks_count FROM login_streaks;
SELECT COUNT(*) as login_rewards_count FROM login_rewards;
