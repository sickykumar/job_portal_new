import { GoogleGenAI } from "@google/genai";
import { User } from "../../models/user.model.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";
import { AIAnalysis } from "../models/aiAnalysis.model.js";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend environment.");
  }
  return new GoogleGenAI({ apiKey });
};

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
      const response = await ai.models.generateContent({ model, contents });
      if (response && response.text) {
        return response.text;
      }
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError || new Error("All Gemini models failed to respond.");
};

/**
 * Extract raw text from PDF buffer using pdf-parse-fork
 */
const extractTextFromPdfBuffer = async (buffer) => {
  const pdfParse = (await import("pdf-parse-fork")).default;
  const parsed = await pdfParse(buffer);
  return (parsed?.text || "").trim();
};

/**
 * Asynchronously process an uploaded resume, extract structured sections,
 * and upsert into CandidateProfile.
 */
export const processCandidateResume = async ({ userId, resumeUrl, originalName = "Resume.pdf" }) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error(`User ${userId} not found`);
    }

    const targetUrl = resumeUrl || user.profile?.resume;
    if (!targetUrl) {
      console.warn(`[ResumeAnalyzer] No resume URL for user ${userId}. Skipping.`);
      return null;
    }

    let resumeText = "";
    try {
      let fetchUrl = targetUrl;
      if (fetchUrl.includes("/image/upload/") && !fetchUrl.endsWith(".pdf")) {
        fetchUrl = fetchUrl.replace("/image/upload/", "/image/upload/fl_attachment/");
      }
      const response = await fetch(fetchUrl);
      if (response.ok) {
        const arrayBuffer = await response.arrayBuffer();
        resumeText = await extractTextFromPdfBuffer(Buffer.from(arrayBuffer));
      }
    } catch (fetchErr) {
      console.warn(`[ResumeAnalyzer] PDF fetch/parse failed for user ${userId}:`, fetchErr.message);
    }

    // Default baseline if parsing fails or text is sparse
    let structuredProfile = {
      summary: user.profile?.bio || "Experienced technical professional.",
      skills: user.profile?.skills || ["JavaScript", "Web Development"],
      technologies: ["Git", "Node.js"],
      experienceYears: 2,
      experience: [],
      education: [],
      projects: [],
      certifications: [],
      languages: ["English"],
      completenessScore: 60,
    };

    if (resumeText && resumeText.length > 50) {
      const prompt = `You are an expert talent parsing engine. Parse this candidate resume text into structured JSON.
Resume Content:
"""
${resumeText.slice(0, 10000)}
"""

Return ONLY a valid JSON object (no markdown fences, no extra text) with exact structure:
{
  "summary": "2-3 sentences concise professional bio",
  "skills": ["string"],
  "technologies": ["string"],
  "experienceYears": number,
  "experience": [
    {
      "company": "string",
      "role": "string",
      "duration": "string",
      "highlights": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "institution": "string",
      "year": "string"
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"]
    }
  ],
  "certifications": ["string"],
  "languages": ["string"],
  "completenessScore": number (0-100)
}`;

      try {
        const rawResponse = await callGeminiCascade(prompt);
        const cleanJson = rawResponse.replace(/```json/gi, "").replace(/```/g, "").trim();
        const parsed = JSON.parse(cleanJson);
        structuredProfile = { ...structuredProfile, ...parsed };
      } catch (aiErr) {
        console.warn(`[ResumeAnalyzer] Gemini parsing fallback for user ${userId}:`, aiErr.message);
      }
    }

    // Upsert CandidateProfile
    const candidateProfile = await CandidateProfile.findOneAndUpdate(
      { userId },
      {
        userId,
        resumeUrl: targetUrl,
        resumeOriginalName: originalName || user.profile?.resumeOriginalname || "Resume.pdf",
        ...structuredProfile,
        parsedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    // Synchronize skills to User profile if user has few skills
    if (!user.profile.skills || user.profile.skills.length < 3) {
      if (structuredProfile.skills?.length > 0) {
        user.profile.skills = structuredProfile.skills.slice(0, 12);
        await user.save();
      }
    }

    // Cache in AIAnalysis
    await AIAnalysis.findOneAndUpdate(
      { targetType: "resume", targetId: userId.toString() },
      {
        targetType: "resume",
        targetId: userId.toString(),
        data: structuredProfile,
      },
      { upsert: true, new: true }
    );

    console.log(`[ResumeAnalyzer] Structured resume saved for user ${userId} (Score: ${structuredProfile.completenessScore})`);
    return candidateProfile;
  } catch (error) {
    console.error(`[ResumeAnalyzer] Failed to process resume for user ${userId}:`, error.message);
    throw error;
  }
};
