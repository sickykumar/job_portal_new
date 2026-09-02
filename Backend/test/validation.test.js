import { describe, it, expect } from "vitest";
import { registerSchema, loginSchema, jobPostSchema } from "../utils/validators.js";

describe("Validation Schemas", () => {
  it("should validate a valid registration payload", () => {
    const validData = {
      fullname: "Alex Doe",
      email: "alex@example.com",
      phoneNumber: "+1-555-0199",
      password: "securepassword123",
      adharcard: "1234-5678-9012",
      pancard: "ABCDE1234F",
      role: "student",
    };
    const result = registerSchema.safeParse(validData);
    expect(result.success).toBe(true);
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
});
