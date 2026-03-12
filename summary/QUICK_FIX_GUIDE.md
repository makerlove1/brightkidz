# Quick Fix for Star System Issues

## Most Common Issue: User is in Guest Mode or Not Logged In

### Symptoms:
- Stars show in animation but don't persist
- Progress bar doesn't update
- "Failed to load resource: 500 Internal Server Error"
- No console logs when playing games

### Quick Fix Steps:

#### 1. Check if you're in Guest Mode
Open browser console (F12) and run:
```javascript
console.log('Guest Mode:', localStorage.getItem('guestMode'));
```

**If it says `true`:**
```javascript
// Exit guest mode
localStorage.removeItem('guestMode');
location.reload();
```

#### 2. Check if you have a valid token
```javascript
console.log('Token:', localStorage.getItem('token'));
```

**If no token or token is invalid:**
```javascript
// Clear invalid token
localStorage.removeItem('token');
localStorage.removeItem('username');
// Go to login page
window.location.href = '/';
```

#### 3. Log in with a real account
1. Go to the login page
2. Use existing credentials or create new account
3. **DO NOT** click "Continue as Guest"

#### 4. Test after logging in
1. Play a game (e.g., Quiz Game)
2. Check browser console for logs
3. Stars should now be saved

## If Still Not Working:

### 1. Run the diagnostic script
Copy and paste the contents of `DIAGNOSTIC_SCRIPT.js` into browser console

### 2. Check backend is running
```bash
# In edukiz/backend directory
npm start
```

### 3. Test API directly
Open `edukiz/test-star-flow.html` in browser and test the API

### 4. Check database
Make sure MySQL is running (Laragon should be started)

## Files to Check:

### Backend (Should be running):
- `edukiz/backend/server.js` - Main server
- `edukiz/backend/routes/levels.js` - Level API routes
- Database tables: `user_levels`, `level_history`

### Frontend (Check browser console):
- `src/components/Header.vue` - Loads rewards
- `src/components/LevelDisplay.vue` - Adds stars
- Game components (e.g., `QuizGame.vue`) - Emit `showReward` event

## Most Likely Fix:
**90% of cases:** User is in guest mode. Log in with a real account.

**9% of cases:** Invalid/expired token. Log out and log in again.

**1% of cases:** Backend/database issue. Run `FIX_STAR_SYSTEM.bat`.