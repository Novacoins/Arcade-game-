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
  Target,
  Palette,
  Coins,
  CheckCircle2,
  X,
  Lock,
  Sliders,
  Volume2,
  VolumeX,
  Shield,
  Radio,
  Bomb,
  Rocket,
  Award,
  ChevronRight,
  Info,
  Play,
  Gamepad2,
  Music,
  Volume1
} from 'lucide-react';
import { GameTemplate, GAME_TEMPLATES } from './bubble_pop/gameTemplatesData';
import { GameCollectionModal } from './bubble_pop/GameCollectionModal';
import { GameInfoAndTags } from './bubble_pop/GameInfoAndTags';

export interface PuzzleGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// TYPES & DATA DEFINITIONS
// ==========================================

export type LauncherTier = 'Classic' | 'Rare' | 'Epic' | 'Legendary' | 'Mythic';

export interface LauncherSkin {
  id: string;
  name: string;
  tier: LauncherTier;
  tierColor: string;
  price: number;
  barrelColor: string;
  glowColor: string;
  metallicColor: string;
  accentColor: string;
  description: string;
  typeStyle: 'classic' | 'crystal' | 'gold' | 'ice' | 'inferno' | 'cyber' | 'cosmic' | 'rainbow' | 'temple' | 'dragon' | 'royal' | 'galaxy' | 'cobra';
}

export interface BallSkin {
  id: string;
  name: string;
  tier: LauncherTier;
  tierColor: string;
  price: number;
  primaryColor: string;
  secondaryColor: string;
  glowColor: string;
  trailType: 'none' | 'crystal' | 'fire' | 'ice' | 'electric' | 'galaxy' | 'rainbow' | 'gold' | 'plasma' | 'dragon' | 'royal' | 'mythic';
  description: string;
}

export interface PowerUpItem {
  id: string;
  name: string;
  price: number;
  description: string;
  type: 'fire_blast' | 'ice_storm' | 'thunder_strike' | 'rainbow_beam' | 'dragon_fury' | 'plasma_wave' | 'galaxy_bomb' | 'crystal_laser' | 'royal_explosion' | 'meteor_shower' | 'black_hole' | 'divine_nova';
  color: string;
  glow: string;
  icon: string;
}

// ------------------------------------------
// 12 SHOOTER LAUNCHER COLLECTIONS
// ------------------------------------------
export const LAUNCHER_SKINS: Record<string, LauncherSkin> = {
  classic_cannon: {
    id: 'classic_cannon',
    name: 'Ancient Stone Cannon',
    tier: 'Classic',
    tierColor: '#9ca3af',
    price: 0,
    barrelColor: '#475569',
    glowColor: 'rgba(148, 163, 184, 0.5)',
    metallicColor: '#64748b',
    accentColor: '#fbbf24',
    description: 'Ancient carved stone cannon with bronze rivets & rune engravings.',
    typeStyle: 'classic',
  },
  dragon_launcher: {
    id: 'dragon_launcher',
    name: 'Dragon Head Launcher',
    tier: 'Mythic',
    tierColor: '#ef4444',
    price: 50000,
    barrelColor: '#b91c1c',
    glowColor: 'rgba(239, 68, 68, 0.95)',
    metallicColor: '#f87171',
    accentColor: '#fef08a',
    description: 'Living dragon head barrel spitting pressurized flame charges & smoke.',
    typeStyle: 'dragon',
  },
  crocodile_launcher: {
    id: 'crocodile_launcher',
    name: 'Crocodile Mouth Launcher',
    tier: 'Epic',
    tierColor: '#10b981',
    price: 6000,
    barrelColor: '#047857',
    glowColor: 'rgba(16, 185, 129, 0.9)',
    metallicColor: '#34d399',
    accentColor: '#facc15',
    description: 'Scaly swamp crocodile jaws with sharp teeth serrations.',
    typeStyle: 'inferno',
  },
  cobra_launcher: {
    id: 'cobra_launcher',
    name: 'Cobra Head Launcher',
    tier: 'Epic',
    tierColor: '#a855f7',
    price: 12000,
    barrelColor: '#6b21a8',
    glowColor: 'rgba(168, 85, 247, 0.9)',
    metallicColor: '#c084fc',
    accentColor: '#22c55e',
    description: 'Hooded cobra flare emitting venomous plasma beam energy.',
    typeStyle: 'cobra',
  },
  wolf_launcher: {
    id: 'wolf_launcher',
    name: 'Frost Wolf Launcher',
    tier: 'Rare',
    tierColor: '#38bdf8',
    price: 3000,
    barrelColor: '#0284c7',
    glowColor: 'rgba(56, 189, 248, 0.9)',
    metallicColor: '#a5f3fc',
    accentColor: '#38bdf8',
    description: 'Howling frost wolf snout with icy glowing eyes & blizzard mist.',
    typeStyle: 'ice',
  },
  eagle_launcher: {
    id: 'eagle_launcher',
    name: 'Eagle Beak Launcher',
    tier: 'Rare',
    tierColor: '#fbbf24',
    price: 2500,
    barrelColor: '#d97706',
    glowColor: 'rgba(251, 191, 36, 0.85)',
    metallicColor: '#fef08a',
    accentColor: '#ffffff',
    description: 'Golden majestic eagle beak launcher with feather sparkle effects.',
    typeStyle: 'rainbow',
  },
  shark_launcher: {
    id: 'shark_launcher',
    name: 'Shark Mouth Launcher',
    tier: 'Rare',
    tierColor: '#06b6d4',
    price: 4000,
    barrelColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.85)',
    metallicColor: '#67e8f9',
    accentColor: '#ffffff',
    description: 'Deep sea oceanic shark mouth with razor sharp teeth ring.',
    typeStyle: 'cyber',
  },
  lion_launcher: {
    id: 'lion_launcher',
    name: 'Golden Lion Launcher',
    tier: 'Legendary',
    tierColor: '#eab308',
    price: 25000,
    barrelColor: '#ca8a04',
    glowColor: 'rgba(234, 179, 8, 0.95)',
    metallicColor: '#fde047',
    accentColor: '#ffffff',
    description: 'Royal golden lion face with glowing solar mane spikes.',
    typeStyle: 'temple',
  },
  phoenix_launcher: {
    id: 'phoenix_launcher',
    name: 'Phoenix Beak Launcher',
    tier: 'Legendary',
    tierColor: '#f97316',
    price: 35000,
    barrelColor: '#c2410c',
    glowColor: 'rgba(249, 115, 22, 0.95)',
    metallicColor: '#fb923c',
    accentColor: '#fef08a',
    description: 'Solar firebird beak launcher emitting phoenix flame feathers.',
    typeStyle: 'cosmic',
  },
  crystal_dragon: {
    id: 'crystal_dragon',
    name: 'Crystal Dragon Launcher',
    tier: 'Epic',
    tierColor: '#a78bfa',
    price: 15000,
    barrelColor: '#7c3aed',
    glowColor: 'rgba(167, 139, 250, 0.9)',
    metallicColor: '#ddd6fe',
    accentColor: '#38bdf8',
    description: 'Prismatic crystal dragon head with floating glass gem horns.',
    typeStyle: 'crystal',
  },
  mechanical_cannon: {
    id: 'mechanical_cannon',
    name: 'Mechanical Railgun',
    tier: 'Legendary',
    tierColor: '#0284c7',
    price: 40000,
    barrelColor: '#0369a1',
    glowColor: 'rgba(2, 132, 199, 0.95)',
    metallicColor: '#38bdf8',
    accentColor: '#e0f2fe',
    description: 'High-tech cyberpunk cannon with spinning magnetic accelerator ring.',
    typeStyle: 'gold',
  },
  royal_cannon: {
    id: 'royal_cannon',
    name: 'Royal Gold Cannon',
    tier: 'Mythic',
    tierColor: '#eab308',
    price: 75000,
    barrelColor: '#a16207',
    glowColor: 'rgba(234, 179, 8, 1)',
    metallicColor: '#fde047',
    accentColor: '#ef4444',
    description: 'Crowned regal 24K solid gold cannon with diamond trim & ruby jewels.',
    typeStyle: 'royal',
  },
  tiger_launcher: {
    id: 'tiger_launcher',
    name: 'Tiger Mouth Launcher',
    tier: 'Epic',
    tierColor: '#f97316',
    price: 18000,
    barrelColor: '#ea580c',
    glowColor: 'rgba(249, 115, 22, 0.9)',
    metallicColor: '#fdba74',
    accentColor: '#18181b',
    description: 'Fierce striped tiger jaw launcher with gleaming fangs and roaring amber eyes.',
    typeStyle: 'inferno',
  },
  bull_launcher: {
    id: 'bull_launcher',
    name: 'Bull Ox Head Launcher',
    tier: 'Epic',
    tierColor: '#ef4444',
    price: 22000,
    barrelColor: '#991b1b',
    glowColor: 'rgba(239, 68, 68, 0.9)',
    metallicColor: '#fca5a5',
    accentColor: '#eab308',
    description: 'Armored ox skull with curved golden horns blasting crimson sonic shockwaves.',
    typeStyle: 'temple',
  },
  rhino_launcher: {
    id: 'rhino_launcher',
    name: 'Rhino Horn Launcher',
    tier: 'Rare',
    tierColor: '#64748b',
    price: 8000,
    barrelColor: '#334155',
    glowColor: 'rgba(100, 116, 139, 0.9)',
    metallicColor: '#94a3b8',
    accentColor: '#cbd5e1',
    description: 'Heavy obsidian rhino snout with massive polished crystal horn bayonet.',
    typeStyle: 'classic',
  },
  scifi_plasma: {
    id: 'scifi_plasma',
    name: 'Sci-Fi Plasma Launcher',
    tier: 'Mythic',
    tierColor: '#06b6d4',
    price: 60000,
    barrelColor: '#0891b2',
    glowColor: 'rgba(6, 182, 212, 0.95)',
    metallicColor: '#67e8f9',
    accentColor: '#a855f7',
    description: 'Quantum plasma accelerator launching dark matter pulses with ion particle trails.',
    typeStyle: 'galaxy',
  },
};

