import { describe, it, expect } from "vitest";
import { generateJobHash } from "../automation/services/duplicateDetector.service.js";
import { generateIcsContent } from "../automation/services/googleCalendar.service.js";
import { EVENT_TYPES, AUTOMATION_JOB_TYPES } from "../automation/events/eventTypes.js";

describe("Automation System Suite", () => {
  describe("Job Duplicate Hash Generation", () => {
    it("should generate deterministic hash for identical attributes", () => {
      const job1 = {
        title: "Senior Full Stack Engineer",
        companyId: "65f01234567890abcdef1234",
        location: "Bengaluru, India",
        description: "We are looking for a senior full stack developer...",
      };

      const job2 = {
        title: "  senior full stack engineer  ",
        companyId: "65f01234567890abcdef1234",
        location: "bengaluru, india",
        description: "We are looking for a senior full stack developer...",
      };

      const hash1 = generateJobHash(job1);
      const hash2 = generateJobHash(job2);

      expect(hash1).toBe(hash2);
      expect(typeof hash1).toBe("string");
      expect(hash1.length).toBe(64); // SHA-256 hex length
    });

    it("should generate different hashes for distinct roles", () => {
      const hashA = generateJobHash({
        title: "React Developer",
        companyId: "65f01234567890abcdef1234",
        location: "Remote",
        description: "React role",
      });

      const hashB = generateJobHash({
        title: "DevOps Engineer",
        companyId: "65f01234567890abcdef1234",
        location: "Remote",
        description: "DevOps role",
      });

      expect(hashA).not.toBe(hashB);
    });
  });

  describe("Google Calendar & iCalendar (.ics) Generation", () => {
    it("should generate valid RFC 5545 iCalendar content with meeting link and alarms", () => {
      const ics = generateIcsContent({
        uid: "test-uid-12345@nexhire.com",
        summary: "Technical Discussion: John Doe | Software Engineer",
        description: "Round 1 Technical Architecture Interview",
        location: "https://meet.google.com/abc-defg-hij",
        startDate: new Date("2026-09-10T10:00:00.000Z"),
        endDate: new Date("2026-09-10T10:45:00.000Z"),
        organizerEmail: "recruiter@techfirm.com",
        organizerName: "Jane Smith",
        attendeeEmail: "john.doe@example.com",
        attendeeName: "John Doe",
      });

      expect(ics).toContain("BEGIN:VCALENDAR");
      expect(ics).toContain("VERSION:2.0");
      expect(ics).toContain("SUMMARY:Technical Discussion: John Doe | Software Engineer");
      expect(ics).toContain("LOCATION:https://meet.google.com/abc-defg-hij");
      expect(ics).toContain("TRIGGER:-PT24H");
      expect(ics).toContain("TRIGGER:-PT1H");
      expect(ics).toContain("END:VCALENDAR");
    });
  });

  describe("Event Constants & Enums", () => {
    it("should have all required platform event types", () => {
      expect(EVENT_TYPES.JOB_CREATED).toBe("JOB_CREATED");
      expect(EVENT_TYPES.APPLICATION_CREATED).toBe("APPLICATION_CREATED");
      expect(EVENT_TYPES.APPLICATION_STATUS_CHANGED).toBe("APPLICATION_STATUS_CHANGED");
      expect(EVENT_TYPES.RESUME_UPLOADED).toBe("RESUME_UPLOADED");
      expect(EVENT_TYPES.INTERVIEW_SCHEDULED).toBe("INTERVIEW_SCHEDULED");
      expect(EVENT_TYPES.JOB_EXPIRED).toBe("JOB_EXPIRED");
    });

    it("should have all required automation job types", () => {
      expect(AUTOMATION_JOB_TYPES.ANALYZE_JOB).toBe("ANALYZE_JOB");
      expect(AUTOMATION_JOB_TYPES.PROCESS_RESUME).toBe("PROCESS_RESUME");
      expect(AUTOMATION_JOB_TYPES.SCREEN_APPLICATION).toBe("SCREEN_APPLICATION");
      expect(AUTOMATION_JOB_TYPES.SEND_STATUS_EMAIL).toBe("SEND_STATUS_EMAIL");
    });
  });
});
