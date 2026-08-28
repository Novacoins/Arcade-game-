/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Star, ShieldCheck, Flame, Zap, Award, Gift,
  ChevronRight, RefreshCw, Layers, CheckCircle2, Lock, ArrowUpRight,
  Anchor, Play, RotateCcw, Crosshair, Check, X, ArrowLeft, ShoppingBag
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FishingFrenzyProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

// ==========================================
// REBALANCED SLOT SYMBOLS (Max Reward ~120 Coins)
// ==========================================
export const SLOT_SYMBOLS = [
  { id: 'gold_fish', icon: '🐠', label: 'Golden Fish', mult: 3, color: 'text-amber-400', glow: '#f59e0b' },
  { id: 'treasure_chest', icon: '🏴‍☠️', label: 'Treasure Chest', mult: 8, color: 'text-yellow-300', glow: '#eab308' },
  { id: 'pearl', icon: '🦪', label: 'Pearl', mult: 5, color: 'text-cyan-200', glow: '#06b6d4' },
  { id: 'starfish', icon: '⭐', label: 'Starfish', mult: 2, color: 'text-orange-400', glow: '#f97316' },
  { id: 'dolphin', icon: '🐬', label: 'Dolphin', mult: 6, color: 'text-blue-300', glow: '#3b82f6' },
  { id: 'golden_hook', icon: '🪝', label: 'Golden Hook', mult: 4, color: 'text-yellow-400', glow: '#eab308' },
  { id: 'anchor', icon: '⚓', label: 'Anchor', mult: 3, color: 'text-slate-300', glow: '#94a3b8' },
  { id: 'crab', icon: '🦀', label: 'Crab', mult: 2, color: 'text-rose-400', glow: '#f43f5e' },
  { id: 'coral', icon: '🪸', label: 'Coral', mult: 1, color: 'text-pink-400', glow: '#ec4899' },
  { id: 'crown', icon: '👑', label: 'Royal Crown', mult: 10, color: 'text-amber-300', glow: '#f59e0b' },
  { id: 'diamond_shell', icon: '💎', label: 'Diamond Shell', mult: 12, color: 'text-fuchsia-300', glow: '#d946ef' },
  { id: 'ocean_coin', icon: '🪙', label: 'Ocean Coin', mult: 1, color: 'text-yellow-400', glow: '#eab308' },
];

// ==========================================
// REEL THEMES (AFFORDABLE PRICES: 50 - 150 COINS)
// ==========================================
export const REEL_THEMES = [
  {
    id: 'ocean_gold',
    name: 'Ocean Gold',
    price: 50,
    desc: 'Shimmering 24K oceanic gold reel frame with warm ambient glow.',
    bgGrad: 'from-amber-950/80 via-zinc-950 to-black',
    border: 'border-amber-400/70 shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    buttonGrad: 'from-amber-400 via-yellow-400 to-amber-500',
    previewColor: '#f59e0b',
    emoji: '👑',
  },
  {
    id: 'crystal_reef',
    name: 'Crystal Reef',
    price: 70,
    desc: 'Prismatic cyan reef crystal borders with sparkling reflections.',
    bgGrad: 'from-cyan-950/80 via-teal-950 to-black',
    border: 'border-cyan-400/70 shadow-[0_0_30px_rgba(6,182,212,0.3)]',
    buttonGrad: 'from-cyan-400 via-teal-400 to-blue-500',
    previewColor: '#06b6d4',
    emoji: '💎',
  },
  {
    id: 'royal_treasure',
    name: 'Royal Treasure',
    price: 90,
    desc: 'Imperial golden treasure chest frame with glowing rubies.',
    bgGrad: 'from-yellow-950/80 via-amber-950 to-black',
    border: 'border-yellow-400/70 shadow-[0_0_30px_rgba(234,179,8,0.3)]',
    buttonGrad: 'from-yellow-400 via-amber-400 to-yellow-500',
    previewColor: '#eab308',
    emoji: '🏴‍☠️',
  },
  {
    id: 'neon_ocean',
    name: 'Neon Ocean',
    price: 110,
    desc: 'Synthwave hot pink synth reel grid with neon glow strips.',
    bgGrad: 'from-fuchsia-950/80 via-purple-950 to-black',
    border: 'border-fuchsia-400/70 shadow-[0_0_30px_rgba(217,70,239,0.3)]',
    buttonGrad: 'from-fuchsia-400 via-pink-400 to-purple-500',
    previewColor: '#d946ef',
    emoji: '⚡',
  },
  {
    id: 'pirate_bay',
    name: 'Pirate Bay',
    price: 130,
    desc: 'Ancient sea captain oak wood & polished brass doubloons.',
    bgGrad: 'from-stone-900 via-amber-950 to-black',
    border: 'border-amber-600/70 shadow-[0_0_30px_rgba(217,119,6,0.3)]',
    buttonGrad: 'from-amber-500 via-yellow-600 to-amber-700',
    previewColor: '#d97706',
    emoji: '⚓',
  },
  {
    id: 'deep_blue',
    name: 'Deep Blue',
    price: 150,
    desc: 'Abyssal deep sea indigo theme with bioluminescent water rays.',
    bgGrad: 'from-blue-950/90 via-indigo-950 to-black',
    border: 'border-blue-400/70 shadow-[0_0_30px_rgba(59,130,246,0.3)]',
    buttonGrad: 'from-blue-400 via-sky-400 to-indigo-500',
    previewColor: '#3b82f6',
    emoji: '🌊',
  },
  {
    id: 'golden_kingdom',
    name: 'Golden Kingdom',
    price: 50,
    desc: 'Majestic golden palace trim with radiant sunlight aura.',
    bgGrad: 'from-amber-900/80 via-zinc-950 to-black',
    border: 'border-yellow-500/70 shadow-[0_0_30px_rgba(245,158,11,0.3)]',
    buttonGrad: 'from-yellow-400 via-amber-400 to-yellow-500',
    previewColor: '#fbbf24',
    emoji: '🔱',
  },
  {
    id: 'luxury_coral',
    name: 'Luxury Coral',
    price: 70,
    desc: 'Vibrant coral reef glass with soft pink underwater lighting.',
    bgGrad: 'from-pink-950/80 via-rose-950 to-black',
    border: 'border-pink-400/70 shadow-[0_0_30px_rgba(244,114,182,0.3)]',
    buttonGrad: 'from-pink-400 via-rose-400 to-fuchsia-500',
    previewColor: '#f472b6',
    emoji: '🪸',
  },
  {
    id: 'frozen_sea',
    name: 'Frozen Sea',
    price: 90,
    desc: 'Arctic glacial frost frame with shimmering ice crystals.',
    bgGrad: 'from-sky-950/90 via-slate-950 to-black',
    border: 'border-sky-300/70 shadow-[0_0_30px_rgba(125,211,252,0.3)]',
    buttonGrad: 'from-sky-300 via-blue-400 to-sky-500',
    previewColor: '#7dd3fc',
    emoji: '❄️',
  },
  {
    id: 'galaxy_ocean',
    name: 'Galaxy Ocean',
    price: 110,
    desc: 'Starlight nebula cosmic ocean grid with glowing dust trails.',
    bgGrad: 'from-purple-950/90 via-violet-950 to-black',
    border: 'border-purple-400/70 shadow-[0_0_30px_rgba(192,132,252,0.3)]',
    buttonGrad: 'from-purple-400 via-fuchsia-400 to-violet-500',
    previewColor: '#c084fc',
    emoji: '🌌',
  },
];

// ==========================================
// MACHINE DESIGNS (AFFORDABLE PRICES: 50 - 150 COINS)
// ==========================================
export const MACHINE_STYLES = [
  {
    id: 'golden_casino',
    name: 'Golden Casino',
    price: 50,
    desc: 'Classic VIP casino cabinet with golden arches & royal crown topper.',
    frameClass: 'border-amber-500/60 bg-zinc-950/95 shadow-[0_0_40px_rgba(245,158,11,0.25)]',
    badge: '👑 Royal',
    headerGrad: 'from-amber-400 via-yellow-500 to-amber-600',
    previewEmoji: '🎰',
  },
  {
    id: 'royal_black',
    name: 'Royal Black',
    price: 70,
    desc: 'Sleek matte onyx cabinet with 24K gold accents & velvet interior.',
    frameClass: 'border-zinc-400/60 bg-black shadow-[0_0_40px_rgba(255,255,255,0.15)]',
    badge: '🖤 Luxury',
    headerGrad: 'from-zinc-200 via-stone-400 to-zinc-600',
    previewEmoji: '🖤',
  },
  {
    id: 'crystal_machine',
    name: 'Crystal Machine',
    price: 90,
    desc: 'Carved aquamarine sea crystal body with translucent reflections.',
    frameClass: 'border-cyan-400/60 bg-cyan-950/90 shadow-[0_0_40px_rgba(6,182,212,0.25)]',
    badge: '💎 Crystal',
    headerGrad: 'from-cyan-400 via-teal-400 to-blue-500',
    previewEmoji: '💎',
  },
  {
    id: 'cyber_gold',
    name: 'Cyber Gold',
    price: 110,
    desc: 'Futuristic cyberpunk gold chassis with neon matrix HUD indicators.',
    frameClass: 'border-yellow-400/60 bg-zinc-950 shadow-[0_0_40px_rgba(234,179,8,0.25)]',
    badge: '⚡ Cyber',
    headerGrad: 'from-yellow-300 via-amber-400 to-amber-600',
    previewEmoji: '⚡',
  },
  {
    id: 'luxury_diamond',
    name: 'Luxury Diamond',
    price: 130,
    desc: 'Solid platinum diamond-cut cabinet with rainbow light refraction.',
    frameClass: 'border-indigo-300/70 bg-indigo-950/90 shadow-[0_0_50px_rgba(165,180,252,0.3)]',
    badge: '✨ Diamond',
    headerGrad: 'from-indigo-200 via-sky-300 to-purple-400',
    previewEmoji: '✨',
  },
  {
    id: 'ocean_blue',
    name: 'Ocean Blue',
    price: 150,
    desc: 'Sapphire ocean vessel with flowing blue liquid light columns.',
    frameClass: 'border-blue-400/60 bg-blue-950/90 shadow-[0_0_40px_rgba(59,130,246,0.25)]',
    badge: '🌊 Ocean',
    headerGrad: 'from-blue-400 via-sky-400 to-indigo-500',
    previewEmoji: '🌊',
  },
  {
    id: 'galaxy_machine',
    name: 'Galaxy Machine',
    price: 50,
    desc: 'Deep cosmos starlight casing with pulsating violet nebula flares.',
    frameClass: 'border-purple-400/60 bg-purple-950/90 shadow-[0_0_40px_rgba(168,85,247,0.25)]',
    badge: '🌌 Galaxy',
    headerGrad: 'from-purple-300 via-fuchsia-400 to-purple-600',
    previewEmoji: '🌌',
  },
  {
    id: 'platinum_edition',
    name: 'Platinum Edition',
    price: 70,
    desc: 'Polished titanium silver cabinet with high-contrast LED trim.',
    frameClass: 'border-slate-300/70 bg-slate-950 shadow-[0_0_40px_rgba(203,213,225,0.25)]',
    badge: '🥈 Platinum',
    headerGrad: 'from-slate-200 via-zinc-300 to-slate-500',
    previewEmoji: '🏛️',
  },
  {
    id: 'neon_premium',
    name: 'Neon Premium',
    price: 90,
    desc: 'Hot magenta arcade cabinet with reactive sound-responsive neon.',
    frameClass: 'border-pink-500/60 bg-zinc-950 shadow-[0_0_40px_rgba(236,72,153,0.3)]',
    badge: '🌸 Neon',
    headerGrad: 'from-pink-400 via-rose-400 to-fuchsia-600',
    previewEmoji: '🌸',
  },
  {
    id: 'elite_treasure',
    name: 'Elite Treasure',
    price: 110,
    desc: 'Pirate captain compass cabinet with brass gears & golden trims.',
    frameClass: 'border-amber-700/70 bg-amber-950/90 shadow-[0_0_40px_rgba(180,83,9,0.3)]',
    badge: '🏴‍☠️ Pirate',
    headerGrad: 'from-amber-500 via-yellow-600 to-amber-800',
    previewEmoji: '🏴‍☠️',
  },
];

