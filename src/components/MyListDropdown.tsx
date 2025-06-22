import React, { useState, useRef, useEffect } from 'react';
import { Heart, Play, X } from 'lucide-react';
import { useLikedItems, LikedItem } from '../contexts/LikedItemsContext';

interface MyListDropdownProps {
  isOpen: boolean;
  onClose: () => void;
}

const MyListDropdown: React.FC<MyListDropdownProps> = ({ isOpen, onClose }) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { likedItems, removeFromLikedItems } = useLikedItems();

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
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20">
      <div 
        ref={dropdownRef}
        className="bg-black/95 backdrop-blur-xl border border-white/20 rounded-2xl shadow-2xl max-w-2xl w-full mx-4 max-h-[70vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/10">
          <div className="flex items-center space-x-3">
            <Heart className="w-6 h-6 text-pink-500" />
            <h2 className="text-2xl font-bold text-white">My List</h2>
            <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full text-sm font-medium">
              {likedItems.length} items
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(70vh-120px)]">
          {likedItems.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-400 mb-2">Your list is empty</h3>
              <p className="text-gray-500">Start adding movies and TV shows to your list!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {likedItems.map((item) => (
                <div 
                  key={item.id}
                  className="flex items-center space-x-4 p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-white/10"
                >
                  {/* Thumbnail */}
                  <div className="relative flex-shrink-0">
                    <img 
                      src={item.image} 
                      alt={item.title}
                      className="w-16 h-24 object-cover rounded-lg"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent rounded-lg" />
                    <button className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <div className="bg-white/20 backdrop-blur-sm rounded-full p-2">
                        <Play className="w-4 h-4 text-white fill-white" />
                      </div>
                    </button>
                  </div>

                  {/* Content Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        item.type === 'movie' 
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' 
                          : 'bg-green-500/20 text-green-400 border border-green-500/30'
                      }`}>
                        {item.type === 'movie' ? 'Movie' : 'TV Show'}
                      </span>
                      <span className="bg-pink-500/20 text-pink-400 px-2 py-1 rounded-full text-xs font-medium">
                        {item.genre}
                      </span>
                    </div>
                    
                    <h3 className="text-white font-semibold text-lg mb-1 line-clamp-1">
                      {item.title}
                    </h3>
                    
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span>{item.year}</span>
                      <span>{item.duration}</span>
                      <span className="bg-yellow-500 text-black px-1 py-0.5 rounded text-xs font-bold">
                        ★ {item.rating}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-2">
                    <button className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                      <Play className="w-4 h-4 text-white" />
                    </button>
                    <button 
                      onClick={() => removeFromLikedItems(item.id)}
                      className="p-2 rounded-full bg-pink-500/20 hover:bg-pink-500/30 transition-colors"
                    >
                      <Heart className="w-4 h-4 text-pink-400 fill-pink-400" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MyListDropdown; 