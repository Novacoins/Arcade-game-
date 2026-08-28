/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PortraitAvatar {
  id: string;
  name: string;
  subtitle: string;
  gender: 'male' | 'female';
  bgType: 
    | 'cyber_blue' 
    | 'purple_galaxy' 
    | 'emerald_cave' 
    | 'golden_palace' 
    | 'crimson_battlefield' 
    | 'arctic_ice' 
    | 'mystic_forest' 
    | 'neon_city' 
    | 'space_nebula' 
    | 'ancient_temple' 
    | 'dark_volcano' 
    | 'aurora_sky';
  bgName: string;
  frameType: 
    | 'blue_neon' 
    | 'purple_neon' 
    | 'royal_gold' 
    | 'ruby_red' 
    | 'emerald_green' 
    | 'crystal_cyan' 
    | 'orange_fire' 
    | 'silver_chrome' 
    | 'electric_violet' 
    | 'rainbow_prism' 
    | 'crimson_glow' 
    | 'amber_flare';
  frameName: string;
  themeColor: string;
  skinTone: string;
  skinShadow: string;
  eyeColor: string;
  hairColor: string;
  hairColorDark: string;
  armorColor: string;
  armorAccent: string;
  badge: string;
}

export const PORTRAIT_AVATARS: PortraitAvatar[] = [
  // 6 MALE AVATARS
  {
    id: 'cyber_soldier',
    name: 'Cyber Soldier',
    subtitle: 'Tactical Cyber Warfare Specialist',
    gender: 'male',
    bgType: 'cyber_blue',
    bgName: 'Cyber Blue Energy',
    frameType: 'blue_neon',
    frameName: 'Blue Neon Glow',
    themeColor: '#3b82f6',
    skinTone: '#e2a782',
    skinShadow: '#b87854',
    eyeColor: '#60a5fa',
    hairColor: '#38bdf8',
    hairColorDark: '#0284c7',
    armorColor: '#0f172a',
    armorAccent: '#3b82f6',
    badge: '⚡'
  },
  {
    id: 'elite_commando',
    name: 'Elite Commando',
    subtitle: 'Apex Tactical Field Operative',
    gender: 'male',
    bgType: 'neon_city',
    bgName: 'Neon City Slums',
    frameType: 'silver_chrome',
    frameName: 'Silver Chrome',
    themeColor: '#94a3b8',
    skinTone: '#d49870',
    skinShadow: '#a66a45',
    eyeColor: '#f87171',
    hairColor: '#475569',
    hairColorDark: '#1e293b',
    armorColor: '#1e293b',
    armorAccent: '#cbd5e1',
    badge: '🎖️'
  },
  {
    id: 'royal_knight',
    name: 'Royal Knight',
    subtitle: 'Legendary Solar Paladin',
    gender: 'male',
    bgType: 'golden_palace',
    bgName: 'Golden Royal Palace',
    frameType: 'royal_gold',
    frameName: 'Royal Gold Aura',
    themeColor: '#f59e0b',
    skinTone: '#e8b288',
    skinShadow: '#b98059',
    eyeColor: '#fbbf24',
    hairColor: '#fef08a',
    hairColorDark: '#ca8a04',
    armorColor: '#78350f',
    armorAccent: '#fbbf24',
    badge: '☀️'
  },
  {
    id: 'shadow_ninja',
    name: 'Shadow Ninja',
    subtitle: 'Master of Silent Shadow Combat',
    gender: 'male',
    bgType: 'ancient_temple',
    bgName: 'Ancient Shadow Temple',
    frameType: 'electric_violet',
    frameName: 'Electric Violet',
    themeColor: '#8b5cf6',
    skinTone: '#cbb092',
    skinShadow: '#93785d',
    eyeColor: '#a78bfa',
    hairColor: '#18181b',
    hairColorDark: '#09090b',
    armorColor: '#18181b',
    armorAccent: '#a855f7',
    badge: '🥷'
  },
  {
    id: 'space_marine',
    name: 'Space Marine',
    subtitle: 'Galactic Void Vanguard',
    gender: 'male',
    bgType: 'space_nebula',
    bgName: 'Cosmic Void Nebula',
    frameType: 'crystal_cyan',
    frameName: 'Crystal Cyan Shield',
    themeColor: '#06b6d4',
    skinTone: '#8d5b40',
    skinShadow: '#5c3924',
    eyeColor: '#22d3ee',
    hairColor: '#e2e8f0',
    hairColorDark: '#64748b',
    armorColor: '#164e63',
    armorAccent: '#22d3ee',
    badge: '🚀'
  },
  {
    id: 'dragon_warrior',
    name: 'Dragon Warrior',
    subtitle: 'Ancient Flame Dragon Lord',
    gender: 'male',
    bgType: 'dark_volcano',
    bgName: 'Infernal Lava Pit',
    frameType: 'orange_fire',
    frameName: 'Inferno Orange Blaze',
    themeColor: '#f97316',
    skinTone: '#d9976e',
    skinShadow: '#a2653f',
    eyeColor: '#fb923c',
    hairColor: '#dc2626',
    hairColorDark: '#7f1d1d',
    armorColor: '#451a03',
    armorAccent: '#ea580c',
    badge: '🐉'
  },

  // 6 FEMALE AVATARS
  {
    id: 'battle_queen',
    name: 'Battle Queen',
    subtitle: 'Royal Guardian Fleet Commander',
    gender: 'female',
    bgType: 'crimson_battlefield',
    bgName: 'Crimson War Fortress',
    frameType: 'ruby_red',
    frameName: 'Ruby Red Halo',
    themeColor: '#ef4444',
    skinTone: '#f3c19d',
    skinShadow: '#c88e6a',
    eyeColor: '#f87171',
    hairColor: '#fda4af',
    hairColorDark: '#e11d48',
    armorColor: '#4c0519',
    armorAccent: '#f43f5e',
    badge: '👑'
  },
  {
    id: 'cyber_hacker',
    name: 'Cyber Hacker Girl',
    subtitle: 'Infiltration & Tech Specialist',
    gender: 'female',
    bgType: 'cyber_blue',
    bgName: 'Quantum Grid Core',
    frameType: 'rainbow_prism',
    frameName: 'Prism Rainbow Matrix',
    themeColor: '#ec4899',
    skinTone: '#f9d5bb',
    skinShadow: '#d3a182',
    eyeColor: '#f472b6',
    hairColor: '#f0abfc',
    hairColorDark: '#c084fc',
    armorColor: '#31102f',
    armorAccent: '#f472b6',
    badge: '💻'
  },
  {
    id: 'fantasy_mage',
    name: 'Fantasy Mage',
    subtitle: 'Arcane Element Sorceress',
    gender: 'female',
    bgType: 'mystic_forest',
    bgName: 'Enchanted Crystal Forest',
    frameType: 'purple_neon',
    frameName: 'Purple Neon Spark',
    themeColor: '#a855f7',
    skinTone: '#eec2a0',
    skinShadow: '#be8c68',
    eyeColor: '#c084fc',
    hairColor: '#e9d5ff',
    hairColorDark: '#9333ea',
    armorColor: '#3b0764',
    armorAccent: '#d8b4fe',
    badge: '🔮'
  },
  {
    id: 'neon_assassin',
    name: 'Neon Assassin',
    subtitle: 'Lethal Syndicate Shadow Blade',
    gender: 'female',
    bgType: 'neon_city',
    bgName: 'Cyberpunk Neon Skyline',
    frameType: 'electric_violet',
    frameName: 'Electric Violet Ring',
    themeColor: '#10b981',
    skinTone: '#eab897',
    skinShadow: '#b37f5f',
    eyeColor: '#34d399',
    hairColor: '#6ee7b7',
    hairColorDark: '#059669',
    armorColor: '#064e3b',
    armorAccent: '#34d399',
    badge: '🗡️'
  },
  {
    id: 'guardian_princess',
    name: 'Guardian Princess',
    subtitle: 'Celestial Shield Maiden',
    gender: 'female',
    bgType: 'aurora_sky',
    bgName: 'Celestial Aurora Realm',
    frameType: 'emerald_green',
    frameName: 'Emerald Crystal Crest',
    themeColor: '#10b981',
    skinTone: '#fcd5ce',
    skinShadow: '#d8a499',
    eyeColor: '#6ee7b7',
    hairColor: '#fef08a',
    hairColorDark: '#eab308',
    armorColor: '#022c22',
    armorAccent: '#10b981',
    badge: '🛡️'
  },
  {
    id: 'elite_sniper',
    name: 'Elite Sniper',
    subtitle: 'Precision Crimson Sharpshooter',
    gender: 'female',
    bgType: 'arctic_ice',
    bgName: 'Frostbite Glacier Summit',
    frameType: 'crystal_cyan',
    frameName: 'Cryo Ice Aura',
    themeColor: '#38bdf8',
    skinTone: '#f5d3bd',
    skinShadow: '#c99f86',
    eyeColor: '#38bdf8',
    hairColor: '#e0f2fe',
    hairColorDark: '#0284c7',
    armorColor: '#0c4a6e',
    armorAccent: '#38bdf8',
    badge: '🎯'
  }
];
