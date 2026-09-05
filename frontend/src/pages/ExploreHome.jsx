import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Briefcase,
  GraduationCap,
  Trophy,
  Award,
  Sparkles,
  Building2,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Users,
  Timer,
  ExternalLink,
  Search,
  Code2,
  Compass,
  Star,
  Coins,
  ShieldCheck,
  Zap,
  MapPin,
  Flame,
  BrainCircuit,
  TrendingUp,
  Target,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// Featured Flagship Hero Slides (Unstop Style Carousel)
const HERO_SLIDES = [
  {
    id: 1,
    badge: "Featured Flagship Challenge",
    title: "Google Solution Challenge 2026",
    subtitle: "Build Multi-Agent AI & Cloud Systems for Global Impact",
    host: "Google Cloud & DeepMind",
    prizePool: "₹5,00,000 Cash + Cloud API Credits",
    perk: "Direct Recruiter Interviews + Fast-Track Hiring",
    gradient: "from-blue-600 via-indigo-600 to-cyan-500",
    glowColor: "rgba(59, 130, 246, 0.35)",
    tag: "100% Online • Open to All Developers",
    ctaText: "Register for Google Challenge",
    link: "/hackathons",
    logoText: "G",
  },
  {
    id: 2,
    badge: "Campus Engineering Sprint",
    title: "Flipkart GRiD 7.0 Robotics & E-Comm Sprint",
    subtitle: "India's Premier Engineering Campus Hiring Competition",
    host: "Flipkart Engineering",
    prizePool: "₹3,50,000 Cash + Pre-Placement Offers (PPO)",
    perk: "Full-Time SDE & Robotics Engineering Roles",
    gradient: "from-amber-500 via-orange-600 to-rose-600",
    glowColor: "rgba(245, 158, 11, 0.35)",
    tag: "Hybrid • Bengaluru & Virtual",
    ctaText: "View GRiD 7.0 Details",
    link: "/hackathons",
    logoText: "F",
  },
  {
    id: 3,
    badge: "National Innovation Championship",
    title: "Tata Imagination Challenge 2026",
    subtitle: "Reimagine Digital Supply Chains, Green Tech & Autonomous Mobility",
    host: "Tata Sons & TCS",
    prizePool: "₹4,00,000 Bounties + Executive Mentorship",
    perk: "Fast-Track Leadership Management Cadre",
    gradient: "from-violet-600 via-purple-700 to-indigo-700",
    glowColor: "rgba(139, 92, 246, 0.35)",
    tag: "Pan-India Challenge",
    ctaText: "Explore Tata Challenge",
    link: "/hackathons",
    logoText: "T",
  },
  {
    id: 4,
    badge: "Paid Internship & Diversity Sprint",
    title: "Amazon WOW 2026 Mentorship & SDE Internships",
    subtitle: "Fast-Track Paid Internships & Full-Time Software Engineering Roles",
    host: "Amazon Web Services (AWS)",
    prizePool: "₹1,10,000 / month Stipend + PPO",
    perk: "1-on-1 Mentorship from AWS Senior Architects",
    gradient: "from-emerald-600 via-teal-700 to-cyan-700",
    glowColor: "rgba(16, 185, 129, 0.35)",
    tag: "6 Months Paid • Remote / Hyderabad",
    ctaText: "Apply for Amazon WOW",
    link: "/internships",
    logoText: "A",
  },
];

