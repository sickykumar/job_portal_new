import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Award, Briefcase, Building2, UserRound, Sparkles, AlertCircle } from "lucide-react";
import CoachField from "./CoachField";
import CoachResultPanel from "./CoachResultPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const InterviewLabTab = () => {
  const [interview, setInterview] = useState({
    role: "Full Stack Developer",
    company: "",
    level: "Mid-Level (2-4 Yrs)",
  });
  const [interviewGuide, setInterviewGuide] = useState("");
  const [copied, setCopied] = useState(false);

  const copyText = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const interviewMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/ai/interview-prep", {
        roleTitle: interview.role,
        companyName: interview.company || "Modern Technology Firm",
        difficulty: interview.level,
      });
      if (!data?.success) throw new Error("Failed to generate interview plan.");
      return data.prepGuide;
    },
    onSuccess: setInterviewGuide,
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="grid gap-5 lg:grid-cols-[360px_1fr] items-start"
    >
      {/* Configuration Form */}
      <section className="glass-panel p-4 sm:p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
            <Award size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Interview Lab
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Build a tailored technical and behavioral preparation guide.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <CoachField
            label="Target Role"
            icon={Briefcase}
            value={interview.role}
            onChange={(e) =>
              setInterview({ ...interview, role: e.target.value })
            }
            placeholder="e.g. Full-Stack Engineer"
          />

          <CoachField
            label="Target Company"
            icon={Building2}
            value={interview.company}
            onChange={(e) =>
              setInterview({ ...interview, company: e.target.value })
            }
            placeholder="e.g. Google, Microsoft, Startup..."
          />

          <CoachField
            label="Seniority / Difficulty"
            icon={UserRound}
            type="select"
            value={interview.level}
            onChange={(e) =>
              setInterview({ ...interview, level: e.target.value })
            }
            options={[
              "Fresher (0-1 Yrs)",
              "Junior (1-2 Yrs)",
              "Mid-Level (2-4 Yrs)",
              "Senior (4-7 Yrs)",
              "Staff / Principal (8+ Yrs)",
            ]}
          />

          <button
            type="button"
            onClick={() => interviewMutation.mutate()}
            disabled={interviewMutation.isPending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-lg shadow-indigo-500/20 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {interviewMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Generating Plan...</span>
              </>
            ) : (
              <>
                <Sparkles size={15} />
                <span>Generate Interview Guide</span>
              </>
            )}
          </button>

          {interviewMutation.isError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertCircle size={15} className="shrink-0" />
              <span>
                {interviewMutation.error?.message ||
                  "Failed to generate interview plan."}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Guide Output Result */}
      <CoachResultPanel
        title="Interview Preparation Guide"
        icon={Award}
        loading={interviewMutation.isPending}
        text={interviewGuide}
        emptyTitle="Your interview guide will appear here"
        emptyText="Fill in your target position and company above to generate an actionable technical interview blueprint."
        onCopy={() => copyText(interviewGuide)}
        copied={copied}
      />
    </motion.div>
  );
};

export default InterviewLabTab;
