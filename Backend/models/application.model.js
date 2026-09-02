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
      enum: ["pending", "shortlisted", "interview", "accepted", "hired", "rejected"],
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
