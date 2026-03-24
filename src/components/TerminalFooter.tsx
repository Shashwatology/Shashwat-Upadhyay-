import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, ChevronRight, Github, Linkedin, Mail, Twitter, Minimize2, Maximize2, GripHorizontal } from 'lucide-react';

interface TerminalLine {
  type: 'input' | 'output' | 'error' | 'success' | 'art' | 'secret';
  content: string;
}

interface TerminalFooterProps {
  onUnlockSecret?: () => void;
}

const SECRET_KEY = 'prometheus';

const COMMANDS: Record<string, string | (() => string)> = {
  help: `Available commands:
  whoami     - Identity protocol
  history    - Access logs
  skills     - Neural capabilities
  projects   - Classified files
  contact    - Secure channel
  resume     - Decrypt CV
  clear      - Purge terminal
  hack       - Breach attempt
  sudo       - Root access
  matrix     - Reality check
  decrypt    - Decode message [key]`,
  
  whoami: `┌─────────────────────────────────────────────────┐
│  SUBJECT: SHASHWAT UPADHYAY                     │
│  ───────────────────────────                    │
│  Classification: ML RESEARCHER                  │
│  Institution: IIT Madras (Dual Degree)          │
│  Clearance: LEVEL 5                             │
│  Status: ACTIVE                                 │
│                                                 │
│  Specialization:                                │
│  → Deep Learning & Computer Vision              │
│  → Healthcare AI & Digital Twins                │
│  → Cybersecurity & Ethical Hacking              │
│                                                 │
│  Notable: Best Paper Award @ 19                 │
│           ISRO-funded Research                  │
│           National Hackathon Winner             │
└─────────────────────────────────────────────────┘`,

  history: `[ACCESS DENIED]
  
  Error Code: 0x4D595354455259
  
  "Shashwat is born to make mysteries,
   not delete history."
   
  Some logs are meant to remain classified.
  Try 'whoami' instead.`,

  skills: `[NEURAL CAPABILITIES LOADED]
  
  ⚡ YOLO    ████████████████░░ 90%
  ⚡ CNN     ████████████████░░ 88%
  ⚡ CLIP    ██████████████░░░░ 82%
  ⚡ BLIP    █████████████░░░░░ 80%
  ⚡ LLMs    ███████████████░░░ 85%
  ⚡ PyTorch ███████████████░░░ 85%
  
  [Core: Python | TensorFlow | OpenCV]`,

  projects: `[CLASSIFIED FILES]
  
  ┌─ OPERATION GEMINI ──── TOP SECRET
  │  Digital Twin Research (ISRO-funded)
  │
  ├─ PROJECT HELIX ─────── CLASSIFIED
  │  CuraSync - Healthcare Analytics
  │
  ├─ SENTINEL ───────────── CLASSIFIED
  │  WardOS - Hospital AI Management
  │
  └─ COGNITION ─────────── CONFIDENTIAL
     PrepZen - AI Learning Platform
  
  Type 'decrypt ${SECRET_KEY}' for hidden chapter.`,

  contact: `[SECURE CHANNEL ESTABLISHED]
  
  ┌─────────────────────────────────┐
  │  ENCRYPTED COMMUNICATION        │
  ├─────────────────────────────────┤
  │  📧 LinkedIn DMs (Preferred)    │
  │  📸 @_shashwatology (Instagram) │
  │  🐙 GitHub: /shashwat           │
  │  🐦 Twitter: @_shashwatology    │
  └─────────────────────────────────┘
  
  Or use the Voice Assistant for instant response.`,

  resume: `[DECRYPTING CV...]
  
  ████████████████████ 100%
  
  Opening classified document...`,

  clear: 'CLEAR',

  hack: () => {
    const responses = [
      '[INTRUSION DETECTED] Firewall engaged. Nice try.',
      '[HONEYPOT TRIGGERED] Your IP has been logged. 😏',
      '[ACCESS DENIED] Clearance Level 7 required.',
      '[COUNTERMEASURE] Deploying neural defense matrix...',
      '[ERROR] Hacking a hacker? Bold strategy.',
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  },

  sudo: `[sudo] Password for guest: ************

  Authentication failure.
  
  This incident will be reported.
  Just kidding... maybe. 🐧`,

  matrix: `
  ╔══════════════════════════════════════╗
  ║                                      ║
  ║   W A K E   U P ,   N E O . . .     ║
  ║                                      ║
  ║   The Matrix has you.                ║
  ║   Follow the white rabbit.           ║
  ║                                      ║
  ║   Or just check out my AI projects.  ║
  ║   They're almost as mind-bending.    ║
  ║                                      ║
  ╚══════════════════════════════════════╝`,
};

const EASTER_EGGS: Record<string, string> = {
  'konami': '🎮 ↑↑↓↓←→←→BA - You found the Konami code!',
  '42': 'The answer to life, the universe, and everything.',
  'hello world': 'console.log("Hello, fellow developer! 👋");',
  'coffee': '☕ ERROR: Coffee.exe not found. Productivity halted.',
  'shashwat': '✨ You found me. Welcome to my world.',
  'love': '❤️ Love is the most powerful algorithm.',
  'secret': '🤫 Secrets hide in plain sight. Try "decrypt prometheus"',
  'isro': '🚀 ISRO research: Building the future of smart cities.',
  'iit': '🎓 IIT Madras: Where dreams become algorithms.',
};

const TerminalFooter = ({ onUnlockSecret }: TerminalFooterProps) => {
  const [lines, setLines] = useState<TerminalLine[]>([
    { type: 'output', content: '┌──────────────────────────────────────────┐' },
    { type: 'output', content: '│  SHASHWAT TERMINAL v2.0.0                │' },
    { type: 'output', content: '│  "The Invisible Researcher"              │' },
    { type: 'output', content: '└──────────────────────────────────────────┘' },
    { type: 'output', content: '' },
    { type: 'output', content: 'Type "help" for available commands.' },
    { type: 'output', content: 'Type "whoami" to begin.' },
    { type: 'output', content: '' },
  ]);
  const [input, setInput] = useState('');
  const [isActive, setIsActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  
  const inputRef = useRef<HTMLInputElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
  }, [lines]);

  const processCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim().toLowerCase();
    
    if (!trimmedCmd) return;

    setCommandHistory(prev => [...prev, trimmedCmd]);
    setHistoryIndex(-1);
    setLines(prev => [...prev, { type: 'input', content: `guest@shashwat:~$ ${cmd}` }]);

    // Check for decrypt command
    if (trimmedCmd.startsWith('decrypt ')) {
      const key = trimmedCmd.split(' ')[1];
      if (key === SECRET_KEY) {
        setLines(prev => [...prev, { 
          type: 'secret', 
          content: `[DECRYPTION SUCCESSFUL]
          
  ██████╗ ██████╗  ██████╗ ███╗   ███╗███████╗████████╗██╗  ██╗███████╗██╗   ██╗███████╗
  ██╔══██╗██╔══██╗██╔═══██╗████╗ ████║██╔════╝╚══██╔══╝██║  ██║██╔════╝██║   ██║██╔════╝
  ██████╔╝██████╔╝██║   ██║██╔████╔██║█████╗     ██║   ███████║█████╗  ██║   ██║███████╗
  ██╔═══╝ ██╔══██╗██║   ██║██║╚██╔╝██║██╔══╝     ██║   ██╔══██║██╔══╝  ██║   ██║╚════██║
  ██║     ██║  ██║╚██████╔╝██║ ╚═╝ ██║███████╗   ██║   ██║  ██║███████╗╚██████╔╝███████║
  ╚═╝     ╚═╝  ╚═╝ ╚═════╝ ╚═╝     ╚═╝╚══════╝   ╚═╝   ╚═╝  ╚═╝╚══════╝ ╚═════╝ ╚══════╝
  
  HIDDEN CHAPTER UNLOCKED. Launching cinematic mode...` 
        }]);
        setTimeout(() => {
          onUnlockSecret?.();
        }, 1500);
        return;
      } else {
        setLines(prev => [...prev, { 
          type: 'error', 
          content: `[DECRYPTION FAILED] Invalid key: "${key}". The secret remains hidden.` 
        }]);
        return;
      }
    }

    // Easter eggs
    if (EASTER_EGGS[trimmedCmd]) {
      setLines(prev => [...prev, { type: 'success', content: EASTER_EGGS[trimmedCmd] }]);
      return;
    }

    // Clear command
    if (trimmedCmd === 'clear') {
      setLines([
        { type: 'output', content: 'Terminal cleared.' },
        { type: 'output', content: '' },
      ]);
      return;
    }

    // Resume command
    if (trimmedCmd === 'resume') {
      setLines(prev => [...prev, { type: 'success', content: COMMANDS.resume as string }]);
      window.open('/Shashwat-Upadhyay-Resume.pdf', '_blank');
      return;
    }

    // Standard commands
    const command = COMMANDS[trimmedCmd];
    
    if (command) {
      const output = typeof command === 'function' ? command() : command;
      setLines(prev => [...prev, { type: 'output', content: output }]);
    } else {
      setLines(prev => [...prev, { 
        type: 'error', 
        content: `Command not found: ${trimmedCmd}. Type "help" for available commands.` 
      }]);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex = historyIndex < commandHistory.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || '');
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <footer className="terminal-footer">
      <div className="terminal-container">
        <motion.div 
          className={`terminal-window researcher ${isActive ? 'active' : ''} ${isMinimized ? 'minimized' : ''}`}
          style={{ x: position.x, y: position.y }}
          drag
          dragMomentum={false}
          onDragStart={() => setIsDragging(true)}
          onDragEnd={() => setIsDragging(false)}
          onClick={() => {
            if (!isDragging) {
              setIsActive(true);
              inputRef.current?.focus();
            }
          }}
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          {/* Terminal Header */}
          <div className="terminal-header researcher">
            <div className="terminal-dots">
              <span className="dot red" onClick={() => setIsMinimized(true)} />
              <span className="dot yellow" onClick={() => setIsMinimized(!isMinimized)} />
              <span className="dot green" />
            </div>
            <div className="terminal-title researcher">
              <Terminal size={14} />
              <span>guest@shashwat:~ — zsh</span>
            </div>
            <div className="terminal-controls">
              <button onClick={() => setIsMinimized(!isMinimized)}>
                {isMinimized ? <Maximize2 size={12} /> : <Minimize2 size={12} />}
              </button>
              <GripHorizontal size={14} className="drag-handle" />
            </div>
          </div>

          {/* Terminal Body */}
          <AnimatePresence>
            {!isMinimized && (
              <motion.div 
                className="terminal-body"
                ref={terminalRef}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
              >
                <AnimatePresence>
                  {lines.map((line, i) => (
                    <motion.div
                      key={i}
                      className={`terminal-line ${line.type}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.15 }}
                    >
                      <pre>{line.content}</pre>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {/* Input line */}
                <div className="terminal-input-line">
                  <span className="prompt">guest@shashwat:~$</span>
                  <input
                    ref={inputRef}
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsActive(true)}
                    onBlur={() => setIsActive(false)}
                    placeholder={isActive ? '' : 'Click to interact...'}
                    spellCheck={false}
                    autoComplete="off"
                  />
                  <span className="terminal-cursor" />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Secret key hint */}
        <motion.div 
          className="secret-key-hint"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 1 }}
          data-reveal="const SECRET = 'prometheus';"
        >
          <span className="hint-text">🔑 The key to knowledge lies within the fire bringer...</span>
        </motion.div>

        {/* Premium Footer Bar */}
        <motion.div
          className="footer-info researcher"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          {/* Top divider line */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent mb-8" />

          <div className="grid grid-cols-3 gap-8 w-full max-w-4xl mx-auto px-4">
            {/* Left: Brand */}
            <div className="flex flex-col gap-2">
              <p className="text-white/80 font-semibold text-sm tracking-tight">Shashwat Upadhyay</p>
              <p className="text-white/30 text-xs leading-relaxed">ML Researcher · IIT Madras<br />Building AI for good.</p>
            </div>

            {/* Center: Quick Nav */}
            <div className="flex flex-col items-center gap-2">
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] mb-1">Navigate</p>
              <div className="flex flex-wrap justify-center gap-x-4 gap-y-1">
                {[['Home', '#hero'], ['Projects', '#projects'], ['Experience', '#experience'], ['Skills', '#skills'], ['Connect', '#connect']].map(([label, href]) => (
                  <a
                    key={label}
                    href={href}
                    className="text-white/40 hover:text-white text-xs transition-colors duration-200"
                    onClick={(e) => { e.preventDefault(); document.getElementById(href.slice(1))?.scrollIntoView({ behavior: 'smooth' }); }}
                  >
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Right: Social Links */}
            <div className="flex flex-col items-end gap-3">
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em]">Find me on</p>
              <div className="flex items-center gap-3">
                <a href="https://github.com/shashwat-upadhyay" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="GitHub">
                  <Github size={18} />
                </a>
                <a href="https://linkedin.com/in/shashwatupadhyay" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="LinkedIn">
                  <Linkedin size={18} />
                </a>
                <a href="https://twitter.com/_shashwatology" target="_blank" rel="noopener noreferrer" className="text-white/40 hover:text-white transition-colors" aria-label="Twitter">
                  <Twitter size={18} />
                </a>
                <a href="mailto:shashwat.upadhyay@smail.iitm.ac.in" className="text-white/40 hover:text-white transition-colors" aria-label="Email">
                  <Mail size={18} />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom copyright */}
          <div className="w-full h-px bg-gradient-to-r from-transparent via-white/5 to-transparent mt-8 mb-4" />
          <p className="text-white/20 text-[11px] tracking-widest text-center">
            © {new Date().getFullYear()} SHASHWAT UPADHYAY · BUILT WITH ♥ &amp; CAFFEINE
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default TerminalFooter;
