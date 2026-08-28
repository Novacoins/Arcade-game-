/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { Search, Zap, Heart, X, History, Trash2 } from 'lucide-react';
import { UserProfile } from '../types';

interface HeaderProps {
  profile: UserProfile;
  onSearchChange: (search: string) => void;
  searchValue: string;
  onOpenWallet: () => void;
  onOpenProfile: () => void;
  onOpenLeaderboard: () => void;
  onOpenDailyRewards: () => void;
  onOpenFavorites: () => void;
  isFavoritesActive: boolean;
}

function formatBalance(val: number): string {
  if (val >= 1000000) {
    return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
  }
  if (val >= 1000) {
    return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'K';
  }
  return val.toLocaleString();
}

export default function Header({
  profile,
  onSearchChange,
  searchValue,
  onOpenWallet,
  onOpenProfile,
  onOpenLeaderboard,
  onOpenDailyRewards,
  onOpenFavorites,
  isFavoritesActive,
}: HeaderProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Load recent searches from local storage
  useEffect(() => {
    const saved = localStorage.getItem('nova_recent_searches');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved));
      } catch (e) {
        setRecentSearches([]);
      }
    }
  }, []);

  // Handle clicking outside recent search dropdown
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Save new search to recent searches
  const saveSearchQuery = (query: string) => {
    const cleanQuery = query.trim();
    if (!cleanQuery) return;
    
    setRecentSearches((prev) => {
      const filtered = prev.filter((q) => q.toLowerCase() !== cleanQuery.toLowerCase());
      const updated = [cleanQuery, ...filtered].slice(0, 5);
      localStorage.setItem('nova_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onSearchChange(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && searchValue) {
      saveSearchQuery(searchValue);
      setIsFocused(false);
    }
  };

  const handleRecentClick = (query: string) => {
    onSearchChange(query);
    saveSearchQuery(query);
    setIsFocused(false);
  };

  const handleClearSearch = () => {
    onSearchChange('');
  };

  const handleDeleteRecent = (e: React.MouseEvent, query: string) => {
    e.stopPropagation();
    setRecentSearches((prev) => {
      const updated = prev.filter((q) => q !== query);
      localStorage.setItem('nova_recent_searches', JSON.stringify(updated));
      return updated;
    });
  };

  const handleClearAllRecent = (e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem('nova_recent_searches');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-zinc-950/95 backdrop-blur-md border-b border-white/5 px-1 py-2 sm:px-4" id="main_header">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-1 xs:gap-1.5 sm:gap-3 flex-nowrap">
        
        {/* 1. Website Logo */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 cursor-pointer" onClick={onOpenProfile}>
          <div className="relative flex h-7.5 w-7.5 sm:h-9 sm:w-9 items-center justify-center rounded-lg bg-gradient-to-tr from-red-600 to-amber-500 p-[1.5px] shadow-lg shadow-red-600/15 hover:scale-105 transition-transform">
            <div className="flex h-full w-full items-center justify-center rounded-[7px] bg-black text-[10px] sm:text-base font-black tracking-tighter text-amber-400">
              N<span className="text-red-500">S</span>
            </div>
          </div>
          <div className="hidden lg:block select-none">
            <h1 className="text-xs sm:text-sm font-black tracking-tight text-white uppercase leading-none">
              Nova<span className="bg-gradient-to-r from-red-500 to-amber-400 bg-clip-text text-transparent">Studio</span>
            </h1>
            <p className="text-[7px] font-black tracking-widest text-zinc-500 uppercase mt-0.5">Gaming Cabinet</p>
          </div>
        </div>

        {/* 2. Compact Search Bar with Search history */}
        <div className="relative flex-1 max-w-[70px] xs:max-w-[100px] sm:max-w-xs md:max-w-md min-w-[40px] xs:min-w-[55px]" ref={dropdownRef}>
          <div className="relative w-full">
            <Search className="absolute top-1/2 left-2 h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 -translate-y-1/2 text-zinc-500" />
            <input
              type="text"
              placeholder="Search..."
              value={searchValue}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              onFocus={() => setIsFocused(true)}
              className="w-full rounded-full bg-zinc-900 border border-white/10 py-0.5 pl-5 pr-5 sm:py-1 sm:pl-8 sm:pr-8 text-[9px] sm:text-xs text-white placeholder-zinc-500 outline-none focus:border-red-500/50 focus:bg-zinc-900/90 transition-all duration-200"
            />
            {searchValue && (
              <button
                onClick={handleClearSearch}
                className="absolute top-1/2 right-1.5 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 hover:bg-white/10 rounded-full transition"
              >
                <X className="h-2 w-2 sm:h-3 sm:w-3" />
              </button>
            )}
          </div>

          {/* Search History Dropdown */}
          {isFocused && (recentSearches.length > 0 || searchValue) && (
            <div className="absolute top-full left-0 right-0 mt-1.5 w-40 sm:w-full rounded-xl bg-zinc-900/95 border border-white/10 p-1.5 shadow-2xl backdrop-blur-md z-50">
              {recentSearches.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between px-1 py-0.5 border-b border-white/5 mb-1">
                    <span className="text-[8px] sm:text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                      <History className="h-2 w-2" /> Recent
                    </span>
                    <button 
                      onClick={handleClearAllRecent}
                      className="text-[8px] sm:text-[9px] text-zinc-500 hover:text-red-400 flex items-center gap-0.5 uppercase tracking-wider font-bold transition"
                    >
                      <Trash2 className="h-2 w-2" /> Clear
                    </button>
                  </div>
                  <div className="flex flex-col">
                    {recentSearches.map((query, index) => (
                      <div
                        key={index}
                        onClick={() => handleRecentClick(query)}
                        className="flex items-center justify-between px-1 py-1 rounded-md hover:bg-white/5 cursor-pointer text-[9px] sm:text-[11px] text-zinc-300 font-medium hover:text-white transition"
                      >
                        <span className="truncate">{query}</span>
                        <button
                          onClick={(e) => handleDeleteRecent(e, query)}
                          className="text-zinc-500 hover:text-red-400 p-0.5 rounded transition"
                        >
                          <X className="h-2 w-2" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="px-1 py-0.5 text-[8px] sm:text-[10px] text-zinc-500 font-semibold uppercase tracking-wider text-center">
                  Press Enter to search
                </div>
              )}
            </div>
          )}
        </div>

        {/* 4. Energy Icon ⚡ */}
        <div
          onClick={onOpenDailyRewards}
          className="flex items-center justify-center gap-0.5 h-6.5 sm:h-7.5 px-1 xs:px-1.5 sm:px-2 rounded-lg text-[8px] sm:text-xs font-black uppercase bg-zinc-900 border border-white/5 text-amber-400 hover:border-amber-400/20 cursor-pointer shrink-0"
          title="Energy reserve"
        >
          <Zap className="h-2.5 w-2.5 sm:h-3.5 sm:w-3.5 text-amber-400 animate-pulse" />
          <span className="font-mono text-zinc-300">100</span>
        </div>

        {/* 5. Diamonds 💎 */}
        <div
          onClick={onOpenWallet}
          className="flex items-center justify-center gap-0.5 h-6.5 sm:h-7.5 cursor-pointer rounded-lg bg-zinc-900 border border-white/5 px-1 xs:px-1.5 sm:px-2 hover:bg-zinc-800 transition text-[8px] sm:text-xs font-black uppercase text-purple-400 shrink-0"
          title="Diamonds balance"
        >
          <span className="text-[10px] sm:text-xs">💎</span>
          <span className="font-mono text-zinc-300">{formatBalance(profile.diamonds)}</span>
        </div>

        {/* 6. Coins 🪙 */}
        <div
          onClick={onOpenWallet}
          className="flex items-center justify-center gap-0.5 h-6.5 sm:h-7.5 cursor-pointer rounded-lg bg-zinc-900 border border-white/5 px-1 xs:px-1.5 sm:px-2 hover:bg-zinc-800 transition text-[8px] sm:text-xs font-black uppercase text-yellow-500 shrink-0"
          title="Coins balance"
        >
          <span className="text-[10px] sm:text-xs">🪙</span>
          <span className="font-mono text-zinc-300">{formatBalance(profile.coins)}</span>
        </div>

        {/* 7. Red Nova Studio Account Card */}
        <div
          onClick={onOpenProfile}
          className="flex items-center gap-1 sm:gap-1.5 h-6.5 sm:h-7.5 cursor-pointer bg-gradient-to-r from-red-600 via-red-600 to-red-700 hover:from-red-500 hover:to-red-600 border border-red-400/40 px-1.5 sm:px-2.5 py-0.5 rounded-lg sm:rounded-xl text-white shadow-lg shadow-red-600/20 hover:shadow-red-600/40 transition duration-200 shrink-0"
          title="Manage Account Profile"
        >
          <span className="text-[10px] sm:text-xs bg-black/30 w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-full shadow-inner font-black shrink-0">
            {profile.avatar}
          </span>
          <div className="flex flex-col text-left select-none">
            <span className="text-[8px] sm:text-[10px] font-black tracking-tight leading-none text-white uppercase whitespace-nowrap">
              Nova Studio
            </span>
            <span className="text-[6px] sm:text-[7px] font-black tracking-widest text-red-200 uppercase leading-none mt-0.5 whitespace-nowrap">
              ACCOUNT
            </span>
          </div>
        </div>

      </div>
    </header>
  );
}
