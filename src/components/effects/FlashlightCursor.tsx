import { useState, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';

const FlashlightCursor = () => {
  const [isHovering, setIsHovering] = useState(false);
  const [revealedCode, setRevealedCode] = useState<string | null>(null);
  
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);
  
  const springConfig = { damping: 25, stiffness: 300 };
  const x = useSpring(cursorX, springConfig);
  const y = useSpring(cursorY, springConfig);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const target = e.target as HTMLElement;
    const magneticEl = target.closest('.magnetic, button, a') as HTMLElement;
    
    if (magneticEl) {
      const rect = magneticEl.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      // Calculate a slight pull towards the mouse from the center
      const pullX = (e.clientX - centerX) * 0.1;
      const pullY = (e.clientY - centerY) * 0.1;
      
      cursorX.set(centerX + pullX);
      cursorY.set(centerY + pullY);
    } else {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
    }
    
    // Check if hovering over a "revealable" element
    const revealable = target.closest('[data-reveal]');
    
    if (revealable) {
      setIsHovering(true);
      setRevealedCode(revealable.getAttribute('data-reveal'));
    } else if (magneticEl) {
      setIsHovering(true);
      setRevealedCode(null);
    } else {
      setIsHovering(false);
      setRevealedCode(null);
    }
  }, [cursorX, cursorY]);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  return (
    <>
      {/* Main flashlight effect */}
      <motion.div
        className="flashlight-cursor"
        style={{ x, y }}
        animate={{
          scale: isHovering ? 1.5 : 1,
          opacity: isHovering ? 0.9 : 0.7,
        }}
        transition={{ duration: 0.2 }}
      />
      
      {/* Revealed code tooltip */}
      {revealedCode && (
        <motion.div
          className="revealed-code"
          style={{ 
            left: x, 
            top: y,
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <code>{revealedCode}</code>
        </motion.div>
      )}
      
      {/* Secondary glow */}
      <motion.div
        className="flashlight-glow"
        style={{ x, y }}
        animate={{
          scale: isHovering ? 2 : 1,
        }}
      />
    </>
  );
};

export default FlashlightCursor;
