
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Smile } from 'lucide-react';

const MoodDetector = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const moods = ['Happy', 'Excited', 'Calm', 'Melancholic', 'Energetic', 'Romantic', 'Adventurous', 'Nostalgic'];

  const startMoodDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = () => {
        setIsProcessing(true);
        // Simulate mood analysis processing
        setTimeout(() => {
          const randomMood = moods[Math.floor(Math.random() * moods.length)];
          setCurrentMood(randomMood);
          setIsProcessing(false);
        }, 2000);
        
        // Clean up
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      // Auto-stop after 3 seconds
      setTimeout(() => {
        if (mediaRecorderRef.current && isListening) {
          mediaRecorderRef.current.stop();
          setIsListening(false);
        }
      }, 3000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
    }
  };

  const stopMoodDetection = () => {
    if (mediaRecorderRef.current && isListening) {
      mediaRecorderRef.current.stop();
      setIsListening(false);
    }
  };

  const handleMoodClick = () => {
    if (isListening) {
      stopMoodDetection();
    } else {
      startMoodDetection();
    }
  };

  return (
    <div className="flex items-center">
      <button
        onClick={handleMoodClick}
        disabled={isProcessing}
        className={`flex items-center space-x-2 px-3 py-2 rounded-full transition-all duration-300 ${
          isListening
            ? 'bg-pink-500/20 border border-pink-500/40 text-pink-400'
            : currentMood
            ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400 hover:bg-purple-500/30'
            : 'bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white border border-white/20'
        }`}
        title={currentMood ? `Current mood: ${currentMood}` : 'Detect your mood'}
      >
        {isProcessing ? (
          <>
            <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            <span className="text-xs font-medium hidden sm:inline">Analyzing...</span>
          </>
        ) : isListening ? (
          <>
            <MicOff className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Listening...</span>
          </>
        ) : currentMood ? (
          <>
            <Smile className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">{currentMood}</span>
          </>
        ) : (
          <>
            <Mic className="w-4 h-4" />
            <span className="text-xs font-medium hidden sm:inline">Mood</span>
          </>
        )}
      </button>
    </div>
  );
};

export default MoodDetector;
