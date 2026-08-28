/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Trophy, Flame, Shield, Volume2, VolumeX, HelpCircle, 
  Swords, Heart, Snowflake, Play, RotateCcw, Award, 
  ChevronRight, Coins, Sparkles, Zap, Lock, Check, ShoppingBag, Eye
} from 'lucide-react';

interface ArcadeGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

/* ==========================================
   WEAPON SKINS & ARENA DEFINITIONS
   ========================================== */

export interface FruitWeapon {
  id: string;
  name: string;
  icon: string;
  price: number;
  perk: string;
  speedBonus: number;
  critBonus: number;
  coinBonus: number;
  trailColor: string;
  trailGlow: string;
  description: string;
  type: 'sword' | 'knife' | 'katana' | 'snake';
  scalePattern?: string;
  rarity: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Immortal';
  unlockReq: string;
  effectType: 'golden' | 'silver' | 'red_laser' | 'python' | 'cobra' | 'emerald_snake' | 'flames' | 'ice' | 'lightning' | 'crystal' | 'dragon' | 'mamba' | 'viper' | 'boa';
}

export const WEAPONS_LIST: Record<string, FruitWeapon> = {
  basic_sword: {
    id: 'basic_sword',
    name: 'Basic Sword',
    icon: '⚔️',
    price: 0,
    perk: 'Balanced Blade • Starter Mastery',
    speedBonus: 10,
    critBonus: 10,
    coinBonus: 5,
    trailColor: '#e2e8f0',
    trailGlow: '#94a3b8',
    description: 'Normal sharpened silver steel blade. Clean, balanced, and reliable for precision slicing.',
    type: 'sword',
    rarity: 'Common',
    unlockReq: '🪙 0 Nova Coins (Starter Default)',
    effectType: 'silver'
  },
  combat_knife: {
    id: 'combat_knife',
    name: 'Tactical Combat Knife',
    icon: '🗡️',
    price: 10,
    perk: 'Slice Velocity +25% • Precision Reach',
    speedBonus: 25,
    critBonus: 15,
    coinBonus: 10,
    trailColor: '#ef4444',
    trailGlow: '#b91c1c',
    description: 'Military matte black steel with serrated spine and razor-sharp laser edge that slices rapidly.',
    type: 'knife',
    rarity: 'Common',
    unlockReq: '🪙 10 Nova Coins',
    effectType: 'red_laser'
  },
  katana: {
    id: 'katana',
    name: 'Samurai Katana',
    icon: '🔪',
    price: 20,
    perk: 'Samurai Focus • Critical Chance +20%',
    speedBonus: 20,
    critBonus: 20,
    coinBonus: 15,
    trailColor: '#38bdf8',
    trailGlow: '#0284c7',
    description: 'Masterfully folded silver steel with hamon temper line and smooth icy silver reflections.',
    type: 'katana',
    rarity: 'Rare',
    unlockReq: '🪙 20 Nova Coins',
    effectType: 'silver'
  },
  python_snake: {
    id: 'python_snake',
    name: 'Python Snake Companion',
    icon: '🐍',
    price: 30,
    perk: 'Diamondback Coils • Combo Bonus +25%',
    speedBonus: 20,
    critBonus: 25,
    coinBonus: 20,
    trailColor: '#d97706',
    trailGlow: '#78350f',
    description: 'Realistic diamondback python skin texture with coiling serpentine motion and heavy strike impact.',
    type: 'snake',
    scalePattern: 'diamondback',
    rarity: 'Rare',
    unlockReq: '🪙 30 Nova Coins',
    effectType: 'python'
  },
  fire_sword: {
    id: 'fire_sword',
    name: 'Inferno Fire Sword',
    icon: '🔥',
    price: 40,
    perk: 'Blazing Inferno • Scorching Multipliers +30%',
    speedBonus: 35,
    critBonus: 30,
    coinBonus: 25,
    trailColor: '#f97316',
    trailGlow: '#dc2626',
    description: 'Forged in molten volcanic lava, leaving scorching burning ember trails and igniting food halves.',
    type: 'sword',
    rarity: 'Epic',
    unlockReq: '🪙 40 Nova Coins',
    effectType: 'flames'
  },
  cobra_snake: {
    id: 'cobra_snake',
    name: 'Cobra Snake Companion',
    icon: '🐍',
    price: 50,
    perk: 'Royal Hood Strike • Venom Criticals +30%',
    speedBonus: 30,
    critBonus: 30,
    coinBonus: 30,
    trailColor: '#10b981',
    trailGlow: '#059669',
    description: 'Royal king cobra with hooded scale patterns and venomous emerald strikes that dissolve targets.',
    type: 'snake',
    scalePattern: 'cobra',
    rarity: 'Epic',
    unlockReq: '🪙 50 Nova Coins',
    effectType: 'cobra'
  },
  ice_sword: {
    id: 'ice_sword',
    name: 'Glacial Ice Sword',
    icon: '❄️',
    price: 60,
    perk: 'Sub-Zero Freeze • Time Slow Criticals +35%',
    speedBonus: 30,
    critBonus: 40,
    coinBonus: 35,
    trailColor: '#67e8f9',
    trailGlow: '#0284c7',
    description: 'Formed from eternal permafrost, trailing sub-zero blizzard crystals and freezing food in mid-air.',
    type: 'sword',
    rarity: 'Epic',
    unlockReq: '🪙 60 Nova Coins',
    effectType: 'ice'
  },
  grass_snake: {
    id: 'grass_snake',
    name: 'Green Grass Snake Companion',
    icon: '🐍',
    price: 70,
    perk: 'Aerodynamic Shimmer • Speed +35%',
    speedBonus: 35,
    critBonus: 35,
    coinBonus: 40,
    trailColor: '#4ade80',
    trailGlow: '#16a34a',
    description: 'Vibrant emerald grass snake with sleek aerodynamic scale shimmer and paralyzing poison mist.',
    type: 'snake',
    scalePattern: 'emerald',
    rarity: 'Epic',
    unlockReq: '🪙 70 Nova Coins',
    effectType: 'emerald_snake'
  },
  lightning_sword: {
    id: 'lightning_sword',
    name: 'Voltage Lightning Sword',
    icon: '⚡',
    price: 80,
    perk: 'High Voltage • Speed & Combo +40%',
    speedBonus: 45,
    critBonus: 35,
    coinBonus: 45,
    trailColor: '#facc15',
    trailGlow: '#38bdf8',
    description: 'Pulsing with 10,000 volts of electricity, sparking jagged electric blue bolts across combo slices.',
    type: 'sword',
    rarity: 'Legendary',
    unlockReq: '🪙 80 Nova Coins',
    effectType: 'lightning'
  },
  crystal_blade: {
    id: 'crystal_blade',
    name: 'Prism Crystal Blade',
    icon: '💎',
    price: 90,
    perk: 'Prismatic Refraction • Diamond Jackpot +40%',
    speedBonus: 40,
    critBonus: 45,
    coinBonus: 50,
    trailColor: '#e879f9',
    trailGlow: '#06b6d4',
    description: 'Flawless diamond crystal prism that refracts light, shattering food into glowing diamond shards.',
    type: 'sword',
    rarity: 'Legendary',
    unlockReq: '🪙 90 Nova Coins',
    effectType: 'crystal'
  },
  dragon_sword: {
    id: 'dragon_sword',
    name: 'Dragon Energy Sword',
    icon: '🐉',
    price: 100,
    perk: 'Sacred Dragon Spirit • All Stats +45%',
    speedBonus: 45,
    critBonus: 45,
    coinBonus: 55,
    trailColor: '#34d399',
    trailGlow: '#059669',
    description: 'Imbued with ancient green dragon energy, leaving a premium roaring emerald spirit trail with golden scales.',
    type: 'sword',
    rarity: 'Legendary',
    unlockReq: '🪙 100 Nova Coins',
    effectType: 'dragon'
  },
  black_mamba: {
    id: 'black_mamba',
    name: 'Black Mamba Serpent Companion',
    icon: '🐍',
    price: 110,
    perk: 'Midnight Shadow • Lethal Strike +45%',
    speedBonus: 50,
    critBonus: 45,
    coinBonus: 60,
    trailColor: '#a855f7',
    trailGlow: '#3b0764',
    description: 'Lethal midnight purple shadow scales that glide silently with terrifying speed and dark venom explosions.',
    type: 'snake',
    scalePattern: 'mamba',
    rarity: 'Mythic',
    unlockReq: '🪙 110 Nova Coins',
    effectType: 'mamba'
  },
  golden_viper: {
    id: 'golden_viper',
    name: 'Golden Viper Serpent Companion',
    icon: '🐍',
    price: 120,
    perk: 'Gilded Fortune • Gold Luck & Coins +50%',
    speedBonus: 45,
    critBonus: 50,
    coinBonus: 65,
    trailColor: '#fde047',
    trailGlow: '#ca8a04',
    description: 'Sacred imperial gilded serpent covered in pure 24-karat gold scales, maximizing coin showers.',
    type: 'snake',
    scalePattern: 'viper',
    rarity: 'Mythic',
    unlockReq: '🪙 120 Nova Coins',
    effectType: 'viper'
  },
  gold_sword: {
    id: 'gold_sword',
    name: 'Royal Golden Sword',
    icon: '⚔️',
    price: 130,
    perk: 'Imperial Fortune • Gold Showers & Coins +55%',
    speedBonus: 50,
    critBonus: 50,
    coinBonus: 70,
    trailColor: '#fbbf24',
    trailGlow: '#f59e0b',
    description: 'Imbued with royal fortune. Generates glowing golden coin showers on every sliced target.',
    type: 'sword',
    rarity: 'Mythic',
    unlockReq: '🪙 130 Nova Coins',
    effectType: 'golden'
  },
  emerald_boa: {
    id: 'emerald_boa',
    name: 'Emerald Tree Boa Companion',
    icon: '🐍',
    price: 140,
    perk: 'Rainforest Apex • Supreme Stats +60%',
    speedBonus: 55,
    critBonus: 55,
    coinBonus: 75,
    trailColor: '#34d399',
    trailGlow: '#065f46',
    description: 'The ultimate rainforest predator with mesmerizing iridescent emerald scales and supreme all-round mastery.',
    type: 'snake',
    scalePattern: 'boa',
    rarity: 'Immortal',
    unlockReq: '🪙 140 Nova Coins',
    effectType: 'boa'
  }
};

