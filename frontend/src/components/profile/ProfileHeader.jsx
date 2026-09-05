import React from "react";
import { User, ShieldCheck, Sparkles } from "lucide-react";

/**
 * ProfileHeader Component
 * Visual profile banner with avatar, verification status, and role indicator.
 */
const ProfileHeader = ({ user }) => {
  const isRecruiter = user?.role === "recruiter";

  return (
    <div className="mb-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/20 via-violet-500/10 to-cyan-500/10 p-5 shadow-xl sm:p-7">
      <div className="flex flex-col sm:flex-row sm:items-center gap-4">
        {/* Avatar */}
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-indigo-600 text-xl font-black text-white shadow-lg shadow-indigo-500/30 dark:bg-cyan-500 dark:text-slate-950">
          {user?.fullname ? user.fullname.charAt(0).toUpperCase() : <User size={28} />}
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white truncate">
              {user?.fullname || "Account Profile"}
            </h1>
            <ShieldCheck size={18} className="text-emerald-500 shrink-0" />
          </div>

          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 truncate">
            {user?.email || "No email linked"}
          </p>

          <div className="mt-2.5 flex flex-wrap gap-2">
            <span className="badge badge-role">
              {isRecruiter ? "Employer / Recruiter" : "Candidate / Job Seeker"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-200 bg-emerald-50 px-2.5 py-0.5 text-[10px] font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/15 dark:text-emerald-300">
              <Sparkles size={11} />
              <span>Verified Account</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
