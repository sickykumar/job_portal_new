import crypto from "crypto";
import { Job } from "../../models/job.model.js";

/**
 * Duplicate Detector Service
 * Performs fast deterministic checks and fuzzy keyword similarity checks
 * before publishing to protect platform quality and eliminate duplicate listings.
 */

// Generate deterministic hash from core attributes
export const generateJobHash = ({ title = "", companyId = "", location = "", description = "" }) => {
  const normalized = [
    title.toLowerCase().trim().replace(/[^a-z0-9]/g, ""),
    companyId.toString(),
    location.toLowerCase().trim().replace(/[^a-z0-9]/g, ""),
    description.slice(0, 150).toLowerCase().trim().replace(/[^a-z0-9]/g, ""),
  ].join(":");

  return crypto.createHash("sha256").update(normalized).digest("hex");
};

/**
 * Detect possible duplicate job postings.
 * @returns {Promise<{ isDuplicate: boolean, existingJobId?: string, reason?: string }>}
 */
export const checkJobDuplicate = async ({ title, companyId, location, description, excludeJobId = null }) => {
  try {
    const hash = generateJobHash({ title, companyId, location, description });

    // 1. Deterministic hash check
    const query = {
      company: companyId,
      duplicateHash: hash,
      status: { $in: ["published", "paused"] },
    };

    if (excludeJobId) {
      query._id = { $ne: excludeJobId };
    }

    const exactMatch = await Job.findOne(query).select("_id title createdAt");
    if (exactMatch) {
      return {
        isDuplicate: true,
        existingJobId: exactMatch._id,
        reason: `An identical active job listing "${exactMatch.title}" was already posted by your company on ${exactMatch.createdAt?.toLocaleDateString()}.`,
      };
    }

    // 2. High-similarity heuristic (same company + exact same title + location within last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const similarJob = await Job.findOne({
      company: companyId,
      title: { $regex: new RegExp(`^${title.trim()}$`, "i") },
      location: { $regex: new RegExp(`^${location.trim()}$`, "i") },
      status: { $in: ["published", "paused"] },
      createdAt: { $gte: thirtyDaysAgo },
      ...(excludeJobId ? { _id: { $ne: excludeJobId } } : {}),
    }).select("_id title createdAt");

    if (similarJob) {
      return {
        isDuplicate: true,
        existingJobId: similarJob._id,
        reason: `A job with the same title "${similarJob.title}" at "${location}" is already active. Please edit or close the existing listing instead of reposting.`,
      };
    }

    return {
      isDuplicate: false,
      hash,
    };
  } catch (error) {
    console.error("[DuplicateDetector] Error checking duplicate:", error.message);
    return { isDuplicate: false };
  }
};
