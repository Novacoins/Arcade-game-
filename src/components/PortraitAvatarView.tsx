/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { PORTRAIT_AVATARS, PortraitAvatar } from '../data/portraitAvatars';

interface Props {
  portraitId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  showBadge?: boolean;
}

// Background helper to render AAA animated backgrounds
function getBgStyles(bgType: PortraitAvatar['bgType']) {
  switch (bgType) {
    case 'cyber_blue':
      return {
        bgGradient: 'from-blue-600/50 via-indigo-950 to-slate-950',
        particles: 'bg-blue-400',
        glowColor: 'rgba(59, 130, 246, 0.5)',
      };
    case 'purple_galaxy':
      return {
        bgGradient: 'from-purple-600/50 via-fuchsia-950 to-zinc-950',
        particles: 'bg-fuchsia-400',
        glowColor: 'rgba(168, 85, 247, 0.5)',
      };
    case 'emerald_cave':
      return {
        bgGradient: 'from-emerald-600/50 via-teal-950 to-zinc-950',
        particles: 'bg-emerald-300',
        glowColor: 'rgba(16, 185, 129, 0.5)',
      };
    case 'golden_palace':
      return {
        bgGradient: 'from-amber-500/60 via-yellow-950 to-zinc-950',
        particles: 'bg-amber-300',
        glowColor: 'rgba(245, 158, 11, 0.5)',
      };
    case 'crimson_battlefield':
      return {
        bgGradient: 'from-red-600/60 via-rose-950 to-zinc-950',
        particles: 'bg-rose-400',
        glowColor: 'rgba(239, 68, 68, 0.5)',
      };
    case 'arctic_ice':
      return {
        bgGradient: 'from-sky-500/50 via-cyan-950 to-slate-950',
        particles: 'bg-sky-200',
        glowColor: 'rgba(56, 189, 248, 0.5)',
      };
    case 'mystic_forest':
      return {
        bgGradient: 'from-teal-600/50 via-emerald-950 to-zinc-950',
        particles: 'bg-teal-300',
        glowColor: 'rgba(20, 184, 166, 0.5)',
      };
    case 'neon_city':
      return {
        bgGradient: 'from-pink-600/50 via-purple-950 to-zinc-950',
        particles: 'bg-pink-400',
        glowColor: 'rgba(236, 72, 153, 0.5)',
      };
    case 'space_nebula':
      return {
        bgGradient: 'from-violet-600/50 via-indigo-950 to-slate-950',
        particles: 'bg-violet-300',
        glowColor: 'rgba(139, 92, 246, 0.5)',
      };
    case 'ancient_temple':
      return {
        bgGradient: 'from-purple-900/60 via-zinc-950 to-black',
        particles: 'bg-amber-400',
        glowColor: 'rgba(168, 85, 247, 0.4)',
      };
    case 'dark_volcano':
      return {
        bgGradient: 'from-orange-600/60 via-red-950 to-zinc-950',
        particles: 'bg-orange-400',
        glowColor: 'rgba(249, 115, 22, 0.5)',
      };
    case 'aurora_sky':
      return {
        bgGradient: 'from-emerald-500/50 via-cyan-950 to-zinc-950',
        particles: 'bg-teal-200',
        glowColor: 'rgba(52, 211, 153, 0.5)',
      };
    default:
      return {
        bgGradient: 'from-amber-600/50 via-zinc-950 to-black',
        particles: 'bg-amber-400',
        glowColor: 'rgba(245, 158, 11, 0.5)',
      };
  }
}

