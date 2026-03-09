const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function createAdmin() {
  try {
    // Create connection
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'edukiz'
    });

    console.log('Connected to database');

    // Hash password
    const password = 'admin123';
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert or update admin user
    const [result] = await connection.query(
      `INSERT INTO users (username, email, password, full_name, role) 
       VALUES ('admin', 'admin@edukiz.com', ?, 'Administrator', 'admin')
       ON DUPLICATE KEY UPDATE password = ?`,
      [hashedPassword, hashedPassword]
    );

    console.log('✓ Admin user created/updated successfully');
    console.log('  Username: admin');
    console.log('  Password: admin123');
    console.log('  Email: admin@edukiz.com');
    console.log('\nIMPORTANT: Change this password after first login!');

    await connection.end();
  } catch (error) {
    console.error('Error creating admin user:', error.message);
    process.exit(1);
  }
}

createAdmin();
