import { useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import FloatingMedia from './social/FloatingMedia';
import FloatingVideo from './social/FloatingVideo';
import FloatingStreak from './social/FloatingStreak';
import FloatingBadge from './social/FloatingBadge';
import SocialIcons from './social/SocialIcons';
import { Sparkles } from 'lucide-react';

// Import images
import bentoDog from '@/assets/bento-dog.jpeg';
import bentoFace from '@/assets/bento-face.jpeg';
import bentoIitm from '@/assets/bento-iitm.jpeg';
import bentoTemple from '@/assets/bento-temple.jpeg';
import bentoFlower from '@/assets/bento-flower.jpeg';
import bentoGuitar from '@/assets/bento-guitar.jpeg';
import bentoCat from '@/assets/bento-cat.jpeg';
import bentoBike from '@/assets/bento-bike.jpeg';
import bentoArchitecture from '@/assets/bento-architecture.jpeg';
import githubContributions from '@/assets/github-contributions.png';
import leetcodeStreak from '@/assets/leetcode-streak.png';

// Import videos
import video1 from '@/assets/videos/highlight-1.mp4';
import video2 from '@/assets/videos/highlight-2.mp4';
import video3 from '@/assets/videos/highlight-3.mp4';
import video4 from '@/assets/videos/highlight-4.mp4';
import video5 from '@/assets/videos/highlight-5.mp4';
import video7 from '@/assets/videos/highlight-7.mp4';

const SocialSection = () => {
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.6,
        ease: [0.16, 1, 0.3, 1],
      },
    },
  };

  return (
    <section ref={sectionRef} id="connect" className="social-universe">
      {/* Deep black background with subtle grid */}
      <div className="social-bg-grid" />
      <div className="social-bg-grain" />
      <div className="social-bg-vignette" />

      <motion.div
        className="social-container"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "visible" : "hidden"}
      >
        <div className="social-canvas">
          
          {/* === CURATED FLOATING OBJECTS - Clean aesthetic === */}
          
          {/* FEATURED - Top center video */}
          <FloatingVideo
            video={video3}
            initialX={0}
            initialY={-400}
            rotation={2}
            size="featured"
            zIndex={6}
            caption="experiments"
            scale={1}
            opacity={1}
          />

          {/* PRIMARY RING - Key content */}
          
          {/* Bike image - Featured position */}
          <FloatingMedia
            image={bentoBike}
            initialX={380}
            initialY={-320}
            rotation={5}
            size="lg"
            zIndex={5}
            caption="ride on"
            scale={0.95}
            opacity={0.95}
          />

          {/* Portrait */}
          <FloatingMedia
            image={bentoFace}
            initialX={-380}
            initialY={-320}
            rotation={-4}
            size="lg"
            zIndex={5}
            caption="self portrait"
            scale={0.95}
            opacity={0.95}
          />

          {/* Right side video */}
          <FloatingVideo
            video={video1}
            initialX={520}
            initialY={0}
            rotation={-3}
            size="lg"
            zIndex={5}
            caption="behind the scenes"
            scale={0.92}
            opacity={0.9}
          />

          {/* Left side video */}
          <FloatingVideo
            video={video2}
            initialX={-520}
            initialY={0}
            rotation={3}
            size="lg"
            zIndex={5}
            scale={0.92}
            opacity={0.9}
          />

          {/* GitHub streak - Right */}
          <FloatingStreak
            image={githubContributions}
            label="GitHub"
            href="https://github.com/Shashwatology"
            initialX={420}
            initialY={280}
            rotation={-2}
            zIndex={6}
          />

          {/* TryHackMe badge - Left */}
          <FloatingBadge
            initialX={-440}
            initialY={260}
            rotation={3}
            zIndex={8}
          />

          {/* SECONDARY RING - Supporting content */}
          
          <FloatingVideo
            video={video4}
            initialX={-280}
            initialY={380}
            rotation={4}
            size="md"
            zIndex={4}
            scale={0.88}
            opacity={0.85}
          />

          <FloatingVideo
            video={video5}
            initialX={280}
            initialY={380}
            rotation={-4}
            size="md"
            zIndex={4}
            scale={0.88}
            opacity={0.85}
          />

          {/* IITM campus */}
          <FloatingMedia
            image={bentoIitm}
            initialX={0}
            initialY={420}
            rotation={1}
            size="md"
            zIndex={4}
            caption="campus life"
            scale={0.85}
            opacity={0.82}
          />

          {/* OUTER ACCENTS - Depth elements */}
          
          <FloatingMedia
            image={bentoDog}
            initialX={-580}
            initialY={-200}
            rotation={-6}
            size="sm"
            zIndex={3}
            caption="good boy"
            scale={0.78}
            opacity={0.7}
          />

          <FloatingMedia
            image={bentoGuitar}
            initialX={580}
            initialY={-200}
            rotation={5}
            size="sm"
            zIndex={3}
            caption="melody maker"
            scale={0.78}
            opacity={0.7}
          />

          <FloatingMedia
            image={bentoTemple}
            initialX={-600}
            initialY={160}
            rotation={-5}
            size="sm"
            zIndex={3}
            caption="sacred spaces"
            scale={0.75}
            opacity={0.65}
          />

          <FloatingMedia
            image={bentoArchitecture}
            initialX={600}
            initialY={160}
            rotation={4}
            size="sm"
            zIndex={3}
            caption="structure"
            scale={0.75}
            opacity={0.65}
          />

          {/* FAR CORNERS - Subtle depth */}
          <FloatingMedia
            image={bentoCat}
            initialX={-640}
            initialY={-380}
            rotation={-7}
            size="xs"
            zIndex={2}
            caption="curious cat"
            scale={0.68}
            opacity={0.5}
          />

          <FloatingMedia
            image={bentoFlower}
            initialX={640}
            initialY={-380}
            rotation={6}
            size="xs"
            zIndex={2}
            scale={0.68}
            opacity={0.5}
          />

          <FloatingVideo
            video={video7}
            initialX={-560}
            initialY={400}
            rotation={5}
            size="sm"
            zIndex={3}
            scale={0.7}
            opacity={0.55}
          />

          {/* LeetCode streak */}
          <FloatingStreak
            image={leetcodeStreak}
            label="LeetCode"
            href="https://leetcode.com/Shashwatology"
            initialX={540}
            initialY={420}
            rotation={-3}
            zIndex={5}
          />

          {/* === CENTRAL HERO CONTENT === */}
          <motion.div 
            className="social-hero"
            variants={itemVariants}
          >
            {/* Main Heading */}
            <motion.div className="social-heading">
              <motion.h2 
                className="social-title"
                initial={{ opacity: 0, y: 30 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.8, delay: 0.3 }}
              >
                <motion.span 
                  className="social-title-script"
                  whileHover={{ scale: 1.05, y: -2 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  Connect me
                </motion.span>
                <motion.span 
                  className="social-title-bold"
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300, damping: 20 }}
                >
                  <motion.span
                    className="social-title-text"
                    whileHover={{ 
                      textShadow: "0 0 40px rgba(255,255,255,0.3), 0 0 80px rgba(255,255,255,0.15)",
                      y: -3
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 25 }}
                  >
                    Virtually
                  </motion.span>
                  <motion.span 
                    className="social-sparkle"
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 4, repeat: Infinity }}
                    whileHover={{ scale: 1.3, rotate: 15 }}
                  >
                    <Sparkles size={20} />
                  </motion.span>
                </motion.span>
              </motion.h2>
              
              {/* Editorial Subtitle */}
              <motion.p 
                className="social-subtitle"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ duration: 0.8, delay: 0.5 }}
                whileHover={{ opacity: 0.7, y: -2 }}
              >
                My digital sketchbook. A space for unfinished thoughts and late-night experiments. 
                Catch the behind-the-scenes of my journey, from early AI prototypes to the music that fuels my workflow.
              </motion.p>
            </motion.div>

            {/* Social Icons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <SocialIcons />
            </motion.div>

            {/* CTA Button */}
            <motion.a
              href="https://www.instagram.com/_shashwatology/"
              target="_blank"
              rel="noopener noreferrer"
              className="social-cta"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.7 }}
              whileHover={{ scale: 1.03, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <span>Let's Connect</span>
            </motion.a>

            {/* Microcopy Hint */}
            <motion.p 
              className="social-hint"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 0.4 } : {}}
              transition={{ duration: 0.8, delay: 1 }}
            >
              Drag objects to explore — nothing is fixed
            </motion.p>
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

export default SocialSection;
