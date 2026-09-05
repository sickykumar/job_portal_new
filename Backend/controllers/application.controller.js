import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";
import { applicationStatusSchema, bulkApplicationStatusSchema } from "../utils/validators.js";
import { createNotification } from "./notification.controller.js";
import { emitEvent } from "../automation/events/automationBus.js";
import { EVENT_TYPES } from "../automation/events/eventTypes.js";
import { createCalendarInterview } from "../automation/services/googleCalendar.service.js";

// ======================================
// Candidate: Apply for a Job
// ======================================
export const applyJob = async (req, res, next) => {
  try {
    const userId = req.id;
    const jobId = req.params.id;

    // Check candidate role
    if (req.user?.role?.toLowerCase() === "recruiter") {
      return res.status(403).json({
        message: "Recruiters cannot apply for jobs. Please use a student/candidate account.",
        success: false,
      });
    }

    if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job ID", success: false });
    }

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // Check if applying to own job (safe navigation in case legacy seeded jobs have null created_by)
    if (job.created_by && job.created_by.toString() === userId) {
      return res.status(403).json({
        message: "You cannot apply to your own job",
        success: false,
      });
    }

    // Check if already applied
    const existingApplication = await Application.findOne({
      job: jobId,
      applicant: userId,
    });

    if (existingApplication) {
      return res.status(409).json({
        message: "You have already applied for this job",
        success: false,
      });
    }

    // Create new application
    const newApplication = await Application.create({
      job: jobId,
      applicant: userId,
    });

    // Update job applications reference without triggering full document re-validation on legacy seeded jobs
    await Job.findByIdAndUpdate(jobId, {
      $push: { applications: newApplication._id },
    });

    // Emit event: triggers automated candidate confirmation email and AI candidate screening match calculation
    emitEvent(EVENT_TYPES.APPLICATION_CREATED, {
      entityType: "application",
      entityId: newApplication._id,
      actorId: userId,
      metadata: { jobId, applicantId: userId },
    });

    // Notify the recruiter who posted the job
    const recipient = job.created_by || job.company?.userId;
    if (recipient) {
      await createNotification({
        recipient,
        type: "application_received",
        title: "New Application Received",
        message: `${req.user?.fullname || "A candidate"} applied for "${job.title}".`,
        link: `/recruiter-jobs?jobId=${jobId}&appId=${newApplication._id}`,
      });
    }

    // In-app receipt notification for the applicant candidate
    await createNotification({
      recipient: userId,
      type: "application_received",
      title: "Application Submitted Successfully",
      message: `Your application for "${job.title}" has been submitted. Click to track real-time status.`,
      link: `/applied?jobId=${jobId}&appId=${newApplication._id}`,
    });

    return res.status(201).json({
      message: "Application submitted successfully",
      applicationId: newApplication._id,
      success: true,
    });
  } catch (error) {
    // Catch duplicate compound key error gracefully
    if (error.code === 11000) {
      return res.status(409).json({
        message: "You have already applied for this job",
        success: false,
      });
    }
    next(error);
  }
};

