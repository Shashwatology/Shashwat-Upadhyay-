import { ReactNode, useEffect, useRef, useState } from 'react';
import {
  AnimatePresence,
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  useTransform,
} from 'framer-motion';

interface FloatingCardProps {
  children: ReactNode;
  initialX: number;
  initialY: number;
  rotation?: number;
  scale?: number;
  opacity?: number;
  zIndex?: number;
  className?: string;
  caption?: string;
}

const hoverSpringConfig = { damping: 25, stiffness: 250 };
const magnetSpringConfig = { damping: 30, stiffness: 200, mass: 0.8 };

const clamp = (n: number, min: number, max: number) => Math.min(max, Math.max(min, n));

const FloatingCard = ({
  children,
  initialX,
  initialY,
  rotation = 0,
  scale = 1,
  opacity = 1,
  zIndex = 1,
  className = '',
  caption,
}: FloatingCardProps) => {
  const shouldReduceMotion = useReducedMotion();
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  // Ambient float
  const floatY = useMotionValue(0);
  const floatRotate = useMotionValue(0);
  const floatEnabled = useMotionValue(1);
  const floatEnabledSpring = useSpring(floatEnabled, { damping: 30, stiffness: 240, mass: 0.8 });

  // Magnetic cursor
  const magnetX = useMotionValue(0);
  const magnetY = useMotionValue(0);
  const magnetXS = useSpring(magnetX, magnetSpringConfig);
  const magnetYS = useSpring(magnetY, magnetSpringConfig);

  // Hover effects
  const hoverScale = useSpring(1, hoverSpringConfig);
  const hoverLift = useSpring(0, hoverSpringConfig);

  // Transforms for additive effects only
  const cardScale = useTransform(hoverScale, [1, 1.05], [scale, scale * 1.05]);
  const liftOffset = useTransform(hoverLift, [0, 1], [0, -8]);

  // Combined additive Y offset (float + lift + magnet)
  const additiveY = useTransform(
    [magnetYS, floatY, floatEnabledSpring, liftOffset],
    ([my, fy, fe, lift]: number[]) => my + fy * fe + lift,
  );

  const displayRotate = useTransform(
    [floatRotate, floatEnabledSpring],
    ([fr, fe]: number[]) => rotation + fr * fe,
  );

  useEffect(() => {
    if (shouldReduceMotion) return;

    const yControls = animate(floatY, [0, -8, 0], {
      duration: 4.5 + Math.random() * 2,
      repeat: Infinity,
      ease: 'easeInOut',
    });

    const rControls = animate(floatRotate, [0, 1, -1, 0], {
      duration: 6.5 + Math.random() * 2,
      repeat: Infinity,
      ease: 'easeInOut',
    });

    return () => {
      yControls.stop();
      rControls.stop();
    };
  }, [floatRotate, floatY, shouldReduceMotion]);

  const resetMagnet = () => {
    magnetX.set(0);
    magnetY.set(0);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (shouldReduceMotion || isDragging) return;
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const nx = (e.clientX - centerX) / (rect.width / 2);
    const ny = (e.clientY - centerY) / (rect.height / 2);

    const strength = 10;
    magnetX.set(clamp(nx, -1, 1) * strength);
    magnetY.set(clamp(ny, -1, 1) * strength);
  };

  return (
    <motion.div
      ref={cardRef}
      className={`floating-card-physics ${isDragging ? 'dragging' : ''} ${isHovered ? 'hovered' : ''} ${className}`}
      initial={{ x: initialX, y: initialY }}
      style={{
        translateX: magnetXS,
        translateY: additiveY,
        rotate: displayRotate,
        scale: cardScale,
        opacity: opacity,
        zIndex: isDragging ? 100 : isHovered ? 50 : zIndex,
        cursor: isDragging ? 'grabbing' : 'grab',
      }}
      drag
      dragMomentum={false}
      dragElastic={0.1}
      dragTransition={{ bounceStiffness: 200, bounceDamping: 25 }}
      onDragStart={() => {
        setIsDragging(true);
        resetMagnet();
        floatEnabled.set(0);
      }}
      onDragEnd={() => {
        setIsDragging(false);
        if (!isHovered) floatEnabled.set(1);
      }}
      onMouseEnter={() => {
        setIsHovered(true);
        hoverScale.set(1.05);
        hoverLift.set(1);
        floatEnabled.set(0);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
        hoverScale.set(1);
        hoverLift.set(0);
        resetMagnet();
        if (!isDragging) floatEnabled.set(1);
      }}
      onPointerMove={(e) => {
        if (!isHovered) return;
        handlePointerMove(e);
      }}
    >
      {children}

      {/* Hover Caption */}
      <AnimatePresence>
        {isHovered && caption && (
          <motion.div
            className="floating-card-caption"
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <span>{caption}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default FloatingCard;
