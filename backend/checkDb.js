const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const Bio = require('./models/Bio');
const Skill = require('./models/Skill');
const Experience = require('./models/Experience');
const Education = require('./models/Education');
const Project = require('./models/Project');

dotenv.config();

const testDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const bio = await Bio.findOne();
    const skills = await Skill.find();
    const experiences = await Experience.find();
    const education = await Education.find();
    const projects = await Project.find();

    console.log('--- DATABASE STATUS ---');
    console.log('Bio exists:', !!bio);
    console.log('Skills count:', skills.length);
    if (skills.length > 0) {
      console.log('First Skill category:', skills[0].title);
      console.log('Nested skills in first category:', skills[0].skills.length);
    }
    console.log('Experiences count:', experiences.length);
    console.log('Education count:', education.length);
    console.log('Projects count:', projects.length);
    console.log('--- END STATUS ---');

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

testDB();
