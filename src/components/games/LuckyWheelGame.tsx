/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Shield, Crown,
  Coins, RotateCw, CheckCircle2, Lock, Eye, ShoppingBag, X, Check, Play, Layers,
  ArrowLeft, Gift, ArrowRight, Star, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface LuckyWheelProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// 8 BALANCED REWARD SEGMENTS
// ==========================================
export interface WheelSection {
  label: string;
  mult: number;
  type: 'multiplier' | 'lose' | 'retry' | 'bonus';
  icon: string;
  color: string;
  subtext?: string;
}

export const WHEEL_SECTIONS: WheelSection[] = [
  { label: '×1', mult: 1.0, type: 'multiplier', icon: '🪙', color: '#eab308', subtext: 'Break Even' },
  { label: '×3', mult: 3.0, type: 'multiplier', icon: '⭐', color: '#3b82f6', subtext: 'Triple' },
  { label: '×5', mult: 5.0, type: 'multiplier', icon: '👑', color: '#f59e0b', subtext: 'Jackpot' },
  { label: 'Lose', mult: 0.0, type: 'lose', icon: '❌', color: '#ef4444', subtext: 'No Win' },
  { label: '×2', mult: 2.0, type: 'multiplier', icon: '💎', color: '#10b981', subtext: 'Double' },
  { label: 'Retry', mult: 0.0, type: 'retry', icon: '🔄', color: '#a855f7', subtext: 'Free Spin' },
  { label: '×4', mult: 4.0, type: 'multiplier', icon: '🔮', color: '#ec4899', subtext: 'Quad' },
  { label: 'Bonus Spin', mult: 0.0, type: 'bonus', icon: '🎁', color: '#06b6d4', subtext: 'Bonus Free' },
];

// ==========================================
// 14 EXPANDED UNIQUE UNLOCKABLE WHEEL THEMES
// ==========================================
export interface WheelTheme {
  id: string;
  name: string;
  price: number;
  collection: 'standard' | 'premium';
  desc: string;
  rewardStyle: string;
  previewEmoji: string;
  sliceGradients: string[];
  rimBorderColor: string;
  rimGlowColor: string;
  ledColors: [string, string];
  centerHubGradient: string;
  centerTextColor: string;
  pointerColor: string;
  pointerGlow: string;
  bgGradient: string;
  particleColor: string;
  winThemeColor: string;
}

