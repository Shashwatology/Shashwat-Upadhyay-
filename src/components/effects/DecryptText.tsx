import { useEffect, useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';

interface DecryptTextProps {
  text: string;
  className?: string;
  delay?: number;
  speed?: number;
}

const CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&*<>[]{}';

const DecryptText = ({ text, className = '', delay = 0, speed = 30 }: DecryptTextProps) => {
  const [displayText, setDisplayText] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  useEffect(() => {
    if (!isInView) return;
    
    const timeout = setTimeout(() => {
      setIsDecrypting(true);
      
      let iteration = 0;
      const targetText = text;
      
      const interval = setInterval(() => {
        setDisplayText(
          targetText
            .split('')
            .map((char, index) => {
              if (char === ' ') return ' ';
              if (index < iteration) return char;
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join('')
        );
        
        iteration += 1 / 3;
        
        if (iteration >= targetText.length) {
          clearInterval(interval);
          setDisplayText(targetText);
          setIsDecrypting(false);
        }
      }, speed);
      
      return () => clearInterval(interval);
    }, delay);
    
    return () => clearTimeout(timeout);
  }, [isInView, text, delay, speed]);

  return (
    <motion.span 
      ref={ref}
      className={`decrypt-text ${isDecrypting ? 'decrypting' : ''} ${className}`}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
    >
      {displayText || text.split('').map(() => CHARS[Math.floor(Math.random() * CHARS.length)]).join('')}
    </motion.span>
  );
};

export default DecryptText;
