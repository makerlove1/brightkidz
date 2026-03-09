const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All progress routes require authentication
router.use(verifyToken);

// Save/update game progress
router.post('/save', async (req, res) => {
  try {
    const { gameType, gameName, score, levelCompleted, timeSpent, completed } = req.body;

    if (!gameType || !gameName) {
      return res.status(400).json({ error: 'Game type and name are required' });
    }

    // Check if progress exists
    const [existing] = await pool.query(
      'SELECT id, attempts FROM user_progress WHERE user_id = ? AND game_type = ? AND game_name = ?',
      [req.userId, gameType, gameName]
    );

    if (existing.length > 0) {
      // Update existing progress
      await pool.query(
        `UPDATE user_progress 
         SET score = GREATEST(score, ?),
             level_completed = GREATEST(level_completed, ?),
             time_spent = time_spent + ?,
             attempts = attempts + 1,
             completed = ?,
             completed_at = CASE WHEN ? = TRUE AND completed = FALSE THEN CURRENT_TIMESTAMP ELSE completed_at END
         WHERE id = ?`,
        [score || 0, levelCompleted || 0, timeSpent || 0, completed || false, completed || false, existing[0].id]
      );
    } else {
      // Insert new progress
      await pool.query(
        `INSERT INTO user_progress 
         (user_id, game_type, game_name, score, level_completed, time_spent, attempts, completed, completed_at)
         VALUES (?, ?, ?, ?, ?, ?, 1, ?, ?)`,
        [req.userId, gameType, gameName, score || 0, levelCompleted || 0, timeSpent || 0, completed || false, completed ? new Date() : null]
      );
    }

    // Update game statistics
    await pool.query(
      `INSERT INTO game_statistics (user_id, total_time_spent, total_score, last_played)
       VALUES (?, ?, ?, CURRENT_TIMESTAMP)
       ON DUPLICATE KEY UPDATE
         total_time_spent = total_time_spent + ?,
         total_score = total_score + ?,
         last_played = CURRENT_TIMESTAMP`,
      [req.userId, timeSpent || 0, score || 0, timeSpent || 0, score || 0]
    );

    res.json({ message: 'Progress saved successfully' });
  } catch (error) {
    console.error('Save progress error:', error);
    res.status(500).json({ error: 'Failed to save progress' });
  }
});

// Update rewards
router.post('/rewards', async (req, res) => {
  try {
    const { rewards } = req.body;

    if (typeof rewards !== 'number') {
      return res.status(400).json({ error: 'Rewards must be a number' });
    }

    await pool.query(
      `UPDATE game_statistics 
       SET rewards_earned = rewards_earned + ?
       WHERE user_id = ?`,
      [rewards, req.userId]
    );

    res.json({ message: 'Rewards updated successfully' });
  } catch (error) {
    console.error('Update rewards error:', error);
    res.status(500).json({ error: 'Failed to update rewards' });
  }
});

module.exports = router;
