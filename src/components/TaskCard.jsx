import React, { useEffect, useState } from 'react';
import { GripVertical, Edit3, Trash2, Calendar } from 'lucide-react';
import { PRIORITY_CONFIG } from '../constants/priorityConfig';
import { formatDate, isOverdue } from '../utils/dateUtils';
import { renderMarkdown } from '../utils/markdown';
import { useTheme } from '../contexts/ThemeContext';
import { BACKEND_URL } from '../constants/config';

const TaskCard = ({ task, onEdit, onDelete, isDragging }) => {
  const { isDark } = useTheme();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetch(`${BACKEND_URL}/api/users`)
      .then(res => res.json())
      .then(data => setUsers(data.filter(u => u && u.id && u.name)));
  }, []);

  const assigneeIds = Array.isArray(task.assignedTo) ? task.assignedTo : 
                     task.assignedTo ? [task.assignedTo] : [];

  const assignedUsers = assigneeIds.map(id => 
    users.find(member => member.id === id)
  ).filter(Boolean);

  const creator = users.find(member => member.id === task.createdBy);
  const priorityConfig = PRIORITY_CONFIG[task.priority];

  return (
    <div className={`rounded-lg p-3 sm:p-4 shadow-md mb-3 sm:mb-4 bg-white dark:bg-gray-800 border ${isDragging ? 'border-blue-500' : 'border-transparent'}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2 min-w-0 flex-1">
          <button className="cursor-move text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 flex-shrink-0">
            <GripVertical className="w-4 h-4" />
          </button>
          <h3 className="font-semibold text-sm sm:text-lg dark:text-white truncate">{task.title}</h3>
        </div>
        <div className="flex items-center gap-1 sm:gap-2 flex-shrink-0">
          <button onClick={() => onEdit(task)} className="text-blue-500 hover:text-blue-700 p-1">
            <Edit3 className="w-4 h-4" />
          </button>
          <button onClick={() => onDelete(task.id)} className="text-red-500 hover:text-red-700 p-1">
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="mb-2 text-xs sm:text-sm dark:text-gray-200 line-clamp-2">
        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(task.description) }} />
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-0">
        <div className="flex flex-wrap items-center gap-1 sm:gap-2">
          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${priorityConfig.color}`}>
            <span className="mr-1">{priorityConfig.icon}</span>
            <span className="hidden sm:inline">{priorityConfig.label}</span>
            <span className="sm:hidden">{priorityConfig.label.charAt(0)}</span>
          </span>
          {task.dueDate && (
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
              isOverdue(task.dueDate) 
                ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' 
                : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
            }`}>
              <Calendar className="w-3 h-3 mr-1" />
              <span className="hidden sm:inline">{formatDate(task.dueDate)}</span>
              <span className="sm:hidden">{formatDate(task.dueDate).split(' ')[0]}</span>
            </span>
          )}
        </div>
        {assignedUsers.length > 0 && (
          <div className="flex items-center space-x-1">
            {assignedUsers.slice(0, 2).map(user => (
              <div key={user.id} className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium" title={user.name}>
                {user.avatar}
              </div>
            ))}
            {assignedUsers.length > 2 && (
              <div className="text-xs text-gray-500">+{assignedUsers.length - 2}</div>
            )}
          </div>
        )}
      </div>
      {creator ? (
        <div className={`mt-2 pt-2 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Created by {creator.name}
          </span>
        </div>
      ) : (
        <div className={`mt-2 pt-2 border-t ${
          isDark ? 'border-gray-700' : 'border-gray-100'
        }`}>
          <span className={`text-xs ${
            isDark ? 'text-gray-400' : 'text-gray-500'
          }`}>
            Created by Unknown{task.createdBy ? ` (${task.createdBy})` : ''}
          </span>
        </div>
      )}
    </div>
  );
};

export default TaskCard;
