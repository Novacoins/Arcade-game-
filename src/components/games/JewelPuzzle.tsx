/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import {
  Sparkles,
  Star,
  Trophy,
  Zap,
  RefreshCw,
  Flame,
  Volume2,
  VolumeX,
  HelpCircle,
  Play,
  RotateCcw,
  Gift,
  Map,
  Pause,
  X,
  Check,
  ChevronRight,
  ShieldAlert,
  Coins,
  Heart,
  Wand2,
  Hammer,
  Bomb,
  Shuffle,
  Undo2,
  Award,
  Palette,
  Grid,
  Settings,
  Eye,
  Rocket,
  Sun,
  Crown,
  Lightbulb
} from 'lucide-react';

interface PuzzleGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// 1. GEM DEFINITIONS & PIECE PACKS
// ==========================================
export type GemType =
  | 'blue_diamond'
  | 'ruby_heart'
  | 'golden_star'
  | 'emerald_gem'
  | 'purple_crystal'
  | 'ice_crystal'
  | 'ring_jewel'
  | 'bonus_crystal'
  // Power Gems
  | 'bomb_gem'
  | 'mega_bomb'
  | 'rainbow_gem'
  | 'lightning_gem'
  | 'fire_gem'
  | 'ice_breaker'
  | 'rocket_h'
  | 'rocket_v'
  | 'magic_orb'
  | 'diamond_storm';

export interface GemConfig {
  type: GemType;
  name: string;
  char: string;
  color: string;
  secondaryColor: string;
  glow: string;
  isSpecial?: boolean;
}

export const GEMS_CONFIG: Record<string, GemConfig> = {
  blue_diamond: {
    type: 'blue_diamond',
    name: 'Blue Diamond',
    char: '💎',
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.6)',
  },
  ruby_heart: {
    type: 'ruby_heart',
    name: 'Ruby Heart',
    char: '❤️',
    color: '#f43f5e',
    secondaryColor: '#be123c',
    glow: 'rgba(244, 63, 94, 0.6)',
  },
  golden_star: {
    type: 'golden_star',
    name: 'Golden Star',
    char: '⭐',
    color: '#fbbf24',
    secondaryColor: '#b45309',
    glow: 'rgba(251, 191, 36, 0.6)',
  },
  emerald_gem: {
    type: 'emerald_gem',
    name: 'Emerald',
    char: '💚',
    color: '#10b981',
    secondaryColor: '#047857',
    glow: 'rgba(16, 185, 129, 0.6)',
  },
  purple_crystal: {
    type: 'purple_crystal',
    name: 'Purple Crystal',
    char: '💜',
    color: '#c084fc',
    secondaryColor: '#7e22ce',
    glow: 'rgba(192, 132, 252, 0.6)',
  },
  ice_crystal: {
    type: 'ice_crystal',
    name: 'Ice Crystal',
    char: '❄️',
    color: '#06b6d4',
    secondaryColor: '#0e7490',
    glow: 'rgba(6, 182, 212, 0.6)',
  },
  ring_jewel: {
    type: 'ring_jewel',
    name: 'Ring Jewel',
    char: '💍',
    color: '#e0e7ff',
    secondaryColor: '#6366f1',
    glow: 'rgba(224, 231, 255, 0.6)',
  },
  bonus_crystal: {
    type: 'bonus_crystal',
    name: 'Bonus Crystal',
    char: '✨',
    color: '#f472b6',
    secondaryColor: '#db2777',
    glow: 'rgba(244, 114, 182, 0.6)',
  },

  // Special Power Gems
  bomb_gem: {
    type: 'bomb_gem',
    name: 'Bomb Gem',
    char: '💣',
    color: '#ef4444',
    secondaryColor: '#991b1b',
    glow: 'rgba(239, 68, 68, 0.9)',
    isSpecial: true,
  },
  mega_bomb: {
    type: 'mega_bomb',
    name: 'Mega Bomb',
    char: '💥',
    color: '#dc2626',
    secondaryColor: '#7f1d1d',
    glow: 'rgba(220, 38, 38, 0.95)',
    isSpecial: true,
  },
  rainbow_gem: {
    type: 'rainbow_gem',
    name: 'Rainbow Gem',
    char: '🌈',
    color: '#38bdf8',
    secondaryColor: '#a855f7',
    glow: 'rgba(236, 72, 153, 0.9)',
    isSpecial: true,
  },
  lightning_gem: {
    type: 'lightning_gem',
    name: 'Lightning Gem',
    char: '⚡',
    color: '#facc15',
    secondaryColor: '#ca8a04',
    glow: 'rgba(250, 204, 21, 0.9)',
    isSpecial: true,
  },
  fire_gem: {
    type: 'fire_gem',
    name: 'Fire Gem',
    char: '🔥',
    color: '#f97316',
    secondaryColor: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.9)',
    isSpecial: true,
  },
  ice_breaker: {
    type: 'ice_breaker',
    name: 'Ice Breaker',
    char: '🔨',
    color: '#0284c7',
    secondaryColor: '#0369a1',
    glow: 'rgba(2, 132, 199, 0.9)',
    isSpecial: true,
  },
  rocket_h: {
    type: 'rocket_h',
    name: 'Horizontal Rocket',
    char: '🚀',
    color: '#a855f7',
    secondaryColor: '#7e22ce',
    glow: 'rgba(168, 85, 247, 0.9)',
    isSpecial: true,
  },
  rocket_v: {
    type: 'rocket_v',
    name: 'Vertical Rocket',
    char: '🚀',
    color: '#ec4899',
    secondaryColor: '#be185d',
    glow: 'rgba(236, 72, 153, 0.9)',
    isSpecial: true,
  },
  magic_orb: {
    type: 'magic_orb',
    name: 'Magic Orb',
    char: '🔮',
    color: '#8b5cf6',
    secondaryColor: '#6d28d9',
    glow: 'rgba(139, 92, 246, 0.9)',
    isSpecial: true,
  },
  diamond_storm: {
    type: 'diamond_storm',
    name: 'Diamond Storm',
    char: '🌩️',
    color: '#06b6d4',
    secondaryColor: '#0e7490',
    glow: 'rgba(6, 182, 212, 0.9)',
    isSpecial: true,
  },
};

const BASE_GEM_TYPES = [
  'blue_diamond',
  'ruby_heart',
  'golden_star',
  'emerald_gem',
  'purple_crystal',
  'ice_crystal',
];

// Piece Pack Skins mapping
export interface PiecePack {
  id: string;
  name: string;
  icon: string;
  pieces: Record<string, string>; // maps base type to emoji/icon
}

