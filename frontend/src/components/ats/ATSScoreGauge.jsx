import React from "react";
import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";

/**
 * Standalone ATSScoreGauge Component
 * Circular vector gauge with color-coded score tiers and breakdown bars.
 */
const ATSScoreGauge = ({ score = 0, status = "Evaluating", metrics = {} }) => {
  const safeScore = Math.min(100, Math.max(0, Math.round(score)));

  // Determine tier colors
  const getColor = (val) => {
    if (val >= 80) return { stroke: "#10b981", text: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/30" };
    if (val >= 60) return { stroke: "#f59e0b", text: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/30" };
    return { stroke: "#f43f5e", text: "text-rose-400", bg: "bg-rose-500/10", border: "border-rose-500/30" };
  };

  const theme = getColor(safeScore);
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (safeScore / 100) * circumference;

  const breakdown = [
    { label: "Keyword Match", val: metrics.keywordMatch || 70, color: "from-blue-500 to-cyan-400" },
    { label: "Formatting & Layout", val: metrics.formattingHealth || 85, color: "from-emerald-500 to-teal-400" },
    { label: "Measurable Impact", val: metrics.impactAndMetrics || 65, color: "from-violet-500 to-indigo-400" },
    { label: "Section Completeness", val: metrics.sectionCompleteness || 90, color: "from-amber-500 to-orange-400" },
  ];

  return (
    <div className="rounded-[28px] border border-slate-200/80 bg-white/80 p-6 shadow-xl backdrop-blur-xl dark:border-slate-800/80 dark:bg-slate-900/80">
      <div className="flex flex-col items-center sm:flex-row sm:items-center sm:justify-between gap-6">
        
        {/* Circular Gauge */}
        <div className="relative flex items-center justify-center">
          <svg width="180" height="180" className="rotate-[-90deg]">
            {/* Background Track */}
            <circle
              cx="90"
              cy="90"
              r={radius}
              stroke="currentColor"
              strokeWidth="12"
              className="text-slate-100 dark:text-slate-800/60"
              fill="transparent"
            />
            {/* Progress Stroke */}
            <motion.circle
              cx="90"
              cy="90"
              r={radius}
              stroke={theme.stroke}
              strokeWidth="12"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 1.4, ease: "easeOut" }}
              strokeLinecap="round"
              fill="transparent"
            />
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
            <span className="text-4xl font-black tracking-tight text-slate-900 dark:text-white">
              {safeScore}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
              out of 100
            </span>
            <span className={`mt-1 inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[10px] font-bold ${theme.bg} ${theme.border} ${theme.text} border`}>
              {safeScore >= 80 ? <CheckCircle2 className="h-3 w-3" /> : <AlertCircle className="h-3 w-3" />}
              {status}
            </span>
          </div>
        </div>

        {/* 4 Pillars Breakdown */}
        <div className="w-full flex-1 space-y-3.5">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Core ATS Metrics
            </h3>
            <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">
              Target: 85%+
            </span>
          </div>

          {breakdown.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex justify-between text-xs font-medium text-slate-700 dark:text-slate-300">
                <span>{item.label}</span>
                <span className="font-bold">{item.val}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${item.val}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className={`h-full rounded-full bg-gradient-to-r ${item.color}`}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ATSScoreGauge;
