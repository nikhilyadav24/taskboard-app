const mongoose = require('mongoose');

const columnSchema = new mongoose.Schema({
  // We use a custom string ID for columns to match the frontend's expectations
  id: { type: String, required: true },
  title: { type: String, required: true },
}, {
  timestamps: true, // Adds createdAt
  _id: false // We don't need a separate _id for this sub-document
});

module.exports = columnSchema; 