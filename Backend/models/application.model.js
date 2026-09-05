import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    status: {
      type: String,
      enum: ["pending", "under_review", "shortlisted", "interview", "accepted", "offer", "hired", "rejected"],
      default: "pending",
      lowercase: true,
    },
    feedback: {
      type: String,
      default: "",
      trim: true,
    },
    interviewDetails: {
      date: { type: String, default: "" },
      time: { type: String, default: "" },
      meetingLink: { type: String, default: "" },
      notes: { type: String, default: "" },
    },
    interviewRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Interview",
      default: null,
    },
    aiScreening: {
      matchScore: { type: Number, default: null },
      skillMatch: { type: Number, default: null },
      experienceMatch: { type: Number, default: null },
      educationMatch: { type: Number, default: null },
      missingSkills: [{ type: String }],
      strengths: [{ type: String }],
      concerns: [{ type: String }],
      recommendation: { type: String, default: "" },
      analyzedAt: { type: Date, default: null },
    },
    reviewedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate applications at the database level
applicationSchema.index({ job: 1, applicant: 1 }, { unique: true });

export const Application = mongoose.model("Application", applicationSchema);
