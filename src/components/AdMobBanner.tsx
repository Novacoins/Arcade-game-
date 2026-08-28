/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdMobManager } from '../utils/AdMobManager';
import { Info } from 'lucide-react';

interface AdMobBannerProps {
  isGameActive: boolean;
}

export const AdMobBanner: React.FC<AdMobBannerProps> = ({ isGameActive }) => {
  const [isVisible, setIsVisible] = useState(!isGameActive);

  useEffect(() => {
    if (isGameActive) {
      // Policy enforcement: Automatically hide Banner Ads whenever any game starts
      AdMobManager.hideBanner();
      setIsVisible(false);
    } else {
      // Restore Banner Ad on non-game pages (Home, Rewards, Shop, Profile, Settings, etc.)
      AdMobManager.showBanner();
      setIsVisible(true);
    }
  }, [isGameActive]);

  if (isGameActive || !isVisible) {
    return null;
  }

  return (
    <div className="w-full bg-slate-900/90 border-t border-slate-800/80 backdrop-blur-md py-2 px-3 flex flex-col items-center justify-center text-center transition-all duration-300 z-40 shrink-0">
      <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-mono tracking-wider uppercase mb-1">
        <Info className="w-3 h-3 text-slate-600" />
        <span>Advertisement &bull; Google AdMob Mobile Placement</span>
      </div>
      
      {/* 320x50 Standard Mobile Banner Box / Native Webview Anchor */}
      <div className="w-full max-w-[320px] h-[50px] bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 border border-slate-800 rounded-lg flex items-center justify-center relative overflow-hidden shadow-sm group hover:border-blue-500/30 transition">
        <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/5 to-amber-500/5 opacity-50" />
        <div className="z-10 flex items-center gap-2 px-3">
          <div className="w-7 h-7 rounded bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-xs shadow">
            N
          </div>
          <div className="text-left">
            <div className="text-xs font-bold text-slate-200 leading-none">Nova VIP Pass</div>
            <div className="text-[9px] text-amber-400/90 font-medium">Play Free &bull; Win Daily Rewards</div>
          </div>
        </div>
        <span className="absolute right-2 top-1 text-[8px] bg-slate-800/80 text-slate-400 px-1 rounded">Ad</span>
      </div>
    </div>
  );
};
