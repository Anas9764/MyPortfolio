const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Bio = require('./models/Bio');

dotenv.config();

async function checkBioCount() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const bios = await Bio.find({});
    console.log(`Found ${bios.length} Bio documents`);
    bios.forEach((bio, i) => {
      console.log(`Bio ${i + 1}:`);
      console.log(JSON.stringify(bio, null, 2));
    });
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
}

checkBioCount();
