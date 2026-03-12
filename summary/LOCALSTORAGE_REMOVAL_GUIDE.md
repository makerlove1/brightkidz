# localStorage Removal - Complete Database Migration Guide

## Overview
This migration removes all localStorage usage for game data and moves everything to the database. The level/progress bar system has been fixed to update properly when stars are earned.

## What Was Changed

### 1. Database Tables Added

#### `user_preferences`
Stores user preferences (language, voice selection)
- `language`: User's selected language (en/tl/de)
- `selected_voice`: Voice preference (JSON)

#### `bkt_skills`
Stores Bayesian Knowledge Tracing skill data
- `skill_name`: letters, numbers, objects
- `p_l`: Knowledge probability
- `p_t`: Learning rate
- `p_s`: Slip rate
- `p_g`: Guess rate
- `attempts`: Total attempts
- `correct`: Correct answers

#### `bkt_history`
Stores BKT answer history
- `skill_name`: Skill being tracked
- `is_correct`: Whether answer was correct
- `old_p_l`: Previous knowledge probability
- `new_p_l`: New knowledge probability
- `timestamp`: When the answer was given

#### `game_levels`
Stores game-specific progress (e.g., CalculateNumbers0To18)
- `game_identifier`: Unique game name
- `selected_level`: Currently selected level
- `unlocked_levels`: Highest unlocked level

#### `user_levels` (updated)
Added `rewards` column to track current star count displayed in header

### 2. New Backend Routes

#### `/api/preferences`
- `GET /` - Get user preferences
- `POST /language` - Update language preference
- `POST /voice` - Update voice preference

#### `/api/bkt`
- `GET /skills` - Get all BKT skills
- `POST /skills/:skillName` - Update BKT skill
- `GET /history` - Get BKT history
- `POST /history` - Add BKT history entry

#### `/api/game-levels`
- `GET /:gameIdentifier` - Get game level progress
- `POST /:gameIdentifier` - Update game level progress

#### `/api/levels` (updated)
- Now returns `rewards` field in level data
- Properly updates `rewards` column when stars are added

### 3. Frontend Changes

#### Header.vue
- Removed localStorage.rewards usage
- Now loads rewards from database via API
- Auto-refreshes every 5 seconds
- Properly displays current star count

#### LevelDisplay.vue
- Removed localStorage sync logic
- Listens for 'add-stars' event from games
- Properly updates level and progress bar when stars are earned
- Emits 'rewards-updated' event to update header

#### LanguageManager.js
- Now saves language to database
- Falls back to localStorage for backward compatibility
- Loads from API when user is logged in

#### BKTModel.js
- Made async with initialize() method
- Saves/loads skills and history to/from database
- Falls back to localStorage when not logged in

#### SoundUtils.js
- Voice preference saved to database
- Falls back to localStorage for backward compatibility

#### progressTrackingMixin.js
- Removed localStorage.rewards update
- Emits 'add-stars' event instead

#### CalculateNumbers0To18.vue
- Uses gameLevelService instead of localStorage
- Properly saves/loads game progress to/from database

#### main.js
- Removed localStorage.rewards initialization

## How the Level System Works Now

### Star Earning Flow
1. User completes a game/activity
2. Game calls `updateRewards(stars)` from progressTrackingMixin
3. Mixin emits 'add-stars' event
4. LevelDisplay listens for event and calls API
5. Backend updates user_levels table (rewards, current_stars, total_stars_earned)
6. Backend checks for level ups (every 10 stars = 1 level)
7. Backend returns updated level data
8. LevelDisplay updates progress bar
9. LevelDisplay emits 'rewards-updated' event
10. Header updates star count display

### Level Progression
- Every 10 stars = 1 level up
- Progress bar shows stars toward next level (0-9)
- Multiple level ups possible in one action
- Level up modal shows for each level gained
- Milestone rewards at levels 5, 10, 25, 50, 75, 100, 150, 200

### Database Sync
- All star additions go through the database
- No more localStorage.rewards
- Progress bar updates immediately
- Level changes persist across sessions

## Migration Steps

### 1. Run Database Migration
```bash
cd edukiz
run-localstorage-migration.bat
```

Or manually:
```bash
cd backend
mysql -u root -p edukiz_db < migrations/remove_localstorage_migration.sql
```

### 2. Restart Backend Server
```bash
cd backend
npm start
```

The new routes will be automatically registered.

### 3. Clear Browser Data (Optional)
Users can optionally clear their browser localStorage to start fresh, but it's not required. The system will:
- Migrate existing localStorage data on first use
- Fall back to localStorage if not logged in
- Sync to database when logged in

## Backward Compatibility

The system maintains backward compatibility:
- localStorage is still used as fallback when not logged in
- Existing localStorage data is preserved
- Data syncs to database when user logs in
- No data loss during migration

## Testing

### Test Level System
1. Log in as a user
2. Complete a game that awards stars
3. Verify progress bar updates
4. Verify star count in header updates
5. Earn 10+ stars to test level up
6. Verify level up modal appears
7. Verify level number increases

### Test Preferences
1. Change language
2. Refresh page
3. Verify language persists
4. Change voice
5. Verify voice persists

### Test Game Progress
1. Play CalculateNumbers0To18
2. Complete levels
3. Refresh page
4. Verify level progress persists

## Files Created
- `backend/migrations/remove_localstorage_migration.sql`
- `backend/routes/preferences.js`
- `backend/routes/bkt.js`
- `backend/routes/gameLevels.js`
- `src/services/gameLevelService.js`
- `run-localstorage-migration.bat`
- `LOCALSTORAGE_REMOVAL_GUIDE.md`

## Files Modified
- `backend/server.js` - Added new routes
- `backend/routes/levels.js` - Added rewards column support
- `src/components/Header.vue` - Database-based rewards
- `src/components/LevelDisplay.vue` - Fixed level progression
- `src/mixins/progressTrackingMixin.js` - Event-based updates
- `src/utils/LanguageManager.js` - Database storage
- `src/utils/BKTModel.js` - Database storage
- `src/components/utils/SoundUtils.js` - Database storage
- `src/components/misc/CalculateNumbers0To18.vue` - Database storage
- `src/main.js` - Removed localStorage init

## Benefits

1. **Data Persistence**: User progress saved to database, not browser
2. **Cross-Device**: Progress syncs across devices when logged in
3. **No Data Loss**: Database backups protect user progress
4. **Better Performance**: No localStorage size limits
5. **Analytics**: Can track user progress server-side
6. **Fixed Level System**: Progress bar updates properly when stars are earned
7. **Real-time Updates**: Level changes reflect immediately

## Troubleshooting

### Progress bar not updating
- Check browser console for API errors
- Verify backend server is running
- Check that user is logged in
- Verify 'add-stars' event is being emitted

### Stars not increasing
- Check that progressTrackingMixin is being used
- Verify API endpoint `/api/levels/add-stars` is working
- Check database user_levels table for updates

### Level not increasing
- Verify stars are being added to database
- Check that 10 stars = 1 level logic is working
- Look for level_history entries in database

### Preferences not saving
- Check that user is logged in
- Verify API endpoints are accessible
- Check browser console for errors
- Falls back to localStorage if API fails

## Next Steps

1. Run the migration
2. Test the level system thoroughly
3. Monitor for any issues
4. Consider adding more game progress tracking
5. Add analytics for user progression

## Support

If you encounter issues:
1. Check browser console for errors
2. Check backend logs
3. Verify database tables were created
4. Test with a fresh user account
5. Clear browser cache and localStorage
