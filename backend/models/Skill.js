const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  id: { type: Number },
  title: { type: String, required: true },
  skills: [{
    name: { type: String, required: true },
    image: { type: String, required: true }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Skill', SkillSchema);
