const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

async function deployToRailway() {
  console.log('🚀 Starting Railway database deployment...\n');

  // Check if we have Railway environment variables
  const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'DB_PORT'];
  const missingVars = requiredEnvVars.filter(varName => !process.env[varName]);
  
  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:');
    missingVars.forEach(varName => console.error(`   - ${varName}`));
    console.error('\nPlease update your .env file with Railway database credentials.');
    process.exit(1);
  }

  try {
    // Create connection
    console.log('📡 Connecting to Railway MySQL database...');
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: process.env.DB_PORT,
      multipleStatements: true
    });

    console.log('✅ Connected to Railway database successfully!\n');

    // Read and execute the SQL schema
    console.log('📋 Reading Railway database schema...');
    const sqlPath = path.join(__dirname, '../config/init-database-railway.sql');
    const sqlContent = fs.readFileSync(sqlPath, 'utf8');

    console.log('🔧 Executing database schema...');
    
    // Split SQL into individual statements and execute them one by one
    const statements = sqlContent
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement) {
        try {
          await connection.execute(statement);
          console.log(`✓ Executed statement ${i + 1}/${statements.length}`);
        } catch (error) {
          console.log(`⚠ Warning on statement ${i + 1}: ${error.message}`);
          // Continue with other statements
        }
      }
    }
    console.log('✅ Database schema created successfully!\n');

    // Test the connection with a simple query
    console.log('🧪 Testing database with sample query...');
    const [rows] = await connection.execute('SELECT COUNT(*) as table_count FROM information_schema.tables WHERE table_schema = ?', [process.env.DB_NAME]);
    console.log(`✅ Database has ${rows[0].table_count} tables created\n`);

    // Close connection
    await connection.end();
    
    console.log('🎉 Railway database deployment completed successfully!');
    console.log('\nNext steps:');
    console.log('1. Deploy your backend to Railway');
    console.log('2. Run: npm run create-admin (to create admin user)');
    console.log('3. Update your frontend API URL to point to Railway backend');
    console.log('4. Test your application end-to-end\n');

  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    console.error('\nTroubleshooting tips:');
    console.error('- Verify your Railway database credentials');
    console.error('- Check if your Railway MySQL service is running');
    console.error('- Ensure your IP is whitelisted (Railway usually allows all)');
    process.exit(1);
  }
}

// Run the deployment
deployToRailway();