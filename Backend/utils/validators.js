import { z } from "zod";

export const registerSchema = z
  .object({
    fullname: z.string().trim().min(2, "Full name must be at least 2 characters"),
    email: z.string().trim().email("Invalid email address"),
    phoneNumber: z.string().trim().regex(/^[0-9+ -]{7,15}$/, "Invalid phone number format"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    adharcard: z.string().trim().optional().or(z.literal("")),
    pancard: z.string().trim().optional().or(z.literal("")),
    role: z.enum(["student", "recruiter", "Student", "Recruiter"], {
      errorMap: () => ({ message: "Role must be Candidate or Recruiter (Admin registration disabled)" }),
    }),
  })
  .superRefine((data, ctx) => {
    const roleLower = (data.role || "").toLowerCase();
    if (roleLower === "recruiter") {
      const cleanAadhaar = (data.adharcard || "").replace(/\s+/g, "");
      if (!cleanAadhaar || cleanAadhaar.length < 12) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["adharcard"],
          message: "Valid 12-digit Aadhaar number is required for recruiter accounts",
        });
      }
      const cleanPAN = (data.pancard || "").trim();
      if (!cleanPAN || cleanPAN.length < 10) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["pancard"],
          message: "Valid 10-character PAN card is required for recruiter accounts",
        });
      }
    }
  });

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "recruiter", "admin", "Student", "Recruiter", "Admin"]),
});

export const updateProfileSchema = z.object({
  fullname: z.string().trim().min(2).optional(),
  email: z.string().trim().email().optional(),
  phoneNumber: z.string().trim().regex(/^[0-9+ -]{7,15}$/).optional(),
  bio: z.string().max(500).optional(),
  skills: z.string().optional(),
});

export const jobPostSchema = z.object({
  title: z.string().trim().min(3, "Title must be at least 3 characters"),
  description: z.string().trim().min(10, "Description must be at least 10 characters"),
  requirements: z.string().min(1, "Requirements are required"),
  salary: z.coerce.string().trim().min(1, "Salary is required"),
  location: z.string().trim().min(2, "Location is required"),
  jobType: z.string().trim().min(2, "Job Type is required"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  position: z.coerce.number().min(1, "Position must be at least 1"),
  companyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid company ID"),
  activeDays: z.coerce.number().min(1).max(365).optional().default(30),
});

export const companySchemaValidator = z.object({
  companyName: z.string().trim().min(2, "Company name must be at least 2 characters"),
  description: z.string().optional(),
  website: z.string().optional(),
  location: z.string().optional(),
});

export const companyUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  companyName: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  website: z.string().trim().optional(),
  location: z.string().trim().optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["pending", "under_review", "shortlisted", "interview", "accepted", "offer", "hired", "rejected"]),
  feedback: z.string().trim().max(1000).optional(),
  interviewDetails: z
    .object({
      date: z.string().optional(),
      time: z.string().optional(),
      meetingLink: z.string().optional(),
      notes: z.string().optional(),
      status: z.string().optional(),
      deleteMeeting: z.boolean().optional(),
    })
    .optional(),
});

export const bulkApplicationStatusSchema = z.object({
  applicationIds: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid application ID")).min(1, "At least one application must be selected"),
  status: z.enum(["pending", "under_review", "shortlisted", "interview", "accepted", "offer", "hired", "rejected"]),
  feedback: z.string().trim().max(1000).optional(),
});

export const contactSchemaValidator = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().trim().email("Please provide a valid email address"),
  subject: z.string().trim().min(3, "Subject must be at least 3 characters").max(200),
  category: z
    .enum([
      "general",
      "technical",
      "billing",
      "partnership",
      "bug_report",
      "feature_request",
      "account_issue",
    ])
    .default("general"),
  message: z.string().trim().min(10, "Message must be at least 10 characters long").max(5000),
});

export const contactResolutionValidator = z.object({
  status: z.enum(["pending", "in_progress", "resolved", "closed"]),
  resolutionNotes: z.string().trim().min(3, "Resolution notes must be at least 3 characters long"),
});
