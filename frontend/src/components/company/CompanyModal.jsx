import React, { useEffect, useRef } from "react";
import { Building2, X, AlertCircle, Sparkles, Check, Globe, MapPin, UploadCloud, ImageIcon } from "lucide-react";

/**
 * CompanyModal Component
 * Modal dialog for registering or updating company profile details.
 * Optimized with compact 2-column layout, viewport padding, and scroll-to-top prevention.
 */
const CompanyModal = ({
  show,
  isOpen,
  onClose,
  form,
  onUpdate,
  onSubmit,
  isPending,
  error,
  isEditing = false,
  currentLogo = "",
  onAiBio,
}) => {
  const visible = Boolean(show || isOpen);
  const scrollRef = useRef(null);

  // Lock background scroll and reset modal scroll position to top
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = "hidden";
      if (scrollRef.current) {
        scrollRef.current.scrollTop = 0;
      }
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [visible]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape" && visible) {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visible, onClose]);

  if (!visible) return null;

  const handleChange = (field, val) => {
    if (onUpdate) {
      onUpdate(field, val);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/80 p-3 sm:p-6 backdrop-blur-md animate-fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative my-auto flex max-h-[90vh] w-full max-w-xl flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl dark:border-slate-800 dark:bg-slate-950 transition-all">
        
        {/* Top Accent Gradient Bar */}
        <div className="h-1.5 w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 shrink-0" />

        {/* Modal Header */}
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-5 py-4 dark:border-slate-800/80 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
              <Building2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
                {isEditing ? "Update Company Profile" : "Register Company"}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {isEditing
                  ? "Modify organization details, website, and brand assets"
                  : "Create employer profile to display on your job postings"}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-white transition"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto px-5 py-5 sm:px-6 no-scrollbar">
          
          {error && (
            <div className="mb-4 flex items-start gap-2.5 rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>
                {error?.response?.data?.message || error?.message || (typeof error === "string" ? error : "Failed to save company details.")}
              </span>
            </div>
          )}

          <form id="company-form" onSubmit={onSubmit} className="space-y-4">
            
            {/* 1. Company Name (Prominent & Clear) */}
            <div>
              <label className="mb-1.5 flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-200">
                <span>Company Name <span className="text-rose-500">*</span></span>
                <span className="text-[10px] font-normal text-slate-400">Public employer brand name</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  className="form-input h-11 w-full rounded-2xl border-slate-200 bg-slate-50/50 px-3.5 text-xs font-semibold text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                  placeholder="e.g. Web Expert / Acme Technologies"
                  value={form.companyName || ""}
                  onChange={(e) => handleChange("companyName", e.target.value)}
                />
              </div>
            </div>

            {/* 2. Responsive 2-Column: Location + Website */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Location / HQ */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Headquarters / Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className="form-input h-11 w-full rounded-2xl border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    placeholder="e.g. Bengaluru, India"
                    value={form.location || ""}
                    onChange={(e) => handleChange("location", e.target.value)}
                  />
                </div>
              </div>

              {/* Official Website */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Official Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3.5 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="text"
                    className="form-input h-11 w-full rounded-2xl border-slate-200 bg-slate-50/50 pl-10 pr-3.5 text-xs text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                    placeholder="e.g. https://example.com"
                    value={form.website || ""}
                    onChange={(e) => handleChange("website", e.target.value)}
                  />
                </div>
              </div>
            </div>

            {/* 3. Company Brand Logo */}
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-200">
                Company Brand Logo
              </label>

              <div className="flex flex-col sm:flex-row sm:items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50/50 p-3 dark:border-slate-800 dark:bg-slate-900">
                {/* Current logo thumbnail or placeholder */}
                <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-white p-1 shadow-sm dark:border-slate-700 dark:bg-slate-800 flex items-center justify-center">
                  {currentLogo ? (
                    <img
                      src={currentLogo}
                      alt="Company Logo"
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <ImageIcon className="h-6 w-6 text-slate-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[11px] font-medium text-slate-600 dark:text-slate-300 truncate">
                    {currentLogo ? "Current brand logo active" : "No logo uploaded yet"}
                  </p>
                  <p className="text-[10px] text-slate-400">
                    PNG, JPG, SVG or WEBP (Max 2MB)
                  </p>
                </div>

                <label className="shrink-0 inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-400 dark:hover:bg-indigo-500/20 transition">
                  <UploadCloud size={14} />
                  <span>{currentLogo ? "Replace" : "Upload"}</span>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => handleChange("logoFile", e.target.files?.[0] || null)}
                  />
                </label>
              </div>
            </div>

            {/* 4. Company Overview Description */}
            <div>
              <div className="mb-1.5 flex items-center justify-between">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-200">
                  Company Overview
                </label>
                {onAiBio && (
                  <button
                    type="button"
                    onClick={onAiBio}
                    className="flex items-center gap-1 text-[11px] font-semibold text-indigo-600 dark:text-cyan-400 hover:underline"
                  >
                    <Sparkles size={12} />
                    <span>Auto-Draft with AI</span>
                  </button>
                )}
              </div>
              <textarea
                rows={3}
                className="form-input w-full resize-none rounded-2xl border-slate-200 bg-slate-50/50 p-3 text-xs leading-relaxed text-slate-900 placeholder:text-slate-400 dark:border-slate-800 dark:bg-slate-900 dark:text-white"
                placeholder="Tell prospective candidates about your company mission, work environment, and key projects..."
                value={form.description || ""}
                onChange={(e) => handleChange("description", e.target.value)}
              />
            </div>
          </form>
        </div>

        {/* Fixed Bottom Action Bar */}
        <div className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-100 bg-slate-50/70 px-5 py-3.5 dark:border-slate-800/80 dark:bg-slate-900/70 sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-200/60 dark:text-slate-300 dark:hover:bg-slate-800 transition"
          >
            Cancel
          </button>

          <button
            disabled={isPending}
            type="submit"
            form="company-form"
            className="btn-primary flex items-center gap-2 rounded-xl px-5 py-2 text-xs font-bold shadow-md shadow-indigo-500/20 disabled:opacity-50"
          >
            {isPending ? (
              <>
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                <span>{isEditing ? "Saving Changes..." : "Registering..."}</span>
              </>
            ) : (
              <>
                <Check size={14} />
                <span>{isEditing ? "Save Changes" : "Register Company"}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyModal;
