import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    requirements: [
      {
        type: String,
        trim: true,
      },
    ],
    salary: {
      type: String,
      required: true,
    },
    experienceLevel: {
      type: Number,
      required: true,
      default: 0,
    },
    location: {
      type: String,
      required: true,
      trim: true,
    },
    jobType: {
      type: String,
      required: true,
      trim: true,
    },
    position: {
      type: Number,
      required: true,
      default: 1,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
      required: true,
      index: true,
    },
    created_by: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    applications: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Application",
      },
    ],
  },
  { timestamps: true }
);

// Search text index for high-performance title and description searches
jobSchema.index({ title: "text", description: "text", location: "text" });

export const Job = mongoose.model("Job", jobSchema);