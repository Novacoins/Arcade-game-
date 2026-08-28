/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef } from 'react';
import { GameTemplate, GAME_TEMPLATES } from './gameTemplatesData';
import { ChevronRight, ChevronLeft, Play, Sparkles, Layers, Shield, Zap } from 'lucide-react';
import { synth } from '../../../utils/audioSynth';

interface GameInfoAndTagsProps {
  activeTemplate: GameTemplate;
  onSelectTemplate: (template: GameTemplate) => void;
}

export function GameInfoAndTags({ activeTemplate, onSelectTemplate }: GameInfoAndTagsProps) {
  const carouselRef = useRef<HTMLDivElement | null>(null);

  const scrollCarousel = (direction: 'left' | 'right') => {
    if (!carouselRef.current) return;
    const scrollAmount = direction === 'left' ? -300 : 300;
    carouselRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  return (
    <div className="space-y-4 mt-6 pt-6 border-t border-white/10">
      
      {/* SECTION: Premium Bubble Templates Gallery */}
      <div className="space-y-3">
        <div className="flex justify-between items-center px-1">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/20">
              <Layers className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-amber-400 to-amber-500">
                Bubble Templates Gallery
              </h3>
              <p className="text-xs text-zinc-400 font-medium">
                Tap any template card below to switch board layout, environment & theme instantly
              </p>
            </div>
          </div>

          {/* Carousel Navigation Arrows */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={() => {
                synth.playClick();
                scrollCarousel('left');
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition active:scale-95"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              onClick={() => {
                synth.playClick();
                scrollCarousel('right');
              }}
              className="p-2 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-300 hover:text-white border border-white/10 transition active:scale-95"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Horizontal Scroll Track */}
        <div
          ref={carouselRef}
          className="flex gap-4 overflow-x-auto pb-4 pt-1 pr-2 scrollbar-none scroll-smooth touch-pan-x"
        >
          {GAME_TEMPLATES.map((tmpl) => {
            const isCurrent = activeTemplate.id === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`min-w-[270px] max-w-[270px] rounded-2xl p-4 border flex flex-col justify-between bg-gradient-to-b ${tmpl.bgGradient} ${tmpl.cardBorder} shrink-0 transition-all duration-300 hover:scale-[1.02] shadow-xl relative overflow-hidden group ${
                  isCurrent ? 'ring-2 ring-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]' : ''
                }`}
              >
                {/* Background Accent Glow */}
                <div
                  className="absolute -right-8 -bottom-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-30 transition group-hover:opacity-60"
                  style={{ background: tmpl.accentColor }}
                />

                <div className="space-y-3 relative z-10">
                  {/* Badge Row */}
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl drop-shadow">{tmpl.themeIcon}</span>
                      <span
                        className="text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded text-black shadow"
                        style={{ background: tmpl.accentColor }}
                      >
                        {tmpl.badge}
                      </span>
                    </div>

                    <span
                      className="text-[9px] font-black uppercase px-2 py-0.5 rounded border"
                      style={{
                        borderColor: tmpl.difficultyColor,
                        color: tmpl.difficultyColor,
                        backgroundColor: `${tmpl.difficultyColor}15`,
                      }}
                    >
                      {tmpl.difficulty}
                    </span>
                  </div>

                  {/* Title & Subtitle */}
                  <div>
                    <h4 className="text-base font-black text-white group-hover:text-amber-200 transition">
                      {tmpl.title}
                    </h4>
                    <p className="text-[11px] font-bold text-amber-300/90">{tmpl.subtitle}</p>
                  </div>

                  {/* Specs Pill Bar */}
                  <div className="flex items-center gap-2 text-[10px] font-bold">
                    <div className="px-2 py-1 rounded-lg bg-black/50 border border-white/10 text-cyan-300 flex items-center gap-1">
                      <span>🎯 Layout:</span>
                      <span className="text-white font-black">{tmpl.layoutName}</span>
                    </div>

                    <div className="px-2 py-1 rounded-lg bg-black/50 border border-white/10 text-amber-300 flex items-center gap-1">
                      <span>Bonus:</span>
                      <span className="text-white font-mono font-black">{tmpl.multiplierBonus}x</span>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300/90 line-clamp-2 leading-relaxed font-normal">
                    {tmpl.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-4 pt-3 border-t border-white/10 flex justify-between items-center relative z-10">
                  <span className="text-[10px] text-zinc-400 font-mono font-bold uppercase tracking-wider">
                    {tmpl.layoutType.replace('_', ' ')}
                  </span>

                  <button
                    onClick={() => {
                      synth.playClick();
                      synth.playUpgradeSuccess();
                      onSelectTemplate(tmpl);
                    }}
                    disabled={isCurrent}
                    className={`px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 ${
                      isCurrent
                        ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 cursor-default'
                        : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 text-black shadow-lg shadow-amber-500/20 active:scale-95 group-hover:scale-105'
                    }`}
                  >
                    {isCurrent ? (
                      <>
                        <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-spin" /> Active
                      </>
                    ) : (
                      <>
                        <Play className="h-3.5 w-3.5 fill-current" /> Play Template
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
  );
}
