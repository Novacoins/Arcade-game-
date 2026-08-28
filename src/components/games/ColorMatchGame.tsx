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

interface ColorMatchProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export type ChallengeMode = 'classic' | 'speed' | 'combo' | 'pattern' | 'rainbow' | 'daily';

export interface ModeConfig {
  id: ChallengeMode;
  name: string;
  badge: string;
  desc: string;
  multiplier: number;
  defaultCoins: number;
}

export const MODES: ModeConfig[] = [
  { id: 'classic', name: 'Classic Arena', badge: '🔴🟢🟣 Classic', desc: 'Predict Red, Green, or Violet color landing', multiplier: 1.96, defaultCoins: 100 },
  { id: 'speed', name: 'Speed Dash', badge: '⚡ Speed (5s)', desc: 'Fast-paced 5-second countdown decision', multiplier: 2.50, defaultCoins: 150 },
  { id: 'combo', name: 'Combo Streak', badge: '🔥 Combo Multiplier', desc: 'Build consecutive wins for up to 5x rewards!', multiplier: 3.50, defaultCoins: 200 },
  { id: 'pattern', name: 'Pattern Recall', badge: '🧠 Memory Pattern', desc: 'Remember & match glowing laser sequences', multiplier: 4.00, defaultCoins: 250 },
  { id: 'rainbow', name: 'Rainbow Wheel', badge: '🌈 7-Color Jackpot', desc: 'Select from 7 colors for up to 15x Jackpot!', multiplier: 15.00, defaultCoins: 300 },
  { id: 'daily', name: 'Daily Arena', badge: '🎁 Daily Bonus', desc: 'Special daily high-reward color match challenge', multiplier: 2.80, defaultCoins: 100 },
];

const RAINBOW_COLORS = [
  { id: 'red', name: 'Ruby Red', hex: '#ef4444', mult: 2.0 },
  { id: 'orange', name: 'Neon Orange', hex: '#f97316', mult: 2.5 },
  { id: 'yellow', name: 'Gold Yellow', hex: '#eab308', mult: 3.0 },
  { id: 'green', name: 'Emerald Green', hex: '#10b981', mult: 3.5 },
  { id: 'cyan', name: 'Cyber Cyan', hex: '#06b6d4', mult: 4.0 },
  { id: 'blue', name: 'Royal Blue', hex: '#3b82f6', mult: 5.0 },
  { id: 'violet', name: 'Mystic Violet', hex: '#a855f7', mult: 15.0 },
];

