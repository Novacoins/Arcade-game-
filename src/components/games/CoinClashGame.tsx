/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Shield, Crown,
  Coins, RotateCw, CheckCircle2, Lock, Eye, ShoppingBag, X, Check, Play
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoinClashProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export interface CoinTheme {
  id: string;
  name: string;
  price: number;
  desc: string;
  previewEmoji: string;
  headsSymbol: string;
  tailsSymbol: string;
  headsLabel: string;
  tailsLabel: string;
  bgGradient: string;
  coinGradient: string;
  coinBorder: string;
  glowColor: string;
}

export const COIN_THEMES: CoinTheme[] = [
  {
    id: 'royal_gold',
    name: 'Royal Gold',
    price: 0, // Free / Default
    desc: 'Classic luxury gold coin minted with royal insignia',
    previewEmoji: '👑',
    headsSymbol: '👑',
    tailsSymbol: '🛡️',
    headsLabel: 'HEADS',
    tailsLabel: 'TAILS',
    bgGradient: 'from-zinc-950 via-amber-950/40 to-zinc-950',
    coinGradient: 'from-amber-300 via-amber-500 to-amber-700',
    coinBorder: 'border-amber-300',
    glowColor: 'shadow-[0_0_35px_rgba(245,158,11,0.5)]',
  },
  {
    id: 'neon_cyber',
    name: 'Neon Cyber',
    price: 500,
    desc: 'Futuristic glowing cybernetic token with pulse energy',
    previewEmoji: '⚡',
    headsSymbol: '⚡',
    tailsSymbol: '🤖',
    headsLabel: 'CYBER',
    tailsLabel: 'MATRIX',
    bgGradient: 'from-zinc-950 via-cyan-950/50 to-purple-950/50',
    coinGradient: 'from-cyan-300 via-cyan-500 to-blue-600',
    coinBorder: 'border-cyan-300',
    glowColor: 'shadow-[0_0_35px_rgba(6,182,212,0.6)]',
  },
  {
    id: 'crystal_blue',
    name: 'Crystal Blue',
    price: 1000,
    desc: 'Enchanted sapphire crystal coin glowing with frozen frost',
    previewEmoji: '💎',
    headsSymbol: '💎',
    tailsSymbol: '❄️',
    headsLabel: 'CRYSTAL',
    tailsLabel: 'FROST',
    bgGradient: 'from-zinc-950 via-sky-950/50 to-indigo-950/50',
    coinGradient: 'from-sky-200 via-blue-400 to-indigo-600',
    coinBorder: 'border-sky-300',
    glowColor: 'shadow-[0_0_35px_rgba(56,189,248,0.6)]',
  },
  {
    id: 'emerald_forest',
    name: 'Emerald Forest',
    price: 2000,
    desc: 'Ancient elven coin carved from pure emerald jade',
    previewEmoji: '🌿',
    headsSymbol: '🐉',
    tailsSymbol: '🍃',
    headsLabel: 'DRAGON',
    tailsLabel: 'LEAF',
    bgGradient: 'from-zinc-950 via-emerald-950/50 to-zinc-950',
    coinGradient: 'from-emerald-300 via-emerald-500 to-teal-700',
    coinBorder: 'border-emerald-300',
    glowColor: 'shadow-[0_0_35px_rgba(16,185,129,0.6)]',
  },
  {
    id: 'galaxy_space',
    name: 'Galaxy Space',
    price: 5000,
    desc: 'Cosmic void coin forged from dark matter and stardust',
    previewEmoji: '🌌',
    headsSymbol: '🚀',
    tailsSymbol: '🪐',
    headsLabel: 'GALAXY',
    tailsLabel: 'ORBIT',
    bgGradient: 'from-purple-950 via-zinc-950 to-black',
    coinGradient: 'from-fuchsia-400 via-purple-600 to-indigo-900',
    coinBorder: 'border-fuchsia-300',
    glowColor: 'shadow-[0_0_35px_rgba(217,70,239,0.7)]',
  },
];

