# Progress Tracking Integration Example

This guide shows how to integrate progress tracking into your existing game components.

## Example: Memory Game Integration

### Before (without tracking)

```javascript
export default {
  name: 'MemoryAnimals',
  data() {
    return {
      score: 0,
      gameComplete: false
    };
  },
  methods: {
    onGameComplete() {
      this.gameComplete = true;
      // Update local rewards
      const rewards = parseInt(localStorage.rewards || 0);
      localStorage.rewards = rewards + 10;
    }
  }
}
```

### After (with tracking)

```javascript
import { progressTrackingMixin } from '@/mixins/progressTrackingMixin';

export default {
  name: 'MemoryAnimals',
  mixins: [progressTrackingMixin], // Add the mixin
  data() {
    return {
      score: 0,
      gameComplete: false
    };
  },
  mounted() {
    // Start tracking when game loads
    this.startGameTracking('memory', 'Memory Animals');
  },
  methods: {
    onGameComplete() {
      this.gameComplete = true;
      
      // Save progress to database (if user is logged in)
      this.saveGameProgress(
        this.score,      // score
        1,               // level completed
        true             // game completed
      );
      
      // Update rewards (both database and localStorage)
      this.updateRewards(10);
    }
  },
  beforeUnmount() {
    // Optional: Save progress when leaving the game
    if (!this.gameComplete) {
      this.saveGameProgress(this.score, 0, false);
    }
  }
}
```

## Mixin Methods

### startGameTracking(gameType, gameName)
Call this when the game starts (usually in `mounted()`).

**Parameters:**
- `gameType`: Category of game ('memory', 'dragdrop', 'misc')
- `gameName`: Specific game name ('Memory Animals', 'Build Words', etc.)

### saveGameProgress(score, levelCompleted, completed)
Call this to save progress to the database.

**Parameters:**
- `score`: Current score (number)
- `levelCompleted`: Level number completed (number, default: 0)
- `completed`: Whether game is fully completed (boolean, default: false)

**Note:** This automatically tracks time spent since `startGameTracking()` was called.

### updateRewards(rewardPoints)
Call this to add rewards.

**Parameters:**
- `rewardPoints`: Number of reward points to add

**Note:** This updates both the database and localStorage for backward compatibility.

### resetGameTracking()
Optional: Reset tracking data. Usually not needed as it's handled automatically.

## Integration Patterns

### Pattern 1: Simple Game (one session)
```javascript
mounted() {
  this.startGameTracking('memory', 'Memory Animals');
},
methods: {
  onGameEnd() {
    this.saveGameProgress(this.score, 1, true);
    this.updateRewards(10);
  }
}
```

### Pattern 2: Multi-level Game
```javascript
mounted() {
  this.startGameTracking('misc', 'Calculate Numbers');
},
methods: {
  onLevelComplete(level) {
    // Save progress after each level
    this.saveGameProgress(this.score, level, false);
  },
  onGameComplete() {
    // Final save with completion flag
    this.saveGameProgress(this.score, this.maxLevel, true);
    this.updateRewards(this.score * 2);
  }
}
```

### Pattern 3: Continuous Game (save on exit)
```javascript
mounted() {
  this.startGameTracking('dragdrop', 'Build Words');
},
beforeUnmount() {
  // Save progress when user leaves
  this.saveGameProgress(this.score, this.wordsCompleted, false);
}
```

## Guest Mode

The tracking system automatically handles guest mode:
- If user is not logged in, progress is NOT saved to database
- localStorage rewards still work for guest users
- No errors are thrown in guest mode

## Error Handling

The mixin handles errors gracefully:
- Failed API calls are logged to console
- Game continues to work even if tracking fails
- No user-facing errors for tracking failures

## Testing

### Test with Logged-in User
1. Register/login a user
2. Play a game
3. Check admin dashboard to see progress

### Test with Guest User
1. Don't login (or logout)
2. Play a game
3. Verify game works normally
4. Check that no API errors appear in console

## Complete Example: Quiz Game

```javascript
<template>
  <div class="quiz-game">
    <h2>Score: {{ score }}</h2>
    <div v-if="!gameOver">
      <button @click="answerQuestion(true)">Correct</button>
      <button @click="answerQuestion(false)">Wrong</button>
    </div>
    <div v-else>
      <h3>Game Over!</h3>
      <p>Final Score: {{ score }}</p>
    </div>
  </div>
</template>

<script>
import { progressTrackingMixin } from '@/mixins/progressTrackingMixin';

export default {
  name: 'QuizGame',
  mixins: [progressTrackingMixin],
  data() {
    return {
      score: 0,
      questionsAnswered: 0,
      totalQuestions: 10,
      gameOver: false
    };
  },
  mounted() {
    this.startGameTracking('misc', 'Quiz Game');
  },
  methods: {
    answerQuestion(correct) {
      if (correct) {
        this.score += 10;
      }
      this.questionsAnswered++;
      
      if (this.questionsAnswered >= this.totalQuestions) {
        this.endGame();
      }
    },
    endGame() {
      this.gameOver = true;
      
      // Save final progress
      this.saveGameProgress(
        this.score,
        this.questionsAnswered,
        true
      );
      
      // Award rewards based on score
      const rewardPoints = Math.floor(this.score / 10);
      this.updateRewards(rewardPoints);
    }
  },
  beforeUnmount() {
    // Save progress if user leaves before finishing
    if (!this.gameOver) {
      this.saveGameProgress(this.score, this.questionsAnswered, false);
    }
  }
};
</script>
```

## Best Practices

1. **Always call startGameTracking() in mounted()**
   - This ensures accurate time tracking

2. **Save progress at meaningful points**
   - Level completion
   - Game completion
   - Before component unmount

3. **Use descriptive game names**
   - Good: "Memory Animals", "Build Words Level 1"
   - Bad: "game1", "mem"

4. **Award rewards consistently**
   - Base rewards on achievement
   - Consider difficulty and time spent

5. **Handle edge cases**
   - User leaves mid-game
   - User refreshes page
   - Network errors

## Migration Checklist

For each game component:
- [ ] Import progressTrackingMixin
- [ ] Add mixin to component
- [ ] Call startGameTracking() in mounted()
- [ ] Call saveGameProgress() at appropriate points
- [ ] Call updateRewards() when awarding points
- [ ] Test with logged-in user
- [ ] Test with guest user
- [ ] Verify admin dashboard shows data
