/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { 
  Sparkles, Trophy, Zap, Target, Award, Shield, Crown,
  Coins, RotateCw, CheckCircle2, Lock, Eye, ShoppingBag, X, Check, Play, RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CardDuelProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

export interface DeckTheme {
  id: string;
  name: string;
  price: number;
  desc: string;
  cardBackBg: string;
  cardBorder: string;
  glowColor: string;
  previewEmoji: string;
}

export const DECK_THEMES: DeckTheme[] = [
  { id: 'royal_gold', name: 'Royal Gold Deck', price: 0, desc: 'Golden foil card backs with imperial motifs', cardBackBg: 'from-amber-600 via-amber-400 to-amber-700', cardBorder: 'border-amber-300', glowColor: 'shadow-[0_0_15px_rgba(245,158,11,0.4)]', previewEmoji: '👑' },
  { id: 'cyber_neon', name: 'Cyber Neon Deck', price: 500, desc: 'Holographic cybernetic laser circuit deck', cardBackBg: 'from-cyan-600 via-blue-500 to-indigo-900', cardBorder: 'border-cyan-300', glowColor: 'shadow-[0_0_15px_rgba(6,182,212,0.5)]', previewEmoji: '⚡' },
  { id: 'crystal_ice', name: 'Crystal Deck', price: 1000, desc: 'Frozen crystal ice cards with frost sparkle', cardBackBg: 'from-sky-500 via-indigo-400 to-blue-800', cardBorder: 'border-sky-300', glowColor: 'shadow-[0_0_15px_rgba(56,189,248,0.5)]', previewEmoji: '💎' },
  { id: 'dragon_fire', name: 'Dragon Deck', price: 2000, desc: 'Ancient dragon scale cards with molten glow', cardBackBg: 'from-red-600 via-orange-500 to-amber-800', cardBorder: 'border-red-400', glowColor: 'shadow-[0_0_15px_rgba(239,68,68,0.5)]', previewEmoji: '🐉' },
  { id: 'luxury_black', name: 'Luxury Black Deck', price: 3500, desc: 'Matte black obsidian finish with gold foil inlay', cardBackBg: 'from-zinc-900 via-black to-zinc-950', cardBorder: 'border-amber-400/80', glowColor: 'shadow-[0_0_15px_rgba(250,204,21,0.3)]', previewEmoji: '🖤' },
  { id: 'galaxy_void', name: 'Galaxy Deck', price: 5000, desc: 'Cosmic nebula pattern with shimmering stars', cardBackBg: 'from-purple-900 via-fuchsia-600 to-indigo-950', cardBorder: 'border-fuchsia-300', glowColor: 'shadow-[0_0_15px_rgba(217,70,239,0.5)]', previewEmoji: '🌌' },
];

export interface Card {
  val: number;
  txt: string;
  suit: string;
  isRed: boolean;
}

export function CardDuel({ coins, onGameWin, onGameLose }: CardDuelProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [coinsToPay, setCoinsToPay] = useState<number>(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'player_won' | 'dealer_won' | 'push'>('idle');
  
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [dealerCards, setDealerCards] = useState<Card[]>([]);
  const [toastMsg, setToastMsg] = useState<string>('');

  // Unlocked Deck Themes
  const [unlockedDecks, setUnlockedDecks] = useState<string[]>(() => {
    const saved = localStorage.getItem('cd_unlocked_decks');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return ['royal_gold'];
  });

  const [activeDeckId, setActiveDeckId] = useState<string>(() => {
    return localStorage.getItem('cd_active_deck') || 'royal_gold';
  });

  const [deckModalOpen, setDeckModalOpen] = useState<boolean>(false);
  const [confirmUnlockDeck, setConfirmUnlockDeck] = useState<DeckTheme | null>(null);

  // Stats & XP
  const [stats, setStats] = useState(() => {
    const saved = localStorage.getItem('cd_career_stats');
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return { played: 0, wins: 0, blackjacks: 0, xp: 0 };
  });

  useEffect(() => {
    localStorage.setItem('cd_unlocked_decks', JSON.stringify(unlockedDecks));
  }, [unlockedDecks]);

  useEffect(() => {
    localStorage.setItem('cd_active_deck', activeDeckId);
  }, [activeDeckId]);

  useEffect(() => {
    localStorage.setItem('cd_career_stats', JSON.stringify(stats));
  }, [stats]);

  const activeDeck = DECK_THEMES.find(d => d.id === activeDeckId) || DECK_THEMES[0];

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 3000);
  };

  const drawSingleCard = (): Card => {
    const suits = [
      { sym: '♠', isRed: false },
      { sym: '♥', isRed: true },
      { sym: '♦', isRed: true },
      { sym: '♣', isRed: false },
    ];
    const ranks = [
      { txt: 'A', val: 11 }, { txt: '2', val: 2 }, { txt: '3', val: 3 }, { txt: '4', val: 4 },
      { txt: '5', val: 5 }, { txt: '6', val: 6 }, { txt: '7', val: 7 }, { txt: '8', val: 8 },
      { txt: '9', val: 9 }, { txt: '10', val: 10 }, { txt: 'J', val: 10 }, { txt: 'Q', val: 10 },
      { txt: 'K', val: 10 },
    ];

    const r = ranks[Math.floor(Math.random() * ranks.length)];
    const s = suits[Math.floor(Math.random() * suits.length)];

    return {
      txt: r.txt,
      val: r.val,
      suit: s.sym,
      isRed: s.isRed,
    };
  };

  const calculateHandSum = (hand: Card[]) => {
    let sum = hand.reduce((acc, c) => acc + c.val, 0);
    let aces = hand.filter(c => c.txt === 'A').length;

    while (sum > 21 && aces > 0) {
      sum -= 10;
      aces -= 1;
    }
    return sum;
  };

  // Start Duel Round
  const handleStartDuel = () => {
    if (gameState === 'playing') return;

    if (!validateAndDeductCoins(coinsToPay, 'Card Duel')) {
      return;
    }

    synth.playCard();

    const c1 = drawSingleCard();
    const c2 = drawSingleCard();
    const d1 = drawSingleCard();

    setPlayerCards([c1, c2]);
    setDealerCards([d1]);
    setGameState('playing');

    // Check instant Blackjack (21)
    const pSum = calculateHandSum([c1, c2]);
    if (pSum === 21) {
      setTimeout(() => {
        handlePlayerWin(2.5, true);
      }, 500);
    }
  };

  // Hit
  const handleHit = () => {
    if (gameState !== 'playing') return;
    synth.playCard();

    const newCard = drawSingleCard();
    const updated = [...playerCards, newCard];
    setPlayerCards(updated);

    const newSum = calculateHandSum(updated);
    if (newSum > 21) {
      // Bust!
      synth.playError();
      setGameState('dealer_won');
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
    }
  };

  // Stand
  const handleStand = () => {
    if (gameState !== 'playing') return;
    synth.playCard();

    let dHand = [...dealerCards];
    while (calculateHandSum(dHand) < 17) {
      dHand.push(drawSingleCard());
    }
    setDealerCards(dHand);

    const pSum = calculateHandSum(playerCards);
    const dSum = calculateHandSum(dHand);

    if (dSum > 21 || pSum > dSum) {
      handlePlayerWin(2.0, false);
    } else if (pSum < dSum) {
      synth.playError();
      setGameState('dealer_won');
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
    } else {
      // Push (Draw)
      synth.playClick();
      setGameState('push');
      onGameWin(coinsToPay, 1.0);
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
    }
  };

  // Double Down
  const handleDouble = () => {
    if (gameState !== 'playing') return;

    if (coins < coinsToPay) {
      showToast('Insufficient coins balance to double down!');
      return;
    }

    synth.playCard();
    onGameLose(coinsToPay); // Pay additional coinsToPay

    const newCard = drawSingleCard();
    const updated = [...playerCards, newCard];
    setPlayerCards(updated);

    const pSum = calculateHandSum(updated);
    if (pSum > 21) {
      synth.playError();
      setGameState('dealer_won');
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
      return;
    }

    // Dealer draws
    let dHand = [...dealerCards];
    while (calculateHandSum(dHand) < 17) {
      dHand.push(drawSingleCard());
    }
    setDealerCards(dHand);

    const dSum = calculateHandSum(dHand);
    if (dSum > 21 || pSum > dSum) {
      handlePlayerWin(4.0, false); // 2x bet doubled = 4.0 payout
    } else if (pSum < dSum) {
      synth.playError();
      setGameState('dealer_won');
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
    } else {
      synth.playClick();
      setGameState('push');
      onGameWin(coinsToPay * 2, 1.0);
      setStats(prev => ({ ...prev, played: prev.played + 1 }));
    }
  };

  const handlePlayerWin = (mult: number, isBlackjack: boolean) => {
    synth.playFanfare();
    setGameState('player_won');

    const totalReward = Math.floor(coinsToPay * mult);
    onGameWin(totalReward, mult);

    setStats(prev => ({
      played: prev.played + 1,
      wins: prev.wins + 1,
      blackjacks: isBlackjack ? prev.blackjacks + 1 : prev.blackjacks,
      xp: prev.xp + (isBlackjack ? 150 : 75),
    }));
  };

  const handlePurchaseDeck = (deck: DeckTheme) => {
    if (coins < deck.price) {
      synth.playError();
      showToast('Insufficient coins balance!');
      return;
    }

    synth.playFanfare();
    onGameLose(deck.price);
    setUnlockedDecks(prev => [...prev, deck.id]);
    setActiveDeckId(deck.id);
    setConfirmUnlockDeck(null);
    showToast(`🎉 Unlocked ${deck.name}!`);
  };

  const playerSum = calculateHandSum(playerCards);
  const dealerSum = calculateHandSum(dealerCards);

  const setQuickCoins = (type: 'min' | 'half' | 'double' | 'max') => {
    synth.playClick();
    if (type === 'min') setCoinsToPay(10);
    if (type === 'half') setCoinsToPay(prev => Math.max(10, Math.floor(prev / 2)));
    if (type === 'double') setCoinsToPay(prev => Math.min(coins, prev * 2));
    if (type === 'max') setCoinsToPay(prev => Math.min(10000, coins));
  };

  return (
    <div className="bg-gradient-to-b from-emerald-950 via-zinc-950 to-black p-4 sm:p-6 rounded-3xl border border-emerald-500/20 max-w-xl mx-auto space-y-6 text-center shadow-2xl relative overflow-hidden backdrop-blur-2xl">
      
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
      <div className="relative z-10 border-b border-white/10 pb-4 flex items-center justify-between">
        <div className="flex items-center gap-3 text-left">
          <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-emerald-400 to-amber-500 p-0.5 shadow-lg flex items-center justify-center">
            <div className="h-full w-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-xl">
              🃏
            </div>
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-emerald-300">
              Strategy Card Duel
            </h3>
            <p className="text-[10px] text-gray-400 font-bold">
              Deck: <span className="text-amber-300">{activeDeck.name}</span>
            </p>
          </div>
        </div>

        <button
          onClick={() => { synth.playClick(); setDeckModalOpen(true); }}
          className="px-3 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-xs font-black text-amber-300 flex items-center gap-1.5 hover:bg-amber-500/30 transition"
        >
          <ShoppingBag className="h-3.5 w-3.5" />
          <span>Card Decks</span>
        </button>
      </div>

      {/* Casino Felt Arena Table */}
      <div className="relative z-10 bg-emerald-900/30 p-6 rounded-3xl border border-emerald-500/30 space-y-6 shadow-inner min-h-[280px] flex flex-col justify-between">
        
        {/* Dealer Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-emerald-200">
            <span>DEALER HAND</span>
            <span className="font-mono bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {gameState === 'playing' ? '?' : dealerSum}
            </span>
          </div>
          <div className="flex justify-center gap-2 min-h-[80px] items-center">
            {dealerCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ y: -30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`h-20 w-14 rounded-xl border-2 bg-white flex flex-col items-center justify-between p-1.5 font-black text-xs shadow-lg ${
                  c.isRed ? 'text-red-600 border-red-200' : 'text-black border-gray-300'
                }`}
              >
                <div className="text-[10px] leading-none self-start">{c.txt}</div>
                <div className="text-xl">{c.suit}</div>
                <div className="text-[10px] leading-none self-end">{c.txt}</div>
              </motion.div>
            ))}
            {dealerCards.length === 0 && (
              <div className="text-xs text-emerald-400/50 italic font-mono">Press Start Duel to deal cards</div>
            )}
          </div>
        </div>

        {/* Status Message */}
        {gameState !== 'idle' && gameState !== 'playing' && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`py-2 px-4 rounded-2xl text-xs font-black uppercase tracking-wider inline-block mx-auto ${
              gameState === 'player_won'
                ? 'bg-emerald-500/20 border border-emerald-400 text-emerald-300 shadow-[0_0_15px_rgba(16,185,129,0.5)]'
                : gameState === 'push'
                ? 'bg-amber-500/20 border border-amber-400 text-amber-300'
                : 'bg-red-500/20 border border-red-500 text-red-300'
            }`}
          >
            {gameState === 'player_won' ? '🎉 YOU WIN DUEL!' : gameState === 'push' ? '🤝 DRAW (PUSH)' : '❌ DEALER WINS'}
          </motion.div>
        )}

        {/* Player Area */}
        <div className="space-y-2">
          <div className="flex justify-between items-center text-xs font-black text-emerald-200">
            <span>YOUR HAND</span>
            <span className="font-mono bg-black/60 px-2 py-0.5 rounded-lg border border-emerald-500/20">
              {playerSum}
            </span>
          </div>
          <div className="flex justify-center gap-2 min-h-[80px] items-center">
            {playerCards.map((c, i) => (
              <motion.div
                key={i}
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className={`h-20 w-14 rounded-xl border-2 bg-white flex flex-col items-center justify-between p-1.5 font-black text-xs shadow-lg ${
                  c.isRed ? 'text-red-600 border-red-200' : 'text-black border-gray-300'
                }`}
              >
                <div className="text-[10px] leading-none self-start">{c.txt}</div>
                <div className="text-xl">{c.suit}</div>
                <div className="text-[10px] leading-none self-end">{c.txt}</div>
              </motion.div>
            ))}
          </div>
        </div>

      </div>

      {/* Action Controls */}
      {gameState === 'playing' ? (
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleHit}
            className="py-3.5 rounded-2xl bg-amber-500 text-black font-black text-xs uppercase tracking-wider hover:bg-amber-400 active:scale-95 transition shadow-lg"
          >
            ➕ HIT
          </button>
          <button
            onClick={handleStand}
            className="py-3.5 rounded-2xl bg-emerald-500 text-black font-black text-xs uppercase tracking-wider hover:bg-emerald-400 active:scale-95 transition shadow-lg"
          >
            ✋ STAND
          </button>
          <button
            onClick={handleDouble}
            className="py-3.5 rounded-2xl bg-purple-500 text-white font-black text-xs uppercase tracking-wider hover:bg-purple-400 active:scale-95 transition shadow-lg"
          >
            ⚡ DOUBLE
          </button>
        </div>
      ) : (
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleStartDuel}
          className="relative z-10 w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-600 text-black font-black text-xs sm:text-sm uppercase tracking-widest shadow-2xl shadow-emerald-500/30 flex items-center justify-center gap-2 cursor-pointer"
        >
          <Play className="h-5 w-5 fill-current" />
          <span>▶ START CARD DUEL</span>
        </motion.button>
      )}

      {/* Coins to Pay */}
      <div className="relative z-10 bg-zinc-950/80 p-4 rounded-3xl border border-white/10 space-y-3 text-left">
        <div className="flex justify-between items-center text-xs font-black">
          <label className="uppercase text-amber-400 tracking-wider">Coins to Pay</label>
          <span className="text-gray-400 font-mono">Available: {coins.toLocaleString()} 🪙</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          <input
            type="number"
            disabled={gameState === 'playing'}
            value={coinsToPay}
            onChange={(e) => setCoinsToPay(Math.max(10, Math.min(coins, parseInt(e.target.value) || 0)))}
            className="w-full text-center rounded-2xl border border-white/10 bg-black/80 py-3 text-base font-mono font-black text-white focus:border-emerald-400 outline-none"
          />

          <div className="grid grid-cols-4 gap-1">
            <button
              onClick={() => setQuickCoins('min')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Min
            </button>
            <button
              onClick={() => setQuickCoins('half')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              /2
            </button>
            <button
              onClick={() => setQuickCoins('double')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              x2
            </button>
            <button
              onClick={() => setQuickCoins('max')}
              disabled={gameState === 'playing'}
              className="rounded-xl bg-zinc-800 hover:bg-zinc-700 text-[10px] font-black text-gray-300 uppercase transition"
            >
              Max
            </button>
          </div>
        </div>
      </div>

      {/* Career Stats */}
      <div className="relative z-10 bg-zinc-950/80 p-3 rounded-2xl border border-white/10 grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Played</div>
          <div className="text-xs font-mono font-black text-white">{stats.played}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">Wins</div>
          <div className="text-xs font-mono font-black text-emerald-400">{stats.wins}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">21s (BJ)</div>
          <div className="text-xs font-mono font-black text-amber-300">{stats.blackjacks}</div>
        </div>
        <div>
          <div className="text-[8px] font-bold text-gray-400 uppercase">XP</div>
          <div className="text-xs font-mono font-black text-purple-400">{stats.xp}</div>
        </div>
      </div>

      {/* Deck Store Modal */}
      <AnimatePresence>
        {deckModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-emerald-500/50 rounded-3xl p-6 max-w-md w-full space-y-4 text-left shadow-2xl relative max-h-[85vh] overflow-y-auto"
            >
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <h3 className="text-sm font-black text-emerald-400 uppercase tracking-wider flex items-center gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Unlockable Card Deck Themes
                </h3>
                <button
                  onClick={() => setDeckModalOpen(false)}
                  className="h-8 w-8 rounded-full bg-zinc-800 flex items-center justify-center text-gray-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3">
                {DECK_THEMES.map(deck => {
                  const isUnlocked = unlockedDecks.includes(deck.id);
                  const isActive = activeDeckId === deck.id;

                  return (
                    <div
                      key={deck.id}
                      className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${
                        isActive
                          ? 'bg-emerald-500/20 border-emerald-400 text-white'
                          : isUnlocked
                          ? 'bg-zinc-900 border-white/10 text-gray-300'
                          : 'bg-zinc-950/80 border-white/5 opacity-80'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-xl shadow">
                          {deck.previewEmoji}
                        </div>
                        <div>
                          <div className="text-xs font-black text-white flex items-center gap-1.5">
                            <span>{deck.name}</span>
                            {isActive && <span className="text-[9px] bg-emerald-400 text-black px-1.5 py-0.2 rounded-full font-black">ACTIVE</span>}
                          </div>
                          <div className="text-[10px] text-gray-400">{deck.desc}</div>
                        </div>
                      </div>

                      <div>
                        {isActive ? (
                          <div className="text-emerald-400 text-xs font-black flex items-center gap-1">
                            <Check className="h-4 w-4" />
                            <span>Equipped</span>
                          </div>
                        ) : isUnlocked ? (
                          <button
                            onClick={() => {
                              synth.playClick();
                              setActiveDeckId(deck.id);
                              setDeckModalOpen(false);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-black uppercase hover:bg-emerald-500/30 transition"
                          >
                            Equip
                          </button>
                        ) : (
                          <button
                            onClick={() => setConfirmUnlockDeck(deck)}
                            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-400 text-black text-xs font-black uppercase tracking-wider hover:scale-105 active:scale-95 transition shadow"
                          >
                            {deck.price} 🪙
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {confirmUnlockDeck && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-zinc-950 border-2 border-emerald-400 rounded-3xl p-6 max-w-xs w-full space-y-4 text-center shadow-2xl"
            >
              <div className="text-4xl">{confirmUnlockDeck.previewEmoji}</div>
              <h3 className="text-base font-black text-emerald-400 uppercase">
                Unlock {confirmUnlockDeck.name}?
              </h3>
              <p className="text-xs text-gray-300">
                Cost: <strong className="text-amber-300">{confirmUnlockDeck.price} 🪙</strong>
              </p>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <button
                  onClick={() => setConfirmUnlockDeck(null)}
                  className="py-2.5 rounded-xl bg-zinc-800 text-xs font-black text-gray-300 uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handlePurchaseDeck(confirmUnlockDeck)}
                  className="py-2.5 rounded-xl bg-emerald-400 text-black text-xs font-black uppercase shadow-lg"
                >
                  Confirm
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}
