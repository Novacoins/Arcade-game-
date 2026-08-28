/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

// Centralized premium sound synthesizer using Web Audio API
class AudioSynth {
  private ctx: AudioContext | null = null;
  public enabled: boolean = true;
  private masterVolume: number = 0.8;
  private musicVolume: number = 0.4; // Default 40%
  private sfxVolume: number = 0.7;
  public sfxEnabled: boolean = true;
  public bgmEnabled: boolean = true;
  private bgmInterval: any = null;
  private bgmVolumeNode: GainNode | null = null;
  private bgmStarted: boolean = false;
  private isBackgrounded: boolean = false;
  private lastGameId?: string;

  private initCtx() {
    if (this.isBackgrounded) {
      throw new Error('Audio suspended while app is backgrounded');
    }
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch { /* ignore */ }
    }
  }

  public pauseForBackground() {
    this.isBackgrounded = true;
    if (this.ctx && this.ctx.state === 'running') {
      try { this.ctx.suspend(); } catch { /* ignore */ }
    }
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  public resumeFromBackground() {
    this.isBackgrounded = false;
    if (this.ctx && this.ctx.state === 'suspended') {
      try { this.ctx.resume(); } catch { /* ignore */ }
    }
    if (this.bgmStarted && this.bgmEnabled) {
      this.startBgm(this.lastGameId);
    }
  }

  public isMuted() {
    return !this.enabled;
  }

  public getVolume() {
    return this.musicVolume;
  }

  public getMasterVolume() { return this.masterVolume; }
  public getMusicVolume() { return this.musicVolume; }
  public getSfxVolume() { return this.sfxVolume; }
  public isBgmEnabled() { return this.bgmEnabled; }
  public isSfxEnabled() { return this.sfxEnabled; }

  public setMasterVolume(vol: number) {
    this.masterVolume = vol;
    this.setMusicVolume(this.musicVolume);
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = vol;
  }

  public setSfxEnabled(enabled: boolean) {
    this.sfxEnabled = enabled;
  }

  public setBgmEnabled(enabled: boolean) {
    this.bgmEnabled = enabled;
    if (!enabled) {
      this.stopBgm();
    } else if (this.bgmStarted) {
      this.startBgm();
    }
  }

  toggle(enabled: boolean) {
    this.enabled = enabled;
    if (!enabled) {
      this.stopBgm();
    } else if (this.bgmStarted && this.bgmEnabled) {
      this.startBgm();
    }
  }

  // --- Background Music (BGM) Realtime Arpeggiator ---
  startBgm(gameId?: string) {
    this.lastGameId = gameId;
    this.bgmStarted = true;
    if (!this.enabled || !this.bgmEnabled || this.isBackgrounded) return;
    this.initCtx();
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }

    const ctx = this.ctx!;
    this.bgmVolumeNode = ctx.createGain();
    const effectiveVol = this.musicVolume * this.masterVolume * 0.025;
    this.bgmVolumeNode.gain.setValueAtTime(effectiveVol, ctx.currentTime);
    this.bgmVolumeNode.connect(ctx.destination);

    // Dynamic chord progression and wave types tailored to gameId
    let chordProgression = [
      [110.00, 164.81, 220.00, 261.63, 329.63], // Am
      [130.81, 196.00, 261.63, 329.63, 392.00], // C
      [146.83, 220.00, 293.66, 349.23, 440.00], // Dm
      [116.54, 174.61, 233.08, 293.66, 349.23], // Bb
    ];
    let waveType: OscillatorType = 'triangle';
    let tempo = 450;
    let filterCutoff = 800;

    if (gameId === 'bubble_pop') {
      chordProgression = [
        [261.63, 329.63, 392.00, 523.25, 659.25], // C Major bright
        [349.23, 440.00, 523.25, 698.46, 880.00], // F Major bright
        [392.00, 493.88, 587.33, 783.99, 987.77], // G Major bright
      ];
      waveType = 'sine';
      tempo = 320;
      filterCutoff = 1800;
    } else if (gameId === 'lucky_wheel' || gameId === 'lucky_bottle') {
      chordProgression = [
        [196.00, 246.94, 293.66, 392.00, 493.88], // G Major Casino
        [220.00, 277.18, 329.63, 440.00, 554.37], // A Major Casino
      ];
      waveType = 'triangle';
      tempo = 280;
      filterCutoff = 1400;
    } else if (gameId === 'sky_flight') {
      chordProgression = [
        [146.83, 220.00, 293.66, 370.00, 440.00], // D Major Soaring
        [164.81, 246.94, 329.63, 415.30, 493.88], // E Major Soaring
      ];
      waveType = 'sine';
      tempo = 400;
      filterCutoff = 1200;
    } else if (gameId === 'gem_mines' || gameId === 'jewel_puzzle' || gameId === 'plinko' || gameId === 'diamond_plinko') {
      chordProgression = [
        [523.25, 659.25, 783.99, 1046.50, 1318.51], // High Crystal C
        [587.33, 698.46, 880.00, 1174.66, 1396.91], // High Crystal Dm
      ];
      waveType = 'sine';
      tempo = 360;
      filterCutoff = 2400;
    } else if (gameId === 'rocket_run') {
      chordProgression = [
        [87.31, 130.81, 174.61, 261.63], // Deep F space
        [98.00, 146.83, 196.00, 293.66], // Deep G space
      ];
      waveType = 'sawtooth';
      tempo = 300;
      filterCutoff = 600;
    } else if (gameId === 'racing_rush') {
      chordProgression = [
        [130.81, 164.81, 196.00, 261.63],
        [146.83, 174.61, 220.00, 293.66],
      ];
      waveType = 'sawtooth';
      tempo = 240;
      filterCutoff = 1000;
    } else if (gameId === 'fishing_frenzy') {
      chordProgression = [
        [174.61, 220.00, 261.63, 349.23, 440.00], // F Major Ocean Ambient
        [196.00, 246.94, 293.66, 392.00, 493.88], // G Major Ocean Ambient
        [164.81, 220.00, 261.63, 329.63, 440.00], // Am Ocean Deep
      ];
      waveType = 'sine';
      tempo = 380;
      filterCutoff = 1200;
    }

    let step = 0;
    let chordIdx = 0;

    this.bgmInterval = setInterval(() => {
      if (!this.enabled || !this.bgmEnabled || !this.ctx || this.ctx.state === 'suspended') return;
      try {
        const currentChord = chordProgression[chordIdx % chordProgression.length];
        const noteFreq = currentChord[step % currentChord.length];

        const osc = this.ctx.createOscillator();
        const biquadFilter = this.ctx.createBiquadFilter();
        const gain = this.ctx.createGain();

        osc.type = waveType;
        osc.frequency.setValueAtTime(noteFreq, this.ctx.currentTime);

        biquadFilter.type = 'lowpass';
        biquadFilter.frequency.setValueAtTime(filterCutoff, this.ctx.currentTime);

        gain.gain.setValueAtTime(0.05, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + (tempo / 1000) * 2);

        osc.connect(biquadFilter);
        biquadFilter.connect(gain);
        gain.connect(this.bgmVolumeNode!);

        osc.start();
        osc.stop(this.ctx.currentTime + (tempo / 1000) * 2.2);

        step++;
        if (step % 8 === 0) {
          chordIdx++;
        }
      } catch (e) { /* Suppress */ }
    }, tempo);
  }

  stopBgm() {
    this.bgmStarted = false;
    if (this.bgmInterval) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
  }

  setMusicVolume(vol: number) {
    this.musicVolume = vol;
    if (this.bgmVolumeNode && this.ctx) {
      const effectiveVol = vol * this.masterVolume * 0.02;
      this.bgmVolumeNode.gain.setValueAtTime(effectiveVol, this.ctx.currentTime);
    }
  }

  // --- Sound Effects (SFX) ---
  playClick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch { /* Suppress */ }
  }

  playError() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(110, ctx.currentTime + 0.2);
      
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.2);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* Suppress */ }
  }

  playCoin() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(987.77, ctx.currentTime); // B5
      osc1.frequency.setValueAtTime(1318.51, ctx.currentTime + 0.08); // E6
      
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1318.51, ctx.currentTime);
      osc2.frequency.setValueAtTime(1975.53, ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      
      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);
      
      osc1.start();
      osc2.start();
      osc1.stop(ctx.currentTime + 0.35);
      osc2.stop(ctx.currentTime + 0.35);
    } catch { /* Suppress */ }
  }

  playExplode() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(180, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(40, ctx.currentTime + 0.5);
      
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch { /* Suppress */ }
  }

  playCard() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.12);
    } catch { /* Suppress */ }
  }

  playFanfare() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.1);
        gain.gain.setValueAtTime(0.03, ctx.currentTime + i * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.35);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.1);
        osc.stop(ctx.currentTime + i * 0.1 + 0.35);
      });
    } catch { /* Suppress */ }
  }

  playTick() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch { /* Suppress */ }
  }

  playGem() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(1046.50, ctx.currentTime); // High C
      osc.frequency.exponentialRampToValueAtTime(1567.98, ctx.currentTime + 0.15); // G6
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.15);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.15);
    } catch { /* Suppress */ }
  }

  playRocketBoost() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(90, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(180, ctx.currentTime + 0.25);
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    } catch { /* Suppress */ }
  }

  playSpinWheel() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(440, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.05);
      gain.gain.setValueAtTime(0.02, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch { /* Suppress */ }
  }

  playSparkle() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const freqs = [1200, 1600, 2000, 2400];
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.04);
        gain.gain.setValueAtTime(0.03, ctx.currentTime + idx * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.04 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.04);
        osc.stop(ctx.currentTime + idx * 0.04 + 0.2);
      });
    } catch { /* Suppress */ }
  }

  playUpgradeSuccess() {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const chord = [523.25, 659.25, 783.99, 1046.50, 1318.51]; // C major 7th chord burst
      chord.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + i * 0.06);
        gain.gain.setValueAtTime(0.05, ctx.currentTime + i * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.06 + 0.4);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.06);
        osc.stop(ctx.currentTime + i * 0.06 + 0.4);
      });
    } catch { /* Suppress */ }
  }

  playPegTick(speedRatio: number = 1) {
    if (!this.enabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      const pitch = 700 + Math.min(600, speedRatio * 500);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(pitch, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.03);
      
      gain.gain.setValueAtTime(0.03, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.03);
    } catch { /* Suppress */ }
  }

  // --- Dedicated Bubble Pop Arcade Audio ---
  playBubbleShoot() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(300, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(900, ctx.currentTime + 0.09);
      gain.gain.setValueAtTime(0.06 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.09);
    } catch { /* Suppress */ }
  }

  playBubblePop() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(850 + Math.random() * 200, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.08);
      gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch { /* Suppress */ }
  }

  playCombo(comboCount: number = 2) {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const baseFreq = 440 * Math.pow(1.05946, Math.min(12, comboCount * 2));
      const notes = [baseFreq, baseFreq * 1.25, baseFreq * 1.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.05);
        gain.gain.setValueAtTime(0.05 * this.sfxVolume, ctx.currentTime + idx * 0.05);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.05 + 0.18);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.05);
        osc.stop(ctx.currentTime + idx * 0.05 + 0.18);
      });
    } catch { /* Suppress */ }
  }

  playTreasure() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const freqs = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98];
      freqs.forEach((f, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(f, ctx.currentTime + i * 0.04);
        gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime + i * 0.04);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.04 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + i * 0.04);
        osc.stop(ctx.currentTime + i * 0.04 + 0.25);
      });
    } catch { /* Suppress */ }
  }

  playVictory() {
    if (!this.enabled || !this.sfxEnabled) return;
    this.playFanfare();
    this.playSparkle();
  }

  playLoss() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const notes = [300, 260, 220, 180];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);
        gain.gain.setValueAtTime(0.04 * this.sfxVolume, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.1 + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.2);
      });
    } catch { /* Suppress */ }
  }

  playSplash() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.2);
      gain.gain.setValueAtTime(0.1 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* Suppress */ }
  }

  playChestOpen() {
    if (!this.enabled || !this.sfxEnabled) return;
    this.playTreasure();
    this.playFanfare();
  }

  playSlice(weaponId: string = 'katana') {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      if (weaponId.includes('snake') || weaponId === 'serpent' || weaponId === 'python' || weaponId === 'cobra' || weaponId === 'grass_snake') {
        // Snake Hiss / Slither sound (noise/high pitch sine modulation)
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1200, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(3500, ctx.currentTime + 0.08);
        osc.frequency.exponentialRampToValueAtTime(800, ctx.currentTime + 0.18);
        gain.gain.setValueAtTime(0.06 * this.sfxVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.18);
      } else {
        // Metallic Sword Swoosh
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(220, ctx.currentTime + 0.06);
        osc.frequency.exponentialRampToValueAtTime(60, ctx.currentTime + 0.14);
        gain.gain.setValueAtTime(0.12 * this.sfxVolume, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.14);
      }
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* Suppress */ }
  }

  playFruitSquish(baseFreq: number = 320) {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      // Juicy squish combining low thud and high droplet splash
      const osc1 = ctx.createOscillator();
      const gain1 = ctx.createGain();
      osc1.type = 'sine';
      osc1.frequency.setValueAtTime(baseFreq, ctx.currentTime);
      osc1.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.12);
      gain1.gain.setValueAtTime(0.15 * this.sfxVolume, ctx.currentTime);
      gain1.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      osc1.connect(gain1);
      gain1.connect(ctx.destination);
      osc1.start();
      osc1.stop(ctx.currentTime + 0.12);

      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = 'triangle';
      osc2.frequency.setValueAtTime(1400 + Math.random() * 400, ctx.currentTime);
      osc2.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.09);
      gain2.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain2.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.09);
      osc2.connect(gain2);
      gain2.connect(ctx.destination);
      osc2.start();
      osc2.stop(ctx.currentTime + 0.09);
    } catch { /* Suppress */ }
  }

  playCritSlice() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'square';
      osc.frequency.setValueAtTime(880, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1760, ctx.currentTime + 0.08);
      osc.frequency.exponentialRampToValueAtTime(3520, ctx.currentTime + 0.16);
      gain.gain.setValueAtTime(0.08 * this.sfxVolume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.2);
    } catch { /* Suppress */ }
  }

  playPerfectCombo(combo: number = 3) {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const base = 440 + (combo * 60);
      [0, 0.06, 0.12].forEach((offset, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(base * Math.pow(1.2, idx), ctx.currentTime + offset);
        gain.gain.setValueAtTime(0.1 * this.sfxVolume, ctx.currentTime + offset);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + offset + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(ctx.currentTime + offset);
        osc.stop(ctx.currentTime + offset + 0.2);
      });
    } catch { /* Suppress */ }
  }

  // ====================================================
  // AAA FOOTBALL PENALTY SHOOTOUT SOUNDS
  // ====================================================

  playFootballKick() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      // 1. Deep boot impact thud
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.exponentialRampToValueAtTime(40, now + 0.15);
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.18);

      // 2. High frequency air snap
      const bufferSize = ctx.sampleRate * 0.08;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2 * this.sfxVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);
    } catch { /* Suppress */ }
  }

  playGoalPostHit() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      // Metallic ringing harmonics
      [880, 1320, 2640, 3520].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now);
        gain.gain.setValueAtTime((0.15 / (idx + 1)) * this.sfxVolume, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.45);
      });
    } catch { /* Suppress */ }
  }

  playNetSwoosh() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.35;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1200, now);
      filter.frequency.linearRampToValueAtTime(400, now + 0.35);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch { /* Suppress */ }
  }

  playGloveCatch() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(220, now);
      osc.frequency.exponentialRampToValueAtTime(60, now + 0.12);
      gain.gain.setValueAtTime(0.4 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    } catch { /* Suppress */ }
  }

  playGoalkeeperDive() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const bufferSize = ctx.sampleRate * 0.25;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(300, now + 0.25);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch { /* Suppress */ }
  }

  playCrowdCheer() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const duration = 1.8;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        const env = Math.sin((i / bufferSize) * Math.PI);
        data[i] = (Math.random() * 2 - 1) * env;
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(800, now);
      filter.Q.value = 0.5;
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.35 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      
      // Fanfare chord overlay
      this.playFanfare();
    } catch { /* Suppress */ }
  }

  playCrowdSave() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const duration = 1.2;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 1.5);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(1000, now);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.28 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
    } catch { /* Suppress */ }
  }

  playCrowdMiss() {
    if (!this.enabled || !this.sfxEnabled) return;
    try {
      this.initCtx();
      const ctx = this.ctx!;
      const now = ctx.currentTime;
      const duration = 1.2;
      const bufferSize = ctx.sampleRate * duration;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.sin((i / bufferSize) * Math.PI);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(600, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + duration);
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.25 * this.sfxVolume, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + duration);
      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);
      noise.start(now);
      this.playExplode();
    } catch { /* Suppress */ }
  }
}

export const synth = new AudioSynth();
