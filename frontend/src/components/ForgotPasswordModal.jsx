import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Mail,
  KeyRound,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  RefreshCw,
} from "lucide-react";
import api from "../services/api";

const ForgotPasswordModal = ({ isOpen, onClose, onSuccess }) => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  if (!isOpen) return null;

  const startCooldown = () => {
    setCooldown(15);
    const interval = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Request Password Reset OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await api.post("/user/forgot-password-request", {
        email: email.trim().toLowerCase(),
      });

      if (res.data?.success) {
        setMessage(res.data.message || "Recovery code sent to your email!");
        setStep(2);
        startCooldown();
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to send recovery code. Please check your email."
      );
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await api.post("/user/forgot-password-request", {
        email: email.trim().toLowerCase(),
      });
      if (res.data?.success) {
        setMessage("Fresh recovery code sent to your inbox.");
        startCooldown();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Validate OTP entered with backend -> proceed to Step 3 ONLY on success!
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);

  const handleVerifyOtpStep = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit recovery code.");
      return;
    }
    setError("");
    setMessage("");
    setVerifyOtpLoading(true);

    try {
      const res = await api.post("/user/forgot-password-verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
      });

      if (res.data?.success) {
        setStep(3);
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Incorrect recovery code. Please check and try again."
      );
    } finally {
      setVerifyOtpLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match. Please verify.");
      return;
    }

    setLoading(true);
    try {
      const res = await api.post("/user/forgot-password-reset", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        newPassword,
      });

      if (res.data?.success) {
        setMessage("Password updated successfully! A confirmation notice was sent to your email.");
        setTimeout(() => {
          if (onSuccess) onSuccess();
          onClose();
        }, 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[99999] flex items-center justify-center p-3 sm:p-4 bg-slate-950/70 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-md rounded-3xl border border-slate-200/80 bg-white p-6 shadow-2xl dark:border-slate-800 dark:bg-slate-900 my-auto"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-100 pb-4 dark:border-slate-800">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-rose-50 text-rose-600 dark:bg-rose-500/10 dark:text-rose-400">
                <KeyRound size={20} />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 dark:text-white">
                  Reset Account Password
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Step {step} of 3: {step === 1 ? "Identify Account" : step === 2 ? "Verify Passcode" : "Create New Password"}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="rounded-xl p-2 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Close modal"
            >
              <X size={18} />
            </button>
          </div>

          {/* Alerts */}
          {error && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3 text-xs text-rose-600 dark:text-rose-400">
              <AlertCircle size={16} className="mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {message && (
            <div className="mt-4 flex items-start gap-2.5 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-xs text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 size={16} className="mt-0.5 shrink-0" />
              <span>{message}</span>
            </div>
          )}

          {/* STEP 1: Enter Email */}
          {step === 1 && (
            <form onSubmit={handleRequestOtp} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Registered Email Address
                </label>
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g. yourname@example.com"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                  <Mail size={15} className="absolute left-3 top-3 text-slate-400" />
                </div>
                <p className="mt-1.5 text-[10px] text-slate-400">
                  We'll send a 6-digit recovery OTP directly to your inbox.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-60"
              >
                {loading ? "Sending Code..." : "Send Recovery Code"}
              </button>
            </form>
          )}

          {/* STEP 2: Enter 6-Digit OTP */}
          {step === 2 && (
            <form onSubmit={handleVerifyOtpStep} className="mt-5 space-y-4">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Enter 6-Digit Recovery Code
                  </label>
                  <span className="text-[10px] font-semibold text-emerald-500">
                    Valid for 5 mins
                  </span>
                </div>

                <input
                  type="text"
                  required
                  maxLength={6}
                  inputMode="numeric"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                  placeholder="• • • • • •"
                  className="w-full text-center tracking-[10px] font-mono font-black text-xl rounded-2xl border border-slate-200 bg-slate-50/50 py-3 text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                />

                <div className="mt-2.5 flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex items-center gap-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                  >
                    <ArrowLeft size={13} />
                    <span>Change email</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={cooldown > 0 || resending}
                    className="font-bold text-indigo-600 hover:underline dark:text-cyan-400 disabled:opacity-50 disabled:no-underline"
                  >
                    {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={verifyOtpLoading || otp.length !== 6}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-60"
              >
                <span>{verifyOtpLoading ? "Verifying Code..." : "Verify Code & Continue"}</span>
              </button>
            </form>
          )}

          {/* STEP 3: Enter New Password */}
          {step === 3 && (
            <form onSubmit={handleResetPassword} className="mt-5 space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 pr-9 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-3 text-slate-400 hover:text-indigo-600"
                  >
                    {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Confirm New Password *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 pl-9 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-950/50 dark:text-white"
                  />
                  <Lock size={15} className="absolute left-3 top-3 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="btn-primary flex w-full items-center justify-center gap-2 rounded-2xl py-2.5 text-xs font-bold shadow-lg shadow-indigo-500/20 disabled:opacity-60"
              >
                {loading ? "Updating Password..." : "Save New Password"}
              </button>
            </form>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default ForgotPasswordModal;
