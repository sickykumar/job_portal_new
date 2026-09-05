import React from "react";
import { Building2, Plus } from "lucide-react";

/**
 * EmptyCompanies Component
 * Displayed when the recruiter has not registered any employer profiles yet.
 */
const EmptyCompanies = ({ onRegister }) => {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm dark:border-white/10 dark:bg-slate-900 sm:p-10">
      <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-2xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
        <Building2 size={32} />
      </div>

      <h3 className="font-bold text-slate-900 dark:text-white">
        No Companies Registered
      </h3>

      <p className="mx-auto mt-1 max-w-sm text-sm text-slate-500 dark:text-slate-400">
        Register your company to start posting jobs and attracting top tier talent.
      </p>

      <button
        type="button"
        onClick={onRegister}
        className="btn-primary mt-5 inline-flex items-center gap-2"
      >
        <Plus size={16} />
        <span>Register Company</span>
      </button>
    </div>
  );
};

export default EmptyCompanies;
