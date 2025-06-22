import React, { useState } from 'react';
import { X, Users, UserPlus, Copy, Link, ChevronRight, Edit3 } from 'lucide-react';
import GroupPartySelection from './GroupPartySelection';
import SharedViewingExperience from './SharedViewingExperience';

interface Friend {
  id: number;
  name: string;
  isInParty: boolean;
}

interface Movie {
  id: number;
  title: string;
  image: string;
  genre: string;
  year: string;
  rating: string;
  duration?: string;
}

interface GroupPartySliderProps {
  isOpen: boolean;
  onClose: () => void;
}

const GroupPartySlider: React.FC<GroupPartySliderProps> = ({ isOpen, onClose }) => {
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: 'Jeff', isInParty: false },
    { id: 2, name: 'Ted', isInParty: false },
    { id: 3, name: 'Greg', isInParty: false },
    { id: 4, name: 'Kiran', isInParty: false },
    { id: 5, name: 'Alex Johnson', isInParty: false },
    { id: 6, name: 'Sarah Williams', isInParty: false },
    { id: 7, name: 'Mike Chen', isInParty: false },
    { id: 8, name: 'Emma Davis', isInParty: false },
    { id: 9, name: 'David Brown', isInParty: false },
    { id: 10, name: 'Lisa Anderson', isInParty: false },
  ]);

  const [copied, setCopied] = useState(false);
  const [partyName, setPartyName] = useState('Movie Night');
  const [isEditingPartyName, setIsEditingPartyName] = useState(false);
  const [isMovieSelectionOpen, setIsMovieSelectionOpen] = useState(false);
  const [isSharedViewingOpen, setIsSharedViewingOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);

  const toggleFriendInParty = (friendId: number) => {
    const friend = friends.find(f => f.id === friendId);
    if (!friend) return;
    
    // If trying to add and already at limit, don't allow
    if (!friend.isInParty && partyMembers.length >= 5) return;
    
    setFriends(friends.map(f => 
      f.id === friendId 
        ? { ...f, isInParty: !f.isInParty }
        : f
    ));
  };

  const copyPartyLink = async () => {
    const partyLink = `https://streamflix.com/party/${Math.random().toString(36).substr(2, 9)}`;
    try {
      await navigator.clipboard.writeText(partyLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy link');
    }
  };

  const handleNextClick = () => {
    setIsMovieSelectionOpen(true);
  };

  const handleMovieSelect = (movie: Movie) => {
    setSelectedMovie(movie);
    setIsMovieSelectionOpen(false);
    setIsSharedViewingOpen(true);
  };

  const handleCloseSharedViewing = () => {
    setIsSharedViewingOpen(false);
    setSelectedMovie(null);
  };

  const partyMembers = friends.filter(friend => friend.isInParty);

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={onClose}
        />
      )}

      {/* Slider */}
      <div className={`fixed top-0 right-0 h-screen w-96 bg-black backdrop-blur-xl border-l border-white/20 transform transition-transform duration-300 ease-in-out z-50 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black">
          <div className="flex items-center space-x-3">
            <Users className="w-6 h-6 text-purple-400" />
            <h2 className="text-xl font-bold text-white">Group Party</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-black hover:bg-gray-900 transition-colors border border-white/20"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col h-[calc(100vh-80px)] bg-black">
          {/* Party Name Section */}
          <div className="p-4 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400 text-sm">Party Name</span>
              <button
                onClick={() => setIsEditingPartyName(!isEditingPartyName)}
                className="p-1 rounded-full bg-black hover:bg-gray-900 transition-colors border border-white/20"
              >
                <Edit3 className="w-4 h-4 text-purple-400" />
              </button>
            </div>
            {isEditingPartyName ? (
              <input
                type="text"
                value={partyName}
                onChange={(e) => setPartyName(e.target.value)}
                onBlur={() => setIsEditingPartyName(false)}
                onKeyPress={(e) => e.key === 'Enter' && setIsEditingPartyName(false)}
                className="w-full bg-black border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                placeholder="Enter party name..."
                autoFocus
              />
            ) : (
              <div className="bg-black border border-white/10 rounded-lg px-3 py-2">
                <span className="text-white font-medium">{partyName}</span>
              </div>
            )}
          </div>

          {/* Party Members Count */}
          <div className="p-4 border-b border-white/10 bg-black">
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-sm">Party Members</span>
              <span className="text-white font-semibold">{partyMembers.length}/5</span>
            </div>
            {partyMembers.length > 0 && (
              <div className="mt-2 flex flex-wrap gap-2">
                {partyMembers.map(member => (
                  <div key={member.id} className="bg-black border border-purple-500/40 rounded-full px-3 py-1">
                    <span className="text-purple-300 text-sm">{member.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Friends List */}
          <div className="flex-1 p-4 overflow-y-auto min-h-[120px] bg-black scrollbar-thin scrollbar-track-gray-900 scrollbar-thumb-gray-700 scrollbar-background-transparent">
            <h3 className="text-white font-semibold mb-2">Your Friends</h3>
            <div className="space-y-1">
              {friends.map(friend => (
                <div key={friend.id} className="flex items-center justify-between p-2 bg-black rounded-lg border border-white/10">
                  <div className="flex items-center space-x-3">
                    <div className="w-7 h-7 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-semibold">
                        {friend.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <span className="text-white text-sm">{friend.name}</span>
                  </div>
                  <button
                    onClick={() => toggleFriendInParty(friend.id)}
                    disabled={!friend.isInParty && partyMembers.length >= 5}
                    className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-full text-xs font-medium transition-all duration-200 ${
                      friend.isInParty
                        ? 'bg-purple-500 text-white'
                        : partyMembers.length >= 5
                        ? 'bg-black text-gray-500 cursor-not-allowed border border-gray-600'
                        : 'bg-black text-gray-400 hover:bg-gray-900 hover:text-white border border-white/20'
                    }`}
                  >
                    <UserPlus className={`w-3 h-3 ${partyMembers.length >= 5 && !friend.isInParty ? 'opacity-50' : ''}`} />
                    <span>{friend.isInParty ? 'Added' : 'Add'}</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Actions - Copy Link and Next Button */}
          <div className="p-4 border-t border-white/10 bg-black">
            <div className="flex flex-col space-y-2">
              {/* Copy Link Button */}
              <div className="bg-black rounded-lg p-3 border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-white text-sm font-medium">Share Link</span>
                  <Link className="w-3 h-3 text-purple-400" />
                </div>
                <button
                  onClick={copyPartyLink}
                  className="w-full flex items-center justify-center space-x-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                >
                  <Copy className="w-3 h-3" />
                  <span>{copied ? 'Copied!' : 'Copy'}</span>
                </button>
              </div>

              {/* Next Button */}
              <button 
                onClick={handleNextClick}
                className="flex items-center justify-center space-x-1.5 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-4 py-2 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
              >
                <span className="text-sm">Next</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Movie Selection Window */}
      <GroupPartySelection
        isOpen={isMovieSelectionOpen}
        onClose={() => setIsMovieSelectionOpen(false)}
        onMovieSelect={handleMovieSelect}
      />

      {/* Shared Viewing Experience */}
      <SharedViewingExperience
        isOpen={isSharedViewingOpen}
        onClose={handleCloseSharedViewing}
        selectedMovie={selectedMovie}
        partyMembers={partyMembers}
      />
    </>
  );
};

export default GroupPartySlider; 