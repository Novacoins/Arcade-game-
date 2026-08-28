/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { X, Trophy } from 'lucide-react';
import { UserProfile } from '../types';
import { generateLeaderboardCategory, LeaderboardPlayer } from '../utils/leaderboardGenerator';
import { synth } from '../utils/audioSynth';
import PortraitAvatarView from './PortraitAvatarView';

interface LeaderboardModalProps {
  profile: UserProfile;
  totalWon: number;
  onClose: () => void;
}

export default function LeaderboardModal({
  profile,
  totalWon,
  onClose,
}: LeaderboardModalProps) {
  const [activeTab, setActiveTab] = useState<'global' | 'country' | 'weekly' | 'monthly' | 'friends'>('global');
  const [hourSeed] = useState<number>(() => Math.floor(Date.now() / (1000 * 60 * 60)));

  const rankedData: LeaderboardPlayer[] = generateLeaderboardCategory(activeTab, profile, totalWon, hourSeed);

  const renderAvatar = (player: LeaderboardPlayer) => {
    if (player.portraitAvatar) {
      return <PortraitAvatarView portraitId={player.portraitAvatar} size="sm" showBadge={false} />;
    }
    return (
      <div className="w-8 h-8 rounded-full border-2 border-amber-400 bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 flex items-center justify-center text-sm shadow-[0_0_12px_rgba(245,158,11,0.3)]">
        <span className="animate-[bounce_3s_ease-in-out_infinite]">{player.avatar}</span>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md" id="leaderboard_modal">
      <div className="relative w-full max-w-lg overflow-hidden rounded-3xl bg-zinc-950 border border-amber-500/30 text-white shadow-2xl">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-white/10 px-5 py-4 bg-gradient-to-r from-amber-950/60 to-zinc-950">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-500/20 text-amber-400 border border-amber-400/30">
              <Trophy className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-sm font-black tracking-tight uppercase text-white">Leaderboards</h3>
              <p className="text-[10px] text-gray-400 font-bold uppercase">{activeTab === 'global' ? 'Top 50 Global Champions' : 'Top 20 Players'}</p>
            </div>
          </div>
          <button 
            onClick={() => {
              synth.playClick();
              onClose();
            }}
            className="rounded-full bg-white/5 p-2 text-gray-400 hover:bg-white/10 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-white/10 px-2 bg-zinc-900/60 overflow-x-auto scrollbar-none">
          {[
            { id: 'global', label: 'Global (50)' },
            { id: 'country', label: 'Country (20)' },
            { id: 'weekly', label: 'Weekly (20)' },
            { id: 'monthly', label: 'Monthly (20)' },
            { id: 'friends', label: 'Friends (20)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => {
                synth.playClick();
                setActiveTab(tab.id as any);
              }}
              className={`px-3.5 py-3 text-xs font-black uppercase tracking-wider text-center border-b-2 transition shrink-0 ${
                activeTab === tab.id ? 'border-amber-400 text-amber-400 bg-amber-500/10' : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Leaderboard Entries */}
        <div className="p-4 max-h-[420px] overflow-y-auto space-y-2 scrollbar-thin">
          {rankedData.map((player) => {
            const isUser = player.isUser || player.username === profile.username;
            
            return (
              <div 
                key={player.rank + '_' + player.username}
                className={`flex items-center justify-between p-3 rounded-2xl border transition ${
                  isUser 
                    ? 'bg-gradient-to-r from-red-950/80 via-zinc-950 to-amber-950/80 border-amber-400 shadow-lg' 
                    : 'bg-zinc-900/60 border-white/5 hover:border-white/15'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  
                  {/* Rank Display badge */}
                  <div className={`w-7 text-center font-mono text-xs font-black shrink-0 ${player.rank <= 3 ? 'text-amber-400 text-sm' : 'text-gray-400'}`}>
                    #{player.rank}
                  </div>

                  {/* Avatar Face */}
                  <div className="shrink-0">
                    {renderAvatar(player)}
                  </div>

                  {/* User Profile Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className={`text-xs font-black truncate ${isUser ? 'text-amber-300' : 'text-white'}`}>
                        {player.username}
                      </p>
                      {isUser && (
                        <span className="text-[8px] font-black bg-amber-400 text-black px-1.5 py-0.2 rounded uppercase">YOU</span>
                      )}
                    </div>
                    <p className="text-[10px] text-gray-400 truncate">
                      {player.countryFlag} {player.countryName} • Lv.{player.level} • {player.totalWins} Wins
                    </p>
                  </div>

                </div>

                {/* Score balance */}
                <div className="text-right shrink-0">
                  <div className="text-xs font-black text-amber-400 font-mono">
                    {player.score.toLocaleString()} 🪙
                  </div>
                  <span className="text-[8px] text-gray-400 font-bold uppercase">{player.rankBadge}</span>
                </div>

              </div>
            );
          })}
        </div>

        {/* Informational footer note */}
        <div className="bg-zinc-900/80 px-5 py-3 text-center text-[10px] text-gray-400 border-t border-white/10 font-bold">
          Rankings automatically re-shuffle and update every 1 hour.
        </div>

      </div>
    </div>
  );
}
