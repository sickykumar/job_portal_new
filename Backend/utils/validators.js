import { z } from "zod";

export const registerSchema = z.object({
  fullname: z.string().trim().min(2, "Full name must be at least 2 characters"),
  email: z.string().trim().email("Invalid email address"),
  phoneNumber: z.string().trim().regex(/^[0-9+ -]{7,15}$/, "Invalid phone number format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  adharcard: z.string().trim().min(4, "Aadhaar / ID number is required"),
  pancard: z.string().trim().min(4, "PAN / Tax ID is required"),
  role: z.enum(["student", "recruiter", "Student", "Recruiter"]),
});

export const loginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  role: z.enum(["student", "recruiter", "Student", "Recruiter"]),
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
  salary: z.string().trim().min(1, "Salary is required"),
  location: z.string().trim().min(2, "Location is required"),
  jobType: z.string().trim().min(2, "Job Type is required"),
  experience: z.coerce.number().min(0, "Experience must be 0 or more"),
  position: z.coerce.number().min(1, "Position must be at least 1"),
  companyId: z.string().regex(/^[0-9a-fA-F]{24}$/, "Invalid company ID"),
});

export const companySchemaValidator = z.object({
  companyName: z.string().trim().min(2, "Company name must be at least 2 characters"),
});

export const companyUpdateSchema = z.object({
  name: z.string().trim().min(2).optional(),
  description: z.string().optional(),
  website: z.string().trim().url().or(z.literal("")).optional(),
  location: z.string().trim().optional(),
});

export const applicationStatusSchema = z.object({
  status: z.enum(["pending", "shortlisted", "interview", "accepted", "hired", "rejected"]),
  feedback: z.string().trim().max(1000).optional(),
  interviewDetails: z
    .object({
      date: z.string().optional(),
      time: z.string().optional(),
      meetingLink: z.string().optional(),
      notes: z.string().optional(),
    })
    .optional(),
});
