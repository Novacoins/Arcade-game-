/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { Play, Sparkles, Navigation, Volume2, VolumeX, Maximize2, HelpCircle, Flame, Target, Coins, ShieldAlert, Zap } from 'lucide-react';

interface CrashGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export function SkyFlight({ coins, onGameWin, onGameLose }: CrashGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(10);
  const [gameState, setGameState] = useState<'idle' | 'running' | 'crashed' | 'cashed_out'>('idle');
  const [currentMultiplier, setCurrentMultiplier] = useState(1.00);
  const [crashPoint, setCrashPoint] = useState(1.00);
  const [wonAmount, setWonAmount] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [autoPlay, setAutoPlay] = useState(false);
  const [autoCashout, setAutoCashout] = useState<string>('0'); // '0' means disabled
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Game state references for continuous rendering
  const stateRef = useRef<'idle' | 'running' | 'crashed' | 'cashed_out'>('idle');
  const startTimeRef = useRef<number>(0);
  const multiplierRef = useRef<number>(1.00);
  const crashPointRef = useRef<number>(1.00);
  const shipPosRef = useRef({ x: 60, y: 240, vx: 0, vy: 0, angle: 0 });
  const pointsRef = useRef<{ x: number; y: number }[]>([]);
  const particlesRef = useRef<{ x: number; y: number; r: number; color: string; alpha: number; vx: number; vy: number; life: number }[]>([]);
  const starsRef = useRef<{ x: number; y: number; size: number; speed: number; opacity: number }[]>([]);
  const screenShakeRef = useRef<number>(0);
  const crashExplodedRef = useRef<boolean>(false);

  // Sound play wrappers with mute check
  const playSound = (type: 'click' | 'coin' | 'explode' | 'fanfare' | 'card') => {
    if (isMuted) return;
    if (type === 'click') synth.playClick();
    if (type === 'coin') synth.playCoin();
    if (type === 'explode') synth.playExplode();
    if (type === 'fanfare') synth.playFanfare();
    if (type === 'card') synth.playCard();
  };

  // Toggle mute state
  const handleToggleMute = () => {
    setIsMuted(!isMuted);
    if (isMuted) {
      synth.playClick();
    }
  };

  // Pre-seed background stars
  useEffect(() => {
    const list = Array.from({ length: 90 }).map(() => ({
      x: Math.random() * 800,
      y: Math.random() * 400,
      size: Math.random() * 2.0 + 0.5,
      speed: Math.random() * 0.5 + 0.15,
      opacity: Math.random()
    }));
    starsRef.current = list;
  }, []);

  const handlePlaceBet = () => {
    if (!validateAndDeductCoins(bet, 'Sky Flight')) {
      return;
    }
    playSound('click');

    // Setup game variables
    stateRef.current = 'running';
    setGameState('running');
    setCurrentMultiplier(1.00);
    multiplierRef.current = 1.00;
    setWonAmount(0);
    pointsRef.current = [];
    particlesRef.current = [];
    startTimeRef.current = Date.now();
    crashExplodedRef.current = false;
    screenShakeRef.current = 0;

    // Reset ship physical state
    shipPosRef.current = { x: 60, y: 240, vx: 0, vy: 0, angle: 0 };

    // Determine crash point using fair crash distribution math:
    // 97% of the time, multiplier = 0.97 / (1 - rand)
    // 3% instant crash at 1.00x
    const rand = Math.random();
    const point = rand < 0.03 ? 1.00 : Math.max(1.01, parseFloat((0.97 / (1 - rand)).toFixed(2)));
    setCrashPoint(point);
    crashPointRef.current = point;
  };

  const handleCashOut = () => {
    if (stateRef.current !== 'running') return;
    playSound('coin');
    
    const win = Math.min(50, Math.floor(bet * multiplierRef.current));
    setWonAmount(win);
    stateRef.current = 'cashed_out';
    setGameState('cashed_out');
    onGameWin(win, multiplierRef.current);

    // Autoplay cycle trigger if selected
    if (autoPlay) {
      setTimeout(() => {
        if (coins >= bet && stateRef.current === 'cashed_out') {
          handlePlaceBet();
        }
      }, 3500);
    }
  };

  // Fullscreen trigger helper
  const handleToggleFullscreen = () => {
    playSound('click');
    const container = document.getElementById('sky_flight_container');
    if (!container) return;
    if (!document.fullscreenElement) {
      container.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  // Single Continuous Unified Canvas Loop (Handles ALL Game States gracefully without freezing)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resizeCanvas = () => {
      canvas.width = canvas.parentElement?.clientWidth || 600;
      canvas.height = 340;
    };
    resizeCanvas();

    let frame = 0;

    const loop = () => {
      frame++;
      const currentGameState = stateRef.current;
      const elapsed = startTimeRef.current ? (Date.now() - startTimeRef.current) / 1000 : 0;

      // Handle multipliers climbing
      if (currentGameState === 'running') {
        const currentMult = parseFloat(Math.exp(0.065 * elapsed).toFixed(2));
        if (currentMult >= crashPointRef.current) {
          // Crash event! Trigger explosion, screen shake
          stateRef.current = 'crashed';
          setGameState('crashed');
          playSound('explode');
          screenShakeRef.current = 24;

          // Autoplay next round
          if (autoPlay) {
            setTimeout(() => {
              if (coins >= bet && stateRef.current === 'crashed') {
                handlePlaceBet();
              }
            }, 3500);
          }
        } else {
          multiplierRef.current = currentMult;
          setCurrentMultiplier(currentMult);

          // Check Auto Cashout
          const autoVal = parseFloat(autoCashout);
          if (autoVal > 1.00 && currentMult >= autoVal) {
            handleCashOut();
          }
        }
      }

      // Canvas drawing background
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Draw Space Gradient & Stars
      ctx.save();
      if (screenShakeRef.current > 0) {
        const dx = (Math.random() - 0.5) * screenShakeRef.current;
        const dy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(dx, dy);
        screenShakeRef.current *= 0.88; // decay
      }

      const spaceGrad = ctx.createRadialGradient(canvas.width/2, canvas.height/2, 20, canvas.width/2, canvas.height/2, canvas.width);
      spaceGrad.addColorStop(0, '#090514'); // nebula center
      spaceGrad.addColorStop(0.6, '#020108'); // dark void
      spaceGrad.addColorStop(1, '#000000');
      ctx.fillStyle = spaceGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Star scrolling speed based on game state & velocity multiplier
      const scrollSpeed = currentGameState === 'running' ? (1 + multiplierRef.current * 0.2) : 
                          currentGameState === 'cashed_out' ? 8 : 0.4;

      starsRef.current.forEach((star) => {
        star.x -= star.speed * scrollSpeed;
        if (star.x < 0) {
          star.x = canvas.width + 10;
          star.y = Math.random() * canvas.height;
        }

        // Cashed Out makes stars stretch into beautiful hyperdrive warp speed lasers!
        if (currentGameState === 'cashed_out') {
          ctx.strokeStyle = `rgba(255, 255, 255, ${star.opacity * 0.8})`;
          ctx.lineWidth = star.size * 0.8;
          ctx.beginPath();
          ctx.moveTo(star.x, star.y);
          ctx.lineTo(star.x + 35, star.y); // Stretched line
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
          ctx.beginPath();
          ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Perspective Grid Lines mapping
      ctx.strokeStyle = 'rgba(168, 85, 247, 0.04)';
      ctx.lineWidth = 1;
      for (let i = 0; i < canvas.width; i += 50) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
      }

      // 2. State Specific Spacecraft / Trail Renderings
      let shipX = shipPosRef.current.x;
      let shipY = shipPosRef.current.y;
      let shipAngle = shipPosRef.current.angle;

      if (currentGameState === 'idle') {
        // Spaceship resting on premium glowing Launch Pad
        shipX = 65;
        shipY = 250;
        shipAngle = -0.15;

        // Draw metallic pad
        ctx.save();
        ctx.fillStyle = '#1c1917';
        ctx.strokeStyle = '#dc2626';
        ctx.lineWidth = 2;
        ctx.shadowBlur = 8;
        ctx.shadowColor = '#ef4444';
        ctx.beginPath();
        ctx.moveTo(10, 280);
        ctx.lineTo(130, 280);
        ctx.lineTo(100, 265);
        ctx.lineTo(20, 265);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Steam particles
        if (frame % 8 === 0) {
          particlesRef.current.push({
            x: 50 + Math.random() * 40,
            y: 265,
            r: Math.random() * 4 + 2,
            color: 'rgba(255,255,255,0.25)',
            alpha: 0.6,
            vx: (Math.random() - 0.5) * 0.6,
            vy: -Math.random() * 1.5 - 0.5,
            life: 30
          });
        }
        ctx.restore();

      } else if (currentGameState === 'running') {
        // Natural curved flight trajectory scaling with multiplier altitude
        const targetX = Math.min(canvas.width * 0.82, 65 + elapsed * 24);
        const targetY = Math.max(canvas.height * 0.22, canvas.height - 80 - Math.pow(elapsed, 1.7) * 3.6);

        // Sway/vibrate engine physically
        const swayIntensity = Math.min(6, (multiplierRef.current - 1) * 0.5);
        const swayX = (Math.random() - 0.5) * swayIntensity;
        const swayY = (Math.random() - 0.5) * swayIntensity + Math.sin(frame * 0.2) * 1.2;

        shipX = targetX + swayX;
        shipY = targetY + swayY;

        // Angle derived physically from trajectory
        const lastPt = pointsRef.current[pointsRef.current.length - 1];
        if (lastPt) {
          shipAngle = Math.atan2(shipY - lastPt.y, shipX - lastPt.x);
        } else {
          shipAngle = -0.32;
        }

        shipPosRef.current = { x: shipX, y: shipY, vx: 2, vy: -2, angle: shipAngle };

        // Append to glowing flight line trail
        pointsRef.current.push({ x: shipX, y: shipY });
        if (pointsRef.current.length > 250) pointsRef.current.shift();

        // Steaming booster exhaust particles
        if (Math.random() < 0.9) {
          particlesRef.current.push({
            x: shipX - Math.cos(shipAngle) * 22,
            y: shipY - Math.sin(shipAngle) * 22,
            r: Math.random() * 5 + 1.5,
            color: ['#dc2626', '#f59e0b', '#3b82f6', '#ffffff'][Math.floor(Math.random() * 4)],
            alpha: 1.0,
            vx: -Math.cos(shipAngle) * (Math.random() * 3 + 2),
            vy: -Math.sin(shipAngle) * (Math.random() * 2) + (Math.random() - 0.5) * 2,
            life: 25 + Math.random() * 15
          });
        }

      } else if (currentGameState === 'crashed') {
        // Explosion scene!
        if (!crashExplodedRef.current) {
          crashExplodedRef.current = true;
          // Spawn big particle burst
          for (let i = 0; i < 45; i++) {
            const expAngle = Math.random() * Math.PI * 2;
            const expSpeed = Math.random() * 7 + 2;
            particlesRef.current.push({
              x: shipX,
              y: shipY,
              r: Math.random() * 7 + 2,
              color: Math.random() > 0.45 ? (Math.random() > 0.5 ? '#f97316' : '#ef4444') : '#52525b',
              alpha: 1.0,
              vx: Math.cos(expAngle) * expSpeed,
              vy: Math.sin(expAngle) * expSpeed - 1,
              life: 40 + Math.random() * 25
            });
          }
        }

      } else if (currentGameState === 'cashed_out') {
        // Warp-out flight acceleration! Spaceship speeds off right side
        shipPosRef.current.vx += 0.8; // accelerate naturally
        shipX += shipPosRef.current.vx;
        shipY -= shipPosRef.current.vx * 0.22; // bank upwards
        shipAngle = -0.15;

        shipPosRef.current.x = shipX;
        shipPosRef.current.y = shipY;

        // Exhaust trail grows longer, turns into cyan laser stream
        if (Math.random() < 0.95) {
          particlesRef.current.push({
            x: shipX - 25,
            y: shipY,
            r: Math.random() * 4 + 2,
            color: '#06b6d4',
            alpha: 1.0,
            vx: -15 - Math.random() * 10,
            vy: (Math.random() - 0.5) * 1.5,
            life: 20
          });
        }
      }

      // Draw historical glowing trails
      if (pointsRef.current.length > 1 && currentGameState !== 'idle') {
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pointsRef.current[0].x, pointsRef.current[0].y);
        for (let i = 1; i < pointsRef.current.length; i++) {
          ctx.lineTo(pointsRef.current[i].x, pointsRef.current[i].y);
        }

        // Linear neon trailing gradient
        const trailGrad = ctx.createLinearGradient(0, canvas.height, canvas.width, 0);
        trailGrad.addColorStop(0, 'rgba(239, 68, 68, 0.05)');
        trailGrad.addColorStop(0.5, 'rgba(245, 158, 11, 0.42)'); // gold
        trailGrad.addColorStop(1, '#ffffff');

        ctx.strokeStyle = trailGrad;
        ctx.lineWidth = 5;
        ctx.shadowBlur = 18;
        ctx.shadowColor = '#f59e0b';
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.stroke();
        ctx.restore();
      }

      // 3. Render exhaust smoke & fire particles
      const pList = particlesRef.current;
      for (let i = pList.length - 1; i >= 0; i--) {
        const p = pList[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.alpha = p.life / 40;

        if (p.life <= 0) {
          pList.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Spaceship Vector Graphics (Only if not crashed/exploded)
      const shouldDrawShip = currentGameState !== 'crashed' || !crashExplodedRef.current;
      if (shouldDrawShip) {
        ctx.save();
        ctx.translate(shipX, shipY);
        ctx.rotate(shipAngle);

        // Core Thruster Fire
        const fireLength = currentGameState === 'cashed_out' ? 35 : (Math.random() * 14 + 10);
        const fireColor = currentGameState === 'cashed_out' ? '#06b6d4' : '#f97316';
        const fireGrad = ctx.createLinearGradient(-15, 0, -15 - fireLength, 0);
        fireGrad.addColorStop(0, '#ffffff');
        fireGrad.addColorStop(0.4, fireColor);
        fireGrad.addColorStop(1, 'rgba(0,0,0,0)');

        ctx.fillStyle = fireGrad;
        ctx.beginPath();
        ctx.moveTo(-15, -4);
        ctx.lineTo(-15 - fireLength, 0);
        ctx.lineTo(-15, 4);
        ctx.closePath();
        ctx.fill();

        // Spaceship Fuselage Wing layout (Premium styling)
        ctx.fillStyle = '#f8fafc'; // platinum body
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(22, 0); // nose apex
        ctx.lineTo(-11, -11); // left wing root
        ctx.lineTo(-16, -5);
        ctx.lineTo(-16, 5);
        ctx.lineTo(-11, 11); // right wing root
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Wing trims (Neon Red/Gold accents)
        ctx.fillStyle = currentGameState === 'cashed_out' ? '#06b6d4' : '#ef4444';
        ctx.beginPath();
        ctx.moveTo(-2, -8);
        ctx.lineTo(-14, -11);
        ctx.lineTo(-11, -4);
        ctx.closePath();
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(-2, 8);
        ctx.lineTo(-14, 11);
        ctx.lineTo(-11, 4);
        ctx.closePath();
        ctx.fill();

        // Canopy cyber cockpit visor dome
        const visorGrad = ctx.createRadialGradient(6, -2, 1, 6, -2, 7);
        visorGrad.addColorStop(0, '#ffffff');
        visorGrad.addColorStop(0.5, '#fbbf24');
        visorGrad.addColorStop(1, '#ca8a04');
        ctx.fillStyle = visorGrad;
        ctx.beginPath();
        ctx.ellipse(4, 0, 7.5, 3.8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      ctx.restore(); // screen shake restore
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [autoPlay, autoCashout, coins, bet]);

  return (
    <div className="space-y-4 max-w-4xl mx-auto" id="sky_flight_container">
      {/* Game Stage Canvas Wrapper */}
      <div className="relative rounded-3xl overflow-hidden bg-zinc-950 border border-white/5 aspect-video shadow-2xl flex flex-col justify-between">
        
        {/* Absolute header overlay */}
        <div className="absolute top-4 left-4 right-4 z-10 pointer-events-none flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] font-black tracking-widest uppercase">
              <Zap className="h-3 w-3 animate-bounce" />
              Flagship: Sky Flight
            </span>
          </div>

          <div className="flex items-center gap-2 pointer-events-auto">
            {/* Audio Toggle button */}
            <button
              onClick={handleToggleMute}
              className="p-2 rounded-xl bg-black/60 border border-white/5 text-zinc-400 hover:text-white transition"
              title={isMuted ? 'Unmute Game Sounds' : 'Mute Game Sounds'}
            >
              {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={handleToggleFullscreen}
              className="p-2 rounded-xl bg-black/60 border border-white/5 text-zinc-400 hover:text-white transition"
              title="Toggle Fullscreen"
            >
              <Maximize2 className="h-4 w-4" />
            </button>

            {/* Help How to Play Toggle */}
            <button
              onClick={() => { playSound('click'); setShowHowToPlay(!showHowToPlay); }}
              className="p-2 rounded-xl bg-black/60 border border-white/5 text-zinc-400 hover:text-white transition"
              title="How to Play"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Canvas background render */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

        {/* HUD Center overlay */}
        <div className="relative z-10 grow flex flex-col items-center justify-center p-4">
          {gameState === 'idle' && (
            <div className="text-center space-y-2 pointer-events-none animate-fade-in">
              <span className="text-[10px] font-black tracking-widest text-zinc-500 uppercase block">Ready for take-off</span>
              <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">Launch Spacecraft Cabinet</h2>
              <p className="text-[11px] text-zinc-400 max-w-xs font-sans">
                Set your bet amount below, launch the craft, and cash out before it flies away in deep space!
              </p>
            </div>
          )}

          {gameState === 'running' && (
            <div className="text-center pointer-events-none select-none">
              <h3 className="text-7xl sm:text-8xl font-black tracking-tighter text-white drop-shadow-[0_4px_18px_rgba(245,158,11,0.5)] animate-pulse font-mono">
                {currentMultiplier.toFixed(2)}<span className="text-amber-400 font-sans">x</span>
              </h3>
              <p className="text-[10px] text-amber-300 font-extrabold uppercase tracking-widest mt-1">Climbing Altitude...</p>
            </div>
          )}

          {gameState === 'crashed' && (
            <div className="text-center space-y-1 bg-black/60 p-4 rounded-2xl border border-red-500/20 backdrop-blur-sm animate-bounce">
              <p className="text-[10px] font-black text-red-500 uppercase tracking-widest">💥 FLIGHT CRASHED</p>
              <h3 className="text-4xl sm:text-5xl font-black text-red-500 tracking-tight font-mono">
                @{crashPoint.toFixed(2)}x
              </h3>
              <p className="text-[10px] text-zinc-400 font-medium">Spacecraft departed into asteroid storm!</p>
            </div>
          )}

          {gameState === 'cashed_out' && (
            <div className="text-center space-y-1 bg-black/70 p-5 rounded-2xl border border-emerald-500/20 backdrop-blur-sm animate-fade-in">
              <p className="text-[10px] font-black text-emerald-400 uppercase tracking-widest">💰 CASH OUT SECURED!</p>
              <h3 className="text-4xl sm:text-5xl font-black text-emerald-400 tracking-tight font-mono">
                +{wonAmount.toLocaleString()} 🪙
              </h3>
              <p className="text-[10px] text-zinc-400 font-semibold">Multiplier captured at {currentMultiplier.toFixed(2)}x</p>
            </div>
          )}
        </div>

        {/* How to Play absolute popup panel overlay */}
        {showHowToPlay && (
          <div className="absolute inset-4 z-20 bg-black/90 rounded-2xl border border-white/10 p-6 flex flex-col justify-center text-left space-y-2 animate-fade-in">
            <h4 className="text-sm font-black uppercase text-amber-400 flex items-center gap-2">
              <HelpCircle className="h-4 w-4" />
              How to Play Sky Flight
            </h4>
            <div className="text-xs text-zinc-300 space-y-2 leading-relaxed font-sans">
              <p>1. <strong>Set your bet amount</strong> in the bottom controller. Use the standard 1/2 or 2X multipliers to alter quickly.</p>
              <p>2. Press <strong>Launch Spacecraft</strong> to boot the flight motor. The ship will ascend from left to right as the payout multiplier climbs.</p>
              <p>3. Payouts scale exponentially with multiplier altitude. Watch the multiplier numbers rise in real-time!</p>
              <p>4. Click <strong>CASH OUT</strong> at any instant to claim your coin rewards multiplied by the current value. If you wait too long and the rocket crashes, you forfeit the bid!</p>
            </div>
            <button 
              onClick={() => { playSound('click'); setShowHowToPlay(false); }}
              className="mt-4 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 rounded-xl text-[10px] font-bold text-white uppercase tracking-wider self-start"
            >
              Close instructions
            </button>
          </div>
        )}

      </div>

      {/* Bet Controllers & Autoplay Control Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 bg-zinc-900/60 p-5 rounded-3xl border border-white/5 backdrop-blur-md">
        
        {/* Left column: Bet adjusters */}
        <div className="md:col-span-6 space-y-3">
          <div className="flex justify-between items-center">
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Bid Amount (Coins)</label>
            <span className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider">Balance: {coins.toLocaleString()} 🪙</span>
          </div>

          <div className="flex gap-2">
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(Math.max(10, bet - 50)); }}
              className="px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-sm font-black text-white"
            >
              -
            </button>
            <input
              type="number"
              disabled={gameState === 'running'}
              value={bet}
              onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
              className="w-full text-center font-bold rounded-xl border border-zinc-800 bg-black py-2.5 text-sm text-white focus:border-red-500 outline-none font-mono"
            />
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(bet + 50); }}
              className="px-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-sm font-black text-white"
            >
              +
            </button>
          </div>

          <div className="grid grid-cols-4 gap-2">
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(100); }}
              className="py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-black text-zinc-400"
            >
              100
            </button>
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(500); }}
              className="py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-black text-zinc-400"
            >
              500
            </button>
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(1000); }}
              className="py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-black text-zinc-400"
            >
              1K
            </button>
            <button
              disabled={gameState === 'running'}
              onClick={() => { playSound('click'); setBet(Math.floor(bet * 2)); }}
              className="py-1.5 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-800 text-[10px] font-black text-zinc-400"
            >
              2X
            </button>
          </div>
        </div>

        {/* Right column: Auto features and Core Action triggers */}
        <div className="md:col-span-6 space-y-3 flex flex-col justify-between">
          <div className="grid grid-cols-2 gap-3">
            {/* Auto Play checkbox toggle */}
            <div className="bg-black/40 border border-white/5 rounded-xl p-2.5 flex items-center justify-between">
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wide">Auto Play</span>
              <input 
                type="checkbox"
                checked={autoPlay}
                onChange={(e) => { playSound('click'); setAutoPlay(e.target.checked); }}
                className="rounded accent-red-600 h-4 w-4 bg-zinc-950 border-zinc-800"
              />
            </div>

            {/* Auto cash out select */}
            <div>
              <select
                disabled={gameState === 'running'}
                value={autoCashout}
                onChange={(e) => { playSound('click'); setAutoCashout(e.target.value); }}
                className="w-full rounded-xl border border-zinc-800 bg-black px-3 py-2.5 text-xs font-bold text-white outline-none focus:border-red-500"
              >
                <option value="0">Auto Cash Out</option>
                <option value="1.5">1.50x Payout</option>
                <option value="2.0">2.00x Payout</option>
                <option value="3.0">3.00x Payout</option>
                <option value="5.0">5.00x Payout</option>
                <option value="10.0">10.00x Payout</option>
              </select>
            </div>
          </div>

          {/* Action Trigger Button */}
          {gameState !== 'running' ? (
            <button
              onClick={handlePlaceBet}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-red-600/10 hover:shadow-amber-500/20 flex items-center justify-center gap-2"
            >
              <Flame className="h-4 w-4 text-white animate-pulse" />
              Launch Spacecraft (Bid {bet} 🪙)
            </button>
          ) : (
            <button
              onClick={handleCashOut}
              className="w-full py-4 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 text-white font-black text-xs uppercase tracking-widest hover:scale-[1.01] active:scale-95 transition-all shadow-xl shadow-emerald-500/20 flex items-center justify-center gap-2"
            >
              <Coins className="h-4 w-4 text-white animate-spin" />
              CASH OUT NOW ({(bet * currentMultiplier).toFixed(0)} 🪙)
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
