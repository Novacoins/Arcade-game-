/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { synth } from '../utils/audioSynth';
import { motion } from 'motion/react';
import { Home3DIcon, Categories3DIcon, Missions3DIcon, Rank3DIcon, Profile3DIcon } from './NavIcons3D';

export type MainTabType = 'home' | 'missions' | 'rank' | 'profile' | 'favorites';

interface FooterProps {
  currentTab: MainTabType;
  onChangeTab: (tab: MainTabType) => void;
}

export default function Footer({ currentTab, onChangeTab }: FooterProps) {
  const [lastTapped, setLastTapped] = useState<string | null>(null);

  const tabs = [
    { id: 'home' as const, label: 'Home', IconComponent: Home3DIcon },
    { id: 'missions' as const, label: 'Rewards', IconComponent: Missions3DIcon },
    { id: 'rank' as const, label: 'Rank', IconComponent: Rank3DIcon },
    { id: 'profile' as const, label: 'Profile', IconComponent: Profile3DIcon },
  ];

  const handleTabClick = (tabId: MainTabType) => {
    setLastTapped(tabId);
    synth.playClick();
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      try {
        navigator.vibrate(15);
      } catch {
        /* ignore */
      }
    }
    onChangeTab(tabId);
    setTimeout(() => setLastTapped(null), 600);
  };

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-b from-zinc-900/90 via-zinc-950/98 to-black/98 border-t border-amber-500/30 backdrop-blur-2xl shadow-[0_-8px_30px_rgba(0,0,0,0.85)] select-none">
      
      {/* Subtle Top Gold Highlight Beam */}
      <div className="absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent opacity-80 shadow-[0_0_8px_rgba(250,204,21,0.8)]" />
      
      {/* Subtle Moving Light Sheen across top border */}
      <motion.div
        animate={{ x: ['-100%', '200%'] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'linear' }}
        className="absolute top-0 left-0 w-1/3 h-[1.5px] bg-gradient-to-r from-transparent via-amber-200 to-transparent opacity-60 pointer-events-none"
      />

      {/* Navigation Container - Strict original compact h-16 mobile layout */}
      <div className="flex items-center justify-around h-16 max-w-lg mx-auto px-1 relative">
        {tabs.map((tab) => {
          const Icon = tab.IconComponent;
          const isActive = currentTab === tab.id;
          const isJustTapped = lastTapped === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.id)}
              className="relative flex flex-col items-center justify-center flex-1 h-full py-0.5 group outline-none touch-manipulation cursor-pointer"
            >
              {/* Particle Sparkle Burst on Tap */}
              {isJustTapped && (
                <span className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <motion.span
                    initial={{ scale: 0.3, opacity: 1 }}
                    animate={{ scale: 1.8, opacity: 0 }}
                    transition={{ duration: 0.45, ease: 'easeOut' }}
                    className="w-10 h-10 rounded-full border border-amber-300 bg-amber-400/20 shadow-[0_0_20px_rgba(250,204,21,0.8)]"
                  />
                  {/* Micro particles */}
                  {[-12, 12, 0].map((dx, i) => (
                    <motion.span
                      key={i}
                      initial={{ opacity: 1, x: 0, y: 0, scale: 1 }}
                      animate={{ opacity: 0, x: dx, y: -18 + i * 4, scale: 0 }}
                      transition={{ duration: 0.4 }}
                      className="absolute w-1.5 h-1.5 rounded-full bg-amber-300 shadow-[0_0_6px_#FCD34D]"
                    />
                  ))}
                </span>
              )}

              {/* AAA Active Circular Holder & Aura Pod */}
              {isActive && (
                <motion.div
                  layoutId="active_3d_pod"
                  transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                  className="absolute top-1 w-11 h-11 rounded-full bg-gradient-to-b from-amber-500/30 via-zinc-900/90 to-amber-950/60 border border-amber-400/60 shadow-[0_0_18px_rgba(245,158,11,0.4)] flex items-center justify-center"
                >
                  {/* Inner Lens Glow */}
                  <div className="w-9 h-9 rounded-full bg-amber-500/10 border border-amber-300/20 backdrop-blur-sm" />
                  
                  {/* Periodic Ambient Pulse Ring */}
                  <motion.div
                    animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.7, 0.3] }}
                    transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
                    className="absolute inset-0 rounded-full border border-amber-400/40 pointer-events-none"
                  />
                </motion.div>
              )}

              {/* Animated 3D Icon Container */}
              <motion.div
                animate={
                  isActive
                    ? {
                        y: [-2, -5, -2],
                        scale: 1.08,
                      }
                    : {
                        y: 0,
                        scale: 1,
                      }
                }
                transition={
                  isActive
                    ? {
                        y: { repeat: Infinity, duration: 2.4, ease: 'easeInOut' },
                        scale: { type: 'spring', stiffness: 350, damping: 25 },
                      }
                    : { type: 'spring', stiffness: 350, damping: 25 }
                }
                whileTap={{ scale: 0.88 }}
                className={`relative z-10 flex items-center justify-center transition-all ${
                  isActive
                    ? 'drop-shadow-[0_4px_12px_rgba(250,204,21,0.6)]'
                    : 'opacity-70 group-hover:opacity-100 group-hover:scale-105'
                }`}
              >
                <Icon active={isActive} className="w-6 h-6" />
              </motion.div>

              {/* Text Label */}
              <motion.span
                animate={{
                  y: isActive ? 1 : 0,
                  opacity: isActive ? 1 : 0.65,
                }}
                transition={{ duration: 0.2 }}
                className={`relative z-10 text-[10px] font-black uppercase tracking-wider transition-colors mt-0.5 ${
                  isActive
                    ? 'text-amber-300 drop-shadow-[0_0_8px_rgba(250,204,21,0.5)]'
                    : 'text-gray-400 group-hover:text-gray-200'
                }`}
              >
                {tab.label}
              </motion.span>
            </button>
          );
        })}
      </div>
    </footer>
  );
}
