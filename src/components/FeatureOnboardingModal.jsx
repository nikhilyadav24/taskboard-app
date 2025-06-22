import React from 'react';
import { Users, Layout, Move, SunMoon, Search, FileText } from 'lucide-react';

const features = [
  {
    icon: <Users className="w-6 h-6 text-blue-500" />,
    title: 'Real-time Collaboration',
    desc: 'Work together with your team and see updates instantly.'
  },
  {
    icon: <Move className="w-6 h-6 text-purple-500" />,
    title: 'Drag & Drop',
    desc: 'Easily move tasks and columns with smooth drag-and-drop.'
  },
  {
    icon: <Layout className="w-6 h-6 text-green-500" />,
    title: 'Assign Tasks',
    desc: 'Assign tasks to team members and track progress.'
  },
  {
    icon: <FileText className="w-6 h-6 text-yellow-500" />,
    title: 'Markdown Support',
    desc: 'Use Markdown in task descriptions for rich formatting.'
  },
  {
    icon: <SunMoon className="w-6 h-6 text-pink-500" />,
    title: 'Dark & Light Mode',
    desc: 'Switch between beautiful dark and light themes.'
  },
  {
    icon: <Search className="w-6 h-6 text-indigo-500" />,
    title: 'Sort, Filter & Search',
    desc: 'Quickly find and organize tasks with powerful tools.'
  },
];

const FeatureOnboardingModal = ({ onClose }) => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
    <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-2xl p-6 sm:p-10 max-w-lg w-full relative animate-fade-in">
      <button
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        onClick={onClose}
        aria-label="Close"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
      <h2 className="text-2xl font-bold mb-2 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Welcome to TaskBoard!</h2>
      <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Here are some of the main features to help you get started:</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        {features.map((f, i) => (
          <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-800">
            {f.icon}
            <div>
              <div className="font-semibold text-sm mb-1 text-gray-900 dark:text-white">{f.title}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">{f.desc}</div>
            </div>
          </div>
        ))}
      </div>
      <button
        className="btn-primary w-full py-2 text-base mt-2"
        onClick={onClose}
      >
        Got it!
      </button>
    </div>
  </div>
);

export default FeatureOnboardingModal; 