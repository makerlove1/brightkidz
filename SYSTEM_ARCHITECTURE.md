# EduKiz Admin System Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         EduKiz App                          │
│                    (Vue.js Frontend)                        │
│                   http://localhost:8080                     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST API
                              │ (axios)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      Backend API                            │
│                  (Node.js + Express)                        │
│                   http://localhost:3000                     │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │ Auth Routes  │  │ User Routes  │  │ Admin Routes │    │
│  │ /api/auth/*  │  │ /api/users/* │  │ /api/admin/* │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │         JWT Authentication Middleware            │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ MySQL Protocol
                              │ (mysql2)
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                      MySQL Database                         │
│                    (Laragon MySQL)                          │
│                      localhost:3306                         │
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │    users     │  │user_sessions │  │user_progress │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
│  ┌──────────────────────────────────────────────────┐     │
│  │            game_statistics                       │     │
│  └──────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────┘
```

## Component Architecture

### Frontend Components

```
App.vue
├── Router
│   ├── Login.vue
│   │   └── authService
│   │
│   ├── Home.vue (Games Menu)
│   │   ├── Memory Games
│   │   ├── Drag & Drop Games
│   │   └── Misc Games
│   │       └── progressTrackingMixin
│   │
│   ├── UserProfile.vue
│   │   ├── authService
│   │   └── progressService
│   │
│   └── AdminDashboard.vue
│       ├── authService
│       └── adminService
│
└── LanguageSwitcher.vue
```

### Backend Routes

```
server.js
├── /api/auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── GET /me
│
├── /api/users (requires auth)
│   ├── GET /stats
│   ├── GET /progress
│   └── GET /login-history
│
├── /api/progress (requires auth)
│   ├── POST /save
│   └── POST /rewards
│
└── /api/admin (requires admin)
    ├── GET /dashboard
    ├── GET /users
    ├── GET /users/:id
    ├── GET /logins/stats
    ├── GET /progress/stats
    └── PATCH /users/:id/toggle-active
```

## Data Flow

### User Registration Flow

```
1. User fills registration form
   └─> Login.vue

2. Submit registration
   └─> authService.register()

3. POST /api/auth/register
   └─> Backend validates data

4. Hash password with bcrypt
   └─> Store in database

5. Return success
   └─> Show success message
   └─> Switch to login form
```

### Login Flow

```
1. User enters credentials
   └─> Login.vue

2. Submit login
   └─> authService.login()

3. POST /api/auth/login
   └─> Backend validates credentials

4. Generate JWT token
   └─> Create session record

5. Return token + user data
   └─> Store in localStorage
   └─> Redirect to home/admin
```

### Game Progress Tracking Flow

```
1. Game component mounts
   └─> startGameTracking('memory', 'Memory Animals')
   └─> Record start time

2. User plays game
   └─> Game logic runs

3. Game completes
   └─> saveGameProgress(score, level, completed)

4. Calculate time spent
   └─> POST /api/progress/save

5. Update database
   ├─> user_progress table
   └─> game_statistics table

6. Update rewards
   └─> updateRewards(points)
   └─> POST /api/progress/rewards
```

### Admin Dashboard Flow

```
1. Admin logs in
   └─> Redirect to /admin

2. Load dashboard data
   ├─> GET /api/admin/dashboard
   ├─> GET /api/admin/users
   └─> GET /api/admin/progress/stats

3. Display statistics
   ├─> Total users
   ├─> Active users
   ├─> Total logins
   └─> Total games

4. View user details
   └─> Click user
   └─> GET /api/admin/users/:id
   └─> Show modal with details
```

## Database Schema

### Entity Relationship Diagram

```
┌─────────────────┐
│     users       │
├─────────────────┤
│ id (PK)         │
│ username        │
│ email           │
│ password        │
│ role            │
│ created_at      │
│ last_login      │
└─────────────────┘
        │
        │ 1:N
        ▼
┌─────────────────┐
│ user_sessions   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ login_time      │
│ logout_time     │
│ session_duration│
└─────────────────┘

        │
        │ 1:N
        ▼
┌─────────────────┐
│ user_progress   │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ game_type       │
│ game_name       │
│ score           │
│ level_completed │
│ time_spent      │
│ completed       │
└─────────────────┘

        │
        │ 1:1
        ▼
┌─────────────────┐
│game_statistics  │
├─────────────────┤
│ id (PK)         │
│ user_id (FK)    │
│ total_games     │
│ total_score     │
│ total_time      │
│ rewards_earned  │
└─────────────────┘
```

## Authentication Flow

### JWT Token Structure

```
Header:
{
  "alg": "HS256",
  "typ": "JWT"
}

Payload:
{
  "id": 1,
  "username": "admin",
  "role": "admin",
  "iat": 1234567890,
  "exp": 1234654290
}

Signature:
HMACSHA256(
  base64UrlEncode(header) + "." +
  base64UrlEncode(payload),
  JWT_SECRET
)
```

### Protected Route Flow

```
1. Client makes request
   └─> Include: Authorization: Bearer <token>

2. Middleware intercepts
   └─> verifyToken()

3. Verify JWT signature
   └─> jwt.verify(token, JWT_SECRET)

4. Check expiration
   └─> Token valid?

5. Extract user info
   └─> req.userId = decoded.id
   └─> req.userRole = decoded.role

6. Check admin role (if needed)
   └─> isAdmin() middleware

7. Allow request
   └─> next()
```

## Security Layers

```
┌─────────────────────────────────────────┐
│         Application Layer               │
│  - Input validation                     │
│  - XSS prevention                       │
│  - CSRF protection                      │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│      Authentication Layer               │
│  - JWT tokens                           │
│  - Password hashing (bcrypt)            │
│  - Role-based access                    │
└─────────────────────────────────────────┘
                  │
┌─────────────────────────────────────────┐
│         Database Layer                  │
│  - Prepared statements                  │
│  - SQL injection prevention             │
│  - Foreign key constraints              │
└─────────────────────────────────────────┘
```

## Deployment Architecture

### Development (Current)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│  Vue Dev     │────▶│   Backend    │
│ localhost:   │     │  Server      │     │   Server     │
│   8080       │     │ localhost:   │     │ localhost:   │
│              │     │   8080       │     │   3000       │
└──────────────┘     └──────────────┘     └──────────────┘
                                                  │
                                                  ▼
                                          ┌──────────────┐
                                          │   Laragon    │
                                          │   MySQL      │
                                          │ localhost:   │
                                          │   3306       │
                                          └──────────────┘
```

### Production (Recommended)

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│   Browser    │────▶│   Nginx      │────▶│   Backend    │
│   HTTPS      │     │  (Reverse    │     │   (PM2)      │
│              │     │   Proxy)     │     │              │
└──────────────┘     └──────────────┘     └──────────────┘
                            │                     │
                            │                     ▼
                            │              ┌──────────────┐
                            │              │   MySQL      │
                            │              │  (Remote)    │
                            │              │   SSL        │
                            │              └──────────────┘
                            ▼
                     ┌──────────────┐
                     │  Static      │
                     │  Files       │
                     │  (Vue Build) │
                     └──────────────┘
```

## File Organization

```
edukiz/
│
├── Frontend (Vue.js)
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── services/        # API communication
│   │   ├── mixins/          # Reusable logic
│   │   ├── utils/           # Utilities
│   │   └── main.js          # Entry point
│   │
│   ├── public/              # Static assets
│   └── .env                 # Frontend config
│
├── Backend (Node.js)
│   ├── config/              # Configuration
│   ├── middleware/          # Express middleware
│   ├── routes/              # API routes
│   ├── scripts/             # Utility scripts
│   ├── server.js            # Entry point
│   └── .env                 # Backend config
│
├── Documentation
│   ├── ADMIN_SETUP_GUIDE.md
│   ├── QUICK_START.md
│   ├── INTEGRATION_EXAMPLE.md
│   ├── ADMIN_SYSTEM_SUMMARY.md
│   └── SYSTEM_ARCHITECTURE.md (this file)
│
└── Scripts
    ├── setup-admin-system.bat
    ├── start-admin-system.bat
    └── check-setup.bat
```

## Technology Stack

### Frontend
- **Framework:** Vue.js 3
- **Router:** Vue Router 4
- **HTTP Client:** Axios
- **Styling:** SCSS
- **Icons:** Font Awesome

### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MySQL 8
- **Authentication:** JWT + bcrypt
- **Environment:** dotenv

### Database
- **DBMS:** MySQL 8.0
- **Connection Pool:** mysql2
- **Charset:** utf8mb4

## Performance Considerations

### Frontend
- Lazy loading routes
- Component caching
- API response caching
- Debounced search

### Backend
- Connection pooling
- Prepared statements
- Indexed queries
- Response compression

### Database
- Indexed columns
- Optimized queries
- Views for reporting
- Regular maintenance

## Scalability

### Current Capacity
- Supports 100+ concurrent users
- Handles 1000+ games/day
- Stores unlimited progress data

### Future Scaling
- Add Redis for caching
- Implement load balancing
- Database replication
- CDN for static assets

---

**Version:** 1.0.0  
**Last Updated:** 2024
