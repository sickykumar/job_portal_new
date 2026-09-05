import React, { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
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
  Search,
  CheckCircle2,
  X,
} from "lucide-react";
import api from "../../services/api";
import { useToast } from "../../context/ToastContext";

/**
 * AdminOpportunitiesTab Component
 * Comprehensive management tab in Super Admin Dashboard for:
 * 1. Hackathons (create, list, delete, participant counts)
 * 2. Skill Assessment Quizzes (create, list, delete, pass metrics)
 * 3. Internships (platform-wide internships oversight)
 */
const AdminOpportunitiesTab = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
  const [subTab, setSubTab] = useState("hackathons"); // 'hackathons' | 'quizzes' | 'internships'
  const [showHackathonModal, setShowHackathonModal] = useState(false);
  const [showQuizModal, setShowQuizModal] = useState(false);

  // 1. Fetch Hackathons
  const { data: hackathons = [], isLoading: loadingHackathons } = useQuery({
    queryKey: ["admin-hackathons"],
    queryFn: async () => {
      const res = await api.get("/hackathon/get");
      return res.data?.success ? res.data.hackathons : [];
    },
  });

  // 2. Fetch Quizzes
  const { data: quizzes = [], isLoading: loadingQuizzes } = useQuery({
    queryKey: ["admin-quizzes"],
    queryFn: async () => {
      const res = await api.get("/quiz/get");
      return res.data?.success ? res.data.quizzes : [];
    },
  });

  // 3. Fetch Internships (Jobs where jobType === 'Internship')
  const { data: internships = [], isLoading: loadingInternships } = useQuery({
    queryKey: ["admin-internships"],
    queryFn: async () => {
      const res = await api.get("/job/get");
      const allJobs = res.data?.jobs || [];
      return allJobs.filter((j) => (j.jobType || "").toLowerCase() === "internship");
    },
  });

  // Hackathon Creation Form State
  const [hackForm, setHackForm] = useState({
    title: "",
    host: "NexHire Technologies",
    prizePool: "₹5,00,000",
    firstPrize: "₹2,50,000",
    mode: "Online (Global)",
    startDate: "2026-10-01",
    endDate: "2026-10-15",
    daysLeft: 14,
    tags: "AI, Full-Stack, Cloud",
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
        q: "What is the primary benefit of React Query (@tanstack/react-query)?",
        options: [
          "Optimistic updates and automated server-state caching",
          "DOM manipulation only",
          "CSS layout engine",
          "Replacing Node.js backend",
        ],
        answer: 0,
        explanation: "React Query manages caching, refetching, and synchronization of server state.",
      },
    ],
  });

  // Delete Hackathon Mutation
  const deleteHackathonMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/hackathon/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Hackathon deleted successfully.");
      queryClient.invalidateQueries(["admin-hackathons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete hackathon.");
    },
  });

  // Delete Quiz Mutation
  const deleteQuizMutation = useMutation({
    mutationFn: async (id) => {
      const res = await api.delete(`/quiz/${id}`);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Quiz deleted successfully.");
      queryClient.invalidateQueries(["admin-quizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to delete quiz.");
    },
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
      setHackForm({
        title: "",
        host: "NexHire Technologies",
        prizePool: "₹5,00,000",
        firstPrize: "₹2,50,000",
        mode: "Online (Global)",
        startDate: "2026-10-01",
        endDate: "2026-10-15",
        daysLeft: 14,
        tags: "AI, Full-Stack, Cloud",
        description: "",
      });
      queryClient.invalidateQueries(["admin-hackathons"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create hackathon.");
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
      setQuizForm({
        title: "",
        description: "",
        category: "Engineering",
        level: "Intermediate",
        timeLimit: 120,
        questions: [
          {
            q: "",
            options: ["", "", "", ""],
            answer: 0,
            explanation: "",
          },
        ],
      });
      queryClient.invalidateQueries(["admin-quizzes"]);
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create quiz.");
    },
  });

  return (
    <div className="space-y-6">
      {/* Top Controls & Metrics Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
            <Trophy size={18} className="text-amber-500" />
            <span>Opportunities Hub (Hackathons, Quizzes & Internships)</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Publish, moderate, and track student competitions, skill badges, and corporate internship openings.
          </p>
        </div>

        {/* Sub-Tab Navigation Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <button
            type="button"
            onClick={() => setSubTab("hackathons")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${
              subTab === "hackathons"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Trophy size={13} />
            <span>Hackathons ({hackathons.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("quizzes")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${
              subTab === "quizzes"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <Award size={13} />
            <span>Skill Quizzes ({quizzes.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSubTab("internships")}
            className={`flex items-center gap-1.5 rounded-xl px-3.5 py-1.5 text-xs font-bold transition shrink-0 ${
              subTab === "internships"
                ? "bg-slate-900 text-white dark:bg-white dark:text-slate-950 shadow"
                : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300"
            }`}
          >
            <GraduationCap size={13} />
            <span>Internships ({internships.length})</span>
          </button>
        </div>
      </div>

      {/* 1. HACKATHONS TAB */}
      {subTab === "hackathons" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Active & Upcoming Hackathons
            </span>
            <button
              type="button"
              onClick={() => setShowHackathonModal(true)}
              className="btn-primary flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Host New Hackathon</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {hackathons.map((hack) => (
              <div
                key={hack._id}
                className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-amber-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-amber-600 dark:text-amber-400 border border-amber-500/20">
                      Prize: {hack.prizePool}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteHackathonMutation.mutate(hack._id)}
                      disabled={deleteHackathonMutation.isPending}
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                      title="Delete Hackathon"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {hack.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {hack.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Users size={12} className="text-indigo-500" />
                    <span>{hack.participantsCount || 0} Registered</span>
                  </span>
                  <span className="font-semibold text-slate-700 dark:text-slate-300">
                    {hack.mode}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. SKILL QUIZZES TAB */}
      {subTab === "quizzes" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Published Skill Assessment Quizzes
            </span>
            <button
              type="button"
              onClick={() => setShowQuizModal(true)}
              className="btn-primary flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Create Assessment Quiz</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => (
              <div
                key={quiz._id}
                className="glass-panel rounded-3xl p-5 border border-slate-200/80 dark:border-slate-800 space-y-3.5 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <span className="rounded-full bg-cyan-500/10 px-2.5 py-0.5 text-[10px] font-extrabold text-cyan-600 dark:text-cyan-400 border border-cyan-500/20">
                      {quiz.category} • {quiz.level}
                    </span>
                    <button
                      type="button"
                      onClick={() => deleteQuizMutation.mutate(quiz._id)}
                      disabled={deleteQuizMutation.isPending}
                      className="text-slate-400 hover:text-rose-500 transition p-1"
                      title="Delete Quiz"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                    {quiz.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2">
                    {quiz.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
                  <span>{quiz.questions?.length || 0} Questions • {quiz.timeLimit}s</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">
                    {quiz.attemptsCount || 0} Attempts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. INTERNSHIPS TAB */}
      {subTab === "internships" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
              Corporate & Startup Internships
            </span>
            <a
              href="/post-job"
              className="btn-primary flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold shadow-sm"
            >
              <PlusCircle size={14} />
              <span>Post New Internship</span>
            </a>
          </div>

          <div className="overflow-x-auto rounded-3xl border border-slate-200/80 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500">
                  <th className="py-3 px-4 font-bold">Position Title</th>
                  <th className="py-3 px-4 font-bold">Company</th>
                  <th className="py-3 px-4 font-bold">Stipend / Salary</th>
                  <th className="py-3 px-4 font-bold">Location</th>
                  <th className="py-3 px-4 font-bold">Applicants</th>
                  <th className="py-3 px-4 font-bold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                {internships.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      No internships currently posted. Recruiters can post internships via Post a Job.
                    </td>
                  </tr>
                ) : (
                  internships.map((internship) => (
                    <tr key={internship._id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                        {internship.title}
                      </td>
                      <td className="py-3 px-4">{internship.company?.name || "Company"}</td>
                      <td className="py-3 px-4 font-semibold text-emerald-600 dark:text-emerald-400">
                        {internship.salary}
                      </td>
                      <td className="py-3 px-4">{internship.location}</td>
                      <td className="py-3 px-4 font-bold">{internship.applications?.length || 0}</td>
                      <td className="py-3 px-4 text-right">
                        <a
                          href={`/jobs`}
                          className="inline-flex items-center gap-1 text-indigo-600 dark:text-cyan-400 font-bold hover:underline"
                        >
                          <span>View</span>
                          <ExternalLink size={11} />
                        </a>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* HACKATHON CREATION MODAL */}
      {showHackathonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Trophy size={16} className="text-amber-500" />
                <span>Publish New Hackathon Challenge</span>
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
                  placeholder="e.g. NextGen Web3 & AI Hackathon 2026"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Host Organization *</label>
                  <input
                    type="text"
                    required
                    value={hackForm.host}
                    onChange={(e) => setHackForm({ ...hackForm, host: e.target.value })}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-slate-900 dark:border-slate-800 dark:bg-slate-800 dark:text-white outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Total Prize Pool *</label>
                  <input
                    type="text"
                    required
                    value={hackForm.prizePool}
                    onChange={(e) => setHackForm({ ...hackForm, prizePool: e.target.value })}
                    placeholder="₹5,00,000"
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
                  placeholder="Describe the themes, problem statements, and requirements..."
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

      {/* QUIZ CREATION MODAL */}
      {showQuizModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                <Award size={16} className="text-cyan-500" />
                <span>Create Skill Assessment Quiz</span>
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
                <label className="font-bold text-slate-700 dark:text-slate-300 block mb-1">Quiz Title *</label>
                <input
                  type="text"
                  required
                  value={quizForm.title}
                  onChange={(e) => setQuizForm({ ...quizForm, title: e.target.value })}
                  placeholder="e.g. Node.js & System Architecture Quiz"
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
                  placeholder="Test your engineering skills and earn a verified profile badge..."
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
                      placeholder={`Option ${optIdx + 1}${optIdx === 0 ? " (Correct Answer)" : ""}`}
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
                {createQuizMutation.isPending ? "Creating..." : "Create Quiz"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOpportunitiesTab;
