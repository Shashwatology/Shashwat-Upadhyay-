import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Lock, ExternalLink, Eye, X } from 'lucide-react';
import DecryptText from './effects/DecryptText';

interface ClassifiedFile {
  id: string;
  codename: string;
  title: string;
  classification: 'TOP SECRET' | 'CLASSIFIED' | 'CONFIDENTIAL';
  date: string;
  description: string;
  tech: string[];
  status: 'ACTIVE' | 'COMPLETED' | 'ONGOING';
  link?: string;
}

const FILES: ClassifiedFile[] = [
  {
    id: 'isro-dt',
    codename: 'OPERATION GEMINI',
    title: 'Digital Twin Research',
    classification: 'TOP SECRET',
    date: '2024-PRESENT',
    description: 'ISRO-funded research developing AI-powered digital twins for smart building infrastructure. Implementing real-time IoT sensor fusion with predictive maintenance algorithms.',
    tech: ['IoT', 'MQTT', 'Computer Vision', 'Digital Twin', 'Python'],
    status: 'ONGOING',
  },
  {
    id: 'curasync',
    codename: 'PROJECT HELIX',
    title: 'CuraSync',
    classification: 'CLASSIFIED',
    date: '2024',
    description: 'Healthcare analytics platform leveraging ML for patient data synchronization and predictive diagnostics. Achieved 94% accuracy in early disease detection models.',
    tech: ['TensorFlow', 'NLP', 'Healthcare AI', 'React', 'PostgreSQL'],
    status: 'COMPLETED',
  },
  {
    id: 'wardos',
    codename: 'SENTINEL',
    title: 'WardOS',
    classification: 'CLASSIFIED',
    date: '2024',
    description: 'AI-powered hospital ward management system. Real-time patient monitoring, staff allocation optimization, and emergency response automation.',
    tech: ['PyTorch', 'YOLO', 'Edge Computing', 'IoT', 'React'],
    status: 'ACTIVE',
  },
  {
    id: 'prepzen',
    codename: 'COGNITION',
    title: 'PrepZen',
    classification: 'CONFIDENTIAL',
    date: '2023-2024',
    description: 'Adaptive AI learning platform using personalized study paths. Implements spaced repetition and cognitive load optimization for exam preparation.',
    tech: ['LLMs', 'NLP', 'Transformers', 'Next.js', 'MongoDB'],
    status: 'ACTIVE',
  },
  {
    id: 'research',
    codename: 'PROMETHEUS',
    title: 'Best Paper Award Research',
    classification: 'TOP SECRET',
    date: '2024',
    description: 'Scopus-indexed research paper on AI-driven healthcare analytics. Won BEST PAPER AWARD at international conference. Published at age 19.',
    tech: ['Research', 'ML', 'Healthcare AI', 'Data Analysis', 'Python'],
    status: 'COMPLETED',
  },
  {
    id: 'cybersec',
    codename: 'PHANTOM',
    title: 'Cybersecurity Portfolio',
    classification: 'CONFIDENTIAL',
    date: '2024',
    description: 'Active penetration testing and ethical hacking projects. TryHackMe warrior with focus on network security and cryptographic implementations.',
    tech: ['Pentesting', 'Network Security', 'Cryptography', 'Python', 'Linux'],
    status: 'ONGOING',
  },
];

