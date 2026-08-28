/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { UserProfile } from '../types';
import { PORTRAIT_AVATARS } from '../data/portraitAvatars';

export interface LeaderboardPlayer {
  rank: number;
  username: string;
  avatar: string;
  portraitAvatar?: string;
  countryFlag: string;
  countryName: string;
  level: number;
  totalWins: number;
  score: number;
  rankBadge: string;
  isUser?: boolean;
}

const PLAYER_NAMES = [
  'ViperKing', 'ShadowRider', 'CyberNinja', 'ApexLegend', 'PixelMaster',
  'PhantomAce', 'HyperBlade', 'NovaStrike', 'CosmoRider', 'ZenithGamer',
  'TitanForce', 'BlazeKnight', 'MysticOwl', 'StormBreaker', 'FrostByte',
  'IronClaw', 'VeloxPrime', 'AstroWolf', 'NeonPulse', 'VortexPro',
  'QuantumX', 'OmegaGhost', 'SolarFlare', 'RogueAgent', 'AlphaPredator',
  'TurboCharge', 'DarkValkyrie', 'EchoHunter', 'RadiantStar', 'GigaChad',
  'SpectreX', 'Overlord88', 'ThunderBolt', 'VenomStrike', 'ZeroGravity',
  'InfinityEdge', 'GlitchMaster', 'NebulaRider', 'DragonFire', 'CyberSamurai',
  'ValkyriePrime', 'ShadowBlade', 'HyperionX', 'StarLord', 'SonicBoom',
  'PhoenixRise', 'AbyssalKing', 'AstralKnight', 'MatrixCode', 'ChronoRider',
  'ApexWinner', 'SportyKing', 'BetMasterX', 'SpinDoctor', 'GoldHunter',
  'CryptoRider', 'ShadowBet', 'AuraGamer', 'TitaniumPro', 'KratosGamer',
  'ZackSpeed', 'SirenQueen', 'RageQuit', 'LootGoblin', 'HeadshotPro'
];

export const PREMIUM_EMOJIS = [
  '👑', '🦅', '🐉', '🦁', '🦂', '⚡', '🔥', '💎', '🌌', '🛡️',
  '⚔️', '🦊', '🐺', '🐯', '🐲', '👽', '🤖', '🧙', '🧛', '🪽'
];

const CLASSIC_EMOJIS = [
  '🤠', '🦡', '🐱', '🥷', '🐼', '🐯', '🤖', '💀', '👽', '🦄',
  '🎯', '🚀', '🔮', '👾', '🎲', '🏎️', '🎮', '🏆', '🌟', '💥'
];

export const ALL_EMOJI_AVATARS = [...PREMIUM_EMOJIS, ...CLASSIC_EMOJIS];

const COUNTRIES = [
  { flag: '🇺🇸', name: 'United States' },
  { flag: '🇬🇧', name: 'United Kingdom' },
  { flag: '🇯🇵', name: 'Japan' },
  { flag: '🇩🇪', name: 'Germany' },
  { flag: '🇨🇦', name: 'Canada' },
  { flag: '🇧🇷', name: 'Brazil' },
  { flag: '🇳🇬', name: 'Nigeria' },
  { flag: '🇫🇷', name: 'France' },
  { flag: '🇮🇳', name: 'India' },
  { flag: '🇦🇺', name: 'Australia' },
  { flag: '🇰🇷', name: 'South Korea' },
  { flag: '🇪🇸', name: 'Spain' },
  { flag: '🇮🇹', name: 'Italy' },
  { flag: '🇲🇽', name: 'Mexico' },
  { flag: '🇳🇱', name: 'Netherlands' },
  { flag: '🇸🇪', name: 'Sweden' },
  { flag: '🇦🇷', name: 'Argentina' },
  { flag: '🇸🇬', name: 'Singapore' }
];

function getBadge(rank: number): string {
  if (rank === 1) return 'Legend 👑';
  if (rank === 2) return 'Grandmaster 🥇';
  if (rank === 3) return 'Master 🥈';
  if (rank <= 5) return 'Diamond 💎';
  if (rank <= 10) return 'Platinum 🌟';
  if (rank <= 20) return 'Gold ⭐';
  if (rank <= 35) return 'Silver 🛡️';
  return 'Bronze 🗡️';
}

// Seeded PRNG for consistent hourly generation
function seededRandom(seed: number) {
  const x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
}

