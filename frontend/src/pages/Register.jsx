import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  Mail,
  User,
  Briefcase,
  AlertCircle,
  CheckCircle,
  Upload,
  Eye,
  EyeOff,
  ShieldCheck,
  Building2,
  FileCheck2,
} from "lucide-react";
import GoogleAuthButton from "../components/GoogleAuthButton";
import CaptchaWidget from "../components/CaptchaWidget";
import TermsModal from "../components/TermsModal";
import PathKhojoLogo from "../components/common/PathKhojoLogo";

const Register = () => {
  const [fullname, setFullname] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [adharcard, setAdharcard] = useState("");
  const [pancard, setPancard] = useState("");
  const [role, setRole] = useState("student");
  const [file, setFile] = useState(null);
  const [avatarPreview, setAvatarPreview] = useState(null);

  // Security & Compliance State
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isCaptchaVerified, setIsCaptchaVerified] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAvatarPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMsg("");

    if (!agreedToTerms) {
      setError("Please agree to the Terms of Service & Privacy Policy to create an account.");
      return;
    }

    if (!isCaptchaVerified) {
      setError("Please verify the security captcha challenge below.");
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("fullname", fullname.trim());
      formData.append("email", email.trim());
      formData.append("phoneNumber", phoneNumber.trim());
      formData.append("password", password);
      formData.append("role", role);

      // Aadhaar and PAN are strictly required for recruiters only
      if (role === "recruiter") {
        const cleanAadhaar = adharcard.replace(/\s+/g, "").trim();
        const cleanPAN = pancard.toUpperCase().trim();
        if (!cleanAadhaar || cleanAadhaar.length < 12) {
          setError("Please provide a valid 12-digit Aadhaar number for recruiter identity verification.");
          setLoading(false);
          return;
        }
        if (!cleanPAN || cleanPAN.length < 10) {
          setError("Please provide a valid 10-character PAN card number for recruiter identity verification.");
          setLoading(false);
          return;
        }
        formData.append("adharcard", cleanAadhaar);
        formData.append("pancard", cleanPAN);
      }

      if (file) formData.append("profilePhoto", file);

      const res = await api.post("/user/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data?.success) {
        setSuccessMsg("Account registered successfully! Redirecting to login...");
        setTimeout(() => navigate("/login"), 1500);
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        "Registration failed. Please check the provided information."
      );
    } finally {
      setLoading(false);
    }
  };

  // Google Sign-Up Handler
  const handleGoogleSuccess = (user, token) => {
    login(user, token);
    navigate(user.role === "recruiter" ? "/recruiter-dashboard" : "/candidate-dashboard");
  };

  return (
    <div className="min-h-[calc(100vh-72px)] w-full px-3 py-3 sm:px-4 sm:py-4">
      <motion.div
        initial={{ opacity: 0, y: 25, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="mx-auto w-full max-w-lg"
      >
        <div className="relative">
          <div className="absolute -inset-2 -z-10 rounded-[30px] bg-gradient-to-r from-blue-500/15 via-cyan-400/10 to-violet-600/15 blur-2xl sm:-inset-3" />

          <div className="relative overflow-hidden rounded-[22px] border border-white/70 bg-white/80 p-4 shadow-[0_25px_70px_rgba(15,23,42,.14)] backdrop-blur-2xl sm:rounded-[26px] sm:p-5 dark:border-slate-700/70 dark:bg-slate-950/80 dark:shadow-black/30">
            
            {/* Brand Header */}
            <div className="mb-4 text-center flex flex-col items-center">
              <PathKhojoLogo size="md" showText={true} showSubtitle={true} asLink to="/" className="mb-2" />
              <h2 className="text-lg font-black tracking-tight text-slate-950 sm:text-xl dark:text-white">
                Create Account
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Join as a Job Candidate or Verified Employer.
              </p>
            </div>

            {/* Role Selector */}
            <div className="mb-3 grid grid-cols-2 gap-1 rounded-lg border border-slate-200/80 bg-slate-100/70 p-1 dark:border-slate-700/70 dark:bg-slate-900/70">
              <button
                type="button"
                onClick={() => setRole("student")}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-300 ${
                  role === "student"
                    ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <User className="h-3.5 w-3.5" />
                <span>Job Candidate</span>
              </button>

              <button
                type="button"
                onClick={() => setRole("recruiter")}
                className={`flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-bold transition-all duration-300 ${
                  role === "recruiter"
                    ? "bg-gradient-to-r from-blue-500 to-violet-600 text-white shadow-lg shadow-blue-500/20"
                    : "text-slate-500 hover:bg-white/70 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white"
                }`}
              >
                <Building2 className="h-3.5 w-3.5" />
                <span>Recruiter / Employer</span>
              </button>
            </div>

            {/* Google Quick Sign-Up (Candidate & Recruiter only) */}
            <div className="mb-3 space-y-2.5">
              <GoogleAuthButton
                role={role}
                mode="signup"
                onSuccess={handleGoogleSuccess}
                onError={(msg) => setError(msg)}
              />

              <div className="relative flex items-center justify-center">
                <div className="w-full border-t border-slate-200/80 dark:border-slate-800" />
                <span className="absolute bg-white px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 dark:bg-slate-950">
                  Or with email
                </span>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-start gap-2 rounded-xl border border-rose-500/20 bg-rose-500/10 p-2.5 text-[11px] leading-4 text-rose-600 dark:text-rose-400"
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-3 flex items-start gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/10 p-2.5 text-[11px] leading-4 text-emerald-600 dark:text-emerald-400"
              >
                <CheckCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegister} className="space-y-2.5">
              
              {/* Full Name */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                  Full Name *
                </label>
                <div className="group relative">
                  <User className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                  <input
                    type="text"
                    required
                    autoComplete="name"
                    className="form-input !h-9 !w-full !min-w-0 !rounded-lg !border-slate-200/80 !bg-white/70 !pl-9 !text-[13px] transition-all focus:!border-blue-500/50 focus:!ring-4 focus:!ring-blue-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                    placeholder={role === "recruiter" ? "e.g. Priya Nair (Hiring Lead)" : "e.g. Rahul Sharma"}
                    value={fullname}
                    onChange={(e) => setFullname(e.target.value)}
                  />
                </div>
              </div>

              {/* Email + Password */}
              <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                    Email Address *
                  </label>
                  <div className="group relative">
                    <Mail className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      className="form-input !h-9 !w-full !min-w-0 !rounded-lg !border-slate-200/80 !bg-white/70 !pl-9 !text-[13px] transition-all focus:!border-blue-500/50 focus:!ring-4 focus:!ring-blue-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                      placeholder={role === "recruiter" ? "recruiter@company.com" : "candidate@example.com"}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-[11px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                    Password *
                  </label>
                  <div className="group relative">
                    <Lock className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400 transition-colors group-focus-within:text-blue-500" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      minLength={6}
                      autoComplete="new-password"
                      className="form-input !h-9 !w-full !min-w-0 !rounded-lg !border-slate-200/80 !bg-white/70 !pl-9 !pr-10 !text-[13px] transition-all focus:!border-blue-500/50 focus:!ring-4 focus:!ring-blue-500/10 dark:!border-slate-700 dark:!bg-slate-900/70"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((prev) => !prev)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-blue-600 dark:hover:text-blue-400"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <p className="mt-1 text-[9px] text-slate-400">Minimum 6 characters</p>
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                  Mobile Phone (India +91) *
                </label>
                <div className="flex min-w-0">
                  <span className="flex h-9 shrink-0 items-center gap-1.5 rounded-l-lg border border-r-0 border-slate-200/80 bg-slate-100/80 px-2.5 text-[10px] font-bold text-slate-700 sm:px-3 sm:text-xs dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
                    <span>🇮🇳</span>
                    <span>+91</span>
                  </span>
                  <input
                    type="tel"
                    required
                    inputMode="numeric"
                    className="form-input !h-9 !min-w-0 !rounded-l-none !text-[13px]"
                    placeholder="98765 43210"
                    value={phoneNumber.replace(/^\+91\s*/, "")}
                    onChange={(e) => {
                      const val = e.target.value.replace(/[^0-9\s]/g, "").slice(0, 11);
                      setPhoneNumber(val ? `+91 ${val.trim()}` : "");
                    }}
                  />
                </div>
              </div>

              {/* Aadhaar + PAN (STRICTLY REQUIRED FOR RECRUITERS ONLY — HIDDEN FOR CANDIDATES) */}
              {role === "recruiter" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3"
                >
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 dark:text-amber-400">
                    <ShieldCheck className="h-4 w-4 shrink-0 text-amber-500" />
                    <span>Recruiter KYC & Identity Verification</span>
                  </div>

                  <div className="grid grid-cols-1 gap-3 min-[520px]:grid-cols-2">
                    <div className="min-w-0">
                      <label className="mb-1 block text-[10px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                        Aadhaar Number *
                      </label>
                      <input
                        type="text"
                        required
                        inputMode="numeric"
                        maxLength={14}
                        className="form-input !h-9 !w-full !min-w-0 !rounded-lg !text-[13px]"
                        placeholder="5432 1098 7654"
                        value={adharcard}
                        onChange={(e) => {
                          const digits = e.target.value.replace(/[^0-9]/g, "").slice(0, 12);
                          setAdharcard(digits.replace(/(\d{4})(?=\d)/g, "$1 "));
                        }}
                      />
                    </div>

                    <div className="min-w-0">
                      <label className="mb-1 block text-[10px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                        PAN Card *
                      </label>
                      <input
                        type="text"
                        required
                        maxLength={10}
                        className="form-input !h-9 !w-full !min-w-0 !rounded-lg !text-[13px] uppercase"
                        placeholder="ABCDE1234F"
                        value={pancard}
                        onChange={(e) => setPancard(e.target.value.toUpperCase().slice(0, 10))}
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Profile Photo */}
              <div>
                <label className="mb-1 block text-[11px] font-bold text-slate-600 sm:text-xs dark:text-slate-300">
                  {role === "recruiter" ? "Company Logo / Recruiter Photo" : "Profile Photo"}{" "}
                  <span className="font-normal text-slate-400">(Optional)</span>
                </label>

                <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-dashed border-slate-300 bg-slate-50/70 p-2 dark:border-slate-700 dark:bg-slate-900/60">
                  {avatarPreview ? (
                    <img
                      src={avatarPreview}
                      alt="Profile preview"
                      className="h-10 w-10 shrink-0 rounded-lg object-cover ring-2 ring-blue-500/20"
                    />
                  ) : (
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-300 bg-white text-slate-400 dark:border-slate-700 dark:bg-slate-950">
                      <Upload className="h-4 w-4" />
                    </div>
                  )}

                  <div className="min-w-0 flex-1">
                    <input
                      id="profilePhoto"
                      type="file"
                      accept="image/jpeg,image/png,image/webp"
                      onChange={handleFileChange}
                      className="block w-full min-w-0 cursor-pointer text-[10px] text-slate-500 file:mr-2 file:rounded-lg file:border-0 file:bg-blue-50 file:px-2.5 file:py-1.5 file:text-[10px] file:font-bold file:text-blue-700 hover:file:bg-blue-100 dark:text-slate-400 dark:file:bg-blue-500/10 dark:file:text-blue-400"
                    />
                    <p className="mt-0.5 truncate text-[9px] text-slate-400">JPG, PNG or WEBP</p>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <CaptchaWidget
                  isVerified={isCaptchaVerified}
                  onVerify={(val) => setIsCaptchaVerified(val)}
                />
              </div>

              {/* Terms */}
              <div className="flex items-start gap-2">
                <input
                  type="checkbox"
                  id="agreeTerms"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-0.5 h-3.5 w-3.5 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-700 dark:bg-slate-900"
                />
                <label htmlFor="agreeTerms" className="text-[11px] text-slate-600 dark:text-slate-400 leading-4">
                  I agree to the{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                  >
                    Terms of Service
                  </button>{" "}
                  and{" "}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="font-bold text-indigo-600 hover:underline dark:text-cyan-400"
                  >
                    Privacy Policy
                  </button>
                  .
                </label>
              </div>

              {/* Submit Button */}
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || !agreedToTerms || !isCaptchaVerified}
                className="group relative flex h-9 w-full items-center justify-center overflow-hidden rounded-lg bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-[13px] font-bold text-white shadow-[0_10px_30px_rgba(37,99,235,.25)] transition-all hover:shadow-[0_12px_35px_rgba(37,99,235,.35)] disabled:cursor-not-allowed disabled:opacity-50"
              >
                <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
                <span className="relative">
                  {loading
                    ? "Creating Account..."
                    : role === "recruiter"
                    ? "Register Employer Account"
                    : "Register Candidate Account"}
                </span>
              </motion.button>
            </form>

            {/* Footer */}
            <div className="mt-3 border-t border-slate-200/80 pt-3 text-center dark:border-slate-800">
              <p className="text-[11px] text-slate-500 sm:text-xs dark:text-slate-400">
                Already have an account?{" "}
                <Link
                  to="/login"
                  className="font-bold text-blue-600 transition hover:text-violet-600 hover:underline dark:text-blue-400 dark:hover:text-violet-400"
                >
                  Sign In
                </Link>
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Interactive Terms & Privacy Modal */}
      <TermsModal
        isOpen={showTermsModal}
        onClose={() => setShowTermsModal(false)}
        onAccept={() => setAgreedToTerms(true)}
      />
    </div>
  );
};

const SparklesIcon = () => <span className="text-[10px]">✦</span>;

export default Register;
