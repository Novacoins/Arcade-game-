/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Shield, Crown,
  Coins, RotateCw, CheckCircle2, Lock, Eye, ShoppingBag, X, Check, Play, RefreshCw, Layers
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface DiceArenaProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export type DiceMode = 'classic' | 'double' | 'triple' | 'lucky' | 'speed' | 'daily';

export interface DiceModeConfig {
  id: DiceMode;
  name: string;
  badge: string;
  desc: string;
  multiplier: number;
}

export const DICE_MODES: DiceModeConfig[] = [
  { id: 'classic', name: 'Classic Duel', badge: '🎲 2 Dice vs Dealer', desc: 'Standard 2-dice sum vs dealer', multiplier: 2.0 },
  { id: 'double', name: 'Double Dice', badge: '⚡ High Stakes 2x', desc: 'Double reward multiplier duel', multiplier: 4.0 },
  { id: 'triple', name: 'Triple Dice', badge: '🎲🎲🎲 3 Dice Sum', desc: 'Roll 3 dice against dealer 3 dice', multiplier: 5.0 },
  { id: 'lucky', name: 'Lucky Target Sum', badge: '🎯 Exact Target', desc: 'Predict exact dice total sum for up to 10x!', multiplier: 10.0 },
  { id: 'speed', name: 'Speed Duel', badge: '⏱️ Fast Roll', desc: 'Instant rapid dice showdown', multiplier: 2.5 },
  { id: 'daily', name: 'Daily Challenge', badge: '🎁 Daily Jackpot', desc: 'Special daily high-reward dice tournament', multiplier: 3.5 },
];

export interface DiceTheme {
  id: string;
  name: string;
  price: number;
  faceBg: string;
  dotColor: string;
  previewEmoji: string;
}

export const DICE_THEMES: DiceTheme[] = [
  { id: 'gold_dice', name: 'Gold Dice', price: 0, faceBg: 'bg-gradient-to-br from-amber-300 to-amber-600', dotColor: 'bg-black', previewEmoji: '🪙' },
  { id: 'diamond_dice', name: 'Diamond Dice', price: 500, faceBg: 'bg-gradient-to-br from-cyan-200 to-blue-500', dotColor: 'bg-slate-900', previewEmoji: '💎' },
  { id: 'ruby_dice', name: 'Ruby Dice', price: 1000, faceBg: 'bg-gradient-to-br from-red-500 to-rose-700', dotColor: 'bg-amber-300', previewEmoji: '♦️' },
  { id: 'galaxy_dice', name: 'Galaxy Dice', price: 1500, faceBg: 'bg-gradient-to-br from-purple-600 to-indigo-900', dotColor: 'bg-fuchsia-300', previewEmoji: '🌌' },
  { id: 'neon_dice', name: 'Neon Cyber Dice', price: 2000, faceBg: 'bg-gradient-to-br from-cyan-400 to-emerald-500', dotColor: 'bg-black', previewEmoji: '⚡' },
  { id: 'dragon_dice', name: 'Dragon Scale Dice', price: 2500, faceBg: 'bg-gradient-to-br from-orange-600 to-red-800', dotColor: 'bg-yellow-300', previewEmoji: '🐉' },
  { id: 'crystal_dice', name: 'Crystal Ice Dice', price: 3000, faceBg: 'bg-gradient-to-br from-sky-200 to-indigo-400', dotColor: 'bg-blue-900', previewEmoji: '🔮' },
  { id: 'ancient_dice', name: 'Ancient Stone Dice', price: 3500, faceBg: 'bg-gradient-to-br from-zinc-700 to-zinc-900', dotColor: 'bg-amber-400', previewEmoji: '🏛️' },
  { id: 'fire_dice', name: 'Inferno Fire Dice', price: 4000, faceBg: 'bg-gradient-to-br from-red-600 to-amber-500', dotColor: 'bg-black', previewEmoji: '🔥' },
  { id: 'ice_dice', name: 'Frozen Glacier Dice', price: 5000, faceBg: 'bg-gradient-to-br from-sky-300 to-blue-700', dotColor: 'bg-white', previewEmoji: '❄️' },
];

