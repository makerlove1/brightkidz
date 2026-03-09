const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All level routes require authentication
router.use(verifyToken);

// Get user's current level information
router.get('/current', async (req, res) => {
  try {
    const userId = req.userId;

    let [levels] = await pool.query(
      'SELECT * FROM user_levels WHERE user_id = ?',
      [userId]
    );

    // Initialize level record if doesn't exist
    if (levels.length === 0) {
      await pool.query(
        'INSERT INTO user_levels (user_id) VALUES (?)',
        [userId]
      );
      [levels] = await pool.query(
        'SELECT * FROM user_levels WHERE user_id = ?',
        [userId]
      );
    }

    const level = levels[0];

    // Get recent level ups
    const [history] = await pool.query(
      `SELECT * FROM level_history 
       WHERE user_id = ? 
       ORDER BY leveled_up_at DESC 
       LIMIT 10`,
      [userId]
    );

    // Handle rewards column - use total_stars_earned if rewards doesn't exist
    const rewards = level.rewards !== undefined ? level.rewards : level.total_stars_earned;

    res.json({
      level: {
        currentLevel: level.current_level,
        currentStars: level.current_stars,
        totalStarsEarned: level.total_stars_earned,
        rewards: rewards,
        starsToNextLevel: level.stars_to_next_level,
        levelUpCount: level.level_up_count,
        lastLevelUp: level.last_level_up,
        progressPercentage: Math.floor((level.current_stars / level.stars_to_next_level) * 100)
      },
      history
    });
  } catch (error) {
    console.error('Get level error:', error);
    console.error('Error details:', error.message);
    console.error('Stack:', error.stack);
    res.status(500).json({ error: 'Failed to fetch level data', details: error.message });
  }
});

// Add stars and check for level up
router.post('/add-stars', async (req, res) => {
  try {
    const userId = req.userId;
    const { stars } = req.body;

    if (!stars || stars < 1) {
      return res.status(400).json({ error: 'Invalid star amount' });
    }

    // Get or create level record
    let [levels] = await pool.query(
      'SELECT * FROM user_levels WHERE user_id = ?',
      [userId]
    );

    if (levels.length === 0) {
      await pool.query(
        'INSERT INTO user_levels (user_id) VALUES (?)',
        [userId]
      );
      [levels] = await pool.query(
        'SELECT * FROM user_levels WHERE user_id = ?',
        [userId]
      );
    }

    const level = levels[0];
    const newCurrentStars = level.current_stars + stars;
    const newTotalStars = level.total_stars_earned + stars;
    
    let currentLevel = level.current_level;
    let starsToNextLevel = level.stars_to_next_level;
    let leveledUp = false;
    const levelsGained = [];

    // Check for level ups (can level up multiple times if enough stars)
    let remainingStars = newCurrentStars;
    while (remainingStars >= starsToNextLevel) {
      remainingStars -= starsToNextLevel;
      currentLevel++;
      leveledUp = true;
      
      // Record level up in history
      await pool.query(
        `INSERT INTO level_history (user_id, old_level, new_level, stars_at_levelup)
         VALUES (?, ?, ?, ?)`,
        [userId, currentLevel - 1, currentLevel, newTotalStars]
      );
      
      levelsGained.push({
        level: currentLevel,
        reward: getLevelReward(currentLevel)
      });
      
      // Stars needed for next level is always 10
      starsToNextLevel = 10;
    }

    // Update user level and rewards
    const updateQuery = `UPDATE user_levels 
       SET current_level = ?,
           current_stars = ?,
           total_stars_earned = ?,
           ${level.rewards !== undefined ? 'rewards = ?,' : ''}
           stars_to_next_level = ?,
           level_up_count = level_up_count + ?,
           last_level_up = ${leveledUp ? 'NOW()' : 'last_level_up'}
       WHERE user_id = ?`;
    
    const updateParams = level.rewards !== undefined 
      ? [currentLevel, remainingStars, newTotalStars, newTotalStars, starsToNextLevel, levelsGained.length, userId]
      : [currentLevel, remainingStars, newTotalStars, starsToNextLevel, levelsGained.length, userId];
    
    await pool.query(updateQuery, updateParams);

    res.json({
      success: true,
      leveledUp,
      levelsGained,
      level: {
        currentLevel,
        currentStars: remainingStars,
        totalStarsEarned: newTotalStars,
        rewards: newTotalStars,
        starsToNextLevel,
        progressPercentage: Math.floor((remainingStars / starsToNextLevel) * 100)
      }
    });
  } catch (error) {
    console.error('Add stars error:', error);
    res.status(500).json({ error: 'Failed to add stars' });
  }
});

// Get level leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    // No userId needed for leaderboard - it's public
    const [leaderboard] = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.full_name,
        ul.current_level,
        ul.total_stars_earned,
        ul.level_up_count,
        ul.last_level_up
       FROM user_levels ul
       JOIN users u ON ul.user_id = u.id
       WHERE u.role = 'user' AND u.is_active = TRUE
       ORDER BY ul.current_level DESC, ul.total_stars_earned DESC
       LIMIT 50`
    );

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Helper function to get level rewards/titles
function getLevelReward(level) {
  const milestones = {
    5: { title: 'Rising Star', emoji: '⭐', bonus: 50 },
    10: { title: 'Bright Student', emoji: '🌟', bonus: 100 },
    25: { title: 'Knowledge Seeker', emoji: '📚', bonus: 250 },
    50: { title: 'Master Learner', emoji: '🎓', bonus: 500 },
    75: { title: 'Genius', emoji: '🧠', bonus: 750 },
    100: { title: 'Legend', emoji: '👑', bonus: 1000 },
    150: { title: 'Grandmaster', emoji: '💎', bonus: 1500 },
    200: { title: 'Ultimate Scholar', emoji: '🏆', bonus: 2000 }
  };

  if (milestones[level]) {
    return {
      ...milestones[level],
      message: `Congratulations! You've reached level ${level}!`
    };
  }

  // Default reward for non-milestone levels
  return {
    title: `Level ${level}`,
    emoji: '🎉',
    bonus: Math.floor(level / 10) * 10,
    message: `You've reached level ${level}! Keep learning!`
  };
}

module.exports = router;
