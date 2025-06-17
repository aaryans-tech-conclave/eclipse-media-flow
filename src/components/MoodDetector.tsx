
import React, { useState, useRef } from 'react';
import { Mic, MicOff, Smile } from 'lucide-react';

const MoodDetector = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const moods = ['Happy', 'Excited', 'Calm', 'Melancholic', 'Energetic', 'Romantic', 'Adventurous', 'Nostalgic'];

  const detectSilence = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate the average volume level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    
    // If volume is below threshold (silence detected)
    if (average < 10) {
      if (!silenceTimeoutRef.current) {
        // Start silence timer - stop after 2 seconds of silence
        silenceTimeoutRef.current = setTimeout(() => {
          if (mediaRecorderRef.current && isListening) {
            console.log('Silence detected, stopping recording');
            mediaRecorderRef.current.stop();
            setIsListening(false);
          }
        }, 2000);
      }
    } else {
      // Audio detected, clear silence timer
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    }

    // Continue monitoring if still listening
    if (isListening) {
      requestAnimationFrame(detectSilence);
    }
  };

  const startMoodDetection = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      // Set up audio context for volume analysis
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 256;
      
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
        if (audioContextRef.current) {
          audioContextRef.current.close();
        }
        if (silenceTimeoutRef.current) {
          clearTimeout(silenceTimeoutRef.current);
          silenceTimeoutRef.current = null;
        }
      };

      mediaRecorderRef.current.start();
      setIsListening(true);

      // Start silence detection
      detectSilence();

      // Fallback: Auto-stop after 10 seconds maximum
      setTimeout(() => {
        if (mediaRecorderRef.current && isListening) {
          mediaRecorderRef.current.stop();
          setIsListening(false);
        }
      }, 10000);

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
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
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