export interface TableTheme {
  id: string;
  name: string;
  price: number;
  bgGradient: string;
  borderColor: string;
  previewEmoji: string;
}

export const TABLE_THEMES: TableTheme[] = [
  { id: 'royal_table', name: 'Royal Table', price: 0, bgGradient: 'from-amber-950/60 via-zinc-950 to-black', borderColor: 'border-amber-500/30', previewEmoji: '👑' },
  { id: 'cyber_table', name: 'Cyber Table', price: 500, bgGradient: 'from-cyan-950/60 via-zinc-950 to-black', borderColor: 'border-cyan-500/30', previewEmoji: '⚡' },
  { id: 'casino_table', name: 'Casino Velvet', price: 1000, bgGradient: 'from-emerald-950/60 via-zinc-950 to-black', borderColor: 'border-emerald-500/30', previewEmoji: '🎰' },
  { id: 'fantasy_table', name: 'Fantasy Hall', price: 1500, bgGradient: 'from-purple-950/60 via-zinc-950 to-black', borderColor: 'border-purple-500/30', previewEmoji: '🔮' },
  { id: 'gold_hall', name: 'Luxury Gold Hall', price: 2500, bgGradient: 'from-yellow-950/80 via-zinc-950 to-black', borderColor: 'border-amber-400', previewEmoji: '✨' },
  { id: 'galaxy_arena', name: 'Galaxy Arena', price: 4000, bgGradient: 'from-indigo-950/80 via-purple-950 to-black', borderColor: 'border-fuchsia-400', previewEmoji: '🌌' },
];

