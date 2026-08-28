/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { GameTemplate, GAME_TEMPLATES } from './gameTemplatesData';
import { X, Play, Sparkles, CheckCircle2, ShieldAlert, Star, Trophy } from 'lucide-react';
import { synth } from '../../../utils/audioSynth';

interface GameCollectionModalProps {
  activeTemplate: GameTemplate;
  onSelectTemplate: (template: GameTemplate) => void;
  onClose: () => void;
}

export function GameCollectionModal({
  activeTemplate,
  onSelectTemplate,
  onClose,
}: GameCollectionModalProps) {
  return (
    <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-2xl flex items-end sm:items-center justify-center p-2 sm:p-4 animate-fade-in">
      <div className="relative bg-gradient-to-b from-slate-950 via-zinc-950 to-black border-t sm:border-2 border-amber-500/40 w-full max-w-5xl rounded-t-3xl sm:rounded-3xl p-4 sm:p-7 text-white max-h-[92vh] flex flex-col shadow-[0_0_100px_rgba(245,158,11,0.2)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="flex justify-between items-center pb-4 border-b border-white/10 gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 via-amber-400 to-amber-600 p-0.5 shadow-xl flex items-center justify-center text-black font-black text-2xl">
              🎮
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl sm:text-2xl font-black uppercase tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-amber-500">
                  Game Collection
                </h3>
                <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300">
                  10 Themes
                </span>
              </div>
              <p className="text-xs text-zinc-400 font-medium">
                Select a Bubble Shooter template to instantly switch gameplay style & theme
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              synth.playClick();
              onClose();
            }}
            className="p-2.5 rounded-2xl bg-zinc-900 hover:bg-zinc-800 text-zinc-400 hover:text-white transition border border-white/10"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Templates Scrollable Grid */}
        <div className="overflow-y-auto my-4 pr-1 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {GAME_TEMPLATES.map((tmpl) => {
            const isSelected = activeTemplate.id === tmpl.id;

            return (
              <div
                key={tmpl.id}
                className={`group relative rounded-2xl p-4 border transition-all duration-300 flex flex-col justify-between overflow-hidden bg-gradient-to-b ${tmpl.bgGradient} ${tmpl.cardBorder} ${
                  isSelected ? 'ring-2 ring-amber-400 shadow-[0_0_30px_rgba(245,158,11,0.3)]' : 'hover:scale-[1.01]'
                }`}
              >
                {/* Background Glow Effect */}
                <div
                  className="absolute -right-10 -bottom-10 w-32 h-32 rounded-full blur-2xl pointer-events-none opacity-40 transition group-hover:opacity-70"
                  style={{ background: tmpl.accentColor }}
                />

                {/* Top Badge Row */}
                <div className="flex justify-between items-center mb-3 relative z-10">
                  <span
                    className="text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg text-black shadow-md flex items-center gap-1"
                    style={{ background: tmpl.accentColor }}
                  >
                    <span>{tmpl.themeIcon}</span> {tmpl.badge}
                  </span>

                  <span
                    className="text-[10px] font-black uppercase px-2 py-0.5 rounded-md border"
                    style={{
                      borderColor: tmpl.difficultyColor,
                      color: tmpl.difficultyColor,
                      backgroundColor: `${tmpl.difficultyColor}15`,
                    }}
                  >
                    {tmpl.difficulty}
                  </span>
                </div>

                {/* Card Artwork & Title Info */}
                <div className="space-y-2 my-2 relative z-10">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-black/60 border border-white/15 flex items-center justify-center text-2xl shadow-inner shrink-0">
                      {tmpl.themeIcon}
                    </div>
                    <div>
                      <h4 className="text-base font-black text-white group-hover:text-amber-200 transition">
                        {tmpl.title}
                      </h4>
                      <div className="flex items-center gap-2">
                        <p className="text-[11px] font-medium text-amber-400/90">{tmpl.subtitle}</p>
                        <span className="text-[9px] font-black uppercase px-1.5 py-0.5 rounded bg-black/50 border border-white/10 text-cyan-300">
                          {tmpl.layoutName}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs text-zinc-300/90 leading-relaxed line-clamp-2 font-normal">
                    {tmpl.description}
                  </p>
                </div>

                {/* Bottom Action Row */}
                <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between relative z-10">
                  <div className="text-[10px] text-zinc-400 font-bold uppercase tracking-wider flex items-center gap-1">
                    <span>Payout Bonus:</span>
                    <span className="text-amber-300 font-mono font-black">{tmpl.multiplierBonus}x</span>
                  </div>

                  {isSelected ? (
                    <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-400/60 text-amber-300 text-xs font-black uppercase tracking-wider flex items-center gap-1.5 shadow">
                      <CheckCircle2 className="h-4 w-4 text-amber-400 animate-pulse" /> Active Mode
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        synth.playClick();
                        synth.playUpgradeSuccess();
                        onSelectTemplate(tmpl);
                        onClose();
                      }}
                      className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider transition flex items-center gap-1.5 shadow-lg shadow-amber-500/20 group-hover:scale-105 active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" /> Play Mode
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Hint */}
        <div className="pt-3 border-t border-white/10 flex flex-wrap justify-between items-center text-[11px] text-zinc-400 shrink-0 gap-2">
          <span>💡 Selecting a mode switches the game style & background instantly without leaving page.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-zinc-800 hover:bg-zinc-700 text-white font-bold text-xs uppercase"
          >
            Close Modal
          </button>
        </div>
      </div>
    </div>
  );
}
