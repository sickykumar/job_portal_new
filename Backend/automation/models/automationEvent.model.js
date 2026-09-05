import mongoose from "mongoose";

/**
 * AutomationEvent Model
 * Audit log and event streaming record for observability and system health.
 */
const automationEventSchema = new mongoose.Schema(
  {
    eventType: {
      type: String,
      required: true,
      index: true,
      trim: true,
    },
    entityType: {
      type: String,
      required: true,
      trim: true,
    },
    entityId: {
      type: String,
      required: true,
      index: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  { timestamps: true }
);

automationEventSchema.index({ eventType: 1, timestamp: -1 });

export const AutomationEvent = mongoose.model("AutomationEvent", automationEventSchema);
