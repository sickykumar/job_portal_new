import mongoose from "mongoose";

/**
 * AIAnalysis Model
 * Caches structured Gemini AI outputs for jobs, resumes, and candidate matches.
 * Eliminates redundant API calls and accelerates query speeds.
 */
const aiAnalysisSchema = new mongoose.Schema(
  {
    targetType: {
      type: String,
      enum: ["job", "resume", "candidate_match", "job_moderation"],
      required: true,
      index: true,
    },
    targetId: {
      type: String,
      required: true,
      index: true,
    },
    secondaryTargetId: {
      type: String,
      default: null,
      index: true, // E.g., candidateId when targetType is candidate_match
    },
    hash: {
      type: String,
      index: true, // Content hash to detect changes
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      required: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

aiAnalysisSchema.index({ targetType: 1, targetId: 1, secondaryTargetId: 1 }, { unique: true });

export const AIAnalysis = mongoose.model("AIAnalysis", aiAnalysisSchema);
