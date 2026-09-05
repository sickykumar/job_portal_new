import React from "react";
import { Building2, MapPin, Wallet, BriefcaseBusiness, Users, Clock, Calendar } from "lucide-react";

/**
 * JobFormFields Component
 * Form inputs for basic job parameters (Title, Company, Location, Salary, Experience, Openings, Active Duration).
 */
const JobFormFields = ({
  title, setTitle,
  companies = [], companyId, setCompanyId,
  location, setLocation,
  jobType, setJobType,
  experience, setExperience,
  position, setPosition,
  salary, setSalary,
  activeDays = 30, setActiveDays,
}) => {
  const computedExpiryDate = new Date(
    Date.now() + (parseInt(activeDays, 10) || 30) * 24 * 60 * 60 * 1000
  ).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const durationOptions = [
    { days: 7, label: "7 Days (Urgent)" },
    { days: 15, label: "15 Days (2 Weeks)" },
    { days: 30, label: "30 Days (Standard)" },
    { days: 60, label: "60 Days (2 Months)" },
    { days: 90, label: "90 Days (Quarterly)" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2">
      {/* Job Title */}
      <div className="sm:col-span-2">
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Job Title *
        </label>
        <div className="relative">
          <input
            type="text"
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Senior Full-Stack Engineer"
            className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Company Selector */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Company *
        </label>
        <div className="relative">
          <Building2 size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
          <select
            required
            value={companyId}
            onChange={(e) => setCompanyId(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            {companies.map((c) => (
              <option key={c._id} value={c._id}>
                {c.companyName}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Location *
        </label>
        <div className="relative">
          <MapPin size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="text"
            required
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="e.g. Bengaluru, India or Remote"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Job Type */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Employment Type
        </label>
        <div className="relative">
          <BriefcaseBusiness size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
          <select
            value={jobType}
            onChange={(e) => setJobType(e.target.value)}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          >
            <option value="Full-Time">Full-Time</option>
            <option value="Part-Time">Part-Time</option>
            <option value="Contract">Contract</option>
            <option value="Internship">Internship</option>
            <option value="Remote">Remote</option>
          </select>
        </div>
      </div>

      {/* Compensation (INR) */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Compensation (₹ / Annual)
        </label>
        <div className="relative">
          <Wallet size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="number"
            value={salary}
            onChange={(e) => setSalary(e.target.value)}
            placeholder="e.g. 1800000 (₹18 LPA)"
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Experience Required */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Experience Required (Years)
        </label>
        <input
          type="number"
          min="0"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
        />
      </div>

      {/* Number of Openings */}
      <div>
        <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Open Positions
        </label>
        <div className="relative">
          <Users size={16} className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400" />
          <input
            type="number"
            min="1"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Active Duration (Expiry Period) */}
      <div className="sm:col-span-2 rounded-2xl border border-indigo-100 bg-indigo-50/50 p-4 dark:border-indigo-500/20 dark:bg-indigo-500/5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2.5">
          <label className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300">
            <Clock size={15} className="text-indigo-600 dark:text-cyan-400" />
            <span>Active Listing Duration *</span>
          </label>

          <span className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
            <Calendar size={13} />
            <span>Active until: {computedExpiryDate}</span>
          </span>
        </div>

        {/* Duration Preset Pills */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {durationOptions.map((opt) => {
            const isSelected = parseInt(activeDays, 10) === opt.days;
            return (
              <button
                key={opt.days}
                type="button"
                onClick={() => setActiveDays?.(opt.days)}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-extrabold transition-all cursor-pointer ${
                  isSelected
                    ? "border-indigo-600 bg-indigo-600 text-white shadow-md shadow-indigo-500/20 dark:border-cyan-400 dark:bg-cyan-500 dark:text-slate-950"
                    : "border-slate-200 bg-white text-slate-700 hover:border-indigo-300 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <span>{opt.days} Days</span>
                <span className={`text-[10px] font-semibold mt-0.5 ${isSelected ? "text-indigo-100 dark:text-slate-900" : "text-slate-400"}`}>
                  {opt.days === 7 ? "Urgent" : opt.days === 30 ? "Standard" : opt.days === 90 ? "Quarterly" : "Flexible"}
                </span>
              </button>
            );
          })}
        </div>

        <p className="mt-2 text-[11px] text-slate-500 dark:text-slate-400">
          When this period ends, the job will automatically move to expired and won't appear in candidate search, but your applicant history is preserved.
        </p>
      </div>
    </div>
  );
};

export default JobFormFields;
