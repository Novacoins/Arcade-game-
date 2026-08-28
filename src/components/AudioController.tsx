/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Volume2, VolumeX, Music, Square, Sliders } from 'lucide-react';
import { synth } from '../utils/audioSynth';
import { motion, AnimatePresence } from 'motion/react';

export default function AudioController() {
  const [muted, setMuted] = useState(synth.isMuted());
  const [bgmActive, setBgmActive] = useState(false);
  const [volume, setVolume] = useState(40); // default 40%
  const [showSlider, setShowSlider] = useState(false);

  // Initialize and handle click triggers
  const handleToggleMute = () => {
    const nextMuted = !muted;
    setMuted(nextMuted);
    synth.toggle(!nextMuted);
    synth.playClick();

    // If unmuting and bgm was active, restart it
    if (!nextMuted && bgmActive) {
      synth.startBgm();
    } else if (nextMuted) {
      synth.stopBgm();
    }
  };

  const handleToggleBgm = () => {
    if (muted) {
      // Unmute first to allow music
      setMuted(false);
      synth.toggle(true);
    }

    const nextBgm = !bgmActive;
    setBgmActive(nextBgm);
    synth.playClick();

    if (nextBgm) {
      synth.startBgm();
    } else {
      synth.stopBgm();
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseInt(e.target.value) || 0;
    setVolume(vol);
    synth.setMusicVolume(vol);
  };

  // Auto-start BGM on first interaction
  useEffect(() => {
    const startOnInteract = () => {
      if (!bgmActive && !muted) {
        setBgmActive(true);
        synth.startBgm();
      }
      window.removeEventListener('click', startOnInteract);
    };
    window.addEventListener('click', startOnInteract);
    return () => window.removeEventListener('click', startOnInteract);
  }, [bgmActive, muted]);

  // Page Visibility API & Window Focus/Blur controls
  useEffect(() => {
    const handleVisibilityOrFocus = () => {
      const isWindowActive = document.visibilityState === 'visible' && document.hasFocus();
      
      if (!isWindowActive) {
        // Temporarily pause BGM and disable SFX without changing React states
        synth.stopBgm();
        synth.enabled = false;
      } else {
        // Re-enable SFX according to mute state
        synth.enabled = !muted;
        // Resume BGM if it was active
        if (bgmActive && !muted) {
          synth.startBgm();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityOrFocus);
    window.addEventListener('focus', handleVisibilityOrFocus);
    window.addEventListener('blur', handleVisibilityOrFocus);

    // Initial check
    handleVisibilityOrFocus();

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityOrFocus);
      window.removeEventListener('focus', handleVisibilityOrFocus);
      window.removeEventListener('blur', handleVisibilityOrFocus);
    };
  }, [bgmActive, muted]);

  return null;
}