export function generateLeaderboardCategory(
  category: 'global' | 'country' | 'weekly' | 'monthly' | 'friends',
  profile: UserProfile,
  totalWon: number,
  hourSeed: number
): LeaderboardPlayer[] {
  const targetCount = category === 'global' ? 50 : 20;

  let categoryOffset = 0;
  if (category === 'country') categoryOffset = 100;
  if (category === 'weekly') categoryOffset = 200;
  if (category === 'monthly') categoryOffset = 300;
  if (category === 'friends') categoryOffset = 400;

  let currentSeed = hourSeed + categoryOffset;

  const shuffledNames = [...PLAYER_NAMES].sort((a, b) => {
    currentSeed++;
    return seededRandom(currentSeed) - 0.5;
  });

  const shuffledEmojis = [...ALL_EMOJI_AVATARS].sort((a, b) => {
    currentSeed++;
    return seededRandom(currentSeed) - 0.5;
  });

  const baseUserScore = Math.max(profile.coins, totalWon, 1500);

  const players: LeaderboardPlayer[] = [];
  const usedNames = new Set<string>();

  let maxScore = 5840000;
  if (category === 'weekly') maxScore = 1250000;
  if (category === 'monthly') maxScore = 3850000;
  if (category === 'friends') maxScore = 480000;

  for (let i = 0; i < targetCount - 1; i++) {
    currentSeed++;
    let name = shuffledNames[i % shuffledNames.length];
    if (usedNames.has(name) || name === profile.username) {
      name = `${name}_${Math.floor(seededRandom(currentSeed) * 99 + 1)}`;
    }
    usedNames.add(name);

    currentSeed++;
    const emoji = shuffledEmojis[i % shuffledEmojis.length];

    currentSeed++;
    // ~50% chance for NPC player to use realistic portrait avatar
    const usePortrait = seededRandom(currentSeed) > 0.45;
    const portraitAvatar = usePortrait ? PORTRAIT_AVATARS[i % PORTRAIT_AVATARS.length].id : undefined;

    currentSeed++;
    const countryObj = COUNTRIES[Math.floor(seededRandom(currentSeed) * COUNTRIES.length)];

    currentSeed++;
    const scoreFactor = Math.pow((targetCount - i) / targetCount, 1.8);
    const scoreVariation = (seededRandom(currentSeed) - 0.5) * 0.15;
    const score = Math.max(1000, Math.floor(maxScore * (scoreFactor + scoreVariation)));

    currentSeed++;
    const level = Math.max(1, Math.floor(seededRandom(currentSeed) * 50 + (targetCount - i) * 0.8));

    currentSeed++;
    const totalWins = Math.max(1, Math.floor(score / 2200) + Math.floor(seededRandom(currentSeed) * 50));

    players.push({
      rank: 0,
      username: name,
      avatar: emoji,
      portraitAvatar,
      countryFlag: countryObj.flag,
      countryName: countryObj.name,
      level,
      totalWins,
      score,
      rankBadge: '',
    });
  }

  // Insert user into list
  let userCountryFlag = '🇺🇸';
  let userCountryName = 'United States';
  if (profile.country) {
    const matched = COUNTRIES.find(c => profile.country?.includes(c.name) || profile.country?.includes(c.flag));
    if (matched) {
      userCountryFlag = matched.flag;
      userCountryName = matched.name;
    }
  }

  const userPlayer: LeaderboardPlayer = {
    rank: 0,
    username: profile.username,
    avatar: profile.avatar || '👑',
    portraitAvatar: profile.portraitAvatar,
    countryFlag: userCountryFlag,
    countryName: userCountryName,
    level: profile.level,
    totalWins: Math.floor(totalWon / 1200) + 10,
    score: baseUserScore,
    rankBadge: '',
    isUser: true,
  };

  players.push(userPlayer);

  // Sort descending by score
  players.sort((a, b) => b.score - a.score);

  // Assign ranks and badges
  const finalPlayers = players.slice(0, targetCount).map((p, idx) => {
    const rank = idx + 1;
    return {
      ...p,
      rank,
      rankBadge: getBadge(rank),
    };
  });

  // Ensure user exists in list
  const userExists = finalPlayers.some(p => p.isUser || p.username === profile.username);
  if (!userExists && finalPlayers.length > 0) {
    userPlayer.rank = Math.min(targetCount, 15);
    userPlayer.rankBadge = getBadge(userPlayer.rank);
    finalPlayers[finalPlayers.length - 1] = userPlayer;
    finalPlayers.sort((a, b) => b.score - a.score).forEach((p, idx) => {
      p.rank = idx + 1;
      p.rankBadge = getBadge(p.rank);
    });
  }

  return finalPlayers;
}
