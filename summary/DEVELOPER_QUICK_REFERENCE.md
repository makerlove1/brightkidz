# Developer Quick Reference - localStorage to Database Migration

## Quick Commands

```bash
# Run migration
run-localstorage-migration.bat

# Start backend
cd backend && npm start

# Start frontend
npm run serve

# Test database
test-level-system.bat
```

## API Endpoints (New)

### Preferences
```javascript
// Get preferences
GET /api/preferences
Headers: { Authorization: 'Bearer <token>' }

// Update language
POST /api/preferences/language
Body: { language: 'en' | 'tl' | 'de' }

// Update voice
POST /api/preferences/voice
Body: { voice: { id: 'boy0', name: 'Boy Voice' } }
```

### BKT (Bayesian Knowledge Tracing)
```javascript
// Get skills
GET /api/bkt/skills

// Update skill
POST /api/bkt/skills/:skillName
Body: { pL, pT, pS, pG, attempts, correct }

// Get history
GET /api/bkt/history?limit=100

// Add history
POST /api/bkt/history
Body: { skill, isCorrect, oldPL, newPL, timestamp }
```

### Game Levels
```javascript
// Get game level
GET /api/game-levels/:gameIdentifier

// Update game level
POST /api/game-levels/:gameIdentifier
Body: { selectedLevel, unlockedLevels }
```

### Levels (Updated)
```javascript
// Get current level (now includes rewards)
GET /api/levels/current
Response: { level: { rewards, currentLevel, currentStars, ... } }

// Add stars (updates rewards and checks level ups)
POST /api/levels/add-stars
Body: { stars: number }
Response: { leveledUp, levelsGained, level: { rewards, ... } }
```

## Frontend Usage

### Award Stars to User
```javascript
// In your game component
import { progressTrackingMixin } from '@/mixins/progressTrackingMixin';

export default {
  mixins: [progressTrackingMixin],
  methods: {
    onGameComplete() {
      // Award stars
      this.updateRewards(5); // Awards 5 stars
      
      // This will:
      // 1. Call API to add stars
      // 2. Emit 'add-stars' event
      // 3. LevelDisplay updates
      // 4. Header updates
      // 5. Progress bar updates
      // 6. Level up modal shows if needed
    }
  }
}
```

### Load/Save Game Progress
```javascript
import { gameLevelService } from '@/services/gameLevelService';

export default {
  data() {
    return {
      selectedLevel: 1,
      unlockedLevels: 1,
      gameIdentifier: 'myGame'
    };
  },
  async mounted() {
    // Load progress
    const data = await gameLevelService.getGameLevel(this.gameIdentifier);
    this.selectedLevel = data.selectedLevel;
    this.unlockedLevels = data.unlockedLevels;
  },
  watch: {
    selectedLevel: {
      async handler(newValue) {
        // Auto-save on change
        await gameLevelService.saveGameLevel(
          this.gameIdentifier,
          newValue,
          this.unlockedLevels
        );
      }
    }
  }
}
```

### Change Language
```javascript
import languageManager from '@/utils/LanguageManager';

// Change language (saves to database)
await languageManager.setLanguage('tl'); // Filipino
await languageManager.setLanguage('en'); // English
await languageManager.setLanguage('de'); // German

// Get current language
const lang = languageManager.currentLanguage;

// Translate text
const text = languageManager.translate('level');
```

### Change Voice
```javascript
import { SoundUtils } from '@/components/utils/SoundUtils';

// Change voice (saves to database)
await SoundUtils.setVoice(SoundUtils.voices.boy0);
await SoundUtils.setVoice(SoundUtils.voices.girl0);

// Get current voice
const voice = SoundUtils.selectedVoice;
```

### Use BKT Model
```javascript
import { BKTModel } from '@/utils/BKTModel';

const bkt = new BKTModel();

// Initialize (async)
await bkt.initialize();

// Update knowledge after answer
bkt.updateKnowledge('letters', true); // Correct answer
bkt.updateKnowledge('numbers', false); // Wrong answer

// Get difficulty recommendation
const difficulty = bkt.getDifficultyRecommendation('letters');
// Returns: 'easy', 'medium', 'hard'

// Get mastery level
const mastery = bkt.getMasteryLevel('letters');
// Returns: 'beginner', 'intermediate', 'advanced', 'expert'
```

## Event System

