const express = require('express');
const http = require('http');
const { Server } = require("socket.io");
const cors = require('cors');

const app = express();
app.use(express.json());

const server = http.createServer(app);

const allowedOrigins = (process.env.FRONTEND_URL || 'http://localhost:5173').split(',');

const corsOptions = {
  origin: function (origin, callback) {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  methods: ["GET", "POST"]
};

// Use CORS for Express
app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// --- USERS ---
let users = [
  { id: 'u1', name: 'Nikhil Yadav', username: 'nikhilyadav', password: 'password1', avatar: 'NY' },
  { id: 'u2', name: 'Emitrr', username: 'emitrr', password: 'password', avatar: 'E' },
  { id: 'u3', name: 'Priya Sharma', username: 'priyasharma', password: 'password2', avatar: 'PS' },
  { id: 'u4', name: 'Aman Gupta', username: 'amangupta', password: 'password3', avatar: 'AG' }
];

// --- BOARDS ---
let boardData = {
  boards: [
    {
      id: '1',
      title: 'Website Redesign Project',
      description: 'Complete redesign of with modern UI/UX',
      createdAt: '2024-01-15T10:00:00Z',
      columns: [
        { id: '1', title: 'To Do', createdAt: '2024-01-15T10:00:00Z' },
        { id: '2', title: 'In Progress', createdAt: '2024-01-15T10:00:00Z' },
        { id: '3', title: 'Review', createdAt: '2024-01-15T10:00:00Z' },
        { id: '4', title: 'Done', createdAt: '2024-01-15T10:00:00Z' }
      ],
      tasks: [
        {
          id: '1',
          title: 'Create wireframes for homepage',
          description: 'Design **wireframes** for the new homepage layout with focus on *user experience*',
          priority: 'high',
          dueDate: '2024-02-01',
          assignedTo: ['u1', 'u2'],
          createdBy: 'u2',
          columnId: '1',
          createdAt: '2024-01-15T10:30:00Z',
          updatedAt: '2024-01-15T10:30:00Z'
        },
        // ... more tasks
      ]
    },
    // ... more boards
  ]
};

// --- USER ENDPOINTS ---
app.get('/api/users', (req, res) => {
  res.json(users.map(u => ({ ...u, password: undefined })));
});

app.post('/api/signup', (req, res) => {
  const { name, username, password } = req.body;
  if (!name || !username || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }
  if (users.find(u => u.username === username)) {
    return res.status(409).json({ error: 'Username already exists' });
  }
  const id = 'u' + (users.length + 1);
  const avatar = name.split(' ').map(w => w[0]).join('').toUpperCase();
  const user = { id, name, username, password, avatar };
  users.push(user);
  res.json({ ...user, password: undefined });
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  res.json({ ...user, password: undefined });
});

// --- BOARD ENDPOINTS ---
app.get('/api/boards', (req, res) => {
  res.json(boardData.boards);
});

io.on('connection', (socket) => {
  console.log('a user connected');

  // Send the current board data to the new client
  socket.emit('initial_data', boardData);

  socket.on('update_board', (newBoardData) => {
    boardData = newBoardData;
    // Broadcast the updated data to all other clients
    socket.broadcast.emit('board_updated', boardData);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
