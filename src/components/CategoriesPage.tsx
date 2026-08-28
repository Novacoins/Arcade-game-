/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameDefinition, UserProfile } from '../types';
import { GAMES_LIST, GAME_CATEGORIES } from '../data/gamesList';
import GameCard from './GameCard';
import { Search, Sparkles, SlidersHorizontal, Flame, Compass, ArrowUpDown, History, Heart } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

interface Props {
  profile: UserProfile;
  onPlayGame: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

// Expanded category mapping tags
const EXTENDED_CATEGORIES = [
  'All',
  'Popular',
  'New Games',
  'Recently Played',
  'Favorites',
  'Arcade',
  'Puzzle',
  'Action',
  'Racing',
  'Sports',
  'Card Games',
  'Memory Games',
  'Lucky Games',
  'Bubble Shooter',
  'Casual',
  'Crash Games',
  'Mines Games',
  'Plinko Games'
];

export default function CategoriesPage({ profile, onPlayGame, onToggleFavorite }: Props) {
  const [selectedCat, setSelectedCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'popular' | 'new' | 'az' | 'multiplier'>('popular');

  // Filter games logic
  let filtered = GAMES_LIST.filter((game) => {
    // Search query check
    const matchesSearch = game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          game.category.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    // Category logic
    if (selectedCat === 'All') return true;
    if (selectedCat === 'Popular') return game.isPopular;
    if (selectedCat === 'New Games') return game.isNew;
    if (selectedCat === 'Favorites') return profile.favorites.includes(game.id);
    if (selectedCat === 'Recently Played') return (profile.recentlyPlayed || []).includes(game.id);
    if (selectedCat === 'Arcade') return game.category.includes('Arcade') || game.category.includes('Quick') || game.id === 'brick_smash';
    if (selectedCat === 'Puzzle') return game.category.includes('Puzzle') || game.id === 'jewel_puzzle';
    if (selectedCat === 'Action') return game.category.includes('Crash') || game.id === 'rocket_run' || game.id === 'sky_flight';
    if (selectedCat === 'Racing') return game.category.includes('Racing') || game.id === 'racing_rush';
    if (selectedCat === 'Sports') return game.category.includes('Sports') || game.id === 'goal_challenge';
    if (selectedCat === 'Card Games') return game.category.includes('Card') || game.id === 'card_duel';
    if (selectedCat === 'Memory Games') return game.category.includes('Memory') || game.id === 'memory_flip';
    if (selectedCat === 'Lucky Games') return game.category.includes('Lucky') || game.category.includes('Coin') || game.id === 'lucky_wheel';
    if (selectedCat === 'Bubble Shooter') return game.id === 'bubble_pop';
    if (selectedCat === 'Casual') return game.category.includes('Quick') || game.id === 'fruit_slice' || game.id === 'fishing_frenzy';

    return game.category.toLowerCase().includes(selectedCat.toLowerCase());
  });

  // Sorting logic
  filtered = [...filtered].sort((a, b) => {
    if (sortBy === 'popular') return b.playCount - a.playCount;
    if (sortBy === 'new') return (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0);
    if (sortBy === 'az') return a.title.localeCompare(b.title);
    if (sortBy === 'multiplier') {
      const multA = parseFloat(a.multiplier) || 0;
      const multB = parseFloat(b.multiplier) || 0;
      return multB - multA;
    }
    return 0;
  });

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -15 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-zinc-950 via-zinc-900 to-zinc-950 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="space-y-1 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black uppercase tracking-widest">
            <Compass className="h-3.5 w-3.5 text-red-400 animate-spin" style={{ animationDuration: '8s' }} />
            Explore All Categories
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">Game Directory & Discovery</h2>
          <p className="text-xs text-gray-400">Discover top titles, trending classics, and arcade challenges</p>
        </div>

        {/* Quick Search Input */}
        <div className="relative w-full md:w-80 relative z-10">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search games or categories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-900/90 border border-white/10 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-red-500 transition-all shadow-inner"
          />
          {searchQuery && (
            <button 
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-gray-500 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Category Filter Pills & Sort Bar */}
      <div className="space-y-4">
        {/* Horizontal Category Pill Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {EXTENDED_CATEGORIES.map((cat) => {
            const active = selectedCat === cat;
            return (
              <button
                key={cat}
                onClick={() => {
                  synth.playClick();
                  setSelectedCat(cat);
                }}
                className={`px-4 py-2.5 rounded-2xl text-xs font-black tracking-wide uppercase transition-all shrink-0 flex items-center gap-1.5 border ${
                  active
                    ? 'bg-gradient-to-r from-red-600 to-amber-500 text-white border-red-500 shadow-lg shadow-red-600/20 scale-105'
                    : 'bg-zinc-900/80 text-gray-400 border-white/5 hover:border-white/20 hover:text-white'
                }`}
              >
                {cat === 'Popular' && <Flame className="h-3.5 w-3.5 text-amber-400" />}
                {cat === 'Favorites' && <Heart className="h-3.5 w-3.5 text-red-400 fill-red-400" />}
                {cat === 'Recently Played' && <History className="h-3.5 w-3.5 text-blue-400" />}
                {cat}
              </button>
            );
          })}
        </div>

        {/* Sorting Controls */}
        <div className="flex items-center justify-between bg-zinc-950/60 p-3 rounded-2xl border border-white/5 text-xs">
          <span className="text-gray-400 font-bold uppercase tracking-wider text-[11px] flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Showing <span className="text-white font-black">{filtered.length}</span> Games
          </span>

          <div className="flex items-center gap-2">
            <ArrowUpDown className="h-3.5 w-3.5 text-gray-400 hidden sm:block" />
            <span className="text-gray-500 font-bold text-[10px] uppercase hidden sm:block">Sort By:</span>
            <div className="flex gap-1 bg-zinc-900 p-1 rounded-xl border border-white/5">
              {(['popular', 'new', 'az', 'multiplier'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    synth.playClick();
                    setSortBy(s);
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider transition ${
                    sortBy === s
                      ? 'bg-amber-500 text-black'
                      : 'text-gray-400 hover:text-white'
                  }`}
                >
                  {s === 'az' ? 'A-Z' : s}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Game Catalog Grid */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={selectedCat + '_' + sortBy + '_' + searchQuery}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {filtered.length === 0 ? (
            <div className="col-span-full py-20 text-center space-y-3 bg-zinc-950/40 rounded-3xl border border-dashed border-white/10">
              <p className="text-sm font-bold text-gray-500 uppercase tracking-widest">No games found in this category</p>
              <button
                onClick={() => {
                  setSelectedCat('All');
                  setSearchQuery('');
                }}
                className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white text-xs font-black uppercase rounded-xl shadow-lg transition"
              >
                Reset Catalog Filters
              </button>
            </div>
          ) : (
            filtered.map((game) => (
              <GameCard
                key={game.id}
                game={game}
                isFavorite={profile.favorites.includes(game.id)}
                heartColor={profile.favoriteHeartColor}
                onPlay={onPlayGame}
                onToggleFavorite={onToggleFavorite}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>
    </motion.div>
  );
}
