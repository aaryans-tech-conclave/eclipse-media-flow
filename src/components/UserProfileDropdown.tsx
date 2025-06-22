import React, { useRef, useEffect } from 'react';
import { User, Settings, LogOut, History, HelpCircle } from 'lucide-react';

interface UserProfileDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const UserProfileDropdown: React.FC<UserProfileDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sample user data - in a real app, this would come from authentication context
  const user = {
    name: "Madhur Sharma",
    email: "madhur.sharma@example.com",
    joinDate: "May 2025"
  };

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  // Handle escape key to close dropdown
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-end pt-20">
      <div 
        ref={dropdownRef}
        className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-xl shadow-2xl w-64 mx-4 overflow-hidden"
      >
        {/* User Info */}
        <div className="p-4 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <User className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border border-black"></div>
            </div>
            <div className="flex-1">
              <h3 className="text-white font-semibold text-sm">{user.name}</h3>
              <p className="text-gray-400 text-xs">{user.email}</p>
              <span className="text-gray-500 text-xs">Member since {user.joinDate}</span>
            </div>
          </div>
        </div>

        {/* Menu Options */}
        <div className="p-3 space-y-1">
          {/* My Profile */}
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left">
            <User className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white font-medium text-sm">My Profile</div>
              <div className="text-gray-500 text-xs">View and edit your profile</div>
            </div>
          </button>

          {/* Watch History */}
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left">
            <History className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white font-medium text-sm">Watch History</div>
              <div className="text-gray-500 text-xs">Recently watched content</div>
            </div>
          </button>

          {/* Settings */}
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left">
            <Settings className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white font-medium text-sm">Settings</div>
              <div className="text-gray-500 text-xs">Account and app preferences</div>
            </div>
          </button>

          {/* Help & Support */}
          <button className="w-full flex items-center space-x-3 p-2 rounded-lg hover:bg-white/10 transition-colors text-left">
            <HelpCircle className="w-4 h-4 text-gray-400" />
            <div>
              <div className="text-white font-medium text-sm">Help & Support</div>
              <div className="text-gray-500 text-xs">Get help and contact support</div>
            </div>
          </button>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-white/10">
          <button className="w-full flex items-center justify-center space-x-2 p-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors text-red-400">
            <LogOut className="w-4 h-4" />
            <span className="font-medium text-sm">Sign Out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserProfileDropdown; 