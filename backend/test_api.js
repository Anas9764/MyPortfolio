const axios = require('axios');

async function testApi() {
  try {
    const res = await axios.get('http://localhost:5000/api/portfolio/data');
    console.log('API Bio Data:');
    console.log(JSON.stringify(res.data.bio, null, 2));
  } catch (err) {
    console.error('API Error:', err.message);
  }
}

testApi();
