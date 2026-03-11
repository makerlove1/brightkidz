const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const { testConnection } = require('./config/database');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const adminRoutes = require('./routes/admin');
const progressRoutes = require('./routes/progress');
const streakRoutes = require('./routes/streaks');
const levelRoutes = require('./routes/levels');
const preferencesRoutes = require('./routes/preferences');
const bktRoutes = require('./routes/bkt');
const gameLevelsRoutes = require('./routes/gameLevels');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? [process.env.FRONTEND_URL, /\.vercel\.app$/]
    : '*',
  credentials: true
};
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/streaks', streakRoutes);
app.use('/api/levels', levelRoutes);
app.use('/api/preferences', preferencesRoutes);
app.use('/api/bkt', bktRoutes);
app.use('/api/game-levels', gameLevelsRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
async function startServer() {
  const dbConnected = await testConnection();
  
  if (!dbConnected) {
    console.error('Failed to connect to database. Please check your configuration.');
    process.exit(1);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📊 Admin API: /api/admin`);
    console.log(`🔐 Auth API: /api/auth`);
    console.log(`🏥 Health check: /api/health`);
  });
}

startServer();
