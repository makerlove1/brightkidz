const express = require('express');
const { pool } = require('../config/database');
const { verifyToken } = require('../middleware/auth');

const router = express.Router();

// All BKT routes require authentication
router.use(verifyToken);

// Get all BKT skills for user
router.get('/skills', async (req, res) => {
  try {
    const userId = req.userId;

    const [skills] = await pool.query(
      'SELECT * FROM bkt_skills WHERE user_id = ?',
      [userId]
    );

    // Convert to object format expected by frontend
    const skillsObj = {};
    skills.forEach(skill => {
      skillsObj[skill.skill_name] = {
        pL: parseFloat(skill.p_l),
        pT: parseFloat(skill.p_t),
        pS: parseFloat(skill.p_s),
        pG: parseFloat(skill.p_g),
        attempts: skill.attempts,
        correct: skill.correct,
        lastUpdated: new Date(skill.last_updated).getTime()
      };
    });

    // Initialize default skills if none exist
    if (Object.keys(skillsObj).length === 0) {
      const defaultSkills = ['letters', 'numbers', 'objects'];
      for (const skillName of defaultSkills) {
        await pool.query(
          `INSERT INTO bkt_skills (user_id, skill_name) VALUES (?, ?)`,
          [userId, skillName]
        );
        skillsObj[skillName] = {
          pL: 0.3,
          pT: 0.15,
          pS: 0.1,
          pG: 0.25,
          attempts: 0,
          correct: 0,
          lastUpdated: Date.now()
        };
      }
    }

    res.json({ skills: skillsObj });
  } catch (error) {
    console.error('Get BKT skills error:', error);
    res.status(500).json({ error: 'Failed to fetch BKT skills' });
  }
});

// Update BKT skill
router.post('/skills/:skillName', async (req, res) => {
  try {
    const userId = req.userId;
    const { skillName } = req.params;
    const { pL, pT, pS, pG, attempts, correct } = req.body;

    await pool.query(
      `INSERT INTO bkt_skills (user_id, skill_name, p_l, p_t, p_s, p_g, attempts, correct)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE 
         p_l = ?, p_t = ?, p_s = ?, p_g = ?, attempts = ?, correct = ?`,
      [userId, skillName, pL, pT, pS, pG, attempts, correct,
       pL, pT, pS, pG, attempts, correct]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Update BKT skill error:', error);
    res.status(500).json({ error: 'Failed to update BKT skill' });
  }
});

// Get BKT history
router.get('/history', async (req, res) => {
  try {
    const userId = req.userId;
    const limit = parseInt(req.query.limit) || 100;

    const [history] = await pool.query(
      `SELECT * FROM bkt_history 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT ?`,
      [userId, limit]
    );

    // Convert to frontend format
    const historyArray = history.map(h => ({
      skill: h.skill_name,
      isCorrect: h.is_correct,
      oldPL: parseFloat(h.old_p_l),
      newPL: parseFloat(h.new_p_l),
      timestamp: h.timestamp
    }));

    res.json({ history: historyArray });
  } catch (error) {
    console.error('Get BKT history error:', error);
    res.status(500).json({ error: 'Failed to fetch BKT history' });
  }
});

// Add BKT history entry
router.post('/history', async (req, res) => {
  try {
    const userId = req.userId;
    const { skill, isCorrect, oldPL, newPL, timestamp } = req.body;

    await pool.query(
      `INSERT INTO bkt_history (user_id, skill_name, is_correct, old_p_l, new_p_l, timestamp)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [userId, skill, isCorrect, oldPL, newPL, timestamp]
    );

    res.json({ success: true });
  } catch (error) {
    console.error('Add BKT history error:', error);
    res.status(500).json({ error: 'Failed to add BKT history' });
  }
});

module.exports = router;