// Quick Category Exploration Navigation Pills
const QUICK_CATEGORIES = [
  {
    title: "Find Jobs",
    subtitle: "500+ Verified full-time roles",
    count: "500+ Open Roles",
    icon: Briefcase,
    color: "from-blue-600 to-indigo-600",
    bgLight: "bg-blue-50 dark:bg-blue-950/40",
    borderColor: "border-blue-200 dark:border-blue-900/50",
    link: "/jobs",
  },
  {
    title: "Internships",
    subtitle: "High stipend & PPO roles",
    count: "₹35K Avg Stipend",
    icon: GraduationCap,
    color: "from-emerald-500 to-teal-600",
    bgLight: "bg-emerald-50 dark:bg-emerald-950/40",
    borderColor: "border-emerald-200 dark:border-emerald-900/50",
    link: "/internships",
  },
  {
    title: "Hackathons",
    subtitle: "Compete & win cash prizes",
    count: "₹50L+ Bounties",
    icon: Trophy,
    color: "from-amber-500 to-orange-600",
    bgLight: "bg-amber-50 dark:bg-amber-950/40",
    borderColor: "border-amber-200 dark:border-amber-900/50",
    link: "/hackathons",
  },
  {
    title: "Skill Quizzes",
    subtitle: "Earn verified profile badges",
    count: "80% Pass Threshold",
    icon: Award,
    color: "from-violet-500 to-purple-600",
    bgLight: "bg-violet-50 dark:bg-violet-950/40",
    borderColor: "border-violet-200 dark:border-violet-900/50",
    link: "/quizzes",
  },
  {
    title: "AI Career Coach",
    subtitle: "Plain-text ATS & interview prep",
    count: "24/7 Intelligent AI",
    icon: Sparkles,
    color: "from-cyan-500 to-blue-600",
    bgLight: "bg-cyan-50 dark:bg-cyan-950/40",
    borderColor: "border-cyan-200 dark:border-cyan-900/50",
    link: "/ai-coach",
  },
  {
    title: "Top Hiring Companies",
    subtitle: "Direct access to tech recruiters",
    count: "2,000+ Partners",
    icon: Building2,
    color: "from-rose-500 to-pink-600",
    bgLight: "bg-rose-50 dark:bg-rose-950/40",
    borderColor: "border-rose-200 dark:border-rose-900/50",
    link: "/companies",
  },
];

// Unlock Your Career 4 Pillars (The signature Unstop section)
const UNLOCK_CAREER_CARDS = [
  {
    pillar: "LEARN & PRACTICE",
    title: "Skill Quizzes & Certified Badges",
    tag: "Assessment Engine",
    description:
      "Benchmark your real engineering skills against industry standards. Take timed assessments in React 19, Node.js, and System Design to unlock Verified Skill Badges on your profile.",
    features: [
      "Real-time timer & question feedback",
      "80%+ score unlocks Verified Profile Badge",
      "Zero fluff, 100% technical depth",
    ],
    buttonText: "Start Skill Practice",
    link: "/quizzes",
    gradient: "from-blue-600 to-indigo-600",
    icon: BrainCircuit,
    badgeText: "Practice & Get Ranked",
  },
  {
    pillar: "COMPETE & WIN",
    title: "Competitions & Hackathons",
    tag: "Proof of Work",
    description:
      "Stand out to tech leaders by building working software. Join online hackathons hosted by top partners, win cash prizes, and get fast-tracked into technical interview rounds.",
    features: [
      "Cash prize pools up to ₹5,00,000",
      "Direct recruiter visibility & interview invites",
      "Solo and team participation modes",
    ],
    buttonText: "Browse Live Hackathons",
    link: "/hackathons",
    gradient: "from-amber-500 to-rose-600",
    icon: Trophy,
    badgeText: "Win Cash & Job Offers",
  },
  {
    pillar: "EARLY CAREER",
    title: "High-Stipend Internships",
    tag: "Pre-Placement Offers",
    description:
      "Kickstart your career with high-impact internships at top tech firms. Work on production systems with senior architects, earn competitive stipends, and convert to full-time roles.",
    features: [
      "₹25,000 - ₹50,000/mo verified stipends",
      "Clear PPO (Pre-Placement Offer) conversion paths",
      "Flexible remote, hybrid & on-site options",
    ],
    buttonText: "Explore Internships",
    link: "/internships",
    gradient: "from-emerald-500 to-teal-600",
    icon: GraduationCap,
    badgeText: "Paid Opportunities",
  },
  {
    pillar: "AI ACCELERATION",
    title: "AI Career Coach & Mock Prep",
    tag: "2026 AI Intelligence",
    description:
      "Prepare for interviews with our intelligent plain-text AI coach. Practice technical questions, benchmark target salary ranges, and craft tailored counter-offer emails.",
    features: [
      "Technical interview mock questions & answers",
      "2026 compensation benchmarking & salary scripts",
      "Clean, plain-text responses without messy markdown",
    ],
    buttonText: "Talk to AI Coach",
    link: "/ai-coach",
    gradient: "from-violet-600 to-fuchsia-600",
    icon: Sparkles,
    badgeText: "Instant AI Advisory",
  },
];

