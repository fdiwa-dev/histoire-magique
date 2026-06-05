import React from 'react';
import { IllustrationStyle } from '../types';

interface StoryIllustrationProps {
  seed: string;
  themeId: string;
  sceneType: string;
  style: IllustrationStyle;
  className?: string;
  childName?: string;
}

export default function StoryIllustration({
  sceneType,
  style,
  themeId,
  className = '',
  childName = 'Léo',
}: StoryIllustrationProps) {
  
  // Define custom style attributes
  const getStyleFilters = () => {
    switch (style) {
      case 'Aquarelle':
        return (
          <defs>
            <filter id="aq-fuzz" x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="4" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="6" xChannelSelector="R" yChannelSelector="G" />
            </filter>
            <linearGradient id="aq-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#c084fc" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#60a5fa" stopOpacity="0.65" />
            </linearGradient>
          </defs>
        );
      case 'Crayon':
        return (
          <defs>
            <pattern id="pencil-hatch" width="10" height="10" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="rgba(168, 85, 247, 0.15)" strokeWidth="1" />
            </pattern>
            <filter id="crayon-sketch" x="-5%" y="-5%" width="110%" height="110%">
              <feTurbulence type="turbulence" baseFrequency="0.08" numOctaves="1" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="3" xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        );
      case 'BD':
        return (
          <defs>
            <pattern id="halftone" width="12" height="12" patternUnits="userSpaceOnUse">
              <circle cx="3" cy="3" r="1.5" fill="rgba(253, 224, 71, 0.25)" />
              <circle cx="9" cy="9" r="1.5" fill="rgba(147, 51, 234, 0.25)" />
            </pattern>
          </defs>
        );
      case 'Pixel Art':
        return (
          <defs>
            <pattern id="pixel-grid" width="16" height="16" patternUnits="userSpaceOnUse">
              <rect width="16" height="16" fill="none" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="0.5" />
            </pattern>
          </defs>
        );
      case 'Réaliste':
      default:
        return (
          <defs>
            <radialGradient id="sun-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fef08a" stopOpacity="1" />
              <stop offset="50%" stopColor="#eab308" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#eab308" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="gold-shimmer" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" />
              <stop offset="50%" stopColor="#fef08a" />
              <stop offset="100%" stopColor="#d97706" />
            </linearGradient>
            <filter id="real-shadow" x="-10%" y="-10%" width="130%" height="130%">
              <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.35" />
            </filter>
          </defs>
        );
    }
  };

  // Get style class for vector paths
  const getStyleProps = (primaryColor: string, accentColor: string = '') => {
    switch (style) {
      case 'Aquarelle':
        return {
          filter: 'url(#aq-fuzz)',
          stroke: 'none',
          fillOpacity: 0.75,
        };
      case 'BD':
        return {
          stroke: '#1e293b',
          strokeWidth: 3,
          strokeLinejoin: 'round' as const,
          fillOpacity: 1,
        };
      case 'Crayon':
        return {
          stroke: primaryColor,
          strokeWidth: 2,
          strokeDasharray: '3 2',
          filter: 'url(#crayon-sketch)',
          fillOpacity: 0.4,
        };
      case 'Pixel Art':
        return {
          stroke: '#0f172a',
          strokeWidth: 2.5,
          strokeLinejoin: 'miter' as const,
          fillOpacity: 0.9,
          shapeRendering: 'crispEdges' as const
        };
      case 'Réaliste':
      default:
        return {
          filter: 'url(#real-shadow)',
          stroke: 'none',
          fillOpacity: 1,
        };
    }
  };

  const styleProps = getStyleProps('#c084fc');

  // Renders vector components for specific scenes
  const renderSceneContent = () => {
    // ------------------------------------------------------------------------
    // SPACE THEME SCENES
    // ------------------------------------------------------------------------
    if (themeId === 'space') {
      switch (sceneType) {
        case 'space_intro':
        case 'space_cover':
          return (
            <g id="scene_space_intro">
              {/* Background Stars */}
              <circle cx="50" cy="50" r="1" fill="#fff" opacity="0.8" />
              <circle cx="150" cy="80" r="1.5" fill="#fff" opacity="0.9" />
              <circle cx="350" cy="120" r="0.8" fill="#fff" opacity="0.5" />
              <circle cx="280" cy="40" r="2" fill="#fff" opacity="0.9" />
              <circle cx="90" cy="300" r="1.2" fill="#fff" opacity="0.7" />
              <circle cx="320" cy="280" r="1" fill="#fff" opacity="0.8" />
              
              {/* Giant planet */}
              <circle cx="300" cy="250" r="60" fill="url(#sun-glow)" opacity="0.2" />
              <circle cx="300" cy="250" r="45" fill="#e11d48" {...styleProps} />
              <ellipse cx="300" cy="250" rx="75" ry="12" fill="none" stroke="#fb7185" strokeWidth="6" transform="rotate(-15 300 250)" opacity="0.8" />

              {/* Magical window */}
              {sceneType === 'space_intro' && (
                <rect x="50" y="180" width="80" height="110" rx="15" fill="#334155" stroke="#94a3b8" strokeWidth="3" opacity="0.6" />
              )}

              {/* Big Golden Rocket */}
              <g transform="translate(190, 110) rotate(-20)">
                {/* Thruster fire */}
                <path d="M-10,100 L0,130 L10,100 Z" fill="#f97316" />
                <path d="M-5,100 L0,118 L5,100 Z" fill="#facc15" />
                
                {/* Rocket Body */}
                <path d="M-15,10 L0,-40 L15,10 L15,100 L-15,100 Z" fill="#fbbf24" {...styleProps} />
                {/* Nose Cone */}
                <path d="M-15,10 L0,-40 L15,10 Z" fill="#f59e0b" />
                
                {/* Fins */}
                <path d="M-15,60 L-30,95 L-15,95 Z" fill="#d97706" />
                <path d="M15,60 L30,95 L15,95 Z" fill="#d97706" />
                
                {/* Round Window with child's face indicator */}
                <circle cx="0" cy="35" r="12" fill="#bae6fd" stroke="#d97706" strokeWidth="2.5" />
                <circle cx="0" cy="35" r="7" fill="#0284c7" />
                <circle cx="3" cy="30" r="2" fill="#fff" />
              </g>

              {/* Magical star trail */}
              <path d="M120,290 Q220,180 180,95" fill="none" stroke="#fef08a" strokeWidth="3" strokeDasharray="5,5" />
            </g>
          );

        case 'space_launch':
          return (
            <g id="scene_space_launch">
              {/* Stars & Launch Flame */}
              <circle cx="100" cy="40" r="1.5" fill="#fff" />
              <circle cx="300" cy="90" r="1" fill="#fff" />
              <circle cx="50" cy="250" r="2" fill="#fff" />
              
              {/* Exploding sparks */}
              <g transform="translate(200, 220)">
                <ellipse cx="0" cy="50" rx="90" ry="25" fill="#f97316" opacity="0.3" filter="blur(8px)" />
                <circle cx="0" cy="30" r="45" fill="#f97316" opacity="0.4" />
                <path d="M-40,20 L0,-80 L40,20 Z" fill="#f59e0b" opacity="0.8" />
                <path d="M-20,20 L0,-50 L20,20 Z" fill="#facc15" />
              </g>

              {/* Rocket speeding straight up */}
              <g transform="translate(200, 100)">
                <path d="M-12,20 L0,-30 L12,20 L12,80 L-12,80 Z" fill="#fbbf24" {...styleProps} />
                <path d="M-12,20 L0,-30 L12,20 Z" fill="#ef4444" />
                {/* Fins */}
                <path d="M-12,50 L-22,75 L-12,75 Z" fill="#ef4444" />
                <path d="M12,50 L22,75 L12,75 Z" fill="#ef4444" />
                <circle cx="0" cy="35" r="8" fill="#bae6fd" />
              </g>

              {/* Speed Lines */}
              <line x1="80" y1="20" x2="80" y2="120" stroke="#fff" strokeWidth="2" opacity="0.3" />
              <line x1="320" y1="50" x2="320" y2="170" stroke="#fff" strokeWidth="1.5" opacity="0.2" />
              <line x1="130" y1="180" x2="130" y2="300" stroke="#fff" strokeWidth="1" opacity="0.4" />
            </g>
          );

        case 'space_earth':
          return (
            <g id="scene_space_earth">
              {/* Stars background */}
              <circle cx="70" cy="80" r="1" fill="#fff" />
              <circle cx="340" cy="50" r="1.5" fill="#fff" />
              <circle cx="280" cy="280" r="0.8" fill="#fff" />

              {/* Beautiful space portal outline */}
              <circle cx="200" cy="170" r="140" fill="none" stroke="rgba(168, 85, 247, 0.2)" strokeWidth="4" />

              {/* The Blue Earth */}
              <g transform="translate(200, 170)">
                <circle cx="0" cy="0" r="80" fill="#0284c7" {...styleProps} />
                {/* Green continents styled organically */}
                <path d="M-50,-20 Q-30,-60 -10,-40 Q10,-20 -20,10 Q-40,30 -50,-20 Z" fill="#22c55e" opacity="0.85" />
                <path d="M20,-10 Q40,-40 60,-20 Q65,10 40,20 Q20,30 20,-10 Z" fill="#22c55e" opacity="0.85" />
                <path d="M-10,20 Q10,40 30,5 Q40,30 20,50 Q-10,40 -10,20 Z" fill="#15803d" opacity="0.9" />
                {/* Soft clouds */}
                <path d="M-60,-10 Q-40,-25 -20,-10 T20,-20 T60,-10" fill="none" stroke="rgba(255, 255, 255, 0.6)" strokeWidth="8" strokeLinecap="round" />
              </g>

              {/* Sun starburst in upper corner */}
              <g transform="translate(350, 60)">
                <circle cx="0" cy="0" r="25" fill="#fef08a" filter="blur(4px)" />
                <circle cx="0" cy="0" r="12" fill="#fff" />
              </g>
            </g>
          );

        case 'space_alien':
          return (
            <g id="scene_space_alien">
              {/* Pink sand planet ground */}
              <path d="M 0,270 Q 200,230 400,270 L 400,340 L 0,340 Z" fill="#f43f5e" opacity="0.8" {...styleProps} />

              {/* Distant stars */}
              <polygon points="50,40 54,48 62,50 54,52 50,60 46,52 38,50 46,48" fill="#fef08a" />
              <polygon points="320,80 323,86 329,87 323,88 320,94 317,88 311,87 317,86" fill="#fef08a" />

              {/* Piko - The Friendly Extraterrestrial */}
              <g transform="translate(200, 180)">
                {/* Cute tentacles/legs */}
                <path d="M-25,40 Q-35,70 -15,75" fill="none" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" />
                <path d="M25,40 Q35,70 15,75" fill="none" stroke="#a855f7" strokeWidth="10" strokeLinecap="round" />
                <path d="M0,45 Q0,75 10,78" fill="none" stroke="#a855f7" strokeWidth="8" strokeLinecap="round" />

                {/* Round alien body */}
                <circle cx="0" cy="10" r="40" fill="#a855f7" {...styleProps} />

                {/* Cute antennas */}
                <path d="M-20,-25 Q-30,-50 -15,-55" fill="none" stroke="#c084fc" strokeWidth="4" />
                <circle cx="-15" cy="-55" r="7" fill="#f3e8ff" />
                
                <path d="M20,-25 Q30,-50 15,-55" fill="none" stroke="#c084fc" strokeWidth="4" />
                <circle cx="15" cy="-55" r="7" fill="#f3e8ff" />

                {/* Eyes - three cute expressive spheres */}
                <circle cx="-18" cy="0" r="11" fill="#fff" />
                <circle cx="-18" cy="0" r="5" fill="#1e1b4b" />
                <circle cx="-16" cy="-2" r="2" fill="#fff" />

                <circle cx="18" cy="0" r="11" fill="#fff" />
                <circle cx="18" cy="0" r="5" fill="#1e1b4b" />
                <circle cx="20" cy="-2" r="2" fill="#fff" />

                <circle cx="0" cy="-15" r="13" fill="#fff" />
                <circle cx="0" cy="-15" r="6" fill="#1e1b4b" />
                <circle cx="2" cy="-17" r="2" fill="#fff" />

                {/* Big happy mouth */}
                <path d="M-15,18 Q0,32 15,18" fill="none" stroke="#1e1b4b" strokeWidth="3" strokeLinecap="round" />
                {/* Rosy cheeks */}
                <circle cx="-28" cy="18" r="5" fill="#f472b6" opacity="0.6" />
                <circle cx="28" cy="18" r="5" fill="#f472b6" opacity="0.6" />
              </g>

              {/* Floating glowing juggling circles */}
              <circle cx="120" cy="120" r="10" fill="#fef08a" opacity="0.9" />
              <circle cx="160" cy="80" r="12" fill="#a7f3d0" opacity="0.9" />
              <circle cx="240" cy="80" r="12" fill="#fbcfe8" opacity="0.9" />
              <circle cx="280" cy="120" r="10" fill="#fef08a" opacity="0.9" />
            </g>
          );

        case 'space_obstacle':
          return (
            <g id="scene_space_obstacle">
              {/* Star fields */}
              <circle cx="40" cy="40" r="1" fill="#fff" />
              <circle cx="360" cy="280" r="1.5" fill="#fff" />

              {/* Danger Warning ring element */}
              <circle cx="200" cy="170" r="130" fill="none" stroke="rgba(239, 68, 68, 0.15)" strokeWidth="3" strokeDasharray="10,10" />

              {/* Asteroids - textured golden spiky polygons */}
              <polygon points="120,100 150,90 170,110 160,140 130,150 100,130" fill="#d97706" {...styleProps} />
              <polygon points="260,180 300,165 315,190 295,220 270,210" fill="#b45309" {...styleProps} />
              <polygon points="150,230 185,210 205,240 180,265" fill="#78350f" {...styleProps} />

              {/* Sparkle energy lines on asteroids */}
              <line x1="110" y1="120" x2="160" y2="120" stroke="#fef08a" strokeWidth="2" opacity="0.7" />
              <line x1="270" y1="185" x2="305" y2="185" stroke="#fef08a" strokeWidth="2.5" opacity="0.7" />

              {/* Tiny worried rocket in background */}
              <g transform="translate(80, 220) rotate(-35)">
                <rect x="-8" y="-15" width="16" height="30" rx="8" fill="#fcd34d" />
                <polygon points="-8,10 -15,20 -8,20" fill="#ef4444" />
                <polygon points="8,10 15,20 8,20" fill="#ef4444" />
                <circle cx="0" cy="-2" r="4" fill="#67e8f9" />
              </g>
            </g>
          );

        case 'space_solution':
          return (
            <g id="scene_space_solution">
              {/* Distant meteors slipping by */}
              <path d="M50,40 L10,60" stroke="#fde047" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M340,80 L300,100" stroke="#fde047" strokeWidth="1" strokeLinecap="round" />

              {/* Stardust slides - Wave curves */}
              <path d="M 30,220 Q 150,80 250,180 T 370,120" fill="none" stroke="url(#aq-grad)" strokeWidth="24" strokeLinecap="round" opacity="0.9" />
              <path d="M 30,220 Q 150,80 250,180 T 370,120" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeDasharray="8,12" />

              {/* Jollity stars */}
              <polygon points="200,110 204,116 211,117 205,121 207,128 200,124 193,128 195,121 189,117 196,116" fill="#fde047" />
              <polygon points="270,160 273,164 278,165 274,168 275,173 270,170 265,173 266,168 262,165 267,164" fill="#a7f3d0" />

              {/* Rocket successfully surfing down the lane */}
              <g transform="translate(195, 125) rotate(45)">
                <path d="M-10,15 L0,-25 L10,15 L10,50 L-10,50 Z" fill="#fbbf24" {...styleProps} />
                <circle cx="0" cy="15" r="6" fill="#bae6fd" />
              </g>
            </g>
          );

        case 'space_nebula':
          return (
            <g id="scene_space_nebula">
              {/* Swirling color orbits */}
              <ellipse cx="200" cy="170" rx="160" ry="90" fill="none" stroke="#a855f7" strokeWidth="16" opacity="0.15" transform="rotate(-20 200 170)" />
              <ellipse cx="200" cy="170" rx="120" ry="60" fill="none" stroke="#ec4899" strokeWidth="12" opacity="0.2" transform="rotate(30 200 170)" />
              <ellipse cx="200" cy="170" rx="80" ry="40" fill="none" stroke="#eab308" strokeWidth="8" opacity="0.25" transform="rotate(10 200 170)" />

              {/* Big central bright star core */}
              <circle cx="200" cy="170" r="35" fill="white" filter="blur(8px)" opacity="0.7" />
              <circle cx="200" cy="170" r="15" fill="#fff" />
              <polygon points="200,100 204,160 270,170 204,180 200,240 196,180 130,170 196,160" fill="#fff" opacity="0.9" />

              {/* Constellations */}
              <polyline points="50,60 80,75 110,60 140,95" fill="none" stroke="#60a5fa" strokeWidth="1.5" opacity="0.6" />
              <circle cx="50" cy="60" r="3" fill="#fff" />
              <circle cx="80" cy="75" r="3" fill="#fff" />
              <circle cx="110" cy="60" r="3" fill="#fff" />
              <circle cx="140" cy="95" r="3" fill="#fff" />
            </g>
          );

        case 'space_moral':
          return (
            <g id="scene_space_moral">
              {/* Space heart background */}
              <circle cx="100" cy="80" r="1" fill="#fff" opacity="0.5" />
              <circle cx="300" cy="270" r="1.5" fill="#fff" opacity="0.6" />

              {/* Giant glowing Heart Star */}
              <g transform="translate(200, 160)">
                <circle cx="0" cy="10" r="90" fill="url(#sun-glow)" opacity="0.3" />
                <path d="M0,-40 C-30,-70 -80,-50 -80,0 C-80,45 0,90 0,90 C0,90 80,45 80,0 C80,-50 30,-70 0,-40 Z" fill="#ec4899" {...styleProps} />
                <path d="M0,-25 C-15,-45 -45,-30 -45,5 C-45,30 0,60 0,60 C0,60 45,30 45,5 C45,-30 15,-45 0,-25 Z" fill="#f472b6" opacity="0.9" />
              </g>

              {/* Cute mini rocket flying around the heart */}
              <g transform="translate(120, 110) rotate(-65)">
                <rect x="-6" y="-12" width="12" height="24" rx="6" fill="#fbbf24" />
                <polygon points="-6,6 -10,13 -6,13" fill="#ef4444" />
                <polygon points="6,6 10,13 6,13" fill="#ef4444" />
              </g>
            </g>
          );
      }
    }

    // ------------------------------------------------------------------------
    // PIRATE THEME SCENES
    // ------------------------------------------------------------------------
    if (themeId === 'pirate') {
      switch (sceneType) {
        case 'pirate_map':
          return (
            <g id="scene_pirate_map">
              {/* Parchment background */}
              <rect x="40" y="40" width="320" height="260" rx="20" fill="#fef3c7" stroke="#b45309" strokeWidth="4" {...styleProps} />
              
              {/* Sea waves drawings */}
              <path d="M70,120 Q85,110 100,120 T130,120" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.4" />
              <path d="M270,220 Q285,210 300,220 T330,220" fill="none" stroke="#1e3a8a" strokeWidth="1.5" opacity="0.4" />
              
              {/* Compass Rose */}
              <g transform="translate(100, 220)">
                <circle cx="0" cy="0" r="30" fill="none" stroke="#b45309" strokeWidth="2" />
                <polygon points="0,-35 6,-10 0,0" fill="#dc2626" />
                <polygon points="0,-35 -6,-10 0,0" fill="#991b1b" />
                <polygon points="0,35 6,10 0,0" fill="#475569" />
                <polygon points="0,35 -6,10 0,0" fill="#1e293b" />
                <polygon points="35,0 10,6 0,0" fill="#475569" />
                <polygon points="-35,0 -10,6 0,0" fill="#1e293b" />
                <circle cx="0" cy="0" r="6" fill="#b45309" />
              </g>

              {/* Dotted path leading to island */}
              <path d="M120,120 C180,80 200,180 260,110" fill="none" stroke="#dc2626" strokeWidth="3.5" strokeDasharray="6,8" strokeLinecap="round" />
              <text x="250" y="100" fill="#dc2626" fontSize="24" fontWeight="bold">X</text>

              {/* Palm tree icon on Island */}
              <g transform="translate(290, 110)">
                <path d="M0,0 Q10,-20 0,-40" fill="none" stroke="#78350f" strokeWidth="6" strokeLinecap="round" />
                <path d="M0,-40 Q15,-45 25,-35" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,-40 Q-15,-45 -25,-35" fill="none" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" />
                <path d="M0,-40 Q0,-55 -5,-65" fill="none" stroke="#15803d" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          );

        case 'pirate_ship':
          return (
            <g id="scene_pirate_ship">
              {/* Sea Waves underneath */}
              <path d="M-20,260 C80,230 150,290 240,260 C320,235 380,270 420,260 L420,340 L-20,340 Z" fill="#1d4ed8" opacity="0.8" />
              
              {/* Pirate Ship in vector style */}
              <g transform="translate(200, 150)">
                {/* Ship Hull */}
                <path d="M-80,40 L-110,0 C-110,0 -80,45 80,45 L110,0 L90,40 Z" fill="#78350f" {...styleProps} />
                <rect x="-80" y="30" width="160" height="8" fill="#a16207" />
                
                {/* Windows/Portholes */}
                <circle cx="-40" cy="22" r="6" fill="#eab308" />
                <circle cx="0" cy="22" r="6" fill="#eab308" />
                <circle cx="40" cy="22" r="6" fill="#eab308" />

                {/* Wooden Mast */}
                <rect x="-6" y="-120" width="12" height="135" rx="5" fill="#451a03" />

                {/* Big Magical Billowing Sails */}
                <path d="M-5,-100 Q45,-85 -5,-25 Q35,-40 -5,-15 L-5,-110 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" {...styleProps} />
                {/* Golden star badge in middle of sail */}
                <polygon points="25,-60 28,-54 34,-53 29,-49 31,-43 25,-46 19,-43 21,-49 16,-53 22,-54" fill="#fbbf24" />

                {/* Flying Flag on top */}
                <path d="M0,-120 L-25,-112 L0,-104 Z" fill="#dc2626" />
              </g>

              {/* Distant flying gulls */}
              <path d="M60,60 Q70,50 80,60 Q90,50 100,60" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
              <path d="M310,80 Q320,70 330,80 Q340,70 350,80" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          );

        case 'pirate_ocean':
          return (
            <g id="scene_pirate_ocean">
              {/* Sun setting on horizon */}
              <circle cx="200" cy="200" r="100" fill="url(#sun-glow)" opacity="0.3" />
              <circle cx="200" cy="200" r="45" fill="#f97316" opacity="0.75" />
              <line x1="50" y1="200" x2="350" y2="200" stroke="#f97316" strokeWidth="4" />

              {/* Water surface waves */}
              <path d="M-20,200 C60,190 140,210 220,195 C300,185 380,205 420,200 L420,340 L-20,340 Z" fill="#1e3a8a" />
              <path d="M-20,240 C100,225 180,250 260,230 C340,215 390,240 420,235 L420,340 L-20,340 Z" fill="#172554" opacity="0.9" />

              {/* Friendly Dolphin leaping */}
              <g transform="translate(180, 160) rotate(-15)">
                {/* Dolphin curved body */}
                <path d="M-40,20 Q0,-25 40,0 Q18,-5 -15,10 C-25,18 -35,22 -40,20 Z" fill="#38bdf8" {...styleProps} />
                {/* Tail fin */}
                <path d="M-40,20 L-55,10 L-48,25 Z" fill="#0284c7" />
                {/* Side fin */}
                <path d="M-5,4 L5,15 L-2,8 Z" fill="#0284c7" />
                <circle cx="25" cy="-3" r="2.5" fill="#fff" />
                <circle cx="25" cy="-3" r="1" fill="#000" />
              </g>

              {/* Small boat silhouette */}
              <g transform="scale(0.5) translate(460, 240)">
                <path d="M-20,20 L20,20 L30,0 L-30,0 Z" fill="#475569" />
                <line x1="0" y1="0" x2="0" y2="-40" stroke="#475569" strokeWidth="3" />
                <polygon points="0,-40 20,-20 0,-20" fill="#cbd5e1" />
              </g>
            </g>
          );

        case 'pirate_parrot':
          return (
            <g id="scene_pirate_parrot">
              {/* Shady tropical leaf backdrop */}
              <path d="M-20,-20 Q60,100 -20,180" fill="none" stroke="#16a34a" strokeWidth="40" strokeLinecap="round" opacity="0.3" />
              <path d="M420,-20 Q340,100 420,180" fill="none" stroke="#16a34a" strokeWidth="30" strokeLinecap="round" opacity="0.2" fillRule="evenodd" />

              {/* Branch */}
              <rect x="50" y="240" width="300" height="15" rx="7" fill="#78350f" {...styleProps} />

              {/* Capitaine Plume - Parrot */}
              <g transform="translate(200, 140)">
                {/* Tail */}
                <path d="M-10,40 L-25,120 L5,120 L15,40 Z" fill="#dc2626" />
                <path d="M-5,40 L-12,130 L0,135 L5,40 Z" fill="#ca8a04" />
                
                {/* Body oval */}
                <ellipse cx="0" cy="20" rx="30" ry="50" fill="#dc2626" {...styleProps} />
                {/* Yellow breast */}
                <ellipse cx="0" cy="25" rx="18" ry="35" fill="#eab308" />

                {/* Head */}
                <circle cx="0" cy="-40" r="28" fill="#dc2626" {...styleProps} />
                {/* White face panel */}
                <path d="M10,-55 C25,-45 25,-25 10,-20 C2,-22 5,-40 10,-55 Z" fill="#fff" />

                {/* Yellow sharp hook beak */}
                <path d="M12,-37 Q32,-35 25,-22 Q18,-30 12,-33 Z" fill="#eab309" stroke="#ca8a04" strokeWidth="1.5" />

                {/* Pirate Hat (Tricorne) */}
                <path d="M-40,-60 L40,-60 Q0,-88 -40,-60 Z" fill="#1e293b" />
                <circle cx="0" cy="-68" r="5" fill="#fde047" />

                {/* Monocle */}
                <circle cx="15" cy="-40" r="8" fill="none" stroke="#eab308" strokeWidth="2.5" />
                <line x1="5" y1="-42" x2="-2" y2="-45" stroke="#eab308" strokeWidth="1.5" />

                {/* Good eye */}
                <circle cx="-10" cy="-42" r="4.5" fill="#000" />
                <circle cx="-11" cy="-44" r="1.5" fill="#fff" />

                {/* Little feather crest */}
                <path d="M-5,-68 Q-15,-85 -22,-80" fill="none" stroke="#dc2626" strokeWidth="4" strokeLinecap="round" />
              </g>

              {/* Speech bubble for parrot */}
              <g transform="translate(260, 40)">
                <rect x="0" y="0" width="110" height="45" rx="10" fill="#fff" stroke="#475569" strokeWidth="2" />
                <polygon points="15,45 25,45 15,55" fill="#fff" stroke="#475569" strokeWidth="2" />
                <rect x="14" y="42" width="13" height="5" fill="#fff" />
                <text x="55" y="27" textAnchor="middle" fill="#0f172a" fontSize="13" fontWeight="bold">Ohé matelot !</text>
              </g>
            </g>
          );

        case 'pirate_waterfall':
          return (
            <g id="scene_pirate_waterfall">
              {/* Rock cavern frame */}
              <path d="M-10,0 L120,0 C120,150 50,230 -10,250 Z" fill="#334155" {...styleProps} />
              <path d="M410,0 L280,0 C280,150 350,230 410,250 Z" fill="#334155" {...styleProps} />

              {/* Falling vertical water stream lines */}
              <rect x="120" y="0" width="160" height="300" fill="#2563eb" opacity="0.6" />
              <line x1="140" y1="0" x2="140" y2="300" stroke="#bae6fd" strokeWidth="4" />
              <line x1="180" y1="0" x2="180" y2="300" stroke="#fff" strokeWidth="3" opacity="0.8" />
              <line x1="220" y1="0" x2="220" y2="300" stroke="#38bdf8" strokeWidth="5" />
              <line x1="250" y1="0" x2="250" y2="300" stroke="#fff" strokeWidth="2" opacity="0.7" />

              {/* Water splash bubbles at bottom */}
              <ellipse cx="200" cy="285" rx="90" ry="20" fill="#bae6fd" opacity="0.8" filter="blur(3px)" />
              <circle cx="150" cy="280" r="12" fill="#fff" opacity="0.9" />
              <circle cx="250" cy="282" r="10" fill="#fff" opacity="0.9" />
              <circle cx="210" cy="275" r="14" fill="#fff" opacity="0.9" />
            </g>
          );

        case 'pirate_cave_open':
          return (
            <g id="scene_pirate_cave_open">
              {/* Split water curtains */}
              <path d="M60,0 L0,0 L0,300 L95,300 C75,220 85,100 60,0 Z" fill="#38bdf8" {...styleProps} />
              <path d="M340,0 L400,0 L400,300 L305,300 C325,220 315,100 340,0 Z" fill="#38bdf8" {...styleProps} />

              {/* Deep cavern interior glowing core */}
              <circle cx="200" cy="150" r="70" fill="url(#sun-glow)" opacity="0.4" />

              {/* Golden key glowing in center of room */}
              <g transform="translate(200, 150) rotate(-45)">
                <circle cx="0" cy="0" r="15" fill="none" stroke="#facc15" strokeWidth="6" />
                <rect x="-15" y="-3" width="55" height="6" fill="#facc15" />
                <rect x="25" y="3" width="6" height="15" fill="#facc15" />
                <rect x="35" y="3" width="6" height="15" fill="#facc15" />
                <circle cx="0" cy="0" r="7" fill="#fef08a" />
              </g>

              {/* Shiny stars surrounding key */}
              <polygon points="120,80 123,84 128,85 124,88 125,93 120,90 115,93 116,88 112,85 117,84" fill="#fde047" />
              <polygon points="270,220 273,224 278,225 274,228 275,233 270,230 265,233 266,228 262,225 267,224" fill="#fde047" />
            </g>
          );

        case 'pirate_treasure':
          return (
            <g id="scene_pirate_treasure">
              {/* Cave floor */}
              <path d="M0,250 L400,250 L400,320 L0,320 Z" fill="#1e293b" />

              {/* Glowing chest aura */}
              <circle cx="200" cy="200" r="110" fill="url(#sun-glow)" opacity="0.25" />

              {/* Opened Wooden Chest */}
              <g transform="translate(200, 190)">
                {/* Lower container box */}
                <path d="M-60,10 L-50,60 L50,60 L60,10 Z" fill="#78350f" {...styleProps} />
                {/* Iron bindings */}
                <rect x="-55" y="10" width="10" height="50" fill="#475569" />
                <rect x="45" y="10" width="10" height="50" fill="#475569" />
                
                {/* Open Lid thrown back */}
                <path d="M-60,10 C-60,-20 -50,-40 -50,-40 L50,-40 C50,-40 60,-20 60,10 Z" fill="#451a03" stroke="#78350f" strokeWidth="2" />
                <path d="M-50,-40 Q0,-65 50,-40 Z" fill="#1e1b4b" opacity="0.3" />

                {/* The Flying Story Book soaring out */}
                <g transform="translate(0, -10) scale(1.1) rotate(-10)">
                  {/* Left Page */}
                  <path d="M0,15 C-15,-5 -35,5 -55,0 L-55,-35 C-35,-30 -15,-40 0,-20 Z" fill="#f8fafc" stroke="#6b21a8" strokeWidth="2.5" />
                  {/* Right Page */}
                  <path d="M0,15 C15,-5 35,5 55,0 L55,-35 C35,-30 15,-40 0,-20 Z" fill="#f8fafc" stroke="#6b21a8" strokeWidth="2.5" />
                  {/* Book Spine */}
                  <line x1="0" y1="-20" x2="0" y2="15" stroke="#6b21a8" strokeWidth="3" />
                  
                  {/* Tiny text lines indicator */}
                  <line x1="-40" y1="-15" x2="-15" y2="-10" stroke="#e2e8f0" strokeWidth="2" />
                  <line x1="-40" y1="-5" x2="-15" y2="0" stroke="#e2e8f0" strokeWidth="2" />
                  <line x1="15" y1="-10" x2="40" y2="-15" stroke="#e2e8f0" strokeWidth="2" />
                  <line x1="15" y1="0" x2="40" y2="-5" stroke="#e2e8f0" strokeWidth="2" />
                </g>

                {/* Magic pixie dust stars */}
                <circle cx="-35" cy="-35" r="3" fill="#fff" />
                <circle cx="45" cy="-25" r="4" fill="#fbbf24" />
                <circle cx="-15" cy="-55" r="2.5" fill="#fbcfe8" />
              </g>
            </g>
          );

        case 'pirate_moral':
          return (
            <g id="scene_pirate_moral">
              {/* Compass symbol fused with a heart */}
              <circle cx="200" cy="160" r="100" fill="none" stroke="rgba(168, 85, 247, 0.4)" strokeWidth="4" />
              <g transform="translate(200, 160)">
                <path d="M0,-50 C-20,-80 -60,-65 -60,-20 C-60,15 0,55 0,55 C0,55 60,15 60,-20 C60,-65 20,-80 0,-50 Z" fill="#ca8a04" {...styleProps} />
                <path d="M0,-35 C-12,-55 -40,-45 -40,-15 C-40,10 0,40 0,40 C0,40 40,10 40,-15 C40,-45 12,-55 0,-35 Z" fill="#fef08a" opacity="0.9" />
              </g>
              <circle cx="200" cy="140" r="9" fill="#ca8a04" />
            </g>
          );
      }
    }

    // ------------------------------------------------------------------------
    // DRAGON THEME SCENES
    // ------------------------------------------------------------------------
    if (themeId === 'dragon') {
      switch (sceneType) {
        case 'dragon_nest':
          return (
            <g id="scene_dragon_nest">
              {/* Mountains profile */}
              <polygon points="-20,300 120,120 260,300" fill="#334155" opacity="0.6" />
              <polygon points="140,300 280,100 420,300" fill="#1e293b" opacity="0.8" />

              {/* Nest made of twigs */}
              <g transform="translate(200, 230)">
                <ellipse cx="0" cy="30" rx="60" ry="15" fill="#78350f" {...styleProps} />
                <path d="M-55,25 L55,25 M-45,35 L45,35 L-50,15 M30,12 L-40,38" stroke="#451a03" strokeWidth="4" strokeLinecap="round" />

                {/* Big Shining Blue Dragon Egg */}
                <ellipse cx="0" cy="5" rx="30" ry="40" fill="#0284c7" {...styleProps} stroke="#bae6fd" strokeWidth="2" />
                {/* Shiny spots or egg patterns */}
                <path d="M-12,-15 Q0,-5 12,-15 M-15,10 Q0,20 15,10" fill="none" stroke="#bae6fd" strokeWidth="2.5" opacity="0.5" />
                <circle cx="10" cy="-10" r="4" fill="#fff" opacity="0.8" />
              </g>

              {/* Green grass sprigs */}
              <path d="M40,290 Q50,260 45,240 T55,210" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
              <path d="M350,290 Q340,260 345,245 T340,220" fill="none" stroke="#22c55e" strokeWidth="4" strokeLinecap="round" />
            </g>
          );

        case 'dragon_hatch':
          return (
            <g id="scene_dragon_hatch">
              {/* Broken egg shell fragments */}
              <g transform="translate(200, 250) scale(0.9)">
                <path d="M-60,0 L-40,35 L-10,12 L20,38 L50,0 M-50,5 L50,5 L40,40 L-40,40 Z" fill="#bae6fd" opacity="0.6" stroke="#0284c7" strokeWidth="2.5" />
              </g>

              {/* Barnabé - The Baby Dragon */}
              <g transform="translate(200, 160)">
                {/* Tail */}
                <path d="M25,50 Q60,65 55,30 T80,35" fill="none" stroke="#22c55e" strokeWidth="11" strokeLinecap="round" />

                {/* Small wings */}
                <path d="M-28,-10 Q-60,-35 -35,5 Z" fill="#15803d" stroke="#166534" strokeWidth="2" {...styleProps} />
                <path d="M28,-10 Q60,-35 35,5 Z" fill="#15803d" stroke="#166534" strokeWidth="2" {...styleProps} />

                {/* Body */}
                <ellipse cx="0" cy="20" rx="32" ry="40" fill="#22c55e" {...styleProps} />
                {/* Pale belly */}
                <ellipse cx="0" cy="22" rx="18" ry="28" fill="#bbf7d0" />

                {/* Head */}
                <circle cx="0" cy="-35" r="26" fill="#22c55e" {...styleProps} />
                {/* Snout */}
                <ellipse cx="0" cy="-28" rx="16" ry="12" fill="#22c55e" />
                
                {/* Funny little horns */}
                <path d="M-12,-58 Q-18,-75 -12,-80" fill="none" stroke="#eab308" strokeWidth="4.5" strokeLinecap="round" />
                <path d="M12,-58 Q18,-75 12,-80" fill="none" stroke="#eab308" strokeWidth="4.5" strokeLinecap="round" />

                {/* Big happy eyes */}
                <circle cx="-10" cy="-40" r="7" fill="#fff" />
                <circle cx="-10" cy="-40" r="3.5" fill="#1e293b" />
                <circle cx="10" cy="-40" r="7" fill="#fff" />
                <circle cx="10" cy="-40" r="3.5" fill="#1e293b" />

                {/* Smiling mouth */}
                <path d="M-8,-22 Q0,-14 8,-22" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />

                {/* Rosy blush */}
                <circle cx="-18" cy="-28" r="4" fill="#f43f5e" opacity="0.5" />
                <circle cx="18" cy="-28" r="4" fill="#f43f5e" opacity="0.5" />
              </g>

              {/* Sparkles of birth */}
              <polygon points="120,110 122,114 127,115 123,117 124,121 120,119" fill="#fde047" />
              <polygon points="280,110 282,114 287,115 283,117 284,121 280,119" fill="#fde047" />
            </g>
          );

        case 'dragon_sad':
          return (
            <g id="scene_dragon_sad">
              {/* Wilting flower on dried grid floor */}
              <path d="M0,270 Q200,260 400,270 L400,320 L0,320 Z" fill="#78350f" />

              {/* Drooping single flower stem */}
              <g transform="translate(140, 220)">
                <path d="M0,50 Q15,10 -15,-20" fill="none" stroke="#166534" strokeWidth="4" strokeLinecap="round" />
                {/* Sad tulip bloom pointing down */}
                <g transform="translate(-15, -20) rotate(145)">
                  <path d="M-12,0 C-18,-15 -25,-25 -10,-40 C0,-25 10,-40 10,-40 C10,-40 18,-25 12,0 Z" fill="#ec4899" {...styleProps} />
                </g>
                <path d="M8,30 Q30,15 12,5" fill="none" stroke="#14532d" strokeWidth="2.5" strokeLinecap="round" />
              </g>

              {/* Barnabé weeping */}
              <g transform="translate(260, 180) scale(0.85)">
                <ellipse cx="0" cy="20" rx="30" ry="38" fill="#22c55e" {...styleProps} />
                <circle cx="0" cy="-35" r="24" fill="#22c55e" {...styleProps} />
                
                {/* Sad eyes with weeping path */}
                <path d="M-12,-38 Q-8,-38 -10,-42" stroke="#1e293b" strokeWidth="3" fill="none" />
                <path d="M12,-38 Q10,-38 10,-42" stroke="#1e293b" strokeWidth="3" fill="none" />
                
                {/* Tear drops */}
                <circle cx="-10" cy="-25" r="4.5" fill="#38bdf8" />
                <path d="M-10,-25 L-10,-12" stroke="#38bdf8" strokeWidth="2" fill="none" />

                <path d="M-8,-20 Q0,-26 8,-20" fill="none" stroke="#1e293b" strokeWidth="2.5" />
              </g>
            </g>
          );

        case 'dragon_flight':
          return (
            <g id="scene_dragon_flight">
              {/* Sunset sky vectors - clouds */}
              <ellipse cx="100" cy="80" rx="70" ry="25" fill="#ca8a04" opacity="0.3" filter="blur(5px)" />
              <ellipse cx="300" cy="110" rx="90" ry="30" fill="#f97316" opacity="0.25" filter="blur(4px)" />

              {/* Giant dragon flying diagonally upwards */}
              <g transform="translate(200, 160) rotate(-15)">
                {/* Tail wave */}
                <path d="M-50,15 Q-90,40 -120,10" fill="none" stroke="#22c55e" strokeWidth="15" strokeLinecap="round" />
                
                {/* Huge spread wing */}
                <path d="M0,-10 C-40,-80 -100,-80 -120,-40 C-80,-25 -30,-15 0,-10 Z" fill="#15803d" stroke="#166534" strokeWidth="3" {...styleProps} />
                
                {/* Body elongated */}
                <ellipse cx="0" cy="5" rx="55" ry="30" fill="#22c55e" {...styleProps} />
                
                {/* Head raised */}
                <g transform="translate(50, -25)">
                  <circle cx="0" cy="0" r="22" fill="#22c55e" {...styleProps} />
                  <ellipse cx="10" cy="5" rx="14" ry="10" fill="#22c55e" />
                  <circle cx="2" cy="-5" r="5" fill="#fff" />
                  <circle cx="2" cy="-5" r="2" fill="#000" />
                  <path d="M5,12 C15,5 20,12 25,10" stroke="#14532d" strokeWidth="2" />
                </g>

                {/* Small silhouette representing child riding */}
                <g transform="translate(-10, -22)">
                  <circle cx="0" cy="-15" r="7" fill="#facc15" />
                  <path d="M-8,10 L8,10 L4,-5 L-4,-5 Z" fill="#3b82f6" />
                </g>
              </g>
            </g>
          );

        case 'dragon_block':
          return (
            <g id="scene_dragon_block">
              {/* Flat mountain top */}
              <path d="M0,250 L400,250 L400,320 L0,320 Z" fill="#475569" />

              {/* Water stream dry lines */}
              <path d="M120,250 Q160,280 200,280 T280,310" stroke="#334155" strokeWidth="6" strokeDasharray="5,10" fill="none" />

              {/* The gigantic sleeping boulder rock */}
              <g transform="translate(200, 180)">
                <ellipse cx="0" cy="20" rx="80" ry="55" fill="#64748b" {...styleProps} stroke="#475569" strokeWidth="4" />
                
                {/* Sleeping Zzzs */}
                <text x="70" y="-40" fill="#94a3b8" fontSize="22" fontWeight="bold">Z</text>
                <text x="95" y="-60" fill="#94a3b8" fontSize="15" fontWeight="bold">z</text>
                <text x="110" y="-72" fill="#94a3b8" fontSize="11" fontWeight="bold">z</text>

                {/* Closed snoring eyes drawing */}
                <path d="M-35,15 Q-20,5 -5,15" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />
                <path d="M15,15 Q30,5 45,15" stroke="#1e293b" strokeWidth="4" strokeLinecap="round" fill="none" />

                {/* Big cute snoring mouth */}
                <ellipse cx="5" cy="35" rx="15" ry="8" fill="#1e293b" />
                
                {/* Tiny grass moss details on boulder */}
                <ellipse cx="-45" cy="-15" rx="12" ry="5" fill="#22c55e" opacity="0.8" />
                <ellipse cx="35" cy="-22" rx="15" ry="6" fill="#22c55e" opacity="0.8" />
              </g>
            </g>
          );

        case 'dragon_laugh':
          return (
            <g id="scene_dragon_laugh">
              {/* Rock terrain */}
              <path d="M0,250 L400,250 L400,320 L0,320 Z" fill="#475569" />

              {/* Free flowing river running down */}
              <path d="M80,250 Q120,265 170,250 T280,320" fill="none" stroke="#0284c7" strokeWidth="22" strokeLinecap="round" opacity="0.8" />
              <path d="M80,250 Q120,265 170,250 T280,320" fill="none" stroke="#bae6fd" strokeWidth="4" strokeLinecap="round" strokeDasharray="5,8" />

              {/* Rolled over laughing rock */}
              <g transform="translate(290, 160) rotate(35)">
                <ellipse cx="0" cy="15" rx="55" ry="40" fill="#64748b" {...styleProps} />
                
                {/* Laughing eyes: >< shape */}
                <path d="M-20,0 L-10,5 L-20,10" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />
                <path d="M20,0 L10,5 L20,10" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" />

                {/* Big laughing red interior mouth */}
                <path d="M-15,15 Q0,35 15,15 Z" fill="#ef4444" stroke="#1e293b" strokeWidth="2" />
              </g>

              {/* Laugh lines */}
              <path d="M330,80 Q345,95 360,90" fill="none" stroke="#facc15" strokeWidth="3" strokeLinecap="round" />
              <text x="350" y="70" fill="#facc15" fontSize="16" fontWeight="bold">HAHA !</text>
            </g>
          );

        case 'dragon_bloom':
          return (
            <g id="scene_dragon_bloom">
              {/* Lush vibrant grass ground */}
              <path d="M0,250 Q200,220 400,250 L400,320 L0,320 Z" fill="#16a34a" />

              {/* Celestial flowers blooming */}
              <circle cx="200" cy="170" r="120" fill="url(#sun-glow)" opacity="0.3" />

              {/* Beautiful giant shining tulip */}
              <g transform="translate(200, 160)">
                {/* Stem */}
                <path d="M0,100 Q15,50 0,0" fill="none" stroke="#15803d" strokeWidth="8" strokeLinecap="round" />
                
                {/* Petals */}
                <path d="M-30,0 C-45,-40 -60,-60 -30,-90 C-10,-60 -5,-30 -5,0 Z" fill="#db2777" {...styleProps} />
                <path d="M30,0 C45,-40 60,-60 30,-90 C10,-60 5,-30 5,0 Z" fill="#db2777" {...styleProps} />
                <path d="M0,10 C-15,-30 0,-100 0,-100 C0,-100 15,-30 0,10 Z" fill="#ec4899" opacity="0.95" />

                {/* Core pollen balls glowing */}
                <circle cx="-10" cy="-50" r="6" fill="#fbbf24" opacity="0.9" />
                <circle cx="10" cy="-55" r="5" fill="#fef08a" opacity="0.9" />
              </g>

              {/* Sparkling yellow stars on bloom */}
              <polygon points="120,80 123,84 128,85 124,88 125,93 120,90" fill="#fde047" />
              <polygon points="270,100 273,104 278,105 274,108 275,113 270,110" fill="#fde047" />
            </g>
          );

        case 'dragon_moral':
          return (
            <g id="scene_dragon_moral">
              {/* Star fields */}
              <polygon points="50,40 55,50 65,52 55,54 50,64" fill="#67e8f9" />
              <polygon points="320,70 324,78 332,80 324,82 320,90" fill="#67e8f9" />

              {/* Fused Dragon scale design with a flower path */}
              <g transform="translate(200, 150)">
                <ellipse cx="0" cy="10" r="95" fill="url(#sun-glow)" opacity="0.25" />
                
                {/* Soft shield outline */}
                <path d="M-50,-20 Q-70,50 0,85 Q70,50 50,-20 Q0,-50 -50,-20 Z" fill="#15803d" {...styleProps} stroke="#22c55e" strokeWidth="4" />
                
                {/* Tulip emblem at center */}
                <path d="M0,50 C-20,20 -35,-10 -20,-30 C0,-10 0,10 0,50 Z" fill="#fb7185" />
                <path d="M0,50 C20,20 35,-10 20,-30 C0,-10 0,10 0,50 Z" fill="#fb7185" />
              </g>
            </g>
          );
      }
    }

    // ------------------------------------------------------------------------
    // ROBOT THEME SCENES
    // ------------------------------------------------------------------------
    if (themeId === 'robot') {
      switch (sceneType) {
        case 'robot_discover':
          return (
            <g id="scene_robot_discover">
              {/* Workshop dark backgrounds */}
              <rect x="20" y="20" width="360" height="280" fill="#1e293b" opacity="0.4" rx="10" />

              {/* Gears on mechanical walls */}
              <g transform="translate(80, 80) rotate(15)">
                <circle cx="0" cy="0" r="30" fill="none" stroke="#64748b" strokeWidth="8" />
                <rect x="-35" y="-5" width="70" height="10" fill="#64748b" />
                <rect x="-5" y="-35" width="10" height="70" fill="#64748b" />
                <circle cx="0" cy="0" r="18" fill="#1e293b" />
              </g>
              <g transform="translate(320, 100) rotate(-35)">
                <circle cx="0" cy="0" r="20" fill="none" stroke="#475569" strokeWidth="6" />
                <rect x="-24" y="-4" width="48" height="8" fill="#475569" />
                <rect x="-4" y="-24" width="8" height="48" fill="#475569" />
                <circle cx="0" cy="0" r="10" fill="#1e293b" />
              </g>

              {/* Barnabé the vintage cute robot */}
              <g transform="translate(200, 180)">
                {/* Antenna */}
                <line x1="0" y1="-50" x2="0" y2="-75" stroke="#94a3b8" strokeWidth="4" />
                <circle cx="0" cy="-75" r="8" fill="#38bdf8" />

                {/* Rectangular Head with interface */}
                <rect x="-35" y="-50" width="70" height="45" rx="8" fill="#94a3b8" {...styleProps} />
                {/* Screen panel representing eyes */}
                <rect x="-25" y="-42" width="50" height="25" rx="4" fill="#0f172a" />
                {/* Blue circular glowing light eyes */}
                <circle cx="-13" cy="-30" r="6" fill="#38bdf8" />
                <circle cx="13" cy="-30" r="6" fill="#38bdf8" />

                {/* Soft mechanical neck */}
                <rect x="-8" y="-5" width="16" height="12" fill="#64748b" />

                {/* Body Box */}
                <rect x="-45" y="7" width="90" height="65" rx="12" fill="#64748b" {...styleProps} />
                {/* Heart panel meter */}
                <rect x="-30" y="20" width="60" height="25" rx="5" fill="#334155" />
                {/* Heart design outline */}
                <path d="M0,25 C-3,22 -8,22 -8,27 C-8,32 0,38 0,38 C0,38 8,32 8,27 C8,22 3,22 0,25 Z" fill="#94a3b8" />

                {/* Cute blocky track wheels */}
                <rect x="-40" y="72" width="22" height="15" rx="4" fill="#475569" />
                <rect x="18" y="72" width="22" height="15" rx="4" fill="#475569" />
              </g>
            </g>
          );

        case 'robot_dream':
          return (
            <g id="scene_robot_dream">
              {/* Hologram projecting flower meadow */}
              <path d="M120,150 Q200,40 280,150" fill="none" stroke="#a855f7" strokeWidth="4" strokeDasharray="5,5" />
              <circle cx="200" cy="110" r="45" fill="none" stroke="rgba(168, 85, 247, 0.25)" strokeWidth="6" />

              {/* Projection beam */}
              <polygon points="200,110 50,300 350,300" fill="url(#aq-grad)" opacity="0.15" />

              {/* Giant Red flower projected */}
              <g transform="translate(200, 110) scale(0.65)">
                <circle cx="0" cy="0" r="25" fill="#fbbf24" />
                <ellipse cx="0" cy="-35" rx="15" ry="25" fill="#f43f5e" />
                <ellipse cx="35" cy="0" rx="25" ry="15" fill="#f43f5e" />
                <ellipse cx="0" cy="35" rx="15" ry="25" fill="#f43f5e" />
                <ellipse cx="-35" cy="0" rx="25" ry="15" fill="#f43f5e" />
              </g>

              {/* Robot looking upwards in awe */}
              <g transform="translate(200, 240) scale(0.75)">
                <rect x="-30" y="-40" width="60" height="40" rx="6" fill="#94a3b8" {...styleProps} />
                <circle cx="-10" cy="-20" r="6" fill="#c084fc" />
                <circle cx="10" cy="-20" r="6" fill="#c084fc" />
                <rect x="-40" y="5" width="80" height="55" rx="8" fill="#64748b" {...styleProps} />
              </g>
            </g>
          );

        case 'robot_dry':
          return (
            <g id="scene_robot_dry">
              {/* Gray messy drawer of tools */}
              <rect x="80" y="100" width="240" height="160" rx="15" fill="#334155" stroke="#475569" strokeWidth="3" {...styleProps} />

              {/* Broken paint brushes crossed */}
              <g transform="translate(160, 170) rotate(-25)">
                <rect x="-4" y="-45" width="8" height="90" fill="#78350f" />
                <path d="M-6,35 L6,35 L8,45 L-8,45 Z" fill="#94a3b8" />
                <path d="M-8,45 L8,45 L4,60 L-4,60 Z" fill="#64748b" opacity="0.6" />
                {/* Broken fracture crack */}
                <line x1="-5" y1="0" x2="5" y2="5" stroke="#334155" strokeWidth="3" />
              </g>
              <g transform="translate(240, 175) rotate(45)">
                <rect x="-3" y="-45" width="6" height="90" fill="#78350f" />
                <path d="M-5,35 L5,35 L7,45 L-7,45 Z" fill="#94a3b8" />
                <ellipse cx="0" cy="52" rx="6" ry="7" fill="#64748b" opacity="0.5" />
              </g>

              {/* Rust/dirty stars decoration around box */}
              <circle cx="60" cy="70" r="4" fill="#e2e8f0" opacity="0.5" />
              <circle cx="340" cy="220" r="3" fill="#e2e8f0" opacity="0.5" />
            </g>
          );

        case 'robot_berries':
          return (
            <g id="scene_robot_berries">
              {/* Three wooden bowls with vibrant raw colors */}
              {/* Bowl 1: Violet berry pulp */}
              <g transform="translate(110, 200)">
                <path d="M-30,0 C-30,25 30,25 30,0 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" {...styleProps} />
                <ellipse cx="0" cy="0" rx="28" ry="8" fill="#701a75" />
                {/* Berry drops */}
                <circle cx="-10" cy="-3" r="4.5" fill="#a21caf" />
                <circle cx="5" cy="2" r="4.5" fill="#86198f" />
              </g>

              {/* Bowl 2: Yellow flower liquid */}
              <g transform="translate(200, 230)">
                <path d="M-35,0 C-35,30 35,30 35,0 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" {...styleProps} />
                <ellipse cx="0" cy="0" rx="33" ry="9" fill="#ca8a04" />
                <circle cx="-12" cy="1" r="5" fill="#facc15" />
                <circle cx="10" cy="-2" r="6" fill="#fef08a" />
              </g>

              {/* Bowl 3: Emerald leaves sauce */}
              <g transform="translate(290, 200)">
                <path d="M-30,0 C-30,25 30,25 30,0 Z" fill="#b45309" stroke="#78350f" strokeWidth="2" {...styleProps} />
                <ellipse cx="0" cy="0" rx="28" ry="8" fill="#15803d" />
                <circle cx="0" cy="1" r="5" fill="#22c55e" />
              </g>

              {/* Forest berries on branches backdrop */}
              <circle cx="100" cy="80" r="7" fill="#ec4899" />
              <path d="M100,80 Q110,65 125,75" stroke="#78350f" fill="none" strokeWidth="2" />
              <circle cx="310" cy="110" r="9" fill="#0284c7" />
              <path d="M310,110 Q295,95 290,105" stroke="#78350f" fill="none" strokeWidth="2" />
            </g>
          );

        case 'robot_paint':
          return (
            <g id="scene_robot_paint">
              {/* Large vertical wall cardboard backing */}
              <rect x="60" y="40" width="280" height="230" rx="10" fill="#fcd34d" opacity="0.4" stroke="#d97706" strokeWidth="3" {...styleProps} />

              {/* Hand brush strokes drawn across board */}
              <path d="M80,80 Q150,130 300,90" fill="none" stroke="#701a75" strokeWidth="16" strokeLinecap="round" opacity="0.8" />
              <path d="M100,160 C180,110 240,240 320,150" fill="none" stroke="#eab308" strokeWidth="12" strokeLinecap="round" opacity="0.85" />
              <path d="M120,230 Q220,150 280,220" fill="none" stroke="#15803d" strokeWidth="14" strokeLinecap="round" opacity="0.75" />

              {/* Cute mechanical arm holding a makeshift brush painting */}
              <g transform="translate(320, 240) rotate(-20)">
                <rect x="-40" y="-8" width="50" height="14" rx="5" fill="#94a3b8" />
                <circle cx="-35" cy="-1" r="10" fill="none" stroke="#64748b" strokeWidth="3" />
                {/* The paintbrush head */}
                <rect x="-65" y="-5" width="25" height="10" fill="#78350f" />
                <path d="M-80,-10 L-65,-10 L-65,20 L-80,20 Z" fill="#eab308" />
              </g>
            </g>
          );

        case 'robot_alive':
          return (
            <g id="scene_robot_alive">
              {/* Cardboard comes alive - central glowing portal */}
              <circle cx="200" cy="155" r="95" fill="none" stroke="rgba(34, 197, 94, 0.25)" strokeWidth="6" strokeDasharray="10,5" />

              {/* Beautiful vector magic tree emerging with leaves */}
              <g transform="translate(200, 230)">
                {/* Roots on cardboard */}
                <path d="M-30,10 L30,10" stroke="#78350f" strokeWidth="4" />
                
                {/* Wood trunk */}
                <path d="M-12,10 L-4,-40 L4,-40 L12,10 Z" fill="#78350f" {...styleProps} />
                {/* Glowing Emerald Green Crown Loops */}
                <circle cx="0" cy="-60" r="35" fill="#22c55e" opacity="0.9" {...styleProps} />
                <circle cx="-25" cy="-50" r="25" fill="#15803d" opacity="0.85" {...styleProps} />
                <circle cx="25" cy="-50" r="25" fill="#15803d" opacity="0.85" {...styleProps} />
                <circle cx="0" cy="-85" r="20" fill="#4ade80" opacity="0.9" />

                {/* Floating flowers */}
                <circle cx="-15" cy="-55" r="4" fill="#fbbf24" />
                <circle cx="15" cy="-62" r="3.5" fill="#ec4899" />
              </g>

              {/* Beams of light */}
              <line x1="120" y1="50" x2="160" y2="100" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
              <line x1="280" y1="50" x2="240" y2="100" stroke="#fff" strokeWidth="3" opacity="0.6" strokeLinecap="round" />
            </g>
          );

        case 'robot_happy':
          return (
            <g id="scene_robot_happy">
              {/* Confetti falling */}
              <circle cx="60" cy="50" r="3" fill="#facc15" />
              <rect x="310" y="60" width="8" height="8" rx="2" fill="#ec4899" transform="rotate(25 310 60)" />
              <rect x="110" y="270" width="6" height="6" fill="#60a5fa" />
              
              {/* Bright sparkling screen background halo */}
              <circle cx="200" cy="150" r="100" fill="url(#sun-glow)" opacity="0.3" />

              {/* Robot with glowing giant pink heart in its monitor */}
              <g transform="translate(200, 160)">
                {/* Giant heart filling screen */}
                <path d="M0,-25 C-15,-45 -45,-30 -45,5 C-45,30 0,60 0,60 C0,60 45,30 45,5 C45,-30 15,-45 0,-25 Z" fill="#ec4899" {...styleProps} />
                <path d="M0,-15 C-8,-30 -30,-20 -30,5 C-30,22 0,42 0,42 C0,42 30,22 30,5 C30,-20 8,-30 0,-15 Z" fill="#f472b6" opacity="0.9" />

                {/* Smiling robotic mouth indicator floating underneath */}
                <path d="M-12,23 Q0,32 12,23" stroke="#fff" fill="none" strokeWidth="4" strokeLinecap="round" />
              </g>
            </g>
          );

        case 'robot_moral':
          return (
            <g id="scene_robot_moral">
              {/* Fused metal-gear and natural flower */}
              <circle cx="200" cy="150" r="100" fill="none" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="4" />
              <g transform="translate(200, 150)">
                {/* Gear behind */}
                <circle cx="0" cy="0" r="45" fill="none" stroke="#94a3b8" strokeWidth="12" />
                <rect x="-55" y="-6" width="110" height="12" fill="#94a3b8" />
                <rect x="-6" y="-55" width="12" height="110" fill="#94a3b8" />
                
                {/* Flower over */}
                <circle cx="0" cy="0" r="28" fill="#f43f5e" {...styleProps} />
                <circle cx="0" cy="0" r="12" fill="#fde047" />
              </g>
            </g>
          );
      }
    }

    // ------------------------------------------------------------------------
    // FOREST THEME SCENES (Default Fallback)
    // ------------------------------------------------------------------------
    switch (sceneType) {
      case 'forest_intro':
      case 'forest_cover':
        return (
          <g id="scene_forest_intro_default">
            {/* Background trees */}
            <path d="M-20,300 L60,110 L140,300 Z" fill="#14532d" opacity="0.65" />
            <path d="M260,300 L340,120 L420,300 Z" fill="#166534" opacity="0.55" />
            
            {/* Main Tree of Secrets */}
            <g transform="translate(200, 150)">
              {/* Trunk */}
              <rect x="-18" y="30" width="36" height="130" fill="#78350f" {...styleProps} />
              {/* Crown segments overlapping */}
              <circle cx="0" cy="0" r="55" fill="#15803d" {...styleProps} />
              <circle cx="-35" cy="10" r="45" fill="#16a54a" opacity="0.9" {...styleProps} />
              <circle cx="35" cy="10" r="45" fill="#16a54a" opacity="0.9" {...styleProps} />
              <circle cx="0" cy="-40" r="40" fill="#22c55e" opacity="0.9" />
              
              {/* Glowing flower buds */}
              <circle cx="-15" cy="-10" r="6" fill="#fbbf24" />
              <circle cx="20" cy="-15" r="5" fill="#f59e0b" />
              <circle cx="0" cy="20" r="6" fill="#fde047" />
            </g>

            {/* Glowing path leading into the forest */}
            <path d="M120,300 Q200,240 200,180" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" opacity="0.4" />
          </g>
        );

      case 'forest_squirrel':
        return (
          <g id="scene_forest_squirrel">
            {/* Woodland bushes */}
            <ellipse cx="60" cy="250" rx="90" ry="40" fill="#16532d" opacity="0.75" />
            <ellipse cx="340" cy="240" rx="90" ry="45" fill="#14532d" opacity="0.8" />

            {/* Plume - The Cute Squirrel */}
            <g transform="translate(200, 170)">
              {/* Giant bushy tail */}
              <path d="M-20,30 C-60,40 -80,-20 -40,-40 C-15,-20 -20,10 -20,30 Z" fill="#b45309" {...styleProps} />
              <path d="M-25,20 C-50,30 -60,-10 -35,-20 Z" fill="#eab308" opacity="0.7" />

              {/* Body */}
              <ellipse cx="5" cy="25" rx="24" ry="32" fill="#d97706" {...styleProps} />
              <ellipse cx="12" cy="25" rx="12" ry="22" fill="#ffedd5" />

              {/* Head */}
              <circle cx="12" cy="-20" r="18" fill="#d97706" {...styleProps} />
              
              {/* Antler-like cute long ears */}
              <path d="M4,-34 L0,-50 L10,-36 Z" fill="#b45309" />
              <path d="M16,-34 L22,-50 L18,-36 Z" fill="#b45309" />

              {/* Big squirrel eye */}
              <circle cx="12" cy="-22" r="4.5" fill="#fff" />
              <circle cx="12" cy="-22" r="2.5" fill="#1e293b" />

              {/* Tiny tiny hands holding chest area */}
              <circle cx="22" cy="18" r="5" fill="#d97706" />
            </g>
          </g>
        );

      case 'forest_fissure':
        return (
          <g id="scene_forest_fissure">
            {/* The giant dark obsidian Monolith */}
            <polygon points="120,300 140,80 260,80 280,300" fill="#1e1b4b" {...styleProps} stroke="#312e81" strokeWidth="4" />

            {/* Glowing magic rift in monolith */}
            <path d="M200,80 Q180,180 200,300 L205,300 Q185,180 205,80 Z" fill="#facc15" filter="blur(2px)" />
            <path d="M198,80 Q178,180 198,300" fill="none" stroke="#fff" strokeWidth="3" />

            {/* Small floating crystal shards beside it */}
            <polygon points="80,140 90,120 100,135 95,150" fill="#818cf8" opacity="0.8" />
            <polygon points="310,180 325,160 330,185 320,195" fill="#818cf8" opacity="0.8" />
          </g>
        );

      case 'forest_spell':
        return (
          <g id="scene_forest_spell">
            {/* Opening rift widening */}
            <polygon points="120,300 140,80 185,80 150,300" fill="#1e1b4b" {...styleProps} />
            <polygon points="280,300 260,80 215,80 250,300" fill="#1e1b4b" {...styleProps} />

            {/* Glowing magical pathway of stars emerging from rift */}
            <g transform="translate(200, 170)">
              <circle cx="0" cy="0" r="55" fill="none" stroke="#c084fc" strokeWidth="3" strokeDasharray="5,10" />
              <polygon points="0,-45 4,-15 35,-15 10,5 20,35 0,15 -20,35 -10,5 -35,-15 -4,-15" fill="#fde047" {...styleProps} />
              <circle cx="0" cy="0" r="10" fill="#fff" />
            </g>

            {/* Spell incantation ripples */}
            <circle cx="200" cy="170" r="95" fill="none" stroke="rgba(192, 132, 252, 0.25)" strokeWidth="2" />
          </g>
        );

      case 'forest_floating':
        return (
          <g id="scene_forest_floating">
            {/* Cosmic neon forest background */}
            <circle cx="60" cy="80" r="2" fill="#fff" opacity="0.5" />
            <circle cx="340" cy="110" r="2" fill="#fff" opacity="0.5" />

            {/* Floating magical golden rune-nut */}
            <g transform="translate(200, 140)">
              {/* Luminous yellow radial sunburst aura */}
              <circle cx="0" cy="0" r="95" fill="url(#sun-glow)" opacity="0.35" />

              {/* Luminous gemstone shaped icon */}
              <polygon points="0,-40 25,-15 15,30 -15,30 -25,-15" fill="#ca8a04" {...styleProps} stroke="#fde047" strokeWidth="3.5" />
              {/* Inlay diamond design */}
              <polygon points="0,-25 12,-5 0,15 -12,-5" fill="#fef08a" opacity="0.9" />
              <circle cx="0" cy="-5" r="4.5" fill="#fff" />
            </g>

            {/* Light sparkles tracing up */}
            <path d="M120,220 Q150,160 170,110" fill="none" stroke="#fef08a" strokeWidth="2" strokeDasharray="3,3" />
            <path d="M280,240 Q250,180 230,130" fill="none" stroke="#fef08a" strokeWidth="1.5" strokeDasharray="3,3" />
          </g>
        );

      case 'forest_gather':
        return (
          <g id="scene_forest_gather">
            {/* Ground forest path */}
            <path d="M0,260 L400,260 L400,320 L0,320 Z" fill="#14532d" />

            {/* Glowing magic heart campfire */}
            <g transform="translate(200, 240)">
              <ellipse cx="0" cy="15" rx="45" ry="10" fill="#78350f" stroke="#451a03" strokeWidth="3" />
              <path d="M-15,5 Q0,-35 15,5 Z" fill="#f97316" />
              <path d="M-8,5 Q0,-22 8,5 Z" fill="#fbbf24" />
            </g>

            {/* Silhouettes of animals gathering (Deer & Bird) */}
            {/* Noble Stag antlers */}
            <g transform="translate(100, 180) scale(0.85)">
              <rect x="-6" y="0" width="12" height="70" fill="#78350f" {...styleProps} />
              <circle cx="0" cy="-10" r="16" fill="#78350f" {...styleProps} />
              {/* Antlers */}
              <path d="M-10,-24 Q-35,-45 -25,-55 T-40,-70" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
              <path d="M10,-24 Q35,-45 25,-55 T40,-70" fill="none" stroke="#eab308" strokeWidth="4" strokeLinecap="round" />
            </g>

            {/* Cute fat bluebird on twig */}
            <g transform="translate(290, 190) scale(0.9)">
              <circle cx="0" cy="0" r="18" fill="#38bdf8" {...styleProps} />
              <polygon points="15,-4 25,-8 18,3" fill="#fbbf24" />
              <ellipse cx="-4" cy="-3" rx="4" ry="5" fill="#fff" />
              <circle cx="-4" cy="-3" r="2" fill="#000" />
            </g>
          </g>
        );

      case 'forest_bloom':
        return (
          <g id="scene_forest_bloom">
            {/* Golden tree crown */}
            <g transform="translate(200, 150)">
              <rect x="-15" y="40" width="30" height="120" fill="#451a03" />
              
              {/* Sparkling glowing golden tree nodes */}
              <circle cx="0" cy="0" r="80" fill="url(#sun-glow)" opacity="0.4" />
              <circle cx="0" cy="0" r="50" fill="#fbbf24" {...styleProps} />
              <circle cx="-35" cy="15" r="40" fill="#facc15" opacity="0.9" {...styleProps} />
              <circle cx="35" cy="15" r="40" fill="#facc15" opacity="0.9" {...styleProps} />
              
              {/* Spores flowing */}
              <circle cx="-15" cy="-20" r="5" fill="#fff" />
              <circle cx="20" cy="-10" r="4.5" fill="#fff" />
              <circle cx="10" cy="25" r="5" fill="#fff" />
            </g>
          </g>
        );

      case 'forest_moral':
        return (
          <g id="scene_forest_moral">
            {/* Heart leaf seal */}
            <circle cx="200" cy="150" r="105" fill="none" stroke="rgba(34, 197, 94, 0.3)" strokeWidth="4" />
            <g transform="translate(200, 150)">
              {/* Symmetrical golden leaf scroll */}
              <path d="M0,55 C-35,30 -55,0 -55,-25 C-55,-50 -25,-60 0,-30 C25,-60 55,-50 55,-25 C55,0 35,30 0,55 Z" fill="#15803d" {...styleProps} stroke="#22c55e" strokeWidth="3" />
              <path d="M0,40 C-22,22 -35,5 -35,-15 C-35,-32 -18,-40 0,-18 C18,-40 35,-32 35,-15 C35,5 22,22 0,40 Z" fill="#22c55e" opacity="0.9" />
              <circle cx="0" cy="-15" r="7" fill="#fde047" />
            </g>
          </g>
        );
    }
  };

  return (
    <svg
      id={`svg_illustration_${sceneType}`}
      viewBox="0 0 400 340"
      className={`w-full h-full select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Background container style-based decoration */}
      <rect width="400" height="340" fill="transparent" />
      {getStyleFilters()}

      {/* Renders scene content with style overlays */}
      <g>
        {renderSceneContent()}
        
        {/* Style specific layout grids/overlays */}
        {style === 'Crayon' && (
          <rect width="400" height="340" fill="url(#pencil-hatch)" pointerEvents="none" opacity="0.4" />
        )}
        {style === 'BD' && (
          <rect width="400" height="340" fill="url(#halftone)" pointerEvents="none" opacity="0.3" />
        )}
        {style === 'Pixel Art' && (
          <rect width="400" height="340" fill="url(#pixel-grid)" pointerEvents="none" opacity="0.75" />
        )}
      </g>
    </svg>
  );
}
