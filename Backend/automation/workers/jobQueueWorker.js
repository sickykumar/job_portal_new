import { AutomationJob } from "../models/automationJob.model.js";
import { AUTOMATION_JOB_TYPES } from "../events/eventTypes.js";
import { automationConfig } from "../config/automation.config.js";
import { analyzeJob } from "../services/jobAnalyzer.service.js";
import { processCandidateResume } from "../services/resumeAnalyzer.service.js";
import { matchCandidateToJob } from "../services/candidateMatcher.service.js";
import { dispatchApplicationStatusEmail } from "../services/statusNotifier.service.js";
import { User } from "../../models/user.model.js";
import { Job } from "../../models/job.model.js";
import { sendEmail } from "../../utils/emailService.js";

let isWorkerRunning = false;
let workerTimer = null;

/**
 * Executes a single AutomationJob payload based on jobType.
 */
const executeTask = async (job) => {
  const { jobType, payload } = job;

  switch (jobType) {
    case AUTOMATION_JOB_TYPES.ANALYZE_JOB:
      return await analyzeJob(payload.jobId);

    case AUTOMATION_JOB_TYPES.PROCESS_RESUME:
      return await processCandidateResume(payload);

    case AUTOMATION_JOB_TYPES.SCREEN_APPLICATION:
      return await matchCandidateToJob({
        candidateId: payload.applicantId,
        jobId: payload.jobId,
        applicationId: payload.applicationId,
      });

    case AUTOMATION_JOB_TYPES.MATCH_CANDIDATES_FOR_JOB: {
      // Find up to 10 active candidates to pre-compute match scores
      const candidates = await User.find({ role: "student", accountStatus: "active" })
        .select("_id")
        .limit(10)
        .lean();

      for (const cand of candidates) {
        try {
          await matchCandidateToJob({ candidateId: cand._id, jobId: payload.jobId });
        } catch (e) {
          // ignore single candidate match error
        }
      }
      return { matchedCount: candidates.length };
    }

    case AUTOMATION_JOB_TYPES.SEND_STATUS_EMAIL:
      return await dispatchApplicationStatusEmail(payload);

    case AUTOMATION_JOB_TYPES.SEND_INTERVIEW_REMINDER: {
      const { candidateEmail, candidateName, jobTitle, meetingLink, timeRemaining } = payload;
      return await sendEmail({
        to: candidateEmail,
        subject: `⏰ Reminder: Your Interview for ${jobTitle} starts in ${timeRemaining}`,
        html: `<p>Hi <strong>${candidateName}</strong>,</p><p>This is a quick reminder that your technical discussion for <strong>${jobTitle}</strong> is scheduled in <strong>${timeRemaining}</strong>.</p><p><a href="${meetingLink}" style="padding:10px 20px;background:#6366F1;color:#fff;border-radius:8px;text-decoration:none;display:inline-block;margin:12px 0;">Join Google Meet</a></p><p>Best of luck with your interview!</p>`,
      });
    }

    default:
      console.warn(`[JobQueueWorker] Unrecognized jobType: ${jobType}`);
      return { skipped: true };
  }
};

/**
 * Polls for pending jobs and processes them with retry backoff and error tracking.
 */
export const processQueueBatch = async () => {
  if (!automationConfig.workerEnabled) return;

  try {
    const now = new Date();

    // Find pending or retrying jobs ready to run
    const jobs = await AutomationJob.find({
      status: { $in: ["pending", "retrying"] },
      runAt: { $lte: now },
    })
      .sort({ runAt: 1, createdAt: 1 })
      .limit(automationConfig.batchSize);

    if (!jobs.length) return;

    for (const job of jobs) {
      // Atomically claim the job to prevent parallel worker duplicate execution
      const claimed = await AutomationJob.findOneAndUpdate(
        { _id: job._id, status: { $in: ["pending", "retrying"] } },
        { status: "processing", startedAt: new Date() },
        { new: true }
      );

      if (!claimed) continue; // Claimed by another instance

      try {
        const result = await executeTask(claimed);

        claimed.status = "completed";
        claimed.result = result;
        claimed.completedAt = new Date();
        claimed.error = null;
        await claimed.save();
      } catch (err) {
        const nextAttempt = claimed.attempts + 1;
        claimed.attempts = nextAttempt;
        claimed.error = err.message || "Unknown error";

        if (nextAttempt < claimed.maxAttempts) {
          const backoff = Math.min(
            automationConfig.maxBackoffMs,
            claimed.backoffMs * Math.pow(2, nextAttempt - 1)
          );
          claimed.status = "retrying";
          claimed.runAt = new Date(Date.now() + backoff);
          console.warn(`[JobQueueWorker] Job ${claimed._id} failed (attempt ${nextAttempt}/${claimed.maxAttempts}). Retrying in ${backoff}ms...`);
        } else {
          claimed.status = "failed";
          claimed.completedAt = new Date();
          console.error(`[JobQueueWorker] Job ${claimed._id} reached max attempts. Marked FAILED (Dead-Letter):`, err.message);
        }

        await claimed.save();
      }
    }
  } catch (error) {
    console.error("[JobQueueWorker] Batch processing error:", error.message);
  }
};

/**
 * Start the background worker loop
 */
export const startJobQueueWorker = () => {
  if (isWorkerRunning) return;
  isWorkerRunning = true;

  console.log(`[JobQueueWorker] Starting background task worker (Poll interval: ${automationConfig.pollIntervalMs}ms)...`);

  const loop = async () => {
    await processQueueBatch();
    if (isWorkerRunning) {
      workerTimer = setTimeout(loop, automationConfig.pollIntervalMs);
    }
  };

  loop();
};

/**
 * Gracefully stop background worker
 */
export const stopJobQueueWorker = () => {
  isWorkerRunning = false;
  if (workerTimer) clearTimeout(workerTimer);
  console.log("[JobQueueWorker] Background task worker stopped.");
};
