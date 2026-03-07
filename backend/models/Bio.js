const mongoose = require('mongoose');

const BioSchema = new mongoose.Schema({
  name: { type: String, required: true },
  roles: [{ type: String }],
  description: { type: String, required: true },
  github: { type: String },
  resume: { type: String },
  linkedin: { type: String },
  twitter: { type: String },
  insta: { type: String },
  facebook: { type: String },
  image: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Bio', BioSchema);