const ExploreHome = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto slide timer (every 5 seconds when not paused)
  useEffect(() => {
    if (isPaused) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % HERO_SLIDES.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + HERO_SLIDES.length) % HERO_SLIDES.length);
  };

  // Fetch live hackathons from MongoDB
  const { data: liveHackathons = [] } = useQuery({
    queryKey: ["exploreLiveHackathons"],
    queryFn: async () => {
      const res = await api.get("/hackathon/get");
      return res.data?.hackathons || [];
    },
  });

  // Fetch live jobs/internships from MongoDB
  const { data: allJobs = [] } = useQuery({
    queryKey: ["exploreAllJobs"],
    queryFn: async () => {
      const res = await api.get("/job/get");
      return res.data?.jobs || [];
    },
  });

  const featuredInternships = allJobs
    .filter((j) => {
      const type = (j.jobType || "").toLowerCase();
      const title = (j.title || "").toLowerCase();
      return type.includes("intern") || title.includes("internship");
    })
    .slice(0, 3);

  const displayedHackathons = liveHackathons.slice(0, 3);

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-2 pb-4 sm:pb-8 lg:pb-12 sm:px-6 lg:px-8">
      {/* ========================================================================= */}
      {/* 1. HERO SLIDER CAROUSEL (Unstop Style) */}
      {/* ========================================================================= */}
      <div
        className="relative mb-8 overflow-hidden rounded-3xl border border-slate-200/80 bg-white shadow-xl dark:border-slate-800 dark:bg-slate-950/90"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="relative min-h-[360px] sm:min-h-[380px] w-full flex items-center">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -50 }}
              transition={{ duration: 0.45, ease: "easeInOut" }}
              className="w-full p-5 sm:p-8 lg:p-10"
            >
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                {/* Left Slide Info */}
                <div className="lg:col-span-8 min-w-0">
                  <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
                    <Sparkles className="h-3.5 w-3.5 shrink-0" />
                    <span>{HERO_SLIDES[currentSlide].badge}</span>
                    <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
                  </div>

                  <h1 className="text-xl sm:text-3xl lg:text-4xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                    {HERO_SLIDES[currentSlide].title}
                  </h1>

                  <p className="mt-2 text-xs sm:text-base font-medium text-slate-600 dark:text-slate-300 line-clamp-2 max-w-2xl">
                    {HERO_SLIDES[currentSlide].subtitle}
                  </p>

                  {/* Highlights Matrix */}
                  <div className="mt-4 flex flex-wrap items-center gap-2 sm:gap-3 text-xs font-bold">
                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <Trophy className="h-4 w-4 text-amber-500 shrink-0" />
                      <span className="truncate">{HERO_SLIDES[currentSlide].prizePool}</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200">
                      <Building2 className="h-4 w-4 text-blue-500 shrink-0" />
                      <span className="truncate">{HERO_SLIDES[currentSlide].host}</span>
                    </div>

                    <div className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-emerald-600 dark:border-slate-800 dark:bg-slate-900 dark:text-emerald-400">
                      <CheckCircle2 className="h-4 w-4 shrink-0" />
                      <span className="truncate">{HERO_SLIDES[currentSlide].perk}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-6 flex flex-wrap items-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate(HERO_SLIDES[currentSlide].link)}
                      className={`inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r ${HERO_SLIDES[currentSlide].gradient} px-6 py-3 text-xs sm:text-sm font-black text-white shadow-lg shadow-indigo-500/25 hover:opacity-95 transition-transform active:scale-95`}
                    >
                      <span>{HERO_SLIDES[currentSlide].ctaText}</span>
                      <ArrowRight className="h-4 w-4" />
                    </button>

                    <button
                      type="button"
                      onClick={() => navigate("/hackathons")}
                      className="inline-flex items-center justify-center gap-1.5 rounded-2xl border border-slate-200 px-4 py-3 text-xs sm:text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 transition-colors"
                    >
                      <span>View All Opportunities</span>
                    </button>
                  </div>
                </div>

                {/* Right Slide Visual Card */}
                <div className="hidden lg:flex lg:col-span-4 items-center justify-center">
                  <div
                    className={`relative flex h-52 w-52 items-center justify-center rounded-3xl bg-gradient-to-br ${HERO_SLIDES[currentSlide].gradient} p-8 text-white shadow-2xl`}
                    style={{ boxShadow: `0 20px 40px ${HERO_SLIDES[currentSlide].glowColor}` }}
                  >
                    <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/20 blur-xl pointer-events-none" />
                    <div className="text-center">
                      <div className="mx-auto mb-2 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/20 text-3xl font-black backdrop-blur-md">
                        {HERO_SLIDES[currentSlide].logoText}
                      </div>
                      <span className="text-xs font-bold uppercase tracking-widest text-white/90">
                        {HERO_SLIDES[currentSlide].host}
                      </span>
                      <span className="mt-1 block text-[11px] text-white/80 font-medium">
                        {HERO_SLIDES[currentSlide].tag}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Carousel Navigation Arrows & Indicators */}
        <div className="flex items-center justify-between border-t border-slate-100 px-4 py-3 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/50">
          {/* Previous / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={prevSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Previous slide"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={nextSlide}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 transition"
              title="Next slide"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex items-center gap-1.5">
            {HERO_SLIDES.map((slide, idx) => (
              <button
                key={slide.id}
                type="button"
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx
                    ? "w-7 bg-indigo-600 dark:bg-cyan-400"
                    : "w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400"
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          {/* Slide Counter */}
          <div className="text-[11px] font-bold text-slate-500">
            <span>{currentSlide + 1}</span> / <span>{HERO_SLIDES.length}</span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. EXPLORE OPPORTUNITIES CATEGORY TILES (Unstop Grid) */}
      {/* ========================================================================= */}
      <div className="mb-6 sm:mb-10 lg:mb-12">
        <div className="mb-5 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-[11px] font-black uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
              Explore by Path
            </span>
            <h2 className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white">
              Discover Opportunities
            </h2>
          </div>
          <span className="text-xs text-slate-500 font-medium">
            Tailored tracks for college students and early-career software engineers
          </span>
        </div>

        <div className="grid grid-cols-2 min-[640px]:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {QUICK_CATEGORIES.map((cat, i) => {
            const Icon = cat.icon;
            return (
              <Link
                key={i}
                to={cat.link}
                className={`group flex flex-col justify-between rounded-2xl border ${cat.borderColor} ${cat.bgLight} p-3.5 sm:p-4 shadow-sm transition-all hover:-translate-y-1 hover:shadow-md backdrop-blur-sm`}
              >
                <div>
                  <div className={`mb-3 inline-flex rounded-xl bg-gradient-to-r ${cat.color} p-2.5 text-white shadow-md shadow-indigo-500/20 group-hover:scale-110 transition-transform`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400 leading-snug">
                    {cat.title}
                  </h3>
                  <p className="mt-1 text-[10px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1">
                    {cat.subtitle}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-slate-200/50 pt-2 text-[10px] font-bold text-indigo-600 dark:text-cyan-400 dark:border-slate-800/60">
                  <span className="truncate">{cat.count}</span>
                  <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform shrink-0" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 3. UNLOCK YOUR CAREER SECTION (Requested Signature Section) */}
      {/* ========================================================================= */}
      <div className="mb-6 sm:mb-10 lg:mb-14">
        <div className="relative mb-8 text-center max-w-3xl mx-auto">
          <div className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3.5 py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
            <Target className="h-3.5 w-3.5" />
            <span>Playground of Opportunities</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-slate-900 dark:text-white">
            Unlock Your Career
          </h2>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
            Learn, practice, compete and get hired. Everything you need to transform your technical skills into high-paying engineering offers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {UNLOCK_CAREER_CARDS.map((card, idx) => {
            const CardIcon = card.icon;
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -4 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-5 sm:p-6 shadow-sm transition-all hover:border-indigo-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-cyan-500/50"
              >
                {/* Glowing Top Accent */}
                <div className={`absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r ${card.gradient}`} />

                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-2xl bg-gradient-to-r ${card.gradient} p-3 text-white shadow-md group-hover:scale-105 transition-transform`}>
                      <CardIcon className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-extrabold uppercase tracking-wider text-slate-600 dark:bg-slate-900 dark:text-slate-300">
                      {card.pillar}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-black text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400">
                    {card.title}
                  </h3>

                  <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Bullet Checklist */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 dark:border-slate-900">
                    {card.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                        <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 pt-2">
                  <Link
                    to={card.link}
                    className={`flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r ${card.gradient} py-2.5 px-4 text-xs font-bold text-white shadow-md hover:opacity-95 transition-opacity`}
                  >
                    <span>{card.buttonText}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 4. FEATURED LIVE HACKATHONS PREVIEW */}
      {/* ========================================================================= */}
      <div className="mb-6 sm:mb-10 lg:mb-14">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-rose-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-rose-600 dark:text-rose-400">
                Live Developer Competitions
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Trending Hackathons
            </h2>
          </div>

          <Link
            to="/hackathons"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>View All Hackathons</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(displayedHackathons.length > 0 ? displayedHackathons : HERO_SLIDES.slice(0, 3)).map((hack, idx) => (
            <div
              key={hack._id || idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-full bg-violet-500/10 border border-violet-500/20 px-2.5 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                    {hack.mode || "Online"}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 dark:text-amber-400">
                    <Trophy className="h-3.5 w-3.5" />
                    <span>{hack.prizePool || "₹5,00,000"}</span>
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {hack.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{hack.host || "Premier Tech Sponsor"}</p>

                <p className="mt-2 text-xs text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                  {hack.description || hack.subtitle || "Build working software and win cash bounties."}
                </p>
              </div>

              <div className="mt-5 flex items-center justify-between border-t border-slate-100 pt-3 dark:border-slate-900">
                <span className="text-[11px] font-semibold text-slate-500">
                  {hack.daysLeft ? `${hack.daysLeft} days left` : "Open Now"}
                </span>
                <Link
                  to="/hackathons"
                  className="inline-flex items-center gap-1 rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-800 hover:bg-indigo-600 hover:text-white dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-cyan-500 dark:hover:text-slate-950 transition-colors"
                >
                  <span>Participate</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 5. FEATURED INTERNSHIPS PREVIEW */}
      {/* ========================================================================= */}
      <div className="mb-6 sm:mb-10 lg:mb-14">
        <div className="mb-4 sm:mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
              <span className="text-[11px] font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
                Early Career Programs
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Hot Internships with PPOs
            </h2>
          </div>

          <Link
            to="/internships"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 dark:hover:text-cyan-300"
          >
            <span>View All Internships</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {(featuredInternships.length > 0 ? featuredInternships : [
            {
              title: "Full-Stack AI Developer Intern",
              company: { companyName: "DeepMind Tech Labs" },
              location: "Remote / Hybrid",
              salary: "35000",
            },
            {
              title: "UI/UX Design Systems Intern",
              company: { companyName: "HyperDesign Studio" },
              location: "100% Remote",
              salary: "28000",
            },
            {
              title: "Backend Cloud Systems Intern",
              company: { companyName: "CloudScale Infra" },
              location: "Hyderabad / Hybrid",
              salary: "30000",
            },
          ]).map((intern, idx) => (
            <div
              key={idx}
              className="flex flex-col justify-between rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div>
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 text-xs font-extrabold text-emerald-600 dark:text-emerald-400">
                    ₹{intern.salary ? Number(intern.salary).toLocaleString("en-IN") : "30,000"} / mo
                  </span>
                  <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                    PPO Included
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white line-clamp-1">
                  {intern.title}
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">{intern.company?.companyName || "Verified Tech Firm"}</p>

                <div className="mt-3 flex items-center gap-2 text-xs text-slate-500">
                  <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{intern.location || "Remote, India"}</span>
                </div>
              </div>

              <div className="mt-5 border-t border-slate-100 pt-3 dark:border-slate-900 flex items-center justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600 dark:text-cyan-400">
                  Actively Recruiting
                </span>
                <Link
                  to="/internships"
                  className="inline-flex items-center gap-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-sm hover:opacity-95 transition"
                >
                  <span>Apply Now</span>
                  <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 6. IMPACT & PLATFORM METRICS NUMBERS (Unstop Trust Section) */}
      {/* ========================================================================= */}
      <div className="mb-5 sm:mb-8 lg:mb-12 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 p-4 sm:p-8 lg:p-10 backdrop-blur-xl dark:border-indigo-500/30">
        <div className="mb-4 sm:mb-8 text-center max-w-2xl mx-auto">
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-widest text-indigo-600 dark:text-cyan-400">
            Trusted by Top Talent & Global Enterprises
          </span>
          <h2 className="mt-1 text-lg sm:text-3xl font-black text-slate-900 dark:text-white">
            Connecting Talent, Colleges & Top Recruiters
          </h2>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-center">
          <div className="rounded-2xl border border-white/40 bg-white/70 p-3 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="block text-xl sm:text-4xl font-black text-indigo-600 dark:text-cyan-400">
              10M+
            </span>
            <span className="mt-1 block text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Active Learners
            </span>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/70 p-3 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="block text-xl sm:text-4xl font-black text-emerald-600 dark:text-emerald-400">
              50,000+
            </span>
            <span className="mt-1 block text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Opportunities Hosted
            </span>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/70 p-3 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="block text-xl sm:text-4xl font-black text-violet-600 dark:text-violet-400">
              2,500+
            </span>
            <span className="mt-1 block text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Hiring Partners
            </span>
          </div>

          <div className="rounded-2xl border border-white/40 bg-white/70 p-3 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <span className="block text-xl sm:text-4xl font-black text-amber-600 dark:text-amber-400">
              ₹25 Cr+
            </span>
            <span className="mt-1 block text-[10px] sm:text-xs font-bold text-slate-600 dark:text-slate-300 uppercase tracking-wider">
              Won in Bounties
            </span>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 7. BOTTOM CALL TO ACTION BANNER */}
      {/* ========================================================================= */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-700 p-5 sm:p-10 lg:p-12 text-white shadow-2xl text-center">
        <div className="absolute -right-12 -top-12 h-64 w-64 rounded-full bg-white/10 blur-3xl pointer-events-none" />
        <div className="absolute -left-12 -bottom-12 h-64 w-64 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-2xl mx-auto">
          <div className="mb-2 sm:mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 sm:px-4 py-1 text-xs font-bold backdrop-blur-md">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Join 10M+ Early-Career Professionals</span>
          </div>

          <h2 className="text-xl sm:text-4xl font-black tracking-tight leading-tight">
            Ready to Unlock Your Career?
          </h2>

          <p className="mt-2 sm:mt-3 text-xs sm:text-base font-medium text-white/90">
            Create your free account to access verified skill assessments, apply for high-stipend internships, and build software in global hackathons.
          </p>

          <div className="mt-5 sm:mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-2xl bg-white px-5 sm:px-6 py-2.5 sm:py-3 text-xs sm:text-sm font-black text-indigo-700 shadow-xl hover:bg-slate-100 transition active:scale-95"
            >
              <span>Get Started for Free</span>
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              to="/jobs"
              className="inline-flex items-center gap-2 rounded-2xl border border-white/30 bg-white/10 px-4 sm:px-5 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-white/20 backdrop-blur-sm transition"
            >
              <span>Explore All Jobs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExploreHome;
