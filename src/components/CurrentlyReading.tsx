import { motion } from 'framer-motion';
import { BookOpen, FileText, ExternalLink, Clock, Bookmark, TrendingUp } from 'lucide-react';

interface ReadingItem {
  id: string;
  type: 'paper' | 'book';
  title: string;
  authors?: string;
  source?: string;
  year?: string;
  progress: number;
  status: 'reading' | 'queued' | 'completed';
  link?: string;
  notes?: string;
}

const READING_LIST: ReadingItem[] = [
  {
    id: '1',
    type: 'paper',
    title: 'Attention Is All You Need',
    authors: 'Vaswani et al.',
    source: 'NeurIPS 2017',
    year: '2017',
    progress: 85,
    status: 'reading',
    link: 'https://arxiv.org/abs/1706.03762',
    notes: 'Revisiting transformer architecture fundamentals',
  },
  {
    id: '2',
    type: 'paper',
    title: 'CLIP: Learning Transferable Visual Models From Natural Language Supervision',
    authors: 'Radford et al.',
    source: 'OpenAI',
    year: '2021',
    progress: 60,
    status: 'reading',
    link: 'https://arxiv.org/abs/2103.00020',
  },
  {
    id: '3',
    type: 'book',
    title: 'Deep Learning',
    authors: 'Goodfellow, Bengio, Courville',
    source: 'MIT Press',
    year: '2016',
    progress: 45,
    status: 'reading',
  },
  {
    id: '4',
    type: 'paper',
    title: 'Denoising Diffusion Probabilistic Models',
    authors: 'Ho et al.',
    source: 'NeurIPS 2020',
    year: '2020',
    progress: 0,
    status: 'queued',
    link: 'https://arxiv.org/abs/2006.11239',
  },
  {
    id: '5',
    type: 'paper',
    title: 'Vision Transformers Need Registers',
    authors: 'Darcet et al.',
    source: 'ICLR 2024',
    year: '2024',
    progress: 100,
    status: 'completed',
    link: 'https://arxiv.org/abs/2309.16588',
  },
];

const ReadingCard = ({ item, index }: { item: ReadingItem; index: number }) => {
  const statusConfig = {
    reading: { label: 'READING', color: 'reading-active' },
    queued: { label: 'QUEUED', color: 'reading-queued' },
    completed: { label: 'COMPLETED', color: 'reading-completed' },
  };

  return (
    <motion.article
      className="reading-card"
      initial={{ opacity: 0, x: -30 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
      whileHover={{ x: 4 }}
    >
      {/* Type icon */}
      <div className="reading-icon">
        {item.type === 'paper' ? <FileText size={18} /> : <BookOpen size={18} />}
      </div>

      {/* Content */}
      <div className="reading-content">
        <div className="reading-header">
          <span className={`reading-status ${statusConfig[item.status].color}`}>
            {item.status === 'reading' && <span className="status-pulse" />}
            {statusConfig[item.status].label}
          </span>
          {item.year && <span className="reading-year">{item.year}</span>}
        </div>

        <h4 className="reading-title">{item.title}</h4>

        {item.authors && (
          <p className="reading-authors">{item.authors}</p>
        )}

        {item.source && (
          <p className="reading-source">{item.source}</p>
        )}

        {item.notes && (
          <p className="reading-notes">
            <Bookmark size={12} />
            {item.notes}
          </p>
        )}

        {/* Progress bar */}
        {item.status !== 'queued' && (
          <div className="reading-progress-container">
            <div className="reading-progress-bar">
              <motion.div
                className="reading-progress-fill"
                initial={{ width: 0 }}
                whileInView={{ width: `${item.progress}%` }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8, ease: 'easeOut' }}
              />
            </div>
            <span className="reading-progress-text">{item.progress}%</span>
          </div>
        )}
      </div>

      {/* External link */}
      {item.link && (
        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="reading-link"
          aria-label={`Read ${item.title}`}
        >
          <ExternalLink size={14} />
        </a>
      )}
    </motion.article>
  );
};

const CurrentlyReading = () => {
  const activeCount = READING_LIST.filter(i => i.status === 'reading').length;
  const completedCount = READING_LIST.filter(i => i.status === 'completed').length;

  return (
    <section className="reading-section">
      <div className="reading-container">
        {/* Header */}
        <motion.div
          className="reading-section-header"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="reading-title-row">
            <span className="reading-tag">
              <Clock size={12} />
              RESEARCH LOG
            </span>
            <div className="reading-stats">
              <span className="stat-active">
                <TrendingUp size={12} />
                {activeCount} Active
              </span>
              <span className="stat-completed">
                {completedCount} Completed
              </span>
            </div>
          </div>
          
          <h3 className="reading-section-title">Currently Reading</h3>
          
          <p className="reading-section-subtitle">
            Papers and books shaping my current research direction
          </p>
        </motion.div>

        {/* Reading list */}
        <div className="reading-list">
          {READING_LIST.map((item, index) => (
            <ReadingCard key={item.id} item={item} index={index} />
          ))}
        </div>

        {/* Footer hint */}
        <motion.p
          className="reading-footer-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          Updated weekly • Following CVPR, NeurIPS, ICLR proceedings
        </motion.p>
      </div>
    </section>
  );
};

export default CurrentlyReading;