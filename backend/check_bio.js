const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bio = require('./models/Bio');

dotenv.config();

async function checkBio() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const bio = await Bio.findOne({});
    console.log('Current Bio Document:');
    console.log(JSON.stringify(bio, null, 2));
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkBio();
