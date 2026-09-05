import { JobAlert } from "../models/jobAlert.model.js";
import { User } from "../models/user.model.js";
import { sendEmail } from "./emailService.js";
import { jobAlertEmailTemplate } from "../emailTemplates/index.js";

/**
 * Dispatches automated job alert emails in the background to matching candidate subscribers
 * Designed to be completely pluggable & non-blocking.
 */
export const dispatchJobAlertsForNewJob = async (job, company) => {
  try {
    if (!job) return;

    // Build search tokens from job title and requirements
    const jobTokens = [
      job.title,
      job.jobType,
      job.location,
      ...(job.requirements || []),
    ]
      .join(" ")
      .toLowerCase();

    // Query active alerts
    const activeAlerts = await JobAlert.find({ isActive: true }).populate("userId", "fullname email");

    if (!activeAlerts || activeAlerts.length === 0) {
      return;
    }

    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

    for (const alert of activeAlerts) {
      // Check keyword match
      let isMatch = false;

      // 1. Check keywords
      if (alert.keywords && alert.keywords.length > 0) {
        isMatch = alert.keywords.some((kw) => kw && jobTokens.includes(kw.toLowerCase().trim()));
      }

      // 2. Check title substring match
      if (!isMatch && alert.title) {
        const titleWords = alert.title.toLowerCase().split(/\s+/);
        isMatch = titleWords.some((w) => w.length > 2 && jobTokens.includes(w));
      }

      // 3. Location match (if specified and not "Any")
      if (
        isMatch &&
        alert.location &&
        alert.location !== "Any Location" &&
        alert.location.toLowerCase() !== "any"
      ) {
        if (!job.location.toLowerCase().includes(alert.location.toLowerCase())) {
          // If strict location doesn't match, ignore unless job is Remote
          if (!job.location.toLowerCase().includes("remote")) {
            isMatch = false;
          }
        }
      }

      if (isMatch) {
        const recipientEmail = alert.email || alert.userId?.email;
        const candidateName = alert.userId?.fullname || "Candidate";

        if (!recipientEmail) continue;

        // Dispatch email asynchronously
        sendEmail({
          to: recipientEmail,
          subject: `⚡ New Matching Job Alert: ${job.title} at ${company?.companyName || "Top Company"}`,
          html: jobAlertEmailTemplate({
            candidateName,
            alertTitle: alert.title,
            jobTitle: job.title,
            companyName: company?.companyName || "Confidential",
            companyLogo: company?.logo || "",
            location: job.location,
            jobType: job.jobType,
            salary: job.salary,
            requirements: job.requirements || [],
            jobId: job._id.toString(),
            clientUrl,
          }),
        }).catch((err) => console.error(`[Job Alert Notify] Failed to send to ${recipientEmail}:`, err.message));

        // Update alert stats
        await JobAlert.findByIdAndUpdate(alert._id, {
          $inc: { matchesCount: 1 },
          lastAlertSentAt: new Date(),
        }).catch(() => {});
      }
    }
  } catch (error) {
    console.error("[Job Alert Notifier Error]:", error.message);
  }
};
