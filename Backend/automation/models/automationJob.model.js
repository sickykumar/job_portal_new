import mongoose from "mongoose";

/**
 * AutomationJob Model
 * Persistent background task queue supporting retries, exponential backoff,
 * idempotency, and failure tracking.
 */
const automationJobSchema = new mongoose.Schema(
  {
    jobType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    payload: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "failed", "retrying"],
      default: "pending",
      index: true,
    },
    attempts: {
      type: Number,
      default: 0,
    },
    maxAttempts: {
      type: Number,
      default: 3,
    },
    backoffMs: {
      type: Number,
      default: 2000, // Initial retry backoff 2 seconds
    },
    error: {
      type: String,
      default: null,
    },
    result: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
    idempotencyKey: {
      type: String,
      unique: true,
      sparse: true,
      index: true,
    },
    runAt: {
      type: Date,
      default: Date.now,
      index: true,
    },
    startedAt: {
      type: Date,
      default: null,
    },
    completedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

// Compound index for high-performance FIFO queue pulling
automationJobSchema.index({ status: 1, runAt: 1, createdAt: 1 });

export const AutomationJob = mongoose.model("AutomationJob", automationJobSchema);
