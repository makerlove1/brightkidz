# System Architecture - After localStorage Migration

## Data Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER PLAYS GAME                          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Game Component (Vue)                          │
│  • Uses progressTrackingMixin                                    │
│  • Calls updateRewards(stars)                                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                  progressTrackingMixin                           │
│  • Emits 'add-stars' event                                       │
│  • No localStorage usage                                         │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LevelDisplay Component                        │
│  • Listens for 'add-stars' event                                │
│  • Calls API: POST /api/levels/add-stars                        │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend API (Express)                         │
│  • Receives star count                                           │
│  • Updates user_levels table                                     │
│  • Checks for level ups (10 stars = 1 level)                    │
│  • Records level_history                                         │
│  • Returns updated level data                                    │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MySQL Database                                │
│  • user_levels: current_level, current_stars, rewards           │
│  • level_history: level up events                               │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Response to Frontend                          │
│  • leveledUp: boolean                                            │
│  • levelsGained: array of level ups                             │
│  • level: { currentLevel, currentStars, rewards, ... }          │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    LevelDisplay Updates                          │
│  • Updates progress bar (0-9 stars)                             │
│  • Shows level up modal if needed                               │
│  • Emits 'rewards-updated' event                                │
└─────────────────────────────────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Header Component                              │
│  • Listens for 'rewards-updated' event                          │
│  • Updates star count display                                    │
│  • Shows star animation                                          │
└─────────────────────────────────────────────────────────────────┘
```

## Component Relationships

```
┌──────────────────────────────────────────────────────────────────┐
│                           App.vue                                 │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                        Header.vue                           │  │
│  │  • Displays star count (from database)                     │  │
│  │  • Auto-refreshes every 5 seconds                          │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │  │
│  │  │ LevelDisplay │  │ StreakBadge  │  │LanguageSwitcher│   │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘    │  │
│  └────────────────────────────────────────────────────────────┘  │
│                                                                   │
│  ┌────────────────────────────────────────────────────────────┐  │
│  │                    Game Components                          │  │
│  │  • CalculateNumbers0To18                                   │  │
│  │  • MemoryGame                                              │  │
│  │  • DragDropGame                                            │  │
│  │  • QuizGame                                                │  │
│  │                                                             │  │
│  │  All use: progressTrackingMixin                            │  │
│  └────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────┘
```

## Database Schema

```
┌─────────────────────────────────────────────────────────────────┐
│                            users                                 │
│  • id (PK)                                                       │
│  • username                                                      │
│  • email                                                         │
│  • password                                                      │
│  • role                                                          │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:1
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        user_levels                               │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • current_level (1, 2, 3, ...)                                 │
│  • current_stars (0-9)                                          │
│  • total_stars_earned (lifetime total)                          │
│  • rewards (current star count for header)                      │
│  • stars_to_next_level (always 10)                             │
│  • level_up_count                                               │
│  • last_level_up                                                │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                       level_history                              │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • old_level                                                     │
│  • new_level                                                     │
│  • stars_at_levelup                                             │
│  • leveled_up_at                                                │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                      user_preferences                            │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • language (en/tl/de)                                          │
│  • selected_voice (JSON)                                        │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         bkt_skills                               │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • skill_name (letters/numbers/objects)                         │
│  • p_l (knowledge probability)                                  │
│  • p_t (learning rate)                                          │
│  • p_s (slip rate)                                              │
│  • p_g (guess rate)                                             │
│  • attempts                                                      │
│  • correct                                                       │
└─────────────────────────────────────────────────────────────────┘
         │
         │ 1:N
         ▼
