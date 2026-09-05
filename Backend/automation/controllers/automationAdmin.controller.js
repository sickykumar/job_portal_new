import { AutomationJob } from "../models/automationJob.model.js";
import { AutomationEvent } from "../models/automationEvent.model.js";
import { Interview } from "../models/interview.model.js";
import { Job } from "../../models/job.model.js";
import { Application } from "../../models/application.model.js";
import { getRecommendedJobsForCandidate } from "../services/recommendation.service.js";
import { syncAllJobsWithAI } from "../services/jobAnalyzer.service.js";

/**
 * 1. Get Live Automation Metrics & System Health
 * GET /api/automation/overview
 */
export const getAutomationOverview = async (req, res, next) => {
  try {
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    // Dynamic self-heal: Ensure legacy jobs without status or with expired dates are normalized
    await Job.updateMany(
      { status: { $exists: false } },
      { $set: { status: "published", moderationStatus: "safe", expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000) } }
    );
    await Job.updateMany(
      { status: "published", expiresAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const [
      activeJobs,
      applicationsToday,
      aiJobsProcessed,
      failedJobs,
      pendingApplications,
      pendingQueueTasks,
      upcomingInterviews,
      expiredJobs,
      flaggedJobs,
      recentEvents,
    ] = await Promise.all([
      Job.countDocuments({ status: "published", expiresAt: { $gt: new Date() }, moderationStatus: { $ne: "blocked" } }),
      Application.countDocuments({ createdAt: { $gte: todayStart } }),
      AutomationJob.countDocuments({ status: "completed" }),
      AutomationJob.countDocuments({ status: "failed" }),
      Application.countDocuments({ status: "pending" }),
      AutomationJob.countDocuments({ status: { $in: ["pending", "retrying"] } }),
      Interview.countDocuments({ status: "scheduled", scheduledAt: { $gte: new Date() } }),
      Job.countDocuments({
        $or: [
          { status: { $in: ["expired", "archived", "closed"] } },
          { status: "published", expiresAt: { $lte: new Date() } },
        ],
      }),
      Job.countDocuments({ moderationStatus: { $in: ["review_required", "blocked"] } }),
      AutomationEvent.find().sort({ createdAt: -1 }).limit(10).lean(),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          activeJobs,
          applicationsToday,
          aiJobsProcessed,
          failedJobs,
          pendingJobs: pendingApplications, // Accurately reflects pending candidates awaiting review!
          pendingQueueTasks,
          upcomingInterviews,
          expiredJobs,
          flaggedJobs,
        },
        recentEvents,
      },
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 7. Trigger Full Gemini AI Job Normalization & Expiry Audit
 * POST /api/automation/ai-sync-all
 */
export const triggerAiSyncAll = async (req, res, next) => {
  try {
    const syncStats = await syncAllJobsWithAI();
    return res.status(200).json({
      success: true,
      message: `Gemini AI sync completed! ${syncStats.published} active jobs published, ${syncStats.expired} expired jobs audited, and ${syncStats.aiProcessed} jobs normalized with AI skills.`,
      stats: syncStats,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 2. Get Automation Queue Tasks
 * GET /api/automation/queue
 */
export const getAutomationQueue = async (req, res, next) => {
  try {
    const { status, limit = 25, page = 1 } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 25));
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      AutomationJob.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum)
        .lean(),
      AutomationJob.countDocuments(query),
    ]);

    return res.status(200).json({
      success: true,
      tasks,
      total,
      currentPage: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 3. Retry a Failed Automation Job
 * POST /api/automation/retry/:id
 */
export const retryFailedJob = async (req, res, next) => {
  try {
    const { id } = req.params;

    const job = await AutomationJob.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Automation job not found" });
    }

    job.status = "pending";
    job.attempts = 0;
    job.error = null;
    job.runAt = new Date();
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job ${job.jobType} queued for immediate retry!`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 4. Get Flagged Jobs for Moderation
 * GET /api/automation/flagged-jobs
 */
export const getFlaggedJobs = async (req, res, next) => {
  try {
    const jobs = await Job.find({
      moderationStatus: { $in: ["review_required", "blocked"] },
    })
      .populate("company", "companyName logo location")
      .populate("created_by", "fullname email")
      .sort({ updatedAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      jobs,
      total: jobs.length,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 5. Resolve Job Moderation Status
 * POST /api/automation/resolve-flagged/:id
 */
export const resolveJobModeration = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { decision, notes = "" } = req.body; // 'safe' or 'blocked'

    if (!["safe", "blocked"].includes(decision)) {
      return res.status(400).json({
        success: false,
        message: "Decision must be either 'safe' or 'blocked'.",
      });
    }

    const job = await Job.findById(id);
    if (!job) {
      return res.status(404).json({ success: false, message: "Job not found" });
    }

    job.moderationStatus = decision;
    job.moderationNotes = notes || `Manually reviewed and marked ${decision} by Admin.`;
    if (decision === "safe" && job.status === "paused") {
      job.status = "published";
    }
    await job.save();

    return res.status(200).json({
      success: true,
      message: `Job "${job.title}" marked as ${decision.toUpperCase()}.`,
      job,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * 6. Get Candidate Personalized Recommendations
 * GET /api/automation/recommendations
 */
export const getCandidateRecommendations = async (req, res, next) => {
  try {
    const userId = req.id;
    const limit = parseInt(req.query.limit, 10) || 6;

    const recommendations = await getRecommendedJobsForCandidate({ userId, limit });

    return res.status(200).json({
      success: true,
      recommendations,
      count: recommendations.length,
    });
  } catch (error) {
    next(error);
  }
};
