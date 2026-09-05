import { Job } from "../../models/job.model.js";
import { User } from "../../models/user.model.js";
import { Application } from "../../models/application.model.js";
import { CandidateProfile } from "../models/candidateProfile.model.js";

/**
 * Recommendation Service
 * Produces personalized, fast-ranked job recommendations for candidates.
 * Uses indexed MongoDB queries, candidate affinity metrics, and lean projections.
 */
export const getRecommendedJobsForCandidate = async ({ userId, limit = 6 }) => {
  try {
    const user = await User.findById(userId).select("profile savedJobs");
    if (!user) {
      return [];
    }

    const candidateProfile = await CandidateProfile.findOne({ userId });

    const skills = [
      ...(user.profile?.skills || []),
      ...(candidateProfile?.skills || []),
      ...(candidateProfile?.technologies || []),
    ]
      .map((s) => s.toLowerCase().trim())
      .filter(Boolean);

    // Fetch jobs user already applied to so we don't recommend them again
    const appliedApps = await Application.find({ applicant: userId }).select("job").lean();
    const appliedJobIds = appliedApps.map((a) => a.job);

    // Base query: published, active, safe jobs, excluding already applied
    const baseQuery = {
      _id: { $nin: appliedJobIds },
      status: "published",
      moderationStatus: { $ne: "blocked" },
    };

    // 1. Fetch pool of active jobs
    const activeJobs = await Job.find(baseQuery)
      .populate("company", "companyName logo location website")
      .sort({ createdAt: -1 })
      .limit(40)
      .lean();

    if (!activeJobs.length) {
      return [];
    }

    // If candidate has no skills yet, return latest active positions
    if (!skills.length) {
      return activeJobs.slice(0, limit).map((job) => ({
        ...job,
        affinityScore: 70,
        matchReason: "Trending open position for new talent",
        matchedSkills: job.requirements?.slice(0, 2) || [],
      }));
    }

    // 2. Score jobs based on candidate skill overlap and title relevance
    const scoredJobs = activeJobs.map((job) => {
      const jobReqs = (job.requirements || []).map((r) => r.toLowerCase().trim());
      const titleWords = job.title.toLowerCase().split(/[\s,/-]+/).filter((w) => w.length > 2);

      const matchedSkills = jobReqs.filter((req) =>
        skills.some((s) => s.includes(req) || req.includes(s))
      );

      const titleMatch = titleWords.some((w) =>
        skills.some((s) => s.includes(w) || w.includes(s))
      );

      // Skill ratio score
      const skillScore = jobReqs.length > 0 ? (matchedSkills.length / jobReqs.length) * 60 : 30;
      const titleScore = titleMatch ? 25 : 0;
      const recencyScore = 15; // Within latest batch

      const affinityScore = Math.min(98, Math.max(45, Math.round(skillScore + titleScore + recencyScore)));

      let matchReason = "Matches your core technical skillset";
      if (matchedSkills.length >= 3) {
        matchReason = `Exceptional alignment on ${matchedSkills.slice(0, 3).join(", ")}`;
      } else if (titleMatch) {
        matchReason = `Direct role title match with your background`;
      }

      return {
        ...job,
        affinityScore,
        matchReason,
        matchedSkills: matchedSkills.length ? matchedSkills : job.requirements?.slice(0, 2) || [],
      };
    });

    // 3. Sort by affinityScore descending and take the requested limit
    scoredJobs.sort((a, b) => b.affinityScore - a.affinityScore);

    return scoredJobs.slice(0, limit);
  } catch (error) {
    console.error("[RecommendationService] Failed to generate recommendations:", error.message);
    return [];
  }
};
