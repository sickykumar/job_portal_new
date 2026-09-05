import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import {
  Award,
  CheckCircle2,
  XCircle,
  Timer,
  RotateCcw,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Trophy,
  BrainCircuit,
  Zap,
} from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import UniversalLoader from "../components/common/UniversalLoader";

const FALLBACK_QUIZZES = [
  {
    _id: "fb-quiz-1",
    title: "React 19 & Modern State Architecture",
    slug: "react-19-mastery",
    description: "Evaluate your knowledge of React Server Components, useActionState, optimistic updates, and advanced memoization patterns.",
    category: "React",
    level: "Intermediate",
    color: "from-cyan-500 to-blue-600",
    timeLimit: 120,
    attemptsCount: 840,
    passCount: 590,
    questions: [
      {
        q: "In React 19, which hook is natively provided for managing async mutations and pending transition states seamlessly without custom useEffect hooks?",
        options: ["useActionState", "useAsyncMutation", "useServerEffect", "useTransitionState"],
        answer: 0,
        explanation: "React 19 introduces `useActionState` to handle async actions, error states, and pending indicators natively.",
      },
      {
        q: "What is the primary benefit of React Server Components (RSC) compared to standard client rendering?",
        options: [
          "Zero bundle size impact on client for server-only dependencies",
          "Automatic replacement of all CSS stylesheets",
          "Guaranteed 100% SEO score on Google Lighthouse",
          "Elimination of all API endpoints in the backend",
        ],
        answer: 0,
        explanation: "RSC executes exclusively on the server, allowing large libraries and direct DB logic without sending JS to client bundles.",
      },
      {
        q: "Which hook should be used in React 19 to display optimistic UI updates while an async server action is in flight?",
        options: ["useOptimistic", "useInstantState", "useFastUpdate", "usePessimistic"],
        answer: 0,
        explanation: "`useOptimistic` allows updating the UI immediately while an async action completes in the background.",
      },
    ],
  },
  {
    _id: "fb-quiz-2",
    title: "Node.js & Microservices Architecture",
    slug: "nodejs-microservices",
    description: "Test your expertise in Node.js event loops, clustering, rate limiting, and microservices resilience.",
    category: "Node.js",
    level: "Advanced",
    color: "from-emerald-500 to-teal-600",
    timeLimit: 120,
    attemptsCount: 620,
    passCount: 410,
    questions: [
      {
        q: "Which phase of the Node.js Event Loop handles setImmediate() callbacks?",
        options: ["Check Phase", "Poll Phase", "Timers Phase", "Close Callbacks Phase"],
        answer: 0,
        explanation: "`setImmediate()` callbacks are executed in the 'Check' phase, right after the Poll phase completes I/O operations.",
      },
      {
        q: "Why should synchronous crypto or compression methods (e.g. bcrypt.hashSync) be avoided on high-traffic Node.js Express servers?",
        options: [
          "They block the single-threaded Event Loop, causing high latency for all concurrent requests",
          "They cause memory leaks in MongoDB drivers",
          "They are deprecated in modern ECMAScript",
          "They require sudo/root privileges on Linux servers",
        ],
        answer: 0,
        explanation: "Synchronous CPU-bound operations block the main thread, freezing all HTTP request processing until finished.",
      },
      {
        q: "What is the role of an Idempotency Key in microservices payment endpoints?",
        options: [
          "Prevents duplicate charge processing if a network retry occurs",
          "Encrypts database passwords in transit",
          "Generates JWT bearer tokens automatically",
        ],
        answer: 0,
        explanation: "Idempotency keys ensure an identical request repeated due to network retries produces only a single side effect.",
      },
    ],
  },
  {
    _id: "fb-quiz-3",
    title: "System Design & Distributed Scalability",
    slug: "system-design-mastery",
    description: "Master distributed caching, database sharding, CAP theorem trade-offs, and high-availability systems.",
    category: "Architecture",
    level: "Expert",
    color: "from-purple-500 to-indigo-600",
    timeLimit: 150,
    attemptsCount: 490,
    passCount: 310,
    questions: [
      {
        q: "According to the CAP Theorem, what must a distributed database choose during a network partition (P)?",
        options: [
          "Either Consistency (C) or Availability (A)",
          "Both Consistency and Availability simultaneously",
          "Neither Consistency nor Availability",
          "Faster CPU clock cycles",
        ],
        answer: 0,
        explanation: "When a network partition occurs, a distributed system must sacrifice either Availability or Consistency.",
      },
      {
        q: "Which caching strategy writes data simultaneously to both the cache and the primary database store before acknowledging success?",
        options: ["Write-Through", "Write-Back (Write-Behind)", "Cache-Aside", "Read-Through"],
        answer: 0,
        explanation: "Write-Through updates cache and database synchronously, ensuring strong consistency at the expense of higher write latency.",
      },
      {
        q: "What mechanism is most effective to protect backend microservices from cascading failures when a downstream dependency is down?",
        options: ["Circuit Breaker Pattern", "Infinite While Loop", "Synchronous RPC Polling", "Increasing Thread Pool Size"],
        answer: 0,
        explanation: "The Circuit Breaker pattern trips open when failures cross a threshold, failing fast without overwhelming downstream dependencies.",
      },
    ],
  },
];

