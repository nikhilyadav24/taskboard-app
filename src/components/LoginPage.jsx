import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';

const LoginPage = ({ onLogin, onSwitchToSignup }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { isDark } = useTheme();

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
            <h1 className="text-3xl font-bold mb-2">Welcome</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign in to your TaskBoard account</p>
          </div>
          
          {/* Divider */}
          {/* <div className="relative mb-6 sm:mb-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center text-xs sm:text-sm">
              <span className={`px-3 sm:px-4 font-medium ${
                isDark ? 'bg-gray-800 text-gray-400' : 'bg-white text-gray-500'
              }`}>or continue with</span>
            </div>
          </div> */}

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
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 mt-2">
              Don&apos;t have an account?{' '}
              <button onClick={onSwitchToSignup} className="text-blue-600 font-semibold hover:underline">Sign Up</button>
            </p>
          </div>
        </div>
      </div>
      {/* Custom footer at the very bottom */}
      <div className="absolute bottom-2 w-full flex justify-center">
        <span className="text-[10px] sm:text-xs text-gray-400 dark:text-gray-600 text-center">Made by Nikhil with <span className="text-red-500">❤️</span></span>
      </div>
    </div>
  );
};

export default LoginPage; 