export interface ArenaTheme {
  id: string;
  name: string;
  price: number;
  icon: string;
  bg1: string;
  bg2: string;
  particleColor: string;
  particleType: 'petals' | 'fireflies' | 'lanterns' | 'embers' | 'stars' | 'snow' | 'magma' | 'sunrays' | 'nebula' | 'gold' | 'cyber' | 'crystals' | 'pirate';
  accentColor: string;
  desc: string;
  atmosphere: string;
  weather: string;
  ambientSound: string;
}

export const ARENAS_LIST: Record<string, ArenaTheme> = {
  dojo_night: {
    id: 'dojo_night',
    name: 'Night Dojo',
    price: 0,
    icon: '⛩️',
    bg1: '#09090b',
    bg2: '#18181b',
    particleColor: '#f472b6',
    particleType: 'petals',
    accentColor: '#ef4444',
    desc: 'Traditional Japanese temple under moonlight with drifting sakura petals and luxury lantern shadows.',
    atmosphere: 'Moonlit Sanctuary',
    weather: 'Gentle Night Breeze & Petal Drift',
    ambientSound: 'Traditional Flute & Night Wind'
  },
  bamboo_forest: {
    id: 'bamboo_forest',
    name: 'Bamboo Forest',
    price: 15,
    icon: '🎋',
    bg1: '#051b11',
    bg2: '#0d3823',
    particleColor: '#4ade80',
    particleType: 'fireflies',
    accentColor: '#10b981',
    desc: 'Emerald bamboo stalks swaying in evening mist with glowing spirit fireflies illuminating the grove.',
    atmosphere: 'Mystic Emerald Grove',
    weather: 'Evening Mist & Fireflies',
    ambientSound: 'Rustling Bamboo & Forest Chimes'
  },
  golden_temple: {
    id: 'golden_temple',
    name: 'Golden Temple',
    price: 30,
    icon: '🏯',
    bg1: '#1c1604',
    bg2: '#3d310a',
    particleColor: '#fde047',
    particleType: 'gold',
    accentColor: '#eab308',
    desc: 'Majestic gilded imperial sanctuary lit by royal gold banners, crackling braziers, and floating gold sparkles.',
    atmosphere: 'Gilded Imperial Majesty',
    weather: 'Golden Radiance & Sparkle Shower',
    ambientSound: 'Sacred Temple Bells & Resonance'
  },
  frozen_mountain: {
    id: 'frozen_mountain',
    name: 'Frozen Mountain',
    price: 45,
    icon: '❄️',
    bg1: '#082f49',
    bg2: '#0369a1',
    particleColor: '#67e8f9',
    particleType: 'snow',
    accentColor: '#06b6d4',
    desc: 'Crystalline glacial peak under vibrant aurora borealis with swirling frost crystals and sub-zero winds.',
    atmosphere: 'Arctic Glacial Cavern',
    weather: 'Sub-Zero Snowfall & Aurora',
    ambientSound: 'Arctic Blizzard & Ice Crystals'
  },
  volcano_arena: {
    id: 'volcano_arena',
    name: 'Volcano Arena',
    price: 60,
    icon: '🌋',
    bg1: '#270a0a',
    bg2: '#450a0a',
    particleColor: '#f97316',
    particleType: 'magma',
    accentColor: '#ea580c',
    desc: 'Volcanic caldera with glowing magma streams, rising thermal heat distortion, and floating fiery embers.',
    atmosphere: 'Scorching Molten Caldera',
    weather: 'Falling Volcanic Ash & Embers',
    ambientSound: 'Deep Magma Rumble & Crackle'
  },
  crystal_palace: {
    id: 'crystal_palace',
    name: 'Crystal Palace',
    price: 75,
    icon: '💎',
    bg1: '#1e1b4b',
    bg2: '#312e81',
    particleColor: '#e879f9',
    particleType: 'crystals',
    accentColor: '#c084fc',
    desc: 'Prismatic diamond sanctuary that refracts rainbow lighting across floating glowing crystal shards.',
    atmosphere: 'Ethereal Prismatic Sanctuary',
    weather: 'Crystal Shimmer & Refraction',
    ambientSound: 'Resonant Crystal Chimes & Harmonics'
  },
  cyber_tokyo: {
    id: 'cyber_tokyo',
    name: 'Cyber Tokyo',
    price: 90,
    icon: '🗼',
    bg1: '#0a0a1a',
    bg2: '#1a0a2a',
    particleColor: '#00f0ff',
    particleType: 'cyber',
    accentColor: '#f000ff',
    desc: 'Neon cyberpunk metropolis rooftops with holographic billboards, neon reflections, and digital cyber rain.',
    atmosphere: 'Neon Cyberpunk Future',
    weather: 'Digital Cyber Rain & Holograms',
    ambientSound: 'Synthwave Ambient Hum & Cyber Beeps'
  },
  dragon_shrine: {
    id: 'dragon_shrine',
    name: 'Dragon Shrine',
    price: 105,
    icon: '🐉',
    bg1: '#1f0a1c',
    bg2: '#381332',
    particleColor: '#fb7185',
    particleType: 'lanterns',
    accentColor: '#e11d48',
    desc: 'Sacred mountain altar dedicated to ancient dragon deities, surrounded by floating spirit lanterns and incense.',
    atmosphere: 'Ancient Dragon Sanctuary',
    weather: 'Spirit Lantern Drift & Incense',
    ambientSound: 'Ceremonial Gongs & Dragon Roar'
  },
  galaxy_arena: {
    id: 'galaxy_arena',
    name: 'Galaxy Arena',
    price: 120,
    icon: '🌌',
    bg1: '#030712',
    bg2: '#1e1b4b',
    particleColor: '#c084fc',
    particleType: 'nebula',
    accentColor: '#a855f7',
    desc: 'Deep cosmos nebula featuring spinning galaxies, astral starlight, and cosmic stardust particles.',
    atmosphere: 'Infinite Stellar Cosmos',
    weather: 'Stellar Nebula Drift & Stardust',
    ambientSound: 'Cosmic Deep Space Resonance'
  },
  pirate_island: {
    id: 'pirate_island',
    name: 'Pirate Island',
    price: 135,
    icon: '🏴‍☠️',
    bg1: '#042f2e',
    bg2: '#115e59',
    particleColor: '#fde047',
    particleType: 'pirate',
    accentColor: '#14b8a6',
    desc: 'Tropical Caribbean sunset cove with swaying palms, ocean reflections, and glittering gold doubloon showers.',
    atmosphere: 'Caribbean Sunset Cove',
    weather: 'Ocean Sunrays & Doubloon Drift',
    ambientSound: 'Tropical Ocean Waves & Seagulls'
  }
};

/* ==========================================
   REALISTIC HD FOODS & FRUITS DEFINITIONS
   ========================================== */

export interface FruitDef {
  id: string;
  name: string;
  outerColor: string;
  innerColor: string;
  seedColor: string;
  size: number;
  shape: 'round' | 'oval' | 'pear' | 'banana' | 'pineapple' | 'strawberry' | 'avocado' | 'bread' | 'cake' | 'pizza' | 'sushi' | 'burger' | 'carrot' | 'tomato' | 'corn' | 'eggplant';
  rindWidth: number;
  particleStyle?: 'juice' | 'crumbs' | 'splash';
}

export const REALISTIC_FRUITS: FruitDef[] = [
  // Classic Fruits
  { id: 'watermelon', name: 'Watermelon', outerColor: '#15803d', innerColor: '#ef4444', seedColor: '#09090b', size: 36, shape: 'round', rindWidth: 6, particleStyle: 'juice' },
  { id: 'orange', name: 'Orange', outerColor: '#f97316', innerColor: '#ffedd5', seedColor: '#f97316', size: 28, shape: 'round', rindWidth: 4, particleStyle: 'splash' },
  { id: 'kiwi', name: 'Kiwi', outerColor: '#854d0e', innerColor: '#84cc16', seedColor: '#09090b', size: 26, shape: 'round', rindWidth: 3, particleStyle: 'splash' },
  { id: 'apple', name: 'Apple', outerColor: '#dc2626', innerColor: '#fef08a', seedColor: '#451a03', size: 30, shape: 'round', rindWidth: 3, particleStyle: 'juice' },
  { id: 'mango', name: 'Mango', outerColor: '#ea580c', innerColor: '#fbbf24', seedColor: '#d97706', size: 32, shape: 'oval', rindWidth: 3, particleStyle: 'juice' },
  { id: 'banana', name: 'Banana', outerColor: '#facc15', innerColor: '#fef9c3', seedColor: '#a16207', size: 28, shape: 'banana', rindWidth: 3, particleStyle: 'splash' },
  { id: 'pineapple', name: 'Pineapple', outerColor: '#ca8a04', innerColor: '#fde047', seedColor: '#854d0e', size: 35, shape: 'pineapple', rindWidth: 5, particleStyle: 'juice' },
  { id: 'coconut', name: 'Coconut', outerColor: '#78350f', innerColor: '#ffffff', seedColor: '#e2e8f0', size: 32, shape: 'round', rindWidth: 6, particleStyle: 'splash' },
  { id: 'strawberry', name: 'Strawberry', outerColor: '#e11d48', innerColor: '#ffe4e6', seedColor: '#facc15', size: 25, shape: 'strawberry', rindWidth: 2, particleStyle: 'juice' },
  { id: 'lemon', name: 'Lemon', outerColor: '#eab308', innerColor: '#fef08a', seedColor: '#fde047', size: 26, shape: 'oval', rindWidth: 3, particleStyle: 'splash' },
  { id: 'lime', name: 'Lime', outerColor: '#22c55e', innerColor: '#dcfce7', seedColor: '#86efac', size: 25, shape: 'oval', rindWidth: 3, particleStyle: 'splash' },
  { id: 'grapes', name: 'Grapes', outerColor: '#7c3aed', innerColor: '#ddd6fe', seedColor: '#5b21b6', size: 28, shape: 'round', rindWidth: 2, particleStyle: 'juice' },
  { id: 'pear', name: 'Pear', outerColor: '#65a30d', innerColor: '#fef9c3', seedColor: '#451a03', size: 30, shape: 'pear', rindWidth: 3, particleStyle: 'juice' },
  { id: 'peach', name: 'Peach', outerColor: '#fb7185', innerColor: '#fde68a', seedColor: '#78350f', size: 29, shape: 'round', rindWidth: 3, particleStyle: 'juice' },
  { id: 'cherry', name: 'Cherry', outerColor: '#9f1239', innerColor: '#f43f5e', seedColor: '#4c0519', size: 23, shape: 'round', rindWidth: 2, particleStyle: 'juice' },
  { id: 'avocado', name: 'Avocado', outerColor: '#14532d', innerColor: '#86efac', seedColor: '#78350f', size: 31, shape: 'avocado', rindWidth: 4, particleStyle: 'splash' },
  { id: 'dragonfruit', name: 'Dragon Fruit', outerColor: '#ec4899', innerColor: '#ffffff', seedColor: '#09090b', size: 33, shape: 'oval', rindWidth: 5, particleStyle: 'splash' },
  { id: 'papaya', name: 'Papaya', outerColor: '#ea580c', innerColor: '#fb923c', seedColor: '#1c1917', size: 33, shape: 'oval', rindWidth: 4, particleStyle: 'juice' },
  { id: 'guava', name: 'Guava', outerColor: '#4ade80', innerColor: '#f43f5e', seedColor: '#fef08a', size: 28, shape: 'round', rindWidth: 3, particleStyle: 'juice' },
  { id: 'pomegranate', name: 'Pomegranate', outerColor: '#991b1b', innerColor: '#e11d48', seedColor: '#ffffff', size: 32, shape: 'round', rindWidth: 5, particleStyle: 'juice' },
  { id: 'blueberry', name: 'Blueberry', outerColor: '#1e3a8a', innerColor: '#60a5fa', seedColor: '#172554', size: 21, shape: 'round', rindWidth: 2, particleStyle: 'juice' },

  // Vegetables, Bakery & Fast Foods (Requirement 1 & 3)
  { id: 'cake', name: 'Strawberry Cake', outerColor: '#f43f5e', innerColor: '#ffe4e6', seedColor: '#e11d48', size: 34, shape: 'cake', rindWidth: 4, particleStyle: 'crumbs' },
  { id: 'bread', name: 'Loaf Bread', outerColor: '#b45309', innerColor: '#fef08a', seedColor: '#78350f', size: 33, shape: 'bread', rindWidth: 4, particleStyle: 'crumbs' },
  { id: 'pizza', name: 'Pepperoni Pizza', outerColor: '#ea580c', innerColor: '#fde047', seedColor: '#dc2626', size: 35, shape: 'pizza', rindWidth: 3, particleStyle: 'crumbs' },
  { id: 'burger', name: 'Cheeseburger', outerColor: '#92400e', innerColor: '#facc15', seedColor: '#22c55e', size: 36, shape: 'burger', rindWidth: 4, particleStyle: 'crumbs' },
  { id: 'sushi', name: 'Salmon Nigiri', outerColor: '#09090b', innerColor: '#ffffff', seedColor: '#f97316', size: 30, shape: 'sushi', rindWidth: 3, particleStyle: 'crumbs' },
  { id: 'carrot', name: 'Fresh Carrot', outerColor: '#f97316', innerColor: '#fdba74', seedColor: '#16a34a', size: 30, shape: 'carrot', rindWidth: 2, particleStyle: 'splash' },
  { id: 'tomato', name: 'Ripe Tomato', outerColor: '#dc2626', innerColor: '#ef4444', seedColor: '#facc15', size: 29, shape: 'tomato', rindWidth: 3, particleStyle: 'juice' },
  { id: 'corn', name: 'Sweet Corn', outerColor: '#16a34a', innerColor: '#facc15', seedColor: '#eab308', size: 32, shape: 'corn', rindWidth: 4, particleStyle: 'splash' },
  { id: 'eggplant', name: 'Royal Eggplant', outerColor: '#4c1d95', innerColor: '#f3e8ff', seedColor: '#581c87', size: 31, shape: 'eggplant', rindWidth: 4, particleStyle: 'splash' }
];

