import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  Trophy,
  Award,
  GraduationCap,
  PlusCircle,
  Trash2,
  Users,
  Calendar,
  Sparkles,
  ExternalLink,
  ChevronRight,
  X,
} from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

/**
 * RecruiterOpportunitiesHub Component
 * Allows employers to manage:
 * 1. Internships (post internship, view applicants)
 * 2. Hosted Hackathons (create hackathons, track registrations)
 * 3. Custom Technical Assessments / Skill Quizzes (create candidate quiz, track attempts)
 */
const RecruiterOpportunitiesHub = ({ activeInternships = [] }) => {
  const navigate = useNavigate();
  const toast = useToast();
  const queryClient = useQueryClient();

  const [activeTab, setActiveTab] = useState("internships"); // 'internships' | 'hackathons' | 'quizzes'
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // Fetch recruiter's hackathons
  const { data: myHackathons = [], isLoading: loadingHackathons } = useQuery({
    queryKey: ["recruiter-my-hackathons"],
    queryFn: async () => {
      const res = await api.get("/hackathon/my-hackathons");
      return res.data?.success ? res.data.hackathons : [];
    },
  });

  // Fetch recruiter's custom quizzes
  const { data: myQuizzes = [], isLoading: loadingQuizzes } = useQuery({
    queryKey: ["recruiter-my-quizzes"],
    queryFn: async () => {
      const res = await api.get("/quiz/my-quizzes");
      return res.data?.success ? res.data.quizzes : [];
    },
  });

  // Hackathon Creation Form State
  const [hackForm, setHackForm] = useState({
    title: "",
    host: "",
    prizePool: "₹2,50,000",
    firstPrize: "₹1,25,000",
    mode: "Online (Global)",
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    daysLeft: 14,
    tags: "Full-Stack, React, Node",
    description: "",
  });

  // Quiz Creation Form State
  const [quizForm, setQuizForm] = useState({
    title: "",
    description: "",
    category: "Engineering",
    level: "Intermediate",
    timeLimit: 120,
    questions: [
      {
        q: "Which HTTP header is standard for delivering secure JWT sessions to browsers?",
        options: [
          "Set-Cookie with HttpOnly; SameSite=Lax",
          "Authorization: Basic only",
          "X-Forwarded-User",
          "Cache-Control: no-cache",
        ],
        answer: 0,
        explanation: "HttpOnly cookies prevent client-side XSS script access to session tokens.",
      },
    ],
  });

  // Create Hackathon Mutation
  const createHackathonMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/hackathon/create", hackForm);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Hackathon challenge published successfully!");
      setShowHackathonModal(false);
      queryClient.invalidateQueries(["recruiter-my-hackathons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create hackathon.");
    },
  });

  // Delete Hackathon Mutation
  const deleteHackathonMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/hackathon/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Hackathon deleted.");
      queryClient.invalidateQueries(["recruiter-my-hackathons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete hackathon.");
    },
  });

  // Create Quiz Mutation
  const createQuizMutation = useMutation({
    mutationFn: async () => {
      const res = await api.post("/quiz/create", quizForm);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Skill assessment quiz created successfully!");
      setShowQuizModal(false);
      queryClient.invalidateQueries(["recruiter-my-quizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create quiz.");
    },
  });

  // Delete Quiz Mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/quiz/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Assessment quiz deleted.");
      queryClient.invalidateQueries(["recruiter-my-quizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete quiz.");
    },
  });

  return (
    <div className="glass-panel p-5 rounded-3xl space-y-5 border border-slate-200/80 dark:border-slate-800">
      {/* Header and Sub-Tab Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-amber-500" />
            <h3 className="font-extrabold text-slate-900 dark:text-white text-sm sm:text-base">
              Talent Sourcing & Opportunity Management
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Host hackathons, publish college internships, and design screening quizzes for top applicants.
          </p>
        </div>

        {/* Sub-Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setActiveTab("internships")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
              activeTab === "internships"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <GraduationCap size={13} />
            <span>Internships ({activeInternships.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("hackathons")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
              activeTab === "hackathons"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Trophy size={13} />
            <span>Hackathons ({myHackathons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("quizzes")}
            className={`flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition shrink-0 ${
              activeTab === "quizzes"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Award size={13} />
            <span>Screening Quizzes ({myQuizzes.length})</span>
          </button>
        </div>
      </div>

      {/* 1. INTERNSHIPS SUB-TAB */}
      {activeTab === "internships" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Active Internship Postings
            </span>
            <button
              type="button"
              onClick={() => navigate("/post-job?type=internship")}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-blue-700 hover:to-indigo-700"
            >
              <PlusCircle size={13} />
              <span>Post New Internship</span>
            </button>
          </div>

          {activeInternships.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <GraduationCap size={24} className="mx-auto text-slate-400 mb-1.5" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No active internships posted</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                Attract top students and fresh grads by posting paid internship openings with mentorship.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {activeInternships.map((intern) => (
                <div
                  key={intern._id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 bg-white/60 dark:bg-slate-900/60 space-y-2.5 flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
                        {intern.salary}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {intern.location}
                      </span>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white mt-1.5 line-clamp-1">
                      {intern.title}
                    </h4>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px]">
                    <span className="font-bold text-indigo-600 dark:text-cyan-400">
                      {intern.applications?.length || 0} Applicants
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/recruiter-jobs?jobId=${intern._id}`)}
                      className="text-slate-500 hover:text-slate-900 dark:hover:text-white font-semibold flex items-center gap-0.5"
                    >
                      <span>Pipeline</span>
                      <ChevronRight size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 2. HACKATHONS SUB-TAB */}
      {activeTab === "hackathons" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Your Hosted Challenges & Hackathons
            </span>
            <button
              type="button"
              onClick={() => setShowHackathonModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-amber-600 hover:to-orange-700"
            >
              <PlusCircle size={13} />
              <span>Host a Hackathon</span>
            </button>
          </div>

          {myHackathons.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Trophy size={24} className="mx-auto text-amber-500 mb-1.5" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No hackathons hosted yet</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                Host coding hackathons and hiring challenges to recruit verified top 1% developers directly.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {myHackathons.map((hack) => (
                <div
                  key={hack._id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 bg-white/60 dark:bg-slate-900/60 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-amber-500/10 px-2 py-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400">
                        Prize: {hack.prizePool}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteHackathonMutation.mutate(hack._id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {hack.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {hack.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-indigo-600 dark:text-cyan-400">
                      <Users size={12} />
                      <span>{hack.participantsCount || 0} Registered</span>
                    </span>
                    <span className="font-semibold">{hack.mode}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 3. SCREENING QUIZZES SUB-TAB */}
      {activeTab === "quizzes" && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
              Candidate Screening Quizzes
            </span>
            <button
              type="button"
              onClick={() => setShowQuizModal(true)}
              className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 px-3 py-1.5 text-xs font-bold text-white shadow-xs hover:from-cyan-700 hover:to-blue-700"
            >
              <PlusCircle size={13} />
              <span>Create Screening Quiz</span>
            </button>
          </div>

          {myQuizzes.length === 0 ? (
            <div className="p-6 text-center rounded-2xl border border-dashed border-slate-200 dark:border-slate-800">
              <Award size={24} className="mx-auto text-cyan-500 mb-1.5" />
              <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No custom screening quizzes</p>
              <p className="text-[11px] text-slate-400 max-w-sm mx-auto mt-0.5">
                Create MCQ technical assessments to automatically benchmark and pre-screen applicants.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {myQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="rounded-2xl border border-slate-200/80 dark:border-slate-800 p-4 bg-white/60 dark:bg-slate-900/60 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-start justify-between gap-2">
                      <span className="rounded-full bg-cyan-500/10 px-2 py-0.5 text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400">
                        {quiz.category} • {quiz.level}
                      </span>
                      <button
                        type="button"
                        onClick={() => deleteQuizMutation.mutate(quiz._id)}
                        className="text-slate-400 hover:text-rose-500 p-1 transition"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                    <h4 className="font-extrabold text-xs text-slate-900 dark:text-white line-clamp-1">
                      {quiz.title}
                    </h4>
                    <p className="text-[11px] text-slate-400 line-clamp-2">
                      {quiz.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500">
                    <span>{quiz.questions?.length || 0} Questions • {quiz.timeLimit}s</span>
                    <span className="font-bold text-emerald-600 dark:text-emerald-400">
                      {quiz.attemptsCount || 0} Attempts
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* CREATE HACKATHON MODAL */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <span>Host Company Hackathon</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowHackathonModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Hackathon Title *</label>
                <input
                  type="text"
                  required
                  value={hackForm.title}
                  onChange={(e) => setHackForm({ ...hackForm, title: e.target.value })}
                  placeholder="e.g. Acme Cloud Architecture Hackathon 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Host Name *</label>
                  <input
                    type="text"
                    required
                    value={hackForm.host}
                    onChange={(e) => setHackForm({ ...hackForm, host: e.target.value })}
                    placeholder="Your Company Name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Prize Pool *</label>
                  <input
                    type="text"
                    required
                    value={hackForm.prizePool}
                    onChange={(e) => setHackForm({ ...hackForm, prizePool: e.target.value })}
                    placeholder="₹2,50,000"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Start Date *</label>
                  <input
                    type="date"
                    required
                    value={hackForm.startDate}
                    onChange={(e) => setHackForm({ ...hackForm, startDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">End Date *</label>
                  <input
                    type="date"
                    required
                    value={hackForm.endDate}
                    onChange={(e) => setHackForm({ ...hackForm, endDate: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Challenge Description *</label>
                <textarea
                  rows={3}
                  required
                  value={hackForm.description}
                  onChange={(e) => setHackForm({ ...hackForm, description: e.target.value })}
                  placeholder="Outline the theme, guidelines, and evaluation criteria..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowHackathonModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createHackathonMutation.mutate()}
                disabled={createHackathonMutation.isPending}
                className="btn-primary rounded-xl px-4 py-2 text-xs font-bold"
              >
                {createHackathonMutation.isPending ? "Publishing..." : "Publish Hackathon"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE QUIZ MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-cyan-500" />
                <span>Create Technical Screening Quiz</span>
              </h3>
              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                className="text-slate-400 hover:text-slate-700 dark:hover:text-white"
              >
                <X size={16} />
              </button>
            </div>

            <div className="space-y-3 text-xs max-h-[60vh] overflow-y-auto pr-1">
              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Assessment Title *</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Senior Frontend Architecture Assessment"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Category</label>
                  <input
                    type="text"
                    value={quizForm.category}
                    onChange={(e) => setQuizForm({ ...quizForm, category: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Time Limit (Seconds)</label>
                  <input
                    type="number"
                    value={quizForm.timeLimit}
                    onChange={(e) => setQuizForm({ ...quizForm, timeLimit: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Description</label>
                <textarea
                  rows={2}
                  value={quizForm.description}
                  onChange={(e) => setQuizForm({ ...quizForm, description: e.target.value })}
                  placeholder="Candidate screening assessment for technical roles..."
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              {/* Sample Question */}
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2">
                <span className="font-bold text-indigo-600 dark:text-cyan-400 block">Question 1:</span>
                <input
                  type="text"
                  placeholder="Question text..."
                  value={quizForm.questions[0]?.q || ""}
                  onChange={(e) => {
                    const qCopy = [...quizForm.questions];
                    qCopy[0].q = e.target.value;
                    setQuizForm({ ...quizForm, questions: qCopy });
                  }}
                  className="w-full rounded-lg border border-slate-200 bg-white px-2.5 py-1.5 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white"
                />

                <div className="grid grid-cols-2 gap-2 pt-1">
                  {[0, 1, 2, 3].map((optIdx) => (
                    <input
                      key={optIdx}
                      type="text"
                      placeholder={`Option ${optIdx + 1}${optIdx === 0 ? " (Correct)" : ""}`}
                      value={quizForm.questions[0]?.options[optIdx] || ""}
                      onChange={(e) => {
                        const qCopy = [...quizForm.questions];
                        qCopy[0].options[optIdx] = e.target.value;
                        setQuizForm({ ...quizForm, questions: qCopy });
                      }}
                      className="rounded-lg border border-slate-200 bg-white px-2 py-1 dark:border-slate-600 dark:bg-slate-900 text-slate-900 dark:text-white text-[11px]"
                    />
                  ))}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
              <button
                type="button"
                onClick={() => setShowQuizModal(false)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold dark:border-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => createQuizMutation.mutate()}
                disabled={createQuizMutation.isPending}
                className="btn-primary rounded-xl px-4 py-2 text-xs font-bold"
              >
                {createQuizMutation.isPending ? "Creating..." : "Publish Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RecruiterOpportunitiesHub;
