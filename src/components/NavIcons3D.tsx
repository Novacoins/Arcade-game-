/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface IconProps {
  active?: boolean;
  className?: string;
}

// 1. 3D Luxury Gold Home Emblem
export function Home3DIcon({ active = false, className = "w-6 h-6" }: IconProps) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        {/* Metallic Gold Gradients */}
        <linearGradient id={`${id}-goldRoof`} x1="24" y1="4" x2="24" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF7D6" />
          <stop offset="30%" stopColor="#FFD700" />
          <stop offset="70%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#8A6408" />
        </linearGradient>
        <linearGradient id={`${id}-goldWalls`} x1="10" y1="20" x2="38" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFEAA7" />
          <stop offset="50%" stopColor="#D4AF37" />
          <stop offset="100%" stopColor="#5B3E03" />
        </linearGradient>
        <radialGradient id={`${id}-coreGlow`} cx="24" cy="28" r="12" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF099" stopOpacity="1" />
          <stop offset="50%" stopColor="#FF9F43" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#FF6B6B" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-doorGlass`} x1="24" y1="24" x2="24" y2="42" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#301A03" />
          <stop offset="100%" stopColor="#0B0501" />
        </linearGradient>
        <filter id={`${id}-glow`} x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="1.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Shadow Base */}
      <ellipse cx="24" cy="44" rx="16" ry="3" fill="#000000" opacity="0.6" />

      {/* Main Wall Structure */}
      <path
        d="M11 20L24 9L37 20V40C37 41.6569 35.6569 43 34 43H14C12.3431 43 11 41.6569 11 40V20Z"
        fill={`url(#${id}-goldWalls)`}
        stroke="#FFEAA7"
        strokeWidth="0.8"
      />

      {/* Left Wall Shading for 3D depth */}
      <path
        d="M11 20L24 9V43H14C12.3431 43 11 41.6569 11 40V20Z"
        fill="#000000"
        opacity="0.18"
      />

      {/* 3D Overhanging Roof Cap */}
      <path
        d="M6 21.5L24 6.5L42 21.5L39 24.5L24 12L9 24.5L6 21.5Z"
        fill={`url(#${id}-goldRoof)`}
        filter={`url(#${id}-glow)`}
      />
      
      {/* Inner Glowing Arch Doorway */}
      <path
        d="M18 43V29C18 25.6863 20.6863 23 24 23C27.3137 23 30 25.6863 30 29V43H18Z"
        fill={`url(#${id}-doorGlass)`}
        stroke="#FFD700"
        strokeWidth="1.2"
      />

      {/* Door Interior Light Core */}
      <circle cx="24" cy="30" r="5" fill={`url(#${id}-coreGlow)`} />
      
      {/* Roof Crest Gem Accent */}
      <polygon points="24,3 27,8 24,11 21,8" fill="#FFF099" />
      <polygon points="24,3 27,8 24,11" fill="#FFFFFF" opacity="0.8" />
    </svg>
  );
}

