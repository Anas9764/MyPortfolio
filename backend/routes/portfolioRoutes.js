const express = require('express');
const router = express.Router();
const Bio = require('../models/Bio');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');

// Get all portfolio data
router.get('/data', async (req, res) => {
  try {
    const bio = await Bio.findOne();
    const skills = await Skill.find();
    const experiences = await Experience.find().sort({ priority: 1, createdAt: -1 });
    const education = await Education.find().sort({ priority: 1, createdAt: -1 });
    const projects = await Project.find().sort({ priority: 1, id: 1 });

    res.json({ bio, skills, experiences, education, projects });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin Update Routes (to be protected)
router.post('/bio', async (req, res) => {
  try {
    const bio = await Bio.findOneAndUpdate({}, req.body, { new: true, upsert: true });
    res.json(bio);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

const models = {
  skills: Skill,
  experiences: Experience,
  education: Education,
  projects: Project
};

// Add new item
router.post('/:type', async (req, res) => {
  try {
    const { type } = req.params;
    if (!models[type]) return res.status(400).json({ message: 'Invalid type' });
    
    const count = await models[type].countDocuments();
    const newItem = new models[type]({ ...req.body, id: count + 1 });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update item
router.put('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!models[type]) return res.status(400).json({ message: 'Invalid type' });
    
    const updatedItem = await models[type].findOneAndUpdate({ _id: id }, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete item
router.delete('/:type/:id', async (req, res) => {
  try {
    const { type, id } = req.params;
    if (!models[type]) return res.status(400).json({ message: 'Invalid type' });
    
    await models[type].findOneAndDelete({ _id: id });
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reorder experiences
router.post('/experiences/reorder', async (req, res) => {
  try {
    const { orders } = req.body; // Array of { _id: string, priority: number }
    const updatePromises = orders.map(order => 
      Experience.findOneAndUpdate({ _id: order._id }, { priority: order.priority })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reorder projects
router.post('/projects/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    const updatePromises = orders.map(order => 
      Project.findOneAndUpdate({ _id: order._id }, { priority: order.priority })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Reorder education
router.post('/education/reorder', async (req, res) => {
  try {
    const { orders } = req.body;
    const updatePromises = orders.map(order => 
      Education.findOneAndUpdate({ _id: order._id }, { priority: order.priority })
    );
    await Promise.all(updatePromises);
    res.json({ message: 'Order updated successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
