/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Gift, Sparkles, RefreshCw, Clock, Award, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UserProfile } from '../types';
import { synth } from '../utils/audioSynth';

interface DailyRewardsModalProps {
  profile: UserProfile;
  onClose: () => void;
  onUpdateWallet: (amount: number, currency: 'coins' | 'diamonds', type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward', title?: string) => void;
  onAwardXP: (amount: number) => void;
}

const DAILY_SCHEDULE = [
  { day: 1, reward: 500, type: 'coins' as const },
  { day: 2, reward: 1000, type: 'coins' as const },
  { day: 3, reward: 15, type: 'diamonds' as const },
  { day: 4, reward: 2000, type: 'coins' as const },
  { day: 5, reward: 30, type: 'diamonds' as const },
  { day: 6, reward: 3500, type: 'coins' as const },
  { day: 7, reward: 5000, type: 'coins' as const, isChest: true },
];

interface WheelSlice {
  text: string;
  val: number;
  type: 'coins' | 'diamonds' | 'xp';
  color: string;
  gradId: string;
}

interface Particle {
  id: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  scale: number;
  alpha: number;
}

export default function DailyRewardsModal({
  profile,
  onClose,
  onUpdateWallet,
  onAwardXP,
}: DailyRewardsModalProps) {
  const [streak, setStreak] = useState<number>(1);
  const [hasClaimedToday, setHasClaimedToday] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string>('');
  
  // Free spins count & timer
  const [freeSpinsLeft, setFreeSpinsLeft] = useState<number>(3);
  const [nextSpinReset, setNextSpinReset] = useState<number>(0);
  const [timeLeftStr, setTimeLeftStr] = useState<string>('24:00:00');

  // Lucky spin states
  const [spinning, setSpinning] = useState(false);
  const [spinAngle, setSpinAngle] = useState(0);
  const [spinResult, setSpinResult] = useState<string>('');
  const [pointerWiggle, setPointerWiggle] = useState(false);
  const [ledFlash, setLedFlash] = useState(false);

  // Particle explosion state
  const [particles, setParticles] = useState<Particle[]>([]);
  const animationFrameRef = useRef<number | null>(null);

  // Wheel slices specification
  const slices: WheelSlice[] = [
    { text: '500 🪙', val: 500, type: 'coins', color: '#dc2626', gradId: 'slice_red' },
    { text: '5 💎', val: 5, type: 'diamonds', color: '#7c3aed', gradId: 'slice_purple' },
    { text: '1,000 🪙', val: 1000, type: 'coins', color: '#2563eb', gradId: 'slice_blue' },
    { text: '10 💎', val: 10, type: 'diamonds', color: '#db2777', gradId: 'slice_pink' },
    { text: '2,500 🪙', val: 2500, type: 'coins', color: '#059669', gradId: 'slice_emerald' },
    { text: '20 💎', val: 20, type: 'diamonds', color: '#d97706', gradId: 'slice_orange' },
    { text: '5,000 👑', val: 5000, type: 'coins', color: '#b45309', gradId: 'slice_gold' },
    { text: '100 XP ⚡', val: 100, type: 'xp', color: '#4b5563', gradId: 'slice_gray' },
  ];

  useEffect(() => {
    // Restore claim state from localstorage
    const lastClaim = localStorage.getItem('sg_last_claim');
    const claimStreak = localStorage.getItem('sg_claim_streak');
    
    if (claimStreak) {
      setStreak(parseInt(claimStreak));
    }
    
    if (lastClaim) {
      const lastDate = new Date(lastClaim).toDateString();
      const todayDate = new Date().toDateString();
      if (lastDate === todayDate) {
        setHasClaimedToday(true);
      }
    }

    // Load free spins left & next reset time
    const savedLeft = localStorage.getItem('sg_free_spins_left');
    const savedReset = localStorage.getItem('sg_free_spins_reset');
    
    let spins = 3;
    let resetTime = Date.now() + 24 * 60 * 60 * 1000;
    
    if (savedReset) {
      const parsedReset = parseInt(savedReset);
      if (Date.now() > parsedReset) {
        // Next 24 hour cycle resets
        localStorage.setItem('sg_free_spins_left', '3');
        localStorage.setItem('sg_free_spins_reset', (Date.now() + 24 * 60 * 60 * 1000).toString());
        spins = 3;
        resetTime = Date.now() + 24 * 60 * 60 * 1000;
      } else {
        spins = savedLeft ? parseInt(savedLeft) : 3;
        resetTime = parsedReset;
      }
    } else {
      localStorage.setItem('sg_free_spins_left', '3');
      localStorage.setItem('sg_free_spins_reset', resetTime.toString());
    }
    
    setFreeSpinsLeft(spins);
    setNextSpinReset(resetTime);

    // Neon LEDs flashing interval
    const ledTimer = setInterval(() => {
      setLedFlash((prev) => !prev);
    }, 280);

    return () => {
      clearInterval(ledTimer);
    };
  }, []);

  // Timer loop for countdown
  useEffect(() => {
    const timer = setInterval(() => {
      if (nextSpinReset > 0) {
        const diff = nextSpinReset - Date.now();
        if (diff <= 0) {
          localStorage.setItem('sg_free_spins_left', '3');
          localStorage.setItem('sg_free_spins_reset', (Date.now() + 24 * 60 * 60 * 1000).toString());
          setFreeSpinsLeft(3);
          setNextSpinReset(Date.now() + 24 * 60 * 60 * 1000);
          setTimeLeftStr('24:00:00');
        } else {
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          const secs = Math.floor((diff % (1000 * 60)) / 1000);
          setTimeLeftStr(
            `${hrs.toString().padStart(2, '0')}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
          );
        }
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [nextSpinReset]);

  // Particle animation tick loop
  useEffect(() => {
    if (particles.length > 0) {
      const updateParticles = () => {
        setParticles((prev) =>
          prev
            .map((p) => ({
              ...p,
              x: p.x + p.vx,
              y: p.y + p.vy,
              vy: p.vy + 0.15, // gravity
              alpha: p.alpha - 0.016, // fade out
            }))
            .filter((p) => p.alpha > 0)
        );
        animationFrameRef.current = requestAnimationFrame(updateParticles);
      };
      animationFrameRef.current = requestAnimationFrame(updateParticles);
    } else {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
    }
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [particles]);

  const handleClaimReward = () => {
    if (hasClaimedToday) return;

    const todayIndex = (streak - 1) % 7;
    const currentReward = DAILY_SCHEDULE[todayIndex];

    onUpdateWallet(currentReward.reward, currentReward.type, 'reward', `Daily Bonus: Day ${streak}`);
    onAwardXP(100);

    const nextStreak = streak === 7 ? 1 : streak + 1;
    localStorage.setItem('sg_last_claim', new Date().toISOString());
    localStorage.setItem('sg_claim_streak', nextStreak.toString());

    setStreak(nextStreak);
    setHasClaimedToday(true);
    setSuccessMsg(`Consecutive Day ${streak} secured: +${currentReward.reward.toLocaleString()} ${currentReward.type.toUpperCase()} & +100 XP!`);
    synth.playCoin();
    
    setTimeout(() => setSuccessMsg(''), 5000);
  };

  const explodeParticles = () => {
    const colors = ['#f59e0b', '#fbbf24', '#fef08a', '#10b981', '#3b82f6', '#ec4899', '#ffffff'];
    const newParticles: Particle[] = [];
    for (let i = 0; i < 50; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      newParticles.push({
        id: Date.now() + i + Math.random(),
        x: 0,
        y: -10, // slightly offset up
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed - 1.5, // push upwards
        color: colors[Math.floor(Math.random() * colors.length)],
        scale: 0.5 + Math.random() * 1.2,
        alpha: 1.0,
      });
    }
    setParticles(newParticles);
  };

  const handleLuckySpin = () => {
    if (spinning) return;
    if (freeSpinsLeft <= 0) return;

    // Deduct one spin
    const nextSpins = freeSpinsLeft - 1;
    setFreeSpinsLeft(nextSpins);
    localStorage.setItem('sg_free_spins_left', nextSpins.toString());

    setSpinning(true);
    setSpinResult('');
    synth.playClick();

    // Determine slice index
    const targetSliceIndex = Math.floor(Math.random() * slices.length);
    const targetSlice = slices[targetSliceIndex];

    // Compute rotation degrees (each slice takes 45deg, let's offset to align perfectly)
    const degreesPerSlice = 360 / slices.length;
    // Add 8 full spins + align to center of the slice
    const spinBase = (360 * 8) - (targetSliceIndex * degreesPerSlice);
    
    setSpinAngle(spinBase);

    // Physics sound ticks (Wobbling pointer clicks at decreasing intervals)
    const totalSteps = 45;
    for (let i = 0; i < totalSteps; i++) {
      // Quadratic easing deceleration delay curve
      const delay = Math.pow(i / totalSteps, 2.2) * 4500;
      setTimeout(() => {
        synth.playClick();
        setPointerWiggle(true);
        setTimeout(() => setPointerWiggle(false), 90);
      }, delay);
    }

    setTimeout(() => {
      setSpinning(false);
      // Award delivery
      if (targetSlice.type === 'coins') {
        onUpdateWallet(targetSlice.val, 'coins', 'reward', 'Royal Lucky Wheel');
        synth.playCoin();
      } else if (targetSlice.type === 'diamonds') {
        onUpdateWallet(targetSlice.val, 'diamonds', 'reward', 'Royal Lucky Wheel');
        synth.playCoin();
      } else {
        onAwardXP(targetSlice.val);
        synth.playCoin();
      }

      setSpinResult(`You secured: ${targetSlice.text}!`);
      explodeParticles();
    }, 4500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm shadow-2xl" id="rewards_modal">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl glass-modal text-white shadow-2xl border border-white/5">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-500/10 text-amber-500">
              <Gift className="h-5 w-5" />
            </div>
            <h3 className="text-sm sm:text-base font-black tracking-tight uppercase">Daily Loyalty Rewards</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Modal Content container */}
        <div className="p-6 space-y-6 max-h-[500px] overflow-y-auto">
          
          {/* Success message banner */}
          {successMsg && (
            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-2xl text-xs font-semibold leading-relaxed shadow-lg">
              {successMsg}
            </div>
          )}

          {/* Loyalty calendar check-in list */}
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <p className="font-black text-gray-500 uppercase tracking-widest">7-Day Check-in Streak</p>
              <span className="text-amber-400 font-black uppercase tracking-wider">Streak: Day {streak}</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {DAILY_SCHEDULE.map((d, idx) => {
                const isClaimable = idx === (streak - 1) % 7 && !hasClaimedToday;
                const isCompleted = idx < (streak - 1) % 7 || (idx === (streak - 1) % 7 && hasClaimedToday);
                
                return (
                  <div 
                    key={d.day} 
                    className={`relative p-2.5 rounded-xl border text-center transition flex flex-col items-center justify-between min-h-[90px] ${
                      isCompleted 
                        ? 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400 shadow-inner' 
                        : isClaimable 
                          ? 'border-amber-500 bg-amber-500/5 animate-pulse text-white font-extrabold shadow-md' 
                          : 'bg-white/3 border-white/5 text-gray-500'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase">Day {d.day}</span>
                    <span className="text-xl my-1">{d.isChest ? '🎁' : d.type === 'coins' ? '🪙' : '💎'}</span>
                    <span className="text-[9px] font-black leading-none truncate max-w-full">
                      {d.reward.toLocaleString()}{d.type === 'coins' ? '' : 'd'}
                    </span>
                  </div>
                );
              })}
            </div>

            <button
              onClick={handleClaimReward}
              disabled={hasClaimedToday}
              className={`w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider transition ${
                hasClaimedToday 
                  ? 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5' 
                  : 'bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-lg shadow-red-600/20 hover:scale-[1.01] active:scale-95'
              }`}
            >
              {hasClaimedToday ? 'Bonus Claimed' : 'Check-in & Claim Daily Gift'}
            </button>
          </div>

          <hr className="border-white/5" />

          {/* Redesigned Casino-Style lucky wheel */}
          <div className="space-y-4">
            <div className="text-center space-y-1">
              <h4 className="text-sm font-black tracking-tight uppercase flex items-center justify-center gap-1.5 text-amber-400">
                <Sparkles className="h-4.5 w-4.5 text-amber-400 animate-pulse" />
                Royal Gold Casino Wheel
              </h4>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                Claim up to 5,000 Coins or rare diamonds!
              </p>
            </div>

            <div className="relative flex flex-col items-center justify-center py-6 bg-zinc-950/40 rounded-3xl border border-white/5 shadow-inner p-4 overflow-hidden">
              
              {/* Particle Render Canvas */}
              {particles.length > 0 && (
                <div className="absolute inset-0 pointer-events-none z-30" style={{ transformStyle: 'preserve-3d' }}>
                  {particles.map((p) => (
                    <div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        left: `calc(50% + ${p.x}px)`,
                        top: `calc(50% + ${p.y}px)`,
                        width: `${p.scale * 6}px`,
                        height: `${p.scale * 6}px`,
                        backgroundColor: p.color,
                        opacity: p.alpha,
                        boxShadow: `0 0 6px ${p.color}`,
                        transform: 'translate(-50%, -50%)',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Physical clicking pointer needle at the top */}
              <div 
                className="absolute top-[16px] z-20 transition-transform duration-75 origin-top drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]"
                style={{ 
                  transform: `translateX(-50%) rotate(${pointerWiggle ? '-14deg' : '0deg'})`,
                  left: '50%'
                }}
              >
                {/* Visual red glass pointer with gold support */}
                <svg width="24" height="36" viewBox="0 0 24 36">
                  <path d="M12 0 L24 24 L16 24 L12 36 L8 24 L0 24 Z" fill="#ef4444" stroke="#f59e0b" strokeWidth="1.5" />
                  <circle cx="12" cy="12" r="3" fill="#ffffff" />
                </svg>
              </div>

              {/* Casino Gold & Neon Wheel Ring */}
              <div className="relative p-3 bg-gradient-to-tr from-amber-600 via-yellow-400 to-amber-800 rounded-full shadow-[0_0_25px_rgba(245,158,11,0.25)] border-4 border-amber-900/40 flex items-center justify-center">
                
                {/* Flashing Neon bulbs surrounding outer rim */}
                <div className="absolute inset-0 rounded-full pointer-events-none">
                  {[...Array(16)].map((_, i) => {
                    const ang = (i * 360) / 16;
                    // Alternating flash pattern
                    const isLit = ledFlash ? (i % 2 === 0) : (i % 2 !== 0);
                    return (
                      <div
                        key={i}
                        className={`absolute rounded-full h-1.5 w-1.5 transition-colors duration-150 -translate-x-1/2 -translate-y-1/2`}
                        style={{
                          left: `calc(50% + ${Math.cos((ang * Math.PI) / 180) * 48.5}%)`,
                          top: `calc(50% + ${Math.sin((ang * Math.PI) / 180) * 48.5}%)`,
                          backgroundColor: isLit ? '#34d399' : '#1e293b',
                          boxShadow: isLit ? '0 0 6px #34d399, 0 0 10px #34d399' : 'none',
                        }}
                      />
                    );
                  })}
                </div>

                {/* Inner Canvas Wheel Body */}
                <div className="relative h-48 w-48 rounded-full bg-zinc-950 overflow-hidden border border-amber-500/20 shadow-inner">
                  <div 
                    className="absolute inset-0 transition-transform duration-[4500ms]"
                    style={{ 
                      transform: `rotate(${spinAngle}deg)`,
                      transitionTimingFunction: 'cubic-bezier(0.12, 0.8, 0.15, 1)' // Easing curves
                    }}
                  >
                    <svg viewBox="0 0 200 200" className="w-full h-full">
                      {/* Gradients declarations for segments */}
                      <defs>
                        <linearGradient id="slice_red" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7f1d1d" />
                          <stop offset="100%" stopColor="#ef4444" />
                        </linearGradient>
                        <linearGradient id="slice_purple" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#4c1d95" />
                          <stop offset="100%" stopColor="#8b5cf6" />
                        </linearGradient>
                        <linearGradient id="slice_blue" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1e3a8a" />
                          <stop offset="100%" stopColor="#3b82f6" />
                        </linearGradient>
                        <linearGradient id="slice_pink" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#831843" />
                          <stop offset="100%" stopColor="#ec4899" />
                        </linearGradient>
                        <linearGradient id="slice_emerald" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#064e3b" />
                          <stop offset="100%" stopColor="#10b981" />
                        </linearGradient>
                        <linearGradient id="slice_orange" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#7c2d12" />
                          <stop offset="100%" stopColor="#f97316" />
                        </linearGradient>
                        <linearGradient id="slice_gold" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#78350f" />
                          <stop offset="100%" stopColor="#f59e0b" />
                        </linearGradient>
                        <linearGradient id="slice_gray" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#1f2937" />
                          <stop offset="100%" stopColor="#6b7280" />
                        </linearGradient>
                        
                        <radialGradient id="inner_hub" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#fef08a" />
                          <stop offset="70%" stopColor="#f59e0b" />
                          <stop offset="100%" stopColor="#78350f" />
                        </radialGradient>
                      </defs>

                      {/* Slice Paths */}
                      {slices.map((sl, idx) => {
                        const startAng = idx * 45;
                        const endAng = (idx + 1) * 45;
                        const radStart = ((startAng - 90) * Math.PI) / 180;
                        const radEnd = ((endAng - 90) * Math.PI) / 180;
                        
                        // coordinates for SVG slice path
                        const x1 = 100 + 100 * Math.cos(radStart);
                        const y1 = 100 + 100 * Math.sin(radStart);
                        const x2 = 100 + 100 * Math.cos(radEnd);
                        const y2 = 100 + 100 * Math.sin(radEnd);
                        
                        return (
                          <g key={idx}>
                            <path
                              d={`M100,100 L${x1},${y1} A100,100 0 0,1 ${x2},${y2} Z`}
                              fill={`url(#${sl.gradId})`}
                              stroke="#f59e0b"
                              strokeWidth="0.8"
                            />
                            {/* Rotated text */}
                            <text
                              x="100"
                              y="38"
                              transform={`rotate(${startAng + 22.5} 100 100)`}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontWeight="900"
                              fontSize="8"
                              letterSpacing="0.3"
                              style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}
                            >
                              {sl.text}
                            </text>
                          </g>
                        );
                      })}
                    </svg>
                  </div>

                  {/* Shiny Central glass Gold Hub */}
                  <div className="absolute inset-0 m-auto h-12 w-12 rounded-full bg-gradient-to-tr from-amber-600 via-yellow-300 to-amber-800 border border-amber-400 flex items-center justify-center text-[10px] font-black text-black tracking-widest drop-shadow-lg shadow-[0_2px_10px_rgba(0,0,0,0.6)]">
                    GOLD
                  </div>
                </div>
              </div>

              {spinResult && (
                <div className="mt-4 px-4 py-2 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-black animate-bounce text-center shadow-lg">
                  🎉 {spinResult}
                </div>
              )}

              {/* Status & Spins info */}
              <div className="mt-4 w-full max-w-xs flex flex-col items-center gap-3">
                <div className="flex justify-between items-center w-full px-4 text-xs font-bold text-gray-400">
                  <span className="flex items-center gap-1">
                    <Award className="h-4 w-4 text-amber-400" />
                    Spins Left: <span className="text-white font-extrabold">{freeSpinsLeft}/3</span>
                  </span>
                  
                  {freeSpinsLeft === 0 && (
                    <span className="flex items-center gap-1 text-[10px] text-gray-500 uppercase">
                      <Clock className="h-3.5 w-3.5" />
                      Reset in: {timeLeftStr}
                    </span>
                  )}
                </div>

                <button
                  type="button"
                  onClick={handleLuckySpin}
                  disabled={spinning || freeSpinsLeft <= 0}
                  className={`w-full py-3 rounded-xl flex items-center justify-center gap-1.5 font-extrabold text-xs uppercase tracking-wider transition ${
                    freeSpinsLeft > 0 && !spinning
                      ? 'bg-gradient-to-r from-red-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white shadow-lg shadow-red-600/20 hover:scale-[1.01]'
                      : 'bg-white/5 text-gray-500 cursor-not-allowed border border-white/5'
                  }`}
                >
                  <RefreshCw className={`h-3.5 w-3.5 ${spinning ? 'animate-spin' : ''}`} />
                  {spinning 
                    ? 'Spinning Wheel...' 
                    : freeSpinsLeft > 0 
                      ? `Spin Free! (${freeSpinsLeft} Left)` 
                      : `Next Free Spins in ${timeLeftStr}`}
                </button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
