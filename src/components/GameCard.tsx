/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Play, Sparkles, Heart, Flame, ShieldAlert, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { GameDefinition } from '../types';

interface GameCardProps {
  key?: string;
  game: GameDefinition;
  isFavorite: boolean;
  heartColor?: 'gold' | 'red';
  onPlay: (gameId: string) => void;
  onToggleFavorite: (gameId: string) => void;
}

export default function GameCard({ game, isFavorite, heartColor = 'gold', onPlay, onToggleFavorite }: GameCardProps) {
  
  // Custom badge colors based on category for luxury accenting
  const getCategoryTheme = (category: string) => {
    switch (category) {
      case 'Crash Games':
        return {
          text: 'text-purple-400 border-purple-500/20 bg-purple-500/10',
          glow: 'group-hover:shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:border-purple-500/40',
          accent: 'bg-purple-500',
        };
      case 'Arcade Games':
        return {
          text: 'text-cyan-400 border-cyan-500/20 bg-cyan-500/10',
          glow: 'group-hover:shadow-[0_0_30px_rgba(6,182,212,0.2)] hover:border-cyan-500/40',
          accent: 'bg-cyan-500',
        };
      case 'Mines Games':
      case 'Plinko Games':
        return {
          text: 'text-pink-400 border-pink-500/20 bg-pink-500/10',
          glow: 'group-hover:shadow-[0_0_30px_rgba(236,72,153,0.2)] hover:border-pink-500/40',
          accent: 'bg-pink-500',
        };
      default:
        return {
          text: 'text-amber-400 border-amber-500/20 bg-amber-500/10',
          glow: 'group-hover:shadow-[0_0_30px_rgba(245,158,11,0.2)] hover:border-amber-500/40',
          accent: 'bg-amber-500',
        };
    }
  };

  const theme = getCategoryTheme(game.category);

  return (
    <div 
      onClick={() => onPlay(game.id)}
      className={`group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-zinc-950/60 border border-white/5 p-3 hover:border-red-500/30 cursor-pointer hover:shadow-[0_0_35px_rgba(220,38,38,0.18)] hover:-translate-y-1.5 transition-all duration-300 ease-out`}
      id={`game_card_${game.id}`}
    >
      
      {/* Thumbnail Graphics Container */}
      <div 
        className="relative aspect-video w-full overflow-hidden rounded-xl bg-black border border-white/5 shadow-inner"
        style={{ 
          background: game.thumbnail.startsWith('linear-gradient') ? game.thumbnail : undefined 
        }}
      >
        {/* Full-bleed illustration game cover */}
        {!game.thumbnail.startsWith('linear-gradient') && (
          <img 
            src={game.thumbnail} 
            alt={game.title} 
            loading="lazy"
            decoding="async"
            referrerPolicy="no-referrer"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.08] group-hover:rotate-1"
          />
        )}

        {/* Ambient top & bottom shadows on card image for text readability */}
        <div className="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent pointer-events-none" />

        {/* Neon overlay grid decoration */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px] opacity-40 pointer-events-none" />

        {/* Floating Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1 z-10">
          {game.isPopular && (
            <span className="flex items-center gap-1 rounded-md bg-gradient-to-r from-red-600 to-amber-500 px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase shadow-lg shadow-red-600/30">
              <Flame className="h-2.5 w-2.5 text-white fill-white animate-pulse" />
              HOT
            </span>
          )}
          {game.isNew && (
            <span className="flex items-center gap-1 rounded-md bg-gradient-to-r from-blue-600 to-cyan-500 px-2 py-0.5 text-[9px] font-black tracking-wider text-white uppercase shadow-lg shadow-blue-600/30">
              <Sparkles className="h-2.5 w-2.5 text-white" />
              NEW
            </span>
          )}
        </div>

        {/* Interactive Favorite Heart Button */}
        <motion.button 
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(game.id);
          }}
          whileTap={{ scale: 1.4 }}
          animate={{ scale: isFavorite ? [1, 1.3, 1] : 1 }}
          transition={{ type: 'spring', stiffness: 300, damping: 15 }}
          className={`absolute top-2 right-2 z-10 flex h-7.5 w-7.5 items-center justify-center rounded-full bg-zinc-950/80 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 transition-all ${
            isFavorite 
              ? 'text-red-500 border-red-500/40 bg-red-500/10 drop-shadow-[0_0_12px_rgba(239,68,68,0.8)] shadow-[0_0_12px_rgba(239,68,68,0.3)]' 
              : 'text-zinc-400 hover:text-white hover:border-white/25'
          }`}
        >
          <Heart className="h-3.5 w-3.5" fill={isFavorite ? 'currentColor' : 'none'} />
        </motion.button>

        {/* Fallback symbol or Emoji - only visible if thumbnail is a gradient placeholder */}
        {game.thumbnail.startsWith('linear-gradient') && (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl drop-shadow-[0_4px_12px_rgba(0,0,0,0.6)] transition duration-300 group-hover:scale-115">
              {getCategoryEmoji(game.category, game.title)}
            </span>
          </div>
        )}

        {/* Multiplier Indicator tag */}
        <div className="absolute bottom-2 right-2 rounded-md bg-black/85 border border-white/5 px-2 py-0.5 text-[9px] font-black tracking-wider text-amber-400 font-mono uppercase">
          Max {game.multiplier}
        </div>

        {/* Hover overlay play cue */}
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <button 
            className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-amber-500 text-white shadow-xl shadow-red-600/40 transform scale-75 group-hover:scale-100 transition duration-300 hover:scale-105 active:scale-95"
          >
            <Play className="h-5 w-5 fill-white ml-0.5" />
          </button>
        </div>
      </div>

      {/* Info details panel */}
      <div className="mt-3.5 flex flex-col flex-1 text-left">
        <div className="flex items-center justify-between gap-2">
          <span className={`text-[8px] font-black px-2 py-0.5 rounded border uppercase tracking-widest leading-none ${theme.text}`}>
            {game.category}
          </span>
          <span className="text-[9px] font-bold text-zinc-600 font-mono">
            ID: {game.id.toUpperCase()}
          </span>
        </div>

        <h4 className="text-sm font-black tracking-wide text-white group-hover:text-amber-400 transition duration-200 mt-2 line-clamp-1 uppercase">
          {game.title}
        </h4>
        
        <p className="text-xs font-semibold leading-relaxed text-zinc-400 mt-1.5 line-clamp-2">
          {game.description}
        </p>

        {/* Play Action Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
          <div className="text-[9px] font-black text-zinc-600 uppercase tracking-widest font-mono">
            {(game.playCount / 1000).toFixed(1)}K RUNS
          </div>
          <button 
            className="flex items-center gap-1 text-[11px] font-black text-red-500 group-hover:text-red-400 uppercase tracking-wider transition-colors duration-200"
          >
            Play Now
            <Play className="h-2.5 w-2.5 fill-current ml-0.5" />
          </button>
        </div>
      </div>

    </div>
  );
}

// Utility mapper to render representative emojis based on category or specific name
function getCategoryEmoji(category: string, title: string): string {
  const t = title.toLowerCase();
  if (t.includes('flight')) return '🚀';
  if (t.includes('mines')) return '💎';
  if (t.includes('plinko')) return '🎯';
  if (t.includes('bottle')) return '🍾';
  if (t.includes('coin')) return '🪙';
  if (t.includes('color')) return '🎨';
  if (t.includes('number')) return '🔢';
  if (t.includes('dice')) return '🎲';
  if (t.includes('wheel')) return '🎡';
  if (t.includes('card')) return '🃏';
  if (t.includes('memory')) return '🧠';
  if (t.includes('treasure')) return '🏴‍☠️';
  if (t.includes('goal')) return '⚽';
  if (t.includes('rocket')) return '🌌';
  if (t.includes('racing')) return '🏎️';
  if (t.includes('fish')) return '🎣';
  if (t.includes('fruit')) return '🍉';
  if (t.includes('bubble')) return '🔮';
  if (t.includes('brick')) return '🧱';
  if (t.includes('jewel')) return '💍';

  switch (category) {
    case 'Crash Games': return '🚀';
    case 'Arcade Games': return '👾';
    case 'Card Games': return '🃏';
    case 'Dice Games': return '🎲';
    case 'Plinko Games': return '🎯';
    case 'Mines Games': return '💎';
    case 'Slots': return '🎰';
    case 'Virtual Sports': return '🏇';
    case 'Sports Skill Games': return '⚽';
    case 'Racing Games': return '🏎️';
    case 'Puzzle Games': return '🧩';
    case 'Lucky Wheel Games': return '🎡';
    case 'Coin Flip Games': return '🪙';
    case 'Number Prediction Games': return '🔢';
    case 'Memory Games': return '🧠';
    case 'Quick Games': return '⚡';
    default: return '🎮';
  }
}

