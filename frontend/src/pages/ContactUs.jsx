import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Send,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Mail,
  Phone,
  MapPin,
  Clock,
  MessageSquare,
  ChevronDown,
  Copy,
  Shield,
  Sparkles,
  Building2,
  BriefcaseBusiness,
  HelpCircle,
  Bug,
  Lightbulb,
  CreditCard,
  Handshake,
  UserX,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

const CATEGORIES = [
  { value: "general", label: "General Inquiry", icon: HelpCircle, color: "text-slate-500" },
  { value: "technical", label: "Technical Support", icon: Bug, color: "text-red-500" },
  { value: "account_issue", label: "Account Issue", icon: UserX, color: "text-amber-500" },
  { value: "feature_request", label: "Feature Request", icon: Lightbulb, color: "text-cyan-500" },
  { value: "bug_report", label: "Bug Report", icon: Bug, color: "text-rose-500" },
  { value: "billing", label: "Billing & Payments", icon: CreditCard, color: "text-emerald-500" },
  { value: "partnership", label: "Business & Partnership", icon: Handshake, color: "text-violet-500" },
];

const FAQ_ITEMS = [
  {
    q: "How do I reset my password?",
    a: "Go to Account Settings → Password & Security and click 'Update Password'. If you've forgotten your login credentials, use the 'Forgot Password' link on the login page.",
  },
  {
    q: "How can I delete or update my resume?",
    a: "Navigate to your Candidate Dashboard. Your active resume card has Preview, Download, Replace, and Remove buttons. You can drag & drop a new PDF to instantly replace your current resume.",
  },
  {
    q: "Why was my application rejected?",
    a: "When a recruiter rejects your application, they may provide constructive feedback. Check 'My Applications' for any notes. You can also use the AI Career Coach to improve your profile.",
  },
  {
    q: "How does AI Resume Match work?",
    a: "Our Gemini AI downloads and parses your full PDF resume, then benchmarks your actual projects, work experience, and certifications against the job description to calculate a realistic fit percentage.",
  },
  {
    q: "Is my Aadhaar and PAN data safe?",
    a: "Yes. NexHire never stores raw identity numbers. We only maintain masked representations (e.g. XXXX XXXX 1234) and cryptographic hashes. All data is encrypted with AES-256 at rest and TLS 1.3 in transit.",
  },
];

