import { Application } from "../models/application.model.js";
import { Job } from "../models/job.model.js";
import { applicationStatusSchema } from "../utils/validators.js";

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

    application.status = status;
    if (feedback !== undefined) {
      application.feedback = feedback;
    }
    if (interviewDetails) {
      application.interviewDetails = interviewDetails;
    }
    application.reviewedAt = new Date();

    await application.save();

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