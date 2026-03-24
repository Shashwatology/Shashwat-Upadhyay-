import { motion, useInView, useScroll, useTransform, useSpring } from 'framer-motion';
import { useRef, useState, useEffect } from 'react';
import { ExternalLink, Github } from 'lucide-react';

import imgPrepZenScreen from '@/assets/projects/prepzen-screen.png';
import imgBreatheSyncScreen from '@/assets/projects/breathesync-screen.png';
import imgSamparkScreen from '@/assets/projects/sampark-screen.png';
import imgPrepZenPoster from '@/assets/projects/prepzen-poster.png';
import imgBreatheSyncPoster from '@/assets/projects/breathesync-poster.png';
import imgWardOSPoster from '@/assets/projects/wardos-poster.png';
import imgDigitalTwinPoster2 from '@/assets/projects/digital-twin-poster2.jpg';
import imgPaarijaatLogo from '@/assets/projects/paarijaat-logo.png';

// ----------------------------------------
// 1. Featured Projects Data
// ----------------------------------------
const featuredProjects = [
  {
    title: 'PrepZen',
    description: 'Centralized educational platform providing curated roadmaps, PYQs, and notes for student success.',
    tags: ['Next.js', 'React', 'Tailwind', 'Education'],
    image: imgPrepZenScreen,
    liveUrl: 'https://prepzen.vercel.app/',
    githubUrl: 'https://github.com/Shashwatology/Prepzen'
  },
  {
    title: 'BreatheSync',
    description: 'AI-powered respiratory health ecosystem utilizing voice-based diagnostics for proactive asthma management.',
    tags: ['Healthcare', 'AI', 'IoT', 'Python'],
    image: imgBreatheSyncScreen,
    liveUrl: 'https://breathesync.vercel.app/',
    githubUrl: 'https://github.com/Shashwatology/BreatheSync'
  },
  {
    title: 'Sampark',
    description: 'Privacy-first, identity-based messaging platform eliminating phone numbers through total nodal encryption.',
    tags: ['WebSockets', 'Encryption', 'Privacy', 'React'],
    image: imgSamparkScreen,
    liveUrl: 'https://sarsh.vercel.app/',
    githubUrl: 'https://github.com/Shashwatology/SarSh'
  }
];

// ----------------------------------------
// 2. Extended Cut Data
// ----------------------------------------
const extendedCutProjects = [
  {
    title: 'PrepZen Pitch',
    description: 'A place to SkillUp. Empowering students with practical technical skills for a future-ready world.',
    image: imgPrepZenPoster,
  },
  {
    title: 'BreatheSync Vision',
    description: 'Every breath tells a story, we help you understand it. The original presentation for Asthma tracking.',
    image: imgBreatheSyncPoster,
  },
  {
    title: 'Ward OS',
    description: 'The Hardware Hackathon winner. Solving real-time monitoring for overcrowded hospital wards.',
    image: imgWardOSPoster,
  },
  {
    title: 'Digital Twin',
    description: 'Live Traffic Simulation through Visual Feed Synthesis in Unity for Jaipur City.',
    image: imgDigitalTwinPoster2,
  },
  {
    title: 'Paarijaat Homestay',
    description: 'Ayodhya\'s Premier Homestay. Branding and visual identity for a lush hospitality experience.',
    image: imgPaarijaatLogo,
  }
];

// ----------------------------------------
// Components
// ----------------------------------------

