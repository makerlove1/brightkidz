const mysql = require('mysql2/promise');
require('dotenv').config();

// Support both individual variables and DATABASE_URL
let poolConfig;

if (process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL) {
  // Use DATABASE_URL if available (Railway public connection)
  const dbUrl = process.env.DATABASE_URL || process.env.MYSQL_PUBLIC_URL;
  const url = new URL(dbUrl);
  
  poolConfig = {
    host: url.hostname,
    user: url.username,
    password: url.password,
    database: url.pathname.slice(1), // Remove leading slash
    port: url.port || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
} else {
  // Use individual environment variables
  poolConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'edukiz',
    port: process.env.DB_PORT || 3306,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  };
}

const pool = mysql.createPool(poolConfig);

// Test database connection
async function testConnection() {
  try {
    const connection = await pool.getConnection();
    console.log('✓ Database connected successfully');
    connection.release();
    return true;
  } catch (error) {
    console.error('✗ Database connection failed:', error.message);
    return false;
  }
}

module.exports = { pool, testConnection };
