/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { synth } from '../../utils/audioSynth';
import { useCoinValidation } from '../../context/CoinContext';
import { Sparkles, Star, Trophy, Zap, RefreshCw, Flame, Shield, Volume2, VolumeX, HelpCircle, Swords, Heart, Snowflake, Play, RotateCcw, Award, ChevronRight, Coins } from 'lucide-react';
import { BrickSmashClassic } from './BrickSmashClassic';

interface ArcadeGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier: number) => void;
  onGameLose: (amount: number) => void;
}

/* ==========================================
   1. ROCKET RUN
   ========================================== */
export function RocketRun({ coins, onGameWin, onGameLose }: ArcadeGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [score, setScore] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);
  
  // Game dimensions & coordinates
  const playerRef = useRef({ x: 100, y: 150, radius: 10, targetY: 150 });
  const starsRef = useRef<{ x: number; y: number; speed: number }[]>([]);
  const obstaclesRef = useRef<{ x: number; y: number; width: number; height: number; speed: number }[]>([]);

  const handleStart = () => {
    if (!validateAndDeductCoins(bet, 'Rocket Run')) {
      return;
    }
    synth.playClick();

    // Initializations
    setGameState('playing');
    setScore(0);

    playerRef.current = { x: 80, y: 150, radius: 10, targetY: 150 };
    
    // stars
    const stars = [];
    for (let i = 0; i < 30; i++) {
      stars.push({
        x: Math.random() * 400,
        y: Math.random() * 300,
        speed: Math.random() * 1.5 + 0.5
      });
    }
    starsRef.current = stars;
    obstaclesRef.current = [];
  };

  // Canvas loop
  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 400;
    canvas.height = 300;

    let frames = 0;

    const gameLoop = () => {
      frames++;
      setScore(Math.floor(frames / 10));

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Scroll background stars
      ctx.fillStyle = '#6b7280';
      starsRef.current.forEach((st) => {
        st.x -= st.speed;
        if (st.x < 0) {
          st.x = canvas.width;
          st.y = Math.random() * canvas.height;
        }
        ctx.fillRect(st.x, st.y, 2, 2);
      });

      // Smoothly steer player rocket towards target height
      const p = playerRef.current;
      p.y += (p.targetY - p.y) * 0.12;

      // Draw active player rocket
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.moveTo(15, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.fill();

      // Fire flame exhaust
      ctx.fillStyle = '#f59e0b';
      ctx.beginPath();
      ctx.arc(-14 - Math.random() * 6, (Math.random() - 0.5) * 4, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Spawn asteroid obstacles
      if (frames % 45 === 0) {
        obstaclesRef.current.push({
          x: canvas.width + 20,
          y: Math.random() * (canvas.height - 40) + 10,
          width: Math.random() * 15 + 10,
          height: Math.random() * 15 + 10,
          speed: Math.random() * 1.5 + 2.5
        });
      }

      // Move & draw obstacles
      ctx.fillStyle = '#78716c';
      for (let i = obstaclesRef.current.length - 1; i >= 0; i--) {
        const obs = obstaclesRef.current[i];
        obs.x -= obs.speed;

        // Draw rough stone texture
        ctx.beginPath();
        ctx.roundRect(obs.x, obs.y, obs.width, obs.height, 4);
        ctx.fill();

        // Check bounding circle collision
        const dist = Math.sqrt(
          Math.pow((p.x) - (obs.x + obs.width / 2), 2) +
          Math.pow((p.y) - (obs.y + obs.height / 2), 2)
        );

        if (dist < p.radius + Math.max(obs.width, obs.height) / 2) {
          // Crash explosion!
          synth.playExplode();
          setGameState('gameover');
          
          // Calculate reward payout
          const mult = parseFloat((1 + Math.floor(frames / 10) / 100).toFixed(2));
          const payout = Math.floor(bet * mult);
          onGameWin(payout, mult);
          return;
        }

        // Clean off-screen items
        if (obs.x < -40) obstaclesRef.current.splice(i, 1);
      }

      requestRef.current = requestAnimationFrame(gameLoop);
    };

    requestRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState]);

  // Touch steer handler
  const handleSteer = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeY = ((e.clientY - rect.top) / rect.height) * 300;
    playerRef.current.targetY = Math.max(15, Math.min(285, relativeY));
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Actions panel */}
        <div className="bg-zinc-900/40 p-4 rounded-2xl border border-gray-900 flex flex-col justify-between space-y-4 text-center">
          <div className="space-y-3">
            <h4 className="text-sm font-black uppercase tracking-wider text-white">Rocket Run Space Dodger</h4>
            
            <div className="p-3 bg-red-500/5 border border-red-500/15 rounded-xl text-[11px] leading-relaxed text-gray-400">
              Move cursor over canvas to steer vertical. Distance increases multipliers!
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bet amount</label>
              <input
                type="number"
                disabled={gameState === 'playing'}
                value={bet}
                onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                className="w-full rounded-xl border border-gray-800 bg-black px-3.5 py-2 text-xs text-white focus:border-red-500 outline-none text-center"
              />
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={gameState === 'playing'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black uppercase tracking-wider"
          >
            {gameState === 'playing' ? 'Dodge active...' : '🚀 Start Space Escape'}
          </button>
        </div>

        {/* Board */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-black rounded-2xl border border-gray-900 overflow-hidden relative">
          <canvas 
            ref={canvasRef} 
            onMouseMove={handleSteer}
            className="max-w-full block cursor-crosshair" 
          />

          {gameState === 'playing' && (
            <div className="absolute top-6 left-6 font-mono text-xs font-black text-amber-400 uppercase tracking-widest">
              Distance: {score}M • Multiplier: {(1 + score / 100).toFixed(2)}x
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-red-500 font-black uppercase tracking-widest">Asteroid impact! Spacecraft crashed.</p>
              <h4 className="text-xl font-black text-white">Cleared distance: {score} meters</h4>
              <p className="text-xs text-emerald-400 font-bold">Multiplier secured: {(1 + score / 100).toFixed(2)}x</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

/* ==========================================
   2. RACING RUSH
   ========================================== */
export function RacingRush({ coins, onGameWin, onGameLose }: ArcadeGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(100);
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'gameover'>('idle');
  const [distance, setDistance] = useState(0);
  const [scoreCoins, setScoreCoins] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Smooth steering state physics
  const playerXRef = useRef(150); // smooth position
  const targetXRef = useRef(150); // target position (60, 150, 240)
  const speedKphRef = useRef(120);
  const nitroActiveRef = useRef(0); // timer frames
  const screenShakeRef = useRef(0);

  const trafficRef = useRef<{ 
    x: number; 
    y: number; 
    width: number; 
    height: number; 
    speed: number; 
    color: string; 
    isTruck: boolean; 
  }[]>([]);
  const itemsRef = useRef<{ 
    x: number; 
    y: number; 
    type: 'coin' | 'nitro'; 
    pulse: number; 
  }[]>([]);

  const handleStart = () => {
    if (!validateAndDeductCoins(bet, 'Racing Rush')) {
      return;
    }
    synth.playClick();

    setGameState('playing');
    setDistance(0);
    setScoreCoins(0);

    playerXRef.current = 150;
    targetXRef.current = 150;
    speedKphRef.current = 120;
    nitroActiveRef.current = 0;
    screenShakeRef.current = 0;

    trafficRef.current = [];
    itemsRef.current = [];
  };

  useEffect(() => {
    if (gameState !== 'playing') {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High quality scale sizing
    canvas.width = 300;
    canvas.height = 300;

    let frames = 0;

    // Handle Keyboard direct arrows / AD
    const handleKeys = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        e.preventDefault();
        synth.playClick();
        if (targetXRef.current === 150) targetXRef.current = 60;
        else if (targetXRef.current === 240) targetXRef.current = 150;
      }
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        synth.playClick();
        if (targetXRef.current === 150) targetXRef.current = 240;
        else if (targetXRef.current === 60) targetXRef.current = 150;
      }
    };
    window.addEventListener('keydown', handleKeys);

    const loop = () => {
      frames++;
      
      // Update Nitro mechanics
      if (nitroActiveRef.current > 0) {
        nitroActiveRef.current--;
        speedKphRef.current = 280;
        screenShakeRef.current = Math.max(screenShakeRef.current, 2);
      } else {
        speedKphRef.current = 140 + Math.min(100, Math.floor(frames / 12));
      }

      const currentSpeedCoeff = speedKphRef.current / 140;
      setDistance((prev) => prev + Math.floor(currentSpeedCoeff));

      // Damping shake values
      if (screenShakeRef.current > 0) screenShakeRef.current *= 0.9;

      // Clear with dynamic shake offset coordinates
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.save();
      if (screenShakeRef.current > 0.5) {
        const dx = (Math.random() - 0.5) * screenShakeRef.current;
        const dy = (Math.random() - 0.5) * screenShakeRef.current;
        ctx.translate(dx, dy);
      }

      // Smooth interpolation for steering physics
      playerXRef.current += (targetXRef.current - playerXRef.current) * 0.22;

      // 1. Draw Horizon night sky landscape with starry gradients
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 110);
      skyGrad.addColorStop(0, '#090514'); // cosmic violet
      skyGrad.addColorStop(1, '#020105');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 110);

      // Distant mountain ranges
      ctx.fillStyle = '#110c22';
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(40, 80);
      ctx.lineTo(110, 95);
      ctx.lineTo(160, 75);
      ctx.lineTo(220, 95);
      ctx.lineTo(300, 110);
      ctx.closePath();
      ctx.fill();

      // Neon horizon wire glow
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(0, 110);
      ctx.lineTo(canvas.width, 110);
      ctx.stroke();

      // 2. Draw Scrolling Pseudo-3D curved highway margins
      const roadCurve = Math.sin(frames * 0.015) * 25; // dynamic winding curve
      
      // Paint asphalt road surface
      ctx.fillStyle = '#141416';
      ctx.beginPath();
      ctx.moveTo(110 + roadCurve * 0.2, 110); // top width center
      ctx.lineTo(190 + roadCurve * 0.2, 110);
      ctx.lineTo(285, canvas.height); // expanding bottom perspective
      ctx.lineTo(15, canvas.height);
      ctx.closePath();
      ctx.fill();

      // Draw highway side shoulders with scrolling green margins
      const segmentHeight = 25;
      const stripeOffset = (frames * (speedKphRef.current / 15)) % (segmentHeight * 2);

      for (let y = 110; y < canvas.height; y += 4) {
        const perspectiveCoeff = (y - 110) / (canvas.height - 110); // 0 to 1
        const roadWidth = 80 + perspectiveCoeff * 190;
        const roadCenterX = 150 + roadCurve * Math.pow(perspectiveCoeff, 2.2);

        const leftEdge = roadCenterX - roadWidth / SegmentDivider(perspectiveCoeff);
        const rightEdge = roadCenterX + roadWidth / SegmentDivider(perspectiveCoeff);

        // draw stripe blocks alternating colors
        const activeColor = Math.floor((y + stripeOffset) / segmentHeight) % 2 === 0;
        ctx.fillStyle = activeColor ? '#dc2626' : '#ffffff';
        
        const thick = Math.max(1, perspectiveCoeff * 4.5);
        ctx.fillRect(leftEdge - thick, y, thick, 4);
        ctx.fillRect(rightEdge, y, thick, 4);
      }

      // Helper function to calculate perspective segment division
      function SegmentDivider(pc: number) {
        return 2; // road boundary layout
      }

      // Draw scrolling lane lines (dashed yellow) inside asphalt
      for (let y = 110; y < canvas.height; y += 12) {
        const perspectiveCoeff = (y - 110) / (canvas.height - 110);
        const roadWidth = 80 + perspectiveCoeff * 190;
        const roadCenterX = 150 + roadCurve * Math.pow(perspectiveCoeff, 2.2);
        
        const stepOffset = (frames * (speedKphRef.current / 12)) % 36;
        const isStripe = Math.floor((y + stepOffset) / 18) % 2 === 0;

        if (isStripe) {
          ctx.fillStyle = '#fbbf24';
          const dotSize = Math.max(1, perspectiveCoeff * 4);
          const laneLeftX = roadCenterX - roadWidth / 6;
          const laneRightX = roadCenterX + roadWidth / 6;

          ctx.fillRect(laneLeftX - dotSize/2, y, dotSize, 4);
          ctx.fillRect(laneRightX - dotSize/2, y, dotSize, 4);
        }
      }

      // 3. Spawners: Randomly generate traffic cars & collectable powerups
      if (frames % 42 === 0) {
        const laneXList = [60, 150, 240];
        const selectedLane = laneXList[Math.floor(Math.random() * laneXList.length)];
        
        // Spawn car or item
        if (Math.random() < 0.65) {
          // Spawn obstacles
          const isTruck = Math.random() < 0.28;
          trafficRef.current.push({
            x: selectedLane,
            y: -50,
            width: isTruck ? 26 : 22,
            height: isTruck ? 42 : 30,
            speed: isTruck ? 1.5 + Math.random() * 0.8 : 2.5 + Math.random() * 1.5,
            color: ['#3b82f6', '#10b981', '#a855f7', '#fbbf24'][Math.floor(Math.random() * 4)],
            isTruck
          });
        } else {
          // Spawn collectables (nitro or gold coins)
          itemsRef.current.push({
            x: selectedLane,
            y: -30,
            type: Math.random() < 0.22 ? 'nitro' : 'coin',
            pulse: 0
          });
        }
      }

      // 4. Update & Render Items (Gold Coins & Nitro)
      for (let i = itemsRef.current.length - 1; i >= 0; i--) {
        const item = itemsRef.current[i];
        
        // Perspective scaling toward bottom player lane
        item.y += 3.5 * currentSpeedCoeff;
        item.pulse += 0.15;

        // Draw item
        const scale = 0.3 + (item.y - 110) / (canvas.height - 110) * 0.7;
        
        if (scale > 0 && item.y < canvas.height) {
          ctx.save();
          ctx.translate(item.x + (roadCurve * Math.pow((item.y - 110) / (canvas.height - 110), 2.2)) * 0.2, item.y);
          ctx.scale(scale, scale);

          if (item.type === 'coin') {
            // Shiny rotating Golden Coin
            ctx.fillStyle = '#f59e0b';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.ellipse(0, 0, 8 + Math.sin(item.pulse) * 2, 8, 0, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            
            // Centered dollar sign
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('$', 0, 3);
          } else {
            // Shiny cyan Nitro canister
            ctx.fillStyle = '#06b6d4';
            ctx.strokeStyle = '#ffffff';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.rect(-5, -8, 10, 16);
            ctx.fill();
            ctx.stroke();

            // Centered letter N
            ctx.fillStyle = '#ffffff';
            ctx.font = 'bold 8px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('N', 0, 3);
          }
          ctx.restore();
        }

        // Collision check with player (player is at Y=250, width=30)
        const itemRoadX = item.x + (roadCurve * Math.pow((item.y - 110) / (canvas.height - 110), 2.2)) * 0.2;
        if (item.y >= 230 && item.y <= 270 && Math.abs(itemRoadX - playerXRef.current) < 25) {
          if (item.type === 'coin') {
            synth.playCoin();
            setScoreCoins((prev) => prev + 1);
          } else {
            synth.playCoin();
            nitroActiveRef.current = 120; // nitro boost
          }
          itemsRef.current.splice(i, 1);
        } else if (item.y > canvas.height) {
          itemsRef.current.splice(i, 1);
        }
      }

      // 5. Update & Render Traffic Cars
      for (let i = trafficRef.current.length - 1; i >= 0; i--) {
        const car = trafficRef.current[i];
        car.y += car.speed * currentSpeedCoeff;

        const scale = 0.3 + (car.y - 110) / (canvas.height - 110) * 0.7;
        if (scale > 0 && car.y < canvas.height) {
          ctx.save();
          const carRoadX = car.x + (roadCurve * Math.pow((car.y - 110) / (canvas.height - 110), 2.2)) * 0.2;
          ctx.translate(carRoadX, car.y);
          ctx.scale(scale, scale);

          // Draw traffic car
          ctx.fillStyle = car.color;
          ctx.strokeStyle = '#1e293b';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.roundRect(-car.width / 2, -car.height / 2, car.width, car.height, 4);
          ctx.fill();
          ctx.stroke();

          // Windshield
          ctx.fillStyle = '#38bdf8';
          ctx.beginPath();
          ctx.fillRect(-car.width / 2.5, -car.height / 3, car.width * 0.8, car.height * 0.25);

          // Wheels
          ctx.fillStyle = '#0f172a';
          ctx.fillRect(-car.width / 2 - 2, -car.height / 4, 2, car.height / 3);
          ctx.fillRect(car.width / 2, -car.height / 4, 2, car.height / 3);

          ctx.restore();

          // Collision check with player
          if (car.y >= 230 && car.y <= 270 && Math.abs(carRoadX - playerXRef.current) < 22) {
            synth.playExplode();
            setGameState('gameover');
            
            const mult = parseFloat((1 + distance * 0.005 + scoreCoins * 0.1).toFixed(2));
            onGameWin(Math.floor(bet * mult), mult);
          }
        } else if (car.y > canvas.height) {
          trafficRef.current.splice(i, 1);
        }
      }

      // 6. Draw Player Car
      ctx.save();
      ctx.translate(playerXRef.current, 250);

      // Car body
      const bodyGrad = ctx.createLinearGradient(0, -18, 0, 18);
      bodyGrad.addColorStop(0, '#f43f5e');
      bodyGrad.addColorStop(1, '#9f1239');
      ctx.fillStyle = bodyGrad;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(-14, -18, 28, 36, 6);
      ctx.fill();
      ctx.stroke();

      // Tail lights
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(-12, 14, 4, 3);
      ctx.fillRect(8, 14, 4, 3);

      // Cabin windshield
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.roundRect(-10, -8, 20, 14, 3);
      ctx.fill();

      // Rear Spoiler wings
      ctx.fillStyle = '#1e293b';
      ctx.fillRect(-15, 12, 30, 3);

      // Thruster flame if nitro is active
      if (nitroActiveRef.current > 0) {
        const flameLen = 12 + Math.random() * 10;
        const flameGrad = ctx.createLinearGradient(0, 18, 0, 18 + flameLen);
        flameGrad.addColorStop(0, '#ffffff');
        flameGrad.addColorStop(0.5, '#06b6d4');
        flameGrad.addColorStop(1, 'rgba(6,182,212,0)');
        ctx.fillStyle = flameGrad;
        ctx.beginPath();
        ctx.moveTo(-6, 18);
        ctx.lineTo(0, 18 + flameLen);
        ctx.lineTo(6, 18);
        ctx.closePath();
        ctx.fill();
      }

      ctx.restore();

      ctx.restore(); // end screen shake translate
      
      requestRef.current = requestAnimationFrame(loop);
    };

    requestRef.current = requestAnimationFrame(loop);

    return () => {
      window.removeEventListener('keydown', handleKeys);
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameState, distance, scoreCoins, bet]);

  return (
    <div className="space-y-4" id="racing_rush_container">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Control Column */}
        <div className="bg-zinc-900/60 p-5 rounded-2xl border border-white/5 flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">🏎️</span>
              <h4 className="text-sm font-black uppercase tracking-wider text-white">Racing Rush pseudo-3D</h4>
            </div>
            
            <p className="text-[11px] text-zinc-400 leading-relaxed">
              Steer the red sports car with <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-white font-mono text-[10px]">A</kbd> / <kbd className="px-1 py-0.5 rounded bg-zinc-800 text-white font-mono text-[10px]">D</kbd> or Left/Right arrow keys. Dodge oncoming traffic, collect golden coins, and trigger Nitro for extreme multipliers!
            </p>

            <div>
              <label className="block text-[10px] font-bold text-gray-500 uppercase mb-1">Bet amount</label>
              <div className="flex gap-2">
                <input
                  type="number"
                  disabled={gameState === 'playing'}
                  value={bet}
                  onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 0))}
                  className="w-full text-center rounded-xl border border-zinc-800 bg-black py-2 text-sm text-white focus:border-red-500 outline-none font-mono"
                />
              </div>
            </div>
          </div>

          <button
            onClick={handleStart}
            disabled={gameState === 'playing'}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-amber-500 text-white text-xs font-black uppercase tracking-wider"
          >
            {gameState === 'playing' ? 'Dodge active...' : '🏎️ Start Racing Rush'}
          </button>
        </div>

        {/* Board Column */}
        <div className="md:col-span-2 flex flex-col items-center justify-center p-4 bg-black rounded-2xl border border-gray-900 overflow-hidden relative">
          <canvas 
            ref={canvasRef} 
            className="max-w-full block rounded-xl border border-zinc-800" 
          />

          {gameState === 'playing' && (
            <div className="absolute top-6 left-6 font-mono text-xs font-black text-amber-400 uppercase tracking-widest bg-black/70 px-3 py-1.5 rounded-xl border border-white/5">
              Dist: {distance}M • Coins: {scoreCoins} • Multiplier: {(1 + distance * 0.005 + scoreCoins * 0.1).toFixed(2)}x
            </div>
          )}

          {gameState === 'idle' && (
            <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-2">
              <span className="text-4xl animate-bounce">🏎️</span>
              <p className="text-xs text-zinc-400 font-bold uppercase tracking-widest">Racing Rush pseudo-3D</p>
              <p className="text-[10px] text-zinc-500">Set your wager amount and click start to begin!</p>
            </div>
          )}

          {gameState === 'gameover' && (
            <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-2">
              <p className="text-xs text-red-500 font-black uppercase tracking-widest">💥 Traffic Collision! Crashed.</p>
              <h4 className="text-xl font-black text-white">Distance: {distance} meters</h4>
              <h5 className="text-sm font-bold text-amber-400">Coins Collected: {scoreCoins}</h5>
              <p className="text-xs text-emerald-400 font-bold">Multiplier secured: {(1 + distance * 0.005 + scoreCoins * 0.1).toFixed(2)}x</p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}


/* ==========================================
   3. FRUIT SLICE AAA - PREMIUM EDITION
   ========================================== */
export { FruitSlice } from "./FruitSliceGame";
export type { FruitWeapon } from "./FruitSliceGame";

/* ==========================================
   4. BRICK SMASH
   ========================================== */
export function BrickSmash({ coins, onGameWin, onGameLose }: ArcadeGameProps) {
  return <BrickSmashClassic coins={coins} onGameWin={onGameWin} onGameLose={onGameLose} />;
}


/* ==========================================
   5. GOAL CHALLENGE AAA - PREMIUM EDITION
   ========================================== */
export { GoalChallenge } from "./GoalChallengeGame";
export type { StadiumTheme } from "./GoalChallengeGame";

/* ==========================================
   6. MEMORY FLIP CARD PAIRING
   ========================================== */
export { MemoryFlip } from './MemoryFlipGame';

