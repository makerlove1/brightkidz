const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All user routes require authentication
router.use(verifyToken);

// Get current user's statistics
router.get('/stats', async (req, res) => {
  try {
    const [stats] = await pool.query(
      `SELECT * FROM game_statistics WHERE user_id = ?`,
      [req.userId]
    );

    res.json({ statistics: stats[0] || {} });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get current user's progress
router.get('/progress', async (req, res) => {
  try {
    const [progress] = await pool.query(
      `SELECT * FROM user_progress WHERE user_id = ? ORDER BY updated_at DESC`,
      [req.userId]
    );

    res.json({ progress });
  } catch (error) {
    console.error('Get progress error:', error);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
});

// Get login history
router.get('/login-history', async (req, res) => {
  try {
    const [history] = await pool.query(
      `SELECT id, login_time, logout_time, session_duration 
       FROM user_sessions 
       WHERE user_id = ? 
       ORDER BY login_time DESC 
       LIMIT 20`,
      [req.userId]
    );

    res.json({ history });
  } catch (error) {
    console.error('Get login history error:', error);
    res.status(500).json({ error: 'Failed to fetch login history' });
  }
});

module.exports = router;
