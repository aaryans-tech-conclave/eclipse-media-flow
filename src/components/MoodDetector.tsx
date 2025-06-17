
import React, { useState, useRef, useEffect } from 'react';
import { Mic, MicOff, Smile, X } from 'lucide-react';

const MoodDetector = () => {
  const [isListening, setIsListening] = useState(false);
  const [currentMood, setCurrentMood] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showVoiceBar, setShowVoiceBar] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [spokenWords, setSpokenWords] = useState<string[]>([]);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const silenceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const lastAudioTimeRef = useRef<number>(Date.now());

  const moods = ['Happy', 'Excited', 'Calm', 'Melancholic', 'Energetic', 'Romantic', 'Adventurous', 'Nostalgic'];

  const detectAudioLevel = () => {
    if (!analyserRef.current) return;

    const bufferLength = analyserRef.current.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    analyserRef.current.getByteFrequencyData(dataArray);

    // Calculate the average volume level
    const average = dataArray.reduce((sum, value) => sum + value, 0) / bufferLength;
    const normalizedLevel = Math.min(average / 80, 1); // Adjust sensitivity
    setAudioLevel(normalizedLevel);
    
    console.log('Audio level:', average, 'Normalized:', normalizedLevel);
    
    // If volume is above threshold (audio detected)
    if (average > 20) {
      lastAudioTimeRef.current = Date.now();
      
      // Clear any existing silence timeout
      if (silenceTimeoutRef.current) {
        clearTimeout(silenceTimeoutRef.current);
        silenceTimeoutRef.current = null;
      }
    } else {
      // Check if we should start silence timer
      const timeSinceLastAudio = Date.now() - lastAudioTimeRef.current;
      
      if (timeSinceLastAudio > 2000 && !silenceTimeoutRef.current) {
        console.log('Starting silence timer...');
        silenceTimeoutRef.current = setTimeout(() => {
          console.log('Silence detected, stopping recording...');
          if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
            mediaRecorderRef.current.stop();
          }
          setIsListening(false);
        }, 1000); // Stop after 1 additional second of silence
      }
    }

    // Continue monitoring if still listening
    if (isListening) {
      animationFrameRef.current = requestAnimationFrame(detectAudioLevel);
    }
  };

  const analyzeMoodFromAudio = (words: string[]) => {
    // Enhanced mood analysis based on spoken words
    const moodKeywords = {
      'Happy': ['happy', 'great', 'awesome', 'wonderful', 'fantastic', 'good', 'amazing', 'love', 'excited'],
      'Excited': ['excited', 'thrilled', 'pumped', 'energetic', 'amazing', 'incredible', 'wow'],
      'Calm': ['calm', 'peaceful', 'relaxed', 'quiet', 'serene', 'tranquil', 'chill'],
      'Melancholic': ['sad', 'down', 'blue', 'melancholy', 'lonely', 'upset', 'disappointed'],
      'Energetic': ['energy', 'pumped', 'active', 'dynamic', 'vigorous', 'lively'],
      'Romantic': ['love', 'romantic', 'heart', 'beautiful', 'gorgeous', 'adorable'],
      'Adventurous': ['adventure', 'explore', 'journey', 'travel', 'discover', 'bold'],
      'Nostalgic': ['remember', 'memory', 'past', 'nostalgic', 'childhood', 'old times']
    };

    const wordText = words.join(' ').toLowerCase();
    let bestMood = 'Calm';
    let maxScore = 0;

    Object.entries(moodKeywords).forEach(([mood, keywords]) => {
      const score = keywords.filter(keyword => wordText.includes(keyword)).length;
      if (score > maxScore) {
        maxScore = score;
        bestMood = mood;
      }
    });

    // If no keywords matched, use random selection
    if (maxScore === 0) {
      bestMood = moods[Math.floor(Math.random() * moods.length)];
    }

    return bestMood;
  };

  const startMoodDetection = async () => {
    try {
      console.log('Starting mood detection...');
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        } 
      });
      
      streamRef.current = stream;
      setShowVoiceBar(true);
      setSpokenWords([]);
      lastAudioTimeRef.current = Date.now();
      
      // Set up audio context for volume analysis
      audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
      analyserRef.current = audioContextRef.current.createAnalyser();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      analyserRef.current.fftSize = 2048;
      analyserRef.current.smoothingTimeConstant = 0.3;
      
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      // Simulate word detection (in real app, you'd use speech recognition)
      const simulateWordDetection = () => {
        const samplePhrases = [
          ['I', 'feel', 'really', 'happy', 'today'],
          ['This', 'is', 'so', 'exciting'],
          ['I', 'am', 'feeling', 'calm', 'and', 'peaceful'],
          ['I', 'love', 'this', 'romantic', 'music'],
          ['Feeling', 'a', 'bit', 'sad', 'today'],
          ['So', 'much', 'energy', 'right', 'now']
        ];
        
        const randomPhrase = samplePhrases[Math.floor(Math.random() * samplePhrases.length)];
        setSpokenWords(randomPhrase);
      };

      // Simulate detecting words after 2 seconds
      setTimeout(simulateWordDetection, 2000);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        console.log('Recording stopped, processing...');
        setIsProcessing(true);
        setShowVoiceBar(false);
        
        // Analyze mood based on detected words
        setTimeout(() => {
          const detectedMood = analyzeMoodFromAudio(spokenWords);
          setCurrentMood(detectedMood);
          setIsProcessing(false);
          setAudioLevel(0);
        }, 1500);
        
        // Clean up
        cleanup();
      };

      mediaRecorderRef.current.start(100); // Collect data every 100ms
      setIsListening(true);

      // Start audio level detection
      detectAudioLevel();

      // Fallback: Auto-stop after 15 seconds maximum
      setTimeout(() => {
        if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
          console.log('Maximum time reached, stopping...');
          mediaRecorderRef.current.stop();
          setIsListening(false);
        }
      }, 15000);

    } catch (error) {
      console.error('Error accessing microphone:', error);
      alert('Unable to access microphone. Please check permissions.');
      setShowVoiceBar(false);
      cleanup();
    }
  };

  const cleanup = () => {
    // Stop all tracks
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    // Close audio context
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
    
    // Clear timeouts and animation frames
    if (silenceTimeoutRef.current) {
      clearTimeout(silenceTimeoutRef.current);
      silenceTimeoutRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
  };

  const stopMoodDetection = () => {
    console.log('Manually stopping mood detection...');
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
    }
    setIsListening(false);
    setShowVoiceBar(false);
    setAudioLevel(0);
    cleanup();
  };

  const handleMoodClick = () => {
    if (isListening) {
      stopMoodDetection();
    } else {
      startMoodDetection();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  // Generate audio bars for visualization
  const generateAudioBars = () => {
    const bars = [];
    const numBars = 5;
    
    for (let i = 0; i < numBars; i++) {
      const height = Math.max(0.1, audioLevel * (0.5 + Math.random() * 0.5));
      bars.push(
        <div
          key={i}
          className="bg-gradient-to-t from-pink-500 to-purple-400 rounded-full transition-all duration-100"
          style={{
            width: '3px',
            height: `${height * 40 + 8}px`,
            opacity: audioLevel > 0.05 ? 1 : 0.3
          }}
        />
      );
    }
    return bars;
  };

  return (
    <>
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

      {/* Siri-like Voice Input Bar */}
      {showVoiceBar && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-black/80 backdrop-blur-xl border border-white/20 rounded-3xl p-8 max-w-md w-full mx-4">
            {/* Close button */}
            <button
              onClick={stopMoodDetection}
              className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors"
            >
              <X className="w-4 h-4 text-white" />
            </button>

            {/* Header */}
            <div className="text-center mb-6">
              <div className="text-lg font-medium text-white mb-2">Tell me about your mood</div>
              <div className="text-sm text-gray-400">Speak naturally about how you're feeling</div>
            </div>

            {/* Audio Visualization */}
            <div className="flex items-center justify-center space-x-1 mb-6 h-12">
              {generateAudioBars()}
            </div>

            {/* Microphone Icon */}
            <div className="flex justify-center mb-4">
              <div className={`p-4 rounded-full transition-all duration-300 ${
                audioLevel > 0.1 
                  ? 'bg-pink-500/30 border border-pink-500/50 scale-110' 
                  : 'bg-white/10 border border-white/20'
              }`}>
                <Mic className="w-8 h-8 text-white" />
              </div>
            </div>

            {/* Status Text */}
            <div className="text-center">
              <div className="text-white font-medium mb-1">
                {audioLevel > 0.1 ? 'Listening...' : 'Waiting for your voice'}
              </div>
              <div className="text-xs text-gray-400">
                {spokenWords.length > 0 ? `Detected: "${spokenWords.join(' ')}"` : 'Start speaking to detect your mood'}
              </div>
            </div>

            {/* Progress indicator */}
            <div className="mt-4 w-full bg-white/10 rounded-full h-1">
              <div 
                className="bg-gradient-to-r from-pink-500 to-purple-500 h-1 rounded-full transition-all duration-300"
                style={{ width: `${Math.min(audioLevel * 100, 100)}%` }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default MoodDetector;
