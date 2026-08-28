/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile, GameStats, Achievement, DailyMission, WalletTransaction, LeaderboardEntry } from '../types';

const STORAGE_KEYS = {
  PROFILE: 'sg_profile',
  STATS: 'sg_stats',
  ACHIEVEMENTS: 'sg_achievements',
  MISSIONS: 'sg_missions',
  TRANSACTIONS: 'sg_transactions',
  LAST_CLAIM: 'sg_last_claim',
  CLAIM_STREAK: 'sg_claim_streak',
};

export const DEFAULT_PROFILE: UserProfile = {
  username: 'Nova Studio',
  avatar: '🤠',
  level: 1,
  xp: 150,
  xpNeeded: 1000,
  coins: 10000,
  diamonds: 150,
  isGuest: true,
  joinedAt: new Date().toLocaleDateString(),
  favorites: [],
  recentlyPlayed: [],
  favoriteHeartColor: 'gold',
};

export const DEFAULT_STATS: GameStats = {
  gamesPlayed: 0,
  totalWon: 0,
  biggestWin: 0,
  favoriteGenre: 'Crash',
  playTimeMinutes: 0,
};

export const DEFAULT_ACHIEVEMENTS: Achievement[] = [
  { id: 'sky_high', title: 'Sky High Cashout', description: 'Cash out above 3.5x in Sky Flight', badge: '🚀', xpReward: 200, coinReward: 1000, completed: false, progress: 0, maxProgress: 1 },
  { id: 'gem_hunter', title: 'Gem Miner', description: 'Reveal 5 gems in Gem Mines without hitting hazards', badge: '💎', xpReward: 250, coinReward: 1500, completed: false, progress: 0, maxProgress: 5 },
  { id: 'bottle_spinner', title: 'Lucky Rotation', description: 'Get a 5x or higher in Lucky Bottle', badge: '🍾', xpReward: 150, coinReward: 800, completed: false, progress: 0, maxProgress: 1 },
  { id: 'coin_clash_pro', title: 'Double Flipper', description: 'Win Coin Clash 3 times in a row', badge: '🪙', xpReward: 200, coinReward: 1000, completed: false, progress: 0, maxProgress: 3 },
  { id: 'wheel_spin', title: 'Fortune Spinner', description: 'Spin the Lucky Wheel 5 times', badge: '🎡', xpReward: 100, coinReward: 500, completed: false, progress: 0, maxProgress: 5 },
  { id: 'plinko_jackpot', title: 'Peg Master', description: 'Land a Plinko ball on any 10x+ slot', badge: '🎯', xpReward: 300, coinReward: 2000, completed: false, progress: 0, maxProgress: 1 },
];

export const DEFAULT_MISSIONS: DailyMission[] = [
  { id: 'play_3', description: 'Play any game 3 times', rewardType: 'coins', rewardAmount: 500, completed: false, progress: 0, maxProgress: 3 },
  { id: 'win_1000', description: 'Win a total of 1000 coins in any game', rewardType: 'diamonds', rewardAmount: 20, completed: false, progress: 0, maxProgress: 1000 },
  { id: 'spin_2', description: 'Spin the Lucky Wheel or Bottle 2 times', rewardType: 'xp', rewardAmount: 150, completed: false, progress: 0, maxProgress: 2 },
];

export const MOCK_LEADERBOARDS = {
  global: [
    { rank: 1, username: 'ZenithGamer', avatar: '🐉', score: 2845000, level: 42 },
    { rank: 2, username: 'ApexWinner', avatar: '🦊', score: 1954000, level: 38 },
    { rank: 3, username: 'SportyKing', avatar: '👑', score: 1420500, level: 35 },
    { rank: 4, username: 'BetMasterX', avatar: '🦁', score: 985000, level: 29 },
    { rank: 5, username: 'SpinDoctor', avatar: '🧙', score: 875200, level: 26 },
  ],
  weekly: [
    { rank: 1, username: 'ApexWinner', avatar: '🦊', score: 320500, level: 38 },
    { rank: 2, username: 'GoldHunter', avatar: '🦡', score: 245000, level: 21 },
    { rank: 3, username: 'CryptoRider', avatar: '🐱', score: 189400, level: 19 },
    { rank: 4, username: 'LuckyGuest_777', avatar: '🤠', score: 0, level: 1 }, // Dynamic user entry
  ],
  monthly: [
    { rank: 1, username: 'ZenithGamer', avatar: '🐉', score: 1850400, level: 42 },
    { rank: 2, username: 'SportyKing', avatar: '👑', score: 1210500, level: 35 },
    { rank: 3, username: 'ShadowBet', avatar: '🥷', score: 955000, level: 31 },
  ],
  friends: [
    { rank: 1, username: 'Buddy_Alpha', avatar: '🐼', score: 45000, level: 12 },
    { rank: 2, username: 'Buddy_Beta', avatar: '🐯', score: 12000, level: 8 },
    { rank: 3, username: 'LuckyGuest_777', avatar: '🤠', score: 0, level: 1 }, // Dynamic user entry
  ]
};

// State helper functions
export function getSavedProfile(): UserProfile {
  const data = localStorage.getItem(STORAGE_KEYS.PROFILE);
  if (data) {
    try {
      const parsed = JSON.parse(data);
      return {
        ...DEFAULT_PROFILE,
        ...parsed,
        favorites: parsed.favorites || [],
        recentlyPlayed: parsed.recentlyPlayed || [],
        favoriteHeartColor: parsed.favoriteHeartColor || 'gold',
      };
    } catch {
      return DEFAULT_PROFILE;
    }
  }
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile) {
  localStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(profile));
}

