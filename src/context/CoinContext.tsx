/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { coinManager, CoinValidationResult } from '../utils/CoinManager';
import { InsufficientCoinsModal } from '../components/InsufficientCoinsModal';

interface InsufficientCoinsModalState {
  isOpen: boolean;
  currentBalance: number;
  requiredCoins: number;
  neededCoins: number;
  gameTitle?: string;
}

interface CoinContextType {
  coins: number;
  checkCoins: (requiredCoins: number) => CoinValidationResult;
  validateAndDeductCoins: (requiredCoins: number, gameTitle?: string) => boolean;
  addCoins: (amount: number, gameTitle?: string) => number;
  showInsufficientCoinsModal: (requiredCoins: number, gameTitle?: string) => void;
  closeInsufficientCoinsModal: () => void;
  handleEarnCoins: () => void;
}

const CoinContext = createContext<CoinContextType | undefined>(undefined);

interface CoinValidationProviderProps {
  children: ReactNode;
  onNavigateToLobby?: () => void;
  onOpenMissions?: () => void;
}

export const CoinValidationProvider: React.FC<CoinValidationProviderProps> = ({
  children,
  onNavigateToLobby,
  onOpenMissions,
}) => {
  const [coins, setCoins] = useState<number>(coinManager.getBalance());
  const [modalState, setModalState] = useState<InsufficientCoinsModalState>({
    isOpen: false,
    currentBalance: 0,
    requiredCoins: 0,
    neededCoins: 0,
    gameTitle: 'Game',
  });

  // Subscribe to central CoinManager balance updates
  useEffect(() => {
    setCoins(coinManager.getBalance());
    const unsubscribe = coinManager.subscribe((newBalance) => {
      setCoins(newBalance);
    });
    return unsubscribe;
  }, []);

  const checkCoins = (requiredCoins: number): CoinValidationResult => {
    return coinManager.checkBalance(requiredCoins);
  };

  /**
   * Central validation method called before ANY game starts or spins.
   * - Validates coins.
   * - If insufficient: opens InsufficientCoinsModal with exact balance metrics, plays error audio & vibration, returns false.
   * - If sufficient: deducts coins, updates state instantly across platform, returns true.
   */
  const validateAndDeductCoins = (requiredCoins: number, gameTitle: string = 'Game'): boolean => {
    const { success, result } = coinManager.validateAndDeduct(requiredCoins, gameTitle);

    if (!success) {
      setModalState({
        isOpen: true,
        currentBalance: result.currentBalance,
        requiredCoins: result.requiredCoins,
        neededCoins: result.neededCoins,
        gameTitle,
      });
      return false;
    }

    setCoins(result.currentBalance);
    return true;
  };

  const addCoins = (amount: number, gameTitle: string = 'Reward'): number => {
    const newBal = coinManager.addReward(amount, gameTitle);
    setCoins(newBal);
    return newBal;
  };

  const showInsufficientCoinsModal = (requiredCoins: number, gameTitle: string = 'Game') => {
    const check = coinManager.checkBalance(requiredCoins);
    setModalState({
      isOpen: true,
      currentBalance: check.currentBalance,
      requiredCoins: check.requiredCoins,
      neededCoins: check.neededCoins,
      gameTitle,
    });
  };

  const closeInsufficientCoinsModal = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleEarnCoins = () => {
    setModalState((prev) => ({ ...prev, isOpen: false }));
    if (onNavigateToLobby) {
      onNavigateToLobby();
    }
  };

  return (
    <CoinContext.Provider
      value={{
        coins,
        checkCoins,
        validateAndDeductCoins,
        addCoins,
        showInsufficientCoinsModal,
        closeInsufficientCoinsModal,
        handleEarnCoins,
      }}
    >
      {children}

      {/* Global Insufficient Coins Popup */}
      <InsufficientCoinsModal
        isOpen={modalState.isOpen}
        currentBalance={modalState.currentBalance}
        requiredCoins={modalState.requiredCoins}
        neededCoins={modalState.neededCoins}
        gameTitle={modalState.gameTitle}
        onClose={closeInsufficientCoinsModal}
        onEarnCoins={handleEarnCoins}
      />
    </CoinContext.Provider>
  );
};

export const useCoinValidation = (): CoinContextType => {
  const context = useContext(CoinContext);
  if (!context) {
    throw new Error('useCoinValidation must be used within a CoinValidationProvider');
  }
  return context;
};