export function FishingFrenzyGame({ coins, onGameWin, onGameLose }: FishingFrenzyProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  // Mode switcher ('slots' | 'adventure')
  const [activeGameMode, setActiveGameMode] = useState<'slots' | 'adventure'>('slots');

  // Slots Game State
  const [bet, setBet] = useState<number>(10);
  const [reels, setReels] = useState<number[]>([0, 1, 2]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [lastWin, setLastWin] = useState<{ amount: number; mult: number; symbolLabel: string } | null>(null);

  // Customization & Unlocked Items
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ff_unlocked_themes');
      return saved ? JSON.parse(saved) : ['ocean_gold'];
    } catch { return ['ocean_gold']; }
  });
  const [selectedThemeId, setSelectedThemeId] = useState<string>(() => {
    try {
      return localStorage.getItem('ff_selected_theme') || 'ocean_gold';
    } catch { return 'ocean_gold'; }
  });

  const [unlockedMachines, setUnlockedMachines] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('ff_unlocked_machines');
      return saved ? JSON.parse(saved) : ['golden_casino'];
    } catch { return ['golden_casino']; }
  });
  const [selectedMachineId, setSelectedMachineId] = useState<string>(() => {
    try {
      return localStorage.getItem('ff_selected_machine') || 'golden_casino';
    } catch { return 'golden_casino'; }
  });

  // Modals State
  const [showThemeModal, setShowThemeModal] = useState<boolean>(false);
  const [showMachineModal, setShowMachineModal] = useState<boolean>(false);
  
  // Purchase Flow State
  const [confirmItem, setConfirmItem] = useState<{ type: 'theme' | 'machine'; item: any } | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Simple Top Stats: Spins & Daily Streak
  const [stats, setStats] = useState(() => {
    try {
      const saved = localStorage.getItem('ff_stats');
      return saved ? JSON.parse(saved) : { totalSpins: 0, dailyStreak: 1 };
    } catch { return { totalSpins: 0, dailyStreak: 1 }; }
  });

  useEffect(() => {
    localStorage.setItem('ff_stats', JSON.stringify(stats));
  }, [stats]);

  // Floating Particles
  const [floatingParticles, setFloatingParticles] = useState<{ id: number; x: number; y: number; text: string }[]>([]);

  // Background Canvas Ref
  const bgCanvasRef = useRef<HTMLCanvasElement | null>(null);

  // BGM AUTOPLAY: start on enter, stop on leave
  useEffect(() => {
    synth.startBgm('fishing_frenzy');
    return () => {
      synth.stopBgm();
    };
  }, []);

  // Save selection states
  useEffect(() => {
    localStorage.setItem('ff_unlocked_themes', JSON.stringify(unlockedThemes));
    localStorage.setItem('ff_selected_theme', selectedThemeId);
  }, [unlockedThemes, selectedThemeId]);

  useEffect(() => {
    localStorage.setItem('ff_unlocked_machines', JSON.stringify(unlockedMachines));
    localStorage.setItem('ff_selected_machine', selectedMachineId);
  }, [unlockedMachines, selectedMachineId]);

  const currentTheme = REEL_THEMES.find(t => t.id === selectedThemeId) || REEL_THEMES[0];
  const currentMachine = MACHINE_STYLES.find(m => m.id === selectedMachineId) || MACHINE_STYLES[0];

  // ==========================================
  // SUBTLE UNDERWATER BACKGROUND ANIMATION
  // ==========================================
  useEffect(() => {
    const canvas = bgCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas || !canvas.parentElement) return;
      width = canvas.width = canvas.parentElement.clientWidth;
      height = canvas.height = canvas.parentElement.clientHeight;
    };
    window.addEventListener('resize', handleResize);

    const bubbles = Array.from({ length: 25 }, () => ({
      x: Math.random() * width,
      y: Math.random() * height + height,
      r: Math.random() * 3 + 1.5,
      speed: Math.random() * 0.7 + 0.3,
      oscillation: Math.random() * 0.02,
      phase: Math.random() * Math.PI * 2,
    }));

    const fishes = Array.from({ length: 5 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.7) + height * 0.15,
      speed: (Math.random() * 0.5 + 0.3) * (Math.random() > 0.5 ? 1 : -1),
      size: Math.random() * 10 + 7,
    }));

    let frame = 0;

    const render = () => {
      frame++;
      ctx.clearRect(0, 0, width, height);

      // Deep Ocean Gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, height);
      oceanGrad.addColorStop(0, '#0284c7');
      oceanGrad.addColorStop(0.4, '#0369a1');
      oceanGrad.addColorStop(0.8, '#0f172a');
      oceanGrad.addColorStop(1, '#020617');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, width, height);

      // Subtle Caustics / Light Rays
      ctx.save();
      ctx.globalAlpha = 0.06;
      ctx.fillStyle = '#7dd3fc';
      for (let i = 0; i < 4; i++) {
        const rayX = (width / 3) * i + Math.sin(frame * 0.01 + i) * 25;
        ctx.beginPath();
        ctx.moveTo(rayX, 0);
        ctx.lineTo(rayX + 100, height);
        ctx.lineTo(rayX - 30, height);
        ctx.closePath();
        ctx.fill();
      }
      ctx.restore();

      // Swaying Seaweed
      ctx.save();
      ctx.strokeStyle = '#0d9488';
      ctx.lineWidth = 2.5;
      ctx.globalAlpha = 0.25;
      for (let i = 20; i < width; i += 45) {
        ctx.beginPath();
        ctx.moveTo(i, height);
        const sway = Math.sin(frame * 0.02 + i) * 12;
        ctx.quadraticCurveTo(i + sway, height - 35, i + sway / 2, height - 70);
        ctx.stroke();
      }
      ctx.restore();

      // Swimming Fish Silhouettes
      ctx.save();
      ctx.fillStyle = '#38bdf8';
      ctx.globalAlpha = 0.2;
      fishes.forEach((f) => {
        f.x += f.speed;
        if (f.x > width + 30) f.x = -30;
        if (f.x < -30) f.x = width + 30;

        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.size, f.size / 2, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        const tailDir = f.speed > 0 ? -1 : 1;
        ctx.moveTo(f.x + tailDir * f.size, f.y);
        ctx.lineTo(f.x + tailDir * (f.size + 7), f.y - 4);
        ctx.lineTo(f.x + tailDir * (f.size + 7), f.y + 4);
        ctx.closePath();
        ctx.fill();
      });
      ctx.restore();

      // Rising Bubbles
      ctx.save();
      ctx.fillStyle = 'rgba(255, 255, 255, 0.2)';
      bubbles.forEach((b) => {
        b.y -= b.speed;
        b.x += Math.sin(frame * b.oscillation + b.phase) * 0.4;
        if (b.y < -10) {
          b.y = height + 10;
          b.x = Math.random() * width;
        }
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.restore();

      animId = requestAnimationFrame(render);
    };

    animId = requestAnimationFrame(render);
    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // ==========================================
  // NOVA ROYAL SLOTS SPIN HANDLER
  // ==========================================
  const handleSpinSlots = () => {
    if (spinning) return;

    if (!validateAndDeductCoins(bet, 'Fishing Frenzy')) {
      return;
    }

    synth.playSplash();
    setSpinning(true);
    setLastWin(null);

    setStats(prev => ({ ...prev, totalSpins: prev.totalSpins + 1 }));

    let ticks = 0;
    const interval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
        Math.floor(Math.random() * SLOT_SYMBOLS.length),
      ]);
      synth.playTick();
      ticks++;

      if (ticks >= 16) {
        clearInterval(interval);

        const r1 = Math.floor(Math.random() * SLOT_SYMBOLS.length);
        const r2 = Math.floor(Math.random() * SLOT_SYMBOLS.length);
        const r3 = Math.floor(Math.random() * SLOT_SYMBOLS.length);

        setReels([r1, r2, r3]);
        setSpinning(false);

        let winMult = 0;
        let symbolLabel = '';

        if (r1 === r2 && r2 === r3) {
          const sym = SLOT_SYMBOLS[r1];
          winMult = Math.min(10, sym.mult * 2); // Cap multiplier
          symbolLabel = sym.label;
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          const matchedIdx = (r1 === r2 || r1 === r3) ? r1 : r2;
          const sym = SLOT_SYMBOLS[matchedIdx];
          winMult = Math.max(1, Math.floor(sym.mult / 2));
          symbolLabel = sym.label;
        }

        if (winMult > 0) {
          // Cap payout at max ~120 coins
          const payout = Math.min(120, Math.floor(bet * winMult));

          if (winMult >= 5) {
            synth.playFanfare();
          } else {
            synth.playCoin();
          }

          setLastWin({ amount: payout, mult: winMult, symbolLabel });
          onGameWin(payout, winMult);

          setFloatingParticles(prev => [
            ...prev,
            { id: Date.now(), x: Math.random() * 150 + 100, y: 150, text: `+${payout} 🪙` }
          ]);
        } else {
          synth.playError();
        }
      }
    }, 90);
  };

  // Execute Purchase Theme or Machine
  const handlePurchase = () => {
    if (!confirmItem) return;
    const { type, item } = confirmItem;

    if (!validateAndDeductCoins(item.price, 'Fishing Frenzy Item')) {
      return;
    }

    synth.playChestOpen();

    if (type === 'theme') {
      setUnlockedThemes(prev => [...prev, item.id]);
      setSelectedThemeId(item.id);
    } else {
      setUnlockedMachines(prev => [...prev, item.id]);
      setSelectedMachineId(item.id);
    }

    setConfirmItem(null);
    setShowThemeModal(false);
    setShowMachineModal(false);

    setSuccessMessage(`✅ Purchase Successful! Your new ${type === 'theme' ? 'Reel Theme' : 'Machine Design'} has been equipped.`);

    setTimeout(() => {
      setSuccessMessage(null);
    }, 2000);
  };

  return (
    <div className="relative min-h-screen text-white select-none overflow-x-hidden font-sans pb-12">
      
      {/* Underwater Background Canvas */}
      <canvas ref={bgCanvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-80" />

      {/* Floating Particles Container */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {floatingParticles.map((pt) => (
          <motion.div
            key={pt.id}
            initial={{ opacity: 1, y: pt.y, x: pt.x, scale: 0.8 }}
            animate={{ opacity: 0, y: pt.y - 80, scale: 1.2 }}
            transition={{ duration: 1.8 }}
            className="absolute font-black text-amber-300 text-sm sm:text-base drop-shadow-[0_0_10px_rgba(245,158,11,0.8)]"
          >
            {pt.text}
          </motion.div>
        ))}
      </div>

      {/* PURCHASE SUCCESS POPUP */}
      <AnimatePresence>
        {successMessage && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          >
            <div className="bg-gradient-to-b from-zinc-900 to-black p-6 rounded-3xl border-2 border-amber-400 text-center space-y-3 max-w-xs w-full shadow-[0_0_40px_rgba(245,158,11,0.4)]">
              <div className="text-5xl animate-bounce">🎉</div>
              <h3 className="text-sm font-black text-amber-300 uppercase tracking-wider">
                Purchase Successful!
              </h3>
              <p className="text-xs text-gray-300 font-bold leading-relaxed">
                {successMessage}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="relative z-10 max-w-xl mx-auto px-4 py-5 space-y-5">

        {/* TOP HEADER: TITLES & CLEAN TOP STATS */}
        <div className="bg-zinc-950/80 p-4 rounded-3xl border border-cyan-500/30 shadow-2xl backdrop-blur-xl flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-500 to-blue-600 p-0.5 shadow-lg flex items-center justify-center">
              <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl">
                🐠
              </div>
            </div>
            <div>
              <h1 className="text-base font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-amber-300">
                Fishing Frenzy
              </h1>
              <p className="text-[10px] text-gray-400 font-bold">Nova Royal Arcade</p>
            </div>
          </div>

          {/* CLEAN TOP STATS (ONLY SPINS & DAILY STREAK) */}
          <div className="flex items-center gap-2">
            <div className="bg-zinc-900/90 border border-white/10 px-3 py-1.5 rounded-2xl text-center">
              <span className="block text-[8px] font-black text-gray-400 uppercase">Spins</span>
              <span className="text-xs font-black text-cyan-300 font-mono">{stats.totalSpins}</span>
            </div>
            <div className="bg-zinc-900/90 border border-white/10 px-3 py-1.5 rounded-2xl text-center">
              <span className="block text-[8px] font-black text-gray-400 uppercase">Daily Streak</span>
              <span className="text-xs font-black text-amber-400 font-mono">🔥 {stats.dailyStreak}d</span>
            </div>
          </div>
        </div>

        {/* GAME MODE SWITCHER & LARGE THEME / MACHINE BUTTONS */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { synth.playClick(); setActiveGameMode('slots'); }}
              className={`py-3.5 px-4 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                activeGameMode === 'slots'
                  ? 'bg-amber-500 text-black border-amber-400 shadow-lg shadow-amber-500/20'
                  : 'bg-zinc-900/80 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <span>🎰 Nova Slots</span>
            </button>

            <button
              onClick={() => { synth.playClick(); setActiveGameMode('adventure'); }}
              className={`py-3.5 px-4 rounded-2xl border font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer ${
                activeGameMode === 'adventure'
                  ? 'bg-cyan-400 text-black border-cyan-300 shadow-lg shadow-cyan-500/20'
                  : 'bg-zinc-900/80 text-gray-400 border-white/10 hover:text-white'
              }`}
            >
              <span>🪝 Treasure Adventure</span>
            </button>
          </div>

          {/* LARGE STORE BUTTONS FOR MOBILE */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => { synth.playClick(); setShowThemeModal(true); }}
              className="py-3 px-4 rounded-2xl bg-zinc-900/90 border border-amber-500/40 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition cursor-pointer shadow-md"
            >
              <Layers className="h-4 w-4 text-amber-400" />
              <span>Reel Themes</span>
            </button>

            <button
              onClick={() => { synth.playClick(); setShowMachineModal(true); }}
              className="py-3 px-4 rounded-2xl bg-zinc-900/90 border border-fuchsia-500/40 text-fuchsia-300 text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-zinc-800 transition cursor-pointer shadow-md"
            >
              <Sparkles className="h-4 w-4 text-fuchsia-400" />
              <span>Machine Designs</span>
            </button>
          </div>
        </div>

        {/* ACTIVE GAME MODE CONTENT */}
        <AnimatePresence mode="wait">
          {activeGameMode === 'slots' ? (
            /* ==========================================
               MODE 1: NOVA ROYAL SLOTS
               ========================================== */
            <motion.div
              key="slots"
              initial={{ opacity: 0, x: -15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 15 }}
              className="space-y-4"
            >
              <div className={`p-5 sm:p-6 rounded-3xl border-2 backdrop-blur-2xl transition-all duration-500 relative overflow-hidden ${currentMachine.frameClass}`}>
                
                {/* Machine Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black px-2.5 py-0.5 rounded-full bg-white/10 text-amber-300">
                      {currentMachine.badge}
                    </span>
                    <span className="text-[10px] font-black text-gray-300 uppercase tracking-widest">
                      Theme: {currentTheme.name}
                    </span>
                  </div>

                  <span className="text-xs font-black text-amber-400 font-mono">
                    🪙 {coins.toLocaleString()}
                  </span>
                </div>

                {/* Reels Grid */}
                <div className={`p-4 sm:p-5 rounded-3xl bg-gradient-to-b ${currentTheme.bgGrad} border-2 ${currentTheme.border} shadow-2xl relative overflow-hidden`}>
                  
                  <div className="grid grid-cols-3 gap-2 sm:gap-3 relative z-10">
                    {reels.map((symIdx, i) => {
                      const sym = SLOT_SYMBOLS[symIdx];
                      return (
                        <motion.div
                          key={i}
                          animate={spinning ? { y: [0, -10, 0] } : {}}
                          transition={{ repeat: Infinity, duration: 0.1 }}
                          className="h-28 sm:h-32 rounded-2xl bg-black/80 border border-white/10 flex flex-col items-center justify-center p-2 shadow-inner relative overflow-hidden"
                        >
                          <div 
                            className="text-4xl sm:text-5xl filter drop-shadow-[0_0_12px_var(--glow)]"
                            style={{ '--glow': sym.glow } as any}
                          >
                            {sym.icon}
                          </div>
                          <span className={`text-[9px] font-black uppercase tracking-wider mt-1.5 ${sym.color}`}>
                            {sym.label}
                          </span>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Last Win Notification */}
                {lastWin && (
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="mt-3 p-2.5 rounded-2xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-center font-black text-xs uppercase tracking-wider shadow"
                  >
                    🎉 Landed {lastWin.symbolLabel}! Won +{lastWin.amount} Coins 🪙
                  </motion.div>
                )}

                {/* Bet & Spin Controls */}
                <div className="mt-4 space-y-3">
                  <div className="bg-black/60 p-3 rounded-2xl border border-white/10 space-y-2">
                    <div className="flex justify-between items-center text-xs font-black">
                      <label className="uppercase text-amber-400">Coins to Bet</label>
                      <span className="text-gray-400 font-mono">Coins: {coins.toLocaleString()} 🪙</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        disabled={spinning}
                        value={bet}
                        onChange={(e) => setBet(Math.max(5, Math.min(coins, parseInt(e.target.value) || 0)))}
                        className="w-full text-center rounded-xl border border-white/10 bg-black py-2.5 text-sm font-mono font-black text-amber-300 focus:border-amber-400 outline-none"
                      />

                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => setBet(10)}
                          disabled={spinning}
                          className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
                        >
                          10
                        </button>
                        <button
                          onClick={() => setBet(25)}
                          disabled={spinning}
                          className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
                        >
                          25
                        </button>
                        <button
                          onClick={() => setBet(50)}
                          disabled={spinning}
                          className="py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase"
                        >
                          50
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* LARGE SPIN BUTTON */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSpinSlots}
                    disabled={spinning}
                    className={`w-full py-4 rounded-2xl text-black font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition-all bg-gradient-to-r ${currentTheme.buttonGrad || 'from-amber-400 via-yellow-400 to-amber-500'} disabled:opacity-50`}
                  >
                    <Play className="h-5 w-5 fill-current" />
                    <span>{spinning ? 'SPINNING REELS...' : '▶ SPIN REELS'}</span>
                  </motion.button>
                </div>

              </div>
            </motion.div>
          ) : (
            /* ==========================================
               MODE 2: OCEAN TREASURE ADVENTURE
               ========================================== */
            <motion.div
              key="adventure"
              initial={{ opacity: 0, x: 15 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -15 }}
              className="space-y-4"
            >
              <OceanTreasureAdventure
                coins={coins}
                onGameWin={onGameWin}
                onGameLose={onGameLose}
              />
            </motion.div>
          )}
        </AnimatePresence>

      </div>

      {/* REEL THEMES STORE MODAL */}
      <AnimatePresence>
        {showThemeModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-zinc-950 p-5 rounded-3xl border border-amber-500/40 max-w-lg w-full space-y-4 my-6 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Layers className="h-5 w-5 text-amber-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-amber-300">
                    Unlockable Reel Themes
                  </h3>
                </div>
                <button onClick={() => setShowThemeModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">
                  ✕
                </button>
              </div>

              {/* CARDS LIST FOR REEL THEMES */}
              <div className="grid grid-cols-1 gap-3">
                {REEL_THEMES.map((theme) => {
                  const isUnlocked = unlockedThemes.includes(theme.id);
                  const isEquipped = selectedThemeId === theme.id;

                  return (
                    <div
                      key={theme.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isEquipped
                          ? 'bg-amber-950/60 border-amber-400 text-white shadow-[0_0_20px_rgba(245,158,11,0.2)]'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950 border-white/5 opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl shadow">
                          {theme.emoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-2">
                            <span>{theme.name}</span>
                            {isEquipped && (
                              <span className="text-[9px] bg-amber-400 text-black px-2 py-0.5 rounded-full font-black uppercase">
                                EQUIPPED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{theme.desc}</p>
                          <span className="text-[10px] font-mono text-amber-400 font-bold">
                            Price: {theme.price} Coins
                          </span>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <span className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-1">
                            <Check className="h-4 w-4" /> Equipped
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              setSelectedThemeId(theme.id);
                              synth.playClick();
                              setShowThemeModal(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/50 text-amber-300 text-xs font-black uppercase hover:bg-amber-500/30 cursor-pointer"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmItem({ type: 'theme', item: theme })}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase hover:scale-105 active:scale-95 transition shadow cursor-pointer"
                          >
                            Buy {theme.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* MACHINE DESIGNS STORE MODAL */}
      <AnimatePresence>
        {showMachineModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <div className="bg-zinc-950 p-5 rounded-3xl border border-fuchsia-500/40 max-w-lg w-full space-y-4 my-6 max-h-[85vh] overflow-y-auto shadow-2xl">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-fuchsia-400" />
                  <h3 className="text-sm font-black uppercase tracking-wider text-fuchsia-300">
                    Slot Machine Designs
                  </h3>
                </div>
                <button onClick={() => setShowMachineModal(false)} className="text-gray-400 hover:text-white font-bold text-lg cursor-pointer">
                  ✕
                </button>
              </div>

              {/* CARDS LIST FOR MACHINE DESIGNS */}
              <div className="grid grid-cols-1 gap-3">
                {MACHINE_STYLES.map((m) => {
                  const isUnlocked = unlockedMachines.includes(m.id);
                  const isEquipped = selectedMachineId === m.id;

                  return (
                    <div
                      key={m.id}
                      className={`p-4 rounded-2xl border flex items-center justify-between gap-3 transition ${
                        isEquipped
                          ? 'bg-fuchsia-950/60 border-fuchsia-400 text-white shadow-[0_0_20px_rgba(217,70,239,0.2)]'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950 border-white/5 opacity-85'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-12 w-12 rounded-2xl bg-zinc-800 border border-white/10 flex items-center justify-center text-2xl shadow">
                          {m.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-2">
                            <span>{m.name}</span>
                            {isEquipped && (
                              <span className="text-[9px] bg-fuchsia-400 text-black px-2 py-0.5 rounded-full font-black uppercase">
                                EQUIPPED
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-gray-400 mt-0.5">{m.desc}</p>
                          <span className="text-[10px] font-mono text-fuchsia-400 font-bold">
                            Price: {m.price} Coins
                          </span>
                        </div>
                      </div>

                      <div>
                        {isEquipped ? (
                          <span className="text-[10px] font-black text-emerald-400 uppercase flex items-center gap-1">
                            <Check className="h-4 w-4" /> Equipped
                          </span>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              setSelectedMachineId(m.id);
                              synth.playClick();
                              setShowMachineModal(false);
                            }}
                            className="px-4 py-2 rounded-xl bg-fuchsia-500/20 border border-fuchsia-400/50 text-fuchsia-300 text-xs font-black uppercase hover:bg-fuchsia-500/30 cursor-pointer"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmItem({ type: 'machine', item: m })}
                            className="px-4 py-2 rounded-xl bg-gradient-to-r from-fuchsia-400 to-pink-500 text-white text-xs font-black uppercase hover:scale-105 active:scale-95 transition shadow cursor-pointer"
                          >
                            Buy {m.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* CONFIRMATION PURCHASE DIALOG */}
      <AnimatePresence>
        {confirmItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-amber-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl">{confirmItem.item.previewEmoji || confirmItem.item.emoji || '🪙'}</div>
              <h3 className="text-sm font-black text-white uppercase tracking-wider">
                Purchase this design for {confirmItem.item.price} Coins?
              </h3>
              <p className="text-xs text-gray-400">
                Item: <span className="text-amber-300 font-bold">{confirmItem.item.name}</span>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmItem(null)}
                  className="py-3 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-xs font-black text-gray-300 uppercase transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePurchase}
                  className="py-3 rounded-xl bg-amber-400 hover:bg-amber-300 text-black text-xs font-black uppercase shadow-lg transition cursor-pointer"
                >
                  Purchase
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

// ==========================================
// GAME MODE 2: OCEAN TREASURE ADVENTURE
// REDESIGNED WITH SWINGING HOOK & VISIBLE COIN BADGES
// ==========================================
function OceanTreasureAdventure({ coins, onGameWin, onGameLose }: FishingFrenzyProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Hook State: 'swinging' | 'dropping' | 'reeling' | 'caught'
  const [hookState, setHookState] = useState<'swinging' | 'dropping' | 'reeling' | 'caught'>('swinging');
  const [lastCaught, setLastCaught] = useState<{ label: string; icon: string; reward: number; xp: number } | null>(null);

  // Animated Target Objects swimming horizontally
  interface TargetObject {
    id: number;
    icon: string;
    label: string;
    reward: number; // e.g. 10, 20, 35, 50, 75, 100, 120
    xp: number;
    x: number;
    y: number;
    speed: number;
    width: number;
    height: number;
  }

  // Preset sea creatures with exact rewards
  const targetTypes = [
    { icon: '🐠', label: 'Small Fish', reward: 10, xp: 5 },
    { icon: '🐟', label: 'Medium Fish', reward: 20, xp: 8 },
    { icon: '🐡', label: 'Rare Fish', reward: 35, xp: 12 },
    { icon: '🦪', label: 'Pearl', reward: 50, xp: 15 },
    { icon: '🏴‍☠️', label: 'Treasure Chest', reward: 75, xp: 20 },
    { icon: '🪙', label: 'Golden Treasure', reward: 100, xp: 25 },
    { icon: '🦑', label: 'Legendary Catch', reward: 120, xp: 30 },
  ];

  const targetsRef = useRef<TargetObject[]>([]);
  const hookRef = useRef({ x: 200, y: 40, vy: 0, caughtItem: null as TargetObject | null });

  // Initialize Targets Grid at depth layers
  useEffect(() => {
    const canvasWidth = 380;
    const initialTargets: TargetObject[] = [];
    const layersY = [110, 160, 210, 260, 310];

    layersY.forEach((y, i) => {
      const type = targetTypes[i % targetTypes.length];
      initialTargets.push({
        id: Math.random(),
        icon: type.icon,
        label: type.label,
        reward: type.reward,
        xp: type.xp,
        x: Math.random() * (canvasWidth - 60) + 30,
        y,
        speed: (Math.random() * 1.2 + 0.6) * (i % 2 === 0 ? 1 : -1),
        width: 32,
        height: 32,
      });
    });

    targetsRef.current = initialTargets;
  }, []);

  // Drop Hook Handler
  const handleDropHook = () => {
    if (hookState !== 'swinging') return;

    synth.playClick();
    synth.playSplash();

    // Soft vibration
    if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
      try { window.navigator.vibrate(15); } catch { /* ignore */ }
    }

    setHookState('dropping');
    hookRef.current.vy = 6;
  };

  // Main Canvas Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let time = 0;

    const render = () => {
      time += 0.03;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Water Gradient
      const oceanGrad = ctx.createLinearGradient(0, 0, 0, canvas.height);
      oceanGrad.addColorStop(0, '#0284c7');
      oceanGrad.addColorStop(0.3, '#0369a1');
      oceanGrad.addColorStop(0.8, '#0f172a');
      oceanGrad.addColorStop(1, '#020617');
      ctx.fillStyle = oceanGrad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Surface Water Line
      ctx.fillStyle = 'rgba(125, 211, 252, 0.3)';
      ctx.fillRect(0, 0, canvas.width, 24);

      // Swinging Boat at top
      const boatX = canvas.width / 2 + Math.sin(time * 0.8) * 120;
      
      if (hookState === 'swinging') {
        hookRef.current.x = boatX;
        hookRef.current.y = 35;
      } else if (hookState === 'dropping') {
        hookRef.current.y += hookRef.current.vy;

        // Check collision with targets
        targetsRef.current.forEach((target) => {
          if (!hookRef.current.caughtItem) {
            const dx = hookRef.current.x - target.x;
            const dy = hookRef.current.y - target.y;
            const dist = Math.hypot(dx, dy);

            if (dist < 26) {
              // CAUGHT TARGET!
              hookRef.current.caughtItem = target;
              setHookState('reeling');
              synth.playChestOpen();
            }
          }
        });

        // Reached bottom ocean floor
        if (hookRef.current.y >= canvas.height - 40) {
          setHookState('reeling');
        }
      } else if (hookState === 'reeling') {
        hookRef.current.y -= 7;

        if (hookRef.current.caughtItem) {
          hookRef.current.caughtItem.x = hookRef.current.x;
          hookRef.current.caughtItem.y = hookRef.current.y + 15;
        }

        if (hookRef.current.y <= 35) {
          const caught = hookRef.current.caughtItem;
          if (caught) {
            setHookState('caught');
            setLastCaught({
              label: caught.label,
              icon: caught.icon,
              reward: caught.reward,
              xp: caught.xp,
            });

            onGameWin(caught.reward, 1);
            synth.playCoin();

            // Replace caught target in pool
            targetsRef.current = targetsRef.current.map(t => {
              if (t.id === caught.id) {
                const newType = targetTypes[Math.floor(Math.random() * targetTypes.length)];
                return {
                  ...t,
                  id: Math.random(),
                  icon: newType.icon,
                  label: newType.label,
                  reward: newType.reward,
                  xp: newType.xp,
                  x: Math.random() > 0.5 ? 20 : canvas.width - 20,
                };
              }
              return t;
            });
          } else {
            setHookState('swinging');
          }
          hookRef.current.caughtItem = null;
        }
      }

      // Draw Fishing Line from Boat to Hook
      ctx.strokeStyle = '#fde047';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(boatX, 20);
      ctx.lineTo(hookRef.current.x, hookRef.current.y);
      ctx.stroke();

      // Draw Boat Icon at Top
      ctx.font = '22px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('⛵', boatX, 20);

      // Draw Hook Icon
      ctx.font = '20px sans-serif';
      ctx.fillText('🪝', hookRef.current.x, hookRef.current.y + 10);

      // Update & Draw Targets swimming with VISIBLE REWARD BADGES!
      targetsRef.current.forEach((t) => {
        if (hookRef.current.caughtItem?.id !== t.id) {
          t.x += t.speed;
          if (t.x > canvas.width - 20) { t.x = canvas.width - 20; t.speed *= -1; }
          if (t.x < 20) { t.x = 20; t.speed *= -1; }
        }

        // Target Icon
        ctx.font = '24px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(t.icon, t.x, t.y + 8);

        // ALWAYS VISIBLE COIN REWARD BADGE ABOVE TARGET!
        const badgeText = `+${t.reward} 🪙`;
        ctx.font = 'bold 9px monospace';
        const textWidth = ctx.measureText(badgeText).width;

        // Badge Background Pill
        ctx.fillStyle = 'rgba(0, 0, 0, 0.75)';
        ctx.beginPath();
        ctx.roundRect(t.x - textWidth / 2 - 4, t.y - 18, textWidth + 8, 13, 6);
        ctx.fill();

        ctx.strokeStyle = '#f59e0b';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Badge Text
        ctx.fillStyle = '#fbbf24';
        ctx.fillText(badgeText, t.x, t.y - 8);
      });

      requestRef.current = requestAnimationFrame(render);
    };

    requestRef.current = requestAnimationFrame(render);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [hookState]);

  return (
    <div className="bg-zinc-950/90 p-4 sm:p-5 rounded-3xl border border-cyan-500/30 backdrop-blur-xl space-y-4 shadow-2xl">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div>
          <h3 className="text-sm font-black uppercase text-cyan-300 tracking-wider">
            Ocean Treasure Adventure
          </h3>
          <p className="text-[10px] text-gray-400 font-bold">
            Tap CATCH to drop the swinging hook!
          </p>
        </div>
        <div className="px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-400/30 text-cyan-300 text-xs font-black">
          🪙 {coins.toLocaleString()}
        </div>
      </div>

      {/* Arcade Canvas Screen */}
      <div className="rounded-2xl border-2 border-cyan-400/40 relative overflow-hidden bg-black shadow-inner flex flex-col items-center justify-center">
        <canvas
          ref={canvasRef}
          width={380}
          height={360}
          className="w-full aspect-[38/36] block"
        />

        {/* Catch Celebration Overlay */}
        {hookState === 'caught' && lastCaught && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="absolute inset-0 bg-black/85 backdrop-blur-sm flex flex-col items-center justify-center p-4 space-y-2 text-center z-30"
          >
            <div className="text-5xl animate-bounce">{lastCaught.icon}</div>
            <h4 className="text-sm font-black text-amber-300 uppercase">{lastCaught.label}!</h4>
            <div className="p-3 rounded-2xl bg-amber-500/20 border border-amber-400 text-amber-300 font-mono font-black text-sm">
              +{lastCaught.reward} Coins 🪙 ({lastCaught.xp} XP)
            </div>
            <button
              onClick={() => { synth.playClick(); setHookState('swinging'); setLastCaught(null); }}
              className="mt-2 px-6 py-2.5 rounded-2xl bg-cyan-400 text-black font-black text-xs uppercase shadow-lg hover:scale-105 cursor-pointer"
            >
              Catch Again 🪝
            </button>
          </motion.div>
        )}
      </div>

      {/* LARGE CATCH BUTTON FOR MOBILE */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleDropHook}
        disabled={hookState !== 'swinging'}
        className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-teal-400 to-blue-500 text-black font-black text-sm uppercase tracking-widest shadow-2xl flex items-center justify-center gap-2 cursor-pointer transition disabled:opacity-50"
      >
        <Anchor className="h-5 w-5 fill-current" />
        <span>{hookState === 'swinging' ? '🪝 CATCH!' : 'REELING HOOK...'}</span>
      </motion.button>
    </div>
  );
}
