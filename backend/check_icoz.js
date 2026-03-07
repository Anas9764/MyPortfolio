const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ExperienceSchema = new mongoose.Schema({
  company: String,
  desc: String,
});

const Experience = mongoose.model('Experience', ExperienceSchema);

async function run() {
  await mongoose.connect(process.env.MONGO_URI);
  const exp = await Experience.findOne({ company: 'ICOGZ Technologies' });
  console.log(JSON.stringify(exp, null, 2));
  await mongoose.connection.close();
}

run().catch(console.error);
