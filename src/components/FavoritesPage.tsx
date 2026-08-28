/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Heart, Search, ArrowLeft, Trash2, Clock, Play, ListFilter } from 'lucide-react';
import { GameDefinition, UserProfile } from '../types';
import { GAMES_LIST } from '../data/gamesList';
import GameCard from './GameCard';
import { synth } from '../utils/audioSynth';

interface FavoritesPageProps {
  profile: UserProfile;
  onClose: () => void;
  onPlay: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
  onClearHistory?: () => void;
}

type SortType = 'name' | 'recent' | 'category';

export default function FavoritesPage({
  profile,
  onClose,
  onPlay,
  onToggleFavorite,
  onClearHistory,
}: FavoritesPageProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortType>('name');
  const [activeSubTab, setActiveSubTab] = useState<'favorites' | 'recent'>('favorites');

  // Gather games matching favorite IDs
  const favoriteGames = GAMES_LIST.filter((game) => profile.favorites.includes(game.id));

  // Gather games matching recently played IDs (fallback to popular if empty for first time demo feel)
  const recentlyPlayedIds = profile.recentlyPlayed || [];
  const recentlyPlayedGames = GAMES_LIST.filter((game) => recentlyPlayedIds.includes(game.id))
    // Keep in order of recentlyPlayedIds
    .sort((a, b) => {
      const idxA = recentlyPlayedIds.indexOf(a.id);
      const idxB = recentlyPlayedIds.indexOf(b.id);
      return idxA - idxB;
    });

  // Filter & search favorite games
  const filteredFavorites = favoriteGames.filter((game) => {
    return (
      game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      game.category.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  // Sort games
  const sortedFavorites = [...filteredFavorites].sort((a, b) => {
    if (sortBy === 'name') {
      return a.title.localeCompare(b.title);
    }
    if (sortBy === 'category') {
      return a.category.localeCompare(b.category);
    }
    // For sorting favorites by recently played, we check if they are in the recently played list and rank them
    if (sortBy === 'recent') {
      const idxA = recentlyPlayedIds.indexOf(a.id);
      const idxB = recentlyPlayedIds.indexOf(b.id);
      if (idxA === -1 && idxB === -1) return 0;
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    }
    return 0;
  });

  const handleSortChange = (type: SortType) => {
    synth.playClick();
    setSortBy(type);
  };

  const handleClearHistoryLocal = () => {
    synth.playClick();
    if (onClearHistory) {
      onClearHistory();
    }
  };

  return (
    <div className="space-y-6" id="favorites_page_container">
      {/* Title Header area */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight flex items-center gap-2">
            <Heart className={`h-6 w-6 ${profile.favoriteHeartColor === 'gold' ? 'text-amber-400' : 'text-red-500'} fill-current`} />
            Player Lounge
          </h2>
          <p className="text-xs text-gray-400 font-medium leading-relaxed mt-0.5">
            Your custom-curated portal. Launch your top-rated games instantly.
          </p>
        </div>

        <button 
          onClick={onClose}
          className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-full border border-white/5 bg-white/3 hover:border-red-500/30 hover:text-white text-xs font-black uppercase tracking-wider text-gray-400 transition"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Lobby
        </button>
      </div>

      {/* Lounging Switcher (Favorites vs Recently Played tabs) */}
      <div className="flex border-b border-white/5 gap-1">
        <button
          onClick={() => { synth.playClick(); setActiveSubTab('favorites'); }}
          className={`pb-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition duration-200 flex items-center gap-2 ${
            activeSubTab === 'favorites' 
              ? 'border-red-500 text-red-500' 
              : 'border-transparent text-gray-500 hover:text-gray-400'
          }`}
        >
          <Heart className="h-3.5 w-3.5 fill-current" />
          My Favorites ({favoriteGames.length})
        </button>
        <button
          onClick={() => { synth.playClick(); setActiveSubTab('recent'); }}
          className={`pb-3 px-5 text-xs font-black uppercase tracking-wider border-b-2 transition duration-200 flex items-center gap-2 ${
            activeSubTab === 'recent' 
              ? 'border-red-500 text-red-500' 
              : 'border-transparent text-gray-500 hover:text-gray-400'
          }`}
        >
          <Clock className="h-3.5 w-3.5" />
          Recently Played ({recentlyPlayedGames.length})
        </button>
      </div>

      {/* Tab: Favorites Layout */}
      {activeSubTab === 'favorites' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          {favoriteGames.length > 0 && (
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-between bg-white/3 p-4 rounded-2xl border border-white/5">
              {/* Search favorites */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="absolute top-1/2 left-3 h-3.5 w-3.5 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search favorites..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full rounded-xl glass-input py-2 pl-9 pr-4 text-xs text-white placeholder-gray-500 outline-none"
                />
              </div>

              {/* Sort controls */}
              <div className="flex items-center gap-1.5 self-end sm:self-auto shrink-0">
                <span className="text-[10px] text-gray-500 font-bold uppercase mr-1.5 flex items-center gap-1">
                  <ListFilter className="h-3.5 w-3.5" />
                  Sort:
                </span>
                {(['name', 'recent', 'category'] as const).map((type) => (
                  <button
                    key={type}
                    onClick={() => handleSortChange(type)}
                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                      sortBy === type 
                        ? 'bg-red-600 text-white shadow-md shadow-red-600/10' 
                        : 'bg-white/3 text-gray-400 hover:text-white border border-white/5'
                    }`}
                  >
                    {type === 'name' ? 'Name' : type === 'recent' ? 'Recent' : 'Category'}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Grid or Empty view */}
          {sortedFavorites.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-500/10 border border-red-500/20 mx-auto animate-pulse">
                <Heart className={`h-7 w-7 ${profile.favoriteHeartColor === 'gold' ? 'text-amber-400' : 'text-red-500'} fill-current`} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">No favorite games yet</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  {searchQuery ? 'Try matching another title or category name.' : 'Tap the heart icon on any game card in the lobby to secure it here.'}
                </p>
              </div>
              {!searchQuery && (
                <button 
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-xs font-black uppercase text-white shadow-lg shadow-red-600/20"
                >
                  Browse Games Lobby
                </button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {sortedFavorites.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  isFavorite={true}
                  heartColor={profile.favoriteHeartColor}
                  onPlay={onPlay}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab: Recently Played Layout */}
      {activeSubTab === 'recent' && (
        <div className="space-y-6">
          {recentlyPlayedGames.length > 0 && (
            <div className="flex items-center justify-between bg-white/3 p-4 rounded-2xl border border-white/5">
              <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                <Clock className="h-4 w-4" />
                Continue Playing
              </span>
              
              <button
                onClick={handleClearHistoryLocal}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-600/10 border border-red-600/20 hover:bg-red-600 hover:text-white transition text-[10px] font-black text-red-500 uppercase tracking-wider"
              >
                <Trash2 className="h-3.5 w-3.5" />
                Clear History
              </button>
            </div>
          )}

          {recentlyPlayedGames.length === 0 ? (
            <div className="py-20 text-center space-y-4 max-w-sm mx-auto">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/3 border border-white/5 mx-auto">
                <Clock className="h-5 w-5 text-gray-500" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black text-white uppercase tracking-wider">No Play History Yet</h4>
                <p className="text-xs text-gray-500 leading-normal">
                  Launch any arcade or slots simulator to track your performance history here.
                </p>
              </div>
              <button 
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-xs font-black uppercase text-white shadow-lg shadow-red-600/20"
              >
                Launch lobby game
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {recentlyPlayedGames.map((game) => (
                <GameCard 
                  key={game.id} 
                  game={game} 
                  isFavorite={profile.favorites.includes(game.id)}
                  heartColor={profile.favoriteHeartColor}
                  onPlay={onPlay}
                  onToggleFavorite={onToggleFavorite}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
