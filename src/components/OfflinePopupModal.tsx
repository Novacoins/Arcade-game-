/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { WifiOff, RefreshCw, LogOut, CloudOff, ShieldAlert } from 'lucide-react';
import { PerformanceManager } from '../utils/PerformanceManager';

interface OfflinePopupModalProps {
  isOnline: boolean;
  onExitGame?: () => void;
}

export const OfflinePopupModal: React.FC<OfflinePopupModalProps> = ({ isOnline, onExitGame }) => {
  const [isRetrying, setIsRetrying] = useState(false);
  const [particles, setParticles] = useState<{ id: number; left: number; top: number; size: number; duration: number; delay: number }[]>([]);

  useEffect(() => {
    // Generate subtle background particles for luxury glassmorphism atmosphere
    const pts = Array.from({ length: 25 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 10 + 10,
      delay: Math.random() * 5,
    }));
    setParticles(pts);
  }, []);

  if (isOnline) return null;

  const handleRetry = async () => {
    setIsRetrying(true);
    try {
      if (typeof navigator !== 'undefined' && navigator.vibrate) {
        navigator.vibrate([30, 30, 30]);
      }
    } catch { /* ignore */ }

    const online = await PerformanceManager.verifyNetworkConnection();
    setTimeout(() => {
      setIsRetrying(false);
      if (!online) {
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100]);
          }
        } catch { /* ignore */ }
      }
    }, 800);
  };

  const handleExit = () => {
    if (onExitGame) {
      onExitGame();
    } else {
      window.location.reload();
    }
  };

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-2xl animate-in fade-in duration-500 overflow-hidden select-none">
      {/* Subtle floating background particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {particles.map((p) => (
          <div
            key={p.id}
            className="absolute rounded-full bg-gradient-to-tr from-blue-400/20 to-amber-400/20 animate-pulse"
            style={{
              left: `${p.left}%`,
              top: `${p.top}%`,
              width: `${p.size}px`,
              height: `${p.size}px`,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
        {/* Glowing luxury ambient background orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-amber-500/15 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      {/* Luxury Full-Screen Glassmorphism Popup Card */}
      <div className="relative w-full max-w-lg bg-gradient-to-b from-slate-900/95 via-slate-950/95 to-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_60px_rgba(59,130,246,0.25)] flex flex-col items-center text-center backdrop-blur-3xl transform transition-all animate-in zoom-in-95 duration-500">
        
        {/* Soft Gold & Blue Top Accent Glow Bar */}
        <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-48 h-1.5 bg-gradient-to-r from-transparent via-amber-400 to-transparent rounded-full blur-[1px]" />

        {/* Animated Wi-Fi or Cloud Connection Icon */}
        <div className="relative mb-6">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500/20 via-slate-800/80 to-amber-500/20 border border-blue-400/30 flex items-center justify-center shadow-[0_0_30px_rgba(59,130,246,0.3)]">
            <WifiOff className="w-12 h-12 text-amber-400 animate-bounce" />
          </div>
          <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-red-500/90 border-2 border-slate-900 flex items-center justify-center shadow-lg">
            <CloudOff className="w-4 h-4 text-white" />
          </div>
        </div>

        {/* Popup Title */}
        <h2 className="text-2xl sm:text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-amber-200 tracking-tight mb-4 flex items-center gap-2.5">
          <ShieldAlert className="w-7 h-7 text-amber-400 inline shrink-0" />
          Internet Connection Required
        </h2>

        {/* Popup Message */}
        <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-medium mb-8 max-w-md bg-slate-900/50 p-4 rounded-2xl border border-white/5 shadow-inner">
          Nova requires an active internet connection to provide the best experience. Internet access is needed to load games, synchronize progress, display rewards, deliver live content, and support advertisements that keep the platform free for everyone. Please connect to Wi-Fi or mobile data and try again.
        </p>

        {/* Action Buttons */}
        <div className="w-full flex flex-col sm:flex-row gap-3">
          {/* Retry Connection (Primary) */}
          <button
            onClick={handleRetry}
            disabled={isRetrying}
            className="flex-1 py-4 px-6 rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-base shadow-[0_0_25px_rgba(37,99,235,0.4)] border border-blue-400/30 flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-75"
          >
            <RefreshCw className={`w-5 h-5 ${isRetrying ? 'animate-spin text-amber-300' : ''}`} />
            <span>{isRetrying ? 'Checking Connection...' : 'Retry Connection'}</span>
          </button>

          {/* Exit Game (Secondary) */}
          <button
            onClick={handleExit}
            className="py-4 px-6 rounded-2xl bg-slate-800/80 hover:bg-slate-800 text-slate-300 hover:text-white font-semibold text-base border border-white/10 flex items-center justify-center gap-2 transition-all active:scale-95"
          >
            <LogOut className="w-5 h-5 text-amber-400/80" />
            <span>Exit Game</span>
          </button>
        </div>

        {/* Status Indicator Footer */}
        <div className="mt-6 flex items-center gap-2 text-xs text-slate-400 font-mono bg-black/40 px-3 py-1.5 rounded-full border border-white/5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span>OFFLINE MODE ACTIVE &bull; AUTO-RECONNECT ENABLED</span>
        </div>
      </div>
    </div>
  );
};
