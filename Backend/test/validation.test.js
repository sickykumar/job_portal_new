import { describe, it, expect } from "vitest";
import {
  registerSchema,
  loginSchema,
  jobPostSchema,
  applicationStatusSchema,
  bulkApplicationStatusSchema,
  contactSchemaValidator,
  contactResolutionValidator,
} from "../utils/validators.js";
import { Contact } from "../models/contact.model.js";

describe("Validation Schemas", () => {
  it("should validate candidate registration payload without Aadhaar and PAN", () => {
    const candidateData = {
      fullname: "Alex Doe",
      email: "alex@example.com",
      phoneNumber: "+1-555-0199",
      password: "securepassword123",
      role: "student",
    };
    const result = registerSchema.safeParse(candidateData);
    expect(result.success).toBe(true);
  });

  it("should validate recruiter registration with valid Aadhaar and PAN", () => {
    const recruiterData = {
      fullname: "Priya HR",
      email: "priya@company.com",
      phoneNumber: "+1-555-0199",
      password: "securepassword123",
      adharcard: "1234 5678 9012",
      pancard: "ABCDE1234F",
      role: "recruiter",
    };
    const result = registerSchema.safeParse(recruiterData);
    expect(result.success).toBe(true);
  });

  it("should reject recruiter registration if Aadhaar or PAN is missing", () => {
    const recruiterDataMissingKyc = {
      fullname: "Priya HR",
      email: "priya@company.com",
      phoneNumber: "+1-555-0199",
      password: "securepassword123",
      role: "recruiter",
    };
    const result = registerSchema.safeParse(recruiterDataMissingKyc);
    expect(result.success).toBe(false);
  });

  it("should reject registration with invalid email", () => {
    const invalidData = {
      fullname: "Alex Doe",
      email: "invalid-email",
      phoneNumber: "1234567890",
      password: "password123",
      adharcard: "12345678",
      pancard: "ABCDE",
      role: "student",
    };
    const result = registerSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it("should reject job post missing required fields", () => {
    const badJob = {
      title: "Dev",
      salary: "50k",
    };
    const result = jobPostSchema.safeParse(badJob);
    expect(result.success).toBe(false);
  });

  it("should validate enhanced recruitment pipeline status with interview details", () => {
    const statusPayload = {
      status: "interview",
      feedback: "Strong background in React 19 and distributed services",
      interviewDetails: {
        date: "2026-10-15",
        time: "14:00 UTC",
        meetingLink: "https://meet.google.com/xyz-abc-def",
        notes: "Architecture and systems design round",
      },
    };
    const result = applicationStatusSchema.safeParse(statusPayload);
    expect(result.success).toBe(true);
  });

  it("should validate bulk application status update", () => {
    const bulkPayload = {
      applicationIds: ["507f1f77bcf86cd799439011", "507f1f77bcf86cd799439012"],
      status: "shortlisted",
      feedback: "Selected for interview phase",
    };
    const result = bulkApplicationStatusSchema.safeParse(bulkPayload);
    expect(result.success).toBe(true);
  });

  it("should validate a valid contact form submission", () => {
    const contactData = {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Support Inquiry",
      category: "technical",
      message: "I need help with my candidate profile verification.",
    };
    const result = contactSchemaValidator.safeParse(contactData);
    expect(result.success).toBe(true);
  });

  it("should reject contact form submission if message is too short", () => {
    const contactData = {
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Support Inquiry",
      category: "technical",
      message: "Hi",
    };
    const result = contactSchemaValidator.safeParse(contactData);
    expect(result.success).toBe(false);
  });

  it("should instantiate a Contact document with generated ticketId without next() error", () => {
    const doc = new Contact({
      name: "Jane Doe",
      email: "jane@example.com",
      subject: "Support Inquiry",
      category: "general",
      message: "This is a detailed message testing ticketId generation.",
    });
    expect(doc.ticketId).toBeDefined();
    expect(doc.ticketId).toMatch(/^NXH-/);
  });

  it("should disallow admin registration in registerSchema but allow admin in loginSchema", () => {
    const adminRegisterData = {
      fullname: "Super Admin",
      email: "admin@nexhire.com",
      phoneNumber: "+1-555-9999",
      password: "adminpassword123",
      role: "admin",
    };
    // Admin public registration is disabled
    expect(registerSchema.safeParse(adminRegisterData).success).toBe(false);

    // Admin login is permitted
    const adminLoginData = {
      email: "admin@nexhire.com",
      password: "adminpassword123",
      role: "admin",
    };
    expect(loginSchema.safeParse(adminLoginData).success).toBe(true);
  });

  it("should validate a support ticket resolution payload", () => {
    const validResolution = {
      status: "resolved",
      resolutionNotes: "We have reviewed and verified your account. Your profile is now active.",
    };
    expect(contactResolutionValidator.safeParse(validResolution).success).toBe(true);

    const invalidResolution = {
      status: "unknown_status",
      resolutionNotes: "ok",
    };
    expect(contactResolutionValidator.safeParse(invalidResolution).success).toBe(false);
  });

  it("should create an Otp document with valid TTL expiry date", async () => {
    const { Otp } = await import("../models/otp.model.js");
    const otpDoc = new Otp({
      email: "candidate@example.com",
      otp: "492815",
      purpose: "login",
      expiresAt: new Date(Date.now() + 600000),
    });
    expect(otpDoc.otp).toBe("492815");
    expect(otpDoc.purpose).toBe("login");
    expect(otpDoc.expiresAt.getTime()).toBeGreaterThan(Date.now());
  });

  it("should have correct health payload format with status ok, timestamp, and uptime", () => {
    const payload = {
      success: true,
      status: "ok",
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
    };
    expect(payload.status).toBe("ok");
    expect(payload.success).toBe(true);
    expect(typeof payload.uptime).toBe("number");
    expect(new Date(payload.timestamp).toString()).not.toBe("Invalid Date");
  });

  it("should respond to GET /health with status 200 and json payload via app.js", async () => {
    const request = (await import("supertest")).default;
    const { default: app } = await import("../app.js");
    const response = await request(app).get("/health");
    expect(response.status).toBe(200);
    expect(response.body.status).toBe("ok");
    expect(response.body.success).toBe(true);
    expect(typeof response.body.uptime).toBe("number");
    expect(response.body.timestamp).toBeDefined();
  }, 30000);

  it("should generate login security alert email with session telemetry and warnings", async () => {
    const { loginSecurityAlertHTML } = await import("../emailTemplates/index.js");
    const html = loginSecurityAlertHTML({
      fullname: "John Doe",
      email: "john@example.com",
      role: "student",
      ipAddress: "192.168.1.50",
      userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
    });
    expect(html).toContain("Security Alert: New Sign-In");
    expect(html).toContain("john@example.com");
    expect(html).toContain("192.168.1.50");
    expect(html).toContain("Mozilla/5.0");
    expect(html).toContain("Candidate / Student");
  });

  it("should generate registration greeting email with candidate and recruiter recommendations", async () => {
    const { registrationWelcomeHTML } = await import("../emailTemplates/index.js");
    
    // Test Candidate Recommendations
    const candidateHtml = registrationWelcomeHTML({
      fullname: "Rahul Verma",
      email: "rahul@example.com",
      role: "student",
    });
    expect(candidateHtml).toContain("Welcome to NexHire, Rahul Verma!");
    expect(candidateHtml).toContain("Upload & Benchmark Your Resume with AI");
    expect(candidateHtml).toContain("Discover High-Growth Tech Jobs");
    expect(candidateHtml).toContain("Compete in Hackathons & Quizzes");

    // Test Recruiter Recommendations
    const recruiterHtml = registrationWelcomeHTML({
      fullname: "Ananya Sharma",
      email: "ananya@techcorp.com",
      role: "recruiter",
    });
    expect(recruiterHtml).toContain("Welcome to NexHire, Ananya Sharma!");
    expect(recruiterHtml).toContain("Set Up Your Verified Company Profile");
    expect(recruiterHtml).toContain("Post Your First Job Opening with AI");
    expect(recruiterHtml).toContain("Manage Talent via 5-Stage Kanban");
  });
});




