import { motion } from 'framer-motion';
import { Briefcase, GraduationCap, MapPin, Calendar, Award, ExternalLink } from 'lucide-react';
import { useState } from 'react';

interface ExperienceItem {
  id: string;
  role: string;
  organization: string;
  location: string;
  duration: string;
  highlights: string[];
  tags?: string[];
  expanded?: boolean;
}

interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  duration: string;
  highlight?: string;
}

const experiences: ExperienceItem[] = [
  {
    id: 'iit-ism',
    role: 'Machine Learning Research Intern',
    organization: 'IIT ISM Dhanbad',
    location: 'Remote',
    duration: 'Nov 2025 – Present',
    highlights: [
      'Spearheading video/image processing pipelines using Object Detection (YOLO) and Segmentation (CNNs) for a high-priority space-tech imaging initiative',
      'Engineered an OCR intelligence layer to parse scientific documents and map extracted data to search use-cases'
    ],
    tags: ['ISRO-funded']
  },
  {
    id: 'worldquant',
    role: 'Research Consultant',
    organization: 'WorldQuant',
    location: 'Remote',
    duration: 'May 2025 – Oct 2025',
    highlights: [
      'Conducted quantitative research and data modeling to identify market signals and alpha generation strategies',
      'Developed predictive algorithms using statistical learning techniques to analyze complex financial datasets'
    ],
    tags: ['Gold Level']
  },
  {
    id: 'mnit',
    role: 'Summer Research Intern',
    organization: 'MNIT Jaipur',
    location: 'Jaipur, India',
    duration: 'May 2024 – July 2024',
    highlights: [
      'Developed a Digital Twin of a transportation corridor using Unity 3D and geospatial layers',
      'Co-authored a strategic proposal for smart mobility interventions submitted to the Government of India'
    ],
    tags: ['AMRUT Centre', 'MoHUA']
  },
  {
    id: 'nitw',
    role: 'Research Scholar',
    organization: 'NIT Warangal',
    location: 'Warangal, India',
    duration: 'Apr 2025 – May 2025',
    highlights: [
      'Selected for the Summer Research Internship Programme (SRIP)',
      'Contributed to data science and machine learning research projects'
    ],
    tags: ['SRIP Selectee']
  }
];

const education: EducationItem[] = [
  {
    id: 'iitm',
    institution: 'Indian Institute of Technology, Madras',
    degree: 'Bachelor of Science — Data Science & Applications',
    duration: 'Sep 2023 – May 2028',
    highlight: 'Focus: ML, Data-driven systems, Research foundations'
  },
  {
    id: 'sakec',
    institution: 'Shah & Anchor Kutchhi Engineering College',
    degree: 'Bachelor of Vocation — Cyber Security',
    duration: 'Aug 2024 – Jul 2028',
    highlight: 'Dual degree pathway with security specialization'
  },
  {
    id: 'rjc',
    institution: 'Ramniranjan Jhunjhunwala College (Autonomous)',
    degree: 'Grade 12, PCMB Science',
    duration: 'Sep 2021 – Jul 2023',
    highlight: 'Grade: A'
  },
  {
    id: 'stjude',
    institution: 'St Jude High School',
    degree: 'Grade 10',
    duration: 'Jun 2008 – Jan 2021',
    highlight: 'Grade: A+ · Performing Arts, Debates, Leadership'
  },
  {
    id: 'ucmas',
    institution: 'Gopal Sharma Blooming Birds',
    degree: 'UCMAS Graduation — Abacus & Mental Arithmetic',
    duration: 'Sep 2015 – Mar 2018',
    highlight: '11th State Level UCMAS Ranker · 8 Levels Completed'
  }
];

import { containerVariants, itemVariants } from '@/lib/animations';

const ExperienceCard = ({ item, index }: { item: ExperienceItem; index: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <motion.div 
      variants={itemVariants}
      className="experience-card group"
      style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
    >
      {/* Timeline node */}
      <div className="timeline-node">
        <div className="node-dot" />
        <div className="node-glow" />
      </div>
      
      {/* Card content */}
      <div 
        className="experience-content"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        {/* Tags */}
        {item.tags && item.tags.length > 0 && (
          <div className="experience-tags">
            {item.tags.map((tag, i) => (
              <span key={i} className="experience-tag">
                <Award className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
        
        {/* Role & Organization */}
        <h3 className="experience-role">{item.role}</h3>
        <p className="experience-org">{item.organization}</p>
        
        {/* Meta info */}
        <div className="experience-meta">
          <span className="meta-item">
            <Calendar className="w-3.5 h-3.5" />
            {item.duration}
          </span>
          <span className="meta-item">
            <MapPin className="w-3.5 h-3.5" />
            {item.location}
          </span>
        </div>
        
        {/* Highlights */}
        <motion.ul 
          className="experience-highlights"
          initial={false}
          animate={{ 
            height: isExpanded ? 'auto' : '0',
            opacity: isExpanded ? 1 : 0 
          }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
          {item.highlights.map((highlight, i) => (
            <li key={i}>{highlight}</li>
          ))}
        </motion.ul>
        
        {/* Expand indicator */}
        <div className="expand-hint">
          <span>{isExpanded ? 'Show less' : 'Show more'}</span>
          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            <ExternalLink className="w-3 h-3" />
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

const EducationCard = ({ item, index }: { item: EducationItem; index: number }) => {
  return (
    <motion.div 
      variants={itemVariants}
      className="education-card"
      style={{ '--delay': `${index * 100}ms` } as React.CSSProperties}
    >
      <div className="education-icon">
        <GraduationCap className="w-5 h-5" />
      </div>
      
      <div className="education-content">
        <h3 className="education-institution">{item.institution}</h3>
        <p className="education-degree">{item.degree}</p>
        
        <div className="education-meta">
          <Calendar className="w-3.5 h-3.5" />
          <span>{item.duration}</span>
        </div>
        
        {item.highlight && (
          <p className="education-highlight">{item.highlight}</p>
        )}
      </div>
    </motion.div>
  );
};

const ExperienceSection = () => {
  return (
    <section id="experience" className="experience-section">
      {/* Background elements */}
      <div className="experience-bg-grid" />
      <div className="experience-bg-grain" />
      <div className="experience-bg-vignette" />
      
      <div className="experience-container">
        {/* Section Header */}
        <motion.header 
          className="experience-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <h2 className="experience-title">Experience & Education</h2>
          <p className="experience-subtitle">
            A timeline of research, responsibility, and rigor — across institutions, labs, and real-world problems.
          </p>
        </motion.header>
        
        {/* Two Column Layout */}
        <div className="experience-grid">
          {/* Left: Experience */}
          <motion.div 
            className="experience-column"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="column-header">
              <Briefcase className="w-5 h-5" />
              <span>Experience</span>
            </div>
            
            <div className="timeline-container">
              <div className="timeline-line" />
              {experiences.map((exp, index) => (
                <ExperienceCard key={exp.id} item={exp} index={index} />
              ))}
            </div>
          </motion.div>
          
          {/* Right: Education */}
          <motion.div 
            className="education-column"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            <div className="column-header">
              <GraduationCap className="w-5 h-5" />
              <span>Education</span>
            </div>
            
            <div className="education-stack">
              {education.map((edu, index) => (
                <EducationCard key={edu.id} item={edu} index={index} />
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default ExperienceSection;
