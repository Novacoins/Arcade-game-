/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile, GameStats, Achievement, DailyMission } from '../types';
import { PORTRAIT_AVATARS } from '../data/portraitAvatars';
import PortraitAvatarView from './PortraitAvatarView';
import { GAMES_LIST } from '../data/gamesList';
import { Edit3, Shield, Sparkles, Zap, X, Coins, Gem, Gamepad2, Trophy, Globe, Clock, Lock, CheckCircle2, AlertTriangle, Play } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';
import { PREMIUM_EMOJIS, ALL_EMOJI_AVATARS } from '../utils/leaderboardGenerator';

interface Props {
  profile: UserProfile;
  stats: GameStats;
  achievements: Achievement[];
  missions: DailyMission[];
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onUpdateWallet: (amount: number, currency: 'coins' | 'diamonds', type: 'reward', title?: string) => void;
}

const COUNTRY_OPTIONS = [
  'United States 🇺🇸',
  'United Kingdom 🇬🇧',
  'Japan 🇯🇵',
  'Germany 🇩🇪',
  'Canada 🇨🇦',
  'Brazil 🇧🇷',
  'Nigeria 🇳🇬',
  'France 🇫🇷',
  'India 🇮🇳',
  'Australia 🇦🇺',
  'South Korea 🇰🇷',
  'Spain 🇪🇸'
];

const LANGUAGE_OPTIONS = ['English', 'Spanish', 'French', 'German', 'Japanese', 'Portuguese', 'Chinese'];

