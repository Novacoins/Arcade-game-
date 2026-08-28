/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { Sparkles, Trophy, Award, TrendingUp, History, RotateCw, Volume2, VolumeX, Shield, Crown, ChevronRight, CheckCircle2, AlertCircle, Info, Lock, X, Coins, Zap, Star, Play, Gift } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LuckyBottleProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

/* =========================================================
   1. BOTTLE DEFINITIONS (12 UNIQUE AAA BOTTLES)
   ========================================================= */
export interface BottleItem {
  id: string;
  name: string;
  price: number;
  bonusMultiplier: number;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Divine';
  rarityBadge: string;
  rarityColor: string;
  themeColor: string;
  glowColor: string;
  liquidGradient: [string, string, string];
  glassColor: string;
  neckColor: string;
  capColor: string;
  labelTitle: string;
  labelIcon: string;
  description: string;
  bottleShape: 'flask' | 'round' | 'potion' | 'elixir' | 'decanter' | 'orb' | 'crystal' | 'phoenix' | 'legend' | 'royal' | 'galaxy' | 'ruby';
}

export const BOTTLE_COLLECTION: BottleItem[] = [
  {
    id: 'bronze',
    name: 'Bronze Flask',
    price: 10,
    bonusMultiplier: 1.1,
    rarity: 'Common',
    rarityBadge: '🥉 Common',
    rarityColor: '#b45309',
    themeColor: '#d97706',
    glowColor: 'rgba(217, 119, 6, 0.4)',
    liquidGradient: ['#78350f', '#b45309', '#d97706'],
    glassColor: '#451a03',
    neckColor: '#92400e',
    capColor: '#78350f',
    labelTitle: 'BRONZE',
    labelIcon: '🧪',
    description: '+10% Bonus Coin Multiplier. Reliable copper alloy flask.',
    bottleShape: 'flask',
  },
  {
    id: 'silver',
    name: 'Silver Decanter',
    price: 20,
    bonusMultiplier: 1.2,
    rarity: 'Common',
    rarityBadge: '🥈 Common',
    rarityColor: '#94a3b8',
    themeColor: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.5)',
    liquidGradient: ['#334155', '#64748b', '#94a3b8'],
    glassColor: '#1e293b',
    neckColor: '#cbd5e1',
    capColor: '#e2e8f0',
    labelTitle: 'SILVER',
    labelIcon: '✨',
    description: '+20% Bonus Coin Multiplier. Polished chrome silver carafe.',
    bottleShape: 'decanter',
  },
  {
    id: 'gold',
    name: 'Gold Reserve',
    price: 30,
    bonusMultiplier: 1.3,
    rarity: 'Rare',
    rarityBadge: '🥇 Rare',
    rarityColor: '#eab308',
    themeColor: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.6)',
    liquidGradient: ['#854d0e', '#ca8a04', '#fef08a'],
    glassColor: '#713f12',
    neckColor: '#facc15',
    capColor: '#fef08a',
    labelTitle: 'GOLD',
    labelIcon: '👑',
    description: '+30% Bonus Multiplier. 24K pure gilded royal vessel.',
    bottleShape: 'round',
  },
  {
    id: 'emerald',
    name: 'Emerald Potion',
    price: 40,
    bonusMultiplier: 1.4,
    rarity: 'Rare',
    rarityBadge: '🌿 Rare',
    rarityColor: '#10b981',
    themeColor: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.6)',
    liquidGradient: ['#064e3b', '#059669', '#34d399'],
    glassColor: '#022c22',
    neckColor: '#10b981',
    capColor: '#6ee7b7',
    labelTitle: 'EMERALD',
    labelIcon: '🍀',
    description: '+40% Bonus Multiplier. Infused with forest mana energy.',
    bottleShape: 'potion',
  },
  {
    id: 'ruby',
    name: 'Ruby Elixir',
    price: 50,
    bonusMultiplier: 1.5,
    rarity: 'Epic',
    rarityBadge: '💎 Epic',
    rarityColor: '#f43f5e',
    themeColor: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.65)',
    liquidGradient: ['#881337', '#e11d48', '#fda4af'],
    glassColor: '#4c0519',
    neckColor: '#f43f5e',
    capColor: '#fecdd3',
    labelTitle: 'RUBY',
    labelIcon: '🔥',
    description: '+50% Bonus Multiplier. Sizzling crimson dragon essence.',
    bottleShape: 'ruby',
  },
  {
    id: 'sapphire',
    name: 'Sapphire Orb',
    price: 60,
    bonusMultiplier: 1.6,
    rarity: 'Epic',
    rarityBadge: '🔹 Epic',
    rarityColor: '#3b82f6',
    themeColor: '#60a5fa',
    glowColor: 'rgba(96, 165, 250, 0.65)',
    liquidGradient: ['#1e3a8a', '#2563eb', '#93c5fd'],
    glassColor: '#172554',
    neckColor: '#3b82f6',
    capColor: '#bfdbfe',
    labelTitle: 'SAPPHIRE',
    labelIcon: '🌊',
    description: '+60% Bonus Multiplier. Oceanic deep blue power orb.',
    bottleShape: 'orb',
  },
  {
    id: 'crystal',
    name: 'Crystal Prism',
    price: 70,
    bonusMultiplier: 1.7,
    rarity: 'Epic',
    rarityBadge: '❄️ Epic',
    rarityColor: '#06b6d4',
    themeColor: '#22d3ee',
    glowColor: 'rgba(34, 211, 238, 0.7)',
    liquidGradient: ['#164e63', '#0891b2', '#a5f3fc'],
    glassColor: '#083344',
    neckColor: '#06b6d4',
    capColor: '#cffafe',
    labelTitle: 'CRYSTAL',
    labelIcon: '💎',
    description: '+70% Bonus Multiplier. Sub-zero arctic crystal structure.',
    bottleShape: 'crystal',
  },
  {
    id: 'diamond',
    name: 'Diamond Carafe',
    price: 80,
    bonusMultiplier: 1.8,
    rarity: 'Legendary',
    rarityBadge: '👑 Legendary',
    rarityColor: '#e0e7ff',
    themeColor: '#818cf8',
    glowColor: 'rgba(129, 140, 248, 0.75)',
    liquidGradient: ['#312e81', '#4f46e5', '#c7d2fe'],
    glassColor: '#1e1b4b',
    neckColor: '#6366f1',
    capColor: '#e0e7ff',
    labelTitle: 'DIAMOND',
    labelIcon: '❇️',
    description: '+80% Bonus Multiplier. Inlaid diamond facets and light.',
    bottleShape: 'elixir',
  },
  {
    id: 'royal',
    name: 'Royal Crown Decanter',
    price: 90,
    bonusMultiplier: 1.9,
    rarity: 'Legendary',
    rarityBadge: '👑 Legendary',
    rarityColor: '#f59e0b',
    themeColor: '#fde047',
    glowColor: 'rgba(253, 224, 71, 0.8)',
    liquidGradient: ['#713f12', '#d97706', '#fef08a'],
    glassColor: '#451a03',
    neckColor: '#fbbf24',
    capColor: '#fef08a',
    labelTitle: 'ROYAL',
    labelIcon: '🏆',
    description: '+90% Bonus Multiplier. Imperial crown jewels and gold plating.',
    bottleShape: 'royal',
  },
  {
    id: 'galaxy',
    name: 'Galaxy Nebula Flask',
    price: 100,
    bonusMultiplier: 2.0,
    rarity: 'Mythic',
    rarityBadge: '🌌 Mythic',
    rarityColor: '#a855f7',
    themeColor: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.85)',
    liquidGradient: ['#581c87', '#9333ea', '#f0abfc'],
    glassColor: '#3b0764',
    neckColor: '#a855f7',
    capColor: '#f5d0fe',
    labelTitle: 'GALAXY',
    labelIcon: '🚀',
    description: '2.0x Double Multiplier! Cosmic stardust and orbiting particles.',
    bottleShape: 'galaxy',
  },
  {
    id: 'phoenix',
    name: 'Phoenix Fire Vial',
    price: 110,
    bonusMultiplier: 2.2,
    rarity: 'Mythic',
    rarityBadge: '🔥 Mythic',
    rarityColor: '#f97316',
    themeColor: '#fdba74',
    glowColor: 'rgba(253, 186, 116, 0.9)',
    liquidGradient: ['#7c2d12', '#ea580c', '#ffedd5'],
    glassColor: '#431407',
    neckColor: '#f97316',
    capColor: '#ffedd5',
    labelTitle: 'PHOENIX',
    labelIcon: '🦅',
    description: '2.2x Bonus Multiplier! Immortal flaming phoenix core.',
    bottleShape: 'phoenix',
  },
  {
    id: 'legend',
    name: 'Legend Divine Grail',
    price: 120,
    bonusMultiplier: 2.5,
    rarity: 'Divine',
    rarityBadge: '🌟 Divine',
    rarityColor: '#fbbf24',
    themeColor: '#ffffff',
    glowColor: 'rgba(255, 255, 255, 0.95)',
    liquidGradient: ['#b45309', '#f59e0b', '#ffffff'],
    glassColor: '#78350f',
    neckColor: '#fef08a',
    capColor: '#ffffff',
    labelTitle: 'DIVINE',
    labelIcon: '⚜️',
    description: '2.5x Multiplier! The ultimate divine grail of legends.',
    bottleShape: 'legend',
  },
];

