/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { Trophy, Globe, Flag, Users, Calendar, RefreshCw } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';
import { generateLeaderboardCategory, LeaderboardPlayer } from '../utils/leaderboardGenerator';
import PortraitAvatarView from './PortraitAvatarView';

interface Props {
  profile: UserProfile;
  totalWon: number;
}

export default function RankPage({ profile, totalWon }: Props) {
  const [activeTab, setActiveTab] = useState<'global' | 'country' | 'weekly' | 'monthly' | 'friends'>('global');
  const [hourSeed, setHourSeed] = useState<number>(() => Math.floor(Date.now() / (1000 * 60 * 60)));
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Hourly auto-refresh checker
  useEffect(() => {
    const checkHour = () => {
      const currentHourSeed = Math.floor(Date.now() / (1000 * 60 * 60));
      if (currentHourSeed !== hourSeed) {
        setIsRefreshing(true);
        setTimeout(() => {
          setHourSeed(currentHourSeed);
          setIsRefreshing(false);
        }, 300);
      }
    };

    const interval = setInterval(checkHour, 10000); // Check every 10s
    return () => clearInterval(interval);
  }, [hourSeed]);

  // Manual refresh trigger
  const handleManualRefresh = () => {
    synth.playClick();
    setIsRefreshing(true);
    setTimeout(() => {
      setHourSeed(Date.now()); // forces immediate shuffle
      setIsRefreshing(false);
    }, 400);
  };

  const players: LeaderboardPlayer[] = generateLeaderboardCategory(activeTab, profile, totalWon, hourSeed);
  const top3 = players.slice(0, 3);
  const otherPlayers = players.slice(3);

  const userRankIndex = players.findIndex(p => p.isUser || p.username === profile.username);

  const renderPlayerAvatar = (player: LeaderboardPlayer, size: 'sm' | 'md' | 'lg' = 'md') => {
    if (player.portraitAvatar) {
      return <PortraitAvatarView portraitId={player.portraitAvatar} size={size === 'lg' ? 'lg' : size === 'md' ? 'md' : 'sm'} showBadge={false} />;
    }
    return (
      <div className={`relative flex items-center justify-center rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 shadow-[0_0_15px_rgba(245,158,11,0.3)] hover:scale-105 transition-transform ${
        size === 'lg' ? 'w-16 h-16 text-3xl' : size === 'md' ? 'w-10 h-10 text-xl' : 'w-8 h-8 text-base'
      }`}>
        <span className="animate-[bounce_3s_ease-in-out_infinite]">{player.avatar}</span>
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Leaderboard Header */}
      <div className="bg-gradient-to-r from-amber-950 via-zinc-950 to-zinc-950 p-6 rounded-3xl border border-amber-500/30 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black uppercase tracking-widest">
            <Trophy className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
            Nova Hall of Fame
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Global Player Leaderboards</h2>
          <p className="text-xs text-gray-400">
            Automatically refreshed hourly • {activeTab === 'global' ? 'Top 50 Global Champions' : 'Top 20 Players'}
          </p>
        </div>

        {/* Current User Summary & Refresh Button */}
        <div className="flex items-center gap-3 shrink-0 relative z-10">
          <button
            onClick={handleManualRefresh}
            className="p-3 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-amber-500/30 text-amber-400 hover:scale-105 active:scale-95 transition shadow-lg flex items-center gap-2"
            title="Refresh Leaderboard"
          >
            <RefreshCw className={`h-4 w-4 ${isRefreshing ? 'animate-spin text-amber-300' : ''}`} />
            <span className="text-xs font-black uppercase hidden sm:inline">Refresh</span>
          </button>

          <div className="bg-zinc-900/90 border border-amber-500/30 p-3.5 rounded-2xl flex items-center gap-3 shrink-0">
            {profile.portraitAvatar ? (
              <PortraitAvatarView portraitId={profile.portraitAvatar} size="sm" showBadge={false} />
            ) : (
              <div className="w-9 h-9 rounded-full bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 text-xl flex items-center justify-center border-2 border-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)]">
                {profile.avatar}
              </div>
            )}
            <div>
              <div className="text-xs font-black text-white">{profile.username}</div>
              <div className="text-[10px] font-bold text-amber-400 uppercase">
                Rank #{userRankIndex >= 0 ? userRankIndex + 1 : '15'} • Lvl {profile.level}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-white/10 pb-3 overflow-x-auto scrollbar-none">
        {[
          { id: 'global', label: '🌐 Global (50)', icon: Globe },
          { id: 'country', label: '🚩 Country (20)', icon: Flag },
          { id: 'weekly', label: '⚡ Weekly (20)', icon: Calendar },
          { id: 'monthly', label: '👑 Monthly (20)', icon: Trophy },
          { id: 'friends', label: '👥 Friends (20)', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                synth.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wider transition-all flex items-center gap-2 shrink-0 border ${
                active
                  ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-black border-amber-400 shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-zinc-900/80 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Animated Content Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab + '_' + hourSeed}
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* Top 3 Animated Podium */}
          {top3.length >= 3 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 pt-4 pb-2 items-end">
              {/* 2nd Place Silver */}
              <div className={`p-3 sm:p-4 rounded-3xl text-center space-y-2 relative shadow-xl border transition ${top3[1]?.isUser ? 'bg-amber-950/80 border-amber-400' : 'bg-zinc-950 border-zinc-700'}`}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-zinc-300 text-black font-black text-xs flex items-center justify-center border-2 border-white shadow-lg">
                  2
                </div>
                <div className="flex justify-center mt-2">
                  {renderPlayerAvatar(top3[1], 'md')}
                </div>
                <div>
                  <div className="text-xs font-black text-white truncate">{top3[1]?.username}</div>
                  <div className="text-[10px] text-gray-400 truncate">{top3[1]?.countryFlag} {top3[1]?.countryName}</div>
                </div>
                <div className="text-xs font-black text-zinc-300 font-mono">{top3[1]?.score.toLocaleString()} 🪙</div>
                <span className="inline-block text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
                  🥈 Silver
                </span>
              </div>

              {/* 1st Place Gold Champion */}
              <div className={`p-4 sm:p-5 rounded-3xl text-center space-y-2 relative shadow-2xl scale-105 border-2 transition ${top3[0]?.isUser ? 'bg-amber-900/90 border-amber-300' : 'bg-gradient-to-b from-amber-500/20 via-zinc-950 to-zinc-950 border-amber-400'}`}>
                <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-2xl sm:text-3xl animate-bounce">
                  👑
                </div>
                <div className="flex justify-center mt-3">
                  {renderPlayerAvatar(top3[0], 'lg')}
                </div>
                <div>
                  <div className="text-xs sm:text-sm font-black text-amber-400 truncate">{top3[0]?.username}</div>
                  <div className="text-[10px] text-amber-200/80 truncate">{top3[0]?.countryFlag} {top3[0]?.countryName}</div>
                </div>
                <div className="text-xs sm:text-sm font-black text-amber-300 font-mono">{top3[0]?.score.toLocaleString()} 🪙</div>
                <span className="inline-block text-[8px] sm:text-[9px] font-black uppercase px-2.5 py-0.5 rounded-full bg-amber-500 text-black shadow">
                  🥇 Legend
                </span>
              </div>

              {/* 3rd Place Bronze */}
              <div className={`p-3 sm:p-4 rounded-3xl text-center space-y-2 relative shadow-xl border transition ${top3[2]?.isUser ? 'bg-amber-950/80 border-amber-400' : 'bg-zinc-950 border-amber-800/60'}`}>
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-amber-800 text-amber-200 font-black text-xs flex items-center justify-center border-2 border-amber-600 shadow-lg">
                  3
                </div>
                <div className="flex justify-center mt-2">
                  {renderPlayerAvatar(top3[2], 'md')}
                </div>
                <div>
                  <div className="text-xs font-black text-white truncate">{top3[2]?.username}</div>
                  <div className="text-[10px] text-gray-400 truncate">{top3[2]?.countryFlag} {top3[2]?.countryName}</div>
                </div>
                <div className="text-xs font-black text-amber-500 font-mono">{top3[2]?.score.toLocaleString()} 🪙</div>
                <span className="inline-block text-[8px] sm:text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-950 text-amber-400 border border-amber-800/40">
                  🥉 Bronze
                </span>
              </div>
            </div>
          )}

          {/* Ranks 4+ List */}
          <div className="space-y-2">
            {otherPlayers.map((player) => {
              const isUser = player.isUser || player.username === profile.username;

              return (
                <div
                  key={player.rank + '_' + player.username}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between gap-2.5 transition-all hover:scale-[1.01] ${
                    isUser
                      ? 'bg-gradient-to-r from-red-950/90 via-zinc-950 to-amber-950/90 border-2 border-amber-400 shadow-xl shadow-amber-500/20'
                      : 'bg-zinc-950 border-white/5 hover:border-white/15'
                  }`}
                >
                  <div className="flex items-center gap-2.5 sm:gap-3.5 flex-1 min-w-0">
                    <span className="w-7 font-mono text-xs font-black text-center text-gray-400 shrink-0">
                      #{player.rank}
                    </span>

                    <div className="shrink-0">
                      {renderPlayerAvatar(player, 'sm')}
                    </div>

                    <div className="flex-1 min-w-0 space-y-0.5">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <h4 className={`text-xs font-black truncate ${isUser ? 'text-amber-300' : 'text-white'}`}>
                          {player.username}
                        </h4>
                        {isUser && (
                          <span className="px-1.5 py-0.2 rounded bg-amber-400 text-black text-[8px] font-black uppercase">
                            YOU
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 text-[10px] text-gray-400 flex-wrap">
                        <span>{player.countryFlag} {player.countryName}</span>
                        <span>•</span>
                        <span className="text-amber-400 font-bold">Lvl {player.level}</span>
                        <span>•</span>
                        <span className="text-zinc-400 font-semibold">{player.totalWins} Wins</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right space-y-0.5 shrink-0">
                    <div className="text-xs font-black text-amber-400 font-mono">
                      {player.score.toLocaleString()} 🪙
                    </div>
                    <div className="text-[9px] font-black uppercase tracking-wider text-gray-400">
                      {player.rankBadge}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