export function getSavedStats(): GameStats {
  const data = localStorage.getItem(STORAGE_KEYS.STATS);
  if (data) {
    try { return JSON.parse(data); } catch { return DEFAULT_STATS; }
  }
  return DEFAULT_STATS;
}

export function saveStats(stats: GameStats) {
  localStorage.setItem(STORAGE_KEYS.STATS, JSON.stringify(stats));
}

export function getSavedAchievements(): Achievement[] {
  const data = localStorage.getItem(STORAGE_KEYS.ACHIEVEMENTS);
  if (data) {
    try { return JSON.parse(data); } catch { return DEFAULT_ACHIEVEMENTS; }
  }
  return DEFAULT_ACHIEVEMENTS;
}

export function saveAchievements(achievements: Achievement[]) {
  localStorage.setItem(STORAGE_KEYS.ACHIEVEMENTS, JSON.stringify(achievements));
}

export function getSavedMissions(): DailyMission[] {
  const data = localStorage.getItem(STORAGE_KEYS.MISSIONS);
  if (data) {
    try { return JSON.parse(data); } catch { return DEFAULT_MISSIONS; }
  }
  return DEFAULT_MISSIONS;
}

export function saveMissions(missions: DailyMission[]) {
  localStorage.setItem(STORAGE_KEYS.MISSIONS, JSON.stringify(missions));
}

export function getSavedTransactions(): WalletTransaction[] {
  const data = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
  if (data) {
    try { return JSON.parse(data); } catch { return []; }
  }
  return [
    { id: 't_init', type: 'reward', amount: 10000, currency: 'coins', gameTitle: 'Welcome Bonus', timestamp: new Date().toLocaleString() },
    { id: 't_init_d', type: 'reward', amount: 150, currency: 'diamonds', gameTitle: 'Welcome Diamonds', timestamp: new Date().toLocaleString() }
  ];
}

export function saveTransactions(transactions: WalletTransaction[]) {
  localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
}

export function updateWallet(
  amount: number,
  currency: 'coins' | 'diamonds',
  type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward',
  gameTitle?: string
) {
  const profile = getSavedProfile();
  if (currency === 'coins') {
    profile.coins = Math.max(0, profile.coins + amount);
  } else {
    profile.diamonds = Math.max(0, profile.diamonds + amount);
  }
  
  saveProfile(profile);

  // Record transaction
  const transactions = getSavedTransactions();
  transactions.unshift({
    id: 't_' + Date.now(),
    type,
    amount: Math.abs(amount),
    currency,
    gameTitle,
    timestamp: new Date().toLocaleString()
  });
  saveTransactions(transactions.slice(0, 50)); // Keep last 50 transactions

  return profile;
}

export function awardXP(amount: number) {
  const profile = getSavedProfile();
  profile.xp += amount;
  
  // Level up mechanism
  while (profile.xp >= profile.xpNeeded) {
    profile.xp -= profile.xpNeeded;
    profile.level += 1;
    profile.xpNeeded = Math.floor(profile.xpNeeded * 1.5);
    // Level up reward!
    profile.coins += 2000;
    profile.diamonds += 10;
    
    // Add level up transaction
    const transactions = getSavedTransactions();
    transactions.unshift({
      id: 'lvl_' + Date.now(),
      type: 'reward',
      amount: 2000,
      currency: 'coins',
      gameTitle: `Level Up to ${profile.level}`,
      timestamp: new Date().toLocaleString()
    });
    saveTransactions(transactions);
  }
  
  saveProfile(profile);
  return profile;
}

export function triggerProgress(id: string, amount: number) {
  // Update achievements
  const achievements = getSavedAchievements();
  const achIdx = achievements.findIndex(a => a.id === id);
  let newlyCompleted = false;

  if (achIdx !== -1 && !achievements[achIdx].completed) {
    achievements[achIdx].progress = Math.min(achievements[achIdx].maxProgress, achievements[achIdx].progress + amount);
    if (achievements[achIdx].progress >= achievements[achIdx].maxProgress) {
      achievements[achIdx].completed = true;
      newlyCompleted = true;
      // Distribute rewards
      updateWallet(achievements[achIdx].coinReward, 'coins', 'reward', `Achievement: ${achievements[achIdx].title}`);
      awardXP(achievements[achIdx].xpReward);
    }
    saveAchievements(achievements);
  }

  // Update daily missions progress
  const missions = getSavedMissions();
  let updatedMissions = false;
  missions.forEach(m => {
    if (m.id === id && !m.completed) {
      m.progress = Math.min(m.maxProgress, m.progress + amount);
      if (m.progress >= m.maxProgress) {
        m.completed = true;
        // Distribute mission rewards
        if (m.rewardType === 'coins') {
          updateWallet(m.rewardAmount, 'coins', 'reward', `Mission: ${m.description}`);
        } else if (m.rewardType === 'diamonds') {
          updateWallet(m.rewardAmount, 'diamonds', 'reward', `Mission: ${m.description}`);
        } else {
          awardXP(m.rewardAmount);
        }
      }
      updatedMissions = true;
    }
  });

  if (updatedMissions) {
    saveMissions(missions);
  }

  return { achievements, missions, newlyCompleted };
}
