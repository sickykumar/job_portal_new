import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  KeyRound,
  Mail,
  Lock,
  Eye,
  EyeOff,
  CheckCircle2,
  AlertCircle,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import api from "../services/api";

const ForgotPassword = () => {
  const [step, setStep] = useState(1); // 1: Email, 2: OTP, 3: New Password
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [verifyOtpLoading, setVerifyOtpLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [cooldown, setCooldown] = useState(0);

  const navigate = useNavigate();

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
        setMessage(res.data.message || "A 6-digit recovery code has been sent to your registered email (valid for 5 minutes).");
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
        setMessage("Fresh recovery code sent to your inbox (valid for 5 minutes).");
        startCooldown();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code.");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Validate OTP with backend -> proceed to Step 3 ONLY on success!
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
        err.response?.data?.message || "Incorrect recovery code. Please check your email and try again."
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
        setMessage("Password updated successfully! A security confirmation notice was sent to your email.");
        setTimeout(() => {
          navigate("/login");
        }, 2200);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. Please check your code.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-10 sm:py-14">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        <div className="relative">
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-r from-rose-500/15 via-violet-500/10 to-indigo-600/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/80 p-6 shadow-[0_25px_70px_rgba(15,23,42,.14)] backdrop-blur-2xl sm:p-8 dark:border-slate-700/70 dark:bg-slate-950/80 dark:shadow-black/30">
            
            {/* Header */}
            <div className="mb-7 text-center">
              <motion.div
                whileHover={{ scale: 1.06, rotate: -2 }}
                className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-[20px] bg-gradient-to-br from-rose-500 via-pink-500 to-indigo-600 shadow-[0_10px_35px_rgba(244,63,94,.35)]"
              >
                <div className="absolute inset-[3px] rounded-[17px] bg-gradient-to-br from-rose-600 to-indigo-700" />
                <div className="relative z-10 flex h-9 w-9 items-center justify-center rounded-full bg-slate-950 shadow-inner">
                  <KeyRound className="h-5 w-5 text-rose-300" />
                </div>
                <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-rose-400 shadow-[0_0_15px_5px_rgba(244,63,94,.6)]" />
              </motion.div>

              <div className="mb-1 flex items-center justify-center gap-2">
                <h2 className="text-2xl font-black tracking-tight text-slate-950 sm:text-3xl dark:text-white">
                  Account Recovery
                </h2>
                <Sparkles className="h-4 w-4 text-rose-500" />
              </div>

              <p className="mx-auto max-w-sm text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                {step === 1
                  ? "Enter your registered email address to receive a secure recovery code."
                  : step === 2
                  ? `Enter the 6-digit recovery code sent to ${email}`
                  : "Create a strong new password for your PathKhojo account."}
              </p>

              {/* Progress Pill */}
              <div className="mt-4 flex items-center justify-center gap-2">
                <span className={`h-2 rounded-full transition-all duration-300 ${step >= 1 ? "w-8 bg-rose-500" : "w-2 bg-slate-200 dark:bg-slate-800"}`} />
                <span className={`h-2 rounded-full transition-all duration-300 ${step >= 2 ? "w-8 bg-rose-500" : "w-2 bg-slate-200 dark:bg-slate-800"}`} />
                <span className={`h-2 rounded-full transition-all duration-300 ${step >= 3 ? "w-8 bg-rose-500" : "w-2 bg-slate-200 dark:bg-slate-800"}`} />
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-3.5 text-xs text-rose-600 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-5">{error}</span>
              </motion.div>
            )}

            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-5">{message}</span>
              </motion.div>
            )}

            {/* STEP 1: Enter Email */}
            {step === 1 && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Registered Email Address
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. yourname@example.com"
                      className="form-input !h-12 !rounded-xl !border-slate-200/80 !bg-white/70 !pl-10 !text-sm transition-all focus:!border-rose-500/50 focus:!ring-4 focus:!ring-rose-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                    />
                  </div>
                  <p className="mt-1.5 text-[10px] text-slate-400">
                    We will send a 6-digit passcode valid for 5 minutes to this address.
                  </p>
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(244,63,94,.25)] transition-all hover:shadow-[0_12px_35px_rgba(244,63,94,.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative">
                    {loading ? "Sending Recovery Code..." : "Send Recovery Code"}
                  </span>
                </motion.button>
              </form>
            )}

            {/* STEP 2: Enter 6-Digit OTP */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtpStep} className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
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
                    autoFocus
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                    placeholder="• • • • • •"
                    className="w-full text-center tracking-[12px] font-mono font-black text-2xl rounded-2xl border border-slate-200 bg-white/90 py-3.5 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"
                  />

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
                    >
                      <ArrowLeft size={13} />
                      <span>Change email</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={cooldown > 0 || resending}
                      className="font-bold text-rose-600 hover:underline dark:text-rose-400 disabled:opacity-50 disabled:no-underline"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Code"}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={verifyOtpLoading || otp.length !== 6}
                  className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(244,63,94,.25)] transition-all hover:shadow-[0_12px_35px_rgba(244,63,94,.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative">
                    {verifyOtpLoading ? "Verifying Code..." : "Verify Code & Continue"}
                  </span>
                </motion.button>
              </form>
            )}

            {/* STEP 3: Enter New Password */}
            {step === 3 && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    New Password *
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="••••••••"
                      className="form-input !h-12 !rounded-xl !border-slate-200/80 !bg-white/70 !pl-10 !pr-11 !text-sm transition-all focus:!border-rose-500/50 focus:!ring-4 focus:!ring-rose-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-rose-600 dark:hover:text-rose-400"
                    >
                      {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Confirm New Password *
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-rose-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      className="form-input !h-12 !rounded-xl !border-slate-200/80 !bg-white/70 !pl-10 !text-sm transition-all focus:!border-rose-500/50 focus:!ring-4 focus:!ring-rose-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-rose-600 via-pink-600 to-indigo-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(244,63,94,.25)] transition-all hover:shadow-[0_12px_35px_rgba(244,63,94,.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative">
                    {loading ? "Updating Password..." : "Save New Password"}
                  </span>
                </motion.button>
              </form>
            )}

            {/* Footer Navigation */}
            <div className="mt-7 border-t border-slate-200/80 pt-5 text-center dark:border-slate-800">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 transition hover:text-slate-900 dark:text-slate-400 dark:hover:text-white"
              >
                <ArrowLeft size={13} />
                <span>Return to Login</span>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