export function CoinClash({ coins, onGameWin, onGameLose }: CoinClashProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  const [prediction, setPrediction] = useState<'heads' | 'tails'>('heads');
  const [flipping, setFlipping] = useState<boolean>(false);
  const [result, setResult] = useState<'heads' | 'tails' | null>(null);
  
  // Theme state
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    const saved = localStorage.getItem('cc_unlocked_themes');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['royal_gold'];
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('cc_active_theme') || 'royal_gold';
  });

  const [themeModalOpen, setThemeModalOpen] = useState<boolean>(false);
  const [confirmUnlockTheme, setConfirmUnlockTheme] = useState<CoinTheme | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  useEffect(() => {
    localStorage.setItem('cc_unlocked_themes', JSON.stringify(unlockedThemes));
  }, [unlockedThemes]);

  useEffect(() => {
    localStorage.setItem('cc_active_theme', activeThemeId);
  }, [activeThemeId]);

  const activeTheme = COIN_THEMES.find(t => t.id === activeThemeId) || COIN_THEMES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleFlip = () => {
    if (flipping) return;

    if (!validateAndDeductCoins(coinsToPay, 'Coin Flip')) {
      return;
    }

    synth.playClick();
    setFlipping(true);
    setResult(null);

    // Airborne ticks sound simulation
    const ticks = 18;
    for (let i = 0; i < ticks; i++) {
      setTimeout(() => {
        synth.playTick();
      }, (i / ticks) * 1800);
    }

    setTimeout(() => {
      setFlipping(false);
      const outcome = Math.random() < 0.5 ? 'heads' : 'tails';
      setResult(outcome);

      if (prediction === outcome) {
        synth.playCoin();
        const payout = Math.floor(coinsToPay * 1.96);
        onGameWin(payout, 1.96);
      } else {
        synth.playError();
      }
    }, 1800);
  };

  const handlePurchaseTheme = (theme: CoinTheme) => {
    if (coins < theme.price) {
      synth.playError();
      showToast('Insufficient coins balance to purchase theme!');
      return;
    }

    synth.playFanfare();
    onGameLose(theme.price); // Spend coins
    setUnlockedThemes(prev => [...prev, theme.id]);
    setActiveThemeId(theme.id);
    setConfirmUnlockTheme(null);
    showToast(`🎉 Unlocked ${theme.name} Theme!`);
  };

  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(10000, coins));
  };

  return (
    <div className={`bg-gradient-to-b ${activeTheme.bgGradient} p-4 sm:p-6 rounded-3xl border border-white/10 max-w-md mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-700`}>
      
      {/* Toast Notice */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-black px-4 py-2 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-yellow-200"
          >
            <Sparkles className="h-4 w-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 p-0.5 shadow-lg flex items-center justify-center">
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl">
              {activeTheme.previewEmoji}
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400">
              Coin Clash 3D
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              Theme: <span className="text-white">{activeTheme.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => { synth.playClick(); setThemeModalOpen(true); }}
          className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 hover:bg-white/20 text-xs font-black text-amber-300 flex items-center gap-1.5 transition"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Themes</span>
        </button>
      </div>

      {/* 3D Coin Spinner Container */}
      <div className="relative z-10 flex justify-center py-6">
        <motion.div
          animate={flipping ? {
            rotateY: [0, 1800],
            y: [0, -120, -140, -100, 0],
            scale: [1, 1.15, 1.25, 1.1, 1],
          } : {}}
          transition={{ duration: 1.8, ease: 'easeInOut' }}
          className={`h-32 w-32 rounded-full bg-gradient-to-br ${activeTheme.coinGradient} border-4 ${activeTheme.coinBorder} ${activeTheme.glowColor} flex items-center justify-center relative select-none shadow-2xl`}
        >
          {flipping ? (
            <span className="text-4xl animate-pulse">{activeTheme.previewEmoji}</span>
          ) : result === 'heads' ? (
            <div className="flex flex-col items-center justify-center text-black font-black">
              <span className="text-4xl">{activeTheme.headsSymbol}</span>
              <span className="text-[9px] font-mono tracking-widest leading-none mt-1 uppercase">
                {activeTheme.headsLabel}
              </span>
            </div>
          ) : result === 'tails' ? (
            <div className="flex flex-col items-center justify-center text-black font-black">
              <span className="text-4xl">{activeTheme.tailsSymbol}</span>
              <span className="text-[9px] font-mono tracking-widest leading-none mt-1 uppercase">
                {activeTheme.tailsLabel}
              </span>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-black font-black">
              <span className="text-4xl">{activeTheme.previewEmoji}</span>
              <span className="text-[9px] font-mono tracking-widest leading-none mt-1">FLIP ME</span>
            </div>
          )}
        </motion.div>
      </div>

      {result && (
        <div className={`text-xs font-black uppercase tracking-wider py-1.5 px-4 rounded-2xl inline-block ${
          result === prediction 
            ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.3)]' 
            : 'bg-red-500/20 border border-red-500/40 text-red-300'
        }`}>
          {result === prediction ? '🎉 PREDICTION CLEARED! WIN 1.96x' : '❌ MISSED! TRY AGAIN'}
        </div>
      )}

      {/* Select Side */}
      <div className="relative z-10 space-y-3 text-left">
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
          Select Prediction Side
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            disabled={flipping}
            onClick={() => { synth.playClick(); setPrediction('heads'); }}
            className={`py-3.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              prediction === 'heads' 
                ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-500/20' 
                : 'border-white/10 bg-zinc-950/60 text-gray-400 hover:text-white'
            }`}
          >
            <span>{activeTheme.headsSymbol}</span>
            <span>{activeTheme.headsLabel}</span>
          </button>

          <button
            disabled={flipping}
            onClick={() => { synth.playClick(); setPrediction('tails'); }}
            className={`py-3.5 rounded-2xl border text-xs font-black uppercase tracking-widest transition-all flex items-center justify-center gap-2 ${
              prediction === 'tails' 
                ? 'border-amber-400 bg-amber-400/20 text-amber-300 shadow-lg shadow-amber-500/20' 
                : 'border-white/10 bg-zinc-950/60 text-gray-400 hover:text-white'
            }`}
          >
            <span>{activeTheme.tailsSymbol}</span>
            <span>{activeTheme.tailsLabel}</span>
          </button>
        </div>
      </div>

      {/* Coins to Pay */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={flipping}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-amber-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={flipping}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={flipping}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={flipping}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={flipping}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Flip Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleFlip}
        disabled={flipping}
        className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>▶ TOSS COIN (1.96x REWARD)</span>
      </motion.button>

      {/* Themes Store Modal */}
      <AnimatePresence>
        {themeModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400/50 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Unlockable Coin Themes
                </h3>
                <button
                  onClick={() => setThemeModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {COIN_THEMES.map(theme => {
                  const isUnlocked = unlockedThemes.includes(theme.id);
                  const isActive = activeThemeId === theme.id;

                  return (
                    <div
                      key={theme.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950/80 border-white/5 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow">
                          {theme.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{theme.name}</span>
                            {isActive && <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-black">ACTIVE</span>}
                          </div>
                          <div className="text-[10px] text-gray-400">{theme.desc}</div>
                        </div>
                      </div>

                      <div>
                        {isActive ? (
                          <div className="text-emerald-400 text-xs font-black flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            <span>Equipped</span>
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              synth.playClick();
                              setActiveThemeId(theme.id);
                              setThemeModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase hover:bg-amber-500/30 transition"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmUnlockTheme(theme)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow"
                          >
                            {theme.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Purchase Confirmation Modal */}
      <AnimatePresence>
        {confirmUnlockTheme && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl">{confirmUnlockTheme.previewEmoji}</div>
              <h3 className="text-base font-black text-amber-400 uppercase">
                Unlock {confirmUnlockTheme.name}?
              </h3>
              <p className="text-xs text-gray-300">
                Cost: <strong className="text-amber-300">{confirmUnlockTheme.price} 🪙</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmUnlockTheme(null)}
                  className="py-2.5 rounded-xl bg-zinc-800 text-xs font-black text-gray-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseTheme(confirmUnlockTheme)}
                  className="py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
