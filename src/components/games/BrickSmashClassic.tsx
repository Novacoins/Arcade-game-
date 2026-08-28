/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import {
  Zap,
  Shield,
  Flame,
  Snowflake,
  Bomb,
  Rocket,
  Sparkles,
  Trophy,
  Star,
  RotateCcw,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Settings as SettingsIcon,
  HelpCircle,
  Crown,
  Gift,
  Coins,
  Palette,
  Grid,
  Map,
  Target,
  Maximize2,
  Lock,
  Check,
  ChevronRight,
  Eye,
  Award,
  Layers,
  Wand2,
  Crosshair,
  Timer,
  Skull,
  Radio,
  RefreshCw,
  X,
  Sliders,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

interface BrickSmashProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// 1. DATA CONFIGURATIONS & PROGRESSIVE SKINS
// ==========================================

export interface PaddleSkin {
  id: string;
  name: string;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Royal';
  tierColor: string;
  icon: string;
  price: number;
  unlocked: boolean;
  color: string;
  glow: string;
  secondaryColor: string;
  trailColor: string;
  texturePattern: 'metal' | 'wood' | 'glass' | 'gold' | 'fire' | 'cyber' | 'magic' | 'cosmic' | 'rainbow' | 'dragon' | 'royal' | 'plasma';
}

export const PADDLE_SKINS: Record<string, PaddleSkin> = {
  classic: {
    id: 'classic',
    name: 'Classic Steel',
    tier: 'Common',
    tierColor: '#94a3b8',
    icon: '🛡️',
    price: 0,
    unlocked: true,
    color: '#e2e8f0',
    secondaryColor: '#64748b',
    glow: 'rgba(226, 232, 240, 0.6)',
    trailColor: '#94a3b8',
    texturePattern: 'metal',
  },
  wood: {
    id: 'wood',
    name: 'Ancient Oak',
    tier: 'Common',
    tierColor: '#b45309',
    icon: '🪵',
    price: 400,
    unlocked: false,
    color: '#d97706',
    secondaryColor: '#78350f',
    glow: 'rgba(217, 119, 6, 0.6)',
    trailColor: '#b45309',
    texturePattern: 'wood',
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Diamond',
    tier: 'Rare',
    tierColor: '#38bdf8',
    icon: '💎',
    price: 750,
    unlocked: false,
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.8)',
    trailColor: '#7dd3fc',
    texturePattern: 'glass',
  },
  ice: {
    id: 'ice',
    name: 'Frozen Glacier',
    tier: 'Rare',
    tierColor: '#06b6d4',
    icon: '❄️',
    price: 1000,
    unlocked: false,
    color: '#06b6d4',
    secondaryColor: '#0e7490',
    glow: 'rgba(6, 182, 212, 0.8)',
    trailColor: '#a5f3fc',
    texturePattern: 'glass',
  },
  gold: {
    id: 'gold',
    name: 'Pure Gold',
    tier: 'Epic',
    tierColor: '#fbbf24',
    icon: '👑',
    price: 1400,
    unlocked: false,
    color: '#fbbf24',
    secondaryColor: '#b45309',
    glow: 'rgba(251, 191, 36, 0.9)',
    trailColor: '#fde047',
    texturePattern: 'gold',
  },
  fire: {
    id: 'fire',
    name: 'Inferno Flame',
    tier: 'Epic',
    tierColor: '#f97316',
    icon: '🔥',
    price: 1800,
    unlocked: false,
    color: '#f97316',
    secondaryColor: '#c2410c',
    glow: 'rgba(249, 115, 22, 0.9)',
    trailColor: '#fdba74',
    texturePattern: 'fire',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Neon',
    tier: 'Epic',
    tierColor: '#ec4899',
    icon: '🏙️',
    price: 2200,
    unlocked: false,
    color: '#ec4899',
    secondaryColor: '#06b6d4',
    glow: 'rgba(236, 72, 153, 0.9)',
    trailColor: '#f472b6',
    texturePattern: 'cyber',
  },
  magic: {
    id: 'magic',
    name: 'Mystic Runes',
    tier: 'Legendary',
    tierColor: '#a855f7',
    icon: '🔮',
    price: 2800,
    unlocked: false,
    color: '#c084fc',
    secondaryColor: '#7e22ce',
    glow: 'rgba(192, 132, 252, 0.9)',
    trailColor: '#e9d5ff',
    texturePattern: 'magic',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Cosmic Galaxy',
    tier: 'Legendary',
    tierColor: '#c084fc',
    icon: '🌌',
    price: 3500,
    unlocked: false,
    color: '#a855f7',
    secondaryColor: '#3b82f6',
    glow: 'rgba(168, 85, 247, 0.9)',
    trailColor: '#c084fc',
    texturePattern: 'cosmic',
  },
  rainbow: {
    id: 'rainbow',
    name: 'Spectral Rainbow',
    tier: 'Legendary',
    tierColor: '#f43f5e',
    icon: '🌈',
    price: 4200,
    unlocked: false,
    color: '#f43f5e',
    secondaryColor: '#3b82f6',
    glow: 'rgba(244, 63, 94, 0.9)',
    trailColor: '#fbbf24',
    texturePattern: 'rainbow',
  },
  dragon: {
    id: 'dragon',
    name: 'Red Dragon Scale',
    tier: 'Mythic',
    tierColor: '#ef4444',
    icon: '🐉',
    price: 5000,
    unlocked: false,
    color: '#ef4444',
    secondaryColor: '#7f1d1d',
    glow: 'rgba(239, 68, 68, 0.95)',
    trailColor: '#fca5a5',
    texturePattern: 'dragon',
  },
  royal: {
    id: 'royal',
    name: 'Royal Crown Sovereign',
    tier: 'Royal',
    tierColor: '#eab308',
    icon: '🏰',
    price: 6500,
    unlocked: false,
    color: '#eab308',
    secondaryColor: '#854d0e',
    glow: 'rgba(234, 179, 8, 0.95)',
    trailColor: '#fef08a',
    texturePattern: 'royal',
  },
};

export interface BallSkin {
  id: string;
  name: string;
  tier: 'Common' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic' | 'Royal';
  tierColor: string;
  icon: string;
  price: number;
  unlocked: boolean;
  color: string;
  secondaryColor: string;
  glow: string;
  trailType: 'sparkles' | 'glass' | 'ice' | 'gold' | 'fire' | 'lightning' | 'cyber' | 'magic' | 'stars' | 'rainbow' | 'dragon' | 'plasma';
}

export const BALL_SKINS: Record<string, BallSkin> = {
  classic: {
    id: 'classic',
    name: 'Classic Steel',
    tier: 'Common',
    tierColor: '#94a3b8',
    icon: '⚪',
    price: 0,
    unlocked: true,
    color: '#f8fafc',
    secondaryColor: '#94a3b8',
    glow: 'rgba(248, 250, 252, 0.6)',
    trailType: 'sparkles',
  },
  crystal: {
    id: 'crystal',
    name: 'Crystal Orb',
    tier: 'Common',
    tierColor: '#38bdf8',
    icon: '🔮',
    price: 400,
    unlocked: false,
    color: '#38bdf8',
    secondaryColor: '#0284c7',
    glow: 'rgba(56, 189, 248, 0.8)',
    trailType: 'glass',
  },
  ice: {
    id: 'ice',
    name: 'Frost Orb',
    tier: 'Rare',
    tierColor: '#06b6d4',
    icon: '❄️',
    price: 750,
    unlocked: false,
    color: '#06b6d4',
    secondaryColor: '#0284c7',
    glow: 'rgba(6, 182, 212, 0.9)',
    trailType: 'ice',
  },
  golden: {
    id: 'golden',
    name: 'Golden Sphere',
    tier: 'Rare',
    tierColor: '#fbbf24',
    icon: '🪙',
    price: 1000,
    unlocked: false,
    color: '#fbbf24',
    secondaryColor: '#b45309',
    glow: 'rgba(251, 191, 36, 0.9)',
    trailType: 'gold',
  },
  fire: {
    id: 'fire',
    name: 'Meteor Fireball',
    tier: 'Epic',
    tierColor: '#f97316',
    icon: '🔥',
    price: 1400,
    unlocked: false,
    color: '#f97316',
    secondaryColor: '#dc2626',
    glow: 'rgba(249, 115, 22, 0.95)',
    trailType: 'fire',
  },
  electric: {
    id: 'electric',
    name: 'Electric Bolt',
    tier: 'Epic',
    tierColor: '#facc15',
    icon: '⚡',
    price: 1800,
    unlocked: false,
    color: '#facc15',
    secondaryColor: '#eab308',
    glow: 'rgba(250, 204, 21, 0.95)',
    trailType: 'lightning',
  },
  cyber: {
    id: 'cyber',
    name: 'Cyber Neon Core',
    tier: 'Epic',
    tierColor: '#ec4899',
    icon: '🌆',
    price: 2200,
    unlocked: false,
    color: '#ec4899',
    secondaryColor: '#06b6d4',
    glow: 'rgba(236, 72, 153, 0.95)',
    trailType: 'cyber',
  },
  magic: {
    id: 'magic',
    name: 'Mystic Starlight',
    tier: 'Legendary',
    tierColor: '#c084fc',
    icon: '✨',
    price: 2800,
    unlocked: false,
    color: '#c084fc',
    secondaryColor: '#7e22ce',
    glow: 'rgba(192, 132, 252, 0.95)',
    trailType: 'magic',
  },
  galaxy: {
    id: 'galaxy',
    name: 'Galaxy Nebula',
    tier: 'Legendary',
    tierColor: '#a855f7',
    icon: '🌌',
    price: 3500,
    unlocked: false,
    color: '#a855f7',
    secondaryColor: '#3b82f6',
    glow: 'rgba(168, 85, 247, 0.95)',
    trailType: 'stars',
  },
  rainbow: {
    id: 'rainbow',
    name: 'Rainbow Comet',
    tier: 'Legendary',
    tierColor: '#f472b6',
    icon: '🌈',
    price: 4200,
    unlocked: false,
    color: '#f472b6',
    secondaryColor: '#38bdf8',
    glow: 'rgba(244, 114, 182, 0.95)',
    trailType: 'rainbow',
  },
  dragon: {
    id: 'dragon',
    name: 'Dragon Flame Core',
    tier: 'Mythic',
    tierColor: '#dc2626',
    icon: '🐉',
    price: 5000,
    unlocked: false,
    color: '#ef4444',
    secondaryColor: '#7f1d1d',
    glow: 'rgba(239, 68, 68, 0.98)',
    trailType: 'dragon',
  },
  plasma: {
    id: 'plasma',
    name: 'Plasma Vortex Sovereign',
    tier: 'Royal',
    tierColor: '#06b6d4',
    icon: '👑',
    price: 6500,
    unlocked: false,
    color: '#38bdf8',
    secondaryColor: '#0e7490',
    glow: 'rgba(56, 189, 248, 1.0)',
    trailType: 'plasma',
  },
};

