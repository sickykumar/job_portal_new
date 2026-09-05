import React from "react";
import { motion } from "framer-motion";
import { Briefcase, Search, UserRound } from "lucide-react";

/**
 * CandidateHero Component
 * Welcome banner with user greeting, motivational copy, and primary action buttons.
 */
const CandidateHero = ({ firstName, onNavigate }) => {
  return (
    <motion.section
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 overflow-hidden rounded-[28px] border border-indigo-200/60 bg-gradient-to-br from-blue-600 via-indigo-600 to-violet-700 p-5 shadow-xl shadow-indigo-500/10 sm:p-7"
    >
      {/* Background ambient orbs */}
      <div className="pointer-events-none absolute -right-20 -top-20 h-56 w-56 rounded-full bg-cyan-300/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 left-1/3 h-56 w-56 rounded-full bg-violet-300/20 blur-3xl" />

      <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[10px] font-bold tracking-wide text-white backdrop-blur-md">
            <Briefcase size={13} />
            <span>CANDIDATE DASHBOARD</span>
          </div>

          <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
            Welcome back, {firstName}
          </h1>

          <p className="mt-2 max-w-xl text-xs leading-5 text-indigo-100 sm:text-sm">
            Track your applications, interviews and discover your next career opportunity from one place.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex w-full flex-col gap-2 sm:w-auto sm:flex-row">
          <button
            type="button"
            onClick={() => onNavigate("explore")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-xs font-bold text-indigo-700 shadow-lg transition hover:-translate-y-0.5 hover:shadow-xl"
          >
            <Search size={16} />
            <span>Find Jobs</span>
          </button>

          <button
            type="button"
            onClick={() => onNavigate("profile")}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white/20"
          >
            <UserRound size={16} />
            <span>My Profile</span>
          </button>
        </div>
      </div>
    </motion.section>
  );
};

export default CandidateHero;
