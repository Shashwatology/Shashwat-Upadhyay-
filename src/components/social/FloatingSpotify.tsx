import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, ExternalLink } from 'lucide-react';
import FloatingCard from './FloatingCard';

interface FloatingSpotifyProps {
  trackId: string;
  trackName: string;
  artist: string;
  initialX: number;
  initialY: number;
  rotation?: number;
  zIndex?: number;
}

const FloatingSpotify = ({
  trackId,
  trackName,
  artist,
  initialX,
  initialY,
  rotation = 0,
  zIndex = 5,
}: FloatingSpotifyProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [iframeSrc, setIframeSrc] = useState<string | null>(null);

  const embedUrlBase = `https://open.spotify.com/embed/track/${trackId}?utm_source=generator&theme=0`;
  const spotifyUrl = `https://open.spotify.com/track/${trackId}`;

  const handlePlayToggle = (e: React.MouseEvent) => {
    e.stopPropagation();

    // User gesture -> safe to request autoplay
    if (!isPlaying) {
      setIsExpanded(true);
      setIsPlaying(true);
      setIframeSrc(`${embedUrlBase}&autoplay=1`);
      return;
    }

    // Stop playback by unmounting the iframe
    setIsPlaying(false);
    setIsExpanded(false);
    setIframeSrc(null);
  };

  const handleOpenSpotify = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(spotifyUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <FloatingCard
      initialX={initialX}
      initialY={initialY}
      rotation={rotation}
      zIndex={zIndex}
      className="floating-spotify"
      caption="a track on repeat"
    >
      <motion.div className="floating-spotify-inner" whileHover={{ scale: 1.02 }}>
        {/* Compact view with info and controls */}
        <div className="floating-spotify-compact">
          {/* Spotify branding */}
          <div className="floating-spotify-brand" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
            </svg>
          </div>

          {/* Track info */}
          <div className="floating-spotify-info">
            <span className="floating-spotify-track">{trackName}</span>
            <span className="floating-spotify-artist">{artist}</span>
          </div>

          {/* Controls */}
          <div className="floating-spotify-controls">
            <motion.button
              className="floating-spotify-external"
              onClick={handleOpenSpotify}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Open in Spotify"
              aria-label="Open track in Spotify"
            >
              <ExternalLink size={12} />
            </motion.button>

            <motion.button
              className={`floating-spotify-play ${isPlaying ? 'active' : ''}`}
              onClick={handlePlayToggle}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label={isPlaying ? 'Stop playback' : 'Play track'}
            >
              {isPlaying ? <Pause size={14} fill="currentColor" /> : <Play size={14} fill="currentColor" />}
            </motion.button>
          </div>

          {/* Visualizer bars when playing */}
          <AnimatePresence>
            {isPlaying && (
              <motion.div
                className="floating-spotify-bars"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {[...Array(4)].map((_, i) => (
                  <motion.span
                    key={i}
                    animate={{ scaleY: [0.3, 1, 0.5, 0.8, 0.3] }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      delay: i * 0.1,
                      ease: 'easeInOut',
                    }}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Expandable Spotify embed - mounted only when playing */}
        <AnimatePresence>
          {isExpanded && iframeSrc && (
            <motion.div
              className="floating-spotify-player"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 80 }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              onPointerDownCapture={(e) => e.stopPropagation()}
              onClickCapture={(e) => e.stopPropagation()}
            >
              <iframe
                src={iframeSrc}
                width="100%"
                height="80"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                title={`${trackName} by ${artist} on Spotify`}
                style={{ borderRadius: '12px' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </FloatingCard>
  );
};

export default FloatingSpotify;

