/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Shield, Crown,
  Coins, RotateCw, CheckCircle2, Lock, Eye, ShoppingBag, X, Check, Play, Layers,
  ArrowLeft, Gift
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PlinkoProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// 10 UNIQUE BOARDS CONFIGURATION (Prices: 50 - 150 Coins)
// ==========================================
export interface PlinkoBoard {
  id: string;
  name: string;
  price: number;
  desc: string;
  pinColor: string;
  bgColor: string;
  frameGradient: string;
  glowColor: string;
  previewEmoji: string;
}

export const PLINKO_BOARDS: PlinkoBoard[] = [
  { 
    id: 'crystal', 
    name: 'Crystal Board', 
    price: 0, 
    desc: 'Classic cyan crystal peg arena with ice reflections', 
    pinColor: '#06b6d4', 
    bgColor: '#082f49', 
    frameGradient: 'from-cyan-500/40 via-blue-600/30 to-indigo-900/60',
    glowColor: 'rgba(6,182,212,0.4)',
    previewEmoji: '💎' 
  },
  { 
    id: 'royal_gold', 
    name: 'Royal Gold Board', 
    price: 50, 
    desc: 'Imperial gold pins with warm ambient VIP lighting', 
    pinColor: '#fbbf24', 
    bgColor: '#451a03', 
    frameGradient: 'from-amber-400/50 via-yellow-600/30 to-amber-950/80',
    glowColor: 'rgba(251,191,36,0.4)',
    previewEmoji: '👑' 
  },
  { 
    id: 'cyber', 
    name: 'Cyber Board', 
    price: 70, 
    desc: 'Neon cyan laser circuit pegs with futuristic matrix grid', 
    pinColor: '#38bdf8', 
    bgColor: '#0f172a', 
    frameGradient: 'from-sky-400/50 via-cyan-600/30 to-zinc-950/80',
    glowColor: 'rgba(56,189,248,0.4)',
    previewEmoji: '⚡' 
  },
  { 
    id: 'galaxy', 
    name: 'Galaxy Board', 
    price: 90, 
    desc: 'Deep void space with shimmering stardust pins', 
    pinColor: '#c084fc', 
    bgColor: '#2e1065', 
    frameGradient: 'from-purple-500/50 via-violet-700/30 to-purple-950/80',
    glowColor: 'rgba(192,132,252,0.4)',
    previewEmoji: '🌌' 
  },
  { 
    id: 'emerald', 
    name: 'Emerald Board', 
    price: 110, 
    desc: 'Lush jade emerald pins with shimmering forest mist', 
    pinColor: '#34d399', 
    bgColor: '#064e3b', 
    frameGradient: 'from-emerald-400/50 via-teal-600/30 to-emerald-950/80',
    glowColor: 'rgba(52,211,153,0.4)',
    previewEmoji: '❇️' 
  },
  { 
    id: 'lava', 
    name: 'Lava Board', 
    price: 120, 
    desc: 'Molten magma pins with intense burning embers', 
    pinColor: '#f97316', 
    bgColor: '#431407', 
    frameGradient: 'from-orange-500/50 via-red-700/30 to-orange-950/80',
    glowColor: 'rgba(249,115,22,0.4)',
    previewEmoji: '🔥' 
  },
  { 
    id: 'ice', 
    name: 'Ice Board', 
    price: 130, 
    desc: 'Glacial frost pins with freezing trails and snow sparkles', 
    pinColor: '#e0f2fe', 
    bgColor: '#0c4a6e', 
    frameGradient: 'from-sky-300/50 via-blue-500/30 to-slate-950/80',
    glowColor: 'rgba(224,242,254,0.4)',
    previewEmoji: '❄️' 
  },
  { 
    id: 'neon', 
    name: 'Neon Board', 
    price: 140, 
    desc: 'Hot pink synthwave neon pegs with retro synth glow', 
    pinColor: '#f43f5e', 
    bgColor: '#4c0519', 
    frameGradient: 'from-fuchsia-500/50 via-pink-700/30 to-rose-950/80',
    glowColor: 'rgba(244,63,94,0.4)',
    previewEmoji: '🌸' 
  },
  { 
    id: 'diamond_vault', 
    name: 'Diamond Vault Board', 
    price: 150, 
    desc: 'Shimmering platinum diamond pegs in a high-security vault', 
    pinColor: '#ffffff', 
    bgColor: '#18181b', 
    frameGradient: 'from-slate-200/50 via-zinc-400/30 to-zinc-950/80',
    glowColor: 'rgba(255,255,255,0.5)',
    previewEmoji: '✨' 
  },
  { 
    id: 'forest', 
    name: 'Forest Board', 
    price: 150, 
    desc: 'Elven wood & vine border with bioluminescent moss pins', 
    pinColor: '#a7f3d0', 
    bgColor: '#022c22', 
    frameGradient: 'from-teal-400/50 via-emerald-700/30 to-emerald-950/80',
    glowColor: 'rgba(167,243,208,0.4)',
    previewEmoji: '🌿' 
  },
];

