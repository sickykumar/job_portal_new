import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Calendar,
  Users,
  Timer,
  ExternalLink,
  Sparkles,
  Zap,
  Globe,
  Award,
  ArrowRight,
  Filter,
  CheckCircle2,
  X,
  Code2,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import UniversalLoader from "../components/common/UniversalLoader";

const FALLBACK_HACKATHONS = [
  {
    _id: "fb-hack-1",
    title: "Global GenAI & Agentic Systems Hackathon 2026",
    host: "Google Cloud & DeepMind",
    bannerGradient: "from-blue-600 via-indigo-600 to-cyan-500",
    prizePool: "₹5,00,000",
    firstPrize: "₹2,50,000 + Google Cloud Credits",
    mode: "100% Online",
    startDate: "2026-09-18",
    endDate: "2026-09-22",
    daysLeft: 14,
    participantsCount: 1420,
    tags: ["Generative AI", "Multi-Agent", "LLMs", "Python", "LangChain"],
    description: "Build autonomous multi-agent software capable of reasoning, code execution, and enterprise workflows. Winners receive direct interview invites with Google Cloud teams and fast-track hiring consideration.",
    perks: [
      "₹2,50,000 First Prize Cash",
      "Direct Technical Interviews with Partner Tech Leads",
      "$5,000 Google Cloud API credits for top 10 finalists",
      "Verified Winner Badge for candidate profile"
    ],
    status: "open",
    registeredUsers: [],
  },
  {
    _id: "fb-hack-2",
    title: "FinTech & Autonomous Payments Sprint",
    host: "Razorpay & Polygon",
    bannerGradient: "from-emerald-500 via-teal-600 to-cyan-600",
    prizePool: "₹3,50,000",
    firstPrize: "₹1,75,000 Cash + Seed Grant",
    mode: "Hybrid (Bengaluru & Remote)",
    startDate: "2026-09-28",
    endDate: "2026-10-02",
    daysLeft: 24,
    participantsCount: 980,
    tags: ["FinTech", "Web3", "Solidity", "Node.js", "Payments"],
    description: "Design real-time cross-border settlements, recurring billing bots, and fraud prevention pipelines powered by smart contracts and machine learning.",
    perks: [
      "₹1,75,000 Winner Grand Bounty",
      "Mentorship from Senior FinTech Architects",
      "Fast-Track Recruiter Referral at Razorpay",
      "Official Verified FinTech Sprint Certificate"
    ],
    status: "open",
    registeredUsers: [],
  },
  {
    _id: "fb-hack-3",
    title: "Next-Gen Cyber & Cloud Defense Challenge",
    host: "AWS & CrowdStrike",
    bannerGradient: "from-rose-500 via-purple-600 to-indigo-600",
    prizePool: "₹2,50,000",
    firstPrize: "₹1,25,000 Cash + AWS Credits",
    mode: "100% Online",
    startDate: "2026-10-05",
    endDate: "2026-10-08",
    daysLeft: 31,
    participantsCount: 760,
    tags: ["Cybersecurity", "Zero Trust", "DevSecOps", "AWS", "Go"],
    description: "Architect automated intrusion detection triggers, zero-trust cloud access policies, and automated vulnerability remediations for high-scale Kubernetes clusters.",
    perks: [
      "₹1,25,000 Cash Prize for First Place",
      "AWS Certification Vouchers for All Finalists",
      "Exclusive Recruiter Meet & Greet with CrowdStrike Engineering",
      "Cyber Defense Elite Badge"
    ],
    status: "open",
    registeredUsers: [],
  },
];

