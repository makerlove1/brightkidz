const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
dotenv.config();

async function fixTables() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  try {
    console.log('Checking user_levels table structure...');
    
    // Check if rewards column exists
    const [columns] = await pool.query('SHOW COLUMNS FROM user_levels LIKE "rewards"');
    
    if (columns.length === 0) {
      console.log('Adding rewards column to user_levels...');
      await pool.query('ALTER TABLE user_levels ADD COLUMN rewards INT DEFAULT 0 COMMENT "Current star/reward count displayed in header"');
      console.log('✓ Added rewards column');
    } else {
      console.log('ℹ rewards column already exists');
    }

    // Check if any users have level records
    const [users] = await pool.query('SELECT id FROM users LIMIT 5');
    console.log('Found users:', users.map(u => u.id));

    // Create level records for existing users if they don't have them
    for (const user of users) {
      const [existingLevels] = await pool.query('SELECT * FROM user_levels WHERE user_id = ?', [user.id]);
      
      if (existingLevels.length === 0) {
        console.log(`Creating level record for user ${user.id}...`);
        await pool.query(
          'INSERT INTO user_levels (user_id, current_level, current_stars, total_stars_earned, stars_to_next_level, rewards) VALUES (?, 1, 0, 0, 10, 0)',
          [user.id]
        );
        console.log(`✓ Created level record for user ${user.id}`);
      }
    }

    console.log('\n✅ Database tables are ready!');
    console.log('\nTest the API with:');
    console.log('1. Make sure backend server is running: npm start');
    console.log('2. Log in to the app');
    console.log('3. Play a game to earn stars');
    console.log('4. Check browser console for logs');

  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

fixTables();