/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// AdMob Configuration and Policy Manager
export interface AdMobConfig {
  bannerAdUnitId: string;
  interstitialAdUnitId: string;
  rewardedAdUnitId: string;
  isTesting: boolean;
}

const DEFAULT_ADMOB_CONFIG: AdMobConfig = {
  // Standard Google AdMob Test Ad Unit IDs for Android
  bannerAdUnitId: 'ca-app-pub-3940256099942544/6300978111',
  interstitialAdUnitId: 'ca-app-pub-3940256099942544/1033173712',
  rewardedAdUnitId: 'ca-app-pub-3940256099942544/5224354917',
  isTesting: true,
};

type AdEventListener = (event: string, data?: any) => void;

class AdMobManagerClass {
  private config: AdMobConfig = DEFAULT_ADMOB_CONFIG;
  private isBannerVisible: boolean = false;
  private lastInterstitialTime: number = 0;
  private minInterstitialIntervalMs: number = 60000; // 60 seconds minimum between interstitials per AdMob policy
  private listeners: Set<AdEventListener> = new Set();
  private nativeBridgeAvailable: boolean = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.detectNativeBridge();
    }
  }

  private detectNativeBridge() {
    const win = window as any;
    // Check for Capacitor AdMob plugin or Cordova AdMob or Android WebView JavaScriptInterface
    if (win.Capacitor?.Plugins?.AdMob || win.admob || win.AndroidAdMob) {
      this.nativeBridgeAvailable = true;
      try {
        this.initNativeAdMob();
      } catch { /* ignore */ }
    }
  }

  private async initNativeAdMob() {
    const win = window as any;
    if (win.Capacitor?.Plugins?.AdMob) {
      await win.Capacitor.Plugins.AdMob.initialize({
        testingDevices: ['2077ef9a63d2b398840261c8221a0c9b'],
        initializeForTesting: true,
      });
    }
  }

  public showBanner(): void {
    if (this.isBannerVisible) return;
    this.isBannerVisible = true;
    this.notifyListeners('banner_show');

    const win = window as any;
    if (this.nativeBridgeAvailable) {
      try {
        if (win.Capacitor?.Plugins?.AdMob) {
          win.Capacitor.Plugins.AdMob.showBanner({
            adId: this.config.bannerAdUnitId,
            position: 'BOTTOM_CENTER',
            margin: 0,
          });
        } else if (win.admob) {
          win.admob.banner.show({ id: this.config.bannerAdUnitId });
        } else if (win.AndroidAdMob?.showBanner) {
          win.AndroidAdMob.showBanner(this.config.bannerAdUnitId);
        }
      } catch { /* ignore */ }
    }
  }

  public hideBanner(): void {
    if (!this.isBannerVisible) return;
    this.isBannerVisible = false;
    this.notifyListeners('banner_hide');

    const win = window as any;
    if (this.nativeBridgeAvailable) {
      try {
        if (win.Capacitor?.Plugins?.AdMob) {
          win.Capacitor.Plugins.AdMob.hideBanner();
        } else if (win.admob) {
          win.admob.banner.hide();
        } else if (win.AndroidAdMob?.hideBanner) {
          win.AndroidAdMob.hideBanner();
        }
      } catch { /* ignore */ }
    }
  }

  public getBannerState(): boolean {
    return this.isBannerVisible;
  }

  /**
   * Triggers an Interstitial Ad only at natural transition points.
   * Enforces frequency capping to comply with Google Play & AdMob policies.
   */
  public async showInterstitial(onComplete?: () => void): Promise<boolean> {
    const now = Date.now();
    // Enforce policy: Never show interstitial if frequency cap is violated
    if (now - this.lastInterstitialTime < this.minInterstitialIntervalMs) {
      if (onComplete) onComplete();
      return false;
    }

    this.lastInterstitialTime = now;
    this.notifyListeners('interstitial_request');

    const win = window as any;
    if (this.nativeBridgeAvailable) {
      try {
        if (win.Capacitor?.Plugins?.AdMob) {
          await win.Capacitor.Plugins.AdMob.prepareInterstitial({
            adId: this.config.interstitialAdUnitId,
          });
          await win.Capacitor.Plugins.AdMob.showInterstitial();
          if (onComplete) onComplete();
          return true;
        } else if (win.admob) {
          await win.admob.interstitial.load({ id: this.config.interstitialAdUnitId });
          await win.admob.interstitial.show();
          if (onComplete) onComplete();
          return true;
        } else if (win.AndroidAdMob?.showInterstitial) {
          win.AndroidAdMob.showInterstitial(this.config.interstitialAdUnitId);
          if (onComplete) onComplete();
          return true;
        }
      } catch {
        if (onComplete) onComplete();
        return false;
      }
    }

    // Web simulation mode for previewing natural ad transition points
    this.notifyListeners('interstitial_show', { onComplete });
    return true;
  }

  public subscribe(listener: AdEventListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(event: string, data?: any) {
    this.listeners.forEach((listener) => listener(event, data));
  }
}

export const AdMobManager = new AdMobManagerClass();
