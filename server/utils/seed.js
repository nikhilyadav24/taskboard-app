const User = require('../models/User');
const Board = require('../models/Board');

// --- INITIAL DATA ---
const initialUsers = [
  { id: 'u1', name: 'Nikhil Yadav', username: 'nikhilyadav', password: 'password1', avatar: 'NY' },
  { id: 'u2', name: 'Emitrr', username: 'emitrr', password: 'password', avatar: 'E' },
  { id: 'u3', name: 'Priya Sharma', username: 'priyasharma', password: 'password2', avatar: 'PS' },
  { id: 'u4', name: 'Aman Gupta', username: 'amangupta', password: 'password3', avatar: 'AG' }
];

const initialBoard = {
  id: '1',
  title: 'Website Redesign Project',
  description: 'Complete redesign of with modern UI/UX',
  columns: [
    { id: '1', title: 'To Do', createdAt: new Date() },
    { id: '2', title: 'In Progress', createdAt: new Date() },
    { id: '3', title: 'Review', createdAt: new Date() },
    { id: '4', title: 'Done', createdAt: new Date() }
  ],
  tasks: [
    {
      id: '1',
      title: 'Create wireframes for homepage',
      description: 'Design **wireframes** for the new homepage layout with focus on *user experience*',
      priority: 'high',
      dueDate: new Date('2024-08-01'),
      assignedTo: [], // Will be populated with User ObjectIds
      createdBy: null, // Will be populated with a User ObjectId
      columnId: '1',
    },
     {
      id: '2',
      title: 'Develop API for user authentication',
      description: 'Build and test the user auth API endpoints.',
      priority: 'high',
      dueDate: new Date('2024-08-05'),
      assignedTo: [],
      createdBy: null,
      columnId: '1',
    },
    {
      id: '3',
      title: 'Design database schema',
      description: 'Create the database schema for all application models.',
      priority: 'medium',
      dueDate: new Date('2024-08-03'),
      assignedTo: [],
      createdBy: null,
      columnId: '2',
    },
  ]
};

const seedDatabase = async () => {
  try {
    // Check if there are any users. If so, we assume DB is seeded.
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('Database already seeded.');
      return;
    }

    console.log('Seeding database...');
    
    // --- Create Users ---
    // In a real app, passwords should be hashed. For this project, we store them as-is.
    const createdUsers = await User.insertMany(initialUsers.map(({ password, ...user }) => ({
      ...user,
      password: password, // Storing plain text password
    })));
    
    // Create a map of old string IDs to new MongoDB ObjectIds
    const userIdMap = {};
    createdUsers.forEach((user, index) => {
      userIdMap[initialUsers[index].id] = user._id;
    });

    // --- Prepare and Create Board ---
    // Assign users to tasks using the new ObjectIds
    initialBoard.tasks[0].assignedTo = [userIdMap['u1'], userIdMap['u2']];
    initialBoard.tasks[0].createdBy = userIdMap['u2'];
    initialBoard.tasks[1].assignedTo = [userIdMap['u1']];
    initialBoard.tasks[1].createdBy = userIdMap['u1'];
    initialBoard.tasks[2].assignedTo = [userIdMap['u3']];
    initialBoard.tasks[2].createdBy = userIdMap['u4'];
    
    await Board.create(initialBoard);

    console.log('Database seeded successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

module.exports = seedDatabase; 