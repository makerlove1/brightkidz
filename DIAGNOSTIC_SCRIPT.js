// Diagnostic Script for Star System Issues
// Copy and paste this into browser console (F12)

async function diagnoseStarSystem() {
  console.log('🔍 DIAGNOSTIC SCRIPT FOR STAR SYSTEM');
  console.log('=====================================\n');
  
  // 1. Check Authentication
  console.log('1. AUTHENTICATION CHECK:');
  const token = localStorage.getItem('token');
  const guestMode = localStorage.getItem('guestMode');
  const username = localStorage.getItem('username');
  
  console.log(`   Token: ${token ? '✅ Present' : '❌ Missing'}`);
  console.log(`   Guest Mode: ${guestMode === 'true' ? '❌ ACTIVE (Stars will NOT be saved)' : '✅ Not active'}`);
  console.log(`   Username: ${username || 'Not set'}`);
  
  if (guestMode === 'true') {
    console.log('\n   ⚠️  WARNING: You are in GUEST MODE!');
    console.log('   Stars will NOT be saved to your account.');
    console.log('   Please log in with a real account to track progress.');
  }
  
  if (!token && guestMode !== 'true') {
    console.log('\n   ⚠️  WARNING: No authentication token found!');
    console.log('   Please log in to track stars and progress.');
  }
  
  // 2. Test Backend API
  console.log('\n2. BACKEND API TEST:');
  
  if (!token) {
    console.log('   Skipping API test - no token available');
  } else {
    try {
      console.log('   Testing connection to backend...');
      const response = await fetch('http://localhost:3000/api/levels/current', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('   ✅ Backend API is working!');
        console.log(`   Current Level: ${data.level.currentLevel}`);
        console.log(`   Current Stars: ${data.level.currentStars}/${data.level.starsToNextLevel}`);
        console.log(`   Progress: ${data.level.progressPercentage}%`);
        console.log(`   Total Stars Earned: ${data.level.totalStarsEarned}`);
      } else {
        console.log(`   ❌ Backend API error: ${response.status} ${response.statusText}`);
        const errorData = await response.json();
        console.log(`   Error details:`, errorData);
        
        if (response.status === 401 || response.status === 403) {
          console.log('   ⚠️  Token is invalid or expired. Please log out and log in again.');
        }
      }
    } catch (error) {
      console.log('   ❌ Cannot connect to backend:', error.message);
      console.log('   Make sure backend server is running:');
      console.log('   1. Open terminal in edukiz/backend');
      console.log('   2. Run: npm start');
    }
  }
  
  // 3. Check Event Listeners
  console.log('\n3. EVENT SYSTEM CHECK:');
  
  // Check if emitter is available
  if (typeof emitter !== 'undefined') {
    console.log('   ✅ Event emitter is available');
    
    // Test event emission
    console.log('   Testing event emission...');
    setTimeout(() => {
      emitter.emit('showReward', 1);
      console.log('   Test event "showReward" emitted with 1 star');
    }, 100);
  } else {
    console.log('   ❌ Event emitter is NOT available');
    console.log('   This means the Vue app might not be fully loaded');
  }
  
  // 4. Check Component Status
  console.log('\n4. COMPONENT STATUS:');
  
  // Try to find LevelDisplay component
  const levelDisplays = document.querySelectorAll('.level-display, .level-badge');
  console.log(`   LevelDisplay components found: ${levelDisplays.length}`);
  
  if (levelDisplays.length === 0) {
    console.log('   ⚠️  No LevelDisplay components found on page');
    console.log('   This component should be in the header');
  }
  
  // 5. Recommendations
  console.log('\n5. RECOMMENDATIONS:');
  
  if (guestMode === 'true') {
    console.log('   ➡️  LOG IN with a real account to track stars');
  } else if (!token) {
    console.log('   ➡️  LOG IN to get an authentication token');
  } else {
    console.log('   ➡️  Play a game and check console for logs');
    console.log('   ➡️  Look for "LevelDisplay: Received showReward event"');
    console.log('   ➡️  If no logs appear, the game might not be emitting events');
  }
  
  console.log('\n=====================================');
  console.log('Diagnostic complete. Check recommendations above.');
}

// Run the diagnostic
diagnoseStarSystem();