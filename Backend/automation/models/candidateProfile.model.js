import mongoose from "mongoose";

/**
 * CandidateProfile Model
 * Structured data extracted asynchronously from candidate CVs via PDF text extraction
 * and Gemini intelligence parsing.
 */
const candidateProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    resumeUrl: {
      type: String,
      default: "",
    },
    resumeOriginalName: {
      type: String,
      default: "",
    },
    summary: {
      type: String,
      default: "",
      trim: true,
    },
    skills: [{ type: String, trim: true }],
    technologies: [{ type: String, trim: true }],
    experienceYears: {
      type: Number,
      default: 0,
    },
    experience: [
      {
        company: { type: String, trim: true },
        role: { type: String, trim: true },
        duration: { type: String, trim: true },
        highlights: [{ type: String, trim: true }],
      },
    ],
    education: [
      {
        degree: { type: String, trim: true },
        institution: { type: String, trim: true },
        year: { type: String, trim: true },
      },
    ],
    projects: [
      {
        title: { type: String, trim: true },
        description: { type: String, trim: true },
        technologies: [{ type: String, trim: true }],
      },
    ],
    certifications: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    completenessScore: {
      type: Number,
      default: 50,
    },
    parsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export const CandidateProfile = mongoose.model("CandidateProfile", candidateProfileSchema);
