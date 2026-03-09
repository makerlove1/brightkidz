# Testing the Star and Level System

## Prerequisites:
1. Backend server running (`npm start` in `edukiz/backend`)
2. Frontend running (`npm run serve` in `edukiz`)
3. MySQL database running (Laragon)

## Step-by-Step Testing:

### 1. Check if you're logged in (NOT in guest mode)
- Open browser console (F12)
- Run: `console.log('Guest Mode:', localStorage.getItem('guestMode'))`
- Run: `console.log('Token:', localStorage.getItem('token'))`

**Expected:**
- `guestMode` should be `null` or not exist
- `token` should have a JWT token string

**If in Guest Mode:**
- Click "Login" or "Sign Up" in the header
- Or go to the login page and log in with real credentials

### 2. Test the API directly
Open the test page: `edukiz/test-star-flow.html` in your browser

Click the buttons to:
1. Check Auth Status
2. Get Current Level
3. Add Stars

### 3. Play a game and check console logs
1. Open browser console (F12) before playing
2. Play a game (e.g., Quiz Game)
3. Answer correctly to earn stars
4. Watch for these logs in the console:

```
LevelDisplay: Received showReward event
LevelDisplay: Raw stars value: 1
LevelDisplay: Parsed star amount: 1
LevelDisplay: addStars called with: 1
LevelDisplay: Sending API request to add 1 stars
LevelDisplay: API response: {...}
LevelDisplay: Stars added successfully
```

### 4. Check the progress bar
After earning stars:
- The progress bar in the header should update
- The star count should increase
- If you earn 10 stars, you should level up

## Common Issues and Solutions:

### Issue: "Failed to load resource: the server responded with a status of 500"
**Solution:**
1. Check if backend server is running
2. Check if you have a valid token (log out and log in again)
3. Check browser console for detailed error

### Issue: No console logs when playing games
**Solution:**
1. Make sure you're not in guest mode
2. Check if LevelDisplay component is mounted (should be in header)
3. Check if game is emitting `showReward` event

### Issue: Stars show in animation but don't persist
**Solution:**
1. Check if `rewards-updated` event is being emitted
2. Refresh the page - stars should still be there
3. Check database: `SELECT * FROM user_levels WHERE user_id = YOUR_ID`

### Issue: Progress bar doesn't update
**Solution:**
1. Check if `levelData` is being updated in LevelDisplay
2. Check if `progressPercentage` is calculated correctly
3. Check browser console for API response errors

## Manual Database Check:
```sql
-- Check your user's level data
SELECT * FROM user_levels WHERE user_id = YOUR_USER_ID;

-- Check level history
SELECT * FROM level_history WHERE user_id = YOUR_USER_ID ORDER BY leveled_up_at DESC;
```

## Files Modified for Debugging:
1. `src/components/LevelDisplay.vue` - Added extensive logging
2. `src/components/Header.vue` - Added logging for showReward event
3. `backend/fix-level-tables.js` - Fixed missing database tables/columns
4. `test-star-flow.html` - Direct API testing page
5. `STAR_SYSTEM_DEBUG.md` - Comprehensive debugging guide

## Quick Fix Script:
Run `FIX_STAR_SYSTEM.bat` to automatically:
1. Check database connection
2. Create missing tables/columns
3. Start backend server

## Next Steps:
If stars are still not working after following this guide:
1. Share the browser console logs
2. Share the backend server logs
3. Check if there are any JavaScript errors in the console
4. Verify the user is logged in (not guest mode)