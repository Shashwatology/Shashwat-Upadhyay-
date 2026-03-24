import { motion, useInView } from 'framer-motion';
import { useRef, useState } from 'react';
import { 
  Brain, 
  Code2, 
  Database, 
  Shield, 
  Cpu, 
  Globe,
  Sparkles,
  Zap
} from 'lucide-react';
import FloatingTechIcons from './skills/FloatingTechIcons';

interface Skill {
  name: string;
  level: number;
  icon?: React.ReactNode;
}

interface SkillCategory {
  title: string;
  icon: React.ReactNode;
  color: string;
  skills: Skill[];
}

const skillCategories: SkillCategory[] = [
  {
    title: 'AI & Machine Learning',
    icon: <Brain className="w-5 h-5" />,
    color: 'from-purple-500 to-pink-500',
    skills: [
      { name: 'Deep Learning', level: 90 },
      { name: 'Computer Vision', level: 88 },
      { name: 'NLP & LLMs', level: 85 },
      { name: 'TensorFlow', level: 87 },
      { name: 'PyTorch', level: 85 },
    ]
  },
  {
    title: 'Programming',
    icon: <Code2 className="w-5 h-5" />,
    color: 'from-blue-500 to-cyan-500',
    skills: [
      { name: 'Python', level: 95 },
      { name: 'JavaScript/TypeScript', level: 82 },
      { name: 'React', level: 80 },
      { name: 'SQL', level: 78 },
      { name: 'C/C++', level: 72 },
    ]
  },
  {
    title: 'Data & Cloud',
    icon: <Database className="w-5 h-5" />,
    color: 'from-emerald-500 to-teal-500',
    skills: [
      { name: 'Data Analysis', level: 90 },
      { name: 'Pandas/NumPy', level: 92 },
      { name: 'Data Visualization', level: 85 },
      { name: 'PostgreSQL', level: 78 },
      { name: 'Cloud Platforms', level: 75 },
    ]
  },
  {
    title: 'Cybersecurity',
    icon: <Shield className="w-5 h-5" />,
    color: 'from-red-500 to-orange-500',
    skills: [
      { name: 'Penetration Testing', level: 80 },
      { name: 'Network Security', level: 78 },
      { name: 'Ethical Hacking', level: 82 },
      { name: 'Cryptography', level: 75 },
      { name: 'TryHackMe', level: 85 },
    ]
  },
  {
    title: 'IoT & Embedded',
    icon: <Cpu className="w-5 h-5" />,
    color: 'from-amber-500 to-yellow-500',
    skills: [
      { name: 'Arduino', level: 88 },
      { name: 'Raspberry Pi', level: 85 },
      { name: 'MQTT Protocol', level: 82 },
      { name: 'Sensor Integration', level: 80 },
      { name: 'Edge Computing', level: 75 },
    ]
  },
  {
    title: 'Web & Tools',
    icon: <Globe className="w-5 h-5" />,
    color: 'from-indigo-500 to-violet-500',
    skills: [
      { name: 'Git/GitHub', level: 90 },
      { name: 'REST APIs', level: 85 },
      { name: 'Docker', level: 72 },
      { name: 'Linux', level: 80 },
      { name: 'Figma', level: 70 },
    ]
  }
];