// Frame Border Helper
function getFrameStyles(frameType: PortraitAvatar['frameType']) {
  switch (frameType) {
    case 'blue_neon':
      return {
        borderClass: 'border-blue-400',
        shadow: '0 0 15px rgba(59, 130, 246, 0.6), inset 0 0 10px rgba(59, 130, 246, 0.3)',
        lightRay: '#60a5fa',
      };
    case 'purple_neon':
      return {
        borderClass: 'border-purple-400',
        shadow: '0 0 15px rgba(168, 85, 247, 0.6), inset 0 0 10px rgba(168, 85, 247, 0.3)',
        lightRay: '#c084fc',
      };
    case 'royal_gold':
      return {
        borderClass: 'border-amber-400',
        shadow: '0 0 18px rgba(245, 158, 11, 0.7), inset 0 0 12px rgba(245, 158, 11, 0.4)',
        lightRay: '#fbbf24',
      };
    case 'ruby_red':
      return {
        borderClass: 'border-rose-500',
        shadow: '0 0 15px rgba(244, 63, 94, 0.6), inset 0 0 10px rgba(244, 63, 94, 0.3)',
        lightRay: '#fda4af',
      };
    case 'emerald_green':
      return {
        borderClass: 'border-emerald-400',
        shadow: '0 0 15px rgba(16, 185, 129, 0.6), inset 0 0 10px rgba(16, 185, 129, 0.3)',
        lightRay: '#34d399',
      };
    case 'crystal_cyan':
      return {
        borderClass: 'border-cyan-400',
        shadow: '0 0 15px rgba(6, 182, 212, 0.6), inset 0 0 10px rgba(6, 182, 212, 0.3)',
        lightRay: '#22d3ee',
      };
    case 'orange_fire':
      return {
        borderClass: 'border-orange-500',
        shadow: '0 0 16px rgba(249, 115, 22, 0.7), inset 0 0 12px rgba(249, 115, 22, 0.4)',
        lightRay: '#fb923c',
      };
    case 'silver_chrome':
      return {
        borderClass: 'border-slate-300',
        shadow: '0 0 15px rgba(203, 213, 225, 0.6), inset 0 0 10px rgba(203, 213, 225, 0.3)',
        lightRay: '#f8fafc',
      };
    case 'electric_violet':
      return {
        borderClass: 'border-violet-500',
        shadow: '0 0 16px rgba(139, 92, 246, 0.7), inset 0 0 12px rgba(139, 92, 246, 0.4)',
        lightRay: '#a78bfa',
      };
    case 'rainbow_prism':
      return {
        borderClass: 'border-pink-400',
        shadow: '0 0 18px rgba(236, 72, 153, 0.7), inset 0 0 12px rgba(236, 72, 153, 0.4)',
        lightRay: '#f472b6',
      };
    default:
      return {
        borderClass: 'border-amber-400',
        shadow: '0 0 15px rgba(245, 158, 11, 0.6)',
        lightRay: '#fde047',
      };
  }
}

