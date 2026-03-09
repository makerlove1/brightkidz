/**
 * Bayesian Knowledge Tracing (BKT) Model
 * 
 * Tracks student knowledge state and adapts difficulty based on performance.
 * Uses four parameters:
 * - P(L0): Initial knowledge probability
 * - P(T): Learning/transition probability
 * - P(S): Slip probability (knows but gets wrong)
 * - P(G): Guess probability (doesn't know but gets right)
 */

import errorLogger from "./ErrorLogger";

export class BKTModel {
  constructor() {
    this.skills = null;
    this.history = [];
    this.maxHistorySize = 100;
    this.initialized = false;
  }

  /**
   * Initialize the model (async)
   */
  async initialize() {
    if (this.initialized) return;
    
    this.skills = await this.loadSkills() || this.initializeSkills();
    this.history = await this.loadHistory() || [];
    this.initialized = true;
  }

  /**
   * Initialize default BKT parameters for each skill
   */
  initializeSkills() {
    return {
      letters: {
        pL: 0.3,      // Initial knowledge: 30%
        pT: 0.15,     // Learning rate: 15% per correct answer
        pS: 0.1,      // Slip rate: 10% chance of mistake when known
        pG: 0.25,     // Guess rate: 25% chance of correct guess when unknown
        attempts: 0,
        correct: 0,
        lastUpdated: Date.now()
      },
      numbers: {
        pL: 0.3,
        pT: 0.15,
        pS: 0.1,
        pG: 0.25,
        attempts: 0,
        correct: 0,
        lastUpdated: Date.now()
      },
      objects: {
        pL: 0.3,
        pT: 0.15,
        pS: 0.1,
        pG: 0.25,
        attempts: 0,
        correct: 0,
        lastUpdated: Date.now()
      }
    };
  }

  /**
   * Update knowledge state based on student's answer
   * Uses Bayesian inference to update probability
   */
  updateKnowledge(skill, isCorrect) {
    if (!this.skills[skill]) {
      errorLogger.logWarning('Unknown skill', { skill });
      return;
    }

    const s = this.skills[skill];
    const oldPL = s.pL;

    // Update attempts and correct count
    s.attempts++;
    if (isCorrect) s.correct++;

    // Bayesian update based on answer
    if (isCorrect) {
      // P(L|correct) = P(L) * (1 - P(S)) / [P(L) * (1 - P(S)) + (1 - P(L)) * P(G)]
      const numerator = s.pL * (1 - s.pS);
      const denominator = numerator + (1 - s.pL) * s.pG;
      s.pL = numerator / denominator;
    } else {
      // P(L|wrong) = P(L) * P(S) / [P(L) * P(S) + (1 - P(L)) * (1 - P(G))]
      const numerator = s.pL * s.pS;
      const denominator = numerator + (1 - s.pL) * (1 - s.pG);
      s.pL = numerator / denominator;
    }

    // Apply learning transition
    // P(L_new) = P(L_old) + (1 - P(L_old)) * P(T)
    s.pL = s.pL + (1 - s.pL) * s.pT;

    // Ensure probability stays in valid range [0, 1]
    s.pL = Math.max(0, Math.min(1, s.pL));

    s.lastUpdated = Date.now();

    // Record in history
    this.addToHistory({
      skill,
      isCorrect,
      oldPL,
      newPL: s.pL,
      timestamp: Date.now()
    });

    // Save to localStorage
    this.saveSkills();
    this.saveHistory();

    errorLogger.logInfo('BKT Update', {
      skill,
      isCorrect,
      oldMastery: (oldPL * 100).toFixed(1) + '%',
      newMastery: (s.pL * 100).toFixed(1) + '%',
      attempts: s.attempts,
      accuracy: ((s.correct / s.attempts) * 100).toFixed(1) + '%'
    });
  }

  /**
   * Get current mastery level for a skill (0-1)
   */
  getMastery(skill) {
    return this.skills[skill]?.pL || 0;
  }

  /**
   * Get mastery level as percentage
   */
  getMasteryPercent(skill) {
    return Math.round(this.getMastery(skill) * 100);
  }

