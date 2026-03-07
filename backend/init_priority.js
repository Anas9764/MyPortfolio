const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ExperienceSchema = new mongoose.Schema({
  company: String,
  priority: Number,
});

const Experience = mongoose.model('Experience', ExperienceSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const experiences = await Experience.find().sort({ createdAt: -1 });
    
    const updatePromises = experiences.map((exp, index) => 
      Experience.updateOne({ _id: exp._id }, { priority: index })
    );
    
    await Promise.all(updatePromises);
    console.log(`Successfully initialized priority for ${experiences.length} experiences.`);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error initializing priority:', err);
    process.exit(1);
  }
}

run();
