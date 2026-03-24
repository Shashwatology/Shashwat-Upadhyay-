import { useState, useEffect } from 'react';

const greetings = [
  { text: 'hello', lang: 'English' },
  { text: 'नमस्ते', lang: 'Hindi' },
  { text: 'hola', lang: 'Spanish' },
  { text: 'bonjour', lang: 'French' },
  { text: 'ciao', lang: 'Italian' },
  { text: 'こんにちは', lang: 'Japanese' },
  { text: '안녕하세요', lang: 'Korean' },
  { text: '你好', lang: 'Chinese' },
  { text: 'olá', lang: 'Portuguese' },
  { text: 'مرحبا', lang: 'Arabic' },
];

const TOTAL_LOAD_TIME = 5000;

interface GreetingLoaderProps {
  onComplete?: () => void;
}

const GreetingLoader = ({ onComplete }: GreetingLoaderProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayedText, setDisplayedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentGreeting = greetings[currentIndex].text;
  const TYPING_SPEED = 100;

  // Loading progress
  useEffect(() => {
    const startTime = Date.now();

    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min((elapsed / TOTAL_LOAD_TIME) * 100, 100);
      setProgress(newProgress);

      if (newProgress >= 100) {
        clearInterval(interval);
        setIsComplete(true);
        // Auto-continue after loading completes
        setTimeout(() => {
          if (onComplete) onComplete();
        }, 400);
      }
    }, 16);

    return () => clearInterval(interval);
  }, [onComplete]);

  // Typing effect for greetings
  useEffect(() => {
    if (isComplete) return;

    setDisplayedText('');
    let charIndex = 0;

    const typingInterval = setInterval(() => {
      if (charIndex < currentGreeting.length) {
        setDisplayedText(currentGreeting.slice(0, charIndex + 1));
        charIndex++;
      } else {
        clearInterval(typingInterval);
        setTimeout(() => {
          if (!isComplete) {
            setCurrentIndex((prev) => (prev + 1) % greetings.length);
          }
        }, 400);
      }
    }, TYPING_SPEED);

    return () => clearInterval(typingInterval);
  }, [currentIndex, currentGreeting, isComplete]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <div className="loader-container">
      {/* Soft grid background */}
      <div className="grid-overlay" />
      {/* Noise texture */}
      <div className="noise-texture" />

      {/* Ambient glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/[0.02] blur-[80px]" />
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center gap-12">
        {/* Greeting text with typewriter */}
        <div className="content-card">
          <h1
            className="greeting-text text-glow"
            aria-label={`${greetings[currentIndex].text} - ${greetings[currentIndex].lang}`}
          >
            {displayedText}
            <span
              className={`inline-block w-[4px] h-[0.85em] bg-white ml-2 align-middle transition-opacity duration-75 ${
                showCursor ? 'opacity-100' : 'opacity-0'
              }`}
            />
          </h1>
        </div>

        {/* Loading bar section */}
        <div className="flex flex-col items-center gap-4 w-full">
          {/* Progress bar */}
          <div className="loading-bar-container">
            <div className="loading-bar-track">
              <div
                className="loading-bar-fill"
                style={{
                  width: `${progress}%`,
                  transition: 'width 0.1s ease-out',
                }}
              />
            </div>
          </div>

          {/* Percentage counter */}
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
              {Math.round(progress)}
            </span>
            <span className="text-lg text-white/50 font-medium">%</span>
          </div>

          {/* Status text */}
          <span className="text-[11px] uppercase tracking-[0.25em] text-white/30 font-medium">
            loading
          </span>
        </div>
      </div>
    </div>
  );
};

export default GreetingLoader;