// ------------------------------------------
// 12 BALL COLLECTIONS
// ------------------------------------------
export const BALL_SKINS: Record<string, BallSkin> = {
  classic_ball: {
    id: 'classic_ball',
    name: 'Classic Ball',
    tier: 'Classic',
    tierColor: '#9ca3af',
    price: 0,
    primaryColor: '#ef4444',
    secondaryColor: '#991b1b',
    glowColor: 'rgba(239, 68, 68, 0.5)',
    trailType: 'none',
    description: 'Standard polished glossy arcade spheres.',
  },
  crystal_ball: {
    id: 'crystal_ball',
    name: 'Crystal Ball',
    tier: 'Rare',
    tierColor: '#38bdf8',
    price: 400,
    primaryColor: '#38bdf8',
    secondaryColor: '#0369a1',
    glowColor: 'rgba(56, 189, 248, 0.8)',
    trailType: 'crystal',
    description: 'Translucent crystal orbs leaving glinting frost trails.',
  },
  fire_ball: {
    id: 'fire_ball',
    name: 'Fire Ball',
    tier: 'Rare',
    tierColor: '#f97316',
    price: 1200,
    primaryColor: '#f97316',
    secondaryColor: '#9a3412',
    glowColor: 'rgba(249, 115, 22, 0.85)',
    trailType: 'fire',
    description: 'Sizzling volcanic lava spheres leaving ember sparks.',
  },
  ice_ball: {
    id: 'ice_ball',
    name: 'Ice Ball',
    tier: 'Rare',
    tierColor: '#67e8f9',
    price: 2500,
    primaryColor: '#22d3ee',
    secondaryColor: '#0e7490',
    glowColor: 'rgba(34, 211, 238, 0.85)',
    trailType: 'ice',
    description: 'Sub-zero frozen marbles with glittering ice dust trails.',
  },
  electric_ball: {
    id: 'electric_ball',
    name: 'Electric Ball',
    tier: 'Epic',
    tierColor: '#eab308',
    price: 5000,
    primaryColor: '#facc15',
    secondaryColor: '#a16207',
    glowColor: 'rgba(250, 204, 21, 0.9)',
    trailType: 'electric',
    description: 'High-voltage lightning orbs pulsing with electric arcs.',
  },
  galaxy_ball: {
    id: 'galaxy_ball',
    name: 'Galaxy Ball',
    tier: 'Epic',
    tierColor: '#a855f7',
    price: 8000,
    primaryColor: '#c084fc',
    secondaryColor: '#581c87',
    glowColor: 'rgba(192, 132, 252, 0.9)',
    trailType: 'galaxy',
    description: 'Cosmic starfield spheres streaming violet stardust.',
  },
  rainbow_ball: {
    id: 'rainbow_ball',
    name: 'Rainbow Ball',
    tier: 'Epic',
    tierColor: '#ec4899',
    price: 15000,
    primaryColor: '#f472b6',
    secondaryColor: '#be185d',
    glowColor: 'rgba(244, 114, 182, 0.9)',
    trailType: 'rainbow',
    description: 'Multicolor rainbow spectrum shift leaving glowing ribbon trails.',
  },
  gold_ball: {
    id: 'gold_ball',
    name: 'Gold Ball',
    tier: 'Epic',
    tierColor: '#fbbf24',
    price: 22000,
    primaryColor: '#fbbf24',
    secondaryColor: '#b45309',
    glowColor: 'rgba(251, 191, 36, 0.95)',
    trailType: 'gold',
    description: 'Solid 24K gold mirror spheres dropping golden coin dust.',
  },
  plasma_ball: {
    id: 'plasma_ball',
    name: 'Plasma Ball',
    tier: 'Legendary',
    tierColor: '#06b6d4',
    price: 30000,
    primaryColor: '#06b6d4',
    secondaryColor: '#164e63',
    glowColor: 'rgba(6, 182, 212, 1)',
    trailType: 'plasma',
    description: 'Supercharged ionized plasma cores surrounded by energy rings.',
  },
  dragon_ball: {
    id: 'dragon_ball',
    name: 'Dragon Ball',
    tier: 'Legendary',
    tierColor: '#ef4444',
    price: 45000,
    primaryColor: '#ef4444',
    secondaryColor: '#7f1d1d',
    glowColor: 'rgba(239, 68, 68, 1)',
    trailType: 'dragon',
    description: 'Mythical dragon eye orb blazing with wing-shaped flame trails.',
  },
  royal_ball: {
    id: 'royal_ball',
    name: 'Royal Ball',
    tier: 'Legendary',
    tierColor: '#eab308',
    price: 65000,
    primaryColor: '#fde047',
    secondaryColor: '#854d0e',
    glowColor: 'rgba(253, 224, 71, 1)',
    trailType: 'royal',
    description: 'Crowned diamond-encrusted royal marbles with gold star bursts.',
  },
  mythic_orb: {
    id: 'mythic_orb',
    name: 'Mythic Orb',
    tier: 'Mythic',
    tierColor: '#8b5cf6',
    price: 90000,
    primaryColor: '#a78bfa',
    secondaryColor: '#4c1d95',
    glowColor: 'rgba(167, 139, 250, 1)',
    trailType: 'mythic',
    description: 'Godlike cosmic artifact featuring a swirling miniature black hole center.',
  },
};

