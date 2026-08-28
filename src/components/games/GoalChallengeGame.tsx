import React, { useState, useRef, useEffect } from 'react';
import { useCoinValidation } from '../../context/CoinContext';
import { synth } from '../../utils/audioSynth';
import { Trophy, Sparkles, Flame, Check, Lock, Palette, Award, Coins, ShoppingBag, X, Zap } from 'lucide-react';

export interface ArcadeGameProps {
  coins: number;
  onGameWin: (amount: number, multiplier?: number) => void;
  onGameLose: (amount: number) => void;
}

export interface StadiumTheme {
  id: string;
  name: string;
  price: number;
  description: string;
  icon: string;
  stadiumSky: [string, string];
  crowdColor: string;
  floodlightColor: string;
  pitchColors: [string, string, string];
  goalFrameColor: string;
  netColor: string;
  keeperJersey: string;
  keeperShorts: string;
  keeperGloves: string;
  ballType: 'classic' | 'champions' | 'hivis' | 'gold' | 'neon' | 'orange' | 'diamond';
  atmosphere: 'none' | 'confetti' | 'rain' | 'snow' | 'lasers' | 'gold_dust';
}

export const STADIUM_THEMES: Record<string, StadiumTheme> = {
  classic: {
    id: 'classic',
    name: 'Classic Pro Stadium',
    price: 0,
    description: 'Authentic FIFA-regulation professional stadium with pristine emerald turf and high-def halogen floodlights.',
    icon: '🏟️',
    stadiumSky: ['#0b1329', '#1e293b'],
    crowdColor: '#ef4444',
    floodlightColor: 'rgba(255, 255, 255, 0.16)',
    pitchColors: ['#15803d', '#166534', '#14532d'],
    goalFrameColor: '#ffffff',
    netColor: 'rgba(255, 255, 255, 0.22)',
    keeperJersey: '#dc2626',
    keeperShorts: '#1e293b',
    keeperGloves: '#ffffff',
    ballType: 'classic',
    atmosphere: 'none'
  },
  champions: {
    id: 'champions',
    name: 'Champions League Night',
    price: 150,
    description: 'Elite European tournament night under royal blue lighting with celebratory stadium confetti atmosphere.',
    icon: '🏆',
    stadiumSky: ['#050d21', '#111c44'],
    crowdColor: '#3b82f6',
    floodlightColor: 'rgba(96, 165, 250, 0.24)',
    pitchColors: ['#14532d', '#0f3f22', '#0a2f19'],
    goalFrameColor: '#f8fafc',
    netColor: 'rgba(147, 197, 253, 0.28)',
    keeperJersey: '#2563eb',
    keeperShorts: '#ffffff',
    keeperGloves: '#fbbf24',
    ballType: 'champions',
    atmosphere: 'confetti'
  },
  floodlight: {
    id: 'floodlight',
    name: 'High-Voltage Floodlight Arena',
    price: 300,
    description: 'Dramatic high-contrast evening showdown under blazing golden halogen towers with rain reflections.',
    icon: '💡',
    stadiumSky: ['#05050a', '#0d0d1a'],
    crowdColor: '#f59e0b',
    floodlightColor: 'rgba(251, 191, 36, 0.30)',
    pitchColors: ['#166534', '#15803d', '#115e2b'],
    goalFrameColor: '#ffffff',
    netColor: 'rgba(254, 240, 138, 0.25)',
    keeperJersey: '#059669',
    keeperShorts: '#022c22',
    keeperGloves: '#ffffff',
    ballType: 'hivis',
    atmosphere: 'rain'
  },
  worldcup: {
    id: 'worldcup',
    name: 'World Cup Final Stadium',
    price: 500,
    description: 'The absolute pinnacle of international football glory featuring golden goalposts, pyrotechnics, and gold dust.',
    icon: '🌍',
    stadiumSky: ['#1e1b18', '#382f24'],
    crowdColor: '#eab308',
    floodlightColor: 'rgba(234, 179, 8, 0.28)',
    pitchColors: ['#15803d', '#1a7a3e', '#136e35'],
    goalFrameColor: '#fef08a',
    netColor: 'rgba(250, 204, 21, 0.35)',
    keeperJersey: '#7e22ce',
    keeperShorts: '#3b0764',
    keeperGloves: '#facc15',
    ballType: 'gold',
    atmosphere: 'gold_dust'
  },
  cyber: {
    id: 'cyber',
    name: 'Neon Cyberpunk Stadium',
    price: 750,
    description: 'Futuristic synthwave arena with glowing laser arrays, neon turf accents, and cyberpunk ball physics.',
    icon: '⚡',
    stadiumSky: ['#090514', '#1c0b36'],
    crowdColor: '#ec4899',
    floodlightColor: 'rgba(236, 72, 153, 0.32)',
    pitchColors: ['#0f172a', '#1e1b4b', '#0f172a'],
    goalFrameColor: '#38bdf8',
    netColor: 'rgba(56, 189, 248, 0.40)',
    keeperJersey: '#be185d',
    keeperShorts: '#000000',
    keeperGloves: '#22d3ee',
    ballType: 'neon',
    atmosphere: 'lasers'
  },
  snow: {
    id: 'snow',
    name: 'Winter Blizzard Arena',
    price: 1000,
    description: 'Championship match in a winter blizzard with frosted emerald turf, snowflakes, and high-visibility orange balls.',
    icon: '❄️',
    stadiumSky: ['#1e293b', '#334155'],
    crowdColor: '#38bdf8',
    floodlightColor: 'rgba(224, 242, 254, 0.38)',
    pitchColors: ['#0d3824', '#134e34', '#0f402a'],
    goalFrameColor: '#e0f2fe',
    netColor: 'rgba(255, 255, 255, 0.45)',
    keeperJersey: '#0284c7',
    keeperShorts: '#0c4a6e',
    keeperGloves: '#ffffff',
    ballType: 'orange',
    atmosphere: 'snow'
  },
  legendary: {
    id: 'legendary',
    name: 'Golden Immortals Sanctuary',
    price: 1500,
    description: 'The ultimate royal VIP stadium reserved for football royalty, with diamond balls and eternal golden shimmer.',
    icon: '👑',
    stadiumSky: ['#1f1300', '#3b2500'],
    crowdColor: '#f59e0b',
    floodlightColor: 'rgba(245, 158, 11, 0.42)',
    pitchColors: ['#14532d', '#1b6438', '#114a27'],
    goalFrameColor: '#f59e0b',
    netColor: 'rgba(245, 158, 11, 0.45)',
    keeperJersey: '#000000',
    keeperShorts: '#d97706',
    keeperGloves: '#f59e0b',
    ballType: 'diamond',
    atmosphere: 'gold_dust'
  }
};

