import React, { useState, useEffect } from 'react';
import io from 'socket.io-client';
import BoardView from './components/BoardView';
import BoardDetailPage from './components/BoardDetailPage';
import LoginPage from './components/LoginPage';
import SignupPage from './components/SignupPage';
import { BACKEND_URL } from './constants/config';
import { useTheme } from './contexts/ThemeContext';
import FeatureOnboardingModal from './components/FeatureOnboardingModal';

const socket = io(BACKEND_URL);

// Main App Component
const TaskBoardApp = () => {
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('boards');
  const [selectedBoard, setSelectedBoard] = useState(null);
  const [boards, setBoards] = useState([]);
  const [users, setUsers] = useState([]);
  const [showSignup, setShowSignup] = useState(false);
  const { isDark, toggleTheme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [pendingOnboarding, setPendingOnboarding] = useState(false);

  // Fetch users from backend
  const fetchUsers = () => {
    fetch(`${BACKEND_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data.map(u => ({ ...u, id: u.id || u._id }))));
  };

  // Fetch boards from backend
  const fetchBoards = () => {
    fetch(`${BACKEND_URL}/api/boards`)
      .then(res => res.json())
      .then(data => setBoards(data));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // Listen for initial data
    socket.on('initial_data', (data) => {
      setBoards(data.boards);
    });

    // Listen for updates
    socket.on('board_updated', (data) => {
      setBoards(data.boards);
    });

    // Clean up the effect
    return () => {
      socket.off('initial_data');
      socket.off('board_updated');
    };
  }, []);

  useEffect(() => {
    if (user) fetchBoards();
  }, [user]);

  useEffect(() => {
    if (user && !localStorage.getItem('hasSeenOnboarding')) {
      setShowOnboarding(true);
    }
  }, [user]);

  const handleLogout = () => {
    setUser(null);
    setCurrentView('boards');
    setSelectedBoard(null);
  };

  const handleCreateBoard = (board) => {
    const newBoards = [...boards, board];
    setBoards(newBoards);
    socket.emit('update_board', { boards: newBoards });
  };

  const handleSelectBoard = (board) => {
    setSelectedBoard(board);
    setCurrentView('board-detail');
  };

  const handleUpdateBoard = (updatedBoard) => {
    const newBoards = boards.map(board => 
      board.id === updatedBoard.id ? updatedBoard : board
    );
    setBoards(newBoards);
    setSelectedBoard(updatedBoard);
    socket.emit('update_board', { boards: newBoards });
  };

  const handleDeleteBoard = (boardId) => {
    if (window.confirm('Are you sure you want to delete this board? This action cannot be undone.')) {
      const newBoards = boards.filter(board => board.id !== boardId);
      setBoards(newBoards);
      socket.emit('update_board', { boards: newBoards });
    }
  };

  const handleBackToBoards = () => {
    setCurrentView('boards');
    setSelectedBoard(null);
  };

  const handleCloseOnboarding = () => {
    setShowOnboarding(false);
  };

  // Custom signup handler to trigger onboarding
  const handleSignup = (userData) => {
    setUser(userData);
    setPendingOnboarding(true);
    setCurrentView('boards');
    setSelectedBoard(null);
  };

  // Custom login handler to reset view
  const handleLogin = (userData) => {
    setUser(userData);
    setCurrentView('boards');
    setSelectedBoard(null);
  };

  useEffect(() => {
    if (user && pendingOnboarding) {
      setShowOnboarding(true);
      setPendingOnboarding(false);
    }
  }, [user, pendingOnboarding]);

  if (!user) {
    return showSignup
      ? <SignupPage onSignup={handleSignup} onSwitchToLogin={() => setShowSignup(false)} />
      : <LoginPage onLogin={handleLogin} onSwitchToSignup={() => setShowSignup(true)} />;
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      isDark ? 'bg-gradient-to-br from-gray-900 to-gray-800' : 'bg-gradient-to-br from-gray-50 to-gray-100'
    }`}>
      {showOnboarding && <FeatureOnboardingModal onClose={handleCloseOnboarding} />}
      {/* Modern Header */}
      <div className="glass-effect border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3 sm:gap-0">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center modern-shadow">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  TaskBoard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 hidden sm:block">Project Management Made Simple</p>
              </div>
            </div>

            {/* User Info and Actions */}
            <div className="flex items-center gap-2 sm:gap-4">
              {/* User Info FIRST */}
              <div className="flex items-center gap-2 sm:gap-3 order-1">

                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">
                    {user.name || user.username}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Active</p>
                </div>
                <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-sm sm:text-base font-semibold">
                  {user.name ? user.name.split(' ').map(n => n[0]).join('') : user.username[0].toUpperCase()}
                </div>
              </div>

              {/* Theme Toggle SECOND */}
              <button
                onClick={toggleTheme}
                className={`p-2 rounded-lg transition-all duration-200 order-2 ${
                  isDark 
                    ? 'bg-gray-700 hover:bg-gray-600 text-yellow-400' 
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                }`}
                title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              >
                {isDark ? (
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                )}
              </button>

              {/* Sign Out Button LAST */}
              <button 
                onClick={handleLogout} 
                className="btn-secondary flex items-center text-xs sm:text-sm px-3 sm:px-4 py-2 order-3"
              >
                <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {currentView === 'boards' ? (
          <BoardView
            boards={boards}
            onCreateBoard={handleCreateBoard}
            onSelectBoard={handleSelectBoard}
            onDeleteBoard={handleDeleteBoard}
          />
        ) : (
          <BoardDetailPage
            board={selectedBoard}
            onBack={handleBackToBoards}
            onUpdateBoard={handleUpdateBoard}
            currentUser={user}
            users={users}
          />
        )}
      </div>
    </div>
  );
};

export default TaskBoardApp;