/* =========================================================
   2. WHEEL THEMES (10 UNLOCKABLE THEMES)
   ========================================================= */
export interface WheelTheme {
  id: string;
  name: string;
  price: number;
  glowColor: string;
  bezelOuter: string;
  bezelInner: string;
  ledColors: string[];
  badge: string;
  centerBg: string;
}

export const WHEEL_THEMES: WheelTheme[] = [
  {
    id: 'gold',
    name: 'Classic Gold',
    price: 0,
    glowColor: '#f59e0b',
    bezelOuter: '#d97706',
    bezelInner: '#fde047',
    ledColors: ['#f59e0b', '#ffffff', '#fbbf24'],
    badge: '🏆',
    centerBg: '#78350f',
  },
  {
    id: 'royal_blue',
    name: 'Royal Blue',
    price: 10,
    glowColor: '#3b82f6',
    bezelOuter: '#1d4ed8',
    bezelInner: '#93c5fd',
    ledColors: ['#3b82f6', '#60a5fa', '#ffffff'],
    badge: '👑',
    centerBg: '#1e3a8a',
  },
  {
    id: 'emerald',
    name: 'Emerald Grove',
    price: 20,
    glowColor: '#10b981',
    bezelOuter: '#047857',
    bezelInner: '#6ee7b7',
    ledColors: ['#10b981', '#34d399', '#fde047'],
    badge: '🌿',
    centerBg: '#064e3b',
  },
  {
    id: 'ruby',
    name: 'Ruby Passion',
    price: 30,
    glowColor: '#ef4444',
    bezelOuter: '#b91c1c',
    bezelInner: '#fca5a5',
    ledColors: ['#ef4444', '#f87171', '#ffffff'],
    badge: '❤️',
    centerBg: '#7f1d1d',
  },
  {
    id: 'neon_cyber',
    name: 'Neon Cyber',
    price: 40,
    glowColor: '#06b6d4',
    bezelOuter: '#0e7490',
    bezelInner: '#67e8f9',
    ledColors: ['#06b6d4', '#ec4899', '#3b82f6'],
    badge: '⚡',
    centerBg: '#164e63',
  },
  {
    id: 'galaxy',
    name: 'Galaxy Cosmic',
    price: 50,
    glowColor: '#a855f7',
    bezelOuter: '#6b21a8',
    bezelInner: '#f0abfc',
    ledColors: ['#a855f7', '#e879f9', '#60a5fa'],
    badge: '🌌',
    centerBg: '#581c87',
  },
  {
    id: 'crystal',
    name: 'Sub-Zero Crystal',
    price: 60,
    glowColor: '#38bdf8',
    bezelOuter: '#0284c7',
    bezelInner: '#bae6fd',
    ledColors: ['#38bdf8', '#7dd3fc', '#ffffff'],
    badge: '❄️',
    centerBg: '#0c4a6e',
  },
  {
    id: 'diamond',
    name: 'Platinum Diamond',
    price: 70,
    glowColor: '#ec4899',
    bezelOuter: '#be185d',
    bezelInner: '#fbcfe8',
    ledColors: ['#ec4899', '#f472b6', '#fde047'],
    badge: '💎',
    centerBg: '#831843',
  },
  {
    id: 'fire',
    name: 'Volcanic Fire',
    price: 80,
    glowColor: '#f97316',
    bezelOuter: '#c2410c',
    bezelInner: '#fed7aa',
    ledColors: ['#f97316', '#fb923c', '#ef4444'],
    badge: '🔥',
    centerBg: '#7c2d12',
  },
  {
    id: 'ice',
    name: 'Polar Ice Glacial',
    price: 90,
    glowColor: '#22d3ee',
    bezelOuter: '#0891b2',
    bezelInner: '#cffafe',
    ledColors: ['#22d3ee', '#38bdf8', '#ffffff'],
    badge: '🧊',
    centerBg: '#164e63',
  },
];