export function DiceArena({ coins, onGameWin, onGameLose }: DiceArenaProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  const [selectedMode, setSelectedMode] = useState<DiceMode>('classic');
  const [targetLuckySum, setTargetLuckySum] = useState<number>(7);

  // Roll states
  const [rolling, setRolling] = useState<boolean>(false);
  const [pDice, setPDice] = useState<number[]>([1, 1]);
  const [dDice, setDDice] = useState<number[]>([1, 1]);
  const [outcomeStatus, setOutcomeStatus] = useState<'win' | 'lose' | 'draw' | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Unlocked Dice & Tables
  const [unlockedDice, setUnlockedDice] = useState<string[]>(() => {
    const saved = localStorage.getItem('da_unlocked_dice');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['gold_dice'];
  });

  const [activeDiceId, setActiveDiceId] = useState<string>(() => {
    return localStorage.getItem('da_active_dice') || 'gold_dice';
  });

  const [unlockedTables, setUnlockedTables] = useState<string[]>(() => {
    const saved = localStorage.getItem('da_unlocked_tables');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['royal_table'];
  });

  const [activeTableId, setActiveTableId] = useState<string>(() => {
    return localStorage.getItem('da_active_table') || 'royal_table';
  });

  // Modal states
  const [diceModalOpen, setDiceModalOpen] = useState<boolean>(false);
  const [tablesModalOpen, setTablesModalOpen] = useState<boolean>(false);
  const [confirmDice, setConfirmDice] = useState<DiceTheme | null>(null);
  const [confirmTable, setConfirmTable] = useState<TableTheme | null>(null);

  useEffect(() => {
    localStorage.setItem('da_unlocked_dice', JSON.stringify(unlockedDice));
  }, [unlockedDice]);

  useEffect(() => {
    localStorage.setItem('da_active_dice', activeDiceId);
  }, [activeDiceId]);

  useEffect(() => {
    localStorage.setItem('da_unlocked_tables', JSON.stringify(unlockedTables));
  }, [unlockedTables]);

  useEffect(() => {
    localStorage.setItem('da_active_table', activeTableId);
  }, [activeTableId]);

  const activeDiceObj = DICE_THEMES.find(d => d.id === activeDiceId) || DICE_THEMES[0];
  const activeTableObj = TABLE_THEMES.find(t => t.id === activeTableId) || TABLE_THEMES[0];
  const currentModeObj = DICE_MODES.find(m => m.id === selectedMode) || DICE_MODES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleRoll = () => {
    if (rolling) return;

    if (!validateAndDeductCoins(coinsToPay, 'Dice Arena')) {
      return;
    }

    synth.playClick();
    setRolling(true);
    setOutcomeStatus(null);

    // Roll sounds
    const rollsCount = 12;
    for (let i = 0; i < rollsCount; i++) {
      setTimeout(() => {
        synth.playTick();
      }, (i / rollsCount) * 1400);
    }

    setTimeout(() => {
      setRolling(false);

      const numDice = selectedMode === 'triple' ? 3 : 2;
      const pRolls = Array.from({ length: numDice }).map(() => Math.floor(Math.random() * 6) + 1);
      const dRolls = Array.from({ length: numDice }).map(() => Math.floor(Math.random() * 6) + 1);

      setPDice(pRolls);
      setDDice(dRolls);

      const pSum = pRolls.reduce((a, b) => a + b, 0);
      const dSum = dRolls.reduce((a, b) => a + b, 0);

      let isWin = false;
      let isDraw = false;
      let multCalculated = currentModeObj.multiplier;

      if (selectedMode === 'lucky') {
        if (pSum === targetLuckySum) {
          isWin = true;
          multCalculated = 10.0;
        }
      } else {
        if (pSum > dSum) isWin = true;
        else if (pSum === dSum) isDraw = true;
      }

      if (isWin) {
        synth.playFanfare();
        setOutcomeStatus('win');
        const winCoins = Math.floor(coinsToPay * multCalculated);
        onGameWin(winCoins, multCalculated);
      } else if (isDraw) {
        synth.playClick();
        setOutcomeStatus('draw');
        onGameWin(coinsToPay, 1.0);
      } else {
        synth.playError();
        setOutcomeStatus('lose');
      }
    }, 1400);
  };

  const handlePurchaseDice = (d: DiceTheme) => {
    if (coins < d.price) {
      synth.playError();
      showToast('Insufficient coins!');
      return;
    }

    synth.playFanfare();
    onGameLose(d.price);
    setUnlockedDice(prev => [...prev, d.id]);
    setActiveDiceId(d.id);
    setConfirmDice(null);
    showToast(`🎉 Unlocked ${d.name}!`);
  };

  const handlePurchaseTable = (t: TableTheme) => {
    if (coins < t.price) {
      synth.playError();
      showToast('Insufficient coins!');
      return;
    }

    synth.playFanfare();
    onGameLose(t.price);
    setUnlockedTables(prev => [...prev, t.id]);
    setActiveTableId(t.id);
    setConfirmTable(null);
    showToast(`🎉 Unlocked ${t.name}!`);
  };

  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(10000, coins));
  };

  const renderDiceDots = (val: number) => {
    return (
      <div className="grid grid-cols-3 gap-1 p-1 h-full w-full items-center justify-items-center">
        {Array.from({ length: 9 }).map((_, i) => {
          const visible =
            (val === 1 && i === 4) ||
            (val === 2 && (i === 0 || i === 8)) ||
            (val === 3 && (i === 0 || i === 4 || i === 8)) ||
            (val === 4 && (i === 0 || i === 2 || i === 6 || i === 8)) ||
            (val === 5 && (i === 0 || i === 2 || i === 4 || i === 6 || i === 8)) ||
            (val === 6 && (i === 0 || i === 2 || i === 3 || i === 5 || i === 6 || i === 8));

          return (
            <div
              key={i}
              className={`h-2.5 w-2.5 rounded-full ${visible ? activeDiceObj.dotColor : 'opacity-0'}`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <div className={`bg-gradient-to-b ${activeTableObj.bgGradient} p-4 sm:p-6 rounded-3xl border ${activeTableObj.borderColor} max-w-xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl transition-all duration-700`}>
      
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
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-amber-400 to-red-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl animate-bounce">
              🎲
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-300">
              Dice Arena Arena
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              Table: <span className="text-white">{activeTableObj.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => { synth.playClick(); setDiceModalOpen(true); }}
            className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-[10px] font-black text-amber-300 flex items-center gap-1 hover:bg-amber-500/30 transition"
          >
            <ShoppingBag className="h-3 w-3" />
            <span>Dice</span>
          </button>
          <button
            onClick={() => { synth.playClick(); setTablesModalOpen(true); }}
            className="px-2.5 py-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-[10px] font-black text-purple-300 flex items-center gap-1 hover:bg-purple-500/30 transition"
          >
            <Layers className="h-3 w-3" />
            <span>Tables</span>
          </button>
        </div>
      </div>

      {/* Mode Selection */}
      <div className="relative z-10 space-y-2 text-left">
        <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
          Select Dice Mode
        </label>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {DICE_MODES.map(mode => {
            const isSelected = selectedMode === mode.id;
            return (
              <button
                key={mode.id}
                disabled={rolling}
                onClick={() => { synth.playClick(); setSelectedMode(mode.id); }}
                className={`p-2.5 rounded-2xl border text-left transition-all ${
                  isSelected
                    ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg shadow-amber-500/20 scale-[1.02]'
                    : 'bg-zinc-950/60 border-white/10 text-gray-400 hover:border-white/30'
                }`}
              >
                <div className="text-[11px] font-black uppercase text-amber-300">
                  {mode.badge}
                </div>
                <div className="text-[9px] text-gray-400 line-clamp-1 mt-0.5 font-bold">
                  {mode.desc}
                </div>
                <div className="text-[10px] font-mono font-black text-emerald-400 mt-1">
                  {mode.multiplier}x
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Lucky Target Selector */}
      {selectedMode === 'lucky' && (
        <div className="relative z-10 bg-zinc-950/80 p-3 rounded-2xl border border-white/10 space-y-2">
          <label className="text-xs font-black uppercase text-amber-300">Select Target Lucky Sum (2-12)</label>
          <div className="flex justify-center gap-1 overflow-x-auto py-1">
            {Array.from({ length: 11 }, (_, i) => i + 2).map(val => (
              <button
                key={val}
                onClick={() => setTargetLuckySum(val)}
                className={`h-8 w-8 rounded-xl font-mono text-xs font-black transition ${
                  targetLuckySum === val ? 'bg-amber-400 text-black scale-110' : 'bg-zinc-800 text-gray-300'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Arena Rolling Table */}
      <div className="relative z-10 bg-black/60 p-6 rounded-3xl border border-white/10 space-y-6 shadow-inner min-h-[260px] flex flex-col justify-between">
        
        {/* Dealer Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-gray-400">
            <span>DEALER ROLL</span>
            <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded-lg border border-white/10 text-white">
              Sum: {dDice.reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-center gap-3">
            {dDice.map((val, i) => (
              <motion.div
                key={i}
                animate={rolling ? { rotate: [0, 360, 720], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className={`h-14 w-14 rounded-2xl border-2 border-white/20 shadow-xl ${activeDiceObj.faceBg} flex items-center justify-center`}
              >
                {renderDiceDots(val)}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Status */}
        {outcomeStatus && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`py-2 px-4 rounded-2xl text-xs font-black uppercase tracking-wider inline-block mx-auto ${
              outcomeStatus === 'win'
                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : outcomeStatus === 'draw'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                : 'bg-red-500/20 border border-red-500 text-red-300'
            }`}
          >
            {outcomeStatus === 'win' ? '🎉 YOU WIN ROLL!' : outcomeStatus === 'draw' ? '🤝 DRAW' : '❌ DEALER WINS'}
          </motion.div>
        )}

        {/* Player Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-amber-400">
            <span>YOUR ROLL</span>
            <span className="font-mono bg-zinc-900 px-2 py-0.5 rounded-lg border border-white/10 text-white">
              Sum: {pDice.reduce((a, b) => a + b, 0)}
            </span>
          </div>
          <div className="flex justify-center gap-3">
            {pDice.map((val, i) => (
              <motion.div
                key={i}
                animate={rolling ? { rotate: [0, -360, -720], scale: [1, 1.2, 1] } : {}}
                transition={{ duration: 1.2, ease: 'easeInOut' }}
                className={`h-14 w-14 rounded-2xl border-2 border-white/20 shadow-xl ${activeDiceObj.faceBg} flex items-center justify-center`}
              >
                {renderDiceDots(val)}
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Roll Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleRoll}
        disabled={rolling}
        className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>▶ ROLL DICE ({currentModeObj.multiplier}x REWARD)</span>
      </motion.button>

      {/* Coins to Pay */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={rolling}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-amber-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={rolling}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={rolling}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={rolling}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={rolling}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Dice Store Modal */}
      <AnimatePresence>
        {diceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Unlockable Dice Themes
                </h3>
                <button
                  onClick={() => setDiceModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {DICE_THEMES.map(dice => {
                  const isUnlocked = unlockedDice.includes(dice.id);
                  const isActive = activeDiceId === dice.id;

                  return (
                    <div
                      key={dice.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-amber-500/20 border-amber-400 text-white'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950/80 border-white/5 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shadow">
                          {dice.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{dice.name}</span>
                            {isActive && <span className="text-[9px] bg-amber-400 text-black px-1.5 py-0.2 rounded-full font-black">ACTIVE</span>}
                          </div>
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
                              setActiveDiceId(dice.id);
                              setDiceModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-black uppercase hover:bg-amber-500/30 transition"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmDice(dice)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow"
                          >
                            {dice.price} 🪙
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

      {/* Tables Store Modal */}
      <AnimatePresence>
        {tablesModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-purple-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-purple-400 uppercase tracking-wider flex items-center gap-2">
                  <Layers className="h-4 w-4" />
                  Unlockable Table Themes
                </h3>
                <button
                  onClick={() => setTablesModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {TABLE_THEMES.map(table => {
                  const isUnlocked = unlockedTables.includes(table.id);
                  const isActive = activeTableId === table.id;

                  return (
                    <div
                      key={table.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-purple-500/20 border-purple-400 text-white'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950/80 border-white/5 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-zinc-800 flex items-center justify-center text-xl shadow">
                          {table.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{table.name}</span>
                            {isActive && <span className="text-[9px] bg-purple-400 text-black px-1.5 py-0.2 rounded-full font-black">ACTIVE</span>}
                          </div>
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
                              setActiveTableId(table.id);
                              setTablesModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-black uppercase hover:bg-purple-500/30 transition"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmTable(table)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-purple-500 to-pink-400 text-white text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow"
                          >
                            {table.price} 🪙
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

      {/* Confirmation Modals */}
      <AnimatePresence>
        {confirmDice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl">{confirmDice.previewEmoji}</div>
              <h3 className="text-base font-black text-amber-400 uppercase">
                Unlock {confirmDice.name}?
              </h3>
              <p className="text-xs text-gray-300">
                Cost: <strong className="text-amber-300">{confirmDice.price} 🪙</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmDice(null)}
                  className="py-2.5 rounded-xl bg-zinc-800 text-xs font-black text-gray-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseDice(confirmDice)}
                  className="py-2.5 rounded-xl bg-amber-400 text-black text-xs font-black uppercase shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {confirmTable && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-purple-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl">{confirmTable.previewEmoji}</div>
              <h3 className="text-base font-black text-purple-400 uppercase">
                Unlock {confirmTable.name}?
              </h3>
              <p className="text-xs text-gray-300">
                Cost: <strong className="text-amber-300">{confirmTable.price} 🪙</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmTable(null)}
                  className="py-2.5 rounded-xl bg-zinc-800 text-xs font-black text-gray-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseTable(confirmTable)}
                  className="py-2.5 rounded-xl bg-purple-400 text-white text-xs font-black uppercase shadow-lg"
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
