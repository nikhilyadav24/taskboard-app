import React, { useState } from 'react';
import { Plus, Calendar, CheckCircle, Trash2 } from 'lucide-react';
import { formatDate } from '../utils/dateUtils';
import { useTheme } from '../contexts/ThemeContext';

const BoardView = ({ boards, onCreateBoard, onSelectBoard, onDeleteBoard }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newBoardData, setNewBoardData] = useState({ title: '', description: '' });
  const [hoveredBoard, setHoveredBoard] = useState(null);
  const { isDark } = useTheme();

  const handleCreateBoard = (e) => {
    e.preventDefault();
    if (newBoardData.title.trim()) {
      const board = {
        id: Date.now().toString(),
        title: newBoardData.title.trim(),
        description: newBoardData.description.trim(),
        createdAt: new Date().toISOString(),
        columns: [],
        tasks: []
      };
      onCreateBoard(board);
      setNewBoardData({ title: '', description: '' });
      setIsCreating(false);
    }
  };

  return (
    <div className="min-h-screen">
      {/* Header Section */}
      <div className="mb-6 sm:mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-2 flex items-center">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mr-3 sm:mr-4 modern-shadow">
                <svg className="w-4 h-4 sm:w-6 sm:h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              Your Projects
            </h1>
            <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400 ml-11 sm:ml-14">
              Organize and manage your team's projects with ease
            </p>
          </div>
          
          <button
            onClick={() => setIsCreating(true)}
            className="btn-primary flex items-center text-base sm:text-lg px-4 sm:px-6 py-2 sm:py-3 w-full sm:w-auto justify-center"
          >
            <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
            Create Board
          </button>
        </div>
      </div>

      {/* Boards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
        {boards.map(board => (
          <div
            key={board.id}
            onMouseEnter={() => setHoveredBoard(board.id)}
            onMouseLeave={() => setHoveredBoard(null)}
            className="modern-card modern-card-hover p-6 sm:p-4 fade-in rounded-2xl"
          >
            <div className="flex items-start justify-between mb-4 sm:mb-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 truncate">
                  {board.title}
                </h3>
                <p 
                  className={`text-gray-600 dark:text-gray-400 mb-4 sm:mb-6 text-sm sm:text-base overflow-hidden transition-all duration-300 ease-in-out ${
                    hoveredBoard === board.id ? 'max-h-96' : 'max-h-[1.25rem] sm:max-h-[1.5rem]'
                  }`}
                >
                  {board.description || 'No description provided'}
                </p>
              </div>
              <button
                onClick={() => onDeleteBoard(board.id)}
                className={`p-1 sm:p-2 rounded-lg transition-all duration-200 flex-shrink-0 ${
                  isDark 
                    ? 'text-gray-400 hover:text-red-400 hover:bg-red-900/20' 
                    : 'text-gray-400 hover:text-red-500 hover:bg-red-50'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs sm:text-sm text-gray-500 dark:text-gray-400 mb-4 sm:mb-6">
              <span className="flex items-center">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {formatDate(board.createdAt)}
              </span>
              <span className="flex items-center">
                <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                {board.tasks?.length || 0} tasks
              </span>
            </div>

            <button
              onClick={() => onSelectBoard(board)}
              className="w-full btn-primary text-sm sm:text-base py-2 sm:py-3"
            >
              Open Board
            </button>
          </div>
        ))}

        {boards.length === 0 && (
          <div className="col-span-full text-center py-12 sm:py-16">
            <div className={`w-16 h-16 sm:w-24 sm:h-24 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6 ${
              isDark 
                ? 'bg-gradient-to-r from-blue-900/20 to-purple-900/20' 
                : 'bg-gradient-to-r from-blue-100 to-purple-100'
            }`}>
              <svg className="w-8 h-8 sm:w-12 sm:h-12 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-3">
              No projects yet
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6 sm:mb-8 max-w-md mx-auto text-sm sm:text-base">
              Create your first project board to start organizing tasks and collaborating with your team
            </p>
            <button
              onClick={() => setIsCreating(true)}
              className="btn-primary text-base sm:text-lg px-6 sm:px-8 py-3 sm:py-4"
            >
              <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2" />
              Create Your First Board
            </button>
          </div>
        )}
      </div>

      {/* Create Board Modal */}
      {isCreating && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="glass-effect rounded-3xl shadow-2xl max-w-md w-full p-6 sm:p-8 fade-in">
            <div className="text-center mb-6">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Plus className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Create New Board
              </h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">
                Set up a new project board for your team
              </p>
            </div>
            
            <form onSubmit={handleCreateBoard} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">
                  Board Title *
                </label>
                <input
                  type="text"
                  value={newBoardData.title}
                  onChange={(e) => setNewBoardData({ ...newBoardData, title: e.target.value })}
                  className="modern-input"
                  placeholder="Enter board title"
                  required
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">
                  Description
                </label>
                <textarea
                  value={newBoardData.description}
                  onChange={(e) => setNewBoardData({ ...newBoardData, description: e.target.value })}
                  className="modern-input resize-none"
                  rows="3"
                  placeholder="Describe your project (optional)"
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsCreating(false)}
                  className="btn-secondary flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-primary flex-1"
                >
                  Create Board
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default BoardView;