  /**
   * Determine difficulty level based on mastery
   */
  getDifficulty(skill) {
    const mastery = this.getMastery(skill);
    
    if (mastery < 0.4) {
      return 'easy';      // Needs basic practice
    } else if (mastery < 0.7) {
      return 'medium';    // Building confidence
    } else if (mastery < 0.9) {
      return 'hard';      // Challenge for mastery
    } else {
      return 'expert';    // Maintain mastery
    }
  }

  /**
   * Check if skill is mastered (>= 80% probability)
   */
  isMastered(skill) {
    return this.getMastery(skill) >= 0.8;
  }

  /**
   * Get all skills mastery status
   */
  getAllMastery() {
    return {
      letters: {
        mastery: this.getMasteryPercent('letters'),
        difficulty: this.getDifficulty('letters'),
        isMastered: this.isMastered('letters'),
        attempts: this.skills.letters.attempts,
        accuracy: this.getAccuracy('letters')
      },
      numbers: {
        mastery: this.getMasteryPercent('numbers'),
        difficulty: this.getDifficulty('numbers'),
        isMastered: this.isMastered('numbers'),
        attempts: this.skills.numbers.attempts,
        accuracy: this.getAccuracy('numbers')
      },
      objects: {
        mastery: this.getMasteryPercent('objects'),
        difficulty: this.getDifficulty('objects'),
        isMastered: this.isMastered('objects'),
        attempts: this.skills.objects.attempts,
        accuracy: this.getAccuracy('objects')
      }
    };
  }

  /**
   * Get accuracy for a skill
   */
  getAccuracy(skill) {
    const s = this.skills[skill];
    if (!s || s.attempts === 0) return 0;
    return Math.round((s.correct / s.attempts) * 100);
  }

  /**
   * Predict probability of correct answer
   */
  predictCorrect(skill) {
    const s = this.skills[skill];
    if (!s) return 0.5;
    
    // P(correct) = P(L) * (1 - P(S)) + (1 - P(L)) * P(G)
    return s.pL * (1 - s.pS) + (1 - s.pL) * s.pG;
  }

  /**
   * Get recommended question count for each skill
   * More questions for skills that need practice
   */
  getRecommendedQuestionCount(totalQuestions = 10) {
    const masteries = {
      letters: this.getMastery('letters'),
      numbers: this.getMastery('numbers'),
      objects: this.getMastery('objects')
    };

    // Calculate inverse mastery (lower mastery = more questions)
    const inverseMastery = {
      letters: 1 - masteries.letters,
      numbers: 1 - masteries.numbers,
      objects: 1 - masteries.objects
    };

    const total = inverseMastery.letters + inverseMastery.numbers + inverseMastery.objects;

    // Distribute questions proportionally
    const counts = {
      letters: Math.max(1, Math.round((inverseMastery.letters / total) * totalQuestions)),
      numbers: Math.max(1, Math.round((inverseMastery.numbers / total) * totalQuestions)),
      objects: Math.max(1, Math.round((inverseMastery.objects / total) * totalQuestions))
    };

    // Adjust to ensure total equals totalQuestions
    const currentTotal = counts.letters + counts.numbers + counts.objects;
    if (currentTotal !== totalQuestions) {
      const diff = totalQuestions - currentTotal;
      // Add/subtract from skill with lowest mastery
      const lowestSkill = Object.keys(masteries).reduce((a, b) => 
        masteries[a] < masteries[b] ? a : b
      );
      counts[lowestSkill] += diff;
    }

    return counts;
  }

  /**
   * Get weakest skill (needs most practice)
   */
  getWeakestSkill() {
    const skills = ['letters', 'numbers', 'objects'];
    return skills.reduce((weakest, skill) => 
      this.getMastery(skill) < this.getMastery(weakest) ? skill : weakest
    );
  }

  /**
   * Get strongest skill
   */
  getStrongestSkill() {
    const skills = ['letters', 'numbers', 'objects'];
    return skills.reduce((strongest, skill) => 
      this.getMastery(skill) > this.getMastery(strongest) ? skill : strongest
    );
  }

