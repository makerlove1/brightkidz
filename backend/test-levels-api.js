const axios = require('axios');
const jwt = require('jsonwebtoken');

// Test the levels API directly
async function testLevelsAPI() {
  const API_URL = 'http://localhost:3000/api';
  
  // First, let's create a test token for user_id 1 (admin)
  const token = jwt.sign(
    { id: 1, username: 'admin', role: 'admin' },
    'brightkidz-secret-key-change-in-production-2024',
    { expiresIn: '24h' }
  );

  console.log('Testing Levels API with token:', token.substring(0, 20) + '...');
  console.log('========================================\n');

  try {
    // Test 1: Get current level
    console.log('1. Testing GET /api/levels/current');
    const currentResponse = await axios.get(`${API_URL}/levels/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(currentResponse.data, null, 2));
    console.log();

    // Test 2: Add stars
    console.log('2. Testing POST /api/levels/add-stars');
    const addStarsResponse = await axios.post(
      `${API_URL}/levels/add-stars`,
      { stars: 3 },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(addStarsResponse.data, null, 2));
    console.log();

    // Test 3: Get current level again to see changes
    console.log('3. Testing GET /api/levels/current (after adding stars)');
    const updatedResponse = await axios.get(`${API_URL}/levels/current`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('✅ Success!');
    console.log('Response:', JSON.stringify(updatedResponse.data, null, 2));
    console.log();

    console.log('🎉 All tests passed! The levels API is working correctly.');
    
  } catch (error) {
    console.error('❌ Test failed!');
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
      console.error('Headers:', error.response.headers);
    } else if (error.request) {
      console.error('No response received:', error.request);
    } else {
      console.error('Error:', error.message);
    }
    console.error('Stack:', error.stack);
  }
}

// Start the test
testLevelsAPI();