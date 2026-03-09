# EduKiz Backend API

Node.js/Express backend for user authentication and progress tracking.

## Installation

```bash
npm install
```

## Configuration

Create `.env` file (already created with defaults):
```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=edukiz
DB_PORT=3306
JWT_SECRET=your-secret-key
PORT=3000
```

## Database Setup

Run the SQL script in MySQL:
```bash
mysql -u root -p < config/init-database.sql
```

## Running

```bash
# Production
npm start

# Development (with auto-reload)
npm run dev
```

## API Documentation

See `ADMIN_SETUP_GUIDE.md` in the parent directory for complete API documentation.

## Project Structure

```
backend/
├── config/
│   ├── database.js          # Database connection
│   └── init-database.sql    # Database schema
├── middleware/
│   └── auth.js              # Authentication middleware
├── routes/
│   ├── auth.js              # Authentication routes
│   ├── users.js             # User routes
│   ├── admin.js             # Admin routes
│   └── progress.js          # Progress tracking routes
├── .env                     # Environment variables
├── server.js                # Main server file
└── package.json
```
