# Testing Frontend Star System Flow

## Backend Status: ✅ WORKING
The backend API is working perfectly as shown by the test:
- GET `/api/levels/current` - Success
- POST `/api/levels/add-stars` - Success
- Stars are being saved to database
- Progress percentage is updating

## Frontend Testing Steps:

### 1. Check if Frontend is Running
Make sure the Vue.js frontend is running:
```bash
cd edukiz
npm run serve
```
Frontend should be at: `http://localhost:8080`

### 2. Check Authentication Status
Open browser console (F12) and run:
```javascript
console.log('Guest Mode:', localStorage.getItem('guestMode'));
console.log('Token:', localStorage.getItem('token'));
console.log('Username:', localStorage.getItem('username'));
```

**Expected:**
- `guestMode`: `null` or not exist
- `token`: JWT token string (starts with `eyJ...`)
- `username`: Your username

**If in Guest Mode:**
- Click "Login" or "Sign Up" in the header
- Or go to `http://localhost:8080` and log in

### 3. Enable Console Logging
The frontend has been updated with extensive logging. Make sure to:
1. Open browser console (F12) **before** playing any games
2. Look for these logs when playing:

```
Header: Loading rewards with token: eyJhbGciOiJIUzI1NiIs...
Header: Rewards loaded successfully: {...}
LevelDisplay: Loading level data...
LevelDisplay: Level data loaded: {...}
LevelDisplay: Received showReward event
LevelDisplay: addStars called with: 1
LevelDisplay: Sending API request to add 1 stars
LevelDisplay: API response: {...}
LevelDisplay: Stars added successfully
Header: Updating rewards from X to Y
```

### 4. Test with Quiz Game
1. Go to: `http://localhost:8080/#/misc/quiz`
2. Open browser console (F12)
3. Answer a question correctly
4. Watch for the logs above

### 5. Check Visual Feedback
After earning stars:
- The star animation should play in the header
- The progress bar should update
- The star count should increase
- The level badge should show updated progress

### 6. Test Direct API with Browser
Open the test page: `edukiz/test-star-flow.html` in your browser

Use this to:
1. Check your current authentication status
2. Get your current level
3. Add stars directly
4. Verify the API is working with YOUR token

### 7. Common Frontend Issues:

#### Issue: "Failed to load resource: the server responded with a status of 500"
**Causes:**
1. Invalid/expired token
2. User not logged in
3. Backend server not running

**Solutions:**
1. Log out and log in again
2. Check if backend is running (`npm start` in backend)
3. Check browser console for detailed error

#### Issue: No console logs when playing games
**Causes:**
1. User is in guest mode
2. LevelDisplay component not mounted
3. Game not emitting `showReward` event

**Solutions:**
1. Make sure you're logged in (not guest mode)
2. Check if LevelDisplay is in the header
3. Check game component code

#### Issue: Stars show in animation but progress bar doesn't update
**Causes:**
1. `rewards-updated` event not being emitted
2. Header component not updating
3. API response not being processed

**Solutions:**
1. Check console for `rewards-updated` event
2. Refresh page to see if stars persist
3. Check API response in console

### 8. Quick Diagnostic Test
Run this in browser console:
```javascript
// Test 1: Check authentication
const token = localStorage.getItem('token');
const guestMode = localStorage.getItem('guestMode');
console.log('Auth Check:', { token: token ? 'Present' : 'Missing', guestMode });

// Test 2: Test API directly
if (token) {
  fetch('http://localhost:3000/api/levels/current', {
    headers: { Authorization: `Bearer ${token}` }
  })
  .then(r => r.json())
  .then(data => console.log('API Test Success:', data))
  .catch(err => console.error('API Test Failed:', err));
}
```

### 9. Files Modified for Debugging:
1. `src/components/Header.vue` - Added detailed logging and error handling
2. `src/components/LevelDisplay.vue` - Added extensive logging
3. `backend/routes/levels.js` - Fixed database queries
4. `backend/fix-level-tables.js` - Fixed missing database tables
5. `test-star-flow.html` - Direct API testing page

### 10. Next Steps:
If stars are still not working after following this guide:
1. Share the **browser console logs**
2. Share the **backend server logs**
3. Confirm you're **logged in** (not guest mode)
4. Verify **both frontend and backend** are running

## Summary:
The backend is now working perfectly. The issue is likely:
- User authentication (guest mode or invalid token)
- Frontend event handling
- Browser console will show the exact error