// ------------------------------------------
// 12 SPECIAL POWER-UP COLLECTIONS
// ------------------------------------------
export const POWERUP_SKINS: Record<string, PowerUpItem> = {
  fire_blast: {
    id: 'fire_blast',
    name: 'Fire Blast',
    price: 500,
    description: 'Detonates a 3x3 fiery explosion destroying surrounding bubbles.',
    type: 'fire_blast',
    color: '#ef4444',
    glow: 'rgba(239, 68, 68, 0.9)',
    icon: '💥',
  },
  ice_storm: {
    id: 'ice_storm',
    name: 'Ice Storm',
    price: 1000,
    description: 'Freezes the board and instantly clears the top bubble row.',
    type: 'ice_storm',
    color: '#06b6d4',
    glow: 'rgba(6, 182, 212, 0.9)',
    icon: '❄️',
  },
  thunder_strike: {
    id: 'thunder_strike',
    name: 'Thunder Strike',
    price: 2000,
    description: 'Fires a piercing vertical lightning bolt clearing an entire column.',
    type: 'thunder_strike',
    color: '#eab308',
    glow: 'rgba(234, 179, 8, 0.9)',
    icon: '⚡',
  },
  rainbow_beam: {
    id: 'rainbow_beam',
    name: 'Rainbow Beam',
    price: 3500,
    description: 'Wildcard sphere that instantly pops ANY adjacent color cluster.',
    type: 'rainbow_beam',
    color: '#ec4899',
    glow: 'rgba(236, 72, 153, 0.9)',
    icon: '🌈',
  },
  dragon_fury: {
    id: 'dragon_fury',
    name: 'Dragon Fury',
    price: 5500,
    description: 'Unleashes 3 homing flame dragons destroying target bubble clusters.',
    type: 'dragon_fury',
    color: '#dc2626',
    glow: 'rgba(220, 38, 38, 0.9)',
    icon: '🐉',
  },
  plasma_wave: {
    id: 'plasma_wave',
    name: 'Plasma Wave',
    price: 8000,
    description: 'Horizontal energy shockwave obliterating 2 full bubble rows.',
    type: 'plasma_wave',
    color: '#3b82f6',
    glow: 'rgba(59, 130, 246, 0.9)',
    icon: '🌊',
  },
  galaxy_bomb: {
    id: 'galaxy_bomb',
    name: 'Galaxy Bomb',
    price: 12000,
    description: 'Supernova explosion destroying a massive 4x4 bubble area.',
    type: 'galaxy_bomb',
    color: '#a855f7',
    glow: 'rgba(168, 85, 247, 0.9)',
    icon: '🌌',
  },
  crystal_laser: {
    id: 'crystal_laser',
    name: 'Crystal Laser',
    price: 18000,
    description: 'Piercing laser beam destroying all bubbles along the aiming ray.',
    type: 'crystal_laser',
    color: '#10b981',
    glow: 'rgba(16, 185, 129, 0.9)',
    icon: '💎',
  },
  royal_explosion: {
    id: 'royal_explosion',
    name: 'Royal Explosion',
    price: 25000,
    description: 'Obliterates bottom 2 rows & showers +500 bonus score coins!',
    type: 'royal_explosion',
    color: '#f59e0b',
    glow: 'rgba(245, 158, 11, 0.9)',
    icon: '👑',
  },
  meteor_shower: {
    id: 'meteor_shower',
    name: 'Meteor Shower',
    price: 35000,
    description: 'Rains 8 fiery meteors from above destroying random bubbles.',
    type: 'meteor_shower',
    color: '#ea580c',
    glow: 'rgba(234, 88, 12, 0.9)',
    icon: '☄️',
  },
  black_hole: {
    id: 'black_hole',
    name: 'Black Hole',
    price: 50000,
    description: 'Gravitational vortex sucking in 10 surrounding grid bubbles.',
    type: 'black_hole',
    color: '#7c3aed',
    glow: 'rgba(124, 58, 237, 0.9)',
    icon: '🕳️',
  },
  divine_nova: {
    id: 'divine_nova',
    name: 'Divine Nova',
    price: 75000,
    description: 'Obliterates ALL bubbles of the target color across the entire board!',
    type: 'divine_nova',
    color: '#facc15',
    glow: 'rgba(250, 204, 21, 1)',
    icon: '✨',
  },
};

// ==========================================
// PREVIEW CANVASES
// ==========================================

function ShopBackgroundParticlesCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.parentElement?.clientWidth || 800;
    canvas.height = canvas.parentElement?.clientHeight || 600;

    const particles = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 2.2 + 0.8,
      alpha: Math.random() * 0.7 + 0.2,
      pulse: Math.random() * 0.03 + 0.01,
      color: Math.random() > 0.5 ? '#f59e0b' : Math.random() > 0.5 ? '#06b6d4' : '#a855f7',
    }));

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha += p.pulse;
        if (p.alpha > 0.9 || p.alpha < 0.2) p.pulse = -p.pulse;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, Math.min(1, p.alpha));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1.0;
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-0 opacity-40" />;
}

function draw3DLauncherHelper(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  angle: number,
  skin: LauncherSkin,
  elapsed: number = 0
) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(angle + Math.PI / 2);

  const style = skin.typeStyle || 'classic';
  ctx.shadowBlur = 14 + Math.sin(elapsed * 0.005) * 5;
  ctx.shadowColor = skin.glowColor || '#fbbf24';

  if (style === 'dragon') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-14, -22);
    ctx.lineTo(-20, -34);
    ctx.lineTo(-10, -30);
    ctx.lineTo(0, -46);
    ctx.lineTo(10, -30);
    ctx.lineTo(20, -34);
    ctx.lineTo(14, -22);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = skin.metallicColor;
    ctx.beginPath();
    ctx.ellipse(0, -22, 9, 16, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin.accentColor || '#facc15';
    ctx.beginPath();
    ctx.arc(-7, -26, 3, 0, Math.PI * 2);
    ctx.arc(7, -26, 3, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'cobra') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-6, 10);
    ctx.quadraticCurveTo(-26, -15, -12, -36);
    ctx.lineTo(0, -44);
    ctx.lineTo(12, -36);
    ctx.quadraticCurveTo(26, -15, 6, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#22c55e';
    ctx.beginPath();
    ctx.arc(-6, -28, 2.8, 0, Math.PI * 2);
    ctx.arc(6, -28, 2.8, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'ice') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.lineTo(-16, -18);
    ctx.lineTo(-8, -22);
    ctx.lineTo(0, -44);
    ctx.lineTo(8, -22);
    ctx.lineTo(16, -18);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.beginPath();
    ctx.arc(-5, -22, 2.5, 0, Math.PI * 2);
    ctx.arc(5, -22, 2.5, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'rainbow') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-12, -22);
    ctx.quadraticCurveTo(-8, -36, 0, -46);
    ctx.quadraticCurveTo(8, -36, 12, -22);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = skin.metallicColor;
    ctx.fillRect(-10, -18, 20, 6);
  } else if (style === 'inferno') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-11, 10);
    ctx.lineTo(-13, -34);
    ctx.lineTo(0, -45);
    ctx.lineTo(13, -34);
    ctx.lineTo(11, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = skin.accentColor;
    for (let i = -9; i <= 9; i += 4.5) {
      ctx.fillRect(i - 1, -42, 2, 4);
    }
  } else if (style === 'cyber') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-12, 10);
    ctx.lineTo(-15, -20);
    ctx.lineTo(0, -46);
    ctx.lineTo(15, -20);
    ctx.lineTo(12, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = skin.metallicColor;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-4, -25);
    ctx.lineTo(0, -36);
    ctx.lineTo(4, -25);
    ctx.closePath();
    ctx.fill();
  } else if (style === 'temple') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.arc(0, -16, 15, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = skin.accentColor;
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 4) {
      const mx = Math.cos(a) * 18;
      const my = Math.sin(a) * 18 - 16;
      ctx.beginPath();
      ctx.arc(mx, my, 4, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = skin.metallicColor;
    ctx.fillRect(-6, -38, 12, 24);
  } else if (style === 'cosmic') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.quadraticCurveTo(-18, -20, 0, -46);
    ctx.quadraticCurveTo(18, -20, 10, 10);
    ctx.closePath();
    ctx.fill();

    ctx.fillStyle = skin.accentColor;
    ctx.beginPath();
    ctx.arc(-8, -16, 4, 0, Math.PI * 2);
    ctx.arc(8, -16, 4, 0, Math.PI * 2);
    ctx.fill();
  } else if (style === 'crystal') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.moveTo(-10, 10);
    ctx.lineTo(-16, -28);
    ctx.lineTo(0, -45);
    ctx.lineTo(16, -28);
    ctx.lineTo(10, 10);
    ctx.closePath();
    ctx.fill();

    ctx.strokeStyle = skin.metallicColor;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, 10);
    ctx.lineTo(0, -45);
    ctx.stroke();
  } else if (style === 'royal') {
    ctx.fillStyle = skin.barrelColor;
    ctx.beginPath();
    ctx.roundRect(-11, -38, 22, 38, [6, 6, 2, 2]);
    ctx.fill();

    ctx.fillStyle = skin.metallicColor;
    ctx.beginPath();
    ctx.moveTo(-12, -38);
    ctx.lineTo(-12, -45);
    ctx.lineTo(-6, -40);
    ctx.lineTo(0, -47);
    ctx.lineTo(6, -40);
    ctx.lineTo(12, -45);
    ctx.lineTo(12, -38);
    ctx.closePath();
    ctx.fill();
  } else {
    const lGrad = ctx.createLinearGradient(-12, -40, 12, 0);
    lGrad.addColorStop(0, skin.metallicColor);
    lGrad.addColorStop(0.5, skin.barrelColor);
    lGrad.addColorStop(1, '#020617');

    ctx.fillStyle = lGrad;
    ctx.beginPath();
    ctx.roundRect(-10, -38, 20, 38, [6, 6, 2, 2]);
    ctx.fill();

    ctx.fillStyle = skin.accentColor;
    ctx.fillRect(-12, -41, 24, 5);
  }

  ctx.restore();

  ctx.save();
  ctx.translate(cx, cy);
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  ctx.arc(0, 10, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = skin.accentColor || '#fbbf24';
  ctx.lineWidth = 2.5;
  ctx.stroke();
  ctx.restore();
}

function LauncherPreviewCanvas({ skin }: { skin: LauncherSkin }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 110;
    canvas.height = 110;

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const cx = 55;
      const cy = 68;
      const angle = Math.sin(elapsed * 0.002) * 0.25 - Math.PI / 2;

      draw3DLauncherHelper(ctx, cx, cy, angle, skin, elapsed);

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [skin]);

  return <canvas ref={canvasRef} className="w-[110px] h-[110px] block mx-auto drop-shadow-md" />;
}

