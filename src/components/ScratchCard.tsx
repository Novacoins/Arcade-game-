/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, CheckCircle2, Gift, Clock, ShieldCheck, Zap } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

interface ScratchCardProps {
  onWin: (amount: number, currency: 'coins' | 'diamonds') => void;
  onClose?: () => void;
}

interface ToolOption {
  id: string;
  name: string;
  icon: string;
  radius: number;
  color: string;
  soundType: 'click' | 'coin' | 'upgrade';
}

const TOOLS: ToolOption[] = [
  { id: 'coin', name: 'Gold Coin', icon: '🪙', radius: 25, color: 'text-yellow-300', soundType: 'coin' },
  { id: 'finger', name: 'Finger Touch', icon: '👆', radius: 22, color: 'text-amber-400', soundType: 'click' },
  { id: 'card', name: 'VIP Card', icon: '💳', radius: 28, color: 'text-blue-400', soundType: 'click' },
  { id: 'brush', name: 'Magic Scratch', icon: '🖌️', radius: 32, color: 'text-purple-400', soundType: 'upgrade' },
  { id: 'crystal', name: 'Diamond Gem', icon: '💎', radius: 30, color: 'text-cyan-400', soundType: 'coin' },
];

interface DecorativeCardOption {
  id: string;
  brand: string;
  title: string;
  badge: string;
  rewardAmount: number;
  currency: 'coins' | 'diamonds';
  cardGradient: string;
  accentColor: string;
  tagline: string;
}

const DECORATIVE_CARDS: DecorativeCardOption[] = [
  {
    id: 'amazon',
    brand: 'AMAZON',
    title: 'Amazon Rewards Card',
    badge: '📦',
    rewardAmount: 30,
    currency: 'coins',
    cardGradient: 'from-amber-600 via-zinc-900 to-zinc-950',
    accentColor: 'text-amber-400 border-amber-500/40',
    tagline: 'VIP Shopping Voucher',
  },
  {
    id: 'apple',
    brand: 'APPLE',
    title: 'Apple Rewards Card',
    badge: '🍎',
    rewardAmount: 50,
    currency: 'coins',
    cardGradient: 'from-slate-600 via-zinc-900 to-black',
    accentColor: 'text-gray-200 border-gray-400/40',
    tagline: 'App Store Experience',
  },
  {
    id: 'itunes',
    brand: 'iTUNES',
    title: 'iTunes Media Card',
    badge: '🎵',
    rewardAmount: 40,
    currency: 'coins',
    cardGradient: 'from-pink-600 via-purple-950 to-black',
    accentColor: 'text-pink-400 border-pink-500/40',
    tagline: 'Music & Pass Perks',
  },
  {
    id: 'steam',
    brand: 'STEAM',
    title: 'Steam Gaming Card',
    badge: '🎮',
    rewardAmount: 80,
    currency: 'coins',
    cardGradient: 'from-blue-700 via-slate-900 to-black',
    accentColor: 'text-blue-400 border-blue-500/40',
    tagline: 'Gamer Arcade Wallet',
  },
  {
    id: 'google',
    brand: 'GOOGLE PLAY',
    title: 'Google Play Card',
    badge: '▶️',
    rewardAmount: 60,
    currency: 'coins',
    cardGradient: 'from-emerald-600 via-teal-950 to-black',
    accentColor: 'text-emerald-400 border-emerald-500/40',
    tagline: 'Play Store VIP Pass',
  },
  {
    id: 'playstation',
    brand: 'PLAYSTATION',
    title: 'PlayStation Plus Card',
    badge: '🎯',
    rewardAmount: 70,
    currency: 'coins',
    cardGradient: 'from-indigo-700 via-blue-950 to-black',
    accentColor: 'text-indigo-400 border-indigo-500/40',
    tagline: 'Console Champions',
  },
  {
    id: 'xbox',
    brand: 'XBOX PASS',
    title: 'Xbox Game Pass Card',
    badge: '🟢',
    rewardAmount: 100,
    currency: 'coins',
    cardGradient: 'from-green-600 via-zinc-950 to-black',
    accentColor: 'text-green-400 border-green-500/40',
    tagline: 'Ultimate Gaming Vault',
  },
  {
    id: 'tesla',
    brand: 'TESLA VIP',
    title: 'Tesla Card Special',
    badge: '⚡',
    rewardAmount: 10,
    currency: 'diamonds',
    cardGradient: 'from-red-700 via-zinc-900 to-black',
    accentColor: 'text-red-400 border-red-500/40',
    tagline: 'Cyber Cybernetic Pass',
  },
  {
    id: 'netflix',
    brand: 'NETFLIX',
    title: 'Netflix VIP Pass',
    badge: '🎬',
    rewardAmount: 90,
    currency: 'coins',
    cardGradient: 'from-red-900 via-black to-zinc-950',
    accentColor: 'text-red-500 border-red-500/40',
    tagline: 'Cinema Unlimited',
  },
];