### Emit Events
```javascript
// Award stars (from game)
this.emitter.emit('add-stars', 5);

// Show reward animation
this.emitter.emit('showReward', 3);

// Show reward preview
this.emitter.emit('showRewardPreview');
```

### Listen to Events
```javascript
// Listen for rewards update
this.emitter.on('rewards-updated', (newRewards) => {
  console.log('New reward count:', newRewards);
});

// Listen for level up
this.emitter.on('level-up', (levelData) => {
  console.log('Level up!', levelData);
});

// Clean up
beforeUnmount() {
  this.emitter.off('rewards-updated');
  this.emitter.off('level-up');
}
```

## Database Tables

### user_levels
```sql
-- Tracks user level and stars
SELECT * FROM user_levels WHERE user_id = 1;
-- Fields: current_level, current_stars, total_stars_earned, rewards, stars_to_next_level
```

### user_preferences
```sql
-- Stores language and voice
SELECT * FROM user_preferences WHERE user_id = 1;
-- Fields: language, selected_voice (JSON)
```

### bkt_skills
```sql
-- BKT skill tracking
SELECT * FROM bkt_skills WHERE user_id = 1;
-- Fields: skill_name, p_l, p_t, p_s, p_g, attempts, correct
```

### game_levels
```sql
-- Game progress
SELECT * FROM game_levels WHERE user_id = 1;
-- Fields: game_identifier, selected_level, unlocked_levels
```

## Common Patterns

### Pattern 1: Game with Star Rewards
```javascript
export default {
  mixins: [progressTrackingMixin],
  methods: {
    async onGameComplete(score) {
      // Calculate stars based on score
      const stars = Math.ceil(score / 10);
      
      // Award stars (updates database, level, progress bar)
      await this.updateRewards(stars);
      
      // Show success animation
      this.emitter.emit('showReward', stars);
    }
  }
}
```

### Pattern 2: Game with Level Progression
```javascript
import { gameLevelService } from '@/services/gameLevelService';

export default {
  data() {
    return {
      gameIdentifier: 'myGame',
      selectedLevel: 1,
      unlockedLevels: 1
    };
  },
  async mounted() {
    const data = await gameLevelService.getGameLevel(this.gameIdentifier);
    this.selectedLevel = data.selectedLevel;
    this.unlockedLevels = data.unlockedLevels;
  },
  methods: {
    async unlockNextLevel() {
      this.unlockedLevels++;
      await gameLevelService.saveGameLevel(
        this.gameIdentifier,
        this.selectedLevel,
        this.unlockedLevels
      );
    }
  }
}
```

### Pattern 3: Adaptive Learning with BKT
```javascript
import { BKTModel } from '@/utils/BKTModel';

export default {
  data() {
    return {
      bkt: null,
      currentSkill: 'letters'
    };
  },
  async mounted() {
    this.bkt = new BKTModel();
    await this.bkt.initialize();
  },
  methods: {
    async onAnswer(isCorrect) {
      // Update BKT model
      this.bkt.updateKnowledge(this.currentSkill, isCorrect);
      
      // Get new difficulty
      const difficulty = this.bkt.getDifficultyRecommendation(this.currentSkill);
      
      // Adjust game difficulty
      this.adjustDifficulty(difficulty);
    }
  }
}
```

## Debugging

### Check if data is in database
```javascript
// Open browser console
const token = localStorage.getItem('token');
const response = await fetch('http://localhost:3000/api/levels/current', {
  headers: { Authorization: `Bearer ${token}` }
});
const data = await response.json();
console.log(data);
```

### Check localStorage fallback
```javascript
// When not logged in, data should use localStorage
console.log(localStorage.getItem('appLanguage'));
console.log(localStorage.getItem('selectedVoice'));
console.log(localStorage.getItem('bkt_skills'));
```

### Monitor events
```javascript
// In mounted()
this.emitter.on('*', (type, data) => {
  console.log('Event:', type, data);
});
```

## Migration Notes

- ✅ localStorage still used for authentication (token, user, sessionId)
- ✅ localStorage used as fallback when not logged in
- ✅ Data syncs to database when logged in
- ✅ No data loss during migration
- ✅ Backward compatible

## Need Help?

1. Check `LOCALSTORAGE_REMOVAL_GUIDE.md` for detailed info
2. Check `MIGRATION_CHECKLIST.md` for testing steps
3. Check browser console for errors
4. Check backend logs for API errors
5. Verify database tables exist and have data
