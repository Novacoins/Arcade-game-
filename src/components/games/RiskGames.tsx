/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { Sparkles, Trophy, Star, ShieldCheck, Flame, Zap, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RiskGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

/* ==========================================
   1. GEM MINES (Crystal Cave Upgrade)
   ========================================== */
export function GemMines({ coins, onGameWin, onGameLose }: RiskGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(10);
  const [minesCount, setMinesCount] = useState(3);
  const [grid, setGrid] = useState<('gem' | 'mine' | null)[]>(Array(25).fill(null));
  const [revealed, setRevealed] = useState<boolean[]>(Array(25).fill(false));
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'exploded' | 'cashed_out'>('idle');
  const [minesPositions, setMinesPositions] = useState<number[]>([]);
  const [gemsFound, setGemsFound] = useState(0);
  const [shaking, setShaking] = useState<number | null>(null);

  const startNewGame = () => {
    if (!validateAndDeductCoins(bet, 'Gem Mines')) {
      return;
    }
    synth.playClick();

    // Populate random mine spots
    const spots: number[] = [];
    while (spots.length < minesCount) {
      const idx = Math.floor(Math.random() * 25);
      if (!spots.includes(idx)) spots.push(idx);
    }

    setMinesPositions(spots);
    setGrid(Array(25).fill(null));
    setRevealed(Array(25).fill(false));
    setGemsFound(0);
    setGameState('playing');
  };

  const handleCellClick = (idx: number) => {
    if (gameState !== 'playing' || revealed[idx]) return;

    const newRevealed = [...revealed];
    newRevealed[idx] = true;
    setRevealed(newRevealed);

    if (minesPositions.includes(idx)) {
      // Exploded!
      synth.playExplode();
      setGameState('exploded');
      setShaking(idx);
      // Reveal everything
      const fullGrid = [...grid];
      for (let i = 0; i < 25; i++) {
        fullGrid[i] = minesPositions.includes(i) ? 'mine' : 'gem';
      }
      setGrid(fullGrid);
      setTimeout(() => setShaking(null), 800);
    } else {
      // Found Gem - play custom gem sound!
      synth.playGem();
      const nextFound = gemsFound + 1;
      setGemsFound(nextFound);

      const nextGrid = [...grid];
      nextGrid[idx] = 'gem';
      setGrid(nextGrid);
    }
  };

  const calculateCurrentMultiplier = () => {
    if (gemsFound === 0) return 1.00;
    let mult = 1.0;
    const houseEdge = 0.98;
    for (let i = 0; i < gemsFound; i++) {
      mult *= (25 - i) / (25 - minesCount - i);
    }
    return parseFloat((mult * houseEdge).toFixed(2));
  };

  const currentMultiplier = calculateCurrentMultiplier();
  const currentWin = Math.min(50, Math.floor(bet * currentMultiplier));

  const handleCashout = () => {
    if (gameState !== 'playing') return;
    synth.playFanfare();
    setGameState('cashed_out');
    onGameWin(currentWin, currentMultiplier);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Play control board */}
        <div className="bg-zinc-950/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-6 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          {/* Glowing purple ambient backdrop */}
          <div className="absolute -top-12 -left-12 h-24 w-24 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />
          
          <div className="space-y-4 z-10">
            <div className="flex items-center gap-2 pb-2 border-b border-white/5">
              <Sparkles className="h-4.5 w-4.5 text-indigo-400 animate-pulse" />
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-indigo-300">Crystal Cave Mines</h4>
                <p className="text-[9px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">High stakes discovery</p>
              </div>
            </div>
            
            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Coins to Pay</label>
              <div className="relative">
                <input
                  type="number"
                  disabled={gameState === 'playing'}
                  value={bet}
                  onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                  className="w-full rounded-xl border border-white/10 bg-black/60 px-3.5 py-2.5 text-xs text-white focus:border-indigo-500 outline-none font-mono"
                />
                <span className="absolute right-3.5 top-2.5 text-[10px] text-zinc-500 font-bold">🪙</span>
              </div>
              <div className="flex gap-1.5 mt-2">
                <button
                  disabled={gameState === 'playing'}
                  onClick={() => setBet(Math.max(10, Math.floor(bet / 2)))}
                  className="flex-1 py-1 text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-white/5 rounded-md hover:text-white hover:bg-zinc-800 transition"
                >
                  1/2
                </button>
                <button
                  disabled={gameState === 'playing'}
                  onClick={() => setBet(bet * 2)}
                  className="flex-1 py-1 text-[9px] font-bold text-zinc-400 bg-zinc-900 border border-white/5 rounded-md hover:text-white hover:bg-zinc-800 transition"
                >
                  2X
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-black text-gray-400 uppercase tracking-wider mb-1">Hazardous Bombs Count</label>
              <select
                disabled={gameState === 'playing'}
                value={minesCount}
                onChange={(e) => setMinesCount(parseInt(e.target.value))}
                className="w-full rounded-xl border border-white/10 bg-black/60 px-3 py-2.5 text-xs text-white focus:border-indigo-500 outline-none font-sans font-bold cursor-pointer"
              >
                {[1, 2, 3, 5, 8, 12, 18, 24].map((m) => (
                  <option key={m} value={m}>{m} Hazards ({((m / 25) * 100).toFixed(0)}% Risk)</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-3 z-10">
            {gameState === 'playing' ? (
              <div className="space-y-3">
                <div className="text-center p-3 rounded-xl bg-indigo-600/10 border border-indigo-500/20 shadow-inner">
                  <p className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">Accumulated Payout</p>
                  <p className="text-lg font-black text-amber-400 mt-0.5">{currentWin.toLocaleString()} 🪙</p>
                  <span className="inline-block mt-1 px-2 py-0.5 rounded-full bg-indigo-500/20 text-[9px] font-bold text-indigo-300">
                    {currentMultiplier}x Multiplier
                  </span>
                </div>
                <button
                  onClick={handleCashout}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-500 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-emerald-600/20 border-t border-white/15"
                >
                  💰 Claim & Cash Out
                </button>
              </div>
            ) : (
              <button
                onClick={startNewGame}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-500 text-white text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-lg shadow-indigo-600/20 border-t border-white/15"
              >
                ⛏️ Descend Into Cave
              </button>
            )}
          </div>
        </div>

        {/* Mines grid display with crystal ambient cave overlay */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-6 bg-zinc-950 rounded-2xl border border-white/5 relative overflow-hidden shadow-2xl">
          {/* Shimmering Purple Nebula backdrop */}
          <div className="absolute inset-0 bg-[radial-gradient(#818cf807_1px,transparent_1px)] [background-size:20px_20px] pointer-events-none" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-80 w-80 rounded-full bg-purple-600/5 blur-3xl pointer-events-none" />

          {/* Shaking Container for explosions */}
          <div className={`grid grid-cols-5 gap-2.5 w-full max-w-md transition-transform ${shaking !== null ? 'animate-bounce' : ''}`}>
            {grid.map((cell, idx) => {
              const isRevealed = revealed[idx];
              const displayVal = isRevealed || gameState === 'exploded' || gameState === 'cashed_out' ? cell : null;

              return (
                <button
                  key={idx}
                  onClick={() => handleCellClick(idx)}
                  disabled={gameState !== 'playing' || isRevealed}
                  className={`aspect-square rounded-xl text-xl font-bold flex items-center justify-center transition-all duration-300 relative overflow-hidden group shadow-md ${
                    displayVal === 'mine'
                      ? 'bg-red-500/10 border-2 border-red-500 text-red-500 scale-95 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                      : displayVal === 'gem'
                        ? 'bg-purple-500/15 border-2 border-fuchsia-400 text-fuchsia-300 scale-95 shadow-[0_0_20px_rgba(217,70,239,0.3)]'
                        : isRevealed
                          ? 'bg-zinc-950/80 border border-white/5'
                          : 'bg-zinc-900/80 border border-white/10 hover:border-indigo-400/40 hover:bg-zinc-800/80 hover:scale-[1.03] active:scale-95 cursor-pointer'
                  }`}
                >
                  <AnimatePresence mode="wait">
                    {displayVal === 'gem' ? (
                      <motion.div
                        key="gem"
                        initial={{ scale: 0, rotate: -45 }}
                        animate={{ scale: 1, rotate: 0 }}
                        className="flex flex-col items-center justify-center"
                      >
                        {/* Shimmering geometric crystal vector */}
                        <svg className="w-8 h-8 drop-shadow-[0_0_8px_#d946ef]" viewBox="0 0 24 24" fill="none">
                          <polygon points="12,2 22,8 12,22 2,8" fill="url(#gemGrad)" />
                          <polygon points="12,2 12,22 2,8" fill="rgba(255,255,255,0.15)" />
                          <polygon points="12,2 22,8 12,12" fill="rgba(255,255,255,0.08)" />
                          <defs>
                            <linearGradient id="gemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                              <stop offset="0%" stopColor="#f472b6" />
                              <stop offset="50%" stopColor="#d946ef" />
                              <stop offset="100%" stopColor="#8b5cf6" />
                            </linearGradient>
                          </defs>
                        </svg>
                      </motion.div>
                    ) : displayVal === 'mine' ? (
                      <motion.div
                        key="mine"
                        initial={{ scale: 0, rotate: 90 }}
                        animate={{ scale: [1, 1.2, 1], rotate: 0 }}
                        className="text-2xl"
                      >
                        💥
                      </motion.div>
                    ) : isRevealed ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-zinc-700" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center">
                        {/* Hidden state holographic glint */}
                        <div className="h-1 w-12 bg-white/5 -rotate-45 absolute group-hover:translate-x-12 transition-transform duration-500" />
                        <HelpCircle className="h-4 w-4 text-zinc-600 group-hover:text-zinc-400 transition-colors" />
                      </div>
                    )}
                  </AnimatePresence>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Game results banners */}
      <AnimatePresence>
        {gameState === 'exploded' && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-red-900/20 border border-red-500/30 text-red-400 p-4 rounded-xl text-center shadow-lg"
          >
            <p className="text-xs font-black uppercase tracking-widest">💥 BOOM! Hit a volcanic pocket. Bet amount was lost.</p>
          </motion.div>
        )}
        {gameState === 'cashed_out' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="bg-emerald-950/20 border border-emerald-500/30 text-emerald-400 p-4 rounded-xl text-center shadow-lg"
          >
            <p className="text-xs font-black uppercase tracking-widest">🎉 Success! Safely returned with +{currentWin.toLocaleString()} 🪙 at {currentMultiplier}x!</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ==========================================
   2. TREASURE HUNT (AAA Upgraded Component)
   ========================================== */
import { TreasureHunt } from './TreasureHuntGame';
export { TreasureHunt };

/* ==========================================
   3. DIAMOND PLINKO (Upgraded AAA Component)
   ========================================== */
import { DiamondPlinko } from './DiamondPlinkoGame';
export { DiamondPlinko };
