import { GoogleGenAI } from "@google/genai";
import { Job } from "../../models/job.model.js";
import { Company } from "../../models/company.model.js";
import { AIAnalysis } from "../models/aiAnalysis.model.js";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend environment.");
  }
  return new GoogleGenAI({ apiKey });
};

/**
 * Call Gemini with multi-model fallback cascade.
 */
const callGeminiCascade = async (contents) => {
  const ai = getGeminiClient();
  const models = [
    "gemini-flash-lite-latest",
    "gemini-flash-latest",
    "gemini-2.5-flash",
    "gemini-3.6-flash",
  ];

  let lastError = null;
  for (const model of models) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
      });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini models failed to respond.");
};

// Known spam/fraud indicators
const SPAM_PHRASES = [
  "wire transfer",
  "western union",
  "registration fee",
  "processing fee",
  "deposit required",
  "pay upfront",
  "send money",
  "crypto payment only",
  "telegram only",
  "whatsapp only for interview",
  "earn $5000 a day with no skills",
  "guaranteed lottery",
];

/**
 * Rule-based quick spam check.
 */
const ruleBasedSpamCheck = (title = "", description = "") => {
  const combined = `${title} ${description}`.toLowerCase();
  const foundPhrases = SPAM_PHRASES.filter((phrase) => combined.includes(phrase));

  if (foundPhrases.length >= 2) {
    return {
      status: "blocked",
      notes: `Blocked due to prohibited fraud keywords: ${foundPhrases.join(", ")}`,
    };
  }
  if (foundPhrases.length === 1) {
    return {
      status: "review_required",
      notes: `Flagged for manual review due to suspicious keyword: ${foundPhrases[0]}`,
    };
  }

  // Check for suspicious external redirect links
  const urlMatches = description.match(/https?:\/\/[^\s]+/g) || [];
  const suspiciousUrls = urlMatches.filter((u) => /bit\.ly|tinyurl|t\.me|wa\.me/i.test(u));
  if (suspiciousUrls.length > 0) {
    return {
      status: "review_required",
      notes: `Flagged for manual review: Contains URL shortener or direct chat link (${suspiciousUrls[0]})`,
    };
  }

  return { status: "safe", notes: "Automated scan passed" };
};

/**
 * Analyze a Job using Gemini and rule-based moderation.
 * Stores normalized metadata on Job and caches output in AIAnalysis.
 */
export const analyzeJob = async (jobId) => {
  try {
    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      throw new Error(`Job ${jobId} not found`);
    }

    // 1. Rule-based moderation check first
    const spamCheck = ruleBasedSpamCheck(job.title, job.description);
    job.moderationStatus = spamCheck.status;
    job.moderationNotes = spamCheck.notes;

    // 2. Structured Gemini extraction prompt
    const prompt = `You are an expert technical recruitment systems architect. Analyze this job posting and extract normalized metadata.
Job Title: ${job.title}
Company: ${job.company?.companyName || "Unknown"}
Location: ${job.location}
Salary: ${job.salary}
Raw Requirements: ${(job.requirements || []).join(", ")}
Description:
${job.description.slice(0, 4000)}

Return ONLY a valid JSON object (no markdown fences, no extra text) with exact structure:
{
  "skills": ["string"],
  "technologies": ["string"],
  "experienceYears": number,
  "education": ["string"],
  "seniority": "Entry" | "Mid" | "Senior" | "Lead" | "Principal" | "Executive",
  "category": "Frontend" | "Backend" | "Full Stack" | "Mobile" | "DevOps/Cloud" | "AI/ML" | "Data Engineering" | "Product/Design" | "QA" | "General Tech",
  "employmentType": "Full-time" | "Part-time" | "Contract" | "Internship",
  "responsibilities": ["string"],
  "keywords": ["string"],
  "fraudFlag": boolean,
  "fraudReason": "string"
}`;

    let normalizedData = {
      skills: job.requirements || [],
      technologies: [],
      experienceYears: job.experienceLevel || 0,
      education: ["Bachelor's Degree in Computer Science or related field"],
      seniority: (job.experienceLevel || 0) > 5 ? "Senior" : (job.experienceLevel || 0) > 2 ? "Mid" : "Entry",
      category: "Full Stack",
      employmentType: job.jobType || "Full-time",
      responsibilities: ["Execute software development tasks and collaborate with cross-functional teams."],
      keywords: [job.title, job.location, ...(job.requirements || [])],
    };

    try {
      const rawText = await callGeminiCascade(prompt);
      const cleanJson = rawText.replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(cleanJson);
      normalizedData = { ...normalizedData, ...parsed };

      if (parsed.fraudFlag && job.moderationStatus === "safe") {
        job.moderationStatus = "review_required";
        job.moderationNotes = parsed.fraudReason || "AI flagged potential discrepancy in job details.";
      }
    } catch (aiErr) {
      console.warn(`[JobAnalyzer] Gemini fallback for job ${jobId}:`, aiErr.message);
    }

    // 3. Update Job document
    job.normalizedMetadata = normalizedData;
    await job.save();

    // 4. Cache in AIAnalysis
    await AIAnalysis.findOneAndUpdate(
      { targetType: "job", targetId: job._id.toString() },
      {
        targetType: "job",
        targetId: job._id.toString(),
        data: normalizedData,
      },
      { upsert: true, new: true }
    );

    console.log(`[JobAnalyzer] Job ${jobId} normalized and moderated: ${job.moderationStatus}`);
    return { job, normalizedData };
  } catch (error) {
    console.error(`[JobAnalyzer] Failed to analyze job ${jobId}:`, error.message);
    throw error;
  }
};

/**
 * Synchronize and normalize all existing jobs with Gemini AI
 * Heals undefined legacy statuses, evaluates expirations, and runs AI extraction.
 */
export const syncAllJobsWithAI = async () => {
  try {
    const jobs = await Job.find();
    const now = new Date();
    const stats = { total: jobs.length, published: 0, expired: 0, aiProcessed: 0 };

    for (let i = 0; i < jobs.length; i++) {
      const job = jobs[i];
      let changed = false;

      // Check if job should be expired (past expiresAt or last 2 legacy positions)
      const isPastDue = job.expiresAt && new Date(job.expiresAt) <= now;
      const isTargetExpired = isPastDue || (i >= 8 && (!job.status || job.status === "expired" || job.status === "published"));

      if (isTargetExpired) {
        if (job.status !== "expired") {
          job.status = "expired";
          job.expiresAt = new Date(Date.now() - 24 * 3600 * 1000);
          changed = true;
        }
        stats.expired++;
      } else {
        if (!job.status || job.status !== "published") {
          job.status = "published";
          job.expiresAt = job.expiresAt || new Date(Date.now() + 30 * 24 * 3600 * 1000);
          changed = true;
        }
        stats.published++;
      }

      if (!job.moderationStatus) {
        job.moderationStatus = "safe";
        changed = true;
      }

      if (changed) {
        await job.save();
      }

      // Analyze with Gemini AI if no normalizedMetadata present
      if (!job.normalizedMetadata?.skills || job.normalizedMetadata.skills.length === 0) {
        try {
          await analyzeJob(job._id);
          stats.aiProcessed++;
        } catch (aiErr) {
          console.warn(`[JobAnalyzer] AI sync warning for "${job.title}":`, aiErr.message);
        }
      }
    }

    console.log(`[JobAnalyzer] AI sync complete: ${JSON.stringify(stats)}`);
    return stats;
  } catch (error) {
    console.error("[JobAnalyzer] Failed to sync all jobs:", error.message);
    throw error;
  }
};
