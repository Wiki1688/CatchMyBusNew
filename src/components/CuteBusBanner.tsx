import React from 'react';

/**
 * Cheerful, bright caricature illustration of a Singapore double-decker bus
 * cruising through a sunny, tropical Singapore cityscape.
 * Scalable SVG with zero external image dependencies.
 */
export const CuteBusBanner: React.FC = () => {
  return (
    <div className="cute-bus-banner-container" id="cute-bus-banner">
      <svg
        viewBox="0 0 720 220"
        className="cute-bus-svg"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Cute cartoon caricature of Singapore double-decker bus in a sunny tropical city"
      >
        <defs>
          {/* Bright sunny sky gradient */}
          <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="60%" stopColor="#7dd3fc" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Tropical hill gradient */}
          <linearGradient id="hillGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#4ade80" />
            <stop offset="100%" stopColor="#22c55e" />
          </linearGradient>

          {/* Bus body lush green gradient */}
          <linearGradient id="busGreen" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#34d399" />
            <stop offset="30%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>

          {/* Bus highlight */}
          <linearGradient id="busRoofHighlight" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
          </linearGradient>

          {/* Window glassy gradient */}
          <linearGradient id="windowGlass" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e0f2fe" />
            <stop offset="100%" stopColor="#bae6fd" />
          </linearGradient>

          {/* Cute Sun glow filter */}
          <filter id="sunGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="8" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>

          {/* Drop shadow for bus */}
          <filter id="busShadow" x="-10%" y="-10%" width="120%" height="130%">
            <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#0f172a" floodOpacity="0.22" />
          </filter>
        </defs>

        {/* 1. Sky Background */}
        <rect width="720" height="220" fill="url(#skyGrad)" />

        {/* 2. Cheerful Sun with Smiling Face */}
        <g id="cute-sun" transform="translate(630, 48)">
          {/* Sun rays */}
          <circle cx="0" cy="0" r="42" fill="#fde047" opacity="0.35" filter="url(#sunGlow)" />
          <circle cx="0" cy="0" r="32" fill="#facc15" />
          {/* Sun blush */}
          <circle cx="-14" cy="5" r="5" fill="#f87171" opacity="0.6" />
          <circle cx="14" cy="5" r="5" fill="#f87171" opacity="0.6" />
          {/* Sun happy eyes */}
          <path d="M-15 -3 Q-11 -9 -7 -3" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          <path d="M7 -3 Q11 -9 15 -3" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          {/* Sun smile */}
          <path d="M-7 7 Q0 15 7 7" stroke="#854d0e" strokeWidth="2.5" strokeLinecap="round" fill="none" />
        </g>

        {/* 3. Soft Fluffy Cartoon Clouds */}
        <g id="fluffy-clouds" fill="#ffffff" opacity="0.95">
          {/* Left cloud */}
          <path d="M 40 50 Q 55 30 75 42 Q 95 28 115 42 Q 130 38 135 52 Q 142 62 130 70 Q 110 75 55 72 Q 35 68 40 50 Z" />
          {/* Center-right high cloud */}
          <path d="M 380 32 Q 395 18 412 28 Q 428 16 445 28 Q 458 24 462 36 Q 468 44 458 50 Q 438 54 395 52 Q 375 48 380 32 Z" opacity="0.85" />
        </g>

        {/* 4. Cheerful Cityscape Silhouettes (Singapore MBS & Supertree vibe) */}
        <g id="city-silhouettes" fill="#93c5fd" opacity="0.55">
          {/* Marina Bay Sands stylized curve towers */}
          <rect x="520" y="70" width="18" height="85" rx="3" />
          <rect x="544" y="65" width="18" height="90" rx="3" />
          <rect x="568" y="68" width="18" height="87" rx="3" />
          {/* MBS Skypark surfboard */}
          <path d="M 508 67 C 530 63, 580 62, 606 65 C 595 72, 535 73, 508 67 Z" fill="#60a5fa" />

          {/* Supertree cartoon silhouette */}
          <path d="M 470 155 L 476 105 Q 465 92 458 80 Q 480 85 479 105 L 485 155 Z" fill="#60a5fa" opacity="0.7" />
          <circle cx="478" cy="88" r="22" fill="#818cf8" opacity="0.4" />
        </g>

        {/* 5. Rolling Green Tropical Hills */}
        <path d="M 0 160 Q 180 125 380 150 Q 560 170 720 142 L 720 220 L 0 220 Z" fill="url(#hillGrad)" />

        {/* Tropical palm trees on the left */}
        <g id="tropical-palm" transform="translate(35, 95)">
          <path d="M 30 65 Q 26 35 15 15" stroke="#78350f" strokeWidth="5" strokeLinecap="round" fill="none" />
          {/* Fronds */}
          <path d="M 15 15 Q -10 5 -25 20" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 15 15 Q 5 -10 0 -25" stroke="#16a34a" strokeWidth="4" strokeLinecap="round" fill="none" />
          <path d="M 15 15 Q 35 -8 48 5" stroke="#22c55e" strokeWidth="4.5" strokeLinecap="round" fill="none" />
          <path d="M 15 15 Q 40 18 50 35" stroke="#15803d" strokeWidth="4" strokeLinecap="round" fill="none" />
          <circle cx="15" cy="18" r="3" fill="#ca8a04" />
          <circle cx="19" cy="16" r="3" fill="#ca8a04" />
        </g>

        {/* 6. Clean Modern Roadway */}
        <g id="road-surface">
          <path d="M 0 162 L 720 162 L 720 220 L 0 220 Z" fill="#334155" />
          {/* Road curb in bright curb yellow/white stripes */}
          <rect x="0" y="159" width="720" height="4" fill="#fbbf24" />
          {/* Dashed highway center lines */}
          <line x1="20" y1="192" x2="80" y2="192" stroke="#ffffff" strokeWidth="5" strokeDasharray="45 35" />
          <line x1="120" y1="192" x2="700" y2="192" stroke="#ffffff" strokeWidth="5" strokeDasharray="45 35" />
        </g>

        {/* 7. Cute Cartoon Caricature Double-Decker Singapore Bus */}
        <g id="cute-double-decker-bus" filter="url(#busShadow)" transform="translate(130, 20)">
          {/* Speed / motion puff behind */}
          <g opacity="0.8">
            <ellipse cx="20" cy="148" rx="16" ry="8" fill="#ffffff" />
            <ellipse cx="0" cy="142" rx="12" ry="6" fill="#ffffff" opacity="0.6" />
            <ellipse cx="-15" cy="146" rx="8" ry="4" fill="#ffffff" opacity="0.4" />
          </g>

          {/* Main Bus Body: Chunky, cheerful, rounded caricature */}
          <rect x="40" y="24" width="360" height="135" rx="24" fill="url(#busGreen)" />

          {/* Roof shine highlight */}
          <rect x="48" y="27" width="344" height="14" rx="7" fill="url(#busRoofHighlight)" />

          {/* White livery mid-stripe */}
          <rect x="40" y="88" width="360" height="12" fill="#ffffff" />

          {/* Lower Red Accent Strip (Singapore Flag nod) */}
          <rect x="40" y="142" width="360" height="9" rx="4" fill="#ef4444" />

          {/* Upper Deck Windows (Rounded cute glass) */}
          <g id="upper-windows">
            {/* Front windshield upper */}
            <rect x="330" y="34" width="56" height="46" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            {/* Passenger windows upper */}
            <rect x="255" y="34" width="65" height="46" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            <rect x="180" y="34" width="65" height="46" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            <rect x="105" y="34" width="65" height="46" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            <rect x="52" y="34" width="44" height="46" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />

            {/* Cute waving cartoon passenger 1 (Upper middle) */}
            <circle cx="212" cy="54" r="11" fill="#fcd34d" />
            {/* Cute bear ears */}
            <circle cx="204" cy="45" r="4" fill="#f59e0b" />
            <circle cx="220" cy="45" r="4" fill="#f59e0b" />
            {/* Face */}
            <circle cx="209" cy="53" r="1.8" fill="#1e293b" />
            <circle cx="215" cy="53" r="1.8" fill="#1e293b" />
            <path d="M210 57 Q212 60 214 57" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            {/* Waving paw */}
            <circle cx="230" cy="50" r="5" fill="#fcd34d" />

            {/* Cute passenger 2 (Upper front) */}
            <circle cx="286" cy="53" r="11" fill="#fda4af" />
            <circle cx="283" cy="52" r="1.8" fill="#1e293b" />
            <circle cx="289" cy="52" r="1.8" fill="#1e293b" />
            <path d="M284 56 Q286 59 288 56" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />
            <circle cx="298" cy="49" r="4.5" fill="#fda4af" />
          </g>

          {/* Lower Deck Windows & Doors */}
          <g id="lower-windows">
            {/* Front windshield lower with cheerful driver */}
            <rect x="330" y="104" width="56" height="42" rx="10" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            {/* Bus driver with cute uniform cap */}
            <circle cx="355" cy="122" r="10" fill="#fed7aa" />
            <path d="M344 116 Q355 110 366 116" stroke="#1e3a8a" strokeWidth="4" strokeLinecap="round" fill="none" />
            <circle cx="352" cy="121" r="1.5" fill="#1e293b" />
            <circle cx="358" cy="121" r="1.5" fill="#1e293b" />
            <path d="M353 125 Q355 127 357 125" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Middle double doors with window slits */}
            <rect x="235" y="102" width="85" height="48" rx="6" fill="#047857" stroke="#065f46" strokeWidth="2" />
            <rect x="242" y="106" width="32" height="38" rx="5" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="1.5" />
            <rect x="281" y="106" width="32" height="38" rx="5" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="1.5" />
            <line x1="277" y1="103" x2="277" y2="149" stroke="#ffffff" strokeWidth="2" />

            {/* Rear passenger window */}
            <rect x="155" y="104" width="70" height="40" rx="9" fill="url(#windowGlass)" stroke="#065f46" strokeWidth="2.5" />
            {/* Cute passenger */}
            <circle cx="190" cy="122" r="10" fill="#a7f3d0" />
            <circle cx="187" cy="121" r="1.5" fill="#1e293b" />
            <circle cx="193" cy="121" r="1.5" fill="#1e293b" />
            <path d="M188 125 Q190 128 192 125" stroke="#1e293b" strokeWidth="1.2" strokeLinecap="round" fill="none" />

            {/* Engine vents rear */}
            <rect x="52" y="106" width="40" height="35" rx="5" fill="#047857" />
            <line x1="58" y1="114" x2="86" y2="114" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="122" x2="86" y2="122" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" />
            <line x1="58" y1="130" x2="86" y2="130" stroke="#064e3b" strokeWidth="2" strokeLinecap="round" />
          </g>

          {/* LED Electronic Route Destination Sign above front windshield */}
          <g id="led-destination-display">
            <rect x="330" y="12" width="62" height="18" rx="5" fill="#0f172a" stroke="#334155" strokeWidth="1.5" />
            <text x="361" y="24" fill="#fbbf24" fontSize="8" fontWeight="800" textAnchor="middle" fontFamily="monospace" letterSpacing="0.5">
              CATCH BUS
            </text>
          </g>

          {/* Front Bumper & Headlights (Cute caricature face) */}
          <g id="front-face">
            {/* Front rounded nose */}
            <path d="M 398 75 Q 412 110 398 148 Z" fill="#059669" />

            {/* Cute Big Cartoon Headlight (with sparkle!) */}
            <circle cx="395" cy="132" r="11" fill="#fef08a" stroke="#eab308" strokeWidth="2.5" />
            <circle cx="392" cy="129" r="4" fill="#ffffff" />

            {/* Fog light / blush indicator */}
            <circle cx="391" cy="144" r="5" fill="#f97316" />

            {/* Happy smiling bumper grill */}
            <path d="M 375 149 Q 390 157 403 148" stroke="#ffffff" strokeWidth="3.5" strokeLinecap="round" fill="none" />
          </g>

          {/* Chunky Cartoon Wheels with bright rims */}
          {/* Rear Wheel */}
          <g id="rear-wheel" transform="translate(108, 150)">
            <circle cx="0" cy="0" r="24" fill="#1e293b" />
            <circle cx="0" cy="0" r="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#10b981" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>
          {/* Front Wheel */}
          <g id="front-wheel" transform="translate(345, 150)">
            <circle cx="0" cy="0" r="24" fill="#1e293b" />
            <circle cx="0" cy="0" r="16" fill="#cbd5e1" stroke="#94a3b8" strokeWidth="2" />
            <circle cx="0" cy="0" r="8" fill="#10b981" />
            <circle cx="0" cy="0" r="3" fill="#ffffff" />
          </g>

          {/* Cute Little Bird perched on the roof with tiny sunglasses */}
          <g id="cute-bird" transform="translate(170, 10)">
            <ellipse cx="0" cy="0" rx="9" ry="7" fill="#38bdf8" />
            <circle cx="7" cy="-3" r="5" fill="#38bdf8" />
            <polygon points="12,-4 17,-2 12,0" fill="#f97316" />
            {/* Sunglasses */}
            <rect x="4" y="-5" width="5" height="3" rx="1" fill="#0f172a" />
            {/* Tail feather */}
            <path d="M -8 1 L -15 -3 L -8 -1 Z" fill="#0284c7" />
          </g>
        </g>
      </svg>
    </div>
  );
};
