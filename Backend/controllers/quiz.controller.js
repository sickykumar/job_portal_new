import { Quiz } from "../models/quiz.model.js";
import { User } from "../models/user.model.js";

const DEFAULT_QUIZZES = [
  {
    title: "React & Modern Frontend Architecture",
    slug: "react",
    description: "Assess your mastery of React 19 hooks, state concurrency, memoization, and virtual DOM reconciliation.",
    category: "Frontend",
    level: "Intermediate",
    color: "from-cyan-500 to-blue-600",
    timeLimit: 120,
    questions: [
      {
        q: "What is the primary benefit of React 18/19 Automatic Batching?",
        options: [
          "It compresses bundled JavaScript assets automatically.",
          "It groups multiple state updates together within promises and timeouts to avoid extra re-renders.",
          "It automatically memoizes all functional components without useMemo.",
          "It forces server-side rendering on all routes.",
        ],
        answer: 1,
        explanation: "Automatic batching groups multiple state updates (even inside async callbacks and timeouts) into a single re-render for performance.",
      },
      {
        q: "Which hook should you use to synchronize state with an external non-React subscription without tearing?",
        options: ["useSyncExternalStore", "useEffect", "useLayoutEffect", "useImperativeHandle"],
        answer: 0,
        explanation: "useSyncExternalStore is the official React hook designed specifically for reading and subscribing to external stores safely during concurrent rendering.",
      },
      {
        q: "Why is passing an inline function as a prop to a React.memo child sometimes problematic?",
        options: [
          "React throws a strict mode syntax error.",
          "It creates a new function reference on every parent render, causing the child to re-render despite memo.",
          "Inline functions cannot access component props.",
          "It blocks the main JavaScript execution thread.",
        ],
        answer: 1,
        explanation: "Inline arrow functions create a new reference every render. Wrap them in useCallback to preserve reference equality across renders.",
      },
      {
        q: "In React, what does the key prop help the reconciliation algorithm do?",
        options: [
          "Apply CSS animations to the element.",
          "Uniquely identify elements between renders so React can track which items were added, changed, or removed.",
          "Directly mutate the underlying browser DOM node.",
          "Store component state on local storage.",
        ],
        answer: 1,
        explanation: "Keys give elements a stable identity across renders, allowing React to match existing DOM nodes efficiently.",
      },
      {
        q: "When does useLayoutEffect fire compared to useEffect?",
        options: [
          "After the browser has painted the screen asynchronously.",
          "Synchronously immediately after DOM mutations, before the browser has painted.",
          "Only when the browser window is resized.",
          "Only in production server builds.",
        ],
        answer: 1,
        explanation: "useLayoutEffect fires synchronously after all DOM mutations but before the browser paints, preventing visual layout flickering.",
      },
    ],
  },
  {
    title: "Node.js & Resilient Microservices",
    slug: "backend",
    description: "Evaluate your understanding of event loops, clustering, worker threads, and API idempotency.",
    category: "Backend",
    level: "Advanced",
    color: "from-emerald-500 to-teal-600",
    timeLimit: 120,
    questions: [
      {
        q: "Which phase of the Node.js event loop executes timers (setTimeout / setInterval callbacks)?",
        options: ["Poll Phase", "Timers Phase", "Check Phase", "Close Callbacks Phase"],
        answer: 1,
        explanation: "The Timers phase executes callbacks scheduled by setTimeout() and setInterval().",
      },
      {
        q: "Why should you avoid executing heavy JSON.parse or regex parsing on huge payloads in the main event thread?",
        options: [
          "Node.js will crash immediately with an out-of-memory exception.",
          "It blocks the single-threaded event loop, delaying all incoming requests.",
          "JSON.parse cannot parse objects larger than 1MB.",
          "It invalidates HTTP keep-alive sockets.",
        ],
        answer: 1,
        explanation: "Since Node.js runs JS in a single thread, CPU-intensive parsing blocks the event loop and stalls all concurrent connections.",
      },
      {
        q: "What makes an API endpoint idempotent?",
        options: [
          "It executes in under 5 milliseconds.",
          "Making multiple identical requests has the same outcome on server state as making a single request.",
          "It uses WebSocket instead of HTTP.",
          "It only accepts GET requests with query parameters.",
        ],
        answer: 1,
        explanation: "Idempotency ensures that repeating the same request (e.g. on network retry) produces the exact same server side effect.",
      },
      {
        q: "Which HTTP status code is most appropriate when a client sends a duplicate idempotent request already in progress?",
        options: ["200 OK", "409 Conflict", "404 Not Found", "500 Internal Error"],
        answer: 1,
        explanation: "409 Conflict indicates that the request conflicts with the current state of the resource (e.g., duplicate unique constraint or duplicate concurrent processing).",
      },
      {
        q: "In MongoDB, what does a compound index on { company: 1, createdAt: -1 } enable efficiently?",
        options: [
          "Full text search across all document strings.",
          "Queries filtering by company and sorting by createdAt without an in-memory sort.",
          "Automatic encryption of the company field.",
          "Automatic deletion of old documents.",
        ],
        answer: 1,
        explanation: "Compound indexes matching the prefix filter and sort order allow the database engine to stream results directly from the index tree without memory-intensive sort passes.",
      },
    ],
  },
  {
    title: "AI & LLM Systems Engineering",
    slug: "ai",
    description: "Test your knowledge on prompt engineering, embeddings, RAG architectures, and agentic tool-use loops.",
    category: "AI",
    level: "Intermediate",
    color: "from-violet-500 to-indigo-600",
    timeLimit: 120,
    questions: [
      {
        q: "What is the primary role of Vector Embeddings in a Retrieval-Augmented Generation (RAG) system?",
        options: [
          "To translate user queries into SQL queries automatically.",
          "To represent text as high-dimensional numerical vectors capturing semantic meaning for similarity search.",
          "To compress token lengths to reduce API costs.",
          "To encrypt sensitive candidate information.",
        ],
        answer: 1,
        explanation: "Vector embeddings represent conceptual meaning in vector space, allowing cosine similarity search to retrieve relevant text chunks.",
      },
      {
        q: "In an autonomous agent loop (like ReAct), what is the function of the 'Observation' step?",
        options: [
          "Feeding the result of a tool or environment execution back to the LLM to decide the next action.",
          "Showing the user an animated loading indicator.",
          "Printing the prompt to terminal logs.",
          "Counting token usage for billing.",
        ],
        answer: 0,
        explanation: "Observation captures the tool execution output and injects it back into context so the agent can reason on real-world facts.",
      },
      {
        q: "What does temperature control in an LLM sampling configuration?",
        options: [
          "The physical temperature of the GPU server.",
          "The randomness and entropy of token probability selection.",
          "The maximum number of tokens returned.",
          "The frequency penalty of repeated words.",
        ],
        answer: 1,
        explanation: "Lower temperatures (e.g. 0.0 - 0.2) yield deterministic, focused outputs; higher temperatures (0.7 - 1.0) increase diversity and creative variance.",
      },
      {
        q: "Why is context window degradation (the 'lost in the middle' phenomenon) a risk in massive context LLMs?",
        options: [
          "Models tend to attend better to the very beginning and very end of long contexts than information in the middle.",
          "Long prompts permanently delete model weights.",
          "Responses take longer than 24 hours to return.",
          "The context window shrinks with every query.",
        ],
        answer: 0,
        explanation: "Attention mechanisms frequently show higher recall at the head and tail of extended prompt contexts, occasionally missing critical nuances buried in the middle.",
      },
      {
        q: "What is Function Calling / Tool Calling in modern LLMs?",
        options: [
          "A structured interface where the model outputs JSON arguments matching a predefined function schema for application execution.",
          "Allowing the model to execute arbitrary shell scripts on the server without permission.",
          "Compiling Python code to WebAssembly.",
          "Invoking browser alerts on the client.",
        ],
        answer: 0,
        explanation: "Tool calling lets the model declare which predefined tool to invoke and returns typed arguments according to JSON schemas.",
      },
    ],
  },
];

/**
 * Get all available skill quizzes (auto-seeds database if empty)
 */
export const getQuizzes = async (req, res, next) => {
  try {
    let quizzes = await Quiz.find().sort({ createdAt: 1 });

    if (!quizzes || quizzes.length === 0) {
      await Quiz.insertMany(DEFAULT_QUIZZES);
      quizzes = await Quiz.find().sort({ createdAt: 1 });
    }

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Submit quiz answers, verify score against database, and award verified badge to user
 */
export const submitQuiz = async (req, res, next) => {
  try {
    const { quizId, answers } = req.body;
    const userId = req.id || req.user?._id;

    const quiz = await Quiz.findById(quizId);
    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found",
      });
    }

    let correctCount = 0;
    quiz.questions.forEach((q, idx) => {
      if (answers && answers[idx] === q.answer) {
        correctCount += 1;
      }
    });

    const totalQuestions = quiz.questions.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const passed = percentage >= 80;

    quiz.attemptsCount = (quiz.attemptsCount || 0) + 1;
    if (passed) {
      quiz.passCount = (quiz.passCount || 0) + 1;
    }
    await quiz.save();

    // If candidate passed and logged in, award badge in user profile
    if (passed && userId) {
      await User.findByIdAndUpdate(userId, {
        $addToSet: { "profile.skills": `Verified ${quiz.title}` },
      });
    }

    return res.status(200).json({
      success: true,
      score: correctCount,
      total: totalQuestions,
      percentage,
      passed,
      badgeAwarded: passed,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Create a new custom skill assessment quiz (Recruiter & Admin)
 */
export const createQuiz = async (req, res, next) => {
  try {
    const userRole = req.user?.role;
    if (userRole !== "admin" && userRole !== "recruiter") {
      return res.status(403).json({
        success: false,
        message: "Only recruiters and administrators can create skill assessment quizzes.",
      });
    }

    const {
      title,
      description,
      category = "Engineering",
      level = "Intermediate",
      color = "from-cyan-500 to-blue-600",
      timeLimit = 120,
      questions = [],
    } = req.body;

    if (!title || !description || !questions || questions.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide a title, description, and at least one quiz question.",
      });
    }

    const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${Date.now().toString().slice(-4)}`;

    const newQuiz = await Quiz.create({
      title: title.trim(),
      slug,
      description: description.trim(),
      category: category.trim(),
      level: level.trim(),
      color: color.trim(),
      timeLimit: Number(timeLimit) || 120,
      questions,
      createdBy: req.id,
      attemptsCount: 0,
      passCount: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Skill assessment quiz created successfully!",
      quiz: newQuiz,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Delete a quiz (Admin or Creator Recruiter)
 */
export const deleteQuiz = async (req, res, next) => {
  try {
    const { id } = req.params;
    const quiz = await Quiz.findById(id);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        message: "Quiz not found.",
      });
    }

    const isAdmin = req.user?.role === "admin";
    const isOwner = quiz.createdBy?.toString() === req.id;

    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized. You can only delete quizzes you created.",
      });
    }

    await Quiz.findByIdAndDelete(id);

    return res.status(200).json({
      success: true,
      message: "Skill quiz deleted successfully.",
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get quizzes created by recruiter or all for admin
 */
export const getMyQuizzes = async (req, res, next) => {
  try {
    const isAdmin = req.user?.role === "admin";
    const query = isAdmin ? {} : { createdBy: req.id };

    const quizzes = await Quiz.find(query).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      quizzes,
    });
  } catch (error) {
    next(error);
  }
};