const COOLDOWN_HOURS = 4; // 4 hours cooldown between scratch cards

export default function ScratchCard({ onWin }: ScratchCardProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [selectedTool, setSelectedTool] = useState<ToolOption>(TOOLS[0]);
  const [isScratching, setIsScratching] = useState(false);
  const [scratchedPercent, setScratchedPercent] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [claimed, setClaimed] = useState(false);
  const [isClaiming, setIsClaiming] = useState(false);

  // Random card selection
  const [card, setCard] = useState<DecorativeCardOption>(() => {
    return DECORATIVE_CARDS[Math.floor(Math.random() * DECORATIVE_CARDS.length)];
  });

  // Cooldown Timestamp Persistence
  const [lastScratchTime, setLastScratchTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nova_last_scratch_time');
      return saved ? parseInt(saved, 10) : 0;
    } catch {
      return 0;
    }
  });

  const [remainingTime, setRemainingTime] = useState<{ hours: number; minutes: number; seconds: number }>({ hours: 0, minutes: 0, seconds: 0 });
  const [isInCooldown, setIsInCooldown] = useState(false);

  // Check cooldown status and update countdown
  useEffect(() => {
    const checkCooldown = () => {
      const now = Date.now();
      const cooldownMs = COOLDOWN_HOURS * 60 * 60 * 1000;
      const diff = lastScratchTime + cooldownMs - now;

      if (diff > 0) {
        setIsInCooldown(true);
        const hrs = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setRemainingTime({ hours: hrs, minutes: mins, seconds: secs });
      } else {
        setIsInCooldown(false);
        setRemainingTime({ hours: 0, minutes: 0, seconds: 0 });
      }
    };

    checkCooldown();
    const interval = setInterval(checkCooldown, 1000);
    return () => clearInterval(interval);
  }, [lastScratchTime]);

  // Canvas cover initialization
  useEffect(() => {
    if (isInCooldown) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 340;
    canvas.height = 200;

    // Metallic Scratch Layer
    const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    grad.addColorStop(0, '#3f3f46');
    grad.addColorStop(0.3, '#71717a');
    grad.addColorStop(0.6, '#52525b');
    grad.addColorStop(1, '#27272a');

    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Gold Sheen Accent
    ctx.strokeStyle = 'rgba(250, 204, 21, 0.3)';
    ctx.lineWidth = 14;
    for (let i = -100; i < canvas.width + 100; i += 40) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + 100, canvas.height);
      ctx.stroke();
    }

    // Grid dots
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    for (let x = 15; x < canvas.width; x += 25) {
      for (let y = 15; y < canvas.height; y += 25) {
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Instruction Text
    ctx.shadowColor = '#000000';
    ctx.shadowBlur = 6;
    ctx.fillStyle = '#fef08a';
    ctx.font = '900 15px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('✨ SCRATCH TO REVEAL REWARD ✨', canvas.width / 2, canvas.height / 2 - 8);

    ctx.fillStyle = '#d4d4d8';
    ctx.font = '700 11px sans-serif';
    ctx.fillText('Scratch over 40% to claim reward', canvas.width / 2, canvas.height / 2 + 18);
  }, [card, isInCooldown]);

  const scratch = (x: number, y: number) => {
    if (isInCooldown || revealed) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.beginPath();
    ctx.arc(x, y, selectedTool.radius, 0, Math.PI * 2);
    ctx.fill();

    // Audio feedback
    if (Math.random() < 0.25) {
      if (selectedTool.soundType === 'coin') synth.playCoin();
      else if (selectedTool.soundType === 'upgrade') synth.playUpgradeSuccess();
      else synth.playClick();
    }

    // Scratch percentage
    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clearPixels = 0;
    for (let i = 3; i < imgData.data.length; i += 24) {
      if (imgData.data[i] === 0) clearPixels++;
    }
    const percent = Math.floor((clearPixels / (imgData.data.length / 24)) * 100);
    setScratchedPercent(percent);

    if (percent >= 40 && !revealed) {
      setRevealed(true);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      synth.playVictory();
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([100, 50, 100]);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isScratching || isInCooldown) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    scratch(x, y);
  };

  const handleClaim = () => {
    if (claimed || isClaiming || !revealed) return;
    setIsClaiming(true);

    const now = Date.now();
    setClaimed(true);
    setLastScratchTime(now);
    localStorage.setItem('nova_last_scratch_time', now.toString());

    synth.playCoin();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 50, 150]);
    }

    onWin(card.rewardAmount, card.currency);
    setIsClaiming(false);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-amber-500/30 p-6 rounded-3xl max-w-md w-full mx-auto space-y-5 text-center shadow-2xl relative overflow-hidden">
      {/* Header Title */}
      <div className="space-y-1">
        <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest bg-amber-500/10 px-3 py-1 rounded-full border border-amber-500/20">
          🎟️ VIP Scratch & Reveal Card
        </span>
        <h3 className="text-lg font-black text-white tracking-tight">Luxury Decorative Reward Cards</h3>
        <p className="text-xs text-gray-400">Scratch to reveal coin and diamond bonuses</p>
      </div>

      {/* Tool Selector Toolbar */}
      {!isInCooldown && (
        <div className="space-y-1.5">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Select Scratch Tool:</p>
          <div className="flex items-center justify-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
            {TOOLS.map((tool) => (
              <button
                key={tool.id}
                onClick={() => {
                  synth.playClick();
                  setSelectedTool(tool);
                }}
                className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1 transition border ${
                  selectedTool.id === tool.id
                    ? 'bg-amber-400 text-black border-amber-300 shadow-md scale-105 font-black'
                    : 'bg-zinc-900/90 text-gray-300 border-white/10 hover:border-white/30'
                }`}
              >
                <span>{tool.icon}</span>
                <span className="text-[10px] uppercase">{tool.name}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Main Card Canvas / Cooldown Container */}
      <div className="relative w-[340px] h-[200px] mx-auto rounded-3xl overflow-hidden border-2 border-amber-400/80 shadow-2xl flex items-center justify-center bg-zinc-950">
        {isInCooldown ? (
          /* Cooldown Lock State */
          <div className="w-full h-full p-6 bg-gradient-to-br from-zinc-950 via-zinc-900 to-black flex flex-col items-center justify-center text-center space-y-3 select-none border border-white/10">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center">
              <Clock className="h-6 w-6 text-amber-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h4 className="text-sm font-black text-white">Scratch Card Locked</h4>
              <p className="text-[11px] text-gray-400">Next scratch card unlocks in:</p>
            </div>
            <div className="font-mono text-base font-black text-amber-300 bg-black/60 px-4 py-1.5 rounded-xl border border-amber-400/30">
              {String(remainingTime.hours).padStart(2, '0')}h : {String(remainingTime.minutes).padStart(2, '0')}m : {String(remainingTime.seconds).padStart(2, '0')}s
            </div>
          </div>
        ) : (
          /* Card Art & Reveal Surface */
          <>
            {/* Hidden HD Decorative Card Art */}
            <div className={`w-full h-full p-5 bg-gradient-to-br ${card.cardGradient} flex flex-col justify-between text-left relative overflow-hidden select-none border border-white/10`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-3xl">{card.badge}</span>
                  <div>
                    <span className="text-[9px] font-black uppercase text-amber-300 tracking-widest block">{card.brand}</span>
                    <h4 className="text-sm font-black text-white leading-tight">{card.title}</h4>
                  </div>
                </div>
                <Zap className="h-5 w-5 text-amber-400" />
              </div>

              {/* Revealed Reward Box */}
              <div className="bg-black/80 backdrop-blur border border-amber-400/40 p-3 rounded-2xl text-center space-y-0.5 shadow-xl">
                <span className="text-[9px] text-gray-400 uppercase font-bold tracking-widest block">REWARD REVEALED</span>
                <div className="text-lg font-black text-amber-300 flex items-center justify-center gap-1.5">
                  <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                  <span>+{card.rewardAmount.toLocaleString()} {card.currency.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center justify-between text-[10px] font-black text-gray-300">
                <span className="text-gray-400">{card.tagline}</span>
                <span className="text-emerald-400 flex items-center gap-1">
                  <ShieldCheck className="h-3 w-3" /> VERIFIED REWARD
                </span>
              </div>
            </div>

            {/* Interactive Scratch Canvas Overlay */}
            {!revealed && (
              <canvas
                ref={canvasRef}
                onPointerDown={() => setIsScratching(true)}
                onPointerUp={() => setIsScratching(false)}
                onPointerLeave={() => setIsScratching(false)}
                onPointerMove={handlePointerMove}
                className="absolute inset-0 cursor-crosshair touch-none"
              />
            )}
          </>
        )}
      </div>

      {/* Action / Progress Control */}
      {!isInCooldown && (
        <div className="space-y-3">
          {!revealed ? (
            <div className="space-y-1">
              <div className="flex justify-between text-[10px] font-bold text-gray-400">
                <span>Scratching ({selectedTool.name})</span>
                <span className="text-amber-400 font-mono">{scratchedPercent}% / 40%</span>
              </div>
              <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 via-amber-400 to-yellow-300 transition-all duration-150"
                  style={{ width: `${Math.min(100, (scratchedPercent / 40) * 100)}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {!claimed ? (
                <button
                  onClick={handleClaim}
                  disabled={isClaiming}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition animate-bounce flex items-center justify-center gap-2"
                >
                  <Gift className="h-4 w-4" />
                  <span>Claim +{card.rewardAmount.toLocaleString()} {card.currency.toUpperCase()}</span>
                </button>
              ) : (
                <div className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Reward Claimed & Added to Wallet!</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
