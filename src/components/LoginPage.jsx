import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isDark } = useTheme();

  // Available test users
  const testUsers = [
    { name: 'Nikhil Yadav', username: 'nikhilyadav', password: 'password1', avatar: 'NY' },
    { name: 'Emitrr', username: 'emitrr', password: 'password', avatar: 'E' },
    { name: 'Priya Sharma', username: 'priyasharma', password: 'password2', avatar: 'PS' },
    { name: 'Aman Gupta', username: 'amangupta', password: 'password3', avatar: 'AG' }
  ];

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    if (username.trim() && password.trim()) {
      try {
        const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, password })
        });
        if (!res.ok) {
          const data = await res.json();
          setError(data.error || 'Login failed');
        } else {
          const userData = await res.json();
          onLogin(userData); // Pass full user object
        }
      } catch {
        setError('Network error');
      }
    } else {
      setError('Please enter username and password');
    }
  };

  const handleQuickLogin = async (user) => {
    setError('');
    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001'}/api/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user.username, password: user.password })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Login failed');
      } else {
        const userData = await res.json();
        onLogin(userData);
      }
    } catch {
      setError('Network error');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background with animated gradients */}
      <div className="absolute inset-0 gradient-bg"></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-black'} opacity-10`}></div>
      
      {/* Floating elements for visual interest */}
      <div className={`absolute top-20 left-20 w-32 h-32 ${isDark ? 'bg-gray-600' : 'bg-white'} opacity-10 rounded-full blur-xl`}></div>
      <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-300 opacity-10 rounded-full blur-xl"></div>
      <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-300 opacity-10 rounded-full blur-xl"></div>
      
      <div className="relative z-10 w-full max-w-3xl px-6">
        {/* Main login container */}
        <div className="glass-effect rounded-3xl p-8 sm:p-12 modern-shadow-lg fade-in">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 modern-shadow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your TaskBoard account</p>
          </div>
          
          {/* Quick Login Section */}
          <div className="mb-6 sm:mb-8 slide-up">
            <h3 className="text-sm font-semibold mb-3 sm:mb-4 flex items-center">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
              Quick Login (For Testing)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
              {testUsers.map((user, index) => (
                <button
                  key={user.username}
                  onClick={() => handleQuickLogin(user)}
                  className={`group border-2 rounded-xl p-2 sm:p-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg ${
                    isDark 
                      ? 'bg-gray-800 hover:bg-gray-700 border-gray-600 hover:border-blue-500' 
                      : 'bg-white hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 border-gray-100 hover:border-blue-200'
                  }`}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs sm:text-sm font-semibold group-hover:scale-110 transition-transform duration-200">
                      {user.avatar}
                    </div>
                    <span className={`text-xs sm:text-sm font-medium transition-colors truncate ${
                      isDark ? 'text-gray-300 group-hover:text-white' : 'text-gray-700 group-hover:text-gray-900'
                    }`}>
                      {user.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Divider */}
          <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className={`px-3 sm:px-4 font-medium ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>or continue with</span>
            </div>
          </div>

          {/* Manual Login Form */}
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-6 slide-up">
            <div>
              <label className="block text-sm font-semibold mb-2">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="modern-input"
                placeholder="Enter your username"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="modern-input"
                placeholder="Enter your password"
              />
            </div>
            {error && (
              <div className={`border rounded-xl p-3 ${
                isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'
              }`}>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4"
            >
              Sign In
            </button>
          </form>

          {/* Footer */}
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Powered by <span className="font-semibold text-blue-600">TaskBoard</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 