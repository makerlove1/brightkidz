const express = require('express');
const { pool } = require('../config/database');
const { verifyToken, isAdmin } = require('../middleware/auth');

const router = express.Router();

// All admin routes require authentication and admin role
router.use(verifyToken);
router.use(isAdmin);

// Get dashboard statistics
router.get('/dashboard', async (req, res) => {
  try {
    // Total users
    const [totalUsers] = await pool.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "user"'
    );

    // Active users (logged in last 7 days) - exclude admin accounts
    const [activeUsers] = await pool.query(
      `SELECT COUNT(DISTINCT s.user_id) as count 
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.login_time >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       AND u.role = 'user'`
    );

    // Total logins - exclude admin accounts
    const [totalLogins] = await pool.query(
      `SELECT COUNT(*) as count 
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE u.role = 'user'`
    );

    // Recent logins (last 10) - exclude admin accounts
    const [recentLogins] = await pool.query(
      `SELECT s.id, s.login_time, s.logout_time, s.session_duration,
              u.username, u.email, u.full_name
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE u.role = 'user'
       ORDER BY s.login_time DESC
       LIMIT 10`
    );

    res.json({
      statistics: {
        totalUsers: totalUsers[0].count,
        activeUsers: activeUsers[0].count,
        totalLogins: totalLogins[0].count
      },
      recentLogins
    });
  } catch (error) {
    console.error('Dashboard error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard data' });
  }
});

// Get all users with login and progress summary
router.get('/users', async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.email,
        u.full_name,
        u.created_at,
        u.last_login,
        u.is_active,
        COUNT(DISTINCT s.id) as total_logins,
        COALESCE(gs.total_score, 0) as total_score,
        COALESCE(gs.total_time_spent, 0) as total_time_spent,
        COALESCE(gs.rewards_earned, 0) as rewards_earned,
        COALESCE(ul.current_level, 1) as current_level,
        COALESCE(ul.total_stars_earned, 0) as total_stars,
        COALESCE(ls.current_streak, 0) as current_streak
       FROM users u
       LEFT JOIN user_sessions s ON u.id = s.user_id
       LEFT JOIN game_statistics gs ON u.id = gs.user_id
       LEFT JOIN user_levels ul ON u.id = ul.user_id
       LEFT JOIN login_streaks ls ON u.id = ls.user_id
       WHERE u.role = 'user'
       GROUP BY u.id
       ORDER BY u.created_at DESC`
    );

    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get specific user details
router.get('/users/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // User info
    const [users] = await pool.query(
      `SELECT u.*, 
              COALESCE(gs.total_score, 0) as total_score,
              COALESCE(gs.total_time_spent, 0) as total_time_spent,
              COALESCE(gs.rewards_earned, 0) as rewards_earned
       FROM users u
       LEFT JOIN game_statistics gs ON u.id = gs.user_id
       WHERE u.id = ?`,
      [userId]
    );

    if (users.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Login history
    const [loginHistory] = await pool.query(
      `SELECT id, login_time, logout_time, session_duration, ip_address
       FROM user_sessions
       WHERE user_id = ?
       ORDER BY login_time DESC
       LIMIT 50`,
      [userId]
    );

    // Progress by game
    const [progress] = await pool.query(
      `SELECT game_type, game_name, score, level_completed, 
              time_spent, attempts, completed, completed_at, updated_at
       FROM user_progress
       WHERE user_id = ?
       ORDER BY updated_at DESC`,
      [userId]
    );

    res.json({
      user: users[0],
      loginHistory,
      progress
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({ error: 'Failed to fetch user details' });
  }
});

// Get login statistics
router.get('/logins/stats', async (req, res) => {
  try {
    const { period = '7' } = req.query; // days

    // Logins per day - exclude admin accounts
    const [loginsPerDay] = await pool.query(
      `SELECT DATE(s.login_time) as date, COUNT(*) as count
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.login_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
       AND u.role = 'user'
       GROUP BY DATE(s.login_time)
       ORDER BY date DESC`,
      [parseInt(period)]
    );

    // Average session duration - exclude admin accounts
    const [avgDuration] = await pool.query(
      `SELECT AVG(s.session_duration) as avg_seconds
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.session_duration IS NOT NULL
       AND s.login_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
       AND u.role = 'user'`,
      [parseInt(period)]
    );

    // Peak hours - exclude admin accounts
    const [peakHours] = await pool.query(
      `SELECT HOUR(s.login_time) as hour, COUNT(*) as count
       FROM user_sessions s
       JOIN users u ON s.user_id = u.id
       WHERE s.login_time >= DATE_SUB(NOW(), INTERVAL ? DAY)
       AND u.role = 'user'
       GROUP BY HOUR(s.login_time)
       ORDER BY count DESC`,
      [parseInt(period)]
    );

    res.json({
      loginsPerDay,
      averageSessionDuration: avgDuration[0].avg_seconds,
      peakHours
    });
  } catch (error) {
    console.error('Login stats error:', error);
    res.status(500).json({ error: 'Failed to fetch login statistics' });
  }
});

// Get progress statistics
router.get('/progress/stats', async (req, res) => {
  try {
    // Top stars earners
    const [topStarsEarners] = await pool.query(
      `SELECT u.id, u.username, u.full_name,
              COALESCE(ul.total_stars_earned, 0) as total_stars,
              COALESCE(ul.current_level, 1) as current_level
       FROM users u
       LEFT JOIN user_levels ul ON u.id = ul.user_id
       WHERE u.role = 'user'
       ORDER BY ul.total_stars_earned DESC
       LIMIT 10`
    );

    // Completion rates - exclude admin accounts
    const [completionRates] = await pool.query(
      `SELECT up.game_type,
              COUNT(*) as total_attempts,
              SUM(CASE WHEN up.completed = TRUE THEN 1 ELSE 0 END) as completed_count,
              ROUND(SUM(CASE WHEN up.completed = TRUE THEN 1 ELSE 0 END) / COUNT(*) * 100, 2) as completion_rate
       FROM user_progress up
       JOIN users u ON up.user_id = u.id
       WHERE u.role = 'user'
       GROUP BY up.game_type`
    );

    res.json({
      topStarsEarners,
      completionRates
    });
  } catch (error) {
    console.error('Progress stats error:', error);
    res.status(500).json({ error: 'Failed to fetch progress statistics' });
  }
});

// Toggle user active status
router.patch('/users/:userId/toggle-active', async (req, res) => {
  try {
    const { userId } = req.params;

    await pool.query(
      'UPDATE users SET is_active = NOT is_active WHERE id = ?',
      [userId]
    );

    res.json({ message: 'User status updated' });
  } catch (error) {
    console.error('Toggle user error:', error);
    res.status(500).json({ error: 'Failed to update user status' });
  }
});

module.exports = router;
