const { pool } = require('../config/database');
const fs = require('fs');
const path = require('path');

async function addRewardsColumn() {
  try {
    console.log('🔧 Adding rewards column to user_levels table...\n');

    // Check if column exists
    const [columns] = await pool.query(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = 'edukiz' 
        AND TABLE_NAME = 'user_levels' 
        AND COLUMN_NAME = 'rewards'
    `);

    if (columns.length > 0) {
      console.log('✅ Rewards column already exists!');
    } else {
      console.log('📝 Adding rewards column...');
      await pool.query(`
        ALTER TABLE user_levels 
        ADD COLUMN rewards INT DEFAULT 0 COMMENT 'Current star/reward count displayed in header'
      `);
      console.log('✅ Rewards column added successfully!');
    }

    // Initialize rewards from total_stars_earned
    console.log('\n📊 Initializing rewards for existing users...');
    const [result] = await pool.query(`
      UPDATE user_levels 
      SET rewards = total_stars_earned 
      WHERE rewards = 0 OR rewards IS NULL
    `);
    console.log(`✅ Updated ${result.affectedRows} user records`);

    // Verify the column
    const [verify] = await pool.query(`
      SELECT 
        COUNT(*) as total_users,
        SUM(rewards) as total_rewards,
        AVG(rewards) as avg_rewards
      FROM user_levels
    `);
    console.log('\n📈 Current stats:');
    console.log(`   Total users: ${verify[0].total_users}`);
    console.log(`   Total rewards: ${verify[0].total_rewards}`);
    console.log(`   Average rewards: ${Math.round(verify[0].avg_rewards || 0)}`);

    console.log('\n✨ Migration complete!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

addRewardsColumn();
