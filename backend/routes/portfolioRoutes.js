const express = require('express');
const router = express.Router();
const Bio = require('../models/Bio');
const Skill = require('../models/Skill');
const Experience = require('../models/Experience');
const Education = require('../models/Education');
const Project = require('../models/Project');
const Analytics = require('../models/Analytics');
const Message = require('../models/Message');
const nodemailer = require('nodemailer');

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

// Analytics: Track Visit
router.post('/analytics/track', async (req, res) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    let stats = await Analytics.findOne();
    
    if (!stats) {
      stats = new Analytics({ totalVisits: 1, dailyVisits: [{ date: today, count: 1 }] });
    } else {
      stats.totalVisits += 1;
      const dayIndex = stats.dailyVisits.findIndex(d => d.date === today);
      if (dayIndex !== -1) {
        stats.dailyVisits[dayIndex].count += 1;
      } else {
        stats.dailyVisits.push({ date: today, count: 1 });
      }
    }
    await stats.save();
    res.json(stats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Analytics: Get Stats
router.get('/analytics/stats', async (req, res) => {
  try {
    const stats = await Analytics.findOne();
    const messageCount = await Message.countDocuments();
    res.json({ ...stats?._doc, messageCount });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Messages: Create
router.post('/messages', async (req, res) => {
  try {
    const newMessage = new Message(req.body);
    await newMessage.save();

    // Send email notification to Admin
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: 'anasqureshi.dev@gmail.com', // Always send to this email
        subject: `New Portfolio Message from ${req.body.name}`,
        text: `You have received a new message from your portfolio website.\n\nFrom: ${req.body.name} (${req.body.email})\nSubject: ${req.body.subject}\n\nMessage:\n${req.body.message}`
      };
      
      // Do not await to avoid blocking the response
      transporter.sendMail(mailOptions).catch(err => console.error('Failed to send notification email:', err));
    }

    res.status(201).json(newMessage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Messages: List
router.get('/messages', async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Messages: Delete
router.delete('/messages/:id', async (req, res) => {
  try {
    await Message.findByIdAndDelete(req.params.id);
    res.json({ message: 'Message deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Messages: Reply via Email
router.post('/messages/reply', async (req, res) => {
  try {
    const { to, subject, body, replyTo } = req.body;
    
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      return res.status(400).json({ message: 'Email credentials not configured on the server. Please add EMAIL_USER and EMAIL_PASS to backend .env' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: replyTo || process.env.EMAIL_USER,
      to,
      subject,
      text: body
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: 'Reply sent successfully' });
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
