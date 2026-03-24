import { Suspense, lazy, useState } from 'react';
import { motion, useScroll } from 'framer-motion';
import NavbarV2 from '@/components/NavbarV2';
import HeroSection from '@/components/HeroSection';
import SocialSection from '@/components/SocialSection';
import ExperienceSection from '@/components/ExperienceSection';
import LinkedInSection from '@/components/LinkedInSection';
const PremiumAIBot = lazy(() => import('@/components/PremiumAIBot'));
import TerminalFooter from '@/components/TerminalFooter';
import GSAPScrollReveal from '@/components/GSAPScrollReveal';
import FlashlightCursor from '@/components/effects/FlashlightCursor';
import LiveDataTicker from '@/components/LiveDataTicker';
import HiddenChapter from '@/components/HiddenChapter';
import OngoingResearch from '@/components/OngoingResearch';
import ProjectCaseStudy from '@/components/ProjectsShowcase';
import { useKonamiCode } from '@/lib/useKonamiCode';
import { toast } from 'sonner';

const Scene3D = lazy(() => import('@/components/3d/Scene3D'));

const Portfolio = () => {
  const [showHiddenChapter, setShowHiddenChapter] = useState(false);
  const { scrollYProgress } = useScroll();

  useKonamiCode(() => {
    setShowHiddenChapter(true);
    toast.success("🔓 Access Granted: Hidden Chapter Unlocked!", {
      description: "You've discovered the encrypted terminal records."
    });
  });

  return (
    <div className="portfolio-container researcher-theme">
      {/* Reading Progress Bar */}
      <motion.div 
        className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#00ffff] to-[#ff00ff] z-[10001] origin-left"
        style={{ scaleX: scrollYProgress }}
      />
      
      {/* Flashlight Cursor */}
      <FlashlightCursor />

      {/* 3D Background */}
      <Suspense fallback={null}>
        <Scene3D />
      </Suspense>

      <NavbarV2 />
      
      <main>
        <HeroSection />
        
        <GSAPScrollReveal>
          <SocialSection />
        </GSAPScrollReveal>

        <GSAPScrollReveal delay={0.1} direction="up" distance={60}>
          <OngoingResearch />
        </GSAPScrollReveal>

        <ProjectCaseStudy />

        <GSAPScrollReveal delay={0.1}>
          <ExperienceSection />
        </GSAPScrollReveal>
        
        <GSAPScrollReveal delay={0.1}>
          <LinkedInSection />
        </GSAPScrollReveal>

        <TerminalFooter onUnlockSecret={() => setShowHiddenChapter(true)} />
      </main>

      {/* Live Data Ticker */}
      <LiveDataTicker />
      
      {/* Hidden Chapter Modal */}
      <HiddenChapter 
        isOpen={showHiddenChapter} 
        onClose={() => setShowHiddenChapter(false)} 
      />
      
      <Suspense fallback={null}>
        <PremiumAIBot />
      </Suspense>
    </div>
  );
};

export default Portfolio;
