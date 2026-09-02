import { Job } from "../models/job.model.js";
import { Company } from "../models/company.model.js";
import { jobPostSchema } from "../utils/validators.js";

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
    });

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

    const query = {};

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