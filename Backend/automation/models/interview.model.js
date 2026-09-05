import mongoose from "mongoose";

/**
 * Interview Model
 * Tracks Google Calendar events, meeting links, attendance, and reminder dispatches.
 */
const interviewSchema = new mongoose.Schema(
  {
    applicationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Application",
      required: true,
      index: true,
    },
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
      index: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    calendarEventId: {
      type: String,
      default: "",
      index: true,
    },
    calendarHtmlLink: {
      type: String,
      default: "",
    },
    meetingLink: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
    },
    time: {
      type: String,
      required: true,
    },
    scheduledAt: {
      type: Date,
      required: true,
      index: true,
    },
    durationMinutes: {
      type: Number,
      default: 45,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
    },
    notes: {
      type: String,
      default: "",
      trim: true,
    },
    status: {
      type: String,
      enum: ["scheduled", "rescheduled", "cancelled", "completed"],
      default: "scheduled",
      index: true,
    },
    cancellationReason: {
      type: String,
      default: "",
    },
    reminder24hSent: {
      type: Boolean,
      default: false,
      index: true,
    },
    reminder1hSent: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  { timestamps: true }
);

interviewSchema.index({ status: 1, scheduledAt: 1 });

export const Interview = mongoose.model("Interview", interviewSchema);