function BallPreviewCanvas({ skin }: { skin: BallSkin }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 72;
    canvas.height = 72;

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const cx = 36;
      const cy = 36;

      const grad = ctx.createRadialGradient(cx - 6, cy - 6, 3, cx, cy, 26);
      grad.addColorStop(0, '#ffffff');
      grad.addColorStop(0.45, skin.primaryColor);
      grad.addColorStop(1, skin.secondaryColor);

      ctx.shadowBlur = 18 + Math.sin(elapsed * 0.004) * 4;
      ctx.shadowColor = skin.glowColor;

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.beginPath();
      ctx.arc(cx - 6, cy - 6, 4, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [skin]);

  return <canvas ref={canvasRef} className="w-[72px] h-[72px] block mx-auto drop-shadow-lg" />;
}

function PowerupPreviewCanvas({ item }: { item: PowerUpItem }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 72;
    canvas.height = 72;

    let animId: number;
    const startTime = performance.now();

    const render = (now: number) => {
      const elapsed = now - startTime;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();

      const cx = 36;
      const cy = 36;

      ctx.shadowBlur = 16 + Math.sin(elapsed * 0.005) * 6;
      ctx.shadowColor = item.glow;

      ctx.fillStyle = item.color;
      ctx.beginPath();
      ctx.arc(cx, cy, 24, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(cx, cy, 21, 0, Math.PI * 2);
      ctx.fill();

      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(item.icon, cx, cy);

      ctx.restore();
      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(animId);
  }, [item]);

  return <canvas ref={canvasRef} className="w-[72px] h-[72px] block mx-auto drop-shadow-md" />;
}

// ==========================================
// MAIN BUBBLE POP COMPONENT
// ==========================================

