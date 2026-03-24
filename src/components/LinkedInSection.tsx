import { motion } from 'framer-motion';
import { Linkedin, ExternalLink, Briefcase, Award, FileText } from 'lucide-react';

interface LinkedInPost {
  id: string;
  contextTag: string;
  title: string;
  excerpt: string;
  highlights: string[];
  url: string;
  icon: React.ReactNode;
}

const posts: LinkedInPost[] = [
  {
    id: 'best-paper',
    contextTag: 'Research Publication',
    title: 'At 19, My First Research Paper Won Best Paper',
    excerpt: 'Publishing research is one thing — having it recognized with a Best Paper Award at an international conference is another. This Scopus-indexed publication on AI-driven healthcare analytics represents months of rigorous methodology and learning to think like a researcher.',
    highlights: [
      'Scopus-indexed',
      'Best Paper Award',
      'Healthcare AI'
    ],
    url: 'https://www.linkedin.com/posts/shashwatupadhyay_scopus-research-innovation-activity-7390887400320864256-dCkg?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADVkb74BnuCBSGwL3nTh_KkTr-yD7Pya6aA',
    icon: <Award className="w-4 h-4" />
  },
  {
    id: 'research-journey',
    contextTag: 'Summer Research',
    title: 'From End-Sems to Digital Twins: A Summer of Research',
    excerpt: 'This summer marked a turning point — transitioning from exams straight into ISRO and MoHUA-funded research at IIT ISM Dhanbad. Working on Digital Twin technology for urban infrastructure taught me what it means to build systems that matter.',
    highlights: [
      'ISRO-funded',
      'Digital Twin',
      'Smart Cities'
    ],
    url: 'https://www.linkedin.com/posts/shashwatupadhyay_digitaltwin-urbanmobility-smartcities-activity-7355525141906210816-cNqW?utm_source=social_share_send&utm_medium=member_desktop_web&rcm=ACoAADVkb74BnuCBSGwL3nTh_KkTr-yD7Pya6aA',
    icon: <Briefcase className="w-4 h-4" />
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.1, 0.25, 1]
    }
  }
};

const PostCard = ({ post }: { post: LinkedInPost }) => {
  return (
    <motion.article
      variants={itemVariants}
      className="linkedin-post-card group"
    >
      {/* Reading progress accent */}
      <div className="post-progress-accent" />
      
      {/* Context tag */}
      <div className="post-context">
        {post.icon}
        <span>{post.contextTag}</span>
      </div>
      
      {/* Title */}
      <h3 className="post-title">{post.title}</h3>
      
      {/* Excerpt */}
      <p className="post-excerpt">{post.excerpt}</p>
      
      {/* Highlights as chips */}
      <div className="post-chips">
        {post.highlights.map((highlight, i) => (
          <span key={i} className="post-chip">{highlight}</span>
        ))}
      </div>
      
      {/* CTA */}
      <a 
        href={post.url}
        target="_blank"
        rel="noopener noreferrer"
        className="post-cta"
      >
        <span>Read full post on LinkedIn</span>
        <div className="cta-icons">
          <Linkedin className="w-4 h-4 linkedin-icon" />
          <ExternalLink className="w-3.5 h-3.5" />
        </div>
      </a>
    </motion.article>
  );
};

const LinkedInSection = () => {
  return (
    <section id="writing" className="linkedin-section" aria-label="Featured Writing & Reflections by Shashwat Upadhyay">
      {/* Background elements */}
      <div className="linkedin-bg-grid" />
      <div className="linkedin-bg-grain" />
      <div className="linkedin-bg-vignette" />
      
      <div className="linkedin-container">
        {/* Section Header with Resume CTA */}
        <motion.header
          className="linkedin-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          <div className="linkedin-header-row">
            <div>
              <h2 className="linkedin-title">Featured Writing & Reflections</h2>
              <p className="linkedin-subtitle">
                Moments where learning, research, and real-world execution came together — shared as they happened.
              </p>
            </div>
            <a 
              href="/Shashwat-Upadhyay-Resume.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="resume-cta"
              aria-label="View Shashwat Upadhyay's Resume"
            >
              <FileText className="w-4 h-4" />
              <span>View Resume</span>
            </a>
          </div>
        </motion.header>
        
        {/* Posts Grid - 2 columns on desktop */}
        <motion.div
          className="linkedin-posts-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {posts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default LinkedInSection;
