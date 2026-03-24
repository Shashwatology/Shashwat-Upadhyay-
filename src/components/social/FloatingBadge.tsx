import { motion } from 'framer-motion';
import FloatingCard from './FloatingCard';

interface FloatingBadgeProps {
  initialX: number;
  initialY: number;
  rotation?: number;
  zIndex?: number;
}

const FloatingBadge = ({
  initialX,
  initialY,
  rotation = 0,
  zIndex = 1,
}: FloatingBadgeProps) => {
  const profileUrl = 'https://tryhackme.com/p/Shashwatology';
  const badgeUrl = 'https://tryhackme.com/api/v2/badges/public-profile?userPublicId=4516470';

  const handleClick = () => {
    window.open(profileUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <FloatingCard
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      zIndex={zIndex}
      caption="TryHackMe"
      className="floating-badge"
    >
      <motion.div className="floating-badge-inner" onClick={handleClick} whileHover={{ scale: 1.02 }}>
        <iframe
          src={badgeUrl}
          title="TryHackMe public profile badge"
          className="floating-badge-iframe"
          loading="lazy"
          style={{ border: 'none', pointerEvents: 'none' }}
        />
      </motion.div>
    </FloatingCard>
  );
};

export default FloatingBadge;