const SkillQuizzes = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [serverResult, setServerResult] = useState(null);

  // Fetch real quizzes from MongoDB
  const { data: quizzes = [], isLoading } = useQuery({
    queryKey: ["quizzesList"],
    queryFn: async () => {
      const res = await api.get("/quiz/get");
      return res.data?.quizzes || [];
    },
  });

  // Display MongoDB quizzes if present, otherwise 2-3 rich fallback quizzes
  const displayedQuizzes = (quizzes && quizzes.length > 0) ? quizzes : FALLBACK_QUIZZES;

  // Submit quiz results to MongoDB
  const submitMutation = useMutation({
    mutationFn: async ({ quizId, answers }) => {
      const res = await api.post("/quiz/submit", { quizId, answers });
      return res.data;
    },
    onSuccess: (data) => {
      setServerResult(data);
      queryClient.invalidateQueries({ queryKey: ["quizzesList"] });
    },
  });

  // Timer countdown
  useEffect(() => {
    if (!activeQuiz || isCompleted) return;
    if (timeLeft <= 0) {
      handleCompleteQuiz();
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [activeQuiz, isCompleted, timeLeft]);

  const handleStartQuiz = (quiz) => {
    setActiveQuiz(quiz);
    setCurrentQIndex(0);
    setUserAnswers({});
    setSelectedAnswer(null);
    setIsAnswerSubmitted(false);
    setScore(0);
    setIsCompleted(false);
    setServerResult(null);
    setTimeLeft(quiz.timeLimit || 120);
  };

  const handleSelectOption = (idx) => {
    if (isAnswerSubmitted) return;
    setSelectedAnswer(idx);
  };

  const handleConfirmAnswer = () => {
    if (selectedAnswer === null) return;
    setIsAnswerSubmitted(true);

    const updatedAnswers = { ...userAnswers, [currentQIndex]: selectedAnswer };
    setUserAnswers(updatedAnswers);

    const isCorrect = selectedAnswer === activeQuiz.questions[currentQIndex]?.answer;
    if (isCorrect) {
      setScore((prev) => prev + 1);
    }
  };

  const handleCompleteQuiz = () => {
    setIsCompleted(true);
    if (activeQuiz) {
      if (activeQuiz._id && !activeQuiz._id.startsWith("fb-")) {
        submitMutation.mutate({
          quizId: activeQuiz._id,
          answers: userAnswers,
        });
      } else {
        const calculatedScore = Object.keys(userAnswers).filter(
          (k) => userAnswers[k] === activeQuiz.questions[Number(k)]?.answer
        ).length;
        const total = activeQuiz.questions.length;
        const percentage = Math.round((calculatedScore / total) * 100);
        const passed = percentage >= 80;
        setServerResult({
          success: true,
          score: calculatedScore,
          totalQuestions: total,
          percentage,
          passed,
          badgeAwarded: passed,
          badgeName: `${activeQuiz.category} Certified Specialist`,
          message: passed
            ? `Congratulations! You scored ${percentage}% and unlocked the ${activeQuiz.category} Certified Specialist badge!`
            : `You scored ${percentage}%. 80% is needed to pass. Review questions and try again!`,
        });
      }
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < activeQuiz.questions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      handleCompleteQuiz();
    }
  };

  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-transparent px-3 pt-2 pb-12 sm:px-6 lg:px-8">
      {/* Top Banner */}
      <div className="relative mb-6 overflow-hidden rounded-3xl border border-indigo-500/20 bg-gradient-to-r from-blue-600/10 via-indigo-600/10 to-violet-600/10 p-4 sm:p-7 backdrop-blur-xl dark:border-indigo-500/30">
        <div className="absolute -right-8 -top-8 h-44 w-44 rounded-full bg-cyan-400/20 blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="min-w-0">
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-600 dark:text-cyan-400">
              <BrainCircuit className="h-4 w-4 shrink-0" />
              <span className="truncate">NexHire Skill Verification Engine</span>
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse shrink-0" />
            </div>
            <h1 className="text-xl sm:text-3xl font-black tracking-tight text-slate-900 dark:text-white">
              Skill Quizzes & Certified Badges
            </h1>
            <p className="mt-1 text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-xl">
              Live interactive assessments stored in MongoDB. Score 80%+ to unlock a Verified Skill Badge on your candidate profile.
            </p>
          </div>

          <div className="flex items-center gap-2 sm:gap-3 flex-wrap sm:flex-nowrap shrink-0">
            <div className="flex-1 sm:flex-none rounded-2xl border border-white/40 bg-white/70 p-2.5 sm:p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 min-w-[90px]">
              <span className="block text-base sm:text-xl font-black text-indigo-600 dark:text-cyan-400">
                80%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Pass Threshold
              </span>
            </div>
            <div className="flex-1 sm:flex-none rounded-2xl border border-white/40 bg-white/70 p-2.5 sm:p-3 text-center shadow-sm dark:border-slate-800 dark:bg-slate-900/80 min-w-[90px]">
              <span className="block text-base sm:text-xl font-black text-emerald-600 dark:text-emerald-400">
                Top 5%
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-500 uppercase tracking-wider block">
                Badge Level
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* QUIZ SELECTION OR ACTIVE QUIZ VIEW */}
      {!activeQuiz ? (
        <>
          <div className="grid gap-4 sm:gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {displayedQuizzes.map((quiz) => (
              <motion.div
                key={quiz._id}
                whileHover={{ y: -3 }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm transition-all hover:border-indigo-400 hover:shadow-xl dark:border-slate-800 dark:bg-slate-950/80 dark:hover:border-cyan-500/50"
              >
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <span className={`rounded-xl bg-gradient-to-r ${quiz.color || "from-cyan-500 to-blue-600"} p-2.5 text-white shadow-md`}>
                      <Award className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-[10px] font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-400">
                      {quiz.level || "Intermediate"}
                    </span>
                  </div>

                  <h3 className="mb-2 text-sm sm:text-base font-extrabold text-slate-900 group-hover:text-indigo-600 dark:text-white dark:group-hover:text-cyan-400">
                    {quiz.title}
                  </h3>

                  <p className="mb-4 text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    {quiz.description}
                  </p>

                  <div className="mb-5 flex items-center gap-3 text-xs text-slate-500 flex-wrap">
                    <span className="flex items-center gap-1">
                      <BrainCircuit className="h-3.5 w-3.5 text-indigo-500" />
                      {quiz.questions?.length || 5} Questions
                    </span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Timer className="h-3.5 w-3.5 text-cyan-500" />
                      {quiz.timeLimit || 120} Seconds
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleStartQuiz(quiz)}
                  className="flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 px-4 text-xs font-bold text-white shadow-md shadow-indigo-500/20 hover:opacity-95 transition-opacity"
                >
                  <span>Start Skill Challenge</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </motion.div>
            ))}
          </div>

          {/* Fallback Data Indicator */}
          {(quizzes.length === 0 || displayedQuizzes === FALLBACK_QUIZZES) && (
            <div className="mt-8 flex items-center justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-500/10 px-4 py-2 text-xs font-semibold text-amber-700 dark:text-amber-300 backdrop-blur-md shadow-sm text-center">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                </span>
                <span>⚡ Fallback Data Showing — Real MongoDB assessments will sync when available</span>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ACTIVE QUIZ RUNNER */
        <div className="mx-auto max-w-2xl">
          <div className="mb-4 flex items-center justify-between gap-2">
            <button
              type="button"
              onClick={() => setActiveQuiz(null)}
              className="text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white"
            >
              ← Back to Quizzes
            </button>
            <div className="flex items-center gap-1.5 rounded-full border border-rose-500/30 bg-rose-500/10 px-3 py-1 text-xs font-bold text-rose-600 dark:text-rose-400 shrink-0">
              <Timer className="h-3.5 w-3.5" />
              <span>{timeLeft}s left</span>
            </div>
          </div>

          {!isCompleted ? (
            <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-xl dark:border-slate-800 dark:bg-slate-950/80 backdrop-blur-md">
              {/* Progress Bar */}
              <div className="mb-5">
                <div className="flex justify-between text-xs font-bold text-slate-500 mb-1.5">
                  <span>Question {currentQIndex + 1} of {activeQuiz.questions.length}</span>
                  <span>Current: {score} Correct</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-900">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-cyan-400 transition-all duration-300"
                    style={{
                      width: `${((currentQIndex + 1) / activeQuiz.questions.length) * 100}%`,
                    }}
                  />
                </div>
              </div>

              {/* Question Text */}
              <h3 className="mb-4 text-xs sm:text-base font-extrabold text-slate-900 dark:text-white leading-relaxed">
                {activeQuiz.questions[currentQIndex]?.q}
              </h3>

              {/* Options */}
              <div className="space-y-2.5 mb-5">
                {(activeQuiz.questions[currentQIndex]?.options || []).map((opt, idx) => {
                  let optStyle =
                    "border-slate-200 bg-slate-50/70 hover:bg-slate-100 dark:border-slate-800 dark:bg-slate-900/50 dark:hover:bg-slate-900 text-slate-800 dark:text-slate-200";

                  if (selectedAnswer === idx) {
                    optStyle =
                      "border-indigo-500 bg-indigo-500/10 text-indigo-600 dark:text-cyan-300 font-bold";
                  }

                  if (isAnswerSubmitted) {
                    if (idx === activeQuiz.questions[currentQIndex]?.answer) {
                      optStyle =
                        "border-emerald-500 bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold";
                    } else if (selectedAnswer === idx) {
                      optStyle =
                        "border-rose-500 bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold";
                    }
                  }

                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full rounded-2xl border p-3 sm:p-3.5 text-left text-xs sm:text-sm transition-all flex items-center justify-between gap-3 ${optStyle}`}
                    >
                      <span className="min-w-0 flex-1 leading-snug">{opt}</span>
                      {isAnswerSubmitted && idx === activeQuiz.questions[currentQIndex]?.answer && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                      )}
                      {isAnswerSubmitted && selectedAnswer === idx && idx !== activeQuiz.questions[currentQIndex]?.answer && (
                        <XCircle className="h-4 w-4 text-rose-500 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Explanation Note */}
              {isAnswerSubmitted && (
                <div className="mb-5 rounded-2xl border border-indigo-500/20 bg-indigo-500/10 p-3.5 text-xs text-indigo-700 dark:text-cyan-300 leading-relaxed">
                  <span className="font-bold">Explanation: </span>
                  {activeQuiz.questions[currentQIndex]?.explanation}
                </div>
              )}

              {/* Action Button */}
              <div>
                {!isAnswerSubmitted ? (
                  <button
                    type="button"
                    onClick={handleConfirmAnswer}
                    disabled={selectedAnswer === null}
                    className="w-full rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95 disabled:opacity-50"
                  >
                    Confirm Answer
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 py-3 text-xs sm:text-sm font-bold text-white shadow-md hover:opacity-95"
                  >
                    {currentQIndex + 1 < activeQuiz.questions.length ? "Next Question →" : "See Final Score"}
                  </button>
                )}
              </div>
            </div>
          ) : (
            /* COMPLETED SCORECARD */
            <div className="rounded-3xl border border-slate-200 bg-white p-5 sm:p-8 text-center shadow-xl dark:border-slate-800 dark:bg-slate-950/90">
              <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-indigo-500/10 text-indigo-600 dark:text-cyan-400">
                <Trophy className="h-7 w-7 sm:h-8 sm:w-8" />
              </div>

              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Quiz Completed!
              </h2>

              <p className="mt-1 text-xs text-slate-500">
                You scored <span className="font-bold text-indigo-600 dark:text-cyan-400">{score}</span> out of{" "}
                <span className="font-bold">{activeQuiz.questions.length}</span> (
                {Math.round((score / activeQuiz.questions.length) * 100)}%)
              </p>

              {score >= 4 ? (
                <div className="my-5 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-3 sm:p-4 text-emerald-600 dark:text-emerald-400 text-left sm:text-center">
                  <div className="flex items-center justify-center gap-2 font-black text-xs sm:text-sm">
                    <ShieldCheck className="h-5 w-5 shrink-0" />
                    <span>Verified Skill Badge Awarded & Saved in MongoDB!</span>
                  </div>
                  <p className="mt-1 text-[11px] text-emerald-700 dark:text-emerald-300">
                    Your profile now features the official {activeQuiz.title} competency verification.
                  </p>
                </div>
              ) : (
                <div className="my-5 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-3 sm:p-4 text-amber-600 dark:text-amber-400">
                  <p className="text-xs font-bold">
                    You scored below the 80% passing mark. Review key concepts and retake to earn your badge!
                  </p>
                </div>
              )}

              <div className="flex flex-col sm:flex-row items-center gap-2.5">
                <button
                  type="button"
                  onClick={() => handleStartQuiz(activeQuiz)}
                  className="w-full sm:flex-1 rounded-xl border border-slate-200 py-2.5 px-3 text-xs font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900 flex items-center justify-center gap-1.5"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>Retake Quiz</span>
                </button>
                <button
                  type="button"
                  onClick={() => setActiveQuiz(null)}
                  className="w-full sm:flex-1 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 py-2.5 px-3 text-xs font-bold text-white shadow-md hover:opacity-95"
                >
                  Explore More Quizzes
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SkillQuizzes;
