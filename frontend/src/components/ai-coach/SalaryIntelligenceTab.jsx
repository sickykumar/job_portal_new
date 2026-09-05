import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../../services/api";
import { IndianRupee, Briefcase, Target, Clock3, TrendingUp, AlertCircle } from "lucide-react";
import CoachField from "./CoachField";
import CoachResultPanel from "./CoachResultPanel";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const SalaryIntelligenceTab = () => {
  const [salary, setSalary] = useState({
    role: "Full Stack Developer",
    location: "India",
    experience: 3,
    offer: "",
  });
  const [salaryInsight, setSalaryInsight] = useState("");
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

  const salaryMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.post("/ai/salary-insight", {
        roleTitle: salary.role,
        location: salary.location,
        experienceYears: salary.experience,
        currentOffer: salary.offer,
      });
      if (!data?.success) throw new Error("Failed to analyze compensation.");
      return data.salaryInsight;
    },
    onSuccess: setSalaryInsight,
  });

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="grid gap-5 lg:grid-cols-[360px_1fr] items-start"
    >
      {/* Parameter Configuration Form */}
      <section className="glass-panel p-4 sm:p-6 lg:sticky lg:top-24">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
            <IndianRupee size={20} />
          </div>
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white">
              Salary & Negotiation
            </h2>
            <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
              Evaluate compensation bands and receive tailored counter-offer templates.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-4">
          <CoachField
            label="Role"
            icon={Briefcase}
            value={salary.role}
            onChange={(e) =>
              setSalary({ ...salary, role: e.target.value })
            }
            placeholder="e.g. Senior Full-Stack Engineer"
          />

          <CoachField
            label="Location / Market"
            icon={Target}
            value={salary.location}
            onChange={(e) =>
              setSalary({ ...salary, location: e.target.value })
            }
            placeholder="e.g. Bengaluru, India or Remote"
          />

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <CoachField
              label="Years of Exp"
              icon={Clock3}
              type="number"
              value={salary.experience}
              onChange={(e) =>
                setSalary({ ...salary, experience: e.target.value })
              }
            />

            <CoachField
              label="Current Offer"
              icon={IndianRupee}
              value={salary.offer}
              onChange={(e) =>
                setSalary({ ...salary, offer: e.target.value })
              }
              placeholder="e.g. ₹18 LPA"
            />
          </div>

          <button
            type="button"
            onClick={() => salaryMutation.mutate()}
            disabled={salaryMutation.isPending}
            className="flex h-11 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-violet-600 text-xs font-bold text-white shadow-lg shadow-violet-500/20 transition hover:-translate-y-0.5 disabled:opacity-50"
          >
            {salaryMutation.isPending ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>Analyzing Pay Bands...</span>
              </>
            ) : (
              <>
                <TrendingUp size={15} />
                <span>Analyze Compensation</span>
              </>
            )}
          </button>

          {salaryMutation.isError && (
            <div className="flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertCircle size={15} className="shrink-0" />
              <span>
                {salaryMutation.error?.message ||
                  "Failed to analyze compensation."}
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Analysis Output Result */}
      <CoachResultPanel
        title="Compensation Strategy & Negotiation"
        icon={TrendingUp}
        loading={salaryMutation.isPending}
        text={salaryInsight}
        emptyTitle="Your salary analysis will appear here"
        emptyText="Enter your position, market, and experience to generate target pay bands and a professional negotiation letter."
        onCopy={() => copyText(salaryInsight)}
        copied={copied}
      />
    </motion.div>
  );
};

export default SalaryIntelligenceTab;
