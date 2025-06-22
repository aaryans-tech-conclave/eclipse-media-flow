import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Smile, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';

interface Friend {
  id: number;
  name: string;
  isInParty: boolean;
}

interface Message {
  id: string;
  user: string;
  avatar: string;
  message: string;
  timestamp: Date;
  type: 'text' | 'emoji';
}

interface EmoticonReaction {
  id: string;
  emoji: string;
  x: number;
  y: number;
  timestamp: number;
}

interface SharedViewingExperienceProps {
  isOpen: boolean;
  onClose: () => void;
  selectedMovie: {
    id: number;
    title: string;
    image: string;
    genre: string;
    year: string;
    rating: string;
    duration?: string;
  } | null;
  partyMembers: Friend[];
}

const SharedViewingExperience: React.FC<SharedViewingExperienceProps> = ({ 
  isOpen, 
  onClose, 
  selectedMovie,
  partyMembers
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      user: 'You',
      avatar: 'Y',
      message: 'This movie looks amazing! 🎬',
      timestamp: new Date(),
      type: 'text'
    }
  ]);
  const [newMessage, setNewMessage] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [emoticonReactions, setEmoticonReactions] = useState<EmoticonReaction[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [isMuted, setIsMuted] = useState(false);
  const playerRef = useRef<HTMLIFrameElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const emojis = ['❤️', '😂', '😲', '😍', '🎉', '🔥', '👏', '😭', '🤔', '😎'];

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Clean up emoticon reactions after 3 seconds
    const timer = setTimeout(() => {
      setEmoticonReactions(prev => 
        prev.filter(reaction => Date.now() - reaction.timestamp < 3000)
      );
    }, 3000);

    return () => clearTimeout(timer);
  }, [emoticonReactions]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      const message: Message = {
        id: Date.now().toString(),
        user: 'You',
        avatar: 'Y',
        message: newMessage,
        timestamp: new Date(),
        type: 'text'
      };
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    }
  };

  const handleSendEmoji = (emoji: string) => {
    const message: Message = {
      id: Date.now().toString(),
      user: 'You',
      avatar: 'Y',
      message: emoji,
      timestamp: new Date(),
      type: 'emoji'
    };
    setMessages(prev => [...prev, message]);
  };

  const handleEmoticonReaction = (emoji: string) => {
    const reaction: EmoticonReaction = {
      id: Date.now().toString(),
      emoji,
      x: Math.random() * 80 + 10, // Random position on video (10-90%)
      y: Math.random() * 80 + 10,
      timestamp: Date.now()
    };
    setEmoticonReactions(prev => [...prev, reaction]);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  if (!selectedMovie) return null;

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-sm z-50"
          onClick={onClose}
        />
      )}

      {/* Shared Viewing Experience Window */}
      <div className={`fixed inset-0 bg-black transform transition-all duration-300 ease-in-out z-50 ${
        isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/95 backdrop-blur-sm">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="p-2 rounded-full bg-black hover:bg-gray-900 transition-colors border border-white/20"
            >
              <X className="w-5 h-5 text-white" />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white">{selectedMovie.title}</h2>
              <p className="text-gray-400 text-sm">{selectedMovie.genre} • {selectedMovie.year} • ★ {selectedMovie.rating}</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Users className="w-5 h-5 text-purple-400" />
              <span className="text-white text-sm">{partyMembers.length + 1} watching</span>
            </div>
            <button
              onClick={() => setIsChatOpen(!isChatOpen)}
              className={`p-2 rounded-full transition-colors border ${
                isChatOpen 
                  ? 'bg-purple-500 border-purple-500 text-white' 
                  : 'bg-black border-white/20 text-white hover:bg-gray-900'
              }`}
            >
              <MessageCircle className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex h-[calc(100vh-80px)]">
          {/* Video Player Section */}
          <div className={`relative bg-black ${isChatOpen ? 'flex-1' : 'w-full'}`}>
            {/* Video Player */}
            <div className="relative w-full h-full">
              <iframe
                ref={playerRef}
                src="https://www.youtube.com/embed/dZz8-OTfo-0?enablejsapi=1&autoplay=0&controls=1&rel=0"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              
              {/* Video Controls Overlay */}
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between bg-black/50 backdrop-blur-sm rounded-lg p-3">
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                  </button>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setIsMuted(!isMuted)}
                      className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                    </button>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={volume}
                      onChange={(e) => setVolume(Number(e.target.value))}
                      className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
                
                {/* Emoticon Reactions */}
                <div className="flex items-center space-x-2">
                  {emojis.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleEmoticonReaction(emoji)}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors text-lg"
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Floating Emoticon Reactions */}
              {emoticonReactions.map((reaction) => (
                <div
                  key={reaction.id}
                  className="absolute animate-bounce text-2xl pointer-events-none"
                  style={{
                    left: `${reaction.x}%`,
                    top: `${reaction.y}%`,
                    animationDuration: '1s',
                    animationIterationCount: 3
                  }}
                >
                  {reaction.emoji}
                </div>
              ))}
            </div>
          </div>

          {/* Chat Sidebar */}
          {isChatOpen && (
            <div className="w-80 bg-black border-l border-white/10 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10">
                <h3 className="text-white font-semibold">Group Chat</h3>
                <p className="text-gray-400 text-sm">Real-time messaging with your party</p>
                
                {/* Party Members */}
                <div className="mt-3">
                  <p className="text-gray-400 text-xs mb-2">Watching together:</p>
                  <div className="flex flex-wrap gap-2">
                    <div className="bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1">
                      <span className="text-purple-300 text-sm">You</span>
                    </div>
                    {partyMembers.map(member => (
                      <div key={member.id} className="bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1">
                        <span className="text-purple-300 text-sm">{member.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages.map((message) => (
                  <div key={message.id} className="flex items-start space-x-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <span className="text-white text-xs font-semibold">{message.avatar}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <span className="text-white text-sm font-medium">{message.user}</span>
                        <span className="text-gray-500 text-xs">{formatTime(message.timestamp)}</span>
                      </div>
                      <div className={`text-sm ${message.type === 'emoji' ? 'text-2xl' : 'text-gray-300'}`}>
                        {message.message}
                      </div>
                    </div>
                  </div>
                ))}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <button className="p-1 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
                    <Smile className="w-4 h-4 text-gray-400" />
                  </button>
                  <div className="flex-1 flex flex-wrap gap-1">
                    {emojis.map((emoji) => (
                      <button
                        key={emoji}
                        onClick={() => handleSendEmoji(emoji)}
                        className="text-sm hover:bg-white/10 rounded p-1 transition-colors"
                      >
                        {emoji}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/10 border border-white/20 rounded-lg px-3 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-purple-500"
                  />
                  <button
                    onClick={handleSendMessage}
                    className="p-2 rounded-full bg-purple-500 hover:bg-purple-600 transition-colors"
                  >
                    <Send className="w-4 h-4 text-white" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default SharedViewingExperience; 