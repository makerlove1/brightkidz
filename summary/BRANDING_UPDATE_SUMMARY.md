# Branding Update: EduKiz → BrightKidz

## Changes Made

### 1. Application Name Updates
- ✅ Login page: Changed "EduKiz" to "BrightKidz"
- ✅ PWA manifest: Updated app name to "BrightKidz"
- ✅ vue.config.js: Updated PWA configuration
- ✅ package.json: Already set to "brightkidz"

### 2. Database Updates
- ✅ Changed database name from `edukiz` to `brightkidz_db`
- ✅ Updated backend/.env file
- ✅ Updated JWT secret key

### 3. Logout Fix
- ✅ Added form reset on component mount
- ✅ Added `resetForm()` method to clear all fields
- ✅ Updated `toggleMode()` to call `resetForm()`
- ✅ Added `guestMode` cleanup on logout
- ✅ Added `window.location.href` redirect to force page reload after logout

## Files Modified

1. `src/components/Login.vue` - Updated branding and added form reset
2. `src/services/authService.js` - Added guest mode cleanup and force reload on logout
3. `vue.config.js` - Updated PWA name to BrightKidz
4. `backend/.env` - Updated database name and JWT secret

## Database Migration Required

You need to rename your database or create a new one:

### Option 1: Rename Existing Database
```sql
-- In MySQL/phpMyAdmin
RENAME DATABASE edukiz TO brightkidz_db;
-- Note: RENAME DATABASE is not supported in newer MySQL versions
-- Use Option 2 instead
```

### Option 2: Create New Database (Recommended)
```sql
-- 1. Create new database
CREATE DATABASE brightkidz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 2. Export old database
-- In Laragon: Open phpMyAdmin → Select edukiz → Export → Go

-- 3. Import to new database
-- In Laragon: Open phpMyAdmin → Select brightkidz_db → Import → Choose file → Go

-- 4. (Optional) Drop old database
DROP DATABASE edukiz;
```

### Option 3: Use mysqldump (Command Line)
```bash
# Export
mysqldump -u root -p edukiz > edukiz_backup.sql

# Create new database
mysql -u root -p -e "CREATE DATABASE brightkidz_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;"

# Import
mysql -u root -p brightkidz_db < edukiz_backup.sql
```

## Testing Checklist

- [ ] Database renamed/created successfully
- [ ] Backend starts without errors
- [ ] Login page shows "BrightKidz" branding
- [ ] Login works correctly
- [ ] Logout clears form fields
- [ ] Logout redirects to login page
- [ ] Guest mode works
- [ ] PWA name shows as "BrightKidz"

## Logout Fix Details

### Problem
After logout, the login form fields were empty/not resetting properly.

### Solution
1. Added `resetForm()` method that clears all form data
2. Called `resetForm()` on component mount
3. Called `resetForm()` when toggling between login/register
4. Added `window.location.href = '/#/'` to force page reload after logout
5. Added `localStorage.removeItem('guestMode')` to cleanup

### How It Works Now
```javascript
// On logout
authService.logout() 
  → Clears localStorage (token, user, sessionId, guestMode)
  → Forces page reload with window.location.href
  → Login component mounts fresh
  → resetForm() called
  → All fields are empty and ready
```

## Notes

- The app name "BrightKidz" is now consistent throughout
- Database name changed to `brightkidz_db` for consistency
- Logout now properly resets the form
- Guest mode is properly cleaned up on logout
- Page reload ensures clean state after logout

## Next Steps

1. Run database migration (see above)
2. Restart backend server
3. Test login/logout flow
4. Verify branding appears correctly
5. Test guest mode
6. Check PWA installation shows "BrightKidz"
