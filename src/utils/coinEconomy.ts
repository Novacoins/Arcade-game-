/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Universal Coin Economy Manager
 * Standardized across all games, shops, wheels, rewards, and items.
 */

// Universal minimum entry wager
export const DEFAULT_ENTRY_COST = 10;

// Universal default quick bet options
export const DEFAULT_BET_PRESETS = [10, 20, 30, 50];

// Maximum reward allowed from standard gameplay multiplier
export const MAX_NORMAL_REWARD = 50;

/**
 * Multiplier to Coin Reward Calculation
 * ×1 = 🪙10 Coins
 * ×2 = 🪙20 Coins
 * ×3 = 🪙30 Coins
 * ×4 = 🪙40 Coins
 * ×5 = 🪙50 Coins (Max 🪙50)
 */
export function getMultiplierRewardCoins(multiplier: number, baseWager: number = DEFAULT_ENTRY_COST): number {
  if (multiplier <= 0) return 0;
  const rawReward = Math.round(multiplier * baseWager);
  return Math.min(MAX_NORMAL_REWARD, rawReward);
}

/**
 * Clean Progression Pricing for Bottle Collection
 * Bottle 1  → 🪙10
 * Bottle 2  → 🪙20
 * Bottle 3  → 🪙30
 * Bottle 4  → 🪙40
 * Bottle 5  → 🪙50
 * Bottle 6  → 🪙60
 * Bottle 7  → 🪙70
 * Bottle 8  → 🪙80
 * Bottle 9  → 🪙90
 * Bottle 10 → 🪙100
 */
export const BOTTLE_PRICES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100, 110, 120];

/**
 * Clean Progression Pricing for Theme Shop
 * Theme 1 → 🪙10
 * Theme 2 → 🪙20
 * Theme 3 → 🪙30
 * Theme 4 → 🪙40
 * Theme 5 → 🪙50
 * Theme 6 → 🪙60
 * Theme 7 → 🪙70
 */
export const THEME_PRICES = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];

/**
 * Helper to generate item progression price based on index (1-based or 0-based)
 */
export function getItemProgressionPrice(index: number): number {
  return (index + 1) * 10;
}

/**
 * Helper to format coin display with gold coin emoji
 */
export function formatCoinDisplay(amount: number): string {
  return `🪙 ${amount.toLocaleString()} Coins`;
}
