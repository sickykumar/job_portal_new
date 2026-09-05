import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { User } from "../models/user.model.js";
import { Notification } from "../models/notification.model.js";
import { jobPostSchema } from "../utils/validators.js";
import { dispatchJobAlertsForNewJob } from "../utils/jobAlertNotifier.js";
import { sendEmail } from "../utils/emailService.js";
import { recruiterBroadcastEmailTemplate } from "../emailTemplates/index.js";
import { emitEvent } from "../automation/events/automationBus.js";
import { EVENT_TYPES } from "../automation/events/eventTypes.js";
import { checkJobDuplicate, generateJobHash } from "../automation/services/duplicateDetector.service.js";

// Helper function to escape special characters for safe regular expression search
const escapeRegex = (string) => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};

// ==============================
// Recruiter: Post a new Job
// ==============================
export const postJob = async (req, res, next) => {
  try {
    const parseResult = jobPostSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "All fields are required",
        errors: parseResult.error.flatten().fieldErrors,
        success: false,
      });
    }

    const {
      title,
      description,
      requirements,
      salary,
      location,
      jobType,
      experience,
      position,
      companyId,
      activeDays = 30,
    } = parseResult.data;

    // Verify that company exists and belongs to the recruiter
    const company = await Company.findById(companyId);
    if (!company) {
      return res.status(404).json({
        message: "Company not found",
        success: false,
      });
    }

    if (company.userId.toString() !== req.id) {
      return res.status(403).json({
        message: "You can only post jobs for companies you registered.",
        success: false,
      });
    }

    // Automated duplicate check
    const duplicateCheck = await checkJobDuplicate({
      title,
      companyId,
      location,
      description,
    });

    if (duplicateCheck.isDuplicate) {
      return res.status(409).json({
        message: duplicateCheck.reason || "A duplicate job posting already exists.",
        duplicateJobId: duplicateCheck.existingJobId,
        success: false,
      });
    }

    const duplicateHash = generateJobHash({ title, companyId, location, description });
    const expiresAt = new Date(Date.now() + (parseInt(activeDays, 10) || 30) * 24 * 60 * 60 * 1000);

    const job = await Job.create({
      title,
      description,
      requirements: requirements
        .split(",")
        .map((r) => r.trim())
        .filter(Boolean),
      salary,
      location,
      jobType,
      experienceLevel: experience,
      position,
      company: companyId,
      created_by: req.id,
      duplicateHash,
      status: "published",
      expiresAt,
      moderationStatus: "safe",
    });

    // Emit event-driven pipeline: Gemini job analysis, candidate matching & normalization
    emitEvent(EVENT_TYPES.JOB_CREATED, {
      entityType: "job",
      entityId: job._id,
      actorId: req.id,
      metadata: { title: job.title },
    });

    // Asynchronously dispatch job alerts to matching candidate subscribers
    dispatchJobAlertsForNewJob(job, company).catch((err) =>
      console.error("[PostJob] Background alert dispatch failed:", err.message)
    );

    return res.status(201).json({
      message: "Job posted successfully",
      job,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// Public/User: Get all jobs with filters & pagination
// ==============================
export const getAllJobs = async (req, res, next) => {
  try {
    const { keyword, location, jobType, page = 1, limit = 20 } = req.query;

    // Self-heal: auto-expire any published jobs whose expiry date has passed
    await Job.updateMany(
      { status: "published", expiresAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const query = {
      status: "published",
      expiresAt: { $gt: new Date() },
      moderationStatus: { $ne: "blocked" },
    };

    if (keyword && keyword.trim()) {
      const safeKeyword = escapeRegex(keyword.trim());
      query.$or = [
        { title: { $regex: safeKeyword, $options: "i" } },
        { description: { $regex: safeKeyword, $options: "i" } },
        { requirements: { $regex: safeKeyword, $options: "i" } },
      ];
    }

    if (location && location.trim()) {
      query.location = { $regex: escapeRegex(location.trim()), $options: "i" };
    }

    if (jobType && jobType.trim()) {
      query.jobType = { $regex: escapeRegex(jobType.trim()), $options: "i" };
    }

    const pageNum = Math.max(1, parseInt(page, 10) || 1);
    const limitNum = Math.min(50, Math.max(1, parseInt(limit, 10) || 20));
    const skip = (pageNum - 1) * limitNum;

    const [jobs, totalJobs] = await Promise.all([
      Job.find(query)
        .populate({ path: "company", select: "companyName logo location website" })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Job.countDocuments(query),
    ]);

    return res.status(200).json({
      jobs,
      totalJobs,
      currentPage: pageNum,
      totalPages: Math.ceil(totalJobs / limitNum),
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ==============================
// User: Get single job by ID
// ==============================
export const getJobById = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await Job.findById(jobId)
      .populate({ path: "company" })
      .populate({ path: "created_by", select: "fullname email profile.profilePhoto" })
      .populate({
        path: "applications",
        select: "applicant status createdAt",
      });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    return res.status(200).json({
      job,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ==================================
// Recruiter: Get all jobs created by recruiter
// ==================================
export const getAdminJobs = async (req, res, next) => {
  try {
    const adminId = req.id;

    // Self-heal: auto-expire any recruiter jobs whose expiresAt has passed
    await Job.updateMany(
      { created_by: adminId, status: "published", expiresAt: { $lte: new Date() } },
      { $set: { status: "expired" } }
    );

    const jobs = await Job.find({ created_by: adminId })
      .populate({ path: "company", select: "companyName logo location" })
      .populate({ path: "applications", select: "status applicant" })
      .sort({ createdAt: -1 });

    return res.status(200).json({
      jobs: jobs || [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================================
// Recruiter: Toggle Archive / Reactivate Job
// ======================================================================
export const toggleArchiveJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const userRole = req.user?.role;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job position not found", success: false });
    }

    const isOwner = job.created_by && job.created_by.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Unauthorized: Only the recruiter who created this job can archive it.",
        success: false,
      });
    }

    if (job.status === "archived") {
      job.status = "published";
      // If expired, automatically extend by 30 days
      if (!job.expiresAt || new Date(job.expiresAt) <= new Date()) {
        job.expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
      }
    } else {
      job.status = "archived";
    }

    await job.save();

    // Emit event for real-time audit trail and automation synchronization
    emitEvent(job.status === "archived" ? EVENT_TYPES.JOB_ARCHIVED : EVENT_TYPES.JOB_PUBLISHED, {
      entityType: "job",
      entityId: job._id,
      actorId: userId,
      metadata: { title: job.title, status: job.status },
    });

    return res.status(200).json({
      success: true,
      message: job.status === "archived" ? "Position archived successfully" : "Position reactivated successfully",
      job,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================================
// Recruiter: Delete Job Permanently
// ======================================================================
export const deleteJob = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const userRole = req.user?.role;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job position not found", success: false });
    }

    const isOwner = job.created_by && job.created_by.toString() === userId;
    const isAdmin = userRole === "admin";

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        message: "Unauthorized: Only the recruiter who created this job can delete it.",
        success: false,
      });
    }

    const jobTitle = job.title;
    await Job.findByIdAndDelete(jobId);

    // Emit event for real-time audit trail
    emitEvent(EVENT_TYPES.JOB_DELETED, {
      entityType: "job",
      entityId: jobId,
      actorId: userId,
      metadata: { title: jobTitle },
    });

    return res.status(200).json({
      success: true,
      message: "Job position deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==================================
// Candidate: Toggle Save/Bookmark Job
// ==================================
export const toggleSaveJob = async (req, res, next) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found", success: false });
    }

    if (!user.profile.savedJobs) {
      user.profile.savedJobs = [];
    }

    const isSaved = user.profile.savedJobs.some((id) => id.toString() === jobId);

    if (isSaved) {
      user.profile.savedJobs = user.profile.savedJobs.filter((id) => id.toString() !== jobId);
    } else {
      user.profile.savedJobs.push(jobId);
    }

    await user.save();

    return res.status(200).json({
      success: true,
      isSaved: !isSaved,
      savedJobs: user.profile.savedJobs,
      message: isSaved ? "Job removed from bookmarks" : "Job bookmarked successfully",
    });
  } catch (error) {
    next(error);
  }
};

// ==================================
// Candidate: Get All Bookmarked Jobs
// ==================================
export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate({
      path: "profile.savedJobs",
      populate: { path: "company", select: "companyName logo location" },
    });

    return res.status(200).json({
      success: true,
      jobs: user?.profile?.savedJobs || [],
    });
  } catch (error) {
    next(error);
  }
};

// ======================================================================
// Recruiter: Get Broadcast Matching Candidates Preview
// Finds candidates whose skills match at least 1-3 requirements of the job.
// ======================================================================
export const getBroadcastPreview = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job position not found", success: false });
    }

    const isOwner = job.created_by && job.created_by.toString() === userId;
    const isCompanyOwner = job.company?.userId && job.company.userId.toString() === userId;
    const isAdmin = req.user?.role === "admin";
    const isRecruiter = req.user?.role === "recruiter";

    if (!isOwner && !isCompanyOwner && !isAdmin && !isRecruiter) {
      return res.status(403).json({
        message: "Unauthorized: You can only broadcast alerts for your own jobs.",
        success: false,
      });
    }

    const jobReqs = (job.requirements || []).map((r) => r.toLowerCase().trim()).filter(Boolean);
    const titleWords = job.title.toLowerCase().split(/[\s,/-]+/).filter((w) => w.length > 2);

    // Fetch active candidates ($ne: "suspended" handles documents without explicit accountStatus field)
    const candidates = await User.find({
      role: "student",
      accountStatus: { $ne: "suspended" },
    }).select("fullname email profile.skills profile.bio");

    const matchedCandidates = [];

    for (const candidate of candidates) {
      const candSkills = (candidate.profile?.skills || []).map((s) => s.toLowerCase().trim()).filter(Boolean);
      const bioText = (candidate.profile?.bio || "").toLowerCase();

      // Find matched skills
      const matched = candSkills.filter(
        (s) =>
          jobReqs.some((req) => req.includes(s) || s.includes(req)) ||
          titleWords.some((tw) => s.includes(tw) || tw.includes(s)) ||
          bioText.includes(s)
      );

      // Condition: Match if candidate has at least 1 matching skill or relevant title match
      // (Even 1-3 skills matched qualifies the candidate!)
      if (matched.length > 0 || (candSkills.length === 0 && candidates.length < 5)) {
        matchedCandidates.push({
          candidateId: candidate._id,
          name: candidate.fullname,
          matchCount: matched.length,
          matchedSkills: matched.slice(0, 5),
          totalSkills: candSkills.length,
        });
      }
    }

    // Sort by matchCount descending
    matchedCandidates.sort((a, b) => b.matchCount - a.matchCount);

    const strongMatches = matchedCandidates.filter((c) => c.matchCount >= 2);

    return res.status(200).json({
      success: true,
      totalMatching: matchedCandidates.length,
      strongMatches: strongMatches.length,
      jobTitle: job.title,
      companyName: job.company?.companyName || "Your Company",
      requirements: job.requirements || [],
      sampleCandidates: matchedCandidates.slice(0, 6),
    });
  } catch (error) {
    console.error("[getBroadcastPreview] Error:", error);
    next(error);
  }
};

// ======================================================================
// Recruiter: Broadcast Hiring Alert to Matching Candidates
// Dispatches branded HTML emails and in-app notifications to matching candidates
// ======================================================================
export const broadcastJobAlert = async (req, res, next) => {
  try {
    const jobId = req.params.id;
    const userId = req.id;
    const { customMessage = "", minMatch = 1 } = req.body;

    const job = await Job.findById(jobId).populate("company");
    if (!job) {
      return res.status(404).json({ message: "Job position not found", success: false });
    }

    const isOwner = job.created_by && job.created_by.toString() === userId;
    const isCompanyOwner = job.company?.userId && job.company.userId.toString() === userId;
    const isAdmin = req.user?.role === "admin";
    const isRecruiter = req.user?.role === "recruiter";

    if (!isOwner && !isCompanyOwner && !isAdmin && !isRecruiter) {
      return res.status(403).json({
        message: "Unauthorized: You can only broadcast alerts for your own jobs.",
        success: false,
      });
    }

    const jobReqs = (job.requirements || []).map((r) => r.toLowerCase().trim()).filter(Boolean);
    const titleWords = job.title.toLowerCase().split(/[\s,/-]+/).filter((w) => w.length > 2);

    // Fetch active candidates
    const candidates = await User.find({
      role: "student",
      accountStatus: { $ne: "suspended" },
    }).select("fullname email profile.skills profile.bio");

    const qualifyingCandidates = [];

    for (const candidate of candidates) {
      const candSkills = (candidate.profile?.skills || []).map((s) => s.toLowerCase().trim()).filter(Boolean);
      const bioText = (candidate.profile?.bio || "").toLowerCase();

      const matched = candSkills.filter(
        (s) =>
          jobReqs.some((req) => req.includes(s) || s.includes(req)) ||
          titleWords.some((tw) => s.includes(tw) || tw.includes(s)) ||
          bioText.includes(s)
      );

      // Check min match condition (if 1 or 2 skills match, candidate qualifies!)
      if (matched.length >= (parseInt(minMatch, 10) || 1) || (candSkills.length === 0 && candidates.length < 5)) {
        qualifyingCandidates.push({
          candidate,
          matchedSkills: matched.length ? matched : jobReqs.slice(0, 3),
        });
      }
    }

    if (qualifyingCandidates.length === 0) {
      return res.status(200).json({
        success: true,
        sentCount: 0,
        message: "No candidates currently match the selected skill threshold.",
      });
    }

    const companyName = job.company?.companyName || "Verified Employer";
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";

    // Non-blocking background dispatch
    (async () => {
      for (const item of qualifyingCandidates) {
        try {
          const { candidate, matchedSkills } = item;

          // 1. Create In-App Notification
          await Notification.create({
            recipient: candidate._id,
            type: "hiring_broadcast",
            title: `📢 Hiring Alert: ${companyName} is hiring!`,
            message: `${companyName} broadcasted an urgent hiring alert for "${job.title}" matching your skillset (${matchedSkills.slice(0, 3).join(", ")}).`,
            link: "/jobs",
          });

          // 2. Send Branded Email Alert
          const emailHtml = recruiterBroadcastEmailTemplate({
            candidateName: candidate.fullname?.split(" ")[0] || "Candidate",
            job,
            company: job.company,
            matchedSkills,
            customMessage,
            clientUrl: frontendUrl,
          });

          await sendEmail({
            to: candidate.email,
            subject: `📢 Hiring Alert: ${companyName} is looking for ${job.title} (Skills Match)`,
            html: emailHtml,
          });
        } catch (dispatchErr) {
          console.error(`[BroadcastAlert] Failed to notify candidate ${item.candidate?.email}:`, dispatchErr.message);
        }
      }
    })().catch((err) => console.error("[BroadcastAlert] Background worker error:", err));

    return res.status(200).json({
      success: true,
      sentCount: qualifyingCandidates.length,
      message: `Hiring alert successfully broadcasted to ${qualifyingCandidates.length} candidate(s)!`,
    });
  } catch (error) {
    next(error);
  }
};