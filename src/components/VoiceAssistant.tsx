import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, MicOff, Volume2, X, Sparkles } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

// Type declarations for Web Speech API
interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

interface SpeechRecognitionInstance extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  start: () => void;
  stop: () => void;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

interface VoiceAssistantProps {
  isActive?: boolean;
}

const WAKE_WORDS = ['hey shashwat', 'hi shashwat', 'hello shashwat', 'okay shashwat', 'shashwat'];

const VoiceAssistant = ({ isActive = true }: VoiceAssistantProps) => {
  const [isListening, setIsListening] = useState(false);
  const [isWakeWordMode, setIsWakeWordMode] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [error, setError] = useState('');
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(32).fill(0));
  const [wakeWordDetected, setWakeWordDetected] = useState(false);
  
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Initialize audio visualizer
  const startAudioVisualization = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      
      audioContextRef.current = new AudioContext();
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 64;
      
      const source = audioContextRef.current.createMediaStreamSource(stream);
      source.connect(analyserRef.current);
      
      const updateVisualization = () => {
        if (!analyserRef.current) return;
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        analyserRef.current.getByteFrequencyData(dataArray);
        
        const levels = Array.from(dataArray).slice(0, 32).map(v => v / 255);
        setAudioLevels(levels);
        
        animationFrameRef.current = requestAnimationFrame(updateVisualization);
      };
      
      updateVisualization();
    } catch (err) {
      console.error('Audio visualization error:', err);
    }
  }, []);

  const stopAudioVisualization = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(track => track.stop());
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
    }
    setAudioLevels(Array(32).fill(0));
  }, []);

  // Check for wake word in transcript
  const checkWakeWord = useCallback((text: string): string | null => {
    const lowerText = text.toLowerCase().trim();
    
    for (const wakeWord of WAKE_WORDS) {
      if (lowerText.includes(wakeWord)) {
        // Return the text after the wake word
        const afterWake = lowerText.split(wakeWord)[1]?.trim();
        return afterWake || '';
      }
    }
    return null;
  }, []);

  useEffect(() => {
    // Initialize speech recognition
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognitionConstructor = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
      const recognition = new SpeechRecognitionConstructor() as SpeechRecognitionInstance;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognitionRef.current = recognition;

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const current = event.resultIndex;
        const result = event.results[current];
        const text = result[0].transcript;
        
        if (isWakeWordMode) {
          // Check for wake word
          const afterWakeWord = checkWakeWord(text);
          if (afterWakeWord !== null) {
            setWakeWordDetected(true);
            setIsExpanded(true);
            
            // Small delay then process
            setTimeout(() => {
              setWakeWordDetected(false);
              if (afterWakeWord) {
                setTranscript(afterWakeWord);
                if (result.isFinal) {
                  handleVoiceInput(afterWakeWord);
                }
              }
            }, 500);
          }
        } else {
          setTranscript(text);
          if (result.isFinal) {
            handleVoiceInput(text);
          }
        }
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        if (event.error !== 'no-speech') {
          setIsListening(false);
          setError('Couldn\'t catch that, gorgeous. Try again? 💫');
          setTimeout(() => setError(''), 3000);
        }
      };

      recognition.onend = () => {
        // Restart if in wake word mode
        if (isWakeWordMode && recognitionRef.current) {
          try {
            recognitionRef.current.start();
          } catch (e) {
            // Already started
          }
        } else {
          setIsListening(false);
        }
      };
    }

    // Load voices
    window.speechSynthesis.getVoices();

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      window.speechSynthesis.cancel();
      stopAudioVisualization();
    };
  }, [isWakeWordMode, checkWakeWord, stopAudioVisualization]);

  const startListening = async () => {
    if (recognitionRef.current && !isListening) {
      setTranscript('');
      setResponse('');
      setError('');
      setIsExpanded(true);
      
      await startAudioVisualization();
      
      try {
        recognitionRef.current.start();
        setIsListening(true);
      } catch (e) {
        console.error('Failed to start recognition:', e);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      setIsWakeWordMode(false);
      stopAudioVisualization();
    }
  };

  const toggleWakeWordMode = async () => {
    if (isWakeWordMode) {
      setIsWakeWordMode(false);
      stopListening();
    } else {
      setIsWakeWordMode(true);
      setTranscript('');
      setResponse('');
      
      await startAudioVisualization();
      
      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
          setIsListening(true);
        } catch (e) {
          console.error('Failed to start wake word detection:', e);
        }
      }
    }
  };

  const handleVoiceInput = async (text: string) => {
    if (!text.trim()) return;

    try {
      const { data, error: apiError } = await supabase.functions.invoke('chat', {
        body: { 
          message: text, 
          conversationHistory: [],
          isVoice: true
        }
      });

      if (apiError) throw apiError;

      const reply = data.reply;
      setResponse(reply);
      speak(reply);
    } catch (err) {
      console.error('AI response error:', err);
      const fallback = "Connection's acting up, cutie. Try the chat? 💬";
      setResponse(fallback);
      speak(fallback);
    }
  };

  const speak = (text: string) => {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 1.1;
    utterance.volume = 0.9;
    
    // Get the best available voice
    const voices = window.speechSynthesis.getVoices();
    const preferredVoices = [
      'Microsoft Zira',
      'Samantha',
      'Karen',
      'Google US English Female',
      'Alex',
      'Google UK English Female',
      'Fiona',
      'Victoria'
    ];
    
    let selectedVoice = voices.find(v => 
      preferredVoices.some(pv => v.name.includes(pv))
    );
    
    // Fallback to any female/natural voice
    if (!selectedVoice) {
      selectedVoice = voices.find(v => 
        v.name.toLowerCase().includes('female') ||
        v.name.includes('Natural') ||
        v.name.includes('Google')
      );
    }
    
    if (selectedVoice) utterance.voice = selectedVoice;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  };

  if (!isActive) return null;

  return (
    <div className="voice-assistant">
      {/* Wake word indicator */}
      <AnimatePresence>
        {isWakeWordMode && !isExpanded && (
          <motion.div
            className="wake-word-indicator"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <Sparkles size={12} />
            <span>Say "Hey Shashwat"</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Wake word detected flash */}
      <AnimatePresence>
        {wakeWordDetected && (
          <motion.div
            className="wake-word-flash"
            initial={{ opacity: 0, scale: 1.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
          >
            ✨ Heard you!
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main voice button */}
      <motion.button
        className={`voice-button ${isListening ? 'listening' : ''} ${isSpeaking ? 'speaking' : ''} ${isWakeWordMode ? 'wake-mode' : ''}`}
        onClick={isListening ? stopListening : startListening}
        onDoubleClick={toggleWakeWordMode}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1.5 }}
        title={isWakeWordMode ? 'Wake word mode active' : 'Double-click for hands-free mode'}
      >
        {/* Audio Visualizer Ring */}
        {(isListening || isSpeaking) && (
          <div className="audio-visualizer-ring">
            {audioLevels.map((level, i) => (
              <motion.div
                key={i}
                className="visualizer-bar"
                style={{
                  transform: `rotate(${i * (360 / 32)}deg) translateY(-28px)`,
                }}
                animate={{
                  scaleY: 0.3 + level * 2,
                  opacity: 0.4 + level * 0.6,
                }}
                transition={{ duration: 0.05 }}
              />
            ))}
          </div>
        )}

        {/* Ripple effect when listening */}
        {isListening && (
          <>
            <motion.div
              className="voice-ripple"
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
            />
            <motion.div
              className="voice-ripple"
              animate={{ scale: [1, 2.5], opacity: [0.4, 0] }}
              transition={{ duration: 2, repeat: Infinity, delay: 0.7, ease: 'easeOut' }}
            />
          </>
        )}
        
        {/* Sound wave animation when speaking */}
        {isSpeaking && (
          <div className="voice-wave">
            {[...Array(7)].map((_, i) => (
              <motion.div
                key={i}
                className="wave-bar"
                animate={{ 
                  scaleY: [0.3, 1, 0.5, 0.8, 0.3],
                  backgroundColor: ['hsl(180, 100%, 50%)', 'hsl(200, 100%, 60%)', 'hsl(180, 100%, 50%)']
                }}
                transition={{ 
                  duration: 0.6 + Math.random() * 0.4, 
                  repeat: Infinity, 
                  delay: i * 0.08,
                  ease: 'easeInOut'
                }}
              />
            ))}
          </div>
        )}
        
        <div className="voice-icon">
          {isListening ? <MicOff size={24} /> : <Mic size={24} />}
        </div>
      </motion.button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            className="voice-panel"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
          >
            <button className="voice-panel-close" onClick={() => setIsExpanded(false)}>
              <X size={16} />
            </button>
            
            <div className="voice-panel-header">
              <Volume2 size={18} className="text-neon" />
              <span>Voice Assistant</span>
              {isWakeWordMode && (
                <span className="wake-badge">🎙️ Hands-free</span>
              )}
            </div>

            {/* Audio visualizer in panel */}
            {(isListening || isSpeaking) && (
              <div className="audio-visualizer-panel">
                {audioLevels.slice(0, 16).map((level, i) => (
                  <motion.div
                    key={i}
                    className="panel-visualizer-bar"
                    animate={{
                      scaleY: 0.2 + level * 1.5,
                    }}
                    transition={{ duration: 0.05 }}
                  />
                ))}
              </div>
            )}
            
            {error && (
              <div className="voice-error">{error}</div>
            )}
            
            {transcript && (
              <div className="voice-transcript">
                <span className="label">You:</span>
                <p>{transcript}</p>
              </div>
            )}
            
            {response && (
              <div className="voice-response">
                <span className="label">✨</span>
                <p>{response}</p>
              </div>
            )}
            
            {!transcript && !response && !error && (
              <p className="voice-hint">
                {isListening 
                  ? 'I\'m all ears, gorgeous... 👂' 
                  : isWakeWordMode 
                    ? 'Say "Hey Shashwat" to start...'
                    : 'Tap the mic & ask me anything 💫'}
              </p>
            )}

            {isSpeaking && (
              <button className="voice-stop" onClick={stopSpeaking}>
                Shh, stop talking
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceAssistant;
