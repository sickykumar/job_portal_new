import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  GraduationCap,
  Sparkles,
  ChevronRight,
  CheckCircle2,
  Calendar,
  ExternalLink,
} from "lucide-react";
import api from "../../services/api";
import { useAuth } from "../../context/AuthContext";

/**
 * CandidateOpportunitiesWidget Component
 * Displays candidate's registered hackathons, earned skill badges, and internship access on Candidate Dashboard.
 */
const CandidateOpportunitiesWidget = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  // Fetch hackathons to check which ones candidate is registered for
  const { data: hackathons = [] } = useQuery({
    queryKey: ["candidate-my-hackathons"],
    queryFn: async () => {
      const res = await api.get("/hackathon/get");
      return res.data?.success ? res.data.hackathons : [];
    },
  });

  const myRegisteredHackathons = hackathons.filter((h) =>
    (h.registeredUsers || []).some((uId) => uId?.toString() === user?._id?.toString())
  );

  // Extract verified badges from candidate skills
  const verifiedBadges = (user?.profile?.skills || []).filter((s) =>
    typeof s === "string" && s.startsWith("Verified ")
  );

  return (
    <div className="glass-panel p-5 rounded-3xl space-y-4 border border-slate-200/80 dark:border-slate-800">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
              Competitions, Badges & Internships
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Your registered hackathons, verified technical skill assessments, and internship tracks.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="inline-flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-400 hover:underline"
          >
            <span>Skill Quizzes</span>
            <ChevronRight size={13} />
          </button>
          <span className="text-slate-300 dark:text-slate-700">•</span>
          <button
            type="button"
            onClick={() => navigate("/hackathons")}
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
          >
            <span>Hackathons</span>
            <ChevronRight size={13} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* 1. Registered Hackathons */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Trophy size={14} className="text-amber-500" />
                <span>My Hackathons</span>
              </span>
              <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-bold text-amber-600 dark:text-amber-400">
                {myRegisteredHackathons.length} Enrolled
              </span>
            </div>

            {myRegisteredHackathons.length === 0 ? (
              <p className="text-xs text-slate-400 pt-1">
                You have not registered for any hackathons yet. Compete for cash prizes and recruiter visibility.
              </p>
            ) : (
              <div className="space-y-1.5 pt-1">
                {myRegisteredHackathons.slice(0, 2).map((h) => (
                  <div key={h._id} className="text-xs p-2 rounded-xl bg-slate-50 dark:bg-slate-800">
                    <p className="font-bold text-slate-800 dark:text-white line-clamp-1">{h.title}</p>
                    <p className="text-[10px] text-slate-500">Prize Pool: {h.prizePool} • {h.daysLeft}d left</p>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/hackathons")}
            className="w-full py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center"
          >
            Browse Hackathons
          </button>
        </div>

        {/* 2. Verified Skill Badges */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <Award size={14} className="text-cyan-500" />
                <span>Verified Badges</span>
              </span>
              <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-bold text-cyan-600 dark:text-cyan-400">
                {verifiedBadges.length} Earned
              </span>
            </div>

            {verifiedBadges.length === 0 ? (
              <p className="text-xs text-slate-400 pt-1">
                Take skill quizzes (React, Node, Cloud) to earn verified recruiter-trusted competency badges.
              </p>
            ) : (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {verifiedBadges.map((badge, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400"
                  >
                    <CheckCircle2 size={10} />
                    <span>{badge}</span>
                  </span>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/quizzes")}
            className="w-full py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition text-center"
          >
            Take Skill Quizzes
          </button>
        </div>

        {/* 3. Tech Internships */}
        <div className="rounded-2xl border border-slate-200/70 dark:border-slate-800 p-4 bg-white/50 dark:bg-slate-900/50 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-200 flex items-center gap-1.5">
                <GraduationCap size={14} className="text-indigo-500" />
                <span>Tech Internships</span>
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400">
                Stipend Paid
              </span>
            </div>

            <p className="text-xs text-slate-400 pt-1">
              Explore hands-on internships across startups and high-growth engineering teams with direct mentorship.
            </p>
          </div>

          <button
            type="button"
            onClick={() => navigate("/internships")}
            className="w-full py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-[11px] font-bold shadow-xs hover:from-blue-700 hover:to-indigo-700 transition text-center"
          >
            Explore Internships
          </button>
        </div>
      </div>
    </div>
  );
};

export default CandidateOpportunitiesWidget;