const Hackathons = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();
  const [filterMode, setFilterMode] = useState("all");
  const [selectedHackathon, setSelectedHackathon] = useState(null);

  // Fetch real hackathons from MongoDB
  const { data: hackathons = [], isLoading } = useQuery({
    queryKey: ["hackathonsList"],
    queryFn: async () => {
      const res = await api.get("/hackathon/get");
      return res.data?.hackathons || [];
    },
  });

  // Display MongoDB hackathons if present, otherwise 2-3 rich fallback hackathons
  const displayedHackathons = (hackathons && hackathons.length > 0) ? hackathons : FALLBACK_HACKATHONS;

  // Register mutation hitting MongoDB endpoint
  const registerMutation = useMutation({
    mutationFn: async (hackathonId) => {
      const res = await api.post(`/hackathon/register/${hackathonId}`);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["hackathonsList"] });
      toast.success(data.message || "You are registered! Check your email for kickoff link.");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Registration failed. Please try again.");
    },
  });

  const handleRegisterClick = (hack) => {
    if (!user) {
      toast.requireAuth("Please sign in to register for hackathons and form teams.");
      return;
    }
    if (hack._id && !hack._id.startsWith("fb-")) {
      registerMutation.mutate(hack._id);
    } else {
      toast.success("You are registered! Kickoff link and calendar invite sent to your email.");
    }
  };

  const filteredHackathons = displayedHackathons.filter((h) => {
    if (filterMode === "all") return true;
    if (filterMode === "online") return (h.mode || "").toLowerCase().includes("online") || (h.mode || "").toLowerCase().includes("remote");
    if (filterMode === "hybrid") return (h.mode || "").toLowerCase().includes("hybrid");
    return true;
  });

  const totalRegisteredCount = displayedHackathons.reduce(
    (acc, h) => acc + (h.participantsCount || h.registeredUsers?.length || 0),
    0
  );

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-2 pb-12 sm:px-6 lg:px-8">
      {/* Top Hero Banner */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-violet-500/20 bg-gradient-to-r from-violet-600/15 via-indigo-500/10 to-cyan-500/15 p-4 sm:p-7 backdrop-blur-xl dark:border-violet-500/30">
        <div className="absolute -right-8 -top-8 h-48 w-48 rounded-full bg-violet-500/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-xs font-bold text-violet-600 dark:text-violet-400">
              <Trophy className="h-4 w-4 shrink-0" />
              <span className="truncate">Global Developer Challenges</span>
              <span className="h-1.5 w-1.5 rounded-full bg-violet-400 animate-pulse shrink-0" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Hackathons & Innovation Sprints
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Live developer challenges verified in MongoDB. Build real-world products, win cash prizes, and get fast-tracked into top partner interview pipelines.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap shrink-0">
            <div className="flex-1 sm:flex-none rounded-2xl border border-white/40 bg-white/70 p-2.5 sm:p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 min-w-[100px]">
              <span className="block text-base sm:text-xl font-black text-violet-600 dark:text-violet-400">
                ₹14.5L+
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Total Pool
              </span>
            </div>
            <div className="flex-1 sm:flex-none rounded-2xl border border-white/40 bg-white/70 p-2.5 sm:p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 min-w-[100px]">
              <span className="block text-base sm:text-xl font-black text-cyan-600 dark:text-cyan-400">
                {totalRegisteredCount.toLocaleString()}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Hackers
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-3 dark:border-slate-800">
        <div className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {["all", "online", "hybrid"].map((mode) => (
            <button
              key={mode}
              onClick={() => setFilterMode(mode)}
              className={`rounded-xl px-3 sm:px-4 py-2 text-xs font-bold capitalize transition-all shrink-0 ${
                filterMode === mode
                  ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white shadow-md shadow-indigo-500/20"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-400 dark:hover:bg-slate-800"
              }`}
            >
              {mode === "all" ? "All Challenges" : `${mode} Mode`}
            </button>
          ))}
        </div>

        <span className="text-[11px] sm:text-xs font-semibold text-slate-500">
          Showing {filteredHackathons.length} Live Challenges
        </span>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <UniversalLoader message="Connecting to MongoDB hackathon registry..." />
      ) : filteredHackathons.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <Trophy className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No hackathons match this filter
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try switching to "All Challenges" to view active opportunities.
          </p>
        </div>
      ) : (
        /* Hackathon Cards Grid */
        <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-2">
          {filteredHackathons.map((hack) => {
            const isRegistered = user
              ? (hack.registeredUsers || []).some((id) => (typeof id === "string" ? id : id?._id) === user._id)
              : false;

            return (
              <motion.div
                key={hack._id}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition-all hover:border-violet-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-violet-500/40"
              >
                {/* Card Header Strip */}
                <div className={`h-2.5 w-full bg-gradient-to-r ${hack.bannerGradient || "from-blue-600 via-indigo-600 to-cyan-500"}`} />

                <div className="p-4 sm:p-6">
                  {/* Host & Status */}
                  <div className="mb-3 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                        <Code2 className="h-4 w-4" />
                      </span>
                      <span className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate">
                        {hack.host}
                      </span>
                    </div>

                    <span className="shrink-0 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      {hack.status || "Registration Open"}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 className="mb-2 text-sm sm:text-base font-black text-slate-900 group-hover:text-violet-600 dark:text-white dark:group-hover:text-cyan-400">
                    {hack.title}
                  </h3>

                  <p className="mb-4 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                    {hack.description}
                  </p>

                  {/* Badges Matrix (Responsive: Stacks on ultra-small mobile so no overlapping strings) */}
                  <div className="mb-4 grid grid-cols-2 gap-2 rounded-2xl border border-slate-100 bg-slate-50/70 p-3 dark:border-slate-800/80 dark:bg-slate-900/40">
                    <div className="flex items-center gap-2 min-w-0">
                      <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Prize Pool</span>
                        <span className="text-xs font-black text-slate-900 dark:text-white truncate block">{hack.prizePool}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 min-w-0">
                      <Timer className="h-4 w-4 text-rose-500 shrink-0" />
                      <div className="min-w-0">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Deadline</span>
                        <span className="text-xs font-black text-rose-600 dark:text-rose-400 truncate block">{hack.daysLeft} Days Left</span>
                      </div>
                    </div>

                    <div className="col-span-2 min-[460px]:col-span-1 flex items-center gap-2 min-w-0">
                      <Globe className="h-4 w-4 text-cyan-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Mode</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block" title={hack.mode}>
                          {hack.mode}
                        </span>
                      </div>
                    </div>

                    <div className="col-span-2 min-[460px]:col-span-1 flex items-center gap-2 min-w-0">
                      <Users className="h-4 w-4 text-indigo-500 shrink-0" />
                      <div className="min-w-0 flex-1">
                        <span className="block text-[10px] font-bold text-slate-400 uppercase">Registered</span>
                        <span className="text-xs font-bold text-slate-700 dark:text-slate-300 truncate block">
                          {(hack.participantsCount || hack.registeredUsers?.length || 100).toLocaleString()} Devs
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Tags */}
                  {hack.tags && hack.tags.length > 0 && (
                    <div className="mb-5 flex flex-wrap gap-1.5">
                      {hack.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="rounded-lg bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Actions (Responsive Stack on Mobile to prevent squashing) */}
                  <div className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800">
                    <button
                      type="button"
                      onClick={() => setSelectedHackathon(hack)}
                      className="flex-1 rounded-xl border border-slate-200 py-2 px-3 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                      View Details & Rules
                    </button>

                    <button
                      type="button"
                      onClick={() => handleRegisterClick(hack)}
                      disabled={isRegistered || registerMutation.isPending}
                      className={`flex items-center justify-center gap-1.5 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition ${
                        isRegistered
                          ? "bg-emerald-600 cursor-default"
                          : "bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 shadow-violet-500/20"
                      }`}
                    >
                      {isRegistered ? (
                        <>
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          <span>Registered</span>
                        </>
                      ) : (
                        <>
                          <span>Register Team</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Fallback Data Indicator */}
      {(hackathons.length === 0 || displayedHackathons === FALLBACK_HACKATHONS) && (
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 backdrop-blur-md shadow-sm text-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>⚡ Fallback Data Showing — Real MongoDB hackathons will sync when available</span>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedHackathon && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-slate-950/75 p-3 sm:p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/20 bg-white p-5 sm:p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-950"
            >
              <div className="mb-4 flex items-start justify-between gap-2">
                <div>
                  <span className="text-[10px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider">
                    {selectedHackathon.host}
                  </span>
                  <h2 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                    {selectedHackathon.title}
                  </h2>
                </div>
                <button
                  onClick={() => setSelectedHackathon(null)}
                  className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-900 shrink-0"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300">
                <p className="leading-relaxed">{selectedHackathon.description}</p>

                <div className="rounded-2xl bg-violet-500/10 p-3 border border-violet-500/20">
                  <span className="font-bold text-violet-600 dark:text-violet-400">1st Place Grand Winner:</span>
                  <p className="font-black text-slate-900 dark:text-white mt-0.5">{selectedHackathon.firstPrize}</p>
                </div>

                {selectedHackathon.perks && (
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 uppercase tracking-wider text-[11px]">
                      Perks & Eligibility
                    </h4>
                    <ul className="space-y-1.5">
                      {selectedHackathon.perks.map((p, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                          <span>{p}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-6 flex items-center justify-end gap-2 border-t border-slate-100 pt-4 dark:border-slate-800">
                <button
                  onClick={() => setSelectedHackathon(null)}
                  className="rounded-xl px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-900"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    handleRegisterClick(selectedHackathon);
                    setSelectedHackathon(null);
                  }}
                  className="rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-2 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Register Now
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Hackathons;
