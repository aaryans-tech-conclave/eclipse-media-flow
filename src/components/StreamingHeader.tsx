import React, { useState } from 'react';
import { Search, Bell, User, Menu } from 'lucide-react';
import MoodDetector from './MoodDetector';
import TrendingDashboard from './TrendingDashboard';
import GroupPartySlider from './GroupPartySlider';
import MyListDropdown from './MyListDropdown';
import UserProfileDropdown from './UserProfileDropdown';
import SearchDropdown from './SearchDropdown';

interface StreamingHeaderProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const StreamingHeader: React.FC<StreamingHeaderProps> = ({ activeTab, onTabChange }) => {
  const [isGroupPartyOpen, setIsGroupPartyOpen] = useState(false);
  const [isMyListOpen, setIsMyListOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'movies', label: 'Movies' },
    { id: 'series', label: 'TV Shows' },
    { id: 'groupparty', label: 'Group Party' }
  ];

  const handleNavClick = (itemId: string) => {
    if (itemId === 'groupparty') {
      setIsGroupPartyOpen(true);
    } else {
      onTabChange(itemId);
    }
  };

  const handleMyListClick = () => {
    setIsMyListOpen(true);
  };

  const handleProfileClick = () => {
    setIsProfileOpen(true);
  };

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/20 backdrop-blur-xl border-b border-white/10">
      <div className="flex items-center justify-between px-6 py-4">
        {/* Logo */}
        <div className="flex items-center">
          <div className="text-2xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">
            FireTV
          </div>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-4">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => handleNavClick(item.id)}
              className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
                activeTab === item.id || (item.id === 'groupparty' && isGroupPartyOpen)
                  ? 'text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              {item.label}
              {(activeTab === item.id || (item.id === 'groupparty' && isGroupPartyOpen)) && (
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
              )}
            </button>
          ))}
          
          {/* My List Button */}
          <button
            onClick={handleMyListClick}
            className={`relative px-3 py-2 text-sm font-medium transition-all duration-300 ${
              isMyListOpen ? 'text-white' : 'text-gray-400 hover:text-white'
            }`}
          >
            My List
            {isMyListOpen && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full" />
            )}
          </button>

          {/* Search Button */}
          <button
            onClick={handleSearchClick}
            className="flex items-center bg-white/10 backdrop-blur-sm rounded-full px-3 py-2 border border-white/20 hover:bg-white/20 transition-colors"
          >
            <Search className="w-4 h-4 text-gray-400 mr-2" />
            <span className="text-white text-sm">Search in Movies, TV Shows...</span>
          </button>
        </nav>

        {/* Right side actions */}
        <div className="flex items-center space-x-2">
          {/* Trending Dashboard */}
          <TrendingDashboard />
          
          {/* Mood Detector */}
          <MoodDetector />
          
          {/* Notifications */}
          <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Bell className="w-5 h-5 text-white" />
          </button>
          
          {/* Profile */}
          <button 
            onClick={handleProfileClick}
            className="p-2 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 transition-all duration-300"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          {/* Mobile menu */}
          <button className="md:hidden p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
            <Menu className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>

      {/* Group Party Slider */}
      <GroupPartySlider 
        isOpen={isGroupPartyOpen} 
        onClose={() => setIsGroupPartyOpen(false)} 
      />

      {/* My List Dropdown */}
      <MyListDropdown 
        isOpen={isMyListOpen} 
        onClose={() => setIsMyListOpen(false)} 
      />

      {/* User Profile Dropdown */}
      <UserProfileDropdown 
        isOpen={isProfileOpen} 
        onClose={() => setIsProfileOpen(false)} 
      />

      {/* Search Dropdown */}
      <SearchDropdown 
        isOpen={isSearchOpen} 
        onClose={() => setIsSearchOpen(false)} 
      />
    </header>
  );
};

export default StreamingHeader;