export function ColorMatch({ coins, onGameWin, onGameLose }: ColorMatchProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [selectedMode, setSelectedMode] = useState<ChallengeMode>('classic');
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  
  // Game states
  const [playing, setPlaying] = useState<boolean>(false);
  const [chosenColor, setChosenColor] = useState<string>('red');
  const [landedColor, setLandedColor] = useState<string | null>(null);
  const [resultStatus, setResultStatus] = useState<'win' | 'lose' | null>(null);
  const [streakCount, setStreakCount] = useState<number>(0);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Speed timer state
  const [speedSeconds, setSpeedSeconds] = useState<number>(5);
  const speedTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Pattern mode states
  const [patternSequence, setPatternSequence] = useState<string[]>([]);
  const [playerPattern, setPlayerPattern] = useState<string[]>([]);

  // Victory celebration
  const [victoryModal, setVictoryModal] = useState<{ amount: number; mult: number } | null>(null);

  // Stats
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cm_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { played: 0, wins: 0, maxStreak: 0, totalEarned: 0 };
  });

  useEffect(() => {
    localStorage.setItem('cm_stats', JSON.stringify(stats));
  }, [stats]);

  const currentModeObj = MODES.find(m => m.id === selectedMode) || MODES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  // Speed Mode Timer
  useEffect(() => {
    if (playing && selectedMode === 'speed') {
      setSpeedSeconds(5);
      speedTimerRef.current = setInterval(() => {
        setSpeedSeconds(prev => {
          if (prev <= 1) {
            clearInterval(speedTimerRef.current!);
            handleTimeoutFail();
            return 0;
          }
          synth.playTick();
          return prev - 1;
        });
      }, 1000);
    } else {
      if (speedTimerRef.current) clearInterval(speedTimerRef.current);
    }
    return () => {
      if (speedTimerRef.current) clearInterval(speedTimerRef.current);
    };
  }, [playing, selectedMode]);

  const handleTimeoutFail = () => {
    setPlaying(false);
    setResultStatus('lose');
    setStreakCount(0);
    synth.playError();
    showToast('Time Expired! Speed run failed.');
  };

  // Start Predict Action
  const handleStartMatch = () => {
    if (playing) return;

    if (!validateAndDeductCoins(coinsToPay, 'Color Match')) {
      return;
    }

    synth.playClick();
    setPlaying(true);
    setLandedColor(null);
    setResultStatus(null);
    setVictoryModal(null);

    // If Pattern mode, prepare a 3-step sequence
    if (selectedMode === 'pattern') {
      const colorKeys = ['red', 'green', 'violet'];
      const seq = [
        colorKeys[Math.floor(Math.random() * colorKeys.length)],
        colorKeys[Math.floor(Math.random() * colorKeys.length)],
        colorKeys[Math.floor(Math.random() * colorKeys.length)],
      ];
      setPatternSequence(seq);
      setPlayerPattern([]);
    }

    // Execute spin animation / calculation
    setTimeout(() => {
      if (selectedMode === 'speed') {
        if (speedTimerRef.current) clearInterval(speedTimerRef.current);
      }

      let outcomeColor = 'red';
      let multCalculated = currentModeObj.multiplier;

      if (selectedMode === 'rainbow') {
        const randIndex = Math.floor(Math.random() * RAINBOW_COLORS.length);
        outcomeColor = RAINBOW_COLORS[randIndex].id;
        const matchedObj = RAINBOW_COLORS.find(c => c.id === chosenColor);
        multCalculated = matchedObj ? matchedObj.mult : 2.0;
      } else {
        const rand = Math.random();
        outcomeColor = rand < 0.45 ? 'red' : rand < 0.90 ? 'green' : 'violet';
      }

      setLandedColor(outcomeColor);
      setPlaying(false);

      const isWin = chosenColor === outcomeColor;

      if (isWin) {
        synth.playCoin();
        const newStreak = streakCount + 1;
        setStreakCount(newStreak);

        // Apply streak bonus if combo mode
        if (selectedMode === 'combo') {
          const streakMult = Math.min(5.0, 1.5 + newStreak * 0.5);
          multCalculated = parseFloat(streakMult.toFixed(1));
        }

        const winCoins = Math.floor(coinsToPay * multCalculated);
        onGameWin(winCoins, multCalculated);
        setResultStatus('win');

        setStats(prev => ({
          played: prev.played + 1,
          wins: prev.wins + 1,
          maxStreak: Math.max(prev.maxStreak, newStreak),
          totalEarned: prev.totalEarned + winCoins,
        }));

        setVictoryModal({ amount: winCoins, mult: multCalculated });
      } else {
        synth.playError();
        setStreakCount(0);
        setResultStatus('lose');

        setStats(prev => ({
          ...prev,
          played: prev.played + 1,
        }));
      }
    }, selectedMode === 'speed' ? 1200 : 1600);
  };

  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(10000, coins));
  };

  return (
    <div className="bg-gradient-to-b from-slate-950 via-purple-950/80 to-zinc-950 p-4 sm:p-6 rounded-3xl border border-white/10 max-w-xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      
      {/* Sci-Fi Arena Ambient Lighting & Lasers */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-25">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-500/30 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/3 -left-20 w-64 h-64 bg-cyan-500/20 rounded-full blur-2xl" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-red-500/20 rounded-full blur-3xl" />
      </div>

      {/* Toast Notification */}
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
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-purple-500 via-pink-500 to-red-500 p-0.5 shadow-lg shadow-purple-500/30 flex items-center justify-center">
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl animate-spin-slow">
              🎯
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-purple-300 drop-shadow-[0_0_10px_rgba(168,85,247,0.5)]">
              Color Match Arena
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              Predict laser color landings for multi-X multipliers
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
          <Coins className="h-3.5 w-3.5 text-amber-400" />
          <span>{coins.toLocaleString()} 🪙</span>
        </div>
      </div>

      {/* Challenge Mode Selection */}
      <div className="relative z-10 space-y-2 text-left">
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
          Select Challenge Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {MODES.map(mode => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                disabled={playing}
                onClick={() => {
                  synth.playClick();
                  setSelectedMode(mode.id);
                  setCoinsToPay(mode.defaultCoins);
                }}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-purple-500/20 border-purple-400 text-white shadow-lg shadow-purple-500/20 scale-[1.02]'
                    : 'bg-zinc-950/60 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <div className="text-[11px] font-black uppercase text-purple-300">
                  {mode.badge}
                </div>
                <div className="text-[9px] text-gray-400 line-clamp-1 mt-0.5 font-bold">
                  {mode.desc}
                </div>
                <div className="text-[10px] font-mono font-black text-emerald-400 mt-1">
                  Up to {mode.multiplier}x
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arena Sci-Fi Display */}
      <div className="relative z-10 bg-zinc-950/80 p-6 rounded-3xl border border-white/10 space-y-4 shadow-inner">
        {selectedMode === 'speed' && playing && (
          <div className="flex items-center justify-center gap-2 text-red-400 font-mono font-black text-sm animate-pulse">
            <Clock className="h-4 w-4" />
            <span>Time Remaining: {speedSeconds}s</span>
          </div>
        )}

        {/* Color Orb Selectors */}
        {selectedMode === 'rainbow' ? (
          <div className="space-y-3">
            <div className="text-xs font-black uppercase text-amber-300 tracking-wider">
              7-Color Wheel - Select Target Color
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
              {RAINBOW_COLORS.map(c => (
                <button
                  key={c.id}
                  disabled={playing}
                  onClick={() => { synth.playClick(); setChosenColor(c.id); }}
                  style={{ backgroundColor: c.hex }}
                  className={`h-12 rounded-2xl border-2 transition-transform font-mono text-[9px] font-black text-black flex flex-col items-center justify-center shadow-lg ${
                    chosenColor === c.id ? 'scale-110 border-white ring-4 ring-white/50' : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <span>{c.mult}x</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex justify-center gap-4 py-2">
            {[
              { id: 'red', name: 'Ruby Red', bg: 'bg-red-500 border-red-400 shadow-red-500/50' },
              { id: 'green', name: 'Emerald', bg: 'bg-emerald-500 border-emerald-400 shadow-emerald-500/50' },
              { id: 'violet', name: 'Mystic', bg: 'bg-purple-500 border-purple-400 shadow-purple-500/50' },
            ].map(item => (
              <button
                key={item.id}
                disabled={playing}
                onClick={() => { synth.playClick(); setChosenColor(item.id); }}
                className={`h-16 w-16 sm:h-20 sm:w-20 rounded-3xl border-2 transition-all flex flex-col items-center justify-center font-black text-[10px] text-white shadow-xl ${item.bg} ${
                  chosenColor === item.id ? 'scale-110 ring-4 ring-white border-white' : 'opacity-40 hover:opacity-80'
                }`}
              >
                <div className="h-4 w-4 rounded-full bg-white/40 mb-1" />
                <span>{item.name}</span>
              </button>
            ))}
          </div>
        )}

        {/* Outcome Display */}
        {landedColor && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`p-3 rounded-2xl border text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 ${
              resultStatus === 'win'
                ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.4)]'
                : 'bg-red-500/20 border-red-500 text-red-300'
            }`}
          >
            <span>Landed Target:</span>
            <span className="font-bold text-white uppercase">{landedColor}</span>
            <span>{resultStatus === 'win' ? '🎉 WIN!' : '❌ MISSED'}</span>
          </motion.div>
        )}
      </div>

      {/* Coins to Pay Controls */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={playing}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-purple-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={playing}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={playing}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={playing}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={playing}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Start Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleStartMatch}
        disabled={playing}
        className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-pink-500 to-red-500 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-purple-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>▶ PREDICT COLOR MATCH ({currentModeObj.multiplier}x)</span>
      </motion.button>

      {/* Career Stats */}
      <div className="relative z-10 bg-zinc-950/80 p-3 rounded-2xl border border-white/10 grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Played</div>
          <div className="text-xs font-mono font-black text-white">{stats.played}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Wins</div>
          <div className="text-xs font-mono font-black text-emerald-400">{stats.wins}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Max Streak</div>
          <div className="text-xs font-mono font-black text-amber-300">{stats.maxStreak} 🔥</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Earned</div>
          <div className="text-xs font-mono font-black text-amber-400">{stats.totalEarned.toLocaleString()} 🪙</div>
        </div>
      </div>

      {/* Victory Modal */}
      <AnimatePresence>
        {victoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-zinc-950 border-2 border-purple-400 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-5xl animate-bounce">🎯</div>
              <h3 className="text-xl font-black text-purple-300 uppercase tracking-tight">
                CORRECT PREDICTION!
              </h3>
              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Multiplier:</span>
                  <span className="font-mono font-black text-emerald-400">{victoryModal.mult}x</span>
                </div>
                <div className="flex justify-between text-gray-300 border-t border-white/10 pt-2">
                  <span>Coins Earned:</span>
                  <span className="font-mono font-black text-amber-400 text-sm">+{victoryModal.amount.toLocaleString()} 🪙</span>
                </div>
              </div>
              <button
                onClick={() => setVictoryModal(null)}
                className="w-full py-3 rounded-xl bg-purple-500 text-white font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition"
              >
                COLLECT REWARD
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
