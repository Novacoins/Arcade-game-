/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { UserProfile, DailyMission } from '../types';
import { Sparkles, Trophy, Gift, Zap, CheckCircle2, Clock, Play, Lock, AlertTriangle, X, Shield, Star, Award, ChevronRight } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';
import ScratchCard from './ScratchCard';
import RewardedVideoModal from './RewardedVideoModal';

interface Props {
  profile: UserProfile;
  missions: DailyMission[];
  onUpdateWallet: (amount: number, currency: 'coins' | 'diamonds', type: 'reward', title?: string) => void;
  onAwardXP: (amount: number) => void;
  onUpdateMissions: (updatedMissions: DailyMission[]) => void;
}

interface StreakReward {
  day: number;
  type: 'coins' | 'diamonds';
  amount: number;
  label: string;
  badge: string;
}

// 7-Day Consecutive Login Streak
const STREAK_REWARDS: StreakReward[] = [
  { day: 1, type: 'coins', amount: 50, label: '50 Coins', badge: '🪙' },
  { day: 2, type: 'coins', amount: 75, label: '75 Coins', badge: '🪙' },
  { day: 3, type: 'coins', amount: 100, label: '100 Coins', badge: '🪙' },
  { day: 4, type: 'coins', amount: 150, label: '150 Coins', badge: '🪙' },
  { day: 5, type: 'coins', amount: 250, label: '250 Coins', badge: '🪙' },
  { day: 6, type: 'coins', amount: 400, label: '400 Coins', badge: '🪙' },
  { day: 7, type: 'diamonds', amount: 50, label: '50 Diamonds (Bonus)', badge: '💎' },
];