export interface BackgroundEnv {
  id: string;
  name: string;
  icon: string;
  bgGradient: string;
  particleType: string;
  particleColor: string;
  accentColor: string;
  description: string;
}

export const BACKGROUND_ENVS: Record<string, BackgroundEnv> = {
  space: {
    id: 'space',
    name: 'Deep Space Nebula',
    icon: '🌌',
    bgGradient: 'radial-gradient(circle at 50% 30%, #1e1b4b 0%, #0f172a 60%, #020617 100%)',
    particleType: 'stars',
    particleColor: '#a855f7',
    accentColor: '#c084fc',
    description: 'Deep galaxy cosmic background with starlight and ambient nebula glow.',
  },
  cyber_city: {
    id: 'cyber_city',
    name: 'Cyberpunk Metropolis',
    icon: '🌆',
    bgGradient: 'radial-gradient(circle at 50% 30%, #831843 0%, #0f172a 60%, #030712 100%)',
    particleType: 'grid',
    particleColor: '#ec4899',
    accentColor: '#38bdf8',
    description: 'Neon synthwave dark city matrix with glowing grid lines.',
  },
  volcano: {
    id: 'volcano',
    name: 'Volcano Core',
    icon: '🌋',
    bgGradient: 'radial-gradient(circle at 50% 30%, #450a0a 0%, #180202 60%, #050000 100%)',
    particleType: 'embers',
    particleColor: '#f97316',
    accentColor: '#ef4444',
    description: 'Molten magma cavern with floating fire embers and heat haze.',
  },
  snow_world: {
    id: 'snow_world',
    name: 'Arctic Blizzard',
    icon: '❄️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #0c4a6e 0%, #032b45 60%, #02131f 100%)',
    particleType: 'snow',
    particleColor: '#a5f3fc',
    accentColor: '#38bdf8',
    description: 'Sub-zero frozen ice palace with falling frost crystal snowflakes.',
  },
  cloud_kingdom: {
    id: 'cloud_kingdom',
    name: 'Sky Haven',
    icon: '☁️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #312e81 0%, #1e1b4b 60%, #090514 100%)',
    particleType: 'clouds',
    particleColor: '#f472b6',
    accentColor: '#f43f5e',
    description: 'Twilight sky with soft clouds and drifting shooting stars.',
  },
  fantasy_castle: {
    id: 'fantasy_castle',
    name: 'Mystic Citadel',
    icon: '🔮',
    bgGradient: 'radial-gradient(circle at 50% 30%, #3b0764 0%, #1e1b4b 60%, #090514 100%)',
    particleType: 'sparks',
    particleColor: '#c084fc',
    accentColor: '#a855f7',
    description: 'Arcane castle chamber filled with magical floating stardust.',
  },
  temple: {
    id: 'temple',
    name: 'Ancient Temple',
    icon: '⛩️',
    bgGradient: 'radial-gradient(circle at 50% 30%, #365314 0%, #1a2e05 60%, #0a1202 100%)',
    particleType: 'fireflies',
    particleColor: '#a3e635',
    accentColor: '#84cc16',
    description: 'Enchanted overgrown ruins guarded by glowing spirit fireflies.',
  },
  ocean: {
    id: 'ocean',
    name: 'Abyssal Deep',
    icon: '🪸',
    bgGradient: 'radial-gradient(circle at 50% 30%, #1e3a8a 0%, #172554 60%, #030712 100%)',
    particleType: 'bubbles',
    particleColor: '#60a5fa',
    accentColor: '#2563eb',
    description: 'Deep abyssal waters with bioluminescent jellyfish drifting.',
  },
  sunset: {
    id: 'sunset',
    name: 'Tropical Sunset',
    icon: '🌅',
    bgGradient: 'radial-gradient(circle at 50% 30%, #9a3412 0%, #4c1d95 60%, #0f051d 100%)',
    particleType: 'embers',
    particleColor: '#fdba74',
    accentColor: '#f97316',
    description: 'Warm golden twilight sky casting dramatic violet silhouettes.',
  },
  luxury_gold: {
    id: 'luxury_gold',
    name: 'Royal Gold Vault',
    icon: '👑',
    bgGradient: 'radial-gradient(circle at 50% 30%, #451a03 0%, #1c1917 60%, #0c0a09 100%)',
    particleType: 'dust',
    particleColor: '#fbbf24',
    accentColor: '#d97706',
    description: 'Luxurious velvet black and gold vault with floating gold dust.',
  },
};

export interface GamePresetTheme {
  id: string;
  name: string;
  icon: string;
  paddleId: string;
  ballId: string;
  envId: string;
  accentColor: string;
}

export const GAME_PRESET_THEMES: Record<string, GamePresetTheme> = {
  classic: { id: 'classic', name: 'Classic Retro', icon: '🎮', paddleId: 'classic', ballId: 'classic', envId: 'space', accentColor: '#38bdf8' },
  cyber: { id: 'cyber', name: 'Cyber Neon', icon: '🌆', paddleId: 'cyber', ballId: 'cyber', envId: 'cyber_city', accentColor: '#ec4899' },
  fantasy: { id: 'fantasy', name: 'Magic Fantasy', icon: '🔮', paddleId: 'magic', ballId: 'magic', envId: 'fantasy_castle', accentColor: '#c084fc' },
  royal: { id: 'royal', name: 'Royal Gold', icon: '👑', paddleId: 'royal', ballId: 'plasma', envId: 'luxury_gold', accentColor: '#fbbf24' },
  halloween: { id: 'halloween', name: 'Spooky Dungeon', icon: '🎃', paddleId: 'dragon', ballId: 'fire', envId: 'volcano', accentColor: '#f97316' },
  christmas: { id: 'christmas', name: 'Winter Frost', icon: '🎄', paddleId: 'ice', ballId: 'ice', envId: 'snow_world', accentColor: '#06b6d4' },
  ocean: { id: 'ocean', name: 'Deep Sea', icon: '🌊', paddleId: 'crystal', ballId: 'crystal', envId: 'ocean', accentColor: '#38bdf8' },
  space: { id: 'space', name: 'Cosmic Galaxy', icon: '🌌', paddleId: 'galaxy', ballId: 'galaxy', envId: 'space', accentColor: '#a855f7' },
  candy: { id: 'candy', name: 'Candy Land', icon: '🍬', paddleId: 'rainbow', ballId: 'rainbow', envId: 'cloud_kingdom', accentColor: '#f472b6' },
  egypt: { id: 'egypt', name: 'Ancient Tomb', icon: '🐫', paddleId: 'wood', ballId: 'golden', envId: 'temple', accentColor: '#d97706' },
};

export type GameMode =
  | 'classic'
  | 'endless'
  | 'time_attack'
  | 'challenge'
  | 'boss_battle'
  | 'survival'
  | 'mirror'
  | 'gravity'
  | 'moving'
  | 'puzzle';

export interface PowerUpConfig {
  type: string;
  name: string;
  icon: string;
  color: string;
  glow: string;
  description: string;
}

export const POWERUPS: Record<string, PowerUpConfig> = {
  multi_ball: { type: 'multi_ball', name: 'Multi Ball', icon: '🔴', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)', description: 'Spawns +2 extra balls!' },
  laser: { type: 'laser', name: 'Laser Cannon', icon: '🔫', color: '#ec4899', glow: 'rgba(236, 72, 153, 0.9)', description: 'Equips side lasers on paddle!' },
  fire_ball: { type: 'fire_ball', name: 'Fire Ball', icon: '🔥', color: '#f97316', glow: 'rgba(249, 115, 22, 0.9)', description: 'Pierces through bricks!' },
  ice_ball: { type: 'ice_ball', name: 'Ice Freeze', icon: '❄️', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.9)', description: 'Freezes surrounding bricks!' },
  explosive: { type: 'explosive', name: 'Explosive Ball', icon: '💣', color: '#ef4444', glow: 'rgba(239, 68, 68, 0.9)', description: 'Causes explosion on impact!' },
  ghost: { type: 'ghost', name: 'Ghost Ball', icon: '👻', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)', description: 'Passes through normal bricks!' },
  magnet: { type: 'magnet', name: 'Magnet Paddle', icon: '🧲', color: '#eab308', glow: 'rgba(234, 179, 8, 0.9)', description: 'Catches and holds the ball!' },
  long_paddle: { type: 'long_paddle', name: 'Long Paddle', icon: '↔️', color: '#10b981', glow: 'rgba(16, 185, 129, 0.9)', description: 'Expands paddle width!' },
  short_paddle: { type: 'short_paddle', name: 'Short Paddle', icon: '🤏', color: '#64748b', glow: 'rgba(100, 116, 139, 0.8)', description: 'Shrinks paddle (2x Bonus)!' },
  slow_motion: { type: 'slow_motion', name: 'Slow Motion', icon: '⏱️', color: '#38bdf8', glow: 'rgba(56, 189, 248, 0.9)', description: 'Slows ball speed by 35%!' },
  fast_ball: { type: 'fast_ball', name: 'Fast Ball', icon: '⚡', color: '#facc15', glow: 'rgba(250, 204, 21, 0.9)', description: 'Supercharged ball speed!' },
  shield: { type: 'shield', name: 'Safety Shield', icon: '🛡️', color: '#3b82f6', glow: 'rgba(59, 130, 246, 0.9)', description: 'Glowing barrier protects bottom!' },
  rocket: { type: 'rocket', name: 'Rocket Strike', icon: '🚀', color: '#f43f5e', glow: 'rgba(244, 63, 94, 0.9)', description: 'Fires 3 rockets upward!' },
  thunder: { type: 'thunder', name: 'Thunder Strike', icon: '⚡', color: '#eab308', glow: 'rgba(234, 179, 8, 0.9)', description: 'Lightning zaps 4 bricks!' },
  rainbow: { type: 'rainbow', name: 'Rainbow Blast', icon: '🌈', color: '#f472b6', glow: 'rgba(244, 114, 182, 0.9)', description: 'Destroys entire row!' },
  bomb: { type: 'bomb', name: 'Bomb Explosion', icon: '💥', color: '#dc2626', glow: 'rgba(220, 38, 38, 0.9)', description: 'Massive board blast!' },
  coin_magnet: { type: 'coin_magnet', name: 'Coin Magnet', icon: '🪙', color: '#fbbf24', glow: 'rgba(251, 191, 36, 0.9)', description: 'Attracts falling coins!' },
  double_coins: { type: 'double_coins', name: 'Double Coins', icon: '💰', color: '#d97706', glow: 'rgba(217, 119, 6, 0.9)', description: '2x coin multiplier!' },
  double_score: { type: 'double_score', name: 'Double Score', icon: '⭐', color: '#a855f7', glow: 'rgba(168, 85, 247, 0.9)', description: '2x score multiplier!' },
  time_freeze: { type: 'time_freeze', name: 'Time Freeze', icon: '⏳', color: '#06b6d4', glow: 'rgba(6, 182, 212, 0.9)', description: 'Freezes board & time!' },
};

