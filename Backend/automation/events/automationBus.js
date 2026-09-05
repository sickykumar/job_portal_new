import EventEmitter from "events";
import { EVENT_TYPES, AUTOMATION_JOB_TYPES } from "./eventTypes.js";
import { AutomationEvent } from "../models/automationEvent.model.js";
import { AutomationJob } from "../models/automationJob.model.js";

class AutomationBus extends EventEmitter {}

export const automationBus = new AutomationBus();
// Increase listener limit to prevent warning during heavy parallel event triggers
automationBus.setMaxListeners(50);

/**
 * Enqueue a background automation job with idempotency support.
 */
export const enqueueJob = async ({ jobType, payload, idempotencyKey = null, runAt = new Date(), maxAttempts = 3 }) => {
  try {
    if (idempotencyKey) {
      const existing = await AutomationJob.findOne({ idempotencyKey });
      if (existing) {
        return existing;
      }
    }

    const job = await AutomationJob.create({
      jobType,
      payload,
      idempotencyKey,
      runAt,
      maxAttempts,
      status: "pending",
    });

    return job;
  } catch (error) {
    // Gracefully handle duplicate idempotency key race condition
    if (error.code === 11000) {
      return await AutomationJob.findOne({ idempotencyKey });
    }
    console.error("[AutomationBus] Failed to enqueue job:", error.message);
    return null;
  }
};

/**
 * Dispatches an event across the platform and persists an audit record.
 */
export const emitEvent = async (eventType, { entityType, entityId, actorId = null, metadata = {} }) => {
  try {
    // 1. Record event in MongoDB for audit and observability
    AutomationEvent.create({
      eventType,
      entityType,
      entityId: String(entityId),
      actorId,
      metadata,
      timestamp: new Date(),
    }).catch((err) => console.warn("[AutomationEvent Log Error]:", err.message));

    // 2. Emit in-process for attached handlers
    automationBus.emit(eventType, { entityType, entityId, actorId, metadata });
  } catch (error) {
    console.error(`[AutomationBus] emitEvent failed for ${eventType}:`, error.message);
  }
};

/**
 * Register core listeners to automatically enqueue background tasks
 */
export const initializeAutomationListeners = () => {
  // 1. When a Job is Created -> Enqueue job analysis & candidate matching
  automationBus.on(EVENT_TYPES.JOB_CREATED, async (data) => {
    const jobId = data.entityId;
    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.ANALYZE_JOB,
      payload: { jobId },
      idempotencyKey: `analyze_job_${jobId}`,
    });

    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.MATCH_CANDIDATES_FOR_JOB,
      payload: { jobId },
      idempotencyKey: `match_candidates_${jobId}`,
      runAt: new Date(Date.now() + 5000), // Run 5 seconds later so normalized metadata is ready
    });
  });

  // 2. When a Candidate Applies -> Enqueue application screening & confirmation email
  automationBus.on(EVENT_TYPES.APPLICATION_CREATED, async (data) => {
    const { entityId: applicationId, metadata } = data;
    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.SCREEN_APPLICATION,
      payload: { applicationId, jobId: metadata?.jobId, applicantId: metadata?.applicantId },
      idempotencyKey: `screen_app_${applicationId}`,
    });

    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.SEND_STATUS_EMAIL,
      payload: {
        applicationId,
        status: "pending",
        milestone: "applied",
      },
      idempotencyKey: `email_app_applied_${applicationId}`,
    });
  });

  // 3. When Application Status Changes -> Enqueue milestone notification email
  automationBus.on(EVENT_TYPES.APPLICATION_STATUS_CHANGED, async (data) => {
    const { entityId: applicationId, metadata } = data;
    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.SEND_STATUS_EMAIL,
      payload: {
        applicationId,
        status: metadata?.status,
        feedback: metadata?.feedback,
        interviewDetails: metadata?.interviewDetails,
      },
      idempotencyKey: `email_status_${applicationId}_${metadata?.status}_${Date.now()}`,
    });
  });

  // 4. When Candidate Uploads a Resume -> Enqueue CV analysis
  automationBus.on(EVENT_TYPES.RESUME_UPLOADED, async (data) => {
    const { entityId: userId, metadata } = data;
    await enqueueJob({
      jobType: AUTOMATION_JOB_TYPES.PROCESS_RESUME,
      payload: { userId, resumeUrl: metadata?.resumeUrl, originalName: metadata?.originalName },
      idempotencyKey: `process_resume_${userId}_${metadata?.uploadedAt || Date.now()}`,
    });
  });

  console.log("[AutomationBus] Event listeners registered successfully.");
};