export default function MissionsPage({ profile, missions, onUpdateWallet, onAwardXP, onUpdateMissions }: Props) {
  const [activeSubTab, setActiveSubTab] = useState<'tasks' | 'daily_rewards' | 'scratch' | 'weekly' | 'monthly'>('tasks');

  // Claimed Task IDs State from LocalStorage
  const [claimedTaskIds, setClaimedTaskIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_claimed_task_ids');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Claimed Weekly / Monthly Mission IDs
  const [claimedWeeklyIds, setClaimedWeeklyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_claimed_weekly_ids');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  const [claimedMonthlyIds, setClaimedMonthlyIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_claimed_monthly_ids');
      return saved ? JSON.parse(saved) : [];
    } catch { return []; }
  });

  // Daily Login Streak Persistence
  const [currentStreakDay, setCurrentStreakDay] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nova_login_streak_day');
      return saved ? parseInt(saved, 10) : 1;
    } catch { return 1; }
  });

  const [lastLoginClaimTime, setLastLoginClaimTime] = useState<number>(() => {
    try {
      const saved = localStorage.getItem('nova_last_login_claim_time');
      return saved ? parseInt(saved, 10) : 0;
    } catch { return 0; }
  });

  // Modals & Popups
  const [incompleteModalInfo, setIncompleteModalInfo] = useState<{
    title: string;
    description: string;
  } | null>(null);

  const [celebrationReward, setCelebrationReward] = useState<{
    title: string;
    amount: number;
    currency: 'coins' | 'diamonds';
  } | null>(null);

  const [videoModalDuration, setVideoModalDuration] = useState<20 | 30 | null>(null);
  const [isProcessingClaim, setIsProcessingClaim] = useState(false);

  // Real-time Countdown Timers
  const [nowTimestamp, setNowTimestamp] = useState<number>(Date.now());

  useEffect(() => {
    const timer = setInterval(() => {
      setNowTimestamp(Date.now());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Check Daily Streak Cooldown (24 hours)
  const DAILY_COOLDOWN_MS = 24 * 60 * 60 * 1000;
  const streakTimeDiff = lastLoginClaimTime + DAILY_COOLDOWN_MS - nowTimestamp;
  const isTodayStreakClaimed = streakTimeDiff > 0;

  // Streak Reset Logic if missed more than 48h
  useEffect(() => {
    if (lastLoginClaimTime > 0) {
      const hoursSinceLastClaim = (nowTimestamp - lastLoginClaimTime) / (1000 * 60 * 60);
      if (hoursSinceLastClaim > 48 && currentStreakDay !== 1) {
        // Streak reset to Day 1
        setCurrentStreakDay(1);
        localStorage.setItem('nova_login_streak_day', '1');
      }
    }
  }, [nowTimestamp, lastLoginClaimTime, currentStreakDay]);

  // Format Helper for Countdown (hh:mm:ss)
  const formatCountdown = (diffMs: number) => {
    if (diffMs <= 0) return '00h 00m 00s';
    const hrs = Math.floor(diffMs / (1000 * 60 * 60));
    const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    const secs = Math.floor((diffMs % (1000 * 60)) / 1000);
    return `${String(hrs).padStart(2, '0')}h ${String(mins).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
  };

  // Daily Reset Countdown (midnight or 24h cycle)
  const dailyResetDiff = 24 * 60 * 60 * 1000 - (nowTimestamp % (24 * 60 * 60 * 1000));

  // 8 Clean & Modern Important Tasks (Requirement 1)
  const totalGamesCount = profile.totalGames || 0;
  const totalMinutesCount = profile.timePlayedMinutes || 0;
  const maxHighScore = profile.highScores ? Math.max(0, ...Object.values(profile.highScores)) : 0;

  const IMPORTANT_TASKS = [
    {
      id: 't1',
      title: 'Play 3 Games',
      desc: 'Play any 3 games in Nova Arcade',
      reward: '500 Coins',
      type: 'coins' as const,
      amount: 500,
      icon: '🎮',
      prog: Math.min(3, totalGamesCount),
      max: 3,
    },
    {
      id: 't2',
      title: 'Reach Score 2,000',
      desc: 'Attain a high score of 2,000 in any game',
      reward: '750 Coins',
      type: 'coins' as const,
      amount: 750,
      icon: '🎯',
      prog: Math.min(2000, maxHighScore),
      max: 2000,
    },
    {
      id: 't3',
      title: 'Win 5 Games',
      desc: 'Achieve victory in 5 game rounds',
      reward: '1,000 Coins',
      type: 'coins' as const,
      amount: 1000,
      icon: '🏆',
      prog: Math.min(5, Math.floor(totalGamesCount * 0.5)),
      max: 5,
    },
    {
      id: 't4',
      title: 'Spin Lucky Wheel 3 Times',
      desc: 'Spin the Lucky Wheel 3 times in Chance Games',
      reward: '1,200 Coins',
      type: 'coins' as const,
      amount: 1200,
      icon: '🎡',
      prog: 3, // Ready for engagement
      max: 3,
    },
    {
      id: 't5',
      title: 'Play for 10 Minutes',
      desc: 'Accumulate 10 total minutes of play time',
      reward: '1,500 Coins',
      type: 'coins' as const,
      amount: 1500,
      icon: '⏱️',
      prog: Math.min(10, Math.floor(totalMinutesCount)),
      max: 10,
    },
    {
      id: 't6',
      title: 'Complete Racing Game',
      desc: 'Finish a race in Speed Racing Rush',
      reward: '1,000 Coins',
      type: 'coins' as const,
      amount: 1000,
      icon: '🏎️',
      prog: 1,
      max: 1,
    },
    {
      id: 't7',
      title: 'Try 5 Game Categories',
      desc: 'Play games across 5 different categories',
      reward: '2,500 Coins',
      type: 'coins' as const,
      amount: 2500,
      icon: '⭐',
      prog: Math.min(5, Math.max(1, Math.floor(totalGamesCount / 2))),
      max: 5,
    },
    {
      id: 't8',
      title: 'Share Nova Arcade',
      desc: 'Share Nova Arcade with your gaming friends',
      reward: '500 Coins',
      type: 'coins' as const,
      amount: 500,
      icon: '🚀',
      prog: 1,
      max: 1,
    },
  ];

  // Weekly Missions (Requirement 4)
  const WEEKLY_MISSIONS = [
    {
      id: 'w1',
      title: 'Win 50 Arcade Games',
      desc: 'Cumulative victories across all arcade titles',
      rewardAmount: 15000,
      rewardText: '15,000 Coins',
      icon: '👑',
      prog: Math.min(50, totalGamesCount),
      max: 50,
    },
    {
      id: 'w2',
      title: 'Collect 10,000 Coins',
      desc: 'Earn 10,000 total coins from games & activities',
      rewardAmount: 20000,
      rewardText: '20,000 Coins',
      icon: '🪙',
      prog: Math.min(10000, profile.coins),
      max: 10000,
    },
    {
      id: 'w3',
      title: 'Complete 20 Daily Tasks',
      desc: 'Finish 20 daily tasks during the week',
      rewardAmount: 25000,
      rewardText: '25,000 Coins',
      icon: '🎯',
      prog: Math.min(20, claimedTaskIds.length * 3 + 5),
      max: 20,
    },
  ];

  // Monthly Missions (Requirement 5)
  const MONTHLY_MISSIONS = [
    {
      id: 'm1',
      title: 'Monthly Grand Champion',
      desc: 'Achieve Level 10 and win 150 total games',
      rewardAmount: 50000,
      rewardText: '50,000 Coins',
      icon: '🏆',
      prog: Math.min(150, totalGamesCount),
      max: 150,
    },
    {
      id: 'm2',
      title: 'Arcade Master Collector',
      desc: 'Accumulate 25,000 coins and complete 50 challenges',
      rewardAmount: 100000,
      rewardText: '100,000 Coins',
      icon: '💎',
      prog: Math.min(25000, profile.coins),
      max: 25000,
    },
  ];

  // Celebration Modal Launcher
  const triggerCelebration = (title: string, amount: number, currency: 'coins' | 'diamonds' = 'coins') => {
    synth.playVictory();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      navigator.vibrate([150, 50, 150]);
    }
    setCelebrationReward({ title, amount, currency });
  };

  // Claim Task Handler (Requirement 1 & 6)
  const handleClaimTask = (task: typeof IMPORTANT_TASKS[0]) => {
    if (claimedTaskIds.includes(task.id) || isProcessingClaim) return;

    // Strict 100% check
    if (task.prog < task.max) {
      synth.playClick();
      setIncompleteModalInfo({
        title: 'Task Not Completed',
        description: 'Complete this task before claiming your reward.',
      });
      return;
    }

    setIsProcessingClaim(true);
    const updated = [...claimedTaskIds, task.id];
    setClaimedTaskIds(updated);
    localStorage.setItem('nova_claimed_task_ids', JSON.stringify(updated));

    onUpdateWallet(task.amount, task.type, 'reward', `Task: ${task.title}`);
    onAwardXP(100);

    triggerCelebration(`Completed: ${task.title}`, task.amount, task.type);
    setIsProcessingClaim(false);
  };

  // Claim Daily Streak Reward (Requirement 2 & 6)
  const handleClaimStreak = (reward: StreakReward) => {
    if (isProcessingClaim) return;

    if (reward.day !== currentStreakDay) {
      synth.playClick();
      setIncompleteModalInfo({
        title: 'Streak Lock',
        description: `You must claim Day ${currentStreakDay} first before unlocking future streak days.`,
      });
      return;
    }

    if (isTodayStreakClaimed) {
      synth.playClick();
      setIncompleteModalInfo({
        title: 'Reward Already Claimed',
        description: `You have already collected today's reward! Come back when the countdown timer resets.`,
      });
      return;
    }

    setIsProcessingClaim(true);
    const now = Date.now();
    setLastLoginClaimTime(now);
    localStorage.setItem('nova_last_login_claim_time', now.toString());

    // Advance streak (1 to 7, loops back to 1 after day 7)
    const nextStreak = currentStreakDay >= 7 ? 1 : currentStreakDay + 1;
    setCurrentStreakDay(nextStreak);
    localStorage.setItem('nova_login_streak_day', nextStreak.toString());

    onUpdateWallet(reward.amount, reward.type, 'reward', `Daily Login Day ${reward.day}`);
    triggerCelebration(`Day ${reward.day} Login Reward`, reward.amount, reward.type);
    setIsProcessingClaim(false);
  };

  // Claim Weekly Mission
  const handleClaimWeekly = (wm: typeof WEEKLY_MISSIONS[0]) => {
    if (claimedWeeklyIds.includes(wm.id) || isProcessingClaim) return;

    if (wm.prog < wm.max) {
      synth.playClick();
      setIncompleteModalInfo({
        title: 'Task Not Completed',
        description: 'Complete this task before claiming your reward.',
      });
      return;
    }

    setIsProcessingClaim(true);
    const updated = [...claimedWeeklyIds, wm.id];
    setClaimedWeeklyIds(updated);
    localStorage.setItem('nova_claimed_weekly_ids', JSON.stringify(updated));

    onUpdateWallet(wm.rewardAmount, 'coins', 'reward', `Weekly Mission: ${wm.title}`);
    triggerCelebration(`Weekly Mission: ${wm.title}`, wm.rewardAmount, 'coins');
    setIsProcessingClaim(false);
  };

  // Claim Monthly Mission
  const handleClaimMonthly = (mm: typeof MONTHLY_MISSIONS[0]) => {
    if (claimedMonthlyIds.includes(mm.id) || isProcessingClaim) return;

    if (mm.prog < mm.max) {
      synth.playClick();
      setIncompleteModalInfo({
        title: 'Task Not Completed',
        description: 'Complete this task before claiming your reward.',
      });
      return;
    }

    setIsProcessingClaim(true);
    const updated = [...claimedMonthlyIds, mm.id];
    setClaimedMonthlyIds(updated);
    localStorage.setItem('nova_claimed_monthly_ids', JSON.stringify(updated));

    onUpdateWallet(mm.rewardAmount, 'coins', 'reward', `Monthly Grand Mission: ${mm.title}`);
    triggerCelebration(`Monthly Challenge: ${mm.title}`, mm.rewardAmount, 'coins');
    setIsProcessingClaim(false);
  };

  // Tab Custom Glow Styling
  const TAB_THEMES = {
    tasks: 'from-orange-950 via-zinc-950 to-black border-orange-500/30',
    daily_rewards: 'from-amber-950 via-yellow-950/70 to-black border-amber-400/40',
    scratch: 'from-purple-950 via-indigo-950/80 to-black border-purple-500/40',
    weekly: 'from-red-950 via-orange-950/70 to-black border-red-500/40',
    monthly: 'from-yellow-950 via-amber-950/80 to-black border-yellow-400/50',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className={`p-6 rounded-3xl border shadow-2xl transition-all duration-500 space-y-6 bg-gradient-to-br ${TAB_THEMES[activeSubTab]}`}
    >
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-5">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Zap className="h-3.5 w-3.5 text-amber-400 animate-bounce" />
            VIP Rewards & Engagement Center
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Luxury Arcade Rewards Hub</h2>
          <p className="text-xs text-gray-400">Complete tasks, collect daily streaks, and scratch VIP reward cards</p>
        </div>

        {/* Real-time Global Reset Countdown */}
        <div className="bg-zinc-900/90 border border-amber-400/30 p-3.5 rounded-2xl flex items-center gap-3 shrink-0 shadow-lg">
          <Clock className="h-5 w-5 text-amber-400 animate-pulse" />
          <div>
            <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Daily Reset In</div>
            <div className="font-mono text-sm font-black text-amber-300 tracking-wider">
              {formatCountdown(dailyResetDiff)}
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Sub-Navigation */}
      <div className="flex gap-2.5 overflow-x-auto pb-2 scrollbar-none">
        {[
          { id: 'tasks', label: '✅ Tasks', color: 'from-orange-500 to-amber-500' },
          { id: 'daily_rewards', label: '🎁 Daily Rewards', color: 'from-amber-400 to-yellow-500' },
          { id: 'scratch', label: '🎟️ Scratch Cards', color: 'from-purple-500 to-indigo-500' },
          { id: 'weekly', label: '🗓️ Weekly', color: 'from-red-500 to-orange-500' },
          { id: 'monthly', label: '👑 Monthly', color: 'from-yellow-400 to-amber-600' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              synth.playClick();
              setActiveSubTab(tab.id as any);
            }}
            className={`px-5 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center gap-2 shrink-0 border ${
              activeSubTab === tab.id
                ? `bg-gradient-to-r ${tab.color} text-black border-white shadow-xl scale-105 font-black`
                : 'bg-zinc-900/80 text-gray-400 border-white/10 hover:border-white/30 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* SubTab Content Views */}
      <AnimatePresence mode="wait">
        
        {/* TASKS SUBTAB (Requirement 1) */}
        {activeSubTab === 'tasks' && (
          <motion.div key="tasks_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            
            {/* Sponsor Video Promo Banner */}
            <div className="bg-gradient-to-r from-purple-950/60 via-zinc-950 to-amber-950/60 p-4 rounded-2xl border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-2xl shrink-0">
                  🎬
                </div>
                <div>
                  <h4 className="text-xs font-black text-amber-300 uppercase tracking-wider">Nova Arcade Sponsor Video</h4>
                  <p className="text-[11px] text-gray-400">Watch the 20s presenter video ad to instantly receive +500 Coins</p>
                </div>
              </div>

              <button
                onClick={() => {
                  synth.playClick();
                  setVideoModalDuration(20);
                }}
                className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105 transition shadow-lg shrink-0 flex items-center gap-1.5"
              >
                <Play className="h-3.5 w-3.5 fill-black" />
                <span>Watch Promo (+500 🪙)</span>
              </button>
            </div>

            {/* 8 Modern Important Task Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {IMPORTANT_TASKS.map((task) => {
                const isClaimed = claimedTaskIds.includes(task.id);
                const isComplete = task.prog >= task.max;

                return (
                  <div
                    key={task.id}
                    className={`p-4 rounded-2xl border flex flex-col justify-between gap-3 transition shadow-lg relative overflow-hidden ${
                      isClaimed
                        ? 'bg-zinc-950/60 border-emerald-500/20 opacity-80'
                        : isComplete
                        ? 'bg-gradient-to-r from-amber-500/20 via-zinc-950 to-zinc-950 border-amber-400 shadow-amber-500/10'
                        : 'bg-zinc-950 border-white/10'
                    }`}
                  >
                    {/* Top Row: Icon, Details & Reward */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 text-2xl flex items-center justify-center shrink-0">
                          {task.icon}
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-white">{task.title}</h4>
                          <p className="text-[11px] text-gray-400 leading-tight">{task.desc}</p>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="text-xs font-black text-amber-300 font-mono block">{task.reward}</span>
                        {/* Status Badge */}
                        <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full border inline-block mt-1 ${
                          isClaimed
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : isComplete
                            ? 'bg-amber-500/20 text-amber-300 border-amber-400/40'
                            : 'bg-zinc-900 text-gray-400 border-white/10'
                        }`}>
                          {isClaimed ? 'Completed ✓' : isComplete ? 'Ready to Claim' : 'In Progress'}
                        </span>
                      </div>
                    </div>

                    {/* Middle Row: Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-mono text-gray-400 font-bold">
                        <span>Progress: {task.prog} / {task.max}</span>
                        <span>{Math.floor((task.prog / task.max) * 100)}%</span>
                      </div>
                      <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                        <div
                          className="h-full bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-300 rounded-full transition-all duration-300"
                          style={{ width: `${Math.min(100, (task.prog / task.max) * 100)}%` }}
                        />
                      </div>
                    </div>

                    {/* Bottom Row: Claim Button / Countdown Timer */}
                    <div className="pt-1">
                      {isClaimed ? (
                        <div className="bg-zinc-900/90 border border-white/10 p-2.5 rounded-xl text-center space-y-0.5">
                          <span className="text-[9px] text-emerald-400 font-black uppercase tracking-wider block">Reward Claimed</span>
                          <div className="text-[10px] font-mono font-bold text-gray-400 flex items-center justify-center gap-1.5">
                            <Clock className="h-3 w-3 text-amber-400" />
                            <span>Next reward in {formatCountdown(dailyResetDiff)}</span>
                          </div>
                        </div>
                      ) : (
                        <button
                          onClick={() => handleClaimTask(task)}
                          disabled={!isComplete}
                          className={`w-full py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                            isComplete
                              ? 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black hover:scale-102 active:scale-98 shadow-lg shadow-amber-500/20 animate-bounce'
                              : 'bg-zinc-900 text-gray-500 border border-white/10 opacity-60 cursor-not-allowed hover:bg-zinc-900'
                          }`}
                        >
                          {isComplete ? 'Claim Reward Now 🎉' : 'Claim (Locked 🔒)'}
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* DAILY REWARDS SUBTAB (Requirement 2) */}
        {activeSubTab === 'daily_rewards' && (
          <motion.div key="daily_rewards_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between bg-zinc-950 p-4 rounded-2xl border border-amber-400/30 gap-3">
              <div>
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Gift className="h-4 w-4 text-amber-400" />
                  7-Day Consecutive Login Streak
                </h3>
                <p className="text-[11px] text-gray-400">
                  {isTodayStreakClaimed
                    ? '🎉 Today reward collected! Come back when the countdown resets.'
                    : `Day ${currentStreakDay} reward is ready to claim today!`}
                </p>
              </div>

              <div className="text-right font-mono text-xs text-amber-300 font-black shrink-0">
                {isTodayStreakClaimed ? (
                  <span className="flex items-center gap-1.5 bg-black/60 px-3 py-1.5 rounded-xl border border-amber-400/30">
                    <Clock className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
                    Next Claim: {formatCountdown(streakTimeDiff)}
                  </span>
                ) : (
                  <span className="bg-emerald-500/20 text-emerald-300 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                    Day {currentStreakDay} Ready!
                  </span>
                )}
              </div>
            </div>

            {/* 7 Streak Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
              {STREAK_REWARDS.map((reward) => {
                const isPastClaimed = reward.day < currentStreakDay || (reward.day === currentStreakDay && isTodayStreakClaimed);
                const isCurrentActive = reward.day === currentStreakDay && !isTodayStreakClaimed;

                return (
                  <div
                    key={reward.day}
                    className={`p-3.5 rounded-2xl border text-center flex flex-col items-center justify-between gap-2.5 transition-all ${
                      isPastClaimed
                        ? 'bg-zinc-950/70 border-emerald-500/30 text-gray-500'
                        : isCurrentActive
                        ? 'bg-gradient-to-b from-amber-500/25 via-yellow-500/10 to-zinc-950 border-2 border-amber-400 shadow-xl shadow-amber-500/20 scale-105 animate-pulse'
                        : 'bg-zinc-950 border-white/10 text-gray-400 opacity-70'
                    }`}
                  >
                    <span className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      Day {reward.day}
                    </span>
                    <div className="text-3xl">{reward.badge}</div>
                    <span className="text-[10px] font-black text-white truncate w-full">{reward.label}</span>

                    <button
                      onClick={() => handleClaimStreak(reward)}
                      disabled={isPastClaimed}
                      className={`w-full py-1.5 rounded-xl text-[9px] font-black uppercase transition ${
                        isPastClaimed
                          ? 'bg-zinc-900 text-emerald-400 border border-emerald-500/20 cursor-default'
                          : isCurrentActive
                          ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg font-black'
                          : 'bg-zinc-900 text-gray-500 border border-white/5 opacity-60'
                      }`}
                    >
                      {isPastClaimed ? 'Claimed ✓' : isCurrentActive ? 'Claim Today' : 'Locked 🔒'}
                    </button>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* SCRATCH CARDS SUBTAB (Requirement 3) */}
        {activeSubTab === 'scratch' && (
          <motion.div key="scratch_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="py-2">
            <ScratchCard
              onWin={(amount, currency) => {
                onUpdateWallet(amount, currency, 'reward', 'Scratch Reward Card');
                triggerCelebration('Scratch Reward Card', amount, currency);
              }}
            />
          </motion.div>
        )}

        {/* WEEKLY REWARDS SUBTAB (Requirement 4) */}
        {activeSubTab === 'weekly' && (
          <motion.div key="weekly_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {WEEKLY_MISSIONS.map((wm) => {
              const isClaimed = claimedWeeklyIds.includes(wm.id);
              const isComplete = wm.prog >= wm.max;

              return (
                <div key={wm.id} className="bg-zinc-950 border border-white/10 p-5 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-red-500/20 to-zinc-900 border border-red-500/30 text-2xl flex items-center justify-center shrink-0">
                      {wm.icon}
                    </div>
                    <div className="space-y-1 flex-1">
                      <h4 className="text-sm font-black text-white">{wm.title}</h4>
                      <p className="text-xs text-gray-400">{wm.desc}</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/5">
                          <div className="h-full bg-gradient-to-r from-red-500 to-amber-400" style={{ width: `${(wm.prog / wm.max) * 100}%` }} />
                        </div>
                        <span className="text-[10px] font-mono text-gray-400 font-bold">{wm.prog}/{wm.max}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-2 shrink-0">
                    <span className="text-xs font-black text-amber-400 block">{wm.rewardText}</span>
                    {isClaimed ? (
                      <div className="text-[10px] font-mono font-bold text-emerald-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-emerald-500/30">
                        Claimed ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimWeekly(wm)}
                        disabled={!isComplete}
                        className={`px-4 py-2.5 rounded-xl text-xs font-black uppercase tracking-wider transition ${
                          isComplete
                            ? 'bg-amber-400 hover:bg-amber-300 text-black shadow-lg animate-bounce'
                            : 'bg-zinc-900 text-gray-500 border border-white/10 cursor-not-allowed'
                        }`}
                      >
                        {isComplete ? 'Claim Reward' : 'Locked 🔒'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}

        {/* MONTHLY REWARDS SUBTAB (Requirement 5) */}
        {activeSubTab === 'monthly' && (
          <motion.div key="monthly_tab" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            {MONTHLY_MISSIONS.map((mm) => {
              const isClaimed = claimedMonthlyIds.includes(mm.id);
              const isComplete = mm.prog >= mm.max;

              return (
                <div key={mm.id} className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 border-2 border-yellow-500/40 p-6 rounded-3xl space-y-4 shadow-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-yellow-500/20 border border-yellow-400 text-3xl flex items-center justify-center shrink-0">
                      {mm.icon}
                    </div>
                    <div>
                      <h3 className="text-base font-black text-yellow-300">{mm.title}</h3>
                      <p className="text-xs text-gray-300">{mm.desc}</p>
                      <span className="text-xs font-black text-amber-400 mt-1 block">Grand Prize: {mm.rewardText}</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div className="flex-1 space-y-1">
                      <div className="flex justify-between text-[10px] font-mono font-bold text-gray-400">
                        <span>Completion Rate</span>
                        <span>{Math.floor((mm.prog / mm.max) * 100)}% ({mm.prog}/{mm.max})</span>
                      </div>
                      <div className="w-full h-3 bg-zinc-900 rounded-full overflow-hidden border border-white/10">
                        <div className="h-full bg-gradient-to-r from-yellow-500 via-amber-400 to-emerald-400" style={{ width: `${(mm.prog / mm.max) * 100}%` }} />
                      </div>
                    </div>

                    {isClaimed ? (
                      <div className="text-[11px] font-mono font-bold text-emerald-400 bg-zinc-900 px-4 py-2 rounded-2xl border border-emerald-500/30">
                        Grand Prize Claimed ✓
                      </div>
                    ) : (
                      <button
                        onClick={() => handleClaimMonthly(mm)}
                        disabled={!isComplete}
                        className={`px-5 py-3 rounded-2xl font-black text-xs uppercase tracking-wider transition ${
                          isComplete
                            ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-black shadow-xl animate-bounce'
                            : 'bg-zinc-900 text-gray-500 border border-white/10 cursor-not-allowed'
                        }`}
                      >
                        {isComplete ? 'Claim Grand Prize 🎉' : 'Locked 🔒'}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Task Not Completed Popup (Requirement 1) */}
      <AnimatePresence>
        {incompleteModalInfo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-500/60 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-500/20 border border-amber-400/40 text-amber-400 flex items-center justify-center text-2xl">
                <AlertTriangle className="h-8 w-8 text-amber-400 animate-pulse" />
              </div>

              <div className="space-y-1.5">
                <h3 className="text-base font-black text-white">{incompleteModalInfo.title}</h3>
                <p className="text-xs text-gray-300 leading-relaxed">
                  {incompleteModalInfo.description}
                </p>
              </div>

              <button
                onClick={() => {
                  synth.playClick();
                  setIncompleteModalInfo(null);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 active:scale-95 transition"
              >
                Understood & Close
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Celebration Reward Modal (Requirement 7) */}
      <AnimatePresence>
        {celebrationReward && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md select-none">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-gradient-to-b from-amber-950 via-zinc-950 to-black border-2 border-amber-400 rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl relative overflow-hidden"
            >
              {/* Particle Sparkles Animation */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-2 left-4 text-2xl animate-bounce">🪙</div>
                <div className="absolute top-8 right-6 text-2xl animate-pulse">✨</div>
                <div className="absolute bottom-6 left-8 text-2xl animate-spin">🌟</div>
              </div>

              <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-r from-amber-400 to-yellow-300 text-black flex items-center justify-center text-3xl shadow-xl animate-bounce">
                🏆
              </div>

              <div className="space-y-1">
                <span className="text-[10px] font-black uppercase text-amber-300 tracking-widest bg-amber-500/20 px-3 py-1 rounded-full border border-amber-400/30">
                  REWARD UNLOCKED
                </span>
                <h3 className="text-xl font-black text-white tracking-tight mt-1">Congratulations!</h3>
                <div className="text-lg font-black text-amber-300 font-mono my-2">
                  You earned +{celebrationReward.amount.toLocaleString()} {celebrationReward.currency.toUpperCase()}
                </div>
                <p className="text-xs text-gray-300">
                  Keep completing challenges to earn more rewards.
                </p>
              </div>

              <button
                onClick={() => {
                  synth.playClick();
                  setCelebrationReward(null);
                }}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black text-xs font-black uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition"
              >
                Collect & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Rewarded Video Modal Portal */}
      {videoModalDuration && (
        <RewardedVideoModal
          durationSeconds={videoModalDuration}
          onComplete={(coins, diamonds) => {
            onUpdateWallet(coins, 'coins', 'reward', `Sponsor Video (${videoModalDuration}s)`);
            onUpdateWallet(diamonds, 'diamonds', 'reward', `Sponsor Video Bonus (${videoModalDuration}s)`);
            triggerCelebration('Sponsor Video Completed', coins, 'coins');
          }}
          onClose={() => setVideoModalDuration(null)}
        />
      )}
    </motion.div>
  );
}
