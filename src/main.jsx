import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import TaskBoardApp from './App';
import { ThemeProvider } from './contexts/ThemeContext';

ReactDOM.createRoot(document.getElementById('root')).render(
  <ThemeProvider>
    <TaskBoardApp />
  </ThemeProvider>
);