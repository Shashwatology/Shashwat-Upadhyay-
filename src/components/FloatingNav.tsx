import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import { Home, FolderOpen, Building2, Instagram, FileText, PenTool, Sparkles } from 'lucide-react';

interface NavItem {
  icon: React.ReactNode;
  label: string;
  href: string;
  sectionId: string;
}

const navItems: NavItem[] = [
  { icon: <Home size={20} />, label: 'Home', href: '#hero', sectionId: 'hero' },
  { icon: <Instagram size={20} />, label: 'Social', href: '#connect', sectionId: 'connect' },
  { icon: <FolderOpen size={20} />, label: 'Work', href: '#work', sectionId: 'work' },
  { icon: <Building2 size={20} />, label: 'Experience', href: '#experience', sectionId: 'experience' },
  { icon: <PenTool size={20} />, label: 'Writing', href: '#writing', sectionId: 'writing' },
];

const MagneticNavItem = ({ 
  item, 
  isActive, 
  onClick 
}: { 
  item: NavItem; 
  isActive: boolean; 
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  
  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const deltaX = (e.clientX - centerX) * 0.3;
    const deltaY = (e.clientY - centerY) * 0.3;
    x.set(deltaX);
    y.set(deltaY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={item.href}
      className={`nav-item-magnetic ${isActive ? 'nav-item-active' : ''}`}
      aria-label={item.label}
      onClick={(e) => onClick(e, item.href)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div
        className="nav-item-inner"
        animate={{
          boxShadow: isActive 
            ? '0 0 20px rgba(59, 130, 246, 0.6), 0 0 40px rgba(59, 130, 246, 0.3)' 
            : '0 0 0px rgba(59, 130, 246, 0)'
        }}
      >
        {item.icon}
        {isActive && (
          <motion.div
            className="nav-active-ring"
            layoutId="activeRing"
            initial={false}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          />
        )}
      </motion.div>
      
      {/* Tooltip */}
      <motion.span
        className="nav-tooltip"
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        whileHover={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.2 }}
      >
        {item.label}
      </motion.span>
    </motion.a>
  );
};

const FloatingNav = () => {
  const [activeSection, setActiveSection] = useState('hero');
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const sectionIds = navItems.map(item => item.sectionId);
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      {
        rootMargin: '-20% 0px -60% 0px',
        threshold: 0
      }
    );

    sectionIds.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    
    if (href === '#resume') {
      window.open('/Shashwat-Upadhyay-Resume.pdf', '_blank');
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

  return (
    <motion.nav 
      className="floating-nav-enhanced"
      aria-label="Main navigation"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: 'spring', stiffness: 100, damping: 20, delay: 0.5 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Animated background glow */}
      <motion.div 
        className="nav-glow-bg"
        animate={{
          opacity: isHovered ? 0.8 : 0.4,
          scale: isHovered ? 1.05 : 1,
        }}
        transition={{ duration: 0.3 }}
      />
      
      {/* Logo/Name with pulse effect */}
      <motion.div 
        className="nav-brand-enhanced"
        whileHover={{ scale: 1.05 }}
      >
        <motion.div 
          className="nav-logo-enhanced"
          animate={{ 
            boxShadow: isHovered 
              ? '0 0 20px rgba(59, 130, 246, 0.5), inset 0 0 15px rgba(59, 130, 246, 0.2)' 
              : '0 0 0px rgba(59, 130, 246, 0)'
          }}
        >
          <Sparkles size={18} className="nav-logo-icon" />
        </motion.div>
        <motion.span 
          className="nav-name-enhanced"
          animate={{ opacity: isHovered ? 1 : 0.8 }}
        >
          Shashwat
        </motion.span>
      </motion.div>

      {/* Animated Divider */}
      <motion.div 
        className="nav-divider-enhanced"
        animate={{ 
          height: isHovered ? 28 : 20,
          opacity: isHovered ? 0.6 : 0.3 
        }}
      />

      {/* Nav Items with magnetic effect */}
      <div className="nav-items-enhanced">
        {navItems.map((item, index) => (
          <MagneticNavItem
            key={index}
            item={item}
            isActive={activeSection === item.sectionId}
            onClick={handleNavClick}
          />
        ))}
      </div>

      {/* Resume CTA with sparkle effect */}
      <motion.div className="nav-divider-enhanced" animate={{ height: isHovered ? 28 : 20, opacity: isHovered ? 0.6 : 0.3 }} />
      
      <motion.a
        href="/Shashwat-Upadhyay-Resume.pdf"
        target="_blank"
        rel="noopener noreferrer"
        className="nav-resume-enhanced"
        aria-label="View Resume"
        whileHover={{ scale: 1.05, y: -2 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          className="resume-sparkle"
          animate={{ 
            rotate: [0, 360],
          }}
          transition={{ 
            duration: 8, 
            repeat: Infinity, 
            ease: 'linear' 
          }}
        >
          <Sparkles size={14} />
        </motion.div>
        <FileText size={16} />
        <span>Resume</span>
        
        {/* Shimmer effect */}
        <motion.div
          className="resume-shimmer"
          animate={{
            x: [-100, 200],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: 'easeInOut'
          }}
        />
      </motion.a>
    </motion.nav>
  );
};

export default FloatingNav;
