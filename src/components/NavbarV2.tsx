import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, LayoutGroup } from 'framer-motion';
import { Home, FolderOpen, Building2, Instagram, Award, Zap, FileText, Menu, X } from 'lucide-react';
import gsap from 'gsap';

interface NavItem {
  icon?: React.ReactNode;
  label: string;
  href: string;
  sectionId: string;
}

const topNavItems: NavItem[] = [
  { icon: <Home size={18} strokeWidth={2} />, label: 'Home', href: '#hero', sectionId: 'hero' },
  { icon: <FolderOpen size={18} strokeWidth={2} />, label: 'Projects', href: '#projects', sectionId: 'projects' },
  { icon: <Building2 size={18} strokeWidth={2} />, label: 'Experience', href: '#experience', sectionId: 'experience' },
  { icon: <Instagram size={18} strokeWidth={2} />, label: 'Connect', href: '#connect', sectionId: 'connect' },
  { icon: <Award size={18} strokeWidth={2} />, label: 'Research', href: '#research', sectionId: 'research' },
  { icon: <Zap size={18} strokeWidth={2} />, label: 'Skills', href: '#skills', sectionId: 'skills' },
  { icon: <FileText size={18} strokeWidth={2} />, label: 'Resume', href: '#resume', sectionId: 'resume' },
];

const scrolledNavItems = [
  { label: 'Home', href: '#hero', sectionId: 'hero' },
  { label: 'Projects', href: '#projects', sectionId: 'projects' },
  { label: 'Experience', href: '#experience', sectionId: 'experience' },
  { label: 'Connect', href: '#connect', sectionId: 'connect' },
];