  /**
   * Reset a specific skill
   */
  resetSkill(skill) {
    if (this.skills[skill]) {
      const defaults = this.initializeSkills()[skill];
      this.skills[skill] = { ...defaults };
      this.saveSkills();
      errorLogger.logInfo('BKT Skill Reset', { skill });
    }
  }

  /**
   * Reset all skills
   */
  resetAll() {
    this.skills = this.initializeSkills();
    this.history = [];
    this.saveSkills();
    this.saveHistory();
    errorLogger.logInfo('BKT Reset All');
  }

  /**
   * Add entry to history
   */
  addToHistory(entry) {
    this.history.push(entry);
    
    // Keep only recent history
    if (this.history.length > this.maxHistorySize) {
      this.history = this.history.slice(-this.maxHistorySize);
    }
  }

  /**
   * Get recent history
   */
  getHistory(limit = 20) {
    return this.history.slice(-limit);
  }

  /**
   * Save skills to database
   */
  async saveSkills() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to localStorage if not logged in
        localStorage.setItem('bkt_skills', JSON.stringify(this.skills));
        return;
      }

      const axios = (await import('axios')).default;
      const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
      
      // Save each skill
      for (const [skillName, skillData] of Object.entries(this.skills)) {
        await axios.post(
          `${API_URL}/bkt/skills/${skillName}`,
          {
            pL: skillData.pL,
            pT: skillData.pT,
            pS: skillData.pS,
            pG: skillData.pG,
            attempts: skillData.attempts,
            correct: skillData.correct
          },
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (e) {
      errorLogger.logError('Failed to save BKT skills', e);
      // Fallback to localStorage
      try {
        localStorage.setItem('bkt_skills', JSON.stringify(this.skills));
      } catch (localError) {
        errorLogger.logError('Failed to save BKT skills to localStorage', localError);
      }
    }
  }

  /**
   * Load skills from database
   */
  async loadSkills() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to localStorage if not logged in
        const saved = localStorage.getItem('bkt_skills');
        return saved ? JSON.parse(saved) : null;
      }

      const axios = (await import('axios')).default;
      const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
      
      const response = await axios.get(
        `${API_URL}/bkt/skills`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.skills;
    } catch (e) {
      errorLogger.logError('Failed to load BKT skills', e);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('bkt_skills');
        return saved ? JSON.parse(saved) : null;
      } catch (localError) {
        return null;
      }
    }
  }

  /**
   * Save history to database
   */
  async saveHistory() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to localStorage if not logged in
        localStorage.setItem('bkt_history', JSON.stringify(this.history));
        return;
      }

      const axios = (await import('axios')).default;
      const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
      
      // Save only the most recent entry
      if (this.history.length > 0) {
        const latestEntry = this.history[this.history.length - 1];
        await axios.post(
          `${API_URL}/bkt/history`,
          latestEntry,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
    } catch (e) {
      errorLogger.logError('Failed to save BKT history', e);
      // Fallback to localStorage
      try {
        localStorage.setItem('bkt_history', JSON.stringify(this.history));
      } catch (localError) {
        errorLogger.logError('Failed to save BKT history to localStorage', localError);
      }
    }
  }

  /**
   * Load history from database
   */
  async loadHistory() {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Fallback to localStorage if not logged in
        const saved = localStorage.getItem('bkt_history');
        return saved ? JSON.parse(saved) : null;
      }

      const axios = (await import('axios')).default;
      const API_URL = process.env.VUE_APP_API_URL || 'http://localhost:3000/api';
      
      const response = await axios.get(
        `${API_URL}/bkt/history?limit=${this.maxHistorySize}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      return response.data.history;
    } catch (e) {
      errorLogger.logError('Failed to load BKT history', e);
      // Fallback to localStorage
      try {
        const saved = localStorage.getItem('bkt_history');
        return saved ? JSON.parse(saved) : null;
      } catch (localError) {
        return null;
      }
    }
  }

  /**
   * Export data for analysis
   */
  exportData() {
    return {
      skills: this.skills,
      history: this.history,
      summary: this.getAllMastery(),
      exportDate: new Date().toISOString()
    };
  }
}

// Export singleton instance
export const bktModel = new BKTModel();
export default bktModel;
