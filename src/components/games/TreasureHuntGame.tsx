/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Shield, Crown, Coins, RotateCw, CheckCircle2,
  Lock, ShoppingBag, X, Check, Play, Volume2, VolumeX, Flame, Compass,
  MapPin, Skull, Gift, Star, ArrowRight, Award, ChevronRight, Gem, Key
} from 'lucide-react';

export interface TreasureHuntProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// THEMES DEFINITION
export interface TreasureTheme {
  id: string;
  name: string;
  icon: string;
  cost: number;
  unlockedByDefault?: boolean;
  bgGradient: string;
  cardBg: string;
  accentColor: string;
  glowColor: string;
  particleType: 'embers' | 'snow' | 'stars' | 'bubbles' | 'sparkles' | 'crystals' | 'gold';
  chestIcon: string;
  trapIcon: string;
  environmentName: string;
  description: string;
}

export const TREASURE_THEMES: TreasureTheme[] = [
  {
    id: 'ancient_temple',
    name: 'Ancient Temple',
    icon: '🏛️',
    cost: 0,
    unlockedByDefault: true,
    bgGradient: 'from-amber-950 via-zinc-950 to-stone-950',
    cardBg: 'bg-stone-900/80 border-amber-500/30',
    accentColor: 'text-amber-400',
    glowColor: 'rgba(245, 158, 11, 0.25)',
    particleType: 'sparkles',
    chestIcon: '📦',
    trapIcon: '🐍',
    environmentName: 'Sunken Golden Temple',
    description: 'Ancient glyphs and hidden sunbeams guide your path.'
  },
  {
    id: 'pirate_island',
    name: 'Pirate Island',
    icon: '🏝️',
    cost: 10,
    bgGradient: 'from-cyan-950 via-slate-950 to-blue-950',
    cardBg: 'bg-slate-900/80 border-cyan-500/30',
    accentColor: 'text-cyan-400',
    glowColor: 'rgba(6, 182, 212, 0.25)',
    particleType: 'bubbles',
    chestIcon: '🏴‍☠️',
    trapIcon: '💣',
    environmentName: 'Skull Cove Atoll',
    description: 'Tropical tides and buried captain’s booty await.'
  },
  {
    id: 'frozen_cave',
    name: 'Frozen Cave',
    icon: '❄️',
    cost: 20,
    bgGradient: 'from-sky-950 via-blue-950 to-indigo-950',
    cardBg: 'bg-sky-950/80 border-sky-400/30',
    accentColor: 'text-sky-300',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    particleType: 'snow',
    chestIcon: '🧊',
    trapIcon: '🧊⚡',
    environmentName: 'Glacial Vault Cavern',
    description: 'Sub-zero chambers holding frozen ancestral diamonds.'
  },
  {
    id: 'lava_kingdom',
    name: 'Lava Kingdom',
    icon: '🌋',
    cost: 30,
    bgGradient: 'from-red-950 via-zinc-950 to-orange-950',
    cardBg: 'bg-zinc-900/80 border-red-500/30',
    accentColor: 'text-red-400',
    glowColor: 'rgba(239, 68, 68, 0.25)',
    particleType: 'embers',
    chestIcon: '🔥',
    trapIcon: '🌋',
    environmentName: 'Magma Core Citadel',
    description: 'Volcanic heat guarding molten gold and dark gems.'
  },
  {
    id: 'galaxy_treasure',
    name: 'Galaxy Treasure',
    icon: '🌌',
    cost: 40,
    bgGradient: 'from-purple-950 via-slate-950 to-indigo-950',
    cardBg: 'bg-purple-950/80 border-purple-400/30',
    accentColor: 'text-purple-300',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    particleType: 'stars',
    chestIcon: '🛸',
    trapIcon: '☄️',
    environmentName: 'Cosmic Star Sanctuary',
    description: 'Celestial stardust and galactic relic caches.'
  },
  {
    id: 'crystal_mine',
    name: 'Crystal Mine',
    icon: '💎',
    cost: 50,
    bgGradient: 'from-emerald-950 via-zinc-950 to-teal-950',
    cardBg: 'bg-emerald-950/80 border-emerald-400/30',
    accentColor: 'text-emerald-300',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    particleType: 'crystals',
    chestIcon: '💎',
    trapIcon: '⛏️💥',
    environmentName: 'Prismatic Gem Grotto',
    description: 'Glowing amethyst, emerald, and raw sapphire deposits.'
  },
  {
    id: 'kings_vault',
    name: 'King\'s Vault',
    icon: '👑',
    cost: 60,
    bgGradient: 'from-yellow-950 via-amber-950 to-zinc-950',
    cardBg: 'bg-amber-950/80 border-yellow-400/40',
    accentColor: 'text-yellow-300',
    glowColor: 'rgba(250, 204, 21, 0.35)',
    particleType: 'gold',
    chestIcon: '👑',
    trapIcon: '⚖️',
    environmentName: 'Imperial Royal Treasury',
    description: '24K Solid gold vault overflowing with sovereign crowns.'
  }
];