// Ambient Floating Particle Background Canvas for Luxury Shop
function ShopBackgroundParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const stars = Array.from({ length: 60 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      radius: Math.random() * 2 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.4 ? '#fbbf24' : '#38bdf8',
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      stars.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.alpha += Math.sin(Date.now() * s.pulse) * 0.01;

        if (s.x < 0) s.x = canvas.width;
        if (s.x > canvas.width) s.x = 0;
        if (s.y < 0) s.y = canvas.height;
        if (s.y > canvas.height) s.y = 0;

        ctx.save();
        ctx.globalAlpha = Math.max(0.1, Math.min(0.9, s.alpha));
        ctx.fillStyle = s.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = s.color;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none w-full h-full z-0 opacity-60 rounded-3xl"
    />
  );
}

// Canvas Preview helper for Paddle with 60 FPS Live FX
function PaddlePreviewCanvas({ skin }: { skin: PaddleSkin }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 160;
    canvas.height = 48;

    let animId: number;
    const startTime = performance.now();

    const particles: { x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }[] = [];
    for (let i = 0; i < 10; i++) {
      particles.push({
        x: Math.random() * 120 + 20,
        y: Math.random() * 20 + 14,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -Math.random() * 0.8 - 0.2,
        size: Math.random() * 2.2 + 1,
        alpha: Math.random() * 0.8 + 0.2,
        color: skin.trailColor || skin.color,
      });
    }

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const w = 124;
      const h = 18;
      const x = (160 - w) / 2;
      const y = (48 - h) / 2;

      // Outer Glow Aura
      ctx.shadowBlur = 16 + Math.sin(elapsed * 0.004) * 4;
      ctx.shadowColor = skin.glow;

      // Base Linear/Spectrum Gradient
      let grad: CanvasGradient;
      if (skin.texturePattern === 'rainbow') {
        const hueShift = (elapsed * 0.08) % 360;
        grad = ctx.createLinearGradient(x, y, x + w, y);
        grad.addColorStop(0, `hsl(${hueShift}, 90%, 60%)`);
        grad.addColorStop(0.5, `hsl(${(hueShift + 120) % 360}, 90%, 60%)`);
        grad.addColorStop(1, `hsl(${(hueShift + 240) % 360}, 90%, 60%)`);
      } else {
        grad = ctx.createLinearGradient(x, y, x, y + h);
        grad.addColorStop(0, skin.color);
        grad.addColorStop(1, skin.secondaryColor);
      }

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 8);
      ctx.fill();

      // Texture Artwork Overlay
      if (skin.texturePattern === 'metal') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 2, w - 8, 3, 2);
        ctx.fill();
        ctx.fillStyle = '#475569';
        ctx.beginPath();
        ctx.arc(x + 6, y + h / 2, 2, 0, Math.PI * 2);
        ctx.arc(x + w - 6, y + h / 2, 2, 0, Math.PI * 2);
        ctx.fill();
      } else if (skin.texturePattern === 'wood') {
        ctx.strokeStyle = 'rgba(120, 53, 15, 0.5)';
        ctx.lineWidth = 1;
        for (let i = 1; i < 4; i++) {
          ctx.beginPath();
          ctx.moveTo(x + 10, y + i * 4);
          ctx.lineTo(x + w - 10, y + i * 4);
          ctx.stroke();
        }
        ctx.fillStyle = '#f59e0b';
        ctx.fillRect(x + 2, y + 2, 5, h - 4);
        ctx.fillRect(x + w - 7, y + 2, 5, h - 4);
      } else if (skin.texturePattern === 'glass') {
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(x + 25, y);
        ctx.lineTo(x + 45, y + h);
        ctx.moveTo(x + 80, y);
        ctx.lineTo(x + 100, y + h);
        ctx.stroke();
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 2, w - 8, 3, 2);
        ctx.fill();
      } else if (skin.texturePattern === 'gold') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
        ctx.beginPath();
        ctx.roundRect(x + 6, y + 2, w - 12, 3, 2);
        ctx.fill();
        ctx.fillStyle = '#dc2626';
        ctx.beginPath();
        ctx.arc(x + w / 2, y + h / 2, 3.5, 0, Math.PI * 2);
        ctx.fill();
      } else if (skin.texturePattern === 'fire') {
        ctx.fillStyle = '#ef4444';
        const flameOffset = Math.sin(elapsed * 0.01) * 3;
        ctx.beginPath();
        ctx.moveTo(x + 10, y);
        ctx.lineTo(x + 15, y - 5 + flameOffset);
        ctx.lineTo(x + 20, y);
        ctx.moveTo(x + w / 2 - 5, y);
        ctx.lineTo(x + w / 2, y - 6 - flameOffset);
        ctx.lineTo(x + w / 2 + 5, y);
        ctx.moveTo(x + w - 20, y);
        ctx.lineTo(x + w - 15, y - 5 + flameOffset);
        ctx.lineTo(x + w - 10, y);
        ctx.fill();
      } else if (skin.texturePattern === 'cyber') {
        const scanX = x + ((Math.sin(elapsed * 0.003) + 1) / 2) * (w - 12);
        ctx.fillStyle = '#06b6d4';
        ctx.fillRect(scanX, y + 2, 10, h - 4);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.beginPath();
        ctx.roundRect(x + 4, y + 2, w - 8, 2, 1);
        ctx.fill();
      } else if (skin.texturePattern === 'magic' || skin.texturePattern === 'cosmic') {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        const starPhase = (Math.sin(elapsed * 0.005) + 1) / 2;
        ctx.beginPath();
        ctx.arc(x + 20, y + h / 2, 1.5 + starPhase, 0, Math.PI * 2);
        ctx.arc(x + w / 2, y + h / 2, 2.5 + starPhase, 0, Math.PI * 2);
        ctx.arc(x + w - 20, y + h / 2, 1.5 + starPhase, 0, Math.PI * 2);
        ctx.fill();
      } else if (skin.texturePattern === 'royal') {
        ctx.fillStyle = '#fef08a';
        ctx.font = '10px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('👑', x + w / 2, y + h / 2);
      }

      // Ambient Floating Particles
      particles.forEach((p) => {
        p.y += p.vy;
        p.x += p.vx;
        if (p.y < y - 10) {
          p.y = y + h;
          p.x = x + Math.random() * w;
        }
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Periodic Glint Line Sweep
      const sweepCycle = (elapsed * 0.0015) % 3;
      if (sweepCycle < 1) {
        const glintX = x - 20 + sweepCycle * (w + 40);
        ctx.save();
        ctx.beginPath();
        ctx.roundRect(x, y, w, h, 8);
        ctx.clip();

        const glintGrad = ctx.createLinearGradient(glintX, y, glintX + 15, y + h);
        glintGrad.addColorStop(0, 'rgba(255, 255, 255, 0)');
        glintGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.6)');
        glintGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');

        ctx.fillStyle = glintGrad;
        ctx.fillRect(glintX - 10, y - 5, 25, h + 10);
        ctx.restore();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [skin]);

  return <canvas ref={canvasRef} className="w-[160px] h-[48px] block mx-auto drop-shadow-lg" />;
}

// Canvas Preview helper for 3D Ball with Live Energy Ring FX
function BallPreviewCanvas({ skin }: { skin: BallSkin }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 64;
    canvas.height = 64;

    let animId: number;
    const startTime = performance.now();

    const orbitParticles = Array.from({ length: 6 }, (_, i) => ({
      angle: (i * Math.PI) / 3,
      speed: 0.03 + Math.random() * 0.02,
      dist: 22 + Math.random() * 4,
      size: Math.random() * 2 + 1.5,
    }));

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const cx = 32;
      const cy = 32;
      const r = 16;

      // Outer Glow Aura
      ctx.shadowBlur = 18 + Math.sin(elapsed * 0.005) * 6;
      ctx.shadowColor = skin.glow;

      // Orbiting energy particles
      orbitParticles.forEach((p) => {
        p.angle += p.speed;
        const px = cx + Math.cos(p.angle) * p.dist;
        const py = cy + Math.sin(p.angle) * (p.dist * 0.6);

        ctx.save();
        ctx.fillStyle = skin.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = skin.glow;
        ctx.beginPath();
        ctx.arc(px, py, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // 3D Sphere Radial Gradient
      let bGrad: CanvasGradient;
      if (skin.trailType === 'rainbow') {
        const hueShift = (elapsed * 0.1) % 360;
        bGrad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, r);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.5, `hsl(${hueShift}, 90%, 65%)`);
        bGrad.addColorStop(1, `hsl(${(hueShift + 180) % 360}, 90%, 45%)`);
      } else {
        bGrad = ctx.createRadialGradient(cx - 4, cy - 4, 2, cx, cy, r);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.4, skin.color);
        bGrad.addColorStop(1, skin.secondaryColor);
      }

      ctx.fillStyle = bGrad;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.fill();

      // Top Specular Gloss Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx - 5, cy - 5, 3.5, 0, Math.PI * 2);
      ctx.fill();

      // Tier Energy Overlay
      if (skin.trailType === 'lightning') {
        ctx.strokeStyle = '#facc15';
        ctx.lineWidth = 1.5;
        const angle = elapsed * 0.008;
        ctx.beginPath();
        ctx.moveTo(cx + Math.cos(angle) * (r + 1), cy + Math.sin(angle) * (r + 1));
        ctx.lineTo(cx + Math.cos(angle + 1) * (r + 4), cy + Math.sin(angle + 1) * (r + 4));
        ctx.stroke();
      } else if (skin.trailType === 'plasma') {
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.ellipse(cx, cy, r + 5, (r + 5) * 0.4, elapsed * 0.003, 0, Math.PI * 2);
        ctx.stroke();
      } else if (skin.trailType === 'fire' || skin.trailType === 'dragon') {
        ctx.fillStyle = '#f97316';
        ctx.beginPath();
        ctx.arc(cx + Math.sin(elapsed * 0.01) * 6, cy - r - 2, 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);

    return () => cancelAnimationFrame(animId);
  }, [skin]);

  return <canvas ref={canvasRef} className="w-[64px] h-[64px] block mx-auto drop-shadow-xl" />;
}

