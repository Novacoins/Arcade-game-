/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { AdMobManager } from '../utils/AdMobManager';
import { X, Sparkles, ShieldCheck } from 'lucide-react';

export const AdMobInterstitialModal: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [countdown, setCountdown] = useState(3);
  const [onCompleteCallback, setOnCompleteCallback] = useState<(() => void) | undefined>(undefined);

  useEffect(() => {
    const unsubscribe = AdMobManager.subscribe((event, data) => {
      if (event === 'interstitial_show') {
        setOnCompleteCallback(() => data?.onComplete);
        setCountdown(3);
        setIsOpen(true);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
    if (onCompleteCallback) {
      onCompleteCallback();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9990] bg-slate-950/95 backdrop-blur-xl flex flex-col items-center justify-center p-4 animate-in fade-in duration-300">
      {/* Top Header / Skip Control */}
      <div className="w-full max-w-sm flex items-center justify-between mb-4 px-2">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Sponsor Message &bull; AdMob Interstitial</span>
        </div>
        
        <button
          onClick={handleClose}
          disabled={countdown > 0}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
            countdown > 0
              ? 'bg-slate-800/80 text-slate-400 cursor-not-allowed border border-white/5'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg scale-105 cursor-pointer'
          }`}
        >
          {countdown > 0 ? (
            <span>Skip in {countdown}s</span>
          ) : (
            <>
              <span>Skip Ad</span>
              <X className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Ad Card Container */}
      <div className="relative w-full max-w-sm bg-gradient-to-b from-slate-900 via-slate-950 to-slate-900 border border-amber-500/30 rounded-3xl p-6 text-center shadow-2xl flex flex-col items-center overflow-hidden">
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center font-black text-slate-950 text-2xl shadow-lg mb-4 transform -rotate-3">
          <Sparkles className="w-8 h-8 text-slate-950 animate-pulse" />
        </div>

        <span className="text-[10px] uppercase font-bold tracking-widest text-amber-400/80 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 mb-2">
          Featured Partner
        </span>

        <h3 className="text-xl font-extrabold text-white mb-2 tracking-tight">
          Level Up Your Mobile Gaming
        </h3>

        <p className="text-xs text-slate-300 leading-relaxed max-w-xs mb-6">
          Experience zero lag, instant cloud saving, and exclusive VIP daily perks with the official Nova Android App on Google Play.
        </p>

        <button
          onClick={handleClose}
          className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 text-white font-bold text-sm shadow-[0_0_20px_rgba(37,99,235,0.4)] border border-blue-400/30 active:scale-95 transition"
        >
          Continue to Nova Engine &rarr;
        </button>

        <span className="mt-4 text-[9px] text-slate-500 font-mono">
          Ad placement complies with Google AdMob transition guidelines
        </span>
      </div>
    </div>
  );
};
