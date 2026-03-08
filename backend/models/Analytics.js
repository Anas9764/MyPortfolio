const mongoose = require('mongoose');

const AnalyticsSchema = new mongoose.Schema({
  totalVisits: { type: Number, default: 0 },
  dailyVisits: [{
    date: { type: String, required: true }, // Format: YYYY-MM-DD
    count: { type: Number, default: 0 }
  }]
}, { timestamps: true });

module.exports = mongoose.model('Analytics', AnalyticsSchema);
