# Daily Login Streak - Quick Start Guide

## 🚀 Quick Setup (5 minutes)

### Step 1: Update Database
Run the migration to add streak tables:

**Windows:**
```bash
cd backend
add-streak-tables.bat
```

**Mac/Linux:**
```bash
cd backend
mysql -u root -p edukiz < migrations/add_login_streaks.sql
```

### Step 2: Restart Backend
```bash
cd backend
npm start
```

### Step 3: Test It!
```bash
cd backend
node scripts/test-streak-system.js
```

### Step 4: Login to App
1. Open the web app
2. Login with your account
3. See the surprise streak modal! 🎉

## ✨ What You Get

### For Users
- 🔥 **Daily Login Rewards** - Get points every day you login
- 🎁 **Milestone Bonuses** - Special rewards at 3, 7, 14, 30, 50, 100 days
- 💪 **Comeback Bonus** - Extra points when you return after missing days
- 🏆 **Leaderboard** - Compete with other users
- 📊 **Progress Tracking** - See your streak history and stats

### For Admins
- 📈 **Analytics** - Track user engagement
- 🎯 **Retention** - Encourage daily app usage
- 💰 **Monetization** - Foundation for premium features

## 🎮 How It Works

### First Login of the Day
```
User logs in → Check last login date → New day?
  ↓ YES
Show surprise animation 🎊
Award points based on streak
Update streak counter
  ↓ NO
Just show streak badge in header
```

### Streak Calculation
- **Consecutive Days**: Streak increases by 1
- **Missed Days**: Streak resets to 1, get comeback bonus
- **Same Day**: No change, can view progress

### Reward Tiers
| Days | Reward | Emoji |
|------|--------|-------|
| 1 | 10 pts | 🎉 |
| 3 | 25 pts | 🔥 |
| 7 | 50 pts | ⭐ |
| 14 | 100 pts | 🏆 |
| 30 | 250 pts | 👑 |
| 50 | 500 pts | 💎 |
| 100 | 1000 pts | 🎖️ |

## 📱 User Interface

### Streak Badge (Header)
```
🔥 5 days
```
- Always visible when logged in
- Click to see full details
- Updates in real-time

### Streak Modal (Auto-popup)
Shows on first daily login:
- Confetti animation 🎊
- Reward earned
- Current/longest streak
- Progress to next milestone
- Upcoming rewards

## 🔧 Customization

### Change Reward Values
Edit `backend/routes/streaks.js`:
```javascript
const rewards = {
  3: { name: '3-Day Streak!', value: 50, emoji: '🔥' }, // Changed from 25 to 50
  // Add more...
};
```

### Add New Milestones
```javascript
const rewards = {
  // ... existing rewards
  200: { name: 'Legend!', value: 5000, emoji: '🌟' }
};
```

### Adjust Daily Rewards
```javascript
const baseReward = 20; // Changed from 10
const bonusPerDay = Math.floor(streakDay / 3) * 5; // Bonus every 3 days
```

## 🐛 Troubleshooting

### Modal Not Showing
1. Check browser console for errors
2. Verify user is logged in
3. Check if already checked in today
4. Clear localStorage and try again

### Streak Not Updating
1. Check backend logs
2. Verify database tables exist
3. Test API endpoint with Postman
4. Check user authentication token

### Badge Not Visible
1. Ensure Header.vue includes StreakBadge
2. Check if user has any streak (login at least once)
3. Verify API returns streak data

## 📊 Database Queries

### View All Streaks
```sql
SELECT u.username, ls.current_streak, ls.longest_streak, ls.total_login_days
FROM login_streaks ls
JOIN users u ON ls.user_id = u.id
ORDER BY ls.current_streak DESC;
```

### Total Rewards Given
```sql
SELECT 
  reward_type,
  COUNT(*) as count,
  SUM(reward_value) as total_points
FROM login_rewards
GROUP BY reward_type;
```

### Top Performers
```sql
SELECT 
  u.username,
  ls.current_streak,
  ls.longest_streak,
  COUNT(lr.id) as rewards_earned,
  SUM(lr.reward_value) as total_points
FROM users u
JOIN login_streaks ls ON u.id = ls.user_id
LEFT JOIN login_rewards lr ON u.id = lr.user_id
GROUP BY u.id
ORDER BY ls.current_streak DESC
LIMIT 10;
```

### Reset User Streak (for testing)
```sql
UPDATE login_streaks 
SET current_streak = 0, last_login_date = NULL 
WHERE user_id = YOUR_USER_ID;
```

## 🎯 Testing Scenarios

### Test Consecutive Days
1. Login today
2. Run SQL: `UPDATE login_streaks SET last_login_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) WHERE user_id = X;`
3. Login again (will count as next day)
4. Repeat to build streak

### Test Streak Break
1. Build a streak (e.g., 5 days)
2. Run SQL: `UPDATE login_streaks SET last_login_date = DATE_SUB(CURDATE(), INTERVAL 3 DAY) WHERE user_id = X;`
3. Login (streak resets, get comeback bonus)

### Test Milestones
1. Set streak to 2: `UPDATE login_streaks SET current_streak = 2, last_login_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) WHERE user_id = X;`
2. Login (should get Day 3 milestone reward)

## 📈 Analytics Ideas

Track these metrics:
- Average streak length
- Streak retention rate (% who maintain 7+ days)
- Most common drop-off day
- Comeback rate (% who return after breaking streak)
- Milestone achievement rates
- Total engagement increase

## 🚀 Future Enhancements

Ideas to expand the system:
1. **Streak Freeze** - Use points to skip a day
2. **Social Sharing** - Share milestones on social media
3. **Team Streaks** - Group challenges
4. **Seasonal Events** - Special rewards during holidays
5. **Push Notifications** - Remind users to maintain streak
6. **Streak Insurance** - Premium feature to protect streak
7. **Weekly Challenges** - Bonus objectives
8. **Achievement Badges** - Collectible rewards

## 📞 Support

Need help?
1. Check `DAILY_LOGIN_STREAK_GUIDE.md` for detailed docs
2. Review backend logs: `backend/logs/`
3. Test API with: `node scripts/test-streak-system.js`
4. Check database: `mysql -u root -p edukiz`

---

**Happy Streaking! 🔥**
