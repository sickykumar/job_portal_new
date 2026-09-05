import { Job } from "../../models/job.model.js";
import { Interview } from "../models/interview.model.js";
import { JobAlert } from "../../models/jobAlert.model.js";
import { User } from "../../models/user.model.js";
import { Notification } from "../../models/notification.model.js";
import { emitEvent, enqueueJob } from "../events/automationBus.js";
import { EVENT_TYPES, AUTOMATION_JOB_TYPES } from "../events/eventTypes.js";
import { automationConfig } from "../config/automation.config.js";
import { sendEmail } from "../../utils/emailService.js";

let expiryInterval = null;
let reminderInterval = null;
let dailyDigestInterval = null;

/**
 * 1. Expire past-due jobs automatically
 */
export const checkAndExpireJobs = async () => {
  try {
    const now = new Date();
    const expiredJobs = await Job.find({
      status: "published",
      expiresAt: { $lte: now },
    }).populate("company", "companyName");

    if (!expiredJobs.length) return;

    for (const job of expiredJobs) {
      job.status = "expired";
      await job.save();

      emitEvent(EVENT_TYPES.JOB_EXPIRED, {
        entityType: "job",
        entityId: job._id,
        actorId: job.created_by,
        metadata: { title: job.title },
      });

      // Notify recruiter
      if (job.created_by) {
        Notification.create({
          recipient: job.created_by,
          type: "system",
          title: "Job Listing Expired",
          message: `Your job listing "${job.title}" has reached its expiration date and was marked as expired. You can renew or republish it anytime.`,
          link: "/admin/jobs",
        }).catch(() => {});
      }
    }

    console.log(`[Scheduler] Processed and marked ${expiredJobs.length} expired job(s).`);
  } catch (error) {
    console.error("[Scheduler] Expired jobs check error:", error.message);
  }
};

/**
 * 2. Automatic interview reminders (24 hours and 1 hour before)
 */
export const checkInterviewReminders = async () => {
  try {
    const now = new Date();
    const next24h = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const next1h = new Date(now.getTime() + 60 * 60 * 1000);

    const activeInterviews = await Interview.find({
      status: "scheduled",
      scheduledAt: { $gte: now, $lte: next24h },
    })
      .populate("candidateId", "fullname email")
      .populate("recruiterId", "fullname email")
      .populate("jobId", "title");

    for (const interview of activeInterviews) {
      const scheduledTime = new Date(interview.scheduledAt).getTime();
      const diffMs = scheduledTime - now.getTime();
      const diffHours = diffMs / (1000 * 60 * 60);

      // Check 1-hour reminder
      if (diffHours <= 1.1 && !interview.reminder1hSent) {
        interview.reminder1hSent = true;
        await interview.save();

        await enqueueJob({
          jobType: AUTOMATION_JOB_TYPES.SEND_INTERVIEW_REMINDER,
          payload: {
            candidateEmail: interview.candidateId?.email,
            candidateName: interview.candidateId?.fullname,
            jobTitle: interview.jobId?.title || "Role",
            meetingLink: interview.meetingLink,
            timeRemaining: "1 hour",
          },
          idempotencyKey: `reminder_1h_${interview._id}`,
        });
      }
      // Check 24-hour reminder
      else if (diffHours <= 24 && !interview.reminder24hSent) {
        interview.reminder24hSent = true;
        await interview.save();

        await enqueueJob({
          jobType: AUTOMATION_JOB_TYPES.SEND_INTERVIEW_REMINDER,
          payload: {
            candidateEmail: interview.candidateId?.email,
            candidateName: interview.candidateId?.fullname,
            jobTitle: interview.jobId?.title || "Role",
            meetingLink: interview.meetingLink,
            timeRemaining: "24 hours",
          },
          idempotencyKey: `reminder_24h_${interview._id}`,
        });
      }
    }
  } catch (error) {
    console.error("[Scheduler] Interview reminders check error:", error.message);
  }
};

/**
 * 3. Daily job alert digest
 */
export const dispatchDailyJobDigests = async () => {
  try {
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);

    // Find new jobs posted in last 24 hours
    const recentJobs = await Job.find({
      status: "published",
      moderationStatus: { $ne: "blocked" },
      createdAt: { $gte: yesterday },
    })
      .populate("company", "companyName logo location")
      .limit(20)
      .lean();

    if (!recentJobs.length) return;

    // Find daily alert subscribers
    const dailyAlerts = await JobAlert.find({
      isActive: true,
      frequency: "daily",
      $or: [
        { lastAlertSentAt: null },
        { lastAlertSentAt: { $lte: yesterday } },
      ],
    }).populate("userId", "fullname email");

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    for (const alert of dailyAlerts) {
      const keywords = (alert.keywords || []).map((k) => k.toLowerCase().trim());
      const matching = recentJobs.filter((job) => {
        const text = `${job.title} ${job.description} ${(job.requirements || []).join(" ")}`.toLowerCase();
        return keywords.some((k) => text.includes(k));
      });

      if (matching.length > 0 && alert.userId?.email) {
        const jobListHtml = matching
          .slice(0, 5)
          .map(
            (j) =>
              `<li style="margin-bottom:10px;"><a href="${clientUrl}/jobs" style="color:#6366F1;font-weight:700;">${j.title}</a> at ${j.company?.companyName || "Top Company"} (${j.location})</li>`
          )
          .join("");

        await sendEmail({
          to: alert.userId.email,
          subject: `📋 Daily Job Digest: ${matching.length} New Matching Roles for "${alert.title}"`,
          html: `<div style="font-family:sans-serif;padding:20px;background:#0D1322;color:#E2E8F0;border-radius:12px;">
            <h2 style="color:#FFFFFF;">Your Daily Job Digest</h2>
            <p>Hi <strong>${alert.userId.fullname || "Candidate"}</strong>, here are today's top matching openings for your alert <em>"${alert.title}"</em>:</p>
            <ul style="padding-left:20px;">${jobListHtml}</ul>
            <p><a href="${clientUrl}/jobs" style="display:inline-block;padding:10px 20px;background:#6366F1;color:#fff;border-radius:8px;text-decoration:none;">Explore All Matches</a></p>
          </div>`,
        }).catch(() => {});

        alert.lastAlertSentAt = new Date();
        alert.matchesCount += matching.length;
        await alert.save().catch(() => {});
      }
    }
  } catch (error) {
    console.error("[Scheduler] Daily digest dispatch error:", error.message);
  }
};

/**
 * Start all scheduler intervals
 */
export const startScheduler = () => {
  if (!automationConfig.schedulerEnabled) return;

  console.log("[Scheduler] Initializing automation cron routines...");

  // Run checks on startup
  checkAndExpireJobs().catch(() => {});
  checkInterviewReminders().catch(() => {});

  // Interval timers
  expiryInterval = setInterval(checkAndExpireJobs, automationConfig.expiredCheckIntervalMs);
  reminderInterval = setInterval(checkInterviewReminders, automationConfig.interviewReminderIntervalMs);
  // Daily digest checks every 4 hours
  dailyDigestInterval = setInterval(dispatchDailyJobDigests, 4 * 60 * 60 * 1000);
};

export const stopScheduler = () => {
  if (expiryInterval) clearInterval(expiryInterval);
  if (reminderInterval) clearInterval(reminderInterval);
  if (dailyDigestInterval) clearInterval(dailyDigestInterval);
  console.log("[Scheduler] Automation routines stopped.");
};
