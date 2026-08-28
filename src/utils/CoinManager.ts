/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { getSavedProfile, saveProfile, updateWallet, saveTransactions, getSavedTransactions } from './platformState';
import { synth } from './audioSynth';

export interface CoinValidationResult {
  allowed: boolean;
  currentBalance: number;
  requiredCoins: number;
  neededCoins: number;
  message?: string;
}

export type CoinListener = (newBalance: number) => void;

class CentralCoinManager {
  private listeners: Set<CoinListener> = new Set();

  /**
   * Get current coin balance
   */
  public getBalance(): number {
    const profile = getSavedProfile();
    return Math.max(0, profile.coins || 0);
  }

  /**
   * Subscribe to real-time balance updates across the entire app
   */
  public subscribe(listener: CoinListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Notify all active subscribers when coin balance changes
   */
  private notifyListeners(newBalance: number): void {
    this.listeners.forEach((listener) => {
      try {
        listener(newBalance);
      } catch (e) {
        console.warn('Error in coin listener:', e);
      }
    });
  }

  /**
   * Pure check if player has enough coins for required cost
   */
  public checkBalance(requiredCoins: number): CoinValidationResult {
    const currentBalance = this.getBalance();
    const sanitizedRequired = Math.max(1, Math.floor(requiredCoins || 0));
    const neededCoins = Math.max(0, sanitizedRequired - currentBalance);
    const allowed = currentBalance >= sanitizedRequired;

    return {
      allowed,
      currentBalance,
      requiredCoins: sanitizedRequired,
      neededCoins,
    };
  }

  /**
   * Centralized Validation and Deduction logic before ANY game or spin starts.
   * - Validates current balance against entry/bet cost.
   * - Prevents negative balance or negative coin deductions.
   * - Deducts coins safely only when validation succeeds.
   * - Returns boolean (true if deducted & allowed, false if blocked).
   */
  public validateAndDeduct(
    requiredCoins: number,
    gameTitle: string = 'Game'
  ): { success: boolean; result: CoinValidationResult } {
    const validation = this.checkBalance(requiredCoins);

    // Rule: Never allow starting a game without enough coins or negative deductions
    if (!validation.allowed || validation.requiredCoins <= 0) {
      // Trigger mobile vibration if supported
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        try {
          navigator.vibrate([100, 50, 100]);
        } catch {
          /* Suppress */
        }
      }
      // Play error notification sound
      synth.playError();

      return {
        success: false,
        result: validation,
      };
    }

    // Balance is sufficient -> Deduct coins safely
    const updatedProfile = updateWallet(-validation.requiredCoins, 'coins', 'bet', gameTitle);
    this.notifyListeners(updatedProfile.coins);

    return {
      success: true,
      result: {
        ...validation,
        currentBalance: updatedProfile.coins,
      },
    };
  }

  /**
   * Add reward coins safely
   */
  public addReward(amount: number, gameTitle: string = 'Reward'): number {
    const sanitizedAmount = Math.max(0, Math.floor(amount || 0));
    if (sanitizedAmount <= 0) return this.getBalance();

    const updatedProfile = updateWallet(sanitizedAmount, 'coins', 'win', gameTitle);
    this.notifyListeners(updatedProfile.coins);
    return updatedProfile.coins;
  }

  /**
   * Force synchronization of balance across all subscribers
   */
  public syncBalance(): number {
    const current = this.getBalance();
    this.notifyListeners(current);
    return current;
  }
}

export const coinManager = new CentralCoinManager();