export const WHEEL_THEMES: WheelTheme[] = [
  // --- Standard Collection (50 - 150 Coins) ---
  {
    id: 'sparkle',
    name: 'Sparkle Stream Wheel',
    price: 0,
    collection: 'standard',
    desc: 'Vibrant multi-color neon arcade wheel with glowing LED bulbs and emerald pointer',
    rewardStyle: 'Neon Arcade Sparkles & Coin Explosion',
    previewEmoji: '🎡',
    sliceGradients: ['#eab308', '#3b82f6', '#f59e0b', '#dc2626', '#10b981', '#a855f7', '#ec4899', '#06b6d4'],
    rimBorderColor: '#f43f5e',
    rimGlowColor: 'rgba(244,63,94,0.7)',
    ledColors: ['#f43f5e', '#fbbf24'],
    centerHubGradient: '#eab308',
    centerTextColor: '#000000',
    pointerColor: '#34d399',
    pointerGlow: 'rgba(52,211,153,0.9)',
    bgGradient: 'from-zinc-950 via-pink-950/30 to-black',
    particleColor: '#fbbf24',
    winThemeColor: '#fbbf24',
  },
  {
    id: 'royal_gold',
    name: 'Royal Gold Wheel',
    price: 10,
    collection: 'standard',
    desc: 'Imperial 24K gold and onyx luxury wheel with warm ambient VIP lighting',
    rewardStyle: 'Golden Coin Shower & Crown Sparkles',
    previewEmoji: '👑',
    sliceGradients: ['#d97706', '#18181b', '#fbbf24', '#7f1d1d', '#f59e0b', '#27272a', '#fef08a', '#92400e'],
    rimBorderColor: '#fbbf24',
    rimGlowColor: 'rgba(251,191,36,0.8)',
    ledColors: ['#fbbf24', '#ffffff'],
    centerHubGradient: '#f59e0b',
    centerTextColor: '#000000',
    pointerColor: '#fbbf24',
    pointerGlow: 'rgba(251,191,36,1)',
    bgGradient: 'from-zinc-950 via-amber-950/40 to-black',
    particleColor: '#fbbf24',
    winThemeColor: '#fbbf24',
  },
  {
    id: 'cyber',
    name: 'Neon Cyber Wheel',
    price: 20,
    collection: 'standard',
    desc: 'Sci-fi holographic wheel with pulsing laser lights and plasma cyan trim',
    rewardStyle: 'Cyber Laser Grid & Binary Sparkles',
    previewEmoji: '⚡',
    sliceGradients: ['#06b6d4', '#3b82f6', '#8b5cf6', '#991b1b', '#10b981', '#ec4899', '#6366f1', '#14b8a6'],
    rimBorderColor: '#22d3ee',
    rimGlowColor: 'rgba(34,211,238,0.8)',
    ledColors: ['#22d3ee', '#e879f9'],
    centerHubGradient: '#06b6d4',
    centerTextColor: '#ffffff',
    pointerColor: '#22d3ee',
    pointerGlow: 'rgba(34,211,238,1)',
    bgGradient: 'from-zinc-950 via-cyan-950/40 to-black',
    particleColor: '#22d3ee',
    winThemeColor: '#22d3ee',
  },
  {
    id: 'galaxy',
    name: 'Galaxy Wheel',
    price: 30,
    collection: 'standard',
    desc: 'Celestial deep nebula wheel with starlight halos and cosmic dark purple hue',
    rewardStyle: 'Cosmic Starfield & Supernova Flash',
    previewEmoji: '🌌',
    sliceGradients: ['#8b5cf6', '#6366f1', '#d946ef', '#881337', '#3b82f6', '#a855f7', '#ec4899', '#0284c7'],
    rimBorderColor: '#c084fc',
    rimGlowColor: 'rgba(192,132,252,0.8)',
    ledColors: ['#c084fc', '#38bdf8'],
    centerHubGradient: '#a855f7',
    centerTextColor: '#ffffff',
    pointerColor: '#e879f9',
    pointerGlow: 'rgba(232,121,249,1)',
    bgGradient: 'from-zinc-950 via-purple-950/40 to-black',
    particleColor: '#c084fc',
    winThemeColor: '#c084fc',
  },
  {
    id: 'crystal',
    name: 'Crystal Ice Wheel',
    price: 40,
    collection: 'standard',
    desc: 'Frosted glacial diamond wheel with glowing ice crystal facets and arctic blue LEDs',
    rewardStyle: 'Frost Prism Burst & Diamond Glitter',
    previewEmoji: '❄️',
    sliceGradients: ['#38bdf8', '#0284c7', '#7dd3fc', '#991b1b', '#06b6d4', '#818cf8', '#38bdf8', '#0ea5e9'],
    rimBorderColor: '#7dd3fc',
    rimGlowColor: 'rgba(125,211,252,0.8)',
    ledColors: ['#7dd3fc', '#ffffff'],
    centerHubGradient: '#38bdf8',
    centerTextColor: '#000000',
    pointerColor: '#bae6fd',
    pointerGlow: 'rgba(186,230,253,1)',
    bgGradient: 'from-zinc-950 via-sky-950/40 to-black',
    particleColor: '#7dd3fc',
    winThemeColor: '#7dd3fc',
  },
  {
    id: 'fire',
    name: 'Molten Fire Wheel',
    price: 50,
    collection: 'standard',
    desc: 'Volcanic magma wheel with fiery embers, molten gold rim, and blazing crimson lights',
    rewardStyle: 'Solar Flare Burst & Volcanic Sparks',
    previewEmoji: '🔥',
    sliceGradients: ['#f97316', '#ef4444', '#eab308', '#7f1d1d', '#10b981', '#dc2626', '#f59e0b', '#b91c1c'],
    rimBorderColor: '#f97316',
    rimGlowColor: 'rgba(249,115,22,0.8)',
    ledColors: ['#f97316', '#fef08a'],
    centerHubGradient: '#ea580c',
    centerTextColor: '#ffffff',
    pointerColor: '#fbbf24',
    pointerGlow: 'rgba(251,191,36,1)',
    bgGradient: 'from-zinc-950 via-red-950/40 to-black',
    particleColor: '#f97316',
    winThemeColor: '#f97316',
  },
  {
    id: 'diamond',
    name: 'Platinum Diamond Wheel',
    price: 60,
    collection: 'standard',
    desc: 'High-roller silver platinum wheel with white-hot beam reflections and crystal trim',
    rewardStyle: 'Platinum Diamond Rain & Prismatic Beams',
    previewEmoji: '💎',
    sliceGradients: ['#e2e8f0', '#94a3b8', '#38bdf8', '#475569', '#34d399', '#c084fc', '#f43f5e', '#cbd5e1'],
    rimBorderColor: '#f8fafc',
    rimGlowColor: 'rgba(248,250,252,0.9)',
    ledColors: ['#ffffff', '#94a3b8'],
    centerHubGradient: '#cbd5e1',
    centerTextColor: '#0f172a',
    pointerColor: '#ffffff',
    pointerGlow: 'rgba(255,255,255,1)',
    bgGradient: 'from-zinc-950 via-slate-900/50 to-black',
    particleColor: '#ffffff',
    winThemeColor: '#ffffff',
  },

  // --- Premium Collection (70 - 130 Coins) ---
  {
    id: 'emerald',
    name: 'Emerald Fortune Wheel',
    price: 70,
    collection: 'premium',
    desc: 'Royal jade emerald wheel infused with ancient fortune runes and glowing gold leaf trim',
    rewardStyle: 'Emerald Sparkle Rain & Jade Aura',
    previewEmoji: '❇️',
    sliceGradients: ['#10b981', '#047857', '#fbbf24', '#991b1b', '#059669', '#34d399', '#f59e0b', '#065f46'],
    rimBorderColor: '#34d399',
    rimGlowColor: 'rgba(52,211,153,0.8)',
    ledColors: ['#34d399', '#fef08a'],
    centerHubGradient: '#10b981',
    centerTextColor: '#ffffff',
    pointerColor: '#fef08a',
    pointerGlow: 'rgba(254,240,138,1)',
    bgGradient: 'from-zinc-950 via-emerald-950/40 to-black',
    particleColor: '#34d399',
    winThemeColor: '#34d399',
  },
  {
    id: 'ocean',
    name: 'Ocean Treasure Wheel',
    price: 80,
    collection: 'premium',
    desc: 'Deep oceanic sapphire wheel with bioluminescent sea pearls and tide reflections',
    rewardStyle: 'Tidal Wave Coin Shower & Pearl Rays',
    previewEmoji: '🌊',
    sliceGradients: ['#0284c7', '#0369a1', '#06b6d4', '#991b1b', '#10b981', '#38bdf8', '#0284c7', '#0891b2'],
    rimBorderColor: '#38bdf8',
    rimGlowColor: 'rgba(56,189,248,0.8)',
    ledColors: ['#38bdf8', '#a5f3fc'],
    centerHubGradient: '#0284c7',
    centerTextColor: '#ffffff',
    pointerColor: '#67e8f9',
    pointerGlow: 'rgba(103,232,249,1)',
    bgGradient: 'from-zinc-950 via-blue-950/40 to-black',
    particleColor: '#38bdf8',
    winThemeColor: '#38bdf8',
  },
  {
    id: 'aurora',
    name: 'Aurora Crystal Wheel',
    price: 90,
    collection: 'premium',
    desc: 'Mystical northern lights borealis wheel with shifting pastel prism gradients',
    rewardStyle: 'Aurora Wave Beams & Starlight Glow',
    previewEmoji: '🌈',
    sliceGradients: ['#22d3ee', '#a855f7', '#f43f5e', '#7f1d1d', '#34d399', '#fbbf24', '#818cf8', '#06b6d4'],
    rimBorderColor: '#f472b6',
    rimGlowColor: 'rgba(244,114,182,0.85)',
    ledColors: ['#f472b6', '#38bdf8'],
    centerHubGradient: '#c084fc',
    centerTextColor: '#ffffff',
    pointerColor: '#f472b6',
    pointerGlow: 'rgba(244,114,182,1)',
    bgGradient: 'from-zinc-950 via-fuchsia-950/40 to-black',
    particleColor: '#f472b6',
    winThemeColor: '#f472b6',
  },
  {
    id: 'dragon',
    name: 'Dragon Flame Wheel',
    price: 100,
    collection: 'premium',
    desc: 'Mythic crimson dragon wheel with molten gold scales and burning pyre sparks',
    rewardStyle: 'Dragon Flame Explosion & Ruby Shards',
    previewEmoji: '🐲',
    sliceGradients: ['#dc2626', '#991b1b', '#f59e0b', '#450a0a', '#ef4444', '#b91c1c', '#fbbf24', '#7f1d1d'],
    rimBorderColor: '#ef4444',
    rimGlowColor: 'rgba(239,68,68,0.9)',
    ledColors: ['#ef4444', '#fef08a'],
    centerHubGradient: '#b91c1c',
    centerTextColor: '#ffffff',
    pointerColor: '#f59e0b',
    pointerGlow: 'rgba(245,158,11,1)',
    bgGradient: 'from-zinc-950 via-rose-950/50 to-black',
    particleColor: '#ef4444',
    winThemeColor: '#ef4444',
  },
  {
    id: 'mystic',
    name: 'Mystic Galaxy Wheel',
    price: 110,
    collection: 'premium',
    desc: 'Deep space dark matter wheel with violet pulsar cores and starburst constellations',
    rewardStyle: 'Void Nova Burst & Starlight Shower',
    previewEmoji: '🔮',
    sliceGradients: ['#a855f7', '#7e22ce', '#ec4899', '#581c87', '#3b82f6', '#d946ef', '#c084fc', '#6b21a8'],
    rimBorderColor: '#e879f9',
    rimGlowColor: 'rgba(232,121,249,0.85)',
    ledColors: ['#e879f9', '#818cf8'],
    centerHubGradient: '#9333ea',
    centerTextColor: '#ffffff',
    pointerColor: '#e879f9',
    pointerGlow: 'rgba(232,121,249,1)',
    bgGradient: 'from-zinc-950 via-purple-950/50 to-black',
    particleColor: '#e879f9',
    winThemeColor: '#e879f9',
  },
  {
    id: 'casino',
    name: 'Royal Casino Elite Wheel',
    price: 120,
    collection: 'premium',
    desc: 'Ultra luxury Las Vegas VIP suite wheel with polished gold studs and velvet accents',
    rewardStyle: 'Jackpot Coin Explosion & VIP Champagne Rays',
    previewEmoji: '🎰',
    sliceGradients: ['#fbbf24', '#18181b', '#d97706', '#991b1b', '#f59e0b', '#27272a', '#fef08a', '#b45309'],
    rimBorderColor: '#f59e0b',
    rimGlowColor: 'rgba(245,158,11,0.95)',
    ledColors: ['#fef08a', '#f59e0b'],
    centerHubGradient: '#d97706',
    centerTextColor: '#000000',
    pointerColor: '#fef08a',
    pointerGlow: 'rgba(254,240,138,1)',
    bgGradient: 'from-zinc-950 via-amber-900/40 to-black',
    particleColor: '#fbbf24',
    winThemeColor: '#fbbf24',
  },
  {
    id: 'prestige',
    name: 'Ultimate Diamond Prestige Wheel',
    price: 130,
    collection: 'premium',
    desc: 'The pinnacle of luxury. Solid pure diamond halo with radiant white laser refractions',
    rewardStyle: 'Super Diamond Nova & Grand Jackpot Celebration',
    previewEmoji: '👑',
    sliceGradients: ['#ffffff', '#cbd5e1', '#38bdf8', '#475569', '#34d399', '#f472b6', '#fbbf24', '#e2e8f0'],
    rimBorderColor: '#ffffff',
    rimGlowColor: 'rgba(255,255,255,1)',
    ledColors: ['#ffffff', '#e2e8f0'],
    centerHubGradient: '#f8fafc',
    centerTextColor: '#0f172a',
    pointerColor: '#ffffff',
    pointerGlow: 'rgba(255,255,255,1)',
    bgGradient: 'from-zinc-950 via-slate-800/60 to-black',
    particleColor: '#ffffff',
    winThemeColor: '#ffffff',
  },
];

