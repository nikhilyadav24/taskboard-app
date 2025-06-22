const mongoose = require('mongoose');
require('./User'); // Ensures the User model is registered before being used in refs

const taskSchema = new mongoose.Schema({
  // We use a custom string ID for tasks to match the frontend's expectations
  id: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
  dueDate: { type: Date },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  columnId: { type: String, required: true }, // This will be the ID from the columnSchema
}, {
  timestamps: true, // Adds createdAt and updatedAt
  _id: false // We don't need a separate _id for this sub-document
});

module.exports = taskSchema; 