import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, Target, Sparkles, Lock, ExternalLink } from 'lucide-react';
import DecryptText from './effects/DecryptText';

interface HiddenChapterProps {
  isOpen: boolean;
  onClose: () => void;
}

const HiddenChapter = ({ isOpen, onClose }: HiddenChapterProps) => {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setPhase(0);
      const t1 = setTimeout(() => setPhase(1), 1000);
      const t2 = setTimeout(() => setPhase(2), 2500);
      const t3 = setTimeout(() => setPhase(3), 4000);
      return () => {
        clearTimeout(t1);
        clearTimeout(t2);
        clearTimeout(t3);
      };
    }
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="hidden-chapter-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Cinematic bars */}
          <motion.div 
            className="cinematic-bar top"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />
          <motion.div 
            className="cinematic-bar bottom"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          />

          <motion.div
            className="hidden-chapter-content"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {/* Close button */}
            <button className="chapter-close" onClick={onClose}>
              <X size={24} />
            </button>

            {/* Phase 0: Unlocking */}
            <AnimatePresence mode="wait">
              {phase === 0 && (
                <motion.div 
                  className="unlock-animation"
                  key="unlock"
                  exit={{ opacity: 0, scale: 0.8 }}
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, ease: 'linear' }}
                  >
                    <Lock size={48} className="text-cyan-400" />
                  </motion.div>
                  <p>ACCESSING HIDDEN CHAPTER...</p>
                </motion.div>
              )}

              {/* Phase 1: Title reveal */}
              {phase >= 1 && (
                <motion.div
                  key="content"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="chapter-main"
                >
                  <motion.div 
                    className="chapter-badge"
                    initial={{ y: -20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <Sparkles size={14} />
                    <span>UNLOCKED: SECRET CHAPTER</span>
                  </motion.div>

                  <motion.h1 
                    className="chapter-title"
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <DecryptText text="The Road Ahead" speed={40} />
                  </motion.h1>

                  {phase >= 2 && (
                    <motion.div 
                      className="chapter-sections"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      {/* Achievement */}
                      <div className="chapter-card achievement">
                        <div className="card-icon">
                          <Award size={32} className="text-amber-400" />
                        </div>
                        <div className="card-content">
                          <h3>🏆 Best Paper Award</h3>
                          <p>
                            <DecryptText 
                              text="Won the prestigious Best Paper Award at an international conference for groundbreaking research in AI-driven healthcare analytics. Published in a Scopus-indexed journal at age 19."
                              delay={300}
                              speed={10}
                            />
                          </p>
                          <div className="achievement-stats">
                            <span>📄 Scopus Indexed</span>
                            <span>🎓 Age 19</span>
                            <span>🌍 International</span>
                          </div>
                        </div>
                      </div>

                      {/* Goals */}
                      {phase >= 3 && (
                        <motion.div 
                          className="chapter-card goals"
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                        >
                          <div className="card-icon">
                            <Target size={32} className="text-cyan-400" />
                          </div>
                          <div className="card-content">
                            <h3>🎯 Research Goals</h3>
                            <ul className="goals-list">
                              <li>
                                <span className="goal-conference">CVPR 2026</span>
                                <span className="goal-desc">Computer Vision research on medical imaging</span>
                              </li>
                              <li>
                                <span className="goal-conference">NeurIPS 2026</span>
                                <span className="goal-desc">Novel architecture for multimodal learning</span>
                              </li>
                              <li>
                                <span className="goal-conference">ICLR 2027</span>
                                <span className="goal-desc">Representation learning for healthcare</span>
                              </li>
                            </ul>
                            <p className="goals-quote">
                              "The goal isn't just to publish — it's to push the boundaries of what AI can do for humanity."
                            </p>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}

                  {phase >= 3 && (
                    <motion.div 
                      className="chapter-footer"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                    >
                      <p>You've discovered the hidden chapter. Thank you for exploring.</p>
                      <a 
                        href="https://linkedin.com/in/shashwatupadhyay" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="chapter-cta"
                      >
                        <span>Let's Connect</span>
                        <ExternalLink size={16} />
                      </a>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default HiddenChapter;