const ContactUs = () => {
  const { user } = useAuth();

  const [form, setForm] = useState({
    name: user?.fullname || "",
    email: user?.email || "",
    subject: "",
    category: "general",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState({ success: "", error: "", ticketId: "" });
  const [openFaq, setOpenFaq] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setResult({ success: "", error: "", ticketId: "" });

    if (!form.name.trim() || !form.email.trim() || !form.subject.trim() || !form.message.trim()) {
      setResult({ success: "", error: "Please fill in all required fields.", ticketId: "" });
      return;
    }

    setLoading(true);
    try {
      const { data } = await api.post("/contact/submit", form);
      if (data?.success) {
        setResult({ success: data.message, error: "", ticketId: data.ticketId || "" });
        setForm((prev) => ({ ...prev, subject: "", category: "general", message: "" }));
      }
    } catch (err) {
      setResult({
        success: "",
        error: err.response?.data?.message || "Failed to send message. Please try again.",
        ticketId: "",
      });
    } finally {
      setLoading(false);
    }
  };

  const copyTicketId = () => {
    navigator.clipboard.writeText(result.ticketId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full px-3 py-3 sm:px-6 lg:px-8 min-w-0 overflow-x-hidden">
      {/* Sleek Compact Header */}
      <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white">
              Contact & Support
            </h1>
            <span className="rounded-full bg-indigo-100 px-2 py-0.5 text-[10px] font-bold text-indigo-700 dark:bg-indigo-500/20 dark:text-cyan-300">
              Helpdesk
            </span>
          </div>
          <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Questions, feedback, or partnerships — our team responds within 24-48 hours
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Contact Form (3 cols) */}
        <div className="lg:col-span-3">
          <div className="glass-panel p-6 sm:p-8">
            <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5 flex items-center gap-2">
              <Send size={18} className="text-indigo-500 dark:text-cyan-400" />
              Send Us a Message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name & Email Row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Full Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="Your full name"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Email Address <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                  />
                </div>
              </div>

              {/* Subject */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Subject <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  name="subject"
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is this about?"
                  maxLength={200}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                />
              </div>

              {/* Category */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {CATEGORIES.map((cat) => {
                    const Icon = cat.icon;
                    const isActive = form.category === cat.value;
                    return (
                      <button
                        key={cat.value}
                        type="button"
                        onClick={() => setForm({ ...form, category: cat.value })}
                        className={`flex items-center gap-1.5 rounded-xl border px-3 py-2 text-[11px] font-semibold transition ${
                          isActive
                            ? "border-indigo-500 bg-indigo-50 text-indigo-700 dark:border-cyan-500 dark:bg-cyan-500/10 dark:text-cyan-300"
                            : "border-slate-200 bg-white text-slate-600 hover:border-slate-300 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-400"
                        }`}
                      >
                        <Icon size={13} className={isActive ? "text-indigo-500 dark:text-cyan-400" : cat.color} />
                        <span className="truncate">{cat.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="mb-1.5 block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Message <span className="text-rose-500">*</span>
                </label>
                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  rows={5}
                  maxLength={5000}
                  placeholder="Describe your question, issue, or proposal in detail..."
                  className="w-full resize-none rounded-xl border border-slate-200 bg-slate-50/50 px-3.5 py-2.5 text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900/50 dark:text-white"
                />
                <p className="mt-1 text-right text-[10px] text-slate-400">
                  {form.message.length} / 5000
                </p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="btn-primary text-sm w-full sm:w-auto py-3 px-6 disabled:opacity-60"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send size={16} />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>

            {/* Success */}
            <AnimatePresence>
              {result.success && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-emerald-700 dark:text-emerald-300">
                        {result.success}
                      </p>
                      {result.ticketId && (
                        <div className="mt-2 flex items-center gap-2">
                          <span className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-300">
                            {result.ticketId}
                          </span>
                          <button
                            type="button"
                            onClick={copyTicketId}
                            className="rounded-lg p-1.5 text-emerald-600 hover:bg-emerald-100 dark:hover:bg-emerald-500/20"
                          >
                            <Copy size={14} />
                          </button>
                          {copied && (
                            <span className="text-[10px] font-bold text-emerald-600">Copied!</span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Error */}
            {result.error && (
              <div className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 dark:border-rose-500/20 dark:bg-rose-500/10 flex items-center gap-2">
                <AlertCircle size={18} className="text-rose-600 dark:text-rose-400 shrink-0" />
                <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{result.error}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Info Cards & FAQ (2 cols) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Contact Info */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Building2 size={16} className="text-indigo-500 dark:text-cyan-400" />
              Quick Contact
            </h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-indigo-50 p-2.5 dark:bg-indigo-500/10">
                  <Mail size={16} className="text-indigo-600 dark:text-cyan-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Email Support</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">support@nexhire.com</p>
                  <p className="text-[10px] text-slate-400">Response within 24-48 hours</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-emerald-50 p-2.5 dark:bg-emerald-500/10">
                  <Phone size={16} className="text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Phone</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">+91 80-NEXHIRE-01</p>
                  <p className="text-[10px] text-slate-400">Mon–Fri, 9 AM – 6 PM IST</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-violet-50 p-2.5 dark:bg-violet-500/10">
                  <MapPin size={16} className="text-violet-600 dark:text-violet-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Registered Office</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    NexHire Platforms Technologies Pvt. Ltd.
                  </p>
                  <p className="text-[10px] text-slate-400">Bengaluru, Karnataka — 560001, India</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="rounded-xl bg-amber-50 p-2.5 dark:bg-amber-500/10">
                  <Clock size={16} className="text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Business Hours</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Mon – Fri: 9:00 AM – 6:00 PM IST</p>
                  <p className="text-[10px] text-slate-400">Sat – Sun: Closed</p>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Accordion */}
          <div className="glass-panel p-6">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Sparkles size={16} className="text-indigo-500 dark:text-cyan-400" />
              Frequently Asked Questions
            </h3>
            <div className="space-y-2">
              {FAQ_ITEMS.map((item, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-slate-100 dark:border-slate-800 overflow-hidden"
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <span>{item.q}</span>
                    <ChevronDown
                      size={14}
                      className={`text-slate-400 transition-transform shrink-0 ${
                        openFaq === idx ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <AnimatePresence>
                    {openFaq === idx && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-3 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                          {item.a}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </div>

          {/* Security Badge */}
          <div className="rounded-2xl border border-emerald-200/60 bg-emerald-50/50 p-4 dark:border-emerald-500/15 dark:bg-emerald-500/5 flex items-start gap-3">
            <Shield size={20} className="text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300">
                Your data is protected
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400/70 leading-relaxed">
                All messages are encrypted in transit via TLS 1.3. We never share your contact details with third parties.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
