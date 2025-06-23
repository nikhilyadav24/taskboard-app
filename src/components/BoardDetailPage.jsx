import React, { useState, useEffect } from 'react';
import { Search, Plus, ArrowLeft, Sun, Moon } from 'lucide-react';
import { DragDropContext } from '@hello-pangea/dnd';
import Column from './Column';
import TaskModal from './TaskModal';
import { useTheme } from '../contexts/ThemeContext';
import { BACKEND_URL } from '../constants/config';

const BoardDetailPage = ({ board, onBack, onUpdateBoard, currentUser, users }) => {
  const { isDark} = useTheme();
  const [columns, setColumns] = useState(board.columns || []);
  const [tasks, setTasks] = useState(board.tasks || []);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [assigneeFilter, setAssigneeFilter] = useState('all');
  const [sortBy, setSortBy] = useState('createdAt');

  const onDragEnd = (result) => {
    const { source, destination, draggableId } = result;

    if (!destination) {
      return;
    }

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    setTasks(prevTasks => {
      const newTasks = Array.from(prevTasks);

      const draggedTaskIndex = newTasks.findIndex(t => t.id === draggableId);
      if (draggedTaskIndex === -1) return prevTasks;

      const [draggedTask] = newTasks.splice(draggedTaskIndex, 1);
      const updatedDraggedTask = { ...draggedTask, columnId: destination.droppableId };

      const destColumnTasks = newTasks.filter(t => t.columnId === destination.droppableId);
      
      let insertAtIndex = -1;
      
      if (destination.index < destColumnTasks.length) {
        const taskToInsertBefore = destColumnTasks[destination.index];
        insertAtIndex = newTasks.findIndex(t => t.id === taskToInsertBefore.id);
      } else {
        const lastTaskInDestColumn = destColumnTasks[destColumnTasks.length - 1];
        if (lastTaskInDestColumn) {
          insertAtIndex = newTasks.findIndex(t => t.id === lastTaskInDestColumn.id) + 1;
        } else {
          insertAtIndex = newTasks.length; 
        }
      }
      
      if (insertAtIndex === -1) {
          let lastTaskInDestColIndex = -1;
          for (let i = newTasks.length - 1; i >= 0; i--) {
              if (newTasks[i].columnId === destination.droppableId) {
                  lastTaskInDestColIndex = i;
                  break;
              }
          }
          if (lastTaskInDestColIndex !== -1) {
              insertAtIndex = lastTaskInDestColIndex + 1;
          } else {
              insertAtIndex = 0;
          }
      }

      newTasks.splice(insertAtIndex, 0, updatedDraggedTask);
      return newTasks;
    });
  };

  const handleSortChange = (newSortBy) => {
    setSortBy(newSortBy);
    const newTasks = [...tasks];
    newTasks.sort((a, b) => {
      switch (newSortBy) {
        case 'dueDate': {
          if (!a.dueDate && !b.dueDate) return 0;
          if (!a.dueDate) return 1;
          if (!b.dueDate) return -1;
          return new Date(a.dueDate) - new Date(b.dueDate);
        }
        case 'priority': {
          const priorityOrder = { high: 3, medium: 2, low: 1 };
          return (priorityOrder[b.priority] || 0) - (priorityOrder[a.priority] || 0);
        }
        case 'assignee': {
          const aAssignee = users.find(m => m.id === (Array.isArray(a.assignedTo) ? a.assignedTo[0] : a.assignedTo))?.name || '';
          const bAssignee = users.find(m => m.id === (Array.isArray(b.assignedTo) ? b.assignedTo[0] : b.assignedTo))?.name || '';
          return aAssignee.localeCompare(bAssignee);
        }
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });
    setTasks(newTasks);
  };

  // Filter tasks (sorting is now handled by handleSortChange)
  const getFilteredTasks = (columnId) => {
    let filteredTasks = tasks.filter(task => task.columnId === columnId);

    // Apply search filter
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Apply priority filter
    if (priorityFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => task.priority === priorityFilter);
    }

    // Apply assignee filter
    if (assigneeFilter !== 'all') {
      filteredTasks = filteredTasks.filter(task => {
        const assigneeIds = Array.isArray(task.assignedTo) ? task.assignedTo : 
                           task.assignedTo ? [task.assignedTo] : [];
        return assigneeIds.includes(assigneeFilter);
      });
    }

    return filteredTasks;
  };

  const addColumn = () => {
    const newColumn = {
      id: Date.now().toString(),
      title: 'New Column',
      createdAt: new Date().toISOString()
    };
    setColumns([...columns, newColumn]);
  };

  const editColumn = (columnId, updates) => {
    setColumns(columns.map(col => 
      col.id === columnId ? { ...col, ...updates } : col
    ));
  };

  const deleteColumn = (columnId) => {
    if (window.confirm('Are you sure? This will also delete all tasks in this column.')) {
      setColumns(columns.filter(col => col.id !== columnId));
      setTasks(tasks.filter(task => task.columnId !== columnId));
    }
  };

  const addTask = (columnId, taskData) => {
    const newTask = { ...taskData, columnId, createdBy: currentUser?._id };
    setTasks([...tasks, newTask]);
    setEditingTask(null);
  };

  const editTask = (taskData) => {
    setTasks(tasks.map(task => 
      task.id === taskData.id ? { ...taskData, createdBy: taskData.createdBy || currentUser?._id } : task
    ));
    setEditingTask(null);
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setTasks(tasks.filter(task => task.id !== taskId));
    }
  };

  // Defensive: filter out tasks with missing createdBy before saving
  useEffect(() => {
    const safeTasks = tasks.filter(task => !!task.createdBy);
    onUpdateBoard({ ...board, columns, tasks: safeTasks });
  }, [columns, tasks]);

  return (
    <div className={`min-h-screen ${
      isDark 
        ? 'bg-gradient-to-br from-gray-900 to-gray-800' 
        : 'bg-gradient-to-br from-blue-50 to-indigo-100'
    }`}>
      {/* Header */}
      <div className={`shadow-sm border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-4 sm:h-16 space-y-4 sm:space-y-0">
            <div className="flex items-center">
              <button
                onClick={onBack}
                className={`flex items-center transition-colors ${
                  isDark 
                    ? 'text-gray-300 hover:text-gray-100' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <ArrowLeft className="w-5 h-5 mr-2" />
                <span className="hidden sm:inline">Back</span>
                <span className="sm:hidden">Back</span>
              </button>
              <div className={`ml-4 pl-4 border-l ${
                isDark ? 'border-gray-600' : 'border-gray-300'
              }`}>
                <h1 className={`text-lg sm:text-xl font-semibold ${
                  isDark ? 'text-gray-100' : 'text-gray-900'
                }`}>
                  {board.title}
                </h1>
                <p className={`text-sm ${
                  isDark ? 'text-gray-400' : 'text-gray-500'
                } hidden sm:block`}>
                  {board.description}
                </p>
              </div>
            </div>
            
            {/* Theme Toggle */}
            {/* <button
              onClick={toggleTheme}
              className={`p-2 rounded-lg transition-colors ${
                isDark 
                  ? 'text-gray-300 hover:text-yellow-400 hover:bg-gray-700' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button> */}
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className={`border-b ${
        isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <div className="max-w-7xl mx-auto px-2 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col gap-4">
            <div className="relative mb-2">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                isDark ? 'text-gray-400' : 'text-gray-400'
              }`} />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-full ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400' 
                    : 'border-gray-300 text-gray-900 placeholder-gray-500'
                }`}
              />
            </div>
            {/* Horizontal scrollable filters on mobile */}
            <div className="flex flex-row gap-2 overflow-x-auto pb-2 -mx-2 px-2 sm:mx-0 sm:px-0">
              <select
                value={sortBy}
                onChange={(e) => handleSortChange(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-shrink-0 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'border-gray-300 text-gray-900'
                }`}
                style={{ minWidth: 140 }}
              >
                <option value="createdAt">Sort by Created</option>
                <option value="dueDate">Sort by Due Date</option>
                <option value="priority">Sort by Priority</option>
                <option value="assignee">Sort by Assignee</option>
              </select>

              <select
                value={priorityFilter}
                onChange={(e) => setPriorityFilter(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-shrink-0 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'border-gray-300 text-gray-900'
                }`}
                style={{ minWidth: 140 }}
              >
                <option value="all">All Priorities</option>
                <option value="high">High Priority</option>
                <option value="medium">Medium Priority</option>
                <option value="low">Low Priority</option>
              </select>

              <select
                value={assigneeFilter}
                onChange={(e) => setAssigneeFilter(e.target.value)}
                className={`px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm flex-shrink-0 ${
                  isDark 
                    ? 'bg-gray-700 border-gray-600 text-gray-100' 
                    : 'border-gray-300 text-gray-900'
                }`}
                style={{ minWidth: 140 }}
              >
                <option value="all">All Assignees</option>
                {users.map(member => (
                  <option key={member.id} value={member.id}>{member.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Board Content */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="p-1 sm:p-4 lg:p-6">
          <div className="flex gap-2 sm:gap-4 lg:gap-6 overflow-x-auto pb-6 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100 w-full min-w-0">
            {columns.map(column => (
              <Column
                key={column.id}
                column={column}
                tasks={getFilteredTasks(column.id)}
                onAddTask={addTask}
                onEditColumn={editColumn}
                onDeleteColumn={deleteColumn}
                onTaskEdit={task => setEditingTask(task)}
                onTaskDelete={deleteTask}
                currentUser={currentUser}
                users={users}
              />
            ))}

            <div className="flex-shrink-0">
              <button
                onClick={addColumn}
                className={`w-64 sm:w-72 lg:w-80 h-24 sm:h-28 lg:h-32 border-2 border-dashed rounded-lg flex items-center justify-center transition-colors ${
                  isDark 
                    ? 'border-gray-600 text-gray-400 hover:border-blue-400 hover:text-blue-400' 
                    : 'border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600'
                }`}
              >
                <Plus className="w-5 h-5 sm:w-6 sm:h-6 mr-2" />
                <span className="text-sm sm:text-base">Add Column</span>
              </button>
            </div>
          </div>
        </div>
      </DragDropContext>

      {/* Edit Task Modal */}
      {editingTask && (
        <TaskModal
          task={editingTask.id ? tasks.find(t => t.id === editingTask.id) : null}
          onSave={editingTask.id ? editTask : addTask}
          onCancel={() => setEditingTask(null)}
          columnId={editingTask.columnId}
          currentUser={currentUser}
          users={users}
        />
      )}
    </div>
  );
};

export default BoardDetailPage;
