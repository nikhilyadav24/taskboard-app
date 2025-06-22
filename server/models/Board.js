const mongoose = require('mongoose');
const taskSchema = require('./Task');
const columnSchema = require('./Column');

const boardSchema = new mongoose.Schema({
  // We use a custom string ID for boards to match the frontend's expectations
  id: { type: String, required: true, unique: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  columns: [columnSchema],
  tasks: [taskSchema],
}, {
  timestamps: true // Adds createdAt and updatedAt
});

module.exports = mongoose.model('Board', boardSchema); 