import { motion } from 'framer-motion';
import { ExternalLink } from 'lucide-react';
import FloatingCard from './FloatingCard';

interface FloatingStreakProps {
  image: string;
  label: string;
  href: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  zIndex?: number;
}

const FloatingStreak = ({
  image,
  label,
  href,
  initialX,
  initialY,
  rotation = 0,
  zIndex = 1,
}: FloatingStreakProps) => {
  const handleClick = () => {
    window.open(href, '_blank', 'noopener,noreferrer');
  };

  return (
    <FloatingCard
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      zIndex={zIndex}
      className="floating-streak"
    >
      <motion.div 
        className="floating-streak-inner"
        onClick={handleClick}
        whileHover={{ scale: 1.02 }}
      >
        <div className="floating-streak-frame">
          <img
            src={image}
            alt={label}
            className="floating-streak-image"
          />
        </div>
        
        <div className="floating-streak-label">
          <span>{label}</span>
          <ExternalLink size={10} />
        </div>
      </motion.div>
    </FloatingCard>
  );
};

export default FloatingStreak;
