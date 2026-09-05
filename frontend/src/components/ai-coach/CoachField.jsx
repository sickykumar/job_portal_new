import React from "react";

const CoachField = ({
  label,
  icon: Icon,
  type = "text",
  value,
  onChange,
  placeholder = "",
  options = [],
}) => {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon
            size={16}
            className="pointer-events-none absolute left-3.5 top-3.5 text-slate-400"
          />
        )}
        {type === "select" ? (
          <select
            value={value}
            onChange={onChange}
            className="w-full appearance-none rounded-xl border border-slate-200 bg-white py-3 pl-10 pr-4 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:text-sm"
          >
            {options.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
        ) : (
          <input
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`w-full rounded-xl border border-slate-200 bg-white py-3 text-xs font-semibold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white sm:text-sm ${
              Icon ? "pl-10 pr-4" : "px-4"
            }`}
          />
        )}
      </div>
    </div>
  );
};

export default CoachField;
