import React from "react";
import { Link } from "react-router-dom";

/**
 * PathKhojoLogo Component
 * Premium 3D isometric vector SVG brand logo for PathKhojo ("पाथ खोजो" / Career Pathway Navigator).
 * 
 * Design Concept:
 * - 3D Isometric Compass/Navigator + Upward Glowing Pathway ("P" & "K" fused)
 * - Beveled isometric planes with multi-layered depth, drop-shadows, and neon gradient lighting (Royal Blue, Electric Indigo, Cyan & Emerald)
 * - Modern typography: "Path" in geometric display font + "Khojo" in vivid vibrant gradient with subtle glowing aura.
 *
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} showText - Whether to render "PathKhojo" text
 * @param {boolean} showSubtitle - Whether to render "Career Navigator OS" badge
 * @param {string} className - Optional container styling
 * @param {boolean} asLink - If true, wraps logo inside a Link to "/"
 */
export const PathKhojoLogo = ({
  size = "md",
  showText = true,
  showSubtitle = false,
  className = "",
  asLink = false,
  to = "/",
}) => {
  // Dimension mapping for the SVG glyph & typography
  const sizeMap = {
    xs: { icon: 24, text: "text-sm", sub: "text-[8px]" },
    sm: { icon: 30, text: "text-base", sub: "text-[9px]" },
    md: { icon: 38, text: "text-lg", sub: "text-[10px]" },
    lg: { icon: 48, text: "text-2xl", sub: "text-xs" },
    xl: { icon: 60, text: "text-3xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const Logo3DGlyph = (
    <div
      style={{ width: currentSize.icon, height: currentSize.icon }}
      className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-indigo-500 via-sky-500 to-emerald-400 p-[1.5px] shadow-lg shadow-indigo-500/25 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300"
    >
      {/* 3D Surface Container: Vibrant royal indigo/blue gradient (NO DULL BLACK) */}
      <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-indigo-900 via-blue-900 to-sky-950 border border-white/25 flex items-center justify-center overflow-hidden relative shadow-inner">
        {/* Luminous Center Highlight */}
        <div className="absolute inset-0 bg-radial from-cyan-400/30 via-indigo-500/15 to-transparent pointer-events-none" />

        <svg
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[84%] h-[84%] relative z-10 drop-shadow-[0_4px_8px_rgba(30,27,75,0.5)]"
        >
          <defs>
            {/* 3D Top Facet Gradient (Bright white-cyan reflection) */}
            <linearGradient id="pkTop" x1="0" y1="0" x2="48" y2="24" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#38BDF8" />
              <stop offset="100%" stopColor="#818CF8" />
            </linearGradient>

            {/* 3D Left Isometric Shadow Plane (Royal Indigo - not black) */}
            <linearGradient id="pkLeft" x1="6" y1="12" x2="24" y2="44" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#4F46E5" />
              <stop offset="100%" stopColor="#312E81" />
            </linearGradient>

            {/* 3D Right Isometric Pathway (Ascending Neon Beam) */}
            <linearGradient id="pkPath" x1="20" y1="40" x2="42" y2="8" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="60%" stopColor="#10B981" />
              <stop offset="100%" stopColor="#34D399" />
            </linearGradient>

            {/* Glowing North Star Gradient */}
            <radialGradient id="pkStar" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="40%" stopColor="#67E8F9" />
              <stop offset="100%" stopColor="#06B6D4" stopOpacity="0" />
            </radialGradient>

            {/* Filter for 3D Drop Shadow */}
            <filter id="pkShadow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="1" dy="2" stdDeviation="1.5" floodColor="#1E1B4B" floodOpacity="0.4" />
            </filter>
          </defs>

          {/* 3D Base Pathway Plane: Foundation slab */}
          <path
            d="M8 28L22 36L40 26L26 18L8 28Z"
            fill="url(#pkLeft)"
            opacity="0.45"
          />

          {/* 3D Isometric Pillar of 'P' (Vertical Backbone) */}
          <path
            d="M10 14L18 10V34L10 38V14Z"
            fill="url(#pkLeft)"
            filter="url(#pkShadow)"
          />
          {/* Top Cap of 'P' Pillar */}
          <path
            d="M10 14L18 10L26 14L18 18L10 14Z"
            fill="url(#pkTop)"
          />

          {/* 3D Loop of 'P' curving into Pathway Arrow */}
          <path
            d="M18 10H30C34.4 10 37 13.5 35 17.5C33.2 21 29 23 24 23H18V10Z"
            fill="url(#pkTop)"
            filter="url(#pkShadow)"
          />

          {/* Dynamic 3D Upward Ascending Chevron (The "Khojo" Career Compass Vector) */}
          <path
            d="M22 38L38 18L33 14L19 32L22 38Z"
            fill="url(#pkPath)"
            filter="url(#pkShadow)"
          />

          {/* Glowing 3D Navigation Arrowhead pointing towards Top-Right Future */}
          <path
            d="M38 18L42 8L32 12L34.5 15L38 18Z"
            fill="#34D399"
          />

          {/* Luminous Polaris / Guiding Star at Destination */}
          <circle cx="42" cy="8" r="5" fill="url(#pkStar)" />
          <circle cx="42" cy="8" r="1.8" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2.5 select-none group ${className}`}>
      {Logo3DGlyph}

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${currentSize.text} flex items-center`}>
            <span>Path</span>
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-500 dark:from-cyan-400 dark:via-sky-300 dark:to-emerald-400 bg-clip-text text-transparent ml-0.5">
              Khojo
            </span>
          </span>
        </div>
      )}
    </div>
  );

  if (asLink) {
    return (
      <Link to={to} className="inline-flex items-center">
        {content}
      </Link>
    );
  }

  return content;
};

export default PathKhojoLogo;
