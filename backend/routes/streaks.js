const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All streak routes require authentication
router.use(verifyToken);

// Get user's current streak information
router.get('/current', async (req, res) => {
  try {
    const userId = req.userId;

    let [streaks] = await pool.query(
      'SELECT * FROM login_streaks WHERE user_id = ?',
      [userId]
    );

    // Initialize streak record if doesn't exist
    if (streaks.length === 0) {
      await pool.query(
        'INSERT INTO login_streaks (user_id) VALUES (?)',
        [userId]
      );
      [streaks] = await pool.query(
        'SELECT * FROM login_streaks WHERE user_id = ?',
        [userId]
      );
    }

    const streak = streaks[0];

    // Get recent rewards
    const [rewards] = await pool.query(
      `SELECT * FROM login_rewards 
       WHERE user_id = ? 
       ORDER BY claimed_at DESC 
       LIMIT 10`,
      [userId]
    );

    res.json({
      streak: {
        currentStreak: streak.current_streak,
        longestStreak: streak.longest_streak,
        lastLoginDate: streak.last_login_date,
        totalLoginDays: streak.total_login_days,
        streakRewardsClaimed: streak.streak_rewards_claimed
      },
      recentRewards: rewards
    });
  } catch (error) {
    console.error('Get streak error:', error);
    res.status(500).json({ error: 'Failed to fetch streak data' });
  }
});

// Check and update daily login streak
router.post('/check-in', async (req, res) => {
  try {
    const userId = req.userId;
    const today = new Date().toISOString().split('T')[0];

    // Get or create streak record
    let [streaks] = await pool.query(
      'SELECT * FROM login_streaks WHERE user_id = ?',
      [userId]
    );

    if (streaks.length === 0) {
      await pool.query(
        'INSERT INTO login_streaks (user_id, last_login_date) VALUES (?, ?)',
        [userId, today]
      );
      [streaks] = await pool.query(
        'SELECT * FROM login_streaks WHERE user_id = ?',
        [userId]
      );
    }

    const streak = streaks[0];
    const lastLoginDate = streak.last_login_date ? 
      new Date(streak.last_login_date).toISOString().split('T')[0] : null;

    // Check if already checked in today
    if (lastLoginDate === today) {
      return res.json({
        alreadyCheckedIn: true,
        streak: {
          currentStreak: streak.current_streak,
          longestStreak: streak.longest_streak,
          totalLoginDays: streak.total_login_days
        },
        reward: null
      });
    }

    // Calculate new streak
    let newStreak = 1;
    let isComeback = false;
    
    if (lastLoginDate) {
      const lastDate = new Date(lastLoginDate);
      const currentDate = new Date(today);
      const diffTime = currentDate - lastDate;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day
        newStreak = streak.current_streak + 1;
      } else if (diffDays > 1) {
        // Streak broken, comeback bonus
        newStreak = 1;
        isComeback = true;
      }
    }

    const newLongestStreak = Math.max(newStreak, streak.longest_streak);
    const newTotalDays = streak.total_login_days + 1;

    // Update streak
    await pool.query(
      `UPDATE login_streaks 
       SET current_streak = ?, 
           longest_streak = ?, 
           last_login_date = ?,
           total_login_days = ?
       WHERE user_id = ?`,
      [newStreak, newLongestStreak, today, newTotalDays, userId]
    );

    // Generate reward
    const reward = generateReward(newStreak, isComeback);

    // Save reward
    await pool.query(
      `INSERT INTO login_rewards (user_id, reward_type, reward_name, reward_value, streak_day)
       VALUES (?, ?, ?, ?, ?)`,
      [userId, reward.type, reward.name, reward.value, newStreak]
    );

    // Update streak rewards claimed count
    await pool.query(
      'UPDATE login_streaks SET streak_rewards_claimed = streak_rewards_claimed + 1 WHERE user_id = ?',
      [userId]
    );

    res.json({
      alreadyCheckedIn: false,
      isNewStreak: newStreak === 1 && !isComeback,
      isComeback,
      streak: {
        currentStreak: newStreak,
        longestStreak: newLongestStreak,
        totalLoginDays: newTotalDays,
        previousStreak: streak.current_streak
      },
      reward
    });
  } catch (error) {
    console.error('Check-in error:', error);
    res.status(500).json({ error: 'Failed to process check-in' });
  }
});

// Get streak leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const [leaderboard] = await pool.query(
      `SELECT 
        u.id,
        u.username,
        u.full_name,
        ls.current_streak,
        ls.longest_streak,
        ls.total_login_days,
        ls.streak_rewards_claimed
       FROM login_streaks ls
       JOIN users u ON ls.user_id = u.id
       WHERE u.role = 'user' AND u.is_active = TRUE
       ORDER BY ls.current_streak DESC, ls.longest_streak DESC
       LIMIT 50`
    );

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// Helper function to generate rewards based on streak
function generateReward(streakDay, isComeback) {
  const rewards = {
    1: { name: 'Welcome Back!', value: 10, emoji: '🎉' },
    3: { name: '3-Day Streak!', value: 25, emoji: '🔥' },
    7: { name: 'Week Warrior!', value: 50, emoji: '⭐' },
    14: { name: '2-Week Champion!', value: 100, emoji: '🏆' },
    30: { name: 'Monthly Master!', value: 250, emoji: '👑' },
    50: { name: 'Dedication Award!', value: 500, emoji: '💎' },
    100: { name: 'Century Club!', value: 1000, emoji: '🎖️' }
  };

  if (isComeback) {
    return {
      type: 'comeback',
      name: 'Comeback Bonus!',
      value: 15,
      emoji: '💪',
      message: 'Welcome back! Keep the momentum going!'
    };
  }

  // Check for milestone rewards
  if (rewards[streakDay]) {
    return {
      type: 'streak_milestone',
      ...rewards[streakDay],
      message: `Amazing! You've logged in ${streakDay} days in a row!`
    };
  }

  // Daily reward with increasing value
  const baseReward = 10;
  const bonusPerDay = Math.floor(streakDay / 5) * 5;
  const totalValue = baseReward + bonusPerDay;

  return {
    type: 'daily',
    name: `Day ${streakDay} Reward`,
    value: totalValue,
    emoji: '🎁',
    message: `Great job! Day ${streakDay} of your streak!`
  };
}

module.exports = router;