// ======================================
// Candidate: Get all jobs applied by user
// ======================================
export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        populate: {
          path: "company",
          select: "companyName logo location website",
        },
      });

    return res.status(200).json({
      application: applications || [],
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Recruiter: Get all applicants for a job (Ownership Enforced)
// ======================================
export const getApplicants = async (req, res, next) => {
  try {
    const jobId = req.params.id;

    if (!jobId || !jobId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: "Invalid job ID", success: false });
    }

    const job = await Job.findById(jobId).populate({
      path: "applications",
      options: { sort: { createdAt: -1 } },
      populate: {
        path: "applicant",
        select: "fullname email phoneNumber profile adharcard pancard createdAt",
      },
    });

    if (!job) {
      return res.status(404).json({
        message: "Job not found",
        success: false,
      });
    }

    // IDOR Protection: verify logged-in recruiter posted this job
    if (job.created_by?.toString() !== req.id) {
      return res.status(403).json({
        message: "Access forbidden: You are not authorized to view applicants for this job",
        success: false,
      });
    }

    return res.status(200).json({ job, success: true });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Recruiter: Update application status (Ownership Enforced)
// ======================================
export const updateStatus = async (req, res, next) => {
  try {
    const parseResult = applicationStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: "Status must be 'pending', 'accepted', or 'rejected'",
        success: false,
      });
    }

    const { status, feedback, interviewDetails } = parseResult.data;
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId).populate("job");

    if (!application) {
      return res.status(404).json({
        message: "Application not found",
        success: false,
      });
    }

    // IDOR Protection: verify logged in recruiter created the parent job
    if (application.job?.created_by?.toString() !== req.id) {
      return res.status(403).json({
        message: "Access forbidden: You cannot modify applicants for jobs you do not own",
        success: false,
      });
    }

    if (interviewDetails?.deleteMeeting || interviewDetails?.status === "cancelled") {
      application.interviewDetails = {
        date: "",
        time: "",
        meetingLink: "",
        notes: "",
        status: "cancelled",
      };
      if (status === "interview") {
        application.status = "shortlisted";
      } else {
        application.status = status;
      }
    } else if (interviewDetails?.status === "completed") {
      application.interviewDetails = {
        ...(application.interviewDetails?.toObject?.() || application.interviewDetails || {}),
        status: "completed",
      };
      application.status = status;
    } else {
      application.status = status;
    }

    if (feedback !== undefined) {
      application.feedback = feedback;
    }

    if (application.status === "interview" && !interviewDetails?.deleteMeeting && interviewDetails?.status !== "cancelled") {
      let details = interviewDetails || application.interviewDetails || {};
      let meetingLink = details.meetingLink;

      // Auto-generate Google Calendar & Google Meet link if empty
      if (!meetingLink || meetingLink.trim() === "") {
        try {
          const recruiter = await User.findById(req.id).select("fullname email");
          const candidateApp = await Application.findById(applicationId).populate("applicant", "fullname email");

          let startDateTime = new Date(`${details.date || new Date().toISOString().split("T")[0]} ${details.time || "11:00 AM"}`);
          if (isNaN(startDateTime.getTime())) {
            startDateTime = new Date(Date.now() + 86400000);
          }

          const calendarResult = await createCalendarInterview({
            title: `Technical Interview: ${candidateApp.applicant?.fullname || "Candidate"} | ${application.job?.title || "Role"}`,
            description: `NexHire Interview for ${application.job?.title || "Role"}.\nNotes: ${feedback || details.notes || "None"}`,
            startDateTime,
            durationMinutes: 45,
            recruiterEmail: recruiter?.email || "recruiter@nexhire.com",
            recruiterName: recruiter?.fullname || "Recruiter",
            candidateEmail: candidateApp.applicant?.email || "candidate@nexhire.com",
            candidateName: candidateApp.applicant?.fullname || "Candidate",
          });

          details = {
            ...details,
            date: details.date || startDateTime.toISOString().split("T")[0],
            time: details.time || "11:00 AM IST",
            meetingLink: calendarResult.meetingLink,
            calendarEventId: calendarResult.calendarEventId,
            status: "scheduled",
          };
        } catch (calErr) {
          console.warn("[ApplicationController] Auto calendar creation error:", calErr.message);
          const defaultMeetCode = `${Math.random().toString(36).substring(2, 5)}-${Math.random().toString(36).substring(2, 6)}-${Math.random().toString(36).substring(2, 5)}`;
          details.meetingLink = `https://meet.google.com/${defaultMeetCode}`;
          details.status = "scheduled";
        }
      }
      application.interviewDetails = details;
    } else if (interviewDetails && !interviewDetails.deleteMeeting && interviewDetails.status !== "cancelled") {
      application.interviewDetails = interviewDetails;
    }

    application.reviewedAt = new Date();

    await application.save();

    // Emit event: triggers automated candidate milestone email (shortlisted, offer, interview, rejected, etc.)
    emitEvent(EVENT_TYPES.APPLICATION_STATUS_CHANGED, {
      entityType: "application",
      entityId: application._id,
      actorId: req.id,
      metadata: {
        status,
        feedback: application.feedback,
        interviewDetails: application.interviewDetails,
      },
    });

    // Notify candidate & recruiter
    const relatedJobId = application.job?._id || application.job;
    if (status === "interview") {
      const meetLink = application.interviewDetails?.meetingLink;
      const iDate = application.interviewDetails?.date || "an upcoming date";
      const iTime = application.interviewDetails?.time ? `at ${application.interviewDetails.time}` : "";

      // In-app notification for candidate
      createNotification({
        recipient: application.applicant,
        type: "interview_scheduled",
        title: `🗓️ Interview Scheduled: ${application.job?.title || "Role"}`,
        message: `Your technical interview has been scheduled for ${iDate} ${iTime}. Google Meet: ${meetLink || "Check email"}`,
        link: `/applied?jobId=${relatedJobId}&appId=${application._id}`,
      });

      // In-app notification for recruiter
      createNotification({
        recipient: req.id,
        type: "interview_scheduled",
        title: `🗓️ Interview Confirmed: Candidate Scheduled`,
        message: `Interview confirmed for "${application.job?.title || "Role"}" on ${iDate} ${iTime}. Google Meet: ${meetLink || "Check email"}`,
        link: `/recruiter-jobs?jobId=${relatedJobId}&appId=${application._id}`,
      });
    } else {
      const notifType = status === "hired" ? "hired" : "status_update";
      const notifTitle = `Application Status: ${status.toUpperCase()}`;
      const notifMsg = feedback || `Your application for "${application.job?.title || "Role"}" is now ${status}.`;

      createNotification({
        recipient: application.applicant,
        type: notifType,
        title: notifTitle,
        message: notifMsg,
        link: `/applied?jobId=${relatedJobId}&appId=${application._id}`,
      });
    }

    return res.status(200).json({
      message: `Application marked as ${status}`,
      status: application.status,
      feedback: application.feedback,
      interviewDetails: application.interviewDetails,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Recruiter: Securely Download Candidate Resume
// ======================================
export const downloadResume = async (req, res, next) => {
  try {
    const applicationId = req.params.id;

    const application = await Application.findById(applicationId)
      .populate("job")
      .populate("applicant", "fullname profile");

    if (!application) {
      return res.status(404).json({ message: "Application not found", success: false });
    }

    // Ownership check: must be the recruiter who posted the job
    if (application.job?.created_by?.toString() !== req.id) {
      return res.status(403).json({
        message: "Forbidden: You do not have permission to download this resume",
        success: false,
      });
    }

    const resumeUrl = application.applicant?.profile?.resume;
    if (!resumeUrl) {
      return res.status(404).json({ message: "Candidate has not uploaded a resume yet", success: false });
    }

    // Cloudinary might deliver PDF either as /image/upload or /raw/upload
    // If the URL contains /image/upload/, replace or ensure proper extension
    let targetUrl = resumeUrl;
    if (targetUrl.includes("/image/upload/") && !targetUrl.endsWith(".pdf")) {
      targetUrl = targetUrl.replace("/image/upload/", "/image/upload/fl_attachment/");
    }

    const response = await fetch(targetUrl);
    if (!response.ok) {
      // Direct redirect as robust fallback
      return res.redirect(resumeUrl);
    }

    const filename = application.applicant?.profile?.resumeOriginalname || `${application.applicant.fullname.replace(/\s+/g, "_")}_Resume.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    const arrayBuffer = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuffer));
  } catch (error) {
    next(error);
  }
};

// ======================================
// Candidate: Get Application Analytics & Timeline Stats
// ======================================
export const getCandidateStats = async (req, res, next) => {
  try {
    const userId = req.id;

    const applications = await Application.find({ applicant: userId })
      .sort({ createdAt: -1 })
      .populate({
        path: "job",
        select: "title salary location jobType requirements company",
        populate: {
          path: "company",
          select: "companyName logo",
        },
      });

    const totalApplications = applications.length;
    const statusCounts = {
      pending: 0,
      shortlisted: 0,
      interview: 0,
      accepted: 0,
      hired: 0,
      rejected: 0,
    };

    let scheduledInterviews = 0;
    applications.forEach((app) => {
      const s = (app.status || "pending").toLowerCase();
      if (statusCounts[s] !== undefined) {
        statusCounts[s]++;
      }
      if (app.interviewDetails?.date || s === "interview") {
        scheduledInterviews++;
      }
    });

    const activeApplications = totalApplications - statusCounts.rejected - statusCounts.hired;
    const responseCount = totalApplications - statusCounts.pending;
    const responseRate = totalApplications > 0 ? Math.round((responseCount / totalApplications) * 100) : 0;
    const successRate = totalApplications > 0 ? Math.round(((statusCounts.accepted + statusCounts.hired) / totalApplications) * 100) : 0;

    return res.status(200).json({
      success: true,
      stats: {
        totalApplications,
        activeApplications,
        statusCounts,
        scheduledInterviews,
        responseRate,
        successRate,
      },
      recentApplications: applications.slice(0, 5),
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Recruiter: Get Hiring Funnel & Dashboard Stats
// ======================================
export const getRecruiterStats = async (req, res, next) => {
  try {
    const recruiterId = req.id;

    // Get all jobs created by this recruiter
    const jobs = await Job.find({ created_by: recruiterId }).select("title status expiresAt applications createdAt position");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ job: { $in: jobIds } })
      .populate("applicant", "fullname email profile")
      .populate("job", "title location");

    const totalApplicants = applications.length;
    const funnel = {
      pending: 0,
      shortlisted: 0,
      interview: 0,
      accepted: 0,
      hired: 0,
      rejected: 0,
    };

    applications.forEach((app) => {
      const s = (app.status || "pending").toLowerCase();
      if (funnel[s] !== undefined) funnel[s]++;
    });

    const activeJobs = jobs.filter(
      (j) => j.status === "published" && (!j.expiresAt || new Date(j.expiresAt) > new Date())
    );
    const activeJobsCount = activeJobs.length;
    const totalHired = funnel.hired + funnel.accepted;
    const interviewCount = funnel.interview;

    return res.status(200).json({
      success: true,
      stats: {
        activeJobsCount,
        totalApplicants,
        totalHired,
        interviewCount,
        funnel,
      },
      recentApplicants: applications.slice(0, 8),
    });
  } catch (error) {
    next(error);
  }
};

// ======================================
// Recruiter: Bulk Update Application Status
// ======================================
export const bulkUpdateStatus = async (req, res, next) => {
  try {
    const parseResult = bulkApplicationStatusSchema.safeParse(req.body);
    if (!parseResult.success) {
      return res.status(400).json({
        message: parseResult.error.errors[0]?.message || "Validation failed",
        success: false,
      });
    }

    const { applicationIds, status, feedback } = parseResult.data;
    const recruiterId = req.id;

    // Find all applications and verify ownership of jobs
    const applications = await Application.find({ _id: { $in: applicationIds } }).populate("job");

    const validIds = [];
    for (const app of applications) {
      if (app.job?.created_by?.toString() === recruiterId) {
        validIds.push(app._id);
      }
    }

    if (validIds.length === 0) {
      return res.status(403).json({
        message: "No authorized applications found to update",
        success: false,
      });
    }

    const updatePayload = {
      status,
      reviewedAt: new Date(),
    };
    if (feedback !== undefined) {
      updatePayload.feedback = feedback;
    }

    await Application.updateMany(
      { _id: { $in: validIds } },
      { $set: updatePayload }
    );

    // Emit event and send in-app notification for each application
    for (const validId of validIds) {
      emitEvent(EVENT_TYPES.APPLICATION_STATUS_CHANGED, {
        entityType: "application",
        entityId: validId,
        actorId: recruiterId,
        metadata: { status, feedback },
      });

      const targetApp = applications.find((a) => a._id.toString() === validId.toString());
      if (targetApp?.applicant) {
        createNotification({
          recipient: targetApp.applicant,
          type: status === "hired" ? "hired" : "status_update",
          title: `Application Status: ${status.toUpperCase()}`,
          message: feedback || `Your application for "${targetApp.job?.title || "Role"}" is now ${status}.`,
          link: `/applied?jobId=${targetApp.job?._id || targetApp.job}&appId=${targetApp._id}`,
        }).catch((err) => console.warn("[BulkStatus] Notification error:", err.message));
      }
    }

    return res.status(200).json({
      message: `Successfully updated ${validIds.length} candidate(s) to ${status}`,
      updatedCount: validIds.length,
      success: true,
    });
  } catch (error) {
    next(error);
  }
};