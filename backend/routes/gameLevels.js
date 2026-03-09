const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All game level routes require authentication
router.use(verifyToken);

// Get game level progress
router.get('/:gameIdentifier', async (req, res) => {
  try {
    const userId = req.userId;
    const { gameIdentifier } = req.params;

    let [levels] = await pool.query(
      'SELECT * FROM game_levels WHERE user_id = ? AND game_identifier = ?',
      [userId, gameIdentifier]
    );

    // Initialize if doesn't exist
    if (levels.length === 0) {
      await pool.query(
        'INSERT INTO game_levels (user_id, game_identifier) VALUES (?, ?)',
        [userId, gameIdentifier]
      );
      [levels] = await pool.query(
        'SELECT * FROM game_levels WHERE user_id = ? AND game_identifier = ?',
        [userId, gameIdentifier]
      );
    }

    const level = levels[0];
    res.json({
      selectedLevel: level.selected_level,
      unlockedLevels: level.unlocked_levels
    });
  } catch (error) {
    console.error('Get game level error:', error);
    res.status(500).json({ error: 'Failed to fetch game level' });
  }
});

// Update game level progress
router.post('/:gameIdentifier', async (req, res) => {
  try {
    const userId = req.userId;
    const { gameIdentifier } = req.params;
    const { selectedLevel, unlockedLevels } = req.body;

    await pool.query(
      `INSERT INTO game_levels (user_id, game_identifier, selected_level, unlocked_levels)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         selected_level = ?, unlocked_levels = ?`,
      [userId, gameIdentifier, selectedLevel, unlockedLevels,
       selectedLevel, unlockedLevels]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update game level error:', error);
    res.status(500).json({ error: 'Failed to update game level' });
  }
});

module.exports = router;
