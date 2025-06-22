require('dotenv').config();
const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');
const connectDB = require('./config/db');
const seedDatabase = require('./utils/seed');

// Models
const User = require('./models/User');
const Board = require('./models/Board');

// Connect to MongoDB
connectDB().then(() => {
  // Seed database with initial data if it's empty
  seedDatabase();
});

const app = express();

// --- CORS Configuration ---
const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');
const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"]
};
app.use(cors(corsOptions));
app.use(express.json());

const server = http.createServer(app);
const io = new Server(server, { cors: corsOptions });

// --- USER ENDPOINTS ---
app.get('/api/users', async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/signup', async (req, res) => {
  const { name, username, password } = req.body;
  try {
    if (!name || !username || !password) {
      return res.status(400).json({ error: 'All fields required' });
    }
    let user = await User.findOne({ username });
    if (user) {
      return res.status(409).json({ error: 'Username already exists' });
    }
    const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase();
    
    // In a real app, you would hash the password here
    user = new User({ name, username, password, avatar });
    await user.save();
    
    const userResponse = user.toObject();
    delete userResponse.password;
    res.status(201).json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

app.post('/api/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    // In a real app, you would compare hashed passwords
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const userResponse = user.toObject();
    delete userResponse.password;
    res.json(userResponse);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete user and clean up references
app.delete('/api/users/:id', async (req, res) => {
  const userId = req.params.id;
  try {
    // Delete the user
    await User.findByIdAndDelete(userId);
    // Remove user from assignedTo and createdBy in all boards' tasks
    const boards = await Board.find();
    for (const board of boards) {
      let changed = false;
      board.tasks = board.tasks.map(task => {
        // Remove from assignedTo
        const newAssignedTo = Array.isArray(task.assignedTo)
          ? task.assignedTo.filter(uid => String(uid) !== String(userId))
          : [];
        // Remove as creator
        const newCreatedBy = String(task.createdBy) === String(userId) ? null : task.createdBy;
        if (newAssignedTo.length !== task.assignedTo.length || newCreatedBy !== task.createdBy) changed = true;
        return { ...task, assignedTo: newAssignedTo, createdBy: newCreatedBy };
      });
      if (changed) await board.save();
    }
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// --- BOARD ENDPOINTS ---
// This endpoint now primarily serves for checking board existence or basic info
app.get('/api/boards', async (req, res) => {
    try {
        // Fetch all boards
        const boards = await Board.find().populate('tasks.assignedTo', '-password').populate('tasks.createdBy', '-password');
        if (!boards || boards.length === 0) {
            return res.status(404).json({ error: 'No boards found' });
        }
        res.json(boards);
    } catch (err) {
        res.status(500).json({ error: 'Server error fetching boards' });
    }
});


// --- SOCKET.IO LOGIC ---
io.on('connection', (socket) => {
  console.log('A user connected with socket ID:', socket.id);

  const sendBoardData = async () => {
    try {
      // Fetch all boards
      const boards = await Board.find()
        .populate('tasks.assignedTo', 'id name avatar')
        .populate('tasks.createdBy', 'id name avatar');
      if(boards && boards.length > 0) {
        const boardData = { boards };
        socket.emit('initial_data', boardData);
      } else {
        console.log("No board data to send.");
        socket.emit('initial_data', { boards: [] });
      }
    } catch (err) {
      console.error("Error fetching board data for socket:", err);
    }
  };

  // Send the current board data to the new client
  sendBoardData();

  socket.on('update_board', async (newBoardData) => {
    try {
        if (newBoardData && newBoardData.boards && newBoardData.boards.length > 0) {
            // Upsert all boards in the array
            const updatedBoards = [];
            for (const boardToUpdate of newBoardData.boards) {
              // Defensive: filter out tasks with missing createdBy
              boardToUpdate.tasks = Array.isArray(boardToUpdate.tasks)
                ? boardToUpdate.tasks.filter(task => !!task.createdBy)
                : [];
              const updatedBoard = await Board.findOneAndUpdate(
                { id: boardToUpdate.id },
                boardToUpdate,
                { new: true, upsert: true, runValidators: true }
              )
              .populate('tasks.assignedTo', 'id name avatar')
              .populate('tasks.createdBy', 'id name avatar');
              updatedBoards.push(updatedBoard);
            }
            // Broadcast the updated data to all other clients
            const dataToSend = { boards: updatedBoards };
            socket.broadcast.emit('board_updated', dataToSend);
        }
    } catch (err) {
        console.error('Error updating board:', err);
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
