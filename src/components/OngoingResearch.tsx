import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Brain, Dna, FileSearch, Mail, ExternalLink, Sparkles } from 'lucide-react';
import DecryptText from './effects/DecryptText';

interface ResearchItem {
  id: string;
  icon: React.ReactNode;
  status: 'ACTIVE' | 'ONGOING' | 'IN PROGRESS';
  title: string;
  shortTitle: string;
  description: string;
}

const ONGOING_RESEARCH: ResearchItem[] = [
  {
    id: 'iomt-privacy',
    icon: <Brain className="w-6 h-6" />,
    status: 'ACTIVE',
    title: 'Privacy-Preserving and Explainable AI for IoMT Wearable Intelligence',
    shortTitle: 'IoMT Wearable Intelligence',
    description: 'Designing secure, privacy-aware AI pipelines for Internet-of-Medical-Things (IoMT) wearables, integrating encrypted data flows, role-based access control, and explainable AI techniques to enable trustworthy remote healthcare decision-making.',
  },
  {
    id: 'latent-watermarking',
    icon: <Dna className="w-6 h-6" />,
    status: 'ONGOING',
    title: 'Latent-Space Watermarking for Diffusion-Resilient Generative Attribution',
    shortTitle: 'Diffusion Watermarking',
    description: 'Developing multi-spectral latent watermarking mechanisms embedded directly within diffusion model representations to ensure robust, imperceptible, and attack-resilient content attribution under aggressive regeneration and fine-tuning.',
  },
  {
    id: 'semantic-visual',
    icon: <FileSearch className="w-6 h-6" />,
    status: 'IN PROGRESS',
    title: 'Semantic Visual Reasoning in Unstructured Documents Without Text Supervision',
    shortTitle: 'Document Visual Reasoning',
    description: 'Investigating document-level semantic localization and retrieval by aligning visual regions with intent-driven queries, enabling semantic search, reasoning, and grounding inside complex documents without relying on OCR or textual annotations.',
  },
];

const ResearchCard = ({ item, index }: { item: ResearchItem; index: number }) => {
  const [isHovered, setIsHovered] = useState(false);

  const statusColors = {
    'ACTIVE': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'ONGOING': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'IN PROGRESS': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  };

  return (
    <motion.article
      className="research-card stagger-item"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.15, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Status Badge */}
      <div className={`research-status ${statusColors[item.status]}`}>
        <Sparkles className="w-3 h-3" />
        <span>{item.status}</span>
      </div>

      {/* Icon */}
      <div className="research-icon">
        {item.icon}
      </div>

      {/* Content */}
      <div className="research-content">
        <h3 className="research-title">
          {isHovered ? (
            <DecryptText text={item.title} speed={15} />
          ) : (
            item.title
          )}
        </h3>
        
        <p className="research-description">
          {item.description}
        </p>
      </div>

      {/* Hover indicator */}
      <motion.div 
        className="research-hover-indicator"
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, x: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
      >
        <ExternalLink className="w-4 h-4" />
        <span>Access File →</span>
      </motion.div>

      {/* Glow effect on hover */}
      <div className="research-glow" />
    </motion.article>
  );
};

const OngoingResearch = () => {
  return (
    <section id="research" className="ongoing-research-section">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <header className="research-header">
          <motion.span
            className="section-tag"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            [ RESEARCH LAB ]
          </motion.span>
          
          <motion.h2
            className="section-title-mono research-main-title"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
          >
            Ongoing Research Work
          </motion.h2>
          
          <motion.p
            className="research-subtitle"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
          >
            Actively exploring secure, explainable, and multimodal AI systems at the intersection of healthcare, generative models, and intelligent document understanding.
          </motion.p>
        </header>

        {/* Research Grid */}
        <div className="research-grid">
          {ONGOING_RESEARCH.map((item, index) => (
            <ResearchCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Collaborate CTA */}
        <motion.div
          className="collaborate-section"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <a
            href="mailto:shashwatiitm@gmail.com?subject=Research Collaboration Inquiry"
            className="collaborate-button"
            aria-label="Send collaboration inquiry email"
          >
            <Mail className="w-5 h-5" />
            <span>Collaborate With Me</span>
            <div className="collaborate-pulse" />
          </a>
          
          <p className="collaborate-hint">
            Open to academic collaboration, research discussions, and joint publications.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default OngoingResearch;