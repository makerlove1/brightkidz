# Daily Login Streak System - Implementation Guide

## Overview
A gamified daily login streak system that rewards users for consecutive daily logins, similar to popular mobile games. Users receive surprise rewards, track their progress, and compete on leaderboards.

## Features Implemented

### 1. Database Tables

#### `login_streaks` Table
Tracks user login streak data:
- `current_streak`: Current consecutive login days
- `longest_streak`: Best streak ever achieved
- `last_login_date`: Last login date for streak calculation
- `total_login_days`: Total number of days logged in
- `streak_rewards_claimed`: Total rewards earned from streaks

#### `login_rewards` Table
Records all rewards earned:
- `reward_type`: 'daily', 'streak_milestone', or 'comeback'
- `reward_name`: Display name of the reward
- `reward_value`: Points/coins earned
- `streak_day`: Which day of the streak this was earned
- `claimed_at`: Timestamp of reward claim

### 2. Backend API Routes (`/api/streaks`)

#### GET `/current`
Get user's current streak information and recent rewards.

**Response:**
```json
{
  "streak": {
    "currentStreak": 5,
    "longestStreak": 10,
    "lastLoginDate": "2024-03-09",
    "totalLoginDays": 25,
    "streakRewardsClaimed": 8
  },
  "recentRewards": [...]
}
```

#### POST `/check-in`
Process daily login check-in and award rewards.

**Response:**
```json
{
  "alreadyCheckedIn": false,
  "isNewStreak": false,
  "isComeback": false,
  "streak": {
    "currentStreak": 6,
    "longestStreak": 10,
    "totalLoginDays": 26,
    "previousStreak": 5
  },
  "reward": {
    "type": "daily",
    "name": "Day 6 Reward",
    "value": 15,
    "emoji": "🎁",
    "message": "Great job! Day 6 of your streak!"
  }
}
```

#### GET `/leaderboard`
Get top 50 users by current streak.

### 3. Reward System

#### Daily Rewards
- Base: 10 points
- Bonus: +5 points every 5 days
- Example: Day 1 = 10pts, Day 5 = 10pts, Day 6 = 15pts, Day 11 = 20pts

#### Milestone Rewards
- Day 3: 25 points 🔥 "3-Day Streak!"
- Day 7: 50 points ⭐ "Week Warrior!"
- Day 14: 100 points 🏆 "2-Week Champion!"
- Day 30: 250 points 👑 "Monthly Master!"
- Day 50: 500 points 💎 "Dedication Award!"
- Day 100: 1000 points 🎖️ "Century Club!"

#### Comeback Bonus
- 15 points 💪 "Comeback Bonus!" when returning after missing days

### 4. Frontend Components

#### `DailyLoginStreak.vue`
Main modal component that shows:
- Surprise reward animation with confetti
- Current streak statistics
- Progress bar to next milestone
- Upcoming milestone rewards
- Automatically appears on first login of the day

#### `StreakBadge.vue`
Compact badge showing current streak:
- Displays in header
- Shows fire emoji 🔥 and day count
- Clickable to open full streak modal
- Auto-refreshes every minute

### 5. Integration Points

#### App.vue
- Includes `DailyLoginStreak` component globally
- Handles streak modal display events

#### Header.vue
- Displays `StreakBadge` in header-right section
- Emits events to show full streak details

#### Login.vue
- Automatically triggers check-in after successful login
- Shows surprise modal if it's a new day

## Setup Instructions

### 1. Database Setup
Run the updated SQL schema:
```bash
cd backend
mysql -u root -p edukiz < config/init-database.sql
```

Or manually execute the new table creation queries from `init-database.sql`.

### 2. Backend Setup
The streak routes are already registered in `server.js`. Restart your backend:
```bash
cd backend
npm start
```

### 3. Frontend Setup
No additional setup needed. The components are already integrated.

### 4. Testing

#### Test Daily Check-in
```bash
# Using curl or Postman
POST http://localhost:3000/api/streaks/check-in
Headers: Authorization: Bearer YOUR_TOKEN
```

#### Test Streak Display
1. Login to the app
2. You should see the streak modal automatically
3. Click the streak badge in the header to view details

## User Experience Flow

1. **First Login of the Day**
   - User logs in
   - System checks last login date
   - If new day: Show surprise animation with confetti
   - Display reward earned
   - Update streak counter

2. **Subsequent Logins Same Day**
   - No modal shown
   - Streak badge still visible in header
   - Can click badge to view progress

3. **Streak Broken**
   - User returns after missing days
   - Streak resets to 1
   - Receives "Comeback Bonus" (15 points)
   - Encouraged to start new streak

4. **Milestone Reached**
   - Special celebration animation
   - Larger reward amount
   - Unique emoji and message
   - Progress bar shows next goal

## Customization

### Adjust Reward Values
Edit `backend/routes/streaks.js` in the `generateReward()` function:
```javascript
const rewards = {
  1: { name: 'Welcome Back!', value: 10, emoji: '🎉' },
  3: { name: '3-Day Streak!', value: 25, emoji: '🔥' },
  // Add more milestones...
};
```

### Change Animation Timing
Edit `src/components/DailyLoginStreak.vue`:
```javascript
setTimeout(() => {
  this.createConfetti();
}, 300); // Adjust delay
```

### Modify Streak Badge Position
Edit `src/components/Header.vue` to move the badge to different locations.

## Translations

All text is translated in three languages:
- English (en)
- Filipino/Tagalog (tl)
- German (de)

Add more translations in `src/utils/LanguageManager.js`:
```javascript
dailyLoginStreak: "Your Translation",
currentStreak: "Your Translation",
// etc...
```

## Analytics & Admin

### View Streak Statistics
Admins can query the database:
```sql
-- Top streaks
SELECT u.username, ls.current_streak, ls.longest_streak
FROM login_streaks ls
JOIN users u ON ls.user_id = u.id
ORDER BY ls.current_streak DESC
LIMIT 10;

-- Total rewards distributed
SELECT SUM(reward_value) as total_points
FROM login_rewards;

-- Most active users
SELECT u.username, ls.total_login_days
FROM login_streaks ls
JOIN users u ON ls.user_id = u.id
ORDER BY ls.total_login_days DESC;
```

## Future Enhancements

Potential additions:
1. Weekly/Monthly challenges
2. Streak freeze items (skip a day without losing streak)
3. Social sharing of milestones
4. Streak recovery option (watch ad or use points)
5. Team/group streaks
6. Seasonal special rewards
7. Push notifications for streak reminders
8. Streak insurance (premium feature)

## Troubleshooting

### Streak not updating
- Check if user is authenticated
- Verify token is valid
- Check server logs for errors
- Ensure database tables exist

### Modal not showing
- Check browser console for errors
- Verify component is imported in App.vue
- Check if user already checked in today

### Badge not displaying
- Ensure user has logged in at least once
- Check if StreakBadge is in Header.vue
- Verify API endpoint is accessible

## Support

For issues or questions:
1. Check server logs: `backend/logs/`
2. Check browser console for frontend errors
3. Verify database connection
4. Test API endpoints with Postman

---

**Enjoy your new daily login streak system!** 🔥🎉
