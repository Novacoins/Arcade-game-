/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Flame, Shield, 
  RotateCw, Play, CheckCircle2, AlertCircle, 
  Coins, TrendingUp, History, Lock, Gift, BarChart3, Star, X, Check, Crown, Clock, Brain, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface MemoryFlipProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export interface DifficultyConfig {
  id: 'easy' | 'medium' | 'hard';
  name: string;
  badge: string;
  gridCols: string; // Tailwind grid col class
  gridSizeLabel: string;
  totalCards: number;
  pairsCount: number;
  multiplier: number;
  defaultCoinsToPay: number;
  theme: {
    bgGradient: string;
    cardBorder: string;
    cardGlow: string;
    accentText: string;
    progressFill: string;
  };
  symbols: { char: string; name: string }[];
}

export const DIFFICULTY_CONFIGS: Record<'easy' | 'medium' | 'hard', DifficultyConfig> = {
  easy: {
    id: 'easy',
    name: 'Easy',
    badge: '🟢 Easy',
    gridCols: 'grid-cols-3 sm:grid-cols-4',
    gridSizeLabel: '3 × 4 Grid (12 Cards)',
    totalCards: 12,
    pairsCount: 6,
    multiplier: 2.0,
    defaultCoinsToPay: 50,
    theme: {
      bgGradient: 'from-sky-950 via-zinc-950 to-emerald-950',
      cardBorder: 'border-sky-400/40 hover:border-sky-300',
      cardGlow: 'shadow-[0_0_15px_rgba(56,189,248,0.3)]',
      accentText: 'text-sky-400',
      progressFill: 'from-sky-400 to-emerald-400',
    },
    // Colorful Objects
    symbols: [
      { char: '🍎', name: 'Apple' },
      { char: '🌸', name: 'Flower' },
      { char: '🎈', name: 'Balloon' },
      { char: '⭐', name: 'Star' },
      { char: '🧸', name: 'Teddy Bear' },
      { char: '🍃', name: 'Leaf' },
    ],
  },
  medium: {
    id: 'medium',
    name: 'Medium',
    badge: '🟡 Medium',
    gridCols: 'grid-cols-4',
    gridSizeLabel: '4 × 4 Grid (16 Cards)',
    totalCards: 16,
    pairsCount: 8,
    multiplier: 3.5,
    defaultCoinsToPay: 100,
    theme: {
      bgGradient: 'from-purple-950 via-zinc-950 to-cyan-950',
      cardBorder: 'border-purple-400/40 hover:border-amber-300',
      cardGlow: 'shadow-[0_0_15px_rgba(168,85,247,0.35)]',
      accentText: 'text-purple-400',
      progressFill: 'from-purple-500 via-amber-400 to-cyan-400',
    },
    // Premium Gaming Icons
    symbols: [
      { char: '💎', name: 'Gem' },
      { char: '🛡️', name: 'Shield' },
      { char: '👑', name: 'Crown' },
      { char: '🗝️', name: 'Key' },
      { char: '🧪', name: 'Potion' },
      { char: '📜', name: 'Scroll' },
      { char: '🏆', name: 'Trophy' },
      { char: '💍', name: 'Ring' },
    ],
  },
  hard: {
    id: 'hard',
    name: 'Hard',
    badge: '🔴 Hard',
    gridCols: 'grid-cols-4 sm:grid-cols-5',
    gridSizeLabel: '5 × 4 Grid (20 Cards)',
    totalCards: 20,
    pairsCount: 10,
    multiplier: 6.0,
    defaultCoinsToPay: 250,
    theme: {
      bgGradient: 'from-red-950 via-zinc-950 to-orange-950',
      cardBorder: 'border-red-400/40 hover:border-emerald-300',
      cardGlow: 'shadow-[0_0_15px_rgba(239,68,68,0.4)]',
      accentText: 'text-red-400',
      progressFill: 'from-red-500 via-emerald-400 to-orange-400',
    },
    // Themed Collections
    symbols: [
      { char: '🦁', name: 'Lion' },
      { char: '🦅', name: 'Eagle' },
      { char: '🏰', name: 'Castle' },
      { char: '🚀', name: 'Rocket' },
      { char: '🌴', name: 'Palm' },
      { char: '🐬', name: 'Dolphin' },
      { char: '🎸', name: 'Guitar' },
      { char: '🛸', name: 'UFO' },
      { char: '🏛️', name: 'Landmark' },
      { char: '🏎️', name: 'Race Car' },
    ],
  },
};

