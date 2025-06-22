export const TEAM_MEMBERS = [
    { id: '1', name: 'Alice Johnson', email: 'alice@company.com', avatar: 'AJ' },
    { id: '2', name: 'Bob Smith', email: 'bob@company.com', avatar: 'BS' },
    { id: '3', name: 'Carol Wilson', email: 'carol@company.com', avatar: 'CW' },
    { id: '4', name: 'David Brown', email: 'david@company.com', avatar: 'DB' },
    { id: '5', name: 'Emma Davis', email: 'emma@company.com', avatar: 'ED' }
  ];
  
  export const PRIORITY_CONFIG = {
    high: { label: 'High', color: 'bg-red-100 text-red-800 border-red-200', icon: '🔴' },
    medium: { label: 'Medium', color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: '🟡' },
    low: { label: 'Low', color: 'bg-green-100 text-green-800 border-green-200', icon: '🟢' }
  };
  
  export const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";
  