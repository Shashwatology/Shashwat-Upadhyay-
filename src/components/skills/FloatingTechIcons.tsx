import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

interface FloatingIconData {
  id: string;
  icon: string;
  size: number;
  x: string;
  y: string;
  delay: number;
  parallaxSpeed: number;
  rotateRange: [number, number];
  color: string;
}

const floatingIcons: FloatingIconData[] = [
  // Left side icons
  { id: 'python', icon: '🐍', size: 48, x: '5%', y: '15%', delay: 0, parallaxSpeed: 0.3, rotateRange: [-15, 15], color: 'rgba(59, 130, 246, 0.3)' },
  { id: 'brain', icon: '🧠', size: 42, x: '8%', y: '45%', delay: 0.2, parallaxSpeed: 0.5, rotateRange: [-10, 10], color: 'rgba(168, 85, 247, 0.3)' },
  { id: 'chip', icon: '🔧', size: 36, x: '3%', y: '70%', delay: 0.4, parallaxSpeed: 0.2, rotateRange: [-20, 20], color: 'rgba(234, 179, 8, 0.3)' },
  { id: 'lock', icon: '🔐', size: 40, x: '10%', y: '85%', delay: 0.6, parallaxSpeed: 0.4, rotateRange: [-8, 8], color: 'rgba(239, 68, 68, 0.3)' },
  
  // Right side icons
  { id: 'react', icon: '⚛️', size: 44, x: '92%', y: '20%', delay: 0.1, parallaxSpeed: 0.4, rotateRange: [-12, 12], color: 'rgba(34, 211, 238, 0.3)' },
  { id: 'cloud', icon: '☁️', size: 50, x: '88%', y: '50%', delay: 0.3, parallaxSpeed: 0.6, rotateRange: [-5, 5], color: 'rgba(16, 185, 129, 0.3)' },
  { id: 'db', icon: '💾', size: 38, x: '95%', y: '75%', delay: 0.5, parallaxSpeed: 0.25, rotateRange: [-18, 18], color: 'rgba(99, 102, 241, 0.3)' },
  { id: 'terminal', icon: '💻', size: 46, x: '90%', y: '90%', delay: 0.7, parallaxSpeed: 0.35, rotateRange: [-10, 10], color: 'rgba(245, 158, 11, 0.3)' },
  
  // Top scattered icons
  { id: 'ai', icon: '🤖', size: 40, x: '25%', y: '5%', delay: 0.15, parallaxSpeed: 0.45, rotateRange: [-15, 15], color: 'rgba(139, 92, 246, 0.3)' },
  { id: 'network', icon: '🌐', size: 36, x: '75%', y: '8%', delay: 0.35, parallaxSpeed: 0.55, rotateRange: [-12, 12], color: 'rgba(14, 165, 233, 0.3)' },
  { id: 'rocket', icon: '🚀', size: 44, x: '50%', y: '3%', delay: 0.25, parallaxSpeed: 0.3, rotateRange: [-8, 8], color: 'rgba(236, 72, 153, 0.3)' },
  
  // Bottom scattered icons
  { id: 'code', icon: '⚡', size: 38, x: '30%', y: '92%', delay: 0.45, parallaxSpeed: 0.5, rotateRange: [-20, 20], color: 'rgba(250, 204, 21, 0.3)' },
  { id: 'data', icon: '📊', size: 42, x: '70%', y: '95%', delay: 0.55, parallaxSpeed: 0.4, rotateRange: [-10, 10], color: 'rgba(34, 197, 94, 0.3)' },
  
  // Additional floating accents
  { id: 'star1', icon: '✦', size: 24, x: '15%', y: '30%', delay: 0.8, parallaxSpeed: 0.7, rotateRange: [0, 360], color: 'rgba(255, 255, 255, 0.2)' },
  { id: 'star2', icon: '✦', size: 20, x: '85%', y: '35%', delay: 0.9, parallaxSpeed: 0.65, rotateRange: [0, 360], color: 'rgba(255, 255, 255, 0.15)' },
  { id: 'star3', icon: '◈', size: 28, x: '20%', y: '60%', delay: 1.0, parallaxSpeed: 0.8, rotateRange: [-45, 45], color: 'rgba(139, 92, 246, 0.2)' },
  { id: 'star4', icon: '◇', size: 22, x: '80%', y: '65%', delay: 1.1, parallaxSpeed: 0.75, rotateRange: [-30, 30], color: 'rgba(59, 130, 246, 0.2)' },
];

const FloatingIcon = ({ icon }: { icon: FloatingIconData }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start']
  });

  // Parallax Y movement based on scroll
  const y = useTransform(
    scrollYProgress,
    [0, 1],
    [100 * icon.parallaxSpeed, -100 * icon.parallaxSpeed]
  );

  // Subtle rotation based on scroll
  const rotate = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [icon.rotateRange[0], 0, icon.rotateRange[1]]
  );

  // Scale pulse based on scroll position
  const scale = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    [0.8, 1.1, 0.9]
  );

  return (
    <motion.div
      ref={ref}
      className="floating-tech-icon"
      style={{
        left: icon.x,
        top: icon.y,
        fontSize: icon.size,
        y,
        rotate,
        scale,
      }}
      initial={{ opacity: 0, scale: 0 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        delay: icon.delay,
        duration: 0.8,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {/* Glow effect behind icon */}
      <div 
        className="floating-icon-glow"
        style={{ 
          background: `radial-gradient(circle, ${icon.color} 0%, transparent 70%)`,
          width: icon.size * 2.5,
          height: icon.size * 2.5,
        }}
      />
      
      {/* The icon itself */}
      <motion.span
        className="floating-icon-emoji"
        animate={{
          y: [0, -8, 0],
        }}
        transition={{
          duration: 3 + Math.random() * 2,
          repeat: Infinity,
          ease: 'easeInOut',
          delay: icon.delay,
        }}
      >
        {icon.icon}
      </motion.span>
    </motion.div>
  );
};

const FloatingTechIcons = () => {
  return (
    <div className="floating-tech-icons-container" aria-hidden="true">
      {floatingIcons.map((icon) => (
        <FloatingIcon key={icon.id} icon={icon} />
      ))}
      
      {/* Connecting lines effect */}
      <svg className="floating-connections" viewBox="0 0 100 100" preserveAspectRatio="none">
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="rgba(139, 92, 246, 0.1)" />
            <stop offset="50%" stopColor="rgba(59, 130, 246, 0.15)" />
            <stop offset="100%" stopColor="rgba(139, 92, 246, 0.1)" />
          </linearGradient>
        </defs>
        
        {/* Animated connection lines */}
        <motion.path
          d="M 5 20 Q 25 10 50 15 T 95 25"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.15"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
        />
        <motion.path
          d="M 8 50 Q 30 60 50 55 T 92 45"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.1"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.5, delay: 0.8, ease: 'easeOut' }}
        />
        <motion.path
          d="M 10 80 Q 35 90 55 85 T 90 75"
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="0.12"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 2.2, delay: 1.0, ease: 'easeOut' }}
        />
      </svg>
    </div>
  );
};

export default FloatingTechIcons;
