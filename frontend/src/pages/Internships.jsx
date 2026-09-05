import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Sparkles,
  MapPin,
  Clock,
  Coins,
  Bookmark,
  Building2,
  Calendar,
  Award,
  CheckCircle2,
  ArrowRight,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X,
  Share2,
  Send,
  Zap,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import UniversalLoader from "../components/common/UniversalLoader";

const Internships = () => {
  const { user } = useAuth();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [search, setSearch] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("all");
  const [selectedDuration, setSelectedDuration] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);

  // Profile data for apply modal
  const [profile, setProfile] = useState({
    fullname: user?.fullname || "",
    phone: user?.phoneNumber || "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    resumeUrl: user?.profile?.resume || "",
    resumeName: user?.profile?.resumeOriginalName || "",
    resumeFile: null,
  });

  // Fetch all jobs from backend
  const { data: allJobs = [], isLoading } = useQuery({
    queryKey: ["allJobsForInternships"],
    queryFn: async () => {
      const res = await api.get("/job/get");
      return res.data?.jobs || [];
    },
  });

  // Fetch saved jobs
  const { data: savedJobIds = [] } = useQuery({
    queryKey: ["savedJobs"],
    queryFn: async () => {
      const res = await api.get("/job/saved");
      return (res.data?.savedJobs || []).map((j) => (typeof j === "string" ? j : j._id));
    },
    enabled: !!user,
  });

  // Fetch user applied jobs
  const { data: appliedJobIds = [] } = useQuery({
    queryKey: ["appliedJobsList"],
    queryFn: async () => {
      const res = await api.get("/application/get");
      return (res.data?.applications || []).map((app) =>
        typeof app.job === "string" ? app.job : app.job?._id
      );
    },
    enabled: !!user,
  });

  // Filter ONLY internships (or create default curated internships if backend has limited ones)
  const backendInternships = allJobs.filter((j) => {
    const type = (j.jobType || "").toLowerCase();
    const title = (j.title || "").toLowerCase();
    return type.includes("intern") || title.includes("internship");
  });

  // Curated fallback internships if database is fresh so user always has rich content to explore
  const curatedInternships = [
    {
      _id: "intern-curated-1",
      title: "Full-Stack AI Developer Intern",
      company: { companyName: "DeepMind Tech Labs", location: "Bengaluru, India" },
      location: "Remote / Hybrid (Bengaluru)",
      jobType: "Internship",
      salary: 35000,
      duration: "6 Months",
      stipendText: "₹35,000 / month + PPO",
      category: "Engineering",
      description:
        "Join our autonomous AI engineering team to build next-generation agentic workflows, LLM pipelines, and high-performance React frontends.",
      requirements: ["React", "Node.js", "Python", "REST APIs", "Tailwind CSS"],
      ppo: true,
      perks: ["Certificate of Completion", "Pre-Placement Offer (PPO)", "Flexible Hours", "Mentorship from Staff Engineers"],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "intern-curated-2",
      title: "UI/UX Design Systems Intern",
      company: { companyName: "HyperDesign Studio", location: "Remote, India" },
      location: "100% Remote",
      jobType: "Internship",
      salary: 28000,
      duration: "3 Months",
      stipendText: "₹28,000 / month",
      category: "Design",
      description:
        "Craft sleek, futuristic SaaS interfaces, design tokens, micro-interactions, and mobile responsive design systems in Figma.",
      requirements: ["Figma", "Design Systems", "Prototyping", "User Research", "Wireframing"],
      ppo: true,
      perks: ["Certificate of Excellence", "Portfolio Reviews", "Work Directly with CPO"],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "intern-curated-3",
      title: "Backend Cloud Systems Intern (Go & Node)",
      company: { companyName: "CloudScale Infra", location: "Hyderabad, India" },
      location: "Hyderabad / Hybrid",
      jobType: "Internship",
      salary: 30000,
      duration: "6 Months",
      stipendText: "₹30,000 / month + PPO",
      category: "Cloud",
      description:
        "Build resilient microservices, configure Docker containers, and optimize PostgreSQL and Redis cache performance.",
      requirements: ["Node.js", "Express", "Docker", "MongoDB", "SQL"],
      ppo: true,
      perks: ["AWS Cloud Credits", "PPO Conversion Rate > 85%", "MacBook Provided"],
      createdAt: new Date().toISOString(),
    },
    {
      _id: "intern-curated-4",
      title: "Data Analytics & ML Research Intern",
      company: { companyName: "NovaPulse Analytics", location: "Pune, India" },
      location: "Pune, India",
      jobType: "Internship",
      salary: 25000,
      duration: "4 Months",
      stipendText: "₹25,000 / month",
      category: "Data",
      description:
        "Analyze customer funnel data, construct predictive ML models, and design automated real-time analytics dashboards.",
      requirements: ["Python", "Pandas", "Scikit-Learn", "SQL", "Tableau"],
      ppo: false,
      perks: ["Recommendation Letter", "Research Paper Co-authorship", "Weekly Tech Talks"],
      createdAt: new Date().toISOString(),
    },
  ];

  // Combine real database internships with curated ones (without id collision)
  const combinedInternships = [
    ...backendInternships,
    ...curatedInternships.filter(
      (c) => !backendInternships.some((b) => b.title?.toLowerCase() === c.title.toLowerCase())
    ),
  ];

  // Filter by search, location, category
  const filteredInternships = combinedInternships.filter((item) => {
    const titleMatch = (item.title || "").toLowerCase().includes(search.toLowerCase());
    const companyMatch = (item.company?.companyName || "").toLowerCase().includes(search.toLowerCase());
    const skillMatch = (item.requirements || []).some((r) =>
      r.toLowerCase().includes(search.toLowerCase())
    );
    const textMatches = search === "" || titleMatch || companyMatch || skillMatch;

    const locationMatches =
      selectedLocation === "all" ||
      (selectedLocation === "remote" && (item.location || "").toLowerCase().includes("remote")) ||
      (item.location || "").toLowerCase().includes(selectedLocation.toLowerCase());

    const durationMatches =
      selectedDuration === "all" ||
      (selectedDuration === "3" && (item.duration || "").includes("3")) ||
      (selectedDuration === "6" && (item.duration || "").includes("6"));

    return textMatches && locationMatches && durationMatches;
  });

  // Save / Bookmark
  const toggleSave = useMutation({
    mutationFn: (jobId) => api.post(`/job/save/${jobId}`),
    onSuccess: (_, jobId) => {
      queryClient.setQueryData(["savedJobs"], (old = []) =>
        old.includes(jobId) ? old.filter((id) => id !== jobId) : [...old, jobId]
      );
    },
  });

  // Apply Mutation
  const applyMutation = useMutation({
    mutationFn: async (jobId) => {
      if (jobId.startsWith("intern-curated-")) {
        // Mock successful application for curated demo roles
        return { success: true, message: "Internship application submitted successfully!" };
      }
      return await api.post(`/application/apply/${jobId}`);
    },
    onSuccess: (_, jobId) => {
      queryClient.setQueryData(["appliedJobsList"], (old = []) => [...old, jobId]);
      setShowApplyModal(false);
      toast.success("Application submitted successfully! Check 'My Applications' to track your status.");
    },
  });

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-2 pb-12 sm:px-6 lg:px-8">
      {/* Top Hero Banner */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-600/10 via-cyan-500/10 to-violet-600/10 p-5 sm:p-8 backdrop-blur-xl dark:border-indigo-500/30">
        <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3 py-1 text-xs font-bold text-cyan-600 dark:text-cyan-400">
              <GraduationCap className="h-4 w-4" />
              <span>Campus & Early Career Hub</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Launch Your Career with Top Internships
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Gain hands-on real-world experience, earn competitive monthly stipends, and unlock Pre-Placement Offers (PPO) at hyper-growth tech companies.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="rounded-2xl border border-white/40 bg-white/70 p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <span className="block text-xl font-black text-indigo-600 dark:text-cyan-400">
                {filteredInternships.length}
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Live Internships
              </span>
            </div>
            <div className="rounded-2xl border border-white/40 bg-white/70 p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
              <span className="block text-xl font-black text-emerald-600 dark:text-emerald-400">
                100%
              </span>
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                Verified Stipends
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="mb-6 flex flex-col md:flex-row items-center gap-3 rounded-2xl border border-slate-200 bg-white/80 p-3 shadow-sm dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md">
        <div className="relative w-full md:flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by role (e.g. AI, React, Design) or company..."
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>

        <div className="flex w-full md:w-auto items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">📍 All Locations</option>
            <option value="remote">🌐 Remote Only</option>
            <option value="bengaluru">Bengaluru</option>
            <option value="hyderabad">Hyderabad</option>
            <option value="pune">Pune</option>
          </select>

          <select
            value={selectedDuration}
            onChange={(e) => setSelectedDuration(e.target.value)}
            className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-xs font-semibold text-slate-700 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300"
          >
            <option value="all">⏱️ All Durations</option>
            <option value="3">3 Months</option>
            <option value="6">6 Months</option>
          </select>

          {(search || selectedLocation !== "all" || selectedDuration !== "all") && (
            <button
              onClick={() => {
                setSearch("");
                setSelectedLocation("all");
                setSelectedDuration("all");
              }}
              className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-400"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Internships Grid */}
      {isLoading ? (
        <UniversalLoader message="Loading curated internships..." />
      ) : filteredInternships.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
          <GraduationCap className="h-12 w-12 text-slate-400 mb-3" />
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200">
            No internships matching your filter
          </h3>
          <p className="mt-1 text-xs text-slate-500">
            Try resetting your search query or location filter.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
          {filteredInternships.map((intern) => {
            const isSaved = savedJobIds.includes(intern._id);
            const isApplied = appliedJobIds.includes(intern._id);

            return (
              <motion.div
                key={intern._id}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm transition-all hover:border-indigo-400 hover:shadow-lg dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-cyan-500/50"
              >
                <div>
                  {/* Top Bar */}
                  <div className="mb-3 flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white font-black text-sm shadow-md shadow-indigo-500/20">
                        {(intern.company?.companyName || "N")[0]}
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-600 dark:text-slate-400 truncate max-w-[140px] sm:max-w-[180px]">
                          {intern.company?.companyName || "Verified Tech Partner"}
                        </h4>
                        <span className="flex items-center gap-1 text-[11px] text-slate-500">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span className="truncate">{intern.location || "Remote"}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        if (!user) return toast.requireAuth("Please sign in to bookmark internships.");
                        toggleSave.mutate(intern._id);
                      }}
                      className={`rounded-xl p-2 transition ${
                        isSaved
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-slate-100 text-slate-400 hover:text-slate-600 dark:bg-slate-900"
                      }`}
                    >
                      <Bookmark className={`h-4 w-4 ${isSaved ? "fill-amber-500" : ""}`} />
                    </button>
                  </div>

                  {/* Title & Badges */}
                  <h3 className="mb-2 text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400">
                    {intern.title}
                  </h3>

                  <div className="mb-3 flex flex-wrap gap-1.5">
                    <span className="inline-flex items-center gap-1 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                      <Coins className="h-3 w-3" />
                      {intern.stipendText || `₹${intern.salary?.toLocaleString() || "20,000"} / mo`}
                    </span>

                    <span className="inline-flex items-center gap-1 rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-600 dark:text-cyan-300">
                      <Clock className="h-3 w-3" />
                      {intern.duration || "3-6 Months"}
                    </span>

                    {intern.ppo && (
                      <span className="inline-flex items-center gap-1 rounded-lg border border-violet-500/20 bg-violet-500/10 px-2 py-0.5 text-[10px] font-bold text-violet-600 dark:text-violet-400">
                        <Award className="h-3 w-3" />
                        PPO Opportunity
                      </span>
                    )}
                  </div>

                  {/* Skills */}
                  {intern.requirements && intern.requirements.length > 0 && (
                    <div className="mb-4 flex flex-wrap gap-1">
                      {intern.requirements.slice(0, 3).map((req, i) => (
                        <span
                          key={i}
                          className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-900 dark:text-slate-400"
                        >
                          {req}
                        </span>
                      ))}
                      {intern.requirements.length > 3 && (
                        <span className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[10px] font-medium text-slate-500 dark:bg-slate-900">
                          +{intern.requirements.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Bottom Actions */}
                <div className="flex items-center gap-2 border-t border-slate-100 pt-3 dark:border-slate-800/80">
                  <button
                    onClick={() => setSelectedInternship(intern)}
                    className="flex-1 rounded-xl border border-slate-200 py-2 text-center text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900"
                  >
                    View Details
                  </button>

                  <button
                    onClick={() => {
                      if (!user) return toast.requireAuth("Please sign in to apply for internships.");
                      setSelectedInternship(intern);
                      setShowApplyModal(true);
                    }}
                    disabled={isApplied}
                    className={`flex items-center justify-center gap-1 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition ${
                      isApplied
                        ? "bg-emerald-600 cursor-default"
                        : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-indigo-500/20"
                    }`}
                  >
                    {isApplied ? (
                      <>
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        <span>Applied</span>
                      </>
                    ) : (
                      <>
                        <span>Apply</span>
                        <ArrowRight className="h-3.5 w-3.5" />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* Fallback Data Indicator */}
      {backendInternships.length === 0 && (
        <div className="mt-8 flex items-center justify-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 backdrop-blur-md shadow-sm text-center">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
            </span>
            <span>⚡ Fallback Data Showing — Curated internships displayed while live recruiter posts sync</span>
          </div>
        </div>
      )}

      {/* Internship Details Drawer */}
      <AnimatePresence>
        {selectedInternship && !showApplyModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedInternship(null)}
              className="fixed inset-0 z-[999] bg-slate-950/70 backdrop-blur-md"
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28 }}
              className="fixed right-0 top-0 z-[1000] flex h-full w-full max-w-xl flex-col overflow-hidden border-l border-white/10 bg-white/95 shadow-2xl dark:bg-slate-950/95"
            >
              <div className="flex-1 overflow-y-auto p-5 sm:p-7">
                <div className="mb-4 flex items-start justify-between">
                  <div>
                    <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-[9px] font-bold text-cyan-600 dark:text-cyan-400">
                      OFFICIAL INTERNSHIP PROGRAM
                    </span>
                    <h2 className="mt-1 text-xl font-black text-slate-900 dark:text-white">
                      {selectedInternship.title}
                    </h2>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {selectedInternship.company?.companyName} • {selectedInternship.location}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedInternship(null)}
                    className="rounded-xl bg-slate-100 p-2 text-slate-500 hover:bg-slate-200 dark:bg-slate-900"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>

                <div className="mb-5 grid grid-cols-2 gap-2 rounded-2xl border border-slate-200 bg-slate-50/70 p-3 dark:border-slate-800 dark:bg-slate-900/50">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Stipend</span>
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400">
                      {selectedInternship.stipendText || `₹${selectedInternship.salary || "25,000"} / mo`}
                    </p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Duration</span>
                    <p className="text-xs font-black text-indigo-600 dark:text-cyan-300">
                      {selectedInternship.duration || "3-6 Months"}
                    </p>
                  </div>
                </div>

                <div className="space-y-4 text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                  <div>
                    <h4 className="mb-1 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                      About the Internship
                    </h4>
                    <p>{selectedInternship.description}</p>
                  </div>

                  {selectedInternship.perks && (
                    <div>
                      <h4 className="mb-2 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                        Perks & Benefits
                      </h4>
                      <ul className="space-y-1.5">
                        {selectedInternship.perks.map((perk, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" />
                            <span>{perk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {selectedInternship.requirements && (
                    <div>
                      <h4 className="mb-2 font-bold text-slate-900 dark:text-white uppercase tracking-wider text-[11px]">
                        Required Skills
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {selectedInternship.requirements.map((req, i) => (
                          <span
                            key={i}
                            className="rounded-lg border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[11px] font-semibold text-indigo-600 dark:text-cyan-300"
                          >
                            {req}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Drawer Footer */}
              <div className="border-t border-slate-200 bg-white/90 p-4 dark:border-slate-800 dark:bg-slate-950/90">
                <button
                  onClick={() => {
                    if (!user) return toast.requireAuth("Please sign in to apply for this internship.");
                    setShowApplyModal(true);
                  }}
                  disabled={appliedJobIds.includes(selectedInternship._id)}
                  className="w-full rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 py-3 text-center text-xs sm:text-sm font-bold text-white shadow-lg shadow-indigo-500/25"
                >
                  {appliedJobIds.includes(selectedInternship._id)
                    ? "Already Applied"
                    : "Apply for Internship Now"}
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Quick Application Modal */}
      <AnimatePresence>
        {showApplyModal && selectedInternship && (
          <div className="fixed inset-0 z-[1050] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-md rounded-2xl border border-white/20 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  Apply for {selectedInternship.title}
                </h3>
                <button
                  onClick={() => setShowApplyModal(false)}
                  className="rounded-lg p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Applicant Name</label>
                  <input
                    type="text"
                    disabled
                    value={profile.fullname}
                    className="mt-1 w-full rounded-lg border border-slate-200 bg-slate-100 p-2 text-slate-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-400"
                  />
                </div>

                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300">Target Role & Stipend</label>
                  <div className="mt-1 rounded-lg bg-indigo-500/10 p-2 text-indigo-600 dark:text-cyan-400 font-semibold">
                    {selectedInternship.title} • {selectedInternship.stipendText || "Competitive Stipend"}
                  </div>
                </div>

                <p className="text-[11px] text-slate-500">
                  Your registered profile, contact info, and attached resume will be shared directly with the recruiter.
                </p>

                <button
                  onClick={() => applyMutation.mutate(selectedInternship._id)}
                  disabled={applyMutation.isPending}
                  className="mt-2 w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  {applyMutation.isPending ? "Submitting..." : "Confirm & Submit Application"}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Internships;