// STAGES CONFIGURATION
export interface StageConfig {
  stageNumber: number;
  name: string;
  multiplier: number;
  locationName: string;
  icon: string;
  chestName: string;
}

export const STAGES: StageConfig[] = [
  { stageNumber: 1, name: 'Jungle Gate', multiplier: 1.5, locationName: 'Outer Ruins', icon: '🌿', chestName: 'Wood Chest' },
  { stageNumber: 2, name: 'Ancient Catacombs', multiplier: 2.3, locationName: 'Forgotten Pass', icon: '🏛️', chestName: 'Iron Chest' },
  { stageNumber: 3, name: 'Golden Cavern', multiplier: 3.8, locationName: 'Gold Vein', icon: '🪙', chestName: 'Bronze Chest' },
  { stageNumber: 4, name: 'Crystal Grotto', multiplier: 6.0, locationName: 'Luminous Pool', icon: '💎', chestName: 'Silver Chest' },
  { stageNumber: 5, name: 'Dragon\'s Lair', multiplier: 10.0, locationName: 'Shadow Peak', icon: '🐉', chestName: 'Gold Chest' },
  { stageNumber: 6, name: 'Royal Chamber', multiplier: 18.0, locationName: 'Sovereign Hall', icon: '👑', chestName: 'Crystal Chest' },
  { stageNumber: 7, name: 'Legendary Vault', multiplier: 32.0, locationName: 'The Apex Treasury', icon: '🔱', chestName: 'Legendary Chest' },
];