const SkillBar = ({ 
  skill, 
  delay, 
  color,
  activeSkill,
  setActiveSkill
}: { 
  skill: Skill; 
  delay: number; 
  color: string;
  activeSkill: string | null;
  setActiveSkill: (name: string | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-50px' });
  const isActive = activeSkill === skill.name;
  const opacityClass = activeSkill ? (isActive ? 'opacity-100 scale-[1.02]' : 'opacity-30') : 'opacity-100';

  return (
    <div 
      ref={ref} 
      className={`skill-bar-wrapper cursor-pointer transition-all duration-300 ${opacityClass}`}
      onClick={() => setActiveSkill(isActive ? null : skill.name)}
    >
      <div className="skill-bar-header">
        <span className="skill-name">{skill.name}</span>
        <motion.span 
          className="skill-level"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ delay: delay + 0.5, duration: 0.3 }}
        >
          {skill.level}%
        </motion.span>
      </div>
      <div className="skill-bar-track">
        <motion.div
          className={`skill-bar-fill bg-gradient-to-r ${color}`}
          initial={{ width: 0, opacity: 0 }}
          animate={isInView ? { width: `${skill.level}%`, opacity: 1 } : { width: 0, opacity: 0 }}
          transition={{ 
            delay: delay,
            duration: 1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        />
        <motion.div
          className="skill-bar-glow"
          style={{ background: `linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)` }}
          initial={{ x: '-100%' }}
          animate={isInView ? { x: '200%' } : { x: '-100%' }}
          transition={{ 
            delay: delay + 0.8,
            duration: 0.8,
            ease: 'easeOut'
          }}
        />
      </div>
    </div>
  );
};

const SkillCard = ({ 
  category, 
  index,
  activeSkill,
  setActiveSkill
}: { 
  category: SkillCategory; 
  index: number;
  activeSkill: string | null;
  setActiveSkill: (name: string | null) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <motion.div
      ref={ref}
      className={`skill-card transition-all duration-300 ${activeSkill && !category.skills.find(s => s.name === activeSkill) ? 'opacity-40 grayscale-[0.5]' : ''}`}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ 
        delay: index * 0.1,
        duration: 0.5,
        ease: [0.25, 0.1, 0.25, 1]
      }}
    >
      {/* Card glow effect */}
      <div className={`skill-card-glow bg-gradient-to-br ${category.color}`} />
      
      {/* Header */}
      <div className="skill-card-header">
        <div className={`skill-card-icon bg-gradient-to-br ${category.color}`}>
          {category.icon}
        </div>
        <h3 className="skill-card-title">{category.title}</h3>
      </div>

      {/* Skills */}
      <div className="skill-card-content">
        {category.skills.map((skill, skillIndex) => (
          <SkillBar 
            key={skill.name} 
            skill={skill} 
            delay={index * 0.1 + skillIndex * 0.1}
            color={category.color}
            activeSkill={activeSkill}
            setActiveSkill={setActiveSkill}
          />
        ))}
      </div>
    </motion.div>
  );
};

const SkillsSection = () => {
  const [activeSkill, setActiveSkill] = useState<string | null>(null);

  return (
    <section id="skills" className="skills-section" aria-label="Skills & Tech Stack">
      {/* Background elements */}
      <div className="skills-bg-grid" />
      <div className="skills-bg-grain" />
      <div className="skills-bg-glow" />
      
      {/* Floating Tech Icons with Parallax */}
      <FloatingTechIcons />
      
      <div className="skills-container">
        {/* Header */}
        <motion.header
          className="skills-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="skills-header-badge">
            <Sparkles className="w-4 h-4" />
            <span>Tech Arsenal</span>
          </div>
          <h2 className="skills-title">Skills & Expertise</h2>
          <p className="skills-subtitle">
            From machine learning algorithms to cybersecurity protocols — here's what powers my work
          </p>
        </motion.header>

        {/* Stats Row */}
        <motion.div 
          className="skills-stats"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <div className="stat-item">
            <Zap className="w-5 h-5 text-yellow-400" />
            <span className="stat-number">30+</span>
            <span className="stat-label">Technologies</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <Brain className="w-5 h-5 text-purple-400" />
            <span className="stat-number">6</span>
            <span className="stat-label">Core Domains</span>
          </div>
          <div className="stat-divider" />
          <div className="stat-item">
            <Code2 className="w-5 h-5 text-blue-400" />
            <span className="stat-number">3+</span>
            <span className="stat-label">Years Coding</span>
          </div>
        </motion.div>

        {/* Skills Grid */}
        <div className="skills-grid">
          {skillCategories.map((category, index) => (
            <SkillCard key={category.title} category={category} index={index} activeSkill={activeSkill} setActiveSkill={setActiveSkill} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default SkillsSection;
