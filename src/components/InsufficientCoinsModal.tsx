/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Coins, Sparkles, X, ArrowRight, Gift, Tv, CreditCard, AlertTriangle, Zap, ShieldAlert
} from 'lucide-react';
import { synth } from '../utils/audioSynth';

export interface InsufficientCoinsModalProps {
  isOpen: boolean;
  currentBalance: number;
  requiredCoins: number;
  neededCoins: number;
  gameTitle?: string;
  onClose: () => void;
  onEarnCoins: () => void;
  onOpenShop?: () => void;
}

export const InsufficientCoinsModal: React.FC<InsufficientCoinsModalProps> = ({
  isOpen,
  currentBalance,
  requiredCoins,
  neededCoins,
  gameTitle = 'Game',
  onClose,
  onEarnCoins,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Trigger audio & haptic vibration on open
  useEffect(() => {
    if (isOpen) {
      synth.playError();
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch {
          /* Suppress */
        }
      }
    }
  }, [isOpen]);

  // Ambient Floating Dust Particles Canvas Background
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 420);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 560);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Cosmic dust and gold embers particles
    const particles = Array.from({ length: 30 }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 2 + 0.8,
      speedY: -(Math.random() * 0.6 + 0.2),
      speedX: (Math.random() - 0.5) * 0.4,
      opacity: Math.random() * 0.7 + 0.3,
      color: Math.random() > 0.4 ? 'rgba(251, 191, 36,' : 'rgba(192, 132, 252,',
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.y += p.speedY;
        p.x += p.speedX;

        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `${p.color} ${p.opacity})`;
        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6 bg-black/90 backdrop-blur-2xl select-none"
        id="universal_insufficient_coins_modal"
      >
        {/* LUXURY COSMIC GOLD GLASS CONTAINER */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 25 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.88, y: 20 }}
          transition={{ type: 'spring', damping: 24, stiffness: 340 }}
          className="relative w-full max-w-md bg-gradient-to-b from-zinc-950 via-purple-950/40 to-black border-2 border-amber-400/80 rounded-[28px] p-6 sm:p-7 shadow-[0_0_80px_rgba(251,191,36,0.35)] overflow-hidden text-center text-white"
        >
          {/* Animated Background Canvas for Floating Gold/Purple Dust */}
          <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-70" />

          {/* Gold Lighting & Purple Cosmic Glow Flares */}
          <div className="absolute -top-24 -left-24 w-52 h-52 bg-amber-500/25 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-52 h-52 bg-purple-600/30 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

          {/* Premium Vignette & Shimmer Line */}
          <div className="absolute inset-0 bg-radial-vignette pointer-events-none opacity-40" />

          {/* Top Right Close / Dismiss Icon Button */}
          <button
            onClick={() => {
              synth.playClick();
              onClose();
            }}
            className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white hover:border-amber-400/50 transition duration-200 z-20"
            title="Dismiss"
            id="close_insufficient_coins_modal_btn"
          >
            <X className="h-4.5 w-4.5" />
          </button>

          {/* CONTENT LAYOUT */}
          <div className="relative z-10 space-y-5">

            {/* 1. HEADER: PREMIUM GLOWING ICON CARD */}
            <div className="relative mx-auto w-20 h-20 flex items-center justify-center">
              {/* Luxury Gold Glow & Pulsing Ring */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-purple-500 opacity-40 blur-md animate-pulse" />

              {/* Floating Glass Square */}
              <motion.div 
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                className="relative w-18 h-18 rounded-2xl bg-black/80 backdrop-blur-xl border-2 border-amber-400/80 flex items-center justify-center shadow-2xl shadow-amber-500/30"
              >
                <div className="relative flex items-center justify-center">
                  <Coins className="h-9 w-9 text-amber-300 filter drop-shadow-[0_0_10px_rgba(251,191,36,0.8)] animate-bounce" />
                  <Sparkles className="h-4 w-4 text-purple-300 absolute -top-2 -right-2 animate-spin" />
                  <ShieldAlert className="h-4 w-4 text-red-400 absolute -bottom-1 -left-2 filter drop-shadow" />
                </div>
              </motion.div>
            </div>

            {/* TYPOGRAPHY */}
            <div className="space-y-2">
              <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-300 to-yellow-500 filter drop-shadow">
                INSUFFICIENT COINS
              </h2>
              <p className="text-xs text-zinc-300 font-medium leading-relaxed max-w-xs mx-auto">
                You don&apos;t have enough coins to play this game. Earn more coins from Rewards or future Coin Shop to continue your adventure.
              </p>
            </div>

            {/* 2. PREMIUM INFORMATION CARD */}
            <div className="bg-black/60 border border-amber-500/30 rounded-2xl p-4 backdrop-blur-xl shadow-inner space-y-2.5 text-left">
              {/* Row 1: Current Balance */}
              <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-white/5">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Coins className="h-4 w-4 text-amber-400 animate-pulse" />
                  <span>Current Balance</span>
                </span>
                <span className="font-mono font-black text-white text-sm shadow-sm filter drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
                  {currentBalance.toLocaleString()} Coins
                </span>
              </div>

              {/* Row 2: Required Entry */}
              <div className="flex items-center justify-between text-xs font-semibold py-1 border-b border-white/5">
                <span className="text-zinc-400 flex items-center gap-2">
                  <Zap className="h-4 w-4 text-yellow-400 animate-bounce" />
                  <span>Required Entry</span>
                </span>
                <span className="font-mono font-black text-amber-400 text-sm">
                  {requiredCoins.toLocaleString()} Coins
                </span>
              </div>

              {/* Row 3: Coins Needed */}
              <div className="flex items-center justify-between text-xs font-bold py-2 text-red-300 bg-red-500/15 px-3 rounded-xl border border-red-500/30">
                <span className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400 animate-pulse" />
                  <span>Coins Needed</span>
                </span>
                <span className="font-mono font-black text-sm text-red-300">
                  {neededCoins.toLocaleString()} More Coins
                </span>
              </div>
            </div>

            {/* 3. FEATURE TABS (Visual Information Only - Non-Clickable) */}
            <div className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/10 via-yellow-500/15 to-amber-500/10 border border-amber-400/40 backdrop-blur flex items-center justify-around text-[10px] text-amber-300 font-bold uppercase tracking-wider pointer-events-none shadow-md relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full animate-shimmer" />
              
              <span className="flex items-center gap-1.5 text-amber-300 drop-shadow">
                <Gift className="h-3.5 w-3.5 text-amber-400" /> Daily Bonus
              </span>
              <span className="text-amber-500/50">•</span>
              <span className="flex items-center gap-1.5 text-amber-300 drop-shadow">
                <Tv className="h-3.5 w-3.5 text-amber-400" /> Rewarded Ads
              </span>
              <span className="text-amber-500/50">•</span>
              <span className="flex items-center gap-1.5 text-amber-300 drop-shadow">
                <CreditCard className="h-3.5 w-3.5 text-amber-400" /> Coin Shop
              </span>
            </div>

            {/* 4. PRIMARY ACTION: EARN COINS BUTTON */}
            <div className="space-y-2 pt-1">
              <button
                onClick={() => {
                  synth.playClick();
                  onEarnCoins();
                }}
                className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 hover:from-amber-300 hover:to-yellow-200 text-black font-black uppercase text-xs tracking-wider shadow-[0_0_30px_rgba(251,191,36,0.45)] active:scale-[0.97] transition-all duration-200 flex items-center justify-center gap-2.5 group"
                id="earn_coins_primary_btn"
              >
                <Sparkles className="h-4.5 w-4.5 text-black animate-spin" />
                <span className="text-sm font-black">Earn Coins</span>
                <ArrowRight className="h-4.5 w-4.5 text-black transform group-hover:translate-x-1.5 transition duration-200" />
              </button>

              <button
                onClick={() => {
                  synth.playClick();
                  onClose();
                }}
                className="w-full py-2.5 px-4 rounded-xl text-zinc-400 hover:text-white font-extrabold uppercase text-[11px] tracking-wider transition duration-200"
              >
                Dismiss
              </button>
            </div>

          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
