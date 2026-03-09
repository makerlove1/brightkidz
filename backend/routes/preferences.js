const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All preference routes require authentication
router.use(verifyToken);

// Get user preferences
router.get('/', async (req, res) => {
  try {
    const userId = req.userId;

    let [prefs] = await pool.query(
      'SELECT * FROM user_preferences WHERE user_id = ?',
      [userId]
    );

    // Initialize if doesn't exist
    if (prefs.length === 0) {
      await pool.query(
        'INSERT INTO user_preferences (user_id) VALUES (?)',
        [userId]
      );
      [prefs] = await pool.query(
        'SELECT * FROM user_preferences WHERE user_id = ?',
        [userId]
      );
    }

    const pref = prefs[0];
    res.json({
      language: pref.language,
      selectedVoice: pref.selected_voice
    });
  } catch (error) {
    console.error('Get preferences error:', error);
    res.status(500).json({ error: 'Failed to fetch preferences' });
  }
});

// Update language preference
router.post('/language', async (req, res) => {
  try {
    const userId = req.userId;
    const { language } = req.body;

    if (!language || !['en', 'tl', 'de'].includes(language)) {
      return res.status(400).json({ error: 'Invalid language' });
    }

    // Ensure preference record exists
    await pool.query(
      `INSERT INTO user_preferences (user_id, language) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE language = ?`,
      [userId, language, language]
    );

    res.json({ success: true, language });
  } catch (error) {
    console.error('Update language error:', error);
    res.status(500).json({ error: 'Failed to update language' });
  }
});

// Update voice preference
router.post('/voice', async (req, res) => {
  try {
    const userId = req.userId;
    const { voice } = req.body;

    if (!voice) {
      return res.status(400).json({ error: 'Invalid voice data' });
    }

    // Ensure preference record exists
    await pool.query(
      `INSERT INTO user_preferences (user_id, selected_voice) 
       VALUES (?, ?) 
       ON DUPLICATE KEY UPDATE selected_voice = ?`,
      [userId, JSON.stringify(voice), JSON.stringify(voice)]
    );

    res.json({ success: true, voice });
  } catch (error) {
    console.error('Update voice error:', error);
    res.status(500).json({ error: 'Failed to update voice' });
  }
});

module.exports = router;
