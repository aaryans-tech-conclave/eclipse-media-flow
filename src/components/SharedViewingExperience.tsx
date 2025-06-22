import React, { useState, useEffect, useRef } from 'react';
import { X, MessageCircle, Send, Smile, Users, Play, Pause, Volume2, VolumeX } from 'lucide-react';

// YouTube iframe API types
declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

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
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isSeeking, setIsSeeking] = useState(false);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [controlsTimeout, setControlsTimeout] = useState<NodeJS.Timeout | null>(null);
  
  const playerRef = useRef<HTMLDivElement>(null);
  const playerInstanceRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const timeUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const emojis = ['❤️', '😂', '😲', '😍', '🎉', '🔥', '👏', '😭', '🤔', '😎'];

  // Poll logic (moved inside component)
  const pollQuestions = [
    {
      id: 1,
      timestamp: 32 * 60, // Changed back to original timestamp
      question: 'Our boy Jolly just filed a PIL like he\'s dropping mixtapes. What happens next?',
      options: [
        'The judge bench-presses the PIL and says, "Try harder."',
        'Opposing lawyer starts charging his laser eyes.',
        'Jolly realizes he just declared war on rich people with 6 BMWs.',
        'The court breaks into applause like it\'s India\'s Got Talent.'
      ],
      correct: 2
    },
    {
      id: 2,
      timestamp: 55 * 60, // Changed back to original timestamp
      question: 'Jolly is now on a mission so intense, even Sherlock is sweating. What\'s waiting for him in Meerut?',
      options: [
        'Kaul Saab is actually in Goa living his best retired life.',
        'Jolly gets chased by cows and confusion.',
        'Kaul Saab gives him chai and game-changing testimony.',
        'Jolly ends up in a dhaba existential crisis about law school.'
      ],
      correct: 2
    },
    {
      id: 3,
      timestamp: 80 * 60, // Changed back to original timestamp
      question: 'What will Jolly do now with the spicy scandalous footage?',
      options: [
        'Upload it to YouTube with clickbait title: "Policeman EXPOSED – Must Watch till End."',
        'Accidentally airdrops it to the judge mid-hearing.',
        'Bargains for free samosas for life.',
        'Saves it like a power move for the courtroom final boss fight.'
      ],
      correct: 3
    },
    {
      id: 4,
      timestamp: 105 * 60, // Changed back to original timestamp
      question: 'The gavel is heavy and the stakes are thiccc. What will Jolly do next?',
      options: [
        'Pull out Uno reverse card on Rajpal Yadav\'s evil boss.',
        'Summon surprise witness like it\'s a WWE tag match.',
        'Deliver a monologue that deserves an Oscar and a Supreme Court internship.',
        'Drop the mic and say, "Nyay ki Jai Ho!"'
      ],
      correct: 2
    }
  ];

  const [activePoll, setActivePoll] = useState<number | null>(null);
  const [pollTimer, setPollTimer] = useState(15);
  const [showPoll, setShowPoll] = useState(false);
  const [userAnswers, setUserAnswers] = useState<{ [pollId: number]: number | null }>({});
  const [showLeaderboard, setShowLeaderboard] = useState(false);

  // Initialize YouTube iframe API
  useEffect(() => {
    if (!isOpen) return;

    // Load YouTube iframe API if not already loaded
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
    }

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerRef.current && !playerInstanceRef.current) {
        playerInstanceRef.current = new window.YT.Player(playerRef.current, {
          height: '100%',
          width: '100%',
          videoId: 'dZz8-OTfo-0',
          playerVars: {
            autoplay: 0,
            controls: 0,
            rel: 0,
            modestbranding: 1,
            showinfo: 0
          },
          events: {
            onReady: (event: any) => {
              setIsPlayerReady(true);
              console.log('YouTube player ready');
            },
            onStateChange: (event: any) => {
              // YouTube player states: -1 (unstarted), 0 (ended), 1 (playing), 2 (paused), 3 (buffering), 5 (video cued)
              if (event.data === 1) {
                setIsPlaying(true);
                startTimeTracking();
              } else if (event.data === 2) {
                setIsPlaying(false);
                stopTimeTracking();
              }
            }
          }
        });
      }
    };

    // If API is already loaded, initialize immediately
    if (window.YT && window.YT.Player) {
      window.onYouTubeIframeAPIReady();
    }

    return () => {
      if (playerInstanceRef.current) {
        playerInstanceRef.current.destroy();
        playerInstanceRef.current = null;
      }
      stopTimeTracking();
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    };
  }, [isOpen]);

  const startTimeTracking = () => {
    if (timeUpdateIntervalRef.current) return;
    
    timeUpdateIntervalRef.current = setInterval(() => {
      if (playerInstanceRef.current && isPlayerReady) {
        try {
          const currentTime = playerInstanceRef.current.getCurrentTime();
          const duration = playerInstanceRef.current.getDuration();
          
          // Only update if we have valid values
          if (currentTime >= 0 && duration > 0) {
            setCurrentTime(currentTime);
            setDuration(duration);
            console.log('Current time:', currentTime.toFixed(1), 'Duration:', duration.toFixed(1));
          }
        } catch (error) {
          console.log('Error getting video time:', error);
        }
      }
    }, 50); // Update every 50ms for smoother tracking
  };

  const stopTimeTracking = () => {
    if (timeUpdateIntervalRef.current) {
      clearInterval(timeUpdateIntervalRef.current);
      timeUpdateIntervalRef.current = null;
    }
  };

  const handlePlayPause = () => {
    if (playerInstanceRef.current && isPlayerReady) {
      if (isPlaying) {
        playerInstanceRef.current.pauseVideo();
      } else {
        playerInstanceRef.current.playVideo();
      }
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume);
    if (playerInstanceRef.current && isPlayerReady) {
      playerInstanceRef.current.setVolume(newVolume);
    }
  };

  const handleMuteToggle = () => {
    if (playerInstanceRef.current && isPlayerReady) {
      if (isMuted) {
        playerInstanceRef.current.unMute();
        setIsMuted(false);
      } else {
        playerInstanceRef.current.mute();
        setIsMuted(true);
      }
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (playerInstanceRef.current && isPlayerReady) {
      playerInstanceRef.current.seekTo(seekTime, true);
    }
  };

  const handleSeekStart = () => {
    setIsSeeking(true);
    if (playerInstanceRef.current && isPlayerReady) {
      playerInstanceRef.current.pauseVideo();
    }
  };

  const handleSeekEnd = () => {
    setIsSeeking(false);
    if (playerInstanceRef.current && isPlayerReady && isPlaying) {
      playerInstanceRef.current.playVideo();
    }
  };

  const showControlsTemporarily = () => {
    setShowControls(true);
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 3000); // Hide after 3 seconds of inactivity
    setControlsTimeout(timeout);
  };

  const handleMouseMove = () => {
    showControlsTemporarily();
  };

  const handleMouseLeave = () => {
    if (controlsTimeout) {
      clearTimeout(controlsTimeout);
    }
    const timeout = setTimeout(() => {
      setShowControls(false);
    }, 1000); // Hide after 1 second when mouse leaves
    setControlsTimeout(timeout);
  };

  useEffect(() => {
    if (showPoll && pollTimer > 0) {
      const timer = setTimeout(() => setPollTimer(pollTimer - 1), 1000);
      return () => clearTimeout(timer);
    }
    if (showPoll && pollTimer === 0) {
      closePoll();
    }
  }, [showPoll, pollTimer]);

  useEffect(() => {
    if (!isPlayerReady || showPoll || showLeaderboard) return;
    
    console.log('Checking for poll at time:', currentTime);
    const poll = pollQuestions.find(
      q => Math.abs(currentTime - q.timestamp) < 1 && !userAnswers[q.id]
    );
    
    if (poll) {
      console.log('Triggering poll:', poll.id, 'at time:', currentTime);
      setActivePoll(poll.id);
      setShowPoll(true);
      setPollTimer(15);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.pauseVideo();
      }
    }
  }, [currentTime, isPlayerReady, showPoll, showLeaderboard, userAnswers]);

  // Show controls when video is paused or seeking
  useEffect(() => {
    if (!isPlaying || isSeeking) {
      setShowControls(true);
      if (controlsTimeout) {
        clearTimeout(controlsTimeout);
      }
    }
  }, [isPlaying, isSeeking]);

  function closePoll() {
    setShowPoll(false);
    setPollTimer(15);
    setTimeout(() => {
      setActivePoll(null);
      if (playerInstanceRef.current) {
        playerInstanceRef.current.playVideo();
      }
    }, 500);
  }

  function handlePollAnswer(pollId: number, optionIdx: number) {
    setUserAnswers(prev => ({ ...prev, [pollId]: optionIdx }));
  }

  const leaderboard = React.useMemo(() => {
    let score = 0;
    pollQuestions.forEach(q => {
      if (userAnswers[q.id] === q.correct) score++;
    });
    
    // Create leaderboard entries for all party members
    const entries = [
      { name: 'You', score }
    ];
    
    // Add party members with random scores for demo
    partyMembers.forEach((member, index) => {
      const memberScore = Math.floor(Math.random() * (pollQuestions.length + 1)); // Random score 0-4
      entries.push({ name: member.name, score: memberScore });
    });
    
    // Sort by score (highest first)
    return entries.sort((a, b) => b.score - a.score);
  }, [userAnswers, partyMembers]);

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

  const formatVideoTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (!selectedMovie) return null;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .slider::-webkit-slider-thumb {
            appearance: none;
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-moz-range-thumb {
            height: 16px;
            width: 16px;
            border-radius: 50%;
            background: #8b5cf6;
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
          }
          
          .slider::-webkit-slider-track {
            background: transparent;
          }
          
          .slider::-moz-range-track {
            background: transparent;
          }
        `
      }} />
      
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
          <div 
            className={`relative bg-black ${isChatOpen ? 'flex-1' : 'w-full'}`}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            {/* Video Player */}
            <div className="relative w-full h-full">
              <div ref={playerRef} className="w-full h-full" />
              
              {/* Video Controls Overlay */}
              <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent transition-all duration-300 ${
                showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
              }`}>
                {/* Seek Bar */}
                <div className="px-4 pt-4 pb-2">
                  <input
                    type="range"
                    min="0"
                    max={duration || 100}
                    value={currentTime}
                    onChange={handleSeek}
                    onMouseDown={handleSeekStart}
                    onMouseUp={handleSeekEnd}
                    onTouchStart={handleSeekStart}
                    onTouchEnd={handleSeekEnd}
                    className="w-full h-2 bg-white/20 rounded-lg appearance-none cursor-pointer slider"
                    style={{
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) ${(currentTime / (duration || 1)) * 100}%, rgba(255, 255, 255, 0.2) 100%)`
                    }}
                  />
                </div>
                
                {/* Controls Bar */}
                <div className="px-4 pb-4 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <button
                      onClick={handlePlayPause}
                      className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                    >
                      {isPlaying ? <Pause className="w-5 h-5 text-white" /> : <Play className="w-5 h-5 text-white" />}
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleMuteToggle}
                        className="p-1 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
                      >
                        {isMuted ? <VolumeX className="w-4 h-4 text-white" /> : <Volume2 className="w-4 h-4 text-white" />}
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="100"
                        value={volume}
                        onChange={(e) => handleVolumeChange(Number(e.target.value))}
                        className="w-20 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    {/* Time Display */}
                    <div className="text-white text-sm font-mono">
                      {formatVideoTime(Math.floor(currentTime))} / {formatVideoTime(Math.floor(duration))}
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

              {/* Poll Modal Overlay */}
              {showPoll && activePoll !== null && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
                  <div className="bg-black/95 border border-white/20 rounded-xl shadow-2xl p-6 max-w-4xl w-full mb-20 relative">
                    <div className="text-center mb-4">
                      <h2 className="text-xl font-bold mb-1 text-white">Quiz Time!</h2>
                      <div className="w-12 h-0.5 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="mb-3 text-white font-semibold text-base leading-relaxed">
                      {pollQuestions.find(q => q.id === activePoll)?.question}
                    </div>
                    
                    <div className="mb-4 text-center">
                      <div className="inline-flex items-center space-x-2 bg-purple-500/20 border border-purple-500/40 rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                        <span className="text-purple-300 text-sm font-semibold">Time left: {pollTimer}s</span>
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      {pollQuestions.find(q => q.id === activePoll)?.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handlePollAnswer(activePoll, idx)}
                          disabled={userAnswers[activePoll] !== undefined}
                          className={`w-full text-left px-4 py-3 rounded-lg border transition-all duration-200 group relative overflow-hidden
                            ${userAnswers[activePoll] === idx 
                              ? 'bg-gradient-to-r from-green-500/20 to-emerald-500/20 border-green-400/60 text-green-300' 
                              : 'bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-purple-500/40'
                            }
                          `}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center text-sm font-semibold
                                ${userAnswers[activePoll] === idx 
                                  ? 'bg-green-500 border-green-400 text-white' 
                                  : 'border-white/30 text-white/70 group-hover:border-purple-400'
                                }
                              `}>
                                {String.fromCharCode(65 + idx)}
                              </div>
                              <span className="font-medium text-sm">{opt}</span>
                            </div>
                            {userAnswers[activePoll] === idx && (
                              <div className="flex items-center space-x-2">
                                <span className="inline-flex items-center px-2 py-0.5 bg-purple-500 text-white text-xs font-semibold rounded-full">
                                  Good guess!
                                </span>
                                <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                  </svg>
                                </div>
                              </div>
                            )}
                          </div>
                          
                          {/* Hover effect */}
                          {userAnswers[activePoll] === undefined && (
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                          )}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-5 text-center">
                      <div className="inline-flex items-center space-x-2 bg-white/5 border border-white/20 rounded-full px-3 py-1">
                        <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
                        <span className="text-gray-400 text-sm">Waiting for others... (Demo: only you)</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Leaderboard Modal Overlay */}
              {showLeaderboard && (
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm flex items-end justify-center p-4">
                  <div className="bg-black/95 border border-white/20 rounded-xl shadow-2xl p-6 max-w-md w-full mb-20 relative">
                    <div className="text-center mb-6">
                      <h2 className="text-2xl font-bold mb-2 text-white">Leaderboard</h2>
                      <div className="w-16 h-1 bg-gradient-to-r from-pink-500 to-purple-600 mx-auto rounded-full"></div>
                    </div>
                    
                    <div className="space-y-3">
                      {leaderboard.map((entry, idx) => (
                        <div key={idx} className="flex items-center justify-between px-4 py-3 bg-white/5 border border-white/20 rounded-lg hover:bg-white/10 transition-colors">
                          <div className="flex items-center space-x-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                              ${idx === 0 ? 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-yellow-900' :
                                idx === 1 ? 'bg-gradient-to-r from-gray-300 to-gray-500 text-gray-900' :
                                idx === 2 ? 'bg-gradient-to-r from-amber-600 to-amber-800 text-white' :
                                'bg-gradient-to-r from-purple-500 to-purple-700 text-white'
                              }
                            `}>
                              {idx + 1}
                            </div>
                            <span className="font-semibold text-white">{entry.name}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-purple-400 font-bold text-lg">{entry.score}</span>
                            <span className="text-gray-400 text-sm">/ {pollQuestions.length}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="mt-6 text-center">
                      <button 
                        onClick={() => setShowLeaderboard(false)} 
                        className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-pink-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Sidebar */}
          {isChatOpen && (
            <div className="w-80 bg-black border-l border-white/10 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-white font-semibold">Group Chat</h3>
                  <button
                    onClick={() => setShowLeaderboard(true)}
                    className="px-3 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-sm font-semibold rounded-full hover:from-purple-700 hover:to-pink-700 transition-all duration-200"
                  >
                    Leaderboard
                  </button>
                </div>
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

