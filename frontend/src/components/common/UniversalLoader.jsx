import React from "react";
import { motion } from "framer-motion";
import { Sparkles, Compass } from "lucide-react";
import NexHireLogo from "./NexHireLogo";

/**
 * UniversalLoader Component
 * Futuristic multi-orbital spinner with neon glowing rings and dynamic status messaging.
 * Usable as a full-screen splash or an inline card loader.
 *
 * @param {string} message - Custom loading text
 * @param {boolean} fullScreen - Whether to take over full viewport or inline container
 * @param {string} size - "sm" | "md" | "lg"
 */
const UniversalLoader = ({
  message = "Loading career intelligence...",
  fullScreen = false,
  size = "md",
  className = "",
}) => {
  const sizeMap = {
    sm: { box: "h-10 w-10", ring1: "h-10 w-10", ring2: "h-7 w-7", icon: 14, text: "text-xs" },
    md: { box: "h-16 w-16", ring1: "h-16 w-16", ring2: "h-11 w-11", icon: 20, text: "text-sm" },
    lg: { box: "h-24 w-24", ring1: "h-24 w-24", ring2: "h-16 w-16", icon: 28, text: "text-base" },
  };

  const s = sizeMap[size] || sizeMap.md;

  const content = (
    <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
      {/* Brand Watermark for Fullscreen Loader */}
      {fullScreen && (
        <div className="mb-2 flex items-center justify-center">
          <NexHireLogo size="md" showText={true} showSubtitle={true} />
        </div>
      )}

      {/* Multi-Orbital Neon Core */}
      <div className={`relative flex items-center justify-center ${s.box}`}>
        {/* Ambient Back Glow */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-indigo-500 via-cyan-400 to-violet-600 opacity-40 blur-lg animate-pulse" />

        {/* Outer Orbital Ring (Clockwise) */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "linear" }}
          className={`absolute rounded-full border-2 border-transparent border-t-indigo-500 border-r-cyan-400 ${s.ring1}`}
        />

        {/* Inner Orbital Ring (Counter-Clockwise) */}
        <motion.div
          animate={{ rotate: -360 }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "linear" }}
          className={`absolute rounded-full border-2 border-transparent border-b-cyan-300 border-l-violet-500 ${s.ring2}`}
        />

        {/* Pulsing Core Icon */}
        <motion.div
          animate={{ scale: [0.92, 1.08, 0.92] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="relative z-10 flex items-center justify-center rounded-2xl bg-white/90 text-indigo-600 shadow-md backdrop-blur-md dark:bg-slate-900/90 dark:text-cyan-300"
          style={{ width: "45%", height: "45%" }}
        >
          <Sparkles size={s.icon} className="animate-spin" style={{ animationDuration: "8s" }} />
        </motion.div>
      </div>

      {/* Dynamic Status Text */}
      <div className="flex flex-col items-center text-center max-w-xs">
        <p className={`font-bold text-slate-800 dark:text-slate-100 ${s.text} tracking-wide flex items-center gap-1.5`}>
          <span>{message}</span>
        </p>

        <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
          <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-ping" />
          NexHire Core Engine
        </span>
      </div>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-xl dark:bg-[#080c14]/85 transition-colors">
        {content}
      </div>
    );
  }

  return (
    <div className="flex min-h-[260px] w-full items-center justify-center py-12">
      {content}
    </div>
  );
};

export default UniversalLoader;