export interface CardItem {
  id: number;
  symbol: string;
  name: string;
  flipped: boolean;
  matched: boolean;
  mismatched?: boolean;
}

export function MemoryFlip({ coins, onGameWin, onGameLose }: MemoryFlipProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Game Configuration State
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  
  // Active Game State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [cards, setCards] = useState<CardItem[]>([]);
  const [selectedIndices, setSelectedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState<number>(0);
  const [matchedPairsCount, setMatchedPairsCount] = useState<number>(0);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);

  // Victory Popup & Animation States
  const [victoryModal, setVictoryModal] = useState<{
    coinsEarned: number;
    multiplier: number;
    completionTimeSec: number;
    movesUsed: number;
  } | null>(null);

  const [flyingCoins, setFlyingCoins] = useState<{ id: number; x: number; y: number }[]>([]);
  const [toastMessage, setToastMessage] = useState<string>('');

  // Persistent Statistics
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('mf_game_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      totalMatchesPlayed: 0,
      totalMoves: 0,
      totalTimePlayedSec: 0,
      bestTimeSec: 0,
      bestScoreMultiplier: 0,
      winStreak: 0,
      totalCoinsEarned: 0,
    };
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Save Stats
  useEffect(() => {
    localStorage.setItem('mf_game_stats', JSON.stringify(stats));
  }, [stats]);

  const currentConfig = DIFFICULTY_CONFIGS[difficulty];

  // Timer Effect
  useEffect(() => {
    if (gameState === 'playing') {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // Toast Helper
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Start Memory Challenge
  const handleStartChallenge = () => {
    if (gameState === 'playing') return;

    if (!validateAndDeductCoins(coinsToPay, 'Memory Flip')) {
      return;
    }

    // Sound effect
    synth.playClick();

    // Prepare deck
    const chosenConfig = DIFFICULTY_CONFIGS[difficulty];
    const pairsToUse = chosenConfig.symbols.slice(0, chosenConfig.pairsCount);
    const deck = [...pairsToUse, ...pairsToUse];

    // Shuffle deck
    const shuffled = deck
      .map((item, idx) => ({
        id: idx,
        symbol: item.char,
        name: item.name,
        flipped: false,
        matched: false,
      }))
      .sort(() => Math.random() - 0.5);

    setCards(shuffled);
    setSelectedIndices([]);
    setMoves(0);
    setMatchedPairsCount(0);
    setElapsedSeconds(0);
    setGameState('playing');
    setVictoryModal(null);
  };

  // Card Click Interaction
  const handleCardClick = (index: number) => {
    if (gameState !== 'playing') return;
    if (cards[index].flipped || cards[index].matched || selectedIndices.length >= 2) return;

    // Flip sound
    synth.playCard();

    // Flip card
    const updatedCards = [...cards];
    updatedCards[index].flipped = true;
    setCards(updatedCards);

    const nextSelected = [...selectedIndices, index];
    setSelectedIndices(nextSelected);

    // If 2 cards selected, evaluate match
    if (nextSelected.length === 2) {
      setMoves(prev => prev + 1);
      const [idx1, idx2] = nextSelected;

      if (updatedCards[idx1].symbol === updatedCards[idx2].symbol) {
        // MATCHED!
        setTimeout(() => {
          synth.playCoin();
          
          const matchCards = [...cards];
          matchCards[idx1].matched = true;
          matchCards[idx2].matched = true;
          setCards(matchCards);
          setSelectedIndices([]);

          const newMatchedCount = matchedPairsCount + 1;
          setMatchedPairsCount(newMatchedCount);

          // WIN CONDITION CHECK
          if (newMatchedCount === currentConfig.pairsCount) {
            handleVictory(moves + 1, elapsedSeconds);
          }
        }, 350);
      } else {
        // MISMATCHED!
        setTimeout(() => {
          synth.playError();
          
          const mismatchCards = [...cards];
          mismatchCards[idx1].mismatched = true;
          mismatchCards[idx2].mismatched = true;
          setCards(mismatchCards);

          // Flip back after short shake
          setTimeout(() => {
            const resetCards = [...cards];
            resetCards[idx1].flipped = false;
            resetCards[idx1].mismatched = false;
            resetCards[idx2].flipped = false;
            resetCards[idx2].mismatched = false;
            setCards(resetCards);
            setSelectedIndices([]);
          }, 600);
        }, 350);
      }
    }
  };

  // Victory Handler
  const handleVictory = (finalMoves: number, finalTimeSec: number) => {
    synth.playVictory();
    setGameState('gameover');

    // Calculate Efficiency Multiplier
    const baseMult = currentConfig.multiplier;
    const isSuperFast = finalTimeSec <= currentConfig.pairsCount * 3;
    const bonusMult = isSuperFast ? 1.2 : 1.0;
    const finalMult = parseFloat((baseMult * bonusMult).toFixed(1));

    const totalWinCoins = Math.floor(coinsToPay * finalMult);
    onGameWin(totalWinCoins, finalMult);

    // Update Stats
    setStats(prev => ({
      totalMatchesPlayed: prev.totalMatchesPlayed + 1,
      totalMoves: prev.totalMoves + finalMoves,
      totalTimePlayedSec: prev.totalTimePlayedSec + finalTimeSec,
      bestTimeSec: prev.bestTimeSec === 0 ? finalTimeSec : Math.min(prev.bestTimeSec, finalTimeSec),
      bestScoreMultiplier: Math.max(prev.bestScoreMultiplier, finalMult),
      winStreak: prev.winStreak + 1,
      totalCoinsEarned: prev.totalCoinsEarned + totalWinCoins,
    }));

    // Trigger Popup Modal
    setVictoryModal({
      coinsEarned: totalWinCoins,
      multiplier: finalMult,
      completionTimeSec: finalTimeSec,
      movesUsed: finalMoves,
    });
  };

  // Collect Victory Rewards
  const handleCollectVictory = () => {
    synth.playCoin();
    if (victoryModal && victoryModal.coinsEarned > 0) {
      const coinsAnim = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 180,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 180,
      }));
      setFlyingCoins(coinsAnim);
      setTimeout(() => setFlyingCoins([]), 900);
    }
    setVictoryModal(null);
  };

  // Quick coins selection helpers
  const setQuickCoins = (action: 'min' | 'half' | 'double' | 'max' | 'add100' | 'add500') => {
    synth.playClick();
    if (action === 'min') setCoinsToPay(10);
    else if (action === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    else if (action === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    else if (action === 'max') setCoinsToPay(prev => Math.min(10000, coins));
    else if (action === 'add100') setCoinsToPay(prev => Math.min(coins, prev + 100));
    else if (action === 'add500') setCoinsToPay(prev => Math.min(coins, prev + 500));
  };

  // Format time mm:ss
  const formatTime = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const secs = sec % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Progress percentage
  const progressPercent = Math.round((matchedPairsCount / currentConfig.pairsCount) * 100);

  return (
    <div className={`bg-gradient-to-b ${currentConfig.theme.bgGradient} p-4 sm:p-6 rounded-3xl border border-white/10 max-w-2xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl transition-all duration-700`} id="memory_flip_root">
      
      {/* 1. ANIMATED BACKGROUND LIGHT BEAMS & SPARKLES */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-32 left-1/3 w-96 h-96 bg-cyan-500/20 rounded-full blur-3xl" />
        
        <div className="absolute top-12 left-10 text-xs text-amber-300 animate-ping">✨</div>
        <div className="absolute top-1/2 right-12 text-xs text-cyan-300 animate-bounce">🌟</div>
        <div className="absolute bottom-12 left-1/4 text-xs text-purple-300 animate-pulse">💎</div>
      </div>

      {/* Flying Coins Animation */}
      {flyingCoins.map(coin => (
        <motion.div
          key={coin.id}
          initial={{ x: coin.x, y: coin.y, scale: 1, opacity: 1 }}
          animate={{ x: window.innerWidth / 2, y: 30, scale: 0.2, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
          className="fixed z-50 text-2xl pointer-events-none drop-shadow-[0_0_12px_rgba(250,204,21,0.9)]"
        >
          🪙
        </motion.div>
      ))}

      {/* Toast Notice */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-black px-4 py-2 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-yellow-200"
          >
            <Sparkles className="h-4 w-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HEADER SECTION */}
      <div className="relative z-10 border-b border-white/10 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-left">
          <div className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl animate-bounce">
                🧠
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Memory Flip Challenge
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold flex items-center gap-2">
                <span>Theme: <strong className={currentConfig.theme.accentText}>{currentConfig.name}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-black">{currentConfig.multiplier}x Multiplier</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
              <Coins className="h-3.5 w-3.5 text-amber-400" />
              <span>{coins.toLocaleString()} 🪙</span>
            </div>
          </div>
        </div>
      </div>

      {/* 1. DIFFICULTY SELECTION CARDS */}
      <div className="relative z-10 space-y-2 text-left">
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
          Select Difficulty
        </label>
        <div className="grid grid-cols-3 gap-2">
          {(Object.keys(DIFFICULTY_CONFIGS) as Array<'easy' | 'medium' | 'hard'>).map((key) => {
            const conf = DIFFICULTY_CONFIGS[key];
            const isSelected = difficulty === key;

            return (
              <motion.button
                key={key}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={gameState === 'playing'}
                onClick={() => {
                  synth.playClick();
                  setDifficulty(key);
                  setCoinsToPay(conf.defaultCoinsToPay);
                }}
                className={`p-2.5 sm:p-3 rounded-2xl border-2 text-center transition-all relative overflow-hidden ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-105'
                    : 'bg-zinc-950/60 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <div className="text-[11px] sm:text-xs font-black uppercase text-amber-300">
                  {conf.badge}
                </div>
                <div className="text-[9px] font-mono text-gray-400 mt-0.5">
                  {conf.gridSizeLabel}
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono font-black mt-2 pt-1.5 border-t border-white/10">
                  <span className="text-emerald-400">{conf.multiplier}x</span>
                  <span className="text-amber-300">{conf.defaultCoinsToPay} 🪙</span>
                </div>
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* 2. PROGRESS BAR & LIVE HUD (MOVES & TIMER) */}
      <div className="relative z-10 bg-zinc-950/80 p-3 sm:p-4 rounded-3xl border border-white/10 space-y-3">
        <div className="flex justify-between items-center text-xs font-black">
          <span className="text-gray-300 uppercase tracking-wider flex items-center gap-1.5">
            <Target className="h-4 w-4 text-amber-400" />
            Pairs Matched: <strong className="text-amber-300">{matchedPairsCount} / {currentConfig.pairsCount}</strong>
          </span>

          <div className="flex items-center gap-3 font-mono">
            <span className="text-gray-300 flex items-center gap-1">
              <RotateCw className="h-3.5 w-3.5 text-cyan-400" /> Moves: <strong className="text-white">{moves}</strong>
            </span>
            <span className="text-gray-300 flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 text-purple-400" /> Time: <strong className="text-white">{formatTime(elapsedSeconds)}</strong>
            </span>
          </div>
        </div>

        {/* Animated Progress Bar */}
        <div className="w-full bg-zinc-900 rounded-full h-3 p-0.5 border border-white/10 relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.4 }}
            className={`h-full bg-gradient-to-r ${currentConfig.theme.progressFill} rounded-full shadow-[0_0_10px_rgba(245,158,11,0.8)]`}
          />
        </div>
        <div className="text-[9px] font-mono font-bold text-gray-400 text-right">
          Progress: {progressPercent}%
        </div>
      </div>

      {/* 3. MEMORY CARDS BOARD */}
      <div className="relative z-10 bg-zinc-950/90 p-4 sm:p-6 rounded-3xl border border-white/10 min-h-[320px] flex items-center justify-center shadow-inner">
        {gameState === 'playing' || gameState === 'gameover' ? (
          <div className={`grid ${currentConfig.gridCols} gap-2.5 sm:gap-3 w-full max-w-md mx-auto`}>
            {cards.map((card, idx) => {
              const isFlipped = card.flipped || card.matched;

              return (
                <motion.button
                  key={card.id}
                  whileHover={{ scale: isFlipped ? 1 : 1.06 }}
                  whileTap={{ scale: 0.94 }}
                  animate={card.mismatched ? { x: [-6, 6, -6, 6, 0] } : {}}
                  transition={{ duration: 0.3 }}
                  onClick={() => handleCardClick(idx)}
                  disabled={isFlipped || gameState !== 'playing'}
                  className={`aspect-square rounded-2xl border-2 flex flex-col items-center justify-center text-2xl sm:text-3xl transition-all duration-300 relative select-none shadow-lg ${
                    card.matched
                      ? 'bg-emerald-500/20 border-emerald-400 text-white shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                      : card.mismatched
                      ? 'bg-red-500/20 border-red-500 text-red-300 shadow-[0_0_15px_rgba(239,68,68,0.5)]'
                      : card.flipped
                      ? 'bg-zinc-900 border-amber-400 text-white shadow-[0_0_15px_rgba(250,204,21,0.5)]'
                      : `bg-gradient-to-br from-zinc-900 to-black ${currentConfig.theme.cardBorder} text-transparent hover:scale-105`
                  }`}
                >
                  {/* Card Front vs Back Visual */}
                  {isFlipped ? (
                    <motion.div
                      initial={{ rotateY: 90 }}
                      animate={{ rotateY: 0 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col items-center justify-center"
                    >
                      <span>{card.symbol}</span>
                      <span className="text-[8px] font-mono font-black text-gray-300 mt-1 uppercase tracking-tighter">
                        {card.name}
                      </span>
                    </motion.div>
                  ) : (
                    <div className="flex flex-col items-center justify-center">
                      <span className="text-xl opacity-40">🧠</span>
                      <span className="text-[8px] font-mono font-bold text-gray-500 mt-0.5">FLIP</span>
                    </div>
                  )}

                  {/* Matched Checkmark Overlay */}
                  {card.matched && (
                    <div className="absolute top-1 right-1 h-4 w-4 rounded-full bg-emerald-500 text-black flex items-center justify-center text-[10px] font-black">
                      ✓
                    </div>
                  )}
                </motion.button>
              );
            })}
          </div>
        ) : (
          /* Pre-Game Idle Display */
          <div className="text-center space-y-3 py-6">
            <div className="text-5xl animate-bounce">🧠</div>
            <h4 className="text-sm font-black uppercase text-amber-400 tracking-wider">
              {currentConfig.name} Memory Challenge
            </h4>
            <p className="text-xs text-gray-400 max-w-xs mx-auto font-bold">
              Select difficulty above, configure your <strong className="text-amber-300">Coins to Pay</strong>, and press Start Challenge!
            </p>
          </div>
        )}
      </div>

      {/* 4. COINS TO PAY PANEL (REPLACED BET AMOUNT) */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={gameState === 'playing'}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-amber-400 outline-none shadow-inner"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setQuickCoins('add100')}
            disabled={gameState === 'playing'}
            className="py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/50 text-[10px] font-black text-gray-300 uppercase transition"
          >
            +100 Coins
          </button>
          <button
            onClick={() => setQuickCoins('add500')}
            disabled={gameState === 'playing'}
            className="py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/50 text-[10px] font-black text-gray-300 uppercase transition"
          >
            +500 Coins
          </button>
        </div>
      </div>

      {/* 5. START CHALLENGE BUTTON */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStartChallenge}
        disabled={gameState === 'playing'}
        className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>▶ START MEMORY CHALLENGE ({currentConfig.multiplier}x REWARD)</span>
      </motion.button>

      {/* 6. STATISTICS PANEL */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 border-b border-white/10 pb-2">
          <BarChart3 className="h-4 w-4" />
          Memory Career Statistics
        </h4>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Matches Played</div>
            <div className="text-base font-mono font-black text-white mt-0.5">{stats.totalMatchesPlayed}</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Total Moves</div>
            <div className="text-base font-mono font-black text-cyan-400 mt-0.5">{stats.totalMoves}</div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Best Time</div>
            <div className="text-base font-mono font-black text-purple-400 mt-0.5">
              {stats.bestTimeSec > 0 ? formatTime(stats.bestTimeSec) : 'N/A'}
            </div>
          </div>

          <div className="bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Win Streak</div>
            <div className="text-base font-mono font-black text-amber-300 mt-0.5">{stats.winStreak} 🔥</div>
          </div>

          <div className="col-span-2 bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Best Score Multiplier</div>
            <div className="text-base font-mono font-black text-emerald-400 mt-0.5">{stats.bestScoreMultiplier > 0 ? `${stats.bestScoreMultiplier}x` : 'N/A'}</div>
          </div>

          <div className="col-span-2 bg-zinc-900/80 p-2.5 rounded-2xl border border-white/10">
            <div className="text-[9px] font-bold text-gray-400 uppercase">Coins Earned</div>
            <div className="text-base font-mono font-black text-amber-400 mt-0.5">{stats.totalCoinsEarned.toLocaleString()} 🪙</div>
          </div>
        </div>
      </div>

      {/* 7. WINNING CELEBRATION POPUP */}
      <AnimatePresence>
        {victoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="text-5xl animate-bounce">🎉</div>

              <div>
                <h3 className="text-xl font-black text-amber-400 tracking-tight">
                  CHALLENGE COMPLETE!
                </h3>
                <p className="text-xs text-gray-300 font-bold mt-1">
                  You matched all <strong className="text-amber-300">{currentConfig.pairsCount} pairs</strong> in <strong className="text-white">{currentConfig.name} Mode</strong>!
                </p>
              </div>

              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Moves Used:</span>
                  <span className="font-mono font-black text-white">{victoryModal.movesUsed}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Completion Time:</span>
                  <span className="font-mono font-black text-purple-400">{formatTime(victoryModal.completionTimeSec)}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Bonus Multiplier:</span>
                  <span className="font-mono font-black text-amber-400">×{victoryModal.multiplier}</span>
                </div>
                <div className="flex justify-between text-gray-300 border-t border-white/10 pt-2">
                  <span className="font-bold text-amber-400">Reward Earned:</span>
                  <span className="font-mono font-black text-emerald-400 text-sm">
                    +{victoryModal.coinsEarned.toLocaleString()} Coins
                  </span>
                </div>
              </div>

              <button
                onClick={handleCollectVictory}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-lg"
              >
                COLLECT REWARD 🪙
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
