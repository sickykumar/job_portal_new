import mongoose from "mongoose";

/**
 * Standalone JobAlert Model
 * Decoupled schema for managing automated candidate job alerts and subscriptions.
 */
const jobAlertSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
    },
    title: {
      type: String,
      required: [true, "Alert title is required"],
      trim: true,
      maxlength: 80,
    },
    keywords: [
      {
        type: String,
        trim: true,
      },
    ],
    location: {
      type: String,
      default: "Any Location",
      trim: true,
    },
    jobType: {
      type: String,
      default: "All",
      trim: true,
    },
    minSalary: {
      type: Number,
      default: 0,
    },
    frequency: {
      type: String,
      enum: ["instant", "daily", "weekly"],
      default: "instant",
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
    lastAlertSentAt: {
      type: Date,
      default: null,
    },
    matchesCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Compound index for fast query matching when new jobs are posted
jobAlertSchema.index({ isActive: 1, keywords: 1 });

export const JobAlert = mongoose.model("JobAlert", jobAlertSchema);
