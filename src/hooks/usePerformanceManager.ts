/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { PerformanceManager, PerformanceState } from '../utils/PerformanceManager';

export function usePerformanceManager(): PerformanceState {
  const [state, setState] = useState<PerformanceState>(() => PerformanceManager.getState());

  useEffect(() => {
    const unsubscribe = PerformanceManager.subscribe((newState) => {
      setState(newState);
    });
    return () => {
      unsubscribe();
    };
  }, []);

  return state;
}