export default function ProfilePage({ profile, stats, achievements, missions, onUpdateProfile, onUpdateWallet }: Props) {
  const [activeTab, setActiveTab] = useState<'overview' | 'avatars' | 'achievements' | 'missions' | 'edit'>('overview');

  // Form State
  const [username, setUsername] = useState(profile.username);
  const [country, setCountry] = useState(profile.country || 'United States 🇺🇸');
  const [gender, setGender] = useState<'Male' | 'Female' | 'Prefer not to say'>(profile.gender || 'Prefer not to say');
  const [favoriteGame, setFavoriteGame] = useState(profile.favoriteGame || 'Sky Flight');
  const [age, setAge] = useState<string>(profile.age ? String(profile.age) : '24');
  const [bio, setBio] = useState(profile.bio || 'Nova Arcade player scaling the global leaderboard!');
  const [language, setLanguage] = useState(profile.language || 'English');

  const [toastMsg, setToastMsg] = useState('');

  // LocalStorage Persistence for Claimed Achievements
  const [claimedAchievements, setClaimedAchievements] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('nova_claimed_achievements');
      return saved ? JSON.parse(saved) : ['first_game'];
    } catch (e) {
      return ['first_game'];
    }
  });

  const saveClaimedAchievements = (newClaimed: string[]) => {
    setClaimedAchievements(newClaimed);
    try {
      localStorage.setItem('nova_claimed_achievements', JSON.stringify(newClaimed));
    } catch (e) {
      console.error('Failed to save achievements to localStorage', e);
    }
  };

  // Active Popup Modal State
  const [activePopup, setActivePopup] = useState<{
    type: 'coins' | 'diamonds' | 'games' | 'winnings' | 'country' | 'gender' | 'age' | 'language' | 'favGame';
    title: string;
    targetValue: number; // For counting animation
    displaySuffix?: string;
    rawTextValue?: string;
    subValue?: string;
    icon?: React.ReactNode;
    colorTheme: 'gold' | 'blue' | 'purple' | 'emerald' | 'amber';
    gameData?: typeof GAMES_LIST[0];
  } | null>(null);

  // Counting animation state
  const [animatedCount, setAnimatedCount] = useState(0);

  // Incomplete Achievement Modal State
  const [incompleteModal, setIncompleteModal] = useState<{
    title: string;
    req: number;
    prog: number;
  } | null>(null);

  // Popup counter effect
  useEffect(() => {
    if (activePopup && activePopup.targetValue > 0) {
      setAnimatedCount(0);
      const duration = 1200; // ms
      const steps = 30;
      const stepTime = duration / steps;
      const increment = activePopup.targetValue / steps;
      let current = 0;

      const timer = setInterval(() => {
        current += increment;
        if (current >= activePopup.targetValue) {
          setAnimatedCount(activePopup.targetValue);
          clearInterval(timer);
        } else {
          setAnimatedCount(Math.floor(current));
        }
      }, stepTime);

      return () => clearInterval(timer);
    }
  }, [activePopup]);

  // Auto-close popup after 3.2 seconds
  useEffect(() => {
    if (activePopup) {
      const timer = setTimeout(() => {
        setActivePopup(null);
      }, 3200);
      return () => clearTimeout(timer);
    }
  }, [activePopup]);

  const handleSelectPortrait = (portraitId: string) => {
    synth.playUpgradeSuccess();
    onUpdateProfile({ portraitAvatar: portraitId });
    try {
      localStorage.setItem('nova_equipped_portrait', portraitId);
    } catch (e) {
      console.error('Failed to save equipped portrait', e);
    }
    const matched = PORTRAIT_AVATARS.find(p => p.id === portraitId);
    setToastMsg(`Equipped ${matched ? matched.name : 'Character'}!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSelectEmoji = (emoji: string) => {
    synth.playCoin();
    onUpdateProfile({ avatar: emoji, portraitAvatar: undefined });
    try {
      localStorage.removeItem('nova_equipped_portrait');
      localStorage.setItem('nova_equipped_emoji', emoji);
    } catch (e) {
      console.error('Failed to save equipped emoji', e);
    }
    setToastMsg(`Equipped Premium ${emoji} Avatar!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSaveProfile = () => {
    synth.playUpgradeSuccess();
    onUpdateProfile({
      username,
      country,
      gender,
      favoriteGame,
      age: parseInt(age) || 24,
      bio,
      language
    });
    setToastMsg('Profile updated successfully!');
    setTimeout(() => setToastMsg(''), 3000);
    setActiveTab('overview');
  };

  const handleOpenStatPopup = (
    type: 'coins' | 'diamonds' | 'games' | 'winnings',
    title: string,
    numericVal: number,
    suffix: string,
    colorTheme: 'gold' | 'blue' | 'purple' | 'emerald'
  ) => {
    synth.playClick();
    setActivePopup({
      type,
      title,
      targetValue: numericVal,
      displaySuffix: suffix,
      colorTheme,
    });
  };

  const handleOpenInfoPopup = (
    type: 'country' | 'gender' | 'age' | 'language',
    title: string,
    value: string
  ) => {
    synth.playClick();
    setActivePopup({
      type,
      title,
      targetValue: 0,
      rawTextValue: value,
      colorTheme: 'amber',
    });
  };

  const handleOpenFavGamePopup = () => {
    synth.playClick();
    const matchedGame = GAMES_LIST.find(g => g.title.toLowerCase() === (profile.favoriteGame || 'Sky Flight').toLowerCase()) || GAMES_LIST[0];
    setActivePopup({
      type: 'favGame',
      title: 'Favorite Game',
      targetValue: 0,
      rawTextValue: matchedGame.title,
      colorTheme: 'gold',
      gameData: matchedGame,
    });
  };

  // Comprehensive Achievement List with distinct themes
  const ALL_ACHIEVEMENTS = [
    { id: 'first_game', title: 'First Match', desc: 'Play your first match in Nova Arcade', icon: '🎮', req: 1, prog: Math.min(1, stats.gamesPlayed), rewardCoin: 1000, rewardText: '1,000 Coins', colorTheme: 'gold' },
    { id: 'bubble_master', title: 'Bubble Master', desc: 'Clear 5 levels in Bubble Pop', icon: '🫧', req: 5, prog: 3, rewardCoin: 2500, rewardText: '2,500 Coins', colorTheme: 'cyan' },
    { id: 'lucky_spinner', title: 'Lucky Spinner', desc: 'Spin the Lucky Wheel 10 times', icon: '🎡', req: 10, prog: 7, rewardCoin: 1500, rewardText: '15 Diamonds', colorTheme: 'purple' },
    { id: 'puzzle_genius', title: 'Puzzle Genius', desc: 'Score 5,000+ points in Jewel Puzzle', icon: '🧩', req: 5000, prog: 4200, rewardCoin: 3000, rewardText: '3,000 Coins', colorTheme: 'emerald' },
    { id: 'arcade_veteran', title: 'Arcade Veteran', desc: 'Play 50 total matches', icon: '🕹️', req: 50, prog: Math.min(50, stats.gamesPlayed), rewardCoin: 5000, rewardText: '5,000 Coins', colorTheme: 'amber' },
    { id: 'coin_collector', title: 'Coin Collector', desc: 'Accumulate 100,000 total coins', icon: '🪙', req: 100000, prog: Math.min(100000, profile.coins + stats.totalWon), rewardCoin: 10000, rewardText: '100 Diamonds', colorTheme: 'gold' },
    { id: 'diamond_hunter', title: 'Diamond Hunter', desc: 'Collect 500 total diamonds', icon: '💎', req: 500, prog: Math.min(500, profile.diamonds), rewardCoin: 5000, rewardText: 'Rare Frame', colorTheme: 'blue' },
    { id: 'top_100', title: 'Top 100 Leader', desc: 'Reach top 100 on Global Leaderboard', icon: '🏆', req: 1, prog: 1, rewardCoin: 2500, rewardText: 'Crown Badge', colorTheme: 'rose' },
    { id: 'streak_7', title: 'Daily Streak 7 Days', desc: 'Log in and play 7 consecutive days', icon: '🔥', req: 7, prog: 5, rewardCoin: 3500, rewardText: 'Golden Ticket', colorTheme: 'amber' },
  ];

  const handleClaimAchievement = (ach: typeof ALL_ACHIEVEMENTS[0]) => {
    const isComplete = ach.prog >= ach.req;
    const isClaimed = claimedAchievements.includes(ach.id);

    if (isClaimed) {
      synth.playClick();
      setToastMsg('Reward already claimed!');
      setTimeout(() => setToastMsg(''), 2500);
      return;
    }

    if (!isComplete) {
      // Incomplete achievement notice popup!
      synth.playError();
      setIncompleteModal({
        title: ach.title,
        req: ach.req,
        prog: ach.prog
      });
      return;
    }

    // Complete & Claimable!
    synth.playCoin();
    onUpdateWallet(ach.rewardCoin, 'coins', 'reward', `Achievement: ${ach.title}`);
    const updated = [...claimedAchievements, ach.id];
    saveClaimedAchievements(updated);
    setToastMsg(`🎉 Claimed Reward for ${ach.title}!`);
    setTimeout(() => setToastMsg(''), 3000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6 max-w-7xl mx-auto"
    >
      {/* Profile Header Hero */}
      <div className="bg-gradient-to-br from-red-950/90 via-zinc-950 to-amber-950/90 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10 relative overflow-hidden group">
        
        {/* Glowing Background Radial Accents */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 relative z-10">
          
          {/* Avatar Display */}
          <div className="relative group shrink-0">
            {profile.portraitAvatar ? (
              <PortraitAvatarView portraitId={profile.portraitAvatar} size="xl" />
            ) : (
              <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 border-2 border-amber-400 text-5xl sm:text-6xl flex items-center justify-center shadow-2xl shadow-amber-500/20 group-hover:scale-105 transition-transform duration-300">
                <span className="animate-[bounce_3s_ease-in-out_infinite]">{profile.avatar}</span>
              </div>
            )}
            <button
              onClick={() => {
                synth.playClick();
                setActiveTab('avatars');
              }}
              className="absolute -bottom-2 -right-2 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-black p-2.5 rounded-2xl text-xs font-black shadow-xl hover:scale-110 active:scale-95 transition"
              title="Edit Avatar"
            >
              <Edit3 className="h-4 w-4" />
            </button>
          </div>

          {/* User Details */}
          <div className="flex-1 text-center sm:text-left space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center sm:justify-start gap-2.5">
                  {profile.username}
                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-xs font-black uppercase tracking-wider shadow-lg shadow-amber-500/10">
                    Level {profile.level}
                  </span>
                </h2>
                <p className="text-xs sm:text-sm text-gray-300 mt-1 font-medium">{profile.bio}</p>
              </div>

              <button
                onClick={() => {
                  synth.playClick();
                  setActiveTab(activeTab === 'edit' ? 'overview' : 'edit');
                }}
                className="px-5 py-2.5 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 text-amber-400 border border-amber-500/40 text-xs font-black uppercase tracking-wider transition self-center sm:self-start flex items-center gap-2 hover:scale-105 active:scale-95 shadow-xl"
              >
                <Edit3 className="h-4 w-4" />
                Edit Profile
              </button>
            </div>

            {/* Tags row */}
            <div className="flex flex-wrap gap-2 justify-center sm:justify-start pt-1 text-xs font-bold text-gray-200">
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 shadow-md flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-amber-400" />
                {profile.country || 'United States 🇺🇸'}
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 shadow-md">
                Gender: <span className="text-amber-300">{profile.gender || 'Prefer not to say'}</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 shadow-md flex items-center gap-1.5">
                <Gamepad2 className="h-3.5 w-3.5 text-amber-400" />
                Fav: <span className="text-amber-300">{profile.favoriteGame || 'Sky Flight'}</span>
              </span>
              <span className="px-3 py-1.5 rounded-xl bg-zinc-900/90 border border-amber-500/20 shadow-md flex items-center gap-1.5 text-gray-400">
                <Clock className="h-3.5 w-3.5 text-amber-400" />
                Joined {profile.joinedAt}
              </span>
            </div>

            {/* XP Progress Bar */}
            <div className="space-y-1.5 pt-2">
              <div className="flex justify-between text-xs font-black text-gray-300">
                <span className="uppercase tracking-wider text-amber-400">XP Progress</span>
                <span className="font-mono text-amber-300">{profile.xp} / {profile.xpNeeded} XP</span>
              </div>
              <div className="w-full h-3 bg-zinc-950 rounded-full overflow-hidden border border-amber-500/30 p-0.5 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-yellow-400 rounded-full transition-all duration-500 shadow-md" 
                  style={{ width: `${Math.min(100, (profile.xp / profile.xpNeeded) * 100)}%` }} 
                />
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Navigation Subtabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'overview', label: '📊 Overview & Stats' },
          { id: 'avatars', label: '🎨 Avatar Collection' },
          { id: 'achievements', label: '🏆 Achievements' },
          { id: 'missions', label: '🎯 Objectives' },
          { id: 'edit', label: '⚙️ Settings & Edit' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => {
              synth.playClick();
              setActiveTab(tab.id as any);
            }}
            className={`px-4 py-2.5 rounded-2xl text-xs font-black uppercase tracking-wider transition-all shrink-0 border ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-amber-400 shadow-lg shadow-red-600/20 scale-105'
                : 'bg-zinc-900/80 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panels */}
      <AnimatePresence mode="wait">
        
        {/* OVERVIEW PANEL */}
        {activeTab === 'overview' && (
          <motion.div key="overview_panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-6">
            
            {/* Balance & Stat Cards - Upgraded with Animated Count Popups */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
              
              {/* Coins Card */}
              <div 
                onClick={() => handleOpenStatPopup('coins', 'Coins Balance', profile.coins, '🪙', 'gold')}
                className="bg-gradient-to-br from-amber-500/25 via-yellow-950/80 to-zinc-950 border border-amber-400/50 shadow-xl shadow-amber-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer rounded-2xl p-4 space-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-amber-300 uppercase tracking-wider">Coins Balance</span>
                  <Coins className="h-4 w-4 text-amber-400 group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-amber-400 font-mono tracking-tight">{profile.coins.toLocaleString()} 🪙</div>
                <p className="text-[9px] text-amber-300/70 font-semibold">Tap for glowing overview</p>
              </div>

              {/* Diamonds Card */}
              <div 
                onClick={() => handleOpenStatPopup('diamonds', 'Diamonds Balance', profile.diamonds, '💎', 'blue')}
                className="bg-gradient-to-br from-blue-600/25 via-cyan-950/80 to-zinc-950 border border-blue-400/50 shadow-xl shadow-blue-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer rounded-2xl p-4 space-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-blue-300 uppercase tracking-wider">Diamonds</span>
                  <Gem className="h-4 w-4 text-blue-400 group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-purple-300 font-mono tracking-tight">{profile.diamonds.toLocaleString()} 💎</div>
                <p className="text-[9px] text-blue-300/70 font-semibold">Tap for glowing overview</p>
              </div>

              {/* Games Played Card */}
              <div 
                onClick={() => handleOpenStatPopup('games', 'Games Played', stats.gamesPlayed, 'Matches', 'purple')}
                className="bg-gradient-to-br from-purple-600/25 via-indigo-950/80 to-zinc-950 border border-purple-400/50 shadow-xl shadow-purple-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer rounded-2xl p-4 space-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-purple-300 uppercase tracking-wider">Games Played</span>
                  <Gamepad2 className="h-4 w-4 text-purple-400 group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-white font-mono tracking-tight">{stats.gamesPlayed}</div>
                <p className="text-[9px] text-purple-300/70 font-semibold">Tap for glowing overview</p>
              </div>

              {/* Total Winnings Card */}
              <div 
                onClick={() => handleOpenStatPopup('winnings', 'Total Winnings', stats.totalWon, '🪙', 'emerald')}
                className="bg-gradient-to-br from-emerald-600/25 via-teal-950/80 to-zinc-950 border border-emerald-400/50 shadow-xl shadow-emerald-500/20 hover:scale-[1.03] active:scale-95 transition-all cursor-pointer rounded-2xl p-4 space-y-1 relative overflow-hidden group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black text-emerald-300 uppercase tracking-wider">Total Winnings</span>
                  <Trophy className="h-4 w-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                </div>
                <div className="text-xl sm:text-2xl font-black text-emerald-400 font-mono tracking-tight">{stats.totalWon.toLocaleString()} 🪙</div>
                <p className="text-[9px] text-emerald-300/70 font-semibold">Tap for glowing overview</p>
              </div>

            </div>

            {/* Player Information Breakdown */}
            <div className="bg-zinc-950 p-5 rounded-3xl border border-white/10 space-y-4 shadow-xl">
              <h3 className="text-xs font-black uppercase tracking-wider text-amber-400 flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Player Information
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                
                {/* 1. Country */}
                <div 
                  onClick={() => handleOpenInfoPopup('country', 'Country', profile.country || 'United States 🇺🇸')}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-amber-400/40 hover:bg-zinc-900 hover:scale-[1.02] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Country</span>
                  <span className="text-white font-black truncate block">{profile.country || 'United States 🇺🇸'}</span>
                </div>

                {/* 2. Gender */}
                <div 
                  onClick={() => handleOpenInfoPopup('gender', 'Gender', profile.gender || 'Prefer not to say')}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-amber-400/40 hover:bg-zinc-900 hover:scale-[1.02] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Gender</span>
                  <span className="text-white font-black truncate block">{profile.gender || 'Prefer not to say'}</span>
                </div>

                {/* 3. Age */}
                <div 
                  onClick={() => handleOpenInfoPopup('age', 'Age', `${profile.age || 24} Years Old`)}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-amber-400/40 hover:bg-zinc-900 hover:scale-[1.02] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Age</span>
                  <span className="text-white font-black truncate block">{profile.age || 24} Years Old</span>
                </div>

                {/* 4. Favorite Game */}
                <div 
                  onClick={handleOpenFavGamePopup}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-amber-400/40 hover:bg-zinc-900 hover:scale-[1.02] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Favorite Game</span>
                  <span className="text-amber-400 font-black truncate block">{profile.favoriteGame || 'Sky Flight'}</span>
                </div>

                {/* 5. Language */}
                <div 
                  onClick={() => handleOpenInfoPopup('language', 'Language', profile.language || 'English')}
                  className="bg-zinc-900/80 p-3.5 rounded-2xl border border-white/5 hover:border-amber-400/40 hover:bg-zinc-900 hover:scale-[1.02] cursor-pointer transition-all space-y-1"
                >
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">Language</span>
                  <span className="text-white font-black truncate block">{profile.language || 'English'}</span>
                </div>

              </div>
            </div>

          </motion.div>
        )}

        {/* AVATAR COLLECTION PANEL */}
        {activeTab === 'avatars' && (
          <motion.div key="avatars_panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-8">
            
            {/* 1. 12 Premium Semi-Realistic Gaming Characters */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                    <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
                    12 Premium Gaming Characters (6 Male / 6 Female)
                  </h3>
                  <p className="text-xs text-gray-300 font-medium">AAA mobile game profile character cards with unique animated backgrounds & glowing frames</p>
                </div>
                <div className="flex gap-2 text-[10px] font-black uppercase text-gray-400">
                  <span className="px-2.5 py-1 rounded-full bg-blue-950/80 border border-blue-400/40 text-blue-300">6 Male</span>
                  <span className="px-2.5 py-1 rounded-full bg-rose-950/80 border border-rose-400/40 text-rose-300">6 Female</span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {PORTRAIT_AVATARS.map((portrait) => {
                  const isSelected = profile.portraitAvatar === portrait.id;
                  return (
                    <motion.div
                      key={portrait.id}
                      whileHover={{ scale: 1.03, y: -4 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => handleSelectPortrait(portrait.id)}
                      className={`relative p-4 rounded-3xl border-2 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md flex flex-col justify-between gap-3 group ${
                        isSelected 
                          ? 'bg-gradient-to-br from-amber-500/30 via-zinc-950 to-zinc-950 border-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.5)] scale-[1.02]' 
                          : 'bg-zinc-950/90 border-white/10 hover:border-amber-400/50 hover:shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      {/* Shine Sweep Animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                      {/* Header Row: Gender & Background Tag */}
                      <div className="flex items-center justify-between text-xs relative z-10">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase border ${
                          portrait.gender === 'male'
                            ? 'bg-blue-950/80 border-blue-400/40 text-blue-300'
                            : 'bg-rose-950/80 border-rose-400/40 text-rose-300'
                        }`}>
                          {portrait.gender === 'male' ? 'Male ♂' : 'Female ♀'}
                        </span>

                        <span className="text-[10px] font-bold text-amber-300/80 bg-zinc-900/80 px-2 py-0.5 rounded-lg border border-amber-400/20">
                          {portrait.bgName}
                        </span>
                      </div>

                      {/* Center Portrait Avatar with Glowing Frame */}
                      <div className="flex justify-center my-1 relative z-10">
                        <PortraitAvatarView portraitId={portrait.id} size="xl" showBadge={false} />
                      </div>

                      {/* Character Details */}
                      <div className="text-center relative z-10 space-y-1">
                        <h4 className="text-sm font-black text-white tracking-wide flex items-center justify-center gap-1.5">
                          {portrait.name}
                          <span className="text-amber-400 text-xs">{portrait.badge}</span>
                        </h4>
                        <p className="text-[11px] font-bold text-amber-300/90 line-clamp-1">{portrait.subtitle}</p>
                        <div className="text-[9px] font-mono text-gray-400 pt-0.5">
                          Frame: <span className="text-gray-200 font-bold">{portrait.frameName}</span>
                        </div>
                      </div>

                      {/* Equip Button & Equipped State Badge */}
                      <button className={`w-full py-2 rounded-2xl text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 relative z-10 ${
                        isSelected 
                          ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black shadow-lg shadow-amber-400/40 font-black' 
                          : 'bg-zinc-900 text-amber-400 border border-amber-500/30 hover:bg-amber-500/20 hover:text-white'
                      }`}>
                        {isSelected ? (
                          <>
                            <CheckCircle2 className="h-4 w-4 text-black" />
                            Equipped ✓
                          </>
                        ) : (
                          'Equip Character'
                        )}
                      </button>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* 2. Premium Gaming Emoji Collection (20 Luxurious Emojis) */}
            <div className="space-y-4 pt-6 border-t border-white/10">
              <div>
                <h3 className="text-sm sm:text-base font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Trophy className="h-4 w-4 text-amber-400" />
                  Premium Gaming Emoji Collection (20 Luxurious Emojis)
                </h3>
                <p className="text-xs text-gray-300 font-medium">Equipped with 24K gold glowing frames, aura rings and floating animations</p>
              </div>

              <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-10 gap-3">
                {PREMIUM_EMOJIS.map((emoji) => {
                  const isSelected = profile.avatar === emoji && !profile.portraitAvatar;
                  return (
                    <motion.button
                      key={emoji}
                      whileHover={{ scale: 1.15, rotate: 3 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleSelectEmoji(emoji)}
                      className={`h-16 rounded-2xl text-2xl flex items-center justify-center border-2 transition-all duration-300 group relative ${
                        isSelected
                          ? 'border-amber-300 bg-gradient-to-b from-amber-500/40 via-amber-950 to-zinc-950 shadow-[0_0_25px_rgba(251,191,36,0.8)] scale-110 z-10'
                          : 'border-amber-500/40 bg-zinc-950/90 hover:border-amber-400/80 hover:bg-amber-500/20 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                      }`}
                    >
                      <span className="animate-[bounce_3s_ease-in-out_infinite] group-hover:scale-125 transition-transform">{emoji}</span>
                      {isSelected && (
                        <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400 border border-black text-[9px] flex items-center justify-center text-black font-black shadow-md">
                          ✓
                        </div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

          </motion.div>
        )}

        {/* ACHIEVEMENTS PANEL */}
        {activeTab === 'achievements' && (
          <motion.div key="achievements_panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {ALL_ACHIEVEMENTS.map((ach) => {
                const isComplete = ach.prog >= ach.req;
                const isClaimed = claimedAchievements.includes(ach.id);

                return (
                  <div 
                    key={ach.id} 
                    className={`p-4 rounded-3xl border transition-all duration-300 relative overflow-hidden group backdrop-blur-md shadow-xl ${
                      isClaimed 
                        ? 'bg-zinc-950/80 border-white/10 opacity-80' 
                        : isComplete 
                          ? 'bg-gradient-to-br from-amber-500/20 via-zinc-950 to-zinc-950 border-2 border-amber-400 shadow-amber-500/20' 
                          : 'bg-zinc-950/90 border-white/10 hover:border-white/20'
                    }`}
                  >
                    {/* Animated Shine Light Streak */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 pointer-events-none" />

                    <div className="flex items-start justify-between gap-3 relative z-10">
                      
                      <div className="flex items-start gap-3 flex-1 min-w-0">
                        {/* Glowing Icon Badge */}
                        <div className={`w-12 h-12 rounded-2xl text-2xl flex items-center justify-center shrink-0 border-2 shadow-lg ${
                          isComplete 
                            ? 'bg-amber-500/20 border-amber-400 shadow-amber-500/30 text-amber-300 animate-pulse' 
                            : 'bg-zinc-900 border-white/10 text-gray-400'
                        }`}>
                          {ach.icon}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1.5">
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-white truncate">{ach.title}</h4>
                            {isClaimed && (
                              <span className="px-2 py-0.5 rounded bg-emerald-500/20 border border-emerald-400/40 text-emerald-400 text-[9px] font-black uppercase">
                                Claimed ✓
                              </span>
                            )}
                          </div>
                          
                          <p className="text-[11px] text-gray-300 line-clamp-1 font-medium">{ach.desc}</p>
                          
                          {/* Animated Progress Bar */}
                          <div className="space-y-1 pt-1">
                            <div className="flex justify-between text-[10px] font-bold font-mono">
                              <span className="text-gray-400">Progress</span>
                              <span className={isComplete ? 'text-amber-400 font-black' : 'text-gray-400'}>
                                {ach.prog.toLocaleString()} / {ach.req.toLocaleString()}
                              </span>
                            </div>
                            <div className="w-full h-2 bg-zinc-900 rounded-full overflow-hidden border border-white/10 p-0.5">
                              <div 
                                className={`h-full rounded-full transition-all duration-700 shadow ${
                                  isComplete ? 'bg-gradient-to-r from-amber-400 to-yellow-500 shadow-amber-400/50' : 'bg-amber-600/60'
                                }`} 
                                style={{ width: `${Math.min(100, (ach.prog / ach.req) * 100)}%` }} 
                              />
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Claim Button */}
                      <button
                        onClick={() => handleClaimAchievement(ach)}
                        disabled={isClaimed}
                        className={`px-3.5 py-2 rounded-2xl text-xs font-black uppercase tracking-wider shrink-0 transition-all duration-200 ${
                          isClaimed
                            ? 'bg-zinc-900 text-gray-500 border border-white/5 cursor-not-allowed'
                            : isComplete
                              ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border border-amber-300 shadow-lg shadow-amber-400/30 hover:scale-105 active:scale-95'
                              : 'bg-zinc-900 text-amber-400 border border-amber-500/30 hover:bg-zinc-800 hover:scale-105 active:scale-95'
                        }`}
                      >
                        {isClaimed ? 'Claimed ✓' : isComplete ? `Claim ${ach.rewardText}` : `Claim ${ach.rewardText}`}
                      </button>

                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        )}

        {/* OBJECTIVES PANEL */}
        {activeTab === 'missions' && (
          <motion.div key="missions_panel" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="space-y-4">
            <div className="bg-gradient-to-b from-zinc-950 via-zinc-950 to-zinc-900 p-6 rounded-3xl border border-amber-500/30 space-y-4 shadow-2xl">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider flex items-center gap-2">
                  <Zap className="h-4 w-4 text-amber-400 animate-pulse" /> Daily Objectives & Quests
                </h3>
                <span className="text-[10px] font-black uppercase text-gray-400 bg-zinc-900 px-3 py-1 rounded-full border border-white/10">
                  Resets in 14h
                </span>
              </div>

              <div className="space-y-3">
                {missions.map((m) => {
                  const percent = Math.min(100, (m.progress / m.maxProgress) * 100);

                  return (
                    <div 
                      key={m.id} 
                      className={`p-4 rounded-2xl border transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        m.completed 
                          ? 'bg-emerald-950/20 border-emerald-500/40 shadow-lg' 
                          : 'bg-zinc-900/80 border-white/10 hover:border-amber-400/40'
                      }`}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0 border ${
                          m.completed ? 'bg-emerald-500/20 border-emerald-400 text-emerald-400' : 'bg-zinc-800 border-white/10 text-amber-400'
                        }`}>
                          {m.completed ? <CheckCircle2 className="h-5 w-5" /> : <Zap className="h-5 w-5" />}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                          <span className="text-xs font-black text-white block">{m.description}</span>
                          <div className="w-full h-2 bg-zinc-950 rounded-full overflow-hidden border border-white/5">
                            <div 
                              className={`h-full rounded-full transition-all duration-500 ${
                                m.completed ? 'bg-emerald-400' : 'bg-amber-400'
                              }`} 
                              style={{ width: `${percent}%` }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center justify-between sm:justify-end gap-3 text-xs font-mono font-bold shrink-0">
                        <span className="text-gray-400">
                          {m.progress}/{m.maxProgress}
                        </span>
                        <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${
                          m.completed ? 'bg-emerald-400 text-black' : 'bg-amber-500/20 border border-amber-400/40 text-amber-300'
                        }`}>
                          {m.completed ? 'Completed ✓' : `+${m.rewardAmount} ${m.rewardType}`}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}

        {/* EDIT SETTINGS PANEL */}
        {activeTab === 'edit' && (
          <motion.div 
            key="edit_panel" 
            initial={{ opacity: 0, scale: 0.98 }} 
            animate={{ opacity: 1, scale: 1 }} 
            exit={{ opacity: 0, scale: 0.98 }} 
            className="bg-gradient-to-br from-red-950/40 via-zinc-950 to-amber-950/40 p-6 sm:p-8 rounded-3xl border-2 border-amber-500/40 space-y-5 max-w-xl mx-auto shadow-2xl relative overflow-hidden backdrop-blur-xl"
          >
            {/* Ambient Moving Particles Background Effect */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none animate-pulse" />
            <div className="absolute bottom-0 left-0 w-48 h-48 bg-red-600/10 rounded-full blur-3xl pointer-events-none animate-pulse" />

            <div className="relative z-10 space-y-4">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-widest flex items-center gap-2">
                <Shield className="h-4 w-4" /> Edit Profile & Settings
              </h3>

              <div className="space-y-3.5 text-xs">
                <div>
                  <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Username</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-white outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400 font-bold transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Country</label>
                  <select
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-white outline-none focus:border-amber-400 font-bold transition shadow-inner"
                  >
                    {COUNTRY_OPTIONS.map((c) => (
                      <option key={c} value={c} className="bg-zinc-950 text-white">{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Gender</label>
                  <div className="flex gap-2">
                    {(['Male', 'Female', 'Prefer not to say'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`flex-1 py-2.5 rounded-2xl font-black text-xs border transition-all ${
                          gender === g 
                            ? 'bg-gradient-to-r from-amber-400 to-yellow-500 text-black border-amber-300 shadow-lg shadow-amber-400/20' 
                            : 'bg-zinc-900/90 text-gray-400 border-white/10 hover:border-white/20'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Favorite Game</label>
                    <select
                      value={favoriteGame}
                      onChange={(e) => setFavoriteGame(e.target.value)}
                      className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-3 py-2.5 text-white outline-none focus:border-amber-400 font-bold transition shadow-inner"
                    >
                      {GAMES_LIST.map((g) => (
                        <option key={g.id} value={g.title} className="bg-zinc-950 text-white">{g.title}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Age</label>
                    <input
                      type="number"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                      className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-white outline-none focus:border-amber-400 font-bold transition shadow-inner"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Bio</label>
                  <textarea
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    rows={2}
                    className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-white outline-none focus:border-amber-400 font-bold transition shadow-inner"
                  />
                </div>

                <div>
                  <label className="block text-gray-300 font-bold mb-1 uppercase tracking-wider text-[10px]">Language</label>
                  <select
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full bg-zinc-900/90 border border-amber-500/30 rounded-2xl px-4 py-2.5 text-white outline-none focus:border-amber-400 font-bold transition shadow-inner"
                  >
                    {LANGUAGE_OPTIONS.map((l) => (
                      <option key={l} value={l} className="bg-zinc-950 text-white">{l}</option>
                    ))}
                  </select>
                </div>

                <button
                  onClick={handleSaveProfile}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 text-black font-black uppercase tracking-wider hover:scale-[1.02] active:scale-95 transition shadow-2xl shadow-amber-400/30 mt-2"
                >
                  Save Profile Updates
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>

      {/* Premium Statistics Fullscreen / Modal Popup */}
      <AnimatePresence>
        {activePopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setActivePopup(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`relative w-full max-w-sm rounded-3xl p-6 text-center text-white shadow-2xl overflow-hidden border-2 ${
                activePopup.colorTheme === 'gold' ? 'bg-gradient-to-b from-amber-950 via-zinc-950 to-zinc-950 border-amber-400 shadow-amber-500/30' :
                activePopup.colorTheme === 'blue' ? 'bg-gradient-to-b from-blue-950 via-zinc-950 to-zinc-950 border-blue-400 shadow-blue-500/30' :
                activePopup.colorTheme === 'purple' ? 'bg-gradient-to-b from-purple-950 via-zinc-950 to-zinc-950 border-purple-400 shadow-purple-500/30' :
                activePopup.colorTheme === 'emerald' ? 'bg-gradient-to-b from-emerald-950 via-zinc-950 to-zinc-950 border-emerald-400 shadow-emerald-500/30' :
                'bg-gradient-to-b from-amber-950/80 via-zinc-950 to-zinc-950 border-amber-500/50 shadow-amber-500/20'
              }`}
            >
              {/* Close Button */}
              <button
                onClick={() => setActivePopup(null)}
                className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 p-2 rounded-full text-gray-300 transition"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Popup Title */}
              <h3 className="text-xs font-black uppercase tracking-widest text-amber-300 mb-4 flex items-center justify-center gap-2">
                <Sparkles className="h-3.5 w-3.5 animate-spin" />
                {activePopup.title}
              </h3>

              {/* Favorite Game Custom Popup */}
              {activePopup.type === 'favGame' && activePopup.gameData ? (
                <div className="space-y-4">
                  <div className="relative rounded-2xl overflow-hidden border-2 border-amber-400 shadow-2xl group">
                    <img
                      src={activePopup.gameData.thumbnail}
                      alt={activePopup.gameData.title}
                      loading="lazy"
                      decoding="async"
                      referrerPolicy="no-referrer"
                      className="w-full h-40 object-cover group-hover:scale-105 transition-transform duration-500 transform-gpu"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-3 left-3 text-left">
                      <span className="px-2 py-0.5 rounded bg-amber-400 text-black text-[9px] font-black uppercase">
                        {activePopup.gameData.category}
                      </span>
                      <h4 className="text-lg font-black text-white mt-1">{activePopup.gameData.title}</h4>
                    </div>
                  </div>
                  <p className="text-xs text-gray-300 line-clamp-2 font-medium">{activePopup.gameData.description}</p>
                </div>
              ) : activePopup.targetValue > 0 ? (
                /* Animated Number Counting Display */
                <div className="my-6 relative flex items-center justify-center">
                  {/* Outer Rotating Glowing Light Ring */}
                  <div className={`w-36 h-36 rounded-full border-4 border-dashed animate-[spin_8s_linear_infinite] ${
                    activePopup.colorTheme === 'gold' ? 'border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.4)]' :
                    activePopup.colorTheme === 'blue' ? 'border-blue-400/60 shadow-[0_0_25px_rgba(96,165,250,0.4)]' :
                    activePopup.colorTheme === 'purple' ? 'border-purple-400/60 shadow-[0_0_25px_rgba(192,132,252,0.4)]' :
                    activePopup.colorTheme === 'emerald' ? 'border-emerald-400/60 shadow-[0_0_25px_rgba(52,211,153,0.4)]' :
                    'border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.3)]'
                  }`} />

                  {/* Inner Content Badge */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-2">
                    <div className="text-2xl font-black text-white font-mono tracking-tight px-2">
                      {animatedCount.toLocaleString()} {activePopup.displaySuffix}
                    </div>
                  </div>
                </div>
              ) : (
                /* Static Text Display */
                <div className="my-6 relative flex items-center justify-center">
                  <div className="w-36 h-36 rounded-full border-4 border-amber-400/60 flex items-center justify-center shadow-[0_0_25px_rgba(251,191,36,0.3)]">
                    <div className="text-base font-black text-white px-2">
                      {activePopup.rawTextValue}
                    </div>
                  </div>
                </div>
              )}

              {/* Auto-close notice */}
              <p className="text-[10px] text-gray-400 font-bold uppercase mt-2">
                Closing automatically...
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incomplete Achievement Alert Modal */}
      <AnimatePresence>
        {incompleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setIncompleteModal(null)}
          >
            <motion.div
              initial={{ scale: 0.8, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-sm rounded-3xl p-6 text-center text-white bg-zinc-950 border-2 border-amber-400 shadow-2xl shadow-amber-500/30"
            >
              <div className="w-14 h-14 rounded-full bg-amber-500/20 border-2 border-amber-400 text-amber-400 flex items-center justify-center mx-auto mb-3">
                <AlertTriangle className="h-7 w-7" />
              </div>

              <h3 className="text-base font-black uppercase text-amber-300 tracking-tight">
                Mission Incomplete
              </h3>

              <p className="text-xs text-gray-300 mt-2 font-medium">
                Complete this mission first before claiming your reward.
              </p>

              <div className="my-4 bg-zinc-900 p-3 rounded-2xl border border-white/10 text-xs font-mono font-bold">
                Progress: <span className="text-amber-400">{incompleteModal.prog.toLocaleString()} / {incompleteModal.req.toLocaleString()}</span>
              </div>

              <button
                onClick={() => setIncompleteModal(null)}
                className="w-full py-2.5 rounded-xl bg-amber-400 text-black font-black uppercase tracking-wider hover:bg-amber-300 transition"
              >
                Got It
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 z-50 bg-zinc-950 border border-amber-400 px-5 py-3 rounded-2xl text-amber-400 text-xs font-black uppercase shadow-2xl backdrop-blur flex items-center gap-2">
          <Sparkles className="h-4 w-4 animate-spin" />
          {toastMsg}
        </div>
      )}
    </motion.div>
  );
}