const GlassProjectCard = ({ project, index }: { project: typeof featuredProjects[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-20%' });

  const duration = 0.6;
  const imageDelay = 0.6;
  const textDelayBase = imageDelay + 0.5;

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0.7, scale: 0.95, filter: 'blur(10px)' }}
      animate={isInView ? { opacity: 1, scale: 1, filter: 'blur(0px)' } : { opacity: 0.7, scale: 0.95, filter: 'blur(10px)' }}
      transition={{ duration, ease: "easeOut" }}
      className="group relative flex flex-col rounded-3xl bg-white/[0.02] border border-white/5 overflow-hidden backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_40px_-5px_rgba(0,0,0,0.8)] z-10"
    >
      <div className="absolute inset-0 bg-gradient-to-b from-white/[0.04] to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 mix-blend-overlay pointer-events-none" />

      <div className="relative aspect-[16/10] w-full overflow-hidden bg-[#050505]">
        <div className="absolute inset-0 bg-[#050505] z-0" />
        <motion.img 
          src={project.image} 
          alt={project.title}
          className="relative z-10 w-full h-full object-cover object-top filter brightness-75 group-hover:brightness-100 transition-all duration-700 ease-out"
          initial={{ opacity: 0, scale: 1, y: 30 }}
          animate={isInView ? { opacity: 1, scale: 1.05, y: 0 } : { opacity: 0, scale: 1, y: 30 }}
          transition={{ duration: 0.8, delay: imageDelay, ease: "easeOut" }}
          style={{ transformOrigin: "center top" }}
        />
        <motion.div 
          className="absolute inset-0 z-20 bg-gradient-to-t from-[#020205] via-[#020205]/60 to-transparent group-hover:via-[#020205]/80 transition-colors duration-500"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5, delay: imageDelay + 0.5 }}
        />
      </div>

      <div className="flex flex-col flex-1 p-6 z-30 relative -mt-16">
        <motion.div 
          className="flex flex-wrap gap-2 mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: textDelayBase }}
        >
          {project.tags.map(tag => (
            <span key={tag} className="px-2.5 py-1 text-[11px] font-semibold tracking-wider uppercase text-white/70 bg-white/10 border border-white/10 rounded-full backdrop-blur-md">
              {tag}
            </span>
          ))}
        </motion.div>

        <motion.h3 
          className="text-2xl font-bold tracking-tight text-white/95 mb-2 group-hover:text-white transition-colors"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: textDelayBase + 0.1 }}
        >
          {project.title}
        </motion.h3>

        <motion.p 
          className="text-white/60 text-sm leading-relaxed mb-6 font-light"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: textDelayBase + 0.2 }}
        >
          {project.description}
        </motion.p>

        <motion.div 
          className="mt-auto flex items-center gap-3 pt-4 border-t border-white/10"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
          transition={{ duration: 0.5, delay: textDelayBase + 0.3 }}
        >
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-white text-black hover:bg-white/90 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(255,255,255,0.3)] transition-all duration-300 rounded-lg text-sm font-semibold group/btn">
            <ExternalLink size={16} /> View Project
          </a>
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="flex flex-1 items-center justify-center gap-2 px-4 py-2.5 bg-transparent border border-white/20 hover:border-white/40 hover:bg-white/5 transition-all duration-300 rounded-lg text-sm font-semibold text-white hover:-translate-y-0.5 hover:shadow-[0_0_15px_rgba(255,255,255,0.05)]">
            <Github size={16} /> Source Code
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
};


const ExtendedCutCard = ({ proj, index, setHoveringCard }: { proj: typeof extendedCutProjects[0]; index: number; setHoveringCard: (v: boolean) => void }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(cardRef, { once: true, margin: '-50px' });

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 40, scale: 0.96 }}
      animate={isInView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.96 }}
      transition={{ duration: 0.7, delay: index * 0.15, ease: 'easeOut' }}
      className="flex flex-col relative transition-all duration-500 will-change-transform z-10 cursor-pointer group/card blur-[2px] opacity-60 hover:!blur-none hover:!opacity-100 hover:z-20 hover:-translate-y-2"
      onMouseEnter={() => setHoveringCard(true)}
      onMouseLeave={() => setHoveringCard(false)}
    >
      {/* Image Container */}
      <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden mb-4 shadow-lg group-hover/card:shadow-[0_20px_40px_rgba(0,0,0,0.5)] transition-shadow duration-500 bg-[#050505]">
        <motion.img 
           src={proj.image} 
           alt={proj.title}
           className="w-full h-full object-cover group-hover/card:scale-110 transition-transform duration-[0.8s] ease-out will-change-transform"
           initial={{ scale: 1, opacity: 0 }}
           animate={isInView ? { scale: 1.05, opacity: 1 } : { scale: 1, opacity: 0 }}
           transition={{ duration: 0.8, ease: 'easeOut' }}
           style={{ transformOrigin: "center center" }}
        />
        
        {/* Step 2: Overlay */}
        <motion.div 
           className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none mix-blend-multiply opacity-0 group-hover/card:opacity-100 transition-opacity duration-500"
        />
      </div>

      {/* Step 3: Text Reveal */}
      <div className="px-1">
         <motion.h4 
            className="text-white font-bold text-[16px] mb-1.5"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.3 }}
         >
            {proj.title}
         </motion.h4>
         <motion.p 
            className="text-white/50 text-[13px] leading-relaxed font-light"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.45 }}
         >
            {proj.description}
         </motion.p>
      </div>
    </motion.div>
  );
};


