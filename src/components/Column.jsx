import React, { useState } from 'react';
import { Plus, Edit3, Trash2, Save, X } from 'lucide-react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import TaskCard from './TaskCard';
import TaskModal from './TaskModal';
import { useTheme } from '../contexts/ThemeContext';

const Column = ({ column, tasks, onAddTask, onEditColumn, onDeleteColumn, onTaskEdit, onTaskDelete, currentUser, users }) => {
  const { isDark } = useTheme();
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [isEditingColumn, setIsEditingColumn] = useState(false);
  const [columnTitle, setColumnTitle] = useState(column.title);

  const handleSaveColumn = () => {
    if (columnTitle.trim()) {
      onEditColumn(column.id, { title: columnTitle.trim() });
      setIsEditingColumn(false);
    }
  };

  const handleCancelEdit = () => {
    setColumnTitle(column.title);
    setIsEditingColumn(false);
  };

  return (
    <div className={`flex-shrink-0 w-64 sm:w-72 lg:w-[28rem] rounded-lg p-3 sm:p-4 ${
      isDark ? 'bg-gray-800' : 'bg-gray-50'
    }`}>
      <div className="flex items-center justify-between mb-3 sm:mb-4">
        {isEditingColumn ? (
          <div className="flex items-center space-x-2 flex-1">
            <input
              type="text"
              value={columnTitle}
              onChange={(e) => setColumnTitle(e.target.value)}
              className={`flex-1 px-2 py-1 border rounded text-sm ${
                isDark 
                  ? 'bg-gray-700 border-gray-600 text-gray-100' 
                  : 'border-gray-300 text-gray-900'
              }`}
              onKeyPress={(e) => e.key === 'Enter' && handleSaveColumn()}
              autoFocus
            />
            <button onClick={handleSaveColumn} className="p-1 text-green-600 hover:bg-green-100 rounded">
              <Save className="w-4 h-4" />
            </button>
            <button onClick={handleCancelEdit} className="p-1 text-gray-600 hover:bg-gray-100 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <>
            <h3 className={`font-semibold flex items-center text-sm sm:text-base ${
              isDark ? 'text-gray-100' : 'text-gray-800'
            }`}>
              <span className="truncate">{column.title}</span>
              <span className={`ml-2 text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                isDark 
                  ? 'bg-gray-700 text-gray-300' 
                  : 'bg-gray-200 text-gray-600'
              }`}>
                {tasks.length}
              </span>
            </h3>
            <div className="flex space-x-1 flex-shrink-0">
              <button
                onClick={() => setIsEditingColumn(true)}
                className={`p-1 transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-blue-400' 
                    : 'text-gray-400 hover:text-blue-600'
                }`}
              >
                <Edit3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => onDeleteColumn(column.id)}
                className={`p-1 transition-colors ${
                  isDark 
                    ? 'text-gray-400 hover:text-red-400' 
                    : 'text-gray-400 hover:text-red-600'
                }`}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </>
        )}
      </div>

      <Droppable droppableId={column.id} type="task">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={`min-h-24 sm:min-h-32 rounded-lg p-2 transition-colors ${
              snapshot.isDraggingOver 
                ? 'bg-blue-100 dark:bg-gray-700' 
                : ''
            }`}
          >
            {tasks.map((task, index) => (
              <Draggable key={task.id} draggableId={task.id} index={index}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <TaskCard
                      task={task}
                      onEdit={onTaskEdit}
                      onDelete={onTaskDelete}
                      isDragging={snapshot.isDragging}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <button
        onClick={() => setIsAddingTask(true)}
        className={`w-full mt-3 sm:mt-4 flex items-center justify-center px-2 sm:px-3 py-2 border-2 border-dashed rounded-lg transition-colors text-sm sm:text-base ${
          isDark 
            ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400' 
            : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
        }`}
      >
        <Plus className="w-4 h-4 mr-2" />
        Add Task
      </button>

      {isAddingTask && (
        <TaskModal
          onSave={(taskData) => {
            onAddTask(column.id, taskData);
            setIsAddingTask(false);
          }}
          onCancel={() => setIsAddingTask(false)}
          columnId={column.id}
          currentUser={currentUser}
          users={users}
        />
      )}
    </div>
  );
};

export default Column;