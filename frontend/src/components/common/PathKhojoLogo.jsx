import React from "react";
import { Link } from "react-router-dom";

/**
 * PathKhojoLogo Component
 * Premium 3D Ribbon 'P' brand logo matching the official design.
 * Features an origami/ribbon folded "P" in white and cyan-blue gradient.
 *
 * @param {string} size - 'xs' | 'sm' | 'md' | 'lg' | 'xl'
 * @param {boolean} showText - Whether to render "PathKhojo" text
 * @param {string} className - Optional container styling
 * @param {boolean} asLink - If true, wraps logo inside a Link to "/"
 */
export const PathKhojoLogo = ({
  size = "md",
  showText = true,
  className = "",
  asLink = false,
  to = "/",
}) => {
  const sizeMap = {
    xs: { icon: 24, text: "text-sm" },
    sm: { icon: 30, text: "text-base" },
    md: { icon: 38, text: "text-lg" },
    lg: { icon: 48, text: "text-2xl" },
    xl: { icon: 60, text: "text-3xl" },
  };

  const currentSize = sizeMap[size] || sizeMap.md;

  const Logo3DGlyph = (
    <div
      style={{ width: currentSize.icon, height: currentSize.icon }}
      className="relative flex items-center justify-center shrink-0 rounded-2xl bg-gradient-to-br from-blue-600 via-indigo-600 to-sky-400 p-[1.5px] shadow-lg shadow-blue-500/25 group-hover:shadow-blue-500/40 group-hover:scale-105 transition-all duration-300"
    >
      <div className="w-full h-full rounded-[14px] bg-gradient-to-br from-blue-700 via-blue-900 to-slate-900 border border-sky-400/40 flex items-center justify-center overflow-hidden relative shadow-inner">
        <svg
          viewBox="0 0 512 512"
          xmlns="http://www.w3.org/2000/svg"
          className="w-[86%] h-[86%] relative z-10"
        >
          <defs>
            <linearGradient id="logoWhiteGlow" x1="0%" y1="0%" x2="100%" y2="50%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="65%" stopColor="#F8FAFC" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>

            <linearGradient id="logoCyanFold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#0284C7" />
              <stop offset="100%" stopColor="#2563EB" />
            </linearGradient>

            <linearGradient id="logoStem" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#38BDF8" />
              <stop offset="50%" stopColor="#E0F2FE" />
              <stop offset="100%" stopColor="#FFFFFF" />
            </linearGradient>

            <linearGradient id="logoPlay" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#BAE6FD" />
            </linearGradient>
          </defs>

          {/* Inner Play Triangle */}
          <polygon points="145,160 280,240 145,310" fill="url(#logoPlay)" />

          {/* Sweeping Upper Ribbon */}
          <path
            d="M110,80 L330,80 C410,80 455,130 455,215 C455,295 405,350 315,360 C260,366 235,395 235,420 L150,470 L150,310 C180,315 220,315 250,290 C325,230 375,215 375,175 C375,130 325,115 260,115 L170,115 Z"
            fill="url(#logoWhiteGlow)"
          />

          {/* Cyan/Blue Middle Twist Fold */}
          <path
            d="M145,310 C175,250 240,210 325,225 C375,235 400,215 415,175 C425,235 390,285 320,305 C250,325 185,305 145,310 Z"
            fill="url(#logoCyanFold)"
          />

          {/* Lower Stem */}
          <path
            d="M145,310 C185,290 230,310 240,350 C245,370 240,395 235,420 L150,470 Z"
            fill="url(#logoStem)"
          />
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
      <Link to={to} className="inline-flex items-center" aria-label="PathKhojo — Home">
        {content}
      </Link>
    );
  }

  return content;
};

export default PathKhojoLogo;