// ==========================================
// 10 UNIQUE BALLS CONFIGURATION (Prices: 50 - 150 Coins)
// ==========================================
export interface PlinkoBallConfig {
  id: string;
  name: string;
  price: number;
  color: string;
  glow: string;
  trailColor: string;
  previewEmoji: string;
  desc: string;
}

export const PLINKO_BALLS: PlinkoBallConfig[] = [
  { id: 'crystal_ball', name: 'Crystal Ball', price: 0, color: '#38bdf8', glow: 'rgba(56,189,248,0.9)', trailColor: '#0284c7', previewEmoji: '🔮', desc: 'Prismatic ice crystal orb with soft blue glow' },
  { id: 'diamond_ball', name: 'Diamond Ball', price: 50, color: '#06b6d4', glow: 'rgba(6,182,212,0.9)', trailColor: '#0891b2', previewEmoji: '💎', desc: 'Refractive platinum diamond orb with brilliant sparkle' },
  { id: 'gold_ball', name: 'Gold Ball', price: 70, color: '#f59e0b', glow: 'rgba(245,158,11,0.9)', trailColor: '#d97706', previewEmoji: '🪙', desc: 'Polished 24K solid golden coin ball with yellow aura' },
  { id: 'emerald_ball', name: 'Emerald Ball', price: 90, color: '#10b981', glow: 'rgba(16,185,129,0.9)', trailColor: '#059669', previewEmoji: '❇️', desc: 'Shimmering jade emerald orb with green particle trail' },
  { id: 'ruby_ball', name: 'Ruby Ball', price: 100, color: '#e11d48', glow: 'rgba(225,29,72,0.9)', trailColor: '#be123c', previewEmoji: '🔻', desc: 'Crimson fiery ruby gem with deep red luminescence' },
  { id: 'sapphire_ball', name: 'Sapphire Ball', price: 110, color: '#3b82f6', glow: 'rgba(59,130,246,0.9)', trailColor: '#1d4ed8', previewEmoji: '🔹', desc: 'Deep ocean sapphire sphere with intense cobalt light' },
  { id: 'galaxy_ball', name: 'Galaxy Ball', price: 120, color: '#a855f7', glow: 'rgba(168,85,247,0.9)', trailColor: '#7e22ce', previewEmoji: '🌌', desc: 'Starlight cosmic nebula orb with purple galaxy trail' },
  { id: 'neon_ball', name: 'Neon Ball', price: 130, color: '#ec4899', glow: 'rgba(236,72,153,0.9)', trailColor: '#be185d', previewEmoji: '⚡', desc: 'Hot magenta synthwave sphere with reactive neon glow' },
  { id: 'frost_ball', name: 'Frost Ball', price: 140, color: '#7dd3fc', glow: 'rgba(125,211,252,0.9)', trailColor: '#0284c7', previewEmoji: '❄️', desc: 'Freezing glacial frost sphere with icicle snow sparks' },
  { id: 'fire_ball', name: 'Fire Ball', price: 150, color: '#ef4444', glow: 'rgba(239,68,68,0.9)', trailColor: '#dc2626', previewEmoji: '🔥', desc: 'Molten blazing solar sphere with burning embers' },
];

