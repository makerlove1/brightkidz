# Infinite Level System - Implementation Guide

## Overview
An infinite leveling system where users level up every 10 stars (rewards). Each level up shows a celebration animation with titles and bonus rewards. The system integrates seamlessly with the existing star reward system.

## Features Implemented

### 1. Database Tables

#### `user_levels` Table
Tracks user level progression:
- `current_level`: User's current level (starts at 1, infinite)
- `current_stars`: Stars progress toward next level (0-9)
- `total_stars_earned`: Lifetime total stars collected
- `stars_to_next_level`: Always 10 (consistent progression)
- `level_up_count`: Total number of times leveled up
- `last_level_up`: Timestamp of most recent level up

#### `level_history` Table
Records every level up event:
- `old_level`: Previous level
- `new_level`: New level achieved
- `stars_at_levelup`: Total stars when leveled up
- `leveled_up_at`: Timestamp of level up

### 2. Backend API Routes (`/api/levels`)

#### GET `/current`
Get user's current level information and history.

**Response:**
```json
{
  "level": {
    "currentLevel": 15,
    "currentStars": 7,
    "totalStarsEarned": 157,
    "starsToNextLevel": 10,
    "levelUpCount": 15,
    "lastLevelUp": "2024-03-09T10:30:00Z",
    "progressPercentage": 70
  },
  "history": [...]
}
```

#### POST `/add-stars`
Add stars and automatically process level ups.

**Request:**
```json
{
  "stars": 5
}
```

**Response:**
```json
{
  "success": true,
  "leveledUp": true,
  "levelsGained": [
    {
      "level": 16,
      "reward": {
        "title": "Level 16",
        "emoji": "🎉",
        "bonus": 10,
        "message": "You've reached level 16! Keep learning!"
      }
    }
  ],
  "level": {
    "currentLevel": 16,
    "currentStars": 2,
    "totalStarsEarned": 162,
    "starsToNextLevel": 10,
    "progressPercentage": 20
  }
}
```

#### GET `/leaderboard`
Get top 50 users by level.

### 3. Level Progression System

#### Consistent Progression
- Every level requires exactly 10 stars
- No exponential scaling - keeps it fair and predictable
- Infinite levels - no cap on progression

#### Multiple Level Ups
- Can level up multiple times in one action
- Example: At level 5 with 8 stars, earning 15 stars = level 7 with 3 stars
- Each level up is celebrated individually

#### Level Titles & Rewards

**Milestone Levels:**
- Level 5: "Rising Star" ⭐ (+50 bonus)
- Level 10: "Bright Student" 🌟 (+100 bonus)
- Level 25: "Knowledge Seeker" 📚 (+250 bonus)
- Level 50: "Master Learner" 🎓 (+500 bonus)
- Level 75: "Genius" 🧠 (+750 bonus)
- Level 100: "Legend" 👑 (+1000 bonus)
- Level 150: "Grandmaster" 💎 (+1500 bonus)
- Level 200: "Ultimate Scholar" 🏆 (+2000 bonus)

**Regular Levels:**
- Default title: "Level X"
- Emoji: 🎉
- Bonus: (level / 10) * 10 points

### 4. Frontend Components

#### `LevelDisplay.vue`
Compact level badge showing:
- Level emoji (changes based on level tier)
- Current level number
- Mini progress bar (stars to next level)
- Star count (e.g., "7/10 ⭐")
- Clickable for details

#### Level Up Modal
Celebration modal with:
- Burst animation effect
- Large emoji display
- Level number
- Title badge
- Congratulatory message
- Bonus points earned
- Queued display for multiple level ups

### 5. Integration Points

#### Header.vue
- Displays `LevelDisplay` component
- Shows next to streak badge
- Emits events for level details

#### Star Reward System
- Automatically syncs with localStorage rewards
- Listens to `showReward` event from Header
- Adds stars when rewards are earned
- Triggers level up checks

#### Admin Dashboard
- Shows user levels in user table
- Displays level emoji and number
- Shows total stars earned
- Sortable by level

### 6. Level Emoji Tiers

Visual progression indicators:
- 🌱 Levels 1-4 (Seedling)
- ⭐ Levels 5-9 (Star)
- 🌟 Levels 10-24 (Glowing Star)
- 📚 Levels 25-49 (Books)
- 🎓 Levels 50-74 (Graduate)
- 🧠 Levels 75-99 (Brain)
- 👑 Levels 100-149 (Crown)
- 💎 Levels 150-199 (Diamond)
- 🏆 Levels 200+ (Trophy)

## Setup Instructions

### 1. Database Setup
Run the migration:
```bash
cd backend
mysql -u root -p edukiz < migrations/add_level_system.sql
```

### 2. Backend Setup
The level routes are already registered. Restart backend:
```bash
cd backend
npm start
```

### 3. Frontend Setup
Components are already integrated. No additional setup needed.

### 4. Testing

#### Test Level Up
```bash
# Using curl or Postman
POST http://localhost:3000/api/levels/add-stars
Headers: Authorization: Bearer YOUR_TOKEN
Body: { "stars": 15 }
```

#### Test Display
1. Login to the app
2. Earn stars by completing games
3. Watch level up animation when reaching 10 stars
4. Check level badge in header

