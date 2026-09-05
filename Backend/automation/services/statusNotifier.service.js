import { sendEmail } from "../../utils/emailService.js";
import { Application } from "../../models/application.model.js";

const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";

// Core reusable email card wrapper
const wrapHtml = ({ title, preheader, bodyContent, actionUrl, actionText }) => {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #080C14; color: #E2E8F0; margin: 0; padding: 24px 12px; }
    .card { max-width: 580px; margin: 0 auto; background: #0D1322; border: 1px solid #1E293B; border-radius: 18px; padding: 36px 28px; box-shadow: 0 20px 40px rgba(0,0,0,0.4); }
    .badge { display: inline-block; padding: 5px 12px; border-radius: 9999px; font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.05em; background: rgba(99, 102, 241, 0.15); color: #818CF8; border: 1px solid rgba(99, 102, 241, 0.3); margin-bottom: 16px; }
    h1 { color: #FFFFFF; font-size: 22px; margin: 0 0 14px 0; font-weight: 800; letter-spacing: -0.02em; }
    p { color: #94A3B8; font-size: 14px; line-height: 1.6; margin: 0 0 16px 0; }
    .highlight-box { background: #141C31; border: 1px solid #1E293B; border-radius: 12px; padding: 18px; margin: 20px 0; }
    .btn { display: inline-block; background: linear-gradient(135deg, #6366F1, #4F46E5); color: #FFFFFF !important; font-size: 13px; font-weight: 700; text-decoration: none; padding: 12px 26px; border-radius: 12px; box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35); }
    .footer { font-size: 11px; color: #64748B; margin-top: 32px; border-top: 1px solid #1E293B; padding-top: 18px; text-align: center; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <div class="card">
    <div class="badge">PathKhojo Automation</div>
    <h1>${title}</h1>
    ${bodyContent}
    ${
      actionUrl && actionText
        ? `<div style="margin: 26px 0; text-align: center;"><a href="${actionUrl}" class="btn">${actionText}</a></div>`
        : ""
    }
    <div class="footer">
      This is an automated system notification from PathKhojo Career Navigation Platform.<br>
      © ${new Date().getFullYear()} PathKhojo Inc. All rights reserved.
    </div>
  </div>
</body>
</html>`;
};

/**
 * Dispatch automated status email for an application milestone.
 */
export const dispatchApplicationStatusEmail = async ({
  applicationId,
  status,
  feedback = "",
  interviewDetails = null,
}) => {
  try {
    const application = await Application.findById(applicationId)
      .populate("applicant", "fullname email")
      .populate({
        path: "job",
        select: "title salary location company created_by",
        populate: [
          { path: "company", select: "companyName logo" },
          { path: "created_by", select: "fullname email" },
        ],
      });

    if (!application || !application.applicant?.email) {
      console.warn(`[StatusNotifier] Application ${applicationId} or applicant not found. Skipping.`);
      return;
    }

    const candidateName = application.applicant.fullname || "Candidate";
    const candidateEmail = application.applicant.email;
    const jobTitle = application.job?.title || "Role";
    const companyName = application.job?.company?.companyName || "Employer";

    let subject = "";
    let bodyContent = "";
    let actionText = "View Application Status";
    let actionUrl = `${clientUrl}/applied`;

    const normalizedStatus = (status || "").toLowerCase();

    switch (normalizedStatus) {
      case "pending":
      case "applied":
        subject = `Application Received: ${jobTitle} at ${companyName}`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Thank you for applying to the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>. Your submission has been securely delivered to the recruiting team.</p>
          <div class="highlight-box">
            <p style="margin:0 0 6px 0; color:#E2E8F0;"><strong>Application Summary:</strong></p>
            <p style="margin:0; font-size:13px; color:#94A3B8;">Position: ${jobTitle}<br>Company: ${companyName}<br>Submitted: ${new Date().toLocaleDateString()}</p>
          </div>
          <p>You can track the progress of your application in real-time inside your candidate dashboard.</p>
        `;
        break;

      case "under_review":
        subject = `Application Update: Your submission for ${jobTitle} is Under Review`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Good news! Your profile and resume for <strong>${jobTitle}</strong> at <strong>${companyName}</strong> are currently being actively reviewed by the engineering leadership team.</p>
          <p>We evaluate your hands-on project portfolio, architectural experience, and skillset against the team's roadmap. Expect to hear back regarding next steps soon.</p>
        `;
        break;

      case "shortlisted":
        subject = `🎉 Congratulations! You've been Shortlisted for ${jobTitle} at ${companyName}`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>We are excited to share that you have been <strong>shortlisted</strong> for the <strong>${jobTitle}</strong> opening at <strong>${companyName}</strong>!</p>
          <div class="highlight-box">
            <p style="margin:0; color:#10B981; font-weight:700;">Status: Shortlisted Candidate</p>
            <p style="margin:6px 0 0 0; font-size:13px; color:#94A3B8;">The hiring team was impressed by your skillset and experience. The recruiter will be scheduling your technical discussion shortly.</p>
          </div>
        `;
        break;

      case "interview":
        const meetingDate = interviewDetails?.date || application.interviewDetails?.date || "Upcoming Date";
        const meetingTime = interviewDetails?.time || application.interviewDetails?.time || "Scheduled Time";
        const meetingLink = interviewDetails?.meetingLink || application.interviewDetails?.meetingLink || "#";

        subject = `🎉 Congratulations! Interview Invitation: ${jobTitle} at ${companyName}`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <div class="highlight-box" style="background: linear-gradient(135deg, rgba(99,102,241,0.2), rgba(16,185,129,0.2)); border: 1px solid rgba(16,185,129,0.3); border-radius: 12px; padding: 16px; margin-bottom: 16px;">
            <p style="margin: 0 0 6px 0; color: #10B981; font-weight: 800; font-size: 16px;">🎉 Congratulations on Advancing to the Interview Round!</p>
            <p style="margin: 0; font-size: 13px; color: #E2E8F0; line-height: 1.5;">
              We are pleased to inform you that your profile for <strong>${jobTitle}</strong> was shortlisted by the hiring team at <strong>${companyName}</strong>. They were impressed by your background and would love to meet you for a technical discussion!
            </p>
          </div>
          <div class="highlight-box">
            <p style="margin:0 0 8px 0; color:#E2E8F0;"><strong>Interview Particulars:</strong></p>
            <p style="margin:0 0 4px 0; font-size:13px; color:#94A3B8;">📅 <strong>Date:</strong> ${meetingDate}</p>
            <p style="margin:0 0 4px 0; font-size:13px; color:#94A3B8;">⏰ <strong>Time:</strong> ${meetingTime}</p>
            <p style="margin:0; font-size:13px; color:#94A3B8;">🔗 <strong>Video Link:</strong> <a href="${meetingLink}" style="color:#6366F1;">Join Google Meet</a></p>
            ${feedback ? `<p style="margin:8px 0 0 0; font-size:12px; color:#CBD5E1;"><em>Notes from Recruiter: ${feedback}</em></p>` : ""}
          </div>
          <p>Please test your microphone, camera, and network connection 5 minutes prior to the scheduled meeting.</p>
        `;
        actionText = "Join Google Meet Interview";
        actionUrl = meetingLink;
        break;

      case "offer":
      case "accepted":
      case "hired":
        subject = `🌟 Job Offer: Welcome to ${companyName} (${jobTitle})!`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Congratulations! Following your successful interview rounds, <strong>${companyName}</strong> is delighted to officially select you for the <strong>${jobTitle}</strong> position!</p>
          <div class="highlight-box">
            <p style="margin:0; color:#10B981; font-weight:700;">Status: Offer Extended</p>
            <p style="margin:6px 0 0 0; font-size:13px; color:#94A3B8;">${feedback || "The recruiting team will reach out to you with formal compensation package details and onboarding instructions."}</p>
          </div>
        `;
        break;

      case "rejected":
        subject = `Update on your application for ${jobTitle} at ${companyName}`;
        bodyContent = `
          <p>Hi <strong>${candidateName}</strong>,</p>
          <p>Thank you for taking the time to apply and interview for the <strong>${jobTitle}</strong> position at <strong>${companyName}</strong>.</p>
          <p>While your qualifications are commendable, after careful consideration the team has decided to move forward with other candidates whose experience more closely matches their immediate roadmap.</p>
          ${
            feedback
              ? `<div class="highlight-box"><p style="margin:0 0 4px 0; font-size:13px; color:#E2E8F0;"><strong>Constructive Feedback:</strong></p><p style="margin:0; font-size:13px; color:#94A3B8;">${feedback}</p></div>`
              : ""
          }
          <p>We encourage you to explore other open roles on PathKhojo and wish you every success in your career journey.</p>
        `;
        actionText = "Explore Other Open Roles";
        actionUrl = `${clientUrl}/jobs`;
        break;

      default:
        subject = `Application Status Update: ${jobTitle}`;
        bodyContent = `<p>Hi ${candidateName},</p><p>Your application status has been updated to: <strong>${status}</strong>.</p>`;
    }

    const html = wrapHtml({
      title: subject,
      preheader: `Update regarding your ${jobTitle} application`,
      bodyContent,
      actionUrl,
      actionText,
    });

    await sendEmail({
      to: candidateEmail,
      subject,
      html,
    });

    // Also send confirmation copy to Recruiter if interview was scheduled
    if (normalizedStatus === "interview" && application.job?.created_by?.email) {
      const recruiterEmail = application.job.created_by.email;
      const recruiterName = application.job.created_by.fullname || "Hiring Lead";
      const recruiterSubject = `🗓️ Interview Scheduled (Recruiter Copy): ${candidateName} for ${jobTitle}`;
      const recruiterHtml = wrapHtml({
        title: recruiterSubject,
        preheader: `Interview confirmed with ${candidateName} for ${jobTitle}`,
        bodyContent: `
          <p>Hi <strong>${recruiterName}</strong>,</p>
          <p>You have scheduled an interview with <strong>${candidateName}</strong> for <strong>${jobTitle}</strong>.</p>
          <div class="highlight-box">
            <p style="margin:0 0 8px 0; color:#E2E8F0;"><strong>Interview Particulars:</strong></p>
            <p style="margin:0 0 4px 0; font-size:13px; color:#94A3B8;">👤 <strong>Candidate:</strong> ${candidateName} (${candidateEmail})</p>
            <p style="margin:0 0 4px 0; font-size:13px; color:#94A3B8;">📅 <strong>Date:</strong> ${interviewDetails?.date || application.interviewDetails?.date || "Scheduled Date"}</p>
            <p style="margin:0 0 4px 0; font-size:13px; color:#94A3B8;">⏰ <strong>Time:</strong> ${interviewDetails?.time || application.interviewDetails?.time || "Scheduled Time"}</p>
            <p style="margin:0; font-size:13px; color:#94A3B8;">🔗 <strong>Video Link:</strong> <a href="${interviewDetails?.meetingLink || application.interviewDetails?.meetingLink || "#"}" style="color:#6366F1;">Join Google Meet</a></p>
          </div>
          <p>Please test your audio/video and join 5 minutes prior to the scheduled start time.</p>
        `,
        actionUrl: interviewDetails?.meetingLink || application.interviewDetails?.meetingLink || `${clientUrl}/recruiter-jobs`,
        actionText: "Launch Google Meet",
      });

      await sendEmail({
        to: recruiterEmail,
        subject: recruiterSubject,
        html: recruiterHtml,
      }).catch((err) => console.warn("[StatusNotifier] Recruiter email warning:", err.message));
    }

    console.log(`[StatusNotifier] Delivered ${normalizedStatus} email to ${candidateEmail}`);
  } catch (error) {
    console.error("[StatusNotifier] Failed to send status email:", error.message);
    throw error;
  }
};
