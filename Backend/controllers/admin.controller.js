import { Admin, AdminAuditLog } from "../models/admin.model.js";
import { User } from "../models/user.model.js";
import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { Application } from "../models/application.model.js";
import { Contact } from "../models/contact.model.js";
import { sendEmail } from "../utils/emailService.js";
import { contactResolutionHTML } from "../emailTemplates/index.js";
import { contactResolutionValidator } from "../utils/validators.js";

// Helper: Log Admin Action to Audit Trail
const recordAdminAudit = async ({ action, targetType, targetId, details, performedBy }) => {
  try {
    await AdminAuditLog.create({
      action,
      targetType,
      targetId: targetId ? targetId.toString() : "",
      details: details || "",
      performedBy: performedBy || null,
    });
  } catch (err) {
    console.error("[AdminAuditLog] Failed to record log:", err.message);
  }
};

// ======================================
// 1. Overview & Platform Metrics
// ======================================
export const getAdminOverview = async (req, res, next) => {
  try {
    const [
      totalCandidates,
      totalRecruiters,
      totalJobs,
      totalApplications,
      totalCompanies,
      pendingTickets,
      resolvedTickets,
      recentCandidates,
      recentRecruiters,
      recentTickets,
    ] = await Promise.all([
      User.countDocuments({ role: "student" }),
      User.countDocuments({ role: "recruiter" }),
      Job.countDocuments(),
      Application.countDocuments(),
      Company.countDocuments(),
      Contact.countDocuments({ status: { $in: ["pending", "in_progress"] } }),
      Contact.countDocuments({ status: "resolved" }),
      User.find({ role: "student" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password"),
      User.find({ role: "recruiter" })
        .sort({ createdAt: -1 })
        .limit(5)
        .select("-password"),
      Contact.find().sort({ createdAt: -1 }).limit(6),
    ]);

    return res.status(200).json({
      success: true,
      data: {
        metrics: {
          totalUsers: totalCandidates + totalRecruiters,
          totalCandidates,
          totalRecruiters,
          totalJobs,
          totalApplications,
          totalCompanies,
          pendingTickets,
          resolvedTickets,
        },
        recentCandidates,
        recentRecruiters,
        recentTickets,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// 2. Candidate Management
// ======================================
export const getAllCandidates = async (req, res, next) => {
  try {
    const { search, status } = req.query;
    const query = { role: "student" };

    if (status && ["active", "suspended"].includes(status)) {
      query.accountStatus = status;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullname: regex },
        { email: regex },
        { phoneNumber: regex },
      ];
    }

    const candidates = await User.find(query)
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    // Attach application counts for each candidate
    const candidateIds = candidates.map((c) => c._id);
    const appCounts = await Application.aggregate([
      { $match: { applicant: { $in: candidateIds } } },
      { $group: { _id: "$applicant", count: { $sum: 1 } } },
    ]);

    const countMap = new Map(appCounts.map((item) => [item._id.toString(), item.count]));

    const enrichedCandidates = candidates.map((c) => ({
      ...c,
      totalApplications: countMap.get(c._id.toString()) || 0,
    }));

    return res.status(200).json({
      success: true,
      candidates: enrichedCandidates,
      total: enrichedCandidates.length,
    });
  } catch (error) {
    next(error);
  }
};

export const toggleUserStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { accountStatus } = req.body;

    if (!["active", "suspended"].includes(accountStatus)) {
      return res.status(400).json({
        message: "Invalid status. Allowed values: 'active', 'suspended'.",
        success: false,
      });
    }

    const user = await User.findByIdAndUpdate(
      id,
      { accountStatus },
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found.",
        success: false,
      });
    }

    await recordAdminAudit({
      action: "USER_STATUS_CHANGE",
      targetType: user.role === "recruiter" ? "recruiter" : "candidate",
      targetId: user._id,
      details: `Account status updated to ${accountStatus}`,
      performedBy: req.id,
    });

    return res.status(200).json({
      message: `Account status successfully updated to '${accountStatus}' for ${user.fullname}`,
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteCandidate = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Candidate not found.",
        success: false,
      });
    }

    // Clean up applications submitted by this candidate
    await Application.deleteMany({ applicant: id });
    await User.findByIdAndDelete(id);

    await recordAdminAudit({
      action: "CANDIDATE_DELETE",
      targetType: "candidate",
      targetId: id,
      details: `Deleted candidate account ${user.fullname} (${user.email}) and related applications`,
      performedBy: req.id,
    });

    return res.status(200).json({
      message: `Candidate ${user.fullname} and their applications were successfully removed.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// 3. Recruiter Management
// ======================================
export const getAllRecruiters = async (req, res, next) => {
  try {
    const { search } = req.query;
    const query = { role: "recruiter" };

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { fullname: regex },
        { email: regex },
        { phoneNumber: regex },
      ];
    }

    const recruiters = await User.find(query)
      .populate("profile.company")
      .sort({ createdAt: -1 })
      .select("-password")
      .lean();

    const recruiterIds = recruiters.map((r) => r._id);

    // 1. Fetch companies registered by these recruiters
    const companies = await Company.find({ userId: { $in: recruiterIds } }).lean();
    const companyByUserId = new Map(companies.map((c) => [c.userId.toString(), c]));

    // 2. Fetch jobs count and fallback company from jobs posted by recruiter
    const jobCounts = await Job.aggregate([
      { $match: { created_by: { $in: recruiterIds } } },
      { $group: { _id: "$created_by", count: { $sum: 1 }, lastCompanyId: { $first: "$company" } } },
    ]);
    const jobCountMap = new Map(jobCounts.map((item) => [item._id.toString(), item.count]));

    // 3. Fallback company lookup for any recruiters whose profile.company is not set
    const fallbackCompanyIds = jobCounts
      .filter((j) => j.lastCompanyId)
      .map((j) => j.lastCompanyId);
    const fallbackCompanies = await Company.find({ _id: { $in: fallbackCompanyIds } }).lean();
    const fallbackMap = new Map(fallbackCompanies.map((c) => [c._id.toString(), c]));

    const enrichedRecruiters = recruiters.map((r) => {
      const rId = r._id.toString();
      const directCompany = companyByUserId.get(rId);
      const jobItem = jobCounts.find((j) => j._id.toString() === rId);
      const jobCompany = jobItem?.lastCompanyId ? fallbackMap.get(jobItem.lastCompanyId.toString()) : null;

      const resolvedCompany = r.profile?.company || directCompany || jobCompany || null;

      return {
        ...r,
        profile: {
          ...r.profile,
          company: resolvedCompany,
        },
        totalJobs: jobCountMap.get(rId) || 0,
      };
    });

    return res.status(200).json({
      success: true,
      recruiters: enrichedRecruiters,
      total: enrichedRecruiters.length,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteRecruiter = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "Recruiter not found.",
        success: false,
      });
    }

    await User.findByIdAndDelete(id);

    await recordAdminAudit({
      action: "RECRUITER_DELETE",
      targetType: "recruiter",
      targetId: id,
      details: `Deleted recruiter account ${user.fullname} (${user.email})`,
      performedBy: req.id,
    });

    return res.status(200).json({
      message: `Recruiter ${user.fullname} was successfully removed.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// 4. Job Moderation
// ======================================
export const getAllJobsForAdmin = async (req, res, next) => {
  try {
    const jobs = await Job.find()
      .populate("company", "companyName name logo location website")
      .populate("created_by", "fullname email phoneNumber")
      .sort({ createdAt: -1 })
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

export const deleteJobByAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const job = await Job.findById(id);

    if (!job) {
      return res.status(404).json({
        message: "Job listing not found.",
        success: false,
      });
    }

    await Application.deleteMany({ job: id });
    await Job.findByIdAndDelete(id);

    await recordAdminAudit({
      action: "JOB_DELETE",
      targetType: "job",
      targetId: id,
      details: `Removed job listing "${job.title}" by admin moderation`,
      performedBy: req.id,
    });

    return res.status(200).json({
      message: `Job "${job.title}" has been deleted from the platform.`,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// 5. Support Tickets Desk & Resolution
// ======================================
export const getAllTickets = async (req, res, next) => {
  try {
    const { status, category, search } = req.query;
    const query = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (category && category !== "all") {
      query.category = category;
    }

    if (search?.trim()) {
      const regex = new RegExp(search.trim(), "i");
      query.$or = [
        { ticketId: regex },
        { name: regex },
        { email: regex },
        { subject: regex },
      ];
    }

    const tickets = await Contact.find(query)
      .populate("resolvedBy", "fullname email")
      .sort({ createdAt: -1 })
      .lean();

    return res.status(200).json({
      success: true,
      tickets,
      total: tickets.length,
    });
  } catch (error) {
    next(error);
  }
};

export const resolveTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const validation = contactResolutionValidator.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        message: validation.error.issues[0]?.message || "Invalid resolution payload",
        success: false,
      });
    }

    const { status, resolutionNotes } = validation.data;

    const contact = await Contact.findById(id);
    if (!contact) {
      return res.status(404).json({
        message: "Support ticket not found.",
        success: false,
      });
    }

    // Update ticket state
    contact.status = status;
    contact.resolutionNotes = resolutionNotes;
    contact.resolvedAt = new Date();
    contact.resolvedBy = req.id || null;
    await contact.save();

    // Dispatch automated Resolution Email to the user (non-blocking)
    const emailPayload = {
      name: contact.name,
      email: contact.email,
      subject: contact.subject,
      ticketId: contact.ticketId,
      message: contact.message,
      resolutionNotes,
      status,
    };

    sendEmail({
      to: contact.email,
      subject: `✅ NexHire Support: Ticket ${contact.ticketId} [${status.toUpperCase()}]`,
      html: contactResolutionHTML(emailPayload),
    }).catch((err) =>
      console.error("[Admin] Resolution email delivery failed:", err.message)
    );

    await recordAdminAudit({
      action: "TICKET_RESOLVED",
      targetType: "ticket",
      targetId: contact._id,
      details: `Ticket ${contact.ticketId} marked as ${status} with resolution notes.`,
      performedBy: req.id,
    });

    return res.status(200).json({
      message: `Ticket ${contact.ticketId} successfully marked as '${status}' and resolution sent to candidate.`,
      success: true,
      ticket: contact,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// 6. Real-Time System Health Status
// ======================================
export const getSystemHealthStatus = async (req, res, next) => {
  try {
    const startTime = Date.now();
    
    // Check MongoDB connection latency & state
    let dbStatus = "disconnected";
    let dbLatencyMs = 0;
    try {
      const dbPingStart = Date.now();
      await User.findOne().select("_id").lean();
      dbLatencyMs = Date.now() - dbPingStart;
      dbStatus = "healthy";
    } catch (dbErr) {
      dbStatus = "degraded";
    }

    // Memory usage telemetry
    const memoryUsage = process.memoryUsage();
    const memory = {
      rssMb: (memoryUsage.rss / 1024 / 1024).toFixed(2),
      heapUsedMb: (memoryUsage.heapUsed / 1024 / 1024).toFixed(2),
      heapTotalMb: (memoryUsage.heapTotal / 1024 / 1024).toFixed(2),
    };

    const uptimeSeconds = Math.floor(process.uptime());
    const days = Math.floor(uptimeSeconds / 86400);
    const hours = Math.floor((uptimeSeconds % 86400) / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    const uptimeFormatted = `${days > 0 ? `${days}d ` : ""}${hours}h ${minutes}m ${seconds}s`;

    return res.status(200).json({
      success: true,
      data: {
        status: dbStatus === "healthy" ? "operational" : "degraded",
        timestamp: new Date().toISOString(),
        serverTimeIST: new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }),
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || "development",
        uptimeSeconds,
        uptimeFormatted,
        database: {
          status: dbStatus,
          provider: "MongoDB Atlas",
          latencyMs: dbLatencyMs,
        },
        memory,
        totalResponseTimeMs: Date.now() - startTime,
      },
    });
  } catch (error) {
    next(error);
  }
};

