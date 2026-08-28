/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronLeft, ChevronRight, Star, Flame, Sparkles, Award } from 'lucide-react';

interface PromoSlide {
  id: number;
  artworkType: 'sky-flight' | 'lucky-wheel' | 'gem-mines' | 'plinko' | 'card-duel' | 'rocket-clash';
  smallTitle: string;
  title: string;
  description: string;
  reward: string;
  countdownHours: number;
  themeColor: string;
  gradientBg: string;
}

// Inline Countdown Timer Component
function Countdown({ hours }: { hours: number }) {
  const [timeLeft, setTimeLeft] = useState(hours * 3600 - Math.floor(Math.random() * 600)); // offset slightly for dynamic variation

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : hours * 3600));
    }, 1000);
    return () => clearInterval(timer);
  }, [hours]);

  const h = Math.floor(timeLeft / 3600);
  const m = Math.floor((timeLeft % 3600) / 60);
  const s = timeLeft % 60;

  return (
    <div className="flex items-center gap-1 mt-1 sm:mt-2 bg-black/60 border border-white/10 px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-mono font-bold text-amber-400 shadow-inner">
      <span className="w-2 h-2 rounded-full bg-red-500 animate-ping mr-1" />
      <span>ENDS IN:</span>
      <span>{String(h).padStart(2, '0')}H : {String(m).padStart(2, '0')}M : {String(s).padStart(2, '0')}S</span>
    </div>
  );
}

// Visual Artworks Components
function SkyFlightArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-slate-950 rounded-2xl overflow-hidden border border-cyan-500/10 shadow-lg shadow-cyan-500/5 flex items-center justify-center">
      {/* Starry Background */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-950/40 via-zinc-950 to-zinc-950" />
      
      {/* Star particles */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-10 left-10 w-1 h-1 bg-white rounded-full animate-pulse" />
        <div className="absolute top-24 left-32 w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
        <div className="absolute top-16 right-12 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '500ms' }} />
        <div className="absolute bottom-10 left-20 w-0.5 h-0.5 bg-white rounded-full" />
        <div className="absolute bottom-16 right-20 w-1.5 h-1.5 bg-indigo-400 rounded-full animate-pulse" style={{ animationDelay: '800ms' }} />
      </div>

      {/* Nebula Aura */}
      <div className="absolute w-36 h-36 bg-cyan-500/10 blur-[60px] rounded-full animate-pulse" />

      {/* Cyber Space Shuttle */}
      <div className="relative w-28 h-16 transform -rotate-12 hover:scale-105 transition-transform duration-500">
        {/* Thrust fire exhaust trail */}
        <div className="absolute -left-12 top-6 w-14 h-4 bg-gradient-to-r from-transparent via-orange-500 to-yellow-300 rounded-full blur-[3px] animate-pulse origin-right scale-y-110" />
        <div className="absolute -left-8 top-7 w-8 h-2 bg-gradient-to-r from-transparent via-red-500 to-amber-300 rounded-full blur-[1px] animate-pulse" />

        {/* Spacecraft Body */}
        <div className="absolute left-2 top-4 w-20 h-8 bg-gradient-to-r from-zinc-500 to-zinc-200 rounded-tr-full rounded-br-full border-t border-zinc-300" />
        {/* Cockpit glass */}
        <div className="absolute left-14 top-4 w-6 h-4 bg-cyan-400/80 rounded-tr-full rounded-br-md border border-cyan-200" />
        {/* Main Wing */}
        <div className="absolute left-4 top-1 w-10 h-4 bg-gradient-to-b from-red-600 to-red-800 rounded-tl-xl rounded-tr-md transform skew-x-12 border-b border-black/20" />
        {/* Tail Fin */}
        <div className="absolute left-1 top-0 w-4 h-6 bg-red-600 rounded-tl-full transform -skew-x-12" />
        
        {/* Outer glowing shield ring */}
        <div className="absolute -inset-2 border border-cyan-500/20 rounded-full blur-[2px] animate-pulse" />
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-cyan-400 tracking-widest uppercase">
        🚀 Orbit Active
      </div>
    </div>
  );
}

function LuckyWheelArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-stone-950 rounded-2xl overflow-hidden border border-amber-500/10 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-950/20 via-zinc-950 to-zinc-950" />
      
      {/* Light rays */}
      <div className="absolute inset-0 bg-[radial-gradient(#f59e0b04_2px,transparent_1px)] [background-size:20px_20px] opacity-60" />

      {/* Rotating Luxury Wheel */}
      <div className="relative w-28 h-28 rounded-full border-4 border-amber-500/80 bg-zinc-900 shadow-[0_0_25px_rgba(245,158,11,0.3)] flex items-center justify-center animate-[spin_12s_linear_infinite]">
        {/* Dividers */}
        <div className="absolute inset-0 border-t-2 border-amber-500/20 transform rotate-45" />
        <div className="absolute inset-0 border-t-2 border-amber-500/20 transform rotate-90" />
        <div className="absolute inset-0 border-t-2 border-amber-500/20 transform rotate-135" />
        <div className="absolute inset-0 border-t-2 border-amber-500/20" />
        
        {/* Colored Segments */}
        <div className="absolute top-1 left-1 right-1 bottom-1 bg-gradient-to-tr from-amber-600/10 via-zinc-900 to-red-600/10 rounded-full" />

        {/* Center Golden Core */}
        <div className="absolute w-8 h-8 rounded-full bg-gradient-to-r from-yellow-300 to-amber-500 border border-yellow-200 flex items-center justify-center shadow-lg">
          <Star className="h-3 w-3 text-black fill-black animate-pulse" />
        </div>

        {/* Outer mini lights */}
        <div className="absolute inset-1.5 rounded-full border border-yellow-400/30 border-dashed" />
      </div>

      {/* Top Red Pointer */}
      <div className="absolute top-[28px] z-10 w-0 h-0 border-l-[8px] border-r-[8px] border-t-[14px] border-l-transparent border-r-transparent border-t-red-500 drop-shadow-[0_2px_4px_rgba(239,68,68,0.6)] animate-bounce" />

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-amber-400 tracking-widest uppercase">
        🎰 Spin VIP
      </div>
    </div>
  );
}

function GemMinesArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-purple-950/20 rounded-2xl overflow-hidden border border-purple-500/10 flex items-center justify-center">
      {/* Background glow */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-purple-950/40 via-zinc-950 to-zinc-950" />
      
      {/* Glowing Gem Cluster */}
      <div className="relative flex items-end justify-center gap-2 h-20 w-36">
        {/* Ambient neon dust */}
        <div className="absolute top-0 w-24 h-24 bg-purple-500/10 blur-[40px] rounded-full animate-pulse" />

        {/* Left Emerald Crystal */}
        <div className="w-6 h-14 bg-gradient-to-t from-emerald-600 to-emerald-400 rounded-t-full rounded-b-md transform -rotate-12 origin-bottom border border-emerald-300/30 shadow-[0_0_15px_rgba(16,185,129,0.3)] animate-pulse" />
        
        {/* Center Diamond Crystal */}
        <div className="w-8 h-18 bg-gradient-to-t from-purple-600 via-pink-500 to-cyan-200 rounded-t-full rounded-b-md transform translate-y-2 z-10 border border-white/20 shadow-[0_0_25px_rgba(168,85,247,0.4)]">
          {/* Inner crystal reflections */}
          <div className="absolute top-1 left-2 w-1.5 h-10 bg-white/20 rounded-full" />
        </div>

        {/* Right Ruby Crystal */}
        <div className="w-6 h-12 bg-gradient-to-t from-red-600 to-red-400 rounded-t-full rounded-b-md transform rotate-12 origin-bottom border border-red-300/30 shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse" style={{ animationDelay: '400ms' }} />
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-purple-400 tracking-widest uppercase">
        💎 Cave Live
      </div>
    </div>
  );
}

function PlinkoArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-zinc-950 rounded-2xl overflow-hidden border border-pink-500/10 flex items-center justify-center">
      {/* Peg board lattice pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
      
      {/* Falling glowing Plinko balls */}
      <div className="relative w-28 h-28">
        {/* Silver Peg dots manually placed */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
        <div className="absolute top-10 left-8 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
        <div className="absolute top-10 right-8 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
        <div className="absolute top-16 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
        <div className="absolute top-22 left-6 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />
        <div className="absolute top-22 right-6 w-1.5 h-1.5 rounded-full bg-zinc-600 border border-zinc-400" />

        {/* Falling Pink/Yellow Ball 1 */}
        <div className="absolute top-2 left-10 w-3 h-3 rounded-full bg-gradient-to-tr from-pink-600 to-pink-400 border border-pink-300 shadow-[0_0_12px_rgba(236,72,153,0.6)] animate-[bounce_2s_infinite]" />
        
        {/* Falling Cyan Ball 2 */}
        <div className="absolute top-12 right-12 w-3.5 h-3.5 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-300 border border-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.6)] animate-[bounce_2.5s_infinite]" style={{ animationDelay: '500ms' }} />

        {/* Multiplier base boxes at the bottom */}
        <div className="absolute bottom-0 inset-x-0 h-4 flex justify-between gap-1">
          <div className="flex-1 bg-red-950/60 border border-red-500/20 rounded text-[6px] text-red-400 flex items-center justify-center font-bold">10X</div>
          <div className="flex-1 bg-amber-950/60 border border-amber-500/20 rounded text-[6px] text-amber-400 flex items-center justify-center font-bold">100X</div>
          <div className="flex-1 bg-red-950/60 border border-red-500/20 rounded text-[6px] text-red-400 flex items-center justify-center font-bold">10X</div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-pink-400 tracking-widest uppercase">
        🎯 PEG DROP
      </div>
    </div>
  );
}

function CardDuelArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-emerald-950/10 rounded-2xl overflow-hidden border border-emerald-500/10 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-emerald-950/40 via-zinc-950 to-zinc-950" />

      {/* Beautiful cyber overlays */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(16,185,129,0.02)_1px,transparent_1px)] [background-size:100%_4px]" />

      {/* Floating Interactive 3D Cards */}
      <div className="relative w-36 h-24 flex items-center justify-center gap-4">
        {/* Blue Ace of Spades card */}
        <div className="w-12 h-18 rounded-lg bg-zinc-900 border border-blue-500/50 flex flex-col justify-between p-1.5 shadow-[0_10px_20px_rgba(59,130,246,0.25)] transform -rotate-12 translate-x-2 -translate-y-1 hover:rotate-0 hover:scale-105 transition duration-300">
          <div className="text-[10px] font-bold text-blue-400 font-mono leading-none">A</div>
          <div className="text-xl self-center leading-none">♠️</div>
          <div className="text-[10px] font-bold text-blue-400 font-mono leading-none self-end">A</div>
        </div>

        {/* Red King of Hearts card */}
        <div className="w-12 h-18 rounded-lg bg-zinc-900 border border-red-500/50 flex flex-col justify-between p-1.5 shadow-[0_10px_20px_rgba(239,68,68,0.25)] transform rotate-12 -translate-x-2 translate-y-1 hover:rotate-0 hover:scale-105 transition duration-300">
          <div className="text-[10px] font-bold text-red-500 font-mono leading-none">K</div>
          <div className="text-xl self-center leading-none">♥️</div>
          <div className="text-[10px] font-bold text-red-500 font-mono leading-none self-end">K</div>
        </div>
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-emerald-400 tracking-widest uppercase">
        🃏 Duel active
      </div>
    </div>
  );
}

function RocketClashArtwork() {
  return (
    <div className="relative w-full h-full min-h-[140px] sm:min-h-[180px] bg-red-950/20 rounded-2xl overflow-hidden border border-red-500/10 flex items-center justify-center">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-red-950/40 via-zinc-950 to-zinc-950" />

      {/* Moving smoke particles and stars */}
      <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:8px_8px]" />

      {/* Thruster Fire background */}
      <div className="absolute bottom-0 w-32 h-12 bg-gradient-to-t from-red-500/20 via-orange-500/5 to-transparent blur-md" />

      {/* Heavy Rocket ship pointing up */}
      <div className="relative w-14 h-24 transform translate-y-1 hover:-translate-y-2 transition-transform duration-500">
        {/* Jet Fire Exhaust */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-10 bg-gradient-to-b from-orange-500 via-red-600 to-transparent rounded-full blur-[2px] animate-pulse" />
        
        {/* Metal Body */}
        <div className="absolute top-2 left-3.5 w-7 h-16 bg-gradient-to-r from-zinc-400 to-zinc-200 rounded-t-full border-t border-white/20" />
        
        {/* Booster side pods */}
        <div className="absolute bottom-4 left-1.5 w-3 h-10 bg-zinc-500 rounded-t-full rounded-b" />
        <div className="absolute bottom-4 right-1.5 w-3 h-10 bg-zinc-500 rounded-t-full rounded-b" />

        {/* Windows */}
        <div className="absolute top-8 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 border border-white/40" />
        <div className="absolute top-12 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-cyan-400 border border-white/40" />

        {/* High power red glow ring */}
        <div className="absolute -inset-1 border border-red-500/10 rounded-full blur-[2px] animate-pulse" />
      </div>

      <div className="absolute bottom-2 left-2 flex items-center gap-1 bg-black/40 px-2 py-0.5 rounded text-[8px] font-mono text-red-500 tracking-widest uppercase">
        🚀 LAUNCH ZONE
      </div>
    </div>
  );
}