export const PIECE_PACKS: Record<string, PiecePack> = {
  jewels: {
    id: 'jewels',
    name: 'Classic Jewels',
    icon: '💎',
    pieces: {
      blue_diamond: '💎',
      ruby_heart: '❤️',
      golden_star: '⭐',
      emerald_gem: '💚',
      purple_crystal: '💜',
      ice_crystal: '❄️',
    },
  },
  animals: {
    id: 'animals',
    name: 'Cute Animals',
    icon: '🦊',
    pieces: {
      blue_diamond: '🐬',
      ruby_heart: '🦊',
      golden_star: '🦁',
      emerald_gem: '🐸',
      purple_crystal: '🦄',
      ice_crystal: '企',
    },
  },
  emojis: {
    id: 'emojis',
    name: 'Emoji Pack',
    icon: '😎',
    pieces: {
      blue_diamond: '😎',
      ruby_heart: '😍',
      golden_star: '🤩',
      emerald_gem: '🤑',
      purple_crystal: '🥳',
      ice_crystal: '🥶',
    },
  },
  fruits: {
    id: 'fruits',
    name: 'Juicy Fruits',
    icon: '🍓',
    pieces: {
      blue_diamond: '🫐',
      ruby_heart: '🍓',
      golden_star: '🍋',
      emerald_gem: '🍏',
      purple_crystal: '🍇',
      ice_crystal: '🥥',
    },
  },
  candy: {
    id: 'candy',
    name: 'Candy Land',
    icon: '🍬',
    pieces: {
      blue_diamond: '🫐',
      ruby_heart: '🍭',
      golden_star: '🍯',
      emerald_gem: '🧃',
      purple_crystal: '🍬',
      ice_crystal: '🧁',
    },
  },
  cookies: {
    id: 'cookies',
    name: 'Bakery Cookies',
    icon: '🍪',
    pieces: {
      blue_diamond: '🍩',
      ruby_heart: '🥧',
      golden_star: '🥠',
      emerald_gem: '🍰',
      purple_crystal: '🥐',
      ice_crystal: '🍪',
    },
  },
  flowers: {
    id: 'flowers',
    name: 'Garden Flowers',
    icon: '🌸',
    pieces: {
      blue_diamond: '🪻',
      ruby_heart: '🌹',
      golden_star: '🌻',
      emerald_gem: '🌱',
      purple_crystal: '🪷',
      ice_crystal: '🌸',
    },
  },
  sea: {
    id: 'sea',
    name: 'Sea Animals',
    icon: '🐙',
    pieces: {
      blue_diamond: '🐋',
      ruby_heart: '🦀',
      golden_star: '🐠',
      emerald_gem: '🐢',
      purple_crystal: '🐙',
      ice_crystal: '🦭',
    },
  },
  planets: {
    id: 'planets',
    name: 'Space Planets',
    icon: '🪐',
    pieces: {
      blue_diamond: '🌍',
      ruby_heart: '🔴',
      golden_star: '☀️',
      emerald_gem: '🟢',
      purple_crystal: '🪐',
      ice_crystal: '🌙',
    },
  },
  stars: {
    id: 'stars',
    name: 'Cosmic Stars',
    icon: '✨',
    pieces: {
      blue_diamond: '🌌',
      ruby_heart: '💖',
      golden_star: '⭐',
      emerald_gem: '❇️',
      purple_crystal: '✨',
      ice_crystal: '💫',
    },
  },
  chess: {
    id: 'chess',
    name: 'Chess Pieces',
    icon: '👑',
    pieces: {
      blue_diamond: '♟️',
      ruby_heart: '♝',
      golden_star: '👑',
      emerald_gem: '♞',
      purple_crystal: '♛',
      ice_crystal: '♜',
    },
  },
  monsters: {
    id: 'monsters',
    name: 'Fantasy Monsters',
    icon: '👾',
    pieces: {
      blue_diamond: '🤖',
      ruby_heart: '👹',
      golden_star: '🐲',
      emerald_gem: '🐸',
      purple_crystal: '👾',
      ice_crystal: '👻',
    },
  },
  christmas: {
    id: 'christmas',
    name: 'Christmas Pack',
    icon: '🎄',
    pieces: {
      blue_diamond: '🔔',
      ruby_heart: '🎅',
      golden_star: '⭐',
      emerald_gem: '🎄',
      purple_crystal: '🎁',
      ice_crystal: '☃️',
    },
  },
};

// ==========================================
// 2. BACKGROUND THEMES & ENVIRONMENT EFFECTS
// ==========================================
export interface BackgroundEnv {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  particleType: 'dust' | 'snow' | 'fireflies' | 'stars' | 'leaves' | 'bubbles' | 'sparkles';
  particleColor: string;
  accentColor: string;
  description: string;
}

export const ENVIRONMENTS: Record<string, BackgroundEnv> = {
  cave: {
    id: 'cave',
    name: 'Magic Jewel Cave',
    icon: '🔮',
    bgGradient: 'radial-gradient(circle at 50% 30%, #3b0764 0%, #1e1b4b 60%, #090514 100%)',
    particleType: 'dust',
    particleColor: '#c084fc',
    accentColor: '#a855f7',
    description: 'Enchanted cavern glistening with purple amethyst geodes and glowing crystal dust.',
  },
  temple: {
    id: 'temple',
    name: 'Crystal Temple',
    icon: '🏛️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #0c4a6e 0%, #0f172a 60%, #030712 100%)',
    particleType: 'sparkles',
    particleColor: '#38bdf8',
    accentColor: '#0284c7',
    description: 'Sacred marble sanctuary illuminated by shafts of cyan ethereal starlight.',
  },
  castle: {
    id: 'castle',
    name: 'Treasure Castle',
    icon: '🏰',
    bgGradient: 'radial-gradient(circle at 50% 30%, #451a03 0%, #1c1917 60%, #0c0a09 100%)',
    particleType: 'sparkles',
    particleColor: '#fbbf24',
    accentColor: '#d97706',
    description: 'Royal vault filled with mountains of golden coins and sparkling heirloom jewels.',
  },
  forest: {
    id: 'forest',
    name: 'Magic Forest',
    icon: '🌲',
    bgGradient: 'radial-gradient(circle at 50% 30%, #064e3b 0%, #022c22 60%, #02120d 100%)',
    particleType: 'fireflies',
    particleColor: '#34d399',
    accentColor: '#059669',
    description: 'Bioluminescent flora and magical emerald fireflies drifting through twilight glades.',
  },
  frozen: {
    id: 'frozen',
    name: 'Frozen Kingdom',
    icon: '❄️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #164e63 0%, #082f49 60%, #02131e 100%)',
    particleType: 'snow',
    particleColor: '#a5f3fc',
    accentColor: '#0284c7',
    description: 'Crystalline ice palace beneath dancing aurora borealis lights.',
  },
  pirate: {
    id: 'pirate',
    name: 'Pirate Island',
    icon: '🏴‍☠️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #78350f 0%, #292524 60%, #0c0a09 100%)',
    particleType: 'sparkles',
    particleColor: '#f59e0b',
    accentColor: '#d97706',
    description: 'Sunken shipwreck laden with doubloons and rubies.',
  },
  ocean: {
    id: 'ocean',
    name: 'Ocean World',
    icon: '🌊',
    bgGradient: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #172554 60%, #030712 100%)',
    particleType: 'bubbles',
    particleColor: '#60a5fa',
    accentColor: '#2563eb',
    description: 'Underwater coral reef bathed in shimmering turquoise water reflections.',
  },
  space: {
    id: 'space',
    name: 'Space Galaxy',
    icon: '🌌',
    bgGradient: 'radial-gradient(circle at 50% 30%, #581c87 0%, #2e1065 60%, #0f051d 100%)',
    particleType: 'stars',
    particleColor: '#e879f9',
    accentColor: '#a855f7',
    description: 'Deep cosmic nebula with shooting stars and planetary rings.',
  },
  candy: {
    id: 'candy',
    name: 'Candy Land',
    icon: '🍬',
    bgGradient: 'radial-gradient(circle at 50% 30%, #831843 0%, #500724 60%, #1f020e 100%)',
    particleType: 'sparkles',
    particleColor: '#f472b6',
    accentColor: '#db2777',
    description: 'Sugar peaks and marshmallow clouds dripping with sweet syrup.',
  },
  egypt: {
    id: 'egypt',
    name: 'Ancient Egypt',
    icon: '🐪',
    bgGradient: 'radial-gradient(circle at 50% 30%, #713f12 0%, #3f2305 60%, #1a0e02 100%)',
    particleType: 'dust',
    particleColor: '#facc15',
    accentColor: '#ca8a04',
    description: 'Golden pyramid tomb guarded by glowing scarab hieroglyphs.',
  },
  neon: {
    id: 'neon',
    name: 'Neon City',
    icon: '🏙️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #831843 0%, #312e81 60%, #030712 100%)',
    particleType: 'sparkles',
    particleColor: '#22d3ee',
    accentColor: '#06b6d4',
    description: 'Cyberpunk metropolis pulsating with vibrant neon lasers.',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Kingdom',
    icon: '🐉',
    bgGradient: 'radial-gradient(circle at 50% 30%, #7f1d1d 0%, #450a0a 60%, #180202 100%)',
    particleType: 'dust',
    particleColor: '#ef4444',
    accentColor: '#dc2626',
    description: 'Volcanic lair filled with fiery embers and ancient dragon hoards.',
  },
};

// ==========================================
// 3. LEVEL & OBSTACLE CONFIG GENERATOR
// ==========================================
export interface LevelConfig {
  levelNumber: number;
  envId: string;
  moves: number;
  targetScore: number;
  objectives: {
    gemType: string;
    count: number;
    current: number;
  }[];
  iceBlocksCount: number;
  stoneBlocksCount: number;
}

