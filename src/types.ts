/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface UserProfile {
  username: string;
  avatar: string;
  portraitAvatar?: string;
  level: number;
  xp: number;
  xpNeeded: number;
  coins: number;
  diamonds: number;
  isGuest: boolean;
  joinedAt: string;
  favorites: string[]; // game IDs
  recentlyPlayed?: string[]; // game IDs
  favoriteHeartColor?: 'gold' | 'red';
  country?: string;
  gender?: 'Male' | 'Female' | 'Prefer not to say';
  favoriteGame?: string;
  favoriteCategory?: string;
  age?: number;
  bio?: string;
  preferredTheme?: string;
  language?: string;

  // Additional profile statistics
  totalGames?: number;
  timePlayedMinutes?: number;
  winRate?: number;
  highScores?: Record<string, number>;
}

export interface GameStats {
  gamesPlayed: number;
  totalWon: number;
  biggestWin: number;
  favoriteGenre: string;
  playTimeMinutes: number;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  badge: string; // emoji or lucide icon name
  xpReward: number;
  coinReward: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface DailyMission {
  id: string;
  description: string;
  rewardType: 'coins' | 'diamonds' | 'xp';
  rewardAmount: number;
  completed: boolean;
  progress: number;
  maxProgress: number;
}

export interface WalletTransaction {
  id: string;
  type: 'deposit' | 'withdraw' | 'win' | 'bet' | 'reward';
  amount: number;
  currency: 'coins' | 'diamonds';
  gameTitle?: string;
  timestamp: string;
}

export interface LeaderboardEntry {
  rank: number;
  username: string;
  avatar: string;
  score: number;
  level: number;
  highlighted?: boolean;
}

export interface GameDefinition {
  id: string;
  title: string;
  category: string; // Crash, Arcade, Cards, Dice, Plinko, Mines, Slots, etc.
  description: string;
  thumbnail: string; // Elegant fallback/CSS gradient or symbol
  isPopular: boolean;
  isNew: boolean;
  multiplier: string;
  playCount: number;
}
