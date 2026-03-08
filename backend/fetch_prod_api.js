const https = require('https');

https.get('https://myportfolio-tn8r.onrender.com/api/portfolio/data', (res) => {
  let data = '';
  res.on('data', (chunk) => { data += chunk; });
  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Production API Bio Data:');
      console.log(JSON.stringify(json.bio, null, 2));
    } catch (e) {
      console.log('Error parsing JSON:', e.message);
      console.log('Raw data:', data);
    }
  });
}).on('error', (err) => {
  console.log('Error:', err.message);
});
