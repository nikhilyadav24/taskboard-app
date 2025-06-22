import React, { useState } from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { BACKEND_URL } from '../constants/config';

const SignupPage = ({ onSignup, onSwitchToLogin }) => {
  const { isDark } = useTheme();
  const [form, setForm] = useState({ name: '', username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND_URL}/api/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Signup failed');
      } else {
        const userData = await res.json();
        onSignup(userData);
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 gradient-bg"></div>
      <div className={`absolute inset-0 ${isDark ? 'bg-black' : 'bg-black'} opacity-10`}></div>
      <div className="relative z-10 w-full max-w-3xl px-6">
        <div className="glass-effect rounded-3xl p-8 sm:p-12 modern-shadow-lg fade-in">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 modern-shadow">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold mb-2">Create Account</h1>
            <p className="text-gray-600 dark:text-gray-400">Sign up for TaskBoard</p>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6 slide-up">
            <div>
              <label className="block text-sm font-semibold mb-2">Full Name</label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="modern-input"
                placeholder="Enter your full name"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Username</label>
              <input
                type="text"
                name="username"
                value={form.username}
                onChange={handleChange}
                className="modern-input"
                placeholder="Choose a username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Password</label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="modern-input"
                placeholder="Create a password"
                required
              />
            </div>
            {error && (
              <div className={`border rounded-xl p-3 ${isDark ? 'bg-red-900/20 border-red-700' : 'bg-red-50 border-red-200'}`}>
                <p className="text-red-600 dark:text-red-400 text-sm font-medium">{error}</p>
              </div>
            )}
            <button
              type="submit"
              className="btn-primary w-full text-base sm:text-lg py-3 sm:py-4"
              disabled={loading}
            >
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </form>
          <div className="mt-6 sm:mt-8 text-center">
            <p className="text-xs sm:text-sm text-gray-500 dark:text-gray-400">
              Already have an account?{' '}
              <button onClick={onSwitchToLogin} className="text-blue-600 font-semibold hover:underline">Sign In</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage; 