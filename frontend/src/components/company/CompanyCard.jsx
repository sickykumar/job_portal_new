import React from "react";
import { Globe, MapPin, ExternalLink, ChevronRight, Pencil } from "lucide-react";

/**
 * CompanyCard Component
 * Displays company details, logo, location, and official website link with 3D hover effects.
 */
const CompanyCard = ({ company, onEdit }) => {
  return (
    <article className="group relative min-w-0">
      {/* 3D Ambient Shadow Layer */}
      <div className="absolute inset-x-2 bottom-0 top-2 rounded-[26px] bg-gradient-to-r from-blue-500/10 via-indigo-500/10 to-violet-500/10 blur-[1px] transition duration-300 group-hover:translate-y-1" />

      {/* Main Card Surface */}
      <div className="relative overflow-hidden rounded-[26px] border border-slate-200 bg-white p-5 shadow-lg transition-all duration-300 group-hover:-translate-y-2 group-hover:shadow-2xl dark:border-slate-800 dark:bg-slate-900">
        {/* Top Accent Gradient Bar */}
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

        {/* Subtle Background Glow */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-indigo-500/10 blur-2xl transition duration-500 group-hover:bg-indigo-500/20" />

        {/* Company Header: Logo + Name + Location */}
        <div className="relative flex items-center gap-4 pt-1">
          {/* Logo / Fallback Avatar */}
          <div className="relative h-14 w-14 shrink-0 rounded-2xl transition duration-300 group-hover:-rotate-2 group-hover:scale-105">
            {company.logo ? (
              <img
                src={company.logo}
                alt={company.companyName}
                className="h-full w-full rounded-2xl border border-slate-200 bg-white object-contain p-1.5 shadow-md dark:border-slate-700"
              />
            ) : (
              <div className="grid h-full w-full place-items-center rounded-2xl border border-indigo-200 bg-gradient-to-br from-indigo-50 to-blue-100 text-xl font-black text-indigo-600 shadow-md dark:border-indigo-500/20 dark:from-indigo-500/20 dark:to-blue-500/10 dark:text-cyan-300">
                {company.companyName?.charAt(0)?.toUpperCase() || "C"}
              </div>
            )}
          </div>

          {/* Company Title & Location */}
          <div className="min-w-0 flex-1">
            <h3 className="truncate text-base font-extrabold text-slate-900 dark:text-white">
              {company.companyName}
            </h3>
            <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-slate-500 dark:text-slate-400">
              <MapPin size={13} className="shrink-0 text-blue-500" />
              <span>{company.location || "Location not specified"}</span>
            </p>
          </div>

          {/* Quick Edit Action */}
          {onEdit && (
            <button
              type="button"
              onClick={() => onEdit(company)}
              title="Edit Company Details"
              className="shrink-0 rounded-xl border border-slate-200 bg-slate-50 p-2 text-slate-600 hover:border-cyan-500 hover:bg-cyan-50 hover:text-cyan-600 dark:border-slate-800 dark:bg-slate-800 dark:text-slate-300 dark:hover:border-cyan-500 dark:hover:bg-slate-700 transition"
            >
              <Pencil size={14} />
            </button>
          )}
        </div>

        {/* Company Overview Description */}
        <p className="relative mt-4 min-h-[54px] line-clamp-3 text-xs leading-5 text-slate-600 dark:text-slate-400">
          {company.description || "Build your employer presence and attract great talent with your company profile."}
        </p>

        {/* Footer: External Website & Arrow Action */}
        <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-slate-100 pt-3 dark:border-slate-800">
          {company.website ? (
            <a
              href={company.website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex min-w-0 items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-500 dark:text-cyan-400 dark:hover:text-cyan-300"
            >
              <Globe size={14} className="shrink-0" />
              <span className="truncate">Visit Website</span>
              <ExternalLink size={11} className="shrink-0" />
            </a>
          ) : (
            <span className="truncate text-xs text-slate-400">No website linked</span>
          )}

          <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition group-hover:bg-indigo-50 group-hover:text-indigo-600 dark:bg-slate-800 dark:text-slate-400 dark:group-hover:bg-indigo-500/20 dark:group-hover:text-cyan-400">
            <ChevronRight size={14} />
          </div>
        </div>
      </div>
    </article>
  );
};

export default CompanyCard;
