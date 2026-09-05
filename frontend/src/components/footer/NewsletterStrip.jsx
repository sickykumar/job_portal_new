import React, { useState } from "react";
import { Sparkles, Send, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import api from "../../services/api";

/**
 * NewsletterStrip Component
 * Production-ready tech job alert subscription strip connecting directly to POST /api/newsletter/subscribe.
 */
const NewsletterStrip = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState({ msg: "", err: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFeedback({ msg: "", err: "" });

    const cleanEmail = email.trim();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setFeedback({ msg: "", err: "Please enter a valid email address." });
      return;
    }

    setLoading(true);

    try {
      const { data } = await api.post("/newsletter/subscribe", {
        email: cleanEmail,
        source: "footer_newsletter_strip",
      });

      if (data?.success) {
        setFeedback({ msg: data.message || "Subscribed successfully!", err: "" });
        setEmail("");
        setTimeout(() => setFeedback({ msg: "", err: "" }), 5000);
      }
    } catch (err) {
      setFeedback({
        msg: "",
        err:
          err.response?.data?.message ||
          "Could not process subscription. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-8 sm:mb-12 rounded-3xl border border-indigo-200/70 bg-gradient-to-br from-indigo-500/10 via-purple-500/5 to-cyan-500/10 p-4 sm:p-6 lg:p-8 dark:border-indigo-500/20">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="max-w-xl">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-600 dark:text-cyan-400 mb-2">
            <Sparkles size={12} />
            <span>Stay Ahead in Tech</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
            Get Curated High-Growth Roles in Your Inbox
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-400">
            Weekly compensation benchmarks, top engineering openings, and AI interview prep tips. No spam, unsubscribe anytime.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2 w-full lg:w-auto">
          <label htmlFor="newsletter-email-input" className="sr-only">
            Email address for job alerts and newsletter
          </label>
          <input
            id="newsletter-email-input"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            placeholder="Enter your work or personal email"
            aria-label="Enter your work or personal email"
            autoComplete="email"
            className="w-full sm:w-80 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs sm:text-sm text-slate-900 outline-none transition focus:border-indigo-500 dark:border-slate-800 dark:bg-slate-900 dark:text-white disabled:opacity-50"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-primary text-xs shrink-0 py-3 px-5 shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {loading ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
            <span>{loading ? "Joining..." : "Join Alert"}</span>
          </button>
        </form>
      </div>

      {/* Success Notification */}
      {feedback.msg && (
        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={15} />
          <span>{feedback.msg}</span>
        </div>
      )}

      {/* Error Notification */}
      {feedback.err && (
        <div className="mt-3 flex items-center gap-2 text-xs font-bold text-rose-600 dark:text-rose-400">
          <AlertCircle size={15} />
          <span>{feedback.err}</span>
        </div>
      )}
    </div>
  );
};

export default NewsletterStrip;
