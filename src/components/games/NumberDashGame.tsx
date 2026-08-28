/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Flame, Shield, 
  Volume2, VolumeX, RotateCw, Play, CheckCircle2, AlertCircle, 
  Coins, TrendingUp, History, Lock, Gift, BarChart3, Star, X, Check, Crown
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface NumberDashProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export interface RoundHistoryItem {
  id: string;
  selectedNumber: number;
  winningNumber: number;
  isWin: boolean;
  coinsEarned: number;
  multiplier: number;
  timestamp: string;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  reqCount: number;
  currentCount: number;
  rewardCoins: number;
  rewardXP: number;
  isClaimed: boolean;
  icon: string;
}

export interface DifficultyMode {
  id: 'easy' | 'medium' | 'hard';
  name: string;
  minNum: number;
  maxNum: number;
  multiplier: number;
  badge: string;
  color: string;
  glow: string;
}

export const DIFFICULTY_MODES: DifficultyMode[] = [
  {
    id: 'easy',
    name: 'Easy (1 - 5)',
    minNum: 1,
    maxNum: 5,
    multiplier: 4.8,
    badge: '🟢 Easy',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.4)',
  },
  {
    id: 'medium',
    name: 'Medium (1 - 10)',
    minNum: 1,
    maxNum: 10,
    multiplier: 9.8,
    badge: '🟡 Standard',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.4)',
  },
  {
    id: 'hard',
    name: 'Hard (1 - 20)',
    minNum: 1,
    maxNum: 20,
    multiplier: 19.2,
    badge: '🔴 Pro Dash',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.4)',
  },
];

