/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trophy, Target, Star, Calendar, CheckCircle, TrendingUp, Users, Heart } from 'lucide-react';
import { UserProfile, GameStats, Achievement, DailyMission } from '../types';
import { synth } from '../utils/audioSynth';

interface ProfileModalProps {
  profile: UserProfile;
  stats: GameStats;
  achievements: Achievement[];
  missions: DailyMission[];
  onClose: () => void;
  onUpdateProfile: (updates: Partial<UserProfile>) => void;
  onOpenFavorites?: () => void;
}

const AVAILABLE_AVATARS = ['🤠', '🐉', '🦊', '👑', '🧙', '🥷', '🐼', '🐯', '🤖', '👾', '🚀', '🔮'];

export default function ProfileModal({
  profile,
  stats,
  achievements,
  missions,
  onClose,
  onUpdateProfile,
  onOpenFavorites,
}: ProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'achievements' | 'missions'>('profile');
  const [username, setUsername] = useState(profile.username);
  const [isEditing, setIsEditing] = useState(false);

  const handleSaveUsername = () => {
    if (username.trim()) {
      onUpdateProfile({ username: username.trim() });
      setIsEditing(false);
    }
  };

  const handleSelectAvatar = (avatar: string) => {
    onUpdateProfile({ avatar });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" id="profile_modal">
      <div className="relative w-full max-w-xl overflow-hidden rounded-3xl glass-modal text-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/5 px-6 py-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <Trophy className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black tracking-tight uppercase">User Profile & Rank</h3>
          </div>
          <button 
            onClick={onClose}
            className="rounded-full bg-white/5 p-1.5 text-gray-400 hover:bg-white/10 hover:text-white transition duration-200"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/5 px-6">
          {['profile', 'achievements', 'missions'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`pb-3 pt-4 px-4 text-xs font-black uppercase tracking-wider border-b-2 transition duration-200 ${
                activeTab === tab ? 'border-red-500 text-red-500' : 'border-transparent text-gray-500 hover:text-gray-400'
              }`}
            >
              {tab === 'profile' ? 'My Profile' : tab === 'achievements' ? 'Achievements' : 'Daily Missions'}
            </button>
          ))}
        </div>

        {/* Modal Content container */}
        <div className="p-6 max-h-[450px] overflow-y-auto">
          
          {/* Profile Details Tab */}
          {activeTab === 'profile' && (
            <div className="space-y-6">
              
              {/* Primary User Info & Avatar Customization */}
              <div className="flex flex-col sm:flex-row items-center gap-6 bg-white/3 p-4 rounded-2xl border border-white/5">
                <div className="relative group">
                  <div className="text-5xl sm:text-6xl bg-gradient-to-tr from-red-600/10 to-amber-500/10 border border-red-500/30 rounded-2xl p-4 cursor-pointer select-none">
                    {profile.avatar}
                  </div>
                </div>

                <div className="text-center sm:text-left flex-1 space-y-1.5 w-full">
                  <div className="flex flex-col sm:flex-row items-center gap-2">
                    {isEditing ? (
                      <div className="flex gap-2 w-full max-w-xs">
                        <input
                          type="text"
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                          className="flex-1 rounded-lg border border-white/5 bg-white/3 px-2.5 py-1 text-sm text-white focus:border-red-500 outline-none"
                          maxLength={16}
                        />
                        <button
                          onClick={handleSaveUsername}
                          className="px-3 py-1 bg-red-600 text-xs font-bold rounded-lg text-white"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <h4 className="text-xl font-black text-white">{profile.username}</h4>
                        <button
                          onClick={() => setIsEditing(true)}
                          className="text-[10px] text-red-500 hover:underline font-semibold uppercase"
                        >
                          [Edit]
                        </button>
                      </div>
                    )}
                    <span className="text-[9px] bg-red-600/10 border border-red-600/30 px-2 py-0.5 rounded text-red-500 font-extrabold uppercase">
                      {profile.isGuest ? 'GUEST ACCOUNT' : 'VERIFIED ACCOUNT'}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 text-[11px] text-gray-500 justify-center sm:justify-start">
                    <Calendar className="h-3.5 w-3.5" />
                    Joined on {profile.joinedAt}
                  </div>

                  {/* XP Bar */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] font-bold text-gray-400">
                      <span>Level {profile.level}</span>
                      <span>{profile.xp}/{profile.xpNeeded} XP</span>
                    </div>
                    <div className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-500 to-amber-400 rounded-full transition-all duration-300"
                        style={{ width: `${(profile.xp / profile.xpNeeded) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Avatar Selector Tray */}
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Pick Avatar Face</p>
                <div className="grid grid-cols-6 sm:grid-cols-12 gap-2">
                  {AVAILABLE_AVATARS.map((emoji) => (
                    <button
                      key={emoji}
                      onClick={() => handleSelectAvatar(emoji)}
                      className={`text-2xl p-1.5 rounded-xl border transition ${
                        profile.avatar === emoji 
                          ? 'border-red-500 bg-red-500/10' 
                          : 'border-white/5 bg-white/3 hover:border-red-500/30'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>

              {/* Favorites Lounge shortcut link */}
              {onOpenFavorites && (
                <button
                  onClick={() => {
                    onClose();
                    onOpenFavorites();
                  }}
                  className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-red-600/10 to-amber-500/10 border border-amber-500/20 hover:border-red-500/40 hover:from-amber-500/20 hover:to-red-600/20 transition flex items-center justify-center gap-2 text-xs font-black uppercase tracking-wider text-amber-400 hover:text-white"
                >
                  <Heart className="h-4 w-4 fill-current text-red-500" />
                  Open Player Favorites Lounge
                </button>
              )}

              {/* Customization Settings */}
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Lounge Customization</p>
                <div className="bg-white/3 border border-white/5 p-4 rounded-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-0.5 text-left">
                    <span className="text-xs font-bold text-white block">Heart Glow Accent Color</span>
                    <span className="text-[10px] text-gray-400 font-medium">Select custom color accent for favorited game cards.</span>
                  </div>
                  <div className="flex gap-2 shrink-0">
                    <button
                      onClick={() => {
                        synth.playClick();
                        onUpdateProfile({ favoriteHeartColor: 'gold' });
                      }}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition border ${
                        (profile.favoriteHeartColor || 'gold') === 'gold'
                          ? 'border-amber-500 bg-amber-500/10 text-amber-400 shadow-[0_0_8px_rgba(245,158,11,0.2)]'
                          : 'border-white/5 bg-white/3 text-gray-400 hover:text-white'
                      }`}
                    >
                      🌟 Gold
                    </button>
                    <button
                      onClick={() => {
                        synth.playClick();
                        onUpdateProfile({ favoriteHeartColor: 'red' });
                      }}
                      className={`px-3.5 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition border ${
                        profile.favoriteHeartColor === 'red'
                          ? 'border-red-500 bg-red-500/10 text-red-500 shadow-[0_0_8px_rgba(239,68,68,0.2)]'
                          : 'border-white/5 bg-white/3 text-gray-400 hover:text-white'
                      }`}
                    >
                      ❤️ Red
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Grid */}
              <div className="space-y-2">
                <p className="text-xs font-black text-gray-500 uppercase tracking-widest">Player Statistics</p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-white/3 border border-white/5 p-3.5 rounded-2xl text-center">
                    <CheckCircle className="h-4 w-4 text-emerald-400 mx-auto mb-1" />
                    <span className="block text-lg font-black">{stats.gamesPlayed}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Rounds played</span>
                  </div>
                  <div className="bg-white/3 border border-white/5 p-3.5 rounded-2xl text-center">
                    <TrendingUp className="h-4 w-4 text-amber-400 mx-auto mb-1" />
                    <span className="block text-lg font-black">+{stats.totalWon.toLocaleString()}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Won Coins</span>
                  </div>
                  <div className="bg-white/3 border border-white/5 p-3.5 rounded-2xl text-center">
                    <Star className="h-4 w-4 text-purple-400 mx-auto mb-1" />
                    <span className="block text-lg font-black">{stats.biggestWin > 0 ? stats.biggestWin.toLocaleString() : '---'}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Biggest Win</span>
                  </div>
                  <div className="bg-white/3 border border-white/5 p-3.5 rounded-2xl text-center">
                    <Users className="h-4 w-4 text-cyan-400 mx-auto mb-1" />
                    <span className="block text-lg font-black">{stats.favoriteGenre}</span>
                    <span className="text-[10px] text-gray-500 font-bold uppercase">Favorite Genre</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* Achievements shelf tab */}
          {activeTab === 'achievements' && (
            <div className="space-y-3">
              {achievements.map((ach) => (
                <div 
                  key={ach.id} 
                  className={`flex gap-4 p-4 rounded-2xl border transition duration-200 ${
                    ach.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-white/3 border-white/5'
                  }`}
                >
                  <div className="text-3xl flex items-center shrink-0">
                    {ach.badge}
                  </div>
                  <div className="flex-1 space-y-1.5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="text-sm font-black text-white">{ach.title}</h4>
                        <p className="text-[11px] text-gray-400 font-medium leading-relaxed">{ach.description}</p>
                      </div>
                      {ach.completed && (
                        <span className="text-[9px] font-black text-emerald-400 tracking-wider bg-emerald-500/10 px-2 py-0.5 rounded uppercase">
                          UNLOCKED
                        </span>
                      )}
                    </div>

                    {/* Progress Slider Bar */}
                    <div className="space-y-1">
                      <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-red-500 rounded-full transition-all duration-300"
                          style={{ width: `${(ach.progress / ach.maxProgress) * 100}%` }}
                        />
                      </div>
                      <div className="flex justify-between text-[10px] font-bold text-gray-500">
                        <span>Progress: {ach.progress}/{ach.maxProgress}</span>
                        <span className="text-amber-400">+{ach.coinReward} Coins • +{ach.xpReward} XP</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Daily Missions Tab */}
          {activeTab === 'missions' && (
            <div className="space-y-3">
              <div className="p-3 bg-red-600/5 border border-red-500/10 rounded-xl flex gap-2 mb-2">
                <Target className="h-4 w-4 text-red-500 shrink-0 mt-0.5" />
                <p className="text-[10px] text-gray-400 leading-normal">
                  Missions reset automatically. Complete tasks daily to boost your wallet and XP multipliers!
                </p>
              </div>

              {missions.map((m) => (
                <div 
                  key={m.id} 
                  className={`p-3.5 rounded-2xl border ${
                    m.completed 
                      ? 'bg-emerald-500/5 border-emerald-500/20' 
                      : 'bg-white/3 border-white/5'
                  }`}
                >
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-xs font-black text-white leading-relaxed">{m.description}</p>
                    <span className="text-[10px] font-black text-amber-400 flex items-center gap-1 bg-amber-400/5 border border-amber-400/10 px-2 py-0.5 rounded-full">
                      +{m.rewardAmount} {m.rewardType === 'coins' ? '🪙' : m.rewardType === 'diamonds' ? '💎' : 'XP'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-red-600 to-amber-500 rounded-full transition-all duration-300"
                        style={{ width: `${(m.progress / m.maxProgress) * 100}%` }}
                      />
                    </div>
                    <div className="flex justify-between text-[10px] font-bold text-gray-500">
                      <span>Completed {m.progress}/{m.maxProgress}</span>
                      <span>{m.completed ? 'CLAIMED' : 'IN PROGRESS'}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}
