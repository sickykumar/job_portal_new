import React from "react";
import { Link } from "react-router-dom";

/**
 * NexHireLogo Component
 * Premium, futuristic vector SVG brand logo for NexHire.
 * Features an isometric, interlocking "N" fused with an upward dynamic growth vector,
 * symbolizing career acceleration and intelligent talent matching.
 *
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} showText - Whether to render "NexHire" text
 * @param {boolean} showSubtitle - Whether to render "Career OS" badge
 * @param {string} className - Optional container styling
 * @param {boolean} asLink - If true, wraps logo inside a Link to "/"
 */
export const NexHireLogo = ({
  size = "md",
  showText = true,
  showSubtitle = false,
  className = "",
  asLink = false,
  to = "/",
}) => {
  // Dimension mapping for the SVG glyph
  const sizeMap = {
    xs: { icon: 22, text: "text-xs", sub: "text-[8px]" },
    sm: { icon: 28, text: "text-sm", sub: "text-[9px]" },
    md: { icon: 34, text: "text-base", sub: "text-[10px]" },
    lg: { icon: 44, text: "text-xl", sub: "text-xs" },
    xl: { icon: 56, text: "text-2xl", sub: "text-xs" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const LogoGlyph = (
    <div
      style={{ width: currentSize.icon, height: currentSize.icon }}
      className="relative flex items-center justify-center shrink-0 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-cyan-400 p-[1.5px] shadow-sm shadow-blue-500/20 group-hover:shadow-blue-500/40 transition-all duration-300"
    >
      <div className="w-full h-full rounded-[10px] bg-slate-950 flex items-center justify-center overflow-hidden">
        <svg
          viewBox="0 0 36 36"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[78%] h-[78%]"
        >
          <defs>
            {/* Main Gradient */}
            <linearGradient id="nhG1" x1="0" y1="36" x2="36" y2="0" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#2563EB" />
              <stop offset="50%" stopColor="#6366F1" />
              <stop offset="100%" stopColor="#06B6D4" />
            </linearGradient>
            {/* Accent Cyan Glow */}
            <linearGradient id="nhG2" x1="12" y1="24" x2="32" y2="4" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#06B6D4" />
              <stop offset="100%" stopColor="#38BDF8" />
            </linearGradient>
          </defs>

          {/* Left Pillar of 'N' */}
          <path
            d="M6 7C6 5.89543 6.89543 5 8 5H10C11.1046 5 12 5.89543 12 7V29C12 30.1046 11.1046 31 10 31H8C6.89543 31 6 30.1046 6 29V7Z"
            fill="url(#nhG1)"
          />

          {/* Dynamic Ascending Diagonal Fused with Career Rocket Vector */}
          <path
            d="M10 8L25.5 27.5C26.1 28.3 27.2 28.1 27.5 27.2L29.5 21C29.7 20.4 29.4 19.8 28.9 19.5L13 7.5C11.8 6.5 10 7.3 10 8Z"
            fill="url(#nhG1)"
          />

          {/* Right Upward Ascension Pillar & Star Arrow */}
          <path
            d="M24 7C24 5.89543 24.8954 5 26 5H28C29.1046 5 30 5.89543 30 7V22C30 23.1046 29.1046 24 28 24H26C24.8954 24 24 23.1046 24 22V7Z"
            fill="url(#nhG2)"
          />

          {/* Glowing Top-Right Launch Point Indicator */}
          <circle cx="28" cy="7" r="2" fill="#FFFFFF" />
        </svg>
      </div>
    </div>
  );

  const content = (
    <div className={`inline-flex items-center gap-2 select-none group ${className}`}>
      {LogoGlyph}

      {showText && (
        <div className="flex flex-col leading-none">
          <span className={`font-black tracking-tight text-slate-900 dark:text-white ${currentSize.text}`}>
            Nex<span className="text-blue-600 dark:text-cyan-400">Hire</span>
          </span>
          {showSubtitle && (
            <span className={`font-bold tracking-widest text-slate-400 uppercase mt-0.5 ${currentSize.sub}`}>
              Career OS
            </span>
          )}
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

export default NexHireLogo;
