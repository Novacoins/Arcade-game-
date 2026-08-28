/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { Sparkles, Play, Coins } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface SlotMachineProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

const REEL_SYMBOLS = [
  { icon: '💎', label: 'Diamond', mult: 10 },
  { icon: '👑', label: 'Crown', mult: 8 },
  { icon: '7️⃣', label: 'Seven', mult: 5 },
  { icon: '🔥', label: 'Fire', mult: 3 },
  { icon: '❇️', label: 'Gem', mult: 2 },
  { icon: '🪙', label: 'Coin', mult: 1 },
];

export function SlotMachine({ coins, onGameWin, onGameLose }: SlotMachineProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  const [reels, setReels] = useState<number[]>([0, 1, 2]);
  const [spinning, setSpinning] = useState<boolean>(false);
  const [lastWinMult, setLastWinMult] = useState<number | null>(null);
  const [toastMsg, setToastMsg] = useState<string>('');

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const handleSpin = () => {
    if (spinning) return;

    if (!validateAndDeductCoins(coinsToPay, 'Slot Machine')) {
      return;
    }

    synth.playClick();
    setSpinning(true);
    setLastWinMult(null);

    // Spin reel animation ticks
    let intervalCount = 0;
    const interval = setInterval(() => {
      setReels([
        Math.floor(Math.random() * REEL_SYMBOLS.length),
        Math.floor(Math.random() * REEL_SYMBOLS.length),
        Math.floor(Math.random() * REEL_SYMBOLS.length),
      ]);
      synth.playTick();
      intervalCount++;

      if (intervalCount >= 18) {
        clearInterval(interval);
        
        // Final outcome calculation
        const r1 = Math.floor(Math.random() * REEL_SYMBOLS.length);
        const r2 = Math.floor(Math.random() * REEL_SYMBOLS.length);
        const r3 = Math.floor(Math.random() * REEL_SYMBOLS.length);

        setReels([r1, r2, r3]);
        setSpinning(false);

        if (r1 === r2 && r2 === r3) {
          // 3 of a kind match!
          const symbol = REEL_SYMBOLS[r1];
          const mult = symbol.mult * 2;
          synth.playFanfare();
          setLastWinMult(mult);
          onGameWin(coinsToPay * mult, mult);
        } else if (r1 === r2 || r2 === r3 || r1 === r3) {
          // 2 of a kind match
          const matchedIdx = (r1 === r2 || r1 === r3) ? r1 : r2;
          const symbol = REEL_SYMBOLS[matchedIdx];
          const mult = Math.max(1, Math.floor(symbol.mult / 2));
          synth.playCoin();
          setLastWinMult(mult);
          onGameWin(coinsToPay * mult, mult);
        } else {
          // Lose
          synth.playError();
          setLastWinMult(0);
        }
      }
    }, 100);
  };

  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(10000, coins));
  };

  return (
    <div className="bg-gradient-to-b from-zinc-950 via-purple-950/40 to-black p-4 sm:p-6 rounded-3xl border border-purple-500/30 max-w-md mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl">

      {/* Toast Notice */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-amber-400 text-black px-4 py-2 rounded-2xl font-black text-xs shadow-2xl flex items-center gap-2 border border-yellow-200"
          >
            <Sparkles className="h-4 w-4" />
            <span>{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <div className="relative z-10 border-b border-white/10 pb-3 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-fuchsia-500 to-purple-600 p-0.5 shadow-lg flex items-center justify-center">
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl">
              🎰
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-fuchsia-400">
              Cyber Slot Arena
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              3-Reel Diamond Multipliers
            </p>
          </div>
        </div>

        <div className="px-3 py-1.5 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-black flex items-center gap-1">
          <Coins className="h-3.5 w-3.5 text-amber-400" />
          <span>{coins.toLocaleString()} 🪙</span>
        </div>
      </div>

      {/* Reels Box */}
      <div className="relative z-10 bg-zinc-950 p-4 rounded-3xl border-2 border-fuchsia-500/40 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
        <div className="grid grid-cols-3 gap-3">
          {reels.map((idx, i) => (
            <motion.div
              key={i}
              animate={spinning ? { y: [0, -10, 0] } : {}}
              transition={{ repeat: Infinity, duration: 0.15 }}
              className="h-28 rounded-2xl bg-gradient-to-b from-zinc-900 via-zinc-950 to-black border border-white/10 flex flex-col items-center justify-center shadow-inner relative overflow-hidden"
            >
              <div className="text-4xl sm:text-5xl my-1 filter drop-shadow-[0_0_12px_rgba(217,70,239,0.6)]">
                {REEL_SYMBOLS[idx].icon}
              </div>
              <span className="text-[9px] font-black text-fuchsia-300 uppercase tracking-widest mt-1">
                {REEL_SYMBOLS[idx].label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>

      {lastWinMult !== null && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className={`py-2 px-4 rounded-2xl text-xs font-black uppercase tracking-wider inline-block ${
            lastWinMult > 0 
              ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.4)]'
              : 'bg-red-500/20 border border-red-500 text-red-300'
          }`}
        >
          {lastWinMult > 0 ? `🎉 MATCH WIN! MULTIPLIER ${lastWinMult}x (+${(coinsToPay * lastWinMult).toLocaleString()} 🪙)` : '❌ NO MATCH'}
        </motion.div>
      )}

      {/* Coins to Pay */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-fuchsia-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={spinning}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-fuchsia-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={spinning}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Spin Button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.96 }}
        onClick={handleSpin}
        disabled={spinning}
        className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-fuchsia-500 via-purple-500 to-pink-600 text-white font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-fuchsia-500/30 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
      >
        <Play className="h-5 w-5 fill-current" />
        <span>▶ PULL SLOTS LEVER</span>
      </motion.button>

    </div>
  );
}
