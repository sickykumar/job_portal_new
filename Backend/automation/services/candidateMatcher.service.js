import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";
import { AIAnalysis } from "../models/aiAnalysis.model.js";

/**
 * Computes multi-dimensional match score between a candidate and a job.
 * Avoids repeated Gemini API calls by caching in AIAnalysis.
 */
export const matchCandidateToJob = async ({ candidateId, jobId, applicationId = null }) => {
  try {
    // 1. Check cache first
    const cached = await AIAnalysis.findOne({
      targetType: "candidate_match",
      targetId: jobId.toString(),
      secondaryTargetId: candidateId.toString(),
    });

    if (cached && cached.data) {
      if (applicationId) {
        await Application.findByIdAndUpdate(applicationId, {
          aiScreening: {
            ...cached.data,
            analyzedAt: new Date(),
          },
        });
      }
      return cached.data;
    }

    // 2. Fetch Job and Candidate data
    const [job, user, candidateProfile] = await Promise.all([
      Job.findById(jobId),
      User.findById(candidateId),
      CandidateProfile.findOne({ userId: candidateId }),
    ]);

    if (!job || !user) {
      throw new Error(`Job (${jobId}) or Candidate (${candidateId}) not found`);
    }

    const jobReqs = (job.requirements || []).map((r) => r.toLowerCase().trim()).filter(Boolean);
    const candidateSkills = [
      ...(user.profile?.skills || []),
      ...(candidateProfile?.skills || []),
      ...(candidateProfile?.technologies || []),
    ].map((s) => s.toLowerCase().trim()).filter(Boolean);

    // Remove duplicates
    const uniqueCandSkills = [...new Set(candidateSkills)];

    // 1. Skill Match (45% weight)
    const matchedSkills = [];
    const missingSkills = [];

    for (const req of jobReqs) {
      const isMatched = uniqueCandSkills.some((s) => s.includes(req) || req.includes(s));
      if (isMatched) {
        matchedSkills.push(req);
      } else {
        missingSkills.push(req);
      }
    }

    const skillRatio = jobReqs.length > 0 ? matchedSkills.length / jobReqs.length : 0.7;
    const skillMatch = Math.min(100, Math.round(skillRatio * 100));

    // 2. Experience Match (20% weight)
    const reqExp = job.experienceLevel || 0;
    const candExp = candidateProfile?.experienceYears || (user.profile?.bio?.match(/(\d+)\+?\s*years?/i) ? parseInt(RegExp.$1, 10) : 1);
    let experienceMatch = 100;
    if (candExp < reqExp) {
      experienceMatch = Math.max(40, Math.round((candExp / reqExp) * 100));
    }

    // 3. Education Match (15% weight)
    const educationMatch = candidateProfile?.education?.length ? 90 : 75;

    // 4. Location Match (10% weight)
    let locationMatch = 70;
    const jobLoc = (job.location || "").toLowerCase();
    const candBio = (user.profile?.bio || "").toLowerCase();
    if (jobLoc.includes("remote") || job.jobType?.toLowerCase().includes("remote")) {
      locationMatch = 100;
    } else if (candBio.includes(jobLoc)) {
      locationMatch = 95;
    }

    // 5. Preference Match (10% weight)
    const preferenceMatch = 85;

    // Overall Weighted Score
    const overallMatch = Math.min(
      99,
      Math.max(
        20,
        Math.round(
          skillMatch * 0.45 +
          experienceMatch * 0.20 +
          educationMatch * 0.15 +
          locationMatch * 0.10 +
          preferenceMatch * 0.10
        )
      )
    );

    // Qualitative Strengths & Concerns
    const strengths = [];
    if (matchedSkills.length > 0) {
      strengths.push(`Direct alignment on ${matchedSkills.slice(0, 3).join(", ")}`);
    }
    if (candExp >= reqExp && reqExp > 0) {
      strengths.push(`Meets experience threshold (${candExp} yrs vs ${reqExp} yrs required)`);
    } else {
      strengths.push("High potential demonstrated across foundational tech stack");
    }

    const concerns = [];
    if (missingSkills.length > 0) {
      concerns.push(`Verify depth in missing required skill(s): ${missingSkills.slice(0, 2).join(", ")}`);
    }
    if (candExp < reqExp) {
      concerns.push(`Requires upskilling to bridge ${reqExp - candExp} yr experience gap`);
    }

    // Recommendation
    let recommendation = "Strong Candidate - Advance to Technical Interview";
    if (overallMatch < 55) {
      recommendation = "Low Alignment - Review portfolio before proceeding";
    } else if (overallMatch < 75) {
      recommendation = "Good Potential - Screen for architectural depth & culture fit";
    }

    const result = {
      matchScore: overallMatch,
      overallMatch,
      skillMatch,
      experienceMatch,
      educationMatch,
      locationMatch,
      preferenceMatch,
      matchedSkills,
      missingSkills,
      strengths,
      concerns,
      recommendation,
      analyzedAt: new Date(),
    };

    // 3. Cache in AIAnalysis
    await AIAnalysis.findOneAndUpdate(
      {
        targetType: "candidate_match",
        targetId: jobId.toString(),
        secondaryTargetId: candidateId.toString(),
      },
      {
        targetType: "candidate_match",
        targetId: jobId.toString(),
        secondaryTargetId: candidateId.toString(),
        data: result,
      },
      { upsert: true, new: true }
    );

    // 4. Update Application if supplied
    if (applicationId) {
      await Application.findByIdAndUpdate(applicationId, {
        aiScreening: result,
      });
    }

    return result;
  } catch (error) {
    console.error("[CandidateMatcher] Match calculation failed:", error.message);
    throw error;
  }
};