export const generateLevelConfig = (lvl: number): LevelConfig => {
  const envKeys = Object.keys(ENVIRONMENTS);
  const envId = envKeys[(lvl - 1) % envKeys.length];
  const moves = Math.max(16, 30 - Math.floor(lvl / 3));
  const targetScore = 4000 + lvl * 3000;

  const gemTypes = [...BASE_GEM_TYPES];
  const primaryGem1 = gemTypes[(lvl - 1) % gemTypes.length];
  const primaryGem2 = gemTypes[lvl % gemTypes.length];

  const iceCount = lvl > 2 ? Math.min(14, Math.floor(lvl * 1.6)) : 0;
  const stoneCount = lvl > 4 ? Math.min(6, Math.floor(lvl * 0.8)) : 0;

  const objectives = [
    { gemType: primaryGem1, count: 12 + lvl * 2, current: 0 },
    { gemType: primaryGem2, count: 10 + lvl * 2, current: 0 },
  ];

  if (iceCount > 0) {
    objectives.push({ gemType: 'ice_block', count: iceCount, current: 0 });
  }
  if (stoneCount > 0) {
    objectives.push({ gemType: 'stone_block', count: stoneCount, current: 0 });
  }

  return {
    levelNumber: lvl,
    envId,
    moves,
    targetScore,
    objectives,
    iceBlocksCount: iceCount,
    stoneBlocksCount: stoneCount,
  };
};

// ==========================================
// 4. HIGH-QUALITY GEM SVG RENDERER
// ==========================================
export function RenderGemSvg({
  type,
  packId = 'jewels',
  isIce,
  isStone,
  colorBlindMode = false,
}: {
  type: string;
  packId?: string;
  isIce?: boolean;
  isStone?: boolean;
  colorBlindMode?: boolean;
}) {
  const config = GEMS_CONFIG[type] || GEMS_CONFIG['blue_diamond'];
  const pack = PIECE_PACKS[packId] || PIECE_PACKS.jewels;
  const packChar = pack.pieces[type];

  // If using non-default pack, display styled emoji
  if (packId !== 'jewels' && packChar && !config.isSpecial) {
    return (
      <div className="relative w-full h-full flex items-center justify-center select-none pointer-events-none transform transition hover:scale-110">
        <span className="text-3xl drop-shadow-[0_4px_8px_rgba(0,0,0,0.6)]">{packChar}</span>
        {isIce && (
          <div className="absolute inset-0 bg-cyan-300/40 border-2 border-cyan-200/80 rounded-2xl backdrop-blur-[1px] shadow-inner pointer-events-none z-20 flex items-center justify-center">
            <span className="text-[10px] absolute top-1 left-1">🧊</span>
          </div>
        )}
        {isStone && (
          <div className="absolute inset-0 bg-zinc-700/80 border-2 border-zinc-500 rounded-2xl shadow-inner pointer-events-none z-20 flex items-center justify-center">
            <span className="text-[10px] absolute top-1 left-1">🪨</span>
          </div>
        )}
      </div>
    );
  }

  // Standard Jewels SVG
  return (
    <div className="relative w-full h-full flex items-center justify-center p-0.5 select-none pointer-events-none">
      {/* Outer ambient glow */}
      <div
        className="absolute inset-1 rounded-2xl blur-sm opacity-50"
        style={{ backgroundColor: config.color }}
      />

      {/* SVG Gem Geometry */}
      <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg relative z-10">
        <defs>
          <radialGradient id={`rad_${type}`} cx="35%" cy="30%" r="65%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="45%" stopColor={config.color} />
            <stop offset="100%" stopColor={config.secondaryColor} />
          </radialGradient>

          <filter id={`glow_${type}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {type === 'blue_diamond' && (
          <g filter={`url(#glow_${type})`}>
            <polygon points="50,8 88,38 50,92 12,38" fill={`url(#rad_${type})`} />
            <polygon points="50,8 88,38 50,45" fill="#ffffff" opacity="0.4" />
            <polygon points="12,38 50,8 50,45" fill="#ffffff" opacity="0.6" />
            <polygon points="50,45 88,38 50,92" fill={config.secondaryColor} opacity="0.5" />
            <ellipse cx="42" cy="26" rx="8" ry="4" fill="#ffffff" opacity="0.8" transform="rotate(-20 42 26)" />
          </g>
        )}

        {type === 'ruby_heart' && (
          <g filter={`url(#glow_${type})`}>
            <path
              d="M 50,88 C 10,58 10,25 32,18 C 44,15 50,28 50,28 C 50,28 56,15 68,18 C 90,25 90,58 50,88 Z"
              fill={`url(#rad_${type})`}
            />
            <path d="M 28,24 C 20,30 20,46 28,50" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.75" />
          </g>
        )}

        {type === 'golden_star' && (
          <g filter={`url(#glow_${type})`}>
            <polygon points="50,8 63,33 90,36 70,56 76,83 50,69 24,83 30,56 10,36 37,33" fill={`url(#rad_${type})`} />
            <polygon points="50,8 63,33 50,50 37,33" fill="#ffffff" opacity="0.5" />
          </g>
        )}

        {type === 'emerald_gem' && (
          <g filter={`url(#glow_${type})`}>
            <polygon points="30,10 70,10 90,30 90,70 70,90 30,90 10,70 10,30" fill={`url(#rad_${type})`} />
            <polygon points="38,20 62,20 78,32 78,68 62,80 38,80 22,68 22,32" fill="#ffffff" opacity="0.25" />
            <polygon points="30,10 70,10 62,20 38,20" fill="#ffffff" opacity="0.7" />
          </g>
        )}

        {type === 'purple_crystal' && (
          <g filter={`url(#glow_${type})`}>
            <path d="M 50,8 L 88,42 Q 88,88 50,92 Q 12,88 12,42 Z" fill={`url(#rad_${type})`} />
            <path d="M 50,8 L 50,92" stroke="#ffffff" strokeWidth="2.5" opacity="0.4" />
            <circle cx="36" cy="32" r="6" fill="#ffffff" opacity="0.8" />
          </g>
        )}

        {type === 'ice_crystal' && (
          <g filter={`url(#glow_${type})`}>
            <polygon points="50,12 82,30 82,70 50,88 18,70 18,30" fill={`url(#rad_${type})`} />
            <line x1="50" y1="12" x2="50" y2="88" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
            <line x1="18" y1="30" x2="82" y2="70" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
            <line x1="18" y1="70" x2="82" y2="30" stroke="#ffffff" strokeWidth="4" opacity="0.8" />
          </g>
        )}

        {/* Special Power Gems */}
        {type === 'bomb_gem' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="54" r="36" fill={`url(#rad_${type})`} />
            <path d="M 50,18 Q 65,8 75,16" fill="none" stroke="#f59e0b" strokeWidth="5" strokeLinecap="round" />
            <text x="50" y="66" fontSize="32" textAnchor="middle">💣</text>
          </g>
        )}

        {type === 'mega_bomb' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="40" fill={`url(#rad_${type})`} />
            <text x="50" y="62" fontSize="34" textAnchor="middle">💥</text>
          </g>
        )}

        {type === 'rainbow_gem' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="40" fill="url(#rad_bonus_crystal)" />
            <circle cx="50" cy="50" r="28" fill="none" stroke="#ffffff" strokeWidth="6" strokeDasharray="8 4" className="animate-spin" />
            <text x="50" y="60" fontSize="32" textAnchor="middle">🌈</text>
          </g>
        )}

        {type === 'lightning_gem' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="38" fill={`url(#rad_${type})`} />
            <text x="50" y="62" fontSize="34" textAnchor="middle">⚡</text>
          </g>
        )}

        {type === 'fire_gem' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="38" fill={`url(#rad_${type})`} />
            <text x="50" y="62" fontSize="34" textAnchor="middle">🔥</text>
          </g>
        )}

        {type === 'rocket_h' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="38" fill={`url(#rad_${type})`} />
            <text x="50" y="60" fontSize="30" textAnchor="middle" transform="rotate(-90 50 50)">🚀</text>
          </g>
        )}

        {type === 'rocket_v' && (
          <g filter={`url(#glow_${type})`}>
            <circle cx="50" cy="50" r="38" fill={`url(#rad_${type})`} />
            <text x="50" y="60" fontSize="30" textAnchor="middle">🚀</text>
          </g>
        )}
      </svg>

      {/* Color Blind Accessibility Mode Symbol */}
      {colorBlindMode && (
        <span className="absolute bottom-1 right-1 text-[9px] font-black text-white bg-black/60 px-1 rounded">
          {config.char}
        </span>
      )}

      {/* Ice Block Frame Overlay */}
      {isIce && (
        <div className="absolute inset-0 bg-cyan-300/40 border-2 border-cyan-200/80 rounded-2xl backdrop-blur-[1px] shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <span className="text-[10px] absolute top-1 left-1">🧊</span>
        </div>
      )}

      {/* Stone Block Frame Overlay */}
      {isStone && (
        <div className="absolute inset-0 bg-zinc-700/80 border-2 border-zinc-500 rounded-2xl shadow-inner pointer-events-none z-20 flex items-center justify-center">
          <span className="text-[10px] absolute top-1 left-1">🪨</span>
        </div>
      )}
    </div>
  );
}

