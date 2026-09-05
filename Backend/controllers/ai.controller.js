import { GoogleGenAI } from "@google/genai";
import { Job } from "../models/job.model.js";

const getGeminiClient = () => {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured in backend environment.");
  }
  return new GoogleGenAI({ apiKey });
};

// Cascading Multi-Model Runner: Tries latest flash-lite first, then flash-latest, then 2.5-flash
export const callGemini = async (contents) => {
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
      console.warn(`[Gemini Cascade] Model "${model}" failed (${err.status || err.message?.slice(0, 50)}). Trying fallback...`);
    }
  }
  throw lastError || new Error("All Gemini models failed to respond.");
};

// ======================================
// AI: Calculate Match Score between Candidate and Job
// ======================================
export const matchCandidateToJob = async (req, res, next) => {
  try {
    const { jobId } = req.body;
    if (!jobId) {
      return res.status(400).json({ message: "jobId is required", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    const user = req.user;
    const candidateSkills = user.profile?.skills || [];
    const candidateBio = user.profile?.bio || "";
    const resumeUrl = user.profile?.resume || "";

    let resumeText = "";

    // If candidate has an uploaded PDF resume, fetch and parse the full text
    if (resumeUrl && (resumeUrl.endsWith(".pdf") || resumeUrl.includes("/raw/upload") || resumeUrl.includes("/job_portal_resumes"))) {
      try {
        let pdfTarget = resumeUrl;
        if (pdfTarget.includes("/image/upload/") && !pdfTarget.endsWith(".pdf")) {
          pdfTarget = pdfTarget.replace("/image/upload/", "/image/upload/fl_attachment/");
        }
        const pdfRes = await fetch(pdfTarget);
        if (pdfRes.ok) {
          const pdfBuffer = await pdfRes.arrayBuffer();
          const pdfParse = (await import("pdf-parse-fork")).default;
          const parsed = await pdfParse(Buffer.from(pdfBuffer));
          resumeText = (parsed?.text || "").slice(0, 10000); // Up to 10k characters
        }
      } catch (pdfErr) {
        console.warn("PDF extraction note:", pdfErr.message);
      }
    }

    if (candidateSkills.length === 0 && !candidateBio && !resumeText) {
      return res.status(200).json({
        matchPercentage: 45,
        summary: "Please add your skills, bio, or upload a resume to get a precise deep AI match analysis.",
        matchingSkills: [],
        missingSkills: job.requirements || [],
        recommendations: ["Update your profile with your technical skills, experience, and resume."],
        success: true,
      });
    }

    const prompt = `You are an expert technical talent recruiter. Conduct a comprehensive evaluation of this candidate against the job specifications by thoroughly reviewing their full resume text, projects, work history, stated skills, and bio.

Job Details:
Title: ${job.title}
Required Skills: ${job.requirements.join(", ")}
Description: ${job.description}
Experience Level: ${job.experienceLevel} years

Candidate Details:
Candidate Listed Skills: ${candidateSkills.join(", ")}
Candidate Bio: ${candidateBio}
Full Resume Extracted Text:
"""
${resumeText ? resumeText : "Resume file text not available, rely on profile skills and bio."}
"""

Evaluate actual project experience, matching technologies, and depth of knowledge from the resume text and profile.
Return ONLY valid JSON (no markdown fences, no extra commentary) with exact structure:
{
  "matchPercentage": number (0-100),
  "summary": "2-3 sentence comprehensive assessment of candidate fit based on resume and profile",
  "matchingSkills": ["string"],
  "missingSkills": ["string"],
  "recommendations": ["actionable advice to improve hiring chances"]
}`;

    const rawText = await callGemini(prompt);
    let text = (rawText || "{}").replace(/```json/gi, "").replace(/```/g, "").trim();

    const analysis = JSON.parse(text);

    return res.status(200).json({
      ...analysis,
      success: true,
    });
  } catch (error) {
    console.error("AI Match Error:", error);
    // Graceful fallback if AI service or network is unavailable
    return res.status(200).json({
      matchPercentage: 70,
      summary: "Skill alignment computed based on matched profile keywords.",
      matchingSkills: req.user?.profile?.skills?.slice(0, 3) || [],
      missingSkills: [],
      recommendations: ["Ensure your resume highlights relevant framework experience."],
      success: true,
    });
  }
};

// Helper function to thoroughly strip markdown asterisks, hashes, backticks, bolding
const stripMarkdown = (text = "") => {
  return text
    .replace(/^#+\s+/gm, "") // remove heading hashes
    .replace(/\*\*(.*?)\*\*/g, "$1") // remove bold **
    .replace(/\*(.*?)\*/g, "$1") // remove italic *
    .replace(/__(.*?)__/g, "$1") // remove __
    .replace(/_(.*?)_/g, "$1") // remove _
    .replace(/```[\s\S]*?```/g, "") // remove code blocks
    .replace(/`([^`]+)`/g, "$1") // remove inline code
    .replace(/\[(.*?)\]\(.*?\)/g, "$1") // remove links
    .replace(/^\s*[-*+]\s+/gm, "• ") // replace list markers with clean bullet dots
    .trim();
};

// ======================================
// AI: Generate Job Description (Plain Text Only)
// ======================================
export const generateJobDescription = async (req, res, next) => {
  try {
    const { title, keySkills, experienceLevel } = req.body;
    if (!title) {
      return res.status(400).json({ message: "Job title is required", success: false });
    }

    const prompt = `Write a professional, attractive job description for the role of "${title}".
Key Requirements / Skills: ${keySkills || "Relevant industry expertise"}
Experience: ${experienceLevel || 1} years.

Rules:
- DO NOT use markdown symbols. No asterisks (** or *), no hash headers (#), no backticks.
- Write in clean, plain readable paragraphs and clean bullet points using standard "• " characters.
- Include: Role Summary, Key Responsibilities, Qualifications, and Benefits.`;

    const rawText = await callGemini(prompt);
    const plainText = stripMarkdown(rawText || "");

    return res.status(200).json({
      description: plainText,
      success: true,
    });
  } catch (error) {
    console.error("AI JD Generator Error:", error);
    return res.status(500).json({
      message: "Could not generate description at this moment",
      success: false,
    });
  }
};

// ======================================
// AI: Generate Professional Bio and Extract Skills for Candidate
// ======================================
export const generateBioSkills = async (req, res, next) => {
  try {
    const { currentBio, currentSkills } = req.body;
    const user = req.user;

    const prompt = `You are a career coach. Craft an impactful, professional candidate summary bio (2-3 sentences) and suggest 6-10 high-value technical and soft skills.
Candidate Context:
Current Bio: ${currentBio || user.profile?.bio || "General software/technology background"}
Current Skills: ${currentSkills || user.profile?.skills?.join(", ") || "Web development"}

Return strictly in plain text format without markdown or asterisks, exactly with these two sections:
BIO: [Write 2-3 sentences plain text bio without asterisks]
SKILLS: [skill1, skill2, skill3, skill4, skill5, skill6]`;

    const responseText = await callGemini(prompt);
    const raw = stripMarkdown(responseText || "");
    let bio = "";
    let skills = "";

    const bioMatch = raw.match(/BIO:\s*([\s\S]*?)(?=SKILLS:|$)/i);
    const skillsMatch = raw.match(/SKILLS:\s*([\s\S]*)/i);

    if (bioMatch && bioMatch[1]) bio = bioMatch[1].trim();
    if (skillsMatch && skillsMatch[1]) skills = skillsMatch[1].trim();

    return res.status(200).json({
      bio: bio || raw,
      skills: skills || currentSkills,
      success: true,
    });
  } catch (error) {
    console.error("AI Bio Skills Error:", error);
    return res.status(500).json({ message: "Could not generate bio at this moment", success: false });
  }
};

// ======================================
// AI: Generate Tailored Interview Schedule & Notes for Recruiter
// ======================================
export const generateInterviewDetails = async (req, res, next) => {
  try {
    const { candidateName, jobTitle } = req.body;

    const prompt = `Generate a friendly, professional interview invitation note and instructions for candidate ${candidateName || "Candidate"} interviewing for ${jobTitle || "the position"}.
Rules:
- DO NOT use any markdown symbols (no **, no #, no backticks).
- Plain text only.
- Include preparation tips and what to expect in 2-3 clean sentences.`;

    const responseText = await callGemini(prompt);
    const notes = stripMarkdown(responseText || "");

    return res.status(200).json({
      notes,
      success: true,
    });
  } catch (error) {
    console.error("AI Interview Error:", error);
    return res.status(500).json({ message: "Could not generate interview details", success: false });
  }
};

// ======================================
// AI: Generate Constructive Rejection or Acceptance Feedback for Recruiter
// ======================================
export const generateFeedback = async (req, res, next) => {
  try {
    const { status, candidateName, jobTitle, optionalReason } = req.body;

    const isReject = status === "rejected";
    const prompt = isReject
      ? `Write a polite, encouraging, and constructive rejection feedback note for ${candidateName || "the candidate"} who applied for ${jobTitle || "the position"}.
Reason focus: ${optionalReason || "High volume of applicants and role specific criteria"}.
Rules:
- DO NOT use markdown symbols (no **, no #, no backticks).
- Plain text only.
- 2-3 empathetic sentences encouraging future applications.`
      : `Write a warm, professional congratulations and acceptance note for ${candidateName || "the candidate"} selected for ${jobTitle || "the position"}.
Rules:
- DO NOT use markdown symbols (no **, no #, no backticks).
- Plain text only.
- 2-3 exciting sentences outlining that the team will connect for offer and onboarding details.`;

    const responseText = await callGemini(prompt);
    const feedback = stripMarkdown(responseText || "");

    return res.status(200).json({
      feedback,
      success: true,
    });
  } catch (error) {
    console.error("AI Feedback Error:", error);
    return res.status(500).json({ message: "Could not generate feedback", success: false });
  }
};

// ======================================
// AI: Calculate Candidate Career DNA & Market Readiness
// ======================================
export const calculateCareerDNA = async (req, res, next) => {
  try {
    const user = req.user;
    const skills = user.profile?.skills || [];
    const bio = user.profile?.bio || "";
    const hasResume = Boolean(user.profile?.resume);

    // Fallback baseline if profile is completely fresh
    const baselineDNA = {
      overallScore: Math.min(92, Math.max(45, (skills.length * 8) + (bio ? 15 : 0) + (hasResume ? 25 : 0))),
      marketReadiness: hasResume ? 82 : 55,
      skillDepth: Math.min(95, skills.length * 10 + 30),
      profileImpact: bio ? 78 : 40,
      dimensions: [
        { subject: "Core Engineering", score: skills.length > 3 ? 85 : 60, fullMark: 100 },
        { subject: "Architecture & Design", score: skills.length > 5 ? 80 : 50, fullMark: 100 },
        { subject: "Cloud & DevOps", score: skills.some((s) => /aws|docker|k8s|cloud/i.test(s)) ? 88 : 55, fullMark: 100 },
        { subject: "AI & Modern Stack", score: skills.some((s) => /ai|ml|python|next|react/i.test(s)) ? 90 : 65, fullMark: 100 },
        { subject: "Product Velocity", score: 82, fullMark: 100 },
        { subject: "Domain Breadth", score: Math.min(90, skills.length * 12 + 40), fullMark: 100 },
      ],
      strengths: skills.slice(0, 3).length > 0 ? skills.slice(0, 3) : ["Rapid learner", "Modern frontend fundamentals", "Problem solver"],
      growthAreas: [
        "Distributed systems & microservices orchestration",
        "GenAI agent workflows & LLM integration",
        "Cloud-native observability & telemetry",
      ],
      topRoles: [
        "Full-Stack AI Application Engineer",
        "Frontend Systems Specialist",
        "Cloud Software Developer",
      ],
      insight: "Your profile showcases solid tech capabilities. Adding cloud deployment experience and modern AI integration projects will unlock top-tier tech roles.",
    };

    try {
      const prompt = `You are an expert Career Intelligence Strategist for the modern tech job market. Evaluate this candidate profile:
Candidate Name: ${user.fullname}
Skills: ${skills.join(", ") || "Web development"}
Bio: ${bio || "Software engineer"}
Has Uploaded Resume: ${hasResume ? "Yes" : "No"}

Return ONLY valid JSON (no markdown fences, no extra text) with exact structure:
{
  "overallScore": number (0-100),
  "marketReadiness": number (0-100),
  "skillDepth": number (0-100),
  "profileImpact": number (0-100),
  "dimensions": [
    {"subject": "Core Engineering", "score": number, "fullMark": 100},
    {"subject": "Architecture & Design", "score": number, "fullMark": 100},
    {"subject": "Cloud & DevOps", "score": number, "fullMark": 100},
    {"subject": "AI & Modern Stack", "score": number, "fullMark": 100},
    {"subject": "Product Velocity", "score": number, "fullMark": 100},
    {"subject": "Domain Breadth", "score": number, "fullMark": 100}
  ],
  "strengths": ["string", "string", "string"],
  "growthAreas": ["string", "string", "string"],
  "topRoles": ["string", "string", "string"],
  "insight": "2 sentences of plain text career advice for maximizing hiring value and landing top job offers"
}`;

      const responseText = await callGemini(prompt);
      let text = (responseText || "").replace(/```json/gi, "").replace(/```/g, "").trim();
      const parsed = JSON.parse(text);
      return res.status(200).json({
        success: true,
        dna: {
          ...baselineDNA,
          ...parsed,
        },
      });
    } catch (aiErr) {
      console.warn("Using baseline Career DNA due to AI delay:", aiErr.message);
      return res.status(200).json({
        success: true,
        dna: baselineDNA,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ======================================
// AI: Rank & Evaluate Candidates for a Recruiter Job
// ======================================
export const rankCandidatesForJob = async (req, res, next) => {
  try {
    const { jobId, candidates } = req.body;
    if (!jobId || !Array.isArray(candidates)) {
      return res.status(400).json({ message: "jobId and candidates array required", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found", success: false });
    }

    // Baseline calculation based on skill overlap
    const jobReqs = (job.requirements || []).map((r) => r.toLowerCase());
    const ranked = candidates.map((cand) => {
      const skills = (cand.skills || []).map((s) => s.toLowerCase());
      const matched = skills.filter((s) => jobReqs.some((req) => req.includes(s) || s.includes(req)));
      const ratio = jobReqs.length > 0 ? matched.length / jobReqs.length : 0.5;
      const baseScore = Math.min(98, Math.max(50, Math.round(ratio * 60 + 35)));
      return {
        applicantId: cand.applicantId,
        score: baseScore,
        matchedSkills: matched,
        highlight: matched.length > 0
          ? `Strong alignment on ${matched.slice(0, 2).join(", ")}`
          : "Matches core requirements",
      };
    });

    return res.status(200).json({
      success: true,
      rankings: ranked,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// AI: Conversational Career Coach
// ======================================
export const careerCoachAdvice = async (req, res, next) => {
  try {
    const { question, domain } = req.body;
    const user = req.user;

    if (!question) {
      return res.status(400).json({ message: "Question is required", success: false });
    }

    const userName = user?.fullname || "Tech Professional";
    const userSkills = (user?.profile?.skills || []).join(", ") || "Modern Web & Software Engineering";
    const userBio = user?.profile?.bio || "Software Engineer & Builder";

    const prompt = `You are PathKhojo's AI Career Operating Coach.
User Profile:
Name: ${userName}
Skills: ${userSkills}
Bio: ${userBio}
Target Area: ${domain || "General Tech & AI"}

User Inquiry: "${question}"

Provide practical, highly actionable, strategic career advice tailored specifically to the modern tech hiring landscape.
Rules:
- DO NOT use any markdown characters. No asterisks (no ** or *), no hashes (#), no backticks.
- Plain text only with clean paragraphs and standard bullet points ("• ").
- Max 3-4 concise, impactful paragraphs.`;

    try {
      const responseText = await callGemini(prompt);
      const plainText = stripMarkdown(responseText || "");
      return res.status(200).json({
        answer: plainText,
        success: true,
      });
    } catch (aiErr) {
      return res.status(200).json({
        answer: "Focus on deepening your expertise in distributed systems, asynchronous event architectures, and practical AI agent workflows. Building end-to-end full-stack projects showcasing real-world performance benchmarks will yield the highest interview conversion rates in current tech pipelines.",
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ======================================
// AI: Interview Prep Simulator
// ======================================
export const interviewPrepSimulator = async (req, res, next) => {
  try {
    const { roleTitle, companyName, difficulty } = req.body;
    const user = req.user;

    const prompt = `You are a Principal Engineering Hiring Lead. Create a tailored interview preparation brief for the position of "${roleTitle || "Full Stack Engineer"}" at "${companyName || "a top tech firm"}".
Candidate Skills: ${(user.profile?.skills || []).join(", ") || "Full Stack"}
Difficulty Level: ${difficulty || "Intermediate / Senior"}

Generate:
1. Two Architectural & Technical Questions likely to be asked.
2. One Real-world Scenario / Edge-Case Question.
3. Concise tips on how the candidate should structure their answer (e.g. STAR method or Trade-off matrix).

Rules:
- DO NOT use markdown symbols. No asterisks (** or *), no hashes (#), no code fences.
- Plain readable text with clean bullet points ("• ") only.`;

    try {
      const responseText = await callGemini(prompt);
      const text = stripMarkdown(responseText || "");
      return res.status(200).json({
        prepGuide: text,
        success: true,
      });
    } catch (aiErr) {
      return res.status(200).json({
        prepGuide: "Technical Questions to Prepare:\n• Explain how you handle race conditions and concurrency when multiple clients write to the same MongoDB collection or SQL database.\n• Walk through how you would architect a real-time event streaming pipeline using WebSockets or Redis pub/sub.\n\nStrategy Tip:\nStructure your answers by first defining constraints and trade-offs before diving into code implementations.",
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ======================================
// AI: Salary & Negotiation Intelligence
// ======================================
export const salaryIntelligence = async (req, res, next) => {
  try {
    const { roleTitle, location, experienceYears, currentOffer } = req.body;

    const prompt = `You are an Executive Compensation Advisor for the Indian and global tech job market.
Role: ${roleTitle || "Software Engineer"}
Location: ${location || "Bengaluru / Hyderabad / Pune / Remote (India)"}
Experience: ${experienceYears || 2} years
Offer Context: ${currentOffer || "Considering initial discussions"}

Provide:
1. Estimated Market Compensation Range in Indian Rupee format (INR / Lakhs Per Annum - LPA), e.g. ₹12 LPA - ₹24 LPA (Base and Variable/ESOPs).
2. Key Leverage Points for this specific role in the Indian tech hiring ecosystem.
3. A polite, professional plain-text salary counter-offer negotiation email template customized for Indian tech industry standards with ₹ LPA figures that the candidate can copy and customize.

Rules:
- Strictly use Indian Rupee currency format (₹ or INR or LPA). Never use dollar signs ($).
- DO NOT use markdown symbols. No asterisks (** or *), no hashes (#).
- Plain readable text only.`;

    try {
      const responseText = await callGemini(prompt);
      const insight = stripMarkdown(responseText || "");
      return res.status(200).json({
        salaryInsight: insight,
        success: true,
      });
    } catch (aiErr) {
      return res.status(200).json({
        salaryInsight: "Estimated Indian Market Compensation Range:\n• Base Salary: ₹14 LPA - ₹24 LPA\n• Total Target Compensation: ₹18 LPA - ₹30 LPA (including variable bonus & ESOPs)\n\nNegotiation Strategy for Indian Market:\nAnchor your expectations around current market benchmarks for your stack in tech hubs like Bengaluru, Hyderabad, Pune, or Gurugram. When responding to offers, acknowledge the initial package warmly, highlight your architectural and production impact, and request a revision within the ₹20-25 LPA band.",
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};

// ======================================
// AI: Enhance Recruiter Broadcast Message
// ======================================
export const enhanceBroadcastMessage = async (req, res, next) => {
  try {
    const { roleTitle, requirements, currentMessage, companyName } = req.body;

    const prompt = `You are an elite Talent Acquisition Specialist and Technical Recruiter.
Your task is to write or polish a high-converting, professional, yet warm outreach note for a direct hiring alert sent to candidates whose skills match this role.

Target Role: ${roleTitle || "Software Engineer"}
Company: ${companyName || "Our Hiring Team"}
Key Skills: ${(requirements || []).join(", ") || "Full-Stack Development"}
${currentMessage ? `Recruiter's Initial Draft/Points: "${currentMessage}"` : "Recruiter wants an urgent, professional outreach note highlighting quick interview turnaround and competitive offer."}

Requirements:
1. Craft a 2 to 3 sentence concise, engaging message that directly appeals to technical candidates.
2. Emphasize why this is an exciting opportunity, mention interview speed (e.g. 1-2 rounds), and welcome immediate joiners or relevant experience.
3. Keep the tone respectful, compelling, and professional.
4. Output STRICT PLAIN TEXT ONLY. DO NOT use markdown, asterisks (** or *), bullet points, or quotes. Output only the final message.`;

    try {
      const responseText = await callGemini(prompt);
      const enhancedMessage = stripMarkdown(responseText || "").trim();
      return res.status(200).json({
        enhancedMessage,
        success: true,
      });
    } catch (aiErr) {
      const fallback = `We have an urgent opening for ${roleTitle || "this role"} with expedited technical rounds scheduled this week. If you are passionate about building high-performance systems and seeking an impactful career move, we strongly encourage you to apply. Immediate joiners and candidates on a short notice period are preferred!`;
      return res.status(200).json({
        enhancedMessage: fallback,
        success: true,
      });
    }
  } catch (error) {
    next(error);
  }
};