export function BubblePop({ coins, onGameWin, onGameLose }: PuzzleGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(1);
  const [payoutMultiplier, setPayoutMultiplier] = useState(1.0);

  // Active Game Template / Mode
  const [activeTemplate, setActiveTemplate] = useState<GameTemplate>(() => {
    const savedId = localStorage.getItem('bubble_selected_template');
    const found = GAME_TEMPLATES.find((t) => t.id === savedId);
    return found || GAME_TEMPLATES[0];
  });

  // Audio Toggles
  const [bgmActive, setBgmActive] = useState<boolean>(() => synth.isBgmEnabled());
  const [sfxActive, setSfxActive] = useState<boolean>(() => synth.isSfxEnabled());

  // Collection Vault Unlocked & Selected Skins State
  const [unlockedLaunchers, setUnlockedLaunchers] = useState<string[]>(() => {
    const saved = localStorage.getItem('bubble_unlocked_launchers');
    return saved ? JSON.parse(saved) : ['classic_cannon'];
  });
  const [selectedLauncherId, setSelectedLauncherId] = useState<string>(() => {
    return localStorage.getItem('bubble_selected_launcher') || 'classic_cannon';
  });

  const [unlockedBalls, setUnlockedBalls] = useState<string[]>(() => {
    const saved = localStorage.getItem('bubble_unlocked_balls');
    return saved ? JSON.parse(saved) : ['classic_ball'];
  });
  const [selectedBallId, setSelectedBallId] = useState<string>(() => {
    return localStorage.getItem('bubble_selected_ball') || 'classic_ball';
  });

  const [unlockedPowerups, setUnlockedPowerups] = useState<string[]>(() => {
    const saved = localStorage.getItem('bubble_unlocked_powerups');
    return saved ? JSON.parse(saved) : ['fire_blast'];
  });
  const [selectedPowerupId, setSelectedPowerupId] = useState<string | null>(() => {
    return localStorage.getItem('bubble_selected_powerup') || 'fire_blast';
  });

  // Active Equips
  const activeLauncher = LAUNCHER_SKINS[selectedLauncherId] || LAUNCHER_SKINS['classic_cannon'];
  const activeBall = BALL_SKINS[selectedBallId] || BALL_SKINS['classic_ball'];
  const activePowerup = selectedPowerupId ? POWERUP_SKINS[selectedPowerupId] : null;

  // Modals
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [showShopModal, setShowShopModal] = useState(false);
  const [shopTab, setShopTab] = useState<'launchers' | 'balls' | 'powerups'>('launchers');

  // Purchase Confirmation & Celebration
  const [pendingPurchase, setPendingPurchase] = useState<{
    item: LauncherSkin | BallSkin | PowerUpItem;
    category: 'launcher' | 'ball' | 'powerup';
  } | null>(null);

  const [celebrationItem, setCelebrationItem] = useState<{
    item: LauncherSkin | BallSkin | PowerUpItem;
    category: 'launcher' | 'ball' | 'powerup';
  } | null>(null);

  const [insufficientWarning, setInsufficientWarning] = useState<string | null>(null);

  // Power-up Inventory Count
  const [powerupCharges, setPowerupCharges] = useState(3);
  const [powerupActiveMode, setPowerupActiveMode] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Constants
  const ROWS = 8;
  const COLS = 8;
  const BUBBLE_RADIUS = 20;
  const CANVAS_WIDTH = 380;
  const CANVAS_HEIGHT = 460;

  // Active Template Color Palette
  const currentPalette = activeTemplate.colorPalette || ['#ef4444', '#facc15', '#3b82f6', '#10b981', '#a855f7'];

  // Game state refs for 60 FPS loop
  const boardRef = useRef<(string | null)[][]>([]);
  const boardSpecialRef = useRef<('normal' | 'bomb')[][]>([]);
  const projectileRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    active: boolean;
    isPowerup: boolean;
    powerupType?: string;
  } | null>(null);

  const nextColorRef = useRef<string>(currentPalette[0]);
  const aimAngleRef = useRef<number>(-Math.PI / 2);

  const particlesRef = useRef<{
    x: number;
    y: number;
    vx: number;
    vy: number;
    color: string;
    radius: number;
    alpha: number;
    life: number;
    decay: number;
    shape?: 'circle' | 'star' | 'sparkle';
  }[]>([]);

  const floatingTextsRef = useRef<{
    x: number;
    y: number;
    text: string;
    timer: number;
    color: string;
  }[]>([]);

  const screenShakeRef = useRef<number>(0);
  const screenFlashRef = useRef<number>(0);

  // Auto Start & Stop BGM on Mount / Unmount
  useEffect(() => {
    synth.startBgm();
    return () => {
      synth.stopBgm();
    };
  }, []);

  // Audio Control Toggles
  const handleToggleBgm = () => {
    const nextState = !bgmActive;
    setBgmActive(nextState);
    synth.setBgmEnabled(nextState);
    if (nextState) {
      synth.startBgm();
    } else {
      synth.stopBgm();
    }
  };

  const handleToggleSfx = () => {
    const nextState = !sfxActive;
    setSfxActive(nextState);
    synth.setSfxEnabled(nextState);
    if (nextState) synth.playClick();
  };

  // Switch Template Action
  const handleSelectTemplate = (template: GameTemplate) => {
    setActiveTemplate(template);
    localStorage.setItem('bubble_selected_template', template.id);

    if (template.defaultLauncher && LAUNCHER_SKINS[template.defaultLauncher]) {
      setSelectedLauncherId(template.defaultLauncher);
    }
    if (template.defaultBall && BALL_SKINS[template.defaultBall]) {
      setSelectedBallId(template.defaultBall);
    }

    if (gameState === 'playing') {
      initializeBoard();
      spawnBullet();
    }
  };

  // Initial Board Generation with Layout Shapes
  const initializeBoard = () => {
    const grid: (string | null)[][] = [];
    const specials: ('normal' | 'bomb')[][] = [];
    const layout = activeTemplate.layoutType || 'classic_wall';
    const centerR = 2.5;
    const centerC = 3.5;

    for (let r = 0; r < ROWS; r++) {
      grid[r] = [];
      specials[r] = [];
      for (let c = 0; c < COLS; c++) {
        let activeCell = false;
        const dist = Math.hypot(r - centerR, c - centerC);

        switch (layout) {
          case 'circle':
            activeCell = dist >= 1.0 && dist <= 3.2;
            break;
          case 'spiral': {
            const angle = Math.atan2(r - centerR, c - centerC);
            const normAngle = (angle + Math.PI * 2) % (Math.PI * 2);
            activeCell = dist >= 0.8 && dist <= 3.4 && Math.abs(dist - (0.8 + normAngle / 1.8)) < 1.1;
            break;
          }
          case 'diamond':
            activeCell = Math.abs(r - centerR) + Math.abs(c - centerC) <= 3.2;
            break;
          case 'snake':
            if (r === 0) activeCell = c <= 5;
            else if (r === 1) activeCell = c >= 2;
            else if (r === 2) activeCell = c <= 5;
            else if (r === 3) activeCell = c >= 2;
            break;
          case 'hexagon': {
            const maxD = Math.max(Math.abs(r - centerR), Math.abs(c - centerC), Math.abs((r - centerR) - (c - centerC)));
            activeCell = maxD <= 2.2 && r <= 4;
            break;
          }
          case 'double_ring':
            activeCell = (dist >= 0.8 && dist <= 1.5) || (dist >= 2.4 && dist <= 3.5);
            break;
          case 'maze':
            activeCell = r <= 3 && (r % 2 === 0 || c === 0 || c === COLS - 1 || c === 3 || c === 4);
            break;
          case 'cross':
            activeCell = (Math.abs(r - centerR) <= 0.8 && Math.abs(c - centerC) <= 3.2) ||
                         (Math.abs(c - centerC) <= 0.8 && Math.abs(r - centerR) <= 2.8);
            break;
          case 'wave': {
            const waveVal = Math.sin((c / (COLS - 1)) * Math.PI * 2) * 1.5 + 1.5;
            activeCell = Math.abs(r - waveVal) <= 1.1;
            break;
          }
          case 'star': {
            const starAngle = Math.atan2(r - centerR, c - centerC);
            const starBoundary = 1.8 + 1.2 * Math.cos(starAngle * 4);
            activeCell = dist <= starBoundary && r <= 5;
            break;
          }
          case 'classic_wall':
          default:
            activeCell = r < 4;
            break;
        }

        if (activeCell) {
          grid[r][c] = currentPalette[Math.floor(Math.random() * currentPalette.length)];
          specials[r][c] = Math.random() < 0.12 ? 'bomb' : 'normal';
        } else {
          grid[r][c] = null;
          specials[r][c] = 'normal';
        }
      }
    }
    boardRef.current = grid;
    boardSpecialRef.current = specials;
    nextColorRef.current = currentPalette[Math.floor(Math.random() * currentPalette.length)];
    projectileRef.current = null;
    particlesRef.current = [];
    floatingTextsRef.current = [];
    screenShakeRef.current = 0;
    screenFlashRef.current = 0;
    setScore(0);
    setCombo(1);
    setPayoutMultiplier(activeTemplate.multiplierBonus || 1.0);
    setPowerupCharges(3);
    setPowerupActiveMode(false);
  };

  const spawnBullet = () => {
    const activeColor = nextColorRef.current;
    nextColorRef.current = currentPalette[Math.floor(Math.random() * currentPalette.length)];

    const isPowerupShot = powerupActiveMode && powerupCharges > 0 && activePowerup !== null;

    projectileRef.current = {
      x: CANVAS_WIDTH / 2,
      y: CANVAS_HEIGHT - 35,
      vx: 0,
      vy: 0,
      color: isPowerupShot ? activePowerup.color : activeColor,
      active: false,
      isPowerup: isPowerupShot,
      powerupType: isPowerupShot ? activePowerup.type : undefined,
    };

    if (isPowerupShot) {
      setPowerupCharges((prev) => prev - 1);
      setPowerupActiveMode(false);
    }
  };

  const handleStart = () => {
    if (!validateAndDeductCoins(bet, 'Bubble Pop')) {
      return;
    }
    synth.playBubbleShoot();

    initializeBoard();
    spawnBullet();
    setGameState('playing');
  };

  const updateAimAngleFromCoord = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = clientX - rect.left;
    const mouseY = clientY - rect.top;

    const dx = mouseX - CANVAS_WIDTH / 2;
    const dy = mouseY - (CANVAS_HEIGHT - 35);
    let angle = Math.atan2(dy, dx);
    if (angle > -0.15) angle = -0.15;
    if (angle < -Math.PI + 0.15) angle = -Math.PI + 0.15;
    aimAngleRef.current = angle;
  };

  const handleShoot = () => {
    if (gameState !== 'playing' || !projectileRef.current || projectileRef.current.active) return;

    synth.playBubbleShoot();
    const p = projectileRef.current;
    p.vx = Math.cos(aimAngleRef.current) * 12;
    p.vy = Math.sin(aimAngleRef.current) * 12;
    p.active = true;
  };

  // Helper: Find neighbors
  const getNeighbors = (r: number, c: number) => {
    const neighbors: [number, number][] = [];
    const offsets = [
      [-1, 0], [1, 0], [0, -1], [0, 1],
      [-1, -1], [-1, 1], [1, -1], [1, 1]
    ];
    for (const [dr, dc] of offsets) {
      const nr = r + dr;
      const nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS) {
        neighbors.push([nr, nc]);
      }
    }
    return neighbors;
  };

  // BFS to find matching color clusters
  const findCluster = (startR: number, startC: number, color: string) => {
    const cluster: [number, number][] = [];
    const visited = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const queue: [number, number][] = [[startR, startC]];
    visited[startR][startC] = true;

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      if (boardRef.current[r][c] === color) {
        cluster.push([r, c]);
        const neighbors = getNeighbors(r, c);
        for (const [nr, nc] of neighbors) {
          if (!visited[nr][nc] && boardRef.current[nr][nc] === color) {
            visited[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }
    return cluster;
  };

  // Check and drop disconnected floating clusters
  const dropDisconnectedBubbles = () => {
    const visited = Array(ROWS).fill(null).map(() => Array(COLS).fill(false));
    const queue: [number, number][] = [];

    for (let c = 0; c < COLS; c++) {
      if (boardRef.current[0][c] !== null) {
        visited[0][c] = true;
        queue.push([0, c]);
      }
    }

    while (queue.length > 0) {
      const [r, c] = queue.shift()!;
      const neighbors = getNeighbors(r, c);
      for (const [nr, nc] of neighbors) {
        if (!visited[nr][nc] && boardRef.current[nr][nc] !== null) {
          visited[nr][nc] = true;
          queue.push([nr, nc]);
        }
      }
    }

    let droppedCount = 0;
    const cellWidth = CANVAS_WIDTH / COLS;
    const cellHeight = (CANVAS_HEIGHT - 90) / ROWS;

    for (let r = 0; r < ROWS; r++) {
      for (let c = 0; c < COLS; c++) {
        if (boardRef.current[r][c] !== null && !visited[r][c]) {
          const colHex = boardRef.current[r][c]!;
          boardRef.current[r][c] = null;
          boardSpecialRef.current[r][c] = 'normal';
          droppedCount++;

          const px = c * cellWidth + cellWidth / 2;
          const py = r * cellHeight + cellHeight / 2 + 10;
          for (let p = 0; p < 10; p++) {
            particlesRef.current.push({
              x: px,
              y: py,
              vx: (Math.random() - 0.5) * 6,
              vy: Math.random() * 5 + 2,
              color: colHex,
              radius: Math.random() * 4 + 2,
              alpha: 1,
              life: 1,
              decay: 0.02,
              shape: 'sparkle',
            });
          }
        }
      }
    }
    return droppedCount;
  };

  const calculateRayPath = () => {
    const bullet = projectileRef.current;
    if (!bullet) return [];

    const cellWidth = CANVAS_WIDTH / COLS;
    const cellHeight = (CANVAS_HEIGHT - 90) / ROWS;
    let currX = bullet.x;
    let currY = bullet.y;
    let dirX = Math.cos(aimAngleRef.current);
    let dirY = Math.sin(aimAngleRef.current);

    const points: { x: number; y: number }[] = [{ x: currX, y: currY }];

    for (let step = 0; step < 200; step++) {
      currX += dirX * 3;
      currY += dirY * 3;

      if (currX <= BUBBLE_RADIUS || currX >= CANVAS_WIDTH - BUBBLE_RADIUS) {
        dirX = -dirX;
      }

      let hit = false;
      if (currY <= 15) {
        hit = true;
      } else {
        const board = boardRef.current;
        for (let r = 0; r < ROWS; r++) {
          for (let c = 0; c < COLS; c++) {
            if (board[r][c] !== null) {
              const bx = c * cellWidth + cellWidth / 2;
              const by = r * cellHeight + cellHeight / 2 + 10;
              if (Math.hypot(currX - bx, currY - by) < BUBBLE_RADIUS * 1.5) {
                hit = true;
                break;
              }
            }
          }
          if (hit) break;
        }
      }

      if (hit) {
        points.push({ x: currX, y: currY });
        break;
      }
      if (step % 5 === 0) points.push({ x: currX, y: currY });
    }
    return points;
  };

  // Purchase Actions
  const handleAttemptBuy = (item: LauncherSkin | BallSkin | PowerUpItem, category: 'launcher' | 'ball' | 'powerup') => {
    if (coins < item.price) {
      setInsufficientWarning(`Need ${item.price.toLocaleString()} coins. You have ${coins.toLocaleString()} coins.`);
      setTimeout(() => setInsufficientWarning(null), 3000);
      return;
    }
    setPendingPurchase({ item, category });
  };

  const handleConfirmPurchase = () => {
    if (!pendingPurchase) return;
    const { item, category } = pendingPurchase;

    if (coins < item.price) return;

    synth.playTreasure();
    synth.playVictory();

    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try { navigator.vibrate([60, 120, 60]); } catch (e) {}
    }

    onGameLose(item.price);

    if (category === 'launcher') {
      const updated = [...unlockedLaunchers, item.id];
      setUnlockedLaunchers(updated);
      setSelectedLauncherId(item.id);
      localStorage.setItem('bubble_unlocked_launchers', JSON.stringify(updated));
      localStorage.setItem('bubble_selected_launcher', item.id);
    } else if (category === 'ball') {
      const updated = [...unlockedBalls, item.id];
      setUnlockedBalls(updated);
      setSelectedBallId(item.id);
      localStorage.setItem('bubble_unlocked_balls', JSON.stringify(updated));
      localStorage.setItem('bubble_selected_ball', item.id);
    } else if (category === 'powerup') {
      const updated = [...unlockedPowerups, item.id];
      setUnlockedPowerups(updated);
      setSelectedPowerupId(item.id);
      localStorage.setItem('bubble_unlocked_powerups', JSON.stringify(updated));
      localStorage.setItem('bubble_selected_powerup', item.id);
    }

    setCelebrationItem({ item, category });
    setPendingPurchase(null);
  };

  // Main 60 FPS Canvas Game Loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const cellWidth = CANVAS_WIDTH / COLS;
    const cellHeight = (CANVAS_HEIGHT - 90) / ROWS;

    const gameLoop = () => {
      ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      ctx.save();
      // Apply Camera Shake
      if (screenShakeRef.current > 0) {
        const shakeX = (Math.random() - 0.5) * screenShakeRef.current;
        const shakeY = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(shakeX, shakeY);
        screenShakeRef.current *= 0.85;
        if (screenShakeRef.current < 0.2) screenShakeRef.current = 0;
      }

      // Draw Theme Canvas Background
      ctx.fillStyle = activeTemplate.bgCanvasStyle || '#020617';
      ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

      // Draw Grid Lines & Danger Limit Line
      ctx.strokeStyle = 'rgba(239, 68, 68, 0.35)';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([6, 6]);
      ctx.beginPath();
      ctx.moveTo(0, cellHeight * (ROWS - 1.5));
      ctx.lineTo(CANVAS_WIDTH, cellHeight * (ROWS - 1.5));
      ctx.stroke();
      ctx.setLineDash([]);

      // 1. Draw Grid Bubbles
      const board = boardRef.current;
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const color = board[r][c];
          if (color) {
            const bx = c * cellWidth + cellWidth / 2;
            const by = r * cellHeight + cellHeight / 2 + 10;

            const bGrad = ctx.createRadialGradient(bx - 5, by - 5, 2, bx, by, BUBBLE_RADIUS);
            bGrad.addColorStop(0, '#ffffff');
            bGrad.addColorStop(0.4, color);
            bGrad.addColorStop(1, '#000000');

            ctx.save();
            ctx.shadowBlur = 10;
            ctx.shadowColor = color;
            ctx.fillStyle = bGrad;
            ctx.beginPath();
            ctx.arc(bx, by, BUBBLE_RADIUS, 0, Math.PI * 2);
            ctx.fill();

            // Specular gloss
            ctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
            ctx.beginPath();
            ctx.arc(bx - 5, by - 5, 3.5, 0, Math.PI * 2);
            ctx.fill();

            ctx.restore();
          }
        }
      }

      // 2. Draw Aiming Prediction Line
      const bullet = projectileRef.current;
      if (bullet && !bullet.active) {
        const rayPoints = calculateRayPath();
        ctx.save();
        ctx.strokeStyle = bullet.isPowerup ? activePowerup?.glow || '#facc15' : 'rgba(251, 191, 36, 0.7)';
        ctx.lineWidth = 2.5;
        ctx.setLineDash([6, 6]);
        ctx.beginPath();
        rayPoints.forEach((pt, i) => {
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        });
        ctx.stroke();

        const lastPt = rayPoints[rayPoints.length - 1];
        ctx.setLineDash([]);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(lastPt.x, lastPt.y, 8, 0, Math.PI * 2);
        ctx.stroke();

        ctx.restore();
      }

      // 3. Update & Draw Active Flying Bullet
      if (bullet && bullet.active) {
        bullet.x += bullet.vx;
        bullet.y += bullet.vy;

        if (Math.random() < 0.6) {
          particlesRef.current.push({
            x: bullet.x,
            y: bullet.y,
            vx: (Math.random() - 0.5) * 2,
            vy: (Math.random() - 0.5) * 2,
            color: activeBall.primaryColor,
            radius: Math.random() * 3 + 1.5,
            alpha: 1,
            life: 1,
            decay: 0.05,
          });
        }

        if (bullet.x - BUBBLE_RADIUS <= 0) {
          bullet.x = BUBBLE_RADIUS;
          bullet.vx = -bullet.vx;
          synth.playBubbleShoot();
        } else if (bullet.x + BUBBLE_RADIUS >= CANVAS_WIDTH) {
          bullet.x = CANVAS_WIDTH - BUBBLE_RADIUS;
          bullet.vx = -bullet.vx;
          synth.playBubbleShoot();
        }

        let hitGrid = false;
        let targetR = 0;
        let targetC = 0;

        if (bullet.y - BUBBLE_RADIUS <= 10) {
          hitGrid = true;
          targetR = 0;
          targetC = Math.max(0, Math.min(COLS - 1, Math.floor(bullet.x / cellWidth)));
        } else {
          for (let r = 0; r < ROWS; r++) {
            for (let c = 0; c < COLS; c++) {
              if (board[r][c] !== null) {
                const bx = c * cellWidth + cellWidth / 2;
                const by = r * cellHeight + cellHeight / 2 + 10;
                const dist = Math.hypot(bullet.x - bx, bullet.y - by);
                if (dist < BUBBLE_RADIUS * 1.7) {
                  hitGrid = true;
                  let minD = Infinity;
                  const neighbors = getNeighbors(r, c);
                  for (const [nr, nc] of neighbors) {
                    if (board[nr][nc] === null) {
                      const ncx = nc * cellWidth + cellWidth / 2;
                      const ncy = nr * cellHeight + cellHeight / 2 + 10;
                      const ndist = Math.hypot(bullet.x - ncx, bullet.y - ncy);
                      if (ndist < minD) {
                        minD = ndist;
                        targetR = nr;
                        targetC = nc;
                      }
                    }
                  }
                }
              }
            }
          }
        }

        if (hitGrid) {
          bullet.active = false;

          // POWER-UP IMPACT HANDLING
          if (bullet.isPowerup && bullet.powerupType) {
            synth.playExplode();
            synth.playVictory();
            screenShakeRef.current = 15;
            screenFlashRef.current = 0.4;

            if (bullet.powerupType === 'fire_blast' || bullet.powerupType === 'galaxy_bomb') {
              const radius = bullet.powerupType === 'galaxy_bomb' ? 2 : 1;
              for (let dr = -radius; dr <= radius; dr++) {
                for (let dc = -radius; dc <= radius; dc++) {
                  const tr = targetR + dr;
                  const tc = targetC + dc;
                  if (tr >= 0 && tr < ROWS && tc >= 0 && tc < COLS && board[tr][tc] !== null) {
                    board[tr][tc] = null;
                  }
                }
              }
              setScore((prev) => prev + 1500 * combo);
              floatingTextsRef.current.push({
                x: targetC * cellWidth + cellWidth / 2,
                y: targetR * cellHeight + cellHeight / 2,
                text: bullet.powerupType === 'galaxy_bomb' ? 'SUPERNOVA BOMB!' : 'FIRE BLAST!',
                timer: 60,
                color: '#ef4444',
              });
            } else if (bullet.powerupType === 'ice_storm' || bullet.powerupType === 'plasma_wave') {
              const maxR = bullet.powerupType === 'plasma_wave' ? 2 : 1;
              for (let r = 0; r < maxR; r++) {
                for (let c = 0; c < COLS; c++) {
                  board[r][c] = null;
                }
              }
              setScore((prev) => prev + 2000 * combo);
            } else if (bullet.powerupType === 'thunder_strike') {
              for (let r = 0; r < ROWS; r++) {
                board[r][targetC] = null;
              }
              setScore((prev) => prev + 1800 * combo);
            } else if (bullet.powerupType === 'divine_nova') {
              const hitColor = board[targetR][targetC] || bullet.color;
              for (let r = 0; r < ROWS; r++) {
                for (let c = 0; c < COLS; c++) {
                  if (board[r][c] === hitColor) board[r][c] = null;
                }
              }
              setScore((prev) => prev + 3500 * combo);
            }

            const drops = dropDisconnectedBubbles();
            if (drops > 0) setScore((prev) => prev + drops * 200 * combo);
            setPayoutMultiplier((prev) => parseFloat((prev + 0.35).toFixed(2)));
            spawnBullet();
          } else {
            // STANDARD COLOR MATCHING
            board[targetR][targetC] = bullet.color;
            const cluster = findCluster(targetR, targetC, bullet.color);

            if (cluster.length >= 3) {
              synth.playBubblePop();
              synth.playCombo(combo);
              const popCount = cluster.length;
              const pointsGained = popCount * 120 * combo;
              setScore((prev) => prev + pointsGained);

              if (popCount >= 5) screenShakeRef.current = 8;

              cluster.forEach(([r, c]) => {
                board[r][c] = null;
                const px = c * cellWidth + cellWidth / 2;
                const py = r * cellHeight + cellHeight / 2 + 10;
                for (let i = 0; i < 10; i++) {
                  particlesRef.current.push({
                    x: px,
                    y: py,
                    vx: (Math.random() - 0.5) * 6,
                    vy: (Math.random() - 0.5) * 6,
                    color: bullet.color,
                    radius: Math.random() * 5 + 2,
                    alpha: 1,
                    life: 1,
                    decay: 0.03,
                  });
                }
              });

              const drops = dropDisconnectedBubbles();
              const totalGainedPoints = pointsGained + drops * 180 * combo;
              if (drops > 0) setScore((prev) => prev + drops * 180 * combo);

              floatingTextsRef.current.push({
                x: targetC * cellWidth + cellWidth / 2,
                y: targetR * cellHeight + cellHeight / 2,
                text: drops > 0 ? `COMBO x${combo}! +${totalGainedPoints}` : `POP! +${totalGainedPoints}`,
                timer: 50,
                color: '#facc15',
              });

              setCombo((prev) => prev + 1);
              setPayoutMultiplier((prev) => parseFloat((prev + 0.2 * popCount).toFixed(2)));
            } else {
              setCombo(1);
              synth.playBubbleShoot();
            }

            // Game over check
            let hitLimit = false;
            for (let c = 0; c < COLS; c++) {
              if (board[ROWS - 2][c] !== null) {
                hitLimit = true;
                break;
              }
            }

            const hasRemaining = board.some((row) => row.some((cell) => cell !== null));

            if (hitLimit || !hasRemaining) {
              synth.playVictory();
              setGameState('gameover');
              const finalMult = parseFloat((payoutMultiplier + score / 1000).toFixed(2));
              const prize = Math.floor(bet * finalMult);
              onGameWin(prize, finalMult);
            } else {
              spawnBullet();
            }
          }
        } else {
          const bGrad = ctx.createRadialGradient(bullet.x - 4, bullet.y - 4, 2, bullet.x, bullet.y, BUBBLE_RADIUS);
          bGrad.addColorStop(0, '#ffffff');
          bGrad.addColorStop(0.4, bullet.color);
          bGrad.addColorStop(1, '#000000');

          ctx.fillStyle = bGrad;
          ctx.beginPath();
          ctx.arc(bullet.x, bullet.y, BUBBLE_RADIUS, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 4. Draw Rotating 3D Launcher
      const launcherCX = CANVAS_WIDTH / 2;
      const launcherCY = CANVAS_HEIGHT - 35;

      draw3DLauncherHelper(ctx, launcherCX, launcherCY, aimAngleRef.current, activeLauncher, performance.now());

      if (bullet && !bullet.active) {
        const bGrad = ctx.createRadialGradient(bullet.x - 4, bullet.y - 4, 2, bullet.x, bullet.y, BUBBLE_RADIUS);
        bGrad.addColorStop(0, '#ffffff');
        bGrad.addColorStop(0.4, bullet.color);
        bGrad.addColorStop(1, '#000000');

        ctx.fillStyle = bGrad;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, BUBBLE_RADIUS, 0, Math.PI * 2);
        ctx.fill();
      }

      // 5. Particles
      particlesRef.current.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay || 0.03;
        ctx.fillStyle = p.color;
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1.0;
      particlesRef.current = particlesRef.current.filter((p) => p.alpha > 0);

      // 6. Floating Texts
      floatingTextsRef.current.forEach((t) => {
        t.y -= 0.8;
        t.timer--;
        ctx.fillStyle = t.color;
        ctx.font = 'black 12px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.text, t.x, t.y);
      });
      floatingTextsRef.current = floatingTextsRef.current.filter((t) => t.timer > 0);

      // 7. Screen Flash Overlay
      if (screenFlashRef.current > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${screenFlashRef.current})`;
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        screenFlashRef.current -= 0.05;
      }

      ctx.restore();
      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);
    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, [gameState, score, combo, activePowerup, activeBall, activeLauncher, activeTemplate]);

  return (
    <div className="space-y-4 max-w-xl mx-auto px-2 sm:px-4">
      {/* Top Header Bar */}
      <div className="bg-zinc-900/80 p-3 sm:p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <div className="text-2xl p-2 bg-black/60 rounded-xl border border-amber-500/30 shrink-0">
            {activeTemplate.themeIcon}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wider">{activeTemplate.title}</h3>
              <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 font-mono">
                {activeTemplate.multiplierBonus}x
              </span>
            </div>
            <p className="text-[10px] text-zinc-400 font-medium">Precision Bubble Shooter</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Coins to Pay Input */}
          <div className="flex items-center bg-black/80 border border-zinc-800 rounded-xl px-2 py-1 gap-1">
            <span className="text-[10px] text-zinc-400 font-bold uppercase">Coins to Pay:</span>
            <input
              type="number"
              disabled={gameState === 'playing'}
              value={bet}
              onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
              className="w-14 bg-transparent text-xs text-amber-300 font-mono font-bold outline-none text-right"
            />
            <span className="text-xs">🪙</span>
          </div>

          {/* Vault Shop Modal Button */}
          <button
            onClick={() => {
              synth.playClick();
              setShowShopModal(true);
            }}
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase tracking-wider transition flex items-center gap-1 shadow-lg shadow-amber-500/20 active:scale-95"
          >
            <span>Vault 🛡️</span>
          </button>
        </div>
      </div>

      {/* Main Canvas Game Stage */}
      <div className="relative rounded-2xl overflow-hidden border border-amber-500/30 bg-zinc-950 p-2 shadow-2xl w-full max-w-[396px] mx-auto">
        {/* HUD In-Game Stats Header inside Stage */}
        <div className="flex items-center justify-between px-2 py-1.5 bg-black/60 rounded-xl border border-white/5 mb-1 text-xs">
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <span>Score:</span>
            <span className="text-amber-400 font-mono font-black">{score}</span>
          </div>
          <div className="flex items-center gap-1.5 font-bold text-zinc-300">
            <span>Prize:</span>
            <span className="text-emerald-400 font-mono font-black">
              {Math.floor(bet * payoutMultiplier).toLocaleString()} 🪙
            </span>
          </div>
        </div>

        {gameState === 'idle' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/85 backdrop-blur-md p-6 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-xl animate-bounce flex items-center justify-center text-3xl">
              {activeTemplate.themeIcon}
            </div>
            <div className="space-y-1">
              <h4 className="text-base font-black text-white uppercase tracking-wider">
                {activeTemplate.title}
              </h4>
              <p className="text-xs text-zinc-300 leading-normal max-w-[280px]">
                {activeTemplate.description}
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-xs font-black uppercase text-black shadow-xl shadow-amber-500/30 hover:scale-105 transition flex items-center gap-2"
            >
              <Play className="h-4 w-4 fill-current" /> Play Game 🚀
            </button>
          </div>
        )}

        {gameState === 'gameover' && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-black/90 backdrop-blur-md p-6 text-center space-y-4 animate-fade-in">
            <span className="text-4xl">🏆</span>
            <div className="space-y-1">
              <h4 className="text-base font-black text-amber-400 uppercase tracking-widest">Stage Cleared!</h4>
              <p className="text-xs text-zinc-400 font-bold uppercase">Final Score: {score}</p>
              <p className="text-xl font-black text-amber-300 mt-2 font-mono">
                +{Math.floor(bet * payoutMultiplier).toLocaleString()} 🪙 ({payoutMultiplier}x)
              </p>
            </div>
            <button
              onClick={handleStart}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-xs font-black uppercase text-black transition shadow-lg shadow-amber-500/30 flex items-center gap-2 mx-auto hover:scale-105"
            >
              <RefreshCw className="h-4 w-4" /> Play Again
            </button>
          </div>
        )}

        <canvas
          ref={canvasRef}
          width={CANVAS_WIDTH}
          height={CANVAS_HEIGHT}
          onClick={handleShoot}
          onMouseMove={(e) => updateAimAngleFromCoord(e.clientX, e.clientY)}
          onTouchMove={(e) => {
            if (e.touches.length > 0) updateAimAngleFromCoord(e.touches[0].clientX, e.touches[0].clientY);
          }}
          onTouchEnd={handleShoot}
          className="cursor-crosshair block mx-auto rounded-xl touch-none"
        />

        {/* Beside-Launcher Next Ball Preview Widget */}
        <div className="absolute bottom-4 right-4 z-20 bg-black/85 border border-amber-500/40 rounded-xl p-2 flex items-center gap-2 shadow-xl backdrop-blur-md pointer-events-none">
          <div className="text-right">
            <span className="text-[9px] font-black uppercase text-amber-300 block leading-tight">Next</span>
            <span className="text-[8px] text-zinc-400 block leading-tight">Ball</span>
          </div>
          <div
            className="w-6 h-6 rounded-full shadow-md border border-white/40 shrink-0 transition-all duration-300"
            style={{
              background: `radial-gradient(circle at 30% 30%, #ffffff, ${nextColorRef.current}, #000000)`,
              boxShadow: `0 0 8px ${nextColorRef.current}`
            }}
          />
        </div>
      </div>

      {/* SECTIONS 3, 4, 5: Game Info Card, Category Tags, Similar Games Carousel */}
      <GameInfoAndTags
        activeTemplate={activeTemplate}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* GAME COLLECTION MODAL / POPUP (Section 2) */}
      {showCollectionModal && (
        <GameCollectionModal
          activeTemplate={activeTemplate}
          onSelectTemplate={handleSelectTemplate}
          onClose={() => setShowCollectionModal(false)}
        />
      )}

      {/* COLLECTION VAULT SHOP MODAL */}
      {showShopModal && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-3 sm:p-5 animate-fade-in">
          <div className="relative bg-gradient-to-b from-slate-950 via-zinc-950 to-black border-2 border-amber-500/30 w-full max-w-4xl rounded-3xl p-5 sm:p-7 text-white max-h-[90vh] overflow-y-auto shadow-[0_0_80px_rgba(245,158,11,0.15)] flex flex-col justify-between">
            <ShopBackgroundParticlesCanvas />

            <div className="relative z-10">
              {/* Header Bar */}
              <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-white/10 gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-lg">
                    <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-amber-400">
                      <Palette className="h-6 w-6" />
                    </div>
                  </div>
                  <div>
                    <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-400">
                      Collection Vault
                    </h3>
                    <p className="text-[11px] text-zinc-400 font-medium">
                      Unlock & equip 12 Shooter Launchers, 12 3D Balls, and 12 Legendary Power-Ups
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
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

              {/* Collection Vault Header */}
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🛡️</span>
                  <h3 className="text-base font-black uppercase text-amber-300 tracking-wider">
                    Launcher Vault Collection
                  </h3>
                </div>
                <span className="text-xs text-zinc-400 font-bold uppercase">
                  {Object.keys(LAUNCHER_SKINS).length} Premium Designs
                </span>
              </div>

              {/* LAUNCHERS GRID */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.values(LAUNCHER_SKINS).map((skin) => {
                  const isUnlocked = unlockedLaunchers.includes(skin.id);
                  const isSelected = selectedLauncherId === skin.id;

                  return (
                    <div
                      key={skin.id}
                      className={`p-4 rounded-2xl border flex flex-col justify-between transition-all duration-300 relative overflow-hidden backdrop-blur-md ${
                        isSelected
                          ? 'border-amber-400/80 bg-gradient-to-b from-amber-500/20 to-black/60 shadow-[0_0_25px_rgba(245,158,11,0.25)] ring-2 ring-amber-400/50'
                          : isUnlocked
                          ? 'border-white/15 bg-zinc-900/60 hover:border-white/30 hover:bg-zinc-800/80'
                          : 'border-zinc-800/80 bg-zinc-950/80 opacity-85 hover:opacity-100'
                      }`}
                    >
                      <span
                        className="absolute top-3 left-3 text-[9px] font-black uppercase px-2.5 py-0.5 rounded-md text-black shadow-md"
                        style={{ background: skin.tierColor }}
                      >
                        {skin.tier}
                      </span>

                      <div className="my-2 flex items-center justify-center w-full">
                        <LauncherPreviewCanvas skin={skin} />
                      </div>

                      <div className="space-y-1 my-2">
                        <h4 className="text-xs font-black text-center text-zinc-100">{skin.name}</h4>
                        <p className="text-[10px] text-zinc-400 text-center line-clamp-2">{skin.description}</p>
                      </div>

                      {isSelected ? (
                        <div className="w-full py-2 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 font-black text-[11px] flex items-center justify-center gap-1.5 uppercase tracking-wider shadow">
                          <CheckCircle2 className="h-4 w-4 text-amber-400 animate-pulse" /> EQUIPPED
                        </div>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            synth.playClick();
                            setSelectedLauncherId(skin.id);
                            localStorage.setItem('bubble_selected_launcher', skin.id);
                          }}
                          className="w-full py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-[11px] uppercase tracking-wider transition border border-white/10"
                        >
                          Equip
                        </button>
                      ) : (
                        <button
                          onClick={() => handleAttemptBuy(skin, 'launcher')}
                          className="w-full py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-[11px] uppercase tracking-wider transition flex items-center justify-center gap-1.5 shadow-lg shadow-amber-500/20"
                        >
                          <Coins className="h-3.5 w-3.5" /> {skin.price.toLocaleString()}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* PURCHASE CONFIRMATION MODAL */}
      {pendingPurchase && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-zinc-900 via-slate-900 to-black border-2 border-amber-500/50 w-full max-w-md rounded-3xl p-6 text-white text-center shadow-2xl space-y-4">
            <h3 className="text-xl font-black uppercase tracking-wider text-amber-300">Confirm Purchase</h3>

            <div className="bg-black/60 border border-white/10 p-4 rounded-2xl space-y-2">
              <span className="text-sm font-black text-amber-200">{pendingPurchase.item.name}</span>
              <p className="text-xs text-zinc-400 font-mono">Price: {pendingPurchase.item.price.toLocaleString()} 🪙</p>

              <div className="border-t border-white/10 pt-2 text-xs space-y-1">
                <div className="flex justify-between text-zinc-400">
                  <span>Current Balance:</span>
                  <span className="font-mono text-white">{coins.toLocaleString()} 🪙</span>
                </div>
                <div className="flex justify-between text-zinc-400">
                  <span>Remaining Balance:</span>
                  <span className="font-mono text-emerald-400">
                    {(coins - pendingPurchase.item.price).toLocaleString()} 🪙
                  </span>
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPendingPurchase(null)}
                className="flex-1 py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 font-bold text-xs uppercase"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmPurchase}
                className="flex-1 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black font-black text-xs uppercase shadow-lg shadow-amber-500/30"
              >
                Confirm Purchase ⚡
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CELEBRATION UNLOCK MODAL */}
      {celebrationItem && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-gradient-to-b from-zinc-900 via-slate-900 to-black border-2 border-amber-500/60 w-full max-w-md rounded-3xl p-6 text-white text-center shadow-2xl space-y-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 p-0.5 mx-auto animate-bounce flex items-center justify-center text-black font-black text-2xl shadow-xl">
              🎉
            </div>

            <h3 className="text-2xl font-black uppercase text-amber-300 tracking-wider">Purchase Successful!</h3>
            <p className="text-xs text-zinc-300">
              You unlocked <span className="font-bold text-amber-200">{celebrationItem.item.name}</span> and it has been automatically equipped!
            </p>

            <button
              onClick={() => setCelebrationItem(null)}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-black font-black text-xs uppercase tracking-wider shadow-lg shadow-amber-500/30"
            >
              Continue Playing 🚀
            </button>
          </div>
        </div>
      )}

      {/* WARNING TOAST */}
      {insufficientWarning && (
        <div className="fixed bottom-6 right-6 z-50 bg-red-600 text-white px-5 py-3 rounded-2xl shadow-2xl font-bold text-xs border border-red-400 animate-bounce">
          ⚠️ {insufficientWarning}
        </div>
      )}
    </div>
  );
}