export const REALISTIC_FOODS = REALISTIC_FRUITS;

/* ==========================================
   HELPER: CANVAS FRUIT RENDERING
   ========================================== */
function drawRealisticFruit(
  ctx: CanvasRenderingContext2D,
  f: { x: number; y: number; radius: number; angle: number; fruitDef: FruitDef; specialType: string; sliced?: boolean; half?: 'left' | 'right' }
) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.angle);

  const { outerColor, innerColor, seedColor, shape, rindWidth } = f.fruitDef;
  const r = f.radius;

  // Clip if rendering sliced half
  if (f.sliced && f.half) {
    ctx.beginPath();
    if (f.half === 'left') {
      ctx.rect(-r * 2, -r * 2, r * 2, r * 4);
    } else {
      ctx.rect(0, -r * 2, r * 2, r * 4);
    }
    ctx.clip();
  }

  // Draw Special Glow / Aura if infused
  if (f.specialType !== 'normal' && f.specialType !== 'bomb') {
    ctx.beginPath();
    ctx.arc(0, 0, r + 8, 0, Math.PI * 2);
    let auraColor = '#fbbf24';
    if (f.specialType === 'freeze') auraColor = '#06b6d4';
    if (f.specialType === 'diamond') auraColor = '#38bdf8';
    if (f.specialType === 'golden' || f.specialType === 'coin') auraColor = '#eab308';
    ctx.fillStyle = auraColor + '33';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = auraColor;
    ctx.stroke();
  }

  // Draw Body Shape
  ctx.beginPath();
  if (shape === 'round' || shape === 'pizza' || shape === 'tomato') {
    ctx.arc(0, 0, r, 0, Math.PI * 2);
  } else if (shape === 'oval') {
    ctx.ellipse(0, 0, r * 1.15, r * 0.85, 0, 0, Math.PI * 2);
  } else if (shape === 'pear') {
    ctx.moveTo(0, -r);
    ctx.bezierCurveTo(r * 0.8, -r * 0.5, r * 1.2, r * 0.5, 0, r);
    ctx.bezierCurveTo(-r * 1.2, r * 0.5, -r * 0.8, -r * 0.5, 0, -r);
  } else if (shape === 'banana') {
    ctx.arc(0, 0, r, 0.2, Math.PI - 0.2);
    ctx.bezierCurveTo(r * 0.5, -r * 0.3, -r * 0.5, -r * 0.3, r, 0.2);
  } else if (shape === 'pineapple' || shape === 'corn') {
    ctx.rect(-r * 0.8, -r, r * 1.6, r * 2);
  } else if (shape === 'strawberry' || shape === 'carrot') {
    ctx.moveTo(0, r);
    ctx.bezierCurveTo(-r * 1.1, 0, -r * 0.8, -r, 0, -r * 0.8);
    ctx.bezierCurveTo(r * 0.8, -r, r * 1.1, 0, 0, r);
  } else if (shape === 'avocado' || shape === 'eggplant') {
    ctx.ellipse(0, r * 0.1, r * 0.85, r * 1.05, 0, 0, Math.PI * 2);
  } else if (shape === 'bread' || shape === 'cake' || shape === 'burger' || shape === 'sushi') {
    if (ctx.roundRect) {
      ctx.roundRect(-r * 0.9, -r * 0.8, r * 1.8, r * 1.6, 8);
    } else {
      ctx.rect(-r * 0.9, -r * 0.8, r * 1.8, r * 1.6);
    }
  }

  // Outer Rind Gradient
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, r * 0.1, 0, 0, r);
  grad.addColorStop(0, outerColor);
  grad.addColorStop(0.85, outerColor);
  grad.addColorStop(1, '#09090b88'); // edge shading
  ctx.fillStyle = grad;
  ctx.fill();

  // Draw Inner Flesh if sliced or transparent rind
  if (f.sliced || f.half) {
    ctx.beginPath();
    if (shape === 'round') ctx.arc(0, 0, r - rindWidth, 0, Math.PI * 2);
    else ctx.ellipse(0, 0, (r - rindWidth) * 1.05, (r - rindWidth) * 0.85, 0, 0, Math.PI * 2);
    ctx.fillStyle = innerColor;
    ctx.fill();

    // Draw Seeds / Pit
    if (f.fruitDef.id === 'avocado' || f.fruitDef.id === 'peach' || f.fruitDef.id === 'mango') {
      // Large center pit
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fillStyle = seedColor;
      ctx.fill();
    } else if (f.fruitDef.id === 'watermelon' || f.fruitDef.id === 'dragonfruit' || f.fruitDef.id === 'kiwi') {
      // Speckled seeds
      ctx.fillStyle = seedColor;
      for (let i = 0; i < 8; i++) {
        const sa = (i / 8) * Math.PI * 2;
        const sd = r * 0.45;
        ctx.beginPath();
        ctx.arc(Math.cos(sa) * sd, Math.sin(sa) * sd, 2, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  } else {
    // 3D Specular Highlight on unbroken fruit
    ctx.beginPath();
    ctx.arc(-r * 0.35, -r * 0.35, r * 0.22, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
    ctx.fill();
  }

  // Special Icon Overlay on center if special
  if (!f.sliced && f.specialType !== 'normal') {
    ctx.font = 'bold 16px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    let badge = '';
    if (f.specialType === 'freeze') badge = '❄️';
    if (f.specialType === 'diamond') badge = '💎';
    if (f.specialType === 'golden') badge = '🌟';
    if (f.specialType === 'coin') badge = '🪙';
    if (badge) {
      ctx.fillText(badge, 0, 0);
    }
  }

  ctx.restore();
}

/* ==========================================
   HELPER: CANVAS BOMB RENDERING
   ========================================== */
function drawSpikedBomb(ctx: CanvasRenderingContext2D, f: { x: number; y: number; radius: number; angle: number }) {
  ctx.save();
  ctx.translate(f.x, f.y);
  ctx.rotate(f.angle);
  const r = f.radius;

  // Spikes
  ctx.fillStyle = '#ef4444';
  for (let i = 0; i < 8; i++) {
    ctx.rotate((Math.PI * 2) / 8);
    ctx.beginPath();
    ctx.moveTo(-4, -r + 4);
    ctx.lineTo(0, -r - 8);
    ctx.lineTo(4, -r + 4);
    ctx.fill();
  }

  // Body
  const grad = ctx.createRadialGradient(-r * 0.3, -r * 0.3, 2, 0, 0, r);
  grad.addColorStop(0, '#52525b');
  grad.addColorStop(0.7, '#18181b');
  grad.addColorStop(1, '#09090b');
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.fillStyle = grad;
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#ef4444';
  ctx.stroke();

  // Fuse and spark
  ctx.beginPath();
  ctx.moveTo(0, -r);
  ctx.quadraticCurveTo(r * 0.5, -r * 1.4, r * 0.6, -r * 1.2);
  ctx.lineWidth = 3;
  ctx.strokeStyle = '#d97706';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(r * 0.6, -r * 1.2, 5, 0, Math.PI * 2);
  ctx.fillStyle = '#facc15';
  ctx.fill();

  ctx.restore();
}

/* ==========================================
   MAIN GAME COMPONENT
   ========================================== */

export function FruitSlice({ coins, onGameWin, onGameLose }: ArcadeGameProps) {
  const { validateAndDeductCoins, addCoins } = useCoinValidation();

  // Persistent Unlocks & Selection
  const [unlockedWeapons, setUnlockedWeapons] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fruit_slice_unlocked_weapons');
      const parsed = saved ? JSON.parse(saved) : ['basic_sword', 'gold_sword'];
      if (!parsed.includes('basic_sword')) parsed.push('basic_sword');
      return parsed;
    } catch { return ['basic_sword', 'gold_sword']; }
  });
  const [unlockedArenas, setUnlockedArenas] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('fruit_slice_unlocked_arenas');
      return saved ? JSON.parse(saved) : ['dojo_night'];
    } catch { return ['dojo_night']; }
  });

  const [selectedWeapon, setSelectedWeapon] = useState<string>(() => localStorage.getItem('fruit_slice_weapon') || 'basic_sword');
  const [selectedEnv, setSelectedEnv] = useState<string>(() => localStorage.getItem('fruit_slice_env') || 'dojo_night');

  // Ensure fallbacks if ID changed
  const activeWep = WEAPONS_LIST[selectedWeapon] || WEAPONS_LIST['basic_sword'] || WEAPONS_LIST['gold_sword'];
  const activeArena = ARENAS_LIST[selectedEnv] || ARENAS_LIST['dojo_night'];

  // Game UI State
  const [bet, setBet] = useState(50);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(6);
  const [comboCount, setComboCount] = useState(0);
  const [freezeTime, setFreezeTime] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [shopTab, setShopTab] = useState<'blades' | 'dojos'>('blades');
  const [previewWeapon, setPreviewWeapon] = useState<FruitWeapon | null>(null);
  const [showBladeModal, setShowBladeModal] = useState(false);
  const [showDojoModal, setShowDojoModal] = useState(false);
  const [purchaseError, setPurchaseError] = useState<string | null>(null);
  const [confirmPurchase, setConfirmPurchase] = useState<{
    id: string;
    name: string;
    price: number;
    type: 'blade' | 'dojo';
    icon: string;
    rarity?: string;
    desc?: string;
  } | null>(null);
  const [showUnlockSplash, setShowUnlockSplash] = useState<{
    name: string;
    icon: string;
    type: 'blade' | 'dojo';
  } | null>(null);

  // Canvas & Game Refs
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  const fruitsRef = useRef<any[]>([]);
  const flyingPiecesRef = useRef<any[]>([]);
  const trailRef = useRef<{ x: number; y: number; time: number }[]>([]);
  const particlesRef = useRef<any[]>([]);
  const comboTextsRef = useRef<any[]>([]);
  const envParticlesRef = useRef<any[]>([]);
  const isSlicingRef = useRef(false);
  const lastPointRef = useRef<{ x: number; y: number } | null>(null);
  const lastSpawnRef = useRef(0);
  const spawnIntervalRef = useRef(1400);
  const livesRef = useRef(6);
  const scoreRef = useRef(0);
  const screenShakeRef = useRef(0);

  // Save changes
  const handleSelectWeapon = (wId: string) => {
    synth.playClick();
    setSelectedWeapon(wId);
    localStorage.setItem('fruit_slice_weapon', wId);
  };

  const handleSelectArena = (aId: string) => {
    synth.playClick();
    setSelectedEnv(aId);
    localStorage.setItem('fruit_slice_env', aId);
  };

  const initiateBuyWeapon = (wep: FruitWeapon) => {
    synth.playClick();
    setPurchaseError(null);
    setConfirmPurchase({
      id: wep.id,
      name: wep.name,
      price: wep.price,
      type: 'blade',
      icon: wep.icon,
      rarity: wep.rarity,
      desc: wep.description
    });
  };

  const initiateBuyArena = (arena: ArenaTheme) => {
    synth.playClick();
    setPurchaseError(null);
    setConfirmPurchase({
      id: arena.id,
      name: arena.name,
      price: arena.price,
      type: 'dojo',
      icon: arena.icon,
      rarity: 'Legendary',
      desc: arena.desc
    });
  };

  const handleBuyWeapon = (wId: string, price: number) => {
    const wep = WEAPONS_LIST[wId];
    if (wep) initiateBuyWeapon(wep);
  };

  const handleBuyArena = (aId: string, price: number) => {
    const arena = ARENAS_LIST[aId];
    if (arena) initiateBuyArena(arena);
  };

  const executePurchase = (item: { id: string; name: string; price: number; type: 'blade' | 'dojo'; icon: string }) => {
    if (coins < item.price) {
      synth.playError();
      setPurchaseError("Not enough Nova Coins.");
      return;
    }
    addCoins(-item.price, `Unlocked ${item.name}`);

    synth.playUpgradeSuccess();
    try { if ((synth as any).playFanfare) (synth as any).playFanfare(); } catch {}

    if (item.type === 'blade') {
      const next = Array.from(new Set([...unlockedWeapons, item.id]));
      setUnlockedWeapons(next);
      localStorage.setItem('fruit_slice_unlocked_weapons', JSON.stringify(next));
      handleSelectWeapon(item.id);
    } else {
      const next = Array.from(new Set([...unlockedArenas, item.id]));
      setUnlockedArenas(next);
      localStorage.setItem('fruit_slice_unlocked_arenas', JSON.stringify(next));
      handleSelectArena(item.id);
    }

    setPurchaseError(null);
    setConfirmPurchase(null);
    setShowUnlockSplash({ name: item.name, icon: item.icon, type: item.type });
    setTimeout(() => setShowUnlockSplash(null), 3500);
  };

  // Start Game
  const startGame = () => {
    if (!validateAndDeductCoins(bet, 'Fruit Slice PRO')) return;
    synth.playClick();
    setGameState('playing');
    setScore(0);
    scoreRef.current = 0;
    setLives(6);
    livesRef.current = 6;
    setComboCount(0);
    setFreezeTime(0);

    fruitsRef.current = [];
    flyingPiecesRef.current = [];
    trailRef.current = [];
    particlesRef.current = [];
    comboTextsRef.current = [];
    lastSpawnRef.current = performance.now();
    spawnIntervalRef.current = Math.max(800, 1500 - activeWep.speedBonus * 12);

    // Initialize environment background particles
    envParticlesRef.current = Array.from({ length: 30 }, () => ({
      x: Math.random() * 800,
      y: Math.random() * 600,
      vx: (Math.random() - 0.5) * 1.5,
      vy: (Math.random() - 0.5) * 1.5 - 0.3,
      radius: Math.random() * 3 + 1,
      alpha: Math.random() * 0.7 + 0.3
    }));

    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    requestRef.current = requestAnimationFrame(gameLoop);
  };

  const endGame = () => {
    if (requestRef.current) cancelAnimationFrame(requestRef.current);
    setGameState('gameover');
    synth.playLoss();
    if (scoreRef.current > 0) {
      const winCoins = Math.floor(scoreRef.current * (1 + activeWep.coinBonus / 100));
      onGameWin(winCoins, 1);
    } else {
      onGameLose(bet);
    }
  };

  // Main 60 FPS Game Loop
  const gameLoop = (timestamp: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const isFrozen = freezeTime > 0;
    const dtScale = isFrozen ? 0.35 : 1.0;

    if (isFrozen) {
      setFreezeTime((prev) => Math.max(0, prev - 1));
    }

    // Screen Shake
    ctx.save();
    if (screenShakeRef.current > 0) {
      ctx.translate(
        (Math.random() - 0.5) * screenShakeRef.current,
        (Math.random() - 0.5) * screenShakeRef.current
      );
      screenShakeRef.current *= 0.9;
      if (screenShakeRef.current < 0.5) screenShakeRef.current = 0;
    }

    // 1. Draw Environment Background
    const bgGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
    bgGrad.addColorStop(0, activeArena.bg1);
    bgGrad.addColorStop(1, activeArena.bg2);
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw Environment Particles
    ctx.fillStyle = activeArena.particleColor;
    envParticlesRef.current.forEach((ep) => {
      ep.x += ep.vx;
      ep.y += ep.vy;
      if (ep.x < 0) ep.x = canvas.width;
      if (ep.x > canvas.width) ep.x = 0;
      if (ep.y < 0) ep.y = canvas.height;
      if (ep.y > canvas.height) ep.y = 0;

      ctx.beginPath();
      ctx.arc(ep.x, ep.y, ep.radius, 0, Math.PI * 2);
      ctx.globalAlpha = ep.alpha;
      ctx.fill();
    });
    ctx.globalAlpha = 1.0;

    // 2. Spawn Fruits & Bombs
    if (timestamp - lastSpawnRef.current > spawnIntervalRef.current) {
      lastSpawnRef.current = timestamp;
      const count = Math.random() < 0.35 ? 3 : Math.random() < 0.7 ? 2 : 1;
      
      for (let i = 0; i < count; i++) {
        const isBomb = Math.random() < 0.15;
        const fruitDef = REALISTIC_FRUITS[Math.floor(Math.random() * REALISTIC_FRUITS.length)];
        
        let specialType = 'normal';
        const randSpecial = Math.random();
        if (!isBomb) {
          if (randSpecial < 0.08) specialType = 'freeze';
          else if (randSpecial < 0.16) specialType = 'diamond';
          else if (randSpecial < 0.24) specialType = 'golden';
          else if (randSpecial < 0.32) specialType = 'coin';
        } else {
          specialType = 'bomb';
        }

        const initialVy = isFrozen ? -8 - Math.random() * 3 : -11 - Math.random() * 5;
        fruitsRef.current.push({
          id: 'fruit_' + Date.now() + '_' + Math.random(),
          x: Math.random() * (canvas.width - 160) + 80,
          y: canvas.height + 40,
          vx: (Math.random() - 0.5) * (isFrozen ? 3 : 6),
          vy: initialVy,
          radius: isBomb ? 22 : fruitDef.size,
          fruitDef,
          specialType,
          angle: Math.random() * Math.PI,
          spin: (Math.random() - 0.5) * 0.08,
          sliced: false
        });
      }
    }

    // 3. Collision & Slicing Detection
    const reachBonus = activeWep.id === 'combat_knife' ? 14 : 0;
    if (isSlicingRef.current && lastPointRef.current && trailRef.current.length > 0) {
      const currentPoint = trailRef.current[trailRef.current.length - 1];
      const prevPoint = lastPointRef.current;
      let slicedThisFrame = 0;

      fruitsRef.current.forEach((f) => {
        if (!f.sliced) {
          // Check line intersection with circle
          const dist = distToSegment(f, prevPoint, currentPoint);
          if (dist < f.radius + 15 + reachBonus) {
            f.sliced = true;
            slicedThisFrame++;

            if (f.specialType === 'bomb') {
              // Hit Bomb! -1 Heart
              screenShakeRef.current = 25;
              synth.playExplode();
              try { if (navigator.vibrate) navigator.vibrate([200, 100, 200]); } catch {}

              for (let j = 0; j < 35; j++) {
                particlesRef.current.push({
                  x: f.x, y: f.y,
                  vx: (Math.random() - 0.5) * 16, vy: (Math.random() - 0.5) * 16 - 4,
                  radius: Math.random() * 6 + 3,
                  color: Math.random() > 0.5 ? '#f97316' : '#ef4444',
                  alpha: 1, life: 30 + Math.random() * 20
                });
              }

              livesRef.current -= 1;
              setLives(livesRef.current);
              comboTextsRef.current.push({
                id: 'bomb_' + Date.now(), x: f.x, y: f.y - 30,
                text: '💥 BOMB HIT! -1 ❤️', color: '#ef4444', alpha: 1, scale: 1.5
              });

              if (livesRef.current <= 0) {
                setTimeout(() => endGame(), 350);
              }
            } else {
              // Healthy or Special Fruit Sliced!
              synth.playSlice(activeWep.id);
              synth.playFruitSquish();

              let pts = 10;
              let text = `+10`;
              let color = f.fruitDef.innerColor;

              const isCrit = Math.random() < (activeWep.critBonus + 10) / 100;
              if (isCrit) {
                pts *= 3;
                text = `⚡ CRITICAL +${pts}!`;
                color = '#facc15';
                synth.playCritSlice();
              }

              if (f.specialType === 'golden') {
                pts += 50; text = `🌟 GOLDEN FRUIT +${pts}!`; color = '#fbbf24';
              } else if (f.specialType === 'diamond') {
                pts += 100; text = `💎 DIAMOND JACKPOT +${pts}!`; color = '#38bdf8';
              } else if (f.specialType === 'coin') {
                pts += 30; text = `🪙 COIN FRUIT +${pts}!`; color = '#eab308';
              } else if (f.specialType === 'freeze') {
                setFreezeTime(240); // 4 seconds time slow
                text = `❄️ TIME FROZEN!`; color = '#06b6d4';
              }

              scoreRef.current += pts;
              setScore(scoreRef.current);

              comboTextsRef.current.push({
                id: 'txt_' + Date.now() + Math.random(),
                x: f.x, y: f.y - 20, text, color, alpha: 1, scale: isCrit ? 1.4 : 1.1
              });

              // Spawn 2 Flying Half Pieces
              flyingPiecesRef.current.push({
                x: f.x - 5, y: f.y, vx: f.vx - 3, vy: f.vy - 2,
                radius: f.radius, angle: f.angle, spin: -0.1,
                fruitDef: f.fruitDef, specialType: f.specialType, sliced: true, half: 'left'
              });
              flyingPiecesRef.current.push({
                x: f.x + 5, y: f.y, vx: f.vx + 3, vy: f.vy - 2,
                radius: f.radius, angle: f.angle, spin: 0.1,
                fruitDef: f.fruitDef, specialType: f.specialType, sliced: true, half: 'right'
              });

              // Spawn Juicy Splash Droplets & Weapon Specific FX
              for (let j = 0; j < 22; j++) {
                particlesRef.current.push({
                  x: f.x, y: f.y,
                  vx: (Math.random() - 0.5) * 12, vy: (Math.random() - 0.5) * 12 - 3,
                  radius: Math.random() * 4 + 2,
                  color: Math.random() > 0.3 ? f.fruitDef.innerColor : f.fruitDef.outerColor,
                  alpha: 1, life: 35 + Math.random() * 25
                });
              }

              // Weapon Special Particle Splash
              const eff = activeWep.effectType;
              if (eff === 'golden' || eff === 'viper') {
                for (let k = 0; k < 12; k++) {
                  particlesRef.current.push({
                    x: f.x, y: f.y, vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15 - 5,
                    radius: Math.random() * 5 + 3, color: '#fbbf24', alpha: 1, life: 40 + Math.random() * 20
                  });
                }
              } else if (eff === 'flames') {
                for (let k = 0; k < 14; k++) {
                  particlesRef.current.push({
                    x: f.x, y: f.y, vx: (Math.random() - 0.5) * 10, vy: -Math.random() * 8 - 4,
                    radius: Math.random() * 6 + 4, color: Math.random() > 0.5 ? '#f97316' : '#ef4444', alpha: 1, life: 30 + Math.random() * 15
                  });
                }
              } else if (eff === 'ice') {
                for (let k = 0; k < 15; k++) {
                  particlesRef.current.push({
                    x: f.x, y: f.y, vx: (Math.random() - 0.5) * 14, vy: (Math.random() - 0.5) * 14,
                    radius: Math.random() * 4 + 2, color: '#67e8f9', alpha: 1, life: 45 + Math.random() * 20
                  });
                }
              } else if (eff === 'crystal') {
                for (let k = 0; k < 16; k++) {
                  particlesRef.current.push({
                    x: f.x, y: f.y, vx: (Math.random() - 0.5) * 18, vy: (Math.random() - 0.5) * 18 - 3,
                    radius: Math.random() * 5 + 3, color: Math.random() > 0.5 ? '#e879f9' : '#38bdf8', alpha: 1, life: 35 + Math.random() * 20
                  });
                }
              } else if (eff === 'lightning') {
                for (let k = 0; k < 12; k++) {
                  particlesRef.current.push({
                    x: f.x, y: f.y, vx: (Math.random() - 0.5) * 22, vy: (Math.random() - 0.5) * 22,
                    radius: Math.random() * 4 + 2, color: '#facc15', alpha: 1, life: 25 + Math.random() * 15
                  });
                }
              }
            }
          }
        }
      });

      if (slicedThisFrame > 1) {
        const comboPts = slicedThisFrame * 15;
        scoreRef.current += comboPts;
        setScore(scoreRef.current);
        setComboCount(slicedThisFrame);
        synth.playPerfectCombo(slicedThisFrame);
        comboTextsRef.current.push({
          id: 'combo_' + Date.now(),
          x: currentPoint.x, y: currentPoint.y - 40,
          text: `🔥 ${slicedThisFrame}X COMBO! +${comboPts}`,
          color: '#f97316', alpha: 1, scale: 1.6
        });
      }

      lastPointRef.current = currentPoint;
    }

    // 4. Update & Render Fruits
    const remainingFruits: any[] = [];
    fruitsRef.current.forEach((f) => {
      if (!f.sliced) {
        f.x += f.vx * dtScale;
        f.y += f.vy * dtScale;
        f.vy += 0.28 * dtScale; // Gravity
        f.angle += f.spin * dtScale;

        // Check if missed healthy fruit
        if (f.y > canvas.height + 50 && f.vy > 0) {
          if (f.specialType !== 'bomb') {
            livesRef.current -= 1;
            setLives(livesRef.current);
            synth.playError();
            comboTextsRef.current.push({
              id: 'miss_' + Date.now(), x: f.x, y: canvas.height - 40,
              text: '❌ MISSED! -1 ❤️', color: '#ef4444', alpha: 1, scale: 1.3
            });
            if (livesRef.current <= 0) {
              setTimeout(() => endGame(), 350);
            }
          }
        } else {
          remainingFruits.push(f);
          if (f.specialType === 'bomb') drawSpikedBomb(ctx, f);
          else drawRealisticFruit(ctx, f);
        }
      }
    });
    fruitsRef.current = remainingFruits;

    // 5. Update & Render Flying Sliced Pieces
    const remainingPieces: any[] = [];
    flyingPiecesRef.current.forEach((p) => {
      p.x += p.vx * dtScale;
      p.y += p.vy * dtScale;
      p.vy += 0.38 * dtScale;
      p.angle += p.spin * dtScale;
      if (p.y < canvas.height + 60) {
        remainingPieces.push(p);
        drawRealisticFruit(ctx, p);
      }
    });
    flyingPiecesRef.current = remainingPieces;

    // 6. Update & Render Particles (Juice & Sparks)
    const remainingParticles: any[] = [];
    particlesRef.current.forEach((pt) => {
      pt.x += pt.vx * dtScale;
      pt.y += pt.vy * dtScale;
      pt.vy += 0.2 * dtScale;
      pt.life -= 1 * dtScale;
      pt.alpha = Math.max(0, pt.life / 40);

      if (pt.life > 0) {
        remainingParticles.push(pt);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
        ctx.fillStyle = pt.color;
        ctx.globalAlpha = pt.alpha;
        ctx.fill();
      }
    });
    particlesRef.current = remainingParticles;
    ctx.globalAlpha = 1.0;

    // 7. Render Weapon Slicing Trail
    const now = performance.now();
    trailRef.current = trailRef.current.filter((pt) => now - pt.time < 220);

    if (trailRef.current.length > 1) {
      ctx.save();
      const eff = activeWep.effectType;

      if (eff === 'lightning') {
        // Jagged Electric Voltage Trail
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          const jitterX = (Math.random() - 0.5) * 14;
          const jitterY = (Math.random() - 0.5) * 14;
          ctx.lineTo(pt.x + jitterX, pt.y + jitterY);
        }
        ctx.lineWidth = 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'miter';
        ctx.strokeStyle = '#38bdf8';
        ctx.shadowBlur = 25;
        ctx.shadowColor = '#0284c7';
        ctx.stroke();

        ctx.lineWidth = 2;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else if (eff === 'flames') {
        // Scorching Flame Ribbon
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt0 = trailRef.current[i - 1];
          const pt1 = trailRef.current[i];
          const progress = i / trailRef.current.length;
          const width = progress * 20 + 3;

          ctx.beginPath();
          ctx.moveTo(pt0.x, pt0.y);
          ctx.lineTo(pt1.x, pt1.y);
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.strokeStyle = progress > 0.6 ? '#facc15' : progress > 0.3 ? '#f97316' : '#dc2626';
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#ea580c';
          ctx.stroke();
        }
      } else if (eff === 'ice') {
        // Sub-Zero Glacial Frost Ribbon
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineWidth = 10;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#a5f3fc';
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#06b6d4';
        ctx.stroke();

        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      } else if (activeWep.type === 'snake') {
        // Serpentine Scale Trail
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt0 = trailRef.current[i - 1];
          const pt1 = trailRef.current[i];
          const progress = i / trailRef.current.length;
          const width = progress * 18 + 4;

          ctx.beginPath();
          ctx.moveTo(pt0.x, pt0.y);
          ctx.lineTo(pt1.x, pt1.y);
          ctx.lineWidth = width;
          ctx.lineCap = 'round';
          ctx.strokeStyle = activeWep.trailColor;
          ctx.shadowBlur = 15;
          ctx.shadowColor = activeWep.trailGlow;
          ctx.stroke();

          // Scale accents per serpent species
          if (i % 2 === 0) {
            ctx.beginPath();
            ctx.arc(pt1.x, pt1.y, width * 0.35, 0, Math.PI * 2);
            if (activeWep.scalePattern === 'mamba') ctx.fillStyle = '#1e1b4b';
            else if (activeWep.scalePattern === 'viper') ctx.fillStyle = '#fde047';
            else if (activeWep.scalePattern === 'boa') ctx.fillStyle = '#a7f3d0';
            else ctx.fillStyle = '#ffffff';
            ctx.fill();
          }
        }
      } else {
        // Standard Metallic Ribbon Blade Trail (Gold, Silver, Laser, Crystal)
        ctx.beginPath();
        ctx.moveTo(trailRef.current[0].x, trailRef.current[0].y);
        for (let i = 1; i < trailRef.current.length; i++) {
          const pt = trailRef.current[i];
          ctx.lineTo(pt.x, pt.y);
        }
        ctx.lineWidth = 8;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        ctx.strokeStyle = activeWep.trailColor;
        ctx.shadowBlur = 20;
        ctx.shadowColor = activeWep.trailGlow;
        ctx.stroke();

        // Inner glowing core
        ctx.lineWidth = 3;
        ctx.strokeStyle = '#ffffff';
        ctx.stroke();
      }
      ctx.restore();
    }

    // 8. Update & Render Floating Combo / Crit Texts
    const remainingTexts: any[] = [];
    comboTextsRef.current.forEach((t) => {
      t.y -= 1.5;
      t.alpha -= 0.02;
      if (t.alpha > 0) {
        remainingTexts.push(t);
        ctx.save();
        ctx.globalAlpha = t.alpha;
        ctx.font = `black ${Math.floor(18 * (t.scale || 1))}px sans-serif`;
        ctx.textAlign = 'center';
        ctx.shadowBlur = 10;
        ctx.shadowColor = 'black';
        ctx.fillStyle = t.color;
        ctx.fillText(t.text, t.x, t.y);
        ctx.restore();
      }
    });
    comboTextsRef.current = remainingTexts;

    ctx.restore(); // End screen shake save
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  };

  // Distance helper for slice collision
  function distToSegment(p: { x: number; y: number }, v: { x: number; y: number }, w: { x: number; y: number }) {
    const l2 = (w.x - v.x) ** 2 + (w.y - v.y) ** 2;
    if (l2 === 0) return Math.hypot(p.x - v.x, p.y - v.y);
    let t = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;
    t = Math.max(0, Math.min(1, t));
    return Math.hypot(p.x - (v.x + t * (w.x - v.x)), p.y - (v.y + t * (w.y - v.y)));
  }

  // Pointer Handlers
  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    isSlicingRef.current = true;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (e.currentTarget.width / rect.width);
    const y = (e.clientY - rect.top) * (e.currentTarget.height / rect.height);
    lastPointRef.current = { x, y };
    trailRef.current = [{ x, y, time: performance.now() }];
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isSlicingRef.current || gameState !== 'playing') return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (e.currentTarget.width / rect.width);
    const y = (e.clientY - rect.top) * (e.currentTarget.height / rect.height);
    lastPointRef.current = { x, y };
    trailRef.current.push({ x, y, time: performance.now() });
  };

  const handlePointerUp = () => {
    isSlicingRef.current = false;
    lastPointRef.current = null;
  };

  // Cleanup loop
  useEffect(() => {
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return (
    <div className="space-y-6 max-w-6xl mx-auto font-sans text-white pb-12" id="fruit_slice_pro_root">
      
      {/* 1. TOP HEADER CARDS (Blade Arena & Dojo Arena Apple-Quality Glassmorphism) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Blade Arena Top Card */}
        <div 
          onClick={() => { synth.playClick(); setShowBladeModal(true); }}
          className="relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 cursor-pointer backdrop-blur-xl group bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border-amber-500/40 hover:border-amber-400/80 hover:shadow-[0_0_35px_rgba(245,158,11,0.25)] hover:scale-[1.01]"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-600/10 border border-amber-500/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                {activeWep.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-amber-400 transition-colors">Blade Arena</h3>
                  <span className="text-[10px] bg-gradient-to-r from-amber-500 to-amber-600 text-black px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">13 BLADES</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mt-1">Equipped: <span className="text-amber-300 font-bold">{activeWep.name}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl group-hover:bg-amber-500/20 transition-colors">
              <span className="text-xs font-bold text-amber-300">Open Armory</span>
              <ChevronRight className="w-4 h-4 text-amber-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

        {/* Dojo Arena Top Card */}
        <div 
          onClick={() => { synth.playClick(); setShowDojoModal(true); }}
          className="relative overflow-hidden rounded-2xl p-5 border transition-all duration-300 cursor-pointer backdrop-blur-xl group bg-gradient-to-br from-zinc-900/90 via-zinc-900/60 to-zinc-950/90 border-cyan-500/40 hover:border-cyan-400/80 hover:shadow-[0_0_35px_rgba(6,182,212,0.25)] hover:scale-[1.01]"
        >
          <div className="absolute -right-6 -bottom-6 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:scale-125 transition-transform duration-500" />
          <div className="flex items-center justify-between z-10 relative">
            <div className="flex items-center space-x-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-cyan-600/10 border border-cyan-500/40 flex items-center justify-center text-3xl shadow-inner group-hover:scale-105 transition-transform">
                {activeArena.icon}
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h3 className="text-xl font-black tracking-tight text-white group-hover:text-cyan-400 transition-colors">Dojo Arena</h3>
                  <span className="text-[10px] bg-gradient-to-r from-cyan-500 to-cyan-600 text-black px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shadow-sm">10 DOJOS</span>
                </div>
                <p className="text-xs text-zinc-400 font-medium mt-1">Atmosphere: <span className="text-cyan-300 font-bold">{activeArena.name}</span></p>
              </div>
            </div>
            <div className="flex items-center space-x-2 bg-cyan-500/10 border border-cyan-500/30 px-3 py-1.5 rounded-xl group-hover:bg-cyan-500/20 transition-colors">
              <span className="text-xs font-bold text-cyan-300">Open Dojos</span>
              <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
          </div>
        </div>

      </div>

      {/* 2. EQUIPPED WEAPON CARD (Redesigned without stars, with "FRUIT SLICE PRO" Gold Badge) */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-zinc-900 via-zinc-900/90 to-zinc-900/70 border border-amber-500/30 p-5 shadow-2xl backdrop-blur-xl flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/30 via-zinc-800 to-zinc-950 border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-lg relative group">
            {activeWep.icon}
            <div className="absolute inset-0 rounded-2xl bg-amber-400/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          </div>
          <div>
            <div className="flex items-center space-x-3">
              <h2 className="text-xl font-black text-white tracking-wide">{activeWep.name}</h2>
              {/* Replaced ⭐ star area with FRUIT SLICE PRO premium badge */}
              <span className="px-2.5 py-0.5 rounded-md bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-[11px] tracking-widest uppercase shadow-md flex items-center space-x-1">
                <Sparkles className="w-3 h-3 fill-black text-black" />
                <span>FRUIT SLICE PRO</span>
              </span>
            </div>
            <p className="text-xs text-amber-300/90 font-medium mt-1 flex items-center space-x-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 inline" />
              <span>{activeWep.perk}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-6 text-sm bg-black/40 px-5 py-3 rounded-xl border border-white/5">
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Speed</span>
            <span className="text-amber-400 font-black text-base">+{activeWep.speedBonus}%</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Critical</span>
            <span className="text-emerald-400 font-black text-base">+{activeWep.critBonus}%</span>
          </div>
          <div className="h-6 w-[1px] bg-white/10" />
          <div className="text-center">
            <span className="text-[10px] text-zinc-400 font-bold block uppercase tracking-wider">Bonus Coin</span>
            <span className="text-yellow-400 font-black text-base">+{activeWep.coinBonus}%</span>
          </div>
        </div>
      </div>

      {/* 3. SHOP & CUSTOMIZATION TABS (Blades vs Dojos) */}
      <div className="hidden bg-zinc-900/60 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-2xl">
        
        <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => { synth.playClick(); setShopTab('blades'); }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                shopTab === 'blades'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20 scale-105'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Swords className="w-4 h-4" />
              <span>Blade Arena (6 Skins)</span>
            </button>
            <button
              onClick={() => { synth.playClick(); setShopTab('dojos'); }}
              className={`px-5 py-2.5 rounded-xl font-extrabold text-xs tracking-wider uppercase transition-all duration-300 flex items-center space-x-2 ${
                shopTab === 'dojos'
                  ? 'bg-gradient-to-r from-cyan-500 to-cyan-600 text-black shadow-lg shadow-cyan-500/20 scale-105'
                  : 'bg-zinc-800/80 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Dojo Arena (10 Themes)</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 bg-black/50 px-3.5 py-1.5 rounded-full border border-yellow-500/30 text-xs font-bold text-yellow-400">
            <Coins className="w-4 h-4 fill-yellow-400 text-yellow-400" />
            <span>🪙 {coins} Coins Available</span>
          </div>
        </div>

        {/* BLADE ARENA GRID */}
        {shopTab === 'blades' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(WEAPONS_LIST).map((wep) => {
              const isUnlocked = unlockedWeapons.includes(wep.id);
              const isEquipped = selectedWeapon === wep.id;

              return (
                <div
                  key={wep.id}
                  onClick={() => setPreviewWeapon(wep)}
                  className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden group cursor-pointer backdrop-blur-md ${
                    isEquipped
                      ? 'bg-gradient-to-b from-amber-500/15 via-zinc-900 to-zinc-950 border-amber-500 shadow-[0_0_25px_rgba(245,158,11,0.25)]'
                      : isUnlocked
                      ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 hover:bg-zinc-900'
                      : 'bg-zinc-950/80 border-white/5 opacity-85 hover:opacity-100'
                  }`}
                >
                  {/* Top Header */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div className="w-12 h-12 rounded-xl bg-zinc-800/80 border border-white/10 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform">
                        {wep.icon}
                      </div>
                      {isEquipped ? (
                        <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black font-black text-[10px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Equipped</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] tracking-wider uppercase">
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-amber-400 border border-amber-500/40 font-black text-[11px] flex items-center space-x-1 shadow-inner">
                          <span>🪙 {wep.price}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                      {wep.name}
                    </h4>
                    <p className="text-xs text-amber-400/90 font-bold mt-0.5">{wep.perk}</p>
                    <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{wep.description}</p>
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] font-bold">
                    <span className="text-zinc-400">Speed: <span className="text-amber-400 font-black">+{wep.speedBonus}%</span></span>
                    <span className="text-zinc-400">Crit: <span className="text-emerald-400 font-black">+{wep.critBonus}%</span></span>
                    <span className="text-zinc-400">Coins: <span className="text-yellow-400 font-black">+{wep.coinBonus}%</span></span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-4">
                    {isEquipped ? (
                      <button disabled className="w-full py-2.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-extrabold text-xs tracking-wider uppercase cursor-default">
                        Active Blade
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleSelectWeapon(wep.id); }}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-amber-400 text-black font-black text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                      >
                        Equip Blade
                      </button>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); handleBuyWeapon(wep.id, wep.price); }}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Unlock for 🪙 {wep.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* DOJO ARENA GRID */}
        {shopTab === 'dojos' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {Object.values(ARENAS_LIST).map((arena) => {
              const isUnlocked = unlockedArenas.includes(arena.id);
              const isEquipped = selectedEnv === arena.id;

              return (
                <div
                  key={arena.id}
                  className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between overflow-hidden group backdrop-blur-md ${
                    isEquipped
                      ? 'bg-gradient-to-b from-cyan-500/15 via-zinc-900 to-zinc-950 border-cyan-500 shadow-[0_0_25px_rgba(6,182,212,0.25)]'
                      : isUnlocked
                      ? 'bg-zinc-900/60 border-white/10 hover:border-white/30 hover:bg-zinc-900'
                      : 'bg-zinc-950/80 border-white/5 opacity-85 hover:opacity-100'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <div 
                        style={{ background: `linear-gradient(135deg, ${arena.bg1}, ${arena.bg2})` }}
                        className="w-12 h-12 rounded-xl border border-white/20 flex items-center justify-center text-2xl shadow-inner group-hover:scale-110 transition-transform"
                      >
                        {arena.icon}
                      </div>
                      {isEquipped ? (
                        <span className="px-2.5 py-1 rounded-full bg-cyan-500 text-black font-black text-[10px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
                          <Check className="w-3 h-3 stroke-[3]" />
                          <span>Active Dojo</span>
                        </span>
                      ) : isUnlocked ? (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] tracking-wider uppercase">
                          Unlocked
                        </span>
                      ) : (
                        <span className="px-2.5 py-1 rounded-full bg-zinc-900 text-cyan-400 border border-cyan-500/40 font-black text-[11px] flex items-center space-x-1 shadow-inner">
                          <span>🪙 {arena.price}</span>
                        </span>
                      )}
                    </div>

                    <h4 className="text-base font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                      {arena.name}
                    </h4>
                    <p className="text-xs text-cyan-400/90 font-bold mt-0.5">Atmosphere: {arena.particleType.toUpperCase()}</p>
                    <p className="text-[11px] text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{arena.desc}</p>
                  </div>

                  <div className="mt-5">
                    {isEquipped ? (
                      <button disabled className="w-full py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-extrabold text-xs tracking-wider uppercase cursor-default">
                        Current Atmosphere
                      </button>
                    ) : isUnlocked ? (
                      <button
                        onClick={() => handleSelectArena(arena.id)}
                        className="w-full py-2.5 rounded-xl bg-white hover:bg-cyan-400 text-black font-black text-xs tracking-wider uppercase transition-all shadow-md active:scale-95"
                      >
                        Equip Dojo
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyArena(arena.id, arena.price)}
                        className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95 flex items-center justify-center space-x-1.5"
                      >
                        <ShoppingBag className="w-4 h-4" />
                        <span>Unlock for 🪙 {arena.price}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 4. GAME PLAY / CANVAS STAGE */}
      <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-zinc-950">
        
        {/* Top Game HUD */}
        <div className="absolute top-4 left-4 right-4 z-20 flex items-center justify-between pointer-events-none">
          <div className="flex items-center space-x-3 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
            <Trophy className="w-5 h-5 text-amber-400 fill-amber-400 animate-bounce" />
            <div>
              <span className="text-[10px] text-zinc-400 font-bold uppercase block tracking-wider">Score</span>
              <span className="text-lg font-black text-white">{score}</span>
            </div>
          </div>

          {freezeTime > 0 && (
            <div className="bg-cyan-500/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-cyan-300 flex items-center space-x-2 animate-pulse text-black font-black text-xs shadow-lg">
              <Snowflake className="w-4 h-4 animate-spin" />
              <span>TIME FROZEN ({Math.ceil(freezeTime / 60)}s)</span>
            </div>
          )}

          <div className="flex items-center space-x-1 bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl border border-white/10 shadow-lg">
            {Array.from({ length: 6 }).map((_, i) => (
              <Heart
                key={i}
                className={`w-5 h-5 transition-transform duration-300 ${
                  i < lives ? 'text-red-500 fill-red-500 scale-110' : 'text-zinc-700 fill-zinc-900 scale-90'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Canvas Stage */}
        <canvas
          ref={canvasRef}
          width={800}
          height={550}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          className="w-full h-[500px] md:h-[580px] block cursor-crosshair touch-none select-none bg-zinc-950"
        />

        {/* IDLE / OVERLAY SCREEN */}
        {gameState === 'idle' && (
          <div className="absolute inset-0 z-30 bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-br from-amber-500 to-red-600 flex items-center justify-center text-4xl shadow-[0_0_40px_rgba(245,158,11,0.4)] mb-4 animate-pulse">
              🍉
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white uppercase tracking-wider">
              Fruit Slice <span className="text-amber-400">PRO</span>
            </h2>
            <p className="text-sm text-zinc-300 max-w-md mt-2 leading-relaxed">
              Equip your legendary blade or serpent, slice 20 realistic HD fruits, trigger combos, and avoid spiked fusion bombs!
            </p>

            <div className="mt-6 flex items-center space-x-3 bg-zinc-900/90 px-5 py-3 rounded-xl border border-white/10">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">Select Bet:</span>
              {[20, 50, 100, 200].map((val) => (
                <button
                  key={val}
                  onClick={() => { synth.playClick(); setBet(val); }}
                  className={`px-3 py-1 rounded-lg font-black text-xs transition-all ${
                    bet === val ? 'bg-amber-500 text-black shadow-md scale-105' : 'bg-zinc-800 text-zinc-300 hover:bg-zinc-700'
                  }`}
                >
                  🪙 {val}
                </button>
              ))}
            </div>

            <button
              onClick={startGame}
              className="mt-6 px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-red-500 to-amber-500 bg-[length:200%_auto] hover:bg-right text-black font-black text-lg tracking-wider uppercase shadow-[0_0_35px_rgba(245,158,11,0.5)] transition-all transform hover:scale-105 active:scale-95 flex items-center space-x-3"
            >
              <Play className="w-6 h-6 fill-black" />
              <span>Slice AAA Now (🪙 {bet})</span>
            </button>
          </div>
        )}

        {/* GAME OVER SCREEN */}
        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-30 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-3xl mb-3 shadow-lg">
              💥
            </div>
            <h3 className="text-3xl font-black text-white uppercase tracking-wider">Dojo Session Ended</h3>
            <p className="text-sm text-zinc-400 mt-1">Final Slicing Score: <span className="text-amber-400 font-black text-xl">{score}</span></p>

            <div className="mt-6 flex items-center space-x-4">
              <button
                onClick={() => setGameState('idle')}
                className="px-6 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Change Blades
              </button>
              <button
                onClick={startGame}
                className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg hover:scale-105"
              >
                Play Again (🪙 {bet})
              </button>
            </div>
          </div>
        )}

      </div>

      {/* WEAPON PREVIEW MODAL */}
      {previewWeapon && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-amber-500/40 rounded-3xl max-w-md w-full p-6 shadow-2xl relative animate-scale-up">
            <div className="text-center">
              <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/20 via-zinc-800 to-zinc-950 border-2 border-amber-500/40 flex items-center justify-center text-5xl shadow-xl mb-4">
                {previewWeapon.icon}
              </div>
              <h3 className="text-2xl font-black text-white">{previewWeapon.name}</h3>
              <span className="inline-block mt-1 px-3 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase">
                {previewWeapon.type.toUpperCase()} SKIN
              </span>
              <p className="text-sm text-zinc-300 mt-3 leading-relaxed">{previewWeapon.description}</p>
            </div>

            <div className="mt-6 bg-black/50 p-4 rounded-2xl border border-white/5 space-y-2 text-xs font-bold">
              <div className="flex justify-between">
                <span className="text-zinc-400">Slicing Velocity:</span>
                <span className="text-amber-400 font-black">+{previewWeapon.speedBonus}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Critical Slice Chance:</span>
                <span className="text-emerald-400 font-black">+{previewWeapon.critBonus}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-zinc-400">Bonus Coin Multiplier:</span>
                <span className="text-yellow-400 font-black">+{previewWeapon.coinBonus}%</span>
              </div>
            </div>

            <div className="mt-6 flex items-center space-x-3">
              <button
                onClick={() => setPreviewWeapon(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Close
              </button>
              {unlockedWeapons.includes(previewWeapon.id) ? (
                <button
                  onClick={() => {
                    handleSelectWeapon(previewWeapon.id);
                    setPreviewWeapon(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-md"
                >
                  Equip Blade
                </button>
              ) : (
                <button
                  onClick={() => {
                    handleBuyWeapon(previewWeapon.id, previewWeapon.price);
                    setPreviewWeapon(null);
                  }}
                  className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition-all shadow-lg flex items-center justify-center space-x-1"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Buy for 🪙 {previewWeapon.price}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 5. FULLSCREEN BLADE ARENA ARMORY MODAL */}
      {showBladeModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl overflow-y-auto p-4 md:p-8 flex flex-col animate-fade-in">
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 sticky top-0 bg-black/80 backdrop-blur-xl z-20 py-4 px-2 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/50 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.3)]">
                  👑
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">BLADE ARENA ARMORY</h2>
                    <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold text-xs uppercase tracking-wider">13 AAA Blades</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-1">Equip your legendary blade or serpent to gain massive stat multipliers and unique VFX trails.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-zinc-900/90 border border-yellow-500/40 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                  <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                  <span className="font-black text-yellow-400 text-base">🪙 {coins}</span>
                </div>
                <button
                  onClick={() => { synth.playClick(); setShowBladeModal(false); }}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 flex items-center justify-center text-white font-bold transition-all hover:scale-105 active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Blades Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {Object.values(WEAPONS_LIST).map((wep) => {
                const isUnlocked = unlockedWeapons.includes(wep.id);
                const isEquipped = selectedWeapon === wep.id;

                return (
                  <div
                    key={wep.id}
                    className={`relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden group backdrop-blur-xl ${
                      isEquipped
                        ? 'bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)] scale-[1.02]'
                        : isUnlocked
                        ? 'bg-zinc-900/80 border-white/15 hover:border-amber-500/40 hover:bg-zinc-900'
                        : 'bg-zinc-950/90 border-white/5 opacity-85 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500/20 to-zinc-800 border-2 border-amber-500/30 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300">
                          {wep.icon}
                        </div>
                        <div className="flex flex-col items-end space-y-1.5">
                          <span className={`px-3 py-1 rounded-full font-black text-[10px] uppercase tracking-wider border ${
                            wep.rarity === 'Immortal' ? 'bg-purple-500/20 text-purple-300 border-purple-500/50 shadow-[0_0_15px_rgba(168,85,247,0.3)]' :
                            wep.rarity === 'Mythic' ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.3)]' :
                            wep.rarity === 'Legendary' ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50' :
                            'bg-zinc-800 text-zinc-300 border-zinc-700'
                          }`}>
                            {wep.rarity || 'Common'}
                          </span>
                          {isEquipped ? (
                            <span className="px-3 py-1 rounded-full bg-amber-500 text-black font-black text-[11px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
                              <Check className="w-3.5 h-3.5 stroke-[3]" />
                              <span>Equipped</span>
                            </span>
                          ) : isUnlocked ? (
                            <span className="px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">
                              Unlocked
                            </span>
                          ) : (
                            <span className="px-3 py-1 rounded-full bg-zinc-900 text-amber-400 border border-amber-500/40 font-black text-xs flex items-center space-x-1 shadow-inner">
                              <span>🪙 {wep.price}</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <h3 className="text-xl font-black text-white tracking-tight group-hover:text-amber-300 transition-colors">
                        {wep.name}
                      </h3>
                      <p className="text-xs text-amber-400 font-bold mt-1">{wep.perk}</p>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{wep.description}</p>

                      {/* Stats Breakdown */}
                      <div className="mt-5 pt-4 border-t border-white/10 grid grid-cols-3 gap-2 text-center">
                        <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block font-bold uppercase">Speed</span>
                          <span className="text-xs font-black text-amber-400">+{wep.speedBonus}%</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block font-bold uppercase">Crit</span>
                          <span className="text-xs font-black text-emerald-400">+{wep.critBonus}%</span>
                        </div>
                        <div className="bg-black/40 p-2 rounded-xl border border-white/5">
                          <span className="text-[10px] text-zinc-500 block font-bold uppercase">Coins</span>
                          <span className="text-xs font-black text-yellow-400">+{wep.coinBonus}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Modal Action Buttons */}
                    <div className="mt-6">
                      {isEquipped ? (
                        <button disabled className="w-full py-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs tracking-wider uppercase cursor-default">
                          Active Blade
                        </button>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => { handleSelectWeapon(wep.id); setShowBladeModal(false); }}
                          className="w-full py-3.5 rounded-2xl bg-white hover:bg-amber-400 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
                        >
                          Equip Blade
                        </button>
                      ) : (
                        <button
                          onClick={() => initiateBuyWeapon(wep)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-4 h-4 fill-black" />
                          <span>Unlock ({wep.unlockReq || `🪙 ${wep.price}`})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* 6. FULLSCREEN DOJO ARENA SANCTUARY MODAL */}
      {showDojoModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl overflow-y-auto p-4 md:p-8 flex flex-col animate-fade-in">
          <div className="max-w-6xl mx-auto w-full flex-1 flex flex-col">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-6 mb-8 sticky top-0 bg-black/80 backdrop-blur-xl z-20 py-4 px-2 rounded-2xl">
              <div className="flex items-center space-x-4">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-cyan-500/30 to-cyan-600/10 border-2 border-cyan-500/50 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(6,182,212,0.3)]">
                  ⛩️
                </div>
                <div>
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl md:text-3xl font-black text-white tracking-tight">DOJO ARENA SANCTUARY</h2>
                    <span className="px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-bold text-xs uppercase tracking-wider">10 60FPS Dojos</span>
                  </div>
                  <p className="text-xs text-zinc-400 font-medium mt-1">Immerse yourself in AAA atmospheres with responsive particle systems and authentic ambient audio.</p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-zinc-900/90 border border-yellow-500/40 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                  <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                  <span className="font-black text-yellow-400 text-base">🪙 {coins}</span>
                </div>
                <button
                  onClick={() => { synth.playClick(); setShowDojoModal(false); }}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 flex items-center justify-center text-white font-bold transition-all hover:scale-105 active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Dojos Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-12">
              {Object.values(ARENAS_LIST).map((arena) => {
                const isUnlocked = unlockedArenas.includes(arena.id);
                const isEquipped = selectedEnv === arena.id;

                return (
                  <div
                    key={arena.id}
                    className={`relative rounded-3xl p-6 border transition-all duration-300 flex flex-col justify-between overflow-hidden group backdrop-blur-xl ${
                      isEquipped
                        ? 'bg-gradient-to-b from-cyan-500/20 via-zinc-900 to-zinc-950 border-cyan-500 shadow-[0_0_35px_rgba(6,182,212,0.3)] scale-[1.02]'
                        : isUnlocked
                        ? 'bg-zinc-900/80 border-white/15 hover:border-cyan-500/40 hover:bg-zinc-900'
                        : 'bg-zinc-950/90 border-white/5 opacity-85 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div 
                          style={{ background: `linear-gradient(135deg, ${arena.bg1}, ${arena.bg2})` }}
                          className="w-16 h-16 rounded-2xl border-2 border-white/20 flex items-center justify-center text-3xl shadow-inner group-hover:scale-110 transition-transform duration-300"
                        >
                          {arena.icon}
                        </div>
                        {isEquipped ? (
                          <span className="px-3 py-1 rounded-full bg-cyan-500 text-black font-black text-[11px] tracking-wider uppercase flex items-center space-x-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" />
                            <span>Active Dojo</span>
                          </span>
                        ) : isUnlocked ? (
                          <span className="px-3 py-1 rounded-full bg-zinc-800 text-emerald-400 border border-emerald-500/30 font-bold text-[10px] uppercase">
                            Unlocked
                          </span>
                        ) : (
                          <span className="px-3 py-1 rounded-full bg-zinc-900 text-cyan-400 border border-cyan-500/40 font-black text-xs flex items-center space-x-1 shadow-inner">
                            <span>🪙 {arena.price}</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-black text-white tracking-tight group-hover:text-cyan-300 transition-colors">
                        {arena.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-bold mt-1">{arena.atmosphere || arena.particleType.toUpperCase()}</p>
                      <p className="text-xs text-zinc-400 mt-2 line-clamp-2 leading-relaxed">{arena.desc}</p>

                      {/* Atmosphere Details */}
                      <div className="mt-5 pt-4 border-t border-white/10 space-y-2 text-[11px] font-semibold text-zinc-300">
                        <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Weather:</span>
                          <span className="text-cyan-300">{arena.weather || '60 FPS Particles'}</span>
                        </div>
                        <div className="flex justify-between items-center bg-black/40 px-3 py-1.5 rounded-xl border border-white/5">
                          <span className="text-zinc-500 uppercase font-bold text-[10px]">Audio:</span>
                          <span className="text-emerald-300">{arena.ambientSound || 'HD Acoustic'}</span>
                        </div>
                      </div>
                    </div>

                    {/* Dojo Action Buttons */}
                    <div className="mt-6">
                      {isEquipped ? (
                        <button disabled className="w-full py-3.5 rounded-2xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-black text-xs tracking-wider uppercase cursor-default">
                          Active Atmosphere
                        </button>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => { handleSelectArena(arena.id); setShowDojoModal(false); }}
                          className="w-full py-3.5 rounded-2xl bg-white hover:bg-cyan-400 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
                        >
                          Equip Dojo
                        </button>
                      ) : (
                        <button
                          onClick={() => initiateBuyArena(arena)}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-cyan-500 via-cyan-400 to-cyan-600 hover:from-cyan-400 hover:to-cyan-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-4 h-4 fill-black" />
                          <span>Unlock for 🪙 {arena.price}</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

          </div>
        </div>
      )}

      {/* 7. PREMIUM PURCHASE CONFIRMATION DIALOG */}
      {confirmPurchase && (
        <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-scale-up">
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/50 rounded-3xl max-w-md w-full p-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] relative text-center">
            
            <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/30 via-zinc-800 to-zinc-950 border-2 border-amber-500/60 flex items-center justify-center text-5xl shadow-2xl mb-6 animate-bounce">
              {confirmPurchase.icon}
            </div>

            <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-widest inline-block mb-2">
              {confirmPurchase.rarity || 'PREMIUM UNLOCK'}
            </span>
            <h3 className="text-2xl font-black text-white tracking-tight">Unlock {confirmPurchase.name}?</h3>
            <p className="text-xs text-zinc-300 mt-2 leading-relaxed px-4">{confirmPurchase.desc}</p>

            <div className="mt-6 bg-black/60 p-4 rounded-2xl border border-white/10 flex items-center justify-center space-x-2">
              <span className="text-sm text-zinc-400 font-bold">Cost:</span>
              <span className="text-xl font-black text-yellow-400">🪙 {confirmPurchase.price} Nova Coins</span>
            </div>

            {purchaseError && (
              <div className="mt-4 p-3 rounded-xl bg-red-500/20 border border-red-500/50 text-red-300 font-bold text-sm animate-pulse">
                {purchaseError}
              </div>
            )}

            <div className="mt-8 space-y-3">
              <button
                onClick={() => executePurchase(confirmPurchase)}
                className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 flex items-center justify-center space-x-2"
              >
                <Coins className="w-5 h-5 fill-black" />
                <span>Unlock with Nova Coins ({confirmPurchase.price})</span>
              </button>

              <button
                onClick={() => { synth.playClick(); setConfirmPurchase(null); setPurchaseError(null); }}
                className="w-full py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
              >
                Cancel
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 8. UNLOCKED SUCCESS SPLASH BANNER */}
      {showUnlockSplash && (
        <div className="fixed top-8 left-1/2 transform -translate-x-1/2 z-[70] bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-8 py-4 rounded-3xl shadow-[0_0_50px_rgba(245,158,11,0.8)] border-2 border-white flex items-center space-x-4 animate-bounce">
          <span className="text-4xl">{showUnlockSplash.icon}</span>
          <div>
            <h4 className="font-black text-lg tracking-tight uppercase">🎉 ITEM UNLOCKED!</h4>
            <p className="text-xs font-bold text-black/80">{showUnlockSplash.name} has been added to your armory and equipped!</p>
          </div>
        </div>
      )}

    </div>
  );
}
