import React, { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { motion } from "framer-motion";
import api from "../../services/api";
import { Sparkles, Trash2, Send, Copy, Check } from "lucide-react";
import PromptLibrary from "./PromptLibrary";

const fadeUp = {
  hidden: { opacity: 0, y: 15 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

const CareerStrategistTab = ({ user, onRequireLogin }) => {
  const [guestCount, setGuestCount] = useState(() => {
    return parseInt(localStorage.getItem("nexhire_guest_ai_count") || "0", 10);
  });

  const [messages, setMessages] = useState([
    {
      id: Date.now(),
      role: "ai",
      text: user
        ? `Hi ${user?.fullname?.split(" ")[0]}! 👋\n\nI am your AI Career Intelligence Coach. Ask me anything about high-growth tech domains, resume optimization, interview strategies, or how to position your skills for top compensation.`
        : `Welcome to PathKhojo AI Career Coach! 👋\n\nI can provide strategic advice on tech roadmaps, skill positioning, and high-impact salary negotiation. Ask any question below to test drive the AI intelligence!`,
    },
  ]);

  const [inputQuestion, setInputQuestion] = useState("");
  const [copied, setCopied] = useState("");

  const copyText = async (text, id) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(""), 2000);
    } catch {
      // Ignore clipboard error
    }
  };

  const careerChat = useMutation({
    mutationFn: async (question) => {
      const { data } = await api.post("/ai/career-coach", { question });
      if (!data?.success || !data?.answer) {
        throw new Error("No response received from AI service.");
      }
      return data.answer;
    },
    onSuccess: (answer) => {
      setMessages((prev) => [
        ...prev,
        { id: Date.now(), role: "ai", text: answer },
      ]);
    },
    onError: () => {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now(),
          role: "ai",
          text: "I could not connect to the AI model right now. Please check your network and try again in a moment.",
        },
      ]);
    },
  });

  const sendMessage = (question = inputQuestion) => {
    const text = question.trim();
    if (!text || careerChat.isPending) return;

    // Check if guest user has exceeded free trial messages
    if (!user) {
      if (guestCount >= 2) {
        if (onRequireLogin) {
          onRequireLogin("You have experienced 2 free AI coaching prompts. Sign in or create an account to unlock unlimited conversations, custom interview labs, and salary intelligence!");
        }
        return;
      }
      const newCount = guestCount + 1;
      setGuestCount(newCount);
      localStorage.setItem("nexhire_guest_ai_count", newCount.toString());
    }

    setInputQuestion("");
    setMessages((prev) => [
      ...prev,
      { id: Date.now(), role: "user", text },
    ]);
    careerChat.mutate(text);
  };

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      className="w-full flex flex-col gap-6"
    >
      {/* Full-width AI Assistant Chat Box */}
      <section className="glass-panel w-full flex flex-col h-[560px] sm:h-[600px] overflow-hidden">
        {/* Chat Header */}
        <div className="flex items-center justify-between border-b border-slate-200 p-4 dark:border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white shadow-lg">
              <Sparkles size={18} />
            </div>
            <div>
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white">
                Career Strategist AI Assistant
              </h2>
              <div className="mt-0.5 flex items-center gap-1.5 text-[10px] text-emerald-500">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                <span>Online & ready to advise</span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={() =>
              setMessages([
                {
                  id: Date.now(),
                  role: "ai",
                  text: "Chat cleared. What career question or strategy would you like to explore?",
                },
              ])
            }
            className="rounded-xl p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-white/5 dark:hover:text-white"
            title="Clear Chat"
          >
            <Trash2 size={15} />
          </button>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 flex flex-col gap-4 overflow-y-auto p-4 sm:p-5">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.role === "ai" && (
                <div className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                  <Sparkles size={14} />
                </div>
              )}

              <div className="group relative max-w-[88%] sm:max-w-[78%]">
                <div
                  className={`rounded-2xl px-4 py-3 text-xs leading-5 sm:text-sm sm:leading-6 ${
                    msg.role === "user"
                      ? "rounded-br-md bg-gradient-to-r from-blue-600 to-indigo-600 text-white"
                      : "rounded-bl-md border border-slate-200 bg-slate-50 text-slate-700 dark:border-white/10 dark:bg-white/[.04] dark:text-slate-300"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>

                {msg.role === "ai" && (
                  <button
                    type="button"
                    onClick={() => copyText(msg.text, `msg-${msg.id}`)}
                    className="absolute -bottom-6 left-1 flex items-center gap-1 text-[10px] text-slate-400 opacity-0 transition group-hover:opacity-100"
                  >
                    {copied === `msg-${msg.id}` ? (
                      <>
                        <Check size={10} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={10} />
                        <span>Copy text</span>
                      </>
                    )}
                  </button>
                )}
              </div>
            </div>
          ))}

          {careerChat.isPending && (
            <div className="flex gap-2.5">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-violet-600 text-white">
                <Sparkles size={14} />
              </div>
              <div className="rounded-2xl rounded-bl-md border border-slate-200 bg-slate-50 px-4 py-3 dark:border-white/10 dark:bg-white/[.04]">
                <div className="flex gap-1">
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:100ms]" />
                  <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-indigo-500 [animation-delay:200ms]" />
                </div>
              </div>
            </div>
          )}

          {/* Quick Starter Suggestions */}
          {messages.length <= 2 && (
            <div className="mt-auto pt-3">
              <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Suggested Questions
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  "How do I crack ₹25+ LPA roles in India?",
                  "Key topics for distributed systems interview?",
                  "How to showcase AI projects on my resume?",
                ].map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => sendMessage(preset)}
                    className="rounded-full border border-indigo-200/60 bg-indigo-50/70 px-3 py-1.5 text-[11px] font-semibold text-indigo-700 transition hover:bg-indigo-100 hover:border-indigo-300 dark:border-indigo-500/20 dark:bg-indigo-500/10 dark:text-cyan-300 dark:hover:bg-indigo-500/20 text-left shadow-2xs"
                  >
                    💡 {preset}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Composer (Flush at Bottom) */}
        <div className="shrink-0 border-t border-slate-200 p-3 dark:border-white/10 sm:p-4 bg-slate-50/50 dark:bg-slate-900/40">
          <div className="rounded-2xl border border-slate-200 bg-white p-2 focus-within:border-indigo-300 focus-within:ring-2 focus-within:ring-indigo-500/10 dark:border-white/10 dark:bg-slate-800/80 shadow-2xs">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage();
              }}
              className="flex items-end gap-2"
            >
              <textarea
                rows={1}
                value={inputQuestion}
                onChange={(e) => setInputQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask your career question (e.g. How to break into AI engineering?)..."
                className="max-h-28 min-h-[40px] flex-1 resize-none border-0 bg-transparent px-2 py-2 text-xs text-slate-800 outline-none placeholder:text-slate-400 dark:text-white sm:text-sm"
              />

              <button
                type="submit"
                disabled={careerChat.isPending || !inputQuestion.trim()}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md transition hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-40"
              >
                <Send size={15} />
              </button>
            </form>
          </div>

          <p className="mt-2 text-center text-[10px] text-slate-400">
            Press Enter to send · Shift + Enter for new line
          </p>
        </div>
      </section>

      {/* Prompt Library Row (Under the Chat & Enter Button) */}
      <PromptLibrary onSelect={(prompt) => sendMessage(prompt)} />
    </motion.div>
  );
};

export default CareerStrategistTab;
