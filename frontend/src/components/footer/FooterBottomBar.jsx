import React from "react";
import { Link } from "react-router-dom";
import { Layers, FolderTree, Sliders } from "lucide-react";

/**
 * FooterBottomBar Component
 * Sleek, modern bottom legal and technical navigation bar.
 * Replaces plain underlined text with elegant interactive pills and zero default list styles.
 */
const FooterBottomBar = ({ onOpenLegal }) => {
  return (
    <div className="mt-12 pt-8 border-t border-slate-200/80 dark:border-slate-800/80 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 text-xs text-slate-500 dark:text-slate-400">
      {/* Corporate Copyright & CIN */}
      <div className="space-y-1 text-center lg:text-left">
        <p className="font-bold text-slate-700 dark:text-slate-200 text-xs">
          © {new Date().getFullYear()} NexHire Platforms Technologies Pvt. Ltd. All rights reserved.
        </p>
        <p className="text-[11px] text-slate-400 leading-relaxed max-w-xl mx-auto lg:mx-0">
          Crafted & Engineered with ❤️ by{" "}
          <a
            href="https://sickykumar.in"
            target="_blank"
            rel="noopener noreferrer"
            className="font-bold text-indigo-600 hover:text-indigo-700 dark:text-cyan-400 dark:hover:text-cyan-300 underline underline-offset-2 transition"
          >
            Sicky Kumar
          </a>{" "}
          • Corporate Identity No: U72200KA2026PTC098765
        </p>
      </div>

      {/* Styled Interactive Nav Pills (list-none, zero bullets) */}
      <ul className="list-none p-0 m-0 flex flex-wrap items-center justify-center lg:justify-end gap-2 text-xs">
        {/* Architecture Blueprint Link */}
        <li>
          <Link
            to="/architecture"
            className="inline-flex items-center gap-1.5 rounded-full border border-blue-500/20 bg-blue-50/70 px-3 py-1 font-semibold text-blue-700 hover:bg-blue-100 dark:border-blue-500/30 dark:bg-blue-950/40 dark:text-cyan-300 dark:hover:bg-blue-900/50 transition-all hover:scale-105 shadow-xs"
          >
            <Layers size={12} className="text-blue-600 dark:text-cyan-400" />
            <span>Architecture</span>
          </Link>
        </li>

        {/* Folder Structure Link */}
        <li>
          <Link
            to="/folder-structure"
            className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-50/70 px-3 py-1 font-semibold text-indigo-700 hover:bg-indigo-100 dark:border-indigo-500/30 dark:bg-indigo-950/40 dark:text-indigo-300 dark:hover:bg-indigo-900/50 transition-all hover:scale-105 shadow-xs"
          >
            <FolderTree size={12} className="text-indigo-600 dark:text-indigo-400" />
            <span>Folder Tree</span>
          </Link>
        </li>

        {/* Privacy Policy */}
        <li>
          <button
            type="button"
            onClick={() => onOpenLegal("privacy")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-xs"
          >
            <span>Privacy Policy</span>
          </button>
        </li>

        {/* Terms */}
        <li>
          <button
            type="button"
            onClick={() => onOpenLegal("terms")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-xs"
          >
            <span>Terms of Use</span>
          </button>
        </li>

        {/* KYC Notice */}
        <li>
          <button
            type="button"
            onClick={() => onOpenLegal("kyc")}
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-xs"
          >
            <span>Aadhaar & PAN</span>
          </button>
        </li>

        {/* Settings */}
        <li>
          <Link
            to="/account-settings"
            className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 font-medium text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/70 dark:text-slate-300 dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-xs"
          >
            <Sliders size={11} className="text-slate-400" />
            <span>Settings</span>
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default FooterBottomBar;
