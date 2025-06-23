import React, { useState, useEffect } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const TaskModal = ({ task = null, onSave, onCancel, columnId, currentUser, users = [] }) => {
  console.log('currentUser in TaskModal:', currentUser); // DEBUG
  const { isDark } = useTheme();

  const initialAssignees = task?.assignedTo 
    ? (Array.isArray(task.assignedTo) ? task.assignedTo : [task.assignedTo])
    : [];

  // Helper to extract user ID from possible object or string
  function getUserId(val) {
    if (!val) return '';
    if (typeof val === 'string') return val;
    if (typeof val === 'object' && (val._id || val.id)) return val._id || val.id;
    return '';
  }

  const [formData, setFormData] = useState({
    title: task?.title || '',
    description: task?.description || '',
    priority: task?.priority || 'medium',
    dueDate: task?.dueDate || '',
    assignedTo: initialAssignees,
    createdBy: getUserId(task?.createdBy) || (currentUser?._id || '')
  });

  useEffect(() => {
    setFormData(prev => ({ ...prev, createdBy: currentUser?._id || '' }));
  }, [currentUser]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const finalFormData = {
      ...formData,
      assignedTo: formData.assignedTo.map(id => {
        const user = users.find(u => u.id === id);
        return user ? user.id : id;
      }),
      createdBy: currentUser?.id || ''
    };
    if (finalFormData.title.trim()) {
      const taskData = {
        ...finalFormData,
        id: task?.id || Date.now().toString(),
        createdAt: task?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        columnId: task?.columnId || columnId
      };
      onSave(taskData);
    }
  };

  const handleAssigneeChange = (memberId) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: prev.assignedTo.includes(memberId)
        ? prev.assignedTo.filter(id => id !== memberId)
        : [...prev.assignedTo, memberId]
    }));
  };

  return (
    <div className={`fixed inset-0 flex items-center justify-center z-50 p-4 ${isDark ? 'bg-black bg-opacity-70' : 'bg-gray-900 bg-opacity-40'}`}>
      <form onSubmit={handleSubmit} className={`bg-white dark:bg-gray-800 p-4 sm:p-6 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto`}>
        <h2 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 dark:text-white">{task ? 'Edit Task' : 'Add Task'}</h2>
        
        <div className="space-y-3 sm:space-y-4">
          <div>
            <input
              className="w-full p-2 sm:p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              type="text"
              placeholder="Title"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          
          <div>
            <textarea
              className="w-full p-2 sm:p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-sm sm:text-base resize-none"
              placeholder="Description (Markdown supported)"
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
              rows="3"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Priority:</label>
            <select
              className="w-full p-2 sm:p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              value={formData.priority}
              onChange={e => setFormData({ ...formData, priority: e.target.value })}
            >
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1 dark:text-gray-200">Due Date:</label>
            <input
              className="w-full p-2 sm:p-3 border rounded-lg dark:bg-gray-700 dark:text-white text-sm sm:text-base"
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-2 dark:text-gray-200">Assign to:</label>
            <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 border rounded-lg dark:bg-gray-700">
              {users.length === 0 ? (
                <span className="text-xs text-gray-400">No users available</span>
              ) : (
                <>
                  {users.map(member => (
                    <label key={member.id} className="flex items-center space-x-2 bg-gray-100 dark:bg-gray-600 rounded-lg px-2 py-1 cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-500 transition-colors">
                      <input
                        type="checkbox"
                        checked={formData.assignedTo.includes(member.id)}
                        onChange={() => handleAssigneeChange(member.id)}
                        className="w-4 h-4"
                      />
                      <span className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        {member.avatar || member.name[0]}
                      </span>
                      <span className="text-xs dark:text-gray-200 truncate max-w-20">{member.name}</span>
                    </label>
                  ))}
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex justify-end gap-2 mt-4 sm:mt-6">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-3 sm:px-4 py-2 rounded-lg bg-gray-300 dark:bg-gray-600 dark:text-white text-sm sm:text-base hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit" 
            className="px-3 sm:px-4 py-2 rounded-lg bg-blue-600 text-white text-sm sm:text-base hover:bg-blue-700 transition-colors"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskModal;
