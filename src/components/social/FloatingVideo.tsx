import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX, Play } from 'lucide-react';
import FloatingCard from './FloatingCard';

interface FloatingVideoProps {
  video: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  size?: 'sm' | 'md' | 'lg' | 'featured';
  zIndex?: number;
  caption?: string;
  scale?: number;
  opacity?: number;
}

const sizeClasses = {
  sm: 'w-[100px] h-[140px]',
  md: 'w-[140px] h-[190px]',
  lg: 'w-[180px] h-[240px]',
  featured: 'w-[220px] h-[300px]',
};

const FloatingVideo = ({
  video,
  initialX,
  initialY,
  rotation = 0,
  size = 'md',
  zIndex = 1,
  caption,
  scale = 1,
  opacity = 1,
}: FloatingVideoProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.muted = isMuted;
    }
  }, [isMuted]);

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsMuted(!isMuted);
  };

  return (
    <FloatingCard
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      zIndex={zIndex}
      caption={caption}
      scale={scale}
      opacity={opacity}
      className="floating-video"
    >
      <motion.div 
        className={`floating-video-inner ${sizeClasses[size]}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="floating-video-frame">
          <video
            ref={videoRef}
            src={video}
            className="floating-video-element"
            autoPlay
            loop
            muted={isMuted}
            playsInline
          />
        </div>

        {/* Gradient overlay */}
        <motion.div 
          className="floating-video-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: isHovered ? 1 : 0 }}
          transition={{ duration: 0.25 }}
        >
          <button 
            className="floating-video-mute"
            onClick={toggleMute}
          >
            {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
        </motion.div>

        {/* Subtle play indicator */}
        <motion.div 
          className="floating-video-indicator"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Play size={10} fill="currentColor" />
        </motion.div>
      </motion.div>
    </FloatingCard>
  );
};

export default FloatingVideo;
