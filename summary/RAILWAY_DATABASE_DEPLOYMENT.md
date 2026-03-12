# Railway Database Deployment Guide

## Step 1: Create Railway Account and Project

1. Go to [Railway.app](https://railway.app)
2. Sign up/login with GitHub
3. Click "New Project"
4. Select "Deploy MySQL" from the database options

## Step 2: Deploy MySQL Database

1. In your Railway dashboard, click "New" → "Database" → "MySQL"
2. Railway will automatically provision a MySQL instance
3. Wait for deployment to complete (usually 1-2 minutes)

## Step 3: Get Database Connection Details

1. Click on your MySQL service in Railway dashboard
2. Go to "Variables" tab
3. Copy these environment variables:
   - `MYSQL_URL` (full connection string)
   - `MYSQL_HOST`
   - `MYSQL_PORT`
   - `MYSQL_USER`
   - `MYSQL_PASSWORD`
   - `MYSQL_DATABASE`

## Step 4: Update Backend Environment Variables

Create a new `.env.production` file or update your existing `.env`:

```env
# Railway MySQL Database Configuration
DB_HOST=your-railway-mysql-host
DB_USER=your-railway-mysql-user
DB_PASSWORD=your-railway-mysql-password
DB_NAME=your-railway-mysql-database
DB_PORT=your-railway-mysql-port

# JWT Secret (CHANGE THIS!)
JWT_SECRET=your-secure-jwt-secret-for-production

# Server Configuration
PORT=3000
NODE_ENV=production

# Frontend URL (update with your frontend domain)
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Step 5: Initialize Database Schema

You have two options to set up your database schema:

### Option A: Using Railway's MySQL Console
1. In Railway dashboard, click on your MySQL service
2. Click "Query" tab
3. Copy and paste the contents of `backend/config/init-database.sql`
4. Execute the script

### Option B: Using a MySQL Client
1. Use the connection details from Railway
2. Connect with a tool like MySQL Workbench, phpMyAdmin, or command line
3. Run the `init-database.sql` script

## Step 6: Deploy Backend to Railway

1. In Railway dashboard, click "New" → "GitHub Repo"
2. Connect your GitHub repository
3. Select the backend folder as the root directory
4. Railway will auto-detect it's a Node.js app
5. Add your environment variables in the Railway dashboard

## Step 7: Update Frontend Configuration

Update your frontend to point to the Railway backend URL:

```javascript
// In your Vue.js app, update the API base URL
const API_BASE_URL = 'https://your-backend-service.railway.app/api'
```

## Database Schema Overview

Your database includes these tables:
- `users` - User accounts and authentication
- `user_sessions` - Login tracking
- `user_progress` - Game progress tracking
- `game_statistics` - Overall game stats
- `user_levels` - Level and star system
- `level_history` - Level progression history
- `user_preferences` - Language and voice settings
- `bkt_skills` - Bayesian Knowledge Tracing
- `bkt_history` - Learning analytics
- `game_levels` - Game-specific progress
- `login_streaks` - Daily login streaks
- `login_rewards` - Reward tracking

## Important Notes

1. **Security**: Change the JWT_SECRET in production
2. **CORS**: Update FRONTEND_URL to match your deployed frontend
3. **Admin User**: Run `npm run create-admin` after database setup
4. **Backups**: Railway provides automatic backups
5. **Monitoring**: Use Railway's built-in monitoring tools

## Troubleshooting

- If connection fails, check firewall settings
- Verify environment variables are correctly set
- Check Railway logs for detailed error messages
- Ensure your database schema is properly initialized

## Cost Considerations

- Railway offers a free tier with limitations
- MySQL databases on Railway start at $5/month for production use
- Monitor your usage in the Railway dashboard