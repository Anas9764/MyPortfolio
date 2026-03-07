const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const ExperienceSchema = new mongoose.Schema({
  company: String,
  desc: String,
});

const Experience = mongoose.model('Experience', ExperienceSchema);

async function run() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    const fullDesc = "Contributed to the development of enterprise-level analytics and AI-powered dashboard platforms enabling businesses to analyze complex datasets and make data-driven decisions. Designed and developed interactive dashboards using React.js with dynamic charts, structured tables, drill-down views, and multi-dimensional filtering systems. Integrated LLM-generated insights and robust REST APIs, transforming complex AI outputs into clear, actionable business intelligence. Built reusable and scalable components including global filters, configurable chart modules, and advanced table architectures, reducing redundant development by 35–40%. Enhanced system stability by resolving critical issues, reducing production incidents by approximately 50%. Implemented secure payment gateway integrations and optimized performance, reducing load times by 25–30% while ensuring responsiveness for large-scale datasets.";
    
    const result = await Experience.updateOne(
      { company: 'ICOGZ Technologies' },
      { $set: { desc: fullDesc } }
    );
    console.log('Update result:', result);
    await mongoose.connection.close();
  } catch (err) {
    console.error('Error updating:', err);
    process.exit(1);
  }
}

run();