// 2. 3D Crystal Categories Grid/Compass Icon
export function Categories3DIcon({ active = false, className = "w-6 h-6" }: IconProps) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-crystal1`} x1="8" y1="8" x2="22" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="50%" stopColor="#6366F1" />
          <stop offset="100%" stopColor="#1E1B4B" />
        </linearGradient>
        <linearGradient id={`${id}-crystal2`} x1="26" y1="8" x2="40" y2="22" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="50%" stopColor="#0284C7" />
          <stop offset="100%" stopColor="#0C4A6E" />
        </linearGradient>
        <linearGradient id={`${id}-crystal3`} x1="8" y1="26" x2="22" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#F43F5E" />
          <stop offset="50%" stopColor="#E11D48" />
          <stop offset="100%" stopColor="#4C0519" />
        </linearGradient>
        <linearGradient id={`${id}-crystal4`} x1="26" y1="26" x2="40" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="50%" stopColor="#F59E0B" />
          <stop offset="100%" stopColor="#78350F" />
        </linearGradient>
        <filter id={`${id}-shadow`} x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      {/* Top Left Faceted Prism Block */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="8" y="8" width="14" height="14" rx="4" fill={`url(#${id}-crystal1)`} stroke="#C084FC" strokeWidth="0.8" />
        <path d="M8 12L15 8L22 12" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
        <circle cx="15" cy="15" r="2" fill="#E9D5FF" />
      </g>

      {/* Top Right Faceted Prism Block */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="26" y="8" width="14" height="14" rx="4" fill={`url(#${id}-crystal2)`} stroke="#7DD3FC" strokeWidth="0.8" />
        <path d="M26 12L33 8L40 12" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
        <circle cx="33" cy="15" r="2" fill="#E0F2FE" />
      </g>

      {/* Bottom Left Faceted Prism Block */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="8" y="26" width="14" height="14" rx="4" fill={`url(#${id}-crystal3)`} stroke="#FDA4AF" strokeWidth="0.8" />
        <path d="M8 30L15 26L22 30" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
        <circle cx="15" cy="33" r="2" fill="#FFE4E6" />
      </g>

      {/* Bottom Right Faceted Prism Block */}
      <g filter={`url(#${id}-shadow)`}>
        <rect x="26" y="26" width="14" height="14" rx="4" fill={`url(#${id}-crystal4)`} stroke="#FDE68A" strokeWidth="0.8" />
        <path d="M26 30L33 26L40 30" stroke="#FFFFFF" strokeOpacity="0.6" strokeWidth="0.8" fill="none" />
        <circle cx="33" cy="33" r="2" fill="#FEF3C7" />
      </g>

      {/* Center 3D Crystal Core Nexus */}
      <circle cx="24" cy="24" r="5" fill="#18181B" stroke="#F59E0B" strokeWidth="1.2" />
      <circle cx="24" cy="24" r="2.5" fill="#FDE047" />
    </svg>
  );
}

// 3. 3D Glowing Energy Lightning Missions Badge
export function Missions3DIcon({ active = false, className = "w-6 h-6" }: IconProps) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-badgeFrame`} x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="40%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#7F4C00" />
        </linearGradient>
        <radialGradient id={`${id}-plasmaBg`} cx="24" cy="24" r="18" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FF7043" />
          <stop offset="60%" stopColor="#D84315" />
          <stop offset="100%" stopColor="#1A0300" />
        </radialGradient>
        <linearGradient id={`${id}-boltGrad`} x1="26" y1="8" x2="20" y2="40" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#FFF176" />
          <stop offset="70%" stopColor="#FFB74D" />
          <stop offset="100%" stopColor="#FF5722" />
        </linearGradient>
        <filter id={`${id}-boltGlow`} x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Metallic Badge Base Shield */}
      <polygon
        points="24,4 40,11 36,36 24,44 12,36 8,11"
        fill={`url(#${id}-plasmaBg)`}
        stroke={`url(#${id}-badgeFrame)`}
        strokeWidth="2"
      />

      {/* Inner Rim Bevel */}
      <polygon
        points="24,7 37,13 33,34 24,41 15,34 11,13"
        fill="none"
        stroke="#FFE082"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {/* 3D High Voltage Bolt */}
      <path
        d="M27 8L15 25H24L21 40L33 22H24L27 8Z"
        fill={`url(#${id}-boltGrad)`}
        filter={`url(#${id}-boltGlow)`}
        stroke="#FFFFFF"
        strokeWidth="0.5"
      />

      {/* Specular Highlight Spark */}
      <circle cx="25" cy="14" r="1.5" fill="#FFFFFF" />
    </svg>
  );
}

