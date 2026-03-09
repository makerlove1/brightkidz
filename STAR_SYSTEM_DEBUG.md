# Star System Debugging Guide

## Issue: Stars not being added and progress bar not updating

### Root Causes Identified:

1. **Guest Mode**: If user is in guest mode, they don't have an authentication token, so stars cannot be saved to the database
2. **Event Propagation**: The `showReward` event needs to reach the `LevelDisplay` component
3. **API Endpoint**: The backend `/api/levels/add-stars` endpoint must be working correctly

### How the System Works:

```
Game Component
    ↓ (emits showReward event with star count)
Header Component (handles animation)
    ↓ (same event)
LevelDisplay Component (calls API to add stars)
    ↓ (API call)
Backend /api/levels/add-stars
    ↓ (updates database)
Returns updated level data
    ↓ (emits rewards-updated event)
Header Component (updates star display)
```

### Debugging Steps:

#### 1. Check if User is Logged In (Not Guest Mode)

Open browser console (F12) and run:
```javascript
console.log('Guest Mode:', localStorage.getItem('guestMode'));
console.log('Token:', localStorage.getItem('token'));
```

**Expected Result:**
- `guestMode` should be `null` or not exist
- `token` should have a value (JWT token string)

**If in Guest Mode:**
- Stars will NOT be saved
- User must log in or create an account
- Click "Login" or "Sign Up" buttons in the header

#### 2. Check Console Logs When Playing a Game

Play a game and complete a level. Watch the browser console for these logs:

```
LevelDisplay: Received showReward event
LevelDisplay: Raw stars value: [number or array]
LevelDisplay: Parsed star amount: [number]
LevelDisplay: addStars called with: [number]
LevelDisplay: Sending API request to add [number] stars
LevelDisplay: API response: {...}
LevelDisplay: Stars added successfully
```

**If you see errors:**
- Check the error message
- Common issues:
  - "No token found" → User not logged in
  - "401 Unauthorized" → Token expired, need to log in again
  - "500 Internal Server Error" → Backend database issue

#### 3. Check Backend Server is Running

Make sure the backend server is running:
```bash
cd edukiz/backend
npm start
```

Server should be running on `http://localhost:3000`

#### 4. Check Database Connection

Make sure MySQL/MariaDB is running (Laragon should be started)

Check database has the required tables:
```sql
USE edukiz;
SHOW TABLES;
-- Should see: user_levels, level_history
```

#### 5. Test API Endpoint Directly

You can test the API endpoint using the test script:

1. First, get your token:
   - Open browser console
   - Run: `localStorage.getItem('token')`
   - Copy the token value

2. Run the test script:
```bash
cd edukiz
test-star-system.bat YOUR_TOKEN_HERE
```

### Common Issues and Solutions:

#### Issue: "LevelDisplay: No token found"
**Solution:** User is in guest mode or not logged in. Log in with a real account.

#### Issue: No console logs at all
**Solution:** 
- Check if LevelDisplay component is mounted
- Check if game is emitting the showReward event
- Open browser console before playing the game

#### Issue: API returns 401 Unauthorized
**Solution:** Token expired. Log out and log in again.

#### Issue: API returns 500 Internal Server Error
**Solution:** 
- Check backend console for error details
- Verify database connection
- Check if user_levels table exists

#### Issue: Stars show in animation but don't persist
**Solution:** 
- Check if `rewards-updated` event is being emitted
- Check Header component is receiving the event
- Refresh the page and see if stars are still there

### Manual Database Check:

To verify stars are being saved:

```sql
USE edukiz;

-- Check your user's level data
SELECT * FROM user_levels WHERE user_id = YOUR_USER_ID;

-- Check level history
SELECT * FROM level_history WHERE user_id = YOUR_USER_ID ORDER BY leveled_up_at DESC;
```

### Files Modified for Better Debugging:

1. `src/components/LevelDisplay.vue` - Added extensive console logging
2. `src/components/Header.vue` - Added console logging for showReward event

### Next Steps if Still Not Working:

1. Share the console logs from the browser
2. Share the backend server logs
3. Confirm user is logged in (not guest mode)
4. Verify backend server is running
5. Check database connection in backend/.env file
