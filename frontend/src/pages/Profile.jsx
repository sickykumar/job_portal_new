import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import {
  User,
  Briefcase,
  Sparkles,
  FileText,
  Save,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  Building2,
  Globe,
  Code2,
  Share2,
  IndianRupee,
  Upload,
  Trash2,
  Phone,
  Mail,
  ShieldCheck,
  Shield,
  ExternalLink,
  Crown,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";

/**
 * Profile Page
 * Role-tailored profile editor:
 * - Super Admin: Clean, authoritative master account details (Name, Email, Phone, Avatar, Role clearance). Zero resume/bio/skills.
 * - Recruiter: Employer branding, company links, hiring department.
 * - Candidate: Bio, AI enhancer, resume PDF manager, technical skills, and career links.
 */
const Profile = () => {
  const { user, updateUser, logout } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();

  const isAdmin = user?.role === "admin";
  const isRecruiter = user?.role === "recruiter";
  const isCandidate = user?.role === "student" || (!isRecruiter && !isAdmin);

  // Active accordion section (default: basic)
  const [openSection, setOpenSection] = useState("basic");
  const toggleSection = (id) => setOpenSection((prev) => (prev === id ? null : id));

  // Form state
  const [form, setForm] = useState({
    fullname: user?.fullname || "",
    email: user?.email || "",
    phoneNumber: user?.phoneNumber ? user.phoneNumber.replace(/^\+91\s*/, "") : "",
    bio: user?.profile?.bio || "",
    skills: user?.profile?.skills?.join(", ") || "",
    department: user?.profile?.department || "",
    website: user?.profile?.website || "",
    github: user?.profile?.github || "",
    linkedin: user?.profile?.linkedin || "",
    portfolio: user?.profile?.portfolio || "",
    expectedCtc: user?.profile?.expectedCtc || "",
    resumeFile: null,
    avatarFile: null,
  });

  const [avatarPreview, setAvatarPreview] = useState(
    user?.profile?.profilePhoto || ""
  );
  const [removeResume, setRemoveResume] = useState(false);
  const [ui, setUi] = useState({ aiLoading: false, message: "", error: "" });

  useEffect(() => {
    if (user) {
      setForm({
        fullname: user.fullname || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber ? user.phoneNumber.replace(/^\+91\s*/, "") : "",
        bio: user.profile?.bio || "",
        skills: user.profile?.skills?.join(", ") || "",
        department: user.profile?.department || "",
        website: user.profile?.website || "",
        github: user.profile?.github || "",
        linkedin: user.profile?.linkedin || "",
        portfolio: user.profile?.portfolio || "",
        expectedCtc: user.profile?.expectedCtc || "",
        resumeFile: null,
        avatarFile: null,
      });
      setAvatarPreview(user.profile?.profilePhoto || "");
      setRemoveResume(false);
    }
  }, [user]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  // AI Bio & Skills Generator (Candidate & Recruiter only)
  const handleGenerateAiBio = async () => {
    setUi((prev) => ({ ...prev, aiLoading: true, error: "", message: "" }));
    try {
      const skillsArray = form.skills
        ? (typeof form.skills === "string" ? form.skills.split(",") : form.skills)
            .map((s) => String(s).trim())
            .filter(Boolean)
        : [];

      const { data } = await api.post("/ai/generate-bio", {
        currentBio: form.bio || "",
        currentSkills: skillsArray,
      });

      if (data?.success) {
        let formattedSkills = form.skills;
        if (Array.isArray(data.skills)) {
          formattedSkills = data.skills.join(", ");
        } else if (typeof data.skills === "string" && data.skills.trim()) {
          formattedSkills = data.skills.replace(/^\[|\]$/g, "").trim();
        }

        setForm((prev) => ({
          ...prev,
          bio: data.bio || prev.bio,
          skills: formattedSkills || prev.skills,
        }));
        setUi({ aiLoading: false, message: "Bio & Skills enhanced with AI!", error: "" });
        setTimeout(() => setUi((prev) => ({ ...prev, message: "" })), 3500);
      }
    } catch {
      setUi({ aiLoading: false, error: "Failed to generate AI bio. Please try again.", message: "" });
    }
  };

  // Avatar file change
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, avatarFile: file }));
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  // Dedicated Super Admin Logout handler
  const handleSuperAdminLogout = async () => {
    try {
      await logout();
      toast.info("Signed out from Super Administrator session");
    } catch {
      // fallback
    }
    navigate("/login");
  };

  // Profile Save Mutation
  const saveMutation = useMutation({
    mutationFn: async () => {
      if (!form.fullname.trim()) throw new Error("Full name is required.");
      if (!form.email.trim()) throw new Error("Email address is required.");

      const cleanPhone = form.phoneNumber.replace(/[^0-9]/g, "").slice(-10);
      if (cleanPhone.length < 10) throw new Error("Please provide a valid 10-digit phone number.");

      const data = new FormData();
      data.append("fullname", form.fullname.trim());
      data.append("email", form.email.trim().toLowerCase());
      data.append("phoneNumber", `+91 ${cleanPhone}`);

      // Only include candidate/recruiter fields if NOT admin
      if (!isAdmin) {
        data.append("bio", form.bio.trim());
        data.append("skills", form.skills.trim());
        data.append("department", form.department.trim());
        data.append("website", form.website.trim());
        data.append("github", form.github.trim());
        data.append("linkedin", form.linkedin.trim());
        data.append("portfolio", form.portfolio.trim());
        data.append("expectedCtc", form.expectedCtc.trim());

        if (form.resumeFile) {
          data.append("profilePhoto", form.resumeFile);
        } else if (removeResume) {
          data.append("removeResume", "true");
        }
      }

      // If avatar uploaded
      if (form.avatarFile) {
        data.append("profilePhoto", form.avatarFile);
      }

      const res = await api.post("/user/profile/update", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    },
    onSuccess: (data) => {
      if (data?.success) {
        updateUser(data.user);
        setForm((prev) => ({ ...prev, resumeFile: null, avatarFile: null }));
        setRemoveResume(false);
        setUi({ aiLoading: false, message: "Account details saved successfully!", error: "" });
        toast.success("Profile credentials saved successfully!");
        setTimeout(() => setUi((prev) => ({ ...prev, message: "" })), 4000);
      }
    },
    onError: (err) => {
      const errMsg = err.response?.data?.message || err.message || "Failed to update profile.";
      setUi({
        aiLoading: false,
        message: "",
        error: errMsg,
      });
      toast.error(errMsg);
    },
  });

  // Calculate profile completion percentage for candidates / recruiters
  const calculateCompletion = () => {
    let score = 30;
    if (form.fullname) score += 10;
    if (form.bio) score += 15;
    if (avatarPreview) score += 10;
    if (isRecruiter) {
      if (form.department) score += 15;
      if (form.website) score += 20;
    } else {
      if (form.skills) score += 15;
      if (user?.profile?.resume || form.resumeFile) score += 20;
    }
    return Math.min(score, 100);
  };

  const completionPercent = calculateCompletion();

  // =========================================================================
  // 👑 SUPER ADMIN DEDICATED MASTER VIEW
  // Admin manages everything in the project. No bio, no resume, pure governance.
  // =========================================================================
  if (isAdmin) {
    return (
      <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden space-y-4">
        
        {/* Top Header */}
        <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
                Super Administrator Profile
              </h1>
              <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-600 dark:text-rose-400 border border-rose-500/20">
                Master Authority
              </span>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Master administrator identity with global platform governance privileges
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => navigate("/admin-dashboard")}
              className="flex items-center gap-1.5 rounded-xl border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 transition shadow-sm"
            >
              <ExternalLink size={13} />
              <span>Admin Console</span>
            </button>
            <button
              type="button"
              onClick={() => handleSuperAdminLogout()}
              className="flex items-center gap-1.5 rounded-xl border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-100 dark:border-rose-900/30 dark:bg-rose-950/30 dark:text-rose-400 dark:hover:bg-rose-900/40 transition shadow-sm"
            >
              <LogOut size={13} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Global Alerts */}
        {ui.message && (
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-2">
            <CheckCircle2 size={16} />
            <span>{ui.message}</span>
          </div>
        )}
        {ui.error && (
          <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 flex items-center gap-2">
            <AlertCircle size={16} />
            <span>{ui.error}</span>
          </div>
        )}

        {/* Master Governance Authority Card */}
        <div className="rounded-3xl border border-rose-500/20 bg-gradient-to-br from-rose-500/5 via-indigo-500/5 to-violet-500/5 p-5 sm:p-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 shadow-inner">
                <Crown size={24} />
              </div>
              <div>
                <h2 className="text-sm sm:text-base font-black text-slate-900 dark:text-white">
                  Universal Platform Master
                </h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Full control over Candidates, Recruiters, Job Moderation, and Support Desk.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-xl border border-rose-200 bg-white px-3 py-1 text-[11px] font-extrabold text-rose-600 dark:border-rose-500/20 dark:bg-slate-900 dark:text-rose-400">
                Level: Super Admin (Root)
              </span>
              <span className="rounded-xl border border-emerald-200 bg-white px-3 py-1 text-[11px] font-extrabold text-emerald-600 dark:border-emerald-500/20 dark:bg-slate-900 dark:text-emerald-400">
                Status: Master Active
              </span>
            </div>
          </div>
        </div>

        {/* Administrator Credentials & Avatar Card */}
        <div className="glass-panel overflow-hidden rounded-3xl p-5 sm:p-6 space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
              <User size={18} />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                Admin Master Credentials
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Super administrator identity details, emergency contact phone, and avatar photo
              </p>
            </div>
          </div>

          {/* Profile Photo / Avatar */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="relative h-20 w-20 shrink-0 rounded-2xl overflow-hidden border-2 border-rose-500/30 bg-slate-100 dark:bg-slate-800 flex items-center justify-center shadow-md">
              {avatarPreview ? (
                <img
                  src={avatarPreview}
                  alt="Super Admin Avatar"
                  className="h-full w-full object-cover"
                />
              ) : (
                <Crown size={32} className="text-rose-500" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Master Profile Avatar
              </p>
              <p className="text-[11px] text-slate-400 mb-2.5">
                Displays on the Super Admin Console and resolution emails
              </p>

              <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-400 transition">
                <Upload size={13} />
                <span>{avatarPreview ? "Replace Photo" : "Upload Photo"}</span>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </label>
            </div>
          </div>

          {/* Master Form Grid */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Admin Full Name *
              </label>
              <input
                type="text"
                required
                value={form.fullname}
                onChange={(e) => update("fullname", e.target.value)}
                placeholder="Super Administrator"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Master Login Email *
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  disabled
                  value={form.email}
                  className="w-full rounded-2xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 pl-9 text-xs sm:text-sm font-semibold text-slate-600 outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400 cursor-not-allowed"
                />
                <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Direct Contact Phone *
              </label>
              <div className="relative">
                <input
                  type="tel"
                  required
                  value={form.phoneNumber}
                  onChange={(e) => update("phoneNumber", e.target.value)}
                  placeholder="9876543210"
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 text-xs sm:text-sm font-semibold text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                />
                <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                Access Authorization Tier
              </label>
              <div className="relative">
                <input
                  type="text"
                  disabled
                  value="Super Administrator (Root Platform Governance)"
                  className="w-full rounded-2xl border border-rose-200 bg-rose-50/60 px-3.5 py-2.5 pl-9 text-xs sm:text-sm font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-300 cursor-not-allowed"
                />
                <Crown size={15} className="absolute left-3 top-3 text-rose-500" />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="button"
              onClick={() => saveMutation.mutate()}
              disabled={saveMutation.isPending}
              className="btn-primary flex items-center gap-2 rounded-2xl px-6 py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/20"
            >
              <Save size={14} />
              <span>{saveMutation.isPending ? "Saving Changes..." : "Save Admin Credentials"}</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // 💼 CANDIDATE & RECRUITER REGULAR PROFILE VIEW
  // =========================================================================
  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden space-y-4">
      
      {/* Sleek Compact Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Profile Settings
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              {completionPercent}% Ready
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            {isRecruiter
              ? "Update your recruiter branding, company details, and hiring department focus"
              : "Manage your professional headline, AI bio, technical skills, and resume portfolio"}
          </p>
        </div>

        <button
          type="button"
          onClick={() => saveMutation.mutate()}
          disabled={saveMutation.isPending}
          className="btn-primary self-start sm:self-auto text-xs shrink-0"
        >
          <Save size={14} />
          <span>{saveMutation.isPending ? "Saving..." : "Save Changes"}</span>
        </button>
      </div>

      {/* Completion Meter */}
      <div className="glass-panel p-4">
        <div className="flex items-center justify-between text-xs font-bold mb-1.5">
          <span className="text-slate-700 dark:text-slate-300">
            Profile Readiness Index
          </span>
          <span className="text-indigo-600 dark:text-cyan-400">{completionPercent}%</span>
        </div>
        <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className="h-full bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500 transition-all duration-500"
            style={{ width: `${completionPercent}%` }}
          />
        </div>
      </div>

      {/* Global Alerts */}
      {ui.message && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3.5 text-xs font-bold text-emerald-700 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{ui.message}</span>
        </div>
      )}
      {ui.error && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-3.5 text-xs font-bold text-rose-700 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400 flex items-center gap-2">
          <AlertCircle size={16} />
          <span>{ui.error}</span>
        </div>
      )}

      {/* Accordion Sections */}
      <div className="space-y-4">
        
        {/* Accordion 1: Basic Information & Avatar */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("basic")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
                <User size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  Basic Information & Avatar
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Full name, profile photo, contact phone, and account email
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "basic" ? "rotate-180 text-indigo-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "basic" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-5"
              >
                {/* Avatar Row */}
                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                  <div className="relative h-16 w-16 shrink-0 rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    {avatarPreview ? (
                      <img
                        src={avatarPreview}
                        alt="Profile Avatar"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xl font-black text-indigo-600 dark:text-cyan-400">
                        {form.fullname?.charAt(0)?.toUpperCase() || "U"}
                      </span>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Profile Avatar / Photo
                    </p>
                    <p className="text-[11px] text-slate-400 mb-2">
                      Upload a clean square image (JPG, PNG, WEBP - Max 3MB)
                    </p>

                    <label className="inline-flex items-center gap-1.5 cursor-pointer rounded-xl border border-indigo-200 bg-indigo-50 px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-100 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-400 transition">
                      <Upload size={13} />
                      <span>{avatarPreview ? "Replace Photo" : "Upload Photo"}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleAvatarChange}
                      />
                    </label>
                  </div>
                </div>

                {/* Form Grid */}
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={form.fullname}
                      onChange={(e) => update("fullname", e.target.value)}
                      placeholder="e.g. Sicky Kumar"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Email Address *
                    </label>
                    <div className="relative">
                      <input
                        type="email"
                        required
                        disabled
                        value={form.email}
                        className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
                      />
                      <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Phone Number *
                    </label>
                    <div className="relative">
                      <input
                        type="tel"
                        required
                        value={form.phoneNumber}
                        onChange={(e) => update("phoneNumber", e.target.value)}
                        placeholder="9876543210"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                      />
                      <Phone size={15} className="absolute left-3 top-3 text-slate-400" />
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Account Role
                    </label>
                    <input
                      type="text"
                      disabled
                      value={isRecruiter ? "Verified Recruiter & Hiring Manager" : "Registered Job Candidate"}
                      className="w-full rounded-xl border border-slate-200 bg-slate-100/80 px-3.5 py-2.5 text-xs sm:text-sm text-slate-500 outline-none dark:border-slate-800 dark:bg-slate-800/60 dark:text-slate-400"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 2: Professional Bio & AI Enhancer */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("bio")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Sparkles size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  Professional Bio & AI Enhancer
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {isRecruiter
                    ? "Company introduction and hiring mission statement"
                    : "Career summary, top strengths, and engineering focus"}
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "bio" ? "rotate-180 text-violet-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "bio" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Professional Summary
                  </label>
                  <button
                    type="button"
                    onClick={handleGenerateAiBio}
                    disabled={ui.aiLoading}
                    className="inline-flex items-center gap-1.5 rounded-xl border border-violet-200 bg-violet-50 px-2.5 py-1 text-xs font-bold text-violet-700 hover:bg-violet-100 dark:border-violet-500/20 dark:bg-violet-500/10 dark:text-violet-300 transition"
                  >
                    <Sparkles size={12} className={ui.aiLoading ? "animate-spin" : ""} />
                    <span>{ui.aiLoading ? "Drafting Bio..." : "Enhance with AI"}</span>
                  </button>
                </div>

                <textarea
                  rows={4}
                  value={form.bio}
                  onChange={(e) => update("bio", e.target.value)}
                  placeholder={
                    isRecruiter
                      ? "Describe your company culture, hiring philosophy, and what your engineering team looks for in top candidates..."
                      : "Describe your technical background, main domain accomplishments, key tools, and target career trajectory..."
                  }
                  className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 p-3.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion 3: CANDIDATE SPECIFIC: Skills & Resume */}
        {isCandidate && (
          <div className="glass-panel overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => toggleSection("candidate-assets")}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    Skills, Resume PDF & Career Links
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Technical skill tags, uploaded resume file, GitHub, LinkedIn, and compensation target
                  </p>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-200 ${
                  openSection === "candidate-assets" ? "rotate-180 text-cyan-600" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openSection === "candidate-assets" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-4"
                >
                  {/* Skills Editor */}
                  <div>
                    <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                      Technical Skills (Comma separated)
                    </label>
                    <input
                      type="text"
                      value={form.skills}
                      onChange={(e) => update("skills", e.target.value)}
                      placeholder="React, Node.js, TypeScript, PostgreSQL, Docker, AWS"
                      className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                    />

                    {/* Skill Tags Chips Preview */}
                    {form.skills && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {form.skills.split(",").map((s) => s.trim()).filter(Boolean).map((skill, idx) => (
                          <span
                            key={idx}
                            className="rounded-lg border border-indigo-200 bg-indigo-50 px-2 py-0.5 text-[11px] font-bold text-indigo-700 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-300"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Resume Manager Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <span className="text-xs font-bold text-slate-900 dark:text-white">
                      Resume PDF File
                    </span>

                    {user?.profile?.resume && !removeResume && !form.resumeFile ? (
                      <div className="mt-2.5 flex items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-3 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-2.5 min-w-0">
                          <FileText size={18} className="text-indigo-600 dark:text-cyan-400 shrink-0" />
                          <span className="truncate text-xs font-bold text-slate-800 dark:text-slate-200">
                            {user.profile.resumeOriginalname || "Verified_Resume.pdf"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <a
                            href={user.profile.resume}
                            target="_blank"
                            rel="noreferrer"
                            className="text-xs font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                          >
                            Preview
                          </a>
                          <button
                            type="button"
                            onClick={() => setRemoveResume(true)}
                            className="text-slate-400 hover:text-rose-500 transition"
                            title="Remove resume"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="mt-2.5">
                        <label className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-5 text-center cursor-pointer hover:border-indigo-500 hover:bg-indigo-50/30 dark:border-slate-700 dark:bg-slate-900 transition">
                          <Upload size={22} className="text-indigo-600 dark:text-cyan-400 mb-1" />
                          <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                            {form.resumeFile ? form.resumeFile.name : "Upload your updated Resume PDF"}
                          </span>
                          <span className="text-[10px] text-slate-400 mt-0.5">
                            PDF, DOC, DOCX up to 5MB
                          </span>
                          <input
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                setForm((prev) => ({ ...prev, resumeFile: file }));
                                setRemoveResume(false);
                              }
                            }}
                          />
                        </label>
                      </div>
                    )}
                  </div>

                  {/* Portfolio & Social Links Grid */}
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Portfolio / Personal Website
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={form.portfolio}
                          onChange={(e) => update("portfolio", e.target.value)}
                          placeholder="https://myportfolio.dev"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pl-8 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        />
                        <Globe size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        GitHub Profile
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={form.github}
                          onChange={(e) => update("github", e.target.value)}
                          placeholder="https://github.com/username"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pl-8 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        />
                        <Code2 size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        LinkedIn URL
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={form.linkedin}
                          onChange={(e) => update("linkedin", e.target.value)}
                          placeholder="https://linkedin.com/in/username"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pl-8 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        />
                        <Share2 size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Target CTC (e.g. ₹18 LPA)
                      </label>
                      <div className="relative">
                        <input
                          type="text"
                          value={form.expectedCtc}
                          onChange={(e) => update("expectedCtc", e.target.value)}
                          placeholder="₹18 - ₹24 LPA"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3 py-2 pl-8 text-xs text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        />
                        <IndianRupee size={14} className="absolute left-2.5 top-2.5 text-slate-400" />
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Accordion 4: RECRUITER SPECIFIC: Company Organization & Department */}
        {isRecruiter && (
          <div className="glass-panel overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => toggleSection("recruiter-assets")}
              className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                  <Building2 size={18} />
                </div>
                <div className="min-w-0">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    Company Organization & Hiring Department
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                    Hiring team, company website, specializations, and recruiter profile
                  </p>
                </div>
              </div>
              <ChevronDown
                size={18}
                className={`text-slate-400 transition-transform duration-200 ${
                  openSection === "recruiter-assets" ? "rotate-180 text-cyan-600" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {openSection === "recruiter-assets" && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-4"
                >
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Hiring Department / Team
                      </label>
                      <input
                        type="text"
                        value={form.department}
                        onChange={(e) => update("department", e.target.value)}
                        placeholder="Engineering, Product, Core Infrastructure"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                      />
                    </div>

                    <div>
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Company Official Website
                      </label>
                      <div className="relative">
                        <input
                          type="url"
                          value={form.website}
                          onChange={(e) => update("website", e.target.value)}
                          placeholder="https://company.com"
                          className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                        />
                        <Globe size={15} className="absolute left-3 top-3 text-slate-400" />
                      </div>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                        Hiring Specializations (e.g. AI / ML, Full-Stack, Cloud DevOps)
                      </label>
                      <input
                        type="text"
                        value={form.skills}
                        onChange={(e) => update("skills", e.target.value)}
                        placeholder="Full-Stack, Distributed Systems, AI Engineering, Mobile"
                        className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                      />
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
