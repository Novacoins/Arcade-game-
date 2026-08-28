/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { X, Volume2, VolumeX, HelpCircle, ArrowLeft, Trophy, Award, BarChart3, Settings, Maximize, Minimize, Play, Sparkles, Gamepad2, Coins, Cpu, TrendingUp } from 'lucide-react';
import { GameDefinition, UserProfile } from '../types';
import { synth } from '../utils/audioSynth';

// Import our games
import { SkyFlight } from './games/CrashGames';
import { GemMines, TreasureHunt, DiamondPlinko } from './games/RiskGames';
import { CoinClash, LuckyBottle, CardDuel, ColorMatch, NumberDash, DiceArena, LuckyWheel, SlotMachine } from './games/ChanceGames';
import { RocketRun, RacingRush, FruitSlice, BrickSmash, GoalChallenge, MemoryFlip } from './games/ArcadeGames';
import { BubblePop, JewelPuzzle } from './games/PuzzleGames';
import { FishingFrenzyGame } from './games/FishingFrenzyGame';

interface GameCabinetProps {
  game: GameDefinition;
  profile: UserProfile;
  onClose: () => void;
  onUpdateWallet: (amount: number, currency: 'coins' | 'diamonds', type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward', title?: string) => void;
  onAwardXP: (amount: number) => void;
  onRecordGamePlayed: (gameTitle: string, wonCoins: number) => void;
}

export default function GameCabinet({
  game,
  profile,
  onClose,
  onUpdateWallet,
  onAwardXP,
  onRecordGamePlayed,
}: GameCabinetProps) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showHelp, setShowHelp] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [sessionWinnings, setSessionWinnings] = useState(0);

  // New cinematic immersion states
  const [isGameStarted, setIsGameStarted] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Fullscreen support
  const toggleFullscreen = () => {
    synth.playClick();
    const root = document.getElementById('game_cabinet_root');
    if (!root) return;

    if (!document.fullscreenElement) {
      root.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch((err) => {
        console.warn('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  useEffect(() => {
    const handleFsChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  // Auto-play game BGM on mount and stop on unmount
  useEffect(() => {
    synth.playFanfare();
    synth.startBgm(game.id);
    return () => {
      synth.stopBgm();
    };
  }, [game.id]);

  // Cohesive 60 FPS animated background particles matching game themes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    interface BgParticle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;
      alpha: number;
      decay: number;
    }

    const particles: BgParticle[] = [];

    // Color palettes matched to game categories
    let particleColors = ['#f59e0b', '#fbbf24', '#ffffff'];
    if (game.id === 'sky_flight' || game.id === 'rocket_run') {
      particleColors = ['#8b5cf6', '#3b82f6', '#60a5fa']; // Blue-violet space cosmic
    } else if (game.id === 'gem_mines' || game.id === 'jewel_puzzle' || game.id === 'treasure_hunt') {
      particleColors = ['#ec4899', '#a855f7', '#d946ef']; // Magenta-purple gem crystals
    } else if (game.id === 'goal_challenge') {
      particleColors = ['#10b981', '#34d399', '#059669']; // Emerald laser lights
    } else if (game.id === 'lucky_wheel' || game.id === 'lucky_bottle') {
      particleColors = ['#fbbf24', '#ef4444', '#f59e0b']; // Warm lucky gold-red rings
    } else {
      particleColors = ['#06b6d4', '#ec4899', '#3b82f6']; // Retro synthwave cyan-magenta
    }

    const spawnParticle = () => {
      const radius = Math.random() * 2.5 + 1;
      particles.push({
        x: Math.random() * width,
        y: height + 10,
        vx: (Math.random() - 0.5) * 0.8,
        vy: -(Math.random() * 1.2 + 0.4),
        radius,
        color: particleColors[Math.floor(Math.random() * particleColors.length)],
        alpha: Math.random() * 0.4 + 0.15,
        decay: Math.random() * 0.0025 + 0.0008,
      });
    };

    // Prepopulate starting positions
    for (let i = 0; i < 45; i++) {
      spawnParticle();
      particles[i].y = Math.random() * height;
    }

    const tick = () => {
      ctx.clearRect(0, 0, width, height);

      // Delicate grid overlay to enhance high-tech visual depth
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.008)';
      ctx.lineWidth = 1;
      const gridSize = 50;
      for (let x = 0; x < width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Render and update particles
      particles.forEach((p, index) => {
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= p.decay;

        if (p.y < -10 || p.alpha <= 0) {
          particles[index] = {
            x: Math.random() * width,
            y: height + 10,
            vx: (Math.random() - 0.5) * 0.8,
            vy: -(Math.random() * 1.2 + 0.4),
            radius: Math.random() * 2.5 + 1,
            color: particleColors[Math.floor(Math.random() * particleColors.length)],
            alpha: Math.random() * 0.4 + 0.2,
            decay: Math.random() * 0.0025 + 0.0008,
          };
        }

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 6;
        ctx.shadowColor = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });

      animId = requestAnimationFrame(tick);
    };

    tick();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
    };
  }, [game.id]);

  const toggleSound = () => {
    const next = !soundEnabled;
    setSoundEnabled(next);
    synth.toggle(next);
    synth.playClick();
  };

  const handleGameWin = (payout: number, multiplier: number) => {
    // Deliver payout to user's wallet
    onUpdateWallet(payout, 'coins', 'win', game.title);
    
    // Calculate level XP award based on payout volume
    const xpGained = Math.max(20, Math.floor(payout * 0.05));
    onAwardXP(xpGained);

    setSessionWinnings((prev) => prev + payout);
    onRecordGamePlayed(game.title, payout);
  };

  const handleGameLose = (betAmount: number) => {
    onUpdateWallet(-betAmount, 'coins', 'bet', game.title);
    onRecordGamePlayed(game.title, 0);
  };

  // Map GameId to corresponding Component
  const renderGameContent = () => {
    const props = {
      coins: profile.coins,
      onGameWin: handleGameWin,
      onGameLose: handleGameLose,
    };

    switch (game.id) {
      case 'sky_flight':
        return <SkyFlight {...props} />;
      case 'gem_mines':
        return <GemMines {...props} />;
      case 'treasure_hunt':
        return <TreasureHunt {...props} />;
      case 'diamond_plinko':
        return <DiamondPlinko {...props} />;
      case 'lucky_wheel':
        return <LuckyWheel {...props} />;
      case 'coin_clash':
        return <CoinClash {...props} />;
      case 'lucky_bottle':
        return <LuckyBottle {...props} />;
      case 'card_duel':
        return <CardDuel {...props} />;
      case 'color_match':
        return <ColorMatch {...props} />;
      case 'number_dash':
        return <NumberDash {...props} />;
      case 'dice_arena':
        return <DiceArena {...props} />;
      case 'rocket_run':
        return <RocketRun {...props} />;
      case 'racing_rush':
        return <RacingRush {...props} />;
      case 'fruit_slice':
        return <FruitSlice {...props} />;
      case 'brick_smash':
        return <BrickSmash {...props} />;
      case 'goal_challenge':
        return <GoalChallenge {...props} />;
      case 'memory_flip':
        return <MemoryFlip {...props} />;
      case 'bubble_pop':
        return <BubblePop {...props} />;
      case 'jewel_puzzle':
        return <JewelPuzzle {...props} />;
      case 'fishing_frenzy':
        return <FishingFrenzyGame {...props} />;
        
      default:
        // Default interactive premium 3-reel slot machine fallback for other games
        return <SlotMachine {...props} />;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex flex-col bg-zinc-950 text-white overflow-hidden font-sans select-none" 
      id="game_cabinet_root"
    >
      {/* 60 FPS Ambient Particle Background Canvas */}
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 pointer-events-none opacity-40 z-0" 
      />

      {/* TOP HEADER - Persistent or adaptive */}
      <div className="relative z-10 flex items-center justify-between px-4 py-3 border-b border-white/5 bg-zinc-950/70 backdrop-blur-md">
        {/* Back navigation */}
        <button 
          onClick={onClose}
          className="flex items-center gap-1.5 text-xs font-black text-zinc-400 hover:text-white uppercase tracking-wider transition duration-200 group"
        >
          <ArrowLeft className="h-4 w-4 transform group-hover:-translate-x-0.5 transition" />
          Lobby
        </button>

        {/* Game Title Display */}
        <div className="text-center">
          <h3 className="text-xs sm:text-sm font-black text-white leading-tight uppercase tracking-wider">
            {game.title}
          </h3>
          <p className="text-[9px] sm:text-[10px] text-amber-400 font-extrabold tracking-widest uppercase mt-0.5">
            Arcade Machine v2.4 • Multiplier {game.multiplier}
          </p>
        </div>

        {/* Console Shortcuts Toolbar */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Full Screen Toggle */}
          <button 
            onClick={toggleFullscreen}
            className={`rounded-lg p-2 transition duration-200 ${
              isFullscreen 
                ? 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
            title={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          >
            {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
          </button>

          {/* Help button */}
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className={`rounded-lg p-2 transition duration-200 ${
              showHelp 
                ? 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20' 
                : 'bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white'
            }`}
            title="Help Instructions"
          >
            <HelpCircle className="h-4 w-4" />
          </button>

          {/* Close console */}
          <button 
            onClick={onClose}
            className="rounded-lg bg-red-500/10 border border-red-500/20 p-2 text-red-500 hover:bg-red-500 hover:text-white transition duration-200"
            title="Exit Console"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* CONDITIONAL RENDER: CINEMATIC LANDING VS ACTIVE GAMEPLAY */}
      {!isGameStarted ? (
        <div className="relative z-10 grow flex flex-col items-center justify-center p-4 sm:p-8 lg:p-12">
          <div className="w-full max-w-md bg-zinc-900/60 border border-white/5 rounded-3xl p-6 sm:p-8 backdrop-blur-md shadow-2xl space-y-6 text-center animate-fade-in">
            {/* Pulsing Game Cover Icon */}
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-zinc-950 border border-white/5 shadow-inner">
              <img 
                src={game.thumbnail || 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80&w=640'} 
                alt={game.title}
                loading="lazy"
                decoding="async"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover opacity-85 transform-gpu"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/40 to-transparent" />
              <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                <span className="text-[9px] font-black text-amber-400 tracking-wider bg-black/60 px-2 py-0.5 rounded border border-amber-400/20 uppercase">
                  {game.category}
                </span>
                <span className="text-[9px] font-bold text-zinc-400">
                  Multiplier {game.multiplier}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight uppercase leading-none">
                {game.title}
              </h1>
              <p className="text-xs text-zinc-400 font-sans leading-relaxed max-w-xs mx-auto">
                Synchronizing with Nova Arcade ROM Engine...
              </p>
            </div>

            {/* Glowing active loading bar */}
            <div className="space-y-2 max-w-xs mx-auto">
              <div className="flex justify-between items-center text-[10px] font-black text-amber-400 uppercase tracking-widest font-mono">
                <span className="flex items-center gap-1.5 animate-pulse">
                  <Cpu className="h-3.5 w-3.5 animate-spin text-amber-500" />
                  Booting Virtual Machine...
                </span>
                <span>{loadingProgress}%</span>
              </div>
              <div className="w-full bg-zinc-950 h-2.5 rounded-full overflow-hidden border border-white/5 p-0.5">
                <div 
                  className="h-full bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
                  style={{ width: `${loadingProgress}%` }}
                />
              </div>
            </div>

            <div className="flex items-center justify-center gap-1 text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
              <span>Initializing Audio</span>
              <span>•</span>
              <span>Mounting Controls</span>
            </div>
          </div>
        </div>
      ) : (
        /* CORE ACTIVE GAMEPLAY SCREEN */
        <div className="relative z-10 grow overflow-y-auto p-4 sm:p-6 flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full">
          {/* Playboard Stage */}
          <div className="flex-1 flex flex-col justify-center min-w-0 z-10">
            {renderGameContent()}
          </div>

          {/* Side Panel Drawer */}
          <div className="w-full lg:w-80 space-y-4 shrink-0 z-10 font-sans">
            {/* Help box */}
            {showHelp && (
              <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl space-y-2 backdrop-blur-sm animate-fade-in text-left">
                <h4 className="text-xs font-black uppercase text-amber-400 tracking-wider">How to Play & Multipliers</h4>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-semibold">
                  {game.description} This console is fully equipped with automatic multipliers, live balance tracking, and particle effects. Connect your local wallet anytime to top-up coins or claim daily bonuses!
                </p>
              </div>
            )}

            {/* Performance HUD Stats info panel */}
            <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl space-y-3 backdrop-blur-sm text-left">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block">Cabinet telemetry</span>
              <div className="grid grid-cols-2 gap-2 text-center text-xs font-black">
                <div className="bg-black/60 p-2.5 rounded-xl border border-white/5">
                  <span className="block text-zinc-500 text-[9px] uppercase">Lobby Coins</span>
                  <span className="text-amber-400 mt-0.5 block font-mono">{profile.coins.toLocaleString()}</span>
                </div>
                <div className="bg-black/60 p-2.5 rounded-xl border border-white/5">
                  <span className="block text-zinc-500 text-[9px] uppercase">Session Gains</span>
                  <span className="text-emerald-400 mt-0.5 block font-mono">+{sessionWinnings.toLocaleString()}</span>
                </div>
              </div>
            </div>

            {/* Quick achievement indicator panel */}
            <div className="p-4 bg-zinc-900/60 border border-white/5 rounded-2xl space-y-3 backdrop-blur-sm text-left">
              <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider block flex items-center gap-1">
                <Award className="h-3.5 w-3.5 text-amber-500" />
                Lobby achievements progress
              </span>
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[11px] text-zinc-300 font-extrabold">🎯 First Flight</span>
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">SECURED</span>
                </div>
                <div className="flex items-center justify-between p-2 rounded-xl bg-black/60 border border-white/5">
                  <span className="text-[11px] text-zinc-300 font-extrabold">💎 Mine Master</span>
                  <span className="text-[9px] text-zinc-500 font-black uppercase tracking-wider">LOCKED</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