export function TreasureHunt({ coins, onGameWin, onGameLose }: TreasureHuntProps) {
  const { validateAndDeductCoins, addCoins } = useCoinValidation();

  // Settings & Theme
  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_treasure_unlocked_themes');
      if (saved) return JSON.parse(saved);
    } catch { /* suppress */ }
    return ['ancient_temple'];
  });

  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    return localStorage.getItem('nova_treasure_active_theme') || 'ancient_temple';
  });

  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [isShopOpen, setIsShopOpen] = useState<boolean>(false);

  // Gameplay State
  const [bet, setBet] = useState<number>(10);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'lost' | 'won'>('idle');
  const [currentStep, setCurrentStep] = useState<number>(0); // 0..6
  const [chests, setChests] = useState<{ isTrap: boolean; rewardType: string; rewardTitle: string }[][]>([]);
  const [selectedChestIdx, setSelectedChestIdx] = useState<number | null>(null);
  const [lastRevealedReward, setLastRevealedReward] = useState<{ title: string; desc: string; icon: string } | null>(null);
  const [isRevealing, setIsRevealing] = useState<boolean>(false);
  const [screenShake, setScreenShake] = useState<boolean>(false);

  // Particle Canvas Ref
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const activeTheme = TREASURE_THEMES.find(t => t.id === activeThemeId) || TREASURE_THEMES[0];

  // Save themes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('nova_treasure_unlocked_themes', JSON.stringify(unlockedThemeIds));
      localStorage.setItem('nova_treasure_active_theme', activeThemeId);
    } catch { /* suppress */ }
  }, [unlockedThemeIds, activeThemeId]);

  // Ambient Canvas Particles
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || 800);
    let height = (canvas.height = canvas.parentElement?.clientHeight || 500);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate theme-specific particles
    const particleCount = 35;
    const particles = Array.from({ length: particleCount }).map(() => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: Math.random() * 3 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: activeTheme.particleType === 'embers' ? -(Math.random() * 1.2 + 0.3) : Math.random() * 0.8 + 0.2,
      opacity: Math.random() * 0.7 + 0.3,
      pulse: Math.random() * 0.02 + 0.005,
    }));

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        p.opacity += Math.sin(Date.now() * p.pulse) * 0.01;
        const alpha = Math.max(0.1, Math.min(1, p.opacity));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);

        if (activeTheme.particleType === 'embers') {
          ctx.fillStyle = `rgba(249, 115, 22, ${alpha})`;
        } else if (activeTheme.particleType === 'snow') {
          ctx.fillStyle = `rgba(224, 242, 254, ${alpha})`;
        } else if (activeTheme.particleType === 'bubbles') {
          ctx.fillStyle = `rgba(56, 189, 248, ${alpha})`;
        } else if (activeTheme.particleType === 'stars') {
          ctx.fillStyle = `rgba(216, 180, 254, ${alpha})`;
        } else if (activeTheme.particleType === 'crystals') {
          ctx.fillStyle = `rgba(167, 243, 208, ${alpha})`;
        } else if (activeTheme.particleType === 'gold') {
          ctx.fillStyle = `rgba(253, 224, 71, ${alpha})`;
        } else {
          ctx.fillStyle = `rgba(251, 191, 36, ${alpha})`;
        }

        ctx.fill();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, [activeTheme]);

  // Haptic Feedback Helper
  const triggerHaptic = (pattern: number[]) => {
    if (typeof window !== 'undefined' && 'navigator' in window && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch { /* suppress */ }
    }
  };

  // Start New Game Run
  const handleStartRun = () => {
    if (!validateAndDeductCoins(bet, 'Treasure Hunt')) {
      return;
    }

    if (soundEnabled) synth.playClick();
    triggerHaptic([40, 60]);

    // Generate 7 Stages x 3 Chests (1 trap, 2 safe treasures with reward card flavor)
    const rewardTitles = [
      'Golden Chalice', 'Ancient Emerald', 'Ruby Medallion', 'Dragon Scale', 
      'Sovereign Key', 'Mystic Orb', 'Phoenix Crown', 'Royal Artifact'
    ];

    const newChests = Array.from({ length: 7 }).map((_, stageIdx) => {
      const trapIdx = Math.floor(Math.random() * 3);
      return [0, 1, 2].map((i) => ({
        isTrap: i === trapIdx,
        rewardType: i === trapIdx ? 'TRAP' : 'TREASURE',
        rewardTitle: rewardTitles[(stageIdx + i) % rewardTitles.length]
      }));
    });

    setChests(newChests);
    setCurrentStep(0);
    setSelectedChestIdx(null);
    setLastRevealedReward(null);
    setGameState('playing');
  };

  // Select Chest in Current Stage
  const handleOpenChest = (chestIdx: number) => {
    if (gameState !== 'playing' || isRevealing) return;

    setSelectedChestIdx(chestIdx);
    setIsRevealing(true);
    triggerHaptic([50]);

    if (soundEnabled) synth.playClick();

    setTimeout(() => {
      const activeStageChests = chests[currentStep];
      const chosen = activeStageChests[chestIdx];

      if (chosen.isTrap) {
        // TRAP HIT!
        if (soundEnabled) synth.playExplode();
        triggerHaptic([100, 50, 150]);
        setScreenShake(true);
        setTimeout(() => setScreenShake(false), 500);

        setGameState('lost');
        setIsRevealing(false);
      } else {
        // SAFE TREASURE
        if (soundEnabled) synth.playCoin();
        triggerHaptic([30, 40, 30]);

        const rewardCard = {
          title: chosen.rewardTitle,
          desc: `Stage ${currentStep + 1} Cleared • ${STAGES[currentStep].multiplier}x Payout Unlocked`,
          icon: STAGES[currentStep].icon
        };
        setLastRevealedReward(rewardCard);

        if (currentStep === 6) {
          // GRAND FINAL WINNER!
          if (soundEnabled) synth.playFanfare();
          triggerHaptic([100, 100, 200, 100, 300]);

          const totalWin = Math.min(50, Math.floor(bet * STAGES[6].multiplier));
          setGameState('won');
          setIsRevealing(false);
          onGameWin(totalWin, STAGES[6].multiplier);
        } else {
          // Progress to Next Stage
          setTimeout(() => {
            setCurrentStep((prev) => prev + 1);
            setSelectedChestIdx(null);
            setIsRevealing(false);
          }, 800);
        }
      }
    }, 400);
  };

  // Collect Current Winnings (Cash Out)
  const handleCollectWinnings = () => {
    if (gameState !== 'playing' || currentStep === 0) return;

    const mult = STAGES[currentStep - 1].multiplier;
    const totalWin = Math.min(50, Math.floor(bet * mult));

    if (soundEnabled) synth.playFanfare();
    triggerHaptic([80, 40, 120]);

    setGameState('won');
    onGameWin(totalWin, mult);
  };

  // Unlock Theme in Shop
  const handleBuyTheme = (theme: TreasureTheme) => {
    if (unlockedThemeIds.includes(theme.id)) {
      // Equip directly
      setActiveThemeId(theme.id);
      if (soundEnabled) synth.playClick();
      return;
    }

    if (coins < theme.cost) {
      if (soundEnabled) synth.playError();
      return;
    }

    // Deduct coins & unlock
    validateAndDeductCoins(theme.cost, `Theme: ${theme.name}`);
    setUnlockedThemeIds((prev) => [...prev, theme.id]);
    setActiveThemeId(theme.id);
    if (soundEnabled) synth.playFanfare();
    triggerHaptic([60, 100, 60]);
  };

  return (
    <div 
      className={`relative w-full max-w-5xl mx-auto rounded-3xl overflow-hidden bg-gradient-to-b ${activeTheme.bgGradient} border border-white/10 shadow-2xl text-white p-4 sm:p-6 select-none transition-all duration-700 ${
        screenShake ? 'animate-bounce' : ''
      }`}
      id="treasure_expedition_root"
    >
      {/* Dynamic Background Particle Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-60" />

      {/* Atmospheric Ambient Glow Corner Flares */}
      <div 
        className="absolute -top-32 -left-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 z-0" 
        style={{ backgroundColor: activeTheme.glowColor }} 
      />
      <div 
        className="absolute -bottom-32 -right-32 w-80 h-80 rounded-full blur-3xl pointer-events-none transition-colors duration-700 z-0" 
        style={{ backgroundColor: activeTheme.glowColor }} 
      />

      {/* HEADER CONTROL BAR */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 mb-6 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-zinc-900/90 border border-white/15 flex items-center justify-center text-xl shadow-lg">
            {activeTheme.icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg sm:text-xl font-black uppercase tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-500">
                Treasure Hunt
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-[10px] font-bold text-amber-300 uppercase tracking-widest">
                AAA Expedition
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">
              {activeTheme.environmentName}
            </p>
          </div>
        </div>

        {/* Action Controls: Shop & Sound Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              if (soundEnabled) synth.playClick();
              setIsShopOpen(true);
            }}
            className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500/20 to-yellow-500/20 hover:from-amber-500/30 hover:to-yellow-500/30 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition active:scale-95 shadow-md shadow-amber-500/10"
            id="open_treasure_shop_btn"
          >
            <ShoppingBag className="h-4 w-4 text-amber-400 animate-pulse" />
            <span>Treasure Shop</span>
          </button>

          <button
            onClick={() => {
              setSoundEnabled(!soundEnabled);
              if (!soundEnabled) synth.playClick();
            }}
            className="p-2.5 rounded-xl bg-zinc-900/80 border border-white/10 text-zinc-400 hover:text-white transition active:scale-95"
            title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
          >
            {soundEnabled ? <Volume2 className="h-4.5 w-4.5 text-amber-400" /> : <VolumeX className="h-4.5 w-4.5 text-zinc-500" />}
          </button>
        </div>
      </div>

      {/* MAIN GAME LAYOUT GRID */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: ADVENTURE MAP & PROGRESSION */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-4">
          
          {/* INTERACTIVE EXPEDITION MAP */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl space-y-3 relative overflow-hidden shadow-xl">
            <div className="flex items-center justify-between text-xs font-black uppercase tracking-wider pb-2 border-b border-white/5">
              <span className="text-amber-400 flex items-center gap-1.5">
                <Compass className="h-4 w-4 animate-spin text-amber-400" />
                Expedition Map
              </span>
              <span className="text-zinc-400 font-mono text-[10px]">
                {gameState === 'playing' ? `Stage ${currentStep + 1} / 7` : '7 Stages Total'}
              </span>
            </div>

            {/* MAP STAGE PATH NODES */}
            <div className="relative space-y-2 py-1">
              {/* Connecting Path Line */}
              <div className="absolute left-[21px] top-4 bottom-4 w-1 bg-gradient-to-b from-amber-500/50 via-yellow-500/30 to-zinc-800 -z-0 rounded-full" />

              {STAGES.slice().reverse().map((stg) => {
                const idx = stg.stageNumber - 1;
                const isCurrent = idx === currentStep && gameState === 'playing';
                const isCleared = idx < currentStep;
                const isLocked = idx > currentStep && gameState === 'playing';

                return (
                  <motion.div
                    key={stg.stageNumber}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className={`relative z-10 flex items-center justify-between p-2.5 rounded-xl border transition duration-300 ${
                      isCurrent
                        ? 'bg-gradient-to-r from-amber-500/20 to-yellow-500/10 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.2)]'
                        : isCleared
                        ? 'bg-emerald-950/30 border-emerald-500/30 text-zinc-300'
                        : 'bg-zinc-900/40 border-white/5 text-zinc-500'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Node Icon Circle */}
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-mono font-bold text-xs transition border ${
                        isCurrent 
                          ? 'bg-amber-400 text-black border-amber-300 shadow-md shadow-amber-400/50 scale-110' 
                          : isCleared 
                          ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40' 
                          : 'bg-zinc-800/80 text-zinc-500 border-white/5'
                      }`}>
                        {isCleared ? <CheckCircle2 className="h-4 w-4 text-emerald-400" /> : stg.stageNumber}
                      </div>

                      <div>
                        <div className="text-xs font-bold text-white flex items-center gap-1.5">
                          <span>{stg.icon}</span>
                          <span className={isCurrent ? 'text-amber-300 font-black' : ''}>{stg.name}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-medium">
                          {stg.locationName} • {stg.chestName}
                        </span>
                      </div>
                    </div>

                    {/* Multiplier Badge */}
                    <div className={`font-mono text-xs font-black px-2.5 py-1 rounded-lg border ${
                      isCurrent 
                        ? 'bg-amber-400 text-black border-amber-300' 
                        : isCleared 
                        ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                        : 'bg-zinc-900 text-zinc-500 border-white/5'
                    }`}>
                      {stg.multiplier}x
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>

          {/* GAME CONTROLS & BET SETUP */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 sm:p-5 backdrop-blur-xl space-y-4 shadow-xl">
            {/* Bet Input */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Coins className="h-3.5 w-3.5 text-amber-400" />
                  Expedition Entry Coins
                </label>
                <span className="text-[11px] text-zinc-400 font-mono font-bold">
                  Balance: {coins.toLocaleString()}
                </span>
              </div>

              <div className="relative flex items-center">
                <input
                  type="number"
                  disabled={gameState === 'playing'}
                  value={bet}
                  onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                  className="w-full bg-zinc-900/90 border border-white/15 rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-amber-300 outline-none focus:border-amber-400 transition"
                />
                <span className="absolute right-3 text-xs text-amber-400 font-bold">🪙</span>
              </div>

              {/* Quick Bet Buttons */}
              <div className="grid grid-cols-4 gap-1.5 mt-2">
                {[50, 100, 250, 500].map((amt) => (
                  <button
                    key={amt}
                    disabled={gameState === 'playing'}
                    onClick={() => {
                      if (soundEnabled) synth.playClick();
                      setBet(amt);
                    }}
                    className={`py-1 rounded-lg border text-[10px] font-mono font-bold transition ${
                      bet === amt 
                        ? 'bg-amber-500/20 border-amber-400 text-amber-300' 
                        : 'bg-zinc-900 border-white/5 text-zinc-400 hover:text-white hover:border-white/20'
                    }`}
                  >
                    {amt}
                  </button>
                ))}
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div>
              {gameState === 'playing' ? (
                <div className="space-y-2">
                  {/* Cash Out Button */}
                  {currentStep > 0 && (
                    <button
                      onClick={handleCollectWinnings}
                      className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black uppercase text-xs tracking-wider shadow-lg shadow-emerald-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2"
                    >
                      <Crown className="h-4 w-4 text-black" />
                      <span>Collect {Math.floor(bet * STAGE_MULTIPLIER_LOOKUP(currentStep - 1)).toLocaleString()} Coins ({STAGE_MULTIPLIER_LOOKUP(currentStep - 1)}x)</span>
                    </button>
                  )}

                  <div className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl text-center">
                    <span className="text-xs font-bold text-amber-300 flex items-center justify-center gap-1.5">
                      <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" />
                      Choose a Chest in Stage {currentStep + 1}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={handleStartRun}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-black font-black uppercase text-xs tracking-wider shadow-lg shadow-amber-500/25 transition active:scale-[0.98] flex items-center justify-center gap-2 group"
                >
                  <Play className="h-4 w-4 fill-black text-black" />
                  <span>Begin Expedition ({bet} Coins)</span>
                  <ArrowRight className="h-4 w-4 transform group-hover:translate-x-1 transition" />
                </button>
              )}
            </div>
          </div>

        </div>

        {/* RIGHT COLUMN: ACTIVE STAGE CHESTS & REVEAL EXPERIENCE */}
        <div className="lg:col-span-7 flex flex-col justify-between space-y-4">
          
          {/* STAGE HEADER DISPLAY */}
          <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-5 backdrop-blur-xl relative overflow-hidden shadow-xl min-h-[420px] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-amber-400">
                  Current Stage Chamber
                </span>
                <h3 className="text-lg font-black text-white flex items-center gap-2">
                  <span>{STAGES[currentStep].icon}</span>
                  <span>Stage {currentStep + 1}: {STAGES[currentStep].name}</span>
                </h3>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-400">
                  Potential Reward
                </span>
                <div className="text-lg font-mono font-black text-amber-300">
                  {Math.floor(bet * STAGES[currentStep].multiplier).toLocaleString()} 🪙
                </div>
              </div>
            </div>

            {/* CHEST SELECTION AREA */}
            <div className="my-auto py-8">
              <p className="text-center text-xs text-zinc-300 font-medium mb-6">
                {gameState === 'playing' 
                  ? 'Select one of the 3 expedition chests below. Two hold safe treasure, one holds an explosive trap!'
                  : 'Start an expedition to open chests and claim multipliers up to 32x!'}
              </p>

              {/* 3 CHESTS CONTAINER */}
              <div className="grid grid-cols-3 gap-3 sm:gap-5 max-w-lg mx-auto">
                {[0, 1, 2].map((chestIdx) => {
                  const isSelected = selectedChestIdx === chestIdx;
                  const isInteractive = gameState === 'playing' && !isRevealing;

                  return (
                    <motion.button
                      key={chestIdx}
                      disabled={!isInteractive}
                      whileHover={isInteractive ? { scale: 1.05, y: -4 } : {}}
                      whileTap={isInteractive ? { scale: 0.95 } : {}}
                      onClick={() => handleOpenChest(chestIdx)}
                      className={`relative flex flex-col items-center justify-center p-4 sm:p-6 rounded-2xl border-2 transition duration-300 ${
                        isSelected
                          ? 'bg-amber-500/20 border-amber-400 shadow-[0_0_30px_rgba(251,191,36,0.35)] scale-105'
                          : isInteractive
                          ? 'bg-zinc-900/90 hover:bg-zinc-800/90 border-white/15 hover:border-amber-400/80 cursor-pointer shadow-lg'
                          : 'bg-zinc-950/60 border-white/5 opacity-50 cursor-not-allowed'
                      }`}
                    >
                      {/* Chest Icon Visual */}
                      <div className="text-4xl sm:text-5xl mb-2 filter drop-shadow-md transition transform group-hover:scale-110">
                        {STAGES[currentStep].icon}
                      </div>

                      <span className="text-[11px] font-black uppercase tracking-wider text-zinc-300">
                        Chest #{chestIdx + 1}
                      </span>
                      <span className="text-[9px] text-amber-400 font-bold font-mono">
                        {STAGES[currentStep].chestName}
                      </span>
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* REVEALED REWARD CARD OVERLAY */}
            <AnimatePresence>
              {lastRevealedReward && (
                <motion.div
                  initial={{ opacity: 0, y: 15, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-amber-500/20 border border-amber-400/40 rounded-xl p-3 text-center space-y-0.5"
                >
                  <div className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center justify-center gap-1.5">
                    <span>{lastRevealedReward.icon}</span>
                    <span>{lastRevealedReward.title}</span>
                  </div>
                  <p className="text-[10px] text-zinc-300 font-medium">
                    {lastRevealedReward.desc}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* GAME OUTCOME BANNERS */}
            <AnimatePresence>
              {gameState === 'lost' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-4 rounded-xl bg-red-950/80 border border-red-500/50 text-center space-y-2 shadow-xl"
                >
                  <div className="flex items-center justify-center gap-2 text-red-400 font-black uppercase text-sm">
                    <Skull className="h-5 w-5 animate-bounce" />
                    <span>TRAP TRIGGERED! EXPEDITION FAILED</span>
                  </div>
                  <p className="text-xs text-red-200">
                    You hit a trapped chest in Stage {currentStep + 1}. Start a new run to conquer the vault!
                  </p>
                  <button
                    onClick={handleStartRun}
                    className="mt-2 px-5 py-2 rounded-xl bg-red-500 hover:bg-red-400 text-black font-black uppercase text-xs tracking-wider transition"
                  >
                    Try Again ({bet} 🪙)
                  </button>
                </motion.div>
              )}

              {gameState === 'won' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-5 rounded-xl bg-emerald-950/80 border border-emerald-400/60 text-center space-y-2 shadow-2xl"
                >
                  <div className="flex items-center justify-center gap-2 text-emerald-300 font-black uppercase text-base">
                    <Trophy className="h-6 w-6 text-yellow-400 animate-bounce" />
                    <span>VICTORY! VAULT TREASURE SECURED</span>
                  </div>
                  <p className="text-xs text-emerald-100">
                    You successfully claimed your expedition bounty of {Math.floor(bet * STAGES[Math.max(0, currentStep - 1)].multiplier).toLocaleString()} Coins!
                  </p>
                  <button
                    onClick={handleStartRun}
                    className="mt-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 text-black font-black uppercase text-xs tracking-wider shadow-lg transition"
                  >
                    New Expedition ({bet} 🪙)
                  </button>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>

      {/* TREASURE SHOP MODAL */}
      <AnimatePresence>
        {isShopOpen && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-2xl bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl text-white space-y-5 max-h-[90vh] overflow-y-auto"
            >
              {/* Close Shop */}
              <button
                onClick={() => {
                  if (soundEnabled) synth.playClick();
                  setIsShopOpen(false);
                }}
                className="absolute top-4 right-4 p-2 rounded-full bg-zinc-900 border border-white/10 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-xl">
                  🏛️
                </div>
                <div>
                  <h3 className="text-lg font-black uppercase tracking-wider text-amber-300">
                    Treasure Expedition Shop
                  </h3>
                  <p className="text-xs text-zinc-400">
                    Unlock and equip premium expedition environments using your coins.
                  </p>
                </div>
              </div>

              {/* THEMES GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {TREASURE_THEMES.map((thm) => {
                  const isUnlocked = unlockedThemeIds.includes(thm.id);
                  const isEquipped = activeThemeId === thm.id;

                  return (
                    <div
                      key={thm.id}
                      className={`p-4 rounded-2xl border transition flex flex-col justify-between space-y-3 ${
                        isEquipped
                          ? 'bg-amber-500/10 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.15)]'
                          : isUnlocked
                          ? 'bg-zinc-900/80 border-white/15'
                          : 'bg-zinc-950/60 border-white/5 opacity-80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-2xl">{thm.icon}</span>
                          {isEquipped ? (
                            <span className="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[9px] font-black uppercase tracking-wider">
                              Equipped
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[9px] font-bold uppercase tracking-wider border border-emerald-500/30">
                              Unlocked
                            </span>
                          ) : (
                            <span className="text-xs font-mono font-bold text-amber-400 flex items-center gap-1">
                              <span>🪙</span>
                              <span>{thm.cost.toLocaleString()}</span>
                            </span>
                          )}
                        </div>
                        <h4 className="text-sm font-bold text-white">{thm.name}</h4>
                        <p className="text-[11px] text-zinc-400 leading-tight mt-0.5">{thm.description}</p>
                      </div>

                      <button
                        onClick={() => handleBuyTheme(thm)}
                        disabled={isEquipped}
                        className={`w-full py-2 px-3 rounded-xl font-bold uppercase text-[10px] tracking-wider transition ${
                          isEquipped
                            ? 'bg-zinc-800 text-zinc-500 cursor-default'
                            : isUnlocked
                            ? 'bg-amber-500 hover:bg-amber-400 text-black shadow-md'
                            : coins >= thm.cost
                            ? 'bg-gradient-to-r from-amber-500 to-yellow-400 text-black hover:brightness-110 shadow-md'
                            : 'bg-zinc-900 border border-white/5 text-zinc-500 cursor-not-allowed'
                        }`}
                      >
                        {isEquipped ? 'Active' : isUnlocked ? 'Equip Theme' : coins >= thm.cost ? `Unlock (${thm.cost} Coins)` : 'Need More Coins'}
                      </button>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Helper lookup for stage multipliers
function STAGE_MULTIPLIER_LOOKUP(stageIndex: number): number {
  if (stageIndex < 0 || stageIndex >= STAGES.length) return 1.0;
  return STAGES[stageIndex].multiplier;
}
