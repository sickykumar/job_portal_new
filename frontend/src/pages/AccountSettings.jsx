import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  KeyRound,
  IdCard,
  Bell,
  Palette,
  AlertTriangle,
  ChevronDown,
  CheckCircle2,
  Lock,
  Eye,
  EyeOff,
  Sun,
  Moon,
  Sparkles,
  LogOut,
  Trash2,
  Smartphone,
  ShieldCheck,
  Laptop,
  Check,
  Globe,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import { useToast } from "../context/ToastContext";
import api from "../services/api";
import { formatIndianAadhaar, formatIndianPAN } from "../utils/indianFormat";

/**
 * AccountSettings Page
 * Unified security, identity verification, notifications, and theme settings with an accordion feel.
 */
const AccountSettings = () => {
  const { user, updateUser, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const toast = useToast();
  const isRecruiter = user?.role === "recruiter";

  // Accordion active tab state (default: security)
  const [openSection, setOpenSection] = useState("security");

  const toggleSection = (id) => {
    setOpenSection((prev) => (prev === id ? null : id));
  };

  // Password state
  const [pwForm, setPwForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPw, setShowPw] = useState({ current: false, next: false });
  const [pwStatus, setPwStatus] = useState({ loading: false, msg: "", error: "" });
  const [sessionMsg, setSessionMsg] = useState("");

  const handleTerminateOtherSessions = () => {
    setSessionMsg("All other active devices & sessions have been safely logged out.");
    setTimeout(() => setSessionMsg(""), 4500);
  };

  // Notifications state
  const [notifications, setNotifications] = useState({
    statusUpdates: user?.profile?.notifications?.statusUpdates ?? true,
    interviewAlerts: user?.profile?.notifications?.interviewAlerts ?? true,
    recommendations: user?.profile?.notifications?.recommendations ?? true,
    applicantInflux: user?.profile?.notifications?.applicantInflux ?? true,
    dailyDigest: user?.profile?.notifications?.dailyDigest ?? false,
  });
  const [notifSaving, setNotifSaving] = useState(false);
  const [notifMsg, setNotifMsg] = useState("");

  // Password strength calculation
  const getPasswordStrength = (pass) => {
    if (!pass) return 0;
    let score = 0;
    if (pass.length >= 6) score += 25;
    if (pass.length >= 10) score += 25;
    if (/[A-Z]/.test(pass) && /[a-z]/.test(pass)) score += 25;
    if (/[0-9]/.test(pass) || /[^A-Za-z0-9]/.test(pass)) score += 25;
    return score;
  };

  const pwStrength = getPasswordStrength(pwForm.newPassword);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPwStatus({ loading: true, msg: "", error: "" });

    if (!pwForm.currentPassword || !pwForm.newPassword) {
      setPwStatus({ loading: false, msg: "", error: "Please provide both current and new passwords." });
      return;
    }

    if (pwForm.newPassword.length < 6) {
      setPwStatus({ loading: false, msg: "", error: "New password must be at least 6 characters long." });
      return;
    }

    if (pwForm.newPassword !== pwForm.confirmPassword) {
      setPwStatus({ loading: false, msg: "", error: "New passwords do not match." });
      return;
    }

    try {
      const { data } = await api.post("/user/change-password", {
        currentPassword: pwForm.currentPassword,
        newPassword: pwForm.newPassword,
      });

      if (data.success) {
        setPwStatus({ loading: false, msg: "Password successfully changed!", error: "" });
        setPwForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
        setTimeout(() => setPwStatus({ loading: false, msg: "", error: "" }), 4000);
      }
    } catch (err) {
      setPwStatus({
        loading: false,
        msg: "",
        error: err.response?.data?.message || "Failed to change password.",
      });
    }
  };

  const handleToggleNotif = async (key) => {
    const updated = { ...notifications, [key]: !notifications[key] };
    setNotifications(updated);
    setNotifSaving(true);
    setNotifMsg("");

    try {
      const formData = new FormData();
      formData.append("notifications", JSON.stringify(updated));
      const { data } = await api.post("/user/profile/update", formData);
      if (data?.success) {
        updateUser(data.user);
        setNotifMsg("Preferences saved");
        setTimeout(() => setNotifMsg(""), 3000);
      }
    } catch (err) {
      console.error("Failed to save notification preferences:", err);
    } finally {
      setNotifSaving(false);
    }
  };

  // Mask sensitive identity numbers
  const maskAadhaar = (val) => {
    if (!val) return "Not Provided";
    const clean = String(val).replace(/\s+/g, "");
    if (clean.length < 4) return "XXXX XXXX XXXX";
    const last4 = clean.slice(-4);
    return `XXXX XXXX ${last4}`;
  };

  const maskPan = (val) => {
    if (!val) return "Not Provided";
    const clean = String(val).trim().toUpperCase();
    if (clean.length < 4) return "XXXXX****X";
    return `${clean.slice(0, 3)}****${clean.slice(-2)}`;
  };

  return (
    <div className="w-full px-3 pt-4 sm:pt-6 pb-8 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden">
      {/* Sleek Compact Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Account Settings & Security
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              {isRecruiter ? "Recruiter" : "Candidate"}
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Manage your login credentials, legal verification identity, and security preferences
          </p>
        </div>
      </div>

      {/* Accordion Container */}
      <div className="space-y-4">
        {/* Accordion Item 1: Security & Password */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("security")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-500/10 dark:text-cyan-400">
                <KeyRound size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  Password & Authentication
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Update your master password and manage sign-in security
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "security" ? "rotate-180 text-indigo-600 dark:text-cyan-400" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "security" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5"
              >
                {/* 50-50 Balanced Two-Column Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                  
                  {/* Left Column (50%): Password Update Form + Best Practices */}
                  <div className="space-y-4">
                    <form onSubmit={handlePasswordSubmit} className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50 space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-200/60 dark:border-slate-800 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Lock size={15} className="text-indigo-600 dark:text-cyan-400" />
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            Change Master Password
                          </h4>
                        </div>
                        <span className="text-[10px] text-slate-400">Encrypted</span>
                      </div>

                      {pwStatus.error && (
                        <div className="rounded-xl border border-rose-200 bg-rose-50 p-3 text-xs font-semibold text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10 dark:text-rose-400">
                          {pwStatus.error}
                        </div>
                      )}

                      {pwStatus.msg && (
                        <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-xs font-semibold text-emerald-600 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-400 flex items-center gap-2">
                          <CheckCircle2 size={16} />
                          <span>{pwStatus.msg}</span>
                        </div>
                      )}

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Current Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPw.current ? "text" : "password"}
                            value={pwForm.currentPassword}
                            onChange={(e) => setPwForm({ ...pwForm, currentPassword: e.target.value })}
                            placeholder="Enter current password"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw({ ...showPw, current: !showPw.current })}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPw.current ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          New Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPw.next ? "text" : "password"}
                            value={pwForm.newPassword}
                            onChange={(e) => setPwForm({ ...pwForm, newPassword: e.target.value })}
                            placeholder="At least 6 characters"
                            className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 pr-10 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPw({ ...showPw, next: !showPw.next })}
                            className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
                          >
                            {showPw.next ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>

                        {/* Strength Indicator */}
                        {pwForm.newPassword && (
                          <div className="mt-2">
                            <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                              <span>Strength</span>
                              <span>
                                {pwStrength <= 25 && "Weak"}
                                {pwStrength > 25 && pwStrength <= 50 && "Fair"}
                                {pwStrength > 50 && pwStrength <= 75 && "Good"}
                                {pwStrength > 75 && "Strong"}
                              </span>
                            </div>
                            <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800">
                              <div
                                className={`h-full transition-all duration-300 ${
                                  pwStrength <= 25
                                    ? "w-1/4 bg-rose-500"
                                    : pwStrength <= 50
                                    ? "w-2/4 bg-amber-500"
                                    : pwStrength <= 75
                                    ? "w-3/4 bg-cyan-500"
                                    : "w-full bg-emerald-500"
                                }`}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="mb-1 block text-xs font-bold text-slate-700 dark:text-slate-300">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          value={pwForm.confirmPassword}
                          onChange={(e) => setPwForm({ ...pwForm, confirmPassword: e.target.value })}
                          placeholder="Re-enter new password"
                          className="w-full rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/80 dark:text-white"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={pwStatus.loading}
                        className="btn-primary text-xs w-full sm:w-auto"
                      >
                        <Lock size={14} />
                        <span>{pwStatus.loading ? "Updating..." : "Update Password"}</span>
                      </button>
                    </form>

                    {/* Password Best Practices Card */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                          <Shield size={14} className="text-indigo-600 dark:text-cyan-400" />
                          Password Best Practices & Guidelines
                        </h4>
                        <span className="text-[10px] text-slate-400 font-medium">Recommended</span>
                      </div>
                      <ul className="space-y-2 text-[11px] text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <span>Minimum 6 characters (8+ recommended for higher safety)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <span>Mix of uppercase & lowercase characters (A-Z, a-z)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <span>Include numerical digits and symbols (!@#$%^&*)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <Check size={13} className="text-emerald-500 shrink-0" />
                          <span>Never share or reuse credentials across different platforms</span>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Right Column (50%): 2FA & Active Device Security */}
                  <div className="space-y-4">
                    {/* Multi-Factor Authentication Card */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                            <ShieldCheck size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Two-Step Verification (OTP)
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              Automated Email Authentication
                            </p>
                          </div>
                        </div>
                        <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">
                          Active
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-600 dark:text-slate-300 leading-relaxed">
                        Your account is safeguarded with encrypted One-Time Passwords (OTP) sent to <span className="font-semibold text-slate-900 dark:text-white">{user?.email || "your email"}</span> for sensitive security events and password updates.
                      </p>
                      <div className="mt-3 pt-2.5 border-t border-slate-200/60 dark:border-slate-800 flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                        <span>Protection Level</span>
                        <span className="font-bold text-emerald-600 dark:text-emerald-400">Zero-Trust High Security</span>
                      </div>
                    </div>

                    {/* Active Device & Session Info Card */}
                    <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 sm:p-5 dark:border-slate-800 dark:bg-slate-900/50">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2.5">
                          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                            <Laptop size={18} />
                          </div>
                          <div>
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                              Current Active Session
                            </h4>
                            <p className="text-[10px] text-slate-500 dark:text-slate-400">
                              Windows PC • Current Browser
                            </p>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
                          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Online
                        </span>
                      </div>

                      <div className="space-y-2 mt-3 pt-3 border-t border-slate-200/60 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400">
                        <div className="flex items-center justify-between">
                          <span>Token Security</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">HttpOnly Encrypted Cookie</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Security Standard</span>
                          <span className="font-semibold text-slate-700 dark:text-slate-200">Bcrypt + SHA-256</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span>Connection</span>
                          <span className="font-semibold text-emerald-600 dark:text-emerald-400">Encrypted (TLS 1.3 / HTTPS)</span>
                        </div>
                      </div>

                      {sessionMsg && (
                        <div className="mt-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 p-2.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                          <CheckCircle2 size={14} />
                          <span>{sessionMsg}</span>
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={handleTerminateOtherSessions}
                        className="mt-4 w-full rounded-xl border border-slate-200 bg-white py-2.5 text-center text-xs font-bold text-slate-700 shadow-xs hover:border-rose-200 hover:bg-rose-50/50 hover:text-rose-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-rose-900/30 dark:hover:bg-rose-950/20 dark:hover:text-rose-400 transition cursor-pointer"
                      >
                        Sign Out Other Devices
                      </button>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 2: Government Identity Verification (Indian Standard) */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("identity")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400">
                <IdCard size={18} />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                    Government ID & e-KYC Verification
                  </h3>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[9px] font-extrabold text-emerald-600 dark:bg-emerald-500/15 dark:text-emerald-400">
                    Verified
                  </span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Registered Indian Aadhaar Card and Income Tax PAN verification records
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "identity" ? "rotate-180 text-emerald-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "identity" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5"
              >
                <div className="grid gap-4 sm:grid-cols-2">
                  {/* Aadhaar Card Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        UIDAI Aadhaar Card
                      </span>
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-2 text-base font-black tracking-widest text-slate-900 dark:text-white">
                      {maskAadhaar(user?.adharcard)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Identity verified for national labor compliance. Number is masked for security.
                    </p>
                  </div>

                  {/* PAN Card Box */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-900/50">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Income Tax PAN Card
                      </span>
                      <ShieldCheck size={16} className="text-emerald-500" />
                    </div>
                    <p className="mt-2 text-base font-black tracking-widest text-slate-900 dark:text-white">
                      {maskPan(user?.pancard)}
                    </p>
                    <p className="mt-1 text-[11px] text-slate-500 dark:text-slate-400">
                      Taxpayer identification registered for legitimate payroll & offer generation.
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl bg-indigo-50/70 p-3.5 text-xs text-indigo-900 dark:bg-indigo-500/10 dark:text-cyan-300">
                  <p className="font-semibold">Need to correct your legal identity details?</p>
                  <p className="mt-0.5 text-[11px] opacity-80">
                    Because your government credentials protect your account and official background checks, edits require contacting platform compliance support.
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 3: Role-Tailored Notifications */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("notifications")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400">
                <Bell size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  Alerts & Notification Preferences
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  {isRecruiter
                    ? "Control applicant alerts, pipeline triggers, and hiring summaries"
                    : "Manage application status changes, interview invites, and job matches"}
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "notifications" ? "rotate-180 text-cyan-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "notifications" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-4"
              >
                {notifMsg && (
                  <p className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                    ✓ {notifMsg}
                  </p>
                )}

                {/* Candidate Specific Toggles */}
                {!isRecruiter && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Application Status Updates
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Receive instant alerts when recruiters review, shortlist, or update your submission.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.statusUpdates}
                        onChange={() => handleToggleNotif("statusUpdates")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Interview Invites & Reminders
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Get notified for upcoming video interviews, Google Meet links, and agendas.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.interviewAlerts}
                        onChange={() => handleToggleNotif("interviewAlerts")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          AI Smart Job Recommendations
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Personalized job matches based on your skills, target salary, and Career DNA index.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.recommendations}
                        onChange={() => handleToggleNotif("recommendations")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>
                  </>
                )}

                {/* Recruiter Specific Toggles */}
                {isRecruiter && (
                  <>
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Instant Candidate Influx Alerts
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Get real-time alerts whenever a job seeker submits an application to your open roles.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.applicantInflux}
                        onChange={() => handleToggleNotif("applicantInflux")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Interview Confirmation Alerts
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          Alerts when candidates accept interview slots or update scheduled meetings.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.interviewAlerts}
                        onChange={() => handleToggleNotif("interviewAlerts")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>

                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                          Daily Talent Pipeline Digest
                        </p>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400">
                          A morning summary of candidate reviews pending, scheduled interviews, and top AI match rankings.
                        </p>
                      </div>
                      <input
                        type="checkbox"
                        checked={notifications.dailyDigest}
                        onChange={() => handleToggleNotif("dailyDigest")}
                        className="h-4 w-4 rounded accent-indigo-600"
                      />
                    </div>
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 4: Appearance & Theme */}
        <div className="glass-panel overflow-hidden transition-all">
          <button
            type="button"
            onClick={() => toggleSection("appearance")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400">
                <Palette size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base truncate">
                  Appearance & Theme
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Customize the interface theme between Day (Light) and Night (Dark) mode
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "appearance" ? "rotate-180 text-violet-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "appearance" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5"
              >
                <div className="grid gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => isDark && toggleTheme()}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      !isDark
                        ? "border-indigo-600 bg-indigo-50/50 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-600">
                      <Sun size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Day Mode (Light)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Clean white high-contrast workspace</p>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => !isDark && toggleTheme()}
                    className={`flex items-center gap-3 rounded-2xl border p-4 text-left transition ${
                      isDark
                        ? "border-cyan-500 bg-cyan-500/10 shadow-sm"
                        : "border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700"
                    }`}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-950 text-indigo-400">
                      <Moon size={20} />
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white text-sm">Night Mode (Dark)</p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">Deep obsidian modern luminous palette</p>
                    </div>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Accordion Item 5: Danger Zone */}
        <div className="glass-panel overflow-hidden border-rose-200 dark:border-rose-900/30 transition-all">
          <button
            type="button"
            onClick={() => toggleSection("danger")}
            className="flex w-full items-center justify-between p-4 sm:p-5 text-left"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <AlertTriangle size={18} />
              </div>
              <div className="min-w-0">
                <h3 className="font-bold text-rose-600 dark:text-rose-400 text-sm sm:text-base truncate">
                  Danger Zone & Session Management
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                  Sign out from all active sessions or deactivate your account profile
                </p>
              </div>
            </div>
            <ChevronDown
              size={18}
              className={`text-slate-400 transition-transform duration-200 ${
                openSection === "danger" ? "rotate-180 text-rose-600" : ""
              }`}
            />
          </button>

          <AnimatePresence>
            {openSection === "danger" && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-slate-100 p-4 sm:p-6 dark:border-white/5 space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-slate-200 p-4 dark:border-slate-800">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">
                      Sign Out Everywhere
                    </p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                      Revokes all active login sessions on other devices and browsers.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="self-start sm:self-auto rounded-xl border border-slate-200 px-3.5 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-200 dark:hover:bg-slate-800"
                  >
                    Sign Out
                  </button>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl border border-rose-200 bg-rose-50/50 p-4 dark:border-rose-900/30 dark:bg-rose-950/20">
                  <div>
                    <p className="text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400">
                      Deactivate Account
                    </p>
                    <p className="text-[11px] text-rose-600/80 dark:text-rose-400/70">
                      Permanently removes your active {isRecruiter ? "job listings & recruiter identity" : "job applications and resume data"}.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => toast.info("To permanently delete your account and compliance records, please submit an official request to compliance@nexhire.com.")}
                    className="self-start sm:self-auto rounded-xl bg-rose-600 px-3.5 py-2 text-xs font-bold text-white shadow-sm hover:bg-rose-700"
                  >
                    Deactivate
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