export default function PortraitAvatarView({ portraitId, size = 'md', className = '', showBadge = true }: Props) {
  const avatar = PORTRAIT_AVATARS.find(p => p.id === portraitId) || PORTRAIT_AVATARS[0];

  const dimensionMap = {
    sm: 'w-12 h-12 text-xs',
    md: 'w-16 h-16 text-sm',
    lg: 'w-24 h-24 text-base',
    xl: 'w-32 h-32 text-lg',
  };

  const selectedSizeClass = dimensionMap[size];
  const bgStyles = getBgStyles(avatar.bgType);
  const frameStyles = getFrameStyles(avatar.frameType);

  return (
    <div 
      className={`relative inline-block rounded-2xl overflow-hidden border-2 shadow-2xl transition-all duration-300 group ${selectedSizeClass} ${frameStyles.borderClass} ${className}`}
      style={{ boxShadow: frameStyles.shadow }}
    >
      {/* Dynamic Animated Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-b ${bgStyles.bgGradient}`} />

      {/* Floating Animated Glowing Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-2 left-3 w-1.5 h-1.5 rounded-full ${bgStyles.particles} animate-ping opacity-75`} />
        <div className={`absolute bottom-3 right-4 w-2 h-2 rounded-full ${bgStyles.particles} animate-pulse opacity-80`} />
        <div className={`absolute top-1/2 left-1 w-1 h-1 rounded-full ${bgStyles.particles} animate-bounce opacity-60`} />
        <div className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-white/10 blur-xl pointer-events-none" />
      </div>

      {/* Animated Light Sweep Overlay around frame */}
      <div className="absolute inset-0 pointer-events-none rounded-2xl border border-white/20 overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-[pulse_2s_infinite]" />
      </div>

      {/* Realistic Digital Game Character SVG */}
      <svg className="w-full h-full relative z-10 drop-shadow-xl" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          {/* Skin Shading Gradient */}
          <linearGradient id={`grad_skin_${avatar.id}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={avatar.skinTone} />
            <stop offset="100%" stopColor={avatar.skinShadow} />
          </linearGradient>

          {/* Hair Gradient */}
          <linearGradient id={`grad_hair_${avatar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={avatar.hairColor} />
            <stop offset="100%" stopColor={avatar.hairColorDark} />
          </linearGradient>

          {/* Armor Gradient */}
          <linearGradient id={`grad_armor_${avatar.id}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor={avatar.armorAccent} stopOpacity="0.95" />
            <stop offset="50%" stopColor={avatar.armorColor} stopOpacity="0.98" />
            <stop offset="100%" stopColor="#09090b" stopOpacity="1" />
          </linearGradient>

          {/* Soft Glow Filter */}
          <filter id={`glow_${avatar.id}`} x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Aura Ring Behind Head */}
        <circle cx="50" cy="44" r="32" stroke={avatar.themeColor} strokeWidth="1" strokeDasharray="4 2" opacity="0.5" />
        <circle cx="50" cy="44" r="26" stroke={avatar.themeColor} strokeWidth="1.5" opacity="0.7" filter={`url(#glow_${avatar.id})`} />

        {/* Armor Shoulders & Collar (Broad Male vs Sleek Female) */}
        {avatar.gender === 'male' ? (
          <>
            {/* Broad Chiseled Shoulders */}
            <path 
              d="M6 96 C6 68, 22 62, 50 62 C78 62, 94 68, 94 96 Z" 
              fill={`url(#grad_armor_${avatar.id})`} 
              stroke={avatar.armorAccent} 
              strokeWidth="1.5" 
            />
            {/* Shoulder Pauldrons */}
            <path d="M12 70 C16 65, 30 65, 36 74" stroke={avatar.themeColor} strokeWidth="2" strokeLinecap="round" />
            <path d="M88 70 C84 65, 70 65, 64 74" stroke={avatar.themeColor} strokeWidth="2" strokeLinecap="round" />
            {/* Chest Core */}
            <polygon points="50,68 56,76 50,84 44,76" fill={avatar.themeColor} filter={`url(#glow_${avatar.id})`} opacity="0.9" />
            <polygon points="50,71 53,76 50,81 47,76" fill="#ffffff" />
          </>
        ) : (
          <>
            {/* Elegant Slim Shoulders & Collarbone */}
            <path 
              d="M12 96 C12 70, 26 64, 50 64 C74 64, 88 70, 88 96 Z" 
              fill={`url(#grad_armor_${avatar.id})`} 
              stroke={avatar.armorAccent} 
              strokeWidth="1.5" 
            />
            {/* Sleek Armor Trim & Collar */}
            <path d="M34 68 C42 74, 58 74, 66 68" stroke={avatar.themeColor} strokeWidth="2" fill="none" />
            <circle cx="50" cy="74" r="3.5" fill={avatar.themeColor} filter={`url(#glow_${avatar.id})`} />
            <circle cx="50" cy="74" r="1.5" fill="#ffffff" />
          </>
        )}

        {/* Neck */}
        <path d="M43 52 L43 65 L57 65 L57 52 Z" fill={`url(#grad_skin_${avatar.id})`} />
        {/* Neck Shadow under chin */}
        <path d="M43 52 C47 56, 53 56, 57 52 Z" fill={avatar.skinShadow} opacity="0.6" />

        {/* Realistic Face Shape */}
        {avatar.gender === 'female' ? (
          /* Slimmer elegant female jawline & chin contour */
          <path 
            d="M36 32 C36 22, 42 18, 50 18 C58 18, 64 22, 64 32 C64 46, 56 56, 50 56 C44 56, 36 46, 36 32 Z" 
            fill={`url(#grad_skin_${avatar.id})`} 
            stroke={avatar.skinShadow} 
            strokeWidth="0.8" 
          />
        ) : (
          /* Chiseled masculine jawline contour */
          <path 
            d="M33 30 C33 20, 41 16, 50 16 C59 16, 67 20, 67 30 C67 46, 60 57, 50 57 C40 57, 33 46, 33 30 Z" 
            fill={`url(#grad_skin_${avatar.id})`} 
            stroke={avatar.skinShadow} 
            strokeWidth="0.8" 
          />
        )}

        {/* Ear Contours */}
        <path d="M32 34 C30 36, 30 40, 33 42" stroke={avatar.skinShadow} strokeWidth="1" fill="none" />
        <path d="M68 34 C70 36, 70 40, 67 42" stroke={avatar.skinShadow} strokeWidth="1" fill="none" />

        {/* Realistic Eyebrows with Arc & Texture */}
        <path d="M38 31 C42 29, 46 30, 48 32" stroke={avatar.hairColorDark} strokeWidth="2" strokeLinecap="round" fill="none" />
        <path d="M62 31 C58 29, 54 30, 52 32" stroke={avatar.hairColorDark} strokeWidth="2" strokeLinecap="round" fill="none" />

        {/* Realistic Expressive Eyes */}
        {/* Eye Sclera (White) */}
        <ellipse cx="43" cy="37" rx="4.5" ry="3" fill="#ffffff" />
        <ellipse cx="57" cy="37" rx="4.5" ry="3" fill="#ffffff" />

        {/* Glowing Iris & Pupil */}
        <circle cx="43" cy="37" r="2.5" fill={avatar.eyeColor} filter={`url(#glow_${avatar.id})`} />
        <circle cx="57" cy="37" r="2.5" fill={avatar.eyeColor} filter={`url(#glow_${avatar.id})`} />
        <circle cx="43" cy="37" r="1" fill="#09090b" />
        <circle cx="57" cy="37" r="1" fill="#09090b" />
        {/* Catchlight Reflection */}
        <circle cx="42" cy="36" r="0.8" fill="#ffffff" />
        <circle cx="56" cy="36" r="0.8" fill="#ffffff" />

        {/* Eyeliner & Lash Lines */}
        <path d="M38 36 C41 33, 46 33, 48 36" stroke="#18181b" strokeWidth="1.2" fill="none" />
        <path d="M62 36 C59 33, 54 33, 52 36" stroke="#18181b" strokeWidth="1.2" fill="none" />

        {/* Realistic Nose Bridge & Nostrils */}
        <path d="M50 33 L49 42 C48 44, 52 44, 51 42" stroke={avatar.skinShadow} strokeWidth="1" strokeLinecap="round" fill="none" />

        {/* Realistic Lips */}
        {/* Upper Lip Cupid's Bow */}
        <path d="M45 48 C48 46.5, 52 46.5, 55 48 C52 49.5, 48 49.5, 45 48 Z" fill={avatar.gender === 'female' ? '#e11d48' : avatar.skinShadow} opacity="0.85" />
        {/* Lower Lip */}
        <path d="M46 48.5 C48 51, 52 51, 54 48.5" stroke={avatar.skinShadow} strokeWidth="1" fill="none" />

        {/* Hairstyle Specifics */}
        {avatar.gender === 'female' ? (
          <>
            {/* Flowing Layered Long Hair with Highlights */}
            <path 
              d="M26 34 C24 14, 38 8, 50 8 C62 8, 76 14, 74 34 C76 52, 68 64, 68 64 M26 34 C26 52, 32 64, 32 64" 
              stroke={`url(#grad_hair_${avatar.id})`} 
              strokeWidth="5" 
              strokeLinecap="round" 
              fill="none" 
            />
            {/* Inner Hair Volume strands */}
            <path d="M30 22 C38 12, 62 12, 70 22" stroke={avatar.hairColor} strokeWidth="3" fill="none" />
            <path d="M34 14 L50 24 L66 14" stroke={avatar.hairColor} strokeWidth="2" strokeLinecap="round" fill="none" />
            {/* Headpiece / Tiara / Headband */}
            <path d="M35 20 L50 12 L65 20 L50 24 Z" fill={avatar.themeColor} opacity="0.9" />
            <circle cx="50" cy="18" r="2.5" fill="#ffffff" filter={`url(#glow_${avatar.id})`} />
          </>
        ) : (
          <>
            {/* Spiky / Tactical Male Hair with Specular Strands */}
            <path 
              d="M26 28 C26 14, 36 10, 50 10 C64 10, 74 14, 74 28 C68 18, 58 14, 50 16 C42 14, 32 18, 26 28 Z" 
              fill={`url(#grad_hair_${avatar.id})`} 
            />
            {/* Dynamic Spiky Layers */}
            <path d="M36 12 L44 4 L50 12 L58 2 L64 10" stroke={avatar.hairColor} strokeWidth="3" strokeLinecap="round" fill="none" />
            <path d="M40 16 L50 8 L60 16" stroke="#ffffff" strokeWidth="1.2" opacity="0.7" fill="none" />
          </>
        )}

        {/* Futuristic Cyber Face Markings / Tattoo Lines */}
        <path d="M37 42 L41 46 M63 42 L59 46" stroke={avatar.themeColor} strokeWidth="1.2" opacity="0.85" strokeLinecap="round" />
      </svg>

      {/* Badge Emoji Overlay */}
      {showBadge && (
        <div className="absolute bottom-1 right-1 z-20 bg-black/90 rounded-lg px-1.5 py-0.5 text-[10px] border border-amber-400/60 shadow-lg font-black flex items-center justify-center">
          {avatar.badge}
        </div>
      )}
    </div>
  );
}
