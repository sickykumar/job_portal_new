import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  Mail,
  Briefcase,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ShieldCheck,
  ArrowLeft,
  KeyRound,
  CheckCircle2,
} from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import ForgotPasswordModal from "../components/ForgotPasswordModal";
import NexHireLogo from "../components/common/NexHireLogo";

const Login = ({ onSuccess }) => {
  // Step 1: Credentials | Step 2: OTP Verification
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [infoMsg, setInfoMsg] = useState("");

  // OTP Verification State
  const [otp, setOtp] = useState("");
  const [otpLoading, setOtpLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  // Forgot Password Modal State
  const [showForgotModal, setShowForgotModal] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const startCooldown = () => {
    setCooldown(15);
    const timer = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  // Step 1: Handle Initial Login (Password + Credential Verification)
  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setInfoMsg("");
    setLoading(true);

    try {
      const res = await api.post("/user/login", {
        email: email.trim().toLowerCase(),
        password,
        role,
      });

      // Candidate or Recruiter: OTP Verification Required
      if (res.data?.requireOtp) {
        setStep(2);
        setInfoMsg(res.data.message || `A 6-digit verification code was sent to ${email}.`);
        startCooldown();
        return;
      }

      // Direct Login (Admin or direct auth session)
      if (res.data?.success) {
        login(res.data.user, res.data.token);

        if (onSuccess) {
          onSuccess(res.data.user);
        } else {
          navigate(
            res.data.user?.role === "admin"
              ? "/admin-dashboard"
              : res.data.user?.role === "recruiter"
              ? "/recruiter-dashboard"
              : "/candidate-dashboard"
          );
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid credentials. Please verify your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Handle OTP Verification
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    if (otp.trim().length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setError("");
    setOtpLoading(true);

    try {
      const res = await api.post("/user/login-verify-otp", {
        email: email.trim().toLowerCase(),
        otp: otp.trim(),
        role,
      });

      if (res.data?.success) {
        login(res.data.user, res.data.token);

        if (onSuccess) {
          onSuccess(res.data.user);
        } else {
          navigate(
            res.data.user?.role === "recruiter"
              ? "/recruiter-dashboard"
              : "/candidate-dashboard"
          );
        }
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Invalid or expired verification code. Please check your inbox and try again."
      );
    } finally {
      setOtpLoading(false);
    }
  };

  // Resend Login OTP
  const handleResendOtp = async () => {
    if (cooldown > 0 || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await api.post("/user/login-resend-otp", {
        email: email.trim().toLowerCase(),
      });
      if (res.data?.success) {
        setInfoMsg(`Fresh verification code sent to ${email}.`);
        startCooldown();
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend code. Please wait.");
    } finally {
      setResending(false);
    }
  };

  // Google Auth Success Handler (Candidate & Recruiter only)
  const handleGoogleSuccess = (user, token) => {
    login(user, token);

    if (onSuccess) {
      onSuccess(user);
    } else {
      navigate(
        user.role === "recruiter"
          ? "/recruiter-dashboard"
          : "/candidate-dashboard"
      );
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
          <div className="absolute -inset-4 -z-10 rounded-[40px] bg-gradient-to-r from-blue-500/15 via-cyan-400/10 to-violet-600/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-[30px] border border-white/70 bg-white/75 p-6 shadow-[0_25px_70px_rgba(15,23,42,.14)] backdrop-blur-2xl sm:p-8 dark:border-slate-700/70 dark:bg-slate-950/75 dark:shadow-black/30">
            
            {/* Brand Header */}
            <div className="mb-6 text-center flex flex-col items-center">
              <NexHireLogo size="lg" showText={true} showSubtitle={true} asLink to="/" className="mb-4" />

              <div className="mb-1 flex items-center justify-center gap-2">
                <h2 className="text-xl font-black tracking-tight text-slate-950 sm:text-2xl dark:text-white">
                  {step === 2 ? "Two-Factor Verification" : "Welcome Back"}
                </h2>
                <Sparkles className="h-4 w-4 text-violet-500" />
              </div>

              <p className="mx-auto max-w-sm text-xs leading-5 text-slate-500 sm:text-sm dark:text-slate-400">
                {step === 2
                  ? `Enter the 6-digit passcode sent to ${email}`
                  : "Sign in to access opportunities, manage applications, and hire talent."}
              </p>
            </div>

            {/* Role Selector (Disabled during OTP step) */}
            {step === 1 && (
              <div className="mb-6 grid grid-cols-3 gap-1.5 rounded-2xl border border-slate-200/80 bg-slate-100/70 p-1.5 dark:border-slate-700/70 dark:bg-slate-900/70">
                <button
                  type="button"
                  onClick={() => setRole("student")}
                  className={`relative rounded-xl px-2 py-2.5 text-xs font-bold transition-all duration-300 ${
                    role === "student"
                      ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <span className="relative z-10">Candidate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("recruiter")}
                  className={`relative rounded-xl px-2 py-2.5 text-xs font-bold transition-all duration-300 ${
                    role === "recruiter"
                      ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <span className="relative z-10">Recruiter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setRole("admin")}
                  className={`relative rounded-xl px-2 py-2.5 text-xs font-bold transition-all duration-300 ${
                    role === "admin"
                      ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                      : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                  }`}
                >
                  <span className="relative z-10">Admin</span>
                </button>
              </div>
            )}

            {/* Direct Google Sign-In (Candidate & Recruiter ONLY - Hidden for Admin) */}
            {step === 1 && role !== "admin" && (
              <div className="mb-5 space-y-4">
                <GoogleAuthButton
                  role={role}
                  mode="signin"
                  onSuccess={handleGoogleSuccess}
                  onError={(msg) => setError(msg)}
                />

                <div className="relative flex items-center justify-center">
                  <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
                  <span className="absolute bg-white px-3 text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-950">
                    Or sign in with email
                  </span>
                </div>
              </div>
            )}

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

            {infoMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-5 flex items-start gap-3 rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3.5 text-xs text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
                <span className="leading-5">{infoMsg}</span>
              </motion.div>
            )}

            {/* STEP 1: Email + Password Form */}
            {step === 1 && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="mb-2 block text-xs font-bold text-slate-600 dark:text-slate-300">
                    Email Address
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      className="form-input !h-12 !rounded-xl !border-slate-200/80 !bg-white/70 !pl-10 !text-sm transition-all focus:!border-blue-500/50 focus:!ring-4 focus:!ring-blue-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                      placeholder={role === "admin" ? "admin@gmail.com" : "name@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                      Password
                    </label>
                    {role !== "admin" && (
                      <Link
                        to="/forgot-password"
                        className="text-[11px] font-bold text-blue-600 hover:underline dark:text-blue-400"
                      >
                        Forgot Password?
                      </Link>
                    )}
                  </div>

                  <div className="group relative">
                    <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      autoComplete="current-password"
                      className="form-input !h-12 !rounded-xl !border-slate-200/80 !bg-white/70 !pl-10 !pr-11 !text-sm transition-all focus:!border-blue-500/50 focus:!ring-4 focus:!ring-blue-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="group relative mt-2 flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,.25)] transition-all hover:shadow-[0_12px_35px_rgba(37,99,235,.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                  <span className="relative">
                    {loading ? "Verifying..." : role === "admin" ? "Master Sign In" : "Sign In & Get Code"}
                  </span>
                </motion.button>
              </form>
            )}

            {/* STEP 2: 6-Digit Email OTP Verification */}
            {step === 2 && (
              <form onSubmit={handleVerifyOtp} className="space-y-5">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                      Security Passcode (6 Digits)
                    </label>
                    <span className="text-[11px] font-semibold text-emerald-500">
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
                    className="w-full text-center tracking-[12px] font-mono font-black text-2xl rounded-2xl border border-slate-200 bg-white/90 py-3.5 text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/10 dark:border-slate-700 dark:bg-slate-900/90 dark:text-white"
                  />

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setError("");
                        setOtp("");
                      }}
                      className="flex items-center gap-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 font-semibold"
                    >
                      <ArrowLeft size={13} />
                      <span>Back to Login</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={cooldown > 0 || resending}
                      className="font-bold text-blue-600 hover:underline dark:text-cyan-400 disabled:opacity-50 disabled:no-underline"
                    >
                      {cooldown > 0 ? `Resend in ${cooldown}s` : "Resend Passcode"}
                    </button>
                  </div>
                </div>

                <motion.button
                  whileHover={{ y: -1 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={otpLoading || otp.length !== 6}
                  className="group relative flex h-12 w-full items-center justify-center overflow-hidden rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-sm font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,.25)] transition-all hover:shadow-[0_12px_35px_rgba(37,99,235,.35)] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="relative">
                    {otpLoading ? "Verifying Code..." : "Verify & Complete Sign In"}
                  </span>
                </motion.button>
              </form>
            )}

            {/* Footer */}
            <div className="mt-7 border-t border-slate-200/80 pt-5 text-center dark:border-slate-800">
              {role !== "admin" ? (
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Don't have an account yet?{" "}
                  <Link
                    to="/register"
                    className="font-bold text-blue-600 transition hover:text-violet-600 hover:underline dark:text-blue-400 dark:hover:text-violet-400"
                  >
                    Create Account
                  </Link>
                </p>
              ) : (
                <p className="text-xs text-slate-400">
                  Super Administrator master credentials are provisioned internally. Public registration is disabled.
                </p>
              )}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Forgot Password Modal */}
      <ForgotPasswordModal
        isOpen={showForgotModal}
        onClose={() => setShowForgotModal(false)}
        onSuccess={() => {
          setInfoMsg("Password reset successfully. Please sign in with your new credentials.");
        }}
      />
    </div>
  );
};

export default Login;
