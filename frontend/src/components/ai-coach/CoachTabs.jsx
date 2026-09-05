import React from "react";
import { MessageSquare, Award, IndianRupee } from "lucide-react";

export const COACH_TABS = [
  { id: "chat", label: "Career Strategist", short: "Strategist", icon: MessageSquare },
  { id: "interview", label: "Interview Simulator", short: "Interview", icon: Award },
  { id: "salary", label: "Salary Intelligence", short: "Salary (₹)", icon: IndianRupee },
];

const CoachTabs = ({ activeTab, onSelectTab }) => {
  return (
    <div className="mb-5 overflow-x-auto rounded-2xl border border-slate-200 bg-white p-1.5 shadow-sm dark:border-white/10 dark:bg-slate-900">
      <div className="flex min-w-max gap-1">
        {COACH_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onSelectTab(tab.id)}
              className={`relative flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition ${
                active
                  ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                  : "text-slate-500 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-white/5"
              }`}
            >
              <Icon size={15} />
              <span className="sm:hidden">{tab.short}</span>
              <span className="hidden sm:inline">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CoachTabs;
