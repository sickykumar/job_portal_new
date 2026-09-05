import React from "react";
import { Copy, Check } from "lucide-react";

const CoachResultPanel = ({
  title,
  icon: Icon,
  loading,
  text,
  emptyTitle,
  emptyText,
  onCopy,
  copied,
}) => {
  return (
    <section className="glass-panel flex flex-col p-4 sm:p-6 min-h-[380px]">
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 dark:border-white/10 shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
            <Icon size={16} />
          </div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            {title}
          </h3>
        </div>

        {text && (
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-white/10 dark:bg-white/5 dark:text-slate-300 dark:hover:bg-white/10"
          >
            {copied ? (
              <>
                <Check size={13} className="text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy size={13} />
                <span>Copy</span>
              </>
            )}
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-3 border-indigo-600 border-t-transparent dark:border-cyan-400" />
          <p className="mt-3 text-xs font-bold text-slate-500 dark:text-slate-400">
            Generating tailored intelligence with Gemini AI...
          </p>
        </div>
      ) : !text ? (
        <div className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-400 dark:bg-white/5">
            <Icon size={22} />
          </div>
          <h4 className="text-sm font-bold text-slate-800 dark:text-white">
            {emptyTitle}
          </h4>
          <p className="mx-auto mt-1 max-w-sm text-xs text-slate-500 dark:text-slate-400">
            {emptyText}
          </p>
        </div>
      ) : (
        <div className="mt-4 max-h-[620px] overflow-y-auto whitespace-pre-wrap text-xs leading-relaxed text-slate-700 dark:text-slate-200 sm:text-sm">
          {text}
        </div>
      )}
    </section>
  );
};

export default CoachResultPanel;
