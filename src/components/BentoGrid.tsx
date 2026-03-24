import { useState } from 'react';
import { MessageCircle, Instagram } from 'lucide-react';
import { motion } from 'framer-motion';

import bentoGuitar from '@/assets/bento-guitar.jpeg';
import bentoCat from '@/assets/bento-cat.jpeg';
import bentoFlower from '@/assets/bento-flower.jpeg';
import bentoBike from '@/assets/bento-bike.jpeg';
import bentoArchitecture from '@/assets/bento-architecture.jpeg';
import bentoDog from '@/assets/bento-dog.jpeg';
import bentoPortrait from '@/assets/shashwat-main.jpeg';
import bentoBus from '@/assets/bento-bus.jpeg';
import bentoIITM from '@/assets/bento-iitm.jpeg';
import bentoTemple from '@/assets/bento-temple.jpeg';

interface BentoItem {
  id: string;
  image: string;
  thought: string;
  rotation: number;
  isBlue?: boolean;
  hasPermanentTag?: boolean;
  tagText?: string;
  instagramLink?: string;
}

const bentoItems: BentoItem[] = [
  { id: 'architecture', image: bentoArchitecture, thought: 'Old walls. New thoughts.', rotation: -8, isBlue: true },
  { id: 'guitar', image: bentoGuitar, thought: 'Music, when words fail.', rotation: -4 },
  { id: 'temple', image: bentoTemple, thought: 'To God be the glory.', rotation: 3, isBlue: true },
  { id: 'bus', image: bentoBus, thought: 'Campus it is.', rotation: -2 },
  { id: 'portrait', image: bentoPortrait, thought: '', rotation: 0, hasPermanentTag: true, tagText: '@_shashwatology', instagramLink: 'https://www.instagram.com/_shashwatology/' },
  { id: 'cat', image: bentoCat, thought: 'As productive as her.', rotation: 2 },
  { id: 'bike', image: bentoBike, thought: "I don't ride to escape life.", rotation: -3, isBlue: true },
  { id: 'dog', image: bentoDog, thought: 'Meet Rio.', rotation: 4 },
  { id: 'iitm', image: bentoIITM, thought: 'The beginning.', rotation: -5 },
  { id: 'flower', image: bentoFlower, thought: 'Trying to see things slower.', rotation: 6, isBlue: true },
];

// Shimmer animation keyframes injected via style tag
const ShimmerStyles = () => (
  <style>{`
    @keyframes shimmer-sweep {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(200%); }
    }
    .bento-shimmer::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(255,255,255,0.08) 40%,
        rgba(255,255,255,0.18) 50%,
        rgba(255,255,255,0.08) 60%,
        transparent 100%
      );
      animation: shimmer-sweep 1.4s ease-in-out infinite;
    }
  `}</style>
);

const BentoGrid = () => {
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Set<string>>(new Set());

  const handlePortraitClick = (link?: string) => {
    if (link) window.open(link, '_blank', 'noopener,noreferrer');
  };

  const markLoaded = (id: string) => {
    setLoadedImages(prev => new Set(prev).add(id));
  };

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.88, rotate: -3, filter: 'blur(14px)' },
    visible: { 
      opacity: 1, y: 0, scale: 1, rotate: 0, filter: 'blur(0px)', 
      transition: { duration: 1.1, ease: [0.22, 1, 0.36, 1] } 
    }
  };

  return (
    <>
      <ShimmerStyles />
      <motion.div
        className="bento-line"
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: '-10%' }}
      >
        {bentoItems.map((item) => {
          const isLoaded = loadedImages.has(item.id);
          return (
            <motion.div
              key={item.id}
              variants={cardVariants}
              className={`bento-card-line ${item.id === 'portrait' ? 'bento-portrait-center' : ''} relative`}
              style={{
                '--rotation': `${item.rotation}deg`,
              } as React.CSSProperties}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => item.instagramLink && handlePortraitClick(item.instagramLink)}
            >
              {/* Shimmer skeleton while loading */}
              {!isLoaded && (
                <div
                  className="bento-shimmer absolute inset-0 rounded-[inherit] overflow-hidden z-10 bg-white/5"
                  style={{ borderRadius: 'inherit' }}
                />
              )}

              {/* Permanent tag for portrait with Instagram icon */}
              {item.hasPermanentTag && (
                <div className="permanent-tag">
                  <Instagram size={12} />
                  <span>{item.tagText}</span>
                </div>
              )}

              {/* Hover bubble for other images */}
              {!item.hasPermanentTag && item.thought && (
                <div className={`hover-bubble ${hoveredId === item.id ? 'visible' : ''} ${item.isBlue ? 'bubble-blue' : ''}`}>
                  <MessageCircle size={12} />
                  <span>{item.thought}</span>
                </div>
              )}

              <motion.img
                src={item.image}
                alt=""
                className="bento-card-image"
                onLoad={() => markLoaded(item.id)}
                initial={{ opacity: 0, scale: 1.08 }}
                animate={isLoaded ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 1.08 }}
                transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
              />
            </motion.div>
          );
        })}
      </motion.div>
    </>
  );
};

export default BentoGrid;