/* =========================================================
   3. WHEEL SECTOR PAYOUTS (8 SECTORS)
   ========================================================= */
export interface WheelSector {
  label: string;
  baseMult: number;
  icon: string;
  colorGrad: [string, string];
  textColor: string;
}

export const WHEEL_SECTORS: WheelSector[] = [
  { label: '×0', baseMult: 0, icon: '💀', colorGrad: ['#27272a', '#09090b'], textColor: '#ef4444' },
  { label: '×1', baseMult: 1, icon: '🥉', colorGrad: ['#78350f', '#451a03'], textColor: '#fef08a' },
  { label: '×2', baseMult: 2, icon: '🥈', colorGrad: ['#065f46', '#022c22'], textColor: '#6ee7b7' },
  { label: '×3', baseMult: 3, icon: '🥇', colorGrad: ['#1e40af', '#172554'], textColor: '#93c5fd' },
  { label: '×4', baseMult: 4, icon: '💎', colorGrad: ['#6b21a8', '#3b0764'], textColor: '#f0abfc' },
  { label: '×5', baseMult: 5, icon: '⭐', colorGrad: ['#991b1b', '#4c0519'], textColor: '#fca5a5' },
  { label: '×8', baseMult: 8, icon: '🔥', colorGrad: ['#9a3412', '#431407'], textColor: '#fed7aa' },
  { label: 'JACKPOT', baseMult: 20, icon: '👑', colorGrad: ['#854d0e', '#ca8a04'], textColor: '#000000' },
];

/* =========================================================
   4. DETAILED VECTOR SVG BOTTLE ARTWORK COMPONENT
   ========================================================= */