const ClassifiedCard = ({ file, index, onOpen }: { 
  file: ClassifiedFile; 
  index: number;
  onOpen: (file: ClassifiedFile) => void;
}) => {
  const [isGlitching, setIsGlitching] = useState(false);

  const handleHover = () => {
    setIsGlitching(true);
    setTimeout(() => setIsGlitching(false), 300);
  };

  const classificationColor = {
    'TOP SECRET': 'text-red-500 border-red-500/30 bg-red-500/10',
    'CLASSIFIED': 'text-amber-500 border-amber-500/30 bg-amber-500/10',
    'CONFIDENTIAL': 'text-cyan-500 border-cyan-500/30 bg-cyan-500/10',
  };

  return (
    <motion.div
      className={`classified-card ${isGlitching ? 'glitching' : ''}`}
      initial={{ opacity: 0, y: 40, rotateX: -10 }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      onMouseEnter={handleHover}
      onClick={() => onOpen(file)}
    >
      {/* Folder tab */}
      <div className="folder-tab">
        <FileText size={14} />
        <span>{file.codename}</span>
      </div>
      
      {/* Classification stamp */}
      <div className={`classification-stamp ${classificationColor[file.classification]}`}>
        <Lock size={10} />
        <span>{file.classification}</span>
      </div>
      
      {/* Content */}
      <div className="folder-content">
        <h3 className="folder-title">{file.title}</h3>
        <p className="folder-date">{file.date}</p>
        
        {/* Status indicator */}
        <div className={`status-indicator ${file.status.toLowerCase()}`}>
          <span className="status-dot" />
          <span>{file.status}</span>
        </div>
        
        {/* Tech tags preview */}
        <div className="tech-preview">
          {file.tech.slice(0, 3).map(tech => (
            <span key={tech} className="tech-tag">{tech}</span>
          ))}
          {file.tech.length > 3 && (
            <span className="tech-more">+{file.tech.length - 3}</span>
          )}
        </div>
      </div>
      
      {/* Open indicator */}
      <div className="open-indicator">
        <Eye size={16} />
        <span>ACCESS FILE</span>
      </div>
      
      {/* Glitch overlay */}
      <div className="glitch-overlay" />
    </motion.div>
  );
};

const FileModal = ({ file, onClose }: { file: ClassifiedFile; onClose: () => void }) => {
  return (
    <motion.div 
      className="file-modal-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div 
        className="file-modal"
        initial={{ scale: 0.9, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 50 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Scanlines effect */}
        <div className="modal-scanlines" />
        
        <button className="modal-close" onClick={onClose}>
          <X size={20} />
        </button>
        
        <div className="modal-header">
          <div className="modal-codename">{file.codename}</div>
          <div className={`modal-classification ${file.classification === 'TOP SECRET' ? 'top-secret' : file.classification === 'CLASSIFIED' ? 'classified' : 'confidential'}`}>
            <Lock size={12} />
            {file.classification}
          </div>
        </div>
        
        <h2 className="modal-title">
          <DecryptText text={file.title} speed={20} />
        </h2>
        
        <div className="modal-meta">
          <span className="modal-date">{file.date}</span>
          <span className={`modal-status ${file.status.toLowerCase()}`}>{file.status}</span>
        </div>
        
        <div className="modal-description">
          <DecryptText text={file.description} delay={200} speed={15} />
        </div>
        
        <div className="modal-tech">
          <span className="tech-label">TECHNOLOGIES:</span>
          <div className="tech-list">
            {file.tech.map((tech, i) => (
              <motion.span 
                key={tech}
                className="modal-tech-tag"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5 + i * 0.05 }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </div>
        
        {file.link && (
          <a href={file.link} target="_blank" rel="noopener noreferrer" className="modal-link">
            <ExternalLink size={16} />
            VIEW PROJECT
          </a>
        )}
        
        <div className="modal-footer">
          <span>FILE ID: {file.id.toUpperCase()}</span>
          <span>CLEARANCE: LEVEL 5</span>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ClassifiedFiles = () => {
  const [selectedFile, setSelectedFile] = useState<ClassifiedFile | null>(null);

  return (
    <section id="work" className="classified-section">
      <div className="classified-header">
        <motion.span 
          className="section-tag"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          [ THE ARCHIVE ]
        </motion.span>
        <motion.h2 
          className="section-title-mono"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          Classified Files
        </motion.h2>
        <motion.p 
          className="section-subtitle-mono"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          Authorized personnel only. Click to access project details.
        </motion.p>
      </div>
      
      <div className="classified-grid">
        {FILES.map((file, index) => (
          <ClassifiedCard 
            key={file.id} 
            file={file} 
            index={index}
            onOpen={setSelectedFile}
          />
        ))}
      </div>
      
      <AnimatePresence>
        {selectedFile && (
          <FileModal file={selectedFile} onClose={() => setSelectedFile(null)} />
        )}
      </AnimatePresence>
    </section>
  );
};

export default ClassifiedFiles;