// ==========================================
// 5. MAIN JEWEL PUZZLE GAME COMPONENT
// ==========================================
export function JewelPuzzle({ coins, onGameWin, onGameLose }: PuzzleGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Game Configuration & Level State
  const [bet, setBet] = useState(10);
  const [currentLevel, setCurrentLevel] = useState<number>(() => {
    return parseInt(localStorage.getItem('jewel_puzzle_level') || '1', 10);
  });
  const [levelConfig, setLevelConfig] = useState<LevelConfig>(() => generateLevelConfig(currentLevel));

  // Themes & Piece Pack Selector
  const [activeEnvId, setActiveEnvId] = useState<string>(levelConfig.envId);
  const [activePackId, setActivePackId] = useState<string>('jewels');

  // Game Engine State
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'paused' | 'victory' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [movesLeft, setMovesLeft] = useState(25);
  const [lives, setLives] = useState(5);
  const [stars, setStars] = useState(0);
  const [xp, setXp] = useState(120);

  // Settings & Accessibility
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [colorBlindMode, setColorBlindMode] = useState(false);

  // Boosters Inventory
  const [boosters, setBoosters] = useState<{ hammer: number; bomb: number; shuffle: number; wand: number; undo: number; hint: number }>({
    hammer: 3,
    bomb: 2,
    shuffle: 3,
    wand: 1,
    undo: 2,
    hint: 5,
  });
  const [activeBooster, setActiveBooster] = useState<'hammer' | 'bomb' | 'wand' | null>(null);

  // Grid Dimensions: 7x7 (49 tiles)
  const GRID_SIZE = 7;
  const TOTAL_TILES = 49;
  const [grid, setGrid] = useState<string[]>(Array(TOTAL_TILES).fill(''));
  const [iceGrid, setIceGrid] = useState<boolean[]>(Array(TOTAL_TILES).fill(false));
  const [stoneGrid, setStoneGrid] = useState<boolean[]>(Array(TOTAL_TILES).fill(false));
  const [selectedIdx, setSelectedIdx] = useState<number | null>(null);
  const [hintIndices, setHintIndices] = useState<[number, number] | null>(null);

  // Undo History Stack
  const [gridHistory, setGridHistory] = useState<{ grid: string[]; moves: number; score: number }[]>([]);

  // Level Objectives Tracking
  const [objectives, setObjectives] = useState<{ gemType: string; count: number; current: number }[]>([]);

  // Combos & Chains
  const [comboChain, setComboChain] = useState(0);
  const [bestChain, setBestChain] = useState(0);

  // Modal Panels
  const [showLevelMap, setShowLevelMap] = useState(false);
  const [showDailyWheel, setShowDailyWheel] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showPackModal, setShowPackModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [wheelSpinning, setWheelSpinning] = useState(false);

  // Canvas Particle & Shake System
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<any[]>([]);
  const floatingTextsRef = useRef<any[]>([]);
  const screenShakeRef = useRef<number>(0);
  const animFrameRef = useRef<number | null>(null);

  // Touch Swipe Handling Ref
  const touchStartRef = useRef<{ x: number; y: number; idx: number } | null>(null);

  // Sync Level Config
  useEffect(() => {
    const cfg = generateLevelConfig(currentLevel);
    setLevelConfig(cfg);
    setActiveEnvId(cfg.envId);
    setObjectives(cfg.objectives.map((o) => ({ ...o, current: 0 })));
    setMovesLeft(cfg.moves);
  }, [currentLevel]);

  // Canvas 60 FPS Animation Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 500;
    canvas.height = 500;

    const renderLoop = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle Particle FX
      const pList = particlesRef.current;
      for (let i = pList.length - 1; i >= 0; i--) {
        const p = pList[i];
        p.vy += 0.12;
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.save();
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.life / 35);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life <= 0) pList.splice(i, 1);
      }

      // Floating Score & Combo Texts
      const fList = floatingTextsRef.current;
      for (let i = fList.length - 1; i >= 0; i--) {
        const ft = fList[i];
        ft.y -= 1.4;
        ft.alpha -= 0.02;

        ctx.save();
        ctx.font = '900 24px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.shadowColor = ft.color;
        ctx.shadowBlur = 12;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        if (ft.alpha <= 0) fList.splice(i, 1);
      }

      animFrameRef.current = requestAnimationFrame(renderLoop);
    };

    renderLoop();

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  // Helper: Create Random Grid without initial 3-matches
  const createInitialGrid = (iceCount: number, stoneCount: number) => {
    let tempGrid = Array(TOTAL_TILES).fill('');
    const availableTypes = BASE_GEM_TYPES;

    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const idx = r * GRID_SIZE + c;
        let possible = [...availableTypes];

        if (c >= 2) {
          const l1 = tempGrid[idx - 1];
          const l2 = tempGrid[idx - 2];
          if (l1 === l2) possible = possible.filter((t) => t !== l1);
        }
        if (r >= 2) {
          const t1 = tempGrid[idx - GRID_SIZE];
          const t2 = tempGrid[idx - GRID_SIZE * 2];
          if (t1 === t2) possible = possible.filter((t) => t !== t1);
        }

        tempGrid[idx] = possible[Math.floor(Math.random() * possible.length)];
      }
    }

    // Place Ice Blocks
    let tempIce = Array(TOTAL_TILES).fill(false);
    let placedIce = 0;
    while (placedIce < iceCount) {
      const randIdx = Math.floor(Math.random() * TOTAL_TILES);
      if (!tempIce[randIdx]) {
        tempIce[randIdx] = true;
        placedIce++;
      }
    }

    // Place Stone Blocks
    let tempStone = Array(TOTAL_TILES).fill(false);
    let placedStone = 0;
    while (placedStone < stoneCount) {
      const randIdx = Math.floor(Math.random() * TOTAL_TILES);
      if (!tempIce[randIdx] && !tempStone[randIdx]) {
        tempStone[randIdx] = true;
        placedStone++;
      }
    }

    return { grid: tempGrid, ice: tempIce, stone: tempStone };
  };

  // Start Level Session
  const handleStartGame = () => {
    if (!validateAndDeductCoins(bet, 'Jewel Puzzle')) {
      return;
    }
    if (lives <= 0) {
      alert('No lives remaining! Refill lives using coins or wait.');
      return;
    }

    if (soundEnabled) synth.playClick();

    const { grid: initGrid, ice: initIce, stone: initStone } = createInitialGrid(
      levelConfig.iceBlocksCount,
      levelConfig.stoneBlocksCount
    );
    setGrid(initGrid);
    setIceGrid(initIce);
    setStoneGrid(initStone);
    setScore(0);
    setStars(0);
    setMovesLeft(levelConfig.moves);
    setComboChain(0);
    setBestChain(0);
    setSelectedIdx(null);
    setActiveBooster(null);
    setGridHistory([]);
    setHintIndices(null);

    const resetObjs = levelConfig.objectives.map((o) => ({ ...o, current: 0 }));
    setObjectives(resetObjs);

    setGameState('playing');
  };

  // Trigger Match Canvas Visual FX & Haptic Feedback
  const triggerMatchFX = (index: number, color: string, pointsStr?: string) => {
    if (navigator.vibrate) navigator.vibrate([15, 30]);

    const row = Math.floor(index / GRID_SIZE);
    const col = index % GRID_SIZE;
    const px = col * (450 / GRID_SIZE) + 35;
    const py = row * (450 / GRID_SIZE) + 35;

    for (let i = 0; i < 14; i++) {
      particlesRef.current.push({
        x: px,
        y: py,
        vx: (Math.random() - 0.5) * 9,
        vy: (Math.random() - 0.5) * 9 - 2,
        radius: Math.random() * 5 + 2,
        color: color || '#fbbf24',
        life: 30 + Math.random() * 15,
      });
    }

    if (pointsStr) {
      floatingTextsRef.current.push({
        x: px,
        y: py - 12,
        text: pointsStr,
        color: color || '#facc15',
        alpha: 1,
      });
    }
  };

  // Check Match-3 Grid Patterns
  const checkMatchesOnGrid = (currentGrid: string[]) => {
    const matches = Array(TOTAL_TILES).fill(false);
    let foundMatch = false;

    // Horizontal Row Check
    for (let r = 0; r < GRID_SIZE; r++) {
      for (let c = 0; c < GRID_SIZE - 2; c++) {
        const i1 = r * GRID_SIZE + c;
        const i2 = i1 + 1;
        const i3 = i1 + 2;
        if (
          currentGrid[i1] &&
          currentGrid[i1] === currentGrid[i2] &&
          currentGrid[i1] === currentGrid[i3]
        ) {
          matches[i1] = true;
          matches[i2] = true;
          matches[i3] = true;
          foundMatch = true;
        }
      }
    }

    // Vertical Column Check
    for (let r = 0; r < GRID_SIZE - 2; r++) {
      for (let c = 0; c < GRID_SIZE; c++) {
        const i1 = r * GRID_SIZE + c;
        const i2 = i1 + GRID_SIZE;
        const i3 = i1 + GRID_SIZE * 2;
        if (
          currentGrid[i1] &&
          currentGrid[i1] === currentGrid[i2] &&
          currentGrid[i1] === currentGrid[i3]
        ) {
          matches[i1] = true;
          matches[i2] = true;
          matches[i3] = true;
          foundMatch = true;
        }
      }
    }

    return { foundMatch, matches };
  };

  // Grid Adjacency check
  const isAdjacent = (idx1: number, idx2: number) => {
    const r1 = Math.floor(idx1 / GRID_SIZE);
    const c1 = idx1 % GRID_SIZE;
    const r2 = Math.floor(idx2 / GRID_SIZE);
    const c2 = idx2 % GRID_SIZE;
    return (
      (Math.abs(r1 - r2) === 1 && c1 === c2) ||
      (Math.abs(c1 - c2) === 1 && r1 === r2)
    );
  };

  // Swap Gems Logic
  const handleSwapGems = async (idx1: number, idx2: number) => {
    if (gameState !== 'playing') return;

    if (soundEnabled) synth.playCard();

    // Save state into undo history stack
    setGridHistory((prev) => [...prev, { grid: [...grid], moves: movesLeft, score }]);

    const newGrid = [...grid];
    const gemA = newGrid[idx1];
    const gemB = newGrid[idx2];

    // Check Special Gem Combination Trigger (e.g. Bomb + Rainbow)
    if (GEMS_CONFIG[gemA]?.isSpecial && GEMS_CONFIG[gemB]?.isSpecial) {
      triggerSpecialComboEffect(idx1, idx2, gemA, gemB);
      return;
    }

    newGrid[idx1] = gemB;
    newGrid[idx2] = gemA;

    const { foundMatch } = checkMatchesOnGrid(newGrid);

    if (foundMatch) {
      setGrid(newGrid);
      setSelectedIdx(null);
      setMovesLeft((prev) => Math.max(0, prev - 1));

      // Process Cascading Combo Matches
      await processMatchesCascade(newGrid, iceGrid, stoneGrid, 1);
    } else {
      // Invalid Swap
      if (soundEnabled) synth.playTick();
      setSelectedIdx(null);
    }
  };

  // Trigger Special Combo Cinematic Clear (Bomb + Bomb, Lightning + Rainbow, etc.)
  const triggerSpecialComboEffect = (idx1: number, idx2: number, gemA: string, gemB: string) => {
    if (soundEnabled) synth.playExplode();

    const newGrid = [...grid];
    const newIce = [...iceGrid];
    const newStone = [...stoneGrid];

    triggerMatchFX(idx1, '#facc15', '💥 SUPER COMBO!');
    triggerMatchFX(idx2, '#facc15', '⚡ MEGA BLAST!');

    // Wipe half board
    for (let i = 0; i < TOTAL_TILES; i++) {
      if (Math.random() > 0.3) {
        triggerMatchFX(i, '#ec4899');
        newGrid[i] = '';
        newIce[i] = false;
        newStone[i] = false;
      }
    }

    setGrid(newGrid);
    setIceGrid(newIce);
    setStoneGrid(newStone);
    setMovesLeft((m) => Math.max(0, m - 1));

    setTimeout(() => {
      processMatchesCascade(newGrid, newIce, newStone, 1);
    }, 400);
  };

  // Waterfall and drop system for cascading combos
  const processMatchesCascade = async (
    workingGrid: string[],
    workingIce: boolean[],
    workingStone: boolean[],
    chainLevel: number
  ) => {
    const { foundMatch, matches } = checkMatchesOnGrid(workingGrid);
    if (!foundMatch) {
      setComboChain(0);
      checkLevelStatus();
      return;
    }

    if (soundEnabled) synth.playCoin();
    setComboChain(chainLevel);
    setBestChain((prev) => Math.max(prev, chainLevel));

    const nextGrid = [...workingGrid];
    const nextIce = [...workingIce];
    const nextStone = [...workingStone];
    let matchedCount = 0;

    const matchedTypesCount: Record<string, number> = {};

    for (let i = 0; i < TOTAL_TILES; i++) {
      if (matches[i]) {
        const typeCleared = nextGrid[i];
        if (typeCleared) {
          matchedTypesCount[typeCleared] = (matchedTypesCount[typeCleared] || 0) + 1;
        }

        const gemCfg = GEMS_CONFIG[typeCleared];
        triggerMatchFX(i, gemCfg?.color || '#fbbf24', `+${60 * chainLevel}`);

        if (nextIce[i]) {
          nextIce[i] = false;
          matchedTypesCount['ice_block'] = (matchedTypesCount['ice_block'] || 0) + 1;
        }
        if (nextStone[i]) {
          nextStone[i] = false;
          matchedTypesCount['stone_block'] = (matchedTypesCount['stone_block'] || 0) + 1;
        }

        nextGrid[i] = ''; // Clear gem
        matchedCount++;
      }
    }

    // Update Level Objectives
    setObjectives((prevObjs) =>
      prevObjs.map((obj) => {
        const added = matchedTypesCount[obj.gemType] || 0;
        return {
          ...obj,
          current: Math.min(obj.count, obj.current + added),
        };
      })
    );

    // Score & XP Calculation
    const basePts = matchedCount * 70;
    const comboBonus = basePts * (chainLevel - 1) * 0.7;
    const finalPts = Math.floor(basePts + comboBonus);

    setScore((prev) => {
      const newScore = prev + finalPts;
      if (newScore >= levelConfig.targetScore * 1.5) setStars(3);
      else if (newScore >= levelConfig.targetScore) setStars(2);
      else if (newScore >= levelConfig.targetScore * 0.5) setStars(1);
      return newScore;
    });

    setXp((x) => x + matchedCount * 5);

    // Waterfall Downward Drop Refill
    for (let c = 0; c < GRID_SIZE; c++) {
      let emptyCount = 0;
      for (let r = GRID_SIZE - 1; r >= 0; r--) {
        const idx = r * GRID_SIZE + c;
        if (nextGrid[idx] === '') {
          emptyCount++;
        } else if (emptyCount > 0) {
          nextGrid[idx + emptyCount * GRID_SIZE] = nextGrid[idx];
          nextGrid[idx] = '';
        }
      }

      // Refill top row with standard or special power gems
      for (let e = 0; e < emptyCount; e++) {
        const idx = e * GRID_SIZE + c;
        // 8% chance to spawn special bomb/lightning power gem
        const isSpecialSpawn = Math.random() < 0.08;
        if (isSpecialSpawn) {
          const specials = ['bomb_gem', 'lightning_gem', 'rainbow_gem', 'rocket_h', 'rocket_v'];
          nextGrid[idx] = specials[Math.floor(Math.random() * specials.length)];
        } else {
          nextGrid[idx] = BASE_GEM_TYPES[Math.floor(Math.random() * BASE_GEM_TYPES.length)];
        }
      }
    }

    setGrid(nextGrid);
    setIceGrid(nextIce);
    setStoneGrid(nextStone);

    setTimeout(() => {
      processMatchesCascade(nextGrid, nextIce, nextStone, chainLevel + 1);
    }, 360);
  };

  // Check Level Victory / Game Over
  const checkLevelStatus = () => {
    const allObjectivesMet = objectives.every((o) => o.current >= o.count);

    if (allObjectivesMet) {
      if (soundEnabled) synth.playFanfare();
      setGameState('victory');

      const mult = parseFloat((1.5 + stars * 0.5 + currentLevel * 0.2).toFixed(2));
      const rewardCoins = Math.min(50, Math.floor(bet * mult));
      onGameWin(rewardCoins, mult);

      // Save level progression
      const nextLvl = currentLevel + 1;
      localStorage.setItem('jewel_puzzle_level', nextLvl.toString());
    } else if (movesLeft <= 0) {
      if (soundEnabled) synth.playExplode();
      setGameState('gameover');
      setLives((l) => Math.max(0, l - 1));
    }
  };

  // Tile Touch / Click Event
  const handleTileClick = (idx: number) => {
    if (gameState !== 'playing') return;

    if (activeBooster) {
      executeBooster(activeBooster, idx);
      setActiveBooster(null);
      return;
    }

    if (selectedIdx === null) {
      if (soundEnabled) synth.playClick();
      setSelectedIdx(idx);
    } else {
      if (selectedIdx === idx) {
        setSelectedIdx(null);
        return;
      }

      if (isAdjacent(selectedIdx, idx)) {
        handleSwapGems(selectedIdx, idx);
      } else {
        if (soundEnabled) synth.playClick();
        setSelectedIdx(idx);
      }
    }
  };

  // Touch Drag Swipe Handlers
  const handleTouchStart = (e: React.TouchEvent, idx: number) => {
    const touch = e.touches[0];
    touchStartRef.current = { x: touch.clientX, y: touch.clientY, idx };
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current || gameState !== 'playing') return;
    const touch = e.changedTouches[0];
    const dx = touch.clientX - touchStartRef.current.x;
    const dy = touch.clientY - touchStartRef.current.y;
    const startIdx = touchStartRef.current.idx;
    touchStartRef.current = null;

    if (Math.abs(dx) < 18 && Math.abs(dy) < 18) return;

    let targetIdx: number | null = null;
    const row = Math.floor(startIdx / GRID_SIZE);
    const col = startIdx % GRID_SIZE;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 0 && col < GRID_SIZE - 1) targetIdx = startIdx + 1;
      else if (dx < 0 && col > 0) targetIdx = startIdx - 1;
    } else {
      if (dy > 0 && row < GRID_SIZE - 1) targetIdx = startIdx + GRID_SIZE;
      else if (dy < 0 && row > 0) targetIdx = startIdx - GRID_SIZE;
    }

    if (targetIdx !== null) {
      handleSwapGems(startIdx, targetIdx);
    }
  };

  // Execute Booster Actions
  const executeBooster = (type: 'hammer' | 'bomb' | 'wand', targetIdx: number) => {
    if (soundEnabled) synth.playGem();

    const newGrid = [...grid];
    const newIce = [...iceGrid];
    const newStone = [...stoneGrid];

    if (type === 'hammer') {
      triggerMatchFX(targetIdx, '#ef4444', '🔨 HAMMER!');
      newGrid[targetIdx] = '';
      newIce[targetIdx] = false;
      newStone[targetIdx] = false;
      setBoosters((b) => ({ ...b, hammer: b.hammer - 1 }));
    } else if (type === 'bomb') {
      triggerMatchFX(targetIdx, '#f97316', '💣 BOMB!');
      const row = Math.floor(targetIdx / GRID_SIZE);
      const col = targetIdx % GRID_SIZE;

      for (let r = row - 1; r <= row + 1; r++) {
        for (let c = col - 1; c <= col + 1; c++) {
          if (r >= 0 && r < GRID_SIZE && c >= 0 && c < GRID_SIZE) {
            const bIdx = r * GRID_SIZE + c;
            triggerMatchFX(bIdx, '#ef4444');
            newGrid[bIdx] = '';
            newIce[bIdx] = false;
            newStone[bIdx] = false;
          }
        }
      }
      setBoosters((b) => ({ ...b, bomb: b.bomb - 1 }));
    } else if (type === 'wand') {
      const targetType = newGrid[targetIdx];
      if (targetType) {
        triggerMatchFX(targetIdx, '#c084fc', '🪄 MAGIC WAND!');
        for (let i = 0; i < TOTAL_TILES; i++) {
          if (newGrid[i] === targetType) {
            triggerMatchFX(i, '#c084fc');
            newGrid[i] = '';
          }
        }
      }
      setBoosters((b) => ({ ...b, wand: b.wand - 1 }));
    }

    setGrid(newGrid);
    setIceGrid(newIce);
    setStoneGrid(newStone);

    setTimeout(() => {
      processMatchesCascade(newGrid, newIce, newStone, 1);
    }, 300);
  };

  // Shuffle Board
  const handleShuffleBoard = () => {
    if (boosters.shuffle <= 0) return;
    if (soundEnabled) synth.playCard();

    let shuffled = [...grid];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    setGrid(shuffled);
    setBoosters((b) => ({ ...b, shuffle: b.shuffle - 1 }));
  };

  // Undo Last Move
  const handleUndoMove = () => {
    if (boosters.undo <= 0 || gridHistory.length === 0) return;
    if (soundEnabled) synth.playClick();

    const lastState = gridHistory[gridHistory.length - 1];
    setGrid(lastState.grid);
    setMovesLeft(lastState.moves);
    setScore(lastState.score);
    setGridHistory((prev) => prev.slice(0, -1));
    setBoosters((b) => ({ ...b, undo: b.undo - 1 }));
  };

  // Find Move Hint
  const handleFindHint = () => {
    if (boosters.hint <= 0) return;
    if (soundEnabled) synth.playClick();

    for (let i = 0; i < TOTAL_TILES; i++) {
      const row = Math.floor(i / GRID_SIZE);
      const col = i % GRID_SIZE;

      // Try Right
      if (col < GRID_SIZE - 1) {
        const testGrid = [...grid];
        [testGrid[i], testGrid[i + 1]] = [testGrid[i + 1], testGrid[i]];
        if (checkMatchesOnGrid(testGrid).foundMatch) {
          setHintIndices([i, i + 1]);
          setBoosters((b) => ({ ...b, hint: b.hint - 1 }));
          setTimeout(() => setHintIndices(null), 2500);
          return;
        }
      }

      // Try Down
      if (row < GRID_SIZE - 1) {
        const testGrid = [...grid];
        [testGrid[i], testGrid[i + GRID_SIZE]] = [testGrid[i + GRID_SIZE], testGrid[i]];
        if (checkMatchesOnGrid(testGrid).foundMatch) {
          setHintIndices([i, i + GRID_SIZE]);
          setBoosters((b) => ({ ...b, hint: b.hint - 1 }));
          setTimeout(() => setHintIndices(null), 2500);
          return;
        }
      }
    }
  };

  // Daily Spin Wheel
  const handleSpinWheel = () => {
    if (wheelSpinning) return;
    setWheelSpinning(true);
    if (soundEnabled) synth.playCoin();

    setTimeout(() => {
      setWheelSpinning(false);
      setBoosters((b) => ({
        ...b,
        hammer: b.hammer + 2,
        bomb: b.bomb + 1,
        shuffle: b.shuffle + 2,
        hint: b.hint + 3,
      }));
      if (soundEnabled) synth.playFanfare();
      alert('🎁 Daily Treasure Unlocked! +2 Hammers, +1 Bomb, +2 Shuffles, +3 Hints!');
      setShowDailyWheel(false);
    }, 2500);
  };

  const activeEnvObj = ENVIRONMENTS[activeEnvId] || ENVIRONMENTS.cave;

  return (
    <div
      className="relative min-h-[660px] w-full rounded-3xl p-4 md:p-6 text-white overflow-hidden shadow-2xl transition-all duration-700 font-sans select-none"
      style={{ background: activeEnvObj.bgGradient }}
      id="jewel_puzzle_root"
    >
      {/* Background Floating Ambient Glow */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <div className="absolute top-10 left-10 w-36 h-36 rounded-full bg-purple-500/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-44 h-44 rounded-full bg-cyan-500/20 blur-3xl animate-pulse" />
      </div>

      {/* TOP HUD BAR */}
      <div className="relative z-20 flex flex-wrap justify-between items-center bg-black/60 border border-white/15 p-3 rounded-2xl backdrop-blur-xl shadow-xl gap-2">
        {/* Level & Stars Badge */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { if (soundEnabled) synth.playClick(); setShowLevelMap(true); }}
            className="flex items-center gap-1.5 bg-gradient-to-r from-amber-500 to-amber-600 px-3 py-1.5 rounded-xl border border-amber-300/40 text-black font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
          >
            <Map className="h-4 w-4" />
            LVL {currentLevel}
          </button>

          <div className="flex gap-0.5">
            {[1, 2, 3].map((s) => (
              <Star
                key={s}
                className={`h-4 w-4 ${
                  stars >= s ? 'text-amber-400 fill-amber-400 drop-shadow-md' : 'text-zinc-600'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Moves & Score Center Cards */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900/90 border border-white/10 px-3 py-1 rounded-xl text-center">
            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Moves</span>
            <span className={`block text-base font-black ${movesLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-amber-400'}`}>
              {movesLeft}
            </span>
          </div>

          <div className="bg-zinc-900/90 border border-white/10 px-4 py-1 rounded-xl text-center min-w-[85px]">
            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Score</span>
            <span className="block text-base font-black text-cyan-300 font-mono">
              {score.toLocaleString()}
            </span>
          </div>
        </div>

        {/* Lives, Theme & Settings Controls */}
        <div className="flex items-center gap-1.5">
          <div className="flex items-center gap-1 bg-red-950/60 border border-red-500/30 px-2 py-1 rounded-xl">
            <Heart className="h-3.5 w-3.5 text-red-500 fill-red-500" />
            <span className="text-xs font-black text-red-200">{lives}</span>
          </div>

          <button
            onClick={() => setShowThemeModal(true)}
            className="p-1.5 rounded-xl bg-purple-500/20 border border-purple-500/40 text-purple-300 hover:bg-purple-500/30 transition"
            title="Change Theme"
          >
            <Palette className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowPackModal(true)}
            className="p-1.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/30 transition"
            title="Change Piece Pack"
          >
            <Grid className="h-4 w-4" />
          </button>

          <button
            onClick={() => setShowDailyWheel(true)}
            className="p-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition"
            title="Daily Gift Wheel"
          >
            <Gift className="h-4 w-4" />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="p-1.5 rounded-xl bg-zinc-800 border border-white/10 text-zinc-300 hover:text-white transition"
          >
            {soundEnabled ? <Volume2 className="h-4 w-4 text-emerald-400" /> : <VolumeX className="h-4 w-4 text-red-400" />}
          </button>
        </div>
      </div>

      {/* MISSION OBJECTIVES BAR */}
      <div className="relative z-20 mt-2.5 bg-zinc-900/80 border border-white/10 p-2.5 rounded-2xl backdrop-blur-md flex flex-wrap justify-between items-center gap-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-black text-amber-400 uppercase tracking-wider flex items-center gap-1">
            <Award className="h-3.5 w-3.5" /> Mission Objectives:
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {objectives.map((obj, i) => {
            const isCompleted = obj.current >= obj.count;
            const gemCfg = GEMS_CONFIG[obj.gemType];

            return (
              <div
                key={i}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl border transition ${
                  isCompleted
                    ? 'bg-emerald-950/70 border-emerald-500/60 text-emerald-300'
                    : 'bg-black/50 border-white/10 text-white'
                }`}
              >
                <span className="text-base">
                  {obj.gemType === 'ice_block' ? '🧊' : obj.gemType === 'stone_block' ? '🪨' : gemCfg?.char || '💎'}
                </span>
                <span className="text-xs font-black">
                  {obj.current}/{obj.count}
                </span>
                {isCompleted && <Check className="h-3.5 w-3.5 text-emerald-400" />}
              </div>
            );
          })}
        </div>
      </div>

      {/* MAIN MATCH-3 BOARD STAGE */}
      <div className="relative z-10 my-3 flex flex-col items-center justify-center">
        {/* Canvas for Particles & Score FX */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 pointer-events-none z-30 w-full h-full"
        />

        {/* 7x7 Grid Container */}
        <div className="relative p-2.5 rounded-3xl bg-black/65 border-2 border-amber-500/35 backdrop-blur-2xl shadow-[0_0_60px_rgba(0,0,0,0.85)] w-full max-w-[450px] aspect-square flex flex-col justify-between">
          
          {/* Start Level Overlay */}
          {gameState === 'idle' && (
            <div className="absolute inset-0 z-40 rounded-3xl bg-black/85 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-3xl shadow-xl shadow-amber-500/30 animate-bounce">
                💎
              </div>
              <div>
                <h3 className="text-lg font-black uppercase tracking-wider text-amber-400">Jewel Puzzle AAA</h3>
                <p className="text-xs text-zinc-300 font-medium max-w-xs mt-1">
                  Level {currentLevel}: {activeEnvObj.name}. Match jewels, trigger special power gems, and complete mission targets!
                </p>
              </div>

              <button
                onClick={handleStartGame}
                className="px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black uppercase tracking-widest shadow-xl shadow-amber-500/20 hover:scale-105 active:scale-95 transition"
              >
                Start Level {currentLevel} 🪙 {bet}
              </button>
            </div>
          )}

          {/* Victory Modal Overlay */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 z-40 rounded-3xl bg-black/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4 animate-in fade-in zoom-in duration-300">
              <div className="text-4xl animate-bounce">👑 LEVEL CLEARED!</div>

              <div className="flex gap-2">
                {[1, 2, 3].map((s) => (
                  <Star
                    key={s}
                    className={`h-8 w-8 ${
                      stars >= s ? 'text-amber-400 fill-amber-400 animate-pulse' : 'text-zinc-700'
                    }`}
                  />
                ))}
              </div>

              <div className="space-y-1">
                <p className="text-xs font-black uppercase text-zinc-400">Final Score</p>
                <p className="text-2xl font-black text-cyan-300 font-mono">{score.toLocaleString()}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={handleStartGame}
                  className="px-5 py-2.5 rounded-xl bg-zinc-800 border border-white/10 text-xs font-black uppercase text-white hover:bg-zinc-700 transition"
                >
                  Replay
                </button>
                <button
                  onClick={() => {
                    setCurrentLevel((l) => l + 1);
                    setGameState('idle');
                  }}
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black uppercase tracking-wider shadow-lg hover:scale-105 transition"
                >
                  Next Level <ChevronRight className="inline h-4 w-4" />
                </button>
              </div>
            </div>
          )}

          {/* Game Over Modal Overlay */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 z-40 rounded-3xl bg-black/90 backdrop-blur-md p-6 flex flex-col items-center justify-center text-center space-y-4">
              <div className="text-4xl">💔</div>
              <div>
                <h3 className="text-base font-black text-red-400 uppercase tracking-wider">Out of Moves!</h3>
                <p className="text-xs text-zinc-400 mt-1">Don't give up! Try again or use boosters.</p>
              </div>

              <button
                onClick={handleStartGame}
                className="px-8 py-3 rounded-xl bg-red-600 text-white text-xs font-black uppercase tracking-wider shadow-lg hover:bg-red-500 transition"
              >
                Try Again
              </button>
            </div>
          )}

          {/* 7x7 Match-3 Grid */}
          <div className="grid grid-cols-7 gap-1.5 w-full h-full">
            {grid.map((gemType, idx) => {
              const isSelected = selectedIdx === idx;
              const isIce = iceGrid[idx];
              const isStone = stoneGrid[idx];
              const isHinted = hintIndices && (hintIndices[0] === idx || hintIndices[1] === idx);

              return (
                <button
                  key={idx}
                  onClick={() => handleTileClick(idx)}
                  onTouchStart={(e) => handleTouchStart(e, idx)}
                  onTouchEnd={(e) => handleTouchEnd(e)}
                  className={`relative aspect-square rounded-2xl bg-zinc-900/80 border transition-all duration-200 flex items-center justify-center select-none transform ${
                    isSelected
                      ? 'scale-110 border-amber-400 shadow-[0_0_20px_rgba(251,191,36,0.8)] z-20'
                      : isHinted
                      ? 'scale-105 border-cyan-400 animate-pulse z-20'
                      : 'border-white/10 hover:border-white/30 active:scale-95'
                  }`}
                >
                  {gemType && (
                    <RenderGemSvg
                      type={gemType}
                      packId={activePackId}
                      isIce={isIce}
                      isStone={isStone}
                      colorBlindMode={colorBlindMode}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Combo Cascade Banner */}
          {comboChain > 1 && (
            <div className="absolute top-3 right-3 z-30 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-black text-xs uppercase px-3 py-1 rounded-full animate-bounce flex items-center gap-1 shadow-lg border border-white/20">
              <Flame className="h-4 w-4" /> {comboChain}x COMBO!
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM TOOLBAR - POWER-UP BOOSTERS */}
      <div className="relative z-20 bg-zinc-900/90 border border-white/10 p-3 rounded-2xl backdrop-blur-xl flex justify-around items-center gap-1.5 max-w-lg mx-auto">
        <button
          onClick={() => {
            if (soundEnabled) synth.playClick();
            setActiveBooster(activeBooster === 'hammer' ? null : 'hammer');
          }}
          className={`flex flex-col items-center p-2 rounded-xl transition ${
            activeBooster === 'hammer'
              ? 'bg-amber-500/30 border border-amber-400 text-amber-300 scale-105'
              : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Hammer className="h-4 w-4 mb-1 text-amber-400" />
          <span className="text-[8px] font-black uppercase">Hammer ({boosters.hammer})</span>
        </button>

        <button
          onClick={() => {
            if (soundEnabled) synth.playClick();
            setActiveBooster(activeBooster === 'bomb' ? null : 'bomb');
          }}
          className={`flex flex-col items-center p-2 rounded-xl transition ${
            activeBooster === 'bomb'
              ? 'bg-red-500/30 border border-red-400 text-red-300 scale-105'
              : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Bomb className="h-4 w-4 mb-1 text-red-400" />
          <span className="text-[8px] font-black uppercase">Bomb ({boosters.bomb})</span>
        </button>

        <button
          onClick={handleShuffleBoard}
          className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 transition"
        >
          <Shuffle className="h-4 w-4 mb-1 text-cyan-400" />
          <span className="text-[8px] font-black uppercase">Shuffle ({boosters.shuffle})</span>
        </button>

        <button
          onClick={() => {
            if (soundEnabled) synth.playClick();
            setActiveBooster(activeBooster === 'wand' ? null : 'wand');
          }}
          className={`flex flex-col items-center p-2 rounded-xl transition ${
            activeBooster === 'wand'
              ? 'bg-purple-500/30 border border-purple-400 text-purple-300 scale-105'
              : 'hover:bg-zinc-800 text-zinc-300'
          }`}
        >
          <Wand2 className="h-4 w-4 mb-1 text-purple-400" />
          <span className="text-[8px] font-black uppercase">Wand ({boosters.wand})</span>
        </button>

        <button
          onClick={handleUndoMove}
          className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 transition"
        >
          <Undo2 className="h-4 w-4 mb-1 text-emerald-400" />
          <span className="text-[8px] font-black uppercase">Undo ({boosters.undo})</span>
        </button>

        <button
          onClick={handleFindHint}
          className="flex flex-col items-center p-2 rounded-xl hover:bg-zinc-800 text-zinc-300 transition"
        >
          <Lightbulb className="h-4 w-4 mb-1 text-yellow-400" />
          <span className="text-[8px] font-black uppercase">Hint ({boosters.hint})</span>
        </button>
      </div>

      {/* THEME SELECTOR MODAL */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowThemeModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black uppercase tracking-wider text-amber-400 flex items-center justify-center gap-2">
              <Palette className="h-5 w-5" /> Select Background Theme
            </h3>

            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 text-left">
              {Object.values(ENVIRONMENTS).map((env) => (
                <button
                  key={env.id}
                  onClick={() => {
                    if (soundEnabled) synth.playClick();
                    setActiveEnvId(env.id);
                    setShowThemeModal(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                    activeEnvId === env.id
                      ? 'bg-purple-950/80 border-purple-400 text-white shadow-lg'
                      : 'bg-zinc-800 border-white/10 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-2xl">{env.icon}</span>
                  <div>
                    <h4 className="text-xs font-black">{env.name}</h4>
                    <p className="text-[9px] text-zinc-400 line-clamp-1">{env.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PIECE PACK SELECTOR MODAL */}
      {showPackModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPackModal(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black uppercase tracking-wider text-amber-400 flex items-center justify-center gap-2">
              <Grid className="h-5 w-5" /> Select Piece Skin Pack
            </h3>

            <div className="grid grid-cols-2 gap-3 max-h-72 overflow-y-auto p-1 text-left">
              {Object.values(PIECE_PACKS).map((pack) => (
                <button
                  key={pack.id}
                  onClick={() => {
                    if (soundEnabled) synth.playClick();
                    setActivePackId(pack.id);
                    setShowPackModal(false);
                  }}
                  className={`p-3 rounded-2xl border flex items-center gap-3 transition ${
                    activePackId === pack.id
                      ? 'bg-cyan-950/80 border-cyan-400 text-white shadow-lg'
                      : 'bg-zinc-800 border-white/10 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  <span className="text-2xl">{pack.icon}</span>
                  <div>
                    <h4 className="text-xs font-black">{pack.name}</h4>
                    <span className="text-[9px] text-zinc-400">Switch pieces instantly</span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* LEVEL MAP MODAL */}
      {showLevelMap && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-md w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowLevelMap(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <h3 className="text-base font-black uppercase tracking-wider text-amber-400 flex items-center justify-center gap-2">
              <Map className="h-5 w-5" /> Jewel Kingdom Map
            </h3>

            <div className="grid grid-cols-4 gap-2.5 max-h-60 overflow-y-auto p-2">
              {Array.from({ length: 24 }).map((_, i) => {
                const lvlNum = i + 1;
                const isCurrent = lvlNum === currentLevel;

                return (
                  <button
                    key={lvlNum}
                    onClick={() => {
                      if (soundEnabled) synth.playClick();
                      setCurrentLevel(lvlNum);
                      setShowLevelMap(false);
                      setGameState('idle');
                    }}
                    className={`aspect-square rounded-2xl flex flex-col items-center justify-center font-black text-sm border transition ${
                      isCurrent
                        ? 'bg-gradient-to-br from-amber-500 to-amber-600 text-black border-amber-300 scale-105 shadow-lg'
                        : 'bg-zinc-800 border-white/10 text-white hover:bg-zinc-700'
                    }`}
                  >
                    <span>{lvlNum}</span>
                    <span className="text-[8px] opacity-75">⭐⭐⭐</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* DAILY SPIN WHEEL MODAL */}
      {showDailyWheel && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-zinc-900 border border-white/10 rounded-3xl p-6 max-w-sm w-full text-center space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowDailyWheel(false)}
              className="absolute top-4 right-4 text-zinc-400 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="text-3xl">🎁</div>
            <h3 className="text-base font-black uppercase tracking-wider text-amber-400">Daily Treasure Wheel</h3>
            <p className="text-xs text-zinc-400">Spin to claim free daily boosters and hints!</p>

            <div className={`w-28 h-28 rounded-full border-4 border-amber-400 mx-auto flex items-center justify-center text-4xl bg-zinc-800 ${wheelSpinning ? 'animate-spin' : ''}`}>
              🔮
            </div>

            <button
              onClick={handleSpinWheel}
              disabled={wheelSpinning}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-black text-xs font-black uppercase tracking-widest hover:scale-105 transition disabled:opacity-50"
            >
              {wheelSpinning ? 'Spinning...' : 'Spin Free Gift!'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
