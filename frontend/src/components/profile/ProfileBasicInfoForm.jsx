import React from "react";
import { User, Mail, Phone } from "lucide-react";

/**
 * ProfileBasicInfoForm Component
 * Personal details form inputs: Full Name, Email, and Phone (+91).
 */
const ProfileBasicInfoForm = ({ form, update }) => {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        Personal Details
      </h3>

      <div className="grid gap-4 sm:grid-cols-2">
        {/* Full Name */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Full Name *
          </label>
          <div className="relative">
            <User size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="text"
              required
              value={form.fullname}
              onChange={(e) => update("fullname", e.target.value)}
              placeholder="e.g. Rahul Sharma"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Email Address */}
        <div>
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Email Address *
          </label>
          <div className="relative">
            <Mail size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => update("email", e.target.value)}
              placeholder="e.g. rahul@example.com"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
            />
          </div>
        </div>

        {/* Indian Phone Number */}
        <div className="sm:col-span-2">
          <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
            Contact Number (India)
          </label>
          <div className="relative flex items-center">
            <div className="pointer-events-none absolute left-3.5 flex items-center gap-1.5 text-xs font-bold text-slate-500 dark:text-slate-400">
              <span>🇮🇳</span>
              <span>+91</span>
            </div>
            <input
              type="tel"
              value={form.phoneNumber}
              onChange={(e) => {
                const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 10);
                update("phoneNumber", digits);
              }}
              placeholder="98765 43210"
              className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-16 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white font-mono"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileBasicInfoForm;