interface CrowdSpectator {
  x: number;
  y: number;
  row: number;
  color: string;
  hasFlag: boolean;
  hasScarf: boolean;
  phase: number;
}

export function GoalChallenge({ coins, onGameWin, onGameLose }: ArcadeGameProps) {
  const { validateAndDeductCoins } = useCoinValidation();
  const [bet, setBet] = useState(20);
  const [playing, setPlaying] = useState(false);
  const [streak, setStreak] = useState(0);
  const [shootResult, setShootResult] = useState<'goal' | 'saved' | null>(null);
  
  // Theme & customization state
  const [activeThemeId, setActiveThemeId] = useState<string>('classic');
  const [unlockedThemes, setUnlockedThemes] = useState<string[]>(['classic']);
  const [showThemeModal, setShowThemeModal] = useState(false);
  const [confirmPurchaseTheme, setConfirmPurchaseTheme] = useState<StadiumTheme | null>(null);
  const [purchaseSuccessMsg, setPurchaseSuccessMsg] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const requestRef = useRef<number | null>(null);

  // Shootout interactive state refs (600x420 AAA resolution)
  const ballPos = useRef({ x: 300, y: 370, z: 1.0, vx: 0, vy: 0, vz: 0, spin: 0 });
  const keeperPos = useRef({ 
    x: 300, 
    y: 140, 
    targetX: 300, 
    targetY: 140, 
    diveState: 'center' as 'left' | 'center' | 'right' | 'top_left' | 'top_right' | 'top_center' | 'low_left' | 'low_center' | 'low_right',
    animFrame: 0,
    actionState: 'idle' as 'idle' | 'diving' | 'celebrating' | 'recovering'
  });
  const netElasticity = useRef({ deformX: 0, deformY: 0, speedX: 0, speedY: 0 });
  const targetCursor = useRef<{ x: number; y: number } | null>(null);
  const selectedZoneIdx = useRef<number>(-1);
  const gameState = useRef<'idle' | 'kicking' | 'resolved'>('idle');
  const cameraShake = useRef({ x: 0, y: 0, intensity: 0 });
  const atmosphereParticles = useRef<Array<{ x: number; y: number; vx: number; vy: number; size: number; alpha: number; color: string }>>([]);
  const crowdSpectators = useRef<CrowdSpectator[]>([]);

  // Load unlocked themes from localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem('goal_challenge_unlocked_themes_v2');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.includes('classic')) {
          setUnlockedThemes(parsed);
        }
      }
      const savedActive = localStorage.getItem('goal_challenge_active_theme_v2');
      if (savedActive && STADIUM_THEMES[savedActive]) {
        setActiveThemeId(savedActive);
      }
    } catch {
      // fallback
    }
  }, []);

  const saveUnlockedThemes = (newUnlocked: string[], newActive: string) => {
    try {
      localStorage.setItem('goal_challenge_unlocked_themes_v2', JSON.stringify(newUnlocked));
      localStorage.setItem('goal_challenge_active_theme_v2', newActive);
    } catch {
      // fallback
    }
  };

  // Defining the 9 tactical grid shootout locations within the goal posts (goal box: x: 110 to 490, y: 50 to 230)
  const zones = [
    { name: 'Top Left Corner', x: 145, y: 80, mult: 3.2, difficulty: 0.75 },
    { name: 'Top Center Roof', x: 300, y: 70, mult: 2.8, difficulty: 0.65 },
    { name: 'Top Right Corner', x: 455, y: 80, mult: 3.2, difficulty: 0.75 },
    { name: 'Mid Left Post', x: 145, y: 140, mult: 2.5, difficulty: 0.55 },
    { name: 'Dead Center', x: 300, y: 140, mult: 1.8, difficulty: 0.40 },
    { name: 'Mid Right Post', x: 455, y: 140, mult: 2.5, difficulty: 0.55 },
    { name: 'Low Left Corner', x: 155, y: 205, mult: 2.8, difficulty: 0.60 },
    { name: 'Low Center Ground', x: 300, y: 210, mult: 1.8, difficulty: 0.45 },
    { name: 'Low Right Corner', x: 445, y: 205, mult: 2.8, difficulty: 0.60 }
  ];

  const handleShootZone = (zoneIdx: number) => {
    if (playing || gameState.current !== 'idle') return;
    if (!validateAndDeductCoins(bet, 'Goal Challenge')) {
      return;
    }

    synth.playFootballKick();

    setPlaying(true);
    setShootResult(null);
    gameState.current = 'kicking';
    keeperPos.current.actionState = 'diving';

    const target = zones[zoneIdx];
    
    // Set 3D ball velocity vectors toward the selected target zone from penalty distance (y: 370)
    ballPos.current = {
      x: 300,
      y: 370,
      z: 1.0,
      vx: (target.x - 300) / 36,
      vy: (target.y - 370) / 36,
      vz: -0.016, // scale down ball to simulate realistic penalty depth
      spin: (Math.random() - 0.5) * 0.45
    };

    // Goalkeeper AI decision making:
    const randIdx = Math.floor(Math.random() * zones.length);
    const defenseZone = zones[randIdx];

    keeperPos.current.targetX = defenseZone.x;
    keeperPos.current.targetY = defenseZone.y;
    
    if (defenseZone.x < 220) {
      keeperPos.current.diveState = defenseZone.y < 110 ? 'top_left' : (defenseZone.y > 180 ? 'low_left' : 'left');
    } else if (defenseZone.x > 380) {
      keeperPos.current.diveState = defenseZone.y < 110 ? 'top_right' : (defenseZone.y > 180 ? 'low_right' : 'right');
    } else {
      keeperPos.current.diveState = defenseZone.y < 110 ? 'top_center' : (defenseZone.y > 180 ? 'low_center' : 'center');
    }

    cameraShake.current.intensity = 10;

    // Check collision at shot frame resolve (36 frames of flight ~720ms)
    setTimeout(() => {
      const isSaved = Math.abs(keeperPos.current.x - target.x) < 52 && Math.abs(keeperPos.current.y - target.y) < 52;

      if (isSaved) {
        synth.playGloveCatch();
        synth.playCrowdSave();
        setShootResult('saved');
        setStreak(0);
        keeperPos.current.actionState = 'celebrating';
        
        // Deflection off keeper gloves
        ballPos.current.vx *= -0.35;
        ballPos.current.vy *= -0.25;
        ballPos.current.vz = 0.005;
      } else {
        synth.playNetSwoosh();
        synth.playCrowdCheer();
        synth.playFanfare();
        setShootResult('goal');
        setStreak((prev) => prev + 1);
        keeperPos.current.actionState = 'recovering';
        
        // Deform net back based on strike impact
        netElasticity.current.speedX = ballPos.current.vx * 4.8;
        netElasticity.current.speedY = ballPos.current.vy * 4.8;
        
        // Pin ball inside net
        ballPos.current.vx = 0;
        ballPos.current.vy = 0;
        ballPos.current.vz = 0;

        cameraShake.current.intensity = 18;

        // Multiply win based on zone difficulty
        onGameWin(Math.floor(bet * target.mult), target.mult);
      }

      gameState.current = 'resolved';
      setPlaying(false);

      setTimeout(() => {
        gameState.current = 'idle';
        setShootResult(null);
        ballPos.current = { x: 300, y: 370, z: 1.0, vx: 0, vy: 0, vz: 0, spin: 0 };
        keeperPos.current = { x: 300, y: 140, targetX: 300, targetY: 140, diveState: 'center', animFrame: 0, actionState: 'idle' };
        netElasticity.current = { deformX: 0, deformY: 0, speedX: 0, speedY: 0 };
      }, 2600);

    }, 720);
  };

  const executePurchaseTheme = (theme: StadiumTheme) => {
    if (!validateAndDeductCoins(theme.price, `Theme: ${theme.name}`)) {
      return;
    }

    synth.playUpgradeSuccess();
    synth.playFanfare();

    const nextUnlocked = [...unlockedThemes, theme.id];
    setUnlockedThemes(nextUnlocked);
    setActiveThemeId(theme.id);
    saveUnlockedThemes(nextUnlocked, theme.id);
    setConfirmPurchaseTheme(null);

    setPurchaseSuccessMsg(`🎉 "${theme.name}" Unlocked & Equipped!`);
    setTimeout(() => {
      setPurchaseSuccessMsg(null);
    }, 4500);
  };

  // Rendering engine canvas loop (60 FPS AAA stadium rendering on 600x420 canvas)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = 600;
    canvas.height = 420;

    const activeTheme = STADIUM_THEMES[activeThemeId] || STADIUM_THEMES.classic;

    // Initialize crowd spectators (tiered audience above LED board)
    if (crowdSpectators.current.length === 0) {
      for (let row = 0; row < 5; row++) {
        for (let col = 0; col < 36; col++) {
          const isHomeTeam = (row + col) % 3 !== 0;
          crowdSpectators.current.push({
            x: col * 16 + 12,
            y: 18 + row * 14,
            row,
            color: isHomeTeam ? activeTheme.crowdColor : (col % 2 === 0 ? '#f8fafc' : '#fbbf24'),
            hasFlag: Math.random() < 0.12,
            hasScarf: Math.random() < 0.08,
            phase: Math.random() * Math.PI * 2
          });
        }
      }
    }

    // Initialize atmosphere particles
    if (atmosphereParticles.current.length === 0) {
      for (let i = 0; i < 40; i++) {
        atmosphereParticles.current.push({
          x: Math.random() * 600,
          y: Math.random() * 420,
          vx: (Math.random() - 0.5) * 1.8,
          vy: Math.random() * 1.6 + 0.6,
          size: Math.random() * 2.8 + 1.2,
          alpha: Math.random() * 0.7 + 0.3,
          color: '#ffffff'
        });
      }
    }

    const render = () => {
      const theme = STADIUM_THEMES[activeThemeId] || STADIUM_THEMES.classic;

      if (cameraShake.current.intensity > 0.1) {
        cameraShake.current.x = (Math.random() - 0.5) * cameraShake.current.intensity;
        cameraShake.current.y = (Math.random() - 0.5) * cameraShake.current.intensity;
        cameraShake.current.intensity *= 0.88;
      } else {
        cameraShake.current.x = 0;
        cameraShake.current.y = 0;
      }

      ctx.save();
      ctx.translate(cameraShake.current.x, cameraShake.current.y);

      // 1. Stadium Night Sky & Tiered Stands
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 110);
      skyGrad.addColorStop(0, theme.stadiumSky[0]);
      skyGrad.addColorStop(1, theme.stadiumSky[1]);
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, canvas.width, 110);

      // Draw tiered stadium stands and stairwells
      ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.fillRect(0, 12, canvas.width, 88);
      for (let stairX = 80; stairX < canvas.width; stairX += 140) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.fillRect(stairX, 12, 14, 88);
      }

      // Render stylized crowd audience (spectators, waving arms, flags, scarves, camera flashes)
      const time = Date.now() * 0.005;
      const isGoalCheer = gameState.current === 'resolved' && shootResult === 'goal';

      crowdSpectators.current.forEach((spec) => {
        const jumpOffset = isGoalCheer 
          ? Math.abs(Math.sin(time * 3 + spec.phase)) * 5 
          : Math.sin(time + spec.phase) * 1.8;
        const cy = spec.y - jumpOffset;

        // Spectator head & shoulders silhouette
        ctx.fillStyle = spec.color;
        ctx.beginPath();
        ctx.arc(spec.x, cy - 4, 3.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(spec.x - 3.5, cy - 1, 7, 5);

        // Cheering raised arms
        if (isGoalCheer || Math.sin(time * 0.8 + spec.phase) > 0.4) {
          ctx.strokeStyle = spec.color;
          ctx.lineWidth = 1.6;
          ctx.beginPath();
          ctx.moveTo(spec.x - 3, cy);
          ctx.lineTo(spec.x - 5, cy - 7);
          ctx.moveTo(spec.x + 3, cy);
          ctx.lineTo(spec.x + 5, cy - 7);
          ctx.stroke();
        }

        // Supporter Scarves
        if (spec.hasScarf) {
          ctx.strokeStyle = theme.crowdColor;
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(spec.x - 8, cy - 8);
          ctx.lineTo(spec.x + 8, cy - 8);
          ctx.stroke();
        }

        // Waving Team Flags
        if (spec.hasFlag) {
          ctx.strokeStyle = '#94a3b8';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(spec.x + 4, cy);
          ctx.lineTo(spec.x + 4, cy - 14);
          ctx.stroke();
          ctx.fillStyle = theme.crowdColor;
          ctx.fillRect(spec.x + 4, cy - 14, 10, 6);
        }
      });

      // Random Camera Flashes in audience
      if (Math.random() < 0.25) {
        const flashX = Math.random() * canvas.width;
        const flashY = 20 + Math.random() * 60;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
        ctx.beginPath();
        ctx.arc(flashX, flashY, 4.5, 0, Math.PI * 2);
        ctx.fill();
      }

      // LED Stadium Perimeter Banner (No ads - pure stadium decoration)
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(0, 100, canvas.width, 16);
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(0, 100, canvas.width, 16);

      ctx.fillStyle = theme.crowdColor;
      ctx.font = 'bold 9px monospace';
      const scrollX = (Date.now() * 0.05) % 750;
      ctx.fillText('⚽ FIFA QUALITY • WORLD CHAMPIONS • PREMIER STADIUM ARENA • STRIKE FOR GLORY 🏆', 300 - scrollX + 200, 111);

      // Volumetric Floodlight Beams
      ctx.fillStyle = theme.floodlightColor;
      ctx.beginPath();
      ctx.moveTo(40, 0); ctx.lineTo(0, 160); ctx.lineTo(170, 160);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(560, 0); ctx.lineTo(430, 160); ctx.lineTo(600, 160);
      ctx.closePath();
      ctx.fill();

      // 2. Professional Emerald Football Pitch (Turf with mowing stripes)
      for (let y = 116; y < canvas.height; y += 22) {
        const stripeIdx = Math.floor((y - 116) / 22) % 2;
        ctx.fillStyle = stripeIdx === 0 ? theme.pitchColors[0] : theme.pitchColors[1];
        ctx.fillRect(0, y, canvas.width, 22);
      }

      // Pitch Chalk Markings
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
      ctx.lineWidth = 2.2;
      ctx.beginPath();
      ctx.moveTo(0, 116); ctx.lineTo(canvas.width, 116);
      ctx.stroke();

      // 18-yard penalty box outline
      ctx.strokeRect(70, 116, 460, 140);

      // Penalty Arc (D-line)
      ctx.beginPath();
      ctx.arc(300, 256, 46, 0, Math.PI);
      ctx.stroke();

      // Glowing Penalty Spot (Farther away at y = 370)
      ctx.fillStyle = 'rgba(255, 255, 255, 0.28)';
      ctx.beginPath();
      ctx.arc(300, 370, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(300, 370, 4.5, 0, Math.PI * 2);
      ctx.fill();

      // 3. Goal Net Weave with Dynamic Elasticity on ball impact
      ctx.save();
      ctx.strokeStyle = theme.netColor;
      ctx.lineWidth = 1.3;

      const net = netElasticity.current;
      net.deformX += net.speedX;
      net.deformY += net.speedY;
      net.speedX += (0 - net.deformX) * 0.08;
      net.speedY += (0 - net.deformY) * 0.08;
      net.speedX *= 0.88;
      net.speedY *= 0.88;

      const goalBox = { xMin: 110, xMax: 490, yMin: 50, yMax: 230 };
      for (let y = goalBox.yMin; y < goalBox.yMax; y += 12) {
        ctx.beginPath();
        ctx.moveTo(goalBox.xMin, y);
        const dy = (y - goalBox.yMin) / (goalBox.yMax - goalBox.yMin);
        const stretchAmountX = net.deformX * (1 - dy) * 0.8;
        ctx.quadraticCurveTo(300 + stretchAmountX, y + net.deformY * 0.2, goalBox.xMax, y);
        ctx.stroke();
      }
      for (let x = goalBox.xMin; x < goalBox.xMax; x += 12) {
        ctx.beginPath();
        ctx.moveTo(x, goalBox.yMin);
        const dx = (x - goalBox.xMin) / (goalBox.xMax - goalBox.xMin);
        const stretchAmountY = net.deformY * Math.sin(dx * Math.PI) * 0.8;
        ctx.quadraticCurveTo(x + net.deformX * 0.2, goalBox.yMax + stretchAmountY, x, goalBox.yMax);
        ctx.stroke();
      }
      ctx.restore();

      // 4. Regulation White FIFA Goalposts & Specular Highlights
      ctx.save();
      ctx.strokeStyle = theme.goalFrameColor;
      ctx.lineWidth = 10;
      ctx.shadowBlur = 14;
      ctx.shadowColor = 'rgba(0,0,0,0.65)';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.beginPath();
      ctx.moveTo(110, 235); // Left post ground socket
      ctx.lineTo(110, 50);  // Left top corner
      ctx.lineTo(490, 50);  // Right top corner
      ctx.lineTo(490, 235); // Right post ground socket
      ctx.stroke();

      // Metallic cylindrical specular highlights
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(108, 233); ctx.lineTo(108, 52); ctx.lineTo(488, 52);
      ctx.stroke();
      ctx.restore();

      // 5. Update & Render Premium Stylized Goalkeeper & Realistic Turf Shadow
      const keeper = keeperPos.current;
      keeper.animFrame += 0.08;
      if (gameState.current === 'idle') {
        keeper.targetX = 300 + Math.sin(keeper.animFrame * 0.6) * 32;
        keeper.targetY = 140 + Math.sin(keeper.animFrame * 1.2) * 3;
      }
      
      keeper.x += (keeper.targetX - keeper.x) * 0.18;
      keeper.y += (keeper.targetY - keeper.y) * 0.18;

      ctx.save();
      // Realistic body-shaped turf shadow under goalkeeper
      ctx.fillStyle = 'rgba(0,0,0,0.38)';
      ctx.beginPath();
      ctx.ellipse(keeper.x, 234, 32, 9, 0, 0, Math.PI * 2);
      ctx.fill();
      if (keeper.actionState === 'diving' || keeper.actionState === 'celebrating') {
        const stretchX = keeper.targetX - 300;
        ctx.beginPath();
        ctx.ellipse(keeper.x + stretchX * 0.35, 235, Math.abs(stretchX) * 0.45 + 16, 7, stretchX * 0.005, 0, Math.PI * 2);
        ctx.fill();
      }

      // Goalkeeper Football Boots (with laces and cleats)
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(keeper.x - 16, 222, 11, 10, 3);
      ctx.roundRect(keeper.x + 5, 222, 11, 10, 3);
      ctx.fill();
      ctx.fillStyle = '#ffffff'; // Boot side stripe
      ctx.fillRect(keeper.x - 14, 225, 7, 2);
      ctx.fillRect(keeper.x + 7, 225, 7, 2);
      
      // Professional Football Socks (Up to knee with top stripes)
      ctx.fillStyle = '#f8fafc';
      ctx.fillRect(keeper.x - 14, 198, 9, 24);
      ctx.fillRect(keeper.x + 5, 198, 9, 24);
      ctx.fillStyle = theme.keeperJersey;
      ctx.fillRect(keeper.x - 14, 198, 9, 4);
      ctx.fillRect(keeper.x + 5, 198, 9, 4);

      // Realistic Muscular Legs
      ctx.fillStyle = '#fbd38d';
      ctx.fillRect(keeper.x - 13, 184, 8, 14);
      ctx.fillRect(keeper.x + 5, 184, 8, 14);

      // Professional Football Shorts (Distinct legs, connected waist, NOT skirt-like)
      ctx.fillStyle = theme.keeperShorts;
      ctx.beginPath();
      ctx.roundRect(keeper.x - 18, 160, 16, 26, 4); // Left thigh short
      ctx.roundRect(keeper.x + 2, 160, 16, 26, 4);  // Right thigh short
      ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.15)'; // Waistband
      ctx.fillRect(keeper.x - 18, 160, 36, 5);

      // Connected Waist, Full Torso & Realistic Chest (No gap!)
      ctx.fillStyle = theme.keeperJersey;
      ctx.strokeStyle = 'rgba(255,255,255,0.35)';
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.roundRect(keeper.x - 20, keeper.y - 8, 40, 60, 8);
      ctx.fill();
      ctx.stroke();

      // Chest Pectoral & Rib Shading
      ctx.fillStyle = 'rgba(0,0,0,0.12)';
      ctx.fillRect(keeper.x - 18, keeper.y + 16, 36, 4);
      
      // Jersey number "1" and club crest on chest
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 20px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('1', keeper.x, keeper.y + 34);
      ctx.fillStyle = '#fbbf24'; // Golden club crest
      ctx.beginPath();
      ctx.arc(keeper.x - 10, keeper.y + 6, 4, 0, Math.PI * 2);
      ctx.fill();

      // Visible Neck connecting torso collar to head
      ctx.fillStyle = '#fbd38d';
      ctx.fillRect(keeper.x - 6, keeper.y - 18, 12, 12);
      ctx.fillStyle = 'rgba(0,0,0,0.15)'; // Adam's apple shadow
      ctx.fillRect(keeper.x - 6, keeper.y - 8, 12, 3);

      // Realistic Proportioned Head & Expressive Face
      ctx.fillStyle = '#fbd38d';
      ctx.beginPath();
      ctx.ellipse(keeper.x, keeper.y - 28, 13, 16, 0, 0, Math.PI * 2);
      ctx.fill();

      // Eyes tracking toward ball or target
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(keeper.x - 7, keeper.y - 30, 4, 3);
      ctx.fillRect(keeper.x + 3, keeper.y - 30, 4, 3);
      ctx.fillStyle = '#1e293b'; // Focused dark pupils
      const lookDir = targetCursor.current ? (targetCursor.current.x - 300) * 0.01 : 0;
      ctx.fillRect(keeper.x - 6 + lookDir, keeper.y - 29, 2, 2);
      ctx.fillRect(keeper.x + 4 + lookDir, keeper.y - 29, 2, 2);
      
      // Eyebrows & Mouth
      ctx.strokeStyle = '#451a03';
      ctx.lineWidth = 1.8;
      ctx.beginPath();
      ctx.moveTo(keeper.x - 8, keeper.y - 33); ctx.lineTo(keeper.x - 3, keeper.y - 32);
      ctx.moveTo(keeper.x + 3, keeper.y - 32); ctx.lineTo(keeper.x + 8, keeper.y - 33);
      ctx.stroke();
      ctx.fillStyle = '#991b1b'; // Determined expression
      ctx.fillRect(keeper.x - 4, keeper.y - 20, 8, 2);

      // Realistic Modern Footballer Hairstyle (Textured taper fade)
      ctx.fillStyle = '#381804';
      ctx.beginPath();
      ctx.arc(keeper.x, keeper.y - 33, 13.5, Math.PI * 0.85, Math.PI * 2.15);
      ctx.fill();
      ctx.fillStyle = '#78350f'; // Hair texture highlights
      ctx.beginPath();
      ctx.arc(keeper.x - 2, keeper.y - 38, 7, 0, Math.PI * 2);
      ctx.fill();

      // Articulated Arms & Professional Padded Goalkeeper Gloves
      ctx.strokeStyle = theme.keeperJersey;
      ctx.lineWidth = 10;
      ctx.lineCap = 'round';
      
      const gloveOffsetX = keeper.diveState !== 'center' ? 42 : 24;
      const gloveOffsetY = keeper.diveState === 'top_left' || keeper.diveState === 'top_right' ? -24 : 12;

      // Left Arm
      ctx.beginPath();
      ctx.moveTo(keeper.x - 18, keeper.y - 4);
      ctx.lineTo(keeper.x - gloveOffsetX, keeper.y + gloveOffsetY);
      ctx.stroke();

      // Right Arm
      ctx.beginPath();
      ctx.moveTo(keeper.x + 18, keeper.y - 4);
      ctx.lineTo(keeper.x + gloveOffsetX, keeper.y + gloveOffsetY);
      ctx.stroke();

      // Professional Padded Goalkeeper Gloves (with wrist straps and knuckle armor)
      ctx.fillStyle = theme.keeperGloves;
      ctx.strokeStyle = '#0f172a';
      ctx.lineWidth = 2;
      
      // Left glove
      ctx.beginPath();
      ctx.arc(keeper.x - gloveOffsetX, keeper.y + gloveOffsetY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444'; // Glove knuckle armor accent
      ctx.fillRect(keeper.x - gloveOffsetX - 4, keeper.y + gloveOffsetY - 4, 8, 4);

      // Right glove
      ctx.fillStyle = theme.keeperGloves;
      ctx.beginPath();
      ctx.arc(keeper.x + gloveOffsetX, keeper.y + gloveOffsetY, 10, 0, Math.PI * 2);
      ctx.fill();
      ctx.stroke();
      ctx.fillStyle = '#ef4444';
      ctx.fillRect(keeper.x + gloveOffsetX - 4, keeper.y + gloveOffsetY - 4, 8, 4);
      ctx.restore();

      // 6. Tactical Targeting Reticles (idle state)
      if (gameState.current === 'idle') {
        let hoveredZone = -1;
        if (targetCursor.current) {
          let minDist = 9999;
          zones.forEach((z, idx) => {
            const dist = Math.sqrt(Math.pow(z.x - targetCursor.current!.x, 2) + Math.pow(z.y - targetCursor.current!.y, 2));
            if (dist < 55 && dist < minDist) {
              minDist = dist;
              hoveredZone = idx;
            }
          });
        }
        selectedZoneIdx.current = hoveredZone;

        zones.forEach((z, idx) => {
          const isSelected = idx === hoveredZone;
          ctx.save();
          ctx.strokeStyle = isSelected ? '#fbbf24' : 'rgba(255, 255, 255, 0.22)';
          ctx.fillStyle = isSelected ? 'rgba(251, 191, 36, 0.20)' : 'rgba(255,255,255,0.02)';
          ctx.lineWidth = isSelected ? 3.5 : 1.2;
          
          ctx.beginPath();
          ctx.arc(z.x, z.y, 25, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          if (isSelected) {
            ctx.strokeStyle = '#fbbf24';
            ctx.beginPath();
            ctx.moveTo(z.x - 32, z.y); ctx.lineTo(z.x + 32, z.y);
            ctx.moveTo(z.x, z.y - 32); ctx.lineTo(z.x, z.y + 32);
            ctx.stroke();

            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold 11px monospace';
            ctx.textAlign = 'center';
            ctx.fillText(`${z.mult}x WIN`, z.x, z.y - 33);
          }
          ctx.restore();
        });
      }

      // 7. Realistic Football Physics & Realistic Ball Shadow
      const ball = ballPos.current;
      if (gameState.current === 'kicking' || gameState.current === 'resolved') {
        ball.x += ball.vx;
        ball.y += ball.vy;
        ball.z += ball.vz;
        ball.spin += 0.15;

        const currentScale = Math.max(0.4, ball.z);
        const ballRadius = 18 * currentScale;

        ctx.save();
        // Realistic Turf Shadow separating from ball during flight
        ctx.fillStyle = 'rgba(0,0,0,0.42)';
        ctx.beginPath();
        const shadowY = Math.min(370, 370 + (ball.y - 370) * 0.92);
        ctx.ellipse(ball.x, shadowY, ballRadius * 1.35, ballRadius * 0.58, 0, 0, Math.PI * 2);
        ctx.fill();

        // 3D Soccer ball sphere
        ctx.translate(ball.x, ball.y);
        ctx.rotate(ball.spin);

        const isGold = theme.ballType === 'gold' || theme.ballType === 'diamond';
        const isNeon = theme.ballType === 'neon' || theme.ballType === 'hivis';
        
        ctx.fillStyle = isGold ? '#fef08a' : (isNeon ? '#a855f7' : '#ffffff');
        ctx.strokeStyle = isGold ? '#b45309' : (isNeon ? '#38bdf8' : '#0f172a');
        ctx.lineWidth = 2 * currentScale;
        ctx.beginPath();
        ctx.arc(0, 0, ballRadius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isGold ? '#d97706' : (isNeon ? '#22d3ee' : '#1e293b');
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
          ctx.beginPath();
          ctx.moveTo(0, 0);
          ctx.lineTo(Math.cos(a) * ballRadius, Math.sin(a) * ballRadius);
          ctx.lineTo(Math.cos(a + 0.3) * (ballRadius * 0.65), Math.sin(a + 0.3) * (ballRadius * 0.65));
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      } else {
        // Ball resting on penalty spot (y = 370, farther away from goal)
        ctx.save();
        const isGold = theme.ballType === 'gold' || theme.ballType === 'diamond';
        const isNeon = theme.ballType === 'neon' || theme.ballType === 'hivis';
        
        ctx.fillStyle = 'rgba(0,0,0,0.45)';
        ctx.beginPath();
        ctx.ellipse(300, 384, 22, 8, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = isGold ? '#fef08a' : (isNeon ? '#a855f7' : '#ffffff');
        ctx.strokeStyle = isGold ? '#b45309' : (isNeon ? '#38bdf8' : '#0f172a');
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(300, 370, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        ctx.fillStyle = isGold ? '#d97706' : (isNeon ? '#22d3ee' : '#1e293b');
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 2.5) {
          ctx.beginPath();
          ctx.moveTo(300, 370);
          ctx.lineTo(300 + Math.cos(a) * 18, 370 + Math.sin(a) * 18);
          ctx.lineTo(300 + Math.cos(a + 0.3) * 10, 370 + Math.sin(a + 0.3) * 10);
          ctx.closePath();
          ctx.fill();
          ctx.stroke();
        }
        ctx.restore();
      }

      // 8. Atmosphere Particles
      if (theme.atmosphere !== 'none') {
        atmosphereParticles.current.forEach((p) => {
          p.x += p.vx;
          p.y += p.vy;
          if (p.y > 420) p.y = 0;
          if (p.x > 600) p.x = 0;
          if (p.x < 0) p.x = 600;

          ctx.save();
          ctx.globalAlpha = p.alpha;
          if (theme.atmosphere === 'snow') {
            ctx.fillStyle = '#e0f2fe';
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            ctx.fill();
          } else if (theme.atmosphere === 'confetti' || theme.atmosphere === 'gold_dust') {
            ctx.fillStyle = theme.atmosphere === 'gold_dust' ? '#fbbf24' : (p.x % 2 === 0 ? '#ef4444' : '#3b82f6');
            ctx.fillRect(p.x, p.y, p.size * 1.6, p.size * 0.9);
          } else if (theme.atmosphere === 'lasers') {
            ctx.strokeStyle = 'rgba(56, 189, 248, 0.45)';
            ctx.lineWidth = 1.8;
            ctx.beginPath();
            ctx.moveTo(p.x, 0);
            ctx.lineTo(p.x + 25, 420);
            ctx.stroke();
          }
          ctx.restore();
        });
      }

      ctx.restore();

      requestRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [activeThemeId]);

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    targetCursor.current = { x, y };
  };

  const handleMouseLeave = () => {
    targetCursor.current = null;
  };

  const handleCanvasClick = () => {
    if (gameState.current !== 'idle') return;
    if (selectedZoneIdx.current !== -1) {
      handleShootZone(selectedZoneIdx.current);
    }
  };

  const activeTheme = STADIUM_THEMES[activeThemeId] || STADIUM_THEMES.classic;

  return (
    <div className="bg-gradient-to-b from-zinc-900 via-zinc-900/95 to-black p-6 rounded-3xl border border-amber-500/30 max-w-3xl mx-auto space-y-6 text-center shadow-[0_0_50px_rgba(245,158,11,0.2)] relative overflow-hidden backdrop-blur-2xl font-sans" id="chance_goal_shootout">
      
      {/* Unlock Success Splash Banner */}
      {purchaseSuccessMsg && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black px-8 py-3.5 rounded-2xl font-black text-sm shadow-2xl border-2 border-white flex items-center gap-3 animate-bounce">
          <Sparkles className="w-5 h-5 fill-black animate-spin" />
          <span>{purchaseSuccessMsg}</span>
        </div>
      )}

      {/* Header Bar with Themes Button (Clean - No floating Speaker or AAA PRO badges!) */}
      <div className="flex justify-between items-center border-b border-white/10 pb-5">
        <div className="text-left flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-500 via-yellow-500 to-amber-700 flex items-center justify-center text-3xl shadow-[0_0_25px_rgba(245,158,11,0.3)] border border-amber-400/40">
            ⚽
          </div>
          <div>
            <h3 className="text-xl md:text-2xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-500 uppercase flex items-center gap-2">
              GOAL CHALLENGE
            </h3>
            <p className="text-xs text-zinc-400 font-semibold flex items-center gap-2 mt-0.5">
              <span>🏟️ Active Stadium:</span>
              <span className="text-amber-400 font-bold px-2 py-0.5 rounded-md bg-amber-500/10 border border-amber-500/20">{activeTheme.name}</span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {streak > 0 && (
            <div className="px-4 py-2 rounded-2xl bg-gradient-to-r from-amber-500/20 to-red-500/20 border border-amber-500/50 flex items-center gap-2 text-xs font-black text-amber-400 uppercase animate-pulse shadow-lg">
              <Flame className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>Streak: {streak}</span>
            </div>
          )}

          <button
            onClick={() => {
              synth.playClick();
              setShowThemeModal(true);
            }}
            className="px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm uppercase tracking-wider flex items-center gap-2 shadow-[0_0_20px_rgba(245,158,11,0.3)] transition-all hover:scale-105 active:scale-95 border border-yellow-300"
          >
            <Palette className="w-4 h-4 fill-black" />
            <span>Themes</span>
          </button>
        </div>
      </div>

      {/* Goal Post Interactive 60 FPS AAA Canvas */}
      <div className="relative border-2 border-amber-500/40 bg-zinc-950 rounded-3xl overflow-hidden shadow-2xl flex justify-center py-2 group backdrop-blur-xl">
        <canvas 
          ref={canvasRef} 
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onClick={handleCanvasClick}
          className="block cursor-crosshair w-full max-w-2xl rounded-2xl transition-transform duration-300 group-hover:scale-[1.01]"
        />

        {shootResult && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md z-20 animate-fade-in pointer-events-none">
            <div className={`p-8 rounded-3xl border-2 ${
              shootResult === 'goal' 
                ? 'bg-gradient-to-b from-emerald-950/95 via-black to-black border-emerald-500 text-emerald-400 shadow-[0_0_50px_rgba(16,185,129,0.4)]' 
                : 'bg-gradient-to-b from-red-950/95 via-black to-black border-red-500 text-red-500 shadow-[0_0_50px_rgba(239,68,68,0.4)]'
            } text-center space-y-3 shadow-2xl max-w-sm transform scale-105 transition-all`}>
              <div className="w-20 h-20 rounded-3xl mx-auto flex items-center justify-center bg-white/10 border-2 border-white/20 text-4xl shadow-inner animate-bounce">
                {shootResult === 'goal' ? '⚽' : '🧤'}
              </div>
              <h2 className="text-3xl font-black uppercase tracking-widest text-white drop-shadow-md">
                {shootResult === 'goal' ? '🚀 SPECTACULAR GOAL!' : '🧤 INCREDIBLE SAVE!'}
              </h2>
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider px-4 leading-relaxed">
                {shootResult === 'goal' ? 'Absolute world-class strike top mesh! The keeper had no chance!' : 'The goalkeeper anticipated your trajectory and pulled off a stunning save!'}
              </p>
            </div>
          </div>
        )}

        <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/15 text-[11px] font-bold text-zinc-300 flex items-center gap-2 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
          <span>60 FPS PRO STADIUM ENGINE</span>
        </div>
      </div>

      {/* Coins to Play Betting Panel (Requirement 7) */}
      <div className="space-y-5 bg-zinc-900/80 backdrop-blur-xl p-6 rounded-3xl border border-white/10 shadow-xl">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
            <h4 className="text-sm font-black text-white uppercase tracking-wider">COINS TO PLAY</h4>
          </div>
          <span className="text-xs font-extrabold text-amber-400">Minimum Play: 🪙 10 Coins</span>
        </div>

        {/* Quick Select Buttons (🪙10, 🪙20, 🪙30, 🪙40, 🪙50) */}
        <div className="grid grid-cols-5 gap-3">
          {[10, 20, 30, 40, 50].map((amount) => {
            const isSelected = bet === amount;
            return (
              <button
                key={amount}
                disabled={playing}
                onClick={() => {
                  synth.playClick();
                  setBet(amount);
                }}
                className={`py-3.5 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center space-x-1.5 transition-all shadow-lg ${
                  isSelected
                    ? 'bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-black scale-105 shadow-[0_0_20px_rgba(245,158,11,0.4)] border-2 border-white'
                    : 'bg-zinc-800/90 hover:bg-zinc-700 text-zinc-300 hover:text-white border border-white/10 hover:border-amber-500/40'
                }`}
              >
                <span>🪙</span>
                <span>{amount}</span>
              </button>
            );
          })}
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-3 border-t border-white/10 text-xs font-bold text-zinc-400">
          <div className="flex items-center space-x-2">
            <span>Custom Amount:</span>
            <input
              type="number"
              disabled={playing}
              value={bet}
              onChange={(e) => setBet(Math.max(10, parseInt(e.target.value) || 10))}
              className="w-24 text-center rounded-xl border-2 border-zinc-700 bg-black py-1.5 font-black text-amber-400 focus:border-amber-500 outline-none font-mono shadow-inner"
            />
            <span>Coins</span>
          </div>
          <div className="flex items-center space-x-2 text-emerald-400 font-black">
            <Trophy className="w-4 h-4 fill-emerald-400" />
            <span>Top Corner Payout: Up to 3.2X WIN</span>
          </div>
        </div>
      </div>

      {/* STADIUM THEMES COLLECTION MODAL */}
      {showThemeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8 bg-black/90 backdrop-blur-2xl animate-fade-in overflow-y-auto">
          <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/40 rounded-3xl max-w-4xl w-full p-6 md:p-8 space-y-8 shadow-[0_0_50px_rgba(245,158,11,0.3)] max-h-[92vh] overflow-y-auto text-left relative">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5 sticky top-0 bg-black/80 backdrop-blur-xl z-20 py-3 px-2 rounded-2xl">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-500/30 to-amber-600/10 border-2 border-amber-500/50 flex items-center justify-center text-2xl shadow-[0_0_20px_rgba(245,158,11,0.3)]">
                  🎨
                </div>
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight uppercase flex items-center space-x-2">
                    <span>STADIUM THEMES COLLECTION</span>
                  </h2>
                  <p className="text-xs text-zinc-400 font-medium">
                    Unlock and equip premier football stadiums with custom turf, lighting, and crowd atmosphere.
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="bg-zinc-900 border border-yellow-500/40 px-4 py-2 rounded-2xl flex items-center space-x-2 shadow-lg">
                  <Coins className="w-5 h-5 fill-yellow-400 text-yellow-400 animate-pulse" />
                  <span className="font-black text-yellow-400 text-base">🪙 {coins.toLocaleString()}</span>
                </div>
                <button
                  onClick={() => {
                    synth.playClick();
                    setShowThemeModal(false);
                  }}
                  className="w-12 h-12 rounded-2xl bg-zinc-800 hover:bg-zinc-700 border border-white/10 flex items-center justify-center text-white font-bold transition-all hover:scale-105 active:scale-95"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Themes Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pb-6">
              {Object.values(STADIUM_THEMES).map((theme) => {
                const isUnlocked = unlockedThemes.includes(theme.id);
                const isEquipped = activeThemeId === theme.id;

                return (
                  <div 
                    key={theme.id}
                    className={`p-6 rounded-3xl border transition-all relative flex flex-col justify-between overflow-hidden group backdrop-blur-xl ${
                      isEquipped 
                        ? 'bg-gradient-to-b from-amber-500/20 via-zinc-900 to-zinc-950 border-amber-500 shadow-[0_0_35px_rgba(245,158,11,0.3)] scale-[1.02]' 
                        : isUnlocked 
                        ? 'bg-zinc-900/80 border-white/15 hover:border-amber-500/40 hover:bg-zinc-900' 
                        : 'bg-zinc-950/90 border-white/5 opacity-85 hover:opacity-100 hover:border-white/20'
                    }`}
                  >
                    <div>
                      {/* Realistic Preview Header */}
                      <div 
                        style={{ background: `linear-gradient(135deg, ${theme.stadiumSky[0]}, ${theme.stadiumSky[1]})` }}
                        className="w-full h-24 rounded-2xl border border-white/10 mb-4 flex flex-col justify-end p-3 relative overflow-hidden shadow-inner group-hover:scale-105 transition-transform duration-300"
                      >
                        <div className="absolute top-2 right-2 text-2xl">{theme.icon}</div>
                        <div className="w-full h-4 rounded-md opacity-80" style={{ background: `linear-gradient(90deg, ${theme.pitchColors[0]}, ${theme.pitchColors[1]})` }} />
                        <span className="text-[10px] font-black text-white/90 drop-shadow uppercase tracking-widest mt-1">
                          {theme.atmosphere !== 'none' ? `Atmosphere: ${theme.atmosphere}` : '60 FPS Clear Night'}
                        </span>
                      </div>

                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-black text-white text-lg tracking-tight group-hover:text-amber-300 transition-colors">
                          {theme.name}
                        </h4>
                        {isEquipped && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-500 text-black font-black text-[10px] uppercase tracking-widest flex items-center gap-1 shadow-md">
                            <Check className="w-3.5 h-3.5 stroke-[3]" /> Equipped
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-zinc-400 leading-relaxed mb-4 line-clamp-3">
                        {theme.description}
                      </p>
                    </div>

                    {/* Action Button */}
                    <div className="pt-4 border-t border-white/10">
                      {isEquipped ? (
                        <button disabled className="w-full py-3.5 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs tracking-wider uppercase cursor-default">
                          Equipped Stadium
                        </button>
                      ) : isUnlocked ? (
                        <button
                          onClick={() => {
                            synth.playClick();
                            setActiveThemeId(theme.id);
                            saveUnlockedThemes(unlockedThemes, theme.id);
                            setShowThemeModal(false);
                          }}
                          className="w-full py-3.5 rounded-2xl bg-white hover:bg-amber-400 text-black font-black text-xs tracking-wider uppercase transition-all shadow-lg active:scale-95"
                        >
                          Equip Stadium
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            synth.playClick();
                            setConfirmPurchaseTheme(theme);
                          }}
                          className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-xs tracking-wider uppercase transition-all shadow-xl active:scale-95 flex items-center justify-center space-x-2"
                        >
                          <ShoppingBag className="w-4 h-4 fill-black" />
                          <span>Unlock (🪙 {theme.price})</span>
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Premium Confirmation Dialog */}
            {confirmPurchaseTheme && (
              <div className="fixed inset-0 z-[60] bg-black/85 backdrop-blur-2xl flex items-center justify-center p-4 animate-scale-up">
                <div className="bg-gradient-to-b from-zinc-900 via-zinc-900 to-zinc-950 border-2 border-amber-500/60 rounded-3xl max-w-md w-full p-8 shadow-[0_0_50px_rgba(245,158,11,0.4)] relative text-center">
                  
                  <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-amber-500/30 via-zinc-800 to-zinc-950 border-2 border-amber-500/60 flex items-center justify-center text-5xl shadow-2xl mb-6 animate-bounce">
                    {confirmPurchaseTheme.icon}
                  </div>

                  <span className="px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-300 font-black text-xs uppercase tracking-widest inline-block mb-2">
                    PREMIUM STADIUM UNLOCK
                  </span>
                  <h3 className="text-2xl font-black text-white tracking-tight">Purchase {confirmPurchaseTheme.name}?</h3>
                  <p className="text-xs text-zinc-300 mt-2 leading-relaxed px-4">{confirmPurchaseTheme.description}</p>

                  <div className="mt-6 bg-black/60 p-4 rounded-2xl border border-white/10 flex items-center justify-between px-6">
                    <span className="text-sm text-zinc-400 font-bold">Price:</span>
                    <div className="text-right">
                      <span className="text-xl font-black text-yellow-400 block">🪙 {confirmPurchaseTheme.price} Coins</span>
                      <span className="text-xs font-bold text-zinc-400">or $1.99</span>
                    </div>
                  </div>

                  <div className="mt-8 space-y-3">
                    <button
                      onClick={() => executePurchaseTheme(confirmPurchaseTheme)}
                      className="w-full py-4 rounded-2xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-black text-sm tracking-wider uppercase transition-all shadow-[0_0_25px_rgba(245,158,11,0.4)] active:scale-95 flex items-center justify-center space-x-2"
                    >
                      <ShoppingBag className="w-5 h-5 fill-black" />
                      <span>Purchase Stadium</span>
                    </button>

                    <button
                      onClick={() => {
                        synth.playClick();
                        setConfirmPurchaseTheme(null);
                      }}
                      className="w-full py-3 rounded-2xl bg-zinc-800/80 hover:bg-zinc-700 text-zinc-400 hover:text-white font-bold text-xs uppercase tracking-wider transition-all"
                    >
                      Cancel
                    </button>
                  </div>

                </div>
              </div>
            )}

          </div>
        </div>
      )}

    </div>
  );
}