const JACKPOT_ICONS = ['🎰', '💎', '🧩', '⭐', '🎯', '🎲', '👑', '🎁', '🪙'];

export function LuckyWheel({ coins, onGameWin, onGameLose }: LuckyWheelProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Game states
  const [coinsToPay, setCoinsToPay] = useState<number>(10);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);
  const [winResult, setWinResult] = useState<{
    section: WheelSection;
    amount: number;
  } | null>(null);
  const [freeSpins, setFreeSpins] = useState<number>(0);
  const [loseEffect, setLoseEffect] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Vault/Collection states
  const [showVault, setShowVault] = useState<boolean>(false);
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('lucky_wheel_unlocked_themes');
      return saved ? JSON.parse(saved) : ['sparkle'];
    } catch {
      return ['sparkle'];
    }
  });
  const [activeThemeId, setActiveThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('lucky_wheel_active_theme') || 'sparkle';
    } catch {
      return 'sparkle';
    }
  });
  const [confirmPurchaseTheme, setConfirmPurchaseTheme] = useState<WheelTheme | null>(null);

  // Animated Jackpot Badge Index
  const [jackpotIconIdx, setJackpotIconIdx] = useState<number>(0);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animFrameRef = useRef<number | null>(null);
  const rotationRef = useRef<number>(0);

  const currentTheme = WHEEL_THEMES.find(t => t.id === activeThemeId) || WHEEL_THEMES[0];

  // BGM Life Cycle
  useEffect(() => {
    synth.startBgm('lucky_wheel');
    return () => {
      synth.stopBgm();
    };
  }, []);

  // Save unlocked & active themes
  useEffect(() => {
    try {
      localStorage.setItem('lucky_wheel_unlocked_themes', JSON.stringify(unlockedThemes));
      localStorage.setItem('lucky_wheel_active_theme', activeThemeId);
    } catch { /* Suppress */ }
  }, [unlockedThemes, activeThemeId]);

  // Animated Jackpot Icon Cycle
  useEffect(() => {
    const timer = setInterval(() => {
      setJackpotIconIdx(prev => (prev + 1) % JACKPOT_ICONS.length);
    }, 2500);
    return () => clearInterval(timer);
  }, []);

  // Sync rotationRef
  useEffect(() => {
    rotationRef.current = rotation;
  }, [rotation]);

  // Toast Auto-dismiss
  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(() => setToastMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage]);

  // ==========================================
  // CANVAS RENDER LOOP (60 FPS AAA GRAPHICS)
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      const width = canvas.width;
      const height = canvas.height;
      const centerX = width / 2;
      const centerY = height / 2;
      const radius = Math.min(centerX, centerY) - 26;

      ctx.clearRect(0, 0, width, height);

      // --- Ambient Particles around Rim (Idle / Spin) ---
      for (let i = 0; i < 12; i++) {
        const pAngle = time * 0.5 + (i * Math.PI) / 6;
        const pDist = radius + 12 + Math.sin(time * 2 + i) * 6;
        const px = centerX + Math.cos(pAngle) * pDist;
        const py = centerY + Math.sin(pAngle) * pDist;
        ctx.beginPath();
        ctx.arc(px, py, 2 + Math.sin(time * 3 + i) * 1, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.particleColor;
        ctx.globalAlpha = 0.4 + Math.sin(time * 2 + i) * 0.3;
        ctx.fill();
        ctx.globalAlpha = 1.0;
      }

      // --- Outer Metallic Frame & Glow ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 18, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.shadowColor = currentTheme.rimGlowColor;
      ctx.shadowBlur = spinning ? 28 : 18;
      ctx.fill();

      // Outer Rim Metallic Border
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius + 16, 0, Math.PI * 2);
      ctx.lineWidth = 10;
      ctx.strokeStyle = currentTheme.rimBorderColor;
      ctx.stroke();
      ctx.restore();

      // --- Glowing Animated LEDs Around Rim ---
      const totalLeds = 24;
      for (let i = 0; i < totalLeds; i++) {
        const angle = (i * Math.PI * 2) / totalLeds;
        const lx = centerX + Math.cos(angle) * (radius + 11);
        const ly = centerY + Math.sin(angle) * (radius + 11);

        const ledOn = Math.floor(time * 12 + i) % 2 === 0;
        const ledColor = ledOn ? currentTheme.ledColors[0] : currentTheme.ledColors[1];

        ctx.save();
        ctx.beginPath();
        ctx.arc(lx, ly, 4.5, 0, Math.PI * 2);
        ctx.fillStyle = ledColor;
        ctx.shadowColor = ledColor;
        ctx.shadowBlur = ledOn ? 12 : 3;
        ctx.fill();
        ctx.restore();
      }

      // --- Slices Drawing ---
      const numSlices = WHEEL_SECTIONS.length;
      const sliceAngle = (Math.PI * 2) / numSlices;
      const currentRot = rotationRef.current;

      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(currentRot);

      WHEEL_SECTIONS.forEach((sec, i) => {
        const startAngle = i * sliceAngle;
        const endAngle = startAngle + sliceAngle;

        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.arc(0, 0, radius, startAngle, endAngle);
        ctx.closePath();

        // Gradient Fill
        const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, radius);
        const sliceBaseColor = currentTheme.sliceGradients[i % currentTheme.sliceGradients.length];
        grad.addColorStop(0, '#ffffff');
        grad.addColorStop(0.35, sec.color || sliceBaseColor);
        grad.addColorStop(1, sliceBaseColor);

        ctx.fillStyle = grad;
        ctx.fill();

        // Slice Separators
        ctx.lineWidth = 2.5;
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
        ctx.stroke();

        // Slice Content (Icon & Label)
        ctx.save();
        ctx.rotate(startAngle + sliceAngle / 2);
        ctx.textAlign = 'right';
        ctx.textBaseline = 'middle';

        // Draw Icon Graphic
        ctx.font = 'bold 22px sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.8)';
        ctx.shadowBlur = 4;
        ctx.fillText(sec.icon, radius - 16, 0);

        // Draw Label Text
        ctx.fillStyle = '#ffffff';
        ctx.font = '900 17px system-ui, sans-serif';
        ctx.shadowColor = 'rgba(0,0,0,0.9)';
        ctx.shadowBlur = 6;
        ctx.fillText(sec.label, radius - 48, 0);

        ctx.restore();
      });

      // --- Rotating Glossy Light Reflection Across Surface ---
      const refGrad = ctx.createLinearGradient(-radius, -radius, radius, radius);
      const refAlpha = 0.12 + Math.sin(time * 2) * 0.05;
      refGrad.addColorStop(0, `rgba(255, 255, 255, ${refAlpha * 1.5})`);
      refGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      refGrad.addColorStop(1, `rgba(255, 255, 255, ${refAlpha})`);

      ctx.beginPath();
      ctx.arc(0, 0, radius - 2, 0, Math.PI * 2);
      ctx.fillStyle = refGrad;
      ctx.fill();

      ctx.restore(); // Restore center rotate translate

      // --- Center Hub & SPIN Button ---
      ctx.save();
      ctx.beginPath();
      ctx.arc(centerX, centerY, 38, 0, Math.PI * 2);
      ctx.fillStyle = '#0f172a';
      ctx.shadowColor = currentTheme.rimGlowColor;
      ctx.shadowBlur = 12;
      ctx.fill();

      ctx.beginPath();
      ctx.arc(centerX, centerY, 32, 0, Math.PI * 2);
      const hubGrad = ctx.createLinearGradient(centerX - 30, centerY - 30, centerX + 30, centerY + 30);
      hubGrad.addColorStop(0, '#ffffff');
      hubGrad.addColorStop(0.4, currentTheme.centerHubGradient);
      hubGrad.addColorStop(1, '#000000');
      ctx.fillStyle = hubGrad;
      ctx.fill();
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = currentTheme.centerTextColor;
      ctx.font = '900 13px system-ui, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.6)';
      ctx.shadowBlur = 3;
      ctx.fillText(spinning ? 'SPIN...' : 'SPIN', centerX, centerY);
      ctx.restore();

      // --- Pointer / Needle (Top Gold Crystal Pointer) ---
      ctx.save();
      ctx.translate(centerX, centerY - radius - 12);

      // Pointer Bounce Effect on Tick
      const pY = Math.sin(time * 15) * (spinning ? 2 : 0.5);
      ctx.translate(0, pY);

      ctx.beginPath();
      ctx.moveTo(-16, -18);
      ctx.lineTo(16, -18);
      ctx.lineTo(0, 22);
      ctx.closePath();

      const pGrad = ctx.createLinearGradient(-10, -18, 10, 22);
      pGrad.addColorStop(0, '#ffffff');
      pGrad.addColorStop(0.5, currentTheme.pointerColor);
      pGrad.addColorStop(1, '#9a3412');

      ctx.fillStyle = pGrad;
      ctx.shadowColor = currentTheme.pointerGlow;
      ctx.shadowBlur = 14;
      ctx.fill();

      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#ffffff';
      ctx.stroke();

      // Pointer Gem Pin
      ctx.beginPath();
      ctx.arc(0, -10, 5, 0, Math.PI * 2);
      ctx.fillStyle = '#ffffff';
      ctx.fill();

      ctx.restore();

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animFrameRef.current) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [currentTheme, spinning]);

  // ==========================================
  // SPIN LOGIC & WIN / LOSE CALCULATION
  // ==========================================
  const handleSpin = () => {
    if (spinning) return;

    // Determine coin cost
    const isFree = freeSpins > 0;
    if (!isFree) {
      if (!validateAndDeductCoins(coinsToPay, 'Lucky Wheel')) {
        return;
      }
    } else {
      setFreeSpins(prev => prev - 1);
    }

    setSpinning(true);
    setWinResult(null);
    setLoseEffect(false);
    synth.playSpinWheel();

    // Random landing segment
    const winningIdx = Math.floor(Math.random() * WHEEL_SECTIONS.length);
    const numSlices = WHEEL_SECTIONS.length;
    const sliceAngle = (Math.PI * 2) / numSlices;

    // Calculate rotation angle to align slice with pointer (top center = -PI/2)
    const targetSliceAngle = winningIdx * sliceAngle + sliceAngle / 2;
    const targetAngle = -Math.PI / 2 - targetSliceAngle;

    const currentNorm = rotationRef.current % (Math.PI * 2);
    const fullRotations = (5 + Math.floor(Math.random() * 3)) * Math.PI * 2;
    const finalRotation = rotationRef.current + (fullRotations + targetAngle - currentNorm);

    const startTime = performance.now();
    const duration = 3800; // 3.8s spin
    const startRot = rotationRef.current;
    let lastTickIdx = -1;

    const animateSpin = (now: number) => {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // Smooth ease-out cubic curve
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const currentR = startRot + (finalRotation - startRot) * easeOut;

      setRotation(currentR);

      // Play tick sounds as sections pass
      const normR = (-currentR - Math.PI / 2) % (Math.PI * 2);
      const adjustedR = normR < 0 ? normR + Math.PI * 2 : normR;
      const currentSliceIdx = Math.floor(adjustedR / sliceAngle) % numSlices;

      if (currentSliceIdx !== lastTickIdx) {
        lastTickIdx = currentSliceIdx;
        synth.playTick();
      }

      if (progress < 1) {
        requestAnimationFrame(animateSpin);
      } else {
        // Spin complete
        setSpinning(false);
        const wonSec = WHEEL_SECTIONS[winningIdx];

        if (wonSec.type === 'multiplier') {
          const winAmount = Math.min(50, Math.floor(coinsToPay * wonSec.mult));
          if (winAmount > 0) {
            onGameWin(winAmount, wonSec.mult);
            if (wonSec.mult >= 4) {
              synth.playFanfare();
            } else {
              synth.playCoin();
            }
          }
          setWinResult({
            section: wonSec,
            amount: winAmount,
          });
        } else if (wonSec.type === 'retry') {
          synth.playSparkle();
          setFreeSpins(prev => prev + 1);
          setToastMessage('🔄 RETRY! Free Spin Granted!');
        } else if (wonSec.type === 'bonus') {
          synth.playTreasure();
          setFreeSpins(prev => prev + 1);
          setToastMessage('🎁 BONUS SPIN! +1 Free Spin Awarded!');
        } else if (wonSec.type === 'lose') {
          synth.playLoss();
          setLoseEffect(true);
          setToastMessage('❌ Better luck next spin!');
        }
      }
    };

    requestAnimationFrame(animateSpin);
  };

  // ==========================================
  // PURCHASE THEME FLOW
  // ==========================================
  const handlePurchaseTheme = (theme: WheelTheme) => {
    if (unlockedThemes.includes(theme.id)) {
      // Equip immediately
      setActiveThemeId(theme.id);
      synth.playClick();
      setToastMessage(`✔ ${theme.name} Equipped!`);
      setShowVault(false);
      return;
    }

    if (coins < theme.price) {
      synth.playError();
      setToastMessage(`⚠️ You need ${theme.price} Coins to buy this wheel.`);
      return;
    }

    setConfirmPurchaseTheme(theme);
  };

  const confirmPurchase = () => {
    if (!confirmPurchaseTheme) return;
    const theme = confirmPurchaseTheme;

    // Deduct cost
    onGameLose(theme.price);

    // Save unlock
    const updated = [...unlockedThemes, theme.id];
    setUnlockedThemes(updated);
    setActiveThemeId(theme.id);

    synth.playUpgradeSuccess();
    setConfirmPurchaseTheme(null);
    setShowVault(false); // Return instantly to game screen
    setToastMessage(`🎉 Purchased & Equipped ${theme.name}!`);
  };

  return (
    <div className={`min-h-screen bg-gradient-to-b ${currentTheme.bgGradient} text-white font-sans transition-colors duration-500 pb-12`}>
      {/* --- Top Header Bar --- */}
      <div className="max-w-xl mx-auto px-4 pt-4 pb-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl shadow-lg text-black font-black text-lg">
            🎰
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500">
              LUCKY WHEEL
            </h1>
            <p className="text-xs text-zinc-400 font-medium">Arcade Machine</p>
          </div>
        </div>

        {/* Coins Wallet Badge */}
        <div className="flex items-center gap-2 px-3.5 py-1.5 bg-zinc-900/90 border border-amber-500/40 rounded-full shadow-lg">
          <Coins className="w-4 h-4 text-amber-400 animate-bounce" />
          <span className="font-extrabold text-amber-300 text-sm">{coins.toLocaleString()}</span>
        </div>
      </div>

      {/* --- Active Wheel Banner & Animated Jackpot Vault Card --- */}
      <div className="max-w-xl mx-auto px-4 my-2">
        <div className="p-3.5 bg-gradient-to-r from-zinc-900/90 via-zinc-800/80 to-zinc-900/90 border border-amber-500/30 rounded-2xl shadow-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {/* Animated Jackpot Badge */}
            <div className="relative w-11 h-11 bg-zinc-950 border border-amber-400/50 rounded-xl flex items-center justify-center shadow-inner overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.span
                  key={jackpotIconIdx}
                  initial={{ opacity: 0, scale: 0.5, rotate: -20 }}
                  animate={{ opacity: 1, scale: 1, rotate: 0 }}
                  exit={{ opacity: 0, scale: 0.5, rotate: 20 }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl"
                >
                  {JACKPOT_ICONS[jackpotIconIdx]}
                </motion.span>
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-to-tr from-amber-500/10 to-transparent pointer-events-none" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-0.5 bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Active Wheel
                </span>
                {freeSpins > 0 && (
                  <span className="px-2 py-0.5 bg-purple-500/30 text-purple-300 border border-purple-400/30 text-[10px] font-extrabold rounded-full animate-pulse">
                    🎁 {freeSpins} Free Spin{freeSpins > 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <h2 className="text-sm font-extrabold text-white flex items-center gap-1.5 mt-0.5">
                <span>{currentTheme.previewEmoji}</span>
                <span>{currentTheme.name}</span>
              </h2>
            </div>
          </div>

          {/* Vault Button */}
          <button
            onClick={() => {
              synth.playClick();
              setShowVault(true);
            }}
            className="px-3.5 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs rounded-xl shadow-lg hover:shadow-amber-500/25 transition-all flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Vault ({unlockedThemes.length}/14)</span>
          </button>
        </div>
      </div>

      {/* --- Floating Toast Notification --- */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.9 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 bg-zinc-900/95 border border-amber-400/60 rounded-full shadow-2xl backdrop-blur-md text-amber-200 text-xs font-extrabold flex items-center gap-2 pointer-events-none"
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-spin" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* --- Main Game Stage --- */}
      <div className="max-w-xl mx-auto px-4 mt-2 flex flex-col items-center">
        {/* Canvas Wheel Wrapper with Shake animation on Lose */}
        <motion.div
          animate={loseEffect ? { x: [-12, 12, -8, 8, -4, 4, 0] } : {}}
          transition={{ duration: 0.5 }}
          className="relative my-2"
        >
          <canvas
            ref={canvasRef}
            width={340}
            height={340}
            className="w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] drop-shadow-[0_0_35px_rgba(245,158,11,0.25)]"
          />
        </motion.div>

        {/* --- Coins to Pay Section --- */}
        <div className="w-full max-w-sm mt-3 p-4 bg-zinc-900/80 border border-zinc-800 rounded-2xl shadow-xl backdrop-blur-sm">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-amber-400" />
              <span>Coins to Pay</span>
            </span>
            <span className="text-xs font-extrabold text-amber-300">
              {freeSpins > 0 ? 'FREE SPIN ACTIVE' : `${coinsToPay} Coins`}
            </span>
          </div>

          {/* Quick Amount Buttons */}
          <div className="grid grid-cols-5 gap-1.5 mb-3">
            {[10, 25, 50, 100, 250].map((amt) => (
              <button
                key={amt}
                disabled={spinning}
                onClick={() => {
                  synth.playClick();
                  setCoinsToPay(amt);
                }}
                className={`py-1.5 rounded-lg text-xs font-extrabold transition-all border ${
                  coinsToPay === amt && freeSpins === 0
                    ? 'bg-amber-500 text-black border-amber-400 shadow-md scale-105'
                    : 'bg-zinc-800/80 text-zinc-300 border-zinc-700/60 hover:bg-zinc-700'
                }`}
              >
                {amt}
              </button>
            ))}
          </div>

          {/* SPIN BUTTON */}
          <button
            disabled={spinning}
            onClick={handleSpin}
            className={`w-full py-3.5 rounded-xl font-black text-base uppercase tracking-wider shadow-2xl transition-all flex items-center justify-center gap-2 border ${
              spinning
                ? 'bg-zinc-800 text-zinc-500 border-zinc-700 cursor-not-allowed'
                : 'bg-gradient-to-r from-amber-400 via-yellow-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black border-amber-300 hover:shadow-amber-500/40 active:scale-95'
            }`}
          >
            <RotateCw className={`w-5 h-5 ${spinning ? 'animate-spin' : ''}`} />
            <span>{spinning ? 'SPINNING...' : freeSpins > 0 ? 'USE FREE SPIN' : `SPIN (${coinsToPay} COINS)`}</span>
          </button>
        </div>
      </div>

      {/* ==========================================
          FULL SCREEN WIN CELEBRATION MODAL
         ========================================== */}
      <AnimatePresence>
        {winResult && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md"
            onClick={() => setWinResult(null)}
          >
            {/* Sunburst Rays */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/20 via-transparent to-transparent animate-pulse pointer-events-none" />

            <motion.div
              initial={{ scale: 0.6, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.6, y: 30 }}
              className="relative w-full max-w-sm p-6 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border-2 border-amber-400/80 rounded-3xl shadow-[0_0_60px_rgba(251,191,36,0.35)] text-center overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Confetti Particle Sparkles */}
              <div className="absolute -top-10 -left-10 w-32 h-32 bg-amber-400/20 rounded-full blur-2xl pointer-events-none" />
              <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl pointer-events-none" />

              <div className="relative z-10">
                <div className="w-16 h-16 mx-auto mb-3 bg-gradient-to-br from-amber-300 to-amber-600 rounded-2xl flex items-center justify-center text-3xl shadow-xl animate-bounce">
                  {winResult.section.icon}
                </div>

                <h3 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 uppercase tracking-wide">
                  🎉 CONGRATULATIONS!
                </h3>

                <p className="text-xs text-zinc-400 font-bold mt-1 uppercase tracking-wider">
                  Multiplied by {winResult.section.label}
                </p>

                <div className="my-5 p-4 bg-zinc-900/90 border border-amber-500/40 rounded-2xl shadow-inner">
                  <span className="text-xs font-bold text-zinc-400 uppercase">You Won</span>
                  <div className="text-3xl font-black text-amber-300 mt-1 flex items-center justify-center gap-2">
                    <Coins className="w-7 h-7 text-amber-400 animate-spin" />
                    <span>+{winResult.amount.toLocaleString()}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    synth.playClick();
                    setWinResult(null);
                  }}
                  className="w-full py-3.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-black text-sm rounded-xl uppercase tracking-wider shadow-xl transition-all"
                >
                  COLLECT REWARD
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          VAULT COLLECTION & STORE MODAL (14 WHEELS)
         ========================================== */}
      <AnimatePresence>
        {showVault && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed inset-0 z-50 bg-zinc-950 text-white overflow-y-auto"
          >
            {/* Header with Back Button */}
            <div className="sticky top-0 z-20 px-4 py-3 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800 flex items-center justify-between">
              <button
                onClick={() => {
                  synth.playClick();
                  setShowVault(false);
                }}
                className="p-2.5 bg-zinc-900 hover:bg-zinc-800 border border-zinc-700/80 rounded-xl text-zinc-200 transition-all flex items-center gap-2 font-bold text-xs"
              >
                <ArrowLeft className="w-4 h-4 text-amber-400" />
                <span>Back to Game</span>
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-amber-300">
                  {unlockedThemes.length} / 14 Unlocked
                </span>
                <div className="px-3 py-1 bg-zinc-900 border border-amber-500/30 rounded-full flex items-center gap-1.5">
                  <Coins className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-extrabold text-amber-300">{coins}</span>
                </div>
              </div>
            </div>

            <div className="max-w-xl mx-auto px-4 py-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-200 to-amber-500 uppercase tracking-wide">
                  LUCKY WHEEL VAULT
                </h2>
                <p className="text-xs text-zinc-400 mt-1 font-medium">
                  Unlock premium wheels with distinct artwork & rewards
                </p>
              </div>

              {/* --- Standard Collection (50 - 150 Coins) --- */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-3">
                  <Star className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-extrabold text-amber-300 uppercase tracking-wider">
                    Standard Collection
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {WHEEL_THEMES.filter(t => t.collection === 'standard').map((theme) => {
                    const isUnlocked = unlockedThemes.includes(theme.id);
                    const isActive = activeThemeId === theme.id;

                    return (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-gradient-to-b from-amber-950/40 via-zinc-900 to-black border-amber-400 shadow-lg shadow-amber-500/10'
                            : isUnlocked
                            ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                            : 'bg-zinc-950/80 border-zinc-900 opacity-80'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                                {theme.previewEmoji}
                              </span>
                              <div>
                                <h4 className="text-xs font-extrabold text-white">{theme.name}</h4>
                                <span className="text-[10px] text-zinc-400 font-medium">{theme.rewardStyle}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{theme.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-amber-300">
                            {theme.price === 0 ? 'FREE' : `${theme.price} Coins`}
                          </span>

                          <button
                            onClick={() => handlePurchaseTheme(theme)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                              isActive
                                ? 'bg-amber-500 text-black cursor-default'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                : 'bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>EQUIPPED</span>
                              </>
                            ) : isUnlocked ? (
                              <span>EQUIP</span>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>BUY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* --- Premium Collection (150 - 300 Coins) --- */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-4 h-4 text-purple-400" />
                  <h3 className="text-sm font-extrabold text-purple-300 uppercase tracking-wider">
                    Premium Collection
                  </h3>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {WHEEL_THEMES.filter(t => t.collection === 'premium').map((theme) => {
                    const isUnlocked = unlockedThemes.includes(theme.id);
                    const isActive = activeThemeId === theme.id;

                    return (
                      <div
                        key={theme.id}
                        className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                          isActive
                            ? 'bg-gradient-to-b from-purple-950/40 via-zinc-900 to-black border-purple-400 shadow-lg shadow-purple-500/10'
                            : isUnlocked
                            ? 'bg-zinc-900/80 border-zinc-800 hover:border-zinc-700'
                            : 'bg-zinc-950/80 border-zinc-900 opacity-80'
                        }`}
                      >
                        <div>
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="text-2xl p-2 bg-zinc-950 rounded-xl border border-zinc-800">
                                {theme.previewEmoji}
                              </span>
                              <div>
                                <h4 className="text-xs font-extrabold text-white">{theme.name}</h4>
                                <span className="text-[10px] text-zinc-400 font-medium">{theme.rewardStyle}</span>
                              </div>
                            </div>
                          </div>

                          <p className="text-[11px] text-zinc-400 mb-3 leading-relaxed">{theme.desc}</p>
                        </div>

                        <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between">
                          <span className="text-xs font-extrabold text-purple-300">
                            {theme.price} Coins
                          </span>

                          <button
                            onClick={() => handlePurchaseTheme(theme)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-extrabold transition-all flex items-center gap-1 ${
                              isActive
                                ? 'bg-purple-500 text-white cursor-default'
                                : isUnlocked
                                ? 'bg-zinc-800 hover:bg-zinc-700 text-white'
                                : 'bg-gradient-to-r from-purple-500 to-indigo-500 hover:from-purple-400 hover:to-indigo-400 text-white'
                            }`}
                          >
                            {isActive ? (
                              <>
                                <Check className="w-3.5 h-3.5" />
                                <span>EQUIPPED</span>
                              </>
                            ) : isUnlocked ? (
                              <span>EQUIP</span>
                            ) : (
                              <>
                                <Lock className="w-3 h-3" />
                                <span>BUY</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ==========================================
          PURCHASE CONFIRMATION DIALOG MODAL
         ========================================== */}
      <AnimatePresence>
        {confirmPurchaseTheme && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            onClick={() => setConfirmPurchaseTheme(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="w-full max-w-xs p-5 bg-zinc-900 border border-zinc-700 rounded-2xl shadow-2xl text-center"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="text-4xl">{confirmPurchaseTheme.previewEmoji}</span>
              <h3 className="text-base font-extrabold text-white mt-2">
                Unlock {confirmPurchaseTheme.name}?
              </h3>
              <p className="text-xs text-zinc-400 mt-1 mb-4">
                This will deduct <span className="text-amber-300 font-extrabold">{confirmPurchaseTheme.price} Coins</span> from your wallet.
              </p>

              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => setConfirmPurchaseTheme(null)}
                  className="py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 font-bold text-xs rounded-xl transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  className="py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-extrabold text-xs rounded-xl shadow-lg transition-all"
                >
                  Confirm ({confirmPurchaseTheme.price})
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