export function DiamondPlinko({ coins, onGameWin, onGameLose }: PlinkoProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [coinsToPay, setCoinsToPay] = useState<number>(50);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Unlocked Boards & Balls State
  const [unlockedBoards, setUnlockedBoards] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dp_unlocked_boards');
      return saved ? JSON.parse(saved) : ['crystal'];
    } catch { return ['crystal']; }
  });

  const [activeBoardId, setActiveBoardId] = useState<string>(() => {
    return localStorage.getItem('dp_active_board') || 'crystal';
  });

  const [unlockedBalls, setUnlockedBalls] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('dp_unlocked_balls');
      return saved ? JSON.parse(saved) : ['crystal_ball'];
    } catch { return ['crystal_ball']; }
  });

  const [activeBallId, setActiveBallId] = useState<string>(() => {
    return localStorage.getItem('dp_active_ball') || 'crystal_ball';
  });

  // Pages Navigation State ('game' | 'boards' | 'balls')
  const [currentPage, setCurrentPage] = useState<'game' | 'boards' | 'balls'>('game');

  // Purchase Dialog State
  const [confirmBoard, setConfirmBoard] = useState<PlinkoBoard | null>(null);
  const [confirmBall, setConfirmBall] = useState<PlinkoBallConfig | null>(null);

  // Success Celebration Popup State
  const [successMessage, setSuccessMessage] = useState<{ title: string; subtitle: string } | null>(null);

  // Floating text / reward notifications
  const [floatingRewards, setFloatingRewards] = useState<{ id: number; text: string; color: string }[]>([]);

  // Persistent Storage Synchronization
  useEffect(() => {
    localStorage.setItem('dp_unlocked_boards', JSON.stringify(unlockedBoards));
  }, [unlockedBoards]);

  useEffect(() => {
    localStorage.setItem('dp_active_board', activeBoardId);
  }, [activeBoardId]);

  useEffect(() => {
    localStorage.setItem('dp_unlocked_balls', JSON.stringify(unlockedBalls));
  }, [unlockedBalls]);

  useEffect(() => {
    localStorage.setItem('dp_active_ball', activeBallId);
  }, [activeBallId]);

  // AUTOMATIC BGM START & STOP
  useEffect(() => {
    synth.startBgm('plinko');
    return () => {
      synth.stopBgm();
    };
  }, []);

  const activeBoardObj = PLINKO_BOARDS.find(b => b.id === activeBoardId) || PLINKO_BOARDS[0];
  const activeBallObj = PLINKO_BALLS.find(b => b.id === activeBallId) || PLINKO_BALLS[0];

  // Ball & Particle Simulation Types
  interface PlinkoBall {
    id: number;
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    glow: string;
    trailColor: string;
    trail: { x: number; y: number }[];
  }

  interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    radius: number;
    life: number;
    maxLife: number;
  }

  interface Peg {
    x: number;
    y: number;
    hitGlow: number; // intensity timer for hit effect
  }

  interface AmbientParticle {
    x: number;
    y: number;
    speed: number;
    radius: number;
    alpha: number;
  }

  const ballsRef = useRef<PlinkoBall[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const pinsRef = useRef<Peg[]>([]);
  const ambientRef = useRef<AmbientParticle[]>([]);

  const rows = 9;
  // Multipliers array balanced for 10 - 100 normal payouts
  const slots = [10.0, 3.0, 1.5, 0.6, 0.3, 0.6, 1.5, 3.0, 10.0];

  // Initialize Pins Grid & Ambient Dust
  useEffect(() => {
    const pins: Peg[] = [];
    const spacing = 32;
    const canvasWidth = 400;

    for (let r = 0; r < rows; r++) {
      const pinCount = r + 3;
      const startX = (canvasWidth / 2) - ((pinCount - 1) * spacing / 2);
      const y = 50 + r * spacing;

      for (let p = 0; p < pinCount; p++) {
        pins.push({ x: startX + p * spacing, y, hitGlow: 0 });
      }
    }
    pinsRef.current = pins;

    // Ambient floating sparkles
    ambientRef.current = Array.from({ length: 20 }, () => ({
      x: Math.random() * 400,
      y: Math.random() * 400,
      speed: Math.random() * 0.4 + 0.2,
      radius: Math.random() * 1.5 + 0.5,
      alpha: Math.random() * 0.5 + 0.2,
    }));
  }, []);

  // Spawn Peg Burst Particles
  const spawnHitParticles = (x: number, y: number, color: string) => {
    for (let i = 0; i < 7; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 2.5 + 1;
      particlesRef.current.push({
        x,
        y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color,
        radius: Math.random() * 2.5 + 1,
        life: 0,
        maxLife: 18,
      });
    }
  };

  // Drop Ball Handler
  const handleDropBall = () => {
    if (!validateAndDeductCoins(coinsToPay, 'Diamond Plinko')) {
      return;
    }

    synth.playClick();
    synth.playSplash();

    // Soft vibration on mobile device
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(15); } catch { /* ignore */ }
    }

    const newBall: PlinkoBall = {
      id: Date.now() + Math.random(),
      x: 200 + (Math.random() - 0.5) * 12,
      y: 20,
      vx: (Math.random() - 0.5) * 1.8,
      vy: 1.8,
      radius: 6.8,
      color: activeBallObj.color,
      glow: activeBallObj.glow,
      trailColor: activeBallObj.trailColor,
      trail: [],
    };

    ballsRef.current.push(newBall);
  };

  // CANVAS MAIN PHYSICS & RENDER LOOP
  // Crucial: Includes currentPage in dependency array so when player returns from Boards/Balls, loop starts instantly!
  useEffect(() => {
    if (currentPage !== 'game') {
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
      return;
    }

    let isSubscribed = true;

    // Small timeout/raf check ensures canvas element is attached to DOM before rendering
    const startRenderLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) {
        if (isSubscribed) {
          requestRef.current = requestAnimationFrame(startRenderLoop);
        }
        return;
      }

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      let frameCount = 0;

      const render = () => {
        if (!isSubscribed) return;
        frameCount++;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Board Background
        ctx.fillStyle = activeBoardObj.bgColor;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 2. Draw Subtle Radial Highlight under drop zone
        const topGrad = ctx.createRadialGradient(200, 20, 5, 200, 20, 180);
        topGrad.addColorStop(0, activeBoardObj.glowColor);
        topGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = topGrad;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // 3. Draw Ambient Floating Dust Particles
        ambientRef.current.forEach(pt => {
          pt.y -= pt.speed;
          if (pt.y < 0) pt.y = canvas.height;

          ctx.beginPath();
          ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
          ctx.fillStyle = activeBoardObj.pinColor;
          ctx.globalAlpha = pt.alpha * 0.4;
          ctx.fill();
        });
        ctx.globalAlpha = 1.0;

        // 4. Draw Outer Frame Border
        ctx.strokeStyle = activeBoardObj.pinColor;
        ctx.lineWidth = 4;
        ctx.shadowColor = activeBoardObj.pinColor;
        ctx.shadowBlur = 12;
        ctx.strokeRect(2, 2, canvas.width - 4, canvas.height - 4);
        ctx.shadowBlur = 0;

        // 5. Update & Draw Pegs
        pinsRef.current.forEach(pin => {
          if (pin.hitGlow > 0) pin.hitGlow -= 1;

          ctx.beginPath();
          ctx.arc(pin.x, pin.y, 4.2, 0, Math.PI * 2);

          if (pin.hitGlow > 0) {
            ctx.fillStyle = '#ffffff';
            ctx.shadowColor = '#ffffff';
            ctx.shadowBlur = 18;
          } else {
            ctx.fillStyle = activeBoardObj.pinColor;
            ctx.shadowColor = activeBoardObj.pinColor;
            ctx.shadowBlur = 6;
          }
          ctx.fill();
          ctx.shadowBlur = 0;
        });

        // 6. Update & Draw Collision Burst Particles
        const remainingParticles: Particle[] = [];
        particlesRef.current.forEach(pt => {
          pt.x += pt.vx;
          pt.y += pt.vy;
          pt.life++;

          if (pt.life < pt.maxLife) {
            ctx.beginPath();
            ctx.arc(pt.x, pt.y, pt.radius * (1 - pt.life / pt.maxLife), 0, Math.PI * 2);
            ctx.fillStyle = pt.color;
            ctx.fill();
            remainingParticles.push(pt);
          }
        });
        particlesRef.current = remainingParticles;

        // 7. Update & Draw Balls
        const remainingBalls: PlinkoBall[] = [];

        ballsRef.current.forEach(ball => {
          ball.vy += 0.25; // realistic gravity acceleration
          ball.x += ball.vx;
          ball.y += ball.vy;

          // Maintain Trail History
          ball.trail.push({ x: ball.x, y: ball.y });
          if (ball.trail.length > 10) ball.trail.shift();

          // Render Light Trail
          ball.trail.forEach((t, i) => {
            ctx.beginPath();
            ctx.arc(t.x, t.y, ball.radius * (i / 10), 0, Math.PI * 2);
            ctx.fillStyle = ball.glow;
            ctx.globalAlpha = i / 12;
            ctx.fill();
          });
          ctx.globalAlpha = 1.0;

          // Check Peg Collisions
          pinsRef.current.forEach(pin => {
            const dx = ball.x - pin.x;
            const dy = ball.y - pin.y;
            const dist = Math.hypot(dx, dy);

            if (dist < ball.radius + 4.2) {
              pin.hitGlow = 10;
              synth.playTick();
              spawnHitParticles(pin.x, pin.y, ball.color);

              // Soft haptic feedback
              if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
                try { window.navigator.vibrate(8); } catch { /* ignore */ }
              }

              const angle = Math.atan2(dy, dx);
              const bouncePower = 2.4;
              ball.vx = Math.cos(angle) * bouncePower + (Math.random() - 0.5) * 0.9;
              ball.vy = Math.sin(angle) * bouncePower * 0.8;
            }
          });

          // Check Side Bounds Collision
          if (ball.x - ball.radius < 10) {
            ball.x = 10 + ball.radius;
            ball.vx = Math.abs(ball.vx) * 0.7;
          } else if (ball.x + ball.radius > canvas.width - 10) {
            ball.x = canvas.width - 10 - ball.radius;
            ball.vx = -Math.abs(ball.vx) * 0.7;
          }

          // Check Bottom Landing Slots
          if (ball.y >= 355) {
            const slotWidth = (canvas.width - 16) / slots.length;
            const slotIdx = Math.min(
              slots.length - 1, 
              Math.max(0, Math.floor((ball.x - 8) / slotWidth))
            );
            const mult = slots[slotIdx];
            const winCoins = Math.floor(coinsToPay * mult);

            if (mult >= 3.0) {
              synth.playFanfare();
            } else {
              synth.playCoin();
            }

            if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
              try { window.navigator.vibrate(25); } catch { /* ignore */ }
            }

            onGameWin(winCoins, mult);

            // Add floating reward text
            setFloatingRewards(prev => [
              ...prev,
              { id: Date.now(), text: `+${winCoins.toLocaleString()} 🪙 (${mult}x)`, color: mult >= 3 ? '#fbbf24' : '#38bdf8' }
            ]);

          } else {
            remainingBalls.push(ball);
          }

          // Draw Ball Body
          ctx.beginPath();
          ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
          ctx.fillStyle = ball.color;
          ctx.shadowColor = ball.color;
          ctx.shadowBlur = 14;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Ball Inner Highlight
          ctx.beginPath();
          ctx.arc(ball.x - 1.5, ball.y - 1.5, ball.radius * 0.35, 0, Math.PI * 2);
          ctx.fillStyle = '#ffffff';
          ctx.globalAlpha = 0.6;
          ctx.fill();
          ctx.globalAlpha = 1.0;
        });

        ballsRef.current = remainingBalls;

        // 8. Draw Multiplier Buckets at Bottom
        const bucketMargin = 8;
        const slotWidth = (canvas.width - bucketMargin * 2) / slots.length;

        slots.forEach((m, idx) => {
          const x = bucketMargin + idx * slotWidth;
          const bucketHeight = 32;
          const y = canvas.height - bucketHeight - 6;

          ctx.beginPath();
          ctx.roundRect(x + 1.5, y, slotWidth - 3, bucketHeight, 8);

          ctx.fillStyle = m >= 10 
            ? '#eab308' 
            : m >= 3 
            ? '#a855f7' 
            : m >= 1 
            ? '#06b6d4' 
            : '#3f3f46';

          ctx.shadowColor = ctx.fillStyle;
          ctx.shadowBlur = 6;
          ctx.fill();
          ctx.shadowBlur = 0;

          // Bucket Multiplier Text
          ctx.fillStyle = '#ffffff';
          ctx.font = 'bold 10px monospace';
          ctx.textAlign = 'center';
          ctx.fillText(`${m}x`, x + slotWidth / 2, y + 20);
        });

        requestRef.current = requestAnimationFrame(render);
      };

      requestRef.current = requestAnimationFrame(render);
    };

    startRenderLoop();

    return () => {
      isSubscribed = false;
      if (requestRef.current) {
        cancelAnimationFrame(requestRef.current);
        requestRef.current = null;
      }
    };
  }, [currentPage, activeBoardId, activeBallId, coinsToPay]);

  // Execute Equip Board
  const handleEquipBoard = (boardId: string) => {
    synth.playClick();
    setActiveBoardId(boardId);
    setCurrentPage('game');
  };

  // Execute Equip Ball
  const handleEquipBall = (ballId: string) => {
    synth.playClick();
    setActiveBallId(ballId);
    setCurrentPage('game');
  };

  // Execute Purchase Board Flow
  const handlePurchaseBoard = (b: PlinkoBoard) => {
    if (!validateAndDeductCoins(b.price, `Diamond Plinko Board: ${b.name}`)) {
      return;
    }

    synth.playChestOpen();

    setUnlockedBoards(prev => [...prev, b.id]);
    setActiveBoardId(b.id);
    setConfirmBoard(null);

    // Show Lightweight Success Popup & Auto return after 1.8 seconds
    setSuccessMessage({
      title: `Purchase Successful!`,
      subtitle: `${b.name} Unlocked & Equipped.`,
    });

    setTimeout(() => {
      setSuccessMessage(null);
      setCurrentPage('game');
    }, 1800);
  };

  // Execute Purchase Ball Flow
  const handlePurchaseBall = (ball: PlinkoBallConfig) => {
    if (!validateAndDeductCoins(ball.price, `Diamond Plinko Ball: ${ball.name}`)) {
      return;
    }

    synth.playChestOpen();

    setUnlockedBalls(prev => [...prev, ball.id]);
    setActiveBallId(ball.id);
    setConfirmBall(null);

    // Show Lightweight Success Popup & Auto return after 1.8 seconds
    setSuccessMessage({
      title: `Purchase Successful!`,
      subtitle: `${ball.name} Unlocked & Equipped.`,
    });

    setTimeout(() => {
      setSuccessMessage(null);
      setCurrentPage('game');
    }, 1800);
  };

  // Quick Bet Selectors
  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(5000, coins));
  };

  return (
    <div className="relative min-h-screen max-w-xl mx-auto p-4 space-y-5 text-white select-none font-sans overflow-x-hidden">
      
      {/* Floating Rewards Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingRewards.map(reward => (
          <motion.div
            key={reward.id}
            initial={{ opacity: 1, y: '50vh', x: '50vw', scale: 0.8 }}
            animate={{ opacity: 0, y: '35vh', scale: 1.3 }}
            transition={{ duration: 1.8 }}
            className="absolute -translate-x-1/2 -translate-y-1/2 text-base font-black font-mono shadow-2xl px-4 py-2 rounded-2xl bg-black/80 border border-white/20"
            style={{ color: reward.color }}
          >
            {reward.text}
          </motion.div>
        ))}
      </div>

      {/* LIGHTWEIGHT SUCCESS POPUP WITH GLOW & SPARKLES */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-b from-zinc-900 via-zinc-950 to-black p-6 rounded-3xl border-2 border-emerald-400 text-center space-y-3 max-w-xs w-full shadow-[0_0_50px_rgba(52,211,153,0.5)] relative overflow-hidden">
              <div className="flex justify-center items-center">
                <div className="h-14 w-14 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-400 text-3xl shadow-lg animate-bounce">
                  <Check className="h-8 w-8 stroke-[3]" />
                </div>
              </div>
              <h3 className="text-sm font-black text-emerald-300 uppercase tracking-wider">
                {successMessage.title}
              </h3>
              <p className="text-xs text-gray-200 font-bold leading-relaxed">
                {successMessage.subtitle}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence mode="wait">
        {currentPage === 'game' && (
          /* ==========================================
             MAIN GAME SCREEN
             ========================================== */
          <motion.div
            key="game-screen"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            className="space-y-4"
          >
            {/* Header Navigation */}
            <div className="bg-zinc-950/80 p-4 rounded-3xl border border-white/10 backdrop-blur-xl flex items-center justify-between shadow-2xl">
              <div className="flex items-center gap-3">
                <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 p-0.5 shadow-lg flex items-center justify-center">
                  <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl">
                    🎯
                  </div>
                </div>
                <div>
                  <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-blue-300">
                    Diamond Plinko
                  </h1>
                  <p className="text-[10px] text-gray-400 font-bold">
                    Board: <span className="text-cyan-300">{activeBoardObj.name}</span> • Ball: <span className="text-amber-300">{activeBallObj.name}</span>
                  </p>
                </div>
              </div>

              {/* Navigation Store Buttons */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => { synth.playClick(); setCurrentPage('boards'); }}
                  className="px-3 py-2 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-[11px] font-black text-cyan-300 flex items-center gap-1.5 hover:bg-cyan-500/30 active:scale-95 transition cursor-pointer"
                >
                  <Layers className="h-3.5 w-3.5" />
                  <span>Boards</span>
                </button>
                <button
                  onClick={() => { synth.playClick(); setCurrentPage('balls'); }}
                  className="px-3 py-2 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-[11px] font-black text-amber-300 flex items-center gap-1.5 hover:bg-amber-500/30 active:scale-95 transition cursor-pointer"
                >
                  <ShoppingBag className="h-3.5 w-3.5" />
                  <span>Balls</span>
                </button>
              </div>
            </div>

            {/* Plinko Board Canvas Container */}
            <div className={`p-2.5 rounded-3xl bg-gradient-to-b ${activeBoardObj.frameGradient} border-2 border-white/20 shadow-2xl relative overflow-hidden backdrop-blur-xl`}>
              <canvas
                ref={canvasRef}
                width={400}
                height={400}
                className="w-full aspect-square rounded-2xl block bg-black"
              />
            </div>

            {/* Drop Ball Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleDropBall}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-black font-black text-sm uppercase tracking-widest shadow-2xl shadow-cyan-500/30 flex items-center justify-center gap-2 cursor-pointer transition"
            >
              <Play className="h-5 w-5 fill-current" />
              <span>▶ DROP BALL ({activeBallObj.name})</span>
            </motion.button>

            {/* Coins to Pay Controls Card */}
            <div className="bg-zinc-950/90 p-4 rounded-3xl border border-white/10 space-y-3">
              <div className="flex justify-between items-center text-xs font-black">
                <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
                <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <input
                  type="number"
                  value={coinsToPay}
                  onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
                  className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-amber-300 focus:border-cyan-400 outline-none"
                />

                <div className="grid grid-cols-4 gap-1.5">
                  <button
                    onClick={() => setQuickCoins('min')}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition cursor-pointer"
                  >
                    Min
                  </button>
                  <button
                    onClick={() => setQuickCoins('half')}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition cursor-pointer"
                  >
                    /2
                  </button>
                  <button
                    onClick={() => setQuickCoins('double')}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition cursor-pointer"
                  >
                    x2
                  </button>
                  <button
                    onClick={() => setQuickCoins('max')}
                    className="py-2.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition cursor-pointer"
                  >
                    Max
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'boards' && (
          /* ==========================================
             UNLOCKABLE BOARDS STORE PAGE
             ========================================== */
          <motion.div
            key="boards-screen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button
                onClick={() => { synth.playClick(); setCurrentPage('game'); }}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-cyan-400 text-cyan-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Game</span>
              </button>

              <div className="text-right">
                <span className="block text-[10px] font-black text-gray-400 uppercase">Available Coins</span>
                <span className="text-xs font-black text-amber-400 font-mono">🪙 {coins.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-zinc-950/90 p-5 rounded-3xl border border-cyan-500/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <Layers className="h-5 w-5 text-cyan-400" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-cyan-300">
                    Select Plinko Board
                  </h2>
                  <p className="text-[10px] text-gray-400">Unique themes & lighting (50 – 150 Coins)</p>
                </div>
              </div>

              {/* LIST OF BOARDS - EACH BOARD APPEARS EXACTLY ONCE */}
              <div className="grid grid-cols-1 gap-3 max-h-[65vh] overflow-y-auto pr-1">
                {PLINKO_BOARDS.map(board => {
                  const isUnlocked = unlockedBoards.includes(board.id);
                  const isEquipped = activeBoardId === board.id;

                  return (
                    <div
                      key={board.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isEquipped
                          ? 'bg-cyan-950/70 border-2 border-cyan-400 text-white shadow-[0_0_25px_rgba(6,182,212,0.3)]'
                          : isUnlocked
                          ? 'bg-zinc-900/90 border-white/10 text-gray-300 hover:border-cyan-500/40'
                          : 'bg-zinc-950/80 border-white/5 opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl shadow">
                          {board.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-2">
                            <span>{board.name}</span>
                            {isEquipped && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1">
                                <Check className="h-3 w-3" /> EQUIPPED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{board.desc}</p>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">
                            {board.price === 0 ? 'Free' : `${board.price} Coins`}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="text-emerald-400 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/30">
                            <Check className="h-4 w-4 stroke-[3]" />
                            <span>Equipped</span>
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleEquipBoard(board.id)}
                            className="px-4 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/50 text-cyan-300 text-xs font-black uppercase hover:bg-cyan-500/30 transition cursor-pointer"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmBoard(board)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow cursor-pointer"
                          >
                            Buy {board.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {currentPage === 'balls' && (
          /* ==========================================
             UNLOCKABLE BALLS STORE PAGE
             ========================================== */
          <motion.div
            key="balls-screen"
            initial={{ opacity: 0, x: 15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -15 }}
            className="space-y-4"
          >
            {/* Top Back Navigation Bar */}
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <button
                onClick={() => { synth.playClick(); setCurrentPage('game'); }}
                className="px-4 py-2.5 rounded-2xl bg-zinc-900 border border-white/10 hover:border-amber-400 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-2 transition cursor-pointer shadow-md"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Game</span>
              </button>

              <div className="text-right">
                <span className="block text-[10px] font-black text-gray-400 uppercase">Available Coins</span>
                <span className="text-xs font-black text-amber-400 font-mono">🪙 {coins.toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-zinc-950/90 p-5 rounded-3xl border border-amber-500/30 space-y-4">
              <div className="flex items-center gap-2 border-b border-white/5 pb-3">
                <ShoppingBag className="h-5 w-5 text-amber-400" />
                <div>
                  <h2 className="text-sm font-black uppercase tracking-wider text-amber-300">
                    Select Plinko Ball
                  </h2>
                  <p className="text-[10px] text-gray-400">Unique material & glow effects (50 – 150 Coins)</p>
                </div>
              </div>

              {/* LIST OF BALLS - EACH BALL APPEARS EXACTLY ONCE */}
              <div className="grid grid-cols-1 gap-3 max-h-[65vh] overflow-y-auto pr-1">
                {PLINKO_BALLS.map(ball => {
                  const isUnlocked = unlockedBalls.includes(ball.id);
                  const isEquipped = activeBallId === ball.id;

                  return (
                    <div
                      key={ball.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isEquipped
                          ? 'bg-amber-950/70 border-2 border-amber-400 text-white shadow-[0_0_25px_rgba(245,158,11,0.3)]'
                          : isUnlocked
                          ? 'bg-zinc-900/90 border-white/10 text-gray-300 hover:border-amber-500/40'
                          : 'bg-zinc-950/80 border-white/5 opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-full bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl shadow">
                          {ball.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-2">
                            <span>{ball.name}</span>
                            {isEquipped && (
                              <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-400/40 px-2 py-0.5 rounded-full font-black uppercase flex items-center gap-1">
                                <Check className="h-3 w-3" /> EQUIPPED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{ball.desc}</p>
                          <span className="text-[10px] font-mono text-amber-400 font-bold block mt-0.5">
                            {ball.price === 0 ? 'Free' : `${ball.price} Coins`}
                          </span>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <div className="text-emerald-400 text-xs font-black flex items-center gap-1 bg-emerald-500/10 px-3 py-1.5 rounded-xl border border-emerald-400/30">
                            <Check className="h-4 w-4 stroke-[3]" />
                            <span>Equipped</span>
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => handleEquipBall(ball.id)}
                            className="px-4 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase hover:bg-amber-500/30 transition cursor-pointer"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmBall(ball)}
                            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow cursor-pointer"
                          >
                            Buy {ball.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG: BOARD */}
      <AnimatePresence>
        {confirmBoard && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-cyan-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl animate-pulse">{confirmBoard.previewEmoji}</div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Purchase {confirmBoard.name} for {confirmBoard.price} Coins?
              </h3>
              <p className="text-xs text-gray-400">
                Design: <span className="text-cyan-300 font-bold">{confirmBoard.name}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmBoard(null)}
                  className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black text-gray-300 uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseBoard(confirmBoard)}
                  className="py-3 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-xs font-black uppercase shadow-lg transition cursor-pointer"
                >
                  Purchase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION DIALOG: BALL */}
      <AnimatePresence>
        {confirmBall && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl animate-pulse">{confirmBall.previewEmoji}</div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Purchase {confirmBall.name} for {confirmBall.price} Coins?
              </h3>
              <p className="text-xs text-gray-400">
                Ball: <span className="text-amber-300 font-bold">{confirmBall.name}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmBall(null)}
                  className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black text-gray-300 uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseBall(confirmBall)}
                  className="py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase shadow-lg transition cursor-pointer"
                >
                  Purchase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
