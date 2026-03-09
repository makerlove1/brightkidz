/**
 * Test Script for Daily Login Streak System
 * Run with: node scripts/test-streak-system.js
 */

const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:3000/api';

// Test credentials (update with your test user)
const TEST_USER = {
  username: 'testuser',
  password: 'testpass123'
};

let authToken = null;

async function login() {
  try {
    console.log('🔐 Logging in...');
    const response = await axios.post(`${API_URL}/auth/login`, TEST_USER);
    authToken = response.data.token;
    console.log('✅ Login successful!');
    console.log('User:', response.data.user.username);
    return true;
  } catch (error) {
    console.error('❌ Login failed:', error.response?.data?.error || error.message);
    return false;
  }
}

async function getCurrentStreak() {
  try {
    console.log('\n📊 Fetching current streak...');
    const response = await axios.get(`${API_URL}/streaks/current`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const { streak, recentRewards } = response.data;
    console.log('✅ Current Streak Data:');
    console.log('  🔥 Current Streak:', streak.currentStreak, 'days');
    console.log('  🏆 Longest Streak:', streak.longestStreak, 'days');
    console.log('  📅 Total Login Days:', streak.totalLoginDays);
    console.log('  🎁 Rewards Claimed:', streak.streakRewardsClaimed);
    console.log('  📆 Last Login:', streak.lastLoginDate || 'Never');
    
    if (recentRewards.length > 0) {
      console.log('\n🎉 Recent Rewards:');
      recentRewards.slice(0, 5).forEach(reward => {
        console.log(`  - ${reward.reward_name}: ${reward.reward_value} points (Day ${reward.streak_day})`);
      });
    }
    
    return streak;
  } catch (error) {
    console.error('❌ Failed to fetch streak:', error.response?.data?.error || error.message);
    return null;
  }
}

async function performCheckIn() {
  try {
    console.log('\n✨ Performing daily check-in...');
    const response = await axios.post(
      `${API_URL}/streaks/check-in`,
      {},
      { headers: { Authorization: `Bearer ${authToken}` } }
    );
    
    const { alreadyCheckedIn, streak, reward, isComeback } = response.data;
    
    if (alreadyCheckedIn) {
      console.log('ℹ️  Already checked in today!');
      console.log('  Current Streak:', streak.currentStreak, 'days');
    } else {
      console.log('🎊 Check-in successful!');
      console.log('  🔥 New Streak:', streak.currentStreak, 'days');
      console.log('  📈 Previous Streak:', streak.previousStreak, 'days');
      
      if (isComeback) {
        console.log('  💪 Comeback Bonus!');
      }
      
      if (reward) {
        console.log('\n🎁 Reward Earned:');
        console.log('  Name:', reward.name);
        console.log('  Type:', reward.type);
        console.log('  Value:', reward.value, 'points');
        console.log('  Message:', reward.message);
        console.log('  Emoji:', reward.emoji);
      }
    }
    
    return response.data;
  } catch (error) {
    console.error('❌ Check-in failed:', error.response?.data?.error || error.message);
    return null;
  }
}

async function getLeaderboard() {
  try {
    console.log('\n🏅 Fetching leaderboard...');
    const response = await axios.get(`${API_URL}/streaks/leaderboard`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    
    const { leaderboard } = response.data;
    console.log('✅ Top 10 Streaks:');
    
    leaderboard.slice(0, 10).forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '  ';
      console.log(
        `${medal} ${index + 1}. ${user.username || user.full_name}:`,
        `${user.current_streak} days 🔥`,
        `(Best: ${user.longest_streak})`
      );
    });
    
    return leaderboard;
  } catch (error) {
    console.error('❌ Failed to fetch leaderboard:', error.response?.data?.error || error.message);
    return null;
  }
}

async function simulateMultipleDays(days) {
  console.log(`\n🔄 Simulating ${days} consecutive days...`);
  console.log('⚠️  Note: This only works if you manually change last_login_date in database');
  console.log('   Run this SQL between each check-in:');
  console.log('   UPDATE login_streaks SET last_login_date = DATE_SUB(CURDATE(), INTERVAL 1 DAY) WHERE user_id = YOUR_USER_ID;');
}

async function runTests() {
  console.log('🚀 Starting Daily Login Streak System Tests\n');
  console.log('='.repeat(50));
  
  // Step 1: Login
  const loginSuccess = await login();
  if (!loginSuccess) {
    console.log('\n❌ Tests aborted: Login failed');
    console.log('💡 Make sure:');
    console.log('   1. Backend server is running');
    console.log('   2. Test user exists (or update TEST_USER credentials)');
    console.log('   3. Database is properly configured');
    return;
  }
  
  // Step 2: Get current streak
  await getCurrentStreak();
  
  // Step 3: Perform check-in
  await performCheckIn();
  
  // Step 4: Get updated streak
  await getCurrentStreak();
  
  // Step 5: Get leaderboard
  await getLeaderboard();
  
  // Step 6: Try checking in again (should say already checked in)
  console.log('\n🔁 Attempting second check-in (should be blocked)...');
  await performCheckIn();
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All tests completed!');
  console.log('\n💡 Tips:');
  console.log('   - To test consecutive days, manually update last_login_date in database');
  console.log('   - Check the frontend by logging in through the web app');
  console.log('   - View streak badge in the header after login');
  console.log('   - Streak modal should appear automatically on first daily login');
}

// Run the tests
runTests().catch(error => {
  console.error('\n💥 Unexpected error:', error.message);
  process.exit(1);
});