## User Experience Flow

1. **Earning Stars**
   - User completes game/activity
   - Stars are awarded (shown in header)
   - Level system automatically syncs

2. **Level Up Trigger**
   - Stars reach 10 (or multiples of 10)
   - Level up modal appears
   - Celebration animation plays
   - Bonus points awarded

3. **Multiple Level Ups**
   - If earning many stars at once
   - Each level up shown sequentially
   - User clicks through each celebration

4. **Progress Tracking**
   - Level badge always visible in header
   - Shows current progress (e.g., 7/10 ⭐)
   - Click badge for detailed stats

## Customization

### Change Stars Per Level
Edit `backend/routes/levels.js`:
```javascript
// Change from 10 to 15 stars per level
starsToNextLevel = 15;
```

### Add More Milestones
```javascript
const milestones = {
  // ... existing milestones
  250: { title: 'Legendary', emoji: '🌠', bonus: 5000 },
  500: { title: 'Mythical', emoji: '✨', bonus: 10000 }
};
```

### Modify Level Emojis
Edit `src/components/LevelDisplay.vue`:
```javascript
getLevelEmoji() {
  const level = this.levelData.currentLevel;
  if (level >= 300) return '🌌'; // Add new tier
  // ... rest of tiers
}
```

### Adjust Animation Timing
```scss
@keyframes burst {
  0% { transform: scale(0); opacity: 1; }
  100% { transform: scale(2); opacity: 0; }
  // Adjust duration in component
}
```

## Admin Features

### View User Levels
Admin dashboard shows:
- Level emoji and number
- Total stars earned
- Current streak (integrated)
- Sortable columns

### Database Queries

#### Top Levels
```sql
SELECT u.username, ul.current_level, ul.total_stars_earned
FROM user_levels ul
JOIN users u ON ul.user_id = u.id
ORDER BY ul.current_level DESC, ul.total_stars_earned DESC
LIMIT 10;
```

#### Level Distribution
```sql
SELECT 
  CASE 
    WHEN current_level < 10 THEN '1-9'
    WHEN current_level < 25 THEN '10-24'
    WHEN current_level < 50 THEN '25-49'
    WHEN current_level < 100 THEN '50-99'
    ELSE '100+'
  END as level_range,
  COUNT(*) as user_count
FROM user_levels
GROUP BY level_range;
```

#### Recent Level Ups
```sql
SELECT u.username, lh.old_level, lh.new_level, lh.leveled_up_at
FROM level_history lh
JOIN users u ON lh.user_id = u.id
ORDER BY lh.leveled_up_at DESC
LIMIT 20;
```

#### Average Level
```sql
SELECT AVG(current_level) as avg_level FROM user_levels;
```

## Integration with Existing Systems

### Star Rewards (Header.vue)
- Level system listens to `showReward` event
- Automatically adds stars when rewards earned
- Syncs with localStorage every 5 seconds

### Streak System
- Both systems work independently
- Both badges shown in header
- Complementary progression systems

### Admin Dashboard
- Level column added to user table
- Shows level emoji and number
- Integrated with existing user data

## Translations

Added in three languages:
- **English**: Level, Level Up, Bonus Points, etc.
- **Filipino**: Antas, Tumaas ang Antas, etc.
- **German**: Level, Level Aufstieg, etc.

## Performance Considerations

### Efficient Queries
- Indexed on `current_level` and `total_stars_earned`
- Unique constraint on `user_id`
- Optimized joins in admin queries

### Sync Strategy
- Periodic sync every 5 seconds
- Event-driven updates on star rewards
- Minimal API calls

### Animation Performance
- CSS animations (GPU accelerated)
- Queued level ups prevent overlap
- Smooth transitions

## Troubleshooting

### Level Not Updating
- Check if stars are being added
- Verify API endpoint is accessible
- Check browser console for errors
- Ensure user is authenticated

### Modal Not Showing
- Check if level up actually occurred
- Verify event listeners are registered
- Check z-index conflicts
- Clear browser cache

### Stars Out of Sync
- Check localStorage rewards value
- Verify sync interval is running
- Test manual sync with add-stars endpoint

### Admin Dashboard Not Showing Levels
- Verify database migration ran
- Check if JOIN query includes user_levels
- Refresh admin data

## Future Enhancements

Potential additions:
1. **Level Perks** - Unlock features at certain levels
2. **Prestige System** - Reset level for special rewards
3. **Level Badges** - Collectible achievements
4. **Level Challenges** - Special tasks per level tier
5. **Level Leaderboard** - Dedicated leaderboard page
6. **Level Rewards Shop** - Spend bonus points
7. **Level Milestones** - Special events at big levels
8. **Level Titles** - Customizable display titles

## Analytics

Track these metrics:
- Average level across users
- Level distribution
- Time to reach milestones
- Level up frequency
- Engagement by level tier

## Best Practices

1. **Consistent Progression** - 10 stars per level keeps it fair
2. **Visual Feedback** - Clear progress indicators
3. **Celebration** - Make level ups feel rewarding
4. **Transparency** - Show exact progress (7/10 stars)
5. **Accessibility** - Clear emojis and text labels

---

**Start leveling up! 🚀**