// ==========================================
// 2. MAIN BRICK SMASH CLASSIC COMPONENT
// ==========================================

export function BrickSmashClassic({ coins, onGameWin, onGameLose }: BrickSmashProps) {
  const { showInsufficientCoinsModal, validateAndDeductCoins } = useCoinValidation();

  // Betting & Wallet
  const [bet, setBet] = useState(100);

  // Unlocked Customization Inventory in localStorage
  const [unlockedPaddles, setUnlockedPaddles] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('brick_unlocked_paddles') || '["classic"]');
  });
  const [unlockedBalls, setUnlockedBalls] = useState<string[]>(() => {
    return JSON.parse(localStorage.getItem('brick_unlocked_balls') || '["classic"]');
  });
  const [selectedPaddleId, setSelectedPaddleId] = useState<string>(() => {
    return localStorage.getItem('brick_selected_paddle') || 'classic';
  });
  const [selectedBallId, setSelectedBallId] = useState<string>(() => {
    return localStorage.getItem('brick_selected_ball') || 'classic';
  });
  const [activeEnvId, setActiveEnvId] = useState<string>('space');

  // Game Settings & Progression
  const [activeMode, setActiveMode] = useState<GameMode>('classic');
  const [currentStage, setCurrentStage] = useState<number>(() => {
    return parseInt(localStorage.getItem('brick_stage') || '1', 10);
  });
  const [highScore, setHighScore] = useState<number>(() => {
    return parseInt(localStorage.getItem('brick_high_score') || '0', 10);
  });

  // Audio Settings
  const [masterVolume, setMasterVolumeState] = useState<number>(() => Math.round(synth.getMasterVolume() * 100));
  const [musicVolume, setMusicVolumeState] = useState<number>(() => Math.round(synth.getMusicVolume() * 100));
  const [sfxVolume, setSfxVolumeState] = useState<number>(() => Math.round(synth.getSfxVolume() * 100));
  const [bgmEnabled, setBgmEnabledState] = useState<boolean>(() => synth.isBgmEnabled());
  const [sfxEnabled, setSfxEnabledState] = useState<boolean>(() => synth.isSfxEnabled());

  // Game Engine States
  const [gameState, setGameState] = useState<'menu' | 'playing' | 'paused' | 'victory' | 'gameover'>('menu');
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [bossHp, setBossHp] = useState(100);
  const [bossMaxHp, setBossMaxHp] = useState(100);

  // Active Temporary Power-Up Effects
  const [activeEffects, setActiveEffects] = useState<Record<string, number>>({});

  // Navigation Modals
  const [showShopModal, setShowShopModal] = useState(false);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [showMissionsModal, setShowMissionsModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [shopCategory, setShopCategory] = useState<'paddles' | 'balls' | 'presets'>('paddles');

  // Confirmation, Warning & Celebration Modals
  const [pendingPurchase, setPendingPurchase] = useState<{
    item: PaddleSkin | BallSkin;
    category: 'paddle' | 'ball';
  } | null>(null);

  const [purchaseSuccessItem, setPurchaseSuccessItem] = useState<{
    name: string;
    category: 'paddle' | 'ball' | 'preset';
    item: PaddleSkin | BallSkin | GamePresetTheme;
  } | null>(null);

  const [insufficientWarning, setInsufficientWarning] = useState<{
    skinName: string;
    price: number;
    needed: number;
  } | null>(null);

  const [purchaseFlash, setPurchaseFlash] = useState(false);

  // Canvas Refs & Physics Objects
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);

  // Internal Game Engine Physics Memory
  const engineRef = useRef<{
    width: number;
    height: number;
    paddle: { x: number; y: number; width: number; height: number; targetX: number; vx: number };
    balls: { x: number; y: number; vx: number; vy: number; radius: number; attached: boolean; isFire?: boolean; isIce?: boolean; isGhost?: boolean }[];
    bricks: { id: number; x: number; y: number; width: number; height: number; type: 'normal' | 'reinforced' | 'titanium' | 'bomb' | 'laser' | 'powerup' | 'coin'; hp: number; maxHp: number; color: string; value: number; vx?: number }[];
    lasers: { x: number; y: number; vy: number }[];
    powerups: { x: number; y: number; vy: number; type: string; config: PowerUpConfig }[];
    particles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; life: number; maxLife: number; shape?: string }[];
    floatingTexts: { x: number; y: number; text: string; color: string; alpha: number; vy: number }[];
    bgParticles: { x: number; y: number; vx: number; vy: number; radius: number; color: string; alpha: number }[];
    rockets: { x: number; y: number; targetX: number; targetY: number; vy: number }[];
    boss: { x: number; y: number; width: number; height: number; vx: number; hp: number; maxHp: number } | null;
    screenShake: number;
    comboTimer: number;
    shieldActive: boolean;
  }>({
    width: 600,
    height: 750,
    paddle: { x: 300, y: 700, width: 110, height: 16, targetX: 300, vx: 0 },
    balls: [],
    bricks: [],
    lasers: [],
    powerups: [],
    particles: [],
    floatingTexts: [],
    bgParticles: [],
    rockets: [],
    boss: null,
    screenShake: 0,
    comboTimer: 0,
    shieldActive: false,
  });

  // BGM Auto Control Lifecycle
  useEffect(() => {
    if (gameState === 'playing') {
      synth.startBgm();
    } else {
      synth.stopBgm();
    }
    return () => {
      synth.stopBgm();
    };
  }, [gameState]);

  // Apply Preset Theme Shortcut
  const handleSelectPresetTheme = (themeId: string) => {
    const theme = GAME_PRESET_THEMES[themeId];
    if (!theme) return;

    synth.playClick();
    setSelectedPaddleId(theme.paddleId);
    setSelectedBallId(theme.ballId);
    setActiveEnvId(theme.envId);

    localStorage.setItem('brick_selected_paddle', theme.paddleId);
    localStorage.setItem('brick_selected_ball', theme.ballId);
  };

  // Purchase Attempt Trigger (Checks coins & opens confirmation dialog)
  const handleAttemptPaddleBuy = (skin: PaddleSkin) => {
    if (coins < skin.price) {
      showInsufficientCoinsModal(skin.price, 'Brick Smash');
      return;
    }
    setPendingPurchase({ item: skin, category: 'paddle' });
  };

  const handleAttemptBallBuy = (skin: BallSkin) => {
    if (coins < skin.price) {
      showInsufficientCoinsModal(skin.price, 'Brick Smash');
      return;
    }
    setPendingPurchase({ item: skin, category: 'ball' });
  };

  // Confirm Purchase Callback
  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;
    const { item, category } = pendingPurchase;

    if (!validateAndDeductCoins(item.price, 'Brick Smash')) {
      setPendingPurchase(null);
      return;
    }

    synth.playCoin();
    synth.playFanfare();

    // Haptic vibration feedback on mobile devices
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([60, 120, 60]); } catch (e) {}
    }

    // Trigger visual light burst flash
    setPurchaseFlash(true);
    setTimeout(() => setPurchaseFlash(false), 600);

    if (category === 'paddle') {
      const updated = [...unlockedPaddles, item.id];
      setUnlockedPaddles(updated);
      localStorage.setItem('brick_unlocked_paddles', JSON.stringify(updated));
    } else {
      const updated = [...unlockedBalls, item.id];
      setUnlockedBalls(updated);
      localStorage.setItem('brick_unlocked_balls', JSON.stringify(updated));
    }

    // Show Celebration Modal
    setPurchaseSuccessItem({
      name: item.name,
      category,
      item,
    });

    setPendingPurchase(null);
  };

  const handleEquipSuccessItem = () => {
    if (!purchaseSuccessItem) return;
    const { category, item } = purchaseSuccessItem;

    synth.playClick();
    if (category === 'paddle') {
      setSelectedPaddleId(item.id);
      localStorage.setItem('brick_selected_paddle', item.id);
    } else if (category === 'ball') {
      setSelectedBallId(item.id);
      localStorage.setItem('brick_selected_ball', item.id);
    } else if (category === 'preset') {
      handleSelectPresetTheme(item.id);
    }

    setPurchaseFlash(true);
    setTimeout(() => setPurchaseFlash(false), 600);
    setPurchaseSuccessItem(null);
  };

  // Spawn Initial Brick Wall based on Mode and Stage
  const generateBrickWall = (mode: GameMode, stage: number) => {
    const bricks = [];
    const rows = Math.min(8, 4 + Math.floor(stage / 2));
    const cols = 8;
    const padding = 8;
    const brickWidth = (600 - (cols + 1) * padding) / cols;
    const brickHeight = 22;
    const startY = 80;

    const colors = ['#f43f5e', '#f97316', '#fbbf24', '#10b981', '#38bdf8', '#a855f7', '#ec4899'];
    let brickId = 1;

    if (mode === 'boss_battle') {
      const bossMax = 300 + stage * 100;
      engineRef.current.boss = {
        x: 200,
        y: 100,
        width: 200,
        height: 50,
        vx: 2.5,
        hp: bossMax,
        maxHp: bossMax,
      };
      setBossHp(bossMax);
      setBossMaxHp(bossMax);

      for (let c = 0; c < cols; c++) {
        bricks.push({
          id: brickId++,
          x: padding + c * (brickWidth + padding),
          y: 200,
          width: brickWidth,
          height: brickHeight,
          type: 'normal' as const,
          hp: 1,
          maxHp: 1,
          color: '#ef4444',
          value: 150,
        });
      }
      return bricks;
    }

    engineRef.current.boss = null;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (stage > 2 && (r + c) % 5 === 0 && Math.random() < 0.25) continue;

        let type: 'normal' | 'reinforced' | 'titanium' | 'bomb' | 'laser' | 'powerup' | 'coin' = 'normal';
        let hp = 1;
        let color = colors[r % colors.length];

        const rand = Math.random();
        if (rand < 0.08 && stage > 1) {
          type = 'titanium';
          hp = 999;
          color = '#64748b';
        } else if (rand < 0.22) {
          type = 'reinforced';
          hp = 2 + Math.floor(stage / 3);
          color = '#eab308';
        } else if (rand < 0.32) {
          type = 'bomb';
          hp = 1;
          color = '#ef4444';
        } else if (rand < 0.40) {
          type = 'laser';
          hp = 1;
          color = '#ec4899';
        } else if (rand < 0.55) {
          type = 'powerup';
          hp = 1;
          color = '#38bdf8';
        } else if (rand < 0.68) {
          type = 'coin';
          hp = 1;
          color = '#fbbf24';
        }

        bricks.push({
          id: brickId++,
          x: padding + c * (brickWidth + padding),
          y: startY + r * (brickHeight + padding),
          width: brickWidth,
          height: brickHeight,
          type,
          hp,
          maxHp: hp,
          color,
          value: hp * 100,
          vx: mode === 'moving' ? (r % 2 === 0 ? 1 : -1) : 0,
        });
      }
    }

    return bricks;
  };

  // Start Level Session
  const handleStartGame = () => {
    if (!validateAndDeductCoins(bet, 'Brick Smash')) {
      return;
    }

    synth.playClick();

    const engine = engineRef.current;
    engine.width = 600;
    engine.height = 750;

    const basePaddleWidth = 110;

    engine.paddle = {
      x: 300,
      y: 700,
      width: basePaddleWidth,
      height: 16,
      targetX: 300,
      vx: 0,
    };

    // Upgraded ball size (10px) with starting attached state
    engine.balls = [
      {
        x: 300,
        y: 688,
        vx: 4 * (Math.random() > 0.5 ? 1 : -1),
        vy: -5.5,
        radius: 10,
        attached: true,
      },
    ];

    engine.bricks = generateBrickWall(activeMode, currentStage);
    engine.lasers = [];
    engine.powerups = [];
    engine.particles = [];
    engine.floatingTexts = [];
    engine.rockets = [];
    engine.screenShake = 0;
    engine.comboTimer = 0;
    engine.shieldActive = false;

    const env = BACKGROUND_ENVS[activeEnvId] || BACKGROUND_ENVS.space;
    engine.bgParticles = Array.from({ length: 40 }, () => ({
      x: Math.random() * 600,
      y: Math.random() * 750,
      vx: (Math.random() - 0.5) * 0.8,
      vy: -(Math.random() * 1.2 + 0.3),
      radius: Math.random() * 2.5 + 1,
      color: env.particleColor,
      alpha: Math.random() * 0.6 + 0.2,
    }));

    setScore(0);
    setLives(3);
    setActiveEffects({});
    setGameState('playing');
  };

  // Launch Attached Balls
  const launchBalls = () => {
    engineRef.current.balls.forEach((b) => {
      if (b.attached) {
        b.attached = false;
        b.vy = -6;
      }
    });
    synth.playCard();
  };

  // Main Canvas Render Loop
  useEffect(() => {
    if (gameState !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 750;

    const activePaddleSkin = PADDLE_SKINS[selectedPaddleId] || PADDLE_SKINS.classic;
    const activeBallSkin = BALL_SKINS[selectedBallId] || BALL_SKINS.classic;

    let lastTime = performance.now();

    const loop = (time: number) => {
      const dt = Math.min((time - lastTime) / 1000, 0.033);
      lastTime = time;

      const engine = engineRef.current;

      ctx.save();
      if (engine.screenShake > 0) {
        const sx = (Math.random() - 0.5) * engine.screenShake * 4;
        const sy = (Math.random() - 0.5) * engine.screenShake * 4;
        ctx.translate(sx, sy);
        engine.screenShake *= 0.9;
        if (engine.screenShake < 0.1) engine.screenShake = 0;
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#090d16';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Render Ambient Background Particles
      engine.bgParticles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.y < 0) p.y = canvas.height;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 8;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      // Paddle Movement
      const pad = engine.paddle;
      const dx = pad.targetX - pad.x;
      pad.vx = dx * 0.25;
      pad.x += pad.vx;
      pad.x = Math.max(pad.width / 2, Math.min(canvas.width - pad.width / 2, pad.x));

      // Draw Paddle
      ctx.save();
      ctx.shadowBlur = 18;
      ctx.shadowColor = activePaddleSkin.glow;

      const padX = pad.x - pad.width / 2;
      const padY = pad.y - pad.height / 2;

      const grad = ctx.createLinearGradient(padX, padY, padX, padY + pad.height);
      grad.addColorStop(0, activePaddleSkin.color);
      grad.addColorStop(1, activePaddleSkin.secondaryColor);

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(padX, padY, pad.width, pad.height, 8);
      ctx.fill();

      // Top Highlight
      ctx.fillStyle = 'rgba(255, 255, 255, 0.45)';
      ctx.beginPath();
      ctx.roundRect(padX + 4, padY + 2, pad.width - 8, 3, 2);
      ctx.fill();

      if (activeEffects.laser) {
        ctx.fillStyle = '#ec4899';
        ctx.fillRect(padX - 4, padY - 6, 6, 12);
        ctx.fillRect(padX + pad.width - 2, padY - 6, 6, 12);
      }
      ctx.restore();

      // Bottom Safety Shield
      if (engine.shieldActive) {
        ctx.save();
        ctx.strokeStyle = '#38bdf8';
        ctx.lineWidth = 4;
        ctx.shadowBlur = 12;
        ctx.shadowColor = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(0, canvas.height - 12);
        ctx.lineTo(canvas.width, canvas.height - 12);
        ctx.stroke();
        ctx.restore();
      }

      // Lasers
      for (let i = engine.lasers.length - 1; i >= 0; i--) {
        const l = engine.lasers[i];
        l.y += l.vy;

        ctx.save();
        ctx.fillStyle = '#ec4899';
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#ec4899';
        ctx.fillRect(l.x - 2, l.y, 4, 14);
        ctx.restore();

        engine.bricks.forEach((b) => {
          if (b.hp > 0 && b.type !== 'titanium') {
            if (l.x >= b.x && l.x <= b.x + b.width && l.y >= b.y && l.y <= b.y + b.height) {
              b.hp = 0;
              engine.lasers.splice(i, 1);
              triggerBrickBreakFX(b, engine);
            }
          }
        });

        if (l.y < 0) engine.lasers.splice(i, 1);
      }

      // Powerups
      for (let i = engine.powerups.length - 1; i >= 0; i--) {
        const p = engine.powerups[i];
        p.y += p.vy;

        if (activeEffects.coin_magnet) {
          const mdx = pad.x - p.x;
          p.x += mdx * 0.08;
        }

        ctx.save();
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.config.glow;
        ctx.fillStyle = p.config.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 11, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = '12px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.config.icon, p.x, p.y);
        ctx.restore();

        if (
          p.y + 11 >= pad.y - pad.height / 2 &&
          p.x >= pad.x - pad.width / 2 &&
          p.x <= pad.x + pad.width / 2
        ) {
          synth.playGem();
          applyPowerUp(p.type, engine);
          engine.powerups.splice(i, 1);
        } else if (p.y > canvas.height + 20) {
          engine.powerups.splice(i, 1);
        }
      }

      // Bricks
      engine.bricks.forEach((b) => {
        if (b.hp <= 0) return;

        if (b.vx) {
          b.x += b.vx;
          if (b.x <= 10 || b.x + b.width >= canvas.width - 10) {
            b.vx *= -1;
          }
        }

        ctx.save();
        ctx.shadowBlur = 8;
        ctx.shadowColor = b.color;

        const bGrad = ctx.createLinearGradient(b.x, b.y, b.x, b.y + b.height);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.3, b.color);
        bGrad.addColorStop(1, b.color);

        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.roundRect(b.x, b.y, b.width, b.height, 4);
        ctx.fill();

        if (b.type === 'bomb') {
          ctx.fillText('💣', b.x + b.width / 2 - 6, b.y + b.height / 2 + 4);
        } else if (b.type === 'laser') {
          ctx.fillText('⚡', b.x + b.width / 2 - 6, b.y + b.height / 2 + 4);
        } else if (b.type === 'powerup') {
          ctx.fillText('✨', b.x + b.width / 2 - 6, b.y + b.height / 2 + 4);
        } else if (b.type === 'coin') {
          ctx.fillText('🪙', b.x + b.width / 2 - 6, b.y + b.height / 2 + 4);
        } else if (b.type === 'titanium') {
          ctx.fillStyle = '#1e293b';
          ctx.fillRect(b.x + 4, b.y + 4, b.width - 8, b.height - 8);
        }

        if (b.hp < b.maxHp && b.maxHp > 1) {
          ctx.strokeStyle = 'rgba(0,0,0,0.6)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.moveTo(b.x + 4, b.y + 4);
          ctx.lineTo(b.x + b.width - 6, b.y + b.height - 4);
          ctx.stroke();
        }

        ctx.restore();
      });

      // Boss
      if (engine.boss && engine.boss.hp > 0) {
        const boss = engine.boss;
        boss.x += boss.vx;
        if (boss.x <= 20 || boss.x + boss.width >= canvas.width - 20) {
          boss.vx *= -1;
        }

        ctx.save();
        ctx.shadowBlur = 20;
        ctx.shadowColor = '#ef4444';
        const bossGrad = ctx.createLinearGradient(boss.x, boss.y, boss.x, boss.y + boss.height);
        bossGrad.addColorStop(0, '#f87171');
        bossGrad.addColorStop(1, '#991b1b');

        ctx.fillStyle = bossGrad;
        ctx.beginPath();
        ctx.roundRect(boss.x, boss.y, boss.width, boss.height, 12);
        ctx.fill();

        ctx.font = 'bold 16px sans-serif';
        ctx.fillStyle = '#ffffff';
        ctx.textAlign = 'center';
        ctx.fillText(`👑 BOSS BRICK (${boss.hp}/${boss.maxHp})`, boss.x + boss.width / 2, boss.y + 30);
        ctx.restore();
      }

      // Balls (Upgraded Spherical Shading & Energy Trails)
      for (let i = engine.balls.length - 1; i >= 0; i--) {
        const ball = engine.balls[i];

        if (ball.attached) {
          ball.x = pad.x;
          ball.y = pad.y - pad.height / 2 - ball.radius;
        } else {
          ball.x += ball.vx;
          ball.y += ball.vy;

          if (ball.x - ball.radius <= 0 || ball.x + ball.radius >= canvas.width) {
            ball.vx *= -1;
            synth.playTick();
          }
          if (ball.y - ball.radius <= 0) {
            ball.vy *= -1;
            synth.playTick();
          }

          if (
            ball.y + ball.radius >= pad.y - pad.height / 2 &&
            ball.y - ball.radius <= pad.y + pad.height / 2 &&
            ball.x >= pad.x - pad.width / 2 &&
            ball.x <= pad.x + pad.width / 2
          ) {
            if (activeEffects.magnet) {
              ball.attached = true;
            } else {
              synth.playClick();
              ball.vy = -Math.abs(ball.vy);
              const hitRatio = (ball.x - pad.x) / (pad.width / 2);
              ball.vx = hitRatio * 5.5;
            }
          }

          engine.bricks.forEach((b) => {
            if (b.hp <= 0) return;

            if (
              ball.x + ball.radius >= b.x &&
              ball.x - ball.radius <= b.x + b.width &&
              ball.y + ball.radius >= b.y &&
              ball.y - ball.radius <= b.y + b.height
            ) {
              if (!ball.isFire) {
                ball.vy *= -1;
              }

              if (b.type !== 'titanium') {
                b.hp--;
                if (b.hp <= 0) {
                  triggerBrickBreakFX(b, engine);
                }
              } else if (ball.isFire) {
                b.hp = 0;
                triggerBrickBreakFX(b, engine);
              } else {
                synth.playTick();
              }
            }
          });

          if (engine.boss && engine.boss.hp > 0) {
            const boss = engine.boss;
            if (
              ball.x + ball.radius >= boss.x &&
              ball.x - ball.radius <= boss.x + boss.width &&
              ball.y + ball.radius >= boss.y &&
              ball.y - ball.radius <= boss.y + boss.height
            ) {
              ball.vy *= -1;
              boss.hp -= 15;
              engine.screenShake = 4;
              synth.playExplode();
              setBossHp(Math.max(0, boss.hp));

              if (boss.hp <= 0) {
                setScore((s) => s + 5000);
                synth.playFanfare();
                setGameState('victory');
                const mult = 3.5;
                onGameWin(Math.floor(bet * mult), mult);
              }
            }
          }

          if (ball.y > canvas.height + 20) {
            if (engine.shieldActive) {
              ball.vy = -Math.abs(ball.vy);
              engine.shieldActive = false;
            } else {
              engine.balls.splice(i, 1);
            }
          }
        }

        // Render Upgraded 3D Ball
        ctx.save();
        ctx.shadowBlur = 16;
        ctx.shadowColor = activeBallSkin.glow;

        const bGrad = ctx.createRadialGradient(ball.x - 3, ball.y - 3, 2, ball.x, ball.y, ball.radius);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.4, activeBallSkin.color);
        bGrad.addColorStop(1, activeBallSkin.secondaryColor);

        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
        ctx.fill();

        // High gloss specular reflection dot
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(ball.x - 3, ball.y - 3, 2.5, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      if (engine.balls.length === 0) {
        if (lives > 1) {
          setLives((l) => l - 1);
          synth.playExplode();
          engine.balls = [
            {
              x: pad.x,
              y: pad.y - pad.height / 2 - 10,
              vx: 4,
              vy: -5.5,
              radius: 10,
              attached: true,
            },
          ];
        } else {
          synth.playExplode();
          setGameState('gameover');
          const mult = parseFloat((1 + score * 0.001).toFixed(2));
          onGameWin(Math.floor(bet * mult), mult);
        }
      }

      const remainingTargetBricks = engine.bricks.filter(
        (b) => b.hp > 0 && b.type !== 'titanium'
      ).length;

      if (remainingTargetBricks === 0 && !engine.boss) {
        synth.playFanfare();
        setGameState('victory');
        const mult = parseFloat((2.0 + currentStage * 0.5).toFixed(2));
        onGameWin(Math.floor(bet * mult), mult);

        const nextStage = currentStage + 1;
        setCurrentStage(nextStage);
        localStorage.setItem('brick_stage', nextStage.toString());
      }

      for (let i = engine.particles.length - 1; i >= 0; i--) {
        const p = engine.particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.life--;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.life / p.maxLife);
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        if (p.life <= 0) engine.particles.splice(i, 1);
      }

      for (let i = engine.floatingTexts.length - 1; i >= 0; i--) {
        const ft = engine.floatingTexts[i];
        ft.y += ft.vy;
        ft.alpha -= 0.02;

        ctx.save();
        ctx.font = 'bold 18px sans-serif';
        ctx.fillStyle = ft.color;
        ctx.globalAlpha = Math.max(0, ft.alpha);
        ctx.shadowBlur = 10;
        ctx.shadowColor = ft.color;
        ctx.textAlign = 'center';
        ctx.fillText(ft.text, ft.x, ft.y);
        ctx.restore();

        if (ft.alpha <= 0) engine.floatingTexts.splice(i, 1);
      }

      ctx.restore();
      animFrameRef.current = requestAnimationFrame(loop);
    };

    animFrameRef.current = requestAnimationFrame(loop);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [gameState, selectedPaddleId, selectedBallId, activeEnvId, lives, score, bet, currentStage]);

  // Apply Power-Up Effect
  const applyPowerUp = (type: string, engine: any) => {
    const cfg = POWERUPS[type];
    if (!cfg) return;

    setActiveEffects((prev) => ({ ...prev, [type]: 15 }));

    engine.floatingTexts.push({
      x: engine.paddle.x,
      y: engine.paddle.y - 30,
      text: `${cfg.icon} ${cfg.name.toUpperCase()}!`,
      color: cfg.color,
      alpha: 1,
      vy: -1.5,
    });

    if (type === 'multi_ball') {
      const baseBall = engine.balls[0] || { x: engine.paddle.x, y: 680, vx: 3, vy: -5 };
      engine.balls.push(
        { x: baseBall.x, y: baseBall.y, vx: -4, vy: -5, radius: 10, attached: false },
        { x: baseBall.x, y: baseBall.y, vx: 4, vy: -4.5, radius: 10, attached: false }
      );
    } else if (type === 'shield') {
      engine.shieldActive = true;
    } else if (type === 'long_paddle') {
      engine.paddle.width = 160;
    } else if (type === 'short_paddle') {
      engine.paddle.width = 80;
    } else if (type === 'fire_ball') {
      engine.balls.forEach((b: any) => (b.isFire = true));
    } else if (type === 'bomb') {
      engine.screenShake = 8;
      engine.bricks.forEach((b: any) => {
        if (b.hp > 0 && b.type !== 'titanium' && Math.random() < 0.6) {
          b.hp = 0;
          triggerBrickBreakFX(b, engine);
        }
      });
    }
  };

  // Trigger Brick Shatter FX
  const triggerBrickBreakFX = (b: any, engine: any) => {
    synth.playCoin();

    setScore((s) => {
      const newScore = s + b.value;
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('brick_high_score', newScore.toString());
      }
      return newScore;
    });

    for (let i = 0; i < 12; i++) {
      engine.particles.push({
        x: b.x + b.width / 2,
        y: b.y + b.height / 2,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8 - 1,
        radius: Math.random() * 4 + 2,
        color: b.color,
        life: 25,
        maxLife: 25,
      });
    }

    engine.floatingTexts.push({
      x: b.x + b.width / 2,
      y: b.y,
      text: `+${b.value}`,
      color: b.color,
      alpha: 1,
      vy: -1.2,
    });

    if (b.type === 'powerup' || Math.random() < 0.18) {
      const pKeys = Object.keys(POWERUPS);
      const randType = pKeys[Math.floor(Math.random() * pKeys.length)];
      engine.powerups.push({
        x: b.x + b.width / 2,
        y: b.y + b.height / 2,
        vy: 2.2,
        type: randType,
        config: POWERUPS[randType],
      });
    }
  };

  // Mouse / Touch Steering Handlers
  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mx = ((e.clientX - rect.left) / rect.width) * 600;
    engineRef.current.paddle.targetX = mx;
  };

  const handlePointerDown = () => {
    if (gameState === 'playing') {
      launchBalls();
      if (activeEffects.laser) {
        const pad = engineRef.current.paddle;
        engineRef.current.lasers.push(
          { x: pad.x - pad.width / 2 + 4, y: pad.y - 10, vy: -12 },
          { x: pad.x + pad.width / 2 - 4, y: pad.y - 10, vy: -12 }
        );
        synth.playClick();
      }
    }
  };

  const activeEnvObj = BACKGROUND_ENVS[activeEnvId] || BACKGROUND_ENVS.space;

  return (
    <div
      className="relative min-h-[660px] w-full rounded-3xl p-4 md:p-6 text-white overflow-hidden shadow-2xl transition-all duration-700 font-sans select-none"
      style={{ background: activeEnvObj.bgGradient }}
      id="brick_smash_root"
    >
      {/* Light Burst Flash overlay on purchase */}
      {purchaseFlash && (
        <div className="absolute inset-0 bg-white/30 z-50 pointer-events-none animate-ping" />
      )}

      {/* TOP HUD BAR */}
      <div className="relative z-20 flex flex-wrap justify-between items-center bg-black/70 border border-white/15 p-3 rounded-2xl backdrop-blur-xl shadow-xl gap-2">
        {/* Stage & Highscore */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowThemeModal(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-cyan-500 to-blue-600 px-3 py-1.5 rounded-xl border border-cyan-300/40 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
          >
            <Map className="h-4 w-4" />
            STAGE {currentStage}
          </button>

          <div className="flex items-center gap-1 bg-zinc-900/90 px-2.5 py-1 rounded-xl border border-white/10">
            <Trophy className="h-3.5 w-3.5 text-amber-400" />
            <span className="text-xs font-mono font-bold text-amber-300">{highScore.toLocaleString()}</span>
          </div>
        </div>

        {/* Score & Lives */}
        <div className="flex items-center gap-2">
          <div className="bg-zinc-900/90 border border-white/10 px-4 py-1 rounded-xl text-center min-w-[90px]">
            <span className="block text-[8px] font-black text-zinc-400 uppercase tracking-widest">Score</span>
            <span className="block text-base font-black text-cyan-300 font-mono">
              {score.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center gap-1 bg-red-950/60 border border-red-500/30 px-3 py-1.5 rounded-xl">
            <span className="text-xs font-black text-red-400">❤️ {lives}</span>
          </div>
        </div>

        {/* Navigation Buttons: Collection & Settings */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setShowShopModal(true)}
            className="p-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 transition flex items-center gap-1.5 text-xs font-bold"
            title="Skins Collection Shop"
          >
            <Palette className="h-4 w-4 text-amber-400" />
            <span>Collection</span>
          </button>

          <button
            onClick={() => setShowSettingsModal(true)}
            className="p-2 rounded-xl bg-zinc-800/90 border border-white/15 text-zinc-300 hover:text-white transition flex items-center gap-1 text-xs font-bold"
            title="Audio Settings"
          >
            <SettingsIcon className="h-4 w-4 text-cyan-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>
        </div>
      </div>

      {/* GAME CANVAS & OVERLAYS */}
      <div className="relative z-10 flex flex-col items-center justify-center my-4">
        <div className="relative rounded-2xl overflow-hidden border-2 border-white/15 shadow-2xl max-w-full">
          <canvas
            ref={canvasRef}
            onPointerMove={handlePointerMove}
            onPointerDown={handlePointerDown}
            className="block cursor-none touch-none max-w-full"
            style={{ width: '520px', height: '620px', background: 'transparent' }}
          />

          {/* MAIN MENU OVERLAY */}
          {gameState === 'menu' && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-xl mb-3 animate-bounce">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-3xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-amber-300 to-rose-400 mb-1">
                Brick Smash Classic
              </h2>
              <p className="text-xs text-zinc-400 mb-6 max-w-xs">
                Ultra 60 FPS Mobile Arcade Breaker with Power-Ups & Custom Collectibles!
              </p>

              {/* Mode Select Tabs */}
              <div className="flex flex-wrap justify-center gap-1.5 mb-6 max-w-sm">
                {(['classic', 'endless', 'time_attack', 'boss_battle'] as GameMode[]).map((m) => (
                  <button
                    key={m}
                    onClick={() => setActiveMode(m)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase transition ${
                      activeMode === m
                        ? 'bg-cyan-500 text-black font-black shadow-lg'
                        : 'bg-zinc-800/80 text-zinc-400 hover:text-white'
                    }`}
                  >
                    {m.replace('_', ' ')}
                  </button>
                ))}
              </div>

              {/* Bet Controls */}
              <div className="flex items-center gap-2 mb-6">
                <span className="text-xs font-bold text-zinc-400 uppercase">Bet Coins:</span>
                <input
                  type="number"
                  value={bet}
                  onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                  className="w-24 text-center rounded-xl bg-zinc-900 border border-white/20 py-1.5 text-sm font-mono font-bold text-amber-300 outline-none"
                />
              </div>

              <button
                onClick={handleStartGame}
                className="w-64 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-cyan-500 text-white font-black text-sm uppercase tracking-wider shadow-2xl hover:scale-105 transition transform active:scale-95"
              >
                🧱 Play Game Now
              </button>
            </div>
          )}

          {/* VICTORY OVERLAY */}
          {gameState === 'victory' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <Trophy className="h-16 w-16 text-amber-400 animate-bounce mb-2" />
              <h3 className="text-2xl font-black text-amber-300 uppercase tracking-widest mb-1">
                STAGE CLEARED!
              </h3>
              <p className="text-sm font-mono text-cyan-300 font-bold mb-4">
                Score: {score.toLocaleString()}
              </p>
              <button
                onClick={handleStartGame}
                className="w-56 py-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Next Stage 🚀
              </button>
            </div>
          )}

          {/* GAME OVER OVERLAY */}
          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center p-6 text-center animate-fade-in">
              <Skull className="h-14 w-14 text-rose-500 mb-2" />
              <h3 className="text-2xl font-black text-rose-400 uppercase tracking-widest mb-1">
                GAME OVER
              </h3>
              <p className="text-sm font-mono text-zinc-300 font-bold mb-4">
                Final Score: {score.toLocaleString()}
              </p>
              <button
                onClick={handleStartGame}
                className="w-56 py-3 rounded-xl bg-gradient-to-r from-rose-600 to-amber-500 text-white font-black text-xs uppercase tracking-wider shadow-lg hover:scale-105 transition"
              >
                Try Again 🔄
              </button>
            </div>
          )}
        </div>
      </div>

      {/* COLLECTION & SHOP MODAL - LUXURY AAA DESIGN */}
      {showShopModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="relative bg-gradient-to-b from-slate-950 via-zinc-950 to-black border-2 border-amber-500/30 w-full max-w-4xl rounded-3xl p-5 sm:p-7 text-white max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(245,158,11,0.15)] flex flex-col justify-between">
            {/* Ambient Background Star Particles */}
            <ShopBackgroundParticlesCanvas />

            <div className="relative z-10">
              {/* Header Bar */}
              <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-lg shadow-amber-500/20">
                    <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                      <Palette className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">
                      Royal Collection Vault
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Unlock & equip luxury paddles, 3D energy balls, and atmospheric themes
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  {/* Coin Balance Badge */}
                  <div className="bg-zinc-900/90 border border-amber-500/40 px-3.5 py-1.5 rounded-2xl flex items-center gap-2 shadow-lg">
                    <span className="text-amber-400 text-sm">🪙</span>
                    <span className="font-mono font-black text-amber-300 text-sm">{coins.toLocaleString()}</span>
                  </div>

                  <button
                    onClick={() => setShowShopModal(false)}
                    className="p-2 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white transition border border-white/10"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              {/* Shop Category Tabs */}
              <div className="flex gap-2 mb-6 bg-black/60 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md overflow-x-auto">
                <button
                  onClick={() => setShopCategory('paddles')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 min-w-[120px] ${
                    shopCategory === 'paddles'
                      ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🛡️ Paddles</span>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono">
                    {Object.keys(PADDLE_SKINS).length}
                  </span>
                </button>

                <button
                  onClick={() => setShopCategory('balls')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 min-w-[120px] ${
                    shopCategory === 'balls'
                      ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🔴 3D Balls</span>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono">
                    {Object.keys(BALL_SKINS).length}
                  </span>
                </button>

                <button
                  onClick={() => setShopCategory('presets')}
                  className={`flex-1 py-2.5 px-4 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center justify-center gap-2 min-w-[120px] ${
                    shopCategory === 'presets'
                      ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-purple-500/30'
                      : 'text-zinc-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span>🎨 Presets</span>
                  <span className="text-[10px] bg-black/30 px-2 py-0.5 rounded-full font-mono">
                    {Object.keys(GAME_PRESET_THEMES).length}
                  </span>
                </button>
              </div>

              {/* PADDLES TAB */}
              {shopCategory === 'paddles' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(PADDLE_SKINS).map((skin) => {
                    const isUnlocked = unlockedPaddles.includes(skin.id);
                    const isSelected = selectedPaddleId === skin.id;

                    return (
                      <div
                        key={skin.id}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                          isSelected
                            ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/20 to-black/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/50'
                            : isUnlocked
                            ? 'border-white/15 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-800/80 hover:-translate-y-0.5'
                            : 'border-zinc-800/80 bg-zinc-950/80 opacity-85 hover:opacity-100 hover:border-zinc-700'
                        }`}
                      >
                        {/* Tier Badge */}
                        <span
                          className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-black shadow-md"
                          style={{ background: skin.tierColor }}
                        >
                          {skin.tier}
                        </span>

                        {/* Animated Canvas Artwork Preview */}
                        <div className="my-3 py-2 flex items-center justify-center w-full">
                          <PaddlePreviewCanvas skin={skin} />
                        </div>

                        <span className="text-xs font-black text-center text-zinc-100 mb-2">{skin.name}</span>

                        {isSelected ? (
                          <div className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 font-black text-[11px] flex items-center justify-center gap-1.5 uppercase tracking-wider shadow">
                            <CheckCircle2 className="h-4 w-4 text-amber-400 animate-pulse" /> EQUIPPED
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              synth.playClick();
                              setSelectedPaddleId(skin.id);
                              localStorage.setItem('brick_selected_paddle', skin.id);
                            }}
                            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] uppercase tracking-wider transition border border-white/10 hover:border-white/30"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAttemptPaddleBuy(skin)}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20 transform active:scale-95"
                          >
                            <Coins className="h-3.5 w-3.5" /> {skin.price.toLocaleString()}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* BALLS TAB */}
              {shopCategory === 'balls' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(BALL_SKINS).map((skin) => {
                    const isUnlocked = unlockedBalls.includes(skin.id);
                    const isSelected = selectedBallId === skin.id;

                    return (
                      <div
                        key={skin.id}
                        className={`p-4 rounded-2xl border flex flex-col items-center justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                          isSelected
                            ? 'border-cyan-400/80 bg-gradient-to-b from-cyan-500/20 to-black/60 shadow-[0_0_25px_rgba(6,182,212,0.25)] ring-2 ring-cyan-400/50'
                            : isUnlocked
                            ? 'border-white/15 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-800/80 hover:-translate-y-0.5'
                            : 'border-zinc-800/80 bg-zinc-950/80 opacity-85 hover:opacity-100 hover:border-zinc-700'
                        }`}
                      >
                        {/* Tier Badge */}
                        <span
                          className="absolute top-3 left-3 text-[9px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-md text-black shadow-md"
                          style={{ background: skin.tierColor }}
                        >
                          {skin.tier}
                        </span>

                        {/* Animated Canvas Artwork Preview */}
                        <div className="my-2 py-2 flex items-center justify-center w-full">
                          <BallPreviewCanvas skin={skin} />
                        </div>

                        <span className="text-xs font-black text-center text-zinc-100 mb-2">{skin.name}</span>

                        {isSelected ? (
                          <div className="w-full py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/60 text-cyan-300 font-black text-[11px] flex items-center justify-center gap-1.5 uppercase tracking-wider shadow">
                            <CheckCircle2 className="h-4 w-4 text-cyan-400 animate-pulse" /> EQUIPPED
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              synth.playClick();
                              setSelectedBallId(skin.id);
                              localStorage.setItem('brick_selected_ball', skin.id);
                            }}
                            className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] uppercase tracking-wider transition border border-white/10 hover:border-white/30"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => handleAttemptBallBuy(skin)}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white font-black text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-cyan-500/20 transform active:scale-95"
                          >
                            <Coins className="h-3.5 w-3.5 text-amber-300" /> {skin.price.toLocaleString()}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}

              {/* PRESETS TAB */}
              {shopCategory === 'presets' && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {Object.values(GAME_PRESET_THEMES).map((theme) => {
                    const isPresetActive =
                      selectedPaddleId === theme.paddleId &&
                      selectedBallId === theme.ballId &&
                      activeEnvId === theme.envId;

                    return (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative backdrop-blur-md ${
                          isPresetActive
                            ? 'border-purple-400/80 bg-gradient-to-b from-purple-500/20 to-black/60 shadow-[0_0_25px_rgba(168,85,247,0.25)] ring-2 ring-purple-400/50'
                            : 'border-white/15 bg-zinc-900/60 hover:border-amber-400/60 hover:bg-zinc-800/80 hover:-translate-y-0.5'
                        }`}
                      >
                        <div>
                          <div className="flex items-center gap-3 mb-3">
                            <span className="text-3xl p-2 rounded-xl bg-black/40 border border-white/10">{theme.icon}</span>
                            <div>
                              <h4 className="text-sm font-black text-white">{theme.name}</h4>
                              <span className="text-[10px] text-zinc-400 uppercase tracking-widest font-mono">Full Theme Set</span>
                            </div>
                          </div>

                          {/* Matching Specs */}
                          <div className="space-y-1.5 text-[11px] text-zinc-300 bg-black/40 p-2.5 rounded-xl border border-white/5 mb-4">
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Paddle:</span>
                              <span className="font-bold text-amber-300">{PADDLE_SKINS[theme.paddleId]?.name || theme.paddleId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Ball:</span>
                              <span className="font-bold text-cyan-300">{BALL_SKINS[theme.ballId]?.name || theme.ballId}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-zinc-500">Environment:</span>
                              <span className="font-bold text-purple-300">{BACKGROUND_ENVS[theme.envId]?.name || theme.envId}</span>
                            </div>
                          </div>
                        </div>

                        {isPresetActive ? (
                          <div className="w-full py-2 rounded-xl bg-purple-500/20 border border-purple-400/60 text-purple-300 font-black text-[11px] flex items-center justify-center gap-1.5 uppercase tracking-wider shadow">
                            <CheckCircle2 className="h-4 w-4 text-purple-400 animate-pulse" /> ACTIVE PRESET
                          </div>
                        ) : (
                          <button
                            onClick={() => handleSelectPresetTheme(theme.id)}
                            className="w-full py-2 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black text-[11px] uppercase tracking-wider transition shadow-lg shadow-purple-500/20"
                          >
                            Apply Preset Theme 🚀
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE SUCCESS CELEBRATION MODAL */}
      {purchaseSuccessItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="relative bg-gradient-to-b from-zinc-900 via-slate-900 to-black border-2 border-amber-500/60 w-full max-w-md rounded-3xl p-6 text-white text-center shadow-[0_0_80px_rgba(245,158,11,0.3)] overflow-hidden">
            {/* Animated Light Burst Effect */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(251,191,36,0.18)_0%,_transparent_70%)] animate-pulse pointer-events-none" />

            <div className="w-16 h-16 rounded-3xl bg-gradient-to-tr from-amber-500 via-yellow-400 to-amber-600 p-0.5 shadow-[0_0_30px_rgba(251,191,36,0.6)] mx-auto mb-3 animate-bounce">
              <div className="w-full h-full bg-zinc-950 rounded-[22px] flex items-center justify-center text-amber-400">
                <Sparkles className="h-8 w-8" />
              </div>
            </div>

            <h3 className="text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400 mb-1">
              🎉 Unlock Successful!
            </h3>
            <p className="text-xs text-zinc-300 mb-4">
              You have unlocked <span className="font-bold text-amber-300">{purchaseSuccessItem.name}</span>!
            </p>

            {/* Showcase Preview */}
            <div className="bg-black/80 border border-amber-500/30 rounded-2xl p-5 mb-6 shadow-inner flex flex-col items-center relative">
              <div className="absolute top-2.5 right-2.5 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md text-black bg-amber-400 shadow">
                {('tier' in purchaseSuccessItem.item) ? purchaseSuccessItem.item.tier : 'Preset'}
              </div>

              {purchaseSuccessItem.category === 'paddle' ? (
                <PaddlePreviewCanvas skin={purchaseSuccessItem.item as PaddleSkin} />
              ) : purchaseSuccessItem.category === 'ball' ? (
                <BallPreviewCanvas skin={purchaseSuccessItem.item as BallSkin} />
              ) : (
                <div className="text-4xl my-2">{(purchaseSuccessItem.item as GamePresetTheme).icon}</div>
              )}

              <span className="text-sm font-black text-amber-200 mt-3">{purchaseSuccessItem.name}</span>
            </div>

            <div className="flex gap-3 relative z-10">
              <button
                onClick={() => setPurchaseSuccessItem(null)}
                className="flex-1 py-3.5 rounded-2xl bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition border border-white/10"
              >
                Keep Browsing
              </button>
              <button
                onClick={handleEquipSuccessItem}
                className="flex-1 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition shadow-[0_0_25px_rgba(251,191,36,0.5)] transform hover:scale-105"
              >
                Equip Now ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE CONFIRMATION MODAL */}
      {pendingPurchase && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-amber-500/40 w-full max-w-md rounded-3xl p-6 text-white text-center shadow-2xl relative overflow-hidden">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center mx-auto mb-3">
              <ShoppingBagIcon />
            </div>

            <h3 className="text-xl font-black uppercase tracking-wider mb-1">Confirm Purchase</h3>
            <p className="text-xs text-zinc-400 mb-4">Are you sure you want to purchase this item?</p>

            {/* Item Preview Box */}
            <div className="bg-zinc-950/80 border border-white/10 rounded-2xl p-4 mb-4 flex flex-col items-center">
              {pendingPurchase.category === 'paddle' ? (
                <PaddlePreviewCanvas skin={pendingPurchase.item as PaddleSkin} />
              ) : (
                <BallPreviewCanvas skin={pendingPurchase.item as BallSkin} />
              )}
              <span className="text-sm font-black text-amber-300 mt-2">{pendingPurchase.item.name}</span>
              <span
                className="text-[9px] font-black uppercase px-2 py-0.5 rounded-md text-black mt-1"
                style={{ background: pendingPurchase.item.tierColor }}
              >
                {pendingPurchase.item.tier}
              </span>
            </div>

            {/* Coin Summary */}
            <div className="bg-zinc-950/60 border border-white/5 rounded-xl p-3 space-y-1.5 text-xs font-mono mb-6">
              <div className="flex justify-between text-zinc-400">
                <span>Item Price:</span>
                <span className="text-amber-400 font-bold">🪙 {pendingPurchase.item.price.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-zinc-400">
                <span>Current Balance:</span>
                <span className="text-white font-bold">🪙 {coins.toLocaleString()}</span>
              </div>
              <div className="border-t border-white/10 pt-1.5 flex justify-between font-bold">
                <span className="text-zinc-300">Remaining Balance:</span>
                <span className="text-cyan-300 font-black">
                  🪙 {(coins - pendingPurchase.item.price).toLocaleString()}
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={() => setPendingPurchase(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs uppercase tracking-wider transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs uppercase tracking-wider transition shadow-lg"
              >
                Confirm Purchase
              </button>
            </div>
          </div>
        </div>
      )}

      {/* INSUFFICIENT FUNDS WARNING MODAL */}
      {insufficientWarning && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-zinc-900 border border-rose-500/40 w-full max-w-sm rounded-3xl p-6 text-white text-center shadow-2xl">
            <AlertTriangle className="h-12 w-12 text-rose-500 mx-auto mb-3 animate-bounce" />
            <h3 className="text-lg font-black text-rose-400 uppercase tracking-wider mb-1">Insufficient Coins</h3>
            <p className="text-xs text-zinc-300 mb-4">
              You need <span className="font-bold text-amber-300">🪙 {insufficientWarning.needed.toLocaleString()}</span> more coins to buy <span className="font-bold text-white">{insufficientWarning.skinName}</span>.
            </p>

            <button
              onClick={() => setInsufficientWarning(null)}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase tracking-wider transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* SETTINGS MENU MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 w-full max-w-md rounded-3xl p-6 text-white shadow-2xl">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <SettingsIcon className="h-6 w-6 text-cyan-400" />
                <h3 className="text-lg font-black uppercase tracking-wider">Audio & Game Settings</h3>
              </div>
              <button
                onClick={() => setShowSettingsModal(false)}
                className="p-1.5 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Sliders & Toggles */}
            <div className="space-y-5 mb-6">
              {/* Master Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Master Volume</span>
                  <span className="text-cyan-400 font-mono">{masterVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={masterVolume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMasterVolumeState(val);
                    synth.setMasterVolume(val / 100);
                  }}
                  className="w-full accent-cyan-400 bg-zinc-800 rounded-lg h-2"
                />
              </div>

              {/* Music Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Background Music (BGM) Volume</span>
                  <span className="text-amber-400 font-mono">{musicVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={musicVolume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setMusicVolumeState(val);
                    synth.setMusicVolume(val / 100);
                  }}
                  className="w-full accent-amber-400 bg-zinc-800 rounded-lg h-2"
                />
              </div>

              {/* SFX Volume */}
              <div>
                <div className="flex justify-between text-xs font-bold mb-1.5">
                  <span className="text-zinc-300">Sound Effects (SFX) Volume</span>
                  <span className="text-emerald-400 font-mono">{sfxVolume}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={sfxVolume}
                  onChange={(e) => {
                    const val = parseInt(e.target.value);
                    setSfxVolumeState(val);
                    synth.setSfxVolume(val / 100);
                  }}
                  className="w-full accent-emerald-400 bg-zinc-800 rounded-lg h-2"
                />
              </div>

              {/* Toggles */}
              <div className="pt-2 border-t border-white/10 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-300">Background Music Enabled</span>
                  <input
                    type="checkbox"
                    checked={bgmEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setBgmEnabledState(enabled);
                      synth.setBgmEnabled(enabled);
                    }}
                    className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center">
                  <span className="text-xs font-bold text-zinc-300">Sound Effects Enabled</span>
                  <input
                    type="checkbox"
                    checked={sfxEnabled}
                    onChange={(e) => {
                      const enabled = e.target.checked;
                      setSfxEnabledState(enabled);
                      synth.setSfxEnabled(enabled);
                    }}
                    className="w-5 h-5 accent-emerald-500 rounded cursor-pointer"
                  />
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-black text-xs uppercase tracking-wider transition"
            >
              Save & Done
            </button>
          </div>
        </div>
      )}

      {/* THEMES MODAL */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-white/20 w-full max-w-xl rounded-3xl p-6 text-white max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-2">
                <Grid className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-black uppercase tracking-wider">Game Presets & Backgrounds</h3>
              </div>
              <button
                onClick={() => setShowThemeModal(false)}
                className="p-1 rounded-xl bg-zinc-800 text-zinc-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
              {Object.values(GAME_PRESET_THEMES).map((theme) => (
                <button
                  key={theme.id}
                  onClick={() => handleSelectPresetTheme(theme.id)}
                  className="p-3 rounded-2xl bg-zinc-800/80 border border-white/10 hover:border-amber-400 transition flex flex-col items-center"
                >
                  <span className="text-2xl mb-1">{theme.icon}</span>
                  <span className="text-xs font-bold">{theme.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ShoppingBagIcon() {
  return (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  );
}