// ----------------------------------------
// Main Component
// ----------------------------------------
const ProjectCaseStudy = () => {
  const containerRef = useRef<HTMLElement>(null);
  
  const { scrollYProgress } = useScroll({ target: containerRef, offset: ["start end", "end start"] });
  const blob1Y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);
  const blob2Y = useTransform(scrollYProgress, [0, 1], ["0%", "-50%"]);

  // Orange Cursor GLOW logic
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });
  const [isHoveringCard, setIsHoveringCard] = useState(false);

  useEffect(() => {
    const updateMousePosition = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => window.removeEventListener('mousemove', updateMousePosition);
  }, []);

  const cursorX = useSpring(-1000, { stiffness: 150, damping: 25, mass: 0.5 });
  const cursorY = useSpring(-1000, { stiffness: 150, damping: 25, mass: 0.5 });

  useEffect(() => {
    cursorX.set(mousePos.x);
    cursorY.set(mousePos.y);
  }, [mousePos, cursorX, cursorY]);

  return (
    <section 
      id="projects" 
      ref={containerRef}
      className="relative w-full overflow-hidden bg-[#020205]"
    >
      {/* GLOBAL FIXED AMBIENT LIGHTING LAYER (ORANGE CURSOR) */}
      <motion.div 
        className="fixed top-0 left-0 w-[300px] h-[300px] rounded-full pointer-events-none z-[5]"
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
          background: "radial-gradient(circle, rgba(255,140,0,0.25) 0%, transparent 70%)",
          filter: "blur(40px)",
        }}
        animate={{
          opacity: isHoveringCard ? 0.9 : 0.5,
          scale: isHoveringCard ? 1.2 : 0.9
        }}
        transition={{ duration: 0.4, ease: "easeOut" }}
      />

      {/* Background Globs */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none mix-blend-screen z-0">
        <motion.div style={{ y: blob1Y }} className="absolute top-[10%] left-[-10%] w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px]" />
        <motion.div style={{ y: blob2Y }} className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-purple-600/10 rounded-full blur-[100px]" />
        <motion.div style={{ y: blob1Y }} className="absolute bottom-[-10%] left-[20%] w-[900px] h-[900px] bg-teal-600/10 rounded-full blur-[150px]" />
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      </div>

      <div className="max-w-7xl mx-auto px-6 lg:px-12 w-full relative z-10 pt-32 pb-16">
        
        {/* TOP SECTION: Featured Projects (Cinematic Glassmorphism) */}
        <div className="max-w-7xl mx-auto mb-20 space-y-4">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="flex items-center gap-3"
          >
            <div className="h-px w-8 bg-[#00ffff]" />
            <span className="text-[#00ffff] font-mono text-sm uppercase tracking-widest">Select Works</span>
          </motion.div>
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-2"
          >
            Featured Projects
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/50 font-light max-w-xl text-lg"
          >
            A selection of architectural designs blending intense speed, complex backend encryption, and beautiful frontends.
          </motion.p>
        </div>

        {/* Premium Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-32">
          {featuredProjects.map((project, index) => (
            <GlassProjectCard key={project.title} project={project} index={index} />
          ))}
        </div>

        {/* EXTENDED CUT SECTION */}
        <div className="py-24 relative mb-16 z-20">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <h3 className="text-blue-500 font-medium text-xl tracking-wide">The Extended Cut</h3>
            <p className="text-white/80 text-sm md:text-base leading-relaxed">
              Experiments, explorations, and early wins. A collection of work showcasing my range from mobile apps and e-commerce systems to pure visual storytelling.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
            {extendedCutProjects.map((proj, idx) => (
              <ExtendedCutCard 
                key={proj.title} 
                proj={proj} 
                index={idx} 
                setHoveringCard={setIsHoveringCard} 
              />
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

export default ProjectCaseStudy;
