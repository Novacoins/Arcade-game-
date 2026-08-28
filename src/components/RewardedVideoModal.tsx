/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { X, Shield, CheckCircle2, Zap, Volume2, Sparkles, Award } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion } from 'motion/react';

interface RewardedVideoModalProps {
  durationSeconds?: 20 | 30;
  onComplete: (coins: number, diamonds: number) => void;
  onClose: () => void;
}

const VIDEO_CAPTIONS = [
  "🎙️ Presenter: 'Welcome to Nova Arcade Studio! Experience 20+ HD Browser Games!'",
  "🎮 'Play Bubble Pop, Speed Racing, Gem Mines, Rocket Run, & Lucky Wheel!'",
  "🏆 'Compete on global leaderboards & unlock instant gift card rewards!'",
  "🎁 'Earn real coin payouts, daily login streak bonuses, and mythic chests!'",
  "⚡ 'Thank you for watching! Your 500 Coins + Bonus Diamonds are now unlocked!'"
];

export default function RewardedVideoModal({ durationSeconds = 20, onComplete, onClose }: RewardedVideoModalProps) {
  const [secondsLeft, setSecondsLeft] = useState(durationSeconds);
  const [isPlaying, setIsPlaying] = useState(true);
  const [completed, setCompleted] = useState(false);
  const [captionIndex, setCaptionIndex] = useState(0);

  useEffect(() => {
    if (!isPlaying || secondsLeft <= 0) return;

    const interval = setInterval(() => {
      setSecondsLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [isPlaying, secondsLeft]);

  // Handle video completion side effect safely in useEffect
  useEffect(() => {
    if (secondsLeft <= 0 && isPlaying && !completed) {
      setCompleted(true);
      setIsPlaying(false);
      synth.playVictory();
      const coins = 500;
      const diamonds = durationSeconds === 30 ? 25 : 10;
      onComplete(coins, diamonds);
    }
  }, [secondsLeft, isPlaying, completed, durationSeconds, onComplete]);

  // Update captions based on elapsed time
  useEffect(() => {
    const elapsed = durationSeconds - secondsLeft;
    const idx = Math.min(VIDEO_CAPTIONS.length - 1, Math.max(0, Math.floor((elapsed / durationSeconds) * VIDEO_CAPTIONS.length)));
    setCaptionIndex(idx);

    if (secondsLeft > 0 && secondsLeft % 3 === 0) {
      synth.playClick();
    }
  }, [secondsLeft, durationSeconds]);

  const progressPercent = Math.floor(((durationSeconds - secondsLeft) / durationSeconds) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl select-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-zinc-950 border border-amber-500/40 rounded-3xl max-w-lg w-full p-6 text-center space-y-5 shadow-2xl relative overflow-hidden"
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🎬</span>
            <div className="text-left">
              <h3 className="text-sm font-black text-amber-400 uppercase tracking-wider">
                Nova Arcade Official Studio Showcase ({durationSeconds}s)
              </h3>
              <p className="text-[10px] text-gray-400">Watch full promotional ad to unlock +500 Coins</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className={`p-2 rounded-full transition ${
              completed
                ? 'bg-amber-400 text-black hover:scale-110 active:scale-95'
                : 'bg-zinc-900 text-zinc-500 hover:text-white border border-white/10'
            }`}
            title={completed ? 'Close Video' : 'Exit without reward'}
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Video Player Box Frame */}
        <div className="relative aspect-video rounded-2xl bg-gradient-to-br from-purple-950 via-zinc-950 to-amber-950 border-2 border-amber-500/40 overflow-hidden flex flex-col justify-between p-5 shadow-inner">
          
          {/* Animated Background Rays */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-amber-500/15 via-purple-500/10 to-transparent animate-pulse" />

          {/* Top Video Overlay Bar */}
          <div className="relative z-10 flex items-center justify-between text-xs font-black text-amber-300">
            <div className="flex items-center gap-1.5 bg-black/70 px-3 py-1 rounded-full border border-amber-400/30">
              <Volume2 className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
              <span>HD STUDIO PROMO</span>
            </div>

            <div className="px-3 py-1 rounded-full bg-black/80 border border-amber-400/40 font-mono text-xs font-black text-amber-400 uppercase flex items-center gap-1.5 shadow-lg">
              <Zap className="h-3.5 w-3.5 text-amber-400 animate-spin" />
              <span>{secondsLeft}s left</span>
            </div>
          </div>

          {/* Presenter & Graphics Showcase Stage */}
          <div className="relative z-10 space-y-2 py-2">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-tr from-amber-400 via-yellow-300 to-amber-500 text-black flex items-center justify-center text-3xl font-black shadow-2xl shadow-amber-500/40 animate-bounce">
              🎙️
            </div>

            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-400 bg-amber-500/20 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                Nova Presenter Studio
              </span>
              <h4 className="text-base font-black text-white tracking-wider uppercase">
                Nova Arcade Gaming Platform
              </h4>
            </div>
          </div>

          {/* Captions Subtitle Box */}
          <div className="relative z-10 bg-black/85 backdrop-blur border border-amber-400/30 p-2.5 rounded-xl text-[11px] font-bold text-amber-300 tracking-wide shadow-lg">
            {VIDEO_CAPTIONS[captionIndex]}
          </div>

          {/* Bottom Video Progress Bar */}
          <div className="absolute bottom-0 left-0 right-0 h-2 bg-zinc-900">
            <div
              className="h-full bg-gradient-to-r from-red-500 via-amber-400 to-emerald-400 transition-all duration-1000 ease-linear"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Footer State & Completion Notice */}
        <div className="space-y-3">
          {!completed ? (
            <div className="p-3 rounded-2xl bg-zinc-900/80 border border-white/10 text-xs font-bold text-gray-400 flex items-center justify-center gap-2">
              <Shield className="h-4 w-4 text-amber-400 animate-pulse" />
              <span>Watch full video without skipping to earn +500 Coins</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="p-3.5 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-black uppercase flex items-center justify-center gap-2 animate-bounce">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Video Completed! +500 Coins Awarded to Wallet!</span>
              </div>
              <button
                onClick={onClose}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-yellow-500 text-black text-xs font-black uppercase tracking-wider shadow-xl hover:scale-105 active:scale-95 transition"
              >
                Collect 500 Coins & Exit
              </button>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
}