┌─────────────────────────────────────────────────────────────────┐
│                        bkt_history                               │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • skill_name                                                    │
│  • is_correct                                                    │
│  • old_p_l                                                       │
│  • new_p_l                                                       │
│  • timestamp                                                     │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                        game_levels                               │
│  • id (PK)                                                       │
│  • user_id (FK) → users.id                                      │
│  • game_identifier (calculateNumbers0To18, etc.)                │
│  • selected_level                                               │
│  • unlocked_levels                                              │
└─────────────────────────────────────────────────────────────────┘
```

## API Routes

```
/api
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET  /me
│
├── /levels
│   ├── GET  /current          → Get level data (includes rewards)
│   ├── POST /add-stars        → Add stars, check level ups
│   └── GET  /leaderboard      → Top users by level
│
├── /preferences
│   ├── GET  /                 → Get user preferences
│   ├── POST /language         → Update language
│   └── POST /voice            → Update voice
│
├── /bkt
│   ├── GET  /skills           → Get all BKT skills
│   ├── POST /skills/:name     → Update BKT skill
│   ├── GET  /history          → Get BKT history
│   └── POST /history          → Add BKT history entry
│
├── /game-levels
│   ├── GET  /:gameId          → Get game progress
│   └── POST /:gameId          → Update game progress
│
├── /streaks
│   ├── GET  /current          → Get streak data
│   ├── POST /check-in         → Daily check-in
│   └── GET  /leaderboard      → Top streaks
│
└── /progress
    ├── POST /save             → Save game progress
    └── GET  /stats            → Get user statistics
```

## Before vs After

### Before (localStorage)
```
Game → localStorage.rewards++ → Header reads localStorage
                              → No level tracking
                              → No progress bar
                              → Data lost on browser clear
```

### After (Database)
```
Game → API call → Database update → Response
                                 → LevelDisplay updates
                                 → Progress bar updates
                                 → Header updates
                                 → Level up modal
                                 → Data persists forever
                                 → Cross-device sync
```

## Level Progression Logic

```
Current Stars: 7
Award: 15 stars
─────────────────────────────────────────

Step 1: Add stars
  7 + 15 = 22 stars

Step 2: Check level ups
  22 ÷ 10 = 2 level ups, 2 stars remaining
  
Step 3: Process level ups
  Level 5 → Level 6 (first 10 stars)
  Level 6 → Level 7 (next 10 stars)
  
Step 4: Update database
  current_level = 7
  current_stars = 2
  total_stars_earned += 15
  rewards += 15
  
Step 5: Record history
  level_history: 5→6, 6→7
  
Step 6: Return response
  leveledUp: true
  levelsGained: [
    { level: 6, reward: {...} },
    { level: 7, reward: {...} }
  ]
  level: {
    currentLevel: 7,
    currentStars: 2,
    rewards: 157,
    progressPercentage: 20
  }
```

## Event Flow

```
┌──────────────┐
│ Game Complete│
└──────┬───────┘
       │
       │ updateRewards(5)
       ▼
┌──────────────────┐
│progressTracking  │
│     Mixin        │
└──────┬───────────┘
       │
       │ emit('add-stars', 5)
       ▼
┌──────────────────┐
│  LevelDisplay    │
└──────┬───────────┘
       │
       │ POST /api/levels/add-stars
       ▼
┌──────────────────┐
│   Backend API    │
└──────┬───────────┘
       │
       │ Update database
       ▼
┌──────────────────┐
│   MySQL DB       │
└──────┬───────────┘
       │
       │ Return level data
       ▼
┌──────────────────┐
│  LevelDisplay    │
│  • Update UI     │
│  • Show modal    │
└──────┬───────────┘
       │
       │ emit('rewards-updated', 157)
       ▼
┌──────────────────┐
│     Header       │
│  • Update stars  │
└──────────────────┘
```

## Key Improvements

1. **Data Persistence**
   - Before: Browser localStorage (can be cleared)
   - After: MySQL database (permanent)

2. **Cross-Device Sync**
   - Before: Each device has own data
   - After: Data syncs across all devices

3. **Level System**
   - Before: Not working, no progress bar
   - After: Fully functional with progress bar

4. **Real-time Updates**
   - Before: Manual localStorage updates
   - After: Event-driven, automatic updates

5. **Analytics**
   - Before: No server-side tracking
   - After: Full history in database

6. **Scalability**
   - Before: Limited by localStorage (5-10MB)
   - After: Unlimited database storage