export function BottleArtwork({ bottle, size = 'md', className = '', animate = false }: { bottle: BottleItem; size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string; animate?: boolean }) {
  const sizeMap = {
    sm: 'w-10 h-16',
    md: 'w-16 h-24',
    lg: 'w-24 h-36',
    xl: 'w-32 h-48',
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${sizeMap[size]} ${className}`}>
      {/* Ambient Glow */}
      <div 
        className="absolute inset-2 rounded-full blur-xl pointer-events-none transition-all duration-500"
        style={{ backgroundColor: bottle.themeColor, opacity: 0.4 }}
      />

      <svg 
        viewBox="0 0 60 120" 
        className={`w-full h-full relative z-10 drop-shadow-xl ${animate ? 'animate-[bounce_2s_infinite]' : ''}`} 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id={`grad_liquid_${bottle.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={bottle.liquidGradient[0]} />
            <stop offset="50%" stopColor={bottle.liquidGradient[1]} />
            <stop offset="100%" stopColor={bottle.liquidGradient[2]} />
          </linearGradient>

          <linearGradient id={`grad_glass_${bottle.id}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.4" />
            <stop offset="20%" stopColor="#ffffff" stopOpacity="0.1" />
            <stop offset="80%" stopColor="#ffffff" stopOpacity="0.0" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.3" />
          </linearGradient>

          <filter id={`glow_b_${bottle.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Stopper Cap */}
        <rect x="25" y="2" width="10" height="8" rx="2" fill={bottle.capColor} stroke="#000" strokeWidth="0.8" />
        <line x1="25" y1="6" x2="35" y2="6" stroke="#ffffff" strokeWidth="0.8" opacity="0.6" />

        {/* Neck */}
        <path d="M23 10 L37 10 L35 34 L25 34 Z" fill={bottle.neckColor} stroke="#000000" strokeWidth="1" />

        {/* Glass Body Shapes based on bottleShape */}
        {bottle.bottleShape === 'flask' && (
          <path d="M25 34 C25 34, 18 48, 10 54 L10 110 C10 114, 14 118, 18 118 L42 118 C46 118, 50 114, 50 110 L50 54 C42 48, 35 34, 35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'decanter' && (
          <path d="M25 34 C25 34, 16 50, 6 60 C4 62, 4 68, 8 72 L18 112 C20 116, 24 118, 30 118 C36 118, 40 116, 42 112 L52 72 C56 68, 56 62, 54 60 C44 50, 35 34, 35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'round' && (
          <path d="M25 34 C25 34, 14 44, 8 58 C2 72, 4 92, 14 106 C20 114, 40 114, 46 106 C56 92, 58 72, 52 58 C46 44, 35 34, 35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'potion' && (
          <path d="M25 34 L22 46 L8 58 C2 66, 2 86, 12 102 C20 116, 40 116, 48 102 C58 86, 58 66, 52 58 L38 46 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'orb' && (
          <path d="M25 34 L23 48 C10 52, 2 66, 2 82 C2 102, 18 118, 30 118 C42 118, 58 102, 58 82 C58 66, 50 52, 37 48 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'crystal' && (
          <path d="M25 34 L16 50 L6 70 L14 114 L30 118 L46 114 L54 70 L44 50 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'ruby' && (
          <path d="M25 34 L14 48 L4 64 L12 112 L30 118 L48 112 L56 64 L46 48 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'elixir' && (
          <path d="M25 34 C25 34, 18 44, 10 56 L10 108 L30 118 L50 108 L50 56 C42 44, 35 34, 35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'royal' && (
          <path d="M25 34 L20 44 L8 52 C2 60, 2 76, 8 84 L14 114 L30 118 L46 114 L52 84 C58 76, 58 60, 52 52 L40 44 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'galaxy' && (
          <path d="M25 34 C25 34, 16 48, 8 60 C0 74, 2 96, 12 108 C20 118, 40 118, 48 108 C58 96, 60 74, 52 60 C44 48, 35 34, 35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'phoenix' && (
          <path d="M25 34 L18 46 L6 58 C0 68, 0 88, 10 104 L30 118 L50 104 C60 88, 60 68, 54 58 L42 46 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="1.5" />
        )}

        {bottle.bottleShape === 'legend' && (
          <path d="M25 34 L16 46 L4 58 L8 102 L20 114 L30 118 L40 114 L52 102 L56 58 L44 46 L35 34 Z" fill={`url(#grad_liquid_${bottle.id})`} stroke={bottle.themeColor} strokeWidth="2" filter={`url(#glow_b_${bottle.id})`} />
        )}

        {/* Vintage Label */}
        <rect x="15" y="62" width="30" height="28" rx="3" fill="#fef08a" stroke="#d97706" strokeWidth="0.8" />
        <text x="30" y="73" textAnchor="middle" fontSize="6" fontWeight="900" fill="#78350f">{bottle.labelTitle}</text>
        <text x="30" y="83" textAnchor="middle" fontSize="8" fill="#000">{bottle.labelIcon}</text>

        {/* Floating Magic Particles inside Liquid */}
        <circle cx="22" cy="78" r="1.5" fill="#ffffff" opacity="0.8" />
        <circle cx="38" cy="92" r="2" fill="#ffffff" opacity="0.6" />
        <circle cx="28" cy="102" r="1.2" fill="#ffffff" opacity="0.9" />

        {/* Glass Reflection Sheen */}
        <path d="M25 34 C25 34, 18 48, 10 54 L10 110 L22 110 L22 54 Z" fill={`url(#grad_glass_${bottle.id})`} pointerEvents="none" />
      </svg>

      {/* Rarity Star Badge */}
      <div 
        className="absolute -bottom-1 z-20 px-1.5 py-0.5 rounded-full text-[9px] font-black text-black border border-white/60 shadow-lg flex items-center gap-0.5 whitespace-nowrap"
        style={{ backgroundColor: bottle.rarityColor }}
      >
        <span>{bottle.rarityBadge}</span>
      </div>
    </div>
  );
}

/* =========================================================
   5. MAIN LUCKY BOTTLE GAME COMPONENT
   ========================================================= */
export function LuckyBottle({ coins, onGameWin, onGameLose }: LuckyBottleProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Persistence States
  const [equippedBottleId, setEquippedBottleId] = useState<string>(() => {
    return localStorage.getItem('nova_lucky_bottle_equipped') || 'bronze';
  });

  const [ownedBottleIds, setOwnedBottleIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nova_lucky_bottle_owned');
    return saved ? JSON.parse(saved) : ['bronze'];
  });

  const [wheelThemeId, setWheelThemeId] = useState<string>(() => {
    return localStorage.getItem('nova_lucky_bottle_theme') || 'gold';
  });

  const [unlockedThemeIds, setUnlockedThemeIds] = useState<string[]>(() => {
    const saved = localStorage.getItem('nova_lucky_bottle_unlocked_themes');
    return saved ? JSON.parse(saved) : ['gold'];
  });

  const [stats, setStats] = useState({
    spins: 0,
    todaysSpins: 0,
    wins: 0,
    losses: 0,
    jackpots: 0,
    highestMultiplier: 0,
    totalCoinsWon: 0,
    winningStreak: 0,
  });

  // Gameplay State
  const [bet, setBet] = useState(10);
  const [spinning, setSpinning] = useState(false);
  const [autoSpin, setAutoSpin] = useState(false);
  const [insufficientNotice, setInsufficientNotice] = useState('');

  // Modals & Popups
  const [selectedBottleForPurchase, setSelectedBottleForPurchase] = useState<BottleItem | null>(null);
  const [rewardModal, setRewardModal] = useState<{
    multiplier: number;
    winCoins: number;
    label: string;
    isJackpot: boolean;
    icon: string;
    bottleBonus: number;
  } | null>(null);

  const [unlockedAnimation, setUnlockedAnimation] = useState<BottleItem | null>(null);
  const [showStatsModal, setShowStatsModal] = useState(false);
  const [showRankModal, setShowRankModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);

  // Flying Coins animation triggers
  const [flyingCoins, setFlyingCoins] = useState<{ id: number; x: number; y: number }[]>([]);

  // Canvas Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const wheelAngleRef = useRef<number>(0);
  const bottleVibrateRef = useRef<number>(0);

  const currentBottle = BOTTLE_COLLECTION.find(b => b.id === equippedBottleId) || BOTTLE_COLLECTION[0];
  const currentTheme = WHEEL_THEMES.find(t => t.id === wheelThemeId) || WHEEL_THEMES[0];

  // Save changes to localStorage
  useEffect(() => {
    localStorage.setItem('nova_lucky_bottle_equipped', equippedBottleId);
  }, [equippedBottleId]);

  useEffect(() => {
    localStorage.setItem('nova_lucky_bottle_owned', JSON.stringify(ownedBottleIds));
  }, [ownedBottleIds]);

  useEffect(() => {
    localStorage.setItem('nova_lucky_bottle_theme', wheelThemeId);
  }, [wheelThemeId]);

  useEffect(() => {
    localStorage.setItem('nova_lucky_bottle_unlocked_themes', JSON.stringify(unlockedThemeIds));
  }, [unlockedThemeIds]);

  // Auto spin timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (autoSpin && !spinning && !rewardModal && !selectedBottleForPurchase) {
      timer = setTimeout(() => {
        handleSpin();
      }, 1200);
    }
    return () => clearTimeout(timer);
  }, [autoSpin, spinning, rewardModal, selectedBottleForPurchase]);

  // Canvas Wheel Drawing & 60 FPS Physics Engine
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 380;
    canvas.height = 380;
    const cx = canvas.width / 2;
    const cy = canvas.height / 2;
    const radius = 150;

    let isSpinningLocal = false;
    let spinStart = 0;
    let spinDuration = 4000;
    let startAngle = wheelAngleRef.current;
    let targetAngle = wheelAngleRef.current;
    let lastPegIdx = -1;

    const numSectors = WHEEL_SECTORS.length;
    const sectorAngle = (Math.PI * 2) / numSectors;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // 1. Luxury Animated Border with LED Lights & Glowing Ring
      ctx.save();
      ctx.shadowBlur = 24;
      ctx.shadowColor = currentTheme.glowColor;

      const outerGrad = ctx.createRadialGradient(cx, cy, radius - 4, cx, cy, radius + 24);
      outerGrad.addColorStop(0, currentTheme.bezelInner);
      outerGrad.addColorStop(0.5, currentTheme.bezelOuter);
      outerGrad.addColorStop(1, '#020617');

      ctx.fillStyle = outerGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, radius + 22, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // 2. Animated Outer LED Bulbs
      const numLeds = 20;
      const timeMs = Date.now() / 120;
      for (let i = 0; i < numLeds; i++) {
        const angle = (i * Math.PI * 2) / numLeds;
        const lx = cx + Math.cos(angle) * (radius + 12);
        const ly = cy + Math.sin(angle) * (radius + 12);

        const colorIdx = (i + Math.floor(timeMs)) % currentTheme.ledColors.length;
        const ledColor = currentTheme.ledColors[colorIdx];
        const pulse = Math.sin(timeMs + i * 0.5) * 0.3 + 0.7;

        ctx.save();
        ctx.fillStyle = ledColor;
        ctx.shadowBlur = 10 * pulse;
        ctx.shadowColor = ledColor;
        ctx.beginPath();
        ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 3. Draw Reward Wheel Sectors with Gold Dividers
      WHEEL_SECTORS.forEach((sec, idx) => {
        const start = wheelAngleRef.current + idx * sectorAngle;
        const end = start + sectorAngle;

        ctx.save();
        const secGrad = ctx.createRadialGradient(cx, cy, 20, cx, cy, radius);
        secGrad.addColorStop(0, sec.colorGrad[0]);
        secGrad.addColorStop(1, sec.colorGrad[1]);

        ctx.fillStyle = secGrad;
        ctx.beginPath();
        ctx.moveTo(cx, cy);
        ctx.arc(cx, cy, radius, start, end);
        ctx.fill();

        // Thin Gold Separator Line
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 2.5;
        ctx.stroke();
        ctx.restore();

        // Sector Text & Unique Icon
        ctx.save();
        ctx.translate(cx, cy);
        ctx.rotate(start + sectorAngle / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        ctx.fillStyle = sec.textColor;
        ctx.font = '900 14px sans-serif';
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#000000';
        ctx.fillText(`${sec.icon} ${sec.label}`, radius - 16, 0);
        ctx.restore();
      });

      // 4. Sector Boundary Metal Pegs
      for (let i = 0; i < numSectors; i++) {
        const pegAngle = wheelAngleRef.current + i * sectorAngle;
        const px = cx + Math.cos(pegAngle) * radius;
        const py = cy + Math.sin(pegAngle) * radius;

        ctx.save();
        const grad = ctx.createRadialGradient(px, py, 1, px, py, 5);
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.6, '#fbbf24');
        grad.addColorStop(1, '#78350f');
        ctx.fillStyle = grad;
        ctx.shadowBlur = 6;
        ctx.shadowColor = '#000';
        ctx.beginPath();
        ctx.arc(px, py, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      }

      // 5. Center Hub
      ctx.save();
      const hubGrad = ctx.createRadialGradient(cx, cy, 5, cx, cy, 32);
      hubGrad.addColorStop(0, '#fef08a');
      hubGrad.addColorStop(0.5, '#eab308');
      hubGrad.addColorStop(1, currentTheme.centerBg);

      ctx.fillStyle = hubGrad;
      ctx.shadowBlur = 12;
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.beginPath();
      ctx.arc(cx, cy, 32, 0, Math.PI * 2);
      ctx.fill();

      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '900 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(currentTheme.badge, cx, cy - 2);
      ctx.restore();

      // 6. Pointer Needle at Top (Stops EXACTLY on winning sector)
      ctx.save();
      ctx.translate(cx, 16);
      ctx.fillStyle = '#ef4444';
      ctx.shadowBlur = 12;
      ctx.shadowColor = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(-12, -8);
      ctx.lineTo(12, -8);
      ctx.lineTo(0, 26);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(0, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };

    const updatePhysics = (timestamp: number) => {
      if (!isSpinningLocal) {
        draw();
        animationRef.current = requestAnimationFrame(updatePhysics);
        return;
      }

      const elapsed = timestamp - spinStart;
      if (elapsed >= spinDuration) {
        wheelAngleRef.current = targetAngle;
        isSpinningLocal = false;
        draw();
        return;
      }

      // Cubic Ease-Out curve for realistic deceleration
      const t = elapsed / spinDuration;
      const easeOut = 1 - Math.pow(1 - t, 3.5);
      wheelAngleRef.current = startAngle + (targetAngle - startAngle) * easeOut;

      // Peg Ticking Check
      const normalizedAngle = (wheelAngleRef.current + Math.PI / 2) % (Math.PI * 2);
      const currentPegIdx = Math.floor(normalizedAngle / sectorAngle) % numSectors;

      if (currentPegIdx !== lastPegIdx) {
        synth.playPegTick(1 - t);
        lastPegIdx = currentPegIdx;
      }

      draw();
      animationRef.current = requestAnimationFrame(updatePhysics);
    };

    (window as any).startLuckyBottleSpin = (targetIdx: number, duration: number, onComplete: () => void) => {
      isSpinningLocal = true;
      spinStart = performance.now();
      spinDuration = duration;
      startAngle = wheelAngleRef.current;
      lastPegIdx = -1;

      synth.playSpinWheel();

      // Calculate Target Angle so pointer stops EXACTLY in center of sector
      const extraRotations = 7 * Math.PI * 2;
      const sectorCenterOffset = -(targetIdx * sectorAngle) - (sectorAngle / 2) + Math.PI * 1.5;
      
      targetAngle = startAngle + extraRotations + ((sectorCenterOffset - (startAngle % (Math.PI * 2)) + Math.PI * 4) % (Math.PI * 2));

      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      animationRef.current = requestAnimationFrame(updatePhysics);

      setTimeout(() => {
        isSpinningLocal = false;
        wheelAngleRef.current = targetAngle;
        onComplete();
      }, duration);
    };

    animationRef.current = requestAnimationFrame(updatePhysics);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [wheelThemeId, currentTheme]);

  // Handle Spin Logic
  const handleSpin = () => {
    if (spinning) return;
    if (!validateAndDeductCoins(bet, 'Spin Bottle')) {
      setAutoSpin(false);
      return;
    }

    synth.playClick();
    setSpinning(true);
    setInsufficientNotice('');

    // Determine target sector
    const targetIdx = Math.floor(Math.random() * WHEEL_SECTORS.length);

    if ((window as any).startLuckyBottleSpin) {
      (window as any).startLuckyBottleSpin(targetIdx, 4000, () => {
        setSpinning(false);
        const sector = WHEEL_SECTORS[targetIdx];
        const isWin = sector.baseMult > 0;
        const totalMultiplier = sector.baseMult * currentBottle.bonusMultiplier;
        const winCoins = isWin ? Math.min(50, Math.max(10, Math.floor(bet * totalMultiplier))) : 0;

        // Update Statistics
        setStats(prev => ({
          spins: prev.spins + 1,
          todaysSpins: prev.todaysSpins + 1,
          wins: prev.wins + (isWin ? 1 : 0),
          losses: prev.losses + (isWin ? 0 : 1),
          jackpots: prev.jackpots + (sector.baseMult >= 20 ? 1 : 0),
          highestMultiplier: Math.max(prev.highestMultiplier, totalMultiplier),
          totalCoinsWon: prev.totalCoinsWon + winCoins,
          winningStreak: isWin ? prev.winningStreak + 1 : 0,
        }));

        if (isWin) {
          if (sector.baseMult >= 20) {
            synth.playFanfare();
          } else {
            synth.playVictory();
          }
          onGameWin(winCoins, totalMultiplier);
        } else {
          synth.playLoss();
        }

        // Show Reward Popup
        setRewardModal({
          multiplier: totalMultiplier,
          winCoins: winCoins,
          label: sector.label,
          isJackpot: sector.baseMult >= 20,
          icon: sector.icon,
          bottleBonus: currentBottle.bonusMultiplier,
        });
      });
    }
  };

  // Handle Purchasing a Bottle
  const handleConfirmBottlePurchase = () => {
    if (!selectedBottleForPurchase) return;
    const price = selectedBottleForPurchase.price;

    if (!validateAndDeductCoins(price, `Lucky Bottle: ${selectedBottleForPurchase.name}`)) {
      setSelectedBottleForPurchase(null);
      return;
    }

    // Purchase
    synth.playUpgradeSuccess();
    const newOwned = [...ownedBottleIds, selectedBottleForPurchase.id];
    setOwnedBottleIds(newOwned);
    setEquippedBottleId(selectedBottleForPurchase.id);

    const bought = selectedBottleForPurchase;
    setSelectedBottleForPurchase(null);
    setUnlockedAnimation(bought);
  };

  // Handle Purchasing a Theme
  const handleBuyTheme = (theme: WheelTheme) => {
    if (!validateAndDeductCoins(theme.price, `Lucky Bottle Theme: ${theme.name}`)) {
      return;
    }

    synth.playUpgradeSuccess();
    setUnlockedThemeIds([...unlockedThemeIds, theme.id]);
    setWheelThemeId(theme.id);
  };

  // Flying Coins Collection Handler
  const handleCollectReward = () => {
    synth.playCoin();
    if (rewardModal && rewardModal.winCoins > 0) {
      // Spawn 12 flying coin elements
      const newCoins = Array.from({ length: 12 }).map((_, i) => ({
        id: Date.now() + i,
        x: window.innerWidth / 2 + (Math.random() - 0.5) * 160,
        y: window.innerHeight / 2 + (Math.random() - 0.5) * 160,
      }));
      setFlyingCoins(newCoins);
      setTimeout(() => setFlyingCoins([]), 1000);
    }
    setRewardModal(null);
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950 via-zinc-900 to-black p-4 sm:p-6 rounded-3xl border border-amber-500/30 max-w-2xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-xl" id="lucky_bottle_main">
      
      {/* 1. Animated Background Stars & Ambient Smoke */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
        <div className="absolute -top-20 -left-20 w-64 h-64 bg-amber-500/20 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 right-0 w-72 h-72 bg-purple-500/15 rounded-full blur-3xl animate-pulse" />
        <div className="absolute -bottom-20 left-1/3 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl" />
      </div>

      {/* Flying Coins Animation Overlay */}
      {flyingCoins.map(coin => (
        <motion.div
          key={coin.id}
          initial={{ x: coin.x, y: coin.y, scale: 1, opacity: 1 }}
          animate={{ x: window.innerWidth / 2, y: 40, scale: 0.3, opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeIn' }}
          className="fixed z-50 text-2xl pointer-events-none drop-shadow-[0_0_10px_rgba(250,204,21,0.8)]"
        >
          🪙
        </motion.div>
      ))}

      {/* Top Header & Navigation Toolbar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/10 pb-4 relative z-10">
        <div className="text-left">
          <div className="flex items-center gap-2">
            <span className="text-2xl animate-bounce">🍾</span>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                Lucky Bottle Grand Wheel
              </h3>
              <p className="text-[10px] sm:text-xs text-gray-400 font-bold">AAA Mobile Arcade & Collection Experience</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 justify-end">
          <button
            onClick={() => { synth.playClick(); setShowThemeModal(true); }}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-black uppercase text-amber-300 flex items-center gap-1 transition active:scale-95"
          >
            🎨 Themes
          </button>
          <button
            onClick={() => { synth.playClick(); setShowStatsModal(true); }}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-black uppercase text-blue-300 flex items-center gap-1 transition active:scale-95"
          >
            📊 Stats
          </button>
          <button
            onClick={() => { synth.playClick(); setShowRankModal(true); }}
            className="px-3 py-1.5 rounded-xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 text-xs font-black uppercase text-purple-300 flex items-center gap-1 transition active:scale-95"
          >
            🏆 Rank
          </button>
        </div>
      </div>

      {/* 2. Bottle Collection Carousel (12 Premium Bottles) */}
      <div className="space-y-2 relative z-10 text-left">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-amber-300 flex items-center gap-1.5">
            <Crown className="h-4 w-4 text-amber-400" />
            Bottle Collection ({ownedBottleIds.length}/12 Unlocked)
          </h4>
          <span className="text-[10px] font-bold text-gray-400">Equipped: <strong className="text-white">{currentBottle.name} ({currentBottle.bonusMultiplier}x)</strong></span>
        </div>

        {/* Scrollable Horizontal Bottle Rack */}
        <div className="flex gap-3 overflow-x-auto pb-3 pt-1 scrollbar-none">
          {BOTTLE_COLLECTION.map((b) => {
            const isOwned = ownedBottleIds.includes(b.id);
            const isEquipped = equippedBottleId === b.id;

            return (
              <motion.div
                key={b.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  synth.playClick();
                  if (isOwned) {
                    setEquippedBottleId(b.id);
                  } else {
                    setSelectedBottleForPurchase(b);
                  }
                }}
                className={`relative shrink-0 w-28 p-2.5 rounded-2xl border-2 flex flex-col items-center justify-between gap-1.5 cursor-pointer transition-all duration-300 ${
                  isEquipped
                    ? 'bg-gradient-to-b from-amber-500/30 via-zinc-950 to-zinc-950 border-amber-400 shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                    : isOwned
                    ? 'bg-zinc-950/80 border-white/20 hover:border-amber-400/50'
                    : 'bg-zinc-950/50 border-white/10 opacity-75 hover:opacity-100'
                }`}
              >
                {/* Rarity Tag */}
                <div className="text-[8px] font-black uppercase tracking-wider px-1.5 py-0.5 rounded-full bg-black/80 text-gray-300 border border-white/10">
                  {b.rarity}
                </div>

                {/* Bottle Artwork */}
                <BottleArtwork bottle={b} size="md" />

                {/* Info & Action Button */}
                <div className="text-center w-full">
                  <div className="text-[10px] font-black text-white truncate">{b.name}</div>
                  <div className="text-[9px] font-bold text-amber-300">+{Math.round((b.bonusMultiplier - 1) * 100)}% Bonus</div>
                </div>

                <div className={`w-full py-1 rounded-xl text-[9px] font-black uppercase tracking-wider text-center ${
                  isEquipped
                    ? 'bg-amber-400 text-black font-black'
                    : isOwned
                    ? 'bg-zinc-800 text-amber-300 hover:bg-zinc-700'
                    : 'bg-emerald-500 text-black hover:bg-emerald-400 font-black'
                }`}>
                  {isEquipped ? 'Equipped ✓' : isOwned ? 'Equip' : `${b.price} 🪙`}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* 3. The Physical Animated Reward Wheel & Selected Bottle Stage */}
      <div className="relative flex flex-col items-center justify-center p-4 bg-zinc-950/80 rounded-3xl border border-white/10 shadow-inner z-10 overflow-hidden">
        
        {/* Equipped Bottle Mounted in Center Stage */}
        <div className="absolute top-2 z-20 flex flex-col items-center pointer-events-none">
          <div className="text-[10px] font-black uppercase tracking-widest text-amber-300 bg-black/80 px-3 py-1 rounded-full border border-amber-500/40 shadow-lg">
            Active Multiplier: {currentBottle.bonusMultiplier}x
          </div>
        </div>

        {/* Canvas Wheel */}
        <div className="relative my-2">
          <canvas ref={canvasRef} className="mx-auto block select-none max-w-full drop-shadow-2xl" />

          {/* Shaking Bottle Mounted on Center Hub */}
          <div 
            className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none transition-transform ${
              spinning ? 'animate-bounce scale-110' : ''
            }`}
          >
            <BottleArtwork bottle={currentBottle} size="lg" animate={spinning} />
          </div>
        </div>

        {/* Notice Message */}
        {insufficientNotice && (
          <div className="p-2.5 bg-red-500/20 border border-red-500/40 rounded-xl text-xs font-black uppercase text-red-300 animate-bounce">
            {insufficientNotice}
          </div>
        )}
      </div>

      {/* 4. Controls & Betting Panel */}
      <div className="space-y-3 bg-zinc-950/60 p-4 rounded-2xl border border-white/10 text-left relative z-10">
        <div className="flex justify-between items-center text-xs">
          <label className="font-black text-gray-400 uppercase">Insert Spin Bet (Coins)</label>
          <span className="font-mono font-black text-amber-400">Balance: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={spinning}
            value={bet}
            onChange={(e) => setBet(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-xl border border-white/10 bg-black/60 py-2.5 text-sm font-mono font-black text-white focus:border-amber-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => { synth.playClick(); setBet(10); }}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
            >
              Min
            </button>
            <button
              onClick={() => { synth.playClick(); setBet(Math.max(10, Math.floor(bet / 2))); }}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
            >
              /2
            </button>
            <button
              onClick={() => { synth.playClick(); setBet(Math.min(coins, bet * 2)); }}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
            >
              x2
            </button>
            <button
              onClick={() => { synth.playClick(); setBet(Math.min(10000, coins)); }}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
            >
              Max
            </button>
          </div>
        </div>

        {/* Spin Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-2 border-t border-white/10">
          <button
            onClick={() => { synth.playClick(); setAutoSpin(!autoSpin); }}
            className={`py-3.5 rounded-xl text-xs font-black uppercase tracking-wider border transition-all flex items-center justify-center gap-1.5 ${
              autoSpin
                ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                : 'bg-zinc-800 border-white/10 text-gray-400 hover:text-white'
            }`}
          >
            <RotateCw className={`h-4 w-4 ${autoSpin ? 'animate-spin' : ''}`} />
            {autoSpin ? 'Auto: ON' : 'Auto: OFF'}
          </button>

          <button
            onClick={handleSpin}
            disabled={spinning}
            className="sm:col-span-2 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-black text-xs font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 transition-all shadow-xl shadow-amber-500/20 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
          >
            <Play className="h-4 w-4 fill-current" />
            <span>{spinning ? 'WHEEL SPINNING...' : `SPIN LUCKY BOTTLE (${currentBottle.bonusMultiplier}x)`}</span>
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* POPUP 1: BOTTLE PURCHASE CONFIRMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {selectedBottleForPurchase && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              className="bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative"
            >
              <button
                onClick={() => setSelectedBottleForPurchase(null)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-black uppercase text-amber-400 tracking-wider">Unlock Bottle</span>
                <h3 className="text-lg font-black text-white">{selectedBottleForPurchase.name}</h3>
              </div>

              <div className="flex justify-center py-2">
                <BottleArtwork bottle={selectedBottleForPurchase} size="lg" />
              </div>

              <p className="text-xs text-gray-300">{selectedBottleForPurchase.description}</p>

              <div className="bg-zinc-900 p-3 rounded-2xl border border-white/10 text-xs space-y-1.5 text-left">
                <div className="flex justify-between text-gray-400">
                  <span>Price:</span>
                  <span className="font-mono font-black text-amber-400">{selectedBottleForPurchase.price} Coins</span>
                </div>
                <div className="flex justify-between text-gray-400">
                  <span>Bonus Multiplier:</span>
                  <span className="font-mono font-black text-emerald-400">{selectedBottleForPurchase.bonusMultiplier}x</span>
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={() => setSelectedBottleForPurchase(null)}
                  className="w-1/2 py-3 rounded-xl bg-zinc-800 text-xs font-bold text-gray-300 hover:bg-zinc-700"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmBottlePurchase}
                  className="w-1/2 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-amber-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105"
                >
                  Purchase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POPUP 2: REWARD POPUP & CELEBRATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {rewardModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.7, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative overflow-hidden"
            >
              <div className="text-5xl animate-bounce">{rewardModal.icon}</div>

              <div>
                <h3 className="text-xl font-black text-amber-400 tracking-tight">
                  {rewardModal.isJackpot ? '🎉 JACKPOT WINNER!' : rewardModal.winCoins > 0 ? '✨ REWARD UNLOCKED!' : '💀 NO WIN'}
                </h3>
                <p className="text-xs text-gray-300 font-bold mt-1">
                  Landed on <span className="text-amber-300 font-black">{rewardModal.label}</span> sector
                </p>
              </div>

              <div className="bg-amber-500/10 border border-amber-500/30 p-4 rounded-2xl text-xs space-y-2">
                <div className="flex justify-between text-gray-300">
                  <span>Wheel Base Multiplier:</span>
                  <span className="font-mono font-bold text-white">{rewardModal.label}</span>
                </div>
                <div className="flex justify-between text-gray-300">
                  <span>Bottle Multiplier:</span>
                  <span className="font-mono font-bold text-amber-300">+{Math.round((rewardModal.bottleBonus - 1) * 100)}% ({rewardModal.bottleBonus}x)</span>
                </div>
                <div className="flex justify-between border-t border-amber-500/30 pt-1.5 font-black text-sm">
                  <span className="text-amber-400">Coins Earned:</span>
                  <span className="font-mono text-emerald-400">+{rewardModal.winCoins.toLocaleString()} 🪙</span>
                </div>
              </div>

              <button
                onClick={handleCollectReward}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider hover:scale-105 transition shadow-xl shadow-amber-500/20"
              >
                Collect & Continue
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POPUP 3: UNLOCKED ANIMATION */}
      {/* ========================================================= */}
      <AnimatePresence>
        {unlockedAnimation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.5, rotate: -10, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-zinc-950 border-2 border-emerald-400 rounded-3xl p-6 max-w-sm w-full space-y-4 text-center shadow-2xl relative"
            >
              <h3 className="text-xl font-black text-emerald-400">🍾 Bottle Unlocked!</h3>
              <p className="text-xs text-white font-bold">{unlockedAnimation.name} has been added to your inventory!</p>

              <div className="flex justify-center py-4">
                <BottleArtwork bottle={unlockedAnimation} size="xl" animate={true} />
              </div>

              <button
                onClick={() => setUnlockedAnimation(null)}
                className="w-full py-3 rounded-xl bg-emerald-500 text-black text-xs font-black uppercase tracking-wider"
              >
                Equip Bottle & Play
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POPUP 4: STATISTICS MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showStatsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4 text-center shadow-2xl relative"
            >
              <button
                onClick={() => setShowStatsModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-black text-amber-400 flex items-center justify-center gap-1.5">
                  <TrendingUp className="h-4 w-4" />
                  Player Statistics
                </h3>
                <p className="text-[10px] text-gray-400">Lifetime performance metrics</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-left">
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Total Spins</span>
                  <div className="text-sm font-black text-white">{stats.spins.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Today's Spins</span>
                  <div className="text-sm font-black text-amber-400">{stats.todaysSpins.toLocaleString()}</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Wins / Losses</span>
                  <div className="text-xs font-black text-emerald-400">{stats.wins} W / {stats.losses} L</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Jackpots Hit</span>
                  <div className="text-sm font-black text-purple-400">{stats.jackpots} 👑</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Highest Mult</span>
                  <div className="text-sm font-black text-yellow-400">{stats.highestMultiplier.toFixed(1)}x</div>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 space-y-0.5">
                  <span className="text-[9px] uppercase font-bold text-gray-400">Best Bottle</span>
                  <div className="text-xs font-black text-blue-300 truncate">{currentBottle.name}</div>
                </div>
              </div>

              <button
                onClick={() => setShowStatsModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-gray-200 text-xs font-bold hover:bg-zinc-700"
              >
                Close Statistics
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POPUP 5: RANKING MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showRankModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-5 max-w-sm w-full space-y-4 text-center shadow-2xl relative"
            >
              <button
                onClick={() => setShowRankModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="space-y-1">
                <h3 className="text-base font-black text-purple-400 flex items-center justify-center gap-1.5">
                  <Trophy className="h-4 w-4" />
                  Player Ranking & Streaks
                </h3>
                <p className="text-[10px] text-gray-400">Leaderboard Position</p>
              </div>

              <div className="space-y-2 text-left">
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Current Spin #</span>
                  <span className="font-mono font-black text-white">#{stats.spins + 1}</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Today's Rank</span>
                  <span className="font-mono font-black text-amber-400">#3 Master Spinner</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Global Rank</span>
                  <span className="font-mono font-black text-purple-400">#12 Diamond League</span>
                </div>
                <div className="bg-zinc-900 p-3 rounded-2xl border border-white/5 flex justify-between items-center text-xs">
                  <span className="text-gray-400">Winning Streak</span>
                  <span className="font-mono font-black text-emerald-400">{stats.winningStreak} Wins 🔥</span>
                </div>
              </div>

              <button
                onClick={() => setShowRankModal(false)}
                className="w-full py-2.5 rounded-xl bg-zinc-800 text-gray-200 text-xs font-bold hover:bg-zinc-700"
              >
                Close Ranking
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* POPUP 6: THEME MODAL */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showThemeModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-zinc-950 border border-white/10 rounded-3xl p-5 max-w-md w-full max-h-[80vh] overflow-y-auto space-y-4 text-left shadow-2xl relative"
            >
              <button
                onClick={() => setShowThemeModal(false)}
                className="absolute top-4 right-4 p-1.5 rounded-full bg-white/10 text-gray-400 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="text-center space-y-1">
                <h3 className="text-base font-black text-amber-400">Wheel Themes Vault</h3>
                <p className="text-[10px] text-gray-400">Customize wheel artwork & lights</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {WHEEL_THEMES.map(theme => {
                  const isUnlocked = unlockedThemeIds.includes(theme.id);
                  const isEquipped = wheelThemeId === theme.id;

                  return (
                    <div
                      key={theme.id}
                      className={`p-3 rounded-2xl border flex items-center justify-between gap-2 ${
                        isEquipped
                          ? 'bg-amber-500/20 border-amber-400'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10'
                          : 'bg-zinc-950 border-white/5 opacity-75'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{theme.badge}</span>
                        <div>
                          <div className="text-xs font-black text-white">{theme.name}</div>
                          <div className="text-[9px] text-gray-400">{theme.price === 0 ? 'Default' : `${theme.price} Coins`}</div>
                        </div>
                      </div>

                      {isEquipped ? (
                        <span className="text-[10px] font-black text-amber-300">EQUIPPED</span>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => { synth.playClick(); setWheelThemeId(theme.id); }}
                          className="px-2.5 py-1 rounded-xl bg-zinc-800 text-white text-[10px] font-bold"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => handleBuyTheme(theme)}
                          className="px-2.5 py-1 rounded-xl bg-emerald-500 text-black text-[10px] font-black"
                        >
                          Buy
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