export function NumberDash({ coins, onGameWin, onGameLose }: NumberDashProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Gameplay States
  const [selectedDifficulty, setSelectedDifficulty] = useState<'easy' | 'medium' | 'hard'>('medium');
  const [coinsToPlay, setCoinsToPlay] = useState<number>(100);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(7);
  const [isDashing, setIsDashing] = useState<boolean>(false);
  const [cyclingNumber, setCyclingNumber] = useState<number | null>(null);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);

  // Notice & Feedback States
  const [noticeMessage, setNoticeMessage] = useState<string>('');
  const [toastMessage, setToastMessage] = useState<string>('');

  // Modals & Panels
  const [activeTab, setActiveTab] = useState<'game' | 'history' | 'stats' | 'missions'>('game');
  const [roundResultModal, setRoundResultModal] = useState<{
    isWin: boolean;
    selectedNum: number;
    winningNum: number;
    multiplier: number;
    rewardCoins: number;
    netChange: number;
  } | null>(null);

  // Flying Coins Animation State
  const [flyingCoins, setFlyingCoins] = useState<{ id: number; x: number; y: number }[]>([]);

  // Local Storage Persistence for Stats, History & Missions
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('nd_game_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return {
      roundsPlayed: 0,
      wins: 0,
      losses: 0,
      highestReward: 0,
      currentStreak: 0,
      bestStreak: 0,
      totalCoinsEarned: 0,
      xp: 350,
      level: 3,
    };
  });

  const [history, setHistory] = useState<RoundHistoryItem[]>(() => {
    const saved = localStorage.getItem('nd_game_history');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: '1', selectedNumber: 7, winningNumber: 7, isWin: true, coinsEarned: 980, multiplier: 9.8, timestamp: '10 mins ago' },
      { id: '2', selectedNumber: 3, winningNumber: 8, isWin: false, coinsEarned: -100, multiplier: 0, timestamp: '15 mins ago' },
      { id: '3', selectedNumber: 5, winningNumber: 5, isWin: true, coinsEarned: 490, multiplier: 4.9, timestamp: '22 mins ago' },
    ];
  });

  const [missions, setMissions] = useState<Mission[]>(() => {
    const saved = localStorage.getItem('nd_game_missions');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [
      { id: 'm1', title: 'Warm Up Dash', description: 'Play 5 rounds of Number Dash', reqCount: 5, currentCount: 0, rewardCoins: 200, rewardXP: 50, isClaimed: false, icon: '🎮' },
      { id: 'm2', title: 'Target Master', description: 'Win 3 rounds', reqCount: 3, currentCount: 0, rewardCoins: 300, rewardXP: 100, isClaimed: false, icon: '🎯' },
      { id: 'm3', title: 'Unstoppable Streak', description: 'Reach a 3-win streak', reqCount: 3, currentCount: 0, rewardCoins: 500, rewardXP: 150, isClaimed: false, icon: '🔥' },
      { id: 'm4', title: 'Coin Collector', description: 'Accumulate 500 total coins in rewards', reqCount: 500, currentCount: 0, rewardCoins: 400, rewardXP: 100, isClaimed: false, icon: '🪙' },
      { id: 'm5', title: "Daily Champion", description: 'Complete today\'s challenge (10 rounds)', reqCount: 10, currentCount: 0, rewardCoins: 1000, rewardXP: 300, isClaimed: false, icon: '🏆' },
    ];
  });

  // Save to LocalStorage
  useEffect(() => {
    localStorage.setItem('nd_game_stats', JSON.stringify(stats));
  }, [stats]);

  useEffect(() => {
    localStorage.setItem('nd_game_history', JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    localStorage.setItem('nd_game_missions', JSON.stringify(missions));
  }, [missions]);

  const currentMode = DIFFICULTY_MODES.find(m => m.id === selectedDifficulty) || DIFFICULTY_MODES[1];

  // Helper to show notice toast
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 3000);
  };

  // Handle number click selection
  const handleSelectNumber = (num: number) => {
    if (isDashing) return;
    setSelectedNumber(num);
    if (soundEnabled) synth.playClick();
    setNoticeMessage(`Number ${num} Selected`);
    setTimeout(() => setNoticeMessage(''), 2000);
  };

  // Quick coins to play adjustments
  const setQuickCoins = (action: 'min' | 'half' | 'double' | 'max' | 'add100' | 'add500') => {
    if (soundEnabled) synth.playClick();
    if (action === 'min') setCoinsToPlay(10);
    else if (action === 'half') setCoinsToPlay(prev => Math.max(10, Math.floor(prev / 2)));
    else if (action === 'double') setCoinsToPlay(prev => Math.min(coins, prev * 2));
    else if (action === 'max') setCoinsToPlay(prev => Math.min(10000, coins));
    else if (action === 'add100') setCoinsToPlay(prev => Math.min(coins, prev + 100));
    else if (action === 'add500') setCoinsToPlay(prev => Math.min(coins, prev + 500));
  };

  // Main Launch Round Action
  const handleStartRound = () => {
    if (isDashing) return;
    if (selectedNumber === null) {
      if (soundEnabled) synth.playError();
      showToast('Please select a number first!');
      return;
    }
    if (!validateAndDeductCoins(coinsToPlay, 'Number Match')) {
      return;
    }

    if (soundEnabled) synth.playClick();
    setIsDashing(true);
    setNoticeMessage(`Launching Round... Number ${selectedNumber} locked!`);

    // Number Cycling Animation (2.0s duration)
    let cycleCount = 0;
    const totalCycles = 24;
    const interval = setInterval(() => {
      cycleCount++;
      const randomDisplay = Math.floor(Math.random() * (currentMode.maxNum - currentMode.minNum + 1)) + currentMode.minNum;
      setCyclingNumber(randomDisplay);
      if (soundEnabled) synth.playTick();

      if (cycleCount >= totalCycles) {
        clearInterval(interval);
        
        // Determine Winning Number
        const winningNum = Math.floor(Math.random() * (currentMode.maxNum - currentMode.minNum + 1)) + currentMode.minNum;
        setCyclingNumber(winningNum);
        setIsDashing(false);

        const isWin = selectedNumber === winningNum;
        const rewardCoins = isWin ? Math.floor(coinsToPlay * currentMode.multiplier) : 0;
        const netChange = isWin ? rewardCoins - coinsToPlay : -coinsToPlay;

        // Process Win/Loss
        if (isWin) {
          if (soundEnabled) synth.playVictory();
          onGameWin(rewardCoins, currentMode.multiplier);
        } else {
          if (soundEnabled) synth.playLoss();
        }

        // Update Stats
        const newStreak = isWin ? stats.currentStreak + 1 : 0;
        const newBestStreak = Math.max(stats.bestStreak, newStreak);
        const newXP = stats.xp + (isWin ? 50 : 15);
        const newLevel = Math.floor(newXP / 100) + 1;

        setStats(prev => ({
          roundsPlayed: prev.roundsPlayed + 1,
          wins: prev.wins + (isWin ? 1 : 0),
          losses: prev.losses + (isWin ? 0 : 1),
          highestReward: Math.max(prev.highestReward, rewardCoins),
          currentStreak: newStreak,
          bestStreak: newBestStreak,
          totalCoinsEarned: prev.totalCoinsEarned + rewardCoins,
          xp: newXP,
          level: newLevel,
        }));

        // Update History
        const newHistoryItem: RoundHistoryItem = {
          id: Date.now().toString(),
          selectedNumber: selectedNumber,
          winningNumber: winningNum,
          isWin: isWin,
          coinsEarned: isWin ? rewardCoins : -coinsToPlay,
          multiplier: isWin ? currentMode.multiplier : 0,
          timestamp: 'Just now',
        };
        setHistory(prev => [newHistoryItem, ...prev.slice(0, 9)]);

        // Update Missions Progress
        setMissions(prevMissions =>
          prevMissions.map(m => {
            let addCount = 0;
            if (m.id === 'm1') addCount = 1; // Play 5 rounds
            else if (m.id === 'm2' && isWin) addCount = 1; // Win 3 rounds
            else if (m.id === 'm3') addCount = newStreak >= m.reqCount ? m.reqCount : newStreak; // Streak
            else if (m.id === 'm4' && isWin) addCount = rewardCoins; // Collect coins
            else if (m.id === 'm5') addCount = 1; // 10 rounds daily challenge

            const newCount = m.id === 'm3' ? addCount : Math.min(m.reqCount, m.currentCount + addCount);
            return { ...m, currentCount: newCount };
          })
        );

        // Show Round Result Popup
        setRoundResultModal({
          isWin,
          selectedNum: selectedNumber,
          winningNum: winningNum,
          multiplier: currentMode.multiplier,
          rewardCoins,
          netChange,
        });
      }
    }, 80);
  };

  // Claim Mission Reward
  const handleClaimMission = (mission: Mission) => {
    if (mission.isClaimed) return;

    if (mission.currentCount < mission.reqCount) {
      if (soundEnabled) synth.playError();
      showToast('Complete this mission before claiming the reward.');
      return;
    }

    // Award reward
    if (soundEnabled) synth.playUpgradeSuccess();
    onGameWin(mission.rewardCoins, 1.0);

    setMissions(prev =>
      prev.map(m => (m.id === mission.id ? { ...m, isClaimed: true } : m))
    );

    setStats(prev => ({
      ...prev,
      xp: prev.xp + mission.rewardXP,
      totalCoinsEarned: prev.totalCoinsEarned + mission.rewardCoins,
    }));

    showToast(`🎉 Mission Claimed! +${mission.rewardCoins} Coins & +${mission.rewardXP} XP!`);
  };

  // Collect reward animation
  const handleCollectPopup = () => {
    if (soundEnabled) synth.playCoin();
    if (roundResultModal && roundResultModal.isWin && roundResultModal.rewardCoins > 0) {
      const newCoins = Array.from({ length: 10 }).map((_, i) => ({
        id: Date.now() + i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 160,
      }));
      setFlyingCoins(newCoins);
      setTimeout(() => setFlyingCoins([]), 900);
    }
    setRoundResultModal(null);
  };

  // Calculate XP percentage
  const currentXPInLevel = stats.xp % 100;

  return (
    <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-4 sm:p-6 rounded-3xl border border-amber-500/30 max-w-2xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl" id="number_dash_root">
      
      {/* 1. ANIMATED BACKGROUND PARTICLES & GLOWING HALOS */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30 z-0">
        <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 -right-20 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-24 left-1/3 w-96 h-96 bg-purple-500/15 rounded-full blur-3xl" />
        
        {/* Floating Tiny Stardust Stars */}
        <div className="absolute top-10 left-12 text-xs text-amber-300 animate-ping">✨</div>
        <div className="absolute top-1/3 right-16 text-xs text-cyan-300 animate-bounce">⚡</div>
        <div className="absolute bottom-20 left-1/4 text-xs text-purple-300 animate-pulse">🌟</div>
      </div>

      {/* Flying Coins Animation Overlay */}
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

      {/* Toast Notice Banner */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-500 text-black px-4 py-2 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-yellow-300"
          >
            <Sparkles className="h-4 w-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. HEADER SECTION (LOGO, MULTIPLIER, LEVEL, STREAK, XP) */}
      <div className="relative z-10 border-b border-white/10 pb-4 space-y-3">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          
          {/* Logo & Subtitle */}
          <div className="flex items-center gap-3 text-left">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-amber-400 via-yellow-500 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20 flex items-center justify-center">
              <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl animate-bounce">
                🔢
              </div>
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]">
                Number Dash Arcade
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold flex items-center gap-2">
                <span>Mode: <strong className="text-white">{currentMode.badge}</strong></span>
                <span>•</span>
                <span className="text-emerald-400 font-black">{currentMode.multiplier}x Multiplier</span>
              </p>
            </div>
          </div>

          {/* User Stats Badges & Mute Toggle */}
          <div className="flex items-center gap-2 justify-end">
            
            {/* Daily Streak */}
            <div className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-black flex items-center gap-1">
              <Flame className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>{stats.currentStreak} Streak</span>
            </div>

            {/* Player Level */}
            <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black flex items-center gap-1">
              <Crown className="h-3.5 w-3.5 text-purple-400" />
              <span>Lvl {stats.level}</span>
            </div>

            {/* Sound Toggle Button */}
            <button
              onClick={() => {
                const nextState = !soundEnabled;
                setSoundEnabled(nextState);
                synth.toggle(nextState);
              }}
              className="p-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-gray-300 hover:text-white border border-white/10 transition active:scale-95"
              title={soundEnabled ? 'Mute Sound' : 'Enable Sound'}
            >
              {soundEnabled ? <Volume2 className="h-4 w-4 text-amber-400" /> : <VolumeX className="h-4 w-4 text-gray-500" />}
            </button>
          </div>
        </div>

        {/* Level XP Progress Bar */}
        <div className="w-full bg-zinc-950 rounded-full h-2.5 p-0.5 border border-white/10 relative overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${currentXPInLevel}%` }}
            transition={{ duration: 0.5 }}
            className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full shadow-[0_0_8px_rgba(245,158,11,0.8)]"
          />
        </div>
        <div className="flex justify-between items-center text-[9px] font-mono font-bold text-gray-400 px-1">
          <span>XP Progress: {currentXPInLevel} / 100 XP</span>
          <span className="text-amber-400 font-extrabold">Balance: {coins.toLocaleString()} 🪙</span>
        </div>
      </div>

      {/* 3. NAVIGATION TABS (GAMEPLAY, HISTORY, STATS, MISSIONS) */}
      <div className="grid grid-cols-4 gap-1 sm:gap-2 relative z-10 bg-zinc-950/80 p-1.5 rounded-2xl border border-white/10">
        <button
          onClick={() => { if (soundEnabled) synth.playClick(); setActiveTab('game'); }}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            activeTab === 'game'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Target className="h-3.5 w-3.5" />
          <span>Dash</span>
        </button>

        <button
          onClick={() => { if (soundEnabled) synth.playClick(); setActiveTab('history'); }}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            activeTab === 'history'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <History className="h-3.5 w-3.5" />
          <span>History</span>
        </button>

        <button
          onClick={() => { if (soundEnabled) synth.playClick(); setActiveTab('stats'); }}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all ${
            activeTab === 'stats'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <BarChart3 className="h-3.5 w-3.5" />
          <span>Stats</span>
        </button>

        <button
          onClick={() => { if (soundEnabled) synth.playClick(); setActiveTab('missions'); }}
          className={`py-2 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-1 transition-all relative ${
            activeTab === 'missions'
              ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20'
              : 'text-gray-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>Missions</span>
          {/* Badge for claimable missions */}
          {missions.some(m => !m.isClaimed && m.currentCount >= m.reqCount) && (
            <span className="absolute -top-1 -right-1 h-2.5 w-2.5 rounded-full bg-red-500 animate-ping" />
          )}
        </button>
      </div>

      {/* ========================================================= */}
      {/* TAB 1: MAIN GAMEPLAY DASHBOARD */}
      {/* ========================================================= */}
      {activeTab === 'game' && (
        <div className="space-y-6 relative z-10 text-left">
          
          {/* Difficulty Selector */}
          <div className="space-y-2">
            <label className="text-xs font-black text-gray-400 uppercase tracking-wider block">
              Select Difficulty & Multiplier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DIFFICULTY_MODES.map(mode => (
                <button
                  key={mode.id}
                  disabled={isDashing}
                  onClick={() => {
                    if (soundEnabled) synth.playClick();
                    setSelectedDifficulty(mode.id);
                    setSelectedNumber(mode.minNum);
                  }}
                  className={`p-2.5 rounded-2xl border-2 text-center transition-all ${
                    selectedDifficulty === mode.id
                      ? 'bg-amber-500/20 border-amber-400 text-white shadow-lg'
                      : 'bg-zinc-950/60 border-white/10 text-gray-400 hover:border-white/30'
                  }`}
                >
                  <div className="text-[10px] font-black uppercase text-amber-300">{mode.name}</div>
                  <div className="text-xs font-mono font-black text-emerald-400 mt-0.5">{mode.multiplier}x</div>
                </button>
              ))}
            </div>
          </div>

          {/* Number Display & Selection Grid */}
          <div className="bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-4 relative overflow-hidden">
            <div className="flex justify-between items-center">
              <span className="text-xs font-black uppercase text-amber-400 tracking-wider">
                Choose Target Number ({currentMode.minNum} to {currentMode.maxNum})
              </span>
              <span className="text-xs font-bold text-gray-400">
                Selected: <strong className="text-amber-300 font-mono font-black text-sm">{selectedNumber !== null ? `#${selectedNumber}` : 'None'}</strong>
              </span>
            </div>

            {/* Live Animated Cycling Display During Dash */}
            {isDashing ? (
              <div className="py-8 bg-zinc-900/90 rounded-2xl border border-amber-500/40 text-center space-y-2 shadow-inner">
                <span className="text-xs font-black uppercase text-amber-400 animate-pulse tracking-widest block">
                  DASHING NUMBERS...
                </span>
                <div className="text-6xl font-mono font-black text-amber-300 drop-shadow-[0_0_20px_rgba(250,204,21,0.8)] animate-bounce">
                  {cyclingNumber !== null ? cyclingNumber : '?'}
                </div>
              </div>
            ) : (
              /* Premium Interactive Number Buttons Grid */
              <div className={`grid gap-2 ${
                currentMode.maxNum === 20 ? 'grid-cols-5 sm:grid-cols-10' : 'grid-cols-5'
              }`}>
                {Array.from({ length: currentMode.maxNum - currentMode.minNum + 1 }, (_, i) => i + currentMode.minNum).map((num) => {
                  const isSelected = selectedNumber === num;

                  return (
                    <motion.button
                      key={num}
                      whileHover={{ scale: 1.08 }}
                      whileTap={{ scale: 0.92 }}
                      disabled={isDashing}
                      onClick={() => handleSelectNumber(num)}
                      className={`relative py-3 sm:py-4 rounded-2xl border-2 text-sm sm:text-base font-mono font-black transition-all flex items-center justify-center shadow-lg ${
                        isSelected
                          ? 'bg-gradient-to-b from-amber-400 via-yellow-500 to-amber-600 text-black border-yellow-200 scale-105 shadow-[0_0_20px_rgba(250,204,21,0.6)] z-10'
                          : 'bg-zinc-900/90 text-gray-300 border-white/10 hover:border-amber-400/50 hover:text-white'
                      }`}
                    >
                      <span>{num}</span>

                      {/* Glowing selection dot */}
                      {isSelected && (
                        <div className="absolute top-1 right-1 h-2 w-2 rounded-full bg-white shadow-sm" />
                      )}
                    </motion.button>
                  );
                })}
              </div>
            )}

            {/* Selection Status Message */}
            {noticeMessage && !isDashing && (
              <div className="text-center text-xs font-black text-amber-300 uppercase tracking-wider animate-pulse pt-1">
                {noticeMessage}
              </div>
            )}
          </div>

          {/* 4. COINS TO PLAY PANEL (REPLACED BET AMOUNT) */}
          <div className="bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3">
            <div className="flex justify-between items-center text-xs font-black">
              <label className="uppercase text-amber-400 tracking-wider">Coins to Play</label>
              <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="number"
                disabled={isDashing}
                value={coinsToPlay}
                onChange={(e) => setCoinsToPlay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
                className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-amber-400 outline-none shadow-inner"
              />

              {/* Quick Selectors */}
              <div className="grid grid-cols-4 gap-1">
                <button
                  onClick={() => setQuickCoins('min')}
                  disabled={isDashing}
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
                >
                  Min
                </button>
                <button
                  onClick={() => setQuickCoins('half')}
                  disabled={isDashing}
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
                >
                  /2
                </button>
                <button
                  onClick={() => setQuickCoins('double')}
                  disabled={isDashing}
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
                >
                  x2
                </button>
                <button
                  onClick={() => setQuickCoins('max')}
                  disabled={isDashing}
                  className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
                >
                  Max
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setQuickCoins('add100')}
                disabled={isDashing}
                className="py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/50 text-[10px] font-black text-gray-300 uppercase transition"
              >
                +100 Coins
              </button>
              <button
                onClick={() => setQuickCoins('add500')}
                disabled={isDashing}
                className="py-1.5 rounded-xl bg-zinc-900 border border-white/10 hover:border-amber-400/50 text-[10px] font-black text-gray-300 uppercase transition"
              >
                +500 Coins
              </button>
            </div>
          </div>

          {/* 5. MAIN ACTION BUTTON (START CHALLENGE) */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.96 }}
            onClick={handleStartRound}
            disabled={isDashing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 text-black font-black text-sm uppercase tracking-widest shadow-2xl shadow-amber-500/30 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Play className="h-5 w-5 fill-current" />
            <span>{isDashing ? 'DASHING NUMBERS...' : `▶ START CHALLENGE (${currentMode.multiplier}x REWARD)`}</span>
          </motion.button>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 2: ROUND HISTORY CARD */}
      {/* ========================================================= */}
      {activeTab === 'history' && (
        <div className="space-y-4 relative z-10 text-left">
          <div className="flex justify-between items-center border-b border-white/10 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <History className="h-4 w-4" />
              Recent 10 Rounds History
            </h4>
            <span className="text-[10px] font-bold text-gray-400">Newest First</span>
          </div>

          {history.length === 0 ? (
            <div className="text-center py-8 text-xs font-bold text-gray-500">
              No rounds played yet. Start a challenge above!
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <div
                  key={item.id}
                  className={`p-3 rounded-2xl border flex items-center justify-between transition-all ${
                    item.isWin
                      ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                      : 'bg-zinc-950/80 border-white/10 text-gray-400'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-xl flex items-center justify-center font-mono font-black text-xs ${
                      item.isWin ? 'bg-emerald-500 text-black' : 'bg-red-500/20 text-red-400 border border-red-500/40'
                    }`}>
                      {item.isWin ? '🎯' : '❌'}
                    </div>
                    <div>
                      <div className="text-xs font-black text-white">
                        Picked: <strong className="text-amber-300">#{item.selectedNumber}</strong> | Winning: <strong className="text-white">#{item.winningNumber}</strong>
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold">{item.timestamp}</div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className={`text-xs font-mono font-black ${item.isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                      {item.isWin ? `+${item.coinsEarned.toLocaleString()} 🪙` : `${item.coinsEarned.toLocaleString()} 🪙`}
                    </div>
                    {item.isWin && (
                      <div className="text-[9px] font-mono font-bold text-amber-400">{item.multiplier}x Multiplier</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 3: STATISTICS CARD */}
      {/* ========================================================= */}
      {activeTab === 'stats' && (
        <div className="space-y-4 relative z-10 text-left">
          <div className="border-b border-white/10 pb-2">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <BarChart3 className="h-4 w-4" />
              Career Game Statistics
            </h4>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Rounds Played</div>
              <div className="text-lg font-mono font-black text-white mt-1">{stats.roundsPlayed}</div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Wins / Losses</div>
              <div className="text-lg font-mono font-black text-emerald-400 mt-1">
                {stats.wins} <span className="text-gray-500 text-xs">/ {stats.losses}</span>
              </div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Win Rate</div>
              <div className="text-lg font-mono font-black text-amber-400 mt-1">
                {stats.roundsPlayed > 0 ? Math.round((stats.wins / stats.roundsPlayed) * 100) : 0}%
              </div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Highest Reward</div>
              <div className="text-lg font-mono font-black text-purple-400 mt-1">{stats.highestReward.toLocaleString()} 🪙</div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Current Streak</div>
              <div className="text-lg font-mono font-black text-amber-300 mt-1">{stats.currentStreak} 🔥</div>
            </div>

            <div className="bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Best Streak</div>
              <div className="text-lg font-mono font-black text-yellow-400 mt-1">{stats.bestStreak} 🏆</div>
            </div>

            <div className="col-span-2 bg-zinc-950/80 p-3 rounded-2xl border border-white/10">
              <div className="text-[10px] font-bold text-gray-400 uppercase">Total Coins Earned</div>
              <div className="text-lg font-mono font-black text-emerald-300 mt-1">{stats.totalCoinsEarned.toLocaleString()} 🪙</div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* TAB 4: DAILY MISSIONS CARD */}
      {/* ========================================================= */}
      {activeTab === 'missions' && (
        <div className="space-y-4 relative z-10 text-left">
          <div className="border-b border-white/10 pb-2 flex justify-between items-center">
            <h4 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
              <Gift className="h-4 w-4" />
              Daily Challenges & Missions
            </h4>
            <span className="text-[10px] font-bold text-gray-400">Resets Daily</span>
          </div>

          <div className="space-y-3">
            {missions.map((m) => {
              const isReady = m.currentCount >= m.reqCount && !m.isClaimed;

              return (
                <div
                  key={m.id}
                  className={`p-3 rounded-2xl border transition-all ${
                    m.isClaimed
                      ? 'bg-zinc-950/40 border-white/5 opacity-60'
                      : isReady
                      ? 'bg-gradient-to-r from-amber-500/20 via-zinc-900 to-zinc-950 border-amber-400'
                      : 'bg-zinc-950/80 border-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="text-2xl">{m.icon}</div>
                      <div>
                        <div className="text-xs font-black text-white">{m.title}</div>
                        <div className="text-[10px] text-gray-400">{m.description}</div>
                        <div className="text-[9px] font-mono text-amber-300 font-bold mt-1">
                          Reward: +{m.rewardCoins} Coins & +{m.rewardXP} XP
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => handleClaimMission(m)}
                      disabled={m.isClaimed}
                      className={`px-3 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                        m.isClaimed
                          ? 'bg-zinc-800 text-gray-500 cursor-not-allowed'
                          : isReady
                          ? 'bg-emerald-500 hover:bg-emerald-400 text-black font-black animate-bounce'
                          : 'bg-zinc-800 hover:bg-zinc-700 text-gray-300'
                      }`}
                    >
                      {m.isClaimed ? 'Claimed ✓' : isReady ? 'Claim!' : `${m.currentCount}/${m.reqCount}`}
                    </button>
                  </div>

                  {/* Progress bar */}
                  {!m.isClaimed && (
                    <div className="w-full bg-zinc-900 rounded-full h-1.5 mt-2.5 overflow-hidden border border-white/5">
                      <div
                        className="bg-amber-400 h-full rounded-full transition-all"
                        style={{ width: `${Math.min(100, (m.currentCount / m.reqCount) * 100)}%` }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* POPUP 6: ROUND RESULT MODAL POPUP */}
      {/* ========================================================= */}
      <AnimatePresence>
        {roundResultModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="text-5xl animate-bounce">
                {roundResultModal.isWin ? '🎉' : '💔'}
              </div>

              <div>
                <h3 className="text-xl font-black text-amber-400 tracking-tight">
                  {roundResultModal.isWin ? 'GREAT GUESS!' : 'CLOSE ATTEMPT!'}
                </h3>
                <p className="text-xs text-gray-300 font-bold mt-1">
                  You selected Number <span className="text-amber-300 font-black">#{roundResultModal.selectedNum}</span>. 
                  Winning Number was <span className="text-white font-black">#{roundResultModal.winningNum}</span>.
                </p>
              </div>

              <div className="bg-zinc-900 p-4 rounded-2xl border border-white/10 text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Winning Multiplier:</span>
                  <span className="font-mono font-black text-amber-400">×{roundResultModal.multiplier}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Reward Earned:</span>
                  <span className={`font-mono font-black ${roundResultModal.isWin ? 'text-emerald-400' : 'text-red-400'}`}>
                    {roundResultModal.isWin ? `+${roundResultModal.rewardCoins.toLocaleString()} Coins` : '0 Coins'}
                  </span>
                </div>
              </div>

              <button
                onClick={handleCollectPopup}
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-400 text-black font-black text-xs uppercase tracking-widest hover:scale-105 active:scale-95 transition shadow-lg"
              >
                {roundResultModal.isWin ? 'COLLECT REWARD 🪙' : 'PLAY AGAIN'}
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
