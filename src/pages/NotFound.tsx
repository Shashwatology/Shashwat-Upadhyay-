import { useLocation, Link } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import { Terminal, RefreshCw, Home } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    console.error("404 Error: Non-existent route:", location.pathname);
  }, [location.pathname]);

  // Game Logic
  useEffect(() => {
    if (!isPlaying || gameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationId: number;
    let frames = 0;
    
    // Player
    const player = {
      x: 50,
      y: 150,
      width: 20,
      height: 20,
      dy: 0,
      jumpForce: -10,
      grounded: false,
      color: '#00ffff'
    };

    // Obstacles
    let obstacles: any[] = [];
    const gravity = 0.6;
    let gameSpeed = 4;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent default scrolling on spacebar
      if (e.code === 'Space') {
        e.preventDefault();
        if (player.grounded) {
          player.dy = player.jumpForce;
          player.grounded = false;
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Draw grid background
      ctx.strokeStyle = 'rgba(0, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 20) {
        ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, canvas.height); ctx.stroke();
      }
      
      // Update & Draw Player
      player.dy += gravity;
      player.y += player.dy;
      
      if (player.y + player.height >= canvas.height - 20) {
        player.y = canvas.height - 20 - player.height;
        player.dy = 0;
        player.grounded = true;
      }
      
      ctx.fillStyle = player.color;
      ctx.shadowBlur = 10;
      ctx.shadowColor = player.color;
      ctx.fillRect(player.x, player.y, player.width, player.height);
      ctx.shadowBlur = 0;
      
      // Ground line
      ctx.strokeStyle = '#00ffff';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height - 20);
      ctx.lineTo(canvas.width, canvas.height - 20);
      ctx.stroke();

      // Spawn obstacles: decrease frequency slightly as speed goes up
      if (frames % Math.max(70, 100 - Math.floor(gameSpeed * 2)) === 0) {
        obstacles.push({
          x: canvas.width,
          y: canvas.height - 40,
          width: 15,
          height: 20,
          color: '#ff00ff'
        });
      }

      // Update & Draw Obstacles
      for (let i = 0; i < obstacles.length; i++) {
        const obs = obstacles[i];
        obs.x -= gameSpeed;
        
        ctx.fillStyle = obs.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = obs.color;
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
        ctx.shadowBlur = 0;

        // Collision
        if (
          player.x < obs.x + obs.width &&
          player.x + player.width > obs.x &&
          player.y < obs.y + obs.height &&
          player.y + player.height > obs.y
        ) {
          setGameOver(true);
        }
      }

      // Cleanup obstacles
      obstacles = obstacles.filter(obs => obs.x + obs.width > 0);
      
      // Score
      if (frames % 10 === 0) {
        setScore(s => {
          const newScore = s + 1;
          if (newScore > 0 && newScore % 100 === 0) gameSpeed += 0.5; // increase difficulty safely
          return newScore;
        });
      }

      frames++;
      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isPlaying, gameOver]);

  const startGame = () => {
    setScore(0);
    setGameOver(false);
    setIsPlaying(true);
  };

  return (
    <div className="min-h-screen bg-[#050510] flex flex-col items-center justify-center p-4 font-mono text-[#00ffff] relative overflow-hidden">
      {/* CRT overlay effect */}
      <div className="absolute inset-0 pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.8)]"></div>
      
      <div className="max-w-2xl w-full flex flex-col items-center space-y-8 z-10 relative">
        <div className="text-center space-y-4">
          <Terminal size={48} className="mx-auto text-[#00ffff] opacity-80" />
          <h1 className="text-6xl font-bold tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-[#00ffff] to-[#ff00ff] drop-shadow-[0_0_15px_rgba(0,255,255,0.5)]">
            ERROR 404
          </h1>
          <p className="text-xl text-[#00ffff]/70 border-b border-[#00ffff]/20 pb-4">
            System breach detected: Route not found.
          </p>
        </div>

        <div className="w-full bg-black/50 border border-[#00ffff]/30 rounded-lg p-6 backdrop-blur-sm relative group hover:border-[#00ffff]/60 transition-colors">
          <div className="flex justify-between items-center mb-4 cursor-default">
            <span className="text-sm uppercase tracking-widest text-[#ff00ff]">Neural Bypass Core</span>
            <span className="text-lg">Score: {score.toString().padStart(5, '0')}</span>
          </div>

          <div className="relative border border-[#00ffff]/20 bg-[#001111] overflow-hidden rounded">
            {!isPlaying && !gameOver && (
              <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/60 backdrop-blur-sm">
                <button 
                  onClick={startGame}
                  className="px-6 py-2 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all flex items-center gap-2 hover:scale-105 outline-none focus:ring-2"
                >
                  <RefreshCw size={16} /> INITIALIZE BYPASS
                </button>
              </div>
            )}
            
            {gameOver && (
              <div className="absolute inset-0 flex flex-col items-center justify-center z-10 bg-black/80 backdrop-blur-sm border-2 border-red-500/50">
                <h2 className="text-red-500 font-bold mb-4 text-2xl drop-shadow-[0_0_10px_rgba(255,0,0,0.8)]">SYSTEM CRITICAL</h2>
                <button 
                  onClick={startGame}
                  className="px-6 py-2 border border-[#00ffff] text-[#00ffff] hover:bg-[#00ffff] hover:text-black transition-all flex items-center gap-2 outline-none focus:ring-2"
                >
                  <RefreshCw size={16} /> REBOOT SYSTEM
                </button>
              </div>
            )}
            
            <canvas 
              ref={canvasRef} 
              width={600} 
              height={200}
              className="w-full max-w-full touch-none cursor-pointer"
              onClick={() => {
                if (!isPlaying) startGame();
                else {
                  // Trigger jump by dispatching a fake keydown
                  window.dispatchEvent(new KeyboardEvent('keydown', { 'code': 'Space' }));
                }
              }}
            />
          </div>
          
          <p className="text-center text-xs mt-4 text-[#00ffff]/50">
            Press [SPACE] or tap screen to maneuver over firewalls
          </p>
        </div>

        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#00ffff]/70 hover:text-[#00ffff] hover:scale-105 transition-all outline-none focus:ring-2 ring-[#00ffff] rounded px-4 py-2"
        >
          <Home size={18} />
          <span>Return to safe coordinates</span>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
