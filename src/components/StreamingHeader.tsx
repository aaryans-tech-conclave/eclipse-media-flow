
import React, { useState } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';

const StreamingHeader = () => {
  const [activeTab, setActiveTab] = useState('home');

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'TV Shows' },
    { id: 'live', label: 'Live' },
    { id: 'mylist', label: 'My List' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            StreamFlix
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`relative px-4 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === item.id
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              {activeTab === item.id && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
              )}
            </button>
          ))}
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-4">
          {/* Search */}
          <div className="hidden md:flex items-center bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 border border-white/20">
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <input
              type="text"
              placeholder="Search movies, shows..."
              className="bg-transparent border-none outline-none text-white placeholder-gray-400 text-sm w-48"
            />
          </div>
          
          {/* Notifications */}
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          
          {/* Profile */}
          <button className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600">
            <User className="w-5 h-5 text-white" />
          </button>

          {/* Mobile menu */}
          <button className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </header>
  );
};

export default StreamingHeader;