export default function PromoCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  const slides: PromoSlide[] = [
    {
      id: 1,
      artworkType: 'sky-flight',
      smallTitle: 'HOT WEEKLY JACKPOT',
      title: 'SKY FLIGHT SPACESHIP SUPER CHASE',
      description: 'Pilot the cyber shuttle above 20x. Every successful flight above 10x awards direct bonus tickets to the weekend super pool!',
      reward: 'N$ 2,500,000 COINS POOL',
      countdownHours: 18,
      themeColor: 'from-cyan-500 to-blue-600',
      gradientBg: 'from-cyan-950/20 via-zinc-950 to-zinc-950',
    },
    {
      id: 2,
      artworkType: 'lucky-wheel',
      smallTitle: 'EXCLUSIVE VIP ROLL',
      title: 'LUCKY SPIN WHEEL JACKPOT BONANZA',
      description: 'Spin the premium golden wheel! Reach consecutive levels of 5 VIP spins to unlock secret slot modifiers and free multipliers.',
      reward: 'FREE 10x multiplier ticket',
      countdownHours: 6,
      themeColor: 'from-amber-500 to-yellow-600',
      gradientBg: 'from-amber-950/20 via-zinc-950 to-zinc-950',
    },
    {
      id: 3,
      artworkType: 'gem-mines',
      smallTitle: 'TOURNAMENT ACTIVE',
      title: 'CRYSTAL CAVE GEM MINERS DEEP DRILL',
      description: 'Dig deeper into the crystal cave! Collect high-value gems and diamond multipliers to scale the real-time leaderboard ranks.',
      reward: '15,000 DIAMONDS POOL',
      countdownHours: 24,
      themeColor: 'from-purple-500 to-pink-600',
      gradientBg: 'from-purple-950/20 via-zinc-950 to-zinc-950',
    },
    {
      id: 4,
      artworkType: 'plinko',
      smallTitle: 'FAST EVENT STAGE',
      title: 'DIAMOND PLINKO MEGA DROP FESTIVAL',
      description: 'Drop the heavy pink peg balls into extreme multiplier chambers! Day 7 drop multipliers are doubled for all platform guests.',
      reward: 'DOUBLE REWARD ON DROP',
      countdownHours: 12,
      themeColor: 'from-pink-500 to-rose-600',
      gradientBg: 'from-pink-950/20 via-zinc-950 to-zinc-950',
    },
    {
      id: 5,
      artworkType: 'card-duel',
      smallTitle: 'TABLE CONFLICT',
      title: 'ULTIMATE BLACKJACK CARD DUEL MASTERS',
      description: 'Compete in cyber card duels. Win 3 consecutive hands without going bust to earn the premium Champion Cardholder badge.',
      reward: 'EXCLUSIVE RED BADGE',
      countdownHours: 8,
      themeColor: 'from-emerald-500 to-teal-600',
      gradientBg: 'from-emerald-950/20 via-zinc-950 to-zinc-950',
    },
    {
      id: 6,
      artworkType: 'rocket-clash',
      smallTitle: 'EXPLOSIVE CASCADE',
      title: 'ROCKET CLASH MULTIPLIER FLIGHT SHOWDOWN',
      description: 'Witness the blast of the Rocket Clash! Maximize your escape height before ignition failure to secure multipliers up to 5,000x.',
      reward: 'COIN MULTIPLIERS x5,000',
      countdownHours: 15,
      themeColor: 'from-red-500 to-orange-600',
      gradientBg: 'from-red-950/20 via-zinc-950 to-zinc-950',
    },
  ];

  // Auto scroll
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % slides.length);
    }, 8000); // 8 seconds per high quality presentation
    return () => clearInterval(interval);
  }, [slides.length]);

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % slides.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  // Render proper artwork dynamically
  const renderArtwork = (type: string) => {
    switch (type) {
      case 'sky-flight': return <SkyFlightArtwork />;
      case 'lucky-wheel': return <LuckyWheelArtwork />;
      case 'gem-mines': return <GemMinesArtwork />;
      case 'plinko': return <PlinkoArtwork />;
      case 'card-duel': return <CardDuelArtwork />;
      case 'rocket-clash': return <RocketClashArtwork />;
      default: return null;
    }
  };

  return (
    <div className="relative w-full overflow-hidden rounded-3xl bg-zinc-950 border border-white/5 shadow-2xl p-4 sm:p-6" id="promo_carousel">
      
      {/* Decorative premium corner glowing orbs */}
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full bg-red-600/10 blur-[80px] animate-pulse" />
      <div className="absolute -bottom-16 -right-16 h-48 w-48 rounded-full bg-amber-500/10 blur-[80px] animate-pulse" />

      {/* Slide Presentation */}
      <div className="relative min-h-[280px] sm:min-h-[180px] flex items-center">
        <AnimatePresence mode="wait">
          {slides.map((slide, idx) => {
            if (idx !== activeIndex) return null;
            return (
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.02 }}
                transition={{ duration: 0.5, ease: 'easeOut' }}
                className="absolute inset-0 flex flex-col md:flex-row items-stretch md:items-center gap-6"
              >
                
                {/* 1. Large HD CSS Artwork Column (Takes 40% on desktop) */}
                <div className="w-full md:w-[42%] shrink-0">
                  {renderArtwork(slide.artworkType)}
                </div>

                {/* 2. Text Content Description Column (Takes 58%) */}
                <div className="flex-1 flex flex-col justify-center text-left min-w-0">
                  
                  {/* Category & Badge Tags */}
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <span className={`text-[9px] font-black tracking-widest uppercase bg-gradient-to-r ${slide.themeColor} px-2.5 py-0.5 rounded text-white`}>
                      {slide.smallTitle}
                    </span>
                    <span className="flex items-center gap-1 text-[10px] font-bold text-amber-400">
                      <Award className="h-3.5 w-3.5" />
                      REWARD: <span className="font-black underline">{slide.reward}</span>
                    </span>
                  </div>

                  {/* Promotion Big Title */}
                  <h3 className="text-base sm:text-xl md:text-2xl font-black text-white leading-tight uppercase tracking-tight font-sans">
                    {slide.title}
                  </h3>

                  {/* Description Paragraph */}
                  <p className="text-xs text-zinc-400 font-medium mt-2 leading-relaxed max-w-xl">
                    {slide.description}
                  </p>

                  {/* Real countdown Timer */}
                  <Countdown hours={slide.countdownHours} />

                </div>

              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {/* Manual Swiper Navigation arrows */}
      <button 
        onClick={handlePrev}
        className="absolute left-2.5 top-1/2 -translate-y-1/2 hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/5 hover:border-red-500/50 hover:bg-black/90 text-zinc-400 hover:text-white transition-all shadow-lg hover:scale-105"
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button 
        onClick={handleNext}
        className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden lg:flex h-9 w-9 items-center justify-center rounded-full bg-black/60 border border-white/5 hover:border-red-500/50 hover:bg-black/90 text-zinc-400 hover:text-white transition-all shadow-lg hover:scale-105"
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      {/* Interactive Swiper Page Indicator Dots */}
      <div className="flex justify-center gap-2 mt-4 md:absolute md:bottom-2.5 md:right-6 md:mt-0">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setActiveIndex(idx)}
            className={`h-2 rounded-full transition-all duration-300 ${
              idx === activeIndex ? 'w-6 bg-red-500' : 'w-2 bg-zinc-800 hover:bg-zinc-700'
            }`}
          />
        ))}
      </div>

    </div>
  );
}
