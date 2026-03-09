@echo off
echo Testing Star and Level System
echo =============================
echo.

cd backend

echo Testing add-stars endpoint...
node -e "const axios = require('axios'); const token = process.argv[1]; axios.post('http://localhost:3000/api/levels/add-stars', { stars: 3 }, { headers: { Authorization: 'Bearer ' + token } }).then(r => { console.log('Success:', JSON.stringify(r.data, null, 2)); }).catch(e => { console.error('Error:', e.response ? e.response.data : e.message); });" %1

echo.
echo Testing get current level...
node -e "const axios = require('axios'); const token = process.argv[1]; axios.get('http://localhost:3000/api/levels/current', { headers: { Authorization: 'Bearer ' + token } }).then(r => { console.log('Current Level:', JSON.stringify(r.data, null, 2)); }).catch(e => { console.error('Error:', e.response ? e.response.data : e.message); });" %1

cd ..
pause
