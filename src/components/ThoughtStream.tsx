import { useState, useEffect, useRef, useMemo } from 'react';
import { motion } from 'framer-motion';

const thoughts = [
  "Machine Learning Researcher",
  "Exploring the real world from my virtual domain",
  "Cybersecurity student by choice, not fear",
  "Curious enough to break things, careful enough to fix them",
  "Building quietly. Learning loudly.",
  "Somewhere between logic and chaos"
];

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  driftX: number;
  driftY: number;
}

const ThoughtStream = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [phase, setPhase] = useState<'revealing' | 'visible' | 'dissolving'>('revealing');
  const [particles, setParticles] = useState<Particle[]>([]);
  const textRef = useRef<HTMLSpanElement>(null);

  // Generate particles for dissolve effect - denser, smaller particles like sujitpradhan.com
  const generateParticles = useMemo(() => {
    const particleCount = 120; // More particles for denser effect
    return Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: 30 + Math.random() * 70, // Spread across more of the text (30-100%)
      y: Math.random() * 100,
      size: 1 + Math.random() * 2, // Smaller particles (1-3px)
      delay: (i / particleCount) * 0.6, // Staggered delay
      duration: 0.8 + Math.random() * 0.6,
      driftX: 40 + Math.random() * 100, // Stronger horizontal drift
      driftY: (Math.random() - 0.5) * 30 // Less vertical drift
    }));
  }, [currentIndex]);

  useEffect(() => {
    setParticles(generateParticles);
  }, [generateParticles]);

  useEffect(() => {
    // Phase timing - refined to match sujitpradhan.com feel
    if (phase === 'revealing') {
      const timer = setTimeout(() => setPhase('visible'), 1200);
      return () => clearTimeout(timer);
    }
    
    if (phase === 'visible') {
      const timer = setTimeout(() => setPhase('dissolving'), 2800);
      return () => clearTimeout(timer);
    }
    
    if (phase === 'dissolving') {
      const timer = setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % thoughts.length);
        setPhase('revealing');
      }, 1400);
      return () => clearTimeout(timer);
    }
  }, [phase]);

  const currentText = thoughts[currentIndex];

  return (
    <div className="particle-dissolve-container">
      {/* Glow background */}
      <div className="thought-glow-bg" />
      
      <div className="particle-text-wrapper">
        {/* Main text with gradient mask for dissolve */}
        <motion.span
          ref={textRef}
          className="dissolve-text"
          initial={{ opacity: 0 }}
          animate={{
            opacity: phase === 'dissolving' ? 0 : 1,
            maskImage: phase === 'revealing' 
              ? 'linear-gradient(to right, black 100%, transparent 100%)'
              : phase === 'dissolving'
              ? 'linear-gradient(to right, transparent 0%, transparent 100%)'
              : 'linear-gradient(to right, black 100%, transparent 100%)',
          }}
          transition={{
            opacity: { duration: phase === 'dissolving' ? 1.2 : 0.8, ease: 'easeOut' },
          }}
          key={currentIndex}
        >
          {/* Text with progressive dissolve from right to left */}
          {currentText.split('').map((char, i) => {
            const charPosition = i / currentText.length; // 0 to 1
            // During dissolve: right side (higher position) fades first
            const dissolveThreshold = 0.3; // Left 30% stays solid longest
            const shouldDissolve = phase === 'dissolving' && charPosition > dissolveThreshold;
            const dissolveDelay = charPosition * 0.5; // Right chars dissolve earlier
            
            return (
              <motion.span
                key={i}
                style={{ display: 'inline-block' }}
                initial={{ 
                  opacity: 0,
                  filter: 'blur(6px)',
                }}
                animate={{ 
                  opacity: shouldDissolve ? 0 : 1,
                  filter: shouldDissolve ? 'blur(3px)' : 'blur(0px)',
                  x: shouldDissolve ? 5 + charPosition * 15 : 0,
                }}
                transition={{
                  opacity: { 
                    duration: phase === 'revealing' ? 0.4 : 0.6,
                    delay: phase === 'revealing' ? i * 0.025 : dissolveDelay,
                    ease: [0.25, 0.46, 0.45, 0.94]
                  },
                  filter: { 
                    duration: 0.3, 
                    delay: phase === 'revealing' ? i * 0.025 : dissolveDelay 
                  },
                  x: { 
                    duration: 0.8, 
                    delay: dissolveDelay,
                    ease: 'easeOut' 
                  }
                }}
              >
                {char === ' ' ? '\u00A0' : char}
              </motion.span>
            );
          })}
        </motion.span>

        {/* Particle overlay for dissolve effect */}
        {phase === 'dissolving' && (
          <div className="particle-overlay">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="dissolve-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ 
                  opacity: 0.8,
                  x: 0,
                  y: 0,
                  scale: 1
                }}
                animate={{ 
                  opacity: 0,
                  x: particle.driftX,
                  y: particle.driftY,
                  scale: 0.3
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            ))}
          </div>
        )}

        {/* Reveal particles */}
        {phase === 'revealing' && (
          <div className="particle-overlay">
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="dissolve-particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: particle.size,
                  height: particle.size,
                }}
                initial={{ 
                  opacity: 0.7,
                  x: particle.driftX,
                  y: particle.driftY,
                  scale: 0.5
                }}
                animate={{ 
                  opacity: 0,
                  x: 0,
                  y: 0,
                  scale: 1
                }}
                transition={{
                  duration: particle.duration,
                  delay: particle.delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ThoughtStream;