// 4. 3D Championship Trophy Rank Icon
export function Rank3DIcon({ active = false, className = "w-6 h-6" }: IconProps) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-trophyGold`} x1="12" y1="6" x2="36" y2="30" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFF9C4" />
          <stop offset="25%" stopColor="#FFD54F" />
          <stop offset="65%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#8D5B00" />
        </linearGradient>
        <linearGradient id={`${id}-basePedestal`} x1="14" y1="34" x2="34" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#37474F" />
          <stop offset="50%" stopColor="#212121" />
          <stop offset="100%" stopColor="#000000" />
        </linearGradient>
        <linearGradient id={`${id}-goldRim`} x1="14" y1="34" x2="34" y2="36" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FF8F00" />
        </linearGradient>
      </defs>

      {/* Pedestal Base */}
      <path d="M14 36H34V42C34 43.1046 33.1046 44 32 44H16C14.8954 44 14 43.1046 14 42V36Z" fill={`url(#${id}-basePedestal)`} stroke="#546E7A" strokeWidth="0.8" />
      <rect x="12" y="34" width="24" height="2.5" rx="1" fill={`url(#${id}-goldRim)`} />

      {/* Trophy Stem */}
      <path d="M22 28H26V34H22V28Z" fill={`url(#${id}-trophyGold)`} />
      <path d="M19 32H29V34H19V32Z" fill="#FFA000" />

      {/* Left Handle */}
      <path d="M13 11C8 11 8 20 15 22V19C11 18 11 13 14 13L13 11Z" fill={`url(#${id}-trophyGold)`} />

      {/* Right Handle */}
      <path d="M35 11C40 11 40 20 33 22V19C37 18 37 13 34 13L35 11Z" fill={`url(#${id}-trophyGold)`} />

      {/* Main Cup Body */}
      <path d="M13 6H35V18C35 23.5228 30.5228 28 25 28H23C17.4772 28 13 23.5228 13 18V6Z" fill={`url(#${id}-trophyGold)`} stroke="#FFF59D" strokeWidth="0.8" />

      {/* Cup Lip Top Rim */}
      <ellipse cx="24" cy="6" rx="11" ry="2.5" fill="#FFFDE7" stroke="#FFB300" strokeWidth="0.8" />

      {/* 3D Embossed Star Badge */}
      <polygon points="24,11 25.8,14.6 29.8,15.2 26.9,18 27.6,22 24,20.1 20.4,22 21.1,18 18.2,15.2 22.2,14.6" fill="#FFFFFF" />
    </svg>
  );
}

// 5. 3D Premium Engraved Profile Badge
export function Profile3DIcon({ active = false, className = "w-6 h-6" }: IconProps) {
  const id = React.useId();
  return (
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <defs>
        <linearGradient id={`${id}-coinOuter`} x1="24" y1="4" x2="24" y2="44" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFE082" />
          <stop offset="50%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#6D4C41" />
        </linearGradient>
        <radialGradient id={`${id}-coinInner`} cx="24" cy="24" r="16" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#3E2723" />
          <stop offset="70%" stopColor="#1A0C08" />
          <stop offset="100%" stopColor="#0A0402" />
        </radialGradient>
        <linearGradient id={`${id}-avatarGold`} x1="24" y1="12" x2="24" y2="38" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="40%" stopColor="#FFE082" />
          <stop offset="100%" stopColor="#FFA000" />
        </linearGradient>
      </defs>

      {/* Outer Golden Medallion Disc */}
      <circle cx="24" cy="24" r="20" fill={`url(#${id}-coinOuter)`} stroke="#FFF59D" strokeWidth="1" />
      <circle cx="24" cy="24" r="17.5" fill={`url(#${id}-coinInner)`} stroke="#FFD54F" strokeWidth="0.8" />

      {/* 3D User Portrait Head */}
      <circle cx="24" cy="18" r="6" fill={`url(#${id}-avatarGold)`} />

      {/* 3D User Shoulder Bust */}
      <path
        d="M13 36C13 30 18 27 24 27C30 27 35 30 35 36V37.5H13V36Z"
        fill={`url(#${id}-avatarGold)`}
      />

      {/* Top Crown Accent Emblem */}
      <polygon points="24,6 26,9 29,7 27.5,11 20.5,11 19,7 22,9" fill="#FFF59D" />
    </svg>
  );
}
