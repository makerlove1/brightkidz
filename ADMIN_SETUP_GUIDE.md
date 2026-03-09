# Admin System Setup Guide

This guide will help you set up the admin system with user authentication and MySQL database integration using Laragon.

## Prerequisites

- Laragon installed and running (https://laragon.org/)
- Node.js 16+ installed
- MySQL running in Laragon

## Step 1: Database Setup

### 1.1 Start Laragon
1. Open Laragon
2. Click "Start All" to start Apache and MySQL

### 1.2 Create Database
1. In Laragon, click "Database" → "Open"
2. This will open HeidiSQL or phpMyAdmin
3. Run the SQL script from `backend/config/init-database.sql`

**OR** use command line:
```bash
# Navigate to Laragon's MySQL bin directory
cd C:\laragon\bin\mysql\mysql-8.0.30-winx64\bin

# Login to MySQL (default password is empty)
mysql -u root -p

# Run the initialization script
source /path/to/edukiz/backend/config/init-database.sql
```

### 1.3 Verify Database
```sql
USE edukiz;
SHOW TABLES;
-- You should see: users, user_sessions, user_progress, game_statistics
```

## Step 2: Backend Setup

### 2.1 Install Backend Dependencies
```bash
cd backend
npm install
```

### 2.2 Configure Environment
The `.env` file is already created with default Laragon settings:
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=edukiz
DB_PORT=3306
JWT_SECRET=edukiz-secret-key-change-in-production-2024
PORT=3000
```

**IMPORTANT:** Change `JWT_SECRET` in production!

### 2.3 Start Backend Server
```bash
# From backend directory
npm start

# Or for development with auto-reload
npm run dev
```

The server will start on http://localhost:3000

## Step 3: Frontend Setup

### 3.1 Install Frontend Dependencies
```bash
# From edukiz root directory
npm install axios
```

### 3.2 Configure API URL
The `.env` file is already created:
```
VUE_APP_API_URL=http://localhost:3000/api
```

### 3.3 Start Frontend
```bash
npm run serve
```

The app will start on http://localhost:8080

## Step 4: Test the System

### 4.1 Default Admin Account
- Username: `admin`
- Password: `admin123`

**IMPORTANT:** Change this password immediately after first login!

### 4.2 Test Login
1. Navigate to http://localhost:8080/#/login
2. Login with admin credentials
3. You should be redirected to http://localhost:8080/#/admin

### 4.3 Create Test User
1. Click "Need an account? Register"
2. Fill in the form:
   - Username: testuser
   - Email: test@example.com
   - Password: test123
3. Login with the new account
4. Play some games
5. Login as admin to see the user's progress

## Features

### User Features
- User registration and login
- Guest mode (play without account)
- Automatic progress tracking
- Rewards system
- Login history

### Admin Features
- Dashboard with statistics
- View all users and their progress
- See login history
- Track game statistics
- View top performers
- Enable/disable user accounts

## Database Schema

### users
- User accounts (username, email, password, role)
- Tracks last login and account status

### user_sessions
- Login/logout tracking
- Session duration
- IP address and user agent

### user_progress
- Game-by-game progress
- Scores, levels, completion status
- Time spent per game

### game_statistics
- Aggregated user statistics
- Total games played, scores, rewards

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### User
- `GET /api/users/stats` - Get user statistics
- `GET /api/users/progress` - Get user progress
- `GET /api/users/login-history` - Get login history

### Progress
- `POST /api/progress/save` - Save game progress
- `POST /api/progress/rewards` - Update rewards

### Admin (requires admin role)
- `GET /api/admin/dashboard` - Dashboard statistics
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `GET /api/admin/logins/stats` - Login statistics
- `GET /api/admin/progress/stats` - Progress statistics
- `PATCH /api/admin/users/:id/toggle-active` - Enable/disable user

## Integrating Progress Tracking in Games

To track progress in your games, use the `progressTrackingMixin`:

```javascript
import { progressTrackingMixin } from '@/mixins/progressTrackingMixin';

export default {
  name: 'YourGame',
  mixins: [progressTrackingMixin],
  
  mounted() {
    // Start tracking when game starts
    this.startGameTracking('memory', 'Memory Animals');
  },
  
  methods: {
    onGameComplete(score) {
      // Save progress when game ends
      this.saveGameProgress(score, 1, true);
      
      // Update rewards
      this.updateRewards(10);
    }
  }
}
```

## Security Notes

1. **Change default admin password** immediately
2. **Update JWT_SECRET** in production
3. **Use HTTPS** in production
4. **Implement rate limiting** for login attempts
5. **Add CORS restrictions** in production
6. **Sanitize user inputs**
7. **Use prepared statements** (already implemented)

## Troubleshooting

### Database Connection Failed
- Check if MySQL is running in Laragon
- Verify database credentials in `.env`
- Check if port 3306 is available

### Backend Won't Start
- Check if port 3000 is available
- Verify all dependencies are installed
- Check `.env` file exists

### Frontend Can't Connect to Backend
- Verify backend is running on port 3000
- Check `VUE_APP_API_URL` in frontend `.env`
- Check browser console for CORS errors

### Login Not Working
- Check database has users table
- Verify JWT_SECRET is set
- Check browser console for errors

## Production Deployment

### Database
1. Use strong passwords
2. Create separate database user with limited privileges
3. Enable SSL connections
4. Regular backups

### Backend
1. Set `NODE_ENV=production`
2. Use strong JWT_SECRET
3. Enable rate limiting
4. Use process manager (PM2)
5. Set up logging
6. Enable HTTPS

### Frontend
1. Build for production: `npm run build`
2. Serve from web server (nginx, Apache)
3. Enable HTTPS
4. Update API_URL to production backend

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in backend console
3. Check browser console for frontend errors
4. Verify database connections and queries

## Next Steps

1. Change default admin password
2. Customize user registration fields
3. Add email verification
4. Implement password reset
5. Add more detailed analytics
6. Create user profile pages
7. Add export functionality for reports
