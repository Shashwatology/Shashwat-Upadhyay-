import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Eye, EyeOff, Sun, Moon } from 'lucide-react';

const CRTOverlay = () => {
  const [effectsEnabled, setEffectsEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('crt-effects-enabled');
      return saved !== null ? saved === 'true' : true;
    }
    return true;
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme-mode');
      return saved !== null ? saved === 'dark' : true;
    }
    return true;
  });

  useEffect(() => {
    localStorage.setItem('crt-effects-enabled', String(effectsEnabled));
  }, [effectsEnabled]);

  useEffect(() => {
    localStorage.setItem('theme-mode', isDarkMode ? 'dark' : 'light');
    if (isDarkMode) {
      document.documentElement.classList.remove('light');
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
  }, [isDarkMode]);

  return (
    <>
      {/* Accessibility Toggle Panel */}
      <div className="fixed bottom-6 left-6 z-[9999] flex flex-col gap-3">
        {/* Theme Toggle */}
        <button
          onClick={() => setIsDarkMode(!isDarkMode)}
          className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all hover:-translate-y-0.5"
          aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
          title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
        >
          <motion.div
            initial={false}
            animate={{ rotate: isDarkMode ? 0 : 180 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
          >
            {isDarkMode ? <Moon size={14} /> : <Sun size={14} />}
          </motion.div>
          <span className="text-[11px] font-mono tracking-wider uppercase font-medium">
            {isDarkMode ? 'Dark' : 'Light'}
          </span>
        </button>

        {/* CRT Effects Toggle */}
        <button
          onClick={() => setEffectsEnabled(!effectsEnabled)}
          className="flex items-center gap-2 px-3 py-2 bg-black/40 backdrop-blur-xl border border-white/10 rounded-full text-white/80 hover:text-white hover:bg-black/60 transition-all hover:-translate-y-0.5"
          aria-label={effectsEnabled ? 'Disable visual effects' : 'Enable visual effects'}
          title={effectsEnabled ? 'Disable CRT effects' : 'Enable CRT effects'}
        >
          {effectsEnabled ? <EyeOff size={14} /> : <Eye size={14} />}
          <span className="text-[11px] font-mono tracking-wider uppercase font-medium">
            {effectsEnabled ? 'CRT On' : 'CRT Off'}
          </span>
        </button>
      </div>

      {effectsEnabled && isDarkMode && (
        <>
          {/* Scanlines - Fine-tuned intensity */}
          <div className="crt-scanlines" aria-hidden="true" />
          
          {/* Noise grain - Subtle */}
          <div className="crt-noise" aria-hidden="true" />
          
          {/* Vignette */}
          <div className="crt-vignette" aria-hidden="true" />
          
          {/* Subtle flicker */}
          <motion.div 
            className="crt-flicker"
            animate={{ 
              opacity: [0.99, 1, 0.985, 1, 0.995, 1] 
            }}
            transition={{ 
              duration: 0.2, 
              repeat: Infinity, 
              repeatDelay: 5 
            }}
            aria-hidden="true"
          />
        </>
      )}
    </>
  );
};

export default CRTOverlay;