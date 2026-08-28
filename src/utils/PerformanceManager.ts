/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { synth } from './audioSynth';

export interface PerformanceState {
  isOnline: boolean;
  isHidden: boolean;
  isLowPowerMode: boolean;
  fpsLimit: number;
  batteryLevel: number | null;
  isCharging: boolean | null;
}

type Subscriber = (state: PerformanceState) => void;

class PerformanceManagerClass {
  private state: PerformanceState = {
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    isHidden: typeof document !== 'undefined' ? document.hidden : false,
    isLowPowerMode: false,
    fpsLimit: 60,
    batteryLevel: null,
    isCharging: null,
  };

  private subscribers: Set<Subscriber> = new Set();
  private connectivityCheckInterval: any = null;
  private memoryCleanupInterval: any = null;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initEventListeners();
      this.initBatteryMonitoring();
      this.startPeriodicChecks();
    }
  }

  private initEventListeners() {
    // Connectivity
    window.addEventListener('online', () => this.setOnlineState(true));
    window.addEventListener('offline', () => this.setOnlineState(false));

    // Visibility / Background state
    document.addEventListener('visibilitychange', () => {
      const hidden = document.hidden;
      this.state.isHidden = hidden;

      if (hidden) {
        // App went to background -> Pause audio, timers, and heavy tasks
        synth.pauseForBackground();
        this.triggerMemoryCleanup();
      } else {
        // App returned to foreground -> Resume
        synth.resumeFromBackground();
        // Immediately verify connection on wake
        this.verifyNetworkConnection();
      }
      this.notify();
    });

    // Optional: pagehide / freeze for mobile OS lifecycle
    window.addEventListener('pagehide', () => {
      synth.pauseForBackground();
    });
  }

  private async initBatteryMonitoring() {
    try {
      const nav = navigator as any;
      if (nav.getBattery) {
        const battery = await nav.getBattery();
        this.updateBatteryState(battery);

        battery.addEventListener('levelchange', () => this.updateBatteryState(battery));
        battery.addEventListener('chargingchange', () => this.updateBatteryState(battery));
      }
    } catch {
      // Battery API not supported or blocked
    }
  }

  private updateBatteryState(battery: any) {
    this.state.batteryLevel = Math.round(battery.level * 100);
    this.state.isCharging = battery.charging;

    // Enable Low Power Mode if battery < 20% and not charging
    const isLow = !battery.charging && battery.level <= 0.20;
    if (isLow !== this.state.isLowPowerMode) {
      this.state.isLowPowerMode = isLow;
      this.state.fpsLimit = isLow ? 30 : 60;
    }
    this.notify();
  }

  private startPeriodicChecks() {
    // Periodic network verification every 15 seconds
    this.connectivityCheckInterval = setInterval(() => {
      if (!this.state.isHidden) {
        this.verifyNetworkConnection();
      }
    }, 15000);

    // Periodic memory cleanup when inactive
    this.memoryCleanupInterval = setInterval(() => {
      if (this.state.isHidden) {
        this.triggerMemoryCleanup();
      }
    }, 60000);
  }

  public async verifyNetworkConnection(): Promise<boolean> {
    if (typeof navigator === 'undefined') return true;
    
    // Quick browser offline check first
    if (!navigator.onLine) {
      this.setOnlineState(false);
      return false;
    }

    try {
      // Light ping check with short timeout
      const controller = new AbortController();
      const id = setTimeout(() => controller.abort(), 3500);
      const res = await fetch(window.location.origin + '/favicon.ico?_ping=' + Date.now(), {
        method: 'HEAD',
        cache: 'no-store',
        signal: controller.signal,
      });
      clearTimeout(id);
      
      const online = res.ok || res.status < 500;
      this.setOnlineState(online);
      return online;
    } catch {
      // If fetch fails but navigator says online, assume transient or CORS, check navigator.onLine
      const online = navigator.onLine;
      this.setOnlineState(online);
      return online;
    }
  }

  public setOnlineState(isOnline: boolean) {
    if (this.state.isOnline !== isOnline) {
      this.state.isOnline = isOnline;
      if (!isOnline) {
        // Trigger haptic vibration alert on connection loss
        try {
          if (typeof navigator !== 'undefined' && navigator.vibrate) {
            navigator.vibrate([100, 50, 100, 50, 200]);
          }
        } catch { /* ignore */ }
      }
      this.notify();
    }
  }

  public triggerMemoryCleanup() {
    // Release unused animations, force garbage collection if available
    try {
      if ((window as any).gc) {
        (window as any).gc();
      }
    } catch { /* ignore */ }
  }

  public getState(): PerformanceState {
    return { ...this.state };
  }

  public subscribe(subscriber: Subscriber): () => void {
    this.subscribers.add(subscriber);
    subscriber(this.getState());
    return () => {
      this.subscribers.delete(subscriber);
    };
  }

  private notify() {
    const currentState = this.getState();
    this.subscribers.forEach((sub) => sub(currentState));
  }
}

export const PerformanceManager = new PerformanceManagerClass();
