import { useState } from 'react';
import { motion } from 'framer-motion';
import FloatingCard from './FloatingCard';

interface FloatingMediaProps {
  image: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  zIndex?: number;
  caption?: string;
  scale?: number;
  opacity?: number;
}

const sizeClasses = {
  xs: 'w-[70px] h-[90px]',
  sm: 'w-[100px] h-[130px]',
  md: 'w-[140px] h-[180px]',
  lg: 'w-[180px] h-[230px]',
  xl: 'w-[220px] h-[280px]',
};

const FloatingMedia = ({
  image,
  initialX,
  initialY,
  rotation = 0,
  size = 'md',
  zIndex = 1,
  caption,
  scale = 1,
  opacity = 1,
}: FloatingMediaProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <FloatingCard
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      zIndex={zIndex}
      caption={caption}
      scale={scale}
      opacity={opacity}
      className="floating-media"
    >
      <motion.div 
        className={`floating-media-inner ${sizeClasses[size]}`}
        whileHover={{ scale: 1.02 }}
        transition={{ duration: 0.3 }}
      >
        <div className="floating-media-frame">
          <motion.img
            src={image}
            alt=""
            className="floating-media-image"
            onLoad={() => setImageLoaded(true)}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ 
              opacity: imageLoaded ? 1 : 0, 
              scale: imageLoaded ? 1 : 1.1 
            }}
            whileHover={{ scale: 1.08 }}
            transition={{ duration: 0.5 }}
          />
        </div>
        
        {/* Subtle gradient overlay */}
        <div className="floating-media-overlay" />
      </motion.div>
    </FloatingCard>
  );
};

export default FloatingMedia;
