import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Activity, GitCommit, Code2, Cpu, Database, Zap } from 'lucide-react';

interface LogEntry {
  id: number;
  type: 'commit' | 'research' | 'training' | 'deploy' | 'data';
  message: string;
  timestamp: string;
  icon: React.ReactNode;
}

const SIMULATED_LOGS: Omit<LogEntry, 'id' | 'timestamp'>[] = [
  { type: 'commit', message: 'git push: Updated neural network architecture', icon: <GitCommit size={12} /> },
  { type: 'research', message: 'Processing: YOLO inference on 1024 frames', icon: <Cpu size={12} /> },
  { type: 'training', message: 'Epoch 47/100 | Loss: 0.0023 | Acc: 98.7%', icon: <Activity size={12} /> },
  { type: 'commit', message: 'git push: Refactored transformer attention heads', icon: <GitCommit size={12} /> },
  { type: 'data', message: 'PostgreSQL: 2.4M rows processed in 1.2s', icon: <Database size={12} /> },
  { type: 'deploy', message: 'Docker: Container curasync-prod deployed', icon: <Code2 size={12} /> },
  { type: 'research', message: 'CLIP embeddings: Similarity score 0.94', icon: <Zap size={12} /> },
  { type: 'training', message: 'Model checkpoint saved: model_v2.3.pt', icon: <Activity size={12} /> },
  { type: 'commit', message: 'git push: Implemented attention visualization', icon: <GitCommit size={12} /> },
  { type: 'data', message: 'ETL Pipeline: 847 records transformed', icon: <Database size={12} /> },
  { type: 'research', message: 'BLIP caption: "A researcher at workstation"', icon: <Cpu size={12} /> },
  { type: 'deploy', message: 'Edge function: wardos-api latency 23ms', icon: <Code2 size={12} /> },
  { type: 'training', message: 'Gradient norm: 0.0012 | LR: 0.0001', icon: <Activity size={12} /> },
  { type: 'commit', message: 'git push: Added RLS policies for security', icon: <GitCommit size={12} /> },
  { type: 'research', message: 'Digital Twin: Sensor fusion complete', icon: <Zap size={12} /> },
];

const LiveDataTicker = () => {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isPaused, setIsPaused] = useState(false);
  const logIdRef = useRef(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    const initLogs = async () => {
      let initialLogs: LogEntry[] = [];
      try {
        const response = await fetch('https://api.github.com/users/Shashwatology/events/public');
        if (response.ok) {
          const events = await response.json();
          initialLogs = events.slice(0, 3).map((e: any) => ({
            id: logIdRef.current++,
            type: 'commit',
            message: `GitHub: ${e.type.replace('Event', '')} on ${e.repo.name.split('/')[1]}`,
            icon: <GitCommit size={12} />,
            timestamp: new Date(e.created_at).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' })
          }));
        }
      } catch (err) {
        // Fallback to simulated on fail
      }

      if (initialLogs.length === 0) {
        initialLogs = SIMULATED_LOGS.slice(0, 3).map((log, i) => ({
          ...log,
          id: logIdRef.current++,
          timestamp: getTimestamp(),
        }));
      }
      setLogs(initialLogs);

      // Add new simulated logs periodically to keep it lively
      interval = setInterval(() => {
        if (isPaused) return;
        
        const randomLog = SIMULATED_LOGS[Math.floor(Math.random() * SIMULATED_LOGS.length)];
        const newLog: LogEntry = {
          ...randomLog,
          id: logIdRef.current++,
          timestamp: getTimestamp(),
        };
        
        setLogs(prev => {
          const updated = [newLog, ...prev];
          return updated.slice(0, 20); // Keep only last 20
        });
      }, 3000);
    };

    initLogs();

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPaused]);

  const getTimestamp = () => {
    const now = new Date();
    return now.toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const typeColors = {
    commit: 'text-green-400',
    research: 'text-cyan-400',
    training: 'text-purple-400',
    deploy: 'text-amber-400',
    data: 'text-blue-400',
  };

  return (
    <div 
      className="live-ticker"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <div className="ticker-header">
        <Activity size={14} className="text-green-400 animate-pulse" />
        <span>LIVE RESEARCH LOGS</span>
        <span className="ticker-status">
          {isPaused ? '⏸ PAUSED' : '● STREAMING'}
        </span>
      </div>
      
      <div className="ticker-content">
        <motion.div 
          className="ticker-scroll"
          animate={{ x: isPaused ? 0 : [0, -1000] }}
          transition={{ 
            duration: 30, 
            repeat: Infinity, 
            ease: 'linear',
            repeatType: 'loop'
          }}
        >
          {logs.map((log) => (
            <motion.div
              key={log.id}
              className="ticker-item"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className={`ticker-icon ${typeColors[log.type]}`}>
                {log.icon}
              </span>
              <span className="ticker-time">[{log.timestamp}]</span>
              <span className="ticker-message">{log.message}</span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default LiveDataTicker;
