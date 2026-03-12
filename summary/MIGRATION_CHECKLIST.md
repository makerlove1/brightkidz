# localStorage to Database Migration - Checklist

## Pre-Migration

- [ ] Backup database: `mysqldump -u root -p edukiz_db > backup_before_migration.sql`
- [ ] Backup localStorage data (optional): Export from browser DevTools
- [ ] Ensure backend is stopped
- [ ] Ensure no users are currently using the system

## Migration Steps

### 1. Database Migration
- [ ] Run: `run-localstorage-migration.bat`
- [ ] Verify no errors in output
- [ ] Check tables created:
  ```sql
  USE edukiz_db;
  SHOW TABLES LIKE 'user_preferences';
  SHOW TABLES LIKE 'bkt_skills';
  SHOW TABLES LIKE 'bkt_history';
  SHOW TABLES LIKE 'game_levels';
  DESCRIBE user_levels; -- Check for 'rewards' column
  ```

### 2. Backend Update
- [ ] Verify new route files exist:
  - `backend/routes/preferences.js`
  - `backend/routes/bkt.js`
  - `backend/routes/gameLevels.js`
- [ ] Check `backend/server.js` has new routes registered
- [ ] Start backend: `cd backend && npm start`
- [ ] Verify no startup errors
- [ ] Check routes are accessible:
  - `http://localhost:3000/api/health` (should return OK)

### 3. Frontend Update
- [ ] Verify updated files:
  - `src/components/Header.vue`
  - `src/components/LevelDisplay.vue`
  - `src/mixins/progressTrackingMixin.js`
  - `src/utils/LanguageManager.js`
  - `src/utils/BKTModel.js`
  - `src/components/utils/SoundUtils.js`
  - `src/components/misc/CalculateNumbers0To18.vue`
  - `src/main.js`
- [ ] New service file exists: `src/services/gameLevelService.js`
- [ ] Start frontend: `npm run serve`
- [ ] Verify no compilation errors

## Post-Migration Testing

### Authentication
- [ ] User can log in successfully
- [ ] Token is stored in localStorage (this is correct)
- [ ] User data loads correctly

### Star/Reward System
- [ ] Header displays current star count
- [ ] Star count loads from database (not localStorage)
- [ ] Complete a game that awards stars
- [ ] Star count increases in header
- [ ] Verify in database: `SELECT * FROM user_levels WHERE user_id = X;`

### Level System
- [ ] LevelDisplay badge shows in header
- [ ] Current level displays correctly
- [ ] Progress bar shows correct percentage
- [ ] Award stars to user (complete games)
- [ ] Progress bar updates immediately
- [ ] After 10 stars, level increases
- [ ] Level up modal appears
- [ ] Multiple level ups work (award 25+ stars)
- [ ] Verify in database: `SELECT * FROM user_levels WHERE user_id = X;`
- [ ] Check level history: `SELECT * FROM level_history WHERE user_id = X;`

### Language Preferences
- [ ] Change language to Filipino
- [ ] Refresh page
- [ ] Language persists (loads from database)
- [ ] Verify in database: `SELECT * FROM user_preferences WHERE user_id = X;`
- [ ] Change language to German
- [ ] Verify persistence again
- [ ] Log out and log back in
- [ ] Language still persists

### Voice Preferences
- [ ] Change voice selection
- [ ] Refresh page
- [ ] Voice preference persists
- [ ] Verify in database: `SELECT * FROM user_preferences WHERE user_id = X;`

### BKT System
- [ ] Play a game that uses BKT (letters/numbers/objects)
- [ ] Answer questions correctly and incorrectly
- [ ] Verify BKT data saves to database
- [ ] Check: `SELECT * FROM bkt_skills WHERE user_id = X;`
- [ ] Check: `SELECT * FROM bkt_history WHERE user_id = X ORDER BY created_at DESC LIMIT 10;`

### Game Progress (CalculateNumbers0To18)
- [ ] Start CalculateNumbers0To18 game
- [ ] Note current level
- [ ] Complete rounds to unlock next level
- [ ] Refresh page
- [ ] Verify level progress persists
- [ ] Check database: `SELECT * FROM game_levels WHERE user_id = X AND game_identifier = 'calculateNumbers0To18';`

### Cross-Device Sync (if applicable)
- [ ] Log in on Device A
- [ ] Complete games, earn stars
- [ ] Log in on Device B with same account
- [ ] Verify stars, level, and progress match
- [ ] Change language on Device B
- [ ] Check Device A reflects language change

### Backward Compatibility
- [ ] Log out
- [ ] Clear database user data (optional)
- [ ] Use app without logging in
- [ ] Verify localStorage fallback works
- [ ] Complete games
- [ ] Verify localStorage is used
- [ ] Log in
- [ ] Verify data syncs to database

## Performance Testing

- [ ] Load time is acceptable
- [ ] No lag when earning stars
- [ ] Progress bar updates smoothly
- [ ] Level up animation is smooth
- [ ] No console errors
- [ ] No network errors in DevTools

## Database Verification

Run these queries to verify data integrity:

```sql
-- Check user_levels has rewards column
DESCRIBE user_levels;

-- Check all users have level records
SELECT COUNT(*) FROM users WHERE role = 'user';
SELECT COUNT(*) FROM user_levels;
-- These should match

-- Check rewards match total_stars_earned
SELECT user_id, rewards, total_stars_earned 
FROM user_levels 
WHERE rewards != total_stars_earned;
-- Should be empty or minimal

-- Check new tables have data
SELECT COUNT(*) FROM user_preferences;
SELECT COUNT(*) FROM bkt_skills;
SELECT COUNT(*) FROM bkt_history;
SELECT COUNT(*) FROM game_levels;

-- Check for orphaned records
SELECT * FROM user_preferences WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM bkt_skills WHERE user_id NOT IN (SELECT id FROM users);
SELECT * FROM game_levels WHERE user_id NOT IN (SELECT id FROM users);
-- All should be empty
```

## Rollback Plan (if needed)

If migration fails:

1. Stop backend and frontend
2. Restore database backup:
   ```bash
   mysql -u root -p edukiz_db < backup_before_migration.sql
   ```
3. Revert code changes (use git)
4. Restart services
5. Investigate issues

## Common Issues

### Issue: Progress bar not updating
**Solution:**
- Check browser console for API errors
- Verify backend is running
- Check user is logged in
- Verify 'add-stars' event is emitted

### Issue: Stars not increasing
**Solution:**
- Check progressTrackingMixin is used in game
- Verify `/api/levels/add-stars` endpoint works
- Check database user_levels table

### Issue: Level not increasing
**Solution:**
- Verify 10 stars = 1 level logic
- Check level_history table for entries
- Verify current_stars resets to 0-9 range

### Issue: Preferences not saving
**Solution:**
- Check user is logged in
- Verify API endpoints accessible
- Check browser console for errors
- Verify database tables exist

### Issue: Migration SQL errors
**Solution:**
- Check MySQL version compatibility
- Verify database user has permissions
- Check for existing table conflicts
- Run migration manually line by line

## Sign-Off

- [ ] All tests passed
- [ ] No critical errors
- [ ] Performance acceptable
- [ ] Documentation updated
- [ ] Team notified of changes
- [ ] Backup verified
- [ ] Rollback plan tested

**Migrated by:** _______________
**Date:** _______________
**Sign-off:** _______________

## Notes

Additional observations or issues encountered:

_____________________________________________
_____________________________________________
_____________________________________________
