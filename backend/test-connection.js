require('dotenv').config();
const mysql = require('mysql2/promise');

async function testConnection() {
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME
    });

    console.log('✓ Database connection successful!');

    const [users] = await conn.query('SELECT username, email, role FROM users');
    console.log('\nUsers in database:');
    users.forEach(u => {
      console.log(`  ✓ ${u.username} (${u.email}) - Role: ${u.role}`);
    });

    await conn.end();
    console.log('\n✓ Everything is ready!');
  } catch (error) {
    console.error('✗ Error:', error.message);
    process.exit(1);
  }
}

testConnection();