const NavIcon = ({ 
  item, 
  isActive, 
  onClick,
  index
}: { 
  item: NavItem; 
  isActive: boolean; 
  onClick: (href: string) => void;
  index: number;
}) => {
  const [showLabel, setShowLabel] = useState(false);
  const iconRef = useRef<HTMLButtonElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const handleClick = () => {
    if (!showLabel) {
      setShowLabel(true);
      setTimeout(() => setShowLabel(false), 2000);
    } else {
      onClick(item.href);
      setShowLabel(false);
    }
  };

  const handleMouseEnter = () => {
    setShowLabel(true);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1.15,
        y: -2,
        duration: 0.3,
        ease: 'back.out(2)'
      });
    }
  };

  const handleMouseLeave = () => {
    setShowLabel(false);
    if (iconRef.current) {
      gsap.to(iconRef.current, {
        scale: 1,
        y: 0,
        duration: 0.4,
        ease: 'elastic.out(1, 0.5)'
      });
    }
  };

  return (
    <div 
      ref={wrapperRef}
      className="relative flex flex-col items-center mx-[2px]"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.button
        ref={iconRef}
        className={`flex items-center justify-center w-10 h-10 rounded-xl transition-colors duration-200 ${isActive ? 'text-white bg-white/10' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
        onClick={handleClick}
        initial={{ opacity: 0, scale: 0.3, x: -40 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        transition={{ delay: 0.8 + 0.08 * index, duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        aria-label={item.label}
        whileTap={{ scale: 0.9 }}
      >
        {item.icon}
      </motion.button>

      {isActive && (
        <motion.div
          className="absolute -bottom-[6px] left-1/2 -translate-x-1/2 w-1 h-1 bg-white rounded-full shadow-[0_0_8px_rgba(255,255,255,0.8)]"
          layoutId="activeNavDotV2"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}

      <AnimatePresence>
        {showLabel && (
          <motion.div 
            className="absolute top-[calc(100%+14px)] left-1/2 -translate-x-1/2 px-3 py-1.5 bg-[#222] text-white text-xs font-semibold tracking-wide rounded-lg whitespace-nowrap shadow-xl border border-white/10 z-50 pointer-events-none"
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
          >
            {item.label}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const NavbarV2 = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const sectionIds = topNavItems.map(item => item.sectionId);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-30% 0px -50% 0px',
        threshold: 0
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const handleNavClick = (href: string) => {
    setIsMobileOpen(false);
    
    if (href === '#resume') {
      handleResumeClick();
      return;
    }
    
    const targetId = href.replace('#', '');
    const targetElement = document.getElementById(targetId);
    
    if (targetElement) {
      targetElement.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  };

  const handleResumeClick = () => {
    window.open('/Shashwat-Upadhyay-Resume.pdf', '_blank');
  };

  const LogoAndName = () => (
    <motion.div 
      className="flex items-center gap-3 cursor-pointer pl-1 pr-2"
      onClick={() => handleNavClick('#hero')}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={`flex items-center justify-center w-[34px] h-[34px] rounded-[10px] font-bold text-[15px] transition-colors duration-300 ${isScrolled ? 'bg-white text-black' : 'bg-transparent border border-white/20 text-white'}`}>
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className={isScrolled ? "text-black" : "text-white"}>
          <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>
      <span className="font-semibold text-[15px] text-white tracking-tight">Shashwat Upadhyay</span>
    </motion.div>
  );

  return (
    <>
      {/* Desktop Navbar */}
      {!isMobile && (
        <div className="fixed top-10 left-0 right-0 z-[1000] flex justify-center pointer-events-none">
          <motion.nav 
            className="pointer-events-auto p-[6px] rounded-[24px] border border-white/[0.04] relative overflow-hidden shadow-2xl"
            style={{
              background: isScrolled ? 'rgba(2, 2, 4, 0.92)' : 'rgba(4, 4, 6, 0.80)',
              backdropFilter: isScrolled ? 'blur(30px)' : 'blur(15px)',
              WebkitBackdropFilter: isScrolled ? 'blur(30px)' : 'blur(15px)',
              boxShadow: isScrolled ? '0 8px 32px rgba(0, 0, 0, 0.8)' : '0 4px 24px rgba(0, 0, 0, 0.5)',
            }}
            layout
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ 
              duration: 0.5, 
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
          >
            {/* Noise Texture layer */}
            <div className={`absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] transition-opacity duration-300 ${isScrolled ? 'opacity-[0.05]' : 'opacity-[0.02]'}`} />
            {/* Subtle Gradient Overlay */}
            <div className={`absolute inset-0 bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none transition-opacity duration-300 ${isScrolled ? 'opacity-100' : 'opacity-0'}`} />
            {/* One-shot entry shimmer sweep across nav */}
            <motion.div
              className="absolute inset-y-0 w-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent pointer-events-none z-[1] skew-x-[-20deg]"
              initial={{ x: '-150%', opacity: 1 }}
              animate={{ x: '300%', opacity: 0 }}
              transition={{ duration: 1.2, ease: 'easeOut', delay: 0.6 }}
            />

          <LayoutGroup>
            <motion.div layout className="flex items-center overflow-hidden" transition={{ duration: 0.4, ease: [0.25, 1, 0.5, 1] }}>
              <LogoAndName />
              
              <motion.div layout className="w-[2px] h-6 bg-white/10 mx-2 rounded-full" />
              
              <AnimatePresence mode="popLayout" initial={false}>
                {!isScrolled ? (
                  // Top State - Icons
                  <motion.div 
                    key="icons"
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center gap-0.5 pr-1"
                  >
                    {topNavItems.map((item, index) => (
                      <NavIcon
                        key={item.href}
                        item={item}
                        isActive={activeSection === item.sectionId}
                        onClick={handleNavClick}
                        index={index}
                      />
                    ))}
                  </motion.div>
                ) : (
                  // Scrolled State - Text Links
                  <motion.div 
                    key="text"
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, filter: 'blur(4px)' }}
                    transition={{ duration: 0.3, ease: 'easeOut' }}
                    className="flex items-center"
                  >
                    <div className="flex items-center gap-6 px-4">
                      {scrolledNavItems.map(item => (
                        <button 
                          key={item.href}
                          onClick={() => handleNavClick(item.href)} 
                          className={`text-[14px] font-medium transition-colors duration-200 ${activeSection === item.sectionId ? 'text-white' : 'text-white/60 hover:text-white'}`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                    
                    <div className="w-[1px] h-4 bg-white/20 mr-4" />
                    
                    <button 
                      onClick={handleResumeClick} 
                      className="bg-white text-black px-5 py-[8px] rounded-full text-[14px] font-semibold hover:bg-white/90 hover:scale-105 active:scale-95 transition-all duration-200 mr-1"
                    >
                      Resume
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </LayoutGroup>
        </motion.nav>
      </div>
      )}

      {/* Mobile Menu Button - Kept similar to before */}
      {isMobile && (
        <motion.button
          className="fixed top-5 right-5 z-[1001] p-3 bg-[#080808] border border-white/10 rounded-xl text-white"
          onClick={() => setIsMobileOpen(!isMobileOpen)}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          whileTap={{ scale: 0.9 }}
        >
          <AnimatePresence mode="wait">
            {isMobileOpen ? (
              <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <X size={22} />
              </motion.div>
            ) : (
              <motion.div key="menu" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.2 }}>
                <Menu size={22} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      )}

      {/* Mobile Menu Content */}
      <AnimatePresence>
        {isMobile && isMobileOpen && (
          <motion.div
            className="fixed top-20 left-5 right-5 z-[1000] p-4 bg-[#080808]/95 backdrop-blur-xl border border-white/10 rounded-2xl flex flex-col gap-1"
            initial={{ opacity: 0, scale: 0.95, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {scrolledNavItems.map((item, index) => (
              <motion.button
                key={item.href}
                className={`flex items-center gap-3 p-3.5 rounded-xl text-sm font-medium transition-colors ${activeSection === item.sectionId ? 'text-white bg-white/5' : 'text-white/60 hover:text-white hover:bg-white/5'}`}
                onClick={() => handleNavClick(item.href)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * index }}
                whileTap={{ scale: 0.98 }}
              >
                {item.label}
              </motion.button>
            ))}
            <motion.button
              onClick={handleResumeClick}
              className="flex items-center justify-center gap-2 mt-2 p-3.5 bg-white/10 text-white font-semibold text-sm border border-white/15 rounded-xl hover:bg-white/15 transition-colors"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              whileTap={{ scale: 0.98 }}
            >
              <FileText size={18} />
              <span>Resume</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default NavbarV2;