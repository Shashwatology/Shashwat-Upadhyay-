import { useState } from 'react';
import { motion } from 'framer-motion';
import { Github, Linkedin, Twitter } from 'lucide-react';

const LeetCodeIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M13.5 3.5L4.5 12.5L13.5 21.5" />
    <path d="M20 12H8" />
  </svg>
);

const TryHackMeIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <path d="M12 6v6l4 2" />
  </svg>
);

const MediumIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M13.54 12a6.8 6.8 0 01-6.77 6.82A6.8 6.8 0 010 12a6.8 6.8 0 016.77-6.82A6.8 6.8 0 0113.54 12zM20.96 12c0 3.54-1.51 6.42-3.38 6.42-1.87 0-3.39-2.88-3.39-6.42s1.52-6.42 3.39-6.42 3.38 2.88 3.38 6.42M24 12c0 3.17-.53 5.75-1.19 5.75-.66 0-1.19-2.58-1.19-5.75s.53-5.75 1.19-5.75C23.47 6.25 24 8.83 24 12z"/>
  </svg>
);

const InstagramIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z"/>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/>
  </svg>
);

const socialLinks = [
  { name: 'Instagram', url: 'https://www.instagram.com/_shashwatology/', icon: InstagramIcon, color: '#e4405f' },
  { name: 'GitHub', url: 'https://github.com/Shashwatology', icon: Github, color: '#ffffff' },
  { name: 'LinkedIn', url: 'https://www.linkedin.com/in/shashwat-upadhyay-13abb020b/', icon: Linkedin, color: '#0077b5' },
  { name: 'Twitter', url: 'https://x.com/_Shashwatology', icon: Twitter, color: '#1da1f2' },
  { name: 'Medium', url: 'https://medium.com/@shashwatology.s', icon: MediumIcon, color: '#ffffff' },
  { name: 'LeetCode', url: 'https://leetcode.com/u/shashwatology/', icon: LeetCodeIcon, color: '#ffa116' },
  { name: 'TryHackMe', url: 'https://tryhackme.com/p/shashwatology.s', icon: TryHackMeIcon, color: '#88cc14' },
];

const SocialIcons = () => {
  const [hoveredSocial, setHoveredSocial] = useState<string | null>(null);

  return (
    <div className="social-icons-board">
      {socialLinks.map((social, index) => {
        const Icon = social.icon;
        const isHovered = hoveredSocial === social.name;
        return (
          <motion.a
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="social-icon-item"
            style={{ 
              '--brand-color': social.color,
              color: isHovered ? social.color : undefined,
              borderColor: isHovered ? social.color : undefined,
              boxShadow: isHovered ? `0 0 20px ${social.color}40` : undefined,
            } as React.CSSProperties}
            onMouseEnter={() => setHoveredSocial(social.name)}
            onMouseLeave={() => setHoveredSocial(null)}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.15, y: -4 }}
            whileTap={{ scale: 0.95 }}
          >
            <Icon size={22} />
            <span className={`social-icon-tooltip ${isHovered ? 'visible' : ''}`}>
              {social.name}
            </span>
          </motion.a>
        );
      })}
    </div>
  );
};

export default SocialIcons;
