const mongoose = require('mongoose');
require('dotenv').config();
const Board = require('../models/Board');

async function fixCreatedBy() {
  await mongoose.connect(process.env.MONGODB_URI);

  const boards = await Board.find();
  for (const board of boards) {
    let changed = false;
    board.tasks = board.tasks.map(task => {
      if (task.createdBy && typeof task.createdBy === 'object') {
        // Try to extract _id or id
        const newCreatedBy = task.createdBy._id || task.createdBy.id || '';
        if (newCreatedBy) {
          changed = true;
          return { ...task.toObject(), createdBy: newCreatedBy };
        }
      }
      return task;
    });
    if (changed) {
      await board.save();
      console.log(`Fixed board: ${board.title}`);
    }
  }
  console.log('Done!');
  process.exit();
}

fixCreatedBy